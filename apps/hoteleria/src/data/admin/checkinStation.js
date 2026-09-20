// ---------------------------------------------------------------------------
// H26 — Check-in station model (pure, framework-free).
//
// A single check-in flow is shared by two actors:
//   - the GUEST (self-service, from the portal): fewer, guided steps
//   - the RECEPTIONIST (from the admin): every step, free editing
//
// The wizard state ("station data") lives embedded in the reservation
// (`reservation.station`) inside the shared reservations store, so a guest can
// start online and reception can RESUME exactly where they left off.
//
// Everything here is pure so it can be unit-tested without React. UI labels are
// resolved at render time via i18n keys returned from `validateStationStep`.
// ---------------------------------------------------------------------------

// Stable step ids. Visible labels are resolved via t(`station.steps.<id>`).
export const STATION_STEPS = [
  'identify',   // reception only — confirm which reservation we're serving
  'documents',  // id document + photo (mock upload) + nationality + birth date
  'guests',     // accompanying guests (only when reservation.guests > 1)
  'room',       // assign / confirm a specific room of the booked type
  'payment',    // method / guarantee / pre-authorization (mock)
  'signature',  // digital signature (canvas) + policy acceptance
  'keys',       // issue key cards + optional mobile key
  'confirm',    // recap → checked-in + issue digital key
]

// Reuse the H16 id vocabulary so both flows speak the same language.
export const DOCUMENT_TYPES = ['passport', 'national-id', 'driver-license', 'other']

// Payment / guarantee methods (ids → t(`station.paymentMethods.<id>`)).
export const PAYMENT_METHODS = ['card', 'paid', 'desk']

// Arrival windows (shared with H16 vocabulary).
export const ARRIVAL_WINDOWS = ['before12', 'w12_15', 'w15_18', 'w18_21', 'after21']

export const MIN_KEY_CARDS = 1
export const MAX_KEY_CARDS = 4

// --------------------------------------------------------------------------
// Step composition — mode aware.
//   mode: 'guest' | 'reception'
//   guests: number of people on the reservation
// The "identify" step only exists for reception; "guests" only when >1 person.
// --------------------------------------------------------------------------
export function buildSteps({ mode = 'reception', guests = 1 } = {}) {
  const steps = []
  if (mode === 'reception') steps.push('identify')
  steps.push('documents')
  if ((guests || 1) > 1) steps.push('guests')
  steps.push('room')
  steps.push('payment')
  steps.push('signature')
  steps.push('keys')
  steps.push('confirm')
  return steps
}

// Balance still owed on a reservation (never negative).
export function balanceDue(reservation) {
  if (!reservation) return 0
  const total = Number(reservation.totalAmount) || 0
  const paid = Number(reservation.amountPaid) || 0
  return Math.max(0, total - paid)
}

// A fresh station form, pre-filled from whatever the reservation already knows
// (identity from the booking, room from the assignment, balance for the
// pre-auth). Companions are sized to the party.
export function blankStationData(reservation) {
  const r = reservation || {}
  const companionCount = Math.max(0, (r.guests || 1) - 1)
  const alreadyPaid = r.paymentStatus === 'paid'
  return {
    // documents
    documentType: r.documentType || 'passport',
    documentNumber: r.documentNumber || '',
    nationality: r.nationality || '',
    birthDate: r.birthDate || '',
    documentPhoto: null, // data-url (mock upload)
    // companions
    companions: Array.from({ length: companionCount }, () => ({
      fullName: '',
      documentType: 'passport',
      documentNumber: '',
    })),
    // room
    assignedRoomId: r.roomId || null,
    assignedRoomNumber: r.roomNumber || null,
    floorPreference: 'any',
    // payment / guarantee
    payment: {
      method: alreadyPaid ? 'paid' : 'card',
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      preauthAmount: balanceDue(r),
    },
    // signature
    signature: null, // data-url of the drawn signature
    acceptPolicies: false,
    // keys
    keyCards: 2,
    mobileKey: true,
    // misc
    arrival: r.arrival || 'w15_18',
    specialRequests: r.specialRequests || '',
    // progress bookkeeping (which steps the actor has already passed)
    completedSteps: [],
    lastUpdatedBy: null, // 'guest' | 'reception'
    lastUpdatedAt: null,
  }
}

// Normalize a possibly-partial persisted station blob against a reservation so
// the wizard always has a complete shape to work with (older saves, new fields).
export function hydrateStationData(reservation, saved) {
  const base = blankStationData(reservation)
  if (!saved || typeof saved !== 'object') return base
  const companions = Array.isArray(saved.companions) ? saved.companions : []
  const wanted = base.companions.length
  const merged = Array.from({ length: wanted }, (_, i) => ({
    ...base.companions[i],
    ...(companions[i] || {}),
  }))
  return {
    ...base,
    ...saved,
    payment: { ...base.payment, ...(saved.payment || {}) },
    companions: merged,
    completedSteps: Array.isArray(saved.completedSteps) ? saved.completedSteps : [],
  }
}

// Minimal luhn-free card sanity: digits only, 13-19 long.
const looksLikeCard = (value) => {
  const digits = String(value || '').replace(/\D/g, '')
  return digits.length >= 13 && digits.length <= 19
}

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''))

// --------------------------------------------------------------------------
// Per-step validation. Returns a map of { field: errorKey } where errorKey is
// an i18n key the component resolves with t(). An empty object means the step
// is valid. `mode` relaxes a few requirements for the guest self-service flow.
// --------------------------------------------------------------------------
export function validateStationStep(step, data = {}, { mode = 'reception' } = {}) {
  const e = {}
  const E = (f, key) => { e[f] = `station.errors.${key}` }

  switch (step) {
    case 'identify':
      // Reception confirms the reservation; nothing to validate here.
      break

    case 'documents': {
      if (!String(data.documentNumber || '').trim()) E('documentNumber', 'documentRequired')
      if (!String(data.nationality || '').trim()) E('nationality', 'nationalityRequired')
      if (!String(data.birthDate || '').trim()) E('birthDate', 'birthDateRequired')
      // Reception must attach the id photo; the guest may upload later at the desk.
      if (mode === 'reception' && !data.documentPhoto) E('documentPhoto', 'documentPhotoRequired')
      break
    }

    case 'guests': {
      (data.companions || []).forEach((c, i) => {
        if (!String(c.fullName || '').trim()) E(`companion-${i}-fullName`, 'companionNameRequired')
        if (!String(c.documentNumber || '').trim()) E(`companion-${i}-documentNumber`, 'companionDocumentRequired')
      })
      break
    }

    case 'room': {
      // Reception must land the guest in a concrete room; the guest can defer.
      if (mode === 'reception' && !data.assignedRoomNumber) E('assignedRoomNumber', 'roomRequired')
      break
    }

    case 'payment': {
      const p = data.payment || {}
      if (!PAYMENT_METHODS.includes(p.method)) E('method', 'paymentMethodRequired')
      if (p.method === 'card') {
        if (!String(p.cardName || '').trim()) E('cardName', 'cardNameRequired')
        if (!looksLikeCard(p.cardNumber)) E('cardNumber', 'cardNumberInvalid')
        if (!/^\d{2}\/\d{2}$/.test(String(p.expiry || ''))) E('expiry', 'expiryInvalid')
        if (!/^\d{3,4}$/.test(String(p.cvc || ''))) E('cvc', 'cvcInvalid')
      }
      break
    }

    case 'signature': {
      if (!data.signature) E('signature', 'signatureRequired')
      if (!data.acceptPolicies) E('acceptPolicies', 'policiesRequired')
      break
    }

    case 'keys': {
      const n = Number(data.keyCards)
      if (!Number.isFinite(n) || n < MIN_KEY_CARDS || n > MAX_KEY_CARDS) E('keyCards', 'keyCardsInvalid')
      break
    }

    case 'confirm':
    default:
      break
  }

  return e
}

// Whether a step is "done" purely from the data it needs (independent of the
// bookkeeping array). Used for the resume indicator so a guest's partial online
// progress is visible to reception even across a reload.
export function stepIsSatisfied(step, data = {}, mode = 'reception') {
  return Object.keys(validateStationStep(step, data, { mode })).length === 0
}

// Progress across a mode's step list. `completed` counts steps that are both
// satisfied AND were explicitly passed (completedSteps), so we never over-count
// a still-empty step that happens to have no required fields.
export function stationProgress(reservation, data = {}, mode = 'reception') {
  const steps = buildSteps({ mode, guests: reservation?.guests || 1 })
  const passed = new Set(data.completedSteps || [])
  const done = steps.filter((s) => s !== 'confirm' && passed.has(s) && stepIsSatisfied(s, data, mode))
  const total = steps.filter((s) => s !== 'confirm').length
  return {
    total,
    done: done.length,
    percent: total ? Math.round((done.length / total) * 100) : 0,
    complete: done.length >= total,
  }
}

// First step (in the mode's order) the actor still needs to complete — the
// natural place to drop a resuming receptionist.
export function nextIncompleteStep(reservation, data = {}, mode = 'reception') {
  const steps = buildSteps({ mode, guests: reservation?.guests || 1 })
  const passed = new Set(data.completedSteps || [])
  const idx = steps.findIndex((s) => s !== 'confirm' && !(passed.has(s) && stepIsSatisfied(s, data, mode)))
  return idx === -1 ? steps.length - 1 : idx
}

// Simulated digital key code. `rand` is injectable so tests stay deterministic;
// at runtime the component passes Math.random. Prefix reflects Villa Serena (H20).
export function generateKeyCode(roomNumber, rand = Math.random) {
  const suffix = Math.floor(1000 + rand() * 9000)
  return `VS-${roomNumber || '000'}-${suffix}`
}

// Mask a card number for display / persistence (never store full PANs, even mock).
export function maskCard(cardNumber) {
  const digits = String(cardNumber || '').replace(/\D/g, '')
  if (digits.length < 4) return ''
  return `•••• •••• •••• ${digits.slice(-4)}`
}

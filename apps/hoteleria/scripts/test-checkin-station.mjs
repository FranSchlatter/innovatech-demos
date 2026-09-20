// Logic test for the H26 check-in station model (pure helpers).
// Run: node apps/hoteleria/scripts/test-checkin-station.mjs
import {
  STATION_STEPS, DOCUMENT_TYPES, PAYMENT_METHODS, MIN_KEY_CARDS, MAX_KEY_CARDS,
  buildSteps, balanceDue, blankStationData, hydrateStationData,
  validateStationStep, stepIsSatisfied, stationProgress, nextIncompleteStep,
  generateKeyCode, maskCard,
} from '../src/data/admin/checkinStation.js'

let passed = 0
let failed = 0
function check(name, cond) {
  if (cond) { passed++; console.log(`  ✓ ${name}`) }
  else { failed++; console.error(`  ✗ ${name}`) }
}

const RES1 = {
  id: 'RES-001', guestName: 'John Smith', roomType: 'deluxe', roomNumber: '305',
  roomId: 3, guests: 2, checkIn: '2026-09-20', checkOut: '2026-09-23',
  totalAmount: 720, amountPaid: 200, paymentStatus: 'partial',
  documentType: 'passport', documentNumber: 'X123', nationality: 'USA',
}
const RES_SOLO_PAID = { id: 'RES-2', guests: 1, totalAmount: 300, amountPaid: 300, paymentStatus: 'paid', roomNumber: '201' }

// --- buildSteps -------------------------------------------------------------
console.log('buildSteps')
check('reception starts with identify', buildSteps({ mode: 'reception', guests: 2 })[0] === 'identify')
check('guest omits identify', !buildSteps({ mode: 'guest', guests: 2 }).includes('identify'))
check('guests step present when >1', buildSteps({ mode: 'reception', guests: 2 }).includes('guests'))
check('guests step absent when 1', !buildSteps({ mode: 'reception', guests: 1 }).includes('guests'))
check('always ends in confirm', buildSteps({ mode: 'guest', guests: 1 }).at(-1) === 'confirm')
check('reception full order', buildSteps({ mode: 'reception', guests: 2 }).join(',') ===
  'identify,documents,guests,room,payment,signature,keys,confirm')
check('guest solo order', buildSteps({ mode: 'guest', guests: 1 }).join(',') ===
  'documents,room,payment,signature,keys,confirm')
check('every step id is known', buildSteps({ mode: 'reception', guests: 2 }).every((s) => STATION_STEPS.includes(s)))

// --- balanceDue -------------------------------------------------------------
console.log('\nbalanceDue')
check('total minus paid', balanceDue(RES1) === 520)
check('never negative', balanceDue({ totalAmount: 100, amountPaid: 300 }) === 0)
check('missing paid → total', balanceDue({ totalAmount: 150 }) === 150)
check('empty → 0', balanceDue(null) === 0)

// --- blankStationData -------------------------------------------------------
console.log('\nblankStationData')
const blank = blankStationData(RES1)
check('companions sized to party-1', blank.companions.length === 1)
check('prefills document from reservation', blank.documentNumber === 'X123' && blank.nationality === 'USA')
check('payment method card when not paid', blank.payment.method === 'card')
check('paid reservation → method paid', blankStationData(RES_SOLO_PAID).payment.method === 'paid')
check('solo reservation → no companions', blankStationData(RES_SOLO_PAID).companions.length === 0)
check('preauth seeded from balance', blank.payment.preauthAmount === 520)
check('assigned room seeded from reservation', blank.assignedRoomNumber === '305' && blank.assignedRoomId === 3)
check('completedSteps starts empty', Array.isArray(blank.completedSteps) && blank.completedSteps.length === 0)

// --- hydrateStationData -----------------------------------------------------
console.log('\nhydrateStationData')
const saved = { documentNumber: 'SAVED-9', completedSteps: ['documents'], payment: { method: 'desk' }, companions: [{ fullName: 'Ana' }] }
const hyd = hydrateStationData(RES1, saved)
check('overlays saved fields', hyd.documentNumber === 'SAVED-9')
check('merges payment partial over defaults', hyd.payment.method === 'desk' && typeof hyd.payment.preauthAmount === 'number')
check('keeps completedSteps', hyd.completedSteps.join(',') === 'documents')
check('resizes companions to party', hyd.companions.length === 1 && hyd.companions[0].fullName === 'Ana')
check('null saved → blank', hydrateStationData(RES1, null).documentNumber === 'X123')

// --- validateStationStep ----------------------------------------------------
console.log('\nvalidateStationStep')
check('identify never errors', Object.keys(validateStationStep('identify', blank, { mode: 'reception' })).length === 0)
const emptyDocs = { documentNumber: '', nationality: '', birthDate: '' }
check('documents flags missing fields', Object.keys(validateStationStep('documents', emptyDocs, { mode: 'guest' })).length === 3)
check('reception requires id photo', !!validateStationStep('documents', { documentNumber: 'a', nationality: 'b', birthDate: '2000-01-01' }, { mode: 'reception' }).documentPhoto)
check('guest does NOT require id photo', !validateStationStep('documents', { documentNumber: 'a', nationality: 'b', birthDate: '2000-01-01' }, { mode: 'guest' }).documentPhoto)
check('documents valid when complete', Object.keys(validateStationStep('documents', { documentNumber: 'a', nationality: 'b', birthDate: '2000-01-01', documentPhoto: 'data:x' }, { mode: 'reception' })).length === 0)
check('guests flags empty companion', Object.keys(validateStationStep('guests', { companions: [{ fullName: '', documentNumber: '' }] }, { mode: 'reception' })).length === 2)
check('reception requires room', !!validateStationStep('room', { assignedRoomNumber: null }, { mode: 'reception' }).assignedRoomNumber)
check('guest room optional', Object.keys(validateStationStep('room', { assignedRoomNumber: null }, { mode: 'guest' })).length === 0)
check('payment requires a method', !!validateStationStep('payment', { payment: { method: 'x' } }, { mode: 'guest' }).method)
check('card needs valid fields', Object.keys(validateStationStep('payment', { payment: { method: 'card', cardName: '', cardNumber: '123', expiry: 'x', cvc: '1' } }, { mode: 'guest' })).length === 4)
check('valid card passes', Object.keys(validateStationStep('payment', { payment: { method: 'card', cardName: 'A B', cardNumber: '4242424242424242', expiry: '12/28', cvc: '123' } }, { mode: 'guest' })).length === 0)
check('paid method passes with no card', Object.keys(validateStationStep('payment', { payment: { method: 'paid' } }, { mode: 'guest' })).length === 0)
check('signature requires ink + policies', Object.keys(validateStationStep('signature', { signature: null, acceptPolicies: false }, { mode: 'guest' })).length === 2)
check('signature valid when signed+accepted', Object.keys(validateStationStep('signature', { signature: 'data:x', acceptPolicies: true }, { mode: 'guest' })).length === 0)
check('keys out of range flagged', !!validateStationStep('keys', { keyCards: 9 }, { mode: 'guest' }).keyCards)
check('keys in range ok', Object.keys(validateStationStep('keys', { keyCards: 2 }, { mode: 'guest' })).length === 0)
check('error values are i18n keys', validateStationStep('documents', emptyDocs, { mode: 'guest' }).documentNumber.startsWith('station.errors.'))

// --- progress / nextIncompleteStep -----------------------------------------
console.log('\nprogress')
const complete = {
  ...blank,
  documentNumber: 'a', nationality: 'b', birthDate: '2000-01-01', documentPhoto: 'data:x',
  companions: [{ fullName: 'Ana', documentType: 'passport', documentNumber: 'z' }],
  assignedRoomNumber: '305', assignedRoomId: 3,
  payment: { method: 'paid' }, signature: 'data:x', acceptPolicies: true, keyCards: 2,
  completedSteps: ['identify', 'documents', 'guests', 'room', 'payment', 'signature', 'keys'],
}
const prog = stationProgress(RES1, complete, 'reception')
// Reception has 7 non-confirm steps (identify…keys).
check('progress counts satisfied+passed steps', prog.done === 7 && prog.total === 7)
check('progress reports complete', prog.complete === true && prog.percent === 100)
const partial = { ...blank, documentNumber: 'a', nationality: 'b', birthDate: '2000-01-01', documentPhoto: 'data:x', completedSteps: ['identify', 'documents'] }
check('partial progress < total', stationProgress(RES1, partial, 'reception').done === 2)
// blank documents lack birthDate + photo → passed but NOT satisfied → not counted.
check('passed-but-unsatisfied not counted', stationProgress(RES1, { ...blank, completedSteps: ['documents'] }, 'reception').done === 0)
check('nextIncompleteStep points at first gap', buildSteps({ mode: 'reception', guests: 2 })[nextIncompleteStep(RES1, partial, 'reception')] === 'guests')
check('stepIsSatisfied matches validate', stepIsSatisfied('documents', complete, 'reception') === true)

// --- generateKeyCode / maskCard --------------------------------------------
console.log('\nkey + card helpers')
const seq = generateKeyCode('305', () => 0.5)
check('key code format VS-<room>-<4 digits>', /^VS-305-\d{4}$/.test(seq))
check('key code deterministic with injected rand', generateKeyCode('305', () => 0.5) === seq)
check('key code varies with rand', generateKeyCode('305', () => 0.1) !== generateKeyCode('305', () => 0.9))
check('mask shows last 4', maskCard('4242424242424242') === '•••• •••• •••• 4242')
check('mask empty for short', maskCard('12') === '')

// --- constants integrity ----------------------------------------------------
console.log('\nconstants')
check('doc types include passport & national-id', DOCUMENT_TYPES.includes('passport') && DOCUMENT_TYPES.includes('national-id'))
check('payment methods are card/paid/desk', PAYMENT_METHODS.join(',') === 'card,paid,desk')
check('key card bounds sane', MIN_KEY_CARDS === 1 && MAX_KEY_CARDS === 4)

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)

// H26 — pure reservations model (no React, no storage side-effects) so it can be
// unit-tested. The useReservations hook wires these to localStorage + events.
import { mockReservations } from './mockReservations.js'

export function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

// Merge the persisted delta (overrides + runtime extras) over the always-fresh
// mock seed. Overrides win field-by-field; extras are appended.
export function mergeReservations(delta = {}, seed = mockReservations) {
  const base = [...seed, ...(delta.extras || [])]
  return base.map((r) => {
    const ov = delta.overrides?.[r.id]
    return ov ? { ...r, ...ov } : r
  })
}

// Build the new delta from the pre-H26 calendar keys (raw JSON strings). Extras
// carry over verbatim; the status map becomes per-id overrides.
export function applyLegacyMigration(extraRaw, statusRaw) {
  const delta = { overrides: {}, extras: [] }
  const extras = safeParse(extraRaw, [])
  if (Array.isArray(extras)) delta.extras = extras
  const statusMap = safeParse(statusRaw, {})
  if (statusMap && typeof statusMap === 'object') {
    Object.entries(statusMap).forEach(([id, status]) => {
      if (typeof status === 'string') delta.overrides[id] = { status }
    })
  }
  return delta
}

// Local (TZ-safe) YYYY-MM-DD for "today" — never toISOString for the calendar day.
export function localDayISO(d = new Date()) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

// Bucket a reservation relative to today for the reception filters.
export function reservationBucket(r, today = localDayISO()) {
  if (r.status === 'cancelled') return 'cancelled'
  if (r.status === 'checked-out') return 'past'
  if (r.status === 'checked-in') {
    return r.checkOut === today ? 'departures' : 'inhouse'
  }
  // confirmed
  if (r.checkIn <= today) return 'arrivals'
  return 'upcoming'
}

// Dynamic pricing — separates inflation from demand (the real differentiator in AR).
// Ported from the v2 demo. Amounts in ARS.

export const dynamicPricing = {
  ipcMonthly: 3.2, // % monthly inflation used to deflate nominal rates
  note: 'La tarifa nominal sube por inflación; la recomendación se calcula sobre la tarifa real (deflactada) y la ocupación.',
  rows: [
    { date: 'Mañana', nominal: 128000, real: 128000, occ: 82, rec: 'subir', reason: 'demanda', delta: 8 },
    { date: 'En 2 días', nominal: 128000, real: 127900, occ: 79, rec: 'mantener', reason: '—', delta: 0 },
    { date: 'En 1 semana', nominal: 132000, real: 128100, occ: 61, rec: 'bajar', reason: 'ocupación baja', delta: -6 },
    { date: 'En 2 semanas', nominal: 138000, real: 128600, occ: 94, rec: 'subir', reason: 'demanda alta', delta: 14 },
    { date: 'En 1 mes', nominal: 148000, real: 129200, occ: 88, rec: 'subir', reason: 'demanda', delta: 10 }
  ]
}

// Room types offers can be applied to (matches rooms.json `type`).
export const ROOM_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'presidential', label: 'Presidential' },
  { value: 'family', label: 'Family' },
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium' }
]

// Build ISO dates relative to today so the seeded demo data never goes stale.
const iso = (offsetDays) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

// Seed offers — one active, one scheduled, one expired so all states are visible.
export const initialOffers = [
  {
    id: 'OFF-1001',
    name: 'Last-minute Weekend',
    discount: 15,
    roomTypes: ['standard', 'economy', 'deluxe'],
    startDate: iso(-2),
    endDate: iso(5),
    enabled: true
  },
  {
    id: 'OFF-1002',
    name: 'Honeymoon Suite Special',
    discount: 20,
    roomTypes: ['suite', 'presidential'],
    startDate: iso(7),
    endDate: iso(21),
    enabled: true
  },
  {
    id: 'OFF-1003',
    name: 'Winter Family Escape',
    discount: 25,
    roomTypes: ['family'],
    startDate: iso(-30),
    endDate: iso(-3),
    enabled: true
  }
]

// Seed seasons — high/low periods with a price multiplier.
export const initialSeasons = [
  { id: 'SEA-2001', name: 'Peak Summer', startDate: iso(-10), endDate: iso(20), multiplier: 1.3 },
  { id: 'SEA-2002', name: 'Shoulder Season', startDate: iso(21), endDate: iso(60), multiplier: 1.0 },
  { id: 'SEA-2003', name: 'Low Season', startDate: iso(61), endDate: iso(120), multiplier: 0.8 }
]

// Derive the live state of an offer from its dates + enabled flag.
export const offerStatus = (offer, todayStr = new Date().toISOString().split('T')[0]) => {
  if (!offer.enabled) return 'paused'
  if (todayStr < offer.startDate) return 'scheduled'
  if (todayStr > offer.endDate) return 'expired'
  return 'active'
}

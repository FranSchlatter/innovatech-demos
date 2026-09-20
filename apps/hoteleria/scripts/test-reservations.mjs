// Logic test for the H26 unified reservations model (pure helpers).
// Run: node apps/hoteleria/scripts/test-reservations.mjs
import {
  mergeReservations, applyLegacyMigration, reservationBucket, safeParse,
} from '../src/data/admin/reservationsModel.js'
import { mockReservations } from '../src/data/admin/mockReservations.js'

let passed = 0
let failed = 0
function check(name, cond) {
  if (cond) { passed++; console.log(`  ✓ ${name}`) }
  else { failed++; console.error(`  ✗ ${name}`) }
}

const TODAY = '2026-09-20'

// --- reservationBucket ------------------------------------------------------
console.log('reservationBucket')
check('cancelled → cancelled', reservationBucket({ status: 'cancelled' }, TODAY) === 'cancelled')
check('checked-out → past', reservationBucket({ status: 'checked-out' }, TODAY) === 'past')
check('checked-in leaving today → departures', reservationBucket({ status: 'checked-in', checkOut: TODAY }, TODAY) === 'departures')
check('checked-in staying → inhouse', reservationBucket({ status: 'checked-in', checkOut: '2026-09-25' }, TODAY) === 'inhouse')
check('confirmed arriving today → arrivals', reservationBucket({ status: 'confirmed', checkIn: TODAY }, TODAY) === 'arrivals')
check('confirmed overdue arrival → arrivals', reservationBucket({ status: 'confirmed', checkIn: '2026-09-18' }, TODAY) === 'arrivals')
check('confirmed future → upcoming', reservationBucket({ status: 'confirmed', checkIn: '2026-09-25' }, TODAY) === 'upcoming')

// --- mergeReservations ------------------------------------------------------
console.log('\nmergeReservations')
const seed = [
  { id: 'A', status: 'confirmed', roomNumber: '101' },
  { id: 'B', status: 'confirmed', roomNumber: '102' },
]
check('empty delta = seed', mergeReservations({}, seed).length === 2)
const merged = mergeReservations({ overrides: { A: { status: 'checked-in', digitalKey: 'VS-101-1' } } }, seed)
check('override applies status', merged.find((r) => r.id === 'A').status === 'checked-in')
check('override adds new fields', merged.find((r) => r.id === 'A').digitalKey === 'VS-101-1')
check('non-overridden untouched', merged.find((r) => r.id === 'B').status === 'confirmed')
const withExtras = mergeReservations({ extras: [{ id: 'C', status: 'confirmed' }] }, seed)
check('extras are appended', withExtras.length === 3 && withExtras.at(-1).id === 'C')
check('override + extra together', mergeReservations({ overrides: { A: { status: 'checked-out' } }, extras: [{ id: 'C' }] }, seed).length === 3)

// --- applyLegacyMigration ---------------------------------------------------
console.log('\napplyLegacyMigration')
const migrated = applyLegacyMigration(
  JSON.stringify([{ id: 'RES-C-1', guestName: 'Legacy Guest', status: 'confirmed' }]),
  JSON.stringify({ 'RES-001': 'checked-in', 'RES-004': 'checked-out' })
)
check('carries legacy extras', migrated.extras.length === 1 && migrated.extras[0].id === 'RES-C-1')
check('status map → overrides', migrated.overrides['RES-001'].status === 'checked-in')
check('multiple status overrides', migrated.overrides['RES-004'].status === 'checked-out')
check('null inputs → empty delta', JSON.stringify(applyLegacyMigration(null, null)) === '{"overrides":{},"extras":[]}')
check('corrupt json → empty delta', applyLegacyMigration('{bad', 'also-bad').extras.length === 0)
check('migrated delta merges over seed', mergeReservations(migrated, seed.concat({ id: 'RES-001', status: 'confirmed' })).find((r) => r.id === 'RES-001').status === 'checked-in')

// --- safeParse --------------------------------------------------------------
console.log('\nsafeParse')
check('parses valid json', safeParse('{"a":1}', null).a === 1)
check('bad json → fallback', safeParse('{bad', 'fb') === 'fb')

// --- seed integrity (portal guest present for shared check-in) ---------------
console.log('\nseed integrity')
const portal = mockReservations.find((r) => r.id === 'RES-2024-5678')
check('portal guest reservation is seeded', !!portal)
check('portal guest arriving today, confirmed', portal && portal.status === 'confirmed')
check('portal guest has amountPaid for balance', portal && typeof portal.amountPaid === 'number')
check('all reservations have unique ids', new Set(mockReservations.map((r) => r.id)).size === mockReservations.length)
check('every reservation has required fields', mockReservations.every((r) =>
  r.id && r.guestName && r.roomType && r.checkIn && r.checkOut && r.status))

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)

// Logic test for the H23 beach/pool facility map.
// Run: node apps/hoteleria/scripts/test-facilities.mjs
import {
  initialFacilities, facilityCounts, describeSpot, FACILITY_TYPES,
  FACILITY_STATUS, ZONES, POOLSIDE_MENU, typeLabel, zoneLabel
} from '../src/data/mockFacilities.js'

let passed = 0
let failed = 0
function check(name, cond) {
  if (cond) { passed++; console.log(`  ✓ ${name}`) }
  else { failed++; console.error(`  ✗ ${name}`) }
}

// --- Seed integrity ---------------------------------------------------------
console.log('Seed integrity')
check('has 21 spots', initialFacilities.length === 21)
check('all ids unique', new Set(initialFacilities.map((s) => s.id)).size === initialFacilities.length)
check('all coords within 0–100', initialFacilities.every((s) => s.x >= 0 && s.x <= 100 && s.y >= 0 && s.y <= 100))
check('all types valid', initialFacilities.every((s) => FACILITY_TYPES[s.type]))
check('all zones valid', initialFacilities.every((s) => ZONES[s.zone]))
check('all statuses valid', initialFacilities.every((s) => FACILITY_STATUS[s.status]))
check('cabanas are priced', initialFacilities.filter((s) => s.type === 'cabana').every((s) => s.price > 0))
check('loungers/umbrellas free', initialFacilities.filter((s) => s.type !== 'cabana').every((s) => s.price === 0))
check('held spots carry a guest name', initialFacilities.filter((s) => s.status !== 'available').every((s) => !!s.guestName))
check('reserved spots carry date+time', initialFacilities.filter((s) => s.status === 'reserved').every((s) => s.reservedFor?.date && s.reservedFor?.time))
check('has a mix of statuses', ['available', 'occupied', 'reserved'].every((st) => initialFacilities.some((s) => s.status === st)))

// --- facilityCounts ---------------------------------------------------------
console.log('\nfacilityCounts')
const c = facilityCounts(initialFacilities)
check('counts sum to total', c.available + c.occupied + c.reserved === c.total)
check('total matches seed', c.total === initialFacilities.length)
const expectedRevenue = initialFacilities
  .filter((s) => s.status !== 'available' && s.price > 0)
  .reduce((a, s) => a + s.price, 0)
check('revenue = held paid spots', c.revenue === expectedRevenue)
check('pool + beach totals = total', c.pool.total + c.beach.total === c.total)
check('zone available never exceeds zone total', c.pool.available <= c.pool.total && c.beach.available <= c.beach.total)
check('empty board → all zero', (() => {
  const z = facilityCounts([])
  return z.total === 0 && z.available === 0 && z.revenue === 0
})())

// --- transition logic (mirrors the useFacilities reducers) ------------------
console.log('\nTransition logic')
const reserve = (spots, id, info) => {
  const t = spots.find((s) => s.id === id)
  if (!t) return { result: 'missing', spots }
  if (t.status !== 'available') return { result: 'taken', spots }
  return {
    result: 'ok',
    spots: spots.map((s) => s.id === id
      ? { ...s, status: 'reserved', guestName: info.guestName, reservedFor: { date: info.date, time: info.time }, heldBy: 'guest' }
      : s)
  }
}
const release = (spots, id) =>
  spots.map((s) => s.id === id ? { ...s, status: 'available', guestName: null, reservedFor: null, heldBy: null } : s)
const occupy = (spots, id, name) =>
  spots.map((s) => s.id === id ? { ...s, status: 'occupied', guestName: name, heldBy: 'front-desk' } : s)

const freeId = initialFacilities.find((s) => s.status === 'available').id
const takenId = initialFacilities.find((s) => s.status !== 'available').id

const r1 = reserve(initialFacilities, freeId, { guestName: 'Test Guest', date: '2026-09-20', time: '11:00' })
check('reserve available → ok', r1.result === 'ok')
check('reserved spot is now "reserved"', r1.spots.find((s) => s.id === freeId).status === 'reserved')
check('reserved spot held by guest', r1.spots.find((s) => s.id === freeId).heldBy === 'guest')
check('reserve counts drop availability by 1', facilityCounts(r1.spots).available === c.available - 1)

check('reserve already-taken → "taken"', reserve(initialFacilities, takenId, {}).result === 'taken')
check('reserve unknown id → "missing"', reserve(initialFacilities, 'NOPE', {}).result === 'missing')

const rel = release(r1.spots, freeId)
check('release → available again', rel.find((s) => s.id === freeId).status === 'available')
check('release clears guest name', rel.find((s) => s.id === freeId).guestName === null)
check('release restores availability count', facilityCounts(rel).available === c.available)

const occ = occupy(initialFacilities, freeId, 'Walk-in Pérez')
check('occupy → occupied', occ.find((s) => s.id === freeId).status === 'occupied')
check('occupy sets guest name', occ.find((s) => s.id === freeId).guestName === 'Walk-in Pérez')

// --- helpers & menu ---------------------------------------------------------
console.log('\nHelpers & menu')
check('describeSpot formats "label · zone"', describeSpot(initialFacilities[0]) === `${initialFacilities[0].label} · ${zoneLabel(initialFacilities[0].zone)}`)
check('typeLabel returns a string', typeof typeLabel('cabana') === 'string')
check('poolside menu has drinks and snacks', POOLSIDE_MENU.some((m) => m.category === 'drink') && POOLSIDE_MENU.some((m) => m.category === 'snack'))
check('poolside prices all positive', POOLSIDE_MENU.every((m) => m.price > 0))
check('poolside ids unique', new Set(POOLSIDE_MENU.map((m) => m.id)).size === POOLSIDE_MENU.length)

// --- summary ----------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)

// Publishing platforms for the property-syndication module (I10).
// Each property has a per-platform publication state + simulated metrics.
// Initial state is generated deterministically (seeded by propertyId:platformId)
// so numbers stay stable across reloads even before the user touches anything.

// Fixed "today" for the demo — matches the clock used across the admin panel.
export const TODAY = '2026-08-27'

// The 4 portals a listing can be syndicated to. `weight` scales the simulated
// traffic (ZonaProp leads the market); `tone` maps to a StatusBadge/theme color.
export const PLATFORMS = [
  { id: 'zonaprop', name: 'ZonaProp', short: 'ZP', weight: 1.0, tone: 'accent' },
  { id: 'argenprop', name: 'ArgenProp', short: 'AP', weight: 0.7, tone: 'info' },
  { id: 'mercadolibre', name: 'MercadoLibre', short: 'ML', weight: 0.85, tone: 'warning' },
  { id: 'instagram', name: 'Instagram', short: 'IG', weight: 0.55, tone: 'primary' }
]

export const PLATFORM_STATUSES = ['published', 'paused', 'unpublished']

// --- Deterministic PRNG so seeded metrics never jump between renders ---
function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function daysAgoISO(days) {
  const d = new Date(`${TODAY}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

// Build the metrics + status for a single property/platform pair.
function generateCell(property, platform) {
  const rng = mulberry32(hashSeed(`${property.id}:${platform.id}`))

  // Status mix: ~62% published, ~16% paused, ~22% not published.
  const roll = rng()
  let status = 'unpublished'
  if (roll < 0.62) status = 'published'
  else if (roll < 0.78) status = 'paused'

  const active = status !== 'unpublished'
  const days = active ? 4 + Math.floor(rng() * 56) : 0 // 4–60 days live
  const publishedAt = active ? daysAgoISO(days) : null

  // Traffic scales with the property's own popularity and the platform weight.
  const baseViews = property.views || 200
  const visits = active
    ? Math.round((baseViews * 0.15 + 30) * platform.weight * (0.7 + rng() * 0.8))
    : 0
  const inquiries = active ? Math.max(0, Math.round(visits * (0.03 + rng() * 0.06))) : 0

  // 7-day visit series for the mini bar chart (roughly averages to visits/day).
  const perDay = active ? visits / Math.max(days, 7) : 0
  const series = Array.from({ length: 7 }, () =>
    active ? Math.max(0, Math.round(perDay * (0.4 + rng() * 1.6))) : 0
  )

  return { status, publishedAt, visits, inquiries, series }
}

// Full initial map: { [propertyId]: { [platformId]: cell } }
export function buildInitialPlatformState(properties) {
  const state = {}
  for (const property of properties) {
    state[property.id] = {}
    for (const platform of PLATFORMS) {
      state[property.id][platform.id] = generateCell(property, platform)
    }
  }
  return state
}

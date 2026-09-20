/**
 * Nearby points of interest (POIs) engine — I26.
 *
 * Instead of hardcoding a `pois[]` array per property (brittle, hard to keep
 * varied), we curate a real-ish pool of landmarks per neighborhood and derive
 * each property's nearby list deterministically from its id. Same pattern used
 * across the codebase for synthetic-but-stable data (mockExcursions, mockValuation).
 *
 * `getNearbyPois(property)` returns:
 *   { score, scoreLabel, scoreTone, scorePercent, totalCount, categoryCount, groups }
 * where `groups` is category-ordered, each with distance/travel already resolved.
 */

// -----------------------------------------------------------------------------
// Taxonomy
// -----------------------------------------------------------------------------

export const POI_CATEGORIES = {
  education: { label: 'Educación', order: 1 },
  health: { label: 'Salud', order: 2 },
  transport: { label: 'Transporte', order: 3 },
  shopping: { label: 'Comercio', order: 4 },
  recreation: { label: 'Recreación', order: 5 }
}

// type -> { label, category }. Icons are mapped in the component (keeps this
// module free of JSX / lucide imports).
export const POI_TYPES = {
  school: { label: 'Educación', category: 'education' },
  university: { label: 'Universidad', category: 'education' },
  hospital: { label: 'Salud', category: 'health' },
  pharmacy: { label: 'Farmacia', category: 'health' },
  transport: { label: 'Transporte', category: 'transport' },
  market: { label: 'Supermercado', category: 'shopping' },
  mall: { label: 'Shopping', category: 'shopping' },
  restaurant: { label: 'Gastronomía', category: 'shopping' },
  park: { label: 'Espacio verde', category: 'recreation' },
  gym: { label: 'Deporte', category: 'recreation' }
}

// -----------------------------------------------------------------------------
// Zone profiles — drive the distance ranges (dense city vs gated community).
// -----------------------------------------------------------------------------

const ZONE_PROFILES = {
  urban: { minDist: 90, maxDist: 950 },
  premium: { minDist: 120, maxDist: 1100 },
  coastal: { minDist: 120, maxDist: 1250 },
  suburban: { minDist: 280, maxDist: 2100 },
  gated: { minDist: 650, maxDist: 4200 }
}

const NEIGHBORHOOD_PROFILE = {
  Palermo: 'urban',
  'Palermo Soho': 'urban',
  'Palermo Hollywood': 'urban',
  'Villa Crespo': 'urban',
  'Barrio Norte': 'urban',
  'Las Cañitas': 'urban',
  Belgrano: 'urban',
  Catalinas: 'premium',
  'Puerto Madero': 'premium',
  'Playa Grande': 'coastal',
  'La Lonja': 'suburban',
  Nordelta: 'gated',
  'Santa Bárbara': 'gated',
  'Mapuche Country Club': 'gated'
}

// -----------------------------------------------------------------------------
// Curated pools — real-ish landmarks per neighborhood.
// The engine shuffles + picks a subset per property, so pools are intentionally
// a bit larger than what any single property shows.
// -----------------------------------------------------------------------------

const NEIGHBORHOOD_POIS = {
  Palermo: [
    { name: 'Colegio San Martín de Tours', type: 'school' },
    { name: 'Escuela Rosario Vera Peñaloza', type: 'school' },
    { name: 'Hospital Fernández', type: 'hospital' },
    { name: 'Farmacity Santa Fe', type: 'pharmacy' },
    { name: 'Estación Plaza Italia (Subte D)', type: 'transport' },
    { name: 'Estación Palermo (Tren Mitre)', type: 'transport' },
    { name: 'Carrefour Market Cabello', type: 'market' },
    { name: 'Alto Palermo Shopping', type: 'mall' },
    { name: 'Don Julio Parrilla', type: 'restaurant' },
    { name: 'Bosques de Palermo', type: 'park' },
    { name: 'Jardín Botánico Carlos Thays', type: 'park' },
    { name: 'SportClub Palermo', type: 'gym' }
  ],
  'Palermo Soho': [
    { name: 'Instituto Cangallo', type: 'school' },
    { name: 'Hospital Fernández', type: 'hospital' },
    { name: 'Farmacity Armenia', type: 'pharmacy' },
    { name: 'Estación Plaza Italia (Subte D)', type: 'transport' },
    { name: 'Disco Gurruchaga', type: 'market' },
    { name: 'Alto Palermo Shopping', type: 'mall' },
    { name: 'Tegui Restaurante', type: 'restaurant' },
    { name: 'Plaza Serrano (Cortázar)', type: 'park' },
    { name: 'Megatlon Soho', type: 'gym' }
  ],
  'Palermo Hollywood': [
    { name: 'Instituto San Marón', type: 'school' },
    { name: 'Hospital Fernández', type: 'hospital' },
    { name: 'Farmacity Bonpland', type: 'pharmacy' },
    { name: 'Estación Ministro Carranza (Subte D)', type: 'transport' },
    { name: 'Estación Palermo (Tren Mitre)', type: 'transport' },
    { name: 'Carrefour Market Humboldt', type: 'market' },
    { name: 'Alto Palermo Shopping', type: 'mall' },
    { name: 'La Carnicería Parrilla', type: 'restaurant' },
    { name: 'Plaza Julio Cortázar', type: 'park' },
    { name: 'Megatlon Palermo', type: 'gym' }
  ],
  'Villa Crespo': [
    { name: 'Escuela Nicolás Rodríguez Peña', type: 'school' },
    { name: 'Sanatorio Franchín', type: 'hospital' },
    { name: 'Farmacity Corrientes', type: 'pharmacy' },
    { name: 'Estación Malabia (Subte B)', type: 'transport' },
    { name: 'Estación Villa Crespo (Tren San Martín)', type: 'transport' },
    { name: 'Coto Corrientes', type: 'market' },
    { name: 'Aldrey Outlet Corrientes', type: 'mall' },
    { name: 'El Imperio de la Pizza', type: 'restaurant' },
    { name: 'Plaza Benjamín Gould', type: 'park' },
    { name: 'SportClub Villa Crespo', type: 'gym' }
  ],
  'Barrio Norte': [
    { name: 'Colegio La Salle', type: 'school' },
    { name: 'Hospital Rivadavia', type: 'hospital' },
    { name: 'Farmacity Pueyrredón', type: 'pharmacy' },
    { name: 'Estación Agüero (Subte D)', type: 'transport' },
    { name: 'Carrefour Express Las Heras', type: 'market' },
    { name: 'Village Recoleta', type: 'mall' },
    { name: 'El Cuartito Pizzería', type: 'restaurant' },
    { name: 'Plaza Vicente López', type: 'park' },
    { name: 'Megatlon Callao', type: 'gym' }
  ],
  'Las Cañitas': [
    { name: 'Escuela Normal N° 6', type: 'school' },
    { name: 'Hospital Militar Central', type: 'hospital' },
    { name: 'Farmacity Báez', type: 'pharmacy' },
    { name: 'Estación Ministro Carranza (Subte D)', type: 'transport' },
    { name: 'Estación Colegiales (Tren Mitre)', type: 'transport' },
    { name: 'Disco Luis María Campos', type: 'market' },
    { name: 'Solar de la Abadía', type: 'mall' },
    { name: 'Novecento Báez', type: 'restaurant' },
    { name: 'Campo Argentino de Polo', type: 'park' },
    { name: 'SportClub Cañitas', type: 'gym' }
  ],
  Belgrano: [
    { name: 'Belgrano Day School', type: 'school' },
    { name: 'Hospital Pirovano', type: 'hospital' },
    { name: 'Farmacity Cabildo', type: 'pharmacy' },
    { name: 'Estación Juramento (Subte D)', type: 'transport' },
    { name: 'Estación Belgrano C (Tren Mitre)', type: 'transport' },
    { name: 'Coto Cabildo', type: 'market' },
    { name: 'Shopping Barrancas de Belgrano', type: 'mall' },
    { name: 'Barrio Chino Gastronómico', type: 'restaurant' },
    { name: 'Barrancas de Belgrano', type: 'park' },
    { name: 'SportClub Belgrano', type: 'gym' }
  ],
  Catalinas: [
    { name: 'Escuela Presidente Roca', type: 'school' },
    { name: 'Hospital Argerich', type: 'hospital' },
    { name: 'Farmacity Leandro Alem', type: 'pharmacy' },
    { name: 'Estación Retiro (Trenes y Subte C)', type: 'transport' },
    { name: 'Estación L.N. Alem (Subte B)', type: 'transport' },
    { name: 'Coto Retiro', type: 'market' },
    { name: 'Galerías Pacífico', type: 'mall' },
    { name: 'Puerto Cristal Restaurante', type: 'restaurant' },
    { name: 'Plaza San Martín', type: 'park' },
    { name: 'Megatlon Catalinas', type: 'gym' }
  ],
  'Puerto Madero': [
    { name: 'Colegio ORT Madero', type: 'school' },
    { name: 'Universidad Católica Argentina (UCA)', type: 'university' },
    { name: 'Hospital Argerich', type: 'hospital' },
    { name: 'Farmacity Juana Manso', type: 'pharmacy' },
    { name: 'Estación Retiro (Trenes)', type: 'transport' },
    { name: 'Metrobus Madero', type: 'transport' },
    { name: 'Disco Puerto Madero', type: 'market' },
    { name: 'Cabaña Las Lilas', type: 'restaurant' },
    { name: 'Reserva Ecológica Costanera Sur', type: 'park' },
    { name: 'Puente de la Mujer', type: 'park' },
    { name: 'Megatlon Madero', type: 'gym' }
  ],
  'Playa Grande': [
    { name: 'Mar del Plata Day School', type: 'school' },
    { name: 'Clínica Colón', type: 'hospital' },
    { name: 'Farmacia Playa Grande', type: 'pharmacy' },
    { name: 'Terminal de Ómnibus Mar del Plata', type: 'transport' },
    { name: 'Supermercado Toledo Güemes', type: 'market' },
    { name: 'Los Gallegos Shopping', type: 'mall' },
    { name: 'Torreón del Monje', type: 'restaurant' },
    { name: 'Plaza España', type: 'park' },
    { name: 'Balneario Playa Grande', type: 'park' },
    { name: 'SportClub Güemes', type: 'gym' }
  ],
  'La Lonja': [
    { name: 'Colegio del Sol Pilar', type: 'school' },
    { name: 'Hospital Universitario Austral', type: 'hospital' },
    { name: 'Farmacia del Pueblo La Lonja', type: 'pharmacy' },
    { name: 'Estación Del Viso (Belgrano Norte)', type: 'transport' },
    { name: 'Carrefour Pilar', type: 'market' },
    { name: 'Torres del Sol Shopping', type: 'mall' },
    { name: 'La Cabaña de Pilar', type: 'restaurant' },
    { name: 'Parque Municipal de Pilar', type: 'park' },
    { name: 'SportClub Pilar', type: 'gym' }
  ],
  Nordelta: [
    { name: 'Colegio Northlands Nordelta', type: 'school' },
    { name: "St. Matthew's College Norte", type: 'school' },
    { name: 'Hospital Central de Nordelta (CEMEDA)', type: 'hospital' },
    { name: 'Farmacia Nordelta Centro', type: 'pharmacy' },
    { name: 'Estación Fluvial Nordelta', type: 'transport' },
    { name: 'Acceso Panamericana Ramal Tigre', type: 'transport' },
    { name: 'Jumbo Nordelta', type: 'market' },
    { name: 'Nordelta Centro Comercial', type: 'mall' },
    { name: 'La Bourgogne Nordelta', type: 'restaurant' },
    { name: 'Reserva Bahía Grande', type: 'park' },
    { name: 'Megatlon Nordelta', type: 'gym' }
  ],
  'Santa Bárbara': [
    { name: 'Colegio Michael Ham', type: 'school' },
    { name: 'Hospital de Tigre', type: 'hospital' },
    { name: 'Farmacia Santa Bárbara', type: 'pharmacy' },
    { name: 'Estación Tigre (Tren Mitre)', type: 'transport' },
    { name: 'Jumbo Nordelta', type: 'market' },
    { name: 'Nordelta Centro Comercial', type: 'mall' },
    { name: 'Il Novo María del Luján', type: 'restaurant' },
    { name: 'Reserva Natural Villa Nueva', type: 'park' },
    { name: 'Megatlon Nordelta', type: 'gym' }
  ],
  'Mapuche Country Club': [
    { name: 'Colegio San Andrés Pilar', type: 'school' },
    { name: 'Hospital Universitario Austral', type: 'hospital' },
    { name: 'Farmacia del Country', type: 'pharmacy' },
    { name: 'Acceso Panamericana Km 50 (Pilar)', type: 'transport' },
    { name: 'Jumbo Pilar', type: 'market' },
    { name: 'Palmas del Pilar Shopping', type: 'mall' },
    { name: 'La Cabaña de Pilar', type: 'restaurant' },
    { name: 'Mapuche Golf Club', type: 'park' },
    { name: 'Club House Mapuche · Gimnasio', type: 'gym' }
  ]
}

// -----------------------------------------------------------------------------
// Seeded PRNG (mulberry32 + string hash) — stable per property id.
// -----------------------------------------------------------------------------

function hashSeed(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// -----------------------------------------------------------------------------
// Formatting + travel time
// -----------------------------------------------------------------------------

function formatDistance(m) {
  if (m < 1000) return `${m} m`
  return `${(m / 1000).toFixed(1).replace('.', ',')} km`
}

// Argentine "cuadra" ≈ 100 m — only meaningful when it's actually walkable.
function formatBlocks(m) {
  if (m > 1200) return null
  const blocks = Math.round(m / 100)
  if (blocks < 1) return null
  return `${blocks} ${blocks === 1 ? 'cuadra' : 'cuadras'}`
}

function travelFor(m) {
  if (m <= 1200) {
    const minutes = Math.max(1, Math.round(m / 80)) // ~4.8 km/h walking
    return { mode: 'walk', minutes, label: `${minutes} min a pie` }
  }
  const minutes = Math.max(2, Math.round(m / 450)) // ~27 km/h city driving
  return { mode: 'drive', minutes, label: `${minutes} min en auto` }
}

// -----------------------------------------------------------------------------
// Location score — 1..10 from variety + quantity + proximity.
// Max is exactly 10: variety(4) + quantity(2.5) + proximity(3.5).
// Gated communities naturally land lower (far POIs, fewer categories).
// -----------------------------------------------------------------------------

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

function computeScore(pois) {
  if (!pois.length) return 0
  const categories = new Set(pois.map((p) => POI_TYPES[p.type].category))
  const avgDist = pois.reduce((s, p) => s + p.distanceMeters, 0) / pois.length

  const varietyPts = (categories.size / 5) * 4
  const quantityPts = (Math.min(pois.length, 8) / 8) * 2.5
  const proximityPts = clamp((2000 - avgDist) / (2000 - 300), 0, 1) * 3.5

  const raw = varietyPts + quantityPts + proximityPts
  return Math.round(clamp(raw, 1, 10) * 10) / 10
}

export function scoreTone(score) {
  if (score >= 8.5) return 'excellent'
  if (score >= 7) return 'good'
  if (score >= 5) return 'fair'
  return 'low'
}

const SCORE_LABELS = {
  excellent: 'Ubicación excelente',
  good: 'Muy buena ubicación',
  fair: 'Buena ubicación',
  low: 'Ubicación tranquila'
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

function fallbackPool(property) {
  const n = property.neighborhood || property.city || 'la zona'
  return [
    { name: `Escuela de ${n}`, type: 'school' },
    { name: `Centro de Salud ${n}`, type: 'hospital' },
    { name: `Farmacia ${n}`, type: 'pharmacy' },
    { name: `Parada de transporte ${n}`, type: 'transport' },
    { name: `Supermercado ${n}`, type: 'market' },
    { name: `Restaurantes de ${n}`, type: 'restaurant' },
    { name: `Plaza ${n}`, type: 'park' },
    { name: `Gimnasio ${n}`, type: 'gym' }
  ]
}

/**
 * Deterministic nearby POIs for a property. Returns everything the UI needs,
 * already grouped by category and ordered.
 */
export function getNearbyPois(property) {
  if (!property) return { score: 0, groups: [], totalCount: 0, categoryCount: 0 }

  const pool = NEIGHBORHOOD_POIS[property.neighborhood] || fallbackPool(property)
  const profile = ZONE_PROFILES[NEIGHBORHOOD_PROFILE[property.neighborhood] || 'suburban']
  const rng = mulberry32(hashSeed(property.id))

  // Fisher-Yates shuffle (seeded).
  const arr = pool.map((p) => ({ ...p }))
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  // Target count 5..7, but never fewer than the number of distinct categories
  // available (we want max variety on show).
  const target = 5 + Math.floor(rng() * 3)

  // First pass: one POI per category (variety). Second pass: fill to target.
  const selected = []
  const seenCat = new Set()
  for (const p of arr) {
    const cat = POI_TYPES[p.type].category
    if (!seenCat.has(cat)) {
      seenCat.add(cat)
      selected.push(p)
    }
  }
  for (const p of arr) {
    if (selected.length >= target) break
    if (!selected.includes(p)) selected.push(p)
  }

  // Resolve distance + travel for each.
  const resolved = selected.map((p) => {
    const meters = Math.round((profile.minDist + rng() * (profile.maxDist - profile.minDist)) / 10) * 10
    const meta = POI_TYPES[p.type]
    return {
      name: p.name,
      type: p.type,
      typeLabel: meta.label,
      category: meta.category,
      distanceMeters: meters,
      distanceLabel: formatDistance(meters),
      blocksLabel: formatBlocks(meters),
      travel: travelFor(meters)
    }
  })

  const score = computeScore(resolved)
  const tone = scoreTone(score)

  // Group by category, ordered; sort each group by distance asc.
  const groups = Object.entries(POI_CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key, meta]) => ({
      key,
      label: meta.label,
      items: resolved
        .filter((p) => p.category === key)
        .sort((a, b) => a.distanceMeters - b.distanceMeters)
    }))
    .filter((g) => g.items.length > 0)

  return {
    score,
    scoreTone: tone,
    scoreLabel: SCORE_LABELS[tone],
    scorePercent: Math.round(score * 10),
    totalCount: resolved.length,
    categoryCount: groups.length,
    groups
  }
}

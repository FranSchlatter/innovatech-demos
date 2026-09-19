// ==========================================================================
// Property valuation engine (I22) — automated appraisal from real mock data.
//
// Pure, deterministic functions: given a subject property description, it finds
// comparable SALE listings in properties.json, blends a data-anchored estimate
// with a factor-based hedonic model, and returns a price range + confidence.
//
// Everything is in USD/m² of the pricing basis (covered area for built types,
// total lot area for land). Only USD sale listings are used as comparables so
// the scale stays coherent (rent listings are ARS monthly — a different world).
// ==========================================================================

import PROPERTIES from './properties.json'

// --- Form option catalogs (shared with the UI) ---------------------------

export const PROPERTY_TYPES = [
  { key: 'apartment', label: 'Departamento' },
  { key: 'house', label: 'Casa' },
  { key: 'ph', label: 'PH' },
  { key: 'office', label: 'Oficina' },
  { key: 'commercial', label: 'Local comercial' },
  { key: 'land', label: 'Terreno' }
]

// Condition options offered in the form, each with its price multiplier.
// Labels mirror the vocabulary already used across the mock listings.
export const CONDITIONS = [
  { key: 'nueva', label: 'A estrenar', factor: 1.12 },
  { key: 'excelente', label: 'Excelente', factor: 1.06 },
  { key: 'muy-buena', label: 'Muy buena', factor: 1.0 },
  { key: 'buena', label: 'Buena', factor: 0.93 },
  { key: 'regular', label: 'Regular', factor: 0.84 },
  { key: 'refaccionar', label: 'A refaccionar', factor: 0.75 }
]

// Amenities that move the needle on price, with their marginal premium.
export const VALUATION_AMENITIES = [
  { key: 'pool', label: 'Pileta', premium: 0.03 },
  { key: 'gym', label: 'Gimnasio', premium: 0.02 },
  { key: 'sum', label: 'SUM', premium: 0.015 },
  { key: 'security', label: 'Seguridad 24h', premium: 0.025 },
  { key: 'grill', label: 'Parrilla', premium: 0.015 },
  { key: 'balcony', label: 'Balcón / terraza', premium: 0.02 },
  { key: 'storage', label: 'Baulera', premium: 0.01 },
  { key: 'laundry', label: 'Laundry', premium: 0.01 }
]

const AMENITY_CAP = 0.12 // total amenity premium is capped here

// --- Reference price grids (curated + calibrated against the mock data) ---

// Apartment-equivalent price per m² covered, in USD, for a mid-market unit
// ("Muy buena" condition, ~10 years old). Neighbourhood factors come baked in.
const NEIGHBORHOOD_BASE = {
  'Puerto Madero': 3200,
  'Catalinas': 2600,
  'Palermo': 2500,
  'Nordelta': 2400,
  'Barrio Norte': 2300,
  'Palermo Soho': 2200,
  'Las Cañitas': 2150,
  'Palermo Hollywood': 2100,
  'Santa Bárbara': 2100,
  'Belgrano': 2000,
  'Playa Grande': 2000,
  'Villa Crespo': 1950,
  'Mapuche Country Club': 1700,
  'La Lonja': 1500
}
const DEFAULT_BASE = 1900

// Land is priced on total lot area, at a much lower USD/m². Curated per zone.
const LAND_BASE = {
  'Puerto Madero': 1400,
  'Palermo': 1100,
  'Palermo Soho': 950,
  'Palermo Hollywood': 900,
  'Belgrano': 850,
  'Villa Crespo': 700,
  'Barrio Norte': 900,
  'Las Cañitas': 820,
  'Nordelta': 190,
  'Santa Bárbara': 150,
  'Mapuche Country Club': 130,
  'La Lonja': 95,
  'Playa Grande': 320,
  'Catalinas': 1300
}
const DEFAULT_LAND_BASE = 260

// Multiplier applied to the neighbourhood apartment base, per property type.
const TYPE_FACTOR = {
  apartment: 1.0,
  ph: 0.9,
  house: 0.82,
  office: 0.88,
  commercial: 0.92,
  land: 1.0 // land uses LAND_BASE directly, factor is a no-op
}

// --- Small helpers --------------------------------------------------------

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export function baseUsdM2(neighborhood) {
  return NEIGHBORHOOD_BASE[neighborhood] ?? DEFAULT_BASE
}

export function conditionFactor(conditionKey) {
  return CONDITIONS.find((c) => c.key === conditionKey)?.factor ?? 1.0
}

// Age depreciation: brand-new carries a premium, then a gentle decline with a
// floor so century homes never go to zero. ~0.5%/yr after year 0.
export function ageFactor(years) {
  const y = Math.max(0, Number(years) || 0)
  return clamp(1.06 - y * 0.005, 0.8, 1.1)
}

// Sum of the selected amenity premiums, capped.
export function amenityFactor(amenityKeys = []) {
  const total = amenityKeys.reduce((s, k) => {
    const a = VALUATION_AMENITIES.find((x) => x.key === k)
    return s + (a ? a.premium : 0)
  }, 0)
  return 1 + Math.min(AMENITY_CAP, total)
}

// The pricing basis: covered area for built types, total lot for land.
export function pricingBasis(input) {
  if (input.type === 'land') return Number(input.areaTotal) || 0
  return Number(input.areaCovered) || Number(input.areaTotal) || 0
}

// --- Comparable finder ----------------------------------------------------

// USD sale listings only — coherent with the sale valuation scale.
const SALE_POOL = PROPERTIES.filter((p) => p.operation === 'sale' && p.currency === 'USD')

function compBasisArea(p) {
  return p.type === 'land' ? p.areaTotal : (p.areaCovered || p.areaTotal)
}

function compUsdM2(p) {
  const area = compBasisArea(p)
  return area > 0 ? p.price / area : 0
}

// Similarity score in [0,1]: neighbourhood (0.42) + type (0.30) +
// area proximity (0.18) + condition proximity (0.10).
function similarity(subject, p) {
  let score = 0

  if (p.neighborhood === subject.neighborhood) score += 0.42
  else score += 0.1 // same-city fallback so cross-zone comps still rank

  if (p.type === subject.type) score += 0.3
  else if (isResidential(p.type) && isResidential(subject.type)) score += 0.12

  const subjArea = subject.type === 'land'
    ? Number(subject.areaTotal) || 0
    : Number(subject.areaCovered) || Number(subject.areaTotal) || 0
  const compArea = compBasisArea(p)
  if (subjArea > 0 && compArea > 0) {
    const diff = Math.abs(compArea - subjArea) / subjArea
    score += 0.18 * clamp(1 - diff, 0, 1)
  }

  const subjCond = CONDITIONS.find((c) => c.key === subject.condition)?.factor ?? 1
  const compCond = mapListingConditionFactor(p.condition)
  score += 0.1 * (1 - clamp(Math.abs(subjCond - compCond), 0, 1))

  return clamp(score, 0, 1)
}

function isResidential(type) {
  return type === 'apartment' || type === 'house' || type === 'ph'
}

// Map the free-text listing condition strings to our numeric factor scale.
function mapListingConditionFactor(text) {
  const t = (text || '').toLowerCase()
  if (t.includes('estrenar')) return 1.12
  if (t.includes('excelente')) return 1.06
  if (t.includes('reciclado')) return 1.03
  if (t.includes('muy bueno')) return 1.0
  if (t.includes('bueno')) return 0.93
  if (t.includes('regular')) return 0.84
  if (t.includes('refacc')) return 0.75
  return 1.0
}

// Rank the sale pool by similarity and return the top matches with metadata.
export function findComparables(subject, limit = 5) {
  return SALE_POOL
    .map((p) => ({
      property: p,
      score: similarity(subject, p),
      usdM2: compUsdM2(p),
      sameNeighborhood: p.neighborhood === subject.neighborhood,
      sameType: p.type === subject.type
    }))
    .filter((c) => c.score >= 0.35 && c.usdM2 > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

// --- Main estimator -------------------------------------------------------

export function estimateValuation(input) {
  const basis = pricingBasis(input)

  // 1) Factor-based (hedonic) model value — always available.
  const isLand = input.type === 'land'
  const base = isLand
    ? (LAND_BASE[input.neighborhood] ?? DEFAULT_LAND_BASE)
    : baseUsdM2(input.neighborhood)

  const fType = isLand ? 1 : (TYPE_FACTOR[input.type] ?? 1)
  const fCondition = isLand ? 1 : conditionFactor(input.condition)
  const fAge = isLand ? 1 : ageFactor(input.age)
  const fAmenity = isLand ? 1 : amenityFactor(input.amenities)
  const fGarage = !isLand && Number(input.garage) > 0 ? 1.04 : 1

  const modelUsdM2 = base * fType * fCondition * fAge * fAmenity * fGarage

  // 2) Comparable-anchored value.
  const comparables = findComparables(input)
  const strong = comparables.filter((c) => c.sameNeighborhood && c.sameType)
  const decent = comparables.filter((c) => c.score >= 0.5)

  let compUsdM2Value = 0
  if (comparables.length) {
    const wSum = comparables.reduce((s, c) => s + c.score, 0)
    compUsdM2Value = comparables.reduce((s, c) => s + c.usdM2 * c.score, 0) / (wSum || 1)
  }

  // How much to trust the comparables over the model. A same-neighbourhood +
  // same-type listing is a strong anchor; with a few of them we're confident.
  let blend = 0
  let confidence = 'Baja'
  if (strong.length >= 2 || (strong.length >= 1 && comparables.length >= 3)) {
    blend = 0.65
    confidence = 'Alta'
  } else if (strong.length >= 1 || decent.length >= 2) {
    blend = 0.45
    confidence = 'Media'
  } else if (comparables.length >= 1) {
    blend = 0.25
    confidence = 'Baja'
  }

  const usdM2 = comparables.length
    ? blend * compUsdM2Value + (1 - blend) * modelUsdM2
    : modelUsdM2

  // 3) Range spread narrows with confidence.
  const spread = confidence === 'Alta' ? 0.06 : confidence === 'Media' ? 0.1 : 0.15
  const central = usdM2 * basis
  const min = central * (1 - spread)
  const max = central * (1 + spread)

  return {
    valid: basis > 0 && !!input.neighborhood && !!input.type,
    basis,
    basisLabel: isLand ? 'm² de terreno' : 'm² cubiertos',
    usdM2,
    modelUsdM2,
    compUsdM2Value,
    central,
    min,
    max,
    spreadPct: spread * 100,
    confidence,
    blend,
    comparables,
    comparableCount: comparables.length,
    factors: {
      base,
      type: fType,
      condition: fCondition,
      age: fAge,
      amenity: fAmenity,
      garage: fGarage
    }
  }
}

// Currency-formatting helpers reused by the UI.
export function formatUsd(value) {
  const v = Number.isFinite(value) ? Math.round(value) : 0
  return `USD ${new Intl.NumberFormat('es-AR').format(v)}`
}

export function formatUsdM2(value) {
  const v = Number.isFinite(value) ? Math.round(value) : 0
  return `USD ${new Intl.NumberFormat('es-AR').format(v)}/m²`
}

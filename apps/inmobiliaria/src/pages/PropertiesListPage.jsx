import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Search,
  SearchX,
  LayoutGrid,
  Map,
  SlidersHorizontal,
  ChevronDown,
  BellPlus,
  CheckCircle,
  Car,
  Waves,
  Shield,
  Flame,
  Dumbbell,
  Users,
  Square,
  Sun,
  WashingMachine,
  Compass,
  Ruler
} from 'lucide-react'
import properties from '../data/properties.json'
import neighborhoods from '../data/neighborhoods.json'
import { formatPrice, formatArea, OPERATION_LABELS, TYPE_LABELS } from '../utils/format'
import PropertyCard from '../components/PropertyCard'
import PropertyMap from '../components/PropertyMap'

const CURRENT_YEAR = 2026
const ALERTS_KEY = 'inmob-portal-alerts-v2'

const OPERATION_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'temporary', label: 'Temporario' }
]

const BEDROOM_OPTIONS = [
  { value: 'any', label: 'Cualquiera' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' }
]

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'area', label: 'Mayor superficie' }
]

// Age buckets derived from yearBuilt (a "new" property is <=1yr or flagged so).
const AGE_OPTIONS = [
  { value: 'any', label: 'Antigüedad: indistinta' },
  { value: 'new', label: 'A estrenar' },
  { value: '1-5', label: '1 a 5 años' },
  { value: '5-10', label: '5 a 10 años' },
  { value: '10-20', label: '10 a 20 años' },
  { value: '20+', label: 'Más de 20 años' }
]

const GARAGE_OPTIONS = [
  { value: 'any', label: 'Indistinto' },
  { value: 'yes', label: 'Con cochera' },
  { value: 'no', label: 'Sin cochera' }
]

const ORIENTATION_OPTIONS = [
  { value: 'any', label: 'Orientación: indistinta' },
  { value: 'Norte', label: 'Norte' },
  { value: 'Sur', label: 'Sur' },
  { value: 'Este', label: 'Este' },
  { value: 'Oeste', label: 'Oeste' }
]

// Canonical amenities with keyword matchers against the free-form amenity strings.
const AMENITIES = [
  { key: 'pool', label: 'Pileta', icon: Waves, kw: ['pileta', 'piscina'] },
  { key: 'security', label: 'Seguridad', icon: Shield, kw: ['seguridad', 'portería', 'porteria', 'cctv', 'concierge', 'vigilancia'] },
  { key: 'grill', label: 'Parrilla', icon: Flame, kw: ['parrilla', 'quincho'] },
  { key: 'gym', label: 'Gym', icon: Dumbbell, kw: ['gimnasio', 'gym'] },
  { key: 'sum', label: 'SUM', icon: Users, kw: ['sum', 'club house', 'amenities'] },
  { key: 'balcony', label: 'Balcón', icon: Square, kw: ['balcón', 'balcon'] },
  { key: 'terrace', label: 'Terraza', icon: Sun, kw: ['terraza', 'solárium', 'solarium'] },
  { key: 'laundry', label: 'Lavadero', icon: WashingMachine, kw: ['laundry', 'lavadero'] }
]

// Superficie total range across the dataset (drives the visual track bounds).
const AREA_MIN = 0
const AREA_MAX = 1200

function propHasAmenity(p, key) {
  const def = AMENITIES.find((a) => a.key === key)
  if (!def) return false
  const list = (p.amenities || []).map((a) => a.toLowerCase())
  return list.some((a) => def.kw.some((k) => a.includes(k)))
}

function matchesAge(p, bucket) {
  if (bucket === 'any') return true
  const isNew = p.condition === 'A estrenar'
  const age = p.yearBuilt ? CURRENT_YEAR - p.yearBuilt : null
  switch (bucket) {
    case 'new':
      return isNew || (age !== null && age <= 1)
    case '1-5':
      return age !== null && age >= 1 && age <= 5
    case '5-10':
      return age !== null && age > 5 && age <= 10
    case '10-20':
      return age !== null && age > 10 && age <= 20
    case '20+':
      return age !== null && age > 20
    default:
      return true
  }
}

// Ray-casting point-in-polygon. Marker position is (lng=x, lat=y) in map %.
function pointInPolygon(x, y, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x
    const yi = poly[i].y
    const xj = poly[j].x
    const yj = poly[j].y
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

export default function PropertiesListPage({ initialFilter, favorites, onSelectProperty, onBack }) {
  const [operation, setOperation] = useState('all')
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('any')
  const [neighborhood, setNeighborhood] = useState('all')
  const [sort, setSort] = useState('relevance')
  const [viewMode, setViewMode] = useState('grid')
  const [activeId, setActiveId] = useState(null)

  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [areaMin, setAreaMin] = useState('')
  const [areaMax, setAreaMax] = useState('')
  const [age, setAge] = useState('any')
  const [garage, setGarage] = useState('any')
  const [orientation, setOrientation] = useState('any')
  const [amenities, setAmenities] = useState([])

  // Drawn zone of interest (polygon of {x,y} map %), applied via point-in-polygon
  const [zone, setZone] = useState(null)

  const [toast, setToast] = useState(null)
  const listRef = useRef(null)

  // Seed filters from hero search on mount
  useEffect(() => {
    if (!initialFilter) return
    if (initialFilter.operation) setOperation(initialFilter.operation)
    if (initialFilter.type) setType(initialFilter.type)
    if (initialFilter.query) setQuery(initialFilter.query)
  }, [initialFilter])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const toggleAmenity = (key) =>
    setAmenities((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  const resetFilters = () => {
    setOperation('all')
    setType('all')
    setQuery('')
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('any')
    setNeighborhood('all')
    setSort('relevance')
    setAreaMin('')
    setAreaMax('')
    setAge('any')
    setGarage('any')
    setOrientation('any')
    setAmenities([])
    setZone(null)
  }

  // Count of active advanced filters (for the "Más filtros" badge)
  const advancedCount = useMemo(() => {
    let n = 0
    if (areaMin !== '' || areaMax !== '') n++
    if (age !== 'any') n++
    if (garage !== 'any') n++
    if (orientation !== 'any') n++
    if (amenities.length) n++
    return n
  }, [areaMin, areaMax, age, garage, orientation, amenities])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)
    const minBeds = bedrooms === 'any' ? null : Number(bedrooms)
    const aMin = areaMin === '' ? null : Number(areaMin)
    const aMax = areaMax === '' ? null : Number(areaMax)

    let list = properties.filter((p) => {
      if (operation !== 'all' && p.operation !== operation) return false
      if (type !== 'all' && p.type !== type) return false
      if (neighborhood !== 'all' && p.neighborhood !== neighborhood) return false
      if (minBeds !== null && (p.bedrooms || 0) < minBeds) return false
      if (min !== null && p.price < min) return false
      if (max !== null && p.price > max) return false
      if (aMin !== null && (p.areaTotal || 0) < aMin) return false
      if (aMax !== null && (p.areaTotal || 0) > aMax) return false
      if (!matchesAge(p, age)) return false
      if (garage === 'yes' && !(p.garage > 0)) return false
      if (garage === 'no' && p.garage > 0) return false
      if (orientation !== 'any' && !(p.orientation || '').toLowerCase().includes(orientation.toLowerCase()))
        return false
      if (amenities.length && !amenities.every((k) => propHasAmenity(p, k))) return false
      if (zone && zone.length >= 3 && !pointInPolygon(p.lng, p.lat, zone)) return false
      if (q) {
        const haystack = `${p.title} ${p.address} ${p.neighborhood} ${p.city}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'newest':
          return new Date(b.publishedAt) - new Date(a.publishedAt)
        case 'area':
          return (b.areaTotal || 0) - (a.areaTotal || 0)
        case 'relevance':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })

    return list
  }, [
    operation,
    type,
    query,
    minPrice,
    maxPrice,
    bedrooms,
    neighborhood,
    sort,
    areaMin,
    areaMax,
    age,
    garage,
    orientation,
    amenities,
    zone
  ])

  // Click a map marker → highlight + scroll the matching row in the list column.
  const focusInList = (p) => {
    setActiveId(p.id)
    const el = document.getElementById(`maprow-${p.id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // Persist the current search as a portal alert (read later by ClientPortal).
  const saveAsAlert = () => {
    const criteria = {
      operation: operation === 'all' ? 'sale' : operation,
      types: type === 'all' ? [] : [type],
      neighborhoods: neighborhood === 'all' ? [] : [neighborhood],
      currency: '', // any currency
      min: minPrice === '' ? '' : Number(minPrice),
      max: maxPrice === '' ? '' : Number(maxPrice),
      minRooms: bedrooms === 'any' ? 0 : Number(bedrooms),
      minArea: areaMin === '' ? '' : Number(areaMin)
    }

    const opLabel = OPERATION_LABELS[criteria.operation] || 'Venta'
    const typePart = type === 'all' ? 'Propiedades' : `${TYPE_LABELS[type]}s`
    const zonePart = neighborhood === 'all' ? '' : ` en ${neighborhood}`
    const alert = {
      id: `A-${Date.now()}`,
      name: `${typePart} en ${opLabel.toLowerCase()}${zonePart}`,
      criteria,
      active: true,
      seenIds: []
    }

    try {
      const saved = localStorage.getItem(ALERTS_KEY)
      const arr = saved ? JSON.parse(saved) : []
      const next = Array.isArray(arr) ? [...arr, alert] : [alert]
      localStorage.setItem(ALERTS_KEY, JSON.stringify(next))
      setToast({ key: Date.now(), message: 'Búsqueda guardada como alerta en tu portal', tone: 'success' })
    } catch {
      setToast({ key: Date.now(), message: 'No se pudo guardar la alerta', tone: 'muted' })
    }
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent'

  // Visual span for the superficie track (clamped to dataset bounds).
  const trackLeft = (Number(areaMin || AREA_MIN) / AREA_MAX) * 100
  const trackRight = 100 - (Number(areaMax || AREA_MAX) / AREA_MAX) * 100

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h1 className="heading-md">Propiedades</h1>
          <p className="text-muted text-sm mt-1">
            {results.length}{' '}
            {results.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            {zone && zone.length >= 3 && (
              <span className="ml-2 inline-flex items-center gap-1 text-accent font-medium">
                · zona dibujada
                <button onClick={() => setZone(null)} className="underline hover:no-underline">
                  quitar
                </button>
              </span>
            )}
          </p>
        </div>

        <button
          onClick={saveAsAlert}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-semibold text-text hover:border-accent transition-colors"
        >
          <BellPlus className="w-4 h-4 text-accent" /> Guardar como alerta
        </button>
      </div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-surface border border-border rounded-xl p-4 mb-6"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-text mb-4">
          <SlidersHorizontal className="w-4 h-4 text-accent" /> Filtros
          <button
            onClick={resetFilters}
            className="ml-auto text-xs font-medium text-muted hover:text-accent transition-colors"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Operation segmented */}
        <div className="flex flex-wrap gap-2 mb-4">
          {OPERATION_FILTERS.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                operation === op.value
                  ? 'bg-primary text-primary-contrast'
                  : 'bg-surface-alt text-muted hover:text-text'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        {/* Grid of controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            <option value="all">Todos los tipos</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={inputClass}
          >
            <option value="all">Todos los barrios</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={inputClass}
          >
            {BEDROOM_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.value === 'any' ? 'Dormitorios: cualquiera' : `${b.label} dormitorios`}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Precio mín"
            className={inputClass}
          />

          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Precio máx"
            className={inputClass}
          />

          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, barrio o dirección"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:opacity-80 transition-opacity"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          {showAdvanced ? 'Menos filtros' : 'Más filtros'}
          {advancedCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-primary-contrast text-[11px] font-bold">
              {advancedCount}
            </span>
          )}
        </button>

        <AnimatePresence initial={false}>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-border grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Superficie total */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-text mb-2">
                    <Ruler className="w-3.5 h-3.5 text-accent" /> Superficie total (m²)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={areaMin}
                      onChange={(e) => setAreaMin(e.target.value)}
                      placeholder="Mín"
                      className={inputClass}
                    />
                    <span className="text-muted text-sm">–</span>
                    <input
                      type="number"
                      min={0}
                      value={areaMax}
                      onChange={(e) => setAreaMax(e.target.value)}
                      placeholder="Máx"
                      className={inputClass}
                    />
                  </div>
                  {/* Visual span track */}
                  <div className="relative h-1.5 mt-3 rounded-full bg-border">
                    <div
                      className="absolute h-1.5 rounded-full bg-accent"
                      style={{
                        left: `${Math.max(0, Math.min(100, trackLeft))}%`,
                        right: `${Math.max(0, Math.min(100, trackRight))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted mt-1">
                    <span>{AREA_MIN} m²</span>
                    <span>{AREA_MAX}+ m²</span>
                  </div>
                </div>

                {/* Age + Garage + Orientation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-text mb-2 block">Antigüedad</label>
                    <select value={age} onChange={(e) => setAge(e.target.value)} className={inputClass}>
                      {AGE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-text mb-2">
                      <Car className="w-3.5 h-3.5 text-accent" /> Cochera
                    </label>
                    <select value={garage} onChange={(e) => setGarage(e.target.value)} className={inputClass}>
                      {GARAGE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-text mb-2">
                      <Compass className="w-3.5 h-3.5 text-accent" /> Orientación
                    </label>
                    <select
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value)}
                      className={inputClass}
                    >
                      {ORIENTATION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amenities checklist */}
                <div className="lg:col-span-2">
                  <label className="text-xs font-semibold text-text mb-2 block">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.map((a) => {
                      const on = amenities.includes(a.key)
                      const Icon = a.icon
                      return (
                        <button
                          key={a.key}
                          onClick={() => toggleAmenity(a.key)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            on
                              ? 'bg-accent text-primary-contrast border-accent'
                              : 'bg-surface-alt text-muted border-border hover:text-text'
                          }`}
                        >
                          <Icon className="w-4 h-4" /> {a.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sort + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-contrast'
                : 'bg-surface text-muted hover:bg-surface-alt'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Grilla
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              viewMode === 'map'
                ? 'bg-primary text-primary-contrast'
                : 'bg-surface text-muted hover:bg-surface-alt'
            }`}
          >
            <Map className="w-4 h-4" /> Mapa
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 && viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center text-center py-24"
        >
          <SearchX className="w-12 h-12 text-muted mb-4" />
          <p className="text-lg font-semibold text-text mb-2">
            No encontramos propiedades con esos filtros
          </p>
          <p className="text-muted text-sm mb-6">
            Probá ajustar los criterios de búsqueda para ver más resultados.
          </p>
          <button onClick={resetFilters} className="btn-secondary">
            Limpiar filtros
          </button>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isFavorite={favorites?.isFavorite(p.id)}
              onToggleFavorite={favorites?.toggleFavorite}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map — on mobile stacked on top */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-28">
              <PropertyMap
                properties={results}
                activeId={activeId}
                onSelect={focusInList}
                onOpen={(p) => onSelectProperty?.(p, 'details')}
                zone={zone}
                onCommitZone={(poly) => setZone(poly)}
                onClearZone={() => setZone(null)}
                height="h-[420px] lg:h-[600px]"
              />
            </div>
          </div>

          {/* Scrollable result rows */}
          <div
            ref={listRef}
            className="order-2 lg:order-1 max-h-[600px] overflow-auto pr-1 space-y-3"
          >
            {results.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-xl">
                <SearchX className="w-10 h-10 text-muted mb-3" />
                <p className="text-sm font-semibold text-text">Sin propiedades para estos filtros</p>
                <button onClick={resetFilters} className="mt-3 text-sm text-accent hover:underline">
                  Limpiar filtros
                </button>
              </div>
            )}
            {results.map((p) => {
              const active = p.id === activeId
              return (
                <button
                  key={p.id}
                  id={`maprow-${p.id}`}
                  onMouseEnter={() => setActiveId(p.id)}
                  onFocus={() => setActiveId(p.id)}
                  onClick={() => {
                    setActiveId(p.id)
                    onSelectProperty?.(p, 'details')
                  }}
                  className={`w-full text-left flex gap-3 p-3 rounded-xl border transition-colors ${
                    active
                      ? 'border-accent bg-surface-alt'
                      : 'border-border bg-surface hover:bg-surface-alt'
                  }`}
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    loading="lazy"
                    className="w-24 h-20 rounded-lg object-cover flex-shrink-0 bg-surface-alt"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-surface-alt text-text font-medium">
                        {OPERATION_LABELS[p.operation]}
                      </span>
                      <span className="truncate">{p.neighborhood}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-primary line-clamp-1">{p.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-accent">
                        {formatPrice(p.price, p.currency, p.operation)}
                      </span>
                      <span className="text-xs text-muted">
                        {formatArea(p.areaCovered || p.areaTotal)}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-surface border border-border shadow-medium"
          >
            <CheckCircle className={`w-5 h-5 ${toast.tone === 'muted' ? 'text-muted' : 'text-success'}`} />
            <span className="text-sm font-medium text-text">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

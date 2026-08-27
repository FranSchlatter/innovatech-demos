import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, SearchX, LayoutGrid, Map, SlidersHorizontal } from 'lucide-react'
import properties from '../data/properties.json'
import neighborhoods from '../data/neighborhoods.json'
import { formatPrice, formatArea, OPERATION_LABELS, TYPE_LABELS } from '../utils/format'
import PropertyCard from '../components/PropertyCard'
import PropertyMap from '../components/PropertyMap'

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

  // Seed filters from hero search on mount
  useEffect(() => {
    if (!initialFilter) return
    if (initialFilter.operation) setOperation(initialFilter.operation)
    if (initialFilter.type) setType(initialFilter.type)
    if (initialFilter.query) setQuery(initialFilter.query)
  }, [initialFilter])

  const resetFilters = () => {
    setOperation('all')
    setType('all')
    setQuery('')
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('any')
    setNeighborhood('all')
    setSort('relevance')
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)
    const minBeds = bedrooms === 'any' ? null : Number(bedrooms)

    let list = properties.filter((p) => {
      if (operation !== 'all' && p.operation !== operation) return false
      if (type !== 'all' && p.type !== type) return false
      if (neighborhood !== 'all' && p.neighborhood !== neighborhood) return false
      if (minBeds !== null && (p.bedrooms || 0) < minBeds) return false
      if (min !== null && p.price < min) return false
      if (max !== null && p.price > max) return false
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
  }, [operation, type, query, minPrice, maxPrice, bedrooms, neighborhood, sort])

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent'

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
          </p>
        </div>
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
      {results.length === 0 ? (
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
                onSelect={(p) => {
                  setActiveId(p.id)
                  onSelectProperty?.(p, 'details')
                }}
                height="h-[420px] lg:h-[600px]"
              />
            </div>
          </div>

          {/* Scrollable result rows */}
          <div className="order-2 lg:order-1 max-h-[600px] overflow-auto pr-1 space-y-3">
            {results.map((p) => {
              const active = p.id === activeId
              return (
                <button
                  key={p.id}
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
    </div>
  )
}

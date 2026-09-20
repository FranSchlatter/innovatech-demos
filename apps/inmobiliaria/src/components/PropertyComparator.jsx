import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Scale,
  Eye,
  CalendarPlus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  Info,
  MoveHorizontal
} from 'lucide-react'
import {
  formatPrice,
  formatArea,
  OPERATION_LABELS,
  TYPE_LABELS,
  STATUS_LABELS
} from '../utils/format'

const CURRENT_YEAR = 2026

// Read a numeric field, treating missing/zero-as-absent consistently. `zeroOk`
// keeps a real 0 (e.g. 0 expensas) as a comparable value instead of "—".
function num(value, zeroOk = false) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  if (value === 0 && !zeroOk) return null
  return value
}

function pricePerM2(p) {
  const area = p.areaCovered || p.areaTotal
  if (!area || !p.price) return null
  return Math.round(p.price / area)
}

function ageYears(p) {
  if (!p.yearBuilt) return null
  return Math.max(0, CURRENT_YEAR - p.yearBuilt)
}

function ageLabel(p) {
  if (p.condition === 'A estrenar') return 'A estrenar'
  const y = ageYears(p)
  if (y === null) return '—'
  if (y <= 1) return 'A estrenar'
  return `${y} ${y === 1 ? 'año' : 'años'}`
}

// The comparison rows. `better` decides which extreme wins; `kind:'cat'` rows are
// categorical (no winner). `get` returns the comparable number, `render` the cell text.
const ROWS = [
  { key: 'operation', label: 'Operación', kind: 'cat', render: (p) => OPERATION_LABELS[p.operation] || '—' },
  { key: 'type', label: 'Tipo', kind: 'cat', render: (p) => TYPE_LABELS[p.type] || '—' },
  { key: 'neighborhood', label: 'Barrio', kind: 'cat', render: (p) => `${p.neighborhood}, ${p.city}` },
  {
    key: 'price',
    label: 'Precio',
    better: 'low',
    guard: 'price',
    get: (p) => num(p.price),
    render: (p) => formatPrice(p.price, p.currency, p.operation)
  },
  {
    key: 'pricem2',
    label: 'Precio / m²',
    better: 'low',
    guard: 'price',
    get: (p) => pricePerM2(p),
    render: (p) => {
      const v = pricePerM2(p)
      return v ? formatPrice(v, p.currency, 'sale') : '—'
    }
  },
  { key: 'areaTotal', label: 'Superficie total', better: 'high', get: (p) => num(p.areaTotal), render: (p) => formatArea(p.areaTotal) },
  { key: 'areaCovered', label: 'Superficie cubierta', better: 'high', get: (p) => num(p.areaCovered), render: (p) => formatArea(p.areaCovered) },
  { key: 'rooms', label: 'Ambientes', better: 'high', get: (p) => num(p.rooms), render: (p) => (p.rooms ? String(p.rooms) : '—') },
  { key: 'bedrooms', label: 'Dormitorios', better: 'high', get: (p) => num(p.bedrooms), render: (p) => (p.bedrooms ? String(p.bedrooms) : '—') },
  { key: 'bathrooms', label: 'Baños', better: 'high', get: (p) => num(p.bathrooms), render: (p) => (p.bathrooms ? String(p.bathrooms) : '—') },
  { key: 'garage', label: 'Cochera', better: 'high', get: (p) => num(p.garage, true), render: (p) => (p.garage > 0 ? `${p.garage}` : 'No') },
  { key: 'age', label: 'Antigüedad', better: 'high', get: (p) => (p.yearBuilt ? p.yearBuilt : null), render: (p) => ageLabel(p) },
  { key: 'orientation', label: 'Orientación', kind: 'cat', render: (p) => p.orientation || '—' },
  { key: 'condition', label: 'Estado', kind: 'cat', render: (p) => p.condition || '—' },
  { key: 'status', label: 'Disponibilidad', kind: 'cat', render: (p) => STATUS_LABELS[p.status] || '—' },
  { key: 'expenses', label: 'Expensas', better: 'low', get: (p) => num(p.expenses, true), render: (p) => (p.expenses ? `$${new Intl.NumberFormat('es-AR').format(p.expenses)}` : 'Sin expensas') },
  { key: 'amenities', label: 'Amenities', better: 'high', get: (p) => (p.amenities?.length ? p.amenities.length : null), render: (p) => (p.amenities?.length ? String(p.amenities.length) : '—') }
]

const GAP_THRESHOLD = 0.2 // 20% spread flags the worst value.

/**
 * Compute winners/losers per row across the compared properties.
 * - Winners: values matching the best extreme (min for `low`, max for `high`).
 * - Losers: the worst value(s), but only flagged when the spread from best
 *   exceeds 20% — a meaningful gap, not noise.
 * `priceComparable` gates the price rows: comparing a USD sale against an ARS
 * monthly rent is apples-to-oranges, so we don't crown a winner there.
 */
function analyzeRow(row, props, priceComparable) {
  if (row.kind === 'cat') return { winners: new Set(), losers: new Set() }
  if (row.guard === 'price' && !priceComparable) return { winners: new Set(), losers: new Set() }

  const vals = props.map((p) => row.get(p))
  const valid = vals.filter((v) => v !== null)
  if (valid.length < 2) return { winners: new Set(), losers: new Set() }

  const best = row.better === 'low' ? Math.min(...valid) : Math.max(...valid)
  const worst = row.better === 'low' ? Math.max(...valid) : Math.min(...valid)
  if (best === worst) return { winners: new Set(), losers: new Set() } // all equal

  const winners = new Set()
  const losers = new Set()
  const gap = best > 0 ? Math.abs(worst - best) / best : Infinity
  vals.forEach((v, i) => {
    if (v === null) return
    if (v === best) winners.add(i)
    else if (v === worst && gap > GAP_THRESHOLD) losers.add(i)
  })
  return { winners, losers }
}

export default function PropertyComparator({ open, properties = [], onClose, onRemove, onSelectProperty }) {
  const props = properties.slice(0, 4)
  const n = props.length

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    // Lock body scroll while the comparator is open.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  // Price rows only crown a winner when every property shares currency + operation.
  const priceComparable = useMemo(() => {
    if (n < 2) return false
    return new Set(props.map((p) => `${p.currency}|${p.operation}`)).size === 1
  }, [props, n])

  const analysis = useMemo(
    () => ROWS.map((row) => analyzeRow(row, props, priceComparable)),
    [props, priceComparable]
  )

  // label col + one column per property; wide on desktop, scroll-swipe on mobile.
  const gridTemplateColumns = `minmax(116px, 132px) repeat(${n}, minmax(172px, 1fr))`

  return (
    <AnimatePresence>
      {open && n > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[95vh] bg-surface rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3.5 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Scale className="w-5 h-5 text-accent shrink-0" />
                <span className="font-semibold text-primary truncate">Comparar propiedades</span>
                <span className="hidden sm:inline text-muted text-sm">· {n} seleccionadas</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar comparador"
                className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-alt transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Swipe hint (mobile, when it overflows) */}
            {n > 1 && (
              <div className="md:hidden flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-muted bg-surface-alt border-b border-border shrink-0">
                <MoveHorizontal className="w-3.5 h-3.5" /> Deslizá para ver todas las propiedades
              </div>
            )}

            {/* Comparison grid */}
            <div className="overflow-auto flex-1">
              {/* Header row: photo + title + price + actions */}
              <div
                className="grid sticky top-0 z-20 bg-surface border-b border-border"
                style={{ gridTemplateColumns }}
              >
                <div className="sticky left-0 z-10 bg-surface border-r border-border" />
                {props.map((p) => {
                  const unavailable = p.status !== 'available'
                  return (
                    <div key={p.id} className="p-3 border-r border-border last:border-r-0 flex flex-col">
                      <div className="relative rounded-lg overflow-hidden aspect-[3/2] bg-surface-alt mb-2.5">
                        <img
                          src={p.images?.[0]}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide bg-primary text-primary-contrast rounded">
                          {OPERATION_LABELS[p.operation]}
                        </span>
                        <button
                          onClick={() => onRemove?.(p.id)}
                          aria-label="Quitar de la comparación"
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-md bg-black/60 text-white hover:bg-error transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h3 className="text-sm font-semibold text-primary line-clamp-2 min-h-[2.5rem]">{p.title}</h3>
                      <div className="text-base font-bold text-accent mt-1">
                        {formatPrice(p.price, p.currency, p.operation)}
                      </div>
                      <div className="flex gap-1.5 mt-2.5">
                        <button
                          onClick={() => {
                            onClose()
                            onSelectProperty?.(p, 'details')
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary text-primary-contrast text-[11px] font-semibold hover:bg-accent transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver
                        </button>
                        <button
                          onClick={() => {
                            onClose()
                            onSelectProperty?.(p, 'schedule')
                          }}
                          disabled={unavailable}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md border border-primary text-primary text-[11px] font-semibold hover:bg-primary hover:text-primary-contrast transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" /> Agendar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Metric rows */}
              {ROWS.map((row, ri) => {
                const { winners, losers } = analysis[ri]
                return (
                  <div
                    key={row.key}
                    className={`grid border-b border-border last:border-b-0 ${ri % 2 ? 'bg-surface-alt' : 'bg-surface'}`}
                    style={{ gridTemplateColumns }}
                  >
                    <div
                      className={`sticky left-0 z-10 px-3 py-2.5 text-xs font-semibold text-muted border-r border-border flex items-center ${ri % 2 ? 'bg-surface-alt' : 'bg-surface'}`}
                    >
                      {row.label}
                    </div>
                    {props.map((p, ci) => {
                      const win = winners.has(ci)
                      const lose = losers.has(ci)
                      return (
                        <div
                          key={p.id}
                          className="px-3 py-2.5 border-r border-border last:border-r-0 flex items-start gap-1.5 text-sm"
                        >
                          {win && <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />}
                          {lose && (row.better === 'low' ? <ArrowUp className="w-4 h-4 text-error shrink-0 mt-0.5" /> : <ArrowDown className="w-4 h-4 text-error shrink-0 mt-0.5" />)}
                          <span className={win ? 'font-bold text-success' : lose ? 'font-semibold text-error' : 'text-text'}>
                            {row.render(p)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              })}

              {/* Amenities detail row (full list, not comparable) */}
              <div className="grid border-t border-border" style={{ gridTemplateColumns }}>
                <div className="sticky left-0 z-10 px-3 py-2.5 text-xs font-semibold text-muted border-r border-border bg-surface flex items-start">
                  Detalle amenities
                </div>
                {props.map((p) => (
                  <div key={p.id} className="px-3 py-2.5 border-r border-border last:border-r-0 bg-surface">
                    {p.amenities?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {p.amenities.map((a) => (
                          <span
                            key={a}
                            className="px-1.5 py-0.5 rounded bg-surface-alt text-[11px] text-text border border-border"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-t border-border text-xs text-muted shrink-0">
              <Info className="w-4 h-4 text-accent shrink-0" />
              {priceComparable ? (
                <span>
                  <span className="text-success font-semibold">Verde</span> = mejor valor ·{' '}
                  <span className="text-error font-semibold">rojo</span> = diferencia mayor al 20%
                </span>
              ) : (
                <span>
                  Las propiedades tienen distinta operación o moneda: el precio no se marca como
                  &quot;mejor valor&quot; para no comparar peras con manzanas.
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Pencil, X, Check, Undo2 } from 'lucide-react'
import { formatPrice, formatArea, OPERATION_LABELS } from '../utils/format'

// Marker color per operation type (real Tailwind palette so alpha/fills render;
// the theme colors are `var()` plain and drop opacity modifiers in this app).
const OP_STYLE = {
  sale: { pin: 'text-blue-600', dot: 'bg-blue-600', ring: 'ring-blue-600' },
  rent: { pin: 'text-emerald-600', dot: 'bg-emerald-600', ring: 'ring-emerald-600' },
  temporary: { pin: 'text-orange-500', dot: 'bg-orange-500', ring: 'ring-orange-500' }
}

const LEGEND = [
  { op: 'sale', label: 'Venta' },
  { op: 'rent', label: 'Alquiler' },
  { op: 'temporary', label: 'Temporario' }
]

// Distance (in map %) below which a click on the first vertex closes the polygon.
const CLOSE_THRESHOLD = 5

/**
 * Stylized interactive mock map. Property `lat` (top %) and `lng` (left %) are
 * 0-100 values used to position pins over a decorative Santa Fe-style grid (no
 * external map lib). Supports:
 *  - operation-colored markers with hover tooltip (photo + title + price)
 *  - click a marker → highlight + scroll the matching list row (onSelect)
 *  - "Ver ficha" inside the tooltip → open the detail page (onOpen)
 *  - draw a polygon zone of interest → parent filters via point-in-polygon
 */
export default function PropertyMap({
  properties = [],
  activeId,
  onSelect,
  onOpen,
  height = 'h-[420px]',
  zone = null,
  onCommitZone,
  onClearZone
}) {
  const surfaceRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [pts, setPts] = useState([])

  const startDraw = () => {
    onClearZone?.()
    setPts([])
    setDrawing(true)
  }

  const cancelDraw = () => {
    setDrawing(false)
    setPts([])
  }

  const commit = useCallback(
    (points) => {
      if (points.length < 3) return
      onCommitZone?.(points)
      setDrawing(false)
      setPts([])
    },
    [onCommitZone]
  )

  const handleSurfaceClick = (e) => {
    if (!drawing || !surfaceRef.current) return
    const rect = surfaceRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Clicking near the first vertex closes the polygon.
    if (pts.length >= 3) {
      const d = Math.hypot(x - pts[0].x, y - pts[0].y)
      if (d < CLOSE_THRESHOLD) {
        commit(pts)
        return
      }
    }
    setPts((prev) => [...prev, { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) }])
  }

  const activePolygon = zone && zone.length >= 3 ? zone : null
  const toPointsStr = (arr) => arr.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div
      className={`relative w-full ${height} rounded-xl overflow-hidden border border-border bg-surface-alt`}
    >
      {/* Decorative map grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />
      {/* Fake "streets" */}
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-1/3 h-3 bg-surface" />
        <div className="absolute left-0 right-0 top-2/3 h-2 bg-surface" />
        <div className="absolute top-0 bottom-0 left-1/4 w-3 bg-surface" />
        <div className="absolute top-0 bottom-0 left-2/3 w-2 bg-surface" />
      </div>

      {/* Click surface (captures polygon points while drawing) */}
      <div
        ref={surfaceRef}
        onClick={handleSurfaceClick}
        className={`absolute inset-0 ${drawing ? 'cursor-crosshair' : 'pointer-events-none'}`}
      />

      {/* Zone polygon (committed + in-progress) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {activePolygon && (
          <polygon
            points={toPointsStr(activePolygon)}
            fill="var(--color-accent)"
            fillOpacity={0.16}
            stroke="var(--color-accent)"
            strokeWidth={2}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {drawing && pts.length >= 2 && (
          <polyline
            points={toPointsStr(pts)}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
            strokeDasharray="4 3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {/* In-progress vertices (divs avoid the SVG non-uniform-scale distortion) */}
      {drawing &&
        pts.map((p, i) => (
          <div
            key={i}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow ${
              i === 0 && pts.length >= 3 ? 'bg-accent ring-2 ring-accent animate-pulse' : 'bg-accent'
            }`}
          />
        ))}

      {/* Pins */}
      {properties.map((p) => {
        const active = p.id === activeId
        const style = OP_STYLE[p.operation] || OP_STYLE.sale
        return (
          <motion.div
            key={p.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ top: `${p.lat}%`, left: `${p.lng}%` }}
            className={`absolute -translate-x-1/2 -translate-y-full group/pin ${
              drawing ? 'pointer-events-none' : ''
            } ${active ? 'z-30' : 'z-10 hover:z-20'}`}
          >
            {/* Tooltip card (hover or active) */}
            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-44 origin-bottom transition-all duration-150 ${
                active
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto'
              }`}
            >
              <div className="rounded-xl overflow-hidden bg-surface border border-border shadow-medium">
                <img
                  src={p.images?.[0]}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-20 object-cover bg-surface-alt"
                />
                <div className="p-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {OPERATION_LABELS[p.operation]}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary line-clamp-1">{p.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-accent">
                      {formatPrice(p.price, p.currency, p.operation)}
                    </span>
                    <span className="text-[10px] text-muted">
                      {formatArea(p.areaCovered || p.areaTotal)}
                    </span>
                  </div>
                  {onOpen && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpen(p)
                      }}
                      className="mt-1.5 w-full text-center text-[11px] font-semibold text-accent hover:underline"
                    >
                      Ver ficha
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Marker button */}
            <button
              type="button"
              onClick={() => onSelect?.(p)}
              className="flex flex-col items-center"
              aria-label={p.title}
            >
              <MapPin
                className={`w-7 h-7 drop-shadow transition-transform ${style.pin} ${
                  active ? 'scale-125' : 'group-hover/pin:scale-110'
                }`}
                fill="currentColor"
                fillOpacity={0.22}
              />
            </button>
          </motion.div>
        )
      })}

      {/* Draw controls (top-right) */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
        {!drawing && !activePolygon && (
          <button
            onClick={startDraw}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text shadow-sm hover:border-accent transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-accent" /> Dibujar zona
          </button>
        )}

        {!drawing && activePolygon && (
          <button
            onClick={() => onClearZone?.()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-accent text-xs font-semibold text-accent shadow-sm hover:bg-surface-alt transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Limpiar zona
          </button>
        )}

        {drawing && (
          <div className="flex flex-col items-end gap-1.5">
            <div className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] text-muted shadow-sm">
              Tocá el mapa · {pts.length} {pts.length === 1 ? 'punto' : 'puntos'}
            </div>
            <div className="flex gap-1.5">
              {pts.length > 0 && (
                <button
                  onClick={() => setPts((prev) => prev.slice(0, -1))}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text shadow-sm hover:border-accent transition-colors"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Deshacer
                </button>
              )}
              <button
                onClick={cancelDraw}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-muted shadow-sm hover:text-text transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancelar
              </button>
              <button
                onClick={() => commit(pts)}
                disabled={pts.length < 3}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent text-primary-contrast text-xs font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                <Check className="w-3.5 h-3.5" /> Cerrar zona
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend + count (bottom-left) — non-interactive so it never eats draw clicks */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 px-3 py-2 rounded-lg bg-surface/90 backdrop-blur border border-border shadow-sm pointer-events-none">
        <div className="flex items-center gap-3">
          {LEGEND.map((l) => (
            <span key={l.op} className="inline-flex items-center gap-1 text-[11px] text-muted">
              <span className={`w-2.5 h-2.5 rounded-full ${OP_STYLE[l.op].dot}`} /> {l.label}
            </span>
          ))}
        </div>
        <span className="text-[11px] font-medium text-text">
          {properties.length} {properties.length === 1 ? 'propiedad' : 'propiedades'}
          {activePolygon ? ' en la zona' : ' en el mapa'}
        </span>
      </div>

      {/* Empty-state overlay when a zone filters everything out */}
      <AnimatePresence>
        {properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="px-4 py-2 rounded-lg bg-surface border border-border text-sm text-muted shadow-medium">
              No hay propiedades en esta zona
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

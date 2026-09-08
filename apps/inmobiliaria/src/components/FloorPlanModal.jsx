import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LayoutPanelTop, Image as ImageIcon, Maximize, DoorOpen, BedDouble, Bath } from 'lucide-react'

/**
 * Floor-plan viewer for a single property.
 *
 * Shows the property's `floorPlan` image when available; otherwise renders a
 * generated schematic that adapts to the property's room/bath count so every
 * listing has a usable plan. When both exist the user can toggle between the
 * photographed plan and the clean schematic.
 */

// Build a simple, legible schematic from the property specs, adapted to the
// property type. Everything sits inside a 400x300 viewBox so it scales cleanly.
function buildSchematic(property) {
  const type = property?.type

  // Undeveloped land: a single plot.
  if (type === 'land') {
    return [{ name: 'Lote', x: 12, y: 12, w: 376, h: 276 }]
  }

  // Non-residential: open commercial layout.
  if (type === 'office' || type === 'commercial') {
    return [
      { name: 'Salón principal', x: 12, y: 12, w: 240, h: 276 },
      { name: 'Privado', x: 262, y: 12, w: 126, h: 130 },
      { name: 'Depósito', x: 262, y: 152, w: 126, h: 74 },
      { name: 'Baño', x: 262, y: 236, w: 126, h: 52 }
    ]
  }

  // Residential (apartment / house / ph).
  const bedrooms = Math.max(1, property?.bedrooms || 1)
  const baths = Math.max(1, property?.bathrooms || 1)

  const rooms = [
    { name: 'Living comedor', x: 12, y: 12, w: 214, h: 150 },
    { name: 'Cocina', x: 236, y: 12, w: 152, h: 92 }
  ]

  // Bedrooms stack on the right column under the kitchen.
  const bedH = Math.min(72, Math.max(46, Math.round(176 / bedrooms)))
  for (let i = 0; i < bedrooms; i++) {
    rooms.push({
      name: bedrooms > 1 ? `Dormitorio ${i + 1}` : 'Dormitorio',
      x: 236,
      y: 114 + i * (bedH + 6),
      w: 152,
      h: bedH
    })
  }

  // Bathroom(s) along the bottom-left.
  rooms.push({ name: baths > 1 ? 'Baño 1' : 'Baño', x: 12, y: 172, w: 100, h: 116 })
  if (baths > 1) rooms.push({ name: 'Baño 2', x: 122, y: 232, w: 104, h: 56 })

  return rooms
}

function Schematic({ property }) {
  const rooms = buildSchematic(property)
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-auto max-h-[60vh]"
      role="img"
      aria-label={`Esquema de distribución de ${property?.title || 'la propiedad'}`}
    >
      {/* Outer wall */}
      <rect x="6" y="6" width="388" height="288" rx="6" fill="none"
        style={{ stroke: 'var(--color-primary)', strokeWidth: 4 }} />
      {rooms.map((r) => {
        const cx = r.x + r.w / 2
        const cy = r.y + r.h / 2
        return (
          <g key={r.name}>
            <rect
              x={r.x} y={r.y} width={r.w} height={r.h} rx="3"
              style={{ fill: 'var(--color-surface-alt)', stroke: 'var(--color-border)', strokeWidth: 2 }}
            />
            <text
              x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
              style={{ fill: 'var(--color-muted)', fontSize: 11, fontWeight: 600 }}
            >
              {r.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function FloorPlanModal({ open, property, onClose }) {
  const hasImage = Boolean(property?.floorPlan)
  // Default to the photographed plan when it exists.
  const [mode, setMode] = useState(hasImage ? 'image' : 'schematic')

  useEffect(() => {
    setMode(hasImage ? 'image' : 'schematic')
  }, [hasImage, property?.id, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const specs = [
    { icon: Maximize, value: property?.areaCovered ? `${property.areaCovered} m²` : null, label: 'Cubiertos' },
    { icon: DoorOpen, value: property?.rooms || null, label: 'Ambientes' },
    { icon: BedDouble, value: property?.bedrooms || null, label: 'Dormitorios' },
    { icon: Bath, value: property?.bathrooms || null, label: 'Baños' }
  ].filter((s) => s.value)

  return (
    <AnimatePresence>
      {open && property && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[94vh] bg-surface rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3.5 border-b border-border">
              <div className="flex items-center gap-2.5 min-w-0">
                <LayoutPanelTop className="w-5 h-5 text-accent shrink-0" />
                <span className="font-semibold text-primary truncate">Plano</span>
                <span className="hidden sm:inline text-muted text-sm truncate">· {property.title}</span>
              </div>

              <div className="flex items-center gap-2">
                {hasImage && (
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setMode('image')}
                      className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors inline-flex items-center gap-1.5 ${
                        mode === 'image' ? 'bg-accent text-primary-contrast' : 'text-muted hover:text-text'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Plano
                    </button>
                    <button
                      onClick={() => setMode('schematic')}
                      className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors inline-flex items-center gap-1.5 ${
                        mode === 'schematic' ? 'bg-accent text-primary-contrast' : 'text-muted hover:text-text'
                      }`}
                    >
                      <LayoutPanelTop className="w-3.5 h-3.5" /> Esquema
                    </button>
                  </div>
                )}
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-alt transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-auto p-4 md:p-6 bg-bg">
              <div className="flex items-center justify-center">
                {mode === 'image' && hasImage ? (
                  <img
                    src={property.floorPlan}
                    alt={`Plano de ${property.title}`}
                    className="max-h-[60vh] w-auto rounded-lg object-contain bg-surface"
                  />
                ) : (
                  <div className="w-full max-w-2xl rounded-lg bg-surface border border-border p-4 md:p-6">
                    <Schematic property={property} />
                    <p className="text-center text-xs text-muted mt-3">
                      Esquema orientativo generado a partir de la ficha. No representa medidas exactas.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer specs */}
            {specs.length > 0 && (
              <div className="border-t border-border px-4 md:px-6 py-3 flex flex-wrap gap-x-6 gap-y-2">
                {specs.map((s) => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="inline-flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 text-accent" />
                      <span className="font-semibold text-text">{s.value}</span>
                      <span className="text-muted">{s.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

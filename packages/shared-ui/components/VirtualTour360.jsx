import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Compass, Move } from 'lucide-react'
import Panorama360 from './Panorama360'

/**
 * Immersive tour: an interactive 2.5D plan (navigation) + a real 360° viewer.
 * The plan works at two scales — the whole resort/complex, or a single unit's
 * floor plan. Clicking a zone loads its 360° panorama.
 *
 * Placeholder panoramas are generic equirectangular samples; swap each room's
 * `panorama` for a real 360 photo (e.g. generated with Skybox AI) per unit.
 */

// Reliable sample equirectangular panoramas (2:1). Replace with real assets.
const PANO = {
  a: 'https://pannellum.org/images/alma.jpg',
  b: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/2294472375_24a3b8ef46_o.jpg',
  c: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg'
}

export const DEFAULT_TOUR_VIEWS = [
  {
    id: 'resort',
    label: 'Complejo',
    viewBox: '0 0 400 300',
    rooms: [
      { id: 'lobby', name: 'Lobby & Recepción', area: 'Planta baja', desc: 'Ingreso principal con conserjería 24 h.', shape: { x: 20, y: 20, w: 120, h: 90 }, panorama: PANO.a },
      { id: 'restaurant', name: 'Restaurante', area: 'Ala este', desc: 'Cocina de autor con vista al jardín.', shape: { x: 150, y: 20, w: 110, h: 90 }, panorama: PANO.b },
      { id: 'spa', name: 'Spa & Wellness', area: 'Ala oeste', desc: 'Piscina climatizada, sauna y masajes.', shape: { x: 270, y: 20, w: 110, h: 90 }, panorama: PANO.c },
      { id: 'pool', name: 'Piscina central', area: 'Patio', desc: 'Infinity pool con solárium y bar.', shape: { x: 20, y: 120, w: 240, h: 100 }, panorama: PANO.c },
      { id: 'suites', name: 'Torre de suites', area: 'Niveles 2–8', desc: 'Habitaciones y suites con balcón.', shape: { x: 270, y: 120, w: 110, h: 100 }, panorama: PANO.a },
      { id: 'gardens', name: 'Jardines', area: 'Perímetro', desc: 'Senderos, deck y áreas de descanso.', shape: { x: 20, y: 230, w: 360, h: 50 }, panorama: PANO.b }
    ]
  },
  {
    id: 'suite',
    label: 'Habitación',
    viewBox: '0 0 400 300',
    rooms: [
      { id: 'living', name: 'Living comedor', area: '32 m²', desc: 'Ambiente principal con ventanal al balcón.', shape: { x: 20, y: 20, w: 170, h: 130 }, panorama: PANO.a },
      { id: 'kitchen', name: 'Kitchenette', area: '9 m²', desc: 'Cocina equipada con desayunador.', shape: { x: 200, y: 20, w: 180, h: 80 }, panorama: PANO.b },
      { id: 'bedroom', name: 'Dormitorio', area: '18 m²', desc: 'Cama king con vestidor.', shape: { x: 200, y: 110, w: 100, h: 140 }, panorama: PANO.c },
      { id: 'bath', name: 'Baño', area: '6 m²', desc: 'Baño completo con bañera.', shape: { x: 310, y: 110, w: 70, h: 140 }, panorama: PANO.a },
      { id: 'balcony', name: 'Balcón', area: '12 m²', desc: 'Balcón aterrazado con vista.', shape: { x: 20, y: 160, w: 170, h: 90 }, panorama: PANO.c }
    ]
  }
]

export default function VirtualTour360({ open, onClose, title, views = DEFAULT_TOUR_VIEWS }) {
  const [viewIdx, setViewIdx] = useState(0)
  const view = views[viewIdx] || views[0]
  const [activeId, setActiveId] = useState(view.rooms[0]?.id)

  // Reset selection when switching scale (resort <-> room) or reopening.
  useEffect(() => {
    setActiveId(views[viewIdx]?.rooms[0]?.id)
  }, [viewIdx, views])

  useEffect(() => {
    if (open) setViewIdx(0)
  }, [open])

  const activeRoom = view.rooms.find((r) => r.id === activeId) || view.rooms[0]

  return (
    <AnimatePresence>
      {open && (
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
            className="relative w-full max-w-6xl max-h-[94vh] bg-surface rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3.5 border-b border-border">
              <div className="flex items-center gap-2.5 min-w-0">
                <Compass className="w-5 h-5 text-accent shrink-0" />
                <span className="font-semibold text-primary truncate">Recorrido 360°</span>
                {title && <span className="hidden sm:inline text-muted text-sm truncate">· {title}</span>}
              </div>

              <div className="flex items-center gap-2">
                {/* Scale toggle */}
                {views.length > 1 && (
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    {views.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setViewIdx(i)}
                        className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                          i === viewIdx ? 'bg-accent text-primary-contrast' : 'text-muted hover:text-text'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
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
            <div className="flex flex-col md:flex-row min-h-0 flex-1">
              {/* 360 viewer */}
              <div className="relative md:flex-1 min-h-0">
                <Panorama360 panorama={activeRoom?.panorama} className="h-[42vh] md:h-full min-h-[280px]" />
                <div className="absolute left-4 bottom-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-xs pointer-events-none">
                  <Move className="w-3.5 h-3.5" />
                  Arrastrá para mirar alrededor
                </div>
              </div>

              {/* Plan + info */}
              <div className="md:w-[340px] shrink-0 border-t md:border-t-0 md:border-l border-border bg-bg flex flex-col">
                <div className="p-4 md:p-5">
                  <p className="text-xs uppercase tracking-widest text-muted mb-3">
                    {view.id === 'resort' ? 'Plano del complejo' : 'Plano de la unidad'}
                  </p>
                  <svg viewBox={view.viewBox} className="w-full h-auto rounded-lg" role="img" aria-label="Plano interactivo">
                    {view.rooms.map((room) => {
                      const isActive = room.id === activeRoom?.id
                      const cx = room.shape.x + room.shape.w / 2
                      const cy = room.shape.y + room.shape.h / 2
                      return (
                        <g key={room.id} onClick={() => setActiveId(room.id)} style={{ cursor: 'pointer' }}>
                          <rect
                            x={room.shape.x}
                            y={room.shape.y}
                            width={room.shape.w}
                            height={room.shape.h}
                            rx="4"
                            style={{
                              fill: isActive ? 'var(--color-accent)' : 'var(--color-surface-alt, var(--color-surface))',
                              stroke: isActive ? 'var(--color-accent)' : 'var(--color-border)',
                              strokeWidth: 2,
                              transition: 'fill .2s, stroke .2s'
                            }}
                          />
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                              fill: isActive ? 'var(--color-primary-contrast)' : 'var(--color-muted)',
                              fontSize: 12,
                              fontWeight: 600,
                              pointerEvents: 'none'
                            }}
                          >
                            {room.name.split(' ')[0]}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>

                {/* Active room info */}
                <div className="mt-auto p-4 md:p-5 border-t border-border">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-primary">{activeRoom?.name}</h3>
                    <span className="text-sm text-accent font-medium shrink-0">{activeRoom?.area}</span>
                  </div>
                  <p className="text-sm text-muted mt-1.5">{activeRoom?.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {view.rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setActiveId(room.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          room.id === activeRoom?.id
                            ? 'bg-primary text-primary-contrast'
                            : 'bg-surface-alt text-muted hover:text-text'
                        }`}
                      >
                        {room.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

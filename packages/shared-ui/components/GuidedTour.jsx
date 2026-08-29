import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react'

/**
 * Reusable guided tour with a spotlight cutout.
 * steps: [{ target?: cssSelector, title, body }]  — target optional (null = centered card)
 * run: boolean, onClose: () => void
 */
export default function GuidedTour({ steps = [], run = false, onClose }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)

  useEffect(() => { if (run) setI(0) }, [run])

  const measure = useCallback(() => {
    const step = steps[i]
    const el = step?.target ? document.querySelector(step.target) : null
    setRect(el ? el.getBoundingClientRect() : null)
  }, [i, steps])

  useEffect(() => {
    if (!run) return
    const step = steps[i]
    const el = step?.target ? document.querySelector(step.target) : null
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    measure()
    const t = setTimeout(measure, 380) // after smooth scroll settles
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [i, run, steps, measure])

  if (!run || steps.length === 0) return null

  const last = i === steps.length - 1
  const pad = 8

  // Card placement: below the target if there's room, else above; centered when no target.
  let cardStyle = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
  if (rect) {
    const below = rect.bottom + 190 < window.innerHeight
    const left = Math.min(Math.max(rect.left, 12), window.innerWidth - 340)
    cardStyle = below
      ? { left, top: rect.bottom + pad + 12 }
      : { left, top: Math.max(12, rect.top - pad - 200) }
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Spotlight cutout (or full dim when no target) */}
      {rect ? (
        <div
          className="absolute rounded-xl border-2 border-primary transition-all duration-300"
          style={{
            left: rect.left - pad, top: rect.top - pad,
            width: rect.width + pad * 2, height: rect.height + pad * 2,
            boxShadow: '0 0 0 9999px rgba(15,23,42,0.68)'
          }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.68)' }} />
      )}

      {/* Step card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="absolute pointer-events-auto w-[320px] max-w-[calc(100vw-24px)] bg-surface border border-border rounded-xl shadow-2xl p-5"
          style={cardStyle}
        >
          <button onClick={onClose} aria-label="Cerrar recorrido"
            className="absolute top-3 right-3 text-muted hover:text-text transition-colors">
            <X className="w-4 h-4" />
          </button>

          <span className="inline-block text-[11px] font-bold uppercase tracking-wide text-primary mb-1">
            Paso {i + 1} de {steps.length}
          </span>
          <h3 className="font-bold text-text text-lg leading-tight pr-4">{steps[i].title}</h3>
          <p className="text-sm text-muted mt-2 leading-relaxed">{steps[i].body}</p>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-4">
            {steps.map((_, idx) => (
              <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-5 bg-primary' : 'w-1.5 bg-border'}`} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={onClose} className="text-xs text-muted hover:text-text transition-colors">Saltar</button>
            <div className="flex items-center gap-2">
              {i > 0 && (
                <button onClick={() => setI(i - 1)}
                  className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg border border-border text-text hover:bg-surface-alt transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
              )}
              <button onClick={() => (last ? onClose() : setI(i + 1))}
                className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-contrast hover:opacity-90 transition-opacity">
                {last ? <>Listo <Check className="w-4 h-4" /></> : <>Siguiente <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

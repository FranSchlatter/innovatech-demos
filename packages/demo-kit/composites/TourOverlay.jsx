import { useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTour } from '../providers/DemoProvider'
import { Button } from '../primitives/basics'

/**
 * Guided tour overlay. `scripts` = { hotel: [steps], realestate: [steps] }.
 * step: { target?: elementId, title, body, metricValue?, metricLabel?, onEnter?() }
 * Highlights the target with a spotlight and shows a stepper card. Deep-link
 * (?tour=hotel&step=3) is handled by DemoProvider.
 */
export function TourOverlay({ scripts = {} }) {
  const { active, vertical, step, nextStep, prevStep, exitTour } = useTour()
  const steps = scripts[vertical] || []
  const current = steps[step - 1]
  const [rect, setRect] = useState(null)

  const measure = () => {
    if (!current?.target) { setRect(null); return }
    const el = document.getElementById(current.target)
    if (!el) { setRect(null); return }
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
  }

  useEffect(() => {
    if (!active || !current) return
    current.onEnter?.()
    const el = current.target && document.getElementById(current.target)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const t = setTimeout(measure, 380)
    return () => clearTimeout(t)
  }, [active, vertical, step]) // eslint-disable-line

  useLayoutEffect(() => {
    if (!active) return
    const onChange = () => measure()
    window.addEventListener('resize', onChange)
    window.addEventListener('scroll', onChange, true)
    return () => {
      window.removeEventListener('resize', onChange)
      window.removeEventListener('scroll', onChange, true)
    }
  }, [active, step]) // eslint-disable-line

  if (!active || !current) return null
  const isLast = step === steps.length
  const pad = 8

  // Card position: below the target if there's room, else above, else centered.
  let cardStyle = { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }
  if (rect) {
    const below = rect.top + rect.height + 16
    const goBelow = below < window.innerHeight - 220
    cardStyle = {
      left: Math.min(Math.max(rect.left, 16), window.innerWidth - 360),
      top: goBelow ? below : Math.max(16, rect.top - 200)
    }
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* Spotlight or full dim */}
        {rect ? (
          <motion.div
            className="absolute rounded-lg pointer-events-none"
            style={{
              top: rect.top - pad, left: rect.left - pad,
              width: rect.width + pad * 2, height: rect.height + pad * 2,
              boxShadow: '0 0 0 9999px rgba(3,10,20,0.72)', border: '2px solid #66E0FF'
            }}
            initial={false}
            animate={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: 'rgba(3,10,20,0.72)' }} />
        )}

        {/* Card */}
        <motion.div
          key={step}
          className="absolute w-[340px] max-w-[calc(100vw-32px)] rounded-lg border border-[#1E3A55] shadow-2xl p-5"
          style={{ ...cardStyle, background: '#0F2035', color: '#E6F0F7' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="grid place-items-center w-7 h-7 rounded-full text-sm font-extrabold"
              style={{ background: '#66E0FF', color: '#04121F' }}>{step}</span>
            <button onClick={exitTour} className="text-[#8DA2B5] hover:text-white"><X size={18} /></button>
          </div>
          <h4 className="font-extrabold text-white text-base">{current.title}</h4>
          <p className="text-sm text-[#B7C6D4] mt-1.5 leading-relaxed">{current.body}</p>

          {current.metricValue && (
            <div className="mt-3 rounded p-3" style={{ background: '#66E0FF14' }}>
              <p className="text-2xl font-extrabold" style={{ color: '#66E0FF' }}>{current.metricValue}</p>
              <p className="text-xs text-[#8DA2B5]">{current.metricLabel}</p>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-4">
            {steps.map((_, i) => (
              <span key={i} className="h-1.5 rounded-full transition-all"
                style={{ width: i === step - 1 ? 20 : 6, background: i === step - 1 ? '#66E0FF' : '#1E3A55' }} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={exitTour} className="text-xs font-semibold text-[#8DA2B5] hover:text-white">Explorar libremente</button>
            <div className="flex items-center gap-2">
              {step > 1 && <Button size="sm" variant="ghost" onClick={prevStep}>Anterior</Button>}
              {!isLast
                ? <Button size="sm" onClick={nextStep}>Siguiente</Button>
                : <Button size="sm" onClick={exitTour}>Terminar</Button>}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

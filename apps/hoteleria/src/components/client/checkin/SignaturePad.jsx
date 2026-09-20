import { useRef, useEffect, useState, useCallback } from 'react'
import { Eraser, PenLine } from 'lucide-react'
import { useTranslation } from '../../../i18n/LanguageProvider'

// H26 — lightweight digital signature pad (canvas + pointer events).
// Draws in the current theme text colour so it reads in dark & light, exports a
// PNG data-url via onChange. Controlled-ish: seeded from `value` on mount.
export default function SignaturePad({ value, onChange, height = 168 }) {
  const { t } = useTranslation()
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const [hasInk, setHasInk] = useState(!!value)

  // Size the canvas to its container (accounting for devicePixelRatio for crisp
  // strokes) and prime the drawing context. Runs once — the modal keeps a stable
  // width while open.
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ratio = window.devicePixelRatio || 1
    const w = wrap.clientWidth
    const h = height
    canvas.width = Math.max(1, Math.round(w * ratio))
    canvas.height = Math.round(h * ratio)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    // Follow the theme: the canvas element carries `text-text`, so its computed
    // colour flips with dark/light mode.
    ctx.strokeStyle = getComputedStyle(canvas).color || '#8B7355'
    ctxRef.current = ctx
    if (value) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, w, h)
      img.src = value
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const start = useCallback((e) => {
    e.preventDefault()
    drawing.current = true
    last.current = pos(e)
    canvasRef.current.setPointerCapture?.(e.pointerId)
  }, [pos])

  const move = useCallback((e) => {
    if (!drawing.current) return
    const ctx = ctxRef.current
    const p = pos(e)
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
    if (!hasInk) setHasInk(true)
  }, [pos, hasInk])

  const end = useCallback(() => {
    if (!drawing.current) return
    drawing.current = false
    if (hasInk && onChange) onChange(canvasRef.current.toDataURL('image/png'))
  }, [hasInk, onChange])

  const clear = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    onChange?.(null)
  }, [onChange])

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative rounded-xl border border-border bg-surface overflow-hidden text-text"
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="text-text touch-none cursor-crosshair w-full h-full block"
        />
        {!hasInk && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted">
            <PenLine className="w-6 h-6 mb-1.5 opacity-70" />
            <span className="text-sm">{t('station.signature.drawHere')}</span>
          </div>
        )}
        {/* Signature baseline */}
        <div className="absolute left-6 right-6 bottom-8 border-b border-dashed border-border pointer-events-none" />
      </div>
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={clear}
          disabled={!hasInk}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors disabled:opacity-40"
        >
          <Eraser className="w-4 h-4" /> {t('station.signature.clear')}
        </button>
      </div>
    </div>
  )
}

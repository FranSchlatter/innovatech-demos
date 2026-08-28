import { motion } from 'framer-motion'

/* Decorative hexagon cluster — the InnovaTech brand motif for panel backgrounds. */
export function Hexes({ className, count = 6, opacity = 0.08 }) {
  const hexes = Array.from({ length: count }, (_, i) => ({
    x: (i * 37) % 100, y: (i * 53) % 100, s: 40 + (i % 3) * 34, d: i * 0.4
  }))
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ''}`} aria-hidden>
      {hexes.map((h, i) => (
        <motion.svg
          key={i} width={h.s} height={h.s} viewBox="0 0 56 65"
          className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%`, opacity }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity, scale: 1 }}
          transition={{ delay: h.d, duration: 1 }}
        >
          <path d="M28 0l28 16v33L28 65 0 49V16z" fill="none" stroke="var(--dk-hex)" strokeWidth="1.5" />
        </motion.svg>
      ))}
    </div>
  )
}

/* A single hexagon badge (e.g. logo mark). */
export function HexMark({ size = 34, children }) {
  return (
    <span className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 56 65" width={size} height={size} className="absolute inset-0">
        <path d="M28 2l26 15v31L28 63 2 48V17z" fill="var(--dk-primary-weak)" stroke="var(--dk-primary)" strokeWidth="2" />
      </svg>
      <span className="relative text-primary font-extrabold" style={{ fontSize: size * 0.42 }}>{children}</span>
    </span>
  )
}

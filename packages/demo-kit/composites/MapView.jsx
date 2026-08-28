import { useState } from 'react'
import { MapPin } from 'lucide-react'
const cx = (...c) => c.filter(Boolean).join(' ')

/**
 * Stylized map (no external tiles / no token). Points positioned by x/y (0–100).
 * points: [{ id, x, y, label, price?, active? }]. Syncs hover with a list via onHover.
 */
export function MapView({ points = [], activeId, onHover, onSelect, className, height = 'h-full' }) {
  const [hover, setHover] = useState(null)
  return (
    <div className={cx('relative rounded overflow-hidden border border-border', height, className)}
      style={{ background: 'linear-gradient(135deg, var(--dk-surface-2), var(--dk-surface))' }}>
      {/* subtle grid */}
      <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden>
        <defs>
          <pattern id="dk-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="var(--dk-border)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dk-grid)" />
      </svg>
      {/* a "river/park" band for flavor */}
      <div className="absolute inset-y-0 right-[12%] w-[16%] -skew-x-12 opacity-30"
        style={{ background: 'var(--dk-primary-weak)' }} />

      {points.map((p) => {
        const on = (activeId ?? hover) === p.id
        return (
          <button
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-full group"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onMouseEnter={() => { setHover(p.id); onHover?.(p.id) }}
            onMouseLeave={() => { setHover(null); onHover?.(null) }}
            onClick={() => onSelect?.(p)}
          >
            <span className={cx('grid place-items-center rounded-full shadow-kit transition-all',
              on ? 'scale-125' : 'scale-100')}
              style={{ width: 26, height: 26, background: on ? 'var(--dk-primary)' : 'var(--dk-surface)', color: on ? 'var(--dk-primary-contrast)' : 'var(--dk-primary)', border: '2px solid var(--dk-primary)' }}>
              <MapPin size={14} />
            </span>
            {(on && (p.label || p.price)) && (
              <span className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap rounded bg-elevated border border-border px-2 py-1 text-xs font-semibold text-text shadow-kit z-10">
                {p.price || p.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

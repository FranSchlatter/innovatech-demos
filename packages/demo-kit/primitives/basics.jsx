import { motion } from 'framer-motion'

const cx = (...c) => c.filter(Boolean).join(' ')

/* ---------------- Button ---------------- */
const BTN = {
  primary: 'bg-primary text-primary-contrast hover:brightness-110 shadow-kit',
  secondary: 'border border-border text-text hover:border-primary hover:text-primary bg-transparent',
  ghost: 'text-muted hover:text-text hover:bg-surface-2 bg-transparent',
  danger: 'bg-danger text-white hover:brightness-110',
  subtle: 'bg-surface-2 text-text hover:brightness-105'
}
const SIZE = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }

export function Button({ variant = 'primary', size = 'md', className, as, icon: Icon, children, ...props }) {
  const Cmp = as || 'button'
  return (
    <Cmp
      className={cx('inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition',
        'focus:outline-none focus-visible:shadow-ring disabled:opacity-50 disabled:pointer-events-none',
        BTN[variant], SIZE[size], className)}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 15 : 18} />}
      {children}
    </Cmp>
  )
}

/* ---------------- Card ---------------- */
export function Card({ className, hover = false, children, ...props }) {
  const Cmp = hover ? motion.div : 'div'
  const extra = hover ? { whileHover: { y: -3 }, transition: { duration: 0.2 } } : {}
  return (
    <Cmp className={cx('bg-surface border border-border rounded shadow-kit', className)} {...extra} {...props}>
      {children}
    </Cmp>
  )
}

/* ---------------- Badge ---------------- */
const TONE = {
  neutral: 'var(--dk-muted)', primary: 'var(--dk-primary)', success: 'var(--dk-success)',
  warning: 'var(--dk-warning)', danger: 'var(--dk-danger)', info: 'var(--dk-info)'
}
export function Badge({ tone = 'neutral', children, className, dot = false }) {
  const c = TONE[tone] || TONE.neutral
  return (
    <span
      className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', className)}
      style={{ color: c, background: `color-mix(in srgb, ${c} 15%, transparent)` }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />}
      {children}
    </span>
  )
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className, rounded = 'rounded' }) {
  return <div className={cx('animate-pulse bg-surface-2', rounded, className)} />
}

/* ---------------- EmptyState ---------------- */
export function EmptyState({ icon: Icon, title = 'Sin datos', hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && <div className="w-12 h-12 rounded-full grid place-items-center mb-3 text-muted bg-surface-2"><Icon size={22} /></div>}
      <p className="text-text font-semibold">{title}</p>
      {hint && <p className="text-muted text-sm mt-1 max-w-xs">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/* ---------------- Stat pill (small KPI inline) ---------------- */
export function Pill({ label, value, tone = 'primary' }) {
  const c = TONE[tone]
  return (
    <span className="inline-flex flex-col rounded px-3 py-1.5" style={{ background: `color-mix(in srgb, ${c} 10%, transparent)` }}>
      <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <span className="font-bold" style={{ color: c }}>{value}</span>
    </span>
  )
}

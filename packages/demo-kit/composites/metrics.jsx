import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '../primitives/basics'
const cx = (...c) => c.filter(Boolean).join(' ')

export function KPICard({ label, value, delta, deltaLabel, icon: Icon, tone = 'primary', hint }) {
  const up = typeof delta === 'number' ? delta >= 0 : null
  const deltaColor = up === null ? 'var(--dk-muted)' : up ? 'var(--dk-success)' : 'var(--dk-danger)'
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
          {Icon && (
            <span className="grid place-items-center w-8 h-8 rounded"
              style={{ color: 'var(--dk-primary)', background: 'var(--dk-primary-weak)' }}>
              <Icon size={16} />
            </span>
          )}
        </div>
        <div className="mt-2 text-2xl font-extrabold text-heading">{value}</div>
        <div className="mt-1 flex items-center gap-2 text-xs">
          {delta !== undefined && delta !== null && (
            <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color: deltaColor }}>
              {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(delta)}%
            </span>
          )}
          {(deltaLabel || hint) && <span className="text-muted">{deltaLabel || hint}</span>}
        </div>
      </Card>
    </motion.div>
  )
}

export function ChartCard({ title, subtitle, right, children, className, bodyClass }) {
  return (
    <Card className={cx('p-4', className)}>
      {(title || right) && (
        <div className="flex items-start justify-between mb-3">
          <div>
            {title && <h3 className="font-bold text-heading">{title}</h3>}
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className={cx('w-full', bodyClass)}>{children}</div>
    </Card>
  )
}

/* Horizontal bar row — used in funnels / breakdowns without a chart lib. */
export function BarRow({ label, value, max, color = 'var(--dk-primary)', suffix }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="py-1.5">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-text">{label}</span>
        <span className="font-semibold text-heading">{value}{suffix}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
      </div>
    </div>
  )
}

import { forwardRef } from 'react'
const cx = (...c) => c.filter(Boolean).join(' ')

const base = 'w-full bg-surface border border-border rounded-sm px-3 py-2.5 text-text text-sm ' +
  'placeholder:text-muted focus:outline-none focus:border-primary focus-visible:shadow-ring transition'

export const Input = forwardRef(function Input({ label, hint, icon: Icon, className, id, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-muted mb-1.5">{label}</span>}
      <span className="relative block">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />}
        <input ref={ref} id={id} className={cx(base, Icon && 'pl-9', className)} {...props} />
      </span>
      {hint && <span className="block text-xs text-muted mt-1">{hint}</span>}
    </label>
  )
})

export function Select({ label, hint, options = [], className, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-muted mb-1.5">{label}</span>}
      <select className={cx(base, 'appearance-none cursor-pointer pr-8', className)} {...props}>
        {children || options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      {hint && <span className="block text-xs text-muted mt-1">{hint}</span>}
    </label>
  )
}

/* Lightweight date field — native input styled to the kit. */
export function DateField({ label, className, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-muted mb-1.5">{label}</span>}
      <input type="date" className={cx(base, 'cursor-pointer', className)} {...props} />
    </label>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className="inline-flex items-center gap-2"
      role="switch"
      aria-checked={checked}
    >
      <span className={cx('w-9 h-5 rounded-full transition relative', checked ? 'bg-primary' : 'bg-surface-2 border border-border')}>
        <span className={cx('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
      </span>
      {label && <span className="text-sm text-text">{label}</span>}
    </button>
  )
}

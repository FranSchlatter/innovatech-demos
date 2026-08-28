const cx = (...c) => c.filter(Boolean).join(' ')

/** Responsive filter container. Compose Select/Input/Toggle from primitives inside. */
export function FilterBar({ children, className, sticky = false }) {
  return (
    <div className={cx('flex flex-wrap items-end gap-3 p-3 bg-surface border border-border rounded',
      sticky && 'sticky top-0 z-20', className)}>
      {children}
    </div>
  )
}

/** Quick pill filters (apto crédito / mascotas / cochera). */
export function QuickFilter({ active, onClick, icon: Icon, children }) {
  return (
    <button onClick={onClick}
      className={cx('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition',
        active ? 'bg-primary text-primary-contrast border-primary' : 'border-border text-muted hover:text-text hover:border-primary')}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  )
}

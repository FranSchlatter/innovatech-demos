import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
const cx = (...c) => c.filter(Boolean).join(' ')

export function Modal({ open, onClose, title, children, className, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className={cx('relative bg-surface border border-border rounded-lg shadow-kit w-full', maxWidth, className)}
            initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-bold text-heading">{title}</h3>
                <button onClick={onClose} className="text-muted hover:text-text"><X size={20} /></button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Drawer({ open, onClose, side = 'right', title, children, width = 'w-full max-w-md' }) {
  const x = side === 'right' ? '100%' : '-100%'
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.aside
            className={cx('absolute top-0 bottom-0 bg-surface border-border shadow-kit', side === 'right' ? 'right-0 border-l' : 'left-0 border-r', width)}
            initial={{ x }} animate={{ x: 0 }} exit={{ x }} transition={{ type: 'tween', duration: 0.28 }}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-bold text-heading">{title}</h3>
                <button onClick={onClose} className="text-muted hover:text-text"><X size={20} /></button>
              </div>
            )}
            <div className="overflow-y-auto h-[calc(100%-60px)]">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Tabs({ tabs = [], value, onChange }) {
  const [internal, setInternal] = useState(tabs[0]?.id)
  const active = value ?? internal
  const set = onChange ?? setInternal
  return (
    <div>
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => set(t.id)}
            className={cx('px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition',
              active === t.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text')}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  )
}

export function Tooltip({ label, children }) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-elevated border border-border px-2 py-1 text-xs text-text opacity-0 group-hover:opacity-100 transition shadow-kit z-20">
        {label}
      </span>
    </span>
  )
}

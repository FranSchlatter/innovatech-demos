import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
}

// Reusable admin modal: backdrop + escape-to-close + spring entrance.
// Body scrolls when taller than the viewport; header/footer stay pinned.
export default function Modal({
  open,
  onClose,
  title,
  icon: Icon,
  size = 'md',
  footer,
  children
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${SIZES[size]} max-h-[92vh] flex flex-col bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border`}
          >
            <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {Icon && <Icon className="w-5 h-5 text-accent shrink-0" />}
                <h3 className="font-semibold text-text truncate">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-alt transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">{children}</div>

            {footer && (
              <div className="px-5 md:px-6 py-4 border-t border-border bg-surface-alt/40 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

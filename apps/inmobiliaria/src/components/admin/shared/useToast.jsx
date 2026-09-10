import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Info, AlertTriangle } from 'lucide-react'

const TONE_ICON = { success: CheckCircle, info: Info, warning: AlertTriangle, error: AlertTriangle }
const TONE_COLOR = {
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  error: 'text-error',
  muted: 'text-muted'
}

// Small toast helper for admin screens.
// Usage: const { showToast, toastNode } = useToast(); render {toastNode}.
export function useToast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ key: Date.now(), message, tone })
  }, [])

  const Icon = toast ? TONE_ICON[toast.tone] || CheckCircle : CheckCircle

  const toastNode = (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.key}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-surface border border-border shadow-2xl max-w-[90vw]"
        >
          <Icon className={`w-5 h-5 shrink-0 ${TONE_COLOR[toast.tone] || TONE_COLOR.success}`} />
          <span className="text-sm font-medium text-text">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return { showToast, toastNode }
}

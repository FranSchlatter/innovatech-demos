import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Send, Trash2, Loader2 } from 'lucide-react'

// Lateral cart for the restaurant menu.
// Props:
//   open, onClose
//   lines: [{ id, name, price, qty, image }]
//   onInc(id), onDec(id), onRemove(id)
//   notes, setNotes
//   onSubmit, submitting
export default function CartDrawer({
  open,
  onClose,
  lines,
  onInc,
  onDec,
  onRemove,
  notes,
  setNotes,
  onSubmit,
  submitting
}) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Panel — full width on mobile, side sheet on desktop */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-bg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                Your Order
                {itemCount > 0 && (
                  <span className="text-sm font-medium text-muted">({itemCount})</span>
                )}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface text-muted hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lines */}
            <div className="flex-1 overflow-y-auto p-5">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-muted" />
                  </div>
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm text-muted mt-1">Add dishes from the menu to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.div
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        className="flex gap-3 bg-surface rounded-xl p-3"
                      >
                        <img
                          src={line.image}
                          alt={line.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm leading-tight">{line.name}</h4>
                            <button
                              onClick={() => onRemove(line.id)}
                              className="text-muted hover:text-red-500 transition-colors flex-shrink-0"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-accent font-bold mt-0.5">${line.price}</p>

                          {/* Quantity stepper */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onDec(line.id)}
                                className="w-7 h-7 rounded-lg bg-bg border border-border flex items-center justify-center hover:border-accent transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
                              <button
                                onClick={() => onInc(line.id)}
                                className="w-7 h-7 rounded-lg bg-bg border border-border flex items-center justify-center hover:border-accent transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-bold whitespace-nowrap">
                              ${line.price * line.qty}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Special notes */}
                  <div className="pt-2">
                    <label className="text-sm text-muted mb-2 block">Special instructions</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Allergies, cooking preferences, delivery notes…"
                      rows={3}
                      className="w-full px-4 py-3 bg-surface rounded-xl border-2 border-border focus:border-accent outline-none resize-none text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer / checkout */}
            {lines.length > 0 && (
              <div className="border-t border-border p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-xl font-bold text-accent">${subtotal}</span>
                </div>
                <button
                  onClick={onSubmit}
                  disabled={submitting}
                  className="w-full bg-accent text-white py-3.5 rounded-xl font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending order…
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Place order · ${subtotal}
                    </>
                  )}
                </button>
                <p className="text-xs text-muted text-center">Charged to your room · pay at checkout</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

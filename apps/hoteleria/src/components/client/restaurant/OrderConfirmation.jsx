import { motion } from 'framer-motion'
import { CheckCircle, Clock, Receipt, UtensilsCrossed, ChevronRight } from 'lucide-react'

// Success screen shown after a room-service order is placed.
// `order` is the object built by MenuBrowser (number, items, total, eta, room).
export default function OrderConfirmation({ order, onClose }) {
  if (!order) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-md mx-auto text-center py-6"
    >
      {/* Animated check */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto rounded-full bg-accent/15 flex items-center justify-center mb-5"
      >
        <CheckCircle className="w-10 h-10 text-accent" />
      </motion.div>

      <h2 className="text-2xl font-bold mb-1">Order confirmed!</h2>
      <p className="text-muted mb-6">
        Your order is on its way to Room {order.room}. Sit back and relax.
      </p>

      {/* Order meta */}
      <div className="bg-surface rounded-2xl p-5 shadow-soft text-left mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted">Order number</span>
          </div>
          <span className="font-bold">#{order.number}</span>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted">Estimated delivery</span>
          </div>
          <span className="font-bold text-accent">{order.eta}</span>
        </div>

        {/* Items */}
        <div className="pt-4 space-y-2">
          {order.items.map((line) => (
            <div key={line.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-md bg-accent/10 text-accent text-xs font-bold grid place-items-center flex-shrink-0">
                  {line.qty}
                </span>
                <span className="truncate">{line.name}</span>
              </span>
              <span className="font-medium whitespace-nowrap">${line.price * line.qty}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
          <span className="font-bold">Total</span>
          <span className="text-xl font-bold text-accent">${order.total}</span>
        </div>

        {order.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted mb-1">Special instructions</p>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted flex items-center justify-center gap-1.5 mb-6">
        <UtensilsCrossed className="w-3.5 h-3.5" />
        Charged to your room account · pay at checkout
      </p>

      <button
        onClick={onClose}
        className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2"
      >
        Back to my stay
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

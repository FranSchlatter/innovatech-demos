import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function CartDrawer({ cart, total, onClose, onRemove, onClear }) {
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleOrder = () => {
    setOrderPlaced(true)
    setTimeout(() => {
      onClear()
      onClose()
      setOrderPlaced(false)
    }, 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-bg z-50 shadow-lg overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Tu Carrito</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {orderPlaced ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-80 text-center"
            >
              <CheckCircle className="w-16 h-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h3>
              <p className="text-muted">Te contactaremos para confirmar tu dirección</p>
            </motion.div>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.length === 0 ? (
                  <p className="text-muted text-center py-8">Tu carrito está vacío</p>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="card flex gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-primary font-bold">${item.price}</p>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Summary */}
              {cart.length > 0 && (
                <>
                  <div className="border-t border-border pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted">Subtotal</span>
                      <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total}</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleOrder}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary w-full mb-3"
                  >
                    Confirmar Pedido
                  </motion.button>
                </>
              )}

              <button
                onClick={onClose}
                className="btn-secondary w-full"
              >
                Continuar Comprando
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

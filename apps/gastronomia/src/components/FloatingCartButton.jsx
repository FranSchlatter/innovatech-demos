import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

export default function FloatingCartButton({ itemCount, total, onClick }) {
  if (itemCount === 0) return null

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="fixed bottom-6 right-6 z-40 bg-accent hover:bg-accent/90 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 transition-colors"
      >
        {/* Cart Icon with Badge */}
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <motion.span
            key={itemCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-white text-accent text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
          >
            {itemCount}
          </motion.span>
        </div>

        {/* Text */}
        <div className="text-left">
          <p className="text-sm font-medium opacity-90">View Cart</p>
          <p className="text-lg font-bold">${total.toFixed(2)}</p>
        </div>

        {/* Arrow indicator */}
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-xl"
        >
          →
        </motion.span>
      </motion.button>
    </AnimatePresence>
  )
}

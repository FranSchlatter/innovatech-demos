import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react'

// Available customization options (could come from dish data in the future)
const ADDITION_OPTIONS = [
  { id: 'extra-cheese', name: 'Extra Cheese', price: 2.50 },
  { id: 'avocado', name: 'Avocado', price: 3.00 },
  { id: 'bacon', name: 'Crispy Bacon', price: 3.50 },
  { id: 'truffle-oil', name: 'Truffle Oil', price: 4.00 },
  { id: 'grilled-onions', name: 'Grilled Onions', price: 1.50 },
  { id: 'mushrooms', name: 'Sautéed Mushrooms', price: 2.00 }
]

const REMOVAL_OPTIONS = [
  { id: 'no-onions', name: 'No Onions' },
  { id: 'no-garlic', name: 'No Garlic' },
  { id: 'no-spicy', name: 'No Spicy' },
  { id: 'no-dairy', name: 'No Dairy' },
  { id: 'no-gluten', name: 'Gluten Free (if available)' }
]

export default function DishCustomizeModal({ dish, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [additions, setAdditions] = useState([])
  const [removals, setRemovals] = useState([])
  const [specialInstructions, setSpecialInstructions] = useState('')

  if (!isOpen || !dish) return null

  const handleIncrement = () => setQuantity(prev => Math.min(prev + 1, 10))
  const handleDecrement = () => setQuantity(prev => Math.max(prev - 1, 1))

  const toggleAddition = (option) => {
    setAdditions(prev =>
      prev.find(a => a.id === option.id)
        ? prev.filter(a => a.id !== option.id)
        : [...prev, option]
    )
  }

  const toggleRemoval = (option) => {
    setRemovals(prev =>
      prev.includes(option.id)
        ? prev.filter(id => id !== option.id)
        : [...prev, option.id]
    )
  }

  const additionsTotal = additions.reduce((sum, a) => sum + a.price, 0)
  const itemPrice = dish.price + additionsTotal
  const totalPrice = itemPrice * quantity

  const handleAddToCart = () => {
    const customizations = {
      additions: additions.map(a => ({ id: a.id, name: a.name, price: a.price })),
      removals: removals,
      specialInstructions: specialInstructions.trim()
    }

    // Only include customizations if there are any
    const hasCustomizations = additions.length > 0 || removals.length > 0 || specialInstructions.trim()

    onAddToCart({
      id: dish.id,
      name: dish.name,
      price: itemPrice,
      basePrice: dish.price,
      image: dish.image,
      quantity,
      ...(hasCustomizations && { customizations })
    })

    // Reset form
    setQuantity(1)
    setAdditions([])
    setRemovals([])
    setSpecialInstructions('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header with Image */}
            <div className="relative h-48 md:h-56 flex-shrink-0">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dish Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-primary text-primary-contrast text-xs font-bold px-2 py-1 rounded-full">
                  {dish.category}
                </span>
                <h2 className="text-xl md:text-2xl font-bold mt-2">{dish.name}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span>{dish.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{dish.preparationTime} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Base Price */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <span className="text-muted">Base Price</span>
                <span className="text-2xl font-bold text-accent">${dish.price.toFixed(2)}</span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="font-semibold text-primary mb-3">Quantity</h3>
                <div className="flex items-center gap-4 bg-bg p-3 rounded-xl w-fit">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity === 1}
                    className="w-10 h-10 bg-surface hover:bg-accent hover:text-white rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:hover:bg-surface disabled:hover:text-current"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity === 10}
                    className="w-10 h-10 bg-surface hover:bg-accent hover:text-white rounded-lg flex items-center justify-center transition disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Additions */}
              <div className="mb-6">
                <h3 className="font-semibold text-primary mb-3">Add Extra (Optional)</h3>
                <div className="grid grid-cols-1 gap-2">
                  {ADDITION_OPTIONS.map((option) => {
                    const isSelected = additions.find(a => a.id === option.id)
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleAddition(option)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-accent bg-accent' : 'border-muted'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium">{option.name}</span>
                        </div>
                        <span className="text-accent font-semibold">+${option.price.toFixed(2)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Removals */}
              <div className="mb-6">
                <h3 className="font-semibold text-primary mb-3">Remove (Optional)</h3>
                <div className="flex flex-wrap gap-2">
                  {REMOVAL_OPTIONS.map((option) => {
                    const isSelected = removals.includes(option.id)
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleRemoval(option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-red-500/20 text-red-500 border-2 border-red-500'
                            : 'bg-bg text-muted border-2 border-transparent hover:border-red-500/50'
                        }`}
                      >
                        {option.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-6">
                <h3 className="font-semibold text-primary mb-3">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Allergies, preferences, special requests..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl bg-bg border-2 border-border focus:border-accent outline-none transition resize-none"
                />
                <p className="text-xs text-muted mt-1 text-right">
                  {specialInstructions.length}/200
                </p>
              </div>

              {/* Allergen Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted">
                  Please inform our staff about any allergies. We cannot guarantee a completely allergen-free environment.
                </p>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="p-4 border-t border-border bg-surface flex-shrink-0">
              {/* Price Summary */}
              {additions.length > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted">Additions</span>
                  <span className="text-accent">+${additionsTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-accent">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-5 h-5" />
                Add {quantity} to Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

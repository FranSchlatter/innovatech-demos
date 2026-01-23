import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Clock, Minus, Plus, ShoppingCart } from 'lucide-react'

export default function DishDetail({ dish, onBack, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)

  const handleIncrement = () => setQuantity(prev => prev + 1)
  const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const handleAddToCart = () => {
    onAddToCart({
      ...dish,
      quantity
    })
  }

  return (
    <div className="min-h-screen bg-bg py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </motion.button>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-primary text-primary-contrast px-4 py-2 rounded-full font-bold shadow-lg">
                {dish.category}
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mt-6">
              {dish.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-surface text-text px-4 py-2 rounded-full text-sm font-medium border-2 border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{dish.name}</h1>

            {/* Rating and Prep Time */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(dish.rating) ? 'fill-accent text-accent' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <span className="font-bold text-lg">{dish.rating}</span>
                <span className="text-muted">({dish.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Clock size={20} />
                <span>{dish.preparationTime} min</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-muted mb-6 leading-relaxed">
              {dish.description}
            </p>

            {/* Ingredients Section */}
            {dish.ingredients && (
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              <div className="text-5xl font-bold text-primary mb-2">
                ${dish.price}
              </div>
              <p className="text-sm text-muted">Price per serving</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecrement}
                  className="w-12 h-12 bg-surface hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors"
                  disabled={quantity === 1}
                >
                  <Minus size={20} />
                </button>
                <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="w-12 h-12 bg-surface hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-surface p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">${dish.price * quantity}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary text-2xl">${dish.price * quantity}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all inline-flex items-center justify-center gap-3 shadow-lg"
              >
                <ShoppingCart size={24} />
                Add to Order
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-bold text-lg mb-4">Additional Information</h3>
              <ul className="space-y-2 text-muted">
                <li>• Fresh ingredients sourced daily</li>
                <li>• Prepared by our expert chefs</li>
                <li>• Can be customized upon request</li>
                <li>• Allergen information available</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

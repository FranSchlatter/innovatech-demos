import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Clock, Minus, Plus, ShoppingCart, ChevronLeft, CheckCircle, Award, Shield, Settings2 } from 'lucide-react'

export default function DishDetail({ dish, onBack, onAddToCart, onCustomize }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const handleIncrement = () => setQuantity(prev => prev + 1)
  const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const handleAddToCart = () => {
    onAddToCart({
      ...dish,
      quantity
    })
  }

  // Gallery images - using dish image multiple times (can be expanded later with real images)
  const galleryImages = [
    dish.image,
    dish.image,
    dish.image,
    dish.image
  ]

  // Key highlights
  const keyHighlights = [
    'Fresh ingredients sourced daily',
    'Prepared by expert chefs',
    'Can be customized to preferences',
    'Allergen information available',
    'Nutritional details provided',
    'Sustainable sourcing'
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Back Button - Fixed */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onBack}
        className="fixed top-24 left-6 z-40 flex items-center gap-2 text-accent hover:text-primary transition bg-bg px-4 py-2 rounded-lg shadow-soft"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-64 md:h-96 relative overflow-hidden"
      >
        <img
          src={galleryImages[selectedImage]}
          alt={dish.name}
          className="w-full h-full object-cover"
        />

        {/* Category Badge */}
        <div className="absolute top-6 left-6 bg-primary text-primary-contrast px-4 py-2 rounded-full font-bold shadow-lg">
          {dish.category}
        </div>

        {/* Gallery Navigation Dots */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-2 justify-center">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`h-2 transition-all ${
                idx === selectedImage
                  ? 'w-8 bg-accent'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="heading-md mb-4">{dish.name}</h1>
              <div className="flex flex-wrap gap-6 text-muted mb-6">
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
                  <span className="font-bold text-lg text-accent">{dish.rating}</span>
                  <span className="text-muted">({dish.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>{dish.preparationTime} min</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {dish.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-primary mb-4">About This Dish</h2>
              <p className="text-muted leading-relaxed mb-4">
                {dish.description}
              </p>
              <p className="text-muted leading-relaxed">
                Crafted with passion and precision by our expert chefs, this dish represents
                the perfect balance of flavors and textures. Each ingredient is carefully selected
                to ensure the highest quality and an unforgettable dining experience.
              </p>
            </div>

            {/* Ingredients */}
            {dish.ingredients && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-primary mb-6">Main Ingredients</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {dish.ingredients.map((ingredient, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-4 rounded-lg bg-bg"
                    >
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm text-muted">{ingredient}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* What Makes This Special */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-primary mb-6">What Makes This Special</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyHighlights.map((highlight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-accent mt-0.5">✓</span>
                    <span className="text-sm text-muted">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dish Specifications */}
            <div className="bg-bg p-8 rounded-lg">
              <h2 className="text-xl font-semibold text-primary mb-6">Dish Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-sm text-muted mb-2">Category</div>
                  <div className="text-lg font-semibold text-primary">{dish.category}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Prep Time</div>
                  <div className="text-lg font-semibold text-primary">{dish.preparationTime} min</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Serving Size</div>
                  <div className="text-lg font-semibold text-primary">1 person</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Rating</div>
                  <div className="text-lg font-semibold text-primary">{dish.rating}/5.0</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Reviews</div>
                  <div className="text-lg font-semibold text-primary">{dish.reviews}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Customizable</div>
                  <div className="text-lg font-semibold text-primary">Yes</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Order Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-fit"
          >
            <div className="bg-bg p-8 rounded-lg shadow-soft sticky top-24">
              {/* Price */}
              <div className="mb-8 pb-8 border-b border-surface">
                <div className="text-sm text-muted mb-2">Price per serving</div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-accent">${dish.price}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="font-semibold text-primary mb-4">Quantity</h3>
                <div className="flex items-center justify-between gap-4 bg-surface p-4 rounded-lg">
                  <button
                    onClick={handleDecrement}
                    className="w-10 h-10 bg-bg hover:bg-accent hover:text-white rounded-lg flex items-center justify-center transition-all"
                    disabled={quantity === 1}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-bold text-primary">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="w-10 h-10 bg-bg hover:bg-accent hover:text-white rounded-lg flex items-center justify-center transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="mb-8 bg-surface p-6 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold">${dish.price * quantity}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent text-2xl">${dish.price * quantity}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full text-center inline-flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={20} />
                  Add to Order
                </button>
                {onCustomize && (
                  <button
                    onClick={onCustomize}
                    className="w-full bg-surface border-2 border-accent text-accent hover:bg-accent hover:text-white py-3 px-6 rounded-xl font-semibold transition inline-flex items-center justify-center gap-3"
                  >
                    <Settings2 size={20} />
                    Customize Order
                  </button>
                )}
                <button
                  onClick={onBack}
                  className="btn-secondary w-full text-center"
                >
                  Back to Menu
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-surface">
                <p className="text-xs text-muted mb-3 font-semibold">QUALITY CERTIFICATIONS</p>
                <div className="flex items-center justify-around gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <Award className="w-6 h-6 text-accent" />
                    <span className="text-xs text-muted">Chef Selected</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="w-6 h-6 text-accent" />
                    <span className="text-xs text-muted">Food Safe</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

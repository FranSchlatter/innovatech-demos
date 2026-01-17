import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Clock, Filter, X } from 'lucide-react'
import dishes from '@shared-data/dishes.json'

export default function MenuGrid({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['Todas', ...new Set(dishes.map(d => d.category))]

  const filteredDishes = selectedCategory === 'Todas' 
    ? dishes 
    : dishes.filter(d => d.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 md:hidden bg-accent text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Filter size={20} />
          Filtrar por Categoría
        </button>

        <div className={`${showFilters ? 'block' : 'hidden'} md:block p-4 md:p-0 bg-surface/30 md:bg-transparent rounded-lg md:rounded-none mb-6`}>
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <h3 className="font-bold text-lg md:block hidden">Categorías</h3>
            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setShowFilters(false)
                }}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-surface hover:bg-surface/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredDishes.map((dish) => (
          <motion.div
            key={dish.id}
            variants={itemVariants}
            className="group bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full font-bold shadow-lg">
                ${dish.price}
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-semibold">
                {dish.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2">{dish.name}</h3>
              <p className="text-muted text-sm mb-4 line-clamp-2">{dish.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(dish.rating) ? 'fill-accent text-accent' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold">{dish.rating}</span>
                <span className="text-xs text-muted">({dish.reviews})</span>
              </div>

              {/* Details */}
              <div className="flex items-center gap-3 mb-4 text-xs text-muted">
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-accent" />
                  <span>{dish.preparationTime} min</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {dish.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-accent/10 text-accent px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={() => onAddToCart(dish)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Agregar al Carrito
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

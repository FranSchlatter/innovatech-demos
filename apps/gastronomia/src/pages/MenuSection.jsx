import { motion } from 'framer-motion'
import { Clock, Plus } from 'lucide-react'
import { useState } from 'react'
import dishes from '@shared-data/dishes.json'

export default function MenuSection({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', ...new Set(dishes.map(d => d.category))]
  const filtered = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(d => d.category === selectedCategory)

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === cat
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            {cat === 'all' ? 'Todos' : cat}
          </motion.button>
        ))}
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((dish, idx) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="card card-hover group overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden rounded-lg mb-4">
              <img 
                src={dish.image} 
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-primary text-primary-contrast px-3 py-1 rounded-full font-semibold">
                ${dish.price}
              </div>
            </div>

            <h3 className="text-lg font-bold text-text mb-2">{dish.name}</h3>
            <p className="text-muted text-sm mb-4">{dish.description}</p>

            <div className="flex items-center gap-2 text-xs text-muted mb-4">
              <Clock className="w-4 h-4" />
              {dish.preparationTime} min
            </div>

            <motion.button
              onClick={() => onAddToCart(dish)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

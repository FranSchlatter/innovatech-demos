import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Clock, Eye, Settings2 } from 'lucide-react'
import gastronomyData from '@shared-data/gastronomy.json'

export default function MenuGrid({ onAddToCart, onCustomize, onViewDetails }) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Appetizers', 'Main Courses', 'Desserts', 'Drinks']

  const filteredDishes = selectedCategory === 'All'
    ? gastronomyData.dishes
    : gastronomyData.dishes.filter(dish => dish.category === selectedCategory)

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === category
                ? 'bg-primary text-primary-contrast shadow-lg'
                : 'bg-surface text-text hover:bg-primary/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDishes.map((dish, idx) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.05 }}
            className="bg-surface rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-primary text-primary-contrast px-3 py-1 rounded-full text-sm font-semibold">
                {dish.category}
              </div>
              {/* Tags */}
              <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
                {dish.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-bg/90 text-text px-2 py-1 rounded text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {dish.name}
              </h3>
              <p className="text-sm text-muted mb-3 line-clamp-2">
                {dish.description}
              </p>

              {/* Ingredients as Tags */}
              {dish.ingredients && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted mb-2">Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {dish.ingredients.slice(0, 4).map((ingredient) => (
                      <span
                        key={ingredient}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {dish.ingredients.length > 4 && (
                      <span className="text-xs text-muted px-2 py-1">
                        +{dish.ingredients.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-4 text-sm text-muted">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-accent fill-accent" />
                  <span className="font-semibold">{dish.rating}</span>
                  <span>({dish.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{dish.preparationTime} min</span>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary">
                  ${dish.price}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDetails(dish)}
                    className="bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-primary-contrast p-2 rounded-lg transition-all"
                    title="View Details"
                  >
                    <Eye size={20} />
                  </button>
                  {onCustomize && (
                    <button
                      onClick={() => onCustomize(dish)}
                      className="bg-surface border-2 border-accent text-accent hover:bg-accent hover:text-white p-2 rounded-lg transition-all"
                      title="Customize"
                    >
                      <Settings2 size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => onAddToCart(dish)}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2 font-semibold"
                  >
                    <ShoppingCart size={20} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredDishes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-xl text-muted">No dishes found in this category.</p>
        </motion.div>
      )}
    </div>
  )
}

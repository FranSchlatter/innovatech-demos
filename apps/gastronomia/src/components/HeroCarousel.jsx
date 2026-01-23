import { motion } from 'framer-motion'
import { ChefHat, Utensils } from 'lucide-react'

export default function HeroCarousel({ onViewMenu, onBookTable }) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-primary/20 to-bg flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
          alt="Gourmet Food"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-primary text-primary-contrast p-4 rounded-full">
              <ChefHat size={48} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Discover Exquisite Flavors
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted mb-10"
          >
            International fusion cuisine crafted with passion. Order online or reserve your table for an unforgettable dining experience.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={onViewMenu}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <Utensils size={24} />
              View Our Menu
            </button>
            <button
              onClick={onBookTable}
              className="bg-primary hover:bg-primary/90 text-primary-contrast px-8 py-4 rounded-lg text-lg font-semibold transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <ChefHat size={24} />
              Book a Table
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-primary">20+</div>
              <div className="text-sm text-muted">Signature Dishes</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-primary">4.8★</div>
              <div className="text-sm text-muted">Average Rating</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-primary">30min</div>
              <div className="text-sm text-muted">Fast Delivery</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-muted text-sm flex flex-col items-center gap-2"
        >
          <span>Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-muted rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1 h-3 bg-muted rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

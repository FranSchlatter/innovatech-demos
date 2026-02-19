import { motion } from 'framer-motion'
import { ChevronDown, Star, MapPin, Calendar, Check } from 'lucide-react'

export default function HeroCarousel() {
  const handleBookNow = () => {
    document.getElementById('accommodation')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleExplore = () => {
    document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' })
  }

  const features = [
    '5-Star Luxury Resort',
    'Oceanfront Property',
    '24/7 Concierge Service',
    'Award-Winning Spa'
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black" id="hero">
      {/* Background Image with Parallax Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop&q=90"
          alt="Luxury Resort"
          className="w-full h-full object-cover"
        />
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </motion.div>

      {/* Content Container */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full mb-6"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">Luxury Hospitality</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Experience
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400">
              Timeless Elegance
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
          >
            Immerse yourself in unparalleled luxury where every detail is crafted
            to create unforgettable memories. Your sanctuary awaits.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 gap-3 mb-10 max-w-xl"
          >
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/90">
                <Check className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={handleBookNow}
              className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Your Stay
            </button>
            <button
              onClick={handleExplore}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Explore Amenities
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating Stats */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[140px]">
          <div className="text-3xl font-bold text-white mb-1">250+</div>
          <div className="text-sm text-gray-300">Luxury Rooms</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[140px]">
          <div className="text-3xl font-bold text-white mb-1">4.9★</div>
          <div className="text-sm text-gray-300">Guest Rating</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[140px]">
          <div className="text-3xl font-bold text-white mb-1">50+</div>
          <div className="text-sm text-gray-300">Years Legacy</div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
      >
        <span className="text-sm tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </div>
  )
}

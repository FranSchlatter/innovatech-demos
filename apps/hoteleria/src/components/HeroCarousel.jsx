import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const slides = [
    {
      title: "A Sanctuary of Elegance",
      subtitle: "Where luxury meets refined simplicity",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&h=900&fit=crop",
      cta: "Explore Accommodations",
      action: () => document.getElementById('accommodation')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      title: "Unforgettable Moments Await",
      subtitle: "Curated experiences designed for discerning guests",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop",
      cta: "View Amenities",
      action: () => document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      title: "Your Perfect Escape Awaits",
      subtitle: "Discover the art of luxurious hospitality",
      image: "https://images.unsplash.com/photo-1591088398332-8c5ebbf30f2f?w=1600&h=900&fit=crop",
      cta: "Book Your Stay",
      action: () => document.getElementById('accommodation')?.scrollIntoView({ behavior: 'smooth' })
    }
  ]

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [autoPlay, slides.length])

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-primary"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
      id="hero"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-center text-primary-contrast px-4 max-w-4xl z-10"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6 flex justify-center"
          >
            <Sparkles className="w-8 h-8 text-gold" />
          </motion.div>

          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-6 tracking-tight leading-tight">
            {slides[current].title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl font-light mb-12 text-primary-contrast/90 tracking-wide">
            {slides[current].subtitle}
          </p>

          {/* CTA */}
          <motion.button
            onClick={slides[current].action}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary uppercase tracking-widest text-sm font-semibold px-10 py-4"
          >
            {slides[current].cta}
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-contrast/60"
        >
          <ChevronLeft className="w-6 h-6 rotate-90" />
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 text-primary-contrast p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} strokeWidth={3} />
      </button>

      <button
        onClick={next}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 text-primary-contrast p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={24} strokeWidth={3} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setCurrent(idx)
              setAutoPlay(false)
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? 'bg-white w-8'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

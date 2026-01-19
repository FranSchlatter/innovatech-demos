import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const slides = [
    {
      title: "A Sanctuary of Elegance",
      subtitle: "Where luxury meets refined simplicity",
      image: "https://cdn.pixabay.com/photo/2016/11/17/09/28/hotel-1831072_1280.jpg?w=1600&q=90&auto=format&fit=crop",
      cta: "Explore Accommodations",
      action: () => document.getElementById('accommodation')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      title: "Unforgettable Moments",
      subtitle: "Curated experiences for discerning guests",
      image: "https://cdn.pixabay.com/photo/2018/02/22/08/05/palma-3172367_1280.jpg?w=1600&q=90&auto=format&fit=crop",
      cta: "View Amenities",
      action: () => document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      title: "Your Perfect Escape",
      subtitle: "Discover the art of luxurious hospitality",
      image: "https://cdn.pixabay.com/photo/2014/09/17/22/12/pool-450170_1280.jpg?w=1600&q=90&auto=format&fit=crop",
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

  const goToSlide = (idx) => {
    setCurrent(idx)
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
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-center text-white px-4 max-w-3xl z-10 bg-black/30 backdrop-blur-md rounded-2xl py-8 px-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            {/* <Sparkles className="w-6 h-6 text-gold" /> */}
          </motion.div>

          {/* Heading */}
          <h1 className="font-serif text-3xl md:text-5xl font-light mb-3 tracking-tight leading-tight">
            {slides[current].title}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg font-light text-white tracking-wide">
            {slides[current].subtitle}
          </p>
        </motion.div>

        {/* CTA - Outside the background panel */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          onClick={slides[current].action}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary uppercase tracking-widest text-sm font-semibold px-10 py-4 z-10"
        >
          {slides[current].cta}
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Dots Indicator - Sin botones de navegación left/right */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => goToSlide(idx)}
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

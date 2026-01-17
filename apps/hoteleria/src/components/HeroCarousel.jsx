import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const slides = [
    {
      title: "Bienvenido a InnovaTech Luxury Resort",
      subtitle: "Experiencia hotelera premium con tecnología de punta",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&h=700&fit=crop",
      cta: "Explorar Habitaciones"
    },
    {
      title: "Playas Privadas y Vistas Espectaculares",
      subtitle: "Disfruta de nuestras exclusivas amenities y servicios de 5 estrellas",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=700&fit=crop",
      cta: "Descubre Más"
    },
    {
      title: "Suites de Lujo y Comodidad",
      subtitle: "Cada detalle diseñado para tu máxima satisfacción",
      image: "https://images.unsplash.com/photo-1591088398332-8c5ecd3971d7?w=1400&h=700&fit=crop",
      cta: "Reservar Ahora"
    }
  ]

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
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
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-white px-4 max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            {slides[current].title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 font-light">
            {slides[current].subtitle}
          </p>
          <button className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105">
            {slides[current].cta}
          </button>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
        aria-label="Slide siguiente"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx)
              setAutoPlay(false)
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Ir a slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="absolute bottom-24 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-white text-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
              <div className="text-3xl font-bold">250+</div>
              <div className="text-sm text-gray-200">Habitaciones</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm text-gray-200">Satisfacción</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
              <div className="text-3xl font-bold">⭐5.0</div>
              <div className="text-sm text-gray-200">Calificación</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

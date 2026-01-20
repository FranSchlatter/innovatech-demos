import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import services from '@shared-data/services.json'

export default function ServicesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  // Adjust items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1)
      else if (window.innerWidth < 1024) setItemsPerView(2)
      else setItemsPerView(3)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalSlides = Math.ceil(services.length / itemsPerView)
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const visibleServices = services.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  )

  const getCategoryColor = (category) => {
    const colors = {
      Diagnostics: 'from-blue-400 to-blue-600',
      Imaging: 'from-purple-400 to-purple-600',
      Cardiac: 'from-red-400 to-red-600',
      Procedures: 'from-green-400 to-green-600',
      Treatment: 'from-orange-400 to-orange-600',
      Rehabilitation: 'from-teal-400 to-teal-600',
      Surgery: 'from-pink-400 to-pink-600',
      Preventive: 'from-yellow-400 to-yellow-600',
      Behavioral: 'from-indigo-400 to-indigo-600',
      Wellness: 'from-cyan-400 to-cyan-600'
    }
    return colors[category] || 'from-accent to-secondary'
  }

  const getIcon = (iconName) => {
    const icon = Icons[iconName]
    return icon || Icons.Heart
  }

  return (
    <section id="services" className="py-20 md:py-32 bg-surface dark:bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-4">Medical Services</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Advanced diagnostic, therapeutic, and surgical services available at all our locations
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleServices.map((service, idx) => {
                const IconComponent = getIcon(service.icon)
                const colorClass = getCategoryColor(service.category)
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group relative bg-bg dark:bg-primary/10 rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-10 group-hover:opacity-20 transition-opacity`} />

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClass} shadow-md`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                          {service.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-primary dark:text-white mb-2 group-hover:text-accent transition-colors">
                        {service.name}
                      </h3>

                      <p className="text-sm text-muted dark:text-gray-300 mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Service Info */}
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted dark:text-gray-400">Turnaround:</span>
                          <span className="font-semibold text-primary dark:text-white">{service.turnaround}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted dark:text-gray-400">Cost:</span>
                          <span className="font-semibold text-accent">{service.cost}</span>
                        </div>
                      </div>

                      {/* Learn More Button */}
                      <button className="w-full mt-4 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent font-semibold rounded-lg transition-all duration-300 group-hover:translate-y-0 translate-y-1">
                        More Info
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-accent text-white hover:bg-accent/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'bg-accent w-8'
                      : 'bg-accent/30 w-2 hover:bg-accent/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-accent text-white hover:bg-accent/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted dark:text-gray-400">
              Slide {currentIndex + 1} of {totalSlides}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

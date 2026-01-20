import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
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

  const getIcon = (iconName) => {
    const icon = Icons[iconName]
    return icon || Icons.Heart
  }

  const visibleServices = services.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  )

  return (
    <section id="services" className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-text">Medical Services</h2>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
            Advanced diagnostic, therapeutic, and surgical services
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
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              {visibleServices.map((service, idx) => {
                const IconComponent = getIcon(service.icon)

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group bg-bg border border-border rounded-xl p-5 md:p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Icon - Simple, no background gradient */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-accent/10">
                        <IconComponent className="w-6 h-6 text-accent" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base md:text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Service Info - With Category */}
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
                      <div className="flex items-center gap-3">
                        <span className="text-muted">
                          <span className="font-medium text-text">{service.turnaround}</span>
                        </span>
                        <span className="text-accent font-semibold">
                          {service.cost}
                        </span>
                      </div>
                      <span className="text-xs bg-primary/5 text-primary px-2 py-1 rounded">
                        {service.category}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* Minimal Navigation */}
          <div className="flex flex-col items-center gap-3 mt-8 md:mt-10">
            {/* Dot Indicators */}
            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'bg-accent w-8'
                      : 'bg-border w-1.5 hover:bg-accent/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Swipe Hint */}
            <p className="text-xs text-muted">Swipe to explore more services</p>
          </div>
        </div>
      </div>
    </section>
  )
}

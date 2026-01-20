import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'
import doctors from '@shared-data/doctors.json'

export default function DoctorsSlider({ onSelectDoctor }) {
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

  // Show only first 12 doctors
  const featuredDoctors = doctors.slice(0, 12)
  const totalSlides = Math.ceil(featuredDoctors.length / itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const visibleDoctors = featuredDoctors.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  )

  return (
    <section id="doctors" className="py-16 md:py-24 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-text">
            Meet Our Doctors
          </h2>
          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
            Board-certified medical professionals dedicated to your health
          </p>
        </motion.div>

        {/* Doctors Carousel */}
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
              {visibleDoctors.map((doctor, idx) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group bg-surface border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer"
                  onClick={() => onSelectDoctor && onSelectDoctor(doctor)}
                >
                  {/* Doctor Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Specialty Badge */}
                    <div className="absolute top-3 right-3 bg-accent text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                      {doctor.specialty}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      {doctor.rating}
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-5">
                    {/* Name */}
                    <h3 className="text-lg md:text-xl font-bold text-text mb-1 group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-muted mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{doctor.location}</span>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                      {doctor.bio}
                    </p>

                    {/* Reviews & Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="text-xs text-muted">
                        <span className="font-semibold text-text">{doctor.reviews}</span> reviews
                      </div>
                      <div className="text-sm font-bold text-accent">
                        ${doctor.price}
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectDoctor && onSelectDoctor(doctor)
                      }}
                      className="w-full mt-4 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Book Appointment
                    </button>
                  </div>
                </motion.div>
              ))}
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
                  aria-label={`Go to doctors page ${idx + 1}`}
                />
              ))}
            </div>

            {/* Swipe Hint */}
            <p className="text-xs text-muted">Swipe to meet more doctors</p>
          </div>
        </div>
      </div>
    </section>
  )
}

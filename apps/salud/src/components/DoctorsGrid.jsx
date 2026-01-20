import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, CheckCircle, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import doctors from '@shared-data/doctors.json'

export default function DoctorsGrid({ onSelectDoctor, filterBySpecialty = null }) {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const filteredDoctors = filterBySpecialty
    ? doctors.filter(d => d.specialty === filterBySpecialty)
    : doctors

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.offsetWidth * 0.8
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 10)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
    )
  }

  return (
    <div className="relative">
      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-scroll scroll-smooth pb-4 snap-x snap-mandatory hide-scrollbar px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex-shrink-0 w-[280px] bg-surface border-2 border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer snap-start"
            onClick={() => onSelectDoctor(doctor)}
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Badge */}
              {doctor.certifications && (
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Award size={12} />
                  Certified
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-lg mb-1 text-text group-hover:text-primary transition-colors">
                {doctor.name}
              </h3>
              <p className="text-sm text-primary font-semibold mb-3">{doctor.specialty}</p>
              <p className="text-xs text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                {doctor.bio}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(doctor.rating) ? 'fill-primary text-primary' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-text">{doctor.rating}</span>
                <span className="text-xs text-text-secondary">({doctor.reviews} reviews)</span>
              </div>

              {/* Details */}
              <div className="space-y-2.5 mb-5 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <CheckCircle size={14} className="text-primary flex-shrink-0" />
                  <span className="truncate">{doctor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock size={14} className="text-primary flex-shrink-0" />
                  <span className="font-semibold text-text">${doctor.price}</span> per visit
                </div>
              </div>

              {/* CTA */}
              <button className="w-full btn-primary text-sm py-2.5">
                Book Appointment
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform z-10"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Swipe Hint */}
      <div className="text-center mt-6">
        <p className="text-sm text-text-secondary">
          Swipe to explore more physicians →
        </p>
      </div>
    </div>
  )
}

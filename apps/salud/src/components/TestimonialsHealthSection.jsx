import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, CheckCircle } from 'lucide-react'

export default function TestimonialsHealthSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  const testimonials = [
    {
      id: 1,
      author: "Carlos Mendoza",
      specialty: "Cardiology Consultation",
      rating: 5,
      text: "Excellent care. Dr. Pérez was very professional and explained everything in detail. Highly recommended.",
      verified: true
    },
    {
      id: 2,
      author: "Lucia Fernández",
      specialty: "Dermatology Consultation",
      rating: 5,
      text: "Dr. López is excellent! She solved my skin problem in the first consultation. Thank you!",
      verified: true
    },
    {
      id: 3,
      author: "Roberto Silva",
      specialty: "General Medicine Follow-up",
      rating: 5,
      text: "Very efficient appointment system. Dr. García is always available when I need her.",
      verified: true
    },
    {
      id: 4,
      author: "Patricia Gómez",
      specialty: "Psychology Consultation",
      rating: 5,
      text: "Dr. Sofía is empathetic and professional. She helped me a lot in my sessions. Totally recommended.",
      verified: true
    },
    {
      id: 5,
      author: "Miguel Torres",
      specialty: "Ophthalmology Consultation",
      rating: 5,
      text: "Fast, efficient and professional. Dr. Díaz has excellent warmth with patients.",
      verified: true
    },
    {
      id: 6,
      author: "Sofía Ruiz",
      specialty: "Pediatrics - My son",
      rating: 5,
      text: "Dr. Fernando is very good with children. My son loves going to appointments. Very reliable.",
      verified: true
    },
    {
      id: 7,
      author: "Jennifer Adams",
      specialty: "Orthopedics",
      rating: 5,
      text: "Outstanding physical therapy program. My knee recovery exceeded all expectations.",
      verified: true
    },
    {
      id: 8,
      author: "David Thompson",
      specialty: "Neurology",
      rating: 5,
      text: "Dr. Martinez took time to thoroughly understand my condition. The care plan has been life-changing.",
      verified: true
    }
  ]

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

  const totalSlides = Math.ceil(testimonials.length / itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const visibleTestimonials = testimonials.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  )

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-text">
            Patient Experiences
          </h2>
          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
            Thousands of satisfied patients trust our healthcare professionals
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
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
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-bg rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-all border border-border"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-text text-sm md:text-base">{testimonial.author}</h3>
                        {testimonial.verified && (
                          <CheckCircle size={16} className="text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-secondary">{testimonial.specialty}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < testimonial.rating ? 'fill-accent text-accent' : 'text-border'}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-text-secondary leading-relaxed text-sm">
                    "{testimonial.text}"
                  </p>
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
                  aria-label={`Go to testimonial page ${idx + 1}`}
                />
              ))}
            </div>

            {/* Swipe Hint */}
            <p className="text-xs text-muted">Swipe to read more reviews</p>
          </div>
        </div>
      </div>
    </section>
  )
}

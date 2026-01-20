import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle } from 'lucide-react'

export default function TestimonialsHealthSection() {
  const scrollContainerRef = useRef(null)

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

  return (
    <section className="py-20 bg-surface/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
            Patient Experiences
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Thousands of satisfied patients trust our healthcare professionals
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-scroll scroll-smooth pb-6 snap-x snap-mandatory hide-scrollbar px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[340px] bg-bg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all snap-start border border-border"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-text">{testimonial.author}</h3>
                      {testimonial.verified && (
                        <CheckCircle size={16} className="text-primary" />
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
                      size={16}
                      className={i < testimonial.rating ? 'fill-primary text-primary' : 'text-gray-300'}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-text-secondary leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Swipe Indicator */}
          <div className="text-center mt-6">
            <p className="text-sm text-text-secondary">
              Swipe to read more patient stories →
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Star, CheckCircle } from 'lucide-react'
import { useState, useRef } from 'react'
import reviewsData from '@shared-data/reviews.json'

export default function ReviewsSection() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef(null)

  const avgRating = (
    reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length
  ).toFixed(1)

  return (
    <section className="py-20 md:py-32 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-8">Guest Voices</h2>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-6 mb-12 flex-col md:flex-row">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={i < Math.round(avgRating) ? 'fill-gold text-gold' : 'text-muted'}
                  />
                ))}
              </div>
              <span className="text-4xl font-light text-primary">{avgRating}</span>
              <span className="text-sm text-muted">Based on {reviewsData.length} verified reviews</span>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-left md:text-center">
              <p className="text-lg text-muted max-w-xl">
                Discover authentic experiences from guests who've experienced our exceptional hospitality
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-8 md:pb-4"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            {reviewsData.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 bg-surface rounded-lg p-6 shadow-soft hover:shadow-medium transition-all border border-border"
              >
                {/* Verified Badge */}
                {review.verified && (
                  <div className="flex items-center gap-2 mb-3 text-accent text-xs">
                    <CheckCircle size={14} />
                    <span className="font-medium">Verified Guest</span>
                  </div>
                )}

                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? 'fill-gold text-gold' : 'text-border'}
                    />
                  ))}
                </div>

                {/* Review */}
                <p className="text-muted text-sm italic mb-4 leading-relaxed line-clamp-3">
                  "{review.comment}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-primary text-sm">{review.author}</p>
                  <p className="text-xs text-muted">{review.date}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sin botones de navegación - scroll natural */}
        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <p className="text-sm text-muted font-medium">
            Scroll to view more reviews
          </p>
        </motion.div>
      </div>
    </section>
  )
}


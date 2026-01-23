import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import gastronomyData from '@shared-data/gastronomy.json'

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Customer Reviews
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Trusted by food lovers everywhere
          </p>
        </motion.div>

        {/* Minimal Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {gastronomyData.reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-bg p-6 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              {/* Rating Stars - Smaller */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? 'fill-accent text-accent' : 'text-gray-400'}
                  />
                ))}
              </div>

              {/* Comment - Compact */}
              <p className="text-sm text-muted mb-4 leading-relaxed line-clamp-3">
                "{review.comment}"
              </p>

              {/* Customer Info - Minimal */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-text">{review.name}</p>
                  <p className="text-muted">{review.dish}</p>
                </div>
                <p className="text-muted">
                  {new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center items-center gap-12 flex-wrap"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">4.8★</div>
            <p className="text-sm text-muted">Avg Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">2,500+</div>
            <p className="text-sm text-muted">Reviews</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">98%</div>
            <p className="text-sm text-muted">Recommend</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

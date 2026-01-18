import { motion } from 'framer-motion'
import { Star, CheckCircle } from 'lucide-react'
import reviewsData from '@shared-data/reviews.json'

export default function ReviewsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  }

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

        {/* Reviews Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviewsData.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="bg-surface rounded-lg p-8 shadow-soft hover:shadow-medium transition-all border border-border"
            >
              {/* Verified Badge */}
              {review.verified && (
                <div className="flex items-center gap-2 mb-4 text-accent text-sm">
                  <CheckCircle size={16} />
                  <span className="font-medium">Verified Guest</span>
                </div>
              )}

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'fill-gold text-gold' : 'text-border'}
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-muted italic mb-6 leading-relaxed">
                "{review.comment}"
              </p>

              {/* Author */}
              <div className="pt-6 border-t border-border">
                <p className="font-semibold text-primary">{review.author}</p>
                <p className="text-sm text-muted">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-muted mb-6 text-lg">Had an unforgettable experience? We'd love to hear your story</p>
          <button className="btn-secondary">
            Share Your Review
          </button>
        </motion.div>
      </div>
    </section>
  )
}


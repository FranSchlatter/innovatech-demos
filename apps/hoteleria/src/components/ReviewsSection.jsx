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
    <section className="py-20 bg-surface/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Lo que Nuestros Huéspedes Dicen
          </h2>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={i < Math.round(avgRating) ? 'fill-accent text-accent' : 'text-gray-400'}
                  />
                ))}
              </div>
              <span className="text-3xl font-bold">{avgRating}</span>
              <span className="text-muted">({reviewsData.length} reseñas verificadas)</span>
            </div>
          </div>
          
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Experiencias reales de huéspedes satisfechos que confiaron en nosotros
          </p>
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
              className="bg-bg rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{review.author}</h3>
                    {review.verified && (
                      <CheckCircle size={18} className="text-accent" />
                    )}
                  </div>
                  <p className="text-sm text-muted">{review.date}</p>
                </div>
                <div className="text-right">
                  <div className="flex justify-end gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-accent text-accent' : 'text-gray-400'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h4 className="font-semibold text-lg mb-3">{review.title}</h4>

              {/* Comment */}
              <p className="text-muted leading-relaxed">
                "{review.comment}"
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted mb-4">¿Quieres dejar tu reseña?</p>
          <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-all">
            Compartir Experiencia
          </button>
        </motion.div>
      </div>
    </section>
  )
}

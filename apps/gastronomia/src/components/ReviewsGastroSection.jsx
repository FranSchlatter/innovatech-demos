import { motion } from 'framer-motion'
import { Star, CheckCircle } from 'lucide-react'

export default function ReviewsGastroSection() {
  const reviews = [
    {
      id: 1,
      author: "Diego Moreno",
      rating: 5,
      text: "Excelente comida y servicio impecable. El choripán es lo mejor que he probado. Voy cada semana!",
      verified: true
    },
    {
      id: 2,
      author: "Andrea López",
      rating: 5,
      text: "La calidad de la carne es increíble. El Bife de Chorizo es una obra de arte. Totalmente recomendado.",
      verified: true
    },
    {
      id: 3,
      author: "Fernando García",
      rating: 5,
      text: "Ambiente acogedor, comida casera que vuelve loco. Las pastas están simplemente increíbles.",
      verified: true
    },
    {
      id: 4,
      author: "Mariana Santos",
      rating: 4,
      text: "Muy buen lugar para comer. Las opciones vegetarianas son excelentes. Precios muy justos.",
      verified: true
    },
    {
      id: 5,
      author: "Roberto Fernández",
      rating: 5,
      text: "Cada plato es una sorpresa. El Chef sabe perfectamente lo que hace. ¡Simplemente perfecto!",
      verified: true
    },
    {
      id: 6,
      author: "Sofía Martínez",
      rating: 5,
      text: "Restaurante 10/10. Comida deliciosa, precios accesibles y servicio con sonrisa. Mi lugar favorito.",
      verified: true
    }
  ]

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
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
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
            Lo que Nuestros Clientes Dicen
          </h2>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
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
              <span className="text-muted">({reviews.length} reseñas)</span>
            </div>
          </div>
          
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Descubre por qué somos el restaurante favorito de la ciudad
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
          {reviews.map((review) => (
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
                </div>
                <div className="text-right">
                  <div className="flex justify-end gap-1">
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

              {/* Comment */}
              <p className="text-muted leading-relaxed">
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

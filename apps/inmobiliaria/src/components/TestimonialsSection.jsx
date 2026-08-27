import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import testimonials from '../data/testimonials.json'
import { formatDate } from '../utils/format'

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-surface-alt">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <h2 className="heading-md">Lo que dicen nuestros clientes</h2>
          <p className="mt-4 text-muted">
            Miles de familias e inversores ya confiaron en Terranova para dar su próximo paso.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative bg-surface border border-border rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-accent/40" />

              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-text">{t.author}</p>
                  <p className="text-muted text-xs">{t.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < t.rating ? 'fill-gold text-gold' : 'text-muted'
                    }`}
                  />
                ))}
              </div>

              <h3 className="font-semibold text-text mt-4">{t.title}</h3>
              <p className="text-muted mt-2">{t.comment}</p>
              <p className="text-xs text-muted mt-4">{formatDate(t.date)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

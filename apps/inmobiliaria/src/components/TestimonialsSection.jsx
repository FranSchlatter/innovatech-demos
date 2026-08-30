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
          className="max-w-2xl mb-14"
        >
          <hr className="rl-rule rl-rule--gold w-14" />
          <h2 className="rl-display text-primary mt-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>Lo que dicen nuestros clientes</h2>
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
              transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rl-card relative p-7"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-hairline" />

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

              <h3 className="rl-serif text-lg text-primary mt-5">{t.title}</h3>
              <p className="text-text mt-2 leading-relaxed" style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic' }}>{t.comment}</p>
              <p className="rl-label mt-4">{formatDate(t.date)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

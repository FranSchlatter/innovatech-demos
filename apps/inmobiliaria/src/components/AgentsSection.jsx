import { motion } from 'framer-motion'
import { Star, Phone, Mail } from 'lucide-react'
import agents from '../data/agents.json'

export default function AgentsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <h2 className="heading-md">Nuestro equipo</h2>
          <p className="mt-4 text-muted">
            Asesores expertos que conocen cada barrio y te acompañan con dedicación en la búsqueda de tu próxima propiedad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, idx) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-surface border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <img
                src={agent.photo}
                alt={agent.name}
                loading="lazy"
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-primary">{agent.name}</h3>
                <p className="text-accent text-sm">{agent.role}</p>
                <p className="text-muted text-xs">{agent.specialty}</p>

                <div className="flex items-center gap-1 mt-3 text-sm">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-medium text-text">{agent.rating}</span>
                  <span className="text-muted">({agent.reviews})</span>
                </div>

                <p className="text-xs text-muted mt-2">
                  {agent.salesClosed} operaciones · {agent.yearsExperience} años
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {agent.languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-surface-alt rounded px-2 py-0.5 text-xs text-muted"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-border rounded-lg px-3 py-2 text-sm text-text hover:bg-surface-alt transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Llamar
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-contrast rounded-lg px-3 py-2 text-sm hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

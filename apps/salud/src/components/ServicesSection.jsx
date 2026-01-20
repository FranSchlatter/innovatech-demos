import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import services from '@shared-data/services.json'

export default function ServicesSection() {

  const getCategoryColor = (category) => {
    const colors = {
      'Diagnostics': 'bg-blue-100 text-blue-700',
      'Imaging': 'bg-purple-100 text-purple-700',
      'Cardiac': 'bg-red-100 text-red-700',
      'Procedures': 'bg-green-100 text-green-700',
      'Treatment': 'bg-orange-100 text-orange-700',
      'Rehabilitation': 'bg-teal-100 text-teal-700',
      'Surgery': 'bg-pink-100 text-pink-700',
      'Preventive': 'bg-yellow-100 text-yellow-700',
      'Behavioral': 'bg-indigo-100 text-indigo-700',
      'Wellness': 'bg-cyan-100 text-cyan-700'
    }
    return colors[category] || 'bg-accent/10 text-accent'
  }

  const getIcon = (iconName) => {
    const icon = Icons[iconName]
    return icon || Icons.Heart
  }

  return (
    <section className="py-20 md:py-32 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-4">Medical Services</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Comprehensive diagnostic, therapeutic, and surgical services available across all our locations
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const IconComponent = getIcon(service.icon)
            const categoryColor = getCategoryColor(service.category)

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                {/* Category Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${categoryColor}`}>
                  <IconComponent className="w-3 h-3" />
                  {service.category}
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-muted mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Details */}
                <div className="space-y-2 text-xs mb-4 pb-4 border-t border-bg">
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-muted">Turnaround Time</span>
                    <span className="font-semibold text-text">{service.turnaround}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Cost Range</span>
                    <span className="font-semibold text-accent">{service.cost}</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-accent/10 hover:bg-accent hover:text-white text-accent font-semibold py-2 rounded-lg transition-all duration-300">
                  Learn More
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

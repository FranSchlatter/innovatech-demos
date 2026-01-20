import { motion } from 'framer-motion'
import { TestTube, ScanLine, Activity, Dumbbell, Pill, Video, Ambulance, Syringe, Apple, Baby, Moon, Zap, HeartPulse, Stethoscope, ClipboardCheck } from 'lucide-react'
import servicesData from '@shared-data/services.json'

const iconMap = {
  TestTube, ScanLine, Activity, Dumbbell, Pill, Video, Ambulance, Syringe, Apple, Baby, Moon, Zap, HeartPulse, Stethoscope, ClipboardCheck
}

export default function ServicesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Show only first 12 services for a more compact layout
  const displayedServices = servicesData.slice(0, 12)

  return (
    <section id="services" className="py-16 md:py-20 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
            Comprehensive Medical Services
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            From diagnostic testing to advanced treatments, we offer complete healthcare under one roof
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {displayedServices.map((service) => {
            const Icon = iconMap[service.icon] || Activity
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Icon - colored without background like specialties */}
                  <Icon className="w-7 h-7 text-primary flex-shrink-0" strokeWidth={1.5} />

                  <div className="flex-1">
                    <h4 className="font-bold text-base mb-1 text-text">
                      {service.name}
                    </h4>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Compact Info */}
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
                      <span className="text-text-secondary">{service.availability}</span>
                      <span className="font-semibold text-primary">{service.pricing}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Compact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-text-secondary mb-4">
            Looking for a specific service?
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary"
          >
            Contact Our Care Team
          </button>
        </motion.div>
      </div>
    </section>
  )
}

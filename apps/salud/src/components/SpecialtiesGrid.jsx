import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Activity, Baby, Brain, Eye, Wind, Apple, Bone, AlertCircle, ShieldAlert, ShieldPlus, TestTube, Ear, Syringe, Zap } from 'lucide-react'
import specialtiesData from '@shared-data/specialties.json'

// Icon mapping
const iconMap = {
  Heart,
  Sparkles,
  Bone,
  Baby,
  Brain,
  Activity,
  Wind,
  Eye,
  ShieldPlus,
  ShieldAlert,
  AlertCircle,
  TestTube,
  Ear,
  Apple,
  Syringe,
  Zap
}

export default function SpecialtiesGrid({ onSelectSpecialty }) {
  const scrollContainerRef = useRef(null)

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

  return (
    <section id="specialties" className="py-20 md:py-28 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
            Our Medical Specialties
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            Expert care across 20 specialized medical departments
          </p>
        </motion.div>

        {/* Specialties Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {specialtiesData.map((specialty) => {
            const Icon = iconMap[specialty.icon] || Heart
            return (
              <motion.div
                key={specialty.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group cursor-pointer bg-bg border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all"
                onClick={() => onSelectSpecialty(specialty)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon - just colored, no background */}
                  <Icon className="w-8 h-8 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />

                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-lg font-bold mb-1 text-text group-hover:text-primary transition-colors">
                      {specialty.name}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-3">
                      {specialty.description}
                    </p>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="text-xs text-text-secondary">
                        From ${specialty.consultationPrice}
                      </div>
                      <div className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn More →
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-text-secondary mb-6">
            Can't find what you're looking for?
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary"
          >
            Contact Us for More Information
          </button>
        </motion.div>
      </div>
    </section>
  )
}

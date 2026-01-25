import { motion } from 'framer-motion'
import { Award, Users, CheckCircle, Zap } from 'lucide-react'

export default function AboutSection() {
  const features = [
    {
      icon: Award,
      title: "Board-Certified Specialists",
      description: "All our medical professionals are board-certified with years of specialized experience"
    },
    {
      icon: Users,
      title: "Patient-Centered Care",
      description: "We prioritize your comfort and wellbeing in every interaction and treatment"
    },
    {
      icon: CheckCircle,
      title: "Advanced Technology",
      description: "State-of-the-art medical equipment and digital health solutions for accurate diagnostics"
    },
    {
      icon: Zap,
      title: "Quick Appointments",
      description: "Secure your appointment in minutes with our streamlined online booking system"
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-surface dark:bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-4">About InnovaTech Hospital</h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Delivering comprehensive healthcare services with integrity, expertise, and compassion for over 15 years
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop"
              alt="Hospital"
              className="rounded-2xl shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-text mb-4">Our Mission</h3>
              <p className="text-text-secondary mb-4">
                To provide accessible, affordable, and high-quality healthcare to every patient, leveraging technology and medical expertise to ensure the best outcomes.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-text mb-4">Why Choose Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span className="text-text">ISO 9001 certified medical facilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span className="text-text">All insurance plans accepted</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span className="text-text">Emergency services available 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span className="text-text">Multilingual medical staff</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-surface rounded-xl p-6 shadow-soft hover:shadow-md transition-shadow border border-border"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-text mb-2">{feature.title}</h4>
              <p className="text-sm text-text-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

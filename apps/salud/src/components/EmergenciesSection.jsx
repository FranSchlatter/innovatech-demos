import { motion } from 'framer-motion'
import { AlertCircle, Phone, Heart, Activity, Ambulance } from 'lucide-react'

export default function EmergenciesSection() {
  const emergencyServices = [
    {
      icon: Heart,
      title: "Cardiac Emergencies",
      description: "24/7 cardiac care with cath lab"
    },
    {
      icon: Activity,
      title: "Trauma Center",
      description: "Level I trauma with advanced life support"
    },
    {
      icon: Ambulance,
      title: "Stroke Care",
      description: "Certified stroke center with rapid response"
    }
  ]

  const whenToVisitER = [
    "Chest pain or pressure",
    "Severe difficulty breathing",
    "Sudden numbness or weakness",
    "Severe bleeding or head injury"
  ]

  return (
    <section id="emergency" className="py-12 md:py-16 bg-gradient-to-br from-error/5 via-bg to-error/5">
      <div className="container mx-auto px-4 md:px-6">
        {/* Compact Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-error to-error/90 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <AlertCircle className="w-10 h-10 md:w-12 md:h-12" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                24/7 Emergency Care
              </h2>
              <p className="text-base md:text-lg text-white/95 mb-4">
                Life-threatening emergency? Our emergency department is always open.
              </p>
              <a
                href="tel:911"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-error font-bold text-base md:text-lg rounded-lg hover:bg-white/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5" />
                Call 911
              </a>
            </div>
          </div>
        </motion.div>

        {/* Services & When to Visit - Compact 2-col */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Emergency Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-text">
              Emergency Services
            </h3>
            <div className="space-y-3">
              {emergencyServices.map((service, idx) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex gap-3 p-4 bg-surface border border-border rounded-lg hover:border-primary/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-0.5 text-text">
                        {service.title}
                      </h4>
                      <p className="text-xs text-text-secondary">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* When to Visit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-text">
              When to Visit the ER
            </h3>
            <div className="bg-surface border border-border rounded-lg p-5">
              <p className="text-text-secondary mb-4 text-sm">
                Visit immediately if you're experiencing:
              </p>
              <ul className="space-y-2.5">
                {whenToVisitER.map((symptom, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-error" />
                    </div>
                    <span className="text-text text-sm font-medium">{symptom}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

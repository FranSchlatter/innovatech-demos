import { motion } from 'framer-motion'
import { AlertCircle, Phone, Clock, MapPin, Ambulance, Heart, Activity } from 'lucide-react'

export default function EmergenciesSection() {
  const emergencyServices = [
    {
      icon: Heart,
      title: "Cardiac Emergencies",
      description: "24/7 cardiac care with cath lab and specialized cardiology team"
    },
    {
      icon: Activity,
      title: "Trauma Center",
      description: "Level I trauma center with advanced life support capabilities"
    },
    {
      icon: Ambulance,
      title: "Stroke Care",
      description: "Certified stroke center with rapid response protocols"
    }
  ]

  const whenToVisitER = [
    "Chest pain or pressure",
    "Severe difficulty breathing",
    "Sudden numbness or weakness",
    "Severe bleeding or head injury",
    "Loss of consciousness",
    "Severe allergic reaction"
  ]

  return (
    <section id="emergency" className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-bg to-accent/5">
      <div className="container mx-auto px-4 md:px-6">
        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary via-primary-dark to-accent text-white rounded-2xl p-8 md:p-12 mb-16 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <AlertCircle className="w-14 h-14" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                24/7 Emergency Care
              </h2>
              <p className="text-lg md:text-xl text-white/95 mb-6">
                Life-threatening emergency? Don't wait. Our emergency department is always open and ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="tel:911"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl hover:bg-white/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Phone className="w-6 h-6" />
                  Call 911
                </a>
                <button
                  onClick={() => window.open('https://maps.google.com/?q=450+Medical+Plaza+Drive', '_blank')}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all"
                >
                  <MapPin className="w-6 h-6" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Services */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-text">
              Our Emergency Services
            </h3>
            <div className="space-y-6">
              {emergencyServices.map((service, idx) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex gap-4 p-6 bg-surface border border-border rounded-xl hover:border-primary/30 hover:shadow-lg transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 text-text">
                        {service.title}
                      </h4>
                      <p className="text-text-secondary">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              <div className="text-center p-4 bg-primary/5 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-text-secondary">Always Open</div>
              </div>
              <div className="text-center p-4 bg-accent/5 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-1">&lt;15min</div>
                <div className="text-sm text-text-secondary">Avg. Wait Time</div>
              </div>
              <div className="text-center p-4 bg-success/5 rounded-xl">
                <div className="text-3xl font-bold text-success mb-1">Level I</div>
                <div className="text-sm text-text-secondary">Trauma Center</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - When to Visit */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-text">
              When to Visit the ER
            </h3>
            <div className="bg-surface border-2 border-border rounded-2xl p-8 mb-8">
              <p className="text-text-secondary mb-6 text-lg">
                Visit our Emergency Department immediately if you're experiencing any of these symptoms:
              </p>
              <ul className="space-y-4">
                {whenToVisitER.map((symptom, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-error" />
                    </div>
                    <span className="text-text font-medium">{symptom}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Location Info */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
              <h4 className="font-bold text-xl mb-4 text-text flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Emergency Department Location
              </h4>
              <div className="space-y-3 text-text-secondary">
                <p className="font-medium text-text">
                  InnovaTech Medical Center - Downtown
                </p>
                <p>450 Medical Plaza Drive, Suite 100</p>
                <p>Downtown District, CA 90012</p>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">Open 24 Hours, 7 Days a Week</span>
                </div>
              </div>
            </div>

            {/* Alternative Care Notice */}
            <div className="mt-6 p-6 bg-warning/5 border border-warning/20 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-text">
                Non-Emergency Care
              </h4>
              <p className="text-sm text-text-secondary mb-3">
                For non-life-threatening conditions, consider visiting our Urgent Care centers or scheduling a telehealth appointment to avoid ER wait times.
              </p>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Find Alternative Care Options →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

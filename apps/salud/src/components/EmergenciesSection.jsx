import { motion } from 'framer-motion'
import { AlertCircle, Phone, MapPin } from 'lucide-react'

export default function EmergenciesSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-8 items-center"
        >
          {/* Icon & Title */}
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">Emergency?</h3>
              <p className="text-white/90">Available 24/7/365</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
            <p className="text-sm text-white/90 mb-2">Emergency Hotline</p>
            <a
              href="tel:+18008008000"
              className="text-4xl font-bold text-accent-light hover:text-white transition-colors block mb-3"
            >
              +1 (800) 800-8000
            </a>
            <p className="text-xs text-white/80">Call immediately for urgent medical assistance</p>
          </div>

          {/* Directions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-accent-light" />
              <span className="font-semibold">Nearest Location</span>
            </div>
            <p className="text-sm text-white/90 mb-3">
              Emergency rooms equipped with trauma centers at all our facilities
            </p>
            <button className="w-full bg-white text-red-600 hover:bg-red-50 font-bold py-2 rounded-lg transition-colors">
              Find Location
            </button>
          </div>
        </motion.div>

        {/* Emergency Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 p-4 bg-white/10 rounded-lg border-l-4 border-accent-light text-sm text-white/90 text-center"
        >
          <p>
            For life-threatening emergencies, always call emergency services immediately. Our hospitals maintain trauma centers and emergency departments staffed 24/7.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  Pill,
  ClipboardList,
  ArrowRight,
  Phone,
  Clock,
  X
} from 'lucide-react'
import PreCheckInForm from '../pages/PreCheckInForm'

const PATIENT_SERVICES = [
  {
    id: 'appointment',
    name: 'Book Appointment',
    description: 'Schedule a visit with one of our specialists',
    icon: Calendar,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    hoverBorder: 'hover:border-blue-500/50',
    action: 'scroll' // Scrolls to doctors section
  },
  {
    id: 'precheckin',
    name: 'Pre-Check-In',
    description: 'Complete medical forms before your visit',
    icon: ClipboardList,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    hoverBorder: 'hover:border-teal-500/50',
    action: 'modal'
  },
  {
    id: 'records',
    name: 'Medical Records',
    description: 'Access your health records online',
    icon: FileText,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    hoverBorder: 'hover:border-purple-500/50',
    action: 'coming-soon'
  },
  {
    id: 'prescriptions',
    name: 'Prescriptions',
    description: 'Request refills and view medications',
    icon: Pill,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    hoverBorder: 'hover:border-orange-500/50',
    action: 'coming-soon'
  },
  {
    id: 'billing',
    name: 'Pay Bills',
    description: 'View and pay your medical bills',
    icon: CreditCard,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    hoverBorder: 'hover:border-green-500/50',
    action: 'coming-soon'
  },
  {
    id: 'message',
    name: 'Message Doctor',
    description: 'Secure messaging with your care team',
    icon: MessageSquare,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    hoverBorder: 'hover:border-pink-500/50',
    action: 'coming-soon'
  }
]

export default function PatientServicesSection() {
  const [activeModal, setActiveModal] = useState(null)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonService, setComingSoonService] = useState(null)

  const handleServiceClick = (service) => {
    if (service.action === 'modal') {
      setActiveModal(service.id)
    } else if (service.action === 'scroll') {
      document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })
    } else if (service.action === 'coming-soon') {
      setComingSoonService(service)
      setShowComingSoon(true)
      setTimeout(() => setShowComingSoon(false), 3000)
    }
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <>
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary mb-4">
              Patient Services
            </h2>
            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
              Access your healthcare needs quickly and securely online
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {PATIENT_SERVICES.map((service, idx) => {
              const Icon = service.icon
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleServiceClick(service)}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-xl border border-border ${service.hoverBorder} bg-bg text-center transition-all group relative`}
                >
                  {service.action === 'coming-soon' && (
                    <span className="absolute top-2 right-2 text-[10px] bg-muted/20 text-muted px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                  <div className={`w-12 h-12 mx-auto rounded-xl ${service.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <h3 className="font-semibold text-primary text-sm mb-1 group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-muted line-clamp-2">
                    {service.description}
                  </p>
                </motion.button>
              )
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <button
              onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex items-center gap-2"
            >
              Schedule Appointment
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModal('precheckin')}
              className="btn-secondary flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Complete Pre-Check-In
            </button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-muted"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              <span>Call us: <strong className="text-primary">(555) 123-4567</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Mon-Fri: <strong className="text-primary">8 AM - 6 PM</strong></span>
            </div>
          </motion.div>

          {/* Coming Soon Toast */}
          <AnimatePresence>
            {showComingSoon && comingSoonService && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
              >
                <div className="bg-bg border border-border shadow-lg rounded-xl px-6 py-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${comingSoonService.bgColor} flex items-center justify-center`}>
                    <comingSoonService.icon className={`w-5 h-5 ${comingSoonService.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{comingSoonService.name}</p>
                    <p className="text-sm text-muted">This feature is coming soon!</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Pre-Check-In Modal */}
      <AnimatePresence>
        {activeModal === 'precheckin' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal()
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl my-8"
            >
              <PreCheckInForm onClose={closeModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

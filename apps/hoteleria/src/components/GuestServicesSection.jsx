import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Utensils,
  Sparkles,
  Map,
  Waves,
  Wrench,
  Building2,
  ArrowRight,
  X,
  Compass,
  Phone
} from 'lucide-react'
import ServiceRequestForm from '../pages/ServiceRequestForm'
import ExcursionBookingForm from '../pages/ExcursionBookingForm'

const QUICK_SERVICES = [
  {
    id: 'room-service',
    name: 'Room Service',
    description: 'Order food & beverages to your room 24/7',
    icon: Utensils,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    hoverBorder: 'hover:border-orange-500/50'
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping',
    description: 'Extra towels, cleaning, or amenities',
    icon: Sparkles,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    hoverBorder: 'hover:border-blue-500/50'
  },
  {
    id: 'spa',
    name: 'Spa & Wellness',
    description: 'Book relaxing treatments and massages',
    icon: Waves,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    hoverBorder: 'hover:border-teal-500/50'
  },
  {
    id: 'excursions',
    name: 'Excursions',
    description: 'Discover amazing local experiences',
    icon: Compass,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    hoverBorder: 'hover:border-purple-500/50'
  },
  {
    id: 'facilities',
    name: 'Facilities',
    description: 'Reserve gym, pool, or meeting rooms',
    icon: Building2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    hoverBorder: 'hover:border-green-500/50'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Report issues or request repairs',
    icon: Wrench,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    hoverBorder: 'hover:border-gray-500/50'
  }
]

export default function GuestServicesSection() {
  const [activeModal, setActiveModal] = useState(null) // 'service' | 'excursion' | null
  const [preselectedService, setPreselectedService] = useState(null)

  const handleServiceClick = (serviceId) => {
    if (serviceId === 'excursions') {
      setActiveModal('excursion')
    } else {
      setPreselectedService(serviceId)
      setActiveModal('service')
    }
  }

  const closeModal = () => {
    setActiveModal(null)
    setPreselectedService(null)
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
              Guest Services
            </h2>
            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
              Everything you need for a perfect stay, just one click away
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {QUICK_SERVICES.map((service, idx) => {
              const Icon = service.icon
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleServiceClick(service.id)}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-xl border border-border ${service.hoverBorder} bg-bg text-center transition-all group`}
                >
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

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <button
              onClick={() => setActiveModal('service')}
              className="btn-primary flex items-center gap-2"
            >
              Request a Service
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModal('excursion')}
              className="btn-secondary flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Book an Excursion
            </button>
          </motion.div>

          {/* Help Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Need immediate help? Call the front desk: <strong className="text-accent">ext. 0</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
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
              className="w-full max-w-4xl my-8"
            >
              {activeModal === 'service' && (
                <ServiceRequestForm
                  onClose={closeModal}
                  guestName="John Doe"
                  roomNumber="305"
                />
              )}
              {activeModal === 'excursion' && (
                <ExcursionBookingForm
                  onClose={closeModal}
                  guestName="John Doe"
                  roomNumber="305"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

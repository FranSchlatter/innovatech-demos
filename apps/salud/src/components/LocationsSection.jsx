import { motion } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'
import locations from '@shared-data/locations.json'

export default function LocationsSection() {

  return (
    <section className="py-20 md:py-32 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-4">Our Locations</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Visit us at any of our 4 modern medical facilities across the country
          </p>
        </motion.div>

        {/* Locations Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((location, idx) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-surface rounded-2xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {location.wheelchair_accessible && (
                  <div className="absolute top-4 right-4 bg-accent px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Accessible
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-4">{location.name}</h3>

                {/* Address */}
                <div className="flex gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-text">{location.address}</p>
                    <p className="text-sm text-muted">{location.city}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3 mb-6 pb-6 border-b border-bg">
                  <a
                    href={`tel:${location.phone}`}
                    className="flex gap-3 items-start hover:text-accent transition-colors group/link"
                  >
                    <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-muted">Phone</p>
                      <p className="font-semibold text-text group-hover/link:text-accent">{location.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${location.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 items-start hover:text-accent transition-colors group/link"
                  >
                    <div className="w-5 h-5 text-accent flex-shrink-0 mt-1">📱</div>
                    <div>
                      <p className="text-sm text-muted">WhatsApp</p>
                      <p className="font-semibold text-text group-hover/link:text-accent">{location.whatsapp}</p>
                    </div>
                  </a>
                </div>

                {/* Hours */}
                <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                    <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-semibold text-text">Hours</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted">
                    {Object.entries(location.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between px-3">
                        <span className="capitalize">{day}</span>
                        <span className="font-medium text-text">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                {location.specialties && (
                  <div>
                    <p className="text-xs font-semibold text-muted mb-2">SPECIALTIES AVAILABLE</p>
                    <div className="flex flex-wrap gap-2">
                      {location.specialties.slice(0, 3).map((spec) => (
                        <span key={spec} className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                      {location.specialties.length > 3 && (
                        <span className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded">
                          +{location.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

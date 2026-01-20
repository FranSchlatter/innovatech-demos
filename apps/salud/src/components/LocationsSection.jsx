import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'
import { useState } from 'react'
import locations from '@shared-data/locations.json'

export default function LocationsSection() {
  const [selectedLocation, setSelectedLocation] = useState(0)
  const location = locations[selectedLocation]

  return (
    <section className="py-16 md:py-24 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-text">Our Locations</h2>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
            Visit us at any of our 4 modern medical facilities across the country
          </p>
        </motion.div>

        {/* Tabs Selector */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex bg-surface rounded-xl p-1 shadow-soft overflow-x-auto max-w-full">
            {locations.map((loc, idx) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(idx)}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base whitespace-nowrap transition-all duration-300 ${
                  idx === selectedLocation
                    ? 'bg-accent text-white shadow-md'
                    : 'text-muted hover:text-primary hover:bg-bg'
                }`}
              >
                {loc.city}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Location Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLocation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="group bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Grid Layout: Image left, Content right on desktop */}
              <div className="grid md:grid-cols-5 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-auto md:col-span-2 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-transparent" />
                  {location.wheelchair_accessible && (
                    <div className="absolute top-4 right-4 bg-accent px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Accessible
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 md:col-span-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">{location.name}</h3>

                  {/* Address */}
                  <div className="flex gap-3 mb-5">
                    <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-text">{location.address}</p>
                      <p className="text-sm text-muted">{location.city}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                    <a
                      href={`tel:${location.phone}`}
                      className="flex gap-3 items-start hover:text-accent transition-colors group/link"
                    >
                      <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted mb-0.5">Phone</p>
                        <p className="font-semibold text-text text-sm group-hover/link:text-accent">{location.phone}</p>
                      </div>
                    </a>

                    <a
                      href={`https://wa.me/${location.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 items-start hover:text-accent transition-colors group/link"
                    >
                      <div className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 text-xl">📱</div>
                      <div>
                        <p className="text-xs text-muted mb-0.5">WhatsApp</p>
                        <p className="font-semibold text-text text-sm group-hover/link:text-accent">{location.whatsapp}</p>
                      </div>
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="mb-6">
                    <div className="flex gap-2 items-center mb-3">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-text">Operating Hours</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                      {Object.entries(location.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize text-muted">{day}</span>
                          <span className="font-medium text-text">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  {location.specialties && (
                    <div>
                      <p className="text-xs font-semibold text-muted mb-3">SPECIALTIES AVAILABLE</p>
                      <div className="flex flex-wrap gap-2">
                        {location.specialties.slice(0, 5).map((spec) => (
                          <span key={spec} className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full">
                            {spec}
                          </span>
                        ))}
                        {location.specialties.length > 5 && (
                          <span className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full">
                            +{location.specialties.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

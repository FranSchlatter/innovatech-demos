import { motion } from 'framer-motion'
import { Star, Globe, Shield } from 'lucide-react'

export default function DoctorsGrid({ filteredDoctors = null, onSelectDoctor }) {
  const allDoctors = require('@shared-data/doctors.json')
  const doctors = filteredDoctors || allDoctors

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor, idx) => (
        <motion.div
          key={doctor.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
          onClick={() => onSelectDoctor(doctor)}
          className="group bg-surface rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer"
        >
          {/* Image */}
          <div className="relative h-64 overflow-hidden bg-bg">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Rating Badge */}
            <div className="absolute top-4 right-4 bg-accent text-white px-3 py-2 rounded-lg flex items-center gap-1 font-semibold shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              <span>{doctor.rating}</span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-lg">
              ${doctor.price}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-3">
              <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors mb-1">
                {doctor.name}
              </h3>
              <p className="text-sm font-semibold text-accent">{doctor.specialty}</p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-bg">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < Math.round(doctor.rating) ? 'currentColor' : 'none'}
                    className={i < Math.round(doctor.rating) ? 'text-yellow-400 w-4 h-4' : 'text-gray-300 w-4 h-4'}
                  />
                ))}
              </div>
              <span className="text-xs text-muted">({doctor.reviews} reviews)</span>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted mb-4 line-clamp-3">{doctor.bio}</p>

            {/* Languages & Insurance */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-text">Languages</p>
                  <p className="text-muted">{doctor.languages.join(', ')}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-text">Insurance</p>
                  <p className="text-muted">{doctor.insurance.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-accent hover:bg-secondary text-white font-bold py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg">
              Book Appointment
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

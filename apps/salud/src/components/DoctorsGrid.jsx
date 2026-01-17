import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Users, Clock, CheckCircle } from 'lucide-react'
import doctors from '@shared-data/doctors.json'

export default function DoctorsGrid({ onSelectDoctor }) {
  const specialties = ['Todas', ...new Set(doctors.map(d => d.specialty))]
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas')

  const filteredDoctors = selectedSpecialty === 'Todas' 
    ? doctors 
    : doctors.filter(d => d.specialty === selectedSpecialty)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div>
      {/* Specialty Filter */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedSpecialty === specialty
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-surface hover:bg-surface/80'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {filteredDoctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            variants={itemVariants}
            className="bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-lg mb-1">{doctor.name}</h3>
              <p className="text-sm text-accent font-semibold mb-2">{doctor.specialty}</p>
              <p className="text-xs text-muted mb-4 line-clamp-2">{doctor.bio}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(doctor.rating) ? 'fill-accent text-accent' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold">{doctor.rating}</span>
                <span className="text-xs text-muted">({doctor.reviews})</span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-accent" />
                  <span>{doctor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-accent" />
                  <span>${doctor.price} por consulta</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => onSelectDoctor(doctor)}
                className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded-lg font-semibold transition-all text-sm"
              >
                Agendar Cita
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

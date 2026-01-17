import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import doctors from '@shared-data/doctors.json'

export default function DoctorsList({ onSelectDoctor }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {doctors.map((doctor, idx) => (
        <motion.div
          key={doctor.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="card card-hover group"
        >
          <div className="flex gap-4 mb-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-text">{doctor.name}</h3>
              <p className="text-primary font-semibold text-sm mb-2">{doctor.specialty}</p>
              <p className="text-muted text-sm">${doctor.price} ARS</p>
            </div>
          </div>

          <p className="text-muted text-sm mb-4">{doctor.bio}</p>

          <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs text-muted font-semibold mb-2">Disponibilidad</p>
            <div className="grid grid-cols-3 gap-2">
              {doctor.availability.slice(0, 6).map((slot, i) => (
                <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded text-center">
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <motion.button
            onClick={() => onSelectDoctor(doctor)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary w-full"
          >
            Agendar Turno
          </motion.button>
        </motion.div>
      ))}
    </div>
  )
}

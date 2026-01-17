import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AppointmentForm({ doctor, onBook }) {
  const [appointment, setAppointment] = useState({
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    reason: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!appointment.date || !appointment.time) {
      alert('Por favor selecciona fecha y hora')
      return
    }
    onBook(appointment)
    setAppointment({
      date: '',
      time: '',
      name: '',
      email: '',
      phone: '',
      reason: ''
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {/* Doctor Summary */}
      <div className="card md:col-span-1">
        <img src={doctor.image} alt={doctor.name} className="w-full rounded-lg mb-4" />
        <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
        <p className="text-primary font-semibold text-sm mb-4">{doctor.specialty}</p>
        <div className="border-t border-border pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-muted">Consulta:</span>
            <span className="font-semibold">${doctor.price}</span>
          </div>
          <div className="border-t border-border mt-2 pt-2">
            <p className="text-xs text-muted">{doctor.bio}</p>
          </div>
        </div>
      </div>

      {/* Appointment Form */}
      <form onSubmit={handleSubmit} className="card md:col-span-2">
        <h3 className="text-2xl font-bold mb-6">Datos del Turno</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Fecha</label>
            <input
              type="date"
              value={appointment.date}
              onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Hora</label>
            <select
              value={appointment.time}
              onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
            >
              <option value="">Selecciona horario</option>
              {doctor.availability.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Razón de la Consulta</label>
          <textarea
            placeholder="Describe tu motivo de consulta..."
            value={appointment.reason}
            onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={appointment.name}
              onChange={(e) => setAppointment({ ...appointment, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={appointment.email}
              onChange={(e) => setAppointment({ ...appointment, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Teléfono</label>
          <input
            type="tel"
            placeholder="+54 9 342 1234567"
            value={appointment.phone}
            onChange={(e) => setAppointment({ ...appointment, phone: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary w-full"
        >
          Confirmar Turno
        </motion.button>

        <p className="text-xs text-muted text-center mt-4">
          Recibirás una confirmación por email
        </p>
      </form>
    </motion.div>
  )
}

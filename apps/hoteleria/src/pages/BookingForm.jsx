import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, CreditCard } from 'lucide-react'

export default function BookingForm({ room, onBook }) {
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!booking.checkIn || !booking.checkOut) {
      alert('Por favor selecciona fechas válidas')
      return
    }
    onBook(booking)
  }

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0
    const check = new Date(booking.checkIn)
    const checkout = new Date(booking.checkOut)
    return Math.ceil((checkout - check) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const total = nights > 0 ? nights * room.price : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {/* Resumen de la habitación */}
      <div className="card md:col-span-1">
        <img src={room.image} alt={room.name} className="w-full rounded-lg mb-4" />
        <h3 className="text-xl font-bold mb-2">{room.name}</h3>
        <p className="text-muted text-sm mb-4">{room.description}</p>
        <div className="border-t border-border pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-muted">Precio por noche:</span>
            <span className="font-semibold">${room.price}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted">Noches:</span>
            <span className="font-semibold">{nights}</span>
          </div>
          <div className="border-t border-border mt-2 pt-2 flex justify-between">
            <span className="font-bold">Total:</span>
            <span className="text-xl font-bold text-primary">${total}</span>
          </div>
        </div>
      </div>

      {/* Formulario de reserva */}
      <form onSubmit={handleSubmit} className="card md:col-span-2">
        <h3 className="text-2xl font-bold mb-6">Detalles de Reserva</h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Check-in</label>
          <input
            type="date"
            value={booking.checkIn}
            onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Check-out</label>
          <input
            type="date"
            value={booking.checkOut}
            onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Cantidad de Huéspedes</label>
          <select
            value={booking.guests}
            onChange={(e) => setBooking({ ...booking, guests: parseInt(e.target.value) })}
            className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
          >
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} huéspedes</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={booking.name}
              onChange={(e) => setBooking({ ...booking, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={booking.email}
              onChange={(e) => setBooking({ ...booking, email: e.target.value })}
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
            value={booking.phone}
            onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
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
          Confirmar Reserva
        </motion.button>

        <p className="text-xs text-muted text-center mt-4">
          Recibirás una confirmación por email
        </p>
      </form>
    </motion.div>
  )
}

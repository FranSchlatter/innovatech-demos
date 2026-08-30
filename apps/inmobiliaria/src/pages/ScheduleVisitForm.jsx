import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Video,
  CalendarCheck,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone
} from 'lucide-react'
import agents from '../data/agents.json'
import { formatPrice, formatDate } from '../utils/format'

const TIME_SLOTS = ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00']

export default function ScheduleVisitForm({ property, onBack, onDone }) {
  const agent = agents.find((a) => a.id === property.agentId)

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [visitType, setVisitType] = useState('in-person')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = form.name && form.email && date && time

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 700)
  }

  const modalityLabel = visitType === 'video' ? 'Videollamada' : 'Presencial'

  return (
    <div className="container mx-auto px-4 py-8 pt-28 max-w-4xl">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-muted hover:text-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT — property summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-surface border border-border rounded-2xl overflow-hidden self-start"
        >
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="heading-sm mb-2">{property.title}</h2>
            <div className="flex items-center gap-2 text-muted mb-4">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                {property.address}, {property.neighborhood}, {property.city}
              </span>
            </div>
            <p className="text-2xl font-bold text-accent mb-5">
              {formatPrice(property.price, property.currency, property.operation)}
            </p>

            {agent && (
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-text truncate">{agent.name}</p>
                  <p className="text-sm text-muted truncate">{agent.role}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT — form or success */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl p-6 self-start"
        >
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
              <h2 className="heading-sm mb-4">¡Visita agendada!</h2>
              <div className="text-left bg-surface-alt border border-border rounded-xl p-4 space-y-2 text-sm mb-6">
                <p className="text-text font-medium">{property.title}</p>
                <p className="text-muted flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-accent" />
                  {formatDate(date)}
                </p>
                <p className="text-muted flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  {time} hs
                </p>
                <p className="text-muted flex items-center gap-2">
                  {visitType === 'video' ? (
                    <Video className="w-4 h-4 text-accent" />
                  ) : (
                    <MapPin className="w-4 h-4 text-accent" />
                  )}
                  {modalityLabel}
                </p>
              </div>
              <p className="text-muted text-sm mb-6">
                Te esperamos. {agent ? agent.name : 'Nuestro asesor'} se pondrá en contacto para
                confirmar.
              </p>
              <button onClick={onDone} className="btn-primary w-full">
                Volver al inicio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="heading-sm">Agendar visita</h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Nombre</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    required
                    placeholder="Tu nombre"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-bg border border-border text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    required
                    placeholder="tu@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-bg border border-border text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder="+54 11 ..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-bg border border-border text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Visit type */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Modalidad</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitType('in-person')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium transition-colors ${
                      visitType === 'in-person'
                        ? 'bg-primary text-primary-contrast'
                        : 'bg-bg text-text hover:bg-surface-alt'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Presencial
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType('video')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium transition-colors ${
                      visitType === 'video'
                        ? 'bg-primary text-primary-contrast'
                        : 'bg-bg text-text hover:bg-surface-alt'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Videollamada
                  </button>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Time slots */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Horario</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 rounded-lg border border-border text-sm font-medium transition-colors ${
                        time === slot
                          ? 'bg-accent text-primary-contrast'
                          : 'bg-bg text-text hover:bg-surface-alt'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Mensaje <span className="text-muted font-normal">(opcional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={handleChange('message')}
                  rows={3}
                  placeholder="Contanos si tenés alguna preferencia o consulta"
                  className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  'Confirmando...'
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    Confirmar visita
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}

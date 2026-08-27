import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, MapPin, Phone, Mail, Clock } from 'lucide-react'

const initialForm = {
  nombre: '',
  email: '',
  telefono: '',
  tipo: 'Comprar',
  mensaje: ''
}

const contactInfo = [
  { icon: MapPin, text: 'Av. del Libertador 5500, CABA' },
  { icon: Phone, text: '+54 11 5123-4500' },
  { icon: Mail, text: 'hola@terranova.com' },
  { icon: Clock, text: 'Lun a Vie 9-19h · Sáb 10-14h' }
]

export default function ContactSection() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleReset = () => {
    setForm(initialForm)
    setSubmitted(false)
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <h2 className="heading-md">Hablemos de tu próxima propiedad</h2>
          <p className="mt-4 text-muted">
            Dejanos tu consulta y un asesor se pondrá en contacto para acompañarte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-soft"
          >
            {submitted ? (
              <div className="flex flex-col items-center text-center py-10">
                <CheckCircle className="w-14 h-14 text-success" />
                <h3 className="heading-sm mt-4">
                  ¡Gracias! Te contactaremos a la brevedad.
                </h3>
                <p className="text-muted mt-2">
                  Recibimos tu consulta y un asesor de Terranova te escribirá muy pronto.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary mt-6"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm text-text mb-1">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full rounded-lg bg-surface-alt border border-border px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm text-text mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="w-full rounded-lg bg-surface-alt border border-border px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm text-text mb-1">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="+54 11 ..."
                      className="w-full rounded-lg bg-surface-alt border border-border px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tipo" className="block text-sm text-text mb-1">
                    Tipo de consulta
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-surface-alt border border-border px-4 py-2.5 text-text focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="Comprar">Comprar</option>
                    <option value="Alquilar">Alquilar</option>
                    <option value="Vender/Tasar">Vender / Tasar</option>
                    <option value="Invertir">Invertir</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm text-text mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    required
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder="Contanos qué estás buscando..."
                    className="w-full rounded-lg bg-surface-alt border border-border px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar consulta
                </button>
              </form>
            )}
          </motion.div>

          {/* RIGHT — agency info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="heading-sm">Terranova Propiedades</h3>
            <p className="text-muted mt-3">
              Somos una inmobiliaria boutique con más de 15 años de trayectoria. Te
              asesoramos con datos, transparencia y un trato cercano en cada operación.
            </p>

            <ul className="mt-6 space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.text} className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-text">{item.text}</span>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8 rounded-xl h-48 bg-surface-alt border border-border flex flex-col items-center justify-center text-center">
              <MapPin className="w-8 h-8 text-accent" />
              <p className="text-muted text-sm mt-2">Oficina central · Buenos Aires</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí irá integración con EmailJS o backend
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <section id="contact" className="py-16 bg-surface/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-text mb-4">Contactá con nosotros</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            ¿Te interesa? Charlemos sobre tu proyecto
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: Mail, label: 'Email', value: 'dm.innovatech@gmail.com' },
            { icon: Phone, label: 'Whatsapp', value: '+54 342 436 5585' },
            { icon: MapPin, label: 'Ubicación', value: 'Paraná, Argentina' }
          ].map((contact, idx) => {
            const Icon = contact.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card text-center"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-text mb-2">{contact.label}</h3>
                <p className="text-muted text-sm">{contact.value}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto card"
        >
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800"
            >
              ✓ Mensaje enviado. Te contactaremos pronto.
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <textarea
            placeholder="Tu mensaje..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-primary transition-colors mb-4"
          />

          <button type="submit" className="btn-primary w-full">
            Enviar mensaje
          </button>
        </motion.form>
      </div>
    </section>
  )
}

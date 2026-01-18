import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular envío
    setTimeout(() => {
      setSubmitted(true)
      setIsLoading(false)
      
      // Resetear después de 4 segundos
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', message: '' })
      }, 4000)
    }, 1000)
  }

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: 'dm.innovatech@gmail.com',
      href: 'mailto:dm.innovatech@gmail.com'
    },
    { 
      icon: Phone, 
      label: 'WhatsApp', 
      value: '+54 342 436 5585',
      href: 'https://wa.me/543424365585'
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: 'Miami, Florida',
      href: 'https://goo.gl/maps/Miami'
    }
  ]

  return (
    <section id="contact" className="py-12 bg-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Get in Touch</h2>
          <p className="text-sm md:text-base text-muted max-w-xl mx-auto">
            Have questions? We're here to help
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {contactInfo.map((contact, idx) => {
            const Icon = contact.icon
            return (
              <motion.a
                key={idx}
                href={contact.href}
                target={contact.label === 'Location' ? '_blank' : undefined}
                rel={contact.label === 'Location' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-3 rounded-lg border border-border bg-surface hover:border-accent hover:shadow-sm transition-all duration-300 cursor-pointer text-center"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-semibold text-primary text-xs">{contact.label}</h3>
                  <p className="text-muted text-xs group-hover:text-accent transition-colors break-all line-clamp-1">
                    {contact.value}
                  </p>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Map Embed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-lg overflow-hidden border border-border shadow-soft h-64 md:h-72 mb-8"
        >
          <iframe
            title="Miami Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.1234567890123!2d-80.19362!3d25.76168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="p-6 md:p-8 rounded-lg border border-border bg-surface shadow-soft">
            <h3 className="text-lg font-bold text-primary mb-4">Send us a Message</h3>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-xs font-medium text-accent">
                  Message sent! We'll be in touch shortly.
                </span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  required
                  className="px-3 py-2 rounded-lg text-sm bg-bg border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  required
                  className="px-3 py-2 rounded-lg text-sm bg-bg border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                />
              </div>

              <textarea
                placeholder="Tell us how we can help..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={isLoading}
                required
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm bg-bg border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isLoading || submitted}
                className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  submitted
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : isLoading
                    ? 'bg-accent/70 text-bg cursor-not-allowed'
                    : 'bg-accent text-bg hover:bg-accent/90 active:scale-95'
                }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Message Sent!
                  </>
                ) : isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

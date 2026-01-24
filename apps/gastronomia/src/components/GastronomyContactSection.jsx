import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, CheckCircle, Clock, Instagram, Facebook, Linkedin, Twitter, UtensilsCrossed } from 'lucide-react'
import { useState } from 'react'

export default function GastronomyContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending
    setTimeout(() => {
      setSubmitted(true)
      setIsLoading(false)

      // Reset after 4 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', phone: '', message: '' })
      }, 4000)
    }, 1200)
  }

  const contactInfo = [
    {
      icon: Phone,
      label: 'Call Us',
      value: '+1 (305) 555-FOOD',
      href: 'tel:+13055553663',
      description: 'Mon-Sun: 11AM - 11PM'
    },
    {
      icon: UtensilsCrossed,
      label: 'Reservations',
      value: 'Book a Table',
      href: '#reservations',
      description: 'Online & Walk-ins'
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: 'hello@restaurant.com',
      href: 'mailto:hello@restaurant.com',
      description: 'Catering inquiries'
    },
    {
      icon: Clock,
      label: 'Opening Hours',
      value: '11:00 AM - 11:00 PM',
      href: null,
      description: 'Kitchen closes at 10:30 PM'
    }
  ]

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-700' }
  ]

  return (
    <section className="py-16 md:py-24 bg-bg relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Visit Us
          </h2>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
            Reserve your table or reach out for catering services and special events
          </p>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">

          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactInfo.map((contact, idx) => {
                const Icon = contact.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    {contact.href ? (
                      <a
                        href={contact.href}
                        target={contact.label === 'Visit Us' ? '_blank' : undefined}
                        rel={contact.label === 'Visit Us' ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-4 p-5 rounded-xl border border-border bg-surface hover:border-accent hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex-shrink-0">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary text-sm mb-1">{contact.label}</h3>
                          <p className="text-sm text-text font-medium group-hover:text-accent transition-colors break-words">
                            {contact.value}
                          </p>
                          <p className="text-xs text-muted mt-1">{contact.description}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-surface">
                        <div className="p-3 rounded-lg bg-accent/10 flex-shrink-0">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary text-sm mb-1">{contact.label}</h3>
                          <p className="text-sm text-text font-medium break-words">
                            {contact.value}
                          </p>
                          <p className="text-xs text-muted mt-1">{contact.description}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Special Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-xl border border-accent/30 bg-accent/5"
            >
              <h3 className="font-semibold text-accent text-sm mb-2 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                Private Events & Catering
              </h3>
              <p className="text-xs text-muted">
                Planning a special event? Contact us for personalized menus and catering options for groups of 10+.
              </p>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-xl border border-border bg-surface"
            >
              <h3 className="font-semibold text-primary text-sm mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent ${social.color} transition-all duration-300`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            {/* Map Preview - Hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="hidden lg:block rounded-xl overflow-hidden border border-border shadow-lg h-64"
            >
              <iframe
                title="Restaurant Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.1234567890123!2d-80.19362!3d25.76168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="p-6 md:p-8 rounded-xl border border-border bg-surface shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-2">Send us a Message</h3>
              <p className="text-sm text-muted mb-6">We'll respond within a few hours</p>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/30 flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-accent">Message Sent Successfully!</p>
                    <p className="text-xs text-accent/80 mt-1">We'll get back to you soon.</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isLoading}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm bg-bg border border-border focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isLoading}
                      required
                      className="w-full px-4 py-3 rounded-lg text-sm bg-bg border border-border focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+1 (305) 555-0123"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-lg text-sm bg-bg border border-border focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell us about your reservation, event, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={isLoading}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg text-sm bg-bg border border-border focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || submitted}
                  whileHover={{ scale: submitted ? 1 : 1.02 }}
                  whileTap={{ scale: submitted ? 1 : 0.98 }}
                  className={`w-full px-6 py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    submitted
                      ? 'bg-accent/20 text-accent border border-accent/30 cursor-default'
                      : isLoading
                      ? 'bg-accent/70 text-bg cursor-not-allowed'
                      : 'bg-accent text-bg hover:bg-accent/90 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {submitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

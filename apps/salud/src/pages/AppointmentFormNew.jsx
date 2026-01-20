import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Mail, Phone, FileText } from 'lucide-react'

export default function AppointmentForm({ doctor, onBook }) {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
    insurance: '',
    agreeTerms: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.patientName || !formData.email || !formData.date || !formData.time) {
      alert('Please fill in all required fields')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      onBook(formData)
      setIsSubmitting(false)
    }, 800)
  }

  // Generate available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = []
    for (let i = 1; i <= 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      if (date.getDay() !== 0) dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const availableDates = getAvailableDates()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-surface rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-bg">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-2xl font-bold text-primary">{doctor.name}</h3>
            <p className="text-accent font-semibold">{doctor.specialty}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              Patient Information
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-bg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-bg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-lg border border-bg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleChange}
                  placeholder="e.g., BlueCross"
                  className="w-full px-4 py-3 rounded-lg border border-bg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Appointment Details
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Preferred Date *
                </label>
                <select
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-bg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                  required
                >
                  <option value="">Select a date</option>
                  {availableDates.map(date => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Preferred Time *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-bg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                  required
                >
                  <option value="">Select a time</option>
                  {doctor.availability?.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <h4 className="font-bold text-primary flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-accent" />
              Reason for Visit
            </h4>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe your symptoms or reason for visit..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-bg focus:outline-none focus:ring-2 focus:ring-accent bg-white resize-none"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-lg">
            <input
              type="checkbox"
              name="agreeTerms"
              id="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-5 h-5 mt-1 accent-accent"
              required
            />
            <label htmlFor="agreeTerms" className="text-sm text-muted">
              I agree to the terms and conditions and consent to receive appointment reminders via email/SMS
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !formData.agreeTerms}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-accent hover:bg-secondary disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-all duration-300 shadow-lg"
          >
            {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
          </motion.button>

          {/* Info */}
          <p className="text-xs text-muted text-center">
            A confirmation email with appointment details will be sent to your email address
          </p>
        </form>
      </div>
    </motion.div>
  )
}

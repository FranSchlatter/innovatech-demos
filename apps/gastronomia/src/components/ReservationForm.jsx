import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Users, CheckCircle } from 'lucide-react'
import gastronomyData from '@shared-data/gastronomy.json'

export default function ReservationForm({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    partySize: '2',
    tablePreference: 'Indoor',
    specialRequests: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center px-4"
        >
          <div className="bg-surface rounded-2xl p-12 shadow-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            >
              <CheckCircle size={48} className="text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Reservation Confirmed!</h2>
            <p className="text-muted mb-6">
              Thank you, <span className="font-semibold text-text">{formData.name}</span>!
            </p>
            <div className="bg-bg p-6 rounded-lg mb-8 text-left space-y-3">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-muted">Date</p>
                  <p className="font-semibold">{formData.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-muted">Time</p>
                  <p className="font-semibold">{formData.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-muted">Party Size</p>
                  <p className="font-semibold">{formData.partySize} guests</p>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted">Table Preference</p>
                <p className="font-semibold">{formData.tablePreference}</p>
              </div>
            </div>
            <p className="text-sm text-muted mb-6">
              A confirmation email has been sent to {formData.email}
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                onBack()
              }}
              className="bg-primary text-primary-contrast px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mb-4"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserve a Table</h1>
          <p className="text-lg text-muted">
            Book your table for an unforgettable dining experience
          </p>
        </div>

        {/* Reservation Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-surface rounded-lg p-8"
        >
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Reservation Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Reservation Details</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  Time *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                >
                  <option value="">Select time</option>
                  {gastronomyData.timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Users size={16} />
                  Party Size *
                </label>
                <select
                  name="partySize"
                  value={formData.partySize}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                    <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Table Preference</label>
                <select
                  name="tablePreference"
                  value={formData.tablePreference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                >
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor Patio</option>
                  <option value="Bar Area">Bar Area</option>
                  <option value="Private">Private Room</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">Special Requests</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors resize-none"
              placeholder="Dietary restrictions, allergies, special occasions, etc..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg text-lg"
          >
            Confirm Reservation
          </button>

          <p className="text-xs text-muted text-center mt-4">
            By submitting this reservation, you agree to our cancellation policy
          </p>
        </motion.form>
      </div>
    </div>
  )
}

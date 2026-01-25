import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  PartyPopper,
  Briefcase,
  Heart,
  MessageSquare,
  Loader2,
  UtensilsCrossed
} from 'lucide-react'
import gastronomyData from '@shared-data/gastronomy.json'

const STEPS = [
  { id: 1, name: 'Date & Time', icon: Calendar },
  { id: 2, name: 'Party', icon: Users },
  { id: 3, name: 'Contact', icon: User },
  { id: 4, name: 'Confirm', icon: CheckCircle }
]

const OCCASIONS = [
  { id: 'casual', label: 'Casual Dining', icon: UtensilsCrossed },
  { id: 'birthday', label: 'Birthday', icon: PartyPopper },
  { id: 'anniversary', label: 'Anniversary', icon: Heart },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'special', label: 'Special Event', icon: Sparkles }
]

const TABLE_AREAS = [
  { id: 'indoor', label: 'Indoor', description: 'Classic dining experience' },
  { id: 'outdoor', label: 'Outdoor Patio', description: 'Al fresco dining' },
  { id: 'bar', label: 'Bar Area', description: 'Casual atmosphere' },
  { id: 'private', label: 'Private Room', description: 'Exclusive seating' }
]

export default function ReservationForm({ onBack }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reservationNumber, setReservationNumber] = useState('')
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    // Date & Time
    date: '',
    time: '',
    // Party Details
    partySize: '2',
    occasion: '',
    tableArea: 'indoor',
    // Contact
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    // Requests
    specialRequests: '',
    dietaryRestrictions: '',
    // Terms
    acceptTerms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = () => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!formData.date) newErrors.date = 'Please select a date'
      if (!formData.time) newErrors.time = 'Please select a time'

      // Check if date is in the past
      if (formData.date) {
        const selectedDate = new Date(formData.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
          newErrors.date = 'Please select a future date'
        }
      }
    }

    if (currentStep === 2) {
      if (!formData.partySize) newErrors.partySize = 'Please select party size'
      if (!formData.tableArea) newErrors.tableArea = 'Please select a table area'
    }

    if (currentStep === 3) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    const resNum = 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase()

    setTimeout(() => {
      setReservationNumber(resNum)
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getOccasionLabel = () => {
    const occasion = OCCASIONS.find(o => o.id === formData.occasion)
    return occasion ? occasion.label : 'Casual Dining'
  }

  const getAreaLabel = () => {
    const area = TABLE_AREAS.find(a => a.id === formData.tableArea)
    return area ? area.label : 'Indoor'
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-bg py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container mx-auto px-4 md:px-6 max-w-lg"
        >
          <div className="bg-surface rounded-2xl p-8 md:p-12 shadow-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Reservation Confirmed!</h2>
            <p className="text-muted mb-6">
              Thank you, {formData.firstName}! Your table has been reserved.
            </p>

            <div className="bg-bg rounded-xl p-6 mb-6 text-left">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                <span className="text-muted">Confirmation</span>
                <span className="font-bold text-accent text-lg">{reservationNumber}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted">Date</p>
                    <p className="font-semibold text-primary">{formatDate(formData.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted">Time</p>
                    <p className="font-semibold text-primary">{formData.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted">Party Size</p>
                    <p className="font-semibold text-primary">{formData.partySize} guests</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted">Table Area</p>
                    <p className="font-semibold text-primary">{getAreaLabel()}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted mb-6">
              A confirmation email has been sent to {formData.email}
            </p>

            <button
              onClick={() => {
                setSubmitted(false)
                setCurrentStep(1)
                onBack()
              }}
              className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold transition-all"
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
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition mb-6 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Reserve a Table</h1>
          <p className="text-muted">Book your unforgettable dining experience</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {STEPS.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-accent text-white shadow-lg'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-surface text-muted border-2 border-border'
                    }`}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span className={`text-xs mt-2 font-medium hidden sm:block ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`}>
                    {step.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-surface rounded-2xl p-6 md:p-8 shadow-lg"
          >
            {/* Step 1: Date & Time */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-accent" />
                  Select Date & Time
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Reservation Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                        errors.date ? 'border-red-500' : 'border-border'
                      } focus:border-accent outline-none transition`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Select Time *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {gastronomyData.timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                          className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                            formData.time === slot
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border hover:border-accent/50 text-muted'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  </div>

                  {formData.date && formData.time && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center"
                    >
                      <p className="text-sm text-accent font-medium">
                        {formatDate(formData.date)} at {formData.time}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Party Details */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                  <Users className="w-6 h-6 text-accent" />
                  Party Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      <Users className="w-4 h-4 inline mr-2" />
                      Party Size *
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, partySize: size.toString() }))}
                          className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                            formData.partySize === size.toString()
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border hover:border-accent/50 text-muted'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {errors.partySize && <p className="text-red-500 text-sm mt-1">{errors.partySize}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Occasion (Optional)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {OCCASIONS.map((occasion) => {
                        const Icon = occasion.icon
                        return (
                          <button
                            key={occasion.id}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              occasion: prev.occasion === occasion.id ? '' : occasion.id
                            }))}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              formData.occasion === occasion.id
                                ? 'border-accent bg-accent/10'
                                : 'border-border hover:border-accent/50'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mb-2 ${
                              formData.occasion === occasion.id ? 'text-accent' : 'text-muted'
                            }`} />
                            <span className={`text-sm font-medium ${
                              formData.occasion === occasion.id ? 'text-accent' : 'text-primary'
                            }`}>
                              {occasion.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Preferred Seating *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {TABLE_AREAS.map((area) => (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tableArea: area.id }))}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.tableArea === area.id
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <span className={`font-semibold ${
                            formData.tableArea === area.id ? 'text-accent' : 'text-primary'
                          }`}>
                            {area.label}
                          </span>
                          <p className="text-xs text-muted mt-1">{area.description}</p>
                        </button>
                      ))}
                    </div>
                    {errors.tableArea && <p className="text-red-500 text-sm mt-1">{errors.tableArea}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                  <User className="w-6 h-6 text-accent" />
                  Contact Information
                </h2>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                          errors.firstName ? 'border-red-500' : 'border-border'
                        } focus:border-accent outline-none transition`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                          errors.lastName ? 'border-red-500' : 'border-border'
                        } focus:border-accent outline-none transition`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                        errors.phone ? 'border-red-500' : 'border-border'
                      } focus:border-accent outline-none transition`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                        errors.email ? 'border-red-500' : 'border-border'
                      } focus:border-accent outline-none transition`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <label className="block text-sm font-semibold mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Dietary Restrictions
                    </label>
                    <input
                      type="text"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-bg border-2 border-border focus:border-accent outline-none transition"
                      placeholder="Vegetarian, gluten-free, allergies..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl bg-bg border-2 border-border focus:border-accent outline-none transition resize-none"
                      placeholder="High chair needed, wheelchair accessible, near window..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  Review Your Reservation
                </h2>

                <div className="space-y-4">
                  {/* Reservation Details */}
                  <div className="bg-bg rounded-xl p-5">
                    <h3 className="font-semibold text-primary mb-4">Reservation Details</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted">Date</p>
                          <p className="font-semibold text-primary">{formatDate(formData.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted">Time</p>
                          <p className="font-semibold text-primary">{formData.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted">Party Size</p>
                          <p className="font-semibold text-primary">{formData.partySize} guests</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted">Seating</p>
                          <p className="font-semibold text-primary">{getAreaLabel()}</p>
                        </div>
                      </div>
                    </div>
                    {formData.occasion && (
                      <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted">Occasion</p>
                          <p className="font-semibold text-primary">{getOccasionLabel()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="bg-bg rounded-xl p-5">
                    <h3 className="font-semibold text-primary mb-4">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-accent" />
                        <span className="text-muted">Name:</span>
                        <span className="font-semibold text-primary">{formData.firstName} {formData.lastName}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-accent" />
                        <span className="text-muted">Phone:</span>
                        <span className="font-semibold text-primary">{formData.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-accent" />
                        <span className="text-muted">Email:</span>
                        <span className="font-semibold text-primary">{formData.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {(formData.dietaryRestrictions || formData.specialRequests) && (
                    <div className="bg-bg rounded-xl p-5">
                      <h3 className="font-semibold text-primary mb-3">Special Notes</h3>
                      {formData.dietaryRestrictions && (
                        <p className="text-sm text-muted mb-2">
                          <strong className="text-primary">Dietary:</strong> {formData.dietaryRestrictions}
                        </p>
                      )}
                      {formData.specialRequests && (
                        <p className="text-sm text-muted">
                          <strong className="text-primary">Requests:</strong> {formData.specialRequests}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Terms */}
                  <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 rounded border-border text-accent focus:ring-accent"
                      />
                      <span className="text-sm text-muted">
                        I understand that this reservation will be held for 15 minutes past the scheduled time.
                        By confirming, I agree to the restaurant's{' '}
                        <span className="text-accent cursor-pointer">cancellation policy</span>.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={currentStep === 1 ? onBack : handleBack}
            className="flex items-center gap-2 px-6 py-3 bg-surface hover:bg-bg text-primary rounded-xl font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStep === 1 ? 'Back' : 'Previous'}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.acceptTerms}
              className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Reservation
                </>
              )}
            </button>
          )}
        </div>

        {/* Restaurant Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-muted"
        >
          <p className="flex items-center justify-center gap-2 mb-1">
            <MapPin className="w-4 h-4" />
            InnovaTech Restaurant • 123 Restaurant Ave, Downtown
          </p>
          <p>
            For parties larger than 12, please call us at <strong className="text-primary">(555) 123-4567</strong>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

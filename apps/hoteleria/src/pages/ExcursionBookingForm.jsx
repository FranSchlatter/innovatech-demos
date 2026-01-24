import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  Star,
  Compass,
  Camera,
  Umbrella,
  Anchor,
  Mountain,
  Utensils,
  X
} from 'lucide-react'

// Sample excursion data
const EXCURSIONS = [
  {
    id: 'city-tour',
    name: 'Miami City Tour',
    description: 'Explore the vibrant streets of Miami, from Art Deco buildings to Little Havana.',
    duration: '4 hours',
    price: 75,
    maxCapacity: 15,
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=600&q=80',
    includedItems: ['Air-conditioned transport', 'Professional guide', 'Hotel pickup & drop-off'],
    availableSchedules: ['9:00 AM', '2:00 PM']
  },
  {
    id: 'everglades',
    name: 'Everglades Adventure',
    description: 'Experience the unique ecosystem of the Everglades with an airboat ride and wildlife spotting.',
    duration: 'Full day',
    price: 149,
    maxCapacity: 12,
    icon: Anchor,
    image: 'https://images.unsplash.com/photo-1564689510742-4e9c7584181d?w=600&q=80',
    includedItems: ['Airboat ride', 'Alligator show', 'Lunch included', 'National park fees'],
    availableSchedules: ['8:00 AM']
  },
  {
    id: 'beach-day',
    name: 'Beach & Snorkeling',
    description: 'Relax on pristine beaches and discover underwater wonders with snorkeling equipment provided.',
    duration: '6 hours',
    price: 95,
    maxCapacity: 20,
    icon: Umbrella,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    includedItems: ['Snorkeling gear', 'Beach chairs & umbrellas', 'Refreshments', 'Boat transfer'],
    availableSchedules: ['9:30 AM', '1:30 PM']
  },
  {
    id: 'sunset-cruise',
    name: 'Sunset Yacht Cruise',
    description: 'Sail into the sunset aboard a luxury yacht with champagne and gourmet appetizers.',
    duration: '3 hours',
    price: 189,
    maxCapacity: 8,
    icon: Anchor,
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80',
    includedItems: ['Champagne & wine', 'Gourmet appetizers', 'Live music', 'Professional crew'],
    availableSchedules: ['5:30 PM', '6:00 PM']
  },
  {
    id: 'food-tour',
    name: 'Culinary Experience',
    description: 'Taste the best of Miami cuisine with a guided food tour through iconic neighborhoods.',
    duration: '4 hours',
    price: 110,
    maxCapacity: 10,
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    includedItems: ['6 food tastings', 'Local drinks', 'Expert foodie guide', 'Walking tour'],
    availableSchedules: ['11:00 AM', '5:00 PM']
  },
  {
    id: 'photo-tour',
    name: 'Photography Tour',
    description: 'Capture stunning shots of Miami\'s most photogenic spots with a professional photographer.',
    duration: '3 hours',
    price: 85,
    maxCapacity: 6,
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
    includedItems: ['Professional photographer', 'Edited photos', 'Instagram spots', 'Tips & tricks'],
    availableSchedules: ['6:30 AM (Sunrise)', '5:00 PM (Golden hour)']
  }
]

export default function ExcursionBookingForm({ onClose, guestName = 'Guest', roomNumber = '101' }) {
  const [selectedExcursion, setSelectedExcursion] = useState(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    date: '',
    schedule: '',
    numberOfPeople: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bookingNumber, setBookingNumber] = useState('')

  const validateStep = (currentStep) => {
    const newErrors = {}

    if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'Please select a date'
      if (!formData.schedule) newErrors.schedule = 'Please select a time'

      // Validate date is in the future
      if (formData.date) {
        const selectedDate = new Date(formData.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) newErrors.date = 'Please select a future date'
      }
    }

    if (currentStep === 3) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleExcursionSelect = (excursion) => {
    setSelectedExcursion(excursion)
    setStep(2)
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setSelectedExcursion(null)
    }
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateStep(step)) return

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setBookingNumber(`EX-${Date.now().toString().slice(-6)}`)
    }, 1500)
  }

  const calculateTotal = () => {
    if (!selectedExcursion) return 0
    return selectedExcursion.price * formData.numberOfPeople
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Success State
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg rounded-2xl p-8 md:p-10 shadow-soft max-w-lg mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-accent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-serif text-primary mb-3">
            Excursion Booked!
          </h2>
          <p className="text-muted mb-6">
            Get ready for an amazing adventure. We've confirmed your booking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface rounded-xl p-6 mb-6 text-left"
        >
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted">Booking Number:</span>
              <span className="font-mono font-bold text-accent">{bookingNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Excursion:</span>
              <span className="font-medium">{selectedExcursion?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Date:</span>
              <span className="font-medium">{formatDate(formData.date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Time:</span>
              <span className="font-medium">{formData.schedule}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Guests:</span>
              <span className="font-medium">{formData.numberOfPeople} {formData.numberOfPeople === 1 ? 'person' : 'people'}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold text-primary">Total:</span>
              <span className="font-bold text-accent text-lg">${calculateTotal()}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-accent/10 border border-accent/30 rounded-xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-accent">Confirmation sent!</p>
              <p className="text-sm text-accent/80 mt-1">
                A confirmation email with all details has been sent to <strong>{formData.email}</strong>.
                Please arrive at the lobby 15 minutes before departure.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-3">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => {
              setIsSubmitted(false)
              setStep(1)
              setSelectedExcursion(null)
              setFormData({
                date: '',
                schedule: '',
                numberOfPeople: 1,
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                specialRequests: ''
              })
            }}
            className="btn-secondary flex-1"
          >
            Book Another
          </motion.button>
          {onClose && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="btn-primary flex-1"
            >
              Done
            </motion.button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg rounded-2xl shadow-soft max-w-4xl mx-auto overflow-hidden"
    >
      {/* Header */}
      <div className="bg-surface px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBack}
                className="p-2 hover:bg-bg rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted" />
              </motion.button>
            )}
            <div>
              <h2 className="text-xl font-serif text-primary">Book an Excursion</h2>
              <p className="text-sm text-muted">Discover amazing experiences around Miami</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[
            { num: 1, label: 'Choose' },
            { num: 2, label: 'Schedule' },
            { num: 3, label: 'Details' },
            { num: 4, label: 'Confirm' }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`h-1.5 w-full rounded-full transition-colors ${
                    s.num <= step ? 'bg-accent' : 'bg-border'
                  }`}
                />
                <span className={`text-xs mt-1.5 hidden sm:block ${s.num <= step ? 'text-accent font-medium' : 'text-muted'}`}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Excursion */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2">Choose Your Adventure</h3>
              <p className="text-sm text-muted mb-6">Select from our curated collection of experiences</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXCURSIONS.map((excursion) => {
                  const Icon = excursion.icon
                  return (
                    <motion.button
                      key={excursion.id}
                      type="button"
                      onClick={() => handleExcursionSelect(excursion)}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-left rounded-xl overflow-hidden border border-border hover:border-accent/50 bg-surface transition-all group"
                    >
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={excursion.image}
                          alt={excursion.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-bg/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <span className="font-bold text-accent">${excursion.price}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-accent" />
                          <h4 className="font-semibold text-primary group-hover:text-accent transition-colors">
                            {excursion.name}
                          </h4>
                        </div>
                        <p className="text-xs text-muted line-clamp-2 mb-3">{excursion.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {excursion.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Max {excursion.maxCapacity}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && selectedExcursion && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Selected Excursion Summary */}
              <div className="flex gap-4 p-4 bg-surface rounded-xl mb-6">
                <img
                  src={selectedExcursion.image}
                  alt={selectedExcursion.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-primary">{selectedExcursion.name}</h4>
                  <p className="text-sm text-muted mb-2">{selectedExcursion.duration}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedExcursion.includedItems.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-accent">${selectedExcursion.price}</span>
                  <p className="text-xs text-muted">per person</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Date <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.date ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                    <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="flex-1 bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Available Times <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedExcursion.availableSchedules.map((time) => (
                      <motion.button
                        key={time}
                        type="button"
                        onClick={() => setFormData({ ...formData, schedule: time })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${
                          formData.schedule === time
                            ? 'border-accent bg-accent/10 text-accent font-medium'
                            : 'border-border bg-surface hover:border-accent/50'
                        }`}
                      >
                        <Clock className="w-4 h-4 inline mr-2" />
                        {time}
                      </motion.button>
                    ))}
                  </div>
                  {errors.schedule && <p className="text-red-500 text-xs mt-1">{errors.schedule}</p>}
                </div>

                {/* Number of People */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                    <Users className="w-5 h-5 text-accent flex-shrink-0" />
                    <select
                      value={formData.numberOfPeople}
                      onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })}
                      className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                    >
                      {Array.from({ length: selectedExcursion.maxCapacity }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-muted">
                        ${selectedExcursion.price} × {formData.numberOfPeople} {formData.numberOfPeople === 1 ? 'guest' : 'guests'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-accent">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Guest Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2">Guest Information</h3>
              <p className="text-sm text-muted mb-6">Please provide contact details for the booking</p>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.firstName ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                      <User className="w-5 h-5 text-accent flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="flex-1 bg-transparent focus:outline-none text-sm"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.lastName ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                      <User className="w-5 h-5 text-accent flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="flex-1 bg-transparent focus:outline-none text-sm"
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.email ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                    <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                    <input
                      type="email"
                      placeholder="john.doe@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.phone ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                    <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Special Requests <span className="text-muted font-normal">(Optional)</span>
                  </label>
                  <textarea
                    placeholder="Any dietary restrictions, accessibility needs, or special occasions..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-surface rounded-lg border border-border focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  Review Booking
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && selectedExcursion && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2">Review Your Booking</h3>
              <p className="text-sm text-muted mb-6">Please verify all details before confirming</p>

              <div className="space-y-4">
                {/* Excursion Details */}
                <div className="bg-surface rounded-xl overflow-hidden">
                  <div className="relative h-32">
                    <img
                      src={selectedExcursion.image}
                      alt={selectedExcursion.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">{selectedExcursion.name}</h4>
                      <p className="text-sm opacity-90">{selectedExcursion.duration}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted block">Date</span>
                        <span className="font-medium">{formatDate(formData.date)}</span>
                      </div>
                      <div>
                        <span className="text-muted block">Time</span>
                        <span className="font-medium">{formData.schedule}</span>
                      </div>
                      <div>
                        <span className="text-muted block">Guests</span>
                        <span className="font-medium">{formData.numberOfPeople} {formData.numberOfPeople === 1 ? 'person' : 'people'}</span>
                      </div>
                      <div>
                        <span className="text-muted block">Meeting Point</span>
                        <span className="font-medium">Hotel Lobby</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Info */}
                <div className="bg-surface rounded-xl p-4">
                  <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted block">Name</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Email</span>
                      <span className="font-medium text-xs">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Phone</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Room</span>
                      <span className="font-medium">{roomNumber}</span>
                    </div>
                  </div>
                  {formData.specialRequests && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <span className="text-muted text-sm block mb-1">Special Requests</span>
                      <p className="text-sm font-medium">{formData.specialRequests}</p>
                    </div>
                  )}
                </div>

                {/* What's Included */}
                <div className="bg-surface rounded-xl p-4">
                  <h4 className="font-semibold text-primary mb-3">What's Included</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExcursion.includedItems.map((item, idx) => (
                      <span key={idx} className="text-xs bg-accent/10 text-accent px-3 py-1.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-primary">Total Amount</span>
                      <p className="text-xs text-muted">${selectedExcursion.price} × {formData.numberOfPeople} guests</p>
                    </div>
                    <span className="text-3xl font-bold text-accent">${calculateTotal()}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-bg border border-border rounded-lg p-4 text-sm text-muted">
                  By confirming this booking, you agree to our cancellation policy. Free cancellation up to 24 hours before the tour.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="btn-secondary flex-1"
                  >
                    Edit
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`btn-gold flex-1 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirm Booking
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

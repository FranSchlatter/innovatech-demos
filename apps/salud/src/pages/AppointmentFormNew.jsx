import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Stethoscope,
  AlertCircle,
  Heart,
  Building2
} from 'lucide-react'

const INSURANCE_PROVIDERS = [
  'BlueCross BlueShield',
  'Aetna',
  'UnitedHealthcare',
  'Cigna',
  'Humana',
  'Kaiser Permanente',
  'Medicare',
  'Medicaid',
  'Self-Pay',
  'Other'
]

const VISIT_REASONS = [
  'General Checkup',
  'Follow-up Visit',
  'New Symptoms',
  'Chronic Condition Management',
  'Preventive Care',
  'Second Opinion',
  'Specialist Referral',
  'Other'
]

export default function AppointmentFormNew({ doctor, specialty, onBook }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    // Step 2: Insurance Information
    insuranceProvider: '',
    memberNumber: '',
    planType: '',
    // Step 3: Appointment Details
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: '',
    isFirstVisit: null,
    symptoms: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [appointmentNumber, setAppointmentNumber] = useState('')

  // Generate available dates (next 30 days, excluding Sundays)
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

  // Get available times from doctor or use defaults
  const availableTimes = doctor?.availability || [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
  ]

  const validateStep = (currentStep) => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
    }

    if (currentStep === 2) {
      if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Please select insurance provider'
      if (formData.insuranceProvider && formData.insuranceProvider !== 'Self-Pay') {
        if (!formData.memberNumber.trim()) newErrors.memberNumber = 'Member number is required'
      }
    }

    if (currentStep === 3) {
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date'
      if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time'
      if (!formData.reasonForVisit) newErrors.reasonForVisit = 'Please select reason for visit'
      if (formData.isFirstVisit === null) newErrors.isFirstVisit = 'Please indicate if this is your first visit'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateStep(step)) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setAppointmentNumber(`APT-${Date.now().toString().slice(-6)}`)
      if (onBook) onBook(formData)
    }, 1500)
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

  const calculateAge = (dob) => {
    if (!dob) return '-'
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return `${age} years old`
  }

  // Success State
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-bg rounded-2xl p-8 md:p-12 shadow-soft text-center">
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
              Appointment Requested!
            </h2>
            <p className="text-muted mb-8 max-w-md mx-auto">
              Your appointment request has been received. Our team will confirm your booking shortly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-xl p-6 mb-8 text-left"
          >
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted">Request Number:</span>
                <span className="font-mono font-bold text-accent">{appointmentNumber}</span>
              </div>
              {doctor && (
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold text-primary block">{doctor.name}</span>
                    <span className="text-sm text-accent">{doctor.specialty}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted">Patient:</span>
                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Requested Date:</span>
                <span className="font-medium">{formatDate(formData.preferredDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Requested Time:</span>
                <span className="font-medium">{formData.preferredTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Reason:</span>
                <span className="font-medium">{formData.reasonForVisit}</span>
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
                <p className="text-sm font-medium text-accent">What happens next?</p>
                <p className="text-sm text-accent/80 mt-1">
                  A confirmation email will be sent to <strong>{formData.email}</strong>.
                  Please arrive 15 minutes early and bring your insurance card and ID.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-surface border border-border rounded-xl p-5 mb-8"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-primary">Save time at check-in!</p>
                <p className="text-sm text-muted mt-1">
                  Complete your <strong className="text-accent">Pre-Check-In Form</strong> online before your visit.
                  You'll receive a link in your confirmation email.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => {
              setIsSubmitted(false)
              setStep(1)
              setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                phone: '',
                email: '',
                insuranceProvider: '',
                memberNumber: '',
                planType: '',
                preferredDate: '',
                preferredTime: '',
                reasonForVisit: '',
                isFirstVisit: null,
                symptoms: ''
              })
            }}
            className="btn-primary px-8"
          >
            Book Another Appointment
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Summary Card */}
        {doctor && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-bg rounded-xl overflow-hidden shadow-soft lg:sticky lg:top-24">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-serif text-primary mb-1">{doctor.name}</h3>
                <p className="text-accent font-medium mb-4">{doctor.specialty}</p>

                {doctor.education && (
                  <div className="space-y-2 text-sm text-muted mb-4">
                    {doctor.education.slice(0, 2).map((edu, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        {edu}
                      </p>
                    ))}
                  </div>
                )}

                <div className="space-y-2 text-xs text-muted bg-surface p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Accepting new patients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Most insurance accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Online scheduling available</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Appointment Form */}
        <motion.form
          onSubmit={handleSubmit}
          className={doctor ? 'lg:col-span-2' : 'lg:col-span-3 max-w-2xl mx-auto w-full'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-bg rounded-xl p-6 md:p-8 shadow-soft">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[
                { num: 1, label: 'Personal' },
                { num: 2, label: 'Insurance' },
                { num: 3, label: 'Schedule' },
                { num: 4, label: 'Confirm' }
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: step === s.num ? 1.1 : 1,
                        backgroundColor: s.num <= step ? 'var(--color-accent)' : 'var(--color-surface)'
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        s.num <= step ? 'text-white' : 'text-muted'
                      }`}
                    >
                      {s.num < step ? <CheckCircle className="w-5 h-5" /> : s.num}
                    </motion.div>
                    <span className={`text-xs mt-2 hidden sm:block ${s.num <= step ? 'text-accent font-medium' : 'text-muted'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-colors ${s.num < step ? 'bg-accent' : 'bg-surface'}`} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-serif mb-2 text-primary">Personal Information</h3>
                  <p className="text-muted text-sm mb-6">Please provide your contact details</p>

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
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.dateOfBirth ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                        <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          max={new Date().toISOString().split('T')[0]}
                          className="flex-1 bg-transparent focus:outline-none text-sm"
                        />
                      </div>
                      {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Insurance Information */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-serif mb-2 text-primary">Insurance Information</h3>
                  <p className="text-muted text-sm mb-6">Help us verify your coverage</p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Insurance Provider <span className="text-red-500">*</span>
                      </label>
                      <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.insuranceProvider ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                        <Shield className="w-5 h-5 text-accent flex-shrink-0" />
                        <select
                          value={formData.insuranceProvider}
                          onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                          className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                        >
                          <option value="" className="bg-surface text-text">Select your insurance</option>
                          {INSURANCE_PROVIDERS.map(provider => (
                            <option key={provider} value={provider} className="bg-surface text-text">{provider}</option>
                          ))}
                        </select>
                      </div>
                      {errors.insuranceProvider && <p className="text-red-500 text-xs mt-1">{errors.insuranceProvider}</p>}
                    </div>

                    {formData.insuranceProvider && formData.insuranceProvider !== 'Self-Pay' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Member/Policy Number <span className="text-red-500">*</span>
                            </label>
                            <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.memberNumber ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                              <CreditCard className="w-5 h-5 text-accent flex-shrink-0" />
                              <input
                                type="text"
                                placeholder="e.g., ABC123456789"
                                value={formData.memberNumber}
                                onChange={(e) => setFormData({ ...formData, memberNumber: e.target.value })}
                                className="flex-1 bg-transparent focus:outline-none text-sm"
                              />
                            </div>
                            {errors.memberNumber && <p className="text-red-500 text-xs mt-1">{errors.memberNumber}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Plan Type
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                              <FileText className="w-5 h-5 text-accent flex-shrink-0" />
                              <input
                                type="text"
                                placeholder="e.g., PPO, HMO, EPO"
                                value={formData.planType}
                                onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                                className="flex-1 bg-transparent focus:outline-none text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <p className="text-accent">
                              Please bring your insurance card to your appointment. We'll verify your coverage and discuss any co-pays before your visit.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {formData.insuranceProvider === 'Self-Pay' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-surface border border-border rounded-lg p-4 text-sm"
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-primary">Self-Pay Patient</p>
                            <p className="text-muted mt-1">
                              Payment is due at the time of service. We accept cash, credit cards, and offer payment plans. Contact our billing department for pricing information.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Appointment Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-serif mb-2 text-primary">Schedule Your Visit</h3>
                  <p className="text-muted text-sm mb-6">Select your preferred date and time</p>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Preferred Date <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.preferredDate ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                          <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
                          <select
                            value={formData.preferredDate}
                            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                            className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                          >
                            <option value="" className="bg-surface text-text">Select a date</option>
                            {availableDates.map(date => (
                              <option key={date} value={date} className="bg-surface text-text">
                                {new Date(date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Preferred Time <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.preferredTime ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                          <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                          <select
                            value={formData.preferredTime}
                            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                            className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                          >
                            <option value="" className="bg-surface text-text">Select a time</option>
                            {availableTimes.map(time => (
                              <option key={time} value={time} className="bg-surface text-text">{time}</option>
                            ))}
                          </select>
                        </div>
                        {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reason for Visit <span className="text-red-500">*</span>
                      </label>
                      <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.reasonForVisit ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                        <Stethoscope className="w-5 h-5 text-accent flex-shrink-0" />
                        <select
                          value={formData.reasonForVisit}
                          onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
                          className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                        >
                          <option value="" className="bg-surface text-text">Select reason</option>
                          {VISIT_REASONS.map(reason => (
                            <option key={reason} value={reason} className="bg-surface text-text">{reason}</option>
                          ))}
                        </select>
                      </div>
                      {errors.reasonForVisit && <p className="text-red-500 text-xs mt-1">{errors.reasonForVisit}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Is this your first visit? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-3">
                        {[
                          { value: true, label: 'Yes, first time' },
                          { value: false, label: 'No, returning patient' }
                        ].map(option => (
                          <motion.button
                            key={String(option.value)}
                            type="button"
                            onClick={() => setFormData({ ...formData, isFirstVisit: option.value })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                              formData.isFirstVisit === option.value
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border bg-surface hover:border-accent/50'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${formData.isFirstVisit === option.value ? 'fill-current' : ''}`} />
                            <span className="font-medium text-sm">{option.label}</span>
                          </motion.button>
                        ))}
                      </div>
                      {errors.isFirstVisit && <p className="text-red-500 text-xs mt-2">{errors.isFirstVisit}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Describe your symptoms or concerns
                      </label>
                      <textarea
                        placeholder="Please briefly describe your symptoms or reason for the visit..."
                        value={formData.symptoms}
                        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-surface rounded-lg border border-border focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-serif mb-2 text-primary">Review Your Request</h3>
                  <p className="text-muted text-sm mb-6">Please verify all details before submitting</p>

                  <div className="space-y-4">
                    {/* Patient Info */}
                    <div className="bg-surface rounded-lg p-5">
                      <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-accent" />
                        Patient Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted block">Name</span>
                          <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div>
                          <span className="text-muted block">Date of Birth</span>
                          <span className="font-medium">{formatDate(formData.dateOfBirth)}</span>
                          <span className="text-muted text-xs block">({calculateAge(formData.dateOfBirth)})</span>
                        </div>
                        <div>
                          <span className="text-muted block">Phone</span>
                          <span className="font-medium">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="text-muted block">Email</span>
                          <span className="font-medium text-xs">{formData.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Insurance Info */}
                    <div className="bg-surface rounded-lg p-5">
                      <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-accent" />
                        Insurance Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted block">Provider</span>
                          <span className="font-medium">{formData.insuranceProvider}</span>
                        </div>
                        {formData.insuranceProvider !== 'Self-Pay' && (
                          <>
                            <div>
                              <span className="text-muted block">Member Number</span>
                              <span className="font-medium">{formData.memberNumber || '-'}</span>
                            </div>
                            {formData.planType && (
                              <div>
                                <span className="text-muted block">Plan Type</span>
                                <span className="font-medium">{formData.planType}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="bg-surface rounded-lg p-5">
                      <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        Appointment Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted block">Date</span>
                          <span className="font-medium">{formatDate(formData.preferredDate)}</span>
                        </div>
                        <div>
                          <span className="text-muted block">Time</span>
                          <span className="font-medium">{formData.preferredTime}</span>
                        </div>
                        <div>
                          <span className="text-muted block">Reason</span>
                          <span className="font-medium">{formData.reasonForVisit}</span>
                        </div>
                        <div>
                          <span className="text-muted block">Patient Type</span>
                          <span className="font-medium">{formData.isFirstVisit ? 'New Patient' : 'Returning Patient'}</span>
                        </div>
                      </div>
                      {formData.symptoms && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <span className="text-muted text-sm block mb-1">Symptoms/Concerns</span>
                          <p className="text-sm font-medium">{formData.symptoms}</p>
                        </div>
                      )}
                    </div>

                    {/* Terms */}
                    <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg text-sm">
                      <p className="text-text">
                        By clicking "Request Appointment", you agree to our Terms of Service and Privacy Policy.
                        A confirmation will be sent to your email once your appointment is confirmed.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}

              {step < 4 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`btn-primary flex-1 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Request Appointment
                    </>
                  )}
                </motion.button>
              )}
            </div>

            <p className="text-xs text-muted text-center mt-4 flex items-center justify-center gap-2 flex-wrap">
              <CheckCircle className="w-3 h-3" /> HIPAA Compliant
              <span className="mx-1">•</span>
              <CheckCircle className="w-3 h-3" /> Secure Booking
              <span className="mx-1">•</span>
              <CheckCircle className="w-3 h-3" /> 24h Confirmation
            </p>
          </div>
        </motion.form>
      </div>
    </motion.div>
  )
}

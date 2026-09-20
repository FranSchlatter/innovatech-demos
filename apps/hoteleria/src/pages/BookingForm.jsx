import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from '@shared-ui/components/DatePicker'
import {
  Calendar,
  Users,
  Check,
  User,
  Mail,
  Phone,
  Globe,
  Clock,
  Briefcase,
  Heart,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react'
import { useTranslation } from '../i18n/LanguageProvider'
import { useCurrency } from '../hooks/useCurrency'

export default function BookingForm({ room, onBook }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const [booking, setBooking] = useState({
    // Step 1: Stay Details
    checkIn: '',
    checkOut: '',
    guests: 1,
    estimatedArrivalTime: '14:00',
    // Step 2: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    // Step 3: Preferences
    travelPurpose: '',
    specialRequests: '',
    preferences: ''
  })

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Keys map to client.booking.countries.<key>; the key is the stored value.
  const countries = [
    'us', 'canada', 'uk', 'australia',
    'germany', 'france', 'spain', 'italy', 'brazil', 'argentina',
    'mexico', 'japan', 'southKorea', 'china', 'india', 'other'
  ]

  const arrivalTimes = [
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: t('client.booking.arrivalStandard') },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '22:00', label: t('client.booking.arrivalLate') }
  ]

  const validateStep = (currentStep) => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!booking.checkIn) newErrors.checkIn = t('client.booking.errors.checkInRequired')
      if (!booking.checkOut) newErrors.checkOut = t('client.booking.errors.checkOutRequired')
      if (booking.checkIn && booking.checkOut) {
        const checkIn = new Date(booking.checkIn)
        const checkOut = new Date(booking.checkOut)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (checkIn < today) newErrors.checkIn = t('client.booking.errors.checkInPast')
        if (checkOut <= checkIn) newErrors.checkOut = t('client.booking.errors.checkOutAfter')
      }
    }

    if (currentStep === 2) {
      if (!booking.firstName.trim()) newErrors.firstName = t('client.booking.errors.firstNameRequired')
      if (!booking.lastName.trim()) newErrors.lastName = t('client.booking.errors.lastNameRequired')
      if (!booking.email.trim()) {
        newErrors.email = t('client.booking.errors.emailRequired')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
        newErrors.email = t('client.booking.errors.emailInvalid')
      }
      if (!booking.phone.trim()) newErrors.phone = t('client.booking.errors.phoneRequired')
      if (!booking.country) newErrors.country = t('client.booking.errors.countryRequired')
    }

    if (currentStep === 3) {
      if (!booking.travelPurpose) newErrors.travelPurpose = t('client.booking.errors.travelPurposeRequired')
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
    }, 1500)
  }

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 0
  }

  const nights = calculateNights()
  const total = nights > 0 ? nights * room.price : 0

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getArrivalTimeLabel = (value) => {
    const time = arrivalTimes.find(t => t.value === value)
    return time ? time.label : value
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
              {t('client.booking.successTitle')}
            </h2>
            <p className="text-muted mb-8 max-w-md mx-auto">
              {t('client.booking.successBody')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-xl p-6 mb-8 text-left"
          >
            <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              {t('client.booking.bookingSummary')}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{room.isPackage ? t('client.booking.summary.packageLabel') : t('client.booking.summary.roomLabel')}</span>
                <span className="font-medium">{room.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t('client.booking.guestLabel')}</span>
                <span className="font-medium">{booking.firstName} {booking.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t('client.booking.checkInLabel')}</span>
                <span className="font-medium">{formatDate(booking.checkIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t('client.booking.checkOutLabel')}</span>
                <span className="font-medium">{formatDate(booking.checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t('client.booking.guestsLabel')}</span>
                <span className="font-medium">{booking.guests} {booking.guests === 1 ? t('client.booking.guest').toLowerCase() : t('client.booking.guests').toLowerCase()}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-primary">{t('client.booking.totalNights', { count: nights })}</span>
                <span className="font-bold text-accent text-lg">{format(total)}</span>
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
                <p className="text-sm font-medium text-accent">{t('client.booking.whatNext')}</p>
                <p className="text-sm text-accent/80 mt-1">
                  {t('client.booking.whatNextBefore')} <strong>{booking.email}</strong>{t('client.booking.whatNextAfter')}
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
              setBooking({
                checkIn: '',
                checkOut: '',
                guests: 1,
                estimatedArrivalTime: '14:00',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                country: '',
                travelPurpose: '',
                specialRequests: '',
                preferences: ''
              })
              if (onBook) {
                onBook(booking)
              }
            }}
            className="btn-primary px-8"
          >
            {t('client.booking.backToHome')}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-1"
        >
          <div className="bg-bg rounded-xl overflow-hidden shadow-soft lg:sticky lg:top-24">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-serif text-primary mb-2">{room.name}</h3>
              <p className="text-muted text-sm mb-6 leading-relaxed line-clamp-3">{room.description}</p>

              <div className="space-y-3 bg-surface p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">{t('client.booking.summary.pricePerNight')}</span>
                  <span className="font-semibold text-primary">{format(room.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">{t('client.booking.summary.numberOfNights')}</span>
                  <span className="font-semibold text-primary">{nights || '-'}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-semibold text-primary">{t('client.booking.summary.total')}</span>
                  <span className="text-2xl font-bold text-accent">{format(total)}</span>
                </div>
              </div>

              {/* Package inclusions, shown only when booking a curated experience */}
              {room.isPackage && room.packageDetails?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    {t('client.booking.summary.packageIncludes')}
                  </h4>
                  <ul className="space-y-2">
                    {room.packageDetails.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted">
                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 text-xs text-muted">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{room.cancellationPolicy || t('client.booking.summary.freeCancellation')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>{t('client.booking.summary.bestPrice')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>{t('client.booking.summary.support')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-bg rounded-xl p-6 md:p-8 shadow-soft">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[
                { num: 1, label: t('client.booking.steps.dates') },
                { num: 2, label: t('client.booking.steps.details') },
                { num: 3, label: t('client.booking.steps.preferences') },
                { num: 4, label: t('client.booking.steps.confirm') }
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: step === s.num ? 1.1 : 1,
                        backgroundColor: s.num <= step ? 'var(--color-accent)' : 'var(--color-surface)'
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        s.num <= step ? 'text-bg' : 'text-muted'
                      }`}
                    >
                      {s.num < step ? <Check className="w-5 h-5" /> : s.num}
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
              {/* Step 1: Stay Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-serif mb-2 text-primary">{t('client.booking.step1Title')}</h3>
                  <p className="text-muted text-sm mb-6">{t('client.booking.step1Subtitle')}</p>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('client.booking.checkInDate')} <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          value={booking.checkIn}
                          onChange={(checkIn) => setBooking({ ...booking, checkIn })}
                          min={new Date().toISOString().split('T')[0]}
                          error={!!errors.checkIn}
                        />
                        {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('client.booking.checkOutDate')} <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          value={booking.checkOut}
                          onChange={(checkOut) => setBooking({ ...booking, checkOut })}
                          min={booking.checkIn || new Date().toISOString().split('T')[0]}
                          error={!!errors.checkOut}
                        />
                        {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('client.booking.arrivalTime')}
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                          <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                          <select
                            value={booking.estimatedArrivalTime}
                            onChange={(e) => setBooking({ ...booking, estimatedArrivalTime: e.target.value })}
                            className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                          >
                            {arrivalTimes.map(time => (
                              <option key={time.value} value={time.value}>{time.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('client.booking.numberOfGuests')} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                          <Users className="w-5 h-5 text-accent flex-shrink-0" />
                          <select
                            value={booking.guests}
                            onChange={(e) => setBooking({ ...booking, guests: parseInt(e.target.value) })}
                            className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6].map(n => (
                              <option key={n} value={n}>{n} {n === 1 ? t('client.booking.guest') : t('client.booking.guests')}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Information */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-serif mb-2 text-primary">{t('client.booking.step2Title')}</h3>
                  <p className="text-muted text-sm mb-6">{t('client.booking.step2Subtitle')}</p>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('client.booking.firstName')} <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.firstName ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                          <User className="w-5 h-5 text-accent flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="John"
                            value={booking.firstName}
                            onChange={(e) => setBooking({ ...booking, firstName: e.target.value })}
                            className="flex-1 bg-transparent focus:outline-none text-sm"
                          />
                        </div>
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('client.booking.lastName')} <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.lastName ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                          <User className="w-5 h-5 text-accent flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Doe"
                            value={booking.lastName}
                            onChange={(e) => setBooking({ ...booking, lastName: e.target.value })}
                            className="flex-1 bg-transparent focus:outline-none text-sm"
                          />
                        </div>
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('client.booking.email')} <span className="text-red-500">*</span>
                      </label>
                      <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.email ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                        <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                        <input
                          type="email"
                          placeholder="john.doe@email.com"
                          value={booking.email}
                          onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                          className="flex-1 bg-transparent focus:outline-none text-sm"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('client.booking.phone')} <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.phone ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                          <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                          <input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={booking.phone}
                            onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                            className="flex-1 bg-transparent focus:outline-none text-sm"
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('client.booking.country')} <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.country ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                          <Globe className="w-5 h-5 text-accent flex-shrink-0" />
                          <select
                            value={booking.country}
                            onChange={(e) => setBooking({ ...booking, country: e.target.value })}
                            className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                          >
                            <option value="">{t('client.booking.selectCountry')}</option>
                            {countries.map(country => (
                              <option key={country} value={country}>{t(`client.booking.countries.${country}`)}</option>
                            ))}
                          </select>
                        </div>
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preferences */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-serif mb-2 text-primary">{t('client.booking.step3Title')}</h3>
                  <p className="text-muted text-sm mb-6">{t('client.booking.step3Subtitle')}</p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        {t('client.booking.travelPurpose')} <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'leisure', label: t('client.booking.leisure'), icon: Heart },
                          { value: 'business', label: t('client.booking.business'), icon: Briefcase }
                        ].map(option => (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => setBooking({ ...booking, travelPurpose: option.value })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
                              booking.travelPurpose === option.value
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border bg-surface hover:border-accent/50'
                            }`}
                          >
                            <option.icon className="w-5 h-5" />
                            <span className="font-medium">{option.label}</span>
                          </motion.button>
                        ))}
                      </div>
                      {errors.travelPurpose && <p className="text-red-500 text-xs mt-2">{errors.travelPurpose}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('client.booking.roomPreferences')}
                      </label>
                      <div className="flex items-start gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                        <MessageSquare className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <textarea
                          placeholder={t('client.booking.roomPreferencesPlaceholder')}
                          value={booking.preferences}
                          onChange={(e) => setBooking({ ...booking, preferences: e.target.value })}
                          rows={3}
                          className="flex-1 bg-transparent focus:outline-none text-sm resize-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('client.booking.specialRequests')}
                      </label>
                      <div className="flex items-start gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                        <MessageSquare className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <textarea
                          placeholder={t('client.booking.specialRequestsPlaceholder')}
                          value={booking.specialRequests}
                          onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                          rows={3}
                          className="flex-1 bg-transparent focus:outline-none text-sm resize-none"
                        />
                      </div>
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
                  <h3 className="text-2xl font-serif mb-2 text-primary">{t('client.booking.step4Title')}</h3>
                  <p className="text-muted text-sm mb-6">{t('client.booking.step4Subtitle')}</p>

                  <div className="space-y-4">
                    {/* Stay Details */}
                    <div className="bg-surface rounded-lg p-5">
                      <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        {t('client.booking.stayDetails')}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted block">{t('client.booking.checkIn')}</span>
                          <span className="font-medium">{formatDate(booking.checkIn)}</span>
                          <span className="text-muted text-xs block">{getArrivalTimeLabel(booking.estimatedArrivalTime)}</span>
                        </div>
                        <div>
                          <span className="text-muted block">{t('client.booking.checkOut')}</span>
                          <span className="font-medium">{formatDate(booking.checkOut)}</span>
                        </div>
                        <div>
                          <span className="text-muted block">{t('client.booking.guests')}</span>
                          <span className="font-medium">{booking.guests} {booking.guests === 1 ? t('client.booking.guest') : t('client.booking.guests')}</span>
                        </div>
                        <div>
                          <span className="text-muted block">{t('client.booking.duration')}</span>
                          <span className="font-medium">{nights} {nights === 1 ? t('client.booking.night') : t('client.booking.nights')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Guest Information */}
                    <div className="bg-surface rounded-lg p-5">
                      <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-accent" />
                        {t('client.booking.guestInfo')}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted block">{t('client.booking.nameLabel')}</span>
                          <span className="font-medium">{booking.firstName} {booking.lastName}</span>
                        </div>
                        <div>
                          <span className="text-muted block">{t('client.booking.countryLabel')}</span>
                          <span className="font-medium">{booking.country ? t(`client.booking.countries.${booking.country}`) : ''}</span>
                        </div>
                        <div>
                          <span className="text-muted block">{t('client.booking.emailLabel')}</span>
                          <span className="font-medium text-xs">{booking.email}</span>
                        </div>
                        <div>
                          <span className="text-muted block">{t('client.booking.phoneLabel')}</span>
                          <span className="font-medium">{booking.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    {(booking.travelPurpose || booking.preferences || booking.specialRequests) && (
                      <div className="bg-surface rounded-lg p-5">
                        <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-accent" />
                          {t('client.booking.preferencesAndRequests')}
                        </h4>
                        <div className="space-y-3 text-sm">
                          {booking.travelPurpose && (
                            <div>
                              <span className="text-muted block">{t('client.booking.travelPurposeLabel')}</span>
                              <span className="font-medium">{booking.travelPurpose === 'leisure' ? t('client.booking.leisure') : t('client.booking.business')}</span>
                            </div>
                          )}
                          {booking.preferences && (
                            <div>
                              <span className="text-muted block">{t('client.booking.roomPreferencesLabel')}</span>
                              <span className="font-medium">{booking.preferences}</span>
                            </div>
                          )}
                          {booking.specialRequests && (
                            <div>
                              <span className="text-muted block">{t('client.booking.specialRequestsLabel')}</span>
                              <span className="font-medium">{booking.specialRequests}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Terms */}
                    <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg text-sm">
                      <p className="text-text">
                        {t('client.booking.terms')}
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
                  {t('client.booking.back')}
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
                  {t('client.booking.continue')}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
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
                      {t('client.booking.processing')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {t('client.booking.confirmReservation')}
                    </>
                  )}
                </motion.button>
              )}
            </div>

            <p className="text-xs text-muted text-center mt-4 flex items-center justify-center gap-2">
              <Check className="w-3 h-3" /> {t('client.booking.secureBooking')}
              <span className="mx-1">•</span>
              <Check className="w-3 h-3" /> {t('client.booking.instantConfirmation')}
              <span className="mx-1">•</span>
              <Check className="w-3 h-3" /> {t('client.booking.support247')}
            </p>
          </div>
        </motion.form>
      </div>
    </motion.div>
  )
}

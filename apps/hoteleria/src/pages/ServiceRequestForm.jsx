import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Utensils,
  Sparkles,
  Wrench,
  Waves,
  Map,
  Building2,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Phone,
  Send,
  X,
  ArrowLeft
} from 'lucide-react'
import { useTranslation } from '../i18n/LanguageProvider'

// Stable ids + icons/colors; user-visible name/description resolved at render via t().
const SERVICE_TYPES = [
  { id: 'room-service', icon: Utensils, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  { id: 'housekeeping', icon: Sparkles, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { id: 'maintenance', icon: Wrench, color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
  { id: 'spa', icon: Waves, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
  { id: 'concierge', icon: Map, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { id: 'facilities', icon: Building2, color: 'text-green-500', bgColor: 'bg-green-500/10' }
]

// Stable ids used as the stored preferredTime value; labels resolved at render.
const TIME_SLOTS = [
  'asap',
  '15min',
  '30min',
  '1hour',
  '2hours',
  'thisEvening',
  'tomorrowMorning',
  'specific'
]

export default function ServiceRequestForm({ onClose, guestName = 'Guest', roomNumber = '101' }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    serviceType: '',
    preferredTime: 'asap',
    specificTime: '',
    notes: '',
    urgent: false
  })

  const [step, setStep] = useState(1) // 1: Select service, 2: Details, 3: Confirm
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [requestNumber, setRequestNumber] = useState('')

  const selectedService = SERVICE_TYPES.find(s => s.id === formData.serviceType)

  const handleServiceSelect = (serviceId) => {
    setFormData({ ...formData, serviceType: serviceId })
    setStep(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      // Generate fake request number
      setRequestNumber(`SR-${Date.now().toString().slice(-6)}`)
    }, 1500)
  }

  const handleReset = () => {
    setFormData({
      serviceType: '',
      preferredTime: 'asap',
      specificTime: '',
      notes: '',
      urgent: false
    })
    setStep(1)
    setIsSubmitted(false)
    setRequestNumber('')
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
            {t('client.serviceRequest.successTitle')}
          </h2>
          <p className="text-muted mb-6">
            {t('client.serviceRequest.successBody')}
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
              <span className="text-muted">{t('client.serviceRequest.requestNumber')}</span>
              <span className="font-mono font-bold text-accent">{requestNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">{t('client.serviceRequest.serviceLabel')}</span>
              <span className="font-medium">{selectedService && t(`client.serviceRequest.types.${selectedService.id}.name`)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">{t('client.serviceRequest.roomLabel')}</span>
              <span className="font-medium">{roomNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">{t('client.serviceRequest.requestedTime')}</span>
              <span className="font-medium">
                {formData.preferredTime === 'specific'
                  ? formData.specificTime
                  : t(`client.serviceRequest.timeSlots.${formData.preferredTime}`)}
              </span>
            </div>
            {formData.urgent && (
              <div className="flex items-center gap-2 text-orange-500 pt-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium text-sm">{t('client.serviceRequest.markedUrgent')}</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-accent/10 border border-accent/30 rounded-xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-accent">{t('client.serviceRequest.needHelpTitle')}</p>
              <p className="text-sm text-accent/80 mt-1">
                {t('client.serviceRequest.needHelpBefore')} <strong>ext. 0</strong> {t('client.serviceRequest.needHelpOr')} <strong>+1 (305) 555-0123</strong>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-3">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleReset}
            className="btn-secondary flex-1"
          >
            {t('client.serviceRequest.newRequest')}
          </motion.button>
          {onClose && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="btn-primary flex-1"
            >
              {t('client.serviceRequest.done')}
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
      className="bg-bg rounded-2xl shadow-soft max-w-2xl mx-auto overflow-hidden"
    >
      {/* Header */}
      <div className="bg-surface px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setStep(step - 1)}
                className="p-2 hover:bg-bg rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted" />
              </motion.button>
            )}
            <div>
              <h2 className="text-xl font-serif text-primary">{t('client.serviceRequest.title')}</h2>
              <p className="text-sm text-muted">{t('client.serviceRequest.roomGuest', { room: roomNumber, guest: guestName })}</p>
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
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-accent' : 'bg-border'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Service Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2">{t('client.serviceRequest.step1Title')}</h3>
              <p className="text-sm text-muted mb-6">{t('client.serviceRequest.step1Subtitle')}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICE_TYPES.map((service) => {
                  const Icon = service.icon
                  return (
                    <motion.button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceSelect(service.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 border-border hover:border-accent/50 bg-surface text-left transition-all group`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${service.bgColor} flex items-center justify-center mb-3`}>
                        <Icon className={`w-5 h-5 ${service.color}`} />
                      </div>
                      <h4 className="font-medium text-primary text-sm mb-1 group-hover:text-accent transition-colors">
                        {t(`client.serviceRequest.types.${service.id}.name`)}
                      </h4>
                      <p className="text-xs text-muted line-clamp-2">{t(`client.serviceRequest.types.${service.id}.description`)}</p>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Request Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {selectedService && (
                <div className={`flex items-center gap-3 p-4 rounded-xl ${selectedService.bgColor} mb-6`}>
                  <selectedService.icon className={`w-6 h-6 ${selectedService.color}`} />
                  <div>
                    <h4 className="font-semibold text-primary">{t(`client.serviceRequest.types.${selectedService.id}.name`)}</h4>
                    <p className="text-sm text-muted">{t(`client.serviceRequest.types.${selectedService.id}.description`)}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Preferred Time */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    {t('client.serviceRequest.whenTitle')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <motion.button
                        key={time}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredTime: time })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 py-2.5 rounded-lg border text-sm transition-all ${
                          formData.preferredTime === time
                            ? 'border-accent bg-accent/10 text-accent font-medium'
                            : 'border-border bg-surface hover:border-accent/50'
                        }`}
                      >
                        {t(`client.serviceRequest.timeSlots.${time}`)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Specific Time Input */}
                {formData.preferredTime === 'specific' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      {t('client.serviceRequest.selectTime')}
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                      <Clock className="w-5 h-5 text-accent" />
                      <input
                        type="time"
                        value={formData.specificTime}
                        onChange={(e) => setFormData({ ...formData, specificTime: e.target.value })}
                        className="flex-1 bg-transparent focus:outline-none text-sm"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('client.serviceRequest.additionalDetails')}
                  </label>
                  <div className="flex items-start gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                    <MessageSquare className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <textarea
                      placeholder={t('client.serviceRequest.detailsPlaceholder')}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className="flex-1 bg-transparent focus:outline-none text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Urgent Toggle */}
                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, urgent: !formData.urgent })}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    formData.urgent
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-border bg-surface hover:border-orange-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${formData.urgent ? 'text-orange-500' : 'text-muted'}`} />
                    <div className="text-left">
                      <span className={`font-medium ${formData.urgent ? 'text-orange-500' : 'text-primary'}`}>
                        {t('client.serviceRequest.markUrgent')}
                      </span>
                      <p className="text-xs text-muted mt-0.5">{t('client.serviceRequest.urgentHint')}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${formData.urgent ? 'bg-orange-500' : 'bg-border'}`}>
                    <motion.div
                      animate={{ x: formData.urgent ? 24 : 2 }}
                      className="w-5 h-5 mt-0.5 rounded-full bg-white shadow-sm"
                    />
                  </div>
                </motion.button>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  {t('common.actions.back')}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1"
                >
                  {t('client.serviceRequest.reviewRequest')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2">{t('client.serviceRequest.step3Title')}</h3>
              <p className="text-sm text-muted mb-6">{t('client.serviceRequest.step3Subtitle')}</p>

              <div className="bg-surface rounded-xl p-5 mb-6">
                <div className="space-y-4 text-sm">
                  {selectedService && (
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className={`w-10 h-10 rounded-lg ${selectedService.bgColor} flex items-center justify-center`}>
                        <selectedService.icon className={`w-5 h-5 ${selectedService.color}`} />
                      </div>
                      <div>
                        <span className="font-semibold text-primary">{t(`client.serviceRequest.types.${selectedService.id}.name`)}</span>
                        <p className="text-xs text-muted">{t(`client.serviceRequest.types.${selectedService.id}.description`)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted">{t('client.serviceRequest.roomLabel')}</span>
                    <span className="font-medium">{roomNumber}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted">{t('client.serviceRequest.requestedTime')}</span>
                    <span className="font-medium">
                      {formData.preferredTime === 'specific'
                        ? formData.specificTime
                        : t(`client.serviceRequest.timeSlots.${formData.preferredTime}`)}
                    </span>
                  </div>

                  {formData.notes && (
                    <div>
                      <span className="text-muted block mb-1">{t('client.serviceRequest.notesLabel')}</span>
                      <p className="font-medium bg-bg p-3 rounded-lg">{formData.notes}</p>
                    </div>
                  )}

                  {formData.urgent && (
                    <div className="flex items-center gap-2 text-orange-500 pt-2 border-t border-border">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">{t('client.serviceRequest.urgentRequest')}</span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="btn-secondary flex-1"
                  >
                    {t('client.serviceRequest.editButton')}
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
                        {t('client.serviceRequest.submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t('client.serviceRequest.submitRequest')}
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

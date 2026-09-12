import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ArrowLeft,
  ArrowRight,
  User,
  CreditCard,
  Globe,
  Phone,
  Mail,
  Building2,
  BedDouble,
  Clock,
  MessageSquare,
  CheckCircle,
  KeyRound,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Calendar,
  MapPin
} from 'lucide-react'

// ---------------------------------------------------------------------------
// H16 — Online check-in (Guest Portal)
// A self-contained 3-step wizard the guest completes before arriving. On
// confirmation it flips the reservation to "checked-in" and issues a simulated
// digital room key. Colours stick to solid theme fills (alpha over the CSS-var
// theme colours is a silent no-op here); success tints use the standard Tailwind
// palette (emerald), which does support alpha.
// ---------------------------------------------------------------------------

const DOCUMENT_TYPES = [
  { id: 'passport', label: 'Passport' },
  { id: 'national-id', label: 'National ID (DNI)' },
  { id: 'driver-license', label: 'Driver License' },
  { id: 'other', label: 'Other' }
]

const FLOOR_OPTIONS = [
  { id: 'high', label: 'High floor', hint: 'Better views' },
  { id: 'low', label: 'Low floor', hint: 'Quick access' },
  { id: 'any', label: 'No preference', hint: 'Surprise me' }
]

const PILLOW_OPTIONS = [
  { id: 'soft', label: 'Soft' },
  { id: 'medium', label: 'Medium' },
  { id: 'firm', label: 'Firm' },
  { id: 'hypoallergenic', label: 'Hypoallergenic' }
]

const ARRIVAL_WINDOWS = [
  'Before 12:00',
  '12:00 – 15:00',
  '15:00 – 18:00',
  '18:00 – 21:00',
  'After 21:00'
]

const STEPS = [
  { num: 1, label: 'Your details' },
  { num: 2, label: 'Preferences' },
  { num: 3, label: 'Confirm' }
]

const documentTypeLabel = (id) =>
  DOCUMENT_TYPES.find((d) => d.id === id)?.label || 'Document'

const floorLabel = (id) => FLOOR_OPTIONS.find((f) => f.id === id)?.label || '—'

const formatStayDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

export default function CheckInFlow({ open, onClose, guest, onComplete }) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null) // { digitalKey } once confirmed

  const [form, setForm] = useState(() => ({
    fullName: guest?.name || '',
    documentType: guest?.documentType || 'passport',
    documentNumber: guest?.documentNumber || '',
    nationality: guest?.nationality || '',
    phone: guest?.phone || '',
    email: guest?.email || '',
    floor: 'any',
    pillow: 'medium',
    arrival: '15:00 – 18:00',
    specialRequests: ''
  }))

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validateStep = (current) => {
    const next = {}
    if (current === 1) {
      if (!form.fullName.trim()) next.fullName = 'Full name is required'
      if (!form.documentNumber.trim()) next.documentNumber = 'Document number is required'
      if (!form.nationality.trim()) next.nationality = 'Nationality is required'
      if (!form.phone.trim()) next.phone = 'Phone is required'
      if (!form.email.trim()) {
        next.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        next.email = 'Enter a valid email'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1))
  }

  const handleBack = () => {
    setErrors({})
    setStep((s) => Math.max(1, s - 1))
  }

  const handleConfirm = () => {
    setIsSubmitting(true)
    // Simulated processing delay (~1s) for realism.
    setTimeout(() => {
      const digitalKey = `HL-${guest?.room?.number || '000'}-${Math.floor(1000 + Math.random() * 9000)}`
      const checkInData = {
        ...form,
        digitalKey,
        checkedInAt: new Date().toISOString()
      }
      setIsSubmitting(false)
      setResult({ digitalKey })
      onComplete?.(checkInData)
    }, 1000)
  }

  // Reset internal state whenever the flow is closed so a re-open starts fresh
  // (only relevant before check-in completes).
  const handleClose = () => {
    onClose?.()
    // Defer reset until after the exit animation.
    setTimeout(() => {
      if (!result) {
        setStep(1)
        setErrors({})
      }
    }, 300)
  }

  const room = guest?.room || {}
  const reservation = guest?.reservation || {}

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) handleClose() }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="relative bg-bg rounded-3xl shadow-medium w-full max-w-2xl my-6 overflow-hidden"
          >
            {/* -------------------------------------------------- Success screen */}
            {result ? (
              <div className="p-6 md:p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center"
                >
                  <CheckCircle className="w-9 h-9 text-emerald-500" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl md:text-3xl font-serif text-primary mb-2">
                    ¡Check-in completado!
                  </h2>
                  <p className="text-muted mb-7 max-w-sm mx-auto">
                    Present this code at the front desk on arrival — or tap your phone at
                    the door to unlock your room.
                  </p>
                </motion.div>

                {/* Digital key — uses primary/contrast so it inverts cleanly in both
                    themes; accent details stay bronze in light & dark. */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, type: 'spring', stiffness: 120 }}
                  className="relative mx-auto max-w-xs bg-primary text-primary-contrast rounded-[28px] p-6 shadow-medium border border-accent overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
                      <Smartphone className="w-3.5 h-3.5" />
                      Digital Key
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium">
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-emerald-400"
                      />
                      Active
                    </span>
                  </div>

                  <div className="relative flex flex-col items-center">
                    <div className="relative mb-4">
                      <motion.span
                        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-accent"
                      />
                      <span className="relative w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                        <KeyRound className="w-8 h-8 text-white" />
                      </span>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest opacity-70">Room</span>
                    <span className="text-5xl font-bold leading-none mt-1 mb-4">{room.number}</span>
                    {/* Divider uses element opacity (not colour alpha) so it reads
                        on the card in both themes without relying on dark: */}
                    <div className="w-full h-px bg-primary-contrast opacity-20 mb-4" />
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-widest opacity-70">Key code</span>
                      <span className="font-mono font-bold text-accent tracking-wider">{result.digitalKey}</span>
                    </div>
                    <div className="w-full mt-3 flex items-center justify-between text-[11px] opacity-75">
                      <span>{guest?.name}</span>
                      <span>{formatStayDate(reservation.checkIn)} → {formatStayDate(reservation.checkOut)}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex items-start gap-2 text-xs text-muted bg-surface rounded-xl p-3 text-left max-w-xs mx-auto"
                >
                  <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Your details are stored securely. You can review your stay details any
                    time in <strong>My Stay</strong>.
                  </span>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleClose}
                  className="mt-7 w-full bg-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
                >
                  Done
                </motion.button>
              </div>
            ) : (
              <>
                {/* -------------------------------------------------------- Header */}
                <div className="bg-surface px-5 md:px-6 py-5 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {step > 1 && (
                        <motion.button
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={handleBack}
                          className="p-2 hover:bg-bg rounded-lg transition-colors"
                          aria-label="Back"
                        >
                          <ArrowLeft className="w-5 h-5 text-muted" />
                        </motion.button>
                      )}
                      <div>
                        <h2 className="text-xl font-serif text-primary leading-tight">Online Check-in</h2>
                        <p className="text-sm text-muted">
                          {room.type} · Room {room.number}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-bg rounded-lg transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-muted" />
                    </button>
                  </div>

                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mt-4">
                    {STEPS.map((s) => (
                      <div key={s.num} className="flex flex-col items-center flex-1">
                        <div
                          className={`h-1.5 w-full rounded-full transition-colors ${
                            s.num <= step ? 'bg-accent' : 'bg-border'
                          }`}
                        />
                        <span
                          className={`text-xs mt-1.5 hidden sm:block ${
                            s.num <= step ? 'text-accent font-medium' : 'text-muted'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --------------------------------------------------------- Body */}
                <div className="p-5 md:p-6">
                  <AnimatePresence mode="wait">
                    {/* ------------------------------------------ Step 1: Details */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h3 className="text-lg font-semibold text-primary mb-1">Personal details</h3>
                        <p className="text-sm text-muted mb-5">
                          We've pre-filled what we have from your reservation — just confirm it's right.
                        </p>

                        <div className="space-y-4">
                          {/* Full name */}
                          <Field label="Full name" icon={User} error={errors.fullName}>
                            <input
                              type="text"
                              value={form.fullName}
                              onChange={(e) => update('fullName', e.target.value)}
                              placeholder="As shown on your document"
                              className="flex-1 bg-transparent focus:outline-none text-sm"
                            />
                          </Field>

                          {/* Document type + number */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Document type</label>
                              <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                                <CreditCard className="w-5 h-5 text-accent flex-shrink-0" />
                                <select
                                  value={form.documentType}
                                  onChange={(e) => update('documentType', e.target.value)}
                                  className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                                >
                                  {DOCUMENT_TYPES.map((d) => (
                                    <option key={d.id} value={d.id}>{d.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <Field label="Document number" icon={CreditCard} error={errors.documentNumber}>
                              <input
                                type="text"
                                value={form.documentNumber}
                                onChange={(e) => update('documentNumber', e.target.value)}
                                placeholder="Number"
                                className="flex-1 bg-transparent focus:outline-none text-sm"
                              />
                            </Field>
                          </div>

                          {/* Nationality */}
                          <Field label="Nationality" icon={Globe} error={errors.nationality}>
                            <input
                              type="text"
                              value={form.nationality}
                              onChange={(e) => update('nationality', e.target.value)}
                              placeholder="e.g. Argentina"
                              className="flex-1 bg-transparent focus:outline-none text-sm"
                            />
                          </Field>

                          {/* Phone + email */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Phone" icon={Phone} error={errors.phone}>
                              <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => update('phone', e.target.value)}
                                placeholder="+1 555 123 4567"
                                className="flex-1 bg-transparent focus:outline-none text-sm"
                              />
                            </Field>
                            <Field label="Email" icon={Mail} error={errors.email}>
                              <input
                                type="email"
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                placeholder="you@email.com"
                                className="flex-1 bg-transparent focus:outline-none text-sm"
                              />
                            </Field>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-7">
                          <button
                            onClick={handleClose}
                            className="flex-1 py-3 rounded-xl font-semibold border border-border text-muted hover:text-primary hover:border-accent transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleNext}
                            className="flex-1 bg-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* -------------------------------------- Step 2: Preferences */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h3 className="text-lg font-semibold text-primary mb-1">Stay preferences</h3>
                        <p className="text-sm text-muted mb-5">
                          Optional — help us set your room up just the way you like it.
                        </p>

                        <div className="space-y-6">
                          {/* Floor */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-3">
                              <Building2 className="w-4 h-4 text-accent" />
                              Floor preference
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {FLOOR_OPTIONS.map((opt) => {
                                const active = form.floor === opt.id
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => update('floor', opt.id)}
                                    className={`flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border text-center transition ${
                                      active
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-surface border-border hover:border-accent'
                                    }`}
                                  >
                                    <span className="text-sm font-semibold">{opt.label}</span>
                                    <span className={`text-[11px] ${active ? 'text-white/80' : 'text-muted'}`}>
                                      {opt.hint}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Pillow */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-3">
                              <BedDouble className="w-4 h-4 text-accent" />
                              Pillow type
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {PILLOW_OPTIONS.map((opt) => {
                                const active = form.pillow === opt.id
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => update('pillow', opt.id)}
                                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                                      active
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-surface border-border hover:border-accent'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Arrival window */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-3">
                              <Clock className="w-4 h-4 text-accent" />
                              Estimated arrival
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {ARRIVAL_WINDOWS.map((win) => {
                                const active = form.arrival === win
                                return (
                                  <button
                                    key={win}
                                    onClick={() => update('arrival', win)}
                                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                                      active
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-surface border-border hover:border-accent'
                                    }`}
                                  >
                                    {win}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Special requests */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-2">
                              <MessageSquare className="w-4 h-4 text-accent" />
                              Special requests
                              <span className="text-muted font-normal">(optional)</span>
                            </label>
                            <textarea
                              value={form.specialRequests}
                              onChange={(e) => update('specialRequests', e.target.value)}
                              rows={3}
                              placeholder="Early check-in, extra towels, celebrating a special occasion…"
                              className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-accent outline-none resize-none text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-7">
                          <button
                            onClick={handleBack}
                            className="flex-1 py-3 rounded-xl font-semibold border border-border text-muted hover:text-primary hover:border-accent transition"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleNext}
                            className="flex-1 bg-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                          >
                            Review
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ------------------------------------------ Step 3: Confirm */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h3 className="text-lg font-semibold text-primary mb-1">Review & confirm</h3>
                        <p className="text-sm text-muted mb-5">
                          Please check everything is correct before we complete your check-in.
                        </p>

                        {/* Reservation recap */}
                        <div className="bg-surface rounded-xl p-4 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <Recap icon={MapPin} label="Room" value={`${room.number} · ${room.type}`} full />
                            <Recap icon={Calendar} label="Check-in" value={formatStayDate(reservation.checkIn)} />
                            <Recap icon={Calendar} label="Check-out" value={formatStayDate(reservation.checkOut)} />
                          </div>
                        </div>

                        {/* Personal details recap */}
                        <div className="bg-surface rounded-xl p-4 mb-4">
                          <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-accent" />
                            Personal details
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <Recap icon={User} label="Name" value={form.fullName} />
                            <Recap icon={Globe} label="Nationality" value={form.nationality} />
                            <Recap
                              icon={CreditCard}
                              label={documentTypeLabel(form.documentType)}
                              value={form.documentNumber}
                            />
                            <Recap icon={Phone} label="Phone" value={form.phone} />
                            <Recap icon={Mail} label="Email" value={form.email} full />
                          </div>
                        </div>

                        {/* Preferences recap */}
                        <div className="bg-surface rounded-xl p-4 mb-4">
                          <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-accent" />
                            Preferences
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <Recap icon={Building2} label="Floor" value={floorLabel(form.floor)} />
                            <Recap icon={BedDouble} label="Pillow" value={form.pillow} className="capitalize" />
                            <Recap icon={Clock} label="Arrival" value={form.arrival} />
                          </div>
                          {form.specialRequests && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <span className="text-muted text-xs block mb-1">Special requests</span>
                              <p className="text-sm italic">"{form.specialRequests}"</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-start gap-2 text-xs text-muted bg-surface rounded-lg p-3 mb-2">
                          <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            By confirming you accept the hotel policies. Your reservation will be
                            marked as checked-in and a digital room key will be issued.
                          </span>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="flex-1 py-3 rounded-xl font-semibold border border-border text-muted hover:text-primary hover:border-accent transition disabled:opacity-50"
                          >
                            Back
                          </button>
                          <motion.button
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            className={`flex-1 bg-accent text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                              isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90'
                            }`}
                          >
                            {isSubmitting ? (
                              <>
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                Processing…
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Confirm check-in
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// --- small presentational helpers -----------------------------------------

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${
          error ? 'border-red-500' : 'border-border focus-within:border-accent'
        }`}
      >
        <Icon className="w-5 h-5 text-accent flex-shrink-0" />
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function Recap({ icon: Icon, label, value, full = false, className = '' }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <span className="text-muted text-xs flex items-center gap-1.5 mb-0.5">
        <Icon className="w-3.5 h-3.5 text-accent" />
        {label}
      </span>
      <span className={`font-medium break-words ${className}`}>{value || '—'}</span>
    </div>
  )
}

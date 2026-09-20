import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ArrowLeft, ArrowRight, Save, User, Users, UserPlus, Globe, Phone, Mail,
  Calendar, CreditCard, FileText, Upload, Camera, Trash2, BedDouble, Building2,
  DoorOpen, Wallet, CheckCircle2, ShieldCheck, KeyRound, Smartphone, Sparkles,
  MapPin, Clock, Check, AlertCircle, Minus, Plus, ScanLine
} from 'lucide-react'
import DatePicker from '@shared-ui/components/DatePicker'
import { useTranslation } from '../../../i18n/LanguageProvider'
import { useCurrency } from '../../../hooks/useCurrency'
import SignaturePad from './SignaturePad'
import {
  buildSteps, hydrateStationData, validateStationStep, generateKeyCode,
  balanceDue, maskCard, stationProgress,
  DOCUMENT_TYPES, PAYMENT_METHODS, ARRIVAL_WINDOWS, MIN_KEY_CARDS, MAX_KEY_CARDS
} from '../../../data/admin/checkinStation'

// ---------------------------------------------------------------------------
// H26 — Check-in station: one wizard, two actors.
//   mode="guest"      → self-service from the portal (fewer, guided steps)
//   mode="reception"  → front desk from the admin (every step, free editing)
//
// State is resumable: `onSaveProgress(form)` persists partial progress into the
// reservation, so a guest can start online and reception finishes at the desk.
// On completion `onComplete({ station, room, digitalKey, keyCards, mobileKey })`
// flips the reservation to checked-in (handled by the caller via the store).
// ---------------------------------------------------------------------------

const FLOOR_OPTIONS = ['high', 'low', 'any']

const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formatStayDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function CheckInStation({
  open,
  onClose,
  reservation,
  mode = 'reception',
  availableRooms = [],
  onComplete,
  onSaveProgress,
}) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const isReception = mode === 'reception'

  const steps = useMemo(
    () => buildSteps({ mode, guests: reservation?.guests || 1 }),
    [mode, reservation?.guests]
  )

  const [stepIdx, setStepIdx] = useState(0)
  const [form, setForm] = useState(() => hydrateStationData(reservation, reservation?.station))
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  // (Re)seed when the flow opens for a (possibly different) reservation. Drop the
  // resuming actor at the first step they still need to complete.
  useEffect(() => {
    if (!open) return
    const seeded = hydrateStationData(reservation, reservation?.station)
    setForm(seeded)
    setErrors({})
    setResult(reservation?.status === 'checked-in' && reservation?.digitalKey
      ? { digitalKey: reservation.digitalKey, keyCards: reservation.keyCards, mobileKey: reservation.mobileKey }
      : null)
    setStepIdx(0)
    setIsSubmitting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reservation?.id])

  const progress = useMemo(() => stationProgress(reservation, form, mode), [reservation, form, mode])

  const errText = (key) => (key ? t(key) : '')

  // --- mutators -------------------------------------------------------------
  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }
  const updatePayment = (field, value) => {
    setForm((prev) => ({ ...prev, payment: { ...prev.payment, [field]: value } }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }
  const updateCompanion = (i, field, value) => {
    setForm((prev) => ({
      ...prev,
      companions: prev.companions.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)),
    }))
    const k = `companion-${i}-${field}`
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  // Mock document photo upload → data-url preview.
  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('documentPhoto', reader.result)
    reader.readAsDataURL(file)
  }

  const markCompleteAndPersist = (nextForm, stepKey) => {
    const withProgress = {
      ...nextForm,
      completedSteps: Array.from(new Set([...(nextForm.completedSteps || []), stepKey])),
    }
    setForm(withProgress)
    onSaveProgress?.(withProgress)
    return withProgress
  }

  const handleNext = () => {
    const key = steps[stepIdx]
    const errs = validateStationStep(key, form, { mode })
    if (Object.keys(errs).length) { setErrors(errs); return }
    markCompleteAndPersist(form, key)
    setStepIdx((s) => Math.min(steps.length - 1, s + 1))
  }

  const handleBack = () => {
    setErrors({})
    setStepIdx((s) => Math.max(0, s - 1))
  }

  // Save partial progress and close (the "guest starts online / reception pauses"
  // path). No validation — we keep whatever is filled.
  const handleSaveClose = () => {
    onSaveProgress?.(form)
    onClose?.()
  }

  const handleConfirm = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      const roomNumber = form.assignedRoomNumber || reservation?.roomNumber
      const digitalKey = generateKeyCode(roomNumber)
      const room = form.assignedRoomId || form.assignedRoomNumber
        ? { id: form.assignedRoomId, number: form.assignedRoomNumber }
        : null
      const finalForm = {
        ...form,
        completedSteps: Array.from(new Set([...(form.completedSteps || []), ...steps.filter((s) => s !== 'confirm')])),
      }
      setIsSubmitting(false)
      setResult({ digitalKey, keyCards: form.keyCards, mobileKey: form.mobileKey })
      onComplete?.({
        station: finalForm,
        room,
        digitalKey,
        keyCards: form.keyCards,
        mobileKey: form.mobileKey,
        by: mode,
      })
    }, 1000)
  }

  if (!open) return null

  const key = steps[stepIdx]
  const balance = balanceDue(reservation)
  // Prefer rooms of the booked type; fall back to any available room so reception
  // is never blocked when the exact category is sold out.
  const typed = availableRooms.filter((r) => !reservation?.roomType || r.type === reservation.roomType)
  const roomsForType = typed.length ? typed : availableRooms
  const guestAdvancedOnline = form.lastUpdatedBy === 'guest' && (form.completedSteps?.length || 0) > 0

  // ---------------------------------------------------------------- Success
  const successScreen = result && (
    <div className="p-6 md:p-10 text-center">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center"
      >
        <CheckCircle2 className="w-9 h-9 text-emerald-500" />
      </motion.div>
      <h2 className="text-2xl md:text-3xl font-serif text-primary mb-2">{t('station.success.title')}</h2>
      <p className="text-muted mb-7 max-w-sm mx-auto">
        {isReception ? t('station.success.bodyReception', { name: reservation?.guestName }) : t('station.success.body')}
      </p>

      {/* Digital key card (shared visual language with H16) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
        className="relative mx-auto max-w-xs bg-primary text-primary-contrast rounded-[28px] p-6 shadow-medium border border-accent overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
            <Smartphone className="w-3.5 h-3.5" /> {t('station.success.digitalKey')}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium">
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-400" />
            {t('station.success.active')}
          </span>
        </div>
        <div className="relative flex flex-col items-center">
          <div className="relative mb-4">
            <motion.span animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-accent" />
            <span className="relative w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-white" />
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-widest opacity-70">{t('station.success.room')}</span>
          <span className="text-5xl font-bold leading-none mt-1 mb-4">
            {form.assignedRoomNumber || reservation?.roomNumber || '—'}
          </span>
          <div className="w-full h-px bg-primary-contrast opacity-20 mb-4" />
          <div className="w-full flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest opacity-70">{t('station.success.keyCode')}</span>
            <span className="font-mono font-bold text-accent tracking-wider">{result.digitalKey}</span>
          </div>
          <div className="w-full mt-3 flex items-center justify-between text-[11px] opacity-75">
            <span>{reservation?.guestName}</span>
            <span>{formatStayDate(reservation?.checkIn)} → {formatStayDate(reservation?.checkOut)}</span>
          </div>
        </div>
      </motion.div>

      {/* Issued credentials summary */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-6 flex flex-wrap justify-center gap-2 text-xs"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-text border border-border">
          <CreditCard className="w-3.5 h-3.5 text-accent" />
          {t('station.success.keyCardsIssued', { count: result.keyCards || 0 })}
        </span>
        {result.mobileKey && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-text border border-border">
            <Smartphone className="w-3.5 h-3.5 text-accent" /> {t('station.success.mobileKeyIssued')}
          </span>
        )}
      </motion.div>

      <button
        onClick={onClose}
        className="mt-7 w-full bg-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
      >
        {t('station.success.done')}
      </button>
    </div>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose?.() }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog" aria-modal="true"
            className="relative bg-bg rounded-3xl shadow-medium w-full max-w-2xl my-6 overflow-hidden"
          >
            {result ? successScreen : (
              <>
                {/* Header */}
                <div className="bg-surface px-5 md:px-6 py-5 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      {stepIdx > 0 && (
                        <button onClick={handleBack} className="p-2 hover:bg-bg rounded-lg transition-colors" aria-label={t('station.actions.back')}>
                          <ArrowLeft className="w-5 h-5 text-muted" />
                        </button>
                      )}
                      <div className="min-w-0">
                        <h2 className="text-xl font-serif text-primary leading-tight truncate">
                          {isReception ? t('station.titleReception') : t('station.titleGuest')}
                        </h2>
                        <p className="text-sm text-muted truncate">
                          {reservation?.guestName} · {t('station.roomLine', { type: reservation?.roomType, number: form.assignedRoomNumber || reservation?.roomNumber || '—' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isReception && (
                        <button onClick={handleSaveClose} className="hidden sm:inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border text-muted hover:text-text transition-colors">
                          <Save className="w-4 h-4" /> {t('station.actions.saveClose')}
                        </button>
                      )}
                      <button onClick={() => !isSubmitting && onClose?.()} className="p-2 hover:bg-bg rounded-lg transition-colors" aria-label={t('station.actions.close')}>
                        <X className="w-5 h-5 text-muted" />
                      </button>
                    </div>
                  </div>

                  {/* Step indicator */}
                  <div className="flex items-center gap-1.5 mt-4">
                    {steps.map((s, i) => (
                      <div key={s} className="flex flex-col items-center flex-1">
                        <div className={`h-1.5 w-full rounded-full transition-colors ${i <= stepIdx ? 'bg-accent' : 'bg-border'}`} />
                        <span className={`text-[11px] mt-1.5 hidden md:block truncate ${i <= stepIdx ? 'text-accent font-medium' : 'text-muted'}`}>
                          {t(`station.steps.${s}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 md:p-6 max-h-[62vh] overflow-y-auto">
                  {/* Resume banner — reception picking up a guest's online progress */}
                  {isReception && guestAdvancedOnline && stepIdx === 0 && (
                    <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                        {t('station.resumeBanner', { done: progress.done, total: progress.total })}
                      </p>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* ------------------------------------------- identify */}
                      {key === 'identify' && (
                        <div>
                          <StepHead title={t('station.identify.title')} subtitle={t('station.identify.subtitle')} />
                          <div className="bg-surface rounded-xl p-4 border border-border">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <Recap icon={User} label={t('station.identify.guest')} value={reservation?.guestName} />
                              <Recap icon={FileText} label={t('station.identify.reservation')} value={reservation?.id} />
                              <Recap icon={BedDouble} label={t('station.identify.roomType')} value={reservation?.roomType} className="capitalize" />
                              <Recap icon={Users} label={t('station.identify.guests')} value={reservation?.guests} />
                              <Recap icon={Calendar} label={t('station.identify.checkIn')} value={formatStayDate(reservation?.checkIn)} />
                              <Recap icon={Calendar} label={t('station.identify.checkOut')} value={formatStayDate(reservation?.checkOut)} />
                              <Recap icon={Wallet} label={t('station.identify.balance')} value={format(balance)} />
                              <Recap icon={CreditCard} label={t('station.identify.payment')} value={t(`admin.shared.paymentStatus.${reservation?.paymentStatus === 'paid' ? 'paid' : 'pending'}`)} />
                            </div>
                            {reservation?.specialRequests && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <span className="text-muted text-xs block mb-0.5">{t('station.identify.specialRequests')}</span>
                                <p className="text-sm text-text">{reservation.specialRequests}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ------------------------------------------ documents */}
                      {key === 'documents' && (
                        <div>
                          <StepHead title={t('station.documents.title')} subtitle={t('station.documents.subtitle')} />
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">{t('station.documents.docType')}</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                                  <CreditCard className="w-5 h-5 text-accent flex-shrink-0" />
                                  <select value={form.documentType} onChange={(e) => update('documentType', e.target.value)}
                                    className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer">
                                    {DOCUMENT_TYPES.map((id) => <option key={id} value={id}>{t(`station.documentTypes.${id}`)}</option>)}
                                  </select>
                                </div>
                              </div>
                              <Field label={t('station.documents.docNumber')} icon={FileText} error={errText(errors.documentNumber)}>
                                <input type="text" value={form.documentNumber} onChange={(e) => update('documentNumber', e.target.value)}
                                  placeholder={t('station.documents.docNumberPlaceholder')} className="flex-1 bg-transparent focus:outline-none text-sm" />
                              </Field>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label={t('station.documents.nationality')} icon={Globe} error={errText(errors.nationality)}>
                                <input type="text" value={form.nationality} onChange={(e) => update('nationality', e.target.value)}
                                  placeholder={t('station.documents.nationalityPlaceholder')} className="flex-1 bg-transparent focus:outline-none text-sm" />
                              </Field>
                              <div>
                                <label className="block text-sm font-medium mb-2">{t('station.documents.birthDate')}</label>
                                <DatePicker value={form.birthDate} onChange={(iso) => update('birthDate', iso)} max={todayISO()}
                                  placeholder={t('station.documents.birthDatePlaceholder')} error={!!errors.birthDate} />
                                {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errText(errors.birthDate)}</p>}
                              </div>
                            </div>

                            {/* ID photo — mock upload with preview */}
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                {t('station.documents.photo')}
                                {!isReception && <span className="text-muted font-normal"> · {t('station.optional')}</span>}
                              </label>
                              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                              {form.documentPhoto ? (
                                <div className="relative rounded-xl overflow-hidden border border-border">
                                  <img src={form.documentPhoto} alt={t('station.documents.photo')} className="w-full max-h-52 object-contain bg-surface" />
                                  <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors" title={t('station.documents.retake')}>
                                      <Camera className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => update('documentPhoto', null)} className="p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors" title={t('station.documents.remove')}>
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className={`w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed transition-colors ${errors.documentPhoto ? 'border-red-500' : 'border-border hover:border-accent'}`}
                                >
                                  <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center">
                                    <ScanLine className="w-5 h-5 text-accent" />
                                  </div>
                                  <span className="text-sm font-medium text-text flex items-center gap-1.5"><Upload className="w-4 h-4" /> {t('station.documents.uploadPhoto')}</span>
                                  <span className="text-xs text-muted">{t('station.documents.photoHint')}</span>
                                </button>
                              )}
                              {errors.documentPhoto && <p className="text-red-500 text-xs mt-1">{errText(errors.documentPhoto)}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* --------------------------------------------- guests */}
                      {key === 'guests' && (
                        <div>
                          <StepHead title={t('station.guests.title')} subtitle={t('station.guests.subtitle', { count: reservation?.guests || 1 })} />
                          <div className="space-y-5">
                            {form.companions.map((c, i) => (
                              <div key={i} className="bg-surface rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2 mb-4">
                                  <span className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center"><UserPlus className="w-4 h-4" /></span>
                                  <h4 className="font-semibold text-primary">{t('station.guests.guestNumber', { number: i + 2 })}</h4>
                                </div>
                                <div className="space-y-4">
                                  <Field label={t('station.documents.fullName')} icon={User} error={errText(errors[`companion-${i}-fullName`])}>
                                    <input type="text" value={c.fullName} onChange={(e) => updateCompanion(i, 'fullName', e.target.value)}
                                      placeholder={t('station.guests.namePlaceholder')} className="flex-1 bg-transparent focus:outline-none text-sm" />
                                  </Field>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">{t('station.documents.docType')}</label>
                                      <div className="flex items-center gap-3 px-4 py-3 bg-bg rounded-lg border border-border focus-within:border-accent transition-colors">
                                        <CreditCard className="w-5 h-5 text-accent flex-shrink-0" />
                                        <select value={c.documentType} onChange={(e) => updateCompanion(i, 'documentType', e.target.value)}
                                          className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer">
                                          {DOCUMENT_TYPES.map((id) => <option key={id} value={id}>{t(`station.documentTypes.${id}`)}</option>)}
                                        </select>
                                      </div>
                                    </div>
                                    <Field label={t('station.documents.docNumber')} icon={FileText} error={errText(errors[`companion-${i}-documentNumber`])}>
                                      <input type="text" value={c.documentNumber} onChange={(e) => updateCompanion(i, 'documentNumber', e.target.value)}
                                        placeholder={t('station.documents.docNumberPlaceholder')} className="flex-1 bg-transparent focus:outline-none text-sm" />
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ----------------------------------------------- room */}
                      {key === 'room' && (
                        <div>
                          <StepHead title={t('station.room.title')} subtitle={t('station.room.subtitle', { type: reservation?.roomType })} />
                          {/* Floor preference */}
                          <div className="mb-5">
                            <label className="flex items-center gap-2 text-sm font-medium mb-3"><Building2 className="w-4 h-4 text-accent" /> {t('station.room.floorPreference')}</label>
                            <div className="grid grid-cols-3 gap-2">
                              {FLOOR_OPTIONS.map((id) => {
                                const active = form.floorPreference === id
                                return (
                                  <button key={id} onClick={() => update('floorPreference', id)}
                                    className={`py-2.5 rounded-xl border text-sm font-semibold transition ${active ? 'bg-accent text-white border-accent' : 'bg-surface border-border hover:border-accent text-text'}`}>
                                    {t(`station.floorOptions.${id}`)}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Room picker */}
                          <label className="flex items-center gap-2 text-sm font-medium mb-3"><DoorOpen className="w-4 h-4 text-accent" /> {t('station.room.assignRoom')}</label>
                          {roomsForType.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted">{t('station.room.noRooms')}</div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {roomsForType.map((room) => {
                                const active = form.assignedRoomNumber === room.number
                                return (
                                  <button key={room.number}
                                    onClick={() => setForm((prev) => ({ ...prev, assignedRoomId: room.id, assignedRoomNumber: room.number }))}
                                    className={`p-3 rounded-xl border text-left transition ${active ? 'bg-accent text-white border-accent' : 'bg-surface border-border hover:border-accent text-text'}`}>
                                    <span className="block text-lg font-bold leading-none">{room.number}</span>
                                    <span className={`text-xs ${active ? 'text-white/80' : 'text-muted'}`}>{t('station.room.floorN', { floor: room.floor })}</span>
                                    {active && <Check className="w-4 h-4 mt-1" />}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                          {!isReception && (
                            <button
                              onClick={() => setForm((prev) => ({ ...prev, assignedRoomId: null, assignedRoomNumber: null }))}
                              className="mt-3 text-sm text-muted hover:text-text transition-colors underline"
                            >
                              {t('station.room.assignAtDesk')}
                            </button>
                          )}
                          {errors.assignedRoomNumber && <p className="text-red-500 text-xs mt-2">{errText(errors.assignedRoomNumber)}</p>}
                        </div>
                      )}

                      {/* -------------------------------------------- payment */}
                      {key === 'payment' && (
                        <div>
                          <StepHead title={t('station.payment.title')} subtitle={t('station.payment.subtitle')} />
                          {/* Balance summary */}
                          <div className="flex items-center justify-between bg-surface rounded-xl p-4 border border-border mb-5">
                            <div className="flex items-center gap-2 text-sm text-muted"><Wallet className="w-4 h-4" /> {t('station.payment.balanceDue')}</div>
                            <span className="text-xl font-bold text-accent">{format(balance)}</span>
                          </div>

                          <label className="block text-sm font-medium mb-3">{t('station.payment.method')}</label>
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {PAYMENT_METHODS.map((m) => {
                              const active = form.payment.method === m
                              return (
                                <button key={m} onClick={() => updatePayment('method', m)}
                                  className={`py-2.5 px-2 rounded-xl border text-sm font-semibold transition ${active ? 'bg-accent text-white border-accent' : 'bg-surface border-border hover:border-accent text-text'}`}>
                                  {t(`station.paymentMethods.${m}`)}
                                </button>
                              )
                            })}
                          </div>

                          {form.payment.method === 'card' && (
                            <div className="space-y-4">
                              <Field label={t('station.payment.cardName')} icon={User} error={errText(errors.cardName)}>
                                <input type="text" value={form.payment.cardName} onChange={(e) => updatePayment('cardName', e.target.value)}
                                  placeholder={t('station.payment.cardNamePlaceholder')} className="flex-1 bg-transparent focus:outline-none text-sm" />
                              </Field>
                              <Field label={t('station.payment.cardNumber')} icon={CreditCard} error={errText(errors.cardNumber)}>
                                <input type="text" inputMode="numeric" value={form.payment.cardNumber}
                                  onChange={(e) => updatePayment('cardNumber', e.target.value)}
                                  placeholder="4242 4242 4242 4242" className="flex-1 bg-transparent focus:outline-none text-sm" />
                              </Field>
                              <div className="grid grid-cols-2 gap-4">
                                <Field label={t('station.payment.expiry')} icon={Calendar} error={errText(errors.expiry)}>
                                  <input type="text" value={form.payment.expiry} onChange={(e) => updatePayment('expiry', e.target.value)}
                                    placeholder="MM/YY" className="flex-1 bg-transparent focus:outline-none text-sm" />
                                </Field>
                                <Field label={t('station.payment.cvc')} icon={ShieldCheck} error={errText(errors.cvc)}>
                                  <input type="text" inputMode="numeric" value={form.payment.cvc} onChange={(e) => updatePayment('cvc', e.target.value)}
                                    placeholder="123" className="flex-1 bg-transparent focus:outline-none text-sm" />
                                </Field>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">{t('station.payment.preauth')}</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border focus-within:border-accent transition-colors">
                                  <Wallet className="w-5 h-5 text-accent flex-shrink-0" />
                                  <input type="number" min={0} value={form.payment.preauthAmount}
                                    onChange={(e) => updatePayment('preauthAmount', e.target.value)}
                                    className="flex-1 bg-transparent focus:outline-none text-sm" />
                                </div>
                                <p className="text-xs text-muted mt-1.5">{t('station.payment.preauthHint')}</p>
                              </div>
                            </div>
                          )}
                          {form.payment.method === 'paid' && (
                            <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                              <CheckCircle2 className="w-4 h-4" /> {t('station.payment.paidNote')}
                            </p>
                          )}
                          {form.payment.method === 'desk' && (
                            <p className="flex items-center gap-2 text-sm text-muted bg-surface border border-border rounded-xl p-3">
                              <AlertCircle className="w-4 h-4 text-accent" /> {t('station.payment.deskNote')}
                            </p>
                          )}
                        </div>
                      )}

                      {/* ------------------------------------------ signature */}
                      {key === 'signature' && (
                        <div>
                          <StepHead title={t('station.signature.title')} subtitle={t('station.signature.subtitle')} />
                          <SignaturePad value={form.signature} onChange={(v) => update('signature', v)} />
                          {errors.signature && <p className="text-red-500 text-xs mt-1">{errText(errors.signature)}</p>}
                          <label className="flex items-start gap-3 mt-4 cursor-pointer">
                            <input type="checkbox" checked={form.acceptPolicies} onChange={(e) => update('acceptPolicies', e.target.checked)}
                              className="mt-0.5 w-4 h-4 accent-accent flex-shrink-0" />
                            <span className="text-sm text-text leading-relaxed">{t('station.signature.accept')}</span>
                          </label>
                          {errors.acceptPolicies && <p className="text-red-500 text-xs mt-1">{errText(errors.acceptPolicies)}</p>}
                        </div>
                      )}

                      {/* ----------------------------------------------- keys */}
                      {key === 'keys' && (
                        <div>
                          <StepHead title={t('station.keys.title')} subtitle={t('station.keys.subtitle')} />
                          <div className="bg-surface rounded-xl p-4 border border-border mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-accent" />
                                <span className="text-sm font-medium text-text">{t('station.keys.keyCards')}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button onClick={() => update('keyCards', Math.max(MIN_KEY_CARDS, (Number(form.keyCards) || 0) - 1))}
                                  className="w-9 h-9 rounded-lg border border-border grid place-items-center text-text hover:bg-bg transition-colors" aria-label="-">
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-6 text-center text-lg font-bold text-text">{form.keyCards}</span>
                                <button onClick={() => update('keyCards', Math.min(MAX_KEY_CARDS, (Number(form.keyCards) || 0) + 1))}
                                  className="w-9 h-9 rounded-lg border border-border grid place-items-center text-text hover:bg-bg transition-colors" aria-label="+">
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => update('mobileKey', !form.mobileKey)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition ${form.mobileKey ? 'bg-accent/10 border-accent' : 'bg-surface border-border hover:border-accent'}`}>
                            <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${form.mobileKey ? 'bg-accent text-white' : 'bg-bg text-muted'}`}>
                              <Smartphone className="w-5 h-5" />
                            </span>
                            <span className="flex-1 text-left">
                              <span className="block text-sm font-semibold text-text">{t('station.keys.mobileKey')}</span>
                              <span className="block text-xs text-muted">{t('station.keys.mobileKeyHint')}</span>
                            </span>
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.mobileKey ? 'bg-accent border-accent' : 'border-border'}`}>
                              {form.mobileKey && <Check className="w-3 h-3 text-white" />}
                            </span>
                          </button>
                          {errors.keyCards && <p className="text-red-500 text-xs mt-2">{errText(errors.keyCards)}</p>}
                        </div>
                      )}

                      {/* -------------------------------------------- confirm */}
                      {key === 'confirm' && (
                        <div>
                          <StepHead title={t('station.confirm.title')} subtitle={t('station.confirm.subtitle')} />
                          <div className="bg-surface rounded-xl p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <Recap icon={MapPin} label={t('station.confirm.room')} value={`${form.assignedRoomNumber || reservation?.roomNumber || '—'} · ${reservation?.roomType || ''}`} full className="capitalize" />
                              <Recap icon={Calendar} label={t('station.confirm.checkIn')} value={formatStayDate(reservation?.checkIn)} />
                              <Recap icon={Calendar} label={t('station.confirm.checkOut')} value={formatStayDate(reservation?.checkOut)} />
                            </div>
                          </div>
                          <div className="bg-surface rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-primary mb-3 flex items-center gap-2"><User className="w-4 h-4 text-accent" /> {t('station.confirm.identity')}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <Recap icon={User} label={t('station.confirm.name')} value={reservation?.guestName} />
                              <Recap icon={Globe} label={t('station.confirm.nationality')} value={form.nationality} />
                              <Recap icon={CreditCard} label={t(`station.documentTypes.${form.documentType}`)} value={form.documentNumber} />
                              <Recap icon={Calendar} label={t('station.confirm.birthDate')} value={form.birthDate ? formatStayDate(form.birthDate) : '—'} />
                              {form.documentPhoto && <Recap icon={ScanLine} label={t('station.confirm.idPhoto')} value={t('station.confirm.attached')} />}
                            </div>
                          </div>
                          {form.companions.length > 0 && (
                            <div className="bg-surface rounded-xl p-4 mb-4">
                              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> {t('station.confirm.companions')}</h4>
                              <div className="space-y-2">
                                {form.companions.map((c, i) => (
                                  <div key={i} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="font-medium text-primary truncate">{c.fullName || t('station.guests.guestNumber', { number: i + 2 })}</span>
                                    <span className="text-muted flex items-center gap-1.5 shrink-0"><CreditCard className="w-3.5 h-3.5 text-accent" />{c.documentNumber || '—'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="bg-surface rounded-xl p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <Recap icon={Wallet} label={t('station.confirm.payment')} value={t(`station.paymentMethods.${form.payment.method}`)} />
                              {form.payment.method === 'card' && <Recap icon={CreditCard} label={t('station.confirm.card')} value={maskCard(form.payment.cardNumber) || '—'} />}
                              <Recap icon={CreditCard} label={t('station.confirm.keyCards')} value={form.keyCards} />
                              <Recap icon={Smartphone} label={t('station.confirm.mobileKey')} value={form.mobileKey ? t('common.actions.yes') : t('common.actions.no')} />
                              <Recap icon={ShieldCheck} label={t('station.confirm.signature')} value={form.signature ? t('station.confirm.signed') : '—'} />
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-muted bg-surface rounded-lg p-3">
                            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{t('station.confirm.policyNote')}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer actions */}
                <div className="px-5 md:px-6 py-4 border-t border-border bg-surface flex items-center gap-3">
                  {stepIdx > 0 ? (
                    <button onClick={handleBack} disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl font-semibold border border-border text-muted hover:text-primary hover:border-accent transition disabled:opacity-50">
                      {t('station.actions.back')}
                    </button>
                  ) : (
                    <button onClick={() => onClose?.()} disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl font-semibold border border-border text-muted hover:text-primary hover:border-accent transition disabled:opacity-50">
                      {t('station.actions.cancel')}
                    </button>
                  )}
                  {key === 'confirm' ? (
                    <motion.button onClick={handleConfirm} disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className={`flex-1 bg-accent text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90'}`}>
                      {isSubmitting ? (
                        <>
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          {t('station.confirm.processing')}
                        </>
                      ) : (
                        <><CheckCircle2 className="w-5 h-5" /> {t('station.confirm.confirmButton')}</>
                      )}
                    </motion.button>
                  ) : (
                    <button onClick={handleNext}
                      className="flex-1 bg-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                      {steps[stepIdx + 1] === 'confirm' ? t('station.actions.review') : t('station.actions.continue')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// --- presentational helpers -------------------------------------------------
function StepHead({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
    </div>
  )
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${error ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
        {Icon && <Icon className="w-5 h-5 text-accent flex-shrink-0" />}
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
        {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}{label}
      </span>
      <span className={`font-medium break-words ${className}`}>{value || value === 0 ? value : '—'}</span>
    </div>
  )
}

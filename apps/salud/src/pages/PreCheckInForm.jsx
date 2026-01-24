import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Phone,
  AlertCircle,
  Heart,
  Pill,
  Activity,
  Syringe,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Users,
  X,
  Plus,
  Trash2
} from 'lucide-react'

const COMMON_CONDITIONS = [
  'Diabetes', 'High Blood Pressure', 'Heart Disease', 'Asthma',
  'Arthritis', 'Cancer', 'Depression/Anxiety', 'Thyroid Disorder',
  'Kidney Disease', 'Liver Disease', 'Stroke', 'COPD'
]

const COMMON_ALLERGIES = [
  'Penicillin', 'Sulfa Drugs', 'Aspirin', 'Ibuprofen',
  'Codeine', 'Latex', 'Peanuts', 'Shellfish', 'Eggs', 'Milk'
]

export default function PreCheckInForm({ onClose, appointmentInfo }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    // Step 2: Medical History
    conditions: [],
    otherConditions: '',
    surgeries: '',
    familyHistory: '',
    // Step 3: Allergies & Medications
    hasAllergies: null,
    allergies: [],
    otherAllergies: '',
    currentMedications: [{ name: '', dosage: '', frequency: '' }],
    // Step 4: Lifestyle & Consent
    smokingStatus: '',
    alcoholUse: '',
    exerciseFrequency: '',
    consentToTreatment: false,
    consentToPrivacy: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateStep = (currentStep) => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = 'Emergency contact name is required'
      }
      if (!formData.emergencyContactRelation) {
        newErrors.emergencyContactRelation = 'Relationship is required'
      }
      if (!formData.emergencyContactPhone.trim()) {
        newErrors.emergencyContactPhone = 'Phone number is required'
      }
    }

    if (currentStep === 3) {
      if (formData.hasAllergies === null) {
        newErrors.hasAllergies = 'Please indicate if you have allergies'
      }
    }

    if (currentStep === 4) {
      if (!formData.smokingStatus) newErrors.smokingStatus = 'Please select smoking status'
      if (!formData.alcoholUse) newErrors.alcoholUse = 'Please select alcohol use'
      if (!formData.consentToTreatment) {
        newErrors.consentToTreatment = 'You must consent to treatment'
      }
      if (!formData.consentToPrivacy) {
        newErrors.consentToPrivacy = 'You must acknowledge the privacy policy'
      }
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

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  const toggleCondition = (condition) => {
    const updated = formData.conditions.includes(condition)
      ? formData.conditions.filter(c => c !== condition)
      : [...formData.conditions, condition]
    setFormData({ ...formData, conditions: updated })
  }

  const toggleAllergy = (allergy) => {
    const updated = formData.allergies.includes(allergy)
      ? formData.allergies.filter(a => a !== allergy)
      : [...formData.allergies, allergy]
    setFormData({ ...formData, allergies: updated })
  }

  const addMedication = () => {
    setFormData({
      ...formData,
      currentMedications: [...formData.currentMedications, { name: '', dosage: '', frequency: '' }]
    })
  }

  const removeMedication = (index) => {
    const updated = formData.currentMedications.filter((_, i) => i !== index)
    setFormData({ ...formData, currentMedications: updated })
  }

  const updateMedication = (index, field, value) => {
    const updated = [...formData.currentMedications]
    updated[index][field] = value
    setFormData({ ...formData, currentMedications: updated })
  }

  // Success State
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg rounded-2xl p-8 md:p-12 shadow-soft max-w-lg mx-auto text-center"
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
            Pre-Check-In Complete!
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Thank you for completing your pre-check-in. This will help us provide you with better care.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-accent/10 border border-accent/30 rounded-xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-accent">What to bring to your appointment:</p>
              <ul className="text-sm text-accent/80 mt-2 space-y-1">
                <li>• Photo ID (driver's license or passport)</li>
                <li>• Insurance card</li>
                <li>• List of current medications</li>
                <li>• Any relevant medical records</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Important Reminder</p>
              <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                Please arrive 15 minutes before your scheduled appointment time. If you need to cancel or reschedule, please contact us at least 24 hours in advance.
              </p>
            </div>
          </div>
        </motion.div>

        {onClose && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onClose}
            className="btn-primary px-8"
          >
            Done
          </motion.button>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg rounded-2xl shadow-soft max-w-3xl mx-auto overflow-hidden"
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
                type="button"
                className="p-2 hover:bg-bg rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted" />
              </motion.button>
            )}
            <div>
              <h2 className="text-xl font-serif text-primary">Pre-Check-In Form</h2>
              <p className="text-sm text-muted">Complete your medical history before your visit</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-bg rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[
            { num: 1, label: 'Emergency' },
            { num: 2, label: 'History' },
            { num: 3, label: 'Allergies' },
            { num: 4, label: 'Lifestyle' },
            { num: 5, label: 'Review' }
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

      <form onSubmit={handleSubmit} className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Emergency Contact */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Emergency Contact
              </h3>
              <p className="text-sm text-muted mb-6">Who should we contact in case of an emergency?</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.emergencyContactName ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                    <User className="w-5 h-5 text-accent flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="flex-1 bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                  {errors.emergencyContactName && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.emergencyContactRelation ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                      <Users className="w-5 h-5 text-accent flex-shrink-0" />
                      <select
                        value={formData.emergencyContactRelation}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                        className="flex-1 bg-transparent focus:outline-none text-sm cursor-pointer"
                      >
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Child">Child</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.emergencyContactRelation && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactRelation}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border transition-colors ${errors.emergencyContactPhone ? 'border-red-500' : 'border-border focus-within:border-accent'}`}>
                      <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className="flex-1 bg-transparent focus:outline-none text-sm"
                      />
                    </div>
                    {errors.emergencyContactPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactPhone}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Medical History */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                Medical History
              </h3>
              <p className="text-sm text-muted mb-6">Select any conditions you have or have had</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Current or Past Medical Conditions
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMMON_CONDITIONS.map(condition => (
                      <motion.button
                        key={condition}
                        type="button"
                        onClick={() => toggleCondition(condition)}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                          formData.conditions.includes(condition)
                            ? 'border-accent bg-accent/10 text-accent font-medium'
                            : 'border-border bg-surface hover:border-accent/50'
                        }`}
                      >
                        {condition}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Other Conditions
                  </label>
                  <textarea
                    placeholder="List any other medical conditions not mentioned above..."
                    value={formData.otherConditions}
                    onChange={(e) => setFormData({ ...formData, otherConditions: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-surface rounded-lg border border-border focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Previous Surgeries or Hospitalizations
                  </label>
                  <textarea
                    placeholder="List any surgeries or hospital stays with approximate dates..."
                    value={formData.surgeries}
                    onChange={(e) => setFormData({ ...formData, surgeries: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-surface rounded-lg border border-border focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Family Medical History
                  </label>
                  <textarea
                    placeholder="List any significant medical conditions in your immediate family..."
                    value={formData.familyHistory}
                    onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-surface rounded-lg border border-border focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Allergies & Medications */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                <Syringe className="w-5 h-5 text-accent" />
                Allergies & Medications
              </h3>
              <p className="text-sm text-muted mb-6">Help us ensure your safety during treatment</p>

              <div className="space-y-6">
                {/* Allergies */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Do you have any allergies? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3 mb-4">
                    {[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No allergies' }
                    ].map(option => (
                      <motion.button
                        key={String(option.value)}
                        type="button"
                        onClick={() => setFormData({ ...formData, hasAllergies: option.value })}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          formData.hasAllergies === option.value
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-surface hover:border-accent/50'
                        }`}
                      >
                        <span className="font-medium text-sm">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  {errors.hasAllergies && <p className="text-red-500 text-xs">{errors.hasAllergies}</p>}

                  {formData.hasAllergies && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {COMMON_ALLERGIES.map(allergy => (
                          <motion.button
                            key={allergy}
                            type="button"
                            onClick={() => toggleAllergy(allergy)}
                            whileTap={{ scale: 0.98 }}
                            className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                              formData.allergies.includes(allergy)
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                                : 'border-border bg-surface hover:border-red-300'
                            }`}
                          >
                            {allergy}
                          </motion.button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Other Allergies
                        </label>
                        <input
                          type="text"
                          placeholder="List any other allergies..."
                          value={formData.otherAllergies}
                          onChange={(e) => setFormData({ ...formData, otherAllergies: e.target.value })}
                          className="w-full px-4 py-3 bg-surface rounded-lg border border-border focus:outline-none focus:border-accent transition-colors text-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Current Medications */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Pill className="w-4 h-4 text-accent" />
                      Current Medications
                    </label>
                    <motion.button
                      type="button"
                      onClick={addMedication}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-accent text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Add Medication
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {formData.currentMedications.map((med, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-surface p-3 rounded-lg border border-border"
                      >
                        <input
                          type="text"
                          placeholder="Medication name"
                          value={med.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          className="px-3 py-2 bg-bg rounded border border-border focus:outline-none focus:border-accent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g., 10mg)"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          className="px-3 py-2 bg-bg rounded border border-border focus:outline-none focus:border-accent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Frequency"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="px-3 py-2 bg-bg rounded border border-border focus:outline-none focus:border-accent text-sm"
                        />
                        {formData.currentMedications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-muted mt-2">Leave blank if you're not taking any medications</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Lifestyle */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Lifestyle & Consent
              </h3>
              <p className="text-sm text-muted mb-6">Help us understand your lifestyle habits</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Smoking Status <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Never', 'Former', 'Current'].map(status => (
                      <motion.button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, smokingStatus: status })}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.smokingStatus === status
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-surface hover:border-accent/50'
                        }`}
                      >
                        {status}
                      </motion.button>
                    ))}
                  </div>
                  {errors.smokingStatus && <p className="text-red-500 text-xs mt-1">{errors.smokingStatus}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Alcohol Use <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['None', 'Occasional', 'Moderate', 'Heavy'].map(use => (
                      <motion.button
                        key={use}
                        type="button"
                        onClick={() => setFormData({ ...formData, alcoholUse: use })}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.alcoholUse === use
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-surface hover:border-accent/50'
                        }`}
                      >
                        {use}
                      </motion.button>
                    ))}
                  </div>
                  {errors.alcoholUse && <p className="text-red-500 text-xs mt-1">{errors.alcoholUse}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Exercise Frequency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['None', '1-2x/week', '3-4x/week', '5+/week'].map(freq => (
                      <motion.button
                        key={freq}
                        type="button"
                        onClick={() => setFormData({ ...formData, exerciseFrequency: freq })}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.exerciseFrequency === freq
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-surface hover:border-accent/50'
                        }`}
                      >
                        {freq}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Consents */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-medium text-primary flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent" />
                    Consent & Acknowledgment
                  </h4>

                  <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.consentToTreatment ? 'border-accent bg-accent/5' : 'border-border bg-surface'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.consentToTreatment}
                      onChange={(e) => setFormData({ ...formData, consentToTreatment: e.target.checked })}
                      className="w-5 h-5 mt-0.5 accent-accent"
                    />
                    <div>
                      <span className="text-sm font-medium text-primary">Consent to Treatment *</span>
                      <p className="text-xs text-muted mt-1">
                        I consent to receive medical treatment and authorize the healthcare provider to perform necessary examinations and procedures.
                      </p>
                    </div>
                  </label>
                  {errors.consentToTreatment && <p className="text-red-500 text-xs">{errors.consentToTreatment}</p>}

                  <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.consentToPrivacy ? 'border-accent bg-accent/5' : 'border-border bg-surface'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.consentToPrivacy}
                      onChange={(e) => setFormData({ ...formData, consentToPrivacy: e.target.checked })}
                      className="w-5 h-5 mt-0.5 accent-accent"
                    />
                    <div>
                      <span className="text-sm font-medium text-primary">Privacy Policy Acknowledgment *</span>
                      <p className="text-xs text-muted mt-1">
                        I acknowledge that I have read and understand the Notice of Privacy Practices (HIPAA).
                      </p>
                    </div>
                  </label>
                  {errors.consentToPrivacy && <p className="text-red-500 text-xs">{errors.consentToPrivacy}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2">Review Your Information</h3>
              <p className="text-sm text-muted mb-6">Please verify all details before submitting</p>

              <div className="space-y-4">
                {/* Emergency Contact */}
                <div className="bg-surface rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted block">Name</span>
                      <span className="font-medium">{formData.emergencyContactName}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Relationship</span>
                      <span className="font-medium">{formData.emergencyContactRelation}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Phone</span>
                      <span className="font-medium">{formData.emergencyContactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-surface rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-accent" />
                    Medical History
                  </h4>
                  <div className="text-sm">
                    <span className="text-muted block mb-1">Conditions</span>
                    {formData.conditions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {formData.conditions.map(c => (
                          <span key={c} className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">{c}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-medium">None reported</span>
                    )}
                  </div>
                </div>

                {/* Allergies */}
                <div className="bg-surface rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Syringe className="w-4 h-4 text-accent" />
                    Allergies
                  </h4>
                  <div className="text-sm">
                    {formData.hasAllergies ? (
                      <div className="flex flex-wrap gap-1">
                        {formData.allergies.map(a => (
                          <span key={a} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">{a}</span>
                        ))}
                        {formData.otherAllergies && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">{formData.otherAllergies}</span>
                        )}
                      </div>
                    ) : (
                      <span className="font-medium text-green-600 dark:text-green-400">No known allergies</span>
                    )}
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="bg-surface rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    Lifestyle
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted block">Smoking</span>
                      <span className="font-medium">{formData.smokingStatus}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Alcohol</span>
                      <span className="font-medium">{formData.alcoholUse}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Exercise</span>
                      <span className="font-medium">{formData.exerciseFrequency || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Consents */}
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Consent to treatment provided</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent mt-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Privacy policy acknowledged</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
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
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Complete Pre-Check-In
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  )
}

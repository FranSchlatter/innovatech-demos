import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  ShoppingBag,
  CheckCircle,
  Truck,
  Store,
  User,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  Mail,
  FileText,
  Loader2,
  Minus,
  Plus,
  Banknote
} from 'lucide-react'

const STEPS = [
  { id: 1, name: 'Cart', icon: ShoppingBag },
  { id: 2, name: 'Delivery', icon: Truck },
  { id: 3, name: 'Details', icon: User },
  { id: 4, name: 'Payment', icon: CreditCard },
  { id: 5, name: 'Confirm', icon: CheckCircle }
]

export default function OrderForm({ cart, onBack, onRemoveItem, onUpdateQuantity, onClearCart, total }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    // Delivery type
    deliveryType: 'delivery',
    // Customer info
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    // Address (for delivery)
    street: '',
    apartment: '',
    city: '',
    zipCode: '',
    deliveryInstructions: '',
    // Pickup info
    pickupTime: '',
    // Payment
    paymentMethod: 'card',
    changeFor: '',
    // Special instructions
    orderNotes: '',
    // Promo
    promoCode: '',
    promoApplied: false
  })

  const deliveryFee = formData.deliveryType === 'delivery' ? 5.00 : 0
  const tax = total * 0.10
  const discount = formData.promoApplied ? total * 0.10 : 0
  const grandTotal = total + deliveryFee + tax - discount

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = () => {
    const newErrors = {}

    if (currentStep === 1) {
      if (cart.length === 0) {
        newErrors.cart = 'Your cart is empty'
      }
    }

    if (currentStep === 2) {
      if (!formData.deliveryType) {
        newErrors.deliveryType = 'Please select delivery type'
      }
      if (formData.deliveryType === 'pickup' && !formData.pickupTime) {
        newErrors.pickupTime = 'Please select pickup time'
      }
    }

    if (currentStep === 3) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'

      if (formData.deliveryType === 'delivery') {
        if (!formData.street.trim()) newErrors.street = 'Street address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
      }
    }

    if (currentStep === 4) {
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = 'Please select payment method'
      }
      if (formData.paymentMethod === 'cash' && formData.deliveryType === 'delivery') {
        if (!formData.changeFor.trim()) {
          newErrors.changeFor = 'Please specify change amount'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleApplyPromo = () => {
    if (formData.promoCode.toLowerCase() === 'welcome10') {
      setFormData(prev => ({ ...prev, promoApplied: true }))
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    const orderNum = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()

    setTimeout(() => {
      setOrderNumber(orderNum)
      setIsSubmitting(false)
      setSubmitted(true)
      setTimeout(() => {
        onClearCart()
      }, 5000)
    }, 2000)
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

            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Order Confirmed!</h2>
            <p className="text-muted mb-6">
              Thank you, {formData.firstName}! Your order has been received.
            </p>

            <div className="bg-bg rounded-xl p-6 mb-6 text-left">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                <span className="text-muted">Order Number</span>
                <span className="font-bold text-accent text-lg">{orderNumber}</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  {formData.deliveryType === 'delivery' ? (
                    <Truck className="w-5 h-5 text-accent" />
                  ) : (
                    <Store className="w-5 h-5 text-accent" />
                  )}
                  <div>
                    <p className="text-muted">{formData.deliveryType === 'delivery' ? 'Delivery to' : 'Pickup at'}</p>
                    <p className="font-semibold text-primary">
                      {formData.deliveryType === 'delivery'
                        ? `${formData.street}, ${formData.city}`
                        : '123 Restaurant Ave'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-muted">Estimated Time</p>
                    <p className="font-semibold text-primary">
                      {formData.deliveryType === 'delivery'
                        ? '30-45 minutes'
                        : formData.pickupTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-muted">Payment</p>
                    <p className="font-semibold text-primary capitalize">{formData.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between">
                <span className="text-muted">Total</span>
                <span className="text-xl font-bold text-accent">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-sm text-muted mb-6">
              A confirmation has been sent to {formData.email}
            </p>

            <button
              onClick={() => {
                setSubmitted(false)
                setCurrentStep(1)
                onBack()
              }}
              className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold transition-all"
            >
              Back to Menu
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Continue Shopping</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Checkout</h1>
          <div className="w-20" /> {/* Spacer */}
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
            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-accent" />
                    Review Your Cart
                  </h2>
                  {cart.length > 0 && (
                    <button
                      onClick={onClearCart}
                      className="text-sm text-accent hover:text-accent/80 font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-16 h-16 text-muted/30 mx-auto mb-4" />
                    <p className="text-lg text-muted mb-4">Your cart is empty</p>
                    <button
                      onClick={onBack}
                      className="text-accent hover:text-accent/80 font-semibold"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          className="flex gap-4 bg-bg p-4 rounded-xl"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-primary truncate">{item.name}</h3>
                            <p className="text-sm text-muted">${item.price.toFixed(2)} each</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-7 h-7 bg-surface hover:bg-accent/10 rounded-full flex items-center justify-center transition"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-semibold w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 bg-surface hover:bg-accent/10 rounded-full flex items-center justify-center transition"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-muted hover:text-red-500 transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            <p className="font-bold text-accent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Promo Code */}
                    <div className="flex gap-2 mb-6">
                      <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleChange}
                        placeholder="Promo code"
                        disabled={formData.promoApplied}
                        className="flex-1 px-4 py-3 rounded-xl bg-bg border-2 border-border focus:border-accent outline-none transition disabled:opacity-50"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={formData.promoApplied || !formData.promoCode}
                        className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition disabled:opacity-50"
                      >
                        {formData.promoApplied ? 'Applied!' : 'Apply'}
                      </button>
                    </div>

                    {/* Summary */}
                    <div className="bg-bg rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-muted">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      {formData.promoApplied && (
                        <div className="flex justify-between text-green-500">
                          <span>Promo Discount (10%)</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Delivery Type */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                  <Truck className="w-6 h-6 text-accent" />
                  Delivery Method
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'delivery' }))}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.deliveryType === 'delivery'
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Truck className={`w-8 h-8 mb-3 ${
                      formData.deliveryType === 'delivery' ? 'text-accent' : 'text-muted'
                    }`} />
                    <h3 className="font-bold text-primary mb-1">Delivery</h3>
                    <p className="text-sm text-muted">30-45 min • $5.00 fee</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'pickup' }))}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.deliveryType === 'pickup'
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Store className={`w-8 h-8 mb-3 ${
                      formData.deliveryType === 'pickup' ? 'text-accent' : 'text-muted'
                    }`} />
                    <h3 className="font-bold text-primary mb-1">Pickup</h3>
                    <p className="text-sm text-muted">15-20 min • Free</p>
                  </button>
                </div>

                {formData.deliveryType === 'pickup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="bg-bg p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-accent" />
                        <div>
                          <p className="font-semibold text-primary">InnovaTech Restaurant</p>
                          <p className="text-sm text-muted">123 Restaurant Ave, Downtown</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Select Pickup Time *
                      </label>
                      <select
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                          errors.pickupTime ? 'border-red-500' : 'border-border'
                        } focus:border-accent outline-none transition`}
                      >
                        <option value="">Select time</option>
                        <option value="ASAP (15-20 min)">ASAP (15-20 min)</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="12:30 PM">12:30 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="6:30 PM">6:30 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="7:30 PM">7:30 PM</option>
                      </select>
                      {errors.pickupTime && (
                        <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 3: Customer Details */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                  <User className="w-6 h-6 text-accent" />
                  {formData.deliveryType === 'delivery' ? 'Delivery Details' : 'Contact Information'}
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone *
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
                        Email *
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
                  </div>

                  {formData.deliveryType === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 pt-4 border-t border-border"
                    >
                      <h3 className="font-semibold text-primary flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent" />
                        Delivery Address
                      </h3>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Street Address *</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                            errors.street ? 'border-red-500' : 'border-border'
                          } focus:border-accent outline-none transition`}
                          placeholder="123 Main Street"
                        />
                        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Apt / Suite (Optional)</label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-bg border-2 border-border focus:border-accent outline-none transition"
                          placeholder="Apt 4B"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">City *</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                              errors.city ? 'border-red-500' : 'border-border'
                            } focus:border-accent outline-none transition`}
                            placeholder="New York"
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">ZIP Code *</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                              errors.zipCode ? 'border-red-500' : 'border-border'
                            } focus:border-accent outline-none transition`}
                            placeholder="10001"
                          />
                          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Delivery Instructions</label>
                        <textarea
                          name="deliveryInstructions"
                          value={formData.deliveryInstructions}
                          onChange={handleChange}
                          rows="2"
                          className="w-full px-4 py-3 rounded-xl bg-bg border-2 border-border focus:border-accent outline-none transition resize-none"
                          placeholder="Ring doorbell, leave at door, etc..."
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                  <CreditCard className="w-6 h-6 text-accent" />
                  Payment Method
                </h2>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formData.paymentMethod === 'card'
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                      formData.paymentMethod === 'card' ? 'text-accent' : 'text-muted'
                    }`} />
                    <span className="font-semibold text-primary">Card</span>
                    <p className="text-xs text-muted">Pay on delivery</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formData.paymentMethod === 'cash'
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Banknote className={`w-8 h-8 mx-auto mb-2 ${
                      formData.paymentMethod === 'cash' ? 'text-accent' : 'text-muted'
                    }`} />
                    <span className="font-semibold text-primary">Cash</span>
                    <p className="text-xs text-muted">Pay on {formData.deliveryType}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'online' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formData.paymentMethod === 'online'
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <FileText className={`w-8 h-8 mx-auto mb-2 ${
                      formData.paymentMethod === 'online' ? 'text-accent' : 'text-muted'
                    }`} />
                    <span className="font-semibold text-primary">Online</span>
                    <p className="text-xs text-muted">Pay now (demo)</p>
                  </button>
                </div>

                {formData.paymentMethod === 'cash' && formData.deliveryType === 'delivery' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-sm font-semibold mb-2">Change For *</label>
                    <input
                      type="text"
                      name="changeFor"
                      value={formData.changeFor}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-bg border-2 ${
                        errors.changeFor ? 'border-red-500' : 'border-border'
                      } focus:border-accent outline-none transition`}
                      placeholder="$50.00"
                    />
                    {errors.changeFor && <p className="text-red-500 text-sm mt-1">{errors.changeFor}</p>}
                  </motion.div>
                )}

                {formData.paymentMethod === 'online' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-bg p-4 rounded-xl text-center"
                  >
                    <p className="text-muted">
                      This is a demo. No actual payment will be processed.
                    </p>
                  </motion.div>
                )}

                {/* Order Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold mb-2">Special Instructions (Optional)</label>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl bg-bg border-2 border-border focus:border-accent outline-none transition resize-none"
                    placeholder="Extra napkins, cutlery, etc..."
                  />
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  Review Your Order
                </h2>

                {/* Order Items */}
                <div className="bg-bg rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-primary mb-3">Items ({cart.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted">{item.quantity}x {item.name}</span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Summary */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-bg rounded-xl p-4">
                    <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                      {formData.deliveryType === 'delivery' ? <Truck className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                      {formData.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </h3>
                    {formData.deliveryType === 'delivery' ? (
                      <div className="text-sm text-muted">
                        <p>{formData.street} {formData.apartment && `, ${formData.apartment}`}</p>
                        <p>{formData.city}, {formData.zipCode}</p>
                        <p className="mt-2">Est. 30-45 min</p>
                      </div>
                    ) : (
                      <div className="text-sm text-muted">
                        <p>InnovaTech Restaurant</p>
                        <p>123 Restaurant Ave</p>
                        <p className="mt-2">{formData.pickupTime}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-bg rounded-xl p-4">
                    <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Contact
                    </h3>
                    <div className="text-sm text-muted">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.phone}</p>
                      <p>{formData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-bg rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  {formData.promoApplied && (
                    <div className="flex justify-between text-green-500">
                      <span>Promo Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-lg font-bold text-primary">Total</span>
                    <span className="text-xl font-bold text-accent">${grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted pt-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="capitalize">Pay with {formData.paymentMethod}</span>
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
            {currentStep === 1 ? 'Back to Menu' : 'Previous'}
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && cart.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition disabled:opacity-50 min-w-[160px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Place Order
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

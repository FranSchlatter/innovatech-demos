import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, ShoppingBag, CheckCircle, X } from 'lucide-react'

export default function OrderForm({ cart, onBack, onRemoveItem, onUpdateQuantity, onClearCart, total }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryTime: '',
    instructions: ''
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
    // In a real app, this would send the order to a backend
    setTimeout(() => {
      onClearCart()
    }, 3000)
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
            <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
            <p className="text-muted mb-2">
              Thank you, <span className="font-semibold text-text">{formData.name}</span>!
            </p>
            <p className="text-muted mb-6">
              Your order has been received and will be delivered to:
            </p>
            <div className="bg-bg p-4 rounded-lg mb-8 text-left">
              <p className="font-semibold mb-1">{formData.address}</p>
              <p className="text-sm text-muted">
                Expected delivery: {formData.deliveryTime || 'ASAP'}
              </p>
              <p className="text-sm text-muted mt-2">
                Total: <span className="font-bold text-primary text-lg">${total.toFixed(2)}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false)
                onBack()
              }}
              className="bg-primary text-primary-contrast px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
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
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
          <h1 className="text-3xl md:text-4xl font-bold">Your Order</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-surface rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingBag size={24} />
                  Cart Items ({cart.length})
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
                <div className="text-center py-12">
                  <p className="text-muted text-lg">Your cart is empty</p>
                  <button
                    onClick={onBack}
                    className="mt-4 text-primary hover:text-primary/80 font-semibold"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 bg-bg p-4 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{item.name}</h3>
                          <p className="text-sm text-muted mb-2">${item.price} each</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 bg-surface hover:bg-primary/10 rounded flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-surface hover:bg-primary/10 rounded flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-between">
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-accent hover:text-accent/80"
                          >
                            <Trash2 size={20} />
                          </button>
                          <p className="font-bold text-lg text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Delivery Form */}
            {cart.length > 0 && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-surface rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
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
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Preferred Delivery Time</label>
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors"
                  >
                    <option value="">ASAP (30-45 min)</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Special Instructions</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg bg-bg border-2 border-border focus:border-primary outline-none transition-colors resize-none"
                    placeholder="Extra spicy, no onions, etc..."
                  />
                </div>
              </motion.form>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="md:col-span-1">
              <div className="bg-surface rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Tax (10%)</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">${(total + 5 + (total * 0.1)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-accent hover:bg-accent/90 text-white px-6 py-4 rounded-lg font-bold transition-all shadow-lg text-lg"
                >
                  Place Order
                </button>
                <p className="text-xs text-muted text-center mt-4">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

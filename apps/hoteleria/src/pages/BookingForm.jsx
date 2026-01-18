import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Check } from 'lucide-react'

export default function BookingForm({ room, onBook }) {
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: ''
  })
  const [step, setStep] = useState(1)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!booking.checkIn || !booking.checkOut) {
      alert('Please select valid dates')
      return
    }
    if (!booking.name || !booking.email || !booking.phone) {
      alert('Please fill in all contact information')
      return
    }
    onBook(booking)
  }

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0
    const check = new Date(booking.checkIn)
    const checkout = new Date(booking.checkOut)
    return Math.ceil((checkout - check) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const total = nights > 0 ? nights * room.price : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Room Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-1"
        >
          <div className="bg-bg rounded-lg overflow-hidden shadow-soft sticky top-24">
            <img 
              src={room.image} 
              alt={room.name} 
              className="w-full h-48 object-cover" 
            />
            <div className="p-6">
              <h3 className="heading-sm text-primary mb-2">{room.name}</h3>
              <p className="text-muted text-sm mb-6 leading-relaxed">{room.description}</p>
              
              <div className="space-y-3 bg-surface p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Price per night:</span>
                  <span className="font-semibold text-primary">${room.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Number of nights:</span>
                  <span className="font-semibold text-primary">{nights || '-'}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-semibold text-primary">Total:</span>
                  <span className="text-2xl font-bold text-accent">${total}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>Free cancellation up to 48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>Best price guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-bg rounded-lg p-8 shadow-soft">
            {/* Step Indicator */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      s <= step
                        ? 'bg-accent text-bg'
                        : 'bg-surface text-muted'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-accent' : 'bg-surface'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Dates & Time */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl font-serif mb-6 text-primary">Select Your Dates & Time</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Check-In Date</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border">
                      <Calendar className="w-5 h-5 text-accent" />
                      <input
                        type="date"
                        value={booking.checkIn}
                        onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                        required
                        className="flex-1 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Check-Out Date</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border">
                      <Calendar className="w-5 h-5 text-accent" />
                      <input
                        type="date"
                        value={booking.checkOut}
                        onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
                        required
                        className="flex-1 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Check-In Time</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border">
                      <Calendar className="w-5 h-5 text-accent" />
                      <select
                        value={booking.checkInTime || '14:00'}
                        onChange={(e) => setBooking({ ...booking, checkInTime: e.target.value })}
                        className="flex-1 bg-transparent focus:outline-none"
                      >
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Number of Guests</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg border border-border">
                      <Users className="w-5 h-5 text-accent" />
                      <select
                        value={booking.guests}
                        onChange={(e) => setBooking({ ...booking, guests: parseInt(e.target.value) })}
                        className="flex-1 bg-transparent focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl font-serif mb-6 text-primary">Your Contact Information</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={booking.name}
                      onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:outline-none focus:border-accent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:outline-none focus:border-accent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={booking.phone}
                      onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:outline-none focus:border-accent transition"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl font-serif mb-6 text-primary">Confirm Your Reservation</h3>
                
                <div className="space-y-4 bg-surface p-6 rounded-lg mb-6">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted">Guest Name:</span>
                    <span className="font-semibold">{booking.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted">Email:</span>
                    <span className="font-semibold text-sm">{booking.email}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted">Phone:</span>
                    <span className="font-semibold">{booking.phone}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted">Check-In:</span>
                    <span className="font-semibold">{booking.checkIn} at {booking.checkInTime || '2:00 PM'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Check-Out:</span>
                    <span className="font-semibold">{booking.checkOut}</span>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent p-4 rounded-lg mb-6 text-sm">
                  <p className="text-text">
                    By clicking 'Confirm Reservation', you agree to our Terms & Conditions and Privacy Policy.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex-1"
                >
                  Back
                </motion.button>
              )}
              
              {step < 3 ? (
                <motion.button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && (!booking.checkIn || !booking.checkOut)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`btn-primary flex-1 ${step === 1 && (!booking.checkIn || !booking.checkOut) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Continue
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold flex-1"
                >
                  Confirm Reservation
                </motion.button>
              )}
            </div>

            <p className="text-xs text-muted text-center mt-4">
              ✓ Secure booking • ✓ Instant confirmation • ✓ 24/7 support
            </p>
          </div>
        </motion.form>
      </div>
    </motion.div>
  )
}

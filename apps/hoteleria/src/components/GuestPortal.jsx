import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Bed,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  Waves,
  Car,
  Wifi,
  Coffee,
  ShowerHead,
  Wrench,
  MessageSquare,
  ChevronRight,
  Star,
  Bell,
  LogOut,
  Home,
  Clipboard,
  Settings,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Minus,
  Send
} from 'lucide-react'

// Mock guest data - In production this would come from authentication/API
const MOCK_GUEST = {
  id: 'G-2024-001',
  name: 'Carlos Rodriguez',
  email: 'carlos.rodriguez@email.com',
  phone: '+1 555-123-4567',
  room: {
    number: '507',
    type: 'Deluxe Ocean View Suite',
    floor: 5,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'
  },
  reservation: {
    id: 'RES-2024-5678',
    checkIn: '2024-01-25',
    checkOut: '2024-01-30',
    nights: 5,
    guests: 2,
    status: 'checked-in',
    totalAmount: 1750.00,
    amountPaid: 875.00
  }
}

// Available services for guests
const ROOM_SERVICES = [
  { id: 'breakfast', name: 'Breakfast in Bed', icon: Coffee, price: 35, time: '30-45 min' },
  { id: 'lunch', name: 'Lunch Menu', icon: UtensilsCrossed, price: 45, time: '45-60 min' },
  { id: 'dinner', name: 'Dinner Menu', icon: UtensilsCrossed, price: 65, time: '45-60 min' },
  { id: 'minibar', name: 'Minibar Refill', icon: Coffee, price: 0, time: '15-20 min' }
]

const HOUSEKEEPING_SERVICES = [
  { id: 'cleaning', name: 'Room Cleaning', icon: Sparkles, price: 0, time: '30-45 min' },
  { id: 'turndown', name: 'Turndown Service', icon: Bed, price: 0, time: '15-20 min' },
  { id: 'towels', name: 'Fresh Towels', icon: ShowerHead, price: 0, time: '10-15 min' },
  { id: 'amenities', name: 'Toiletry Refill', icon: Sparkles, price: 0, time: '10-15 min' }
]

const AMENITY_RESERVATIONS = [
  { id: 'spa', name: 'Spa Treatment', icon: Sparkles, price: 120, duration: '60 min', available: ['10:00', '11:30', '14:00', '15:30', '17:00'] },
  { id: 'gym', name: 'Personal Training', icon: Dumbbell, price: 80, duration: '45 min', available: ['07:00', '09:00', '11:00', '16:00', '18:00'] },
  { id: 'pool', name: 'Poolside Cabana', icon: Waves, price: 50, duration: '4 hours', available: ['09:00', '13:00'] },
  { id: 'restaurant', name: 'Restaurant Table', icon: UtensilsCrossed, price: 0, duration: '2 hours', available: ['12:00', '13:00', '19:00', '20:00', '21:00'] },
  { id: 'transport', name: 'Airport Transfer', icon: Car, price: 75, duration: 'One-way', available: ['Any time'] }
]

// Tabs for the portal
const PORTAL_TABS = [
  { id: 'overview', name: 'My Stay', icon: Home },
  { id: 'services', name: 'Services', icon: Bell },
  { id: 'reservations', name: 'Reservations', icon: Calendar },
  { id: 'requests', name: 'My Requests', icon: Clipboard },
  { id: 'help', name: 'Help', icon: HelpCircle }
]

export default function GuestPortal({ onExit }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [guest] = useState(MOCK_GUEST)
  const [requests, setRequests] = useState([])
  const [showServiceModal, setShowServiceModal] = useState(null)
  const [showReservationModal, setShowReservationModal] = useState(null)
  const [serviceQuantity, setServiceQuantity] = useState(1)
  const [serviceNotes, setServiceNotes] = useState('')
  const [reservationDate, setReservationDate] = useState('')
  const [reservationTime, setReservationTime] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (message) => {
    setToastMessage(message)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const handleServiceRequest = (service, type) => {
    const newRequest = {
      id: `REQ-${Date.now()}`,
      type,
      service: service.name,
      quantity: serviceQuantity,
      notes: serviceNotes,
      status: 'pending',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      estimatedTime: service.time,
      price: service.price * serviceQuantity
    }
    setRequests([newRequest, ...requests])
    setShowServiceModal(null)
    setServiceQuantity(1)
    setServiceNotes('')
    showToast(`${service.name} requested successfully!`)
  }

  const handleAmenityReservation = (amenity) => {
    const newRequest = {
      id: `RES-${Date.now()}`,
      type: 'amenity',
      service: amenity.name,
      date: reservationDate,
      time: reservationTime,
      status: 'confirmed',
      duration: amenity.duration,
      price: amenity.price
    }
    setRequests([newRequest, ...requests])
    setShowReservationModal(null)
    setReservationDate('')
    setReservationTime('')
    showToast(`${amenity.name} reserved for ${reservationDate} at ${reservationTime}!`)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysRemaining = () => {
    const checkout = new Date(guest.reservation.checkOut)
    const today = new Date()
    const diff = Math.ceil((checkout - today) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Welcome, {guest.name.split(' ')[0]}</h1>
                <p className="text-sm text-muted">Room {guest.room.number} | {guest.room.type}</p>
              </div>
            </div>
            <button
              onClick={onExit}
              className="flex items-center gap-2 text-muted hover:text-primary transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Exit Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-surface border-b border-border overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {PORTAL_TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stay Summary Card */}
              <div className="bg-surface rounded-2xl overflow-hidden shadow-lg">
                <div className="relative h-48 md:h-64">
                  <img
                    src={guest.room.image}
                    alt={guest.room.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Checked In
                      </span>
                      <span className="text-sm opacity-80">Reservation #{guest.reservation.id}</span>
                    </div>
                    <h2 className="text-2xl font-bold">{guest.room.type}</h2>
                    <p className="text-sm opacity-80">Room {guest.room.number}, Floor {guest.room.floor}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-bg rounded-xl">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <p className="text-xs text-muted mb-1">Check-in</p>
                      <p className="font-semibold">{formatDate(guest.reservation.checkIn)}</p>
                    </div>
                    <div className="text-center p-4 bg-bg rounded-xl">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <p className="text-xs text-muted mb-1">Check-out</p>
                      <p className="font-semibold">{formatDate(guest.reservation.checkOut)}</p>
                    </div>
                    <div className="text-center p-4 bg-bg rounded-xl">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <p className="text-xs text-muted mb-1">Nights</p>
                      <p className="font-semibold">{guest.reservation.nights}</p>
                    </div>
                    <div className="text-center p-4 bg-bg rounded-xl">
                      <User className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <p className="text-xs text-muted mb-1">Guests</p>
                      <p className="font-semibold">{guest.reservation.guests}</p>
                    </div>
                  </div>

                  {/* Days Remaining Banner */}
                  <div className="mt-6 p-4 bg-accent/10 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Days remaining</p>
                      <p className="text-2xl font-bold text-accent">{getDaysRemaining()} days</p>
                    </div>
                    <button className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition">
                      Extend Stay
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: UtensilsCrossed, label: 'Room Service', action: () => setActiveTab('services') },
                  { icon: Sparkles, label: 'Housekeeping', action: () => setActiveTab('services') },
                  { icon: Calendar, label: 'Book Spa', action: () => setActiveTab('reservations') },
                  { icon: HelpCircle, label: 'Concierge', action: () => setActiveTab('help') }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={index}
                      onClick={item.action}
                      className="bg-surface p-6 rounded-xl hover:bg-surface/80 transition group"
                    >
                      <Icon className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition" />
                      <p className="font-semibold">{item.label}</p>
                    </button>
                  )
                })}
              </div>

              {/* Billing Summary */}
              <div className="bg-surface rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent" />
                  Billing Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Room charges ({guest.reservation.nights} nights)</span>
                    <span className="font-semibold">${guest.reservation.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Amount paid</span>
                    <span className="font-semibold text-green-500">-${guest.reservation.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-bold">Balance due</span>
                    <span className="font-bold text-accent">
                      ${(guest.reservation.totalAmount - guest.reservation.amountPaid).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Room Service */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-accent" />
                  Room Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ROOM_SERVICES.map((service) => {
                    const Icon = service.icon
                    return (
                      <button
                        key={service.id}
                        onClick={() => setShowServiceModal({ ...service, type: 'room-service' })}
                        className="bg-surface p-4 rounded-xl flex items-center gap-4 hover:bg-surface/80 transition text-left"
                      >
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-muted">{service.time}</p>
                        </div>
                        <div className="text-right">
                          {service.price > 0 ? (
                            <p className="font-bold text-accent">${service.price}</p>
                          ) : (
                            <p className="text-green-500 font-semibold">Free</p>
                          )}
                          <ChevronRight className="w-5 h-5 text-muted" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Housekeeping */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Housekeeping
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {HOUSEKEEPING_SERVICES.map((service) => {
                    const Icon = service.icon
                    return (
                      <button
                        key={service.id}
                        onClick={() => setShowServiceModal({ ...service, type: 'housekeeping' })}
                        className="bg-surface p-4 rounded-xl flex items-center gap-4 hover:bg-surface/80 transition text-left"
                      >
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-muted">{service.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-500 font-semibold">Included</p>
                          <ChevronRight className="w-5 h-5 text-muted" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Maintenance */}
              <div className="bg-surface rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-accent" />
                  Report an Issue
                </h2>
                <p className="text-muted mb-4">
                  Something not working? Let us know and we'll fix it right away.
                </p>
                <button
                  onClick={() => setShowServiceModal({ id: 'maintenance', name: 'Maintenance Request', icon: Wrench, price: 0, time: 'ASAP', type: 'maintenance' })}
                  className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition"
                >
                  Report Issue
                </button>
              </div>
            </motion.div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <motion.div
              key="reservations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Book Amenities & Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AMENITY_RESERVATIONS.map((amenity) => {
                  const Icon = amenity.icon
                  return (
                    <div
                      key={amenity.id}
                      className="bg-surface rounded-2xl overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                          <Icon className="w-7 h-7 text-accent" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{amenity.name}</h3>
                        <p className="text-sm text-muted mb-2">{amenity.duration}</p>
                        <div className="flex items-center justify-between">
                          {amenity.price > 0 ? (
                            <p className="text-2xl font-bold text-accent">${amenity.price}</p>
                          ) : (
                            <p className="text-lg font-semibold text-green-500">Free</p>
                          )}
                          <button
                            onClick={() => setShowReservationModal(amenity)}
                            className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* My Requests Tab */}
          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">My Requests & Reservations</h2>
              {requests.length === 0 ? (
                <div className="bg-surface rounded-2xl p-12 text-center">
                  <Clipboard className="w-16 h-16 mx-auto mb-4 text-muted" />
                  <h3 className="text-xl font-bold mb-2">No requests yet</h3>
                  <p className="text-muted mb-6">Your service requests and reservations will appear here.</p>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition"
                  >
                    Browse Services
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-surface rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        request.status === 'pending' ? 'bg-yellow-500/20' :
                        request.status === 'confirmed' ? 'bg-green-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {request.status === 'pending' ? (
                          <Clock className="w-6 h-6 text-yellow-500" />
                        ) : request.status === 'confirmed' ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{request.service}</h3>
                        <p className="text-sm text-muted">
                          {request.type === 'amenity'
                            ? `${request.date} at ${request.time}`
                            : `Requested at ${request.time}`
                          }
                        </p>
                        {request.notes && (
                          <p className="text-sm text-muted italic mt-1">"{request.notes}"</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          request.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        {request.price > 0 && (
                          <p className="font-bold text-accent mt-1">${request.price}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Help Tab */}
          {activeTab === 'help' && (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">How can we help?</h2>

              {/* Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="tel:+15551234567" className="bg-surface p-6 rounded-xl text-center hover:bg-surface/80 transition">
                  <Phone className="w-10 h-10 mx-auto mb-3 text-accent" />
                  <h3 className="font-bold mb-1">Call Front Desk</h3>
                  <p className="text-sm text-muted">Available 24/7</p>
                </a>
                <button className="bg-surface p-6 rounded-xl text-center hover:bg-surface/80 transition">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-accent" />
                  <h3 className="font-bold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted">Instant support</p>
                </button>
                <a href="mailto:concierge@hotelluxury.com" className="bg-surface p-6 rounded-xl text-center hover:bg-surface/80 transition">
                  <Mail className="w-10 h-10 mx-auto mb-3 text-accent" />
                  <h3 className="font-bold mb-1">Email Us</h3>
                  <p className="text-sm text-muted">We respond quickly</p>
                </a>
              </div>

              {/* FAQ */}
              <div className="bg-surface rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    { q: 'What are the check-out times?', a: 'Check-out is at 11:00 AM. Late check-out is available upon request.' },
                    { q: 'Is breakfast included?', a: 'Breakfast is included with select room packages. Check your reservation details.' },
                    { q: 'Where is the fitness center?', a: 'The fitness center is located on the 2nd floor, open 24/7 for guests.' },
                    { q: 'How do I connect to WiFi?', a: 'Connect to "Hotel_Luxury_Guest" and use your room number and last name to log in.' }
                  ].map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer p-3 bg-bg rounded-lg hover:bg-bg/80">
                        <span className="font-medium">{faq.q}</span>
                        <ChevronRight className="w-5 h-5 text-muted group-open:rotate-90 transition" />
                      </summary>
                      <p className="mt-2 px-3 text-muted">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Hotel Info */}
              <div className="bg-surface rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Hotel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Wifi className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">WiFi</p>
                      <p className="text-sm text-muted">Network: Hotel_Luxury_Guest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Restaurant Hours</p>
                      <p className="text-sm text-muted">6:30 AM - 10:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Waves className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Pool Hours</p>
                      <p className="text-sm text-muted">7:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Dumbbell className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Gym</p>
                      <p className="text-sm text-muted">24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Service Request Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowServiceModal(null)}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-surface rounded-2xl p-6 w-full max-w-md"
            >
              <button
                onClick={() => setShowServiceModal(null)}
                className="absolute top-4 right-4 text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold mb-4">{showServiceModal.name}</h3>

              {showServiceModal.type === 'room-service' && (
                <div className="mb-4">
                  <label className="text-sm text-muted mb-2 block">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setServiceQuantity(Math.max(1, serviceQuantity - 1))}
                      className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{serviceQuantity}</span>
                    <button
                      onClick={() => setServiceQuantity(serviceQuantity + 1)}
                      className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="text-sm text-muted mb-2 block">Special Instructions</label>
                <textarea
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder="Any special requests?"
                  rows={3}
                  className="w-full px-4 py-3 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-muted">Estimated time:</span>
                <span className="font-semibold">{showServiceModal.time}</span>
              </div>

              {showServiceModal.price > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted">Total:</span>
                  <span className="text-xl font-bold text-accent">
                    ${(showServiceModal.price * serviceQuantity).toFixed(2)}
                  </span>
                </div>
              )}

              <button
                onClick={() => handleServiceRequest(showServiceModal, showServiceModal.type)}
                className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Request
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reservation Modal */}
      <AnimatePresence>
        {showReservationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReservationModal(null)}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-surface rounded-2xl p-6 w-full max-w-md"
            >
              <button
                onClick={() => setShowReservationModal(null)}
                className="absolute top-4 right-4 text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold mb-4">Book {showReservationModal.name}</h3>

              <div className="mb-4">
                <label className="text-sm text-muted mb-2 block">Select Date</label>
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={guest.reservation.checkOut}
                  className="w-full px-4 py-3 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted mb-2 block">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {showReservationModal.available.map((time) => (
                    <button
                      key={time}
                      onClick={() => setReservationTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                        reservationTime === time
                          ? 'bg-accent text-white'
                          : 'bg-bg hover:bg-accent/10'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-muted">Duration:</span>
                <span className="font-semibold">{showReservationModal.duration}</span>
              </div>

              {showReservationModal.price > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted">Price:</span>
                  <span className="text-xl font-bold text-accent">${showReservationModal.price}</span>
                </div>
              )}

              <button
                onClick={() => handleAmenityReservation(showReservationModal)}
                disabled={!reservationDate || !reservationTime}
                className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Confirm Reservation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

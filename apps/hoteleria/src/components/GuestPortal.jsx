import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginScreen from './LoginScreen'
import GuestChat from './GuestChat'
import DiningHub from './client/restaurant/DiningHub'
import ExcursionBookingForm from '../pages/ExcursionBookingForm'
import { useLiveChat, peekLiveChat } from '../hooks/useLiveChat'
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
  Send,
  Headset,
  ChefHat,
  Compass,
  BellRing,
  CalendarCheck
} from 'lucide-react'

// Mock guest data - In production this would come from authentication/API
// Build a YYYY-MM-DD string relative to today so the mock stay always stays current
const toISODate = (offsetDays) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().split('T')[0]
}

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
    checkIn: toISODate(-2),   // checked in 2 days ago
    checkOut: toISODate(3),   // checks out in 3 days -> 5-night stay, currently staying
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
  {
    id: 'spa',
    name: 'Spa Treatment',
    icon: Sparkles,
    price: 120,
    duration: '60 min',
    available: ['10:00', '11:30', '14:00', '15:30', '17:00'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
    description: 'Relax and rejuvenate with our signature spa treatments including massage, facial, and aromatherapy.'
  },
  {
    id: 'gym',
    name: 'Personal Training',
    icon: Dumbbell,
    price: 80,
    duration: '45 min',
    available: ['07:00', '09:00', '11:00', '16:00', '18:00'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    description: 'One-on-one session with certified fitness trainers. Customized workout plans for your goals.'
  },
  {
    id: 'pool',
    name: 'Poolside Cabana',
    icon: Waves,
    price: 50,
    duration: '4 hours',
    available: ['09:00', '13:00'],
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=600&fit=crop',
    description: 'Private cabana with lounge chairs, towel service, and waiter service. Perfect for relaxing by the pool.'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Table',
    icon: UtensilsCrossed,
    price: 0,
    duration: '2 hours',
    available: ['12:00', '13:00', '19:00', '20:00', '21:00'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    description: 'Reserve your table at our award-winning restaurant. Enjoy fine dining with ocean views.'
  },
  {
    id: 'transport',
    name: 'Airport Transfer',
    icon: Car,
    price: 75,
    duration: 'One-way',
    available: ['Any time'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    description: 'Luxury vehicle transfer to/from airport. Professional drivers, complimentary water and WiFi.'
  }
]

// Tabs for the portal
const PORTAL_TABS = [
  { id: 'overview', name: 'My Stay', icon: Home },
  { id: 'services', name: 'Services', icon: Bell },
  { id: 'reservations', name: 'Reservations', icon: Calendar },
  { id: 'help', name: 'Help', icon: HelpCircle }
]

const REQUESTS_STORAGE_KEY = 'hotel-luxury-guest-requests'

export default function GuestPortal({ onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [guest] = useState(MOCK_GUEST)
  const [requests, setRequests] = useState(() => {
    try {
      const stored = localStorage.getItem(REQUESTS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [showServiceModal, setShowServiceModal] = useState(null)
  const [showReservationModal, setShowReservationModal] = useState(null)
  const [serviceQuantity, setServiceQuantity] = useState(1)
  const [serviceNotes, setServiceNotes] = useState('')
  const [reservationDate, setReservationDate] = useState('')
  const [reservationTime, setReservationTime] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showDining, setShowDining] = useState(false)
  const [showExcursions, setShowExcursions] = useState(false)

  // Live chat (H5) — shared with the admin inbox via useLiveChat.
  const liveChat = useLiveChat()
  const [showChat, setShowChat] = useState(false)
  const [chatDraft, setChatDraft] = useState('')
  const [chatSeenCount, setChatSeenCount] = useState(0)
  const autoReplyRef = useRef(null)

  const AUTO_REPLY_DELAY = 5000
  const AUTO_REPLY_TEXT = 'Gracias por tu mensaje. Un agente del hotel se sumará a la conversación en breve. 🛎️'

  // Register the guest identity so the admin inbox can label the conversation.
  useEffect(() => {
    liveChat.setGuest({
      name: guest.name,
      room: guest.room.number,
      reservation: guest.reservation.id
    })
  }, [guest, liveChat])

  // Track which messages the guest has already seen (to badge the launcher).
  useEffect(() => {
    if (showChat) setChatSeenCount(liveChat.messages.length)
  }, [showChat, liveChat.messages.length])

  // Clean up the pending auto-reply timer on unmount.
  useEffect(() => () => { if (autoReplyRef.current) clearTimeout(autoReplyRef.current) }, [])

  const chatUnread = showChat
    ? 0
    : liveChat.messages.slice(chatSeenCount).filter((m) => m.from !== 'guest').length

  const handleSendChat = () => {
    const text = chatDraft.trim()
    if (!text) return
    liveChat.sendMessage(text, 'guest')
    setChatDraft('')
    // Simulated auto-reply if staff doesn't answer within the delay.
    if (autoReplyRef.current) clearTimeout(autoReplyRef.current)
    autoReplyRef.current = setTimeout(() => {
      const msgs = peekLiveChat().messages
      if (msgs.length && msgs[msgs.length - 1].from === 'guest') {
        liveChat.sendMessage(AUTO_REPLY_TEXT, 'ai')
      }
    }, AUTO_REPLY_DELAY)
  }

  // Persist all portal requests (service requests + amenity reservations)
  useEffect(() => {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests))
    } catch {
      // Ignore storage errors (e.g. private mode)
    }
  }, [requests])

  const handleLogout = () => {
    setIsAuthenticated(false)
    setActiveTab('overview')
  }

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
      price: service.price * serviceQuantity,
      canCancel: true
    }
    setRequests([newRequest, ...requests])
    setShowServiceModal(null)
    setServiceQuantity(1)
    setServiceNotes('')
    showToast(`${service.name} requested successfully!`)
  }

  const handleCancelRequest = (requestId) => {
    setRequests(requests.filter(req => req.id !== requestId))
    showToast('Request cancelled successfully')
  }

  // Restaurant order (H7) → shows up as an active request in "My Stay".
  const handleOrderPlaced = (order) => {
    const summary = order.items.map((l) => `${l.qty}× ${l.name}`).join(', ')
    const dineIn = order.serviceType === 'table'
    const venue = order.venue || 'Room Service'
    const newRequest = {
      id: `ORD-${order.number}`,
      type: 'restaurant',
      service: dineIn ? `${venue} · Order #${order.number}` : `Room Service · Order #${order.number}`,
      summary,
      notes: order.notes,
      status: 'pending',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      estimatedTime: order.eta,
      price: order.total,
      canCancel: true
    }
    setRequests((prev) => [newRequest, ...prev])
    showToast(`Order #${order.number} sent to ${dineIn ? venue : 'the kitchen'}!`)
  }

  // Dine-in table reservation (H7).
  const handleReserveTable = (booking) => {
    const newRequest = {
      id: `DIN-${Date.now()}`,
      type: 'dining',
      service: `${booking.venue} · Table for ${booking.party}`,
      date: booking.date,
      time: booking.time,
      notes: booking.requests,
      status: 'confirmed',
      canCancel: true
    }
    setRequests((prev) => [newRequest, ...prev])
    showToast(`Table booked at ${booking.venue}!`)
  }

  // Waiter call (H7) — an immediate, non-cancellable request.
  const handleCallWaiter = ({ venue }) => {
    const newRequest = {
      id: `WTR-${Date.now()}`,
      type: 'waiter',
      service: `Waiter requested · ${venue}`,
      status: 'pending',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      estimatedTime: 'A few minutes',
      canCancel: false
    }
    setRequests((prev) => [newRequest, ...prev])
  }

  // Excursion booked from the portal → active request in "My Stay".
  const handleExcursionBooked = (booking) => {
    const newRequest = {
      id: `EXC-${Date.now()}`,
      type: 'excursion',
      service: `${booking.name}`,
      date: booking.date,
      time: booking.schedule,
      notes: booking.specialRequests,
      status: 'confirmed',
      price: booking.total,
      guestsCount: booking.numberOfPeople,
      canCancel: true
    }
    setRequests((prev) => [newRequest, ...prev])
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
      price: amenity.price,
      canCancel: true,
      image: amenity.image
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

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-bg"
    >
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
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-muted hover:text-primary transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
              <button
                onClick={onExit}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-border text-muted hover:text-primary hover:border-accent transition"
              >
                <span className="hidden sm:inline">Exit Portal</span>
                <X className="w-4 h-4 sm:hidden" />
              </button>
            </div>
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
              className="max-w-4xl mx-auto"
            >
              {/* Main Stay Card */}
              <div className="bg-surface rounded-3xl overflow-hidden shadow-soft">
                {/* Image Header */}
                <div className="relative h-48 md:h-56">
                  <img
                    src={guest.room.image}
                    alt={guest.room.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30">
                      Active Stay
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{guest.room.type}</h2>
                    <p className="text-white/90 text-sm">Room {guest.room.number} · Floor {guest.room.floor}</p>
                  </div>
                </div>

                {/* Compact Info Grid */}
                <div className="p-5 md:p-6 space-y-5">
                  {/* Timeline */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-sm font-medium">Stay Timeline</span>
                      </div>
                      <span className="text-xs text-muted">{getDaysRemaining()} days remaining</span>
                    </div>
                    <div className="relative">
                      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(guest.reservation.nights - getDaysRemaining()) / guest.reservation.nights * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-muted">{formatDate(guest.reservation.checkIn)}</span>
                        <span className="text-muted">{formatDate(guest.reservation.checkOut)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-bg rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-muted">Nights</span>
                      </div>
                      <p className="text-lg font-bold">{guest.reservation.nights}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-muted">Guests</span>
                      </div>
                      <p className="text-lg font-bold">{guest.reservation.guests}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-muted">Balance</span>
                      </div>
                      <p className="text-lg font-bold text-accent">
                        ${(guest.reservation.totalAmount - guest.reservation.amountPaid).toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions - Compact */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                    {[
                      { icon: UtensilsCrossed, label: 'Dining', action: () => setShowDining(true) },
                      { icon: Sparkles, label: 'Service', action: () => setActiveTab('services') },
                      { icon: Calendar, label: 'Book', action: () => setActiveTab('reservations') },
                      { icon: HelpCircle, label: 'Help', action: () => setActiveTab('help') }
                    ].map((item, index) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={index}
                          onClick={item.action}
                          className="flex items-center gap-2 p-3 rounded-lg bg-bg hover:bg-accent/10 transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">{item.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Billing Details */}
              <div className="mt-4 bg-surface rounded-2xl p-5 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-accent" />
                    Billing
                  </h3>
                  <span className="text-xs text-muted">Res. #{guest.reservation.id}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Room ({guest.reservation.nights} nights)</span>
                    <span className="font-medium">${guest.reservation.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Paid</span>
                    <span className="font-medium text-accent">-${guest.reservation.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="font-bold">Due at checkout</span>
                    <span className="text-xl font-bold text-accent">
                      ${(guest.reservation.totalAmount - guest.reservation.amountPaid).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Requests (only shown when there are requests) */}
              {requests.length > 0 && (
                <div className="mt-4 bg-surface rounded-2xl p-5 shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Clipboard className="w-4 h-4 text-accent" />
                      Active Requests
                    </h3>
                    <span className="text-xs text-muted">{requests.length} active</span>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {requests.map((request) => (
                        <motion.div
                          key={request.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-3 bg-bg rounded-xl p-3"
                        >
                          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            {(() => {
                              const iconByType = {
                                restaurant: UtensilsCrossed,
                                dining: CalendarCheck,
                                waiter: BellRing,
                                excursion: Compass,
                                amenity: Calendar
                              }
                              const Icon = iconByType[request.type] ||
                                (request.status === 'pending' ? Clock : request.status === 'confirmed' ? CheckCircle : AlertCircle)
                              return <Icon className="w-4 h-4 text-accent" />
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm truncate">{request.service}</h4>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent capitalize flex-shrink-0">
                                {request.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                              {['amenity', 'dining', 'excursion'].includes(request.type) ? (
                                <>
                                  <Calendar className="w-3 h-3" />
                                  {request.date} · {request.time}
                                  {request.guestsCount ? ` · ${request.guestsCount} guests` : ''}
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  {request.date} {request.time} · ETA {request.estimatedTime}
                                </>
                              )}
                            </p>
                            {request.summary && (
                              <p className="text-xs text-muted mt-0.5 truncate">{request.summary}</p>
                            )}
                          </div>
                          {request.price > 0 && (
                            <span className="text-sm font-bold text-accent whitespace-nowrap">${request.price}</span>
                          )}
                          {request.canCancel && (
                            <button
                              onClick={() => handleCancelRequest(request.id)}
                              className="text-muted hover:text-primary transition flex-shrink-0"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
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
              {/* Dining — restaurants, room service, table booking (H7) */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-accent" />
                  Dining
                </h2>
                <div className="relative overflow-hidden rounded-2xl shadow-soft">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=500&fit=crop"
                    alt="Hotel restaurants"
                    className="w-full h-48 md:h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-center max-w-md">
                    <h3 className="text-2xl font-bold text-white mb-1">4 restaurants & room service</h3>
                    <p className="text-white/85 text-sm mb-4">
                      Book a table, order to your room or to your table, and call the waiter —
                      all from here.
                    </p>
                    <button
                      onClick={() => setShowDining(true)}
                      className="self-start inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-accent/90 transition"
                    >
                      <UtensilsCrossed className="w-5 h-5" />
                      Explore dining
                    </button>
                  </div>
                </div>
              </div>

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
                            <p className="text-accent font-semibold">Free</p>
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
                          <p className="text-accent font-semibold">Included</p>
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
              <div>
                <h2 className="text-2xl font-bold mb-2">Book Amenities & Activities</h2>
                <p className="text-muted">Enhance your stay with our premium services</p>
              </div>

              {/* Excursions & Tours (H3) */}
              <div className="relative overflow-hidden rounded-2xl shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=500&fit=crop"
                  alt="Excursions & tours"
                  className="w-full h-44 md:h-52 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-center max-w-md">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                    <Compass className="w-4 h-4" /> Excursions & Tours
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Discover the destination</h3>
                  <p className="text-white/85 text-sm mb-4">
                    City tours, Everglades airboats, sunset cruises and more — booked to your room.
                  </p>
                  <button
                    onClick={() => setShowExcursions(true)}
                    className="self-start inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-accent/90 transition"
                  >
                    <Compass className="w-5 h-5" />
                    Browse excursions
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {AMENITY_RESERVATIONS.map((amenity, idx) => {
                  const Icon = amenity.icon
                  return (
                    <motion.div
                      key={amenity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-surface rounded-2xl overflow-hidden shadow-soft hover:shadow-lg transition-all group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={amenity.image}
                          alt={amenity.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1">{amenity.name}</h3>
                          <p className="text-white/80 text-sm">{amenity.duration}</p>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-sm text-muted mb-4 line-clamp-2">{amenity.description}</p>

                        <div className="flex items-center justify-between">
                          <div>
                            {amenity.price > 0 ? (
                              <p className="text-2xl font-bold text-accent">${amenity.price}</p>
                            ) : (
                              <p className="text-lg font-semibold text-accent">Complimentary</p>
                            )}
                            <p className="text-xs text-muted">{amenity.available.length} slots available</p>
                          </div>
                          <button
                            onClick={() => setShowReservationModal(amenity)}
                            className="bg-accent text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-accent/90 transition hover:scale-105"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
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
                <button
                  onClick={() => setShowChat(true)}
                  className="bg-surface p-6 rounded-xl text-center hover:bg-surface/80 transition"
                >
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
            className="fixed bottom-4 right-4 bg-accent text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating live-chat launcher (H5) */}
      <AnimatePresence>
        {!showChat && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowChat(true)}
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-accent text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-accent/90 transition"
            title="Chatear con recepción"
          >
            <span className="relative">
              <Headset className="w-5 h-5" />
              {chatUnread > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">
                  {chatUnread}
                </span>
              )}
            </span>
            <span className="text-sm font-semibold hidden sm:inline">Chat en vivo</span>
          </motion.button>
        )}
      </AnimatePresence>

      <GuestChat
        open={showChat}
        onClose={() => setShowChat(false)}
        guestName={guest.name}
        messages={liveChat.messages}
        draft={chatDraft}
        setDraft={setChatDraft}
        onSend={handleSendChat}
      />

      {/* Dining — restaurants, room service, table booking, waiter (H7) */}
      <DiningHub
        open={showDining}
        onClose={() => setShowDining(false)}
        room={guest.room.number}
        guestName={guest.name}
        guestPhone={guest.phone}
        onOrderPlaced={handleOrderPlaced}
        onReserveTable={handleReserveTable}
        onCallWaiter={handleCallWaiter}
      />

      {/* Excursion booking (H3) — reuses the landing form inside the portal */}
      <AnimatePresence>
        {showExcursions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setShowExcursions(false) }}
          >
            <div className="w-full max-w-4xl my-8">
              <ExcursionBookingForm
                onClose={() => setShowExcursions(false)}
                onBooked={handleExcursionBooked}
                guestName={guest.name}
                roomNumber={guest.room.number}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

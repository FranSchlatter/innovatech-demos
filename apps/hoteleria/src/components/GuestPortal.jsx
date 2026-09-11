import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginScreen from './LoginScreen'
import GuestChat from './GuestChat'
import DiningHub from './client/restaurant/DiningHub'
import ExcursionBookingForm, { EXCURSIONS } from '../pages/ExcursionBookingForm'
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
  CalendarCheck,
  Users,
  Music,
  Leaf,
  Presentation,
  Bike,
  Trophy,
  Wine,
  Hash,
  Tag,
  StickyNote
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
    location: 'Wellness Center · Floor 2',
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
    location: 'Fitness Center · Floor 2',
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
    location: 'Rooftop Pool · Floor 8',
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
    location: 'Main Restaurant · Ground Floor',
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
    location: 'Hotel Lobby · Pickup point',
    icon: Car,
    price: 75,
    duration: 'One-way',
    available: ['Any time'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    description: 'Luxury vehicle transfer to/from airport. Professional drivers, complimentary water and WiFi.'
  },
  {
    id: 'yoga',
    name: 'Yoga Session',
    location: 'Garden Terrace · Floor 3',
    icon: Leaf,
    price: 0,
    duration: '45 min',
    available: ['07:30', '09:00', '17:30'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    description: 'Guided sunrise or sunset yoga with our in-house instructor. Mats and towels provided.'
  },
  {
    id: 'dance-class',
    name: 'Dance Class',
    location: 'Ballroom · Floor 1',
    icon: Music,
    price: 0,
    duration: '60 min',
    available: ['18:00', '20:00'],
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop',
    description: 'Learn salsa, tango or bachata with our resident dancers. All levels welcome, no partner needed.'
  },
  {
    id: 'meeting-room',
    name: 'Meeting Room',
    location: 'Business Center · Floor 1',
    icon: Presentation,
    price: 0,
    duration: '2 hours',
    available: ['08:00', '10:00', '14:00', '16:00'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    description: 'Private meeting room with screen, whiteboard and coffee service. Complimentary for guests.'
  },
  {
    id: 'bikes',
    name: 'Bike Rental',
    location: 'Concierge Desk · Lobby',
    icon: Bike,
    price: 0,
    duration: 'Half day',
    available: ['Any time'],
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop',
    description: 'Explore the coast on one of our complimentary city bikes. Helmet and map included.'
  },
  {
    id: 'tennis',
    name: 'Tennis Court',
    location: 'Sports Area · Ground Floor',
    icon: Trophy,
    price: 30,
    duration: '1 hour',
    available: ['08:00', '10:00', '16:00', '18:00'],
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop',
    description: 'Book our floodlit court. Rackets and balls available at reception at no extra cost.'
  },
  {
    id: 'wine',
    name: 'Wine Tasting',
    location: 'Wine Cellar · Basement',
    icon: Wine,
    price: 45,
    duration: '90 min',
    available: ['18:00', '19:30'],
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
    description: 'Guided tasting of regional wines with our sommelier, paired with artisanal cheeses.'
  }
]

// Tabs for the portal. Excursions & amenity reservations were merged into the
// "Services" tab (see SERVICE_SECTIONS) so everything bookable lives in one place.
const PORTAL_TABS = [
  { id: 'overview', name: 'My Stay', icon: Home },
  { id: 'services', name: 'Services', icon: Bell },
  { id: 'help', name: 'Help', icon: HelpCircle }
]

// Internal sub-navigation for the Services tab (H12). Four clear categories,
// each with an icon and a short description shown above its content.
const SERVICE_SECTIONS = [
  {
    id: 'room-service',
    name: 'Room Service',
    icon: BellRing,
    description: 'Food, housekeeping and maintenance delivered straight to your room.'
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: ChefHat,
    description: 'Book a table, order in, or call the waiter across our 4 venues.'
  },
  {
    id: 'excursions',
    name: 'Excursions',
    icon: Compass,
    description: 'Guided tours and adventures around the destination, booked to your room.'
  },
  {
    id: 'amenities',
    name: 'Amenities',
    icon: Sparkles,
    description: 'Reserve the spa, pool cabanas, personal training and transfers.'
  }
]

const REQUESTS_STORAGE_KEY = 'hotel-luxury-guest-requests'

// Short cancellation copy shown in the booking & request-detail modals.
// Paid experiences carry a late-cancellation fee; complimentary ones just ask
// guests to free up the slot if they can't make it.
const cancellationCopy = (price) =>
  price > 0
    ? 'Free cancellation up to 24h before. Later cancellations or no-shows are charged 50% of the price.'
    : 'Complimentary — no charge. Please cancel if you can\'t attend so another guest can take the slot.'

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
  const [showRequestDetail, setShowRequestDetail] = useState(null)
  const [serviceQuantity, setServiceQuantity] = useState(1)
  const [serviceNotes, setServiceNotes] = useState('')
  const [reservationDate, setReservationDate] = useState('')
  const [reservationTime, setReservationTime] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showDining, setShowDining] = useState(false)
  const [showExcursions, setShowExcursions] = useState(false)
  const [excursionPreselect, setExcursionPreselect] = useState(null)
  const [servicesSection, setServicesSection] = useState('room-service')

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

  // Jump to the Services tab and open a specific sub-section (used by the
  // overview quick actions and the "My Stay" shortcuts).
  const goToServices = (section = 'room-service') => {
    setServicesSection(section)
    setActiveTab('services')
  }

  // Open the excursion booking flow, optionally preselecting one excursion.
  const openExcursion = (id = null) => {
    setExcursionPreselect(id)
    setShowExcursions(true)
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
      location: amenity.location,
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

  // Bookable days for amenities: from today through checkout (inclusive).
  // Powers the custom date chips so we never fall back to the native picker.
  const getStayDates = () => {
    const dates = []
    const cursor = new Date()
    cursor.setHours(0, 0, 0, 0)
    const end = new Date(guest.reservation.checkOut)
    end.setHours(0, 0, 0, 0)
    while (cursor <= end) {
      dates.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    return dates
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
                      { icon: Bell, label: 'Room Service', action: () => goToServices('room-service') },
                      { icon: Compass, label: 'Excursions', action: () => goToServices('excursions') },
                      { icon: Sparkles, label: 'Amenities', action: () => goToServices('amenities') }
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
                          onClick={() => setShowRequestDetail(request)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') setShowRequestDetail(request) }}
                          className="flex items-center gap-3 bg-bg rounded-xl p-3 cursor-pointer border border-transparent hover:border-accent transition"
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
                          <ChevronRight className="w-4 h-4 text-muted flex-shrink-0" />
                          {request.canCancel && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancelRequest(request.id) }}
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

          {/* Services Tab — 4 clear categories via internal sub-navigation (H12) */}
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Section switcher */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {SERVICE_SECTIONS.map((section) => {
                  const Icon = section.icon
                  const active = servicesSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => setServicesSection(section.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-semibold border transition ${
                        active
                          ? 'bg-accent text-white border-accent shadow-soft'
                          : 'bg-surface text-muted border-border hover:text-primary hover:border-accent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.name}
                    </button>
                  )
                })}
              </div>

              {/* Active section header (icon + description) */}
              {(() => {
                const current = SERVICE_SECTIONS.find((s) => s.id === servicesSection)
                if (!current) return null
                const Icon = current.icon
                return (
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold leading-tight">{current.name}</h2>
                      <p className="text-sm text-muted">{current.description}</p>
                    </div>
                  </div>
                )
              })()}

              <AnimatePresence mode="wait">
                {/* 1. Room Service — food, housekeeping & maintenance to your room */}
                {servicesSection === 'room-service' && (
                  <motion.div
                    key="svc-room-service"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="space-y-8"
                  >
                    {/* In-room dining */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UtensilsCrossed className="w-5 h-5 text-accent" />
                        In-Room Dining
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ROOM_SERVICES.map((service) => {
                          const Icon = service.icon
                          return (
                            <button
                              key={service.id}
                              onClick={() => setShowServiceModal({ ...service, type: 'room-service' })}
                              className="bg-surface p-4 rounded-xl flex items-center gap-4 border border-border hover:border-accent transition text-left"
                            >
                              <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate">{service.name}</h4>
                                <p className="text-sm text-muted">{service.time}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                {service.price > 0 ? (
                                  <p className="font-bold text-accent">${service.price}</p>
                                ) : (
                                  <p className="text-accent font-semibold">Free</p>
                                )}
                                <ChevronRight className="w-5 h-5 text-muted ml-auto" />
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Housekeeping */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent" />
                        Housekeeping
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {HOUSEKEEPING_SERVICES.map((service) => {
                          const Icon = service.icon
                          return (
                            <button
                              key={service.id}
                              onClick={() => setShowServiceModal({ ...service, type: 'housekeeping' })}
                              className="bg-surface p-4 rounded-xl flex items-center gap-4 border border-border hover:border-accent transition text-left"
                            >
                              <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate">{service.name}</h4>
                                <p className="text-sm text-muted">{service.time}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-accent font-semibold">Included</p>
                                <ChevronRight className="w-5 h-5 text-muted ml-auto" />
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Maintenance */}
                    <div className="bg-surface border border-border rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-accent" />
                        Report an Issue
                      </h3>
                      <p className="text-muted mb-4">
                        Something not working? Let us know and we'll fix it right away.
                      </p>
                      <button
                        onClick={() => setShowServiceModal({ id: 'maintenance', name: 'Maintenance Request', icon: Wrench, price: 0, time: 'ASAP', type: 'maintenance' })}
                        className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
                      >
                        Report Issue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. Restaurant — DiningHub from H7 */}
                {servicesSection === 'restaurant' && (
                  <motion.div
                    key="svc-restaurant"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="relative overflow-hidden rounded-2xl shadow-soft"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=500&fit=crop"
                      alt="Hotel restaurants"
                      className="w-full h-56 md:h-64 object-cover"
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
                        className="self-start inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
                      >
                        <UtensilsCrossed className="w-5 h-5" />
                        Explore dining
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 3. Excursions — preview cards that deep-link into the booking form */}
                {servicesSection === 'excursions' && (
                  <motion.div
                    key="svc-excursions"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {EXCURSIONS.map((excursion, idx) => {
                        const Icon = excursion.icon
                        return (
                          <motion.button
                            key={excursion.id}
                            type="button"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            whileHover={{ y: -4 }}
                            onClick={() => openExcursion(excursion.id)}
                            className="text-left bg-surface rounded-2xl overflow-hidden border border-border hover:border-accent shadow-soft hover:shadow-lg transition-all group"
                          >
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={excursion.image}
                                alt={excursion.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <span className="absolute top-3 right-3 bg-accent text-white text-sm font-bold px-3 py-1 rounded-lg">
                                ${excursion.price}
                              </span>
                              <div className="absolute bottom-3 left-3 w-10 h-10 bg-surface rounded-xl flex items-center justify-center">
                                <Icon className="w-5 h-5 text-accent" />
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold group-hover:text-accent transition-colors">{excursion.name}</h4>
                              <p className="text-xs text-muted line-clamp-2 mt-1 mb-3">{excursion.description}</p>
                              <div className="flex items-center gap-3 text-xs text-muted">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {excursion.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Max {excursion.maxCapacity}
                                </span>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => openExcursion(null)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
                    >
                      <Compass className="w-5 h-5" />
                      Browse all excursions
                    </button>
                  </motion.div>
                )}

                {/* 4. Amenities — reservable facilities (spa, pool, gym, transfers) */}
                {servicesSection === 'amenities' && (
                  <motion.div
                    key="svc-amenities"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  >
                    {AMENITY_RESERVATIONS.map((amenity, idx) => {
                      const Icon = amenity.icon
                      const isFree = amenity.price === 0
                      return (
                        <motion.div
                          key={amenity.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="bg-surface rounded-xl overflow-hidden border border-border shadow-soft hover:shadow-lg hover:border-accent transition-all group flex flex-col"
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img
                              src={amenity.image}
                              alt={amenity.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute top-2 left-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-accent" />
                            </div>
                            <span className="absolute top-2 right-2 text-[11px] font-bold px-2 py-0.5 rounded-md bg-accent text-white">
                              {isFree ? 'Free' : `$${amenity.price}`}
                            </span>
                            <h3 className="absolute bottom-2 left-2 right-2 text-sm font-bold text-white leading-tight line-clamp-1">
                              {amenity.name}
                            </h3>
                          </div>

                          <div className="p-3 flex flex-col gap-2 flex-1">
                            <div className="flex items-center justify-between text-[11px] text-muted">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {amenity.duration}
                              </span>
                              <span>{amenity.available.length} slots</span>
                            </div>
                            <button
                              onClick={() => setShowReservationModal(amenity)}
                              className="mt-auto w-full bg-accent text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                            >
                              Book
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
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

              <h3 className="text-xl font-bold mb-1 pr-8">Book {showReservationModal.name}</h3>
              {showReservationModal.location && (
                <p className="flex items-center gap-1.5 text-sm text-muted mb-3">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                  {showReservationModal.location}
                </p>
              )}
              {showReservationModal.description && (
                <p className="text-sm text-muted leading-relaxed mb-5">{showReservationModal.description}</p>
              )}

              <div className="mb-4">
                <label className="text-sm text-muted mb-2 block">Select Date</label>
                <div className="grid grid-cols-4 gap-2">
                  {getStayDates().map((d) => {
                    const iso = d.toISOString().split('T')[0]
                    const selected = reservationDate === iso
                    return (
                      <button
                        key={iso}
                        onClick={() => setReservationDate(iso)}
                        className={`flex flex-col items-center py-2.5 rounded-lg border transition ${
                          selected
                            ? 'bg-accent text-white border-accent'
                            : 'bg-bg border-border hover:border-accent'
                        }`}
                      >
                        <span className={`text-[11px] uppercase tracking-wide ${selected ? 'text-white/80' : 'text-muted'}`}>
                          {d.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-lg font-bold leading-tight">{d.getDate()}</span>
                        <span className={`text-[11px] ${selected ? 'text-white/80' : 'text-muted'}`}>
                          {d.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </button>
                    )
                  })}
                </div>
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

              {/* Cancellation policy — fee for paid experiences, no-show note for free ones */}
              <div className="flex items-start gap-2 text-xs text-muted bg-bg rounded-lg p-3 mb-4">
                <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{cancellationCopy(showReservationModal.price)}</span>
              </div>

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

      {/* Request Detail Modal — quick expandable view of an active request (H12) */}
      <AnimatePresence>
        {showRequestDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestDetail(null)}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog"
              aria-modal="true"
              className="relative bg-surface rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowRequestDetail(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Optional hero image (amenity reservations carry one) */}
              {showRequestDetail.image && (
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={showRequestDetail.image}
                    alt={showRequestDetail.service}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 right-12 text-lg font-bold text-white leading-tight">
                    {showRequestDetail.service}
                  </h3>
                </div>
              )}

              <div className="p-6">
                {!showRequestDetail.image && (
                  <div className="flex items-start gap-3 mb-4 pr-8">
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const iconByType = {
                          restaurant: UtensilsCrossed,
                          dining: CalendarCheck,
                          waiter: BellRing,
                          excursion: Compass,
                          amenity: Calendar
                        }
                        const Icon = iconByType[showRequestDetail.type] || Clipboard
                        return <Icon className="w-5 h-5 text-accent" />
                      })()}
                    </div>
                    <h3 className="text-lg font-bold leading-tight">{showRequestDetail.service}</h3>
                  </div>
                )}

                {/* Status + type chips */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/20 text-accent capitalize">
                    {showRequestDetail.status}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-bg text-muted capitalize">
                    {showRequestDetail.type}
                  </span>
                </div>

                {/* Detail rows (only the fields this request actually carries) */}
                <div className="space-y-3 text-sm">
                  {(() => {
                    const r = showRequestDetail
                    const rows = [
                      { icon: Hash, label: 'Request ID', value: r.id },
                      { icon: MapPin, label: 'Location', value: r.location },
                      { icon: Calendar, label: 'Date', value: r.date },
                      { icon: Clock, label: 'Time', value: r.time },
                      { icon: Clock, label: 'ETA', value: r.estimatedTime },
                      { icon: Clock, label: 'Duration', value: r.duration },
                      { icon: Tag, label: 'Quantity', value: r.quantity && r.quantity > 1 ? r.quantity : null },
                      { icon: Users, label: 'Guests', value: r.guestsCount },
                      { icon: UtensilsCrossed, label: 'Items', value: r.summary }
                    ].filter((row) => row.value)
                    return rows.map((row) => {
                      const RowIcon = row.icon
                      return (
                        <div key={row.label} className="flex items-start gap-3">
                          <RowIcon className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted w-24 flex-shrink-0">{row.label}</span>
                          <span className="font-medium text-right flex-1 break-words">{row.value}</span>
                        </div>
                      )
                    })
                  })()}

                  {showRequestDetail.notes && (
                    <div className="flex items-start gap-3">
                      <StickyNote className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted w-24 flex-shrink-0">Notes</span>
                      <span className="font-medium text-right flex-1 break-words italic">"{showRequestDetail.notes}"</span>
                    </div>
                  )}

                  {showRequestDetail.price > 0 && (
                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
                      <span className="text-muted flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-accent" />
                        Total
                      </span>
                      <span className="text-lg font-bold text-accent">${showRequestDetail.price}</span>
                    </div>
                  )}

                  {/* Cancellation policy — only for cancellable requests */}
                  {showRequestDetail.canCancel && (
                    <div className="flex items-start gap-2 text-xs text-muted bg-bg rounded-lg p-3 mt-1">
                      <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{cancellationCopy(showRequestDetail.price)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  {showRequestDetail.canCancel && (
                    <button
                      onClick={() => {
                        handleCancelRequest(showRequestDetail.id)
                        setShowRequestDetail(null)
                      }}
                      className="flex-1 py-2.5 rounded-xl font-semibold border border-border text-muted hover:text-primary hover:border-accent transition"
                    >
                      Cancel Request
                    </button>
                  )}
                  <button
                    onClick={() => setShowRequestDetail(null)}
                    className="flex-1 bg-accent text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
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
            onClick={(e) => { if (e.target === e.currentTarget) { setShowExcursions(false); setExcursionPreselect(null) } }}
          >
            <div className="w-full max-w-4xl my-8">
              <ExcursionBookingForm
                onClose={() => { setShowExcursions(false); setExcursionPreselect(null) }}
                onBooked={handleExcursionBooked}
                guestName={guest.name}
                roomNumber={guest.room.number}
                initialExcursionId={excursionPreselect}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

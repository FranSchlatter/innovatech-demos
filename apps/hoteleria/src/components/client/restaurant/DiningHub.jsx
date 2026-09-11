import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from '@shared-ui/components/DatePicker'
import {
  X,
  ArrowLeft,
  ChefHat,
  UtensilsCrossed,
  Home,
  Star,
  Clock,
  MapPin,
  Users,
  Bell,
  CalendarCheck,
  Check,
  Shirt,
  Sparkles,
  Send
} from 'lucide-react'
import restaurantData from '../../../data/restaurants.json'
import roomServiceMenu from '../../../data/menuItems.json'
import MenuBrowser from './MenuBrowser'

const RESTAURANTS = restaurantData.restaurants

// Full-screen dining experience for the Guest Portal.
// A segmented switch flips between ordering to the room (Room Service) and the
// hotel's à-la-carte restaurants. Each restaurant supports booking a table,
// browsing the menu / ordering to the table, and calling the waiter.
// Props:
//   open, onClose, room, guestName, guestPhone
//   onOrderPlaced(order)      → food order placed (delegated from MenuBrowser)
//   onReserveTable(booking)   → dine-in table reservation
//   onCallWaiter(info)        → waiter requested
export default function DiningHub({
  open,
  onClose,
  room,
  guestName = '',
  guestPhone = '',
  onOrderPlaced,
  onReserveTable,
  onCallWaiter
}) {
  const [mode, setMode] = useState('restaurants') // 'restaurants' | 'room-service'
  const [selected, setSelected] = useState(null) // active restaurant
  const [reserveOpen, setReserveOpen] = useState(false)
  const [menuConfig, setMenuConfig] = useState(null) // { menu, venueName, serviceType, title }
  const [toast, setToast] = useState('')

  // Reset the hub whenever it closes so it reopens on a clean state.
  useEffect(() => {
    if (!open) {
      setSelected(null)
      setReserveOpen(false)
      setMenuConfig(null)
      setMode('restaurants')
    }
  }, [open])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleReserve = (booking) => {
    onReserveTable?.(booking)
    setReserveOpen(false)
    showToast(`Table booked at ${booking.venue} · ${booking.date} ${booking.time}`)
  }

  const handleWaiter = (restaurant) => {
    onCallWaiter?.({ venue: restaurant.name, location: restaurant.location })
    showToast(`A waiter has been notified at ${restaurant.name} 🛎️`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-bg overflow-y-auto"
        >
          {/* Header */}
          <header className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {selected ? (
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 -ml-2 rounded-lg hover:bg-bg text-muted hover:text-primary transition-colors"
                    title="Back to restaurants"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <ChefHat className="w-5 h-5 text-accent" />
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="font-bold text-lg leading-tight truncate">
                    {selected ? selected.name : 'Dining'}
                  </h1>
                  <p className="text-xs text-muted truncate">
                    {selected ? selected.tagline : `Room ${room} · in-room & à-la-carte`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg text-muted hover:text-primary transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented switch — hidden inside a restaurant detail */}
            {!selected && (
              <div className="container mx-auto px-4 pb-3">
                <div className="inline-flex bg-bg rounded-xl p-1 border border-border">
                  {[
                    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
                    { id: 'room-service', label: 'Room Service', icon: Home }
                  ].map((opt) => {
                    const Icon = opt.icon
                    const active = mode === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setMode(opt.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          active ? 'bg-accent text-white shadow-soft' : 'text-muted hover:text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </header>

          <main className="container mx-auto px-4 py-6">
            <AnimatePresence mode="wait">
              {selected ? (
                <RestaurantDetail
                  key={selected.id}
                  restaurant={selected}
                  onReserve={() => setReserveOpen(true)}
                  onOrder={() =>
                    setMenuConfig({
                      menu: selected.menu,
                      venueName: selected.name,
                      serviceType: 'table',
                      title: selected.name
                    })
                  }
                  onWaiter={() => handleWaiter(selected)}
                />
              ) : mode === 'restaurants' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {RESTAURANTS.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} onOpen={() => setSelected(r)} />
                  ))}
                </motion.div>
              ) : (
                <RoomServiceIntro
                  key="room-service"
                  room={room}
                  onBrowse={() =>
                    setMenuConfig({
                      menu: roomServiceMenu,
                      venueName: 'Room Service',
                      serviceType: 'room',
                      title: 'Room Service'
                    })
                  }
                />
              )}
            </AnimatePresence>
          </main>

          {/* Table reservation modal */}
          <AnimatePresence>
            {reserveOpen && selected && (
              <TableReservationModal
                restaurant={selected}
                room={room}
                guestName={guestName}
                guestPhone={guestPhone}
                onClose={() => setReserveOpen(false)}
                onConfirm={handleReserve}
              />
            )}
          </AnimatePresence>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-5 z-[70] bg-accent text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 sm:max-w-sm"
              >
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{toast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Menu / ordering — reuses the shared MenuBrowser */}
          <MenuBrowser
            open={!!menuConfig}
            onClose={() => setMenuConfig(null)}
            onOrderPlaced={onOrderPlaced}
            room={room}
            menu={menuConfig?.menu || roomServiceMenu}
            venueName={menuConfig?.venueName || 'Room Service'}
            serviceType={menuConfig?.serviceType || 'room'}
            title={menuConfig?.title || 'Menu'}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PriceRange({ value }) {
  return <span className="font-semibold text-accent">{value}</span>
}

function RestaurantCard({ restaurant, onOpen }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpen}
      whileHover={{ y: -4 }}
      className="text-left bg-surface rounded-2xl overflow-hidden shadow-soft hover:shadow-lg transition-shadow group"
    >
      <div className="relative h-44">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 text-accent text-xs font-bold px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 fill-accent" />
          {restaurant.rating}
        </div>
        {!restaurant.reservable && (
          <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Walk-in
          </span>
        )}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
          <p className="text-white/85 text-sm">{restaurant.cuisine}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted line-clamp-2 mb-3">{restaurant.tagline}</p>
        <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {restaurant.hours}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {restaurant.location}</span>
          <PriceRange value={restaurant.priceRange} />
        </div>
      </div>
    </motion.button>
  )
}

function RestaurantDetail({ restaurant, onReserve, onOrder, onWaiter }) {
  const info = [
    { icon: Clock, label: 'Hours', value: restaurant.hours },
    { icon: MapPin, label: 'Location', value: restaurant.location },
    { icon: Shirt, label: 'Dress code', value: restaurant.dressCode },
    { icon: Star, label: 'Rating', value: `${restaurant.rating} · ${restaurant.priceRange}` }
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="max-w-3xl mx-auto"
    >
      <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden shadow-soft">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30 mb-2">
            {restaurant.cuisine}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{restaurant.name}</h2>
          <p className="text-white/85 text-sm">{restaurant.tagline}</p>
        </div>
      </div>

      <p className="text-muted mt-5 leading-relaxed">{restaurant.description}</p>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {info.map((row) => {
          const Icon = row.icon
          return (
            <div key={row.label} className="flex items-center gap-3 bg-surface rounded-xl p-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted">{row.label}</p>
                <p className="text-sm font-medium truncate">{row.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {restaurant.reservable ? (
          <button
            onClick={onReserve}
            className="flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent/90 transition"
          >
            <CalendarCheck className="w-5 h-5" />
            Book a table
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 bg-bg text-muted py-3 rounded-xl font-medium text-sm border border-border">
            <Users className="w-4 h-4" />
            Walk-in only
          </div>
        )}
        <button
          onClick={onOrder}
          className="flex items-center justify-center gap-2 bg-surface border border-border text-primary py-3 rounded-xl font-semibold hover:border-accent transition"
        >
          <UtensilsCrossed className="w-5 h-5 text-accent" />
          View menu
        </button>
        <button
          onClick={onWaiter}
          className="flex items-center justify-center gap-2 bg-surface border border-border text-primary py-3 rounded-xl font-semibold hover:border-accent transition"
        >
          <Bell className="w-5 h-5 text-accent" />
          Call waiter
        </button>
      </div>
    </motion.div>
  )
}

function RoomServiceIntro({ room, onBrowse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="max-w-3xl mx-auto"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-soft">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=500&fit=crop"
          alt="Room service"
          className="w-full h-56 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center max-w-md">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Home className="w-4 h-4" /> In-room dining · 24/7
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Order to Room {room}</h3>
          <p className="text-white/85 text-sm mb-5">
            Breakfast, dinner, desserts and drinks delivered straight to your door.
            Charged to your room, pay at checkout.
          </p>
          <button
            onClick={onBrowse}
            className="self-start inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-accent/90 transition"
          >
            <UtensilsCrossed className="w-5 h-5" />
            Browse full menu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          { icon: Clock, title: 'Fast', text: '25–40 min average' },
          { icon: Sparkles, title: 'Fresh', text: 'Made to order' },
          { icon: Home, title: 'Anywhere', text: 'To your room' }
        ].map((f) => {
          const Icon = f.icon
          return (
            <div key={f.title} className="bg-surface rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-muted">{f.text}</p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function TableReservationModal({ restaurant, room, guestName, guestPhone, onClose, onConfirm }) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('')
  const [party, setParty] = useState(2)
  const [name, setName] = useState(guestName)
  const [phone, setPhone] = useState(guestPhone)
  const [requests, setRequests] = useState('')

  const canConfirm = date && time && name.trim()

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative bg-surface rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-accent" />
              Book a table
            </h3>
            <p className="text-xs text-muted mt-0.5">{restaurant.name} · {restaurant.location}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Date */}
          <div>
            <label className="text-sm text-muted mb-1.5 block">Date</label>
            <DatePicker
              value={date}
              min={today}
              onChange={(value) => setDate(value)}
            />
          </div>

          {/* Time slots */}
          <div>
            <label className="text-sm text-muted mb-1.5 block">Time</label>
            <div className="grid grid-cols-4 gap-2">
              {restaurant.timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`py-2 rounded-lg text-sm font-medium transition ${
                    time === slot ? 'bg-accent text-white' : 'bg-bg hover:bg-accent/10'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Party size */}
          <div>
            <label className="text-sm text-muted mb-1.5 block">Party size</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setParty(n)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                    party === n ? 'bg-accent text-white' : 'bg-bg hover:bg-accent/10'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="text-sm text-muted ml-1">guests</span>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted mb-1.5 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-2.5 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1.5 block">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 …"
                className="w-full px-4 py-2.5 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none text-sm"
              />
            </div>
          </div>

          {/* Special requests */}
          <div>
            <label className="text-sm text-muted mb-1.5 block">Special requests</label>
            <textarea
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              placeholder="Window table, high chair, allergies…"
              rows={2}
              className="w-full px-4 py-2.5 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none text-sm resize-none"
            />
          </div>
        </div>

        <div className="p-5 border-t border-border">
          <button
            onClick={() =>
              onConfirm({
                venue: restaurant.name,
                location: restaurant.location,
                date,
                time,
                party,
                name: name.trim(),
                phone: phone.trim(),
                requests: requests.trim(),
                room
              })
            }
            disabled={!canConfirm}
            className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            Confirm reservation
          </button>
        </div>
      </motion.div>
    </div>
  )
}

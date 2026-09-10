import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  Star,
  Leaf,
  WheatOff,
  UtensilsCrossed,
  QrCode,
  SlidersHorizontal
} from 'lucide-react'
import menuData from '../../../data/menuItems.json'
import CartDrawer from './CartDrawer'
import OrderConfirmation from './OrderConfirmation'

const { categories, items: MENU_ITEMS } = menuData

// Every allergen present in the menu (for the "avoid" filter chips).
const ALL_ALLERGENS = [...new Set(MENU_ITEMS.flatMap((i) => i.allergens))].sort()

// Build a short ETA label (25–40 min from now).
const buildEta = () => {
  const now = new Date()
  const from = new Date(now.getTime() + 25 * 60000)
  const to = new Date(now.getTime() + 40 * 60000)
  const fmt = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return `${fmt(from)} – ${fmt(to)}`
}

function DietBadge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-accent/10 text-accent">
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

function MenuCard({ item, qty, onInc, onDec }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-2xl overflow-hidden shadow-soft flex flex-col ${
        !item.available ? 'opacity-60' : ''
      }`}
    >
      <div className="relative h-36">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {item.popular && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-white/90 text-accent">
            <Star className="w-3 h-3 fill-accent text-accent" />
            Popular
          </span>
        )}
        {!item.available && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-1 rounded-full bg-black/70 text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold leading-tight">{item.name}</h3>
          <span className="font-bold text-accent whitespace-nowrap">${item.price}</span>
        </div>
        <p className="text-sm text-muted line-clamp-2 mb-3">{item.description}</p>

        {/* Diet badges */}
        {(item.vegetarian || item.glutenFree) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.vegetarian && <DietBadge icon={Leaf} label="Vegetarian" />}
            {item.glutenFree && <DietBadge icon={WheatOff} label="Gluten-free" />}
          </div>
        )}

        {item.allergens.length > 0 && (
          <p className="text-[11px] text-muted mb-3 capitalize">
            Contains: {item.allergens.join(', ')}
          </p>
        )}

        {/* Add / stepper */}
        <div className="mt-auto pt-1">
          {qty === 0 ? (
            <button
              onClick={() => onInc(item.id)}
              disabled={!item.available}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center justify-between bg-bg rounded-xl p-1">
              <button
                onClick={() => onDec(item.id)}
                className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center hover:bg-accent/10 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold">{qty} in cart</span>
              <button
                onClick={() => onInc(item.id)}
                className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center hover:bg-accent/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function MenuBrowser({ open, onClose, onOrderPlaced, room }) {
  const [cart, setCart] = useState({}) // { [itemId]: qty }
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [avoid, setAvoid] = useState([]) // allergens to exclude
  const [dietOnly, setDietOnly] = useState([]) // 'vegetarian' | 'glutenFree' | 'popular'
  const [showFilters, setShowFilters] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  // Reset transient UI when the browser is closed.
  useEffect(() => {
    if (!open) {
      setCartOpen(false)
      setConfirmation(null)
    }
  }, [open])

  const inc = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const dec = (id) =>
    setCart((c) => {
      const next = { ...c }
      const q = (next[id] || 0) - 1
      if (q <= 0) delete next[id]
      else next[id] = q
      return next
    })
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c }
      delete next[id]
      return next
    })

  const toggleAvoid = (a) =>
    setAvoid((list) => (list.includes(a) ? list.filter((x) => x !== a) : [...list, a]))
  const toggleDiet = (d) =>
    setDietOnly((list) => (list.includes(d) ? list.filter((x) => x !== d) : [...list, d]))

  const filtered = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (search) {
        const q = search.toLowerCase()
        if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q))
          return false
      }
      if (dietOnly.includes('vegetarian') && !item.vegetarian) return false
      if (dietOnly.includes('glutenFree') && !item.glutenFree) return false
      if (dietOnly.includes('popular') && !item.popular) return false
      if (avoid.some((a) => item.allergens.includes(a))) return false
      return true
    })
  }, [category, search, dietOnly, avoid])

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const item = MENU_ITEMS.find((i) => i.id === id)
          return item ? { id, name: item.name, price: item.price, image: item.image, qty } : null
        })
        .filter(Boolean),
    [cart]
  )

  const itemCount = lines.reduce((s, l) => s + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const activeFilters = avoid.length + dietOnly.length

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    const order = {
      number: Math.floor(1000 + Math.random() * 9000),
      items: lines,
      total,
      eta: buildEta(),
      room,
      notes: notes.trim()
    }
    onOrderPlaced?.(order)
    setSubmitting(false)
    setCartOpen(false)
    setConfirmation(order)
    setCart({})
    setNotes('')
  }

  const handleCloseAll = () => {
    setConfirmation(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-bg overflow-y-auto"
        >
          {/* Sticky header */}
          <header className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-lg leading-tight truncate">Restaurant Menu</h1>
                  <p className="text-xs text-muted">Order to Room {room} · pay at checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!confirmation && (
                  <button
                    onClick={() => setCartOpen(true)}
                    className="relative flex items-center gap-2 bg-accent text-white pl-3 pr-4 py-2 rounded-xl font-semibold hover:bg-accent/90 transition"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="hidden sm:inline">${total}</span>
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold grid place-items-center">
                        {itemCount}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={handleCloseAll}
                  className="p-2 rounded-lg hover:bg-bg text-muted hover:text-primary transition-colors"
                  title="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-6">
            {confirmation ? (
              <OrderConfirmation order={confirmation} onClose={handleCloseAll} />
            ) : (
              <>
                {/* Search + filter toggle */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search dishes…"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl border border-border focus:border-accent outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters((s) => !s)}
                    className={`relative flex items-center gap-2 px-4 rounded-xl border transition-colors ${
                      showFilters || activeFilters
                        ? 'border-accent text-accent bg-accent/5'
                        : 'border-border text-muted hover:text-primary'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Filters</span>
                    {activeFilters > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold grid place-items-center">
                        {activeFilters}
                      </span>
                    )}
                  </button>
                </div>

                {/* Filter panel */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="bg-surface rounded-xl border border-border p-4 space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                            Dietary
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { key: 'popular', label: 'Popular', icon: Star },
                              { key: 'vegetarian', label: 'Vegetarian', icon: Leaf },
                              { key: 'glutenFree', label: 'Gluten-free', icon: WheatOff }
                            ].map((d) => {
                              const Icon = d.icon
                              const active = dietOnly.includes(d.key)
                              return (
                                <button
                                  key={d.key}
                                  onClick={() => toggleDiet(d.key)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                    active
                                      ? 'bg-accent text-white border-accent'
                                      : 'bg-bg text-muted border-border hover:border-accent'
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  {d.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                            Avoid allergens
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {ALL_ALLERGENS.map((a) => {
                              const active = avoid.includes(a)
                              return (
                                <button
                                  key={a}
                                  onClick={() => toggleAvoid(a)}
                                  className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${
                                    active
                                      ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/40'
                                      : 'bg-bg text-muted border-border hover:border-accent'
                                  }`}
                                >
                                  {a}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {activeFilters > 0 && (
                          <button
                            onClick={() => {
                              setAvoid([])
                              setDietOnly([])
                            }}
                            className="text-sm text-accent font-medium hover:underline"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Category tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4">
                  {[{ id: 'all', name: 'All' }, ...categories].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        category === cat.id
                          ? 'bg-accent text-white'
                          : 'bg-surface text-muted hover:text-primary'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24"
                  >
                    {filtered.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        qty={cart[item.id] || 0}
                        onInc={inc}
                        onDec={dec}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-20">
                    <UtensilsCrossed className="w-12 h-12 mx-auto text-muted mb-4" />
                    <h3 className="font-bold mb-1">No dishes match your filters</h3>
                    <p className="text-sm text-muted">Try adjusting your search or filters.</p>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Floating cart bar on mobile when items exist */}
          <AnimatePresence>
            {!confirmation && itemCount > 0 && !cartOpen && (
              <motion.button
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                onClick={() => setCartOpen(true)}
                className="sm:hidden fixed bottom-5 inset-x-4 z-40 flex items-center justify-between bg-accent text-white px-5 py-3.5 rounded-2xl shadow-lg font-semibold"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
                <span>View order · ${total}</span>
              </motion.button>
            )}
          </AnimatePresence>

          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            lines={lines}
            onInc={inc}
            onDec={dec}
            onRemove={remove}
            notes={notes}
            setNotes={setNotes}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

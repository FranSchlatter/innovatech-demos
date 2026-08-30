import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Clock,
  Users,
  MapPin,
  Star,
  Search,
  Plus,
  Minus,
  X,
  Save,
  Calendar,
  Power,
  Ticket,
  TrendingUp,
  Trash2,
  UserCheck
} from 'lucide-react'
import { mockExcursions, EXCURSION_CATEGORIES, isToday } from '../../../data/admin/mockExcursions'

const seatColor = (booked, capacity) => {
  const pct = capacity ? booked / capacity : 0
  if (pct >= 1) return { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400' }
  if (pct >= 0.7) return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' }
  return { bar: 'bg-green-500', text: 'text-green-600 dark:text-green-400' }
}

const formatDepDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return isToday(dateStr) ? `Today · ${label}` : label
}

function KPICard({ icon: Icon, label, value, sub, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-5"
    >
      <div className={`inline-flex p-2.5 rounded-lg ${color} mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-text">{value}</h3>
      <p className="text-sm text-muted">{label}</p>
      {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
    </motion.div>
  )
}

function DepartureRow({ dep }) {
  const c = seatColor(dep.booked, dep.capacity)
  const full = dep.booked >= dep.capacity
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-28 shrink-0">
        <p className="text-xs font-medium text-text">{formatDepDate(dep.date)}</p>
        <p className="text-xs text-muted flex items-center gap-1"><Clock className="w-3 h-3" />{dep.time}</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-2 rounded-full bg-bg overflow-hidden">
          <div className={`h-full ${c.bar} transition-all`} style={{ width: `${Math.min(100, (dep.booked / dep.capacity) * 100)}%` }} />
        </div>
      </div>
      <div className="w-20 shrink-0 text-right">
        {full ? (
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">Full</span>
        ) : (
          <span className={`text-xs font-semibold ${c.text}`}>{dep.capacity - dep.booked} left</span>
        )}
        <p className="text-[11px] text-muted">{dep.booked}/{dep.capacity}</p>
      </div>
    </div>
  )
}

function ExcursionCard({ excursion, onToggle, onManage }) {
  const active = excursion.status === 'active'
  const totalBooked = excursion.departures.reduce((s, d) => s + d.booked, 0)
  const totalCap = excursion.departures.reduce((s, d) => s + d.capacity, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-xl border overflow-hidden flex flex-col ${active ? 'border-border' : 'border-border opacity-70'}`}
    >
      <div className="relative h-32">
        <img src={excursion.image} alt={excursion.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white">
          {excursion.category}
        </span>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
          active ? 'bg-green-500/90 text-white' : 'bg-gray-500/80 text-white'
        }`}>
          {active ? 'Active' : 'Inactive'}
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="min-w-0">
            <h3 className="font-bold truncate">{excursion.name}</h3>
            <p className="text-xs opacity-90 flex items-center gap-1"><MapPin className="w-3 h-3" />{excursion.location}</p>
          </div>
          <span className="text-lg font-bold shrink-0">${excursion.price}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted mb-3 flex-wrap">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{excursion.duration}</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{excursion.rating}</span>
          <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" />{excursion.guide}</span>
        </div>

        {/* Departures */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-text flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted" /> Schedule &amp; capacity
          </span>
          <span className="text-xs text-muted">{totalBooked}/{totalCap} seats</span>
        </div>
        <div className="divide-y divide-border mb-4">
          {excursion.departures.map((dep) => (
            <DepartureRow key={dep.id} dep={dep} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onToggle(excursion.id)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-bg text-muted hover:text-text'
                : 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20'
            }`}
          >
            <Power className="w-4 h-4" />
            {active ? 'Pause' : 'Activate'}
          </button>
          <button
            onClick={() => onManage(excursion)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-contrast text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Ticket className="w-4 h-4" />
            Manage
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ManageModal({ excursion, onClose, onSave }) {
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [newDep, setNewDep] = useState({ date: '', time: '', capacity: 10 })

  // Initialise a fresh draft each time the modal opens (null between opens
  // guarantees a re-init even when reopening the same excursion after cancel).
  useEffect(() => {
    if (excursion) {
      setDraft(JSON.parse(JSON.stringify(excursion)))
      setNewDep({ date: '', time: '', capacity: 10 })
    } else {
      setDraft(null)
    }
  }, [excursion])

  const setCapacity = (depId, delta) => {
    setDraft((d) => ({
      ...d,
      departures: d.departures.map((dep) =>
        dep.id === depId ? { ...dep, capacity: Math.max(dep.booked, dep.capacity + delta) } : dep
      )
    }))
  }

  const removeDep = (depId) => {
    setDraft((d) => ({ ...d, departures: d.departures.filter((dep) => dep.id !== depId) }))
  }

  const addDep = () => {
    if (!newDep.date || !newDep.time) return
    setDraft((d) => ({
      ...d,
      departures: [
        ...d.departures,
        { id: `dep-${d.departures.length}-${newDep.time}`, date: newDep.date, time: newDep.time, capacity: Number(newDep.capacity) || 1, booked: 0 }
      ].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    }))
    setNewDep({ date: '', time: '', capacity: 10 })
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    onSave(draft)
    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {excursion && draft && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-surface rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <img src={draft.image} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-text truncate">{draft.name}</h2>
                  <p className="text-sm text-muted">{draft.category} · {draft.duration}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-6">
              {/* Price + status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Price / person</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-bg border border-border rounded-lg">
                    <span className="text-muted">$</span>
                    <input
                      type="number"
                      min={0}
                      value={draft.price}
                      onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) || 0 }))}
                      className="flex-1 bg-transparent focus:outline-none text-sm text-text"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Status</label>
                  <button
                    onClick={() => setDraft((d) => ({ ...d, status: d.status === 'active' ? 'inactive' : 'active' }))}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      draft.status === 'active'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-bg text-muted'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {draft.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Departures / capacity management */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Schedules &amp; capacity</h3>
                <div className="space-y-2">
                  {draft.departures.map((dep) => {
                    const c = seatColor(dep.booked, dep.capacity)
                    return (
                      <div key={dep.id} className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                        <div className="w-28 shrink-0">
                          <p className="text-xs font-medium text-text">{formatDepDate(dep.date)}</p>
                          <p className="text-xs text-muted flex items-center gap-1"><Clock className="w-3 h-3" />{dep.time}</p>
                        </div>
                        <div className="flex-1 text-xs text-muted">
                          <span className={`font-semibold ${c.text}`}>{dep.booked}</span> booked · cap.
                        </div>
                        {/* Capacity stepper */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCapacity(dep.id, -1)}
                            disabled={dep.capacity <= dep.booked}
                            className="p-1.5 rounded-md bg-surface border border-border text-text hover:bg-primary hover:text-primary-contrast disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-text">{dep.capacity}</span>
                          <button
                            onClick={() => setCapacity(dep.id, 1)}
                            className="p-1.5 rounded-md bg-surface border border-border text-text hover:bg-primary hover:text-primary-contrast transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeDep(dep.id)}
                          disabled={dep.booked > 0}
                          title={dep.booked > 0 ? 'Has bookings — cannot remove' : 'Remove slot'}
                          className="p-1.5 rounded-md text-muted hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Add slot */}
                <div className="mt-3 flex flex-wrap items-end gap-2 p-3 bg-bg rounded-lg">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs text-muted mb-1">Date</label>
                    <input
                      type="date"
                      value={newDep.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewDep((n) => ({ ...n, date: e.target.value }))}
                      className="w-full px-2 py-1.5 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-muted mb-1">Time</label>
                    <input
                      type="time"
                      value={newDep.time}
                      onChange={(e) => setNewDep((n) => ({ ...n, time: e.target.value }))}
                      className="w-full px-2 py-1.5 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-muted mb-1">Cap.</label>
                    <input
                      type="number"
                      min={1}
                      value={newDep.capacity}
                      onChange={(e) => setNewDep((n) => ({ ...n, capacity: e.target.value }))}
                      className="w-full px-2 py-1.5 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={addDep}
                    disabled={!newDep.date || !newDep.time}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-contrast text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ExcursionsManagement() {
  const [excursions, setExcursions] = useState(mockExcursions)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [managing, setManaging] = useState(null)

  const stats = useMemo(() => {
    const active = excursions.filter((e) => e.status === 'active')
    let todaySlots = 0
    let seatsBooked = 0
    let seatsCap = 0
    let revenue = 0
    excursions.forEach((e) => {
      e.departures.forEach((d) => {
        if (isToday(d.date)) {
          todaySlots += 1
          seatsBooked += d.booked
          seatsCap += d.capacity
          revenue += d.booked * e.price
        }
      })
    })
    return {
      activeCount: active.length,
      total: excursions.length,
      todaySlots,
      occupancy: seatsCap ? Math.round((seatsBooked / seatsCap) * 100) : 0,
      seatsBooked,
      seatsCap,
      revenue
    }
  }, [excursions])

  const filtered = useMemo(() => {
    return excursions.filter((e) => {
      if (search) {
        const q = search.toLowerCase()
        if (!e.name.toLowerCase().includes(q) && !e.location.toLowerCase().includes(q) && !e.category.toLowerCase().includes(q)) return false
      }
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      if (statusFilter !== 'all' && e.status !== statusFilter) return false
      return true
    })
  }, [excursions, search, categoryFilter, statusFilter])

  const toggleStatus = (id) => {
    setExcursions((list) => list.map((e) => (e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e)))
  }

  const saveExcursion = (updated) => {
    setExcursions((list) => list.map((e) => (e.id === updated.id ? updated : e)))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text">Excursions</h2>
        <p className="text-sm text-muted">Schedules, capacity and availability</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard index={0} icon={Compass} label="Active excursions" value={`${stats.activeCount}/${stats.total}`} color="bg-teal-500" />
        <KPICard index={1} icon={Calendar} label="Departures today" value={stats.todaySlots} color="bg-blue-500" />
        <KPICard index={2} icon={Users} label="Seats occupancy" value={`${stats.occupancy}%`} sub={`${stats.seatsBooked}/${stats.seatsCap} seats today`} color="bg-purple-500" />
        <KPICard index={3} icon={TrendingUp} label="Revenue today" value={`$${stats.revenue.toLocaleString()}`} color="bg-green-500" />
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search excursions, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg text-text placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All categories</option>
            {EXCURSION_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((excursion) => (
          <ExcursionCard
            key={excursion.id}
            excursion={excursion}
            onToggle={toggleStatus}
            onManage={setManaging}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Compass className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-1">No excursions found</h3>
          <p className="text-sm text-muted">Try adjusting your filters or search query</p>
        </div>
      )}

      <ManageModal
        excursion={managing}
        onClose={() => setManaging(null)}
        onSave={saveExcursion}
      />
    </div>
  )
}

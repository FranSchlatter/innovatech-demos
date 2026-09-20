import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from '@shared-ui/components/DatePicker'
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
  UserCheck,
  BarChart3,
  LayoutGrid,
  DollarSign,
  Award,
  ImageIcon,
  Percent,
  Repeat,
  CalendarPlus
} from 'lucide-react'
import {
  mockExcursions,
  EXCURSION_CATEGORIES,
  DIFFICULTIES,
  isToday,
  getExcursionMetrics
} from '../../../data/admin/mockExcursions'
import { WEEKDAYS, expandWeekly, describeWeekdays, todayISO } from '../../../data/recurrence'
import { useTranslation } from '../../../i18n/LanguageProvider'

const STORAGE_KEY = 'hotel-excursions'

// Load persisted excursions (created/edited in previous sessions) or fall back
// to the mock seed. Wrapped in try/catch so a corrupt entry never breaks the UI.
function loadExcursions() {
  if (typeof window === 'undefined') return mockExcursions
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* ignore corrupt payload */
  }
  return mockExcursions
}

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const seatColor = (booked, capacity) => {
  const pct = capacity ? booked / capacity : 0
  if (pct >= 1) return { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400' }
  if (pct >= 0.7) return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' }
  return { bar: 'bg-green-500', text: 'text-green-600 dark:text-green-400' }
}

// Returns { label, today } so callers can prefix a translated "Today ·".
const formatDepDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return { label, today: isToday(dateStr) }
}
const depDateText = (dateStr, t) => {
  const { label, today } = formatDepDate(dateStr)
  return today ? t('admin.excursions.depDateToday', { label }) : label
}

// --- Recurrence building blocks (shared by Create + Manage) -----------------

// Multi-select weekday chips (Mon→Sun). `value` is an array of getDay() numbers.
function WeekdayChips({ value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {WEEKDAYS.map((w) => {
        const active = value.includes(w.value)
        return (
          <button
            key={w.value}
            type="button"
            onClick={() => onToggle(w.value)}
            className={`w-10 h-9 rounded-lg text-xs font-semibold border transition-colors ${
              active
                ? 'bg-primary text-primary-contrast border-primary'
                : 'bg-bg text-muted border-border hover:border-primary'
            }`}
          >
            {w.short}
          </button>
        )
      })}
    </div>
  )
}

// A list of times entered as chips. `value` is an array of 'HH:MM' strings.
function TimesInput({ value, onAdd, onRemove }) {
  const { t } = useTranslation()
  const [time, setTime] = useState('09:00')
  return (
    <div>
      <div className="flex items-end gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="px-2 py-1.5 bg-bg border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => time && onAdd(time)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-contrast text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> {t('admin.excursions.times.addTime')}
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((tm) => (
            <span key={tm} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bg border border-border text-xs font-medium text-text">
              <Clock className="w-3 h-3 text-muted" />
              {tm}
              <button type="button" onClick={() => onRemove(tm)} className="text-muted hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Turn a recurrence spec into concrete departure objects (stable-ish ids).
function buildRecurringDepartures({ weekdays, times, weeks, capacity, startISO, idBase, existing = [] }) {
  const taken = new Set(existing.map((d) => `${d.date}T${d.time}`))
  const slots = expandWeekly({ startDate: startISO, weekdays, weeks, times })
  return slots
    .filter((s) => !taken.has(`${s.date}T${s.time}`)) // skip slots that already exist
    .map((s, i) => ({
      id: `${idBase}-r${i}-${s.time.replace(':', '')}`,
      date: s.date,
      time: s.time,
      capacity,
      booked: 0
    }))
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
  const { t } = useTranslation()
  const c = seatColor(dep.booked, dep.capacity)
  const full = dep.booked >= dep.capacity
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-28 shrink-0">
        <p className="text-xs font-medium text-text">{depDateText(dep.date, t)}</p>
        <p className="text-xs text-muted flex items-center gap-1"><Clock className="w-3 h-3" />{dep.time}</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-2 rounded-full bg-bg overflow-hidden">
          <div className={`h-full ${c.bar} transition-all`} style={{ width: `${Math.min(100, (dep.booked / dep.capacity) * 100)}%` }} />
        </div>
      </div>
      <div className="w-20 shrink-0 text-right">
        {full ? (
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">{t('admin.excursions.card.full')}</span>
        ) : (
          <span className={`text-xs font-semibold ${c.text}`}>{t('admin.excursions.card.left', { count: dep.capacity - dep.booked })}</span>
        )}
        <p className="text-[11px] text-muted">{dep.booked}/{dep.capacity}</p>
      </div>
    </div>
  )
}

function ExcursionCard({ excursion, onToggle, onManage }) {
  const { t } = useTranslation()
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
          {t(`admin.excursions.categories.${excursion.category}`)}
        </span>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
          active ? 'bg-green-500/90 text-white' : 'bg-gray-500/80 text-white'
        }`}>
          {active ? t('admin.excursions.card.active') : t('admin.excursions.card.inactive')}
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
            <Calendar className="w-3.5 h-3.5 text-muted" /> {t('admin.excursions.card.scheduleCapacity')}
          </span>
          <span className="text-xs text-muted">{t('admin.excursions.card.seats', { booked: totalBooked, cap: totalCap })}</span>
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
            {active ? t('admin.excursions.card.pause') : t('admin.excursions.card.activate')}
          </button>
          <button
            onClick={() => onManage(excursion)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-contrast text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Ticket className="w-4 h-4" />
            {t('admin.excursions.card.manage')}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ManageModal({ excursion, onClose, onSave }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [newDep, setNewDep] = useState({ date: '', time: '', capacity: 10 })
  const [rec, setRec] = useState({ weekdays: [], times: [], weeks: 4, capacity: 10 })

  // Initialise a fresh draft each time the modal opens (null between opens
  // guarantees a re-init even when reopening the same excursion after cancel).
  useEffect(() => {
    if (excursion) {
      setDraft(JSON.parse(JSON.stringify(excursion)))
      setNewDep({ date: '', time: '', capacity: 10 })
      setRec({ weekdays: [], times: [], weeks: 4, capacity: 10 })
    } else {
      setDraft(null)
    }
  }, [excursion])

  const toggleRecDay = (value) =>
    setRec((r) => ({
      ...r,
      weekdays: r.weekdays.includes(value) ? r.weekdays.filter((w) => w !== value) : [...r.weekdays, value]
    }))
  const addRecTime = (t) => setRec((r) => (r.times.includes(t) ? r : { ...r, times: [...r.times, t].sort() }))
  const removeRecTime = (t) => setRec((r) => ({ ...r, times: r.times.filter((x) => x !== t) }))

  const recPreview =
    rec.weekdays.length && rec.times.length && draft
      ? buildRecurringDepartures({
          weekdays: rec.weekdays,
          times: rec.times,
          weeks: Number(rec.weeks) || 1,
          capacity: 1,
          startISO: todayISO(),
          idBase: 'preview',
          existing: draft.departures
        }).length
      : 0

  const generateRecurring = () => {
    if (!recPreview) return
    const deps = buildRecurringDepartures({
      weekdays: rec.weekdays,
      times: rec.times,
      weeks: Number(rec.weeks) || 1,
      capacity: Math.max(1, Number(rec.capacity) || 1),
      startISO: todayISO(),
      idBase: draft.id,
      existing: draft.departures
    })
    setDraft((d) => ({
      ...d,
      departures: [...d.departures, ...deps].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    }))
    setRec((r) => ({ ...r, weekdays: [], times: [] }))
  }

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
                  <p className="text-sm text-muted">{t(`admin.excursions.categories.${draft.category}`)} · {draft.duration}</p>
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
                  <label className="block text-sm font-medium text-text mb-2">{t('admin.excursions.manage.pricePerPerson')}</label>
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
                  <label className="block text-sm font-medium text-text mb-2">{t('admin.excursions.manage.status')}</label>
                  <button
                    onClick={() => setDraft((d) => ({ ...d, status: d.status === 'active' ? 'inactive' : 'active' }))}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      draft.status === 'active'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-bg text-muted'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {draft.status === 'active' ? t('admin.excursions.manage.active') : t('admin.excursions.manage.inactive')}
                  </button>
                </div>
              </div>

              {/* Departures / capacity management */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">{t('admin.excursions.manage.schedulesCapacity')}</h3>
                <div className="space-y-2">
                  {draft.departures.map((dep) => {
                    const c = seatColor(dep.booked, dep.capacity)
                    return (
                      <div key={dep.id} className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                        <div className="w-28 shrink-0">
                          <p className="text-xs font-medium text-text">{depDateText(dep.date, t)}</p>
                          <p className="text-xs text-muted flex items-center gap-1"><Clock className="w-3 h-3" />{dep.time}</p>
                        </div>
                        <div className="flex-1 text-xs text-muted">
                          <span className={`font-semibold ${c.text}`}>{dep.booked}</span> {t('admin.excursions.manage.booked')}
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
                          title={dep.booked > 0 ? t('admin.excursions.manage.hasBookings') : t('admin.excursions.manage.removeSlot')}
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
                    <label className="block text-xs text-muted mb-1">{t('admin.excursions.manage.date')}</label>
                    <DatePicker
                      value={newDep.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(date) => setNewDep((n) => ({ ...n, date }))}
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-muted mb-1">{t('admin.excursions.manage.time')}</label>
                    <input
                      type="time"
                      value={newDep.time}
                      onChange={(e) => setNewDep((n) => ({ ...n, time: e.target.value }))}
                      className="w-full px-2 py-1.5 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-muted mb-1">{t('admin.excursions.manage.cap')}</label>
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
                    <Plus className="w-4 h-4" /> {t('admin.excursions.manage.add')}
                  </button>
                </div>

                {/* Recurring generator — set weekdays + times and auto-create slots */}
                <div className="mt-3 p-3 bg-bg rounded-lg space-y-3">
                  <p className="text-xs font-semibold text-text flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-muted" /> {t('admin.excursions.manage.generateRecurring')}
                  </p>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">{t('admin.excursions.manage.repeatOn')}</label>
                    <WeekdayChips value={rec.weekdays} onToggle={toggleRecDay} />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="block text-xs text-muted mb-1.5">{t('admin.excursions.manage.times')}</label>
                      <TimesInput value={rec.times} onAdd={addRecTime} onRemove={removeRecTime} />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-muted mb-1.5">{t('admin.excursions.manage.weeks')}</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={rec.weeks}
                        onChange={(e) => setRec((r) => ({ ...r, weeks: e.target.value }))}
                        className="w-full px-2 py-1.5 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-muted mb-1.5">{t('admin.excursions.manage.cap')}</label>
                      <input
                        type="number"
                        min={1}
                        value={rec.capacity}
                        onChange={(e) => setRec((r) => ({ ...r, capacity: e.target.value }))}
                        className="w-full px-2 py-1.5 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted">
                      {recPreview > 0
                        ? (recPreview === 1
                            ? t('admin.excursions.manage.newDepartures', { count: recPreview, days: describeWeekdays(rec.weekdays) })
                            : t('admin.excursions.manage.newDeparturesPlural', { count: recPreview, days: describeWeekdays(rec.weekdays) }))
                        : t('admin.excursions.manage.pickWeekdaysTimes')}
                    </p>
                    <button
                      onClick={generateRecurring}
                      disabled={!recPreview}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-contrast text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                      <CalendarPlus className="w-4 h-4" /> {t('admin.excursions.manage.generate')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                {t('common.actions.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? t('admin.excursions.manage.saving') : t('admin.excursions.manage.saveChanges')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CreateModal({ open, onClose, onCreate }) {
  const blank = {
    name: '',
    category: EXCURSION_CATEGORIES[0],
    description: '',
    price: '',
    duration: '',
    difficulty: DIFFICULTIES[0],
    location: '',
    meetingPoint: 'Hotel Lobby',
    guide: '',
    image: '',
    defaultCapacity: 12,
    recurrence: { enabled: false, weekdays: [], times: [], weeks: 4 }
  }
  const { t } = useTranslation()
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(blank)
      setTouched(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const rec = form.recurrence
  const setRec = (patch) => setForm((f) => ({ ...f, recurrence: { ...f.recurrence, ...patch } }))
  const toggleRecDay = (v) =>
    setRec({ weekdays: rec.weekdays.includes(v) ? rec.weekdays.filter((x) => x !== v) : [...rec.weekdays, v] })
  const addRecTime = (t) => setRec({ times: rec.times.includes(t) ? rec.times : [...rec.times, t].sort() })
  const removeRecTime = (t) => setRec({ times: rec.times.filter((x) => x !== t) })

  const recCount =
    rec.enabled && rec.weekdays.length && rec.times.length
      ? expandWeekly({ startDate: todayISO(), weekdays: rec.weekdays, weeks: Number(rec.weeks) || 1, times: rec.times }).length
      : 0

  const priceNum = Number(form.price)
  const capNum = Number(form.defaultCapacity)
  const errors = {
    name: !form.name.trim(),
    price: !form.price || Number.isNaN(priceNum) || priceNum <= 0,
    duration: !form.duration.trim(),
    capacity: !capNum || capNum < 1,
    recurrence: rec.enabled && recCount === 0
  }
  const isValid = !Object.values(errors).some(Boolean)

  const handleCreate = async () => {
    setTouched(true)
    if (!isValid) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    onCreate({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price: priceNum,
      duration: form.duration.trim(),
      difficulty: form.difficulty,
      location: form.location.trim() || form.meetingPoint.trim() || 'Miami',
      meetingPoint: form.meetingPoint.trim() || 'Hotel Lobby',
      guide: form.guide.trim() || 'To be assigned',
      image: form.image.trim(),
      defaultCapacity: capNum,
      recurrence: rec.enabled && recCount > 0
        ? { weekdays: rec.weekdays, times: rec.times, weeks: Number(rec.weeks) || 1 }
        : null
    })
    setSaving(false)
    onClose()
  }

  const fieldError = (key) => touched && errors[key]

  return (
    <AnimatePresence>
      {open && (
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
            className="relative w-full max-w-2xl bg-surface rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary text-primary-contrast">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">{t('admin.excursions.create.title')}</h2>
                  <p className="text-sm text-muted">{t('admin.excursions.create.subtitle')}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              <div className="grid sm:grid-cols-[1.4fr_1fr] gap-4">
                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.name')}</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder={t('admin.excursions.create.namePlaceholder')}
                      className={`w-full px-3 py-2 bg-bg border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        fieldError('name') ? 'border-red-500' : 'border-border'
                      }`}
                    />
                    {fieldError('name') && <p className="text-xs text-red-500 mt-1">{t('admin.excursions.create.nameRequired')}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.description')}</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      placeholder={t('admin.excursions.create.descriptionPlaceholder')}
                      className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.category')}</label>
                      <select
                        value={form.category}
                        onChange={(e) => set('category', e.target.value)}
                        className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {EXCURSION_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{t(`admin.excursions.categories.${c}`)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.difficulty')}</label>
                      <select
                        value={form.difficulty}
                        onChange={(e) => set('difficulty', e.target.value)}
                        className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {DIFFICULTIES.map((d) => (
                          <option key={d} value={d}>{t(`admin.excursions.difficulties.${d}`)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right column — image */}
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.imageUrl')}</label>
                  <div className="aspect-video rounded-lg border border-border bg-bg overflow-hidden flex items-center justify-center mb-2">
                    {form.image ? (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img
                        src={form.image}
                        alt={t('admin.excursions.create.preview')}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs">{t('admin.excursions.create.preview')}</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => set('image', e.target.value)}
                    placeholder="https://…"
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.pricePerPerson')}</label>
                  <div className={`flex items-center gap-1 px-3 py-2 bg-bg border rounded-lg ${fieldError('price') ? 'border-red-500' : 'border-border'}`}>
                    <span className="text-muted text-sm">$</span>
                    <input
                      type="number"
                      min={0}
                      value={form.price}
                      onChange={(e) => set('price', e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent focus:outline-none text-sm text-text"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.duration')}</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => set('duration', e.target.value)}
                    placeholder={t('admin.excursions.create.durationPlaceholder')}
                    className={`w-full px-3 py-2 bg-bg border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      fieldError('duration') ? 'border-red-500' : 'border-border'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.defaultCapacity')}</label>
                  <input
                    type="number"
                    min={1}
                    value={form.defaultCapacity}
                    onChange={(e) => set('defaultCapacity', e.target.value)}
                    className={`w-full px-3 py-2 bg-bg border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      fieldError('capacity') ? 'border-red-500' : 'border-border'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.guide')}</label>
                  <input
                    type="text"
                    value={form.guide}
                    onChange={(e) => set('guide', e.target.value)}
                    placeholder={t('admin.excursions.create.guidePlaceholder')}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.location')}</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => set('location', e.target.value)}
                    placeholder={t('admin.excursions.create.locationPlaceholder')}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">{t('admin.excursions.create.meetingPoint')}</label>
                  <input
                    type="text"
                    value={form.meetingPoint}
                    onChange={(e) => set('meetingPoint', e.target.value)}
                    placeholder={t('admin.excursions.create.meetingPointPlaceholder')}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Schedule / recurrence */}
              <div className={`rounded-lg border transition-colors ${rec.enabled ? 'border-primary/40 bg-primary/5' : 'border-border bg-bg'}`}>
                <button
                  type="button"
                  onClick={() => setRec({ enabled: !rec.enabled })}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-text">
                    <Repeat className="w-4 h-4 text-muted" /> {t('admin.excursions.create.scheduleRecurring')}
                  </span>
                  <span className={`relative w-10 h-5 rounded-full transition-colors ${rec.enabled ? 'bg-primary' : 'bg-border'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${rec.enabled ? 'translate-x-5' : ''}`} />
                  </span>
                </button>

                {rec.enabled ? (
                  <div className="px-4 pb-4 pt-1 space-y-3">
                    <div>
                      <label className="block text-xs text-muted mb-1.5">{t('admin.excursions.create.repeatOn')}</label>
                      <WeekdayChips value={rec.weekdays} onToggle={toggleRecDay} />
                    </div>
                    <div className="flex flex-wrap gap-4 items-start">
                      <div>
                        <label className="block text-xs text-muted mb-1.5">{t('admin.excursions.create.times')}</label>
                        <TimesInput value={rec.times} onAdd={addRecTime} onRemove={removeRecTime} />
                      </div>
                      <div className="w-20">
                        <label className="block text-xs text-muted mb-1.5">{t('admin.excursions.create.weeks')}</label>
                        <input
                          type="number"
                          min={1}
                          max={12}
                          value={rec.weeks}
                          onChange={(e) => setRec({ weeks: e.target.value })}
                          className="w-full px-2 py-1.5 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <p className={`text-xs ${fieldError('recurrence') ? 'text-red-500' : 'text-muted'}`}>
                      {recCount > 0
                        ? (recCount === 1
                            ? t('admin.excursions.create.willCreate', { count: recCount, days: describeWeekdays(rec.weekdays), weeks: rec.weeks })
                            : t('admin.excursions.create.willCreatePlural', { count: recCount, days: describeWeekdays(rec.weekdays), weeks: rec.weeks }))
                        : t('admin.excursions.create.pickWeekdayTime')}
                    </p>
                  </div>
                ) : (
                  <p className="px-4 pb-4 pt-1 text-xs text-muted">
                    {t('admin.excursions.create.autoHint')} <span className="text-text font-medium">{t('admin.excursions.create.autoHintManage')}</span>.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                {t('common.actions.cancel')}
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {saving ? t('admin.excursions.create.creating') : t('admin.excursions.create.create')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// --- Metrics view -----------------------------------------------------------

function RevenueChart({ data }) {
  const { t } = useTranslation()
  const max = Math.max(...data.map((d) => d.revenue), 1)
  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-base font-bold text-text mb-1 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-primary" />
        {t('admin.excursions.metrics.revenueByExcursion')}
      </h3>
      <p className="text-xs text-muted mb-4">{t('admin.excursions.metrics.realisedBookings')}</p>
      <div className="space-y-3">
        {data.map((e, i) => (
          <div key={e.id} className="flex items-center gap-3">
            <span className="w-32 sm:w-40 shrink-0 text-xs font-medium text-text truncate" title={e.name}>
              {e.name}
            </span>
            <div className="flex-1 h-6 rounded-md bg-bg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(e.revenue / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                className="h-full rounded-md bg-primary min-w-[2px]"
              />
            </div>
            <span className="w-20 shrink-0 text-right text-xs font-semibold text-text tabular-nums">
              ${e.revenue.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopPopular({ data }) {
  const { t } = useTranslation()
  const medals = ['bg-amber-400 text-amber-950', 'bg-slate-300 text-slate-800', 'bg-orange-400 text-orange-950']
  const maxBookings = Math.max(...data.map((d) => d.bookings), 1)
  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-base font-bold text-text mb-1 flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        {t('admin.excursions.metrics.topPopular')}
      </h3>
      <p className="text-xs text-muted mb-4">{t('admin.excursions.metrics.rankedBySeats')}</p>
      {data.length === 0 ? (
        <p className="text-sm text-muted py-6 text-center">{t('admin.excursions.metrics.noBookings')}</p>
      ) : (
        <div className="space-y-3">
          {data.map((e, i) => (
            <div key={e.id} className="flex items-center gap-3">
              <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${medals[i]}`}>
                {i + 1}
              </span>
              <img src={e.image} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text truncate">{e.name}</p>
                <div className="h-1.5 mt-1 rounded-full bg-bg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(e.bookings / maxBookings) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-text tabular-nums">{e.bookings}</p>
                <p className="text-[11px] text-muted">{t('admin.excursions.metrics.bookings')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WeekdayOccupancy({ data }) {
  const { t } = useTranslation()
  const max = Math.max(...data.map((d) => d.occ), 1)
  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-base font-bold text-text mb-1 flex items-center gap-2">
        <Percent className="w-5 h-5 text-primary" />
        {t('admin.excursions.metrics.avgOccupancy')}
      </h3>
      <p className="text-xs text-muted mb-4">{t('admin.excursions.metrics.seatsPerWeekday')}</p>
      <div className="flex items-end gap-2 sm:gap-3 h-40">
        {data.map((d, i) => (
          <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
            <span className="text-[11px] font-semibold text-text tabular-nums">{d.occ}%</span>
            <div className="w-full flex-1 flex flex-col justify-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.occ / max) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-full rounded-t-md min-h-[4px] bg-primary"
                style={{ opacity: 0.55 + (d.occ / max) * 0.45 }}
              />
            </div>
            <span className="text-[11px] text-muted">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendLine({ data }) {
  const { t } = useTranslation()
  const W = 280
  const H = 110
  const pad = 10
  const max = Math.max(...data.map((d) => d.bookings), 1)
  const stepX = data.length > 1 ? (W - pad * 2) / (data.length - 1) : 0
  const points = data.map((d, i) => {
    const x = pad + i * stepX
    const y = H - pad - (d.bookings / max) * (H - pad * 2)
    return { x, y, ...d }
  })
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${H - pad} L ${points[0].x.toFixed(1)} ${H - pad} Z`

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-base font-bold text-text mb-1 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        {t('admin.excursions.metrics.bookingTrend')}
      </h3>
      <p className="text-xs text-muted mb-4">{t('admin.excursions.metrics.seatsPerWeek')}</p>
      <div className="text-primary">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
          <path d={areaPath} fill="currentColor" opacity="0.12" />
          <motion.path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
          {points.map((p) => (
            <circle key={p.label} cx={p.x} cy={p.y} r="3.5" fill="currentColor" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-2">
        {data.map((d) => (
          <div key={d.label} className="text-center">
            <p className="text-sm font-bold text-text tabular-nums">{d.bookings}</p>
            <p className="text-[11px] text-muted">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricsView({ excursions }) {
  const { t } = useTranslation()
  const metrics = useMemo(() => getExcursionMetrics(excursions), [excursions])
  const avgTicket = metrics.totalBookings ? Math.round(metrics.totalRevenue / metrics.totalBookings) : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <KPICard index={0} icon={DollarSign} label={t('admin.excursions.metrics.revenue28')} value={`$${metrics.totalRevenue.toLocaleString()}`} color="bg-green-500" />
        <KPICard index={1} icon={Ticket} label={t('admin.excursions.metrics.seatsSold28')} value={metrics.totalBookings.toLocaleString()} color="bg-blue-500" />
        <KPICard index={2} icon={TrendingUp} label={t('admin.excursions.metrics.avgTicket')} value={`$${avgTicket}`} sub={t('admin.excursions.metrics.perSeat')} color="bg-purple-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={metrics.revenueByExcursion} />
        <TopPopular data={metrics.topPopular} />
        <WeekdayOccupancy data={metrics.occupancyByWeekday} />
        <TrendLine data={metrics.weeklyTrend} />
      </div>
    </div>
  )
}

export default function ExcursionsManagement() {
  const { t } = useTranslation()
  const [excursions, setExcursions] = useState(loadExcursions)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [managing, setManaging] = useState(null)
  const [tab, setTab] = useState('catalogue')
  const [creating, setCreating] = useState(false)

  // Persist the whole list so created excursions, capacity edits and status
  // toggles survive a refresh (demo has no backend).
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(excursions))
    } catch {
      /* storage full / unavailable — non-fatal for a demo */
    }
  }, [excursions])

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

  const createExcursion = (form) => {
    const base = slugify(form.name) || 'excursion'
    const ids = new Set(excursions.map((e) => e.id))
    let id = base
    let n = 2
    while (ids.has(id)) id = `${base}-${n++}` // guarantee a unique id
    const uid = id.slice(0, 6)
    const cap = form.defaultCapacity

    // Departures come from the recurrence spec when provided; otherwise fall back
    // to the classic two auto slots (today & tomorrow).
    let departures = []
    if (form.recurrence?.weekdays?.length && form.recurrence?.times?.length) {
      departures = buildRecurringDepartures({
        weekdays: form.recurrence.weekdays,
        times: form.recurrence.times,
        weeks: form.recurrence.weeks || 4,
        capacity: cap,
        startISO: todayISO(),
        idBase: uid
      })
    }
    if (departures.length === 0) {
      const today = todayISO()
      const tomorrow = new Date(Date.now() + 86400000)
      const tomorrowISO = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`
      departures = [
        { id: `${uid}-1`, date: today, time: '09:00', capacity: cap, booked: 0 },
        { id: `${uid}-2`, date: tomorrowISO, time: '14:00', capacity: cap, booked: 0 }
      ]
    }

    const newExcursion = {
      id,
      name: form.name,
      category: form.category,
      description: form.description,
      duration: form.duration,
      price: form.price,
      difficulty: form.difficulty,
      location: form.location,
      meetingPoint: form.meetingPoint,
      guide: form.guide,
      rating: 5.0,
      image: form.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
      included: [],
      status: 'active',
      departures
    }
    setExcursions((list) => [newExcursion, ...list])
    setTab('catalogue')
  }

  const tabs = [
    { id: 'catalogue', key: 'admin.excursions.tabs.catalogue', icon: LayoutGrid },
    { id: 'metrics', key: 'admin.excursions.tabs.metrics', icon: BarChart3 }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text">{t('admin.excursions.title')}</h2>
          <p className="text-sm text-muted">{t('admin.excursions.subtitle')}</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t('admin.excursions.add')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg border border-border rounded-lg w-full sm:w-auto sm:inline-flex">
        {tabs.map((tabItem) => {
          const activeTab = tab === tabItem.id
          return (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-text'
              }`}
            >
              <tabItem.icon className="w-4 h-4" />
              {t(tabItem.key)}
            </button>
          )
        })}
      </div>

      {tab === 'metrics' ? (
        <MetricsView excursions={excursions} />
      ) : (
        <>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard index={0} icon={Compass} label={t('admin.excursions.kpis.activeExcursions')} value={`${stats.activeCount}/${stats.total}`} color="bg-teal-500" />
        <KPICard index={1} icon={Calendar} label={t('admin.excursions.kpis.departuresToday')} value={stats.todaySlots} color="bg-blue-500" />
        <KPICard index={2} icon={Users} label={t('admin.excursions.kpis.seatsOccupancy')} value={`${stats.occupancy}%`} sub={t('admin.excursions.kpis.seatsToday', { booked: stats.seatsBooked, cap: stats.seatsCap })} color="bg-purple-500" />
        <KPICard index={3} icon={TrendingUp} label={t('admin.excursions.kpis.revenueToday')} value={`$${stats.revenue.toLocaleString()}`} color="bg-green-500" />
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder={t('admin.excursions.searchPlaceholder')}
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
            <option value="all">{t('admin.excursions.filters.allCategories')}</option>
            {EXCURSION_CATEGORIES.map((c) => (
              <option key={c} value={c}>{t(`admin.excursions.categories.${c}`)}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">{t('admin.excursions.filters.allStatus')}</option>
            <option value="active">{t('admin.excursions.filters.active')}</option>
            <option value="inactive">{t('admin.excursions.filters.inactive')}</option>
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
          <h3 className="text-lg font-medium text-text mb-1">{t('admin.excursions.empty.title')}</h3>
          <p className="text-sm text-muted">{t('admin.excursions.empty.subtitle')}</p>
        </div>
      )}
        </>
      )}

      <ManageModal
        excursion={managing}
        onClose={() => setManaging(null)}
        onSave={saveExcursion}
      />

      <CreateModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={createExcursion}
      />
    </div>
  )
}

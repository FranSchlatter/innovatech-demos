import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from '@shared-ui/components/DatePicker'
import {
  CalendarDays,
  Plus,
  X,
  Save,
  Trash2,
  Pencil,
  Ban,
  RotateCcw,
  MapPin,
  Clock,
  Users,
  Repeat,
  Image as ImageIcon,
  List,
  ChevronLeft,
  ChevronRight,
  CalendarCheck
} from 'lucide-react'
import { useEvents } from '../../../hooks/useEvents'
import { useTranslation } from '../../../i18n/LanguageProvider'
import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_OPTIONS,
  eventStatus,
  spotsLeft,
  formatEventDate,
  formatTimeRange,
  effectiveEventDate,
  getEventWeekdays,
  todayISO
} from '../../../data/mockEvents'
import { WEEKDAYS, weekdayOf, describeWeekdays } from '../../../data/recurrence'

// Status pill styling. Labels resolve at render time via t('admin.events.status.<id>').
const STATUS = {
  today: { cls: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
  upcoming: { cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  past: { cls: 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20' },
  cancelled: { cls: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' }
}

// Order events by relevance: today first, then upcoming, cancelled, past.
const STATUS_RANK = { today: 0, upcoming: 1, cancelled: 2, past: 3 }

const pad = (n) => String(n).padStart(2, '0')
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// ---------------------------------------------------------------- KPI card
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

// ---------------------------------------------------------------- Create / edit modal
function EventModal({ open, editing, initialDate, onClose, onSave }) {
  const { t } = useTranslation()
  const empty = {
    name: '',
    description: '',
    category: 'social',
    date: todayISO(),
    startTime: '19:00',
    endTime: '21:00',
    location: '',
    image: '',
    capacity: 30,
    weekdays: []
  }
  const [draft, setDraft] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraft(
      editing
        ? {
            name: editing.name,
            description: editing.description,
            category: editing.category,
            date: editing.date,
            startTime: editing.startTime,
            endTime: editing.endTime,
            location: editing.location,
            image: editing.image || '',
            capacity: editing.capacity,
            weekdays: getEventWeekdays(editing)
          }
        : { ...empty, date: initialDate || todayISO() }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing, initialDate])

  const recurring = draft.weekdays.length > 0
  const toggleRecurring = () =>
    setDraft((d) => ({ ...d, weekdays: d.weekdays.length ? [] : [weekdayOf(d.date)] }))
  const toggleWeekday = (value) =>
    setDraft((d) => ({
      ...d,
      weekdays: d.weekdays.includes(value)
        ? d.weekdays.filter((w) => w !== value)
        : [...d.weekdays, value]
    }))

  const capacityNum = Number(draft.capacity) || 0
  const valid =
    draft.name.trim() &&
    draft.location.trim() &&
    draft.date &&
    draft.startTime &&
    capacityNum > 0 &&
    (!draft.endTime || draft.endTime >= draft.startTime)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    const { weekdays, ...rest } = draft
    onSave({
      ...rest,
      name: draft.name.trim(),
      description: draft.description.trim(),
      location: draft.location.trim(),
      image: draft.image.trim(),
      capacity: capacityNum,
      // Keep the legacy boolean in sync so anything reading `recurring` still works.
      recurring: weekdays.length > 0,
      recurrence: { weekdays }
    })
    setSaving(false)
    onClose()
  }

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

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
            className="relative w-full max-w-lg bg-surface rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-text">{editing ? t('admin.events.modal.editTitle') : t('admin.events.modal.createTitle')}</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Image + preview / placeholder upload */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t('admin.events.modal.coverLabel')}</label>
                <div className="flex gap-3">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-bg border border-border flex-shrink-0 flex items-center justify-center">
                    {draft.image ? (
                      <img src={draft.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="url"
                      value={draft.image}
                      onChange={(e) => set({ image: e.target.value })}
                      placeholder={t('admin.events.modal.coverPlaceholder')}
                      className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-[11px] text-muted mt-1.5">
                      {t('admin.events.modal.coverHint')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t('admin.events.modal.categoryLabel')}</label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_CATEGORY_OPTIONS.map((opt) => {
                    const OptIcon = opt.icon
                    const active = draft.category === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => set({ category: opt.value })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          active
                            ? 'bg-primary text-primary-contrast border-primary'
                            : 'bg-bg text-muted border-border hover:border-primary'
                        }`}
                      >
                        <OptIcon className="w-3.5 h-3.5" />
                        {t(`admin.events.categories.${opt.value}`)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t('admin.events.modal.nameLabel')}</label>
                <input
                  type="text"
                  maxLength={70}
                  value={draft.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder={t('admin.events.modal.namePlaceholder')}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t('admin.events.modal.descriptionLabel')}</label>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={draft.description}
                  onChange={(e) => set({ description: e.target.value })}
                  placeholder={t('admin.events.modal.descriptionPlaceholder')}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <p className="text-[11px] text-muted mt-1 text-right">{draft.description.length}/200</p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t('admin.events.modal.locationLabel')}</label>
                <input
                  type="text"
                  maxLength={60}
                  value={draft.location}
                  onChange={(e) => set({ location: e.target.value })}
                  placeholder={t('admin.events.modal.locationPlaceholder')}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {recurring ? t('admin.events.modal.dateFromLabel') : t('admin.events.modal.dateLabel')}
                </label>
                <DatePicker
                  value={draft.date}
                  min={todayISO()}
                  onChange={(date) => set({ date })}
                />
              </div>

              {/* Times + capacity */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">{t('admin.events.modal.startLabel')}</label>
                  <input
                    type="time"
                    value={draft.startTime}
                    onChange={(e) => set({ startTime: e.target.value })}
                    className="w-full px-2 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">{t('admin.events.modal.endLabel')}</label>
                  <input
                    type="time"
                    value={draft.endTime}
                    min={draft.startTime}
                    onChange={(e) => set({ endTime: e.target.value })}
                    className="w-full px-2 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">{t('admin.events.modal.capacityLabel')}</label>
                  <input
                    type="number"
                    min={1}
                    value={draft.capacity}
                    onChange={(e) => set({ capacity: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Recurring */}
              <div className={`rounded-lg border transition-colors ${recurring ? 'border-primary/40 bg-primary/5' : 'border-border bg-bg'}`}>
                <button
                  type="button"
                  onClick={toggleRecurring}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-text">
                    <Repeat className="w-4 h-4 text-muted" /> {t('admin.events.modal.recurringToggle')}
                  </span>
                  <span className={`relative w-10 h-5 rounded-full transition-colors ${recurring ? 'bg-primary' : 'bg-border'}`}>
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        recurring ? 'translate-x-5' : ''
                      }`}
                    />
                  </span>
                </button>

                {/* Weekday picker — only when recurrence is on */}
                {recurring && (
                  <div className="px-4 pb-4 pt-1">
                    <p className="text-xs text-muted mb-2">{t('admin.events.modal.recurringHint')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {WEEKDAYS.map((w) => {
                        const active = draft.weekdays.includes(w.value)
                        return (
                          <button
                            key={w.value}
                            type="button"
                            onClick={() => toggleWeekday(w.value)}
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
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                {t('common.actions.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={!valid || saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? t('common.actions.saving') : editing ? t('admin.events.modal.saveChanges') : t('admin.events.modal.create')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------- Event card (list view)
function EventCard({ event, today, onEdit, onCancel, onDelete, t }) {
  const status = eventStatus(event, today)
  const st = STATUS[status]
  const cfg = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.social
  const CatIcon = cfg.icon
  const left = spotsLeft(event)
  const pct = event.capacity ? Math.min(100, Math.round((event.registered / event.capacity) * 100)) : 0
  const cancelled = event.cancelled
  const weekdays = getEventWeekdays(event)
  const shownDate = effectiveEventDate(event, today)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-surface rounded-xl border border-border overflow-hidden flex flex-col ${cancelled ? 'opacity-70' : ''}`}
    >
      {/* Cover */}
      <div className="relative h-32 bg-bg">
        {event.image ? (
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CalendarDays className="w-8 h-8 text-muted" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full text-white ${cfg.solid}`}>
          <CatIcon className="w-3 h-3" />
          {t(`admin.events.categories.${event.category}`)}
        </span>
        <span className={`absolute top-3 right-3 inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.cls}`}>
          {t(`admin.events.status.${status}`)}
        </span>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className={`font-bold truncate ${cancelled ? 'line-through' : ''}`}>{event.name}</h3>
          <p className="text-xs opacity-90 flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted mb-3 flex-wrap">
          <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{formatEventDate(shownDate, today)}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatTimeRange(event.startTime, event.endTime)}</span>
          {weekdays.length > 0 && (
            <span className="flex items-center gap-1"><Repeat className="w-3.5 h-3.5" />{describeWeekdays(weekdays)}</span>
          )}
        </div>

        {/* Registration progress */}
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-text font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-muted" />
            {t('admin.events.card.registered', { registered: event.registered, capacity: event.capacity })}
          </span>
          <span className={left === 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-muted'}>
            {left === 0 ? t('admin.events.card.full') : t('admin.events.card.spotsLeft', { count: left })}
          </span>
        </div>
        <div className="h-2 rounded-full bg-bg overflow-hidden mb-4">
          <div className={`h-full ${cfg.solid} transition-all`} style={{ width: `${pct}%` }} />
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onCancel(event.id)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              cancelled
                ? 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20'
                : 'bg-bg text-muted hover:text-text'
            }`}
          >
            {cancelled ? <><RotateCcw className="w-3.5 h-3.5" />{t('admin.events.card.reactivate')}</> : <><Ban className="w-3.5 h-3.5" />{t('admin.events.card.cancel')}</>}
          </button>
          <button
            onClick={() => onEdit(event)}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-bg transition-colors"
            title={t('admin.events.card.editTitle')}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-1.5 rounded-lg text-muted hover:text-red-500 transition-colors"
            title={t('admin.events.card.deleteTitle')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------- Monthly calendar view
function MonthCalendar({ events, today, onEdit, onCreateOnDate, t }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(today + 'T00:00:00')
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  // Split events once: one-offs land on their exact date; recurring events are
  // matched per-cell by weekday (from their start date onward), so a weekly
  // event shows on every matching day of the month, not just its anchor.
  const { byDate, recurring } = useMemo(() => {
    const map = {}
    const rec = []
    events.forEach((e) => {
      const wds = getEventWeekdays(e)
      if (wds.length) {
        rec.push({ event: e, weekdays: wds })
      } else {
        if (!map[e.date]) map[e.date] = []
        map[e.date].push(e)
      }
    })
    Object.values(map).forEach((list) => list.sort((a, b) => a.startTime.localeCompare(b.startTime)))
    return { byDate: map, recurring: rec }
  }, [events])

  // All event occurrences for a given cell (one-offs + recurring matches),
  // sorted by start time. Recurring hits are tagged so we can mark them.
  const eventsForDay = (iso, weekday) => {
    const oneOffs = (byDate[iso] || []).map((e) => ({ event: e, isOccurrence: false }))
    const recHits = recurring
      .filter(({ event, weekdays }) => weekdays.includes(weekday) && iso >= event.date)
      .map(({ event }) => ({ event, isOccurrence: iso !== event.date }))
    return [...oneOffs, ...recHits].sort((a, b) => a.event.startTime.localeCompare(b.event.startTime))
  }

  const cells = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const startWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const out = []
    for (let i = 0; i < startWeekday; i++) out.push(null)
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d))
    return out
  }, [viewMonth])

  const goPrev = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
  const goNext = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
  const goToday = () => {
    const d = new Date(today + 'T00:00:00')
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1))
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-text">
          {t('admin.events.calendar.months')[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={goToday} className="px-3 py-1.5 rounded-lg text-sm font-medium text-text hover:bg-bg transition-colors">
            {t('common.actions.today')}
          </button>
          <button onClick={goPrev} aria-label={t('admin.events.calendar.prevMonth')} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-bg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={goNext} aria-label={t('admin.events.calendar.nextMonth')} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-bg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {t('admin.events.calendar.weekdaysShort').map((w) => (
          <span key={w} className="text-[11px] font-medium text-muted text-center py-1">{w}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={`blank-${i}`} className="min-h-[84px]" />
          const iso = toISO(d)
          const dayEvents = eventsForDay(iso, d.getDay())
          const isToday = iso === today
          const canCreate = iso >= today
          return (
            <div
              key={iso}
              onClick={canCreate ? () => onCreateOnDate(iso) : undefined}
              role={canCreate ? 'button' : undefined}
              title={canCreate ? t('admin.events.calendar.createOnDay') : undefined}
              className={`group relative min-h-[84px] rounded-lg border p-1.5 flex flex-col gap-1 transition-colors ${
                isToday ? 'border-primary bg-primary/5' : 'border-border bg-bg'
              } ${canCreate ? 'cursor-pointer hover:border-primary' : ''}`}
            >
              <div className="flex items-center justify-between">
                {canCreate && (
                  <Plus className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <span className={`text-[11px] font-semibold ml-auto ${isToday ? 'text-primary' : 'text-muted'}`}>
                  {d.getDate()}
                </span>
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 3).map(({ event: e, isOccurrence }) => {
                  const cfg = EVENT_CATEGORIES[e.category] || EVENT_CATEGORIES.social
                  return (
                    <button
                      key={`${e.id}-${iso}`}
                      onClick={(ev) => { ev.stopPropagation(); onEdit(e) }}
                      title={`${e.startTime} · ${e.name}${isOccurrence ? t('admin.events.calendar.recurringSuffix') : ''}`}
                      className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded ${cfg.softBg} ${cfg.softText} hover:opacity-80 transition-opacity truncate ${
                        e.cancelled ? 'line-through opacity-60' : ''
                      }`}
                    >
                      {isOccurrence ? (
                        <Repeat className="inline-block w-2 h-2 mr-1 align-middle" />
                      ) : (
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1 align-middle`} />
                      )}
                      <span className="font-semibold tabular-nums">{e.startTime}</span> {e.name}
                    </button>
                  )
                })}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-muted px-1.5">{t('admin.events.calendar.moreEvents', { count: dayEvents.length - 3 })}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border">
        {EVENT_CATEGORY_OPTIONS.map((opt) => {
          const cfg = EVENT_CATEGORIES[opt.value]
          return (
            <span key={opt.value} className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              {t(`admin.events.categories.${opt.value}`)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Main
export default function EventsManagement() {
  const { t } = useTranslation()
  const { events, addEvent, updateEvent, deleteEvent, toggleCancel } = useEvents()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [createDate, setCreateDate] = useState(null) // pre-filled date when creating from the calendar
  const [tab, setTab] = useState('list') // 'list' | 'calendar'
  const [categoryFilter, setCategoryFilter] = useState('all')

  const today = todayISO()

  const stats = useMemo(() => {
    const upcoming = events.filter((e) => !e.cancelled && e.date >= today)
    const totalRegistered = events.reduce((s, e) => s + (e.registered || 0), 0)
    const upcomingCap = upcoming.reduce((s, e) => s + (e.capacity || 0), 0)
    const upcomingReg = upcoming.reduce((s, e) => s + (e.registered || 0), 0)
    return {
      total: events.length,
      upcoming: upcoming.length,
      totalRegistered,
      occupancy: upcomingCap ? Math.round((upcomingReg / upcomingCap) * 100) : 0
    }
  }, [events, today])

  const sorted = useMemo(
    () =>
      [...events]
        .filter((e) => categoryFilter === 'all' || e.category === categoryFilter)
        .sort((a, b) => {
          const ra = STATUS_RANK[eventStatus(a, today)]
          const rb = STATUS_RANK[eventStatus(b, today)]
          if (ra !== rb) return ra - rb
          return (a.date + a.startTime).localeCompare(b.date + b.startTime)
        }),
    [events, categoryFilter, today]
  )

  const openCreate = () => {
    setEditing(null)
    setCreateDate(null)
    setModalOpen(true)
  }
  const openCreateOnDate = (iso) => {
    setEditing(null)
    setCreateDate(iso)
    setModalOpen(true)
  }
  const openEdit = (item) => {
    setEditing(item)
    setCreateDate(null)
    setModalOpen(true)
  }
  const handleSave = (draft) => {
    if (editing) updateEvent(editing.id, draft)
    else addEvent(draft)
  }
  const handleDelete = (id) => {
    if (window.confirm(t('admin.events.deleteConfirm'))) deleteEvent(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> {t('admin.events.title')}
          </h1>
          <p className="text-sm text-muted">
            {t('admin.events.subtitle')}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> {t('admin.events.create')}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard index={0} icon={CalendarDays} label={t('admin.events.kpis.total')} value={stats.total} color="bg-indigo-500" />
        <KPICard index={1} icon={CalendarCheck} label={t('admin.events.kpis.upcoming')} value={stats.upcoming} color="bg-blue-500" />
        <KPICard index={2} icon={Users} label={t('admin.events.kpis.registered')} value={stats.totalRegistered} color="bg-emerald-500" />
        <KPICard index={3} icon={Users} label={t('admin.events.kpis.occupancy')} value={`${stats.occupancy}%`} color="bg-amber-500" />
      </div>

      {/* Tabs + filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <button
            onClick={() => setTab('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'list' ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-text'
            }`}
          >
            <List className="w-4 h-4" /> {t('admin.events.tabs.list')}
          </button>
          <button
            onClick={() => setTab('calendar')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'calendar' ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-text'
            }`}
          >
            <CalendarDays className="w-4 h-4" /> {t('admin.events.tabs.calendar')}
          </button>
        </div>

        {tab === 'list' && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">{t('admin.events.filterAll')}</option>
            {EVENT_CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{t(`admin.events.categories.${o.value}`)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Content */}
      {tab === 'calendar' ? (
        <MonthCalendar events={events} today={today} onEdit={openEdit} onCreateOnDate={openCreateOnDate} t={t} />
      ) : sorted.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border text-center py-12">
          <CalendarDays className="w-10 h-10 mx-auto text-muted mb-2" />
          <p className="text-sm text-muted">{categoryFilter !== 'all' ? t('admin.events.emptyInCategory') : t('admin.events.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {sorted.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                today={today}
                onEdit={openEdit}
                onCancel={toggleCancel}
                onDelete={handleDelete}
                t={t}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <EventModal
        open={modalOpen}
        editing={editing}
        initialDate={createDate}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

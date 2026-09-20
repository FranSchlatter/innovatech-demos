import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ConciergeBell, LogIn, LogOut, DoorOpen, Percent, Search, User, BedDouble,
  Calendar, Clock, X, KeyRound, History, CheckCircle2, CircleDot, ArrowRight,
  Smartphone, Wallet
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useCurrency } from '../../../hooks/useCurrency'
import { useTranslation } from '../../../i18n/LanguageProvider'
import CheckInStation from '../../client/checkin/CheckInStation'
import { reservationBucket } from '../../../hooks/useReservations'
import { hydrateStationData, stationProgress } from '../../../data/admin/checkinStation'

// H26 — Front-desk reception station. One list of every reservation with quick
// arrival/in-house/departure filters, a resumable check-in wizard (shared with
// the guest portal), quick check-out and a per-reservation status timeline.
// Reads the unified reservations store (via useAdminData) so anything done here
// reflects instantly in the Dashboard, Calendar and KPIs.

const STATUS_META = {
  confirmed: { chip: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', labelKey: 'confirmed' },
  'checked-in': { chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', labelKey: 'inStay' },
  'checked-out': { chip: 'bg-gray-400/10 text-gray-500 dark:text-gray-400', dot: 'bg-gray-400', labelKey: 'checkedOut' },
  cancelled: { chip: 'bg-red-500/10 text-red-600 dark:text-red-400', dot: 'bg-red-500', labelKey: 'cancelled' },
}
const statusMeta = (s) => STATUS_META[s] || STATUS_META.confirmed

const FILTERS = ['all', 'arrivals', 'inhouse', 'departures', 'upcoming']

const localDayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const fmtDate = (str) => (str ? new Date(`${str}T00:00:00`).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) : '—')
const fmtDateTime = (iso) => (iso ? new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—')

function KpiCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg grid place-items-center flex-shrink-0 ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-text leading-none">{value}</p>
        <p className="text-xs text-muted truncate">{label}</p>
      </div>
    </div>
  )
}

export default function ReceptionManagement() {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const { reservations, rooms, reservationsStore } = useAdminData()
  const [filter, setFilter] = useState('arrivals')
  const [query, setQuery] = useState('')
  const [station, setStation] = useState(null) // reservation being checked in
  const [timeline, setTimeline] = useState(null) // reservation whose timeline is shown

  const today = localDayISO()

  // Available rooms to offer during assignment (currently free).
  const availableRooms = useMemo(
    () => rooms.filter((r) => r.status === 'available').map((r) => ({ id: r.id, number: r.roomNumber, floor: r.floor, type: r.type })),
    [rooms]
  )

  const counts = useMemo(() => {
    const c = { all: 0, arrivals: 0, inhouse: 0, departures: 0, upcoming: 0 }
    reservations.forEach((r) => {
      if (r.status === 'cancelled') return
      c.all += 1
      const b = reservationBucket(r, today)
      if (c[b] != null) c[b] += 1
    })
    return c
  }, [reservations, today])

  const kpis = useMemo(() => {
    const totalRooms = rooms.length
    const occupied = rooms.filter((r) => r.status === 'occupied').length
    return {
      arrivals: counts.arrivals,
      inhouse: counts.inhouse,
      departures: counts.departures,
      rate: totalRooms ? Math.round((occupied / totalRooms) * 100) : 0,
    }
  }, [counts, rooms])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reservations
      .filter((r) => r.status !== 'cancelled')
      .filter((r) => (filter === 'all' ? true : reservationBucket(r, today) === filter))
      .filter((r) => {
        if (!q) return true
        return (
          r.guestName?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q) ||
          String(r.assignedRoomNumber || r.roomNumber || '').includes(q)
        )
      })
      .sort((a, b) => (a.checkIn || '').localeCompare(b.checkIn || '') || (a.arrivalTime || '').localeCompare(b.arrivalTime || ''))
  }, [reservations, filter, query, today])

  const openStation = (reservation) => setStation(reservation)
  const handleCheckOut = (id) => reservationsStore.checkOut(id, 'reception')

  const handleComplete = ({ station: stationData, room, digitalKey, keyCards, mobileKey }) => {
    reservationsStore.checkIn(station.id, { station: stationData, room, digitalKey, keyCards, mobileKey, by: 'reception' })
  }
  const handleSaveProgress = (partial) => {
    if (station) reservationsStore.saveStation(station.id, partial, 'reception')
  }

  // Live reservation for the open station (so the resume banner sees fresh data).
  const stationReservation = station ? reservations.find((r) => r.id === station.id) || station : null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <ConciergeBell className="w-5 h-5 text-primary" /> {t('admin.reception.title')}
        </h1>
        <p className="text-sm text-muted">{t('admin.reception.subtitle')}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={LogIn} label={t('admin.reception.kpis.arrivals')} value={kpis.arrivals} tone="bg-amber-500/10 text-amber-500" />
        <KpiCard icon={BedDouble} label={t('admin.reception.kpis.inhouse')} value={kpis.inhouse} tone="bg-emerald-500/10 text-emerald-500" />
        <KpiCard icon={LogOut} label={t('admin.reception.kpis.departures')} value={kpis.departures} tone="bg-gray-400/10 text-gray-400" />
        <KpiCard icon={Percent} label={t('admin.reception.kpis.occupancy')} value={`${kpis.rate}%`} tone="bg-primary/10 text-primary" />
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 flex-1">
          {FILTERS.map((f) => {
            const active = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap text-sm font-medium border transition-colors ${active ? 'bg-primary text-primary-contrast border-primary' : 'bg-surface text-text border-border hover:bg-bg'}`}>
                {t(`admin.reception.filters.${f}`)}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-primary-contrast/20' : 'bg-bg'}`}>{counts[f]}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border sm:w-64">
          <Search className="w-4 h-4 text-muted flex-shrink-0" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('admin.reception.searchPlaceholder')}
            className="bg-transparent border-none outline-none text-sm text-text placeholder:text-muted w-full" />
        </div>
      </div>

      {/* Reservation list */}
      {visible.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-10 text-center text-muted">
          <ConciergeBell className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">{t('admin.reception.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {visible.map((r) => (
              <ReservationRow
                key={r.id}
                reservation={r}
                today={today}
                format={format}
                onCheckIn={() => openStation(r)}
                onCheckOut={() => handleCheckOut(r.id)}
                onTimeline={() => setTimeline(r)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Check-in station (reception mode) */}
      <CheckInStation
        open={!!station}
        onClose={() => setStation(null)}
        reservation={stationReservation}
        mode="reception"
        availableRooms={availableRooms}
        onComplete={handleComplete}
        onSaveProgress={handleSaveProgress}
      />

      {/* Status timeline */}
      <AnimatePresence>
        {timeline && <TimelineModal reservation={timeline} onClose={() => setTimeline(null)} />}
      </AnimatePresence>
    </div>
  )
}

function ReservationRow({ reservation: r, today, format, onCheckIn, onCheckOut, onTimeline }) {
  const { t } = useTranslation()
  const meta = statusMeta(r.status)
  const bucket = reservationBucket(r, today)
  const roomLabel = r.assignedRoomNumber || r.roomNumber || t('admin.reception.unassigned')

  // Pre-check-in progress (resumable online / desk progress) for non-checked-in.
  const progress = useMemo(() => {
    if (r.status !== 'confirmed' || !r.station) return null
    return stationProgress(r, hydrateStationData(r, r.station), 'reception')
  }, [r])
  const startedOnline = r.station?.lastUpdatedBy === 'guest'

  return (
    <motion.div
      layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
      className="bg-surface rounded-xl border border-border p-4 flex flex-col md:flex-row md:items-center gap-4"
    >
      {/* Guest + status */}
      <div className="flex items-center gap-3 min-w-0 md:w-64">
        <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center flex-shrink-0">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-text truncate">{r.guestName}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${meta.chip}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} /> {t(`admin.calendar.statuses.${meta.labelKey}`)}
          </span>
        </div>
      </div>

      {/* Stay facts */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        <Fact icon={DoorOpen} label={t('admin.reception.room')} value={roomLabel} className="capitalize" />
        <Fact icon={BedDouble} label={t('admin.reception.type')} value={r.roomType} className="capitalize" />
        <Fact icon={Calendar} label={t('admin.reception.dates')} value={`${fmtDate(r.checkIn)} → ${fmtDate(r.checkOut)}`} />
        <Fact icon={Wallet} label={t('admin.reception.balance')} value={format(Math.max(0, (r.totalAmount || 0) - (r.amountPaid || 0)))} />
      </div>

      {/* Pre-check-in progress */}
      {progress && progress.done > 0 && progress.done < progress.total && (
        <div className="md:w-40">
          <div className="flex items-center justify-between text-[11px] text-muted mb-1">
            <span className="flex items-center gap-1">
              {startedOnline && <Smartphone className="w-3 h-3 text-emerald-500" />}
              {t('admin.reception.preCheckin')}
            </span>
            <span>{progress.done}/{progress.total}</span>
          </div>
          <div className="h-1.5 rounded-full bg-bg overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={onTimeline} className="h-9 w-9 grid place-items-center rounded-lg border border-border text-muted hover:text-text hover:bg-bg transition-colors" title={t('admin.reception.timeline')}>
          <History className="w-4 h-4" />
        </button>
        {r.status === 'checked-in' ? (
          <button onClick={onCheckOut} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors">
            <LogOut className="w-4 h-4" /> {t('admin.reception.checkOut')}
          </button>
        ) : r.status === 'checked-out' ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-gray-400/10 text-muted">
            <CheckCircle2 className="w-4 h-4" /> {t('admin.reception.done')}
          </span>
        ) : (
          <button onClick={onCheckIn} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
            <LogIn className="w-4 h-4" />
            {progress && progress.done > 0 ? t('admin.reception.continueCheckin') : t('admin.reception.checkIn')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

function Fact({ icon: Icon, label, value, className = '' }) {
  return (
    <div className="min-w-0">
      <span className="text-[11px] text-muted flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</span>
      <p className={`text-text font-medium truncate ${className}`}>{value}</p>
    </div>
  )
}

function TimelineModal({ reservation: r, onClose }) {
  const { t } = useTranslation()
  // Synthesize the full lifecycle: created → any recorded transitions.
  const events = useMemo(() => {
    const list = [{ status: 'confirmed', at: r.createdAt ? `${r.createdAt}T00:00:00` : null, by: 'system' }]
    ;(r.statusHistory || []).forEach((e) => list.push(e))
    return list
  }, [r])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60" />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-surface rounded-2xl border border-border p-6 w-full max-w-md">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-text transition-colors"><X className="w-5 h-5" /></button>
        <h3 className="text-lg font-bold text-text mb-1 flex items-center gap-2"><History className="w-4 h-4 text-primary" /> {t('admin.reception.timelineTitle')}</h3>
        <p className="text-sm text-muted mb-5">{r.guestName} · {r.id}</p>

        <ol className="relative border-l border-border ml-2 space-y-5">
          {events.map((e, i) => {
            const meta = statusMeta(e.status)
            const isLast = i === events.length - 1
            return (
              <li key={i} className="ml-4">
                <span className={`absolute -left-[7px] w-3.5 h-3.5 rounded-full border-2 border-surface ${meta.dot}`} />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-text">{t(`admin.calendar.statuses.${meta.labelKey}`)}</span>
                  {isLast && <CircleDot className="w-3.5 h-3.5 text-accent" />}
                </div>
                <p className="text-xs text-muted">{fmtDateTime(e.at)}{e.by ? ` · ${t(`admin.reception.by.${e.by}`)}` : ''}</p>
              </li>
            )
          })}
        </ol>

        {r.status === 'checked-in' && r.digitalKey && (
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-accent" /> {t('admin.reception.digitalKey')}</span>
            <span className="font-mono font-bold text-accent">{r.digitalKey}</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

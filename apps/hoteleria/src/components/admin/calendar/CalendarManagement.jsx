import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, ChevronLeft, ChevronRight, X, User, BedDouble,
  LogIn, LogOut, DoorOpen, Percent, Plus, Mail, Phone, MessageSquare, DollarSign
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useTranslation } from '../../../i18n/LanguageProvider'
import CheckInStation from '../../client/checkin/CheckInStation'

// H6 — Tape Chart: horizontal Gantt of room occupancy.
// Y axis: rooms grouped by floor. X axis: a rolling window of days.
// Bars are reservations, colored by status. Hover shows a tooltip, click opens
// a detail modal, clicking an empty cell opens a quick "new reservation" form.

const DAYS = 14
const COL_W = 46
const LABEL_W = 92
const ROW_H = 40
const HEADER_H = 48

const ROOM_TYPES = ['standard', 'economy', 'deluxe', 'premium', 'suite', 'family', 'presidential']

// Suggested nightly rate (USD) per room type — used to pre-fill the new-reservation form.
const SUGGESTED_PRICE = {
  economy: 90,
  standard: 140,
  family: 280,
  deluxe: 240,
  premium: 320,
  suite: 450,
  presidential: 900
}
const suggestedPriceFor = (type) => SUGGESTED_PRICE[type] || 150

// Bar/chip/dot styles per reservation status. Labels are resolved at render
// via admin.calendar.statuses.<labelKey>.
const STATUS = {
  confirmed: { bar: 'bg-blue-500/85 border-blue-600 hover:bg-blue-500', chip: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', labelKey: 'confirmed' },
  'checked-in': { bar: 'bg-emerald-500/85 border-emerald-600 hover:bg-emerald-500', chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', labelKey: 'inStay' },
  'checked-out': { bar: 'bg-gray-400/80 border-gray-500 hover:bg-gray-400', chip: 'bg-gray-400/10 text-gray-500 dark:text-gray-400', dot: 'bg-gray-400', labelKey: 'checkedOut' },
  cancelled: { bar: 'bg-red-500/55 border-red-600 hover:bg-red-500/80', chip: 'bg-red-500/10 text-red-600 dark:text-red-400', dot: 'bg-red-500', labelKey: 'cancelled' }
}
const statusOf = (s) => STATUS[s] || STATUS.confirmed
const statusLabel = (s, t) => t(`admin.calendar.statuses.${statusOf(s).labelKey}`)

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}
function toKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function diffDays(a, b) {
  return Math.round((a - b) / 86400000)
}
function fmtShort(str) {
  return parseDate(str).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

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

export default function CalendarManagement() {
  const { t } = useTranslation()
  // Unified reservations store (H26) — shared live with Dashboard & Reception.
  const { reservations, rooms, reservationsStore } = useAdminData()
  const [weekOffset, setWeekOffset] = useState(0) // scroll the window by whole weeks
  const [tip, setTip] = useState(null) // { res, x, y }
  const [detail, setDetail] = useState(null) // reservation
  const [createTarget, setCreateTarget] = useState(null) // { room, date }
  const [station, setStation] = useState(null) // reservation being checked in
  const scrollRef = useRef(null)

  // Available rooms offered during check-in assignment.
  const availableRooms = useMemo(
    () => rooms.filter((r) => r.status === 'available').map((r) => ({ id: r.id, number: r.roomNumber, floor: r.floor, type: r.type })),
    [rooms]
  )

  // Front-desk check-out (quick). Check-in goes through the full station wizard.
  const handleCheckOut = (id) => {
    reservationsStore.checkOut(id, 'reception')
    setDetail((d) => (d && d.id === id ? { ...d, status: 'checked-out' } : d))
  }

  // Open the shared check-in station for a reservation (from the detail modal).
  const openCheckInStation = (reservation) => {
    setDetail(null)
    setStation(reservation)
  }
  const handleStationComplete = ({ station: stationData, room, digitalKey, keyCards, mobileKey }) => {
    if (station) reservationsStore.checkIn(station.id, { station: stationData, room, digitalKey, keyCards, mobileKey, by: 'reception' })
  }
  const handleStationSave = (partial) => {
    if (station) reservationsStore.saveStation(station.id, partial, 'reception')
  }
  const stationReservation = station ? reservations.find((r) => r.id === station.id) || station : null

  // Rolling day window (start shifts by whole weeks via the arrows).
  const days = useMemo(() => {
    const start = addDays(startOfToday(), weekOffset * 7)
    return Array.from({ length: DAYS }, (_, i) => addDays(start, i))
  }, [weekOffset])
  const windowStart = days[0]
  const todayKey = toKey(startOfToday())

  // Rooms present in the data, grouped by floor.
  const floors = useMemo(() => {
    const map = {}
    reservations.forEach((r) => {
      if (!r.roomNumber) return
      if (!map[r.roomNumber]) {
        map[r.roomNumber] = { number: r.roomNumber, floor: parseInt(r.roomNumber[0], 10) || 0, type: r.roomType }
      }
    })
    const rooms = Object.values(map).sort((a, b) => a.number.localeCompare(b.number))
    const floorNums = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b)
    return floorNums.map((f) => ({ floor: f, rooms: rooms.filter((r) => r.floor === f) }))
  }, [reservations])

  const totalRooms = useMemo(() => floors.reduce((sum, f) => sum + f.rooms.length, 0), [floors])

  // Bars for a given room within the current window.
  const barsForRoom = (roomNumber) =>
    reservations
      .filter((r) => r.roomNumber === roomNumber)
      .map((r) => {
        const offset = diffDays(parseDate(r.checkIn), windowStart)
        const nights = Math.max(1, diffDays(parseDate(r.checkOut), parseDate(r.checkIn)))
        const from = Math.max(0, offset)
        const to = Math.min(DAYS, offset + nights)
        if (to <= 0 || from >= DAYS) return null
        return { res: r, from, to, clipStart: offset < 0, clipEnd: offset + nights > DAYS }
      })
      .filter(Boolean)

  // KPIs relative to actual today (independent of the scrolled window).
  const kpis = useMemo(() => {
    const t = startOfToday()
    let occupied = 0
    let arrivals = 0
    let departures = 0
    reservations.forEach((r) => {
      if (r.status === 'cancelled') return
      const ci = parseDate(r.checkIn)
      const co = parseDate(r.checkOut)
      if (ci <= t && t < co && r.status !== 'checked-out') occupied++
      if (r.checkIn === todayKey) arrivals++
      if (r.checkOut === todayKey) departures++
    })
    return {
      occupied,
      arrivals,
      departures,
      available: Math.max(0, totalRooms - occupied),
      rate: totalRooms ? Math.round((occupied / totalRooms) * 100) : 0
    }
  }, [reservations, totalRooms, todayKey])

  const handleCreate = (form) => {
    const nights = Math.max(1, parseInt(form.nights, 10) || 1)
    const checkIn = parseDate(form.checkIn)
    const pricePerNight = Math.max(0, parseInt(form.pricePerNight, 10) || 0)
    const newRes = {
      id: `RES-C-${Date.now()}`,
      guestName: form.guestName.trim() || t('admin.calendar.create.unnamedGuest'),
      guestEmail: form.guestEmail.trim(),
      guestPhone: form.guestPhone.trim(),
      roomId: 0,
      roomNumber: form.roomNumber,
      roomType: form.roomType,
      checkIn: form.checkIn,
      checkOut: toKey(addDays(checkIn, nights)),
      guests: Math.max(1, parseInt(form.guests, 10) || 2),
      status: form.status,
      paymentStatus: 'pending',
      totalAmount: pricePerNight * nights,
      pricePerNight,
      specialRequests: form.specialRequests.trim(),
      createdAt: todayKey,
      arrivalTime: '14:00'
    }
    reservationsStore.addReservation(newRes)
    setCreateTarget(null)
  }

  const tipLeft = tip ? Math.min(tip.x + 14, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 228) : 0
  const tipTop = tip ? tip.y + 16 : 0

  const rangeLabel = `${fmtShort(toKey(days[0]))} – ${fmtShort(toKey(days[DAYS - 1]))}`

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> {t('admin.calendar.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.calendar.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((v) => v - 1)}
            className="h-9 w-9 grid place-items-center rounded-lg border border-border bg-surface text-text hover:bg-bg transition-colors"
            title={t('admin.calendar.prevWeek')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className={`h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${weekOffset === 0 ? 'bg-primary text-primary-contrast border-primary' : 'border-border bg-surface text-text hover:bg-bg'}`}
            title={t('admin.calendar.backToToday')}
          >
            {t('common.actions.today')}
          </button>
          <span className="text-xs text-muted w-32 text-center hidden sm:block">{rangeLabel}</span>
          <button
            onClick={() => setWeekOffset((v) => v + 1)}
            className="h-9 w-9 grid place-items-center rounded-lg border border-border bg-surface text-text hover:bg-bg transition-colors"
            title={t('admin.calendar.nextWeek')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard icon={Percent} label={t('admin.calendar.kpis.occupancyToday')} value={`${kpis.rate}%`} tone="bg-primary/10 text-primary" />
        <KpiCard icon={BedDouble} label={t('admin.calendar.kpis.occupiedRooms')} value={kpis.occupied} tone="bg-emerald-500/10 text-emerald-500" />
        <KpiCard icon={DoorOpen} label={t('admin.calendar.kpis.available')} value={kpis.available} tone="bg-blue-500/10 text-blue-500" />
        <KpiCard icon={LogIn} label={t('admin.calendar.kpis.arrivalsToday')} value={kpis.arrivals} tone="bg-amber-500/10 text-amber-500" />
        <KpiCard icon={LogOut} label={t('admin.calendar.kpis.departuresToday')} value={kpis.departures} tone="bg-gray-400/10 text-gray-400" />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        {Object.entries(STATUS).map(([key, s]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${s.dot}`} /> {t(`admin.calendar.statuses.${s.labelKey}`)}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-dashed border-border" /> {t('admin.calendar.availableLegend')}
        </span>
      </div>

      {/* Tape chart */}
      <div ref={scrollRef} className="overflow-auto max-h-[68vh] rounded-xl border border-border bg-surface">
        <div style={{ minWidth: LABEL_W + DAYS * COL_W }}>
          {/* Day header */}
          <div className="flex sticky top-0 z-20 bg-surface border-b border-border">
            <div
              className="sticky left-0 z-30 bg-surface border-r border-border flex items-center px-3"
              style={{ width: LABEL_W, height: HEADER_H }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{t('admin.calendar.roomColHeader')}</span>
            </div>
            {days.map((d, i) => {
              const weekend = d.getDay() === 0 || d.getDay() === 6
              const isToday = toKey(d) === todayKey
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center border-r border-border/60 flex-shrink-0 ${isToday ? 'bg-accent/10' : weekend ? 'bg-bg/50' : ''}`}
                  style={{ width: COL_W, height: HEADER_H }}
                >
                  <span className="text-[10px] uppercase text-muted">{d.toLocaleDateString('es-AR', { weekday: 'short' }).slice(0, 3)}</span>
                  <span className={`text-sm font-semibold ${isToday ? 'text-accent' : 'text-text'}`}>{d.getDate()}</span>
                </div>
              )
            })}
          </div>

          {/* Rows grouped by floor */}
          {floors.map((group) => (
            <div key={group.floor}>
              <div className="bg-bg border-b border-border" style={{ minWidth: LABEL_W + DAYS * COL_W }}>
                <div className="sticky left-0 inline-flex items-center gap-2 px-3 py-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{t('admin.calendar.floor', { floor: group.floor })}</span>
                </div>
              </div>

              {group.rooms.map((room) => (
                <div key={room.number} className="flex border-b border-border last:border-b-0">
                  {/* Room label */}
                  <div
                    className="sticky left-0 z-10 bg-surface border-r border-border flex items-center px-3 flex-shrink-0"
                    style={{ width: LABEL_W, height: ROW_H }}
                  >
                    <span className="text-sm font-medium text-text">{room.number}</span>
                  </div>

                  {/* Track */}
                  <div className="relative flex flex-shrink-0" style={{ height: ROW_H }}>
                    {days.map((d, i) => {
                      const weekend = d.getDay() === 0 || d.getDay() === 6
                      const isToday = toKey(d) === todayKey
                      return (
                        <button
                          key={i}
                          onClick={() => setCreateTarget({ room, date: d })}
                          title={t('admin.calendar.reserveTile', { room: room.number, date: fmtShort(toKey(d)) })}
                          className={`border-r border-border/50 last:border-r-0 flex-shrink-0 hover:bg-accent/5 transition-colors ${isToday ? 'bg-accent/[0.06]' : weekend ? 'bg-bg/40' : ''}`}
                          style={{ width: COL_W, height: ROW_H }}
                        />
                      )
                    })}

                    {/* Reservation bars */}
                    {barsForRoom(room.number).map(({ res, from, to, clipStart, clipEnd }) => {
                      const s = statusOf(res.status)
                      return (
                        <button
                          key={res.id}
                          onClick={() => setDetail(res)}
                          onMouseEnter={(e) => setTip({ res, x: e.clientX, y: e.clientY })}
                          onMouseMove={(e) => setTip({ res, x: e.clientX, y: e.clientY })}
                          onMouseLeave={() => setTip(null)}
                          className={`absolute top-1 bottom-1 border flex items-center px-1.5 text-[11px] font-medium text-white overflow-hidden transition-colors ${s.bar} ${clipStart ? 'rounded-l-none' : 'rounded-l-md'} ${clipEnd ? 'rounded-r-none' : 'rounded-r-md'}`}
                          style={{ left: from * COL_W + 2, width: (to - from) * COL_W - 4 }}
                        >
                          <span className="truncate">{res.guestName}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Cursor-follow tooltip */}
      {tip && (
        <div
          style={{ position: 'fixed', left: tipLeft, top: tipTop }}
          className="z-[60] pointer-events-none w-56 rounded-lg bg-surface border border-border shadow-xl p-3"
        >
          <p className="text-sm font-semibold text-text">{tip.res.guestName}</p>
          <p className="text-xs text-muted capitalize">{tip.res.roomType} · Hab. {tip.res.roomNumber}</p>
          <p className="text-xs text-muted mt-1">{fmtShort(tip.res.checkIn)} → {fmtShort(tip.res.checkOut)}</p>
          <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusOf(tip.res.status).chip}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusOf(tip.res.status).dot}`} /> {statusLabel(tip.res.status, t)}
          </span>
        </div>
      )}

      {/* Reservation detail modal */}
      <AnimatePresence>
        {detail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDetail(null)} className="absolute inset-0 bg-black/60" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-surface rounded-2xl border border-border p-6 w-full max-w-md"
            >
              <button onClick={() => setDetail(null)} className="absolute top-4 right-4 text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 grid place-items-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">{detail.guestName}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusOf(detail.status).chip}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusOf(detail.status).dot}`} /> {statusLabel(detail.status, t)}
                  </span>
                </div>
              </div>

              {/* Front-desk check-in / check-out */}
              {detail.status === 'confirmed' && (
                <button
                  onClick={() => openCheckInStation(detail)}
                  className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> {t('admin.calendar.detail.registerCheckin')}
                </button>
              )}
              {detail.status === 'checked-in' && (
                <button
                  onClick={() => handleCheckOut(detail.id)}
                  className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> {t('admin.calendar.detail.registerCheckout')}
                </button>
              )}
              {detail.status === 'checked-out' && (
                <p className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-gray-400/10 text-muted">
                  <LogOut className="w-4 h-4" /> {t('admin.calendar.detail.checkoutDone')}
                </p>
              )}

              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between"><dt className="text-muted">{t('admin.calendar.detail.reservation')}</dt><dd className="text-text font-medium">{detail.id}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">{t('admin.calendar.detail.room')}</dt><dd className="text-text font-medium capitalize">{detail.roomNumber} · {detail.roomType}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">{t('admin.calendar.detail.checkin')}</dt><dd className="text-text font-medium">{fmtShort(detail.checkIn)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">{t('admin.calendar.detail.checkout')}</dt><dd className="text-text font-medium">{fmtShort(detail.checkOut)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">{t('admin.calendar.detail.nights')}</dt><dd className="text-text font-medium">{Math.max(1, diffDays(parseDate(detail.checkOut), parseDate(detail.checkIn)))}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">{t('admin.calendar.detail.guests')}</dt><dd className="text-text font-medium">{detail.guests}</dd></div>
                {detail.totalAmount > 0 && (
                  <div className="flex justify-between"><dt className="text-muted">{t('admin.calendar.detail.total')}</dt><dd className="text-text font-bold">${detail.totalAmount}</dd></div>
                )}
                {detail.specialRequests && (
                  <div className="pt-2 border-t border-border">
                    <dt className="text-muted mb-0.5">{t('admin.calendar.detail.specialRequests')}</dt>
                    <dd className="text-text">{detail.specialRequests}</dd>
                  </div>
                )}
              </dl>

              {/* Contact block */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{t('admin.calendar.detail.guestContact')}</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-text">
                    <Mail className="w-4 h-4 text-muted flex-shrink-0" />
                    <span className="truncate">{detail.guestEmail || t('admin.calendar.detail.noEmail')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <Phone className="w-4 h-4 text-muted flex-shrink-0" />
                    <span>{detail.guestPhone || t('admin.calendar.detail.noPhone')}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <a
                    href={detail.guestPhone ? `tel:${detail.guestPhone.replace(/[^+\d]/g, '')}` : undefined}
                    aria-disabled={!detail.guestPhone}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-colors ${detail.guestPhone ? 'border-border text-text hover:bg-bg' : 'border-border text-muted opacity-50 pointer-events-none'}`}
                  >
                    <Phone className="w-4 h-4" /> {t('admin.calendar.detail.call')}
                  </a>
                  <a
                    href={detail.guestEmail ? `mailto:${detail.guestEmail}` : undefined}
                    aria-disabled={!detail.guestEmail}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-colors ${detail.guestEmail ? 'border-border text-text hover:bg-bg' : 'border-border text-muted opacity-50 pointer-events-none'}`}
                  >
                    <Mail className="w-4 h-4" /> {t('admin.calendar.detail.email')}
                  </a>
                  <a
                    href={detail.guestPhone ? `https://wa.me/${detail.guestPhone.replace(/[^\d]/g, '')}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!detail.guestPhone}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-opacity ${detail.guestPhone ? 'bg-primary text-primary-contrast hover:opacity-90' : 'bg-primary/40 text-primary-contrast opacity-50 pointer-events-none'}`}
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick create modal */}
      <AnimatePresence>
        {createTarget && (
          <CreateReservationModal
            target={createTarget}
            roomTypes={ROOM_TYPES}
            onClose={() => setCreateTarget(null)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>

      {/* Shared check-in station (reception mode) */}
      <CheckInStation
        open={!!station}
        onClose={() => setStation(null)}
        reservation={stationReservation}
        mode="reception"
        availableRooms={availableRooms}
        onComplete={handleStationComplete}
        onSaveProgress={handleStationSave}
      />
    </div>
  )
}

function CreateReservationModal({ target, roomTypes, onClose, onCreate }) {
  const { t } = useTranslation()
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [nights, setNights] = useState(2)
  const [guests, setGuests] = useState(2)
  const initialType = target.room.type || 'standard'
  const [roomType, setRoomType] = useState(initialType)
  const [pricePerNight, setPricePerNight] = useState(String(suggestedPriceFor(initialType)))
  const [priceTouched, setPriceTouched] = useState(false)
  const [status, setStatus] = useState('confirmed')
  const [specialRequests, setSpecialRequests] = useState('')
  const checkInKey = toKey(target.date)
  const nightsNum = Math.max(1, parseInt(nights, 10) || 1)
  const priceNum = Math.max(0, parseInt(pricePerNight, 10) || 0)
  const estimatedTotal = priceNum * nightsNum
  const suggested = suggestedPriceFor(roomType)

  // Keep the suggested nightly rate in sync with the room type until the user
  // overrides it manually.
  useEffect(() => {
    if (!priceTouched) setPricePerNight(String(suggested))
  }, [suggested, priceTouched])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/60" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-surface rounded-2xl border border-border p-6 w-full max-w-md"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-text transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-text mb-1 flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" /> {t('admin.calendar.create.title')}
        </h3>
        <p className="text-sm text-muted mb-4">{t('admin.calendar.create.subtitle', { room: target.room.number, date: fmtShort(checkInKey) })}</p>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 -mr-1">
          <div>
            <label className="text-sm text-muted mb-1.5 block">{t('admin.calendar.create.guest')}</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={t('admin.calendar.create.guestPlaceholder')}
              className="w-full px-3.5 py-2.5 bg-bg rounded-lg border border-border focus:border-primary outline-none text-sm text-text"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted mb-1.5 block">{t('admin.calendar.create.email')}</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder={t('admin.calendar.create.emailPlaceholder')}
                className="w-full px-3.5 py-2.5 bg-bg rounded-lg border border-border focus:border-primary outline-none text-sm text-text"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1.5 block">{t('admin.calendar.create.phone')}</label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder={t('admin.calendar.create.phonePlaceholder')}
                className="w-full px-3.5 py-2.5 bg-bg rounded-lg border border-border focus:border-primary outline-none text-sm text-text"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-muted mb-1.5 block">{t('admin.calendar.create.nights')}</label>
              <input
                type="number"
                min={1}
                value={nights}
                onChange={(e) => setNights(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg rounded-lg border border-border focus:border-primary outline-none text-sm text-text"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1.5 block">{t('admin.calendar.create.guests')}</label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg rounded-lg border border-border focus:border-primary outline-none text-sm text-text"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1.5 block">{t('admin.calendar.create.type')}</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg rounded-lg border border-border focus:border-primary outline-none text-sm text-text capitalize"
              >
                {roomTypes.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted">{t('admin.calendar.create.pricePerNight')}</label>
              <button
                type="button"
                onClick={() => { setPricePerNight(String(suggested)); setPriceTouched(false) }}
                className="text-xs text-primary hover:underline"
                title={t('admin.calendar.create.suggestedTitle', { type: roomType })}
              >
                {t('admin.calendar.create.suggested', { price: suggested })}
              </button>
            </div>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min={0}
                value={pricePerNight}
                onChange={(e) => { setPricePerNight(e.target.value); setPriceTouched(true) }}
                placeholder="0"
                className="w-full pl-9 pr-3.5 py-2.5 bg-bg rounded-lg border border-border focus:border-primary outline-none text-sm text-text"
              />
            </div>
            {estimatedTotal > 0 && (
              <p className="text-xs text-muted mt-1.5">{t('admin.calendar.create.estimatedTotal')} <span className="font-semibold text-text">${estimatedTotal}</span> ({nightsNum === 1 ? t('admin.calendar.create.nightOne', { count: nightsNum }) : t('admin.calendar.create.nightMany', { count: nightsNum })})</p>
            )}
          </div>
          <div>
            <label className="text-sm text-muted mb-1.5 block">{t('admin.calendar.create.status')}</label>
            <div className="grid grid-cols-2 gap-2">
              {['confirmed', 'checked-in'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${status === s ? `${statusOf(s).chip} border-current` : 'border-border text-muted hover:text-text'}`}
                >
                  {statusLabel(s, t)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-muted mb-1.5 block">{t('admin.calendar.create.specialRequests')}</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder={t('admin.calendar.create.specialRequestsPlaceholder')}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-bg rounded-lg border border-border focus:border-primary outline-none text-sm text-text resize-none"
            />
          </div>

          <button
            onClick={() => onCreate({ guestName, guestEmail, guestPhone, nights, guests, roomType, pricePerNight, status, specialRequests, roomNumber: target.room.number, checkIn: checkInKey })}
            className="w-full bg-primary text-primary-contrast py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity sticky bottom-0"
          >
            {t('admin.calendar.create.submit')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

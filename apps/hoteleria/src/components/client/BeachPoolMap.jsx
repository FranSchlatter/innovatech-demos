import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Waves, Umbrella, MapPin, Calendar, CheckCircle2, Info, Ban,
  ArrowLeft, ShoppingBag, Plus, Minus, ConciergeBell, Loader2, Sun
} from 'lucide-react'
import PoolMapCanvas, { MapLegend } from '../facilities/PoolMapCanvas'
import { useFacilities } from '../../hooks/useFacilities'
import { useTranslation } from '../../i18n/LanguageProvider'
import { useCurrency } from '../../hooks/useCurrency'
import {
  typeConfig, statusConfig, zoneLabel, describeSpot,
  POOLSIDE_MENU, POOLSIDE_CATEGORIES
} from '../../data/mockFacilities'

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

// Stable ids; labels resolved at render time via t().
const ZONE_FILTERS = [
  { id: null, key: 'all', icon: Waves },
  { id: 'pool', key: 'pool', icon: Waves },
  { id: 'beach', key: 'beach', icon: Umbrella }
]

// Guest-facing interactive beach/pool map (H23). A full-screen overlay opened
// from the Guest Portal's Services tab. Guests pick an available lounger, cabana
// or umbrella, reserve it for a stay date + time, and can order drinks & snacks
// "from their lounger". Shares the live board with the admin via useFacilities.
export default function BeachPoolMap({ open, onClose, guestName, roomNumber, stayDates = [], onReserve, onOrder }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const {
    facilities, counts, isMine, myReservations,
    reserveFacility, cancelReservation
  } = useFacilities()

  const [selectedId, setSelectedId] = useState(null)
  const [focusZone, setFocusZone] = useState(null)
  const [draftDate, setDraftDate] = useState('')
  const [draftTime, setDraftTime] = useState('')
  const [reserving, setReserving] = useState(false)
  const [toast, setToast] = useState(null)

  // Poolside ordering sub-view
  const [ordering, setOrdering] = useState(false)   // spot the order is tied to
  const [cart, setCart] = useState({})
  const [placing, setPlacing] = useState(false)

  // Derive the selected spot from LIVE state so it reflects a just-made booking.
  const selected = useMemo(
    () => facilities.find((s) => s.id === selectedId) || null,
    [facilities, selectedId]
  )

  const dateOptions = useMemo(
    () => stayDates.map((d) => ({
      iso: d.toISOString().split('T')[0],
      dow: d.toLocaleDateString('es-AR', { weekday: 'short' }),
      day: d.getDate(),
      mon: d.toLocaleDateString('es-AR', { month: 'short' })
    })),
    [stayDates]
  )

  // Reset transient state whenever the overlay opens.
  useEffect(() => {
    if (open) {
      setSelectedId(null)
      setFocusZone(null)
      setDraftDate(dateOptions[0]?.iso || '')
      setDraftTime('')
      setOrdering(false)
      setCart({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const flash = (message, kind = 'ok') => {
    setToast({ message, kind })
    setTimeout(() => setToast(null), 2600)
  }

  const selectSpot = (spot) => {
    setSelectedId(spot.id)
    setDraftTime('')
    if (!draftDate) setDraftDate(dateOptions[0]?.iso || '')
  }

  const handleReserve = async () => {
    if (!selected || !draftDate || !draftTime) return
    setReserving(true)
    await new Promise((r) => setTimeout(r, 700))
    const result = reserveFacility(selected.id, { guestName, date: draftDate, time: draftTime })
    setReserving(false)
    if (result === 'ok') {
      onReserve?.({
        spotId: selected.id,
        label: selected.label,
        describe: describeSpot(selected),
        type: selected.type,
        zone: selected.zone,
        price: selected.price,
        date: draftDate,
        time: draftTime
      })
      flash(t('client.pool.reservedToast', { label: selected.label }))
      setDraftTime('')
    } else {
      flash(t('client.pool.notAvailableToast'), 'error')
    }
  }

  const handleCancel = (spot) => {
    cancelReservation(spot.id)
    flash(t('client.pool.releasedToast', { label: spot.label }))
  }

  // ---- poolside ordering ----------------------------------------------------
  const openOrder = (spot) => {
    setOrdering(spot || myReservations[0] || null)
    setCart({})
  }
  const cartQty = (id) => cart[id] || 0
  const setQty = (id, delta) =>
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + delta)
      const copy = { ...c }
      if (next === 0) delete copy[id]
      else copy[id] = next
      return copy
    })
  const cartLines = useMemo(
    () => POOLSIDE_MENU.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] })),
    [cart]
  )
  const cartTotal = cartLines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const cartCount = cartLines.reduce((sum, l) => sum + l.qty, 0)

  const placeOrder = async () => {
    if (!cartLines.length) return
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 800))
    setPlacing(false)
    const spotLabel = ordering ? describeSpot(ordering) : t('client.pool.poolArea')
    onOrder?.({
      items: cartLines.map((l) => ({ name: l.name, qty: l.qty, price: l.price })),
      total: cartTotal,
      spotLabel
    })
    setOrdering(false)
    setCart({})
    flash(t('client.pool.orderSentToLounger'))
  }

  const hasReservation = myReservations.length > 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-bg sm:rounded-2xl shadow-xl overflow-hidden min-h-full sm:min-h-0 my-0 sm:my-6"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-4 bg-surface border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <Umbrella className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-text leading-tight truncate">{t('client.pool.title')}</h2>
                  <p className="text-xs text-muted truncate">
                    {t('client.pool.availableCount', { count: counts.available, room: roomNumber })}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors flex-shrink-0"
                aria-label={t('client.pool.closeMap')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {ordering ? (
                /* ---------------- Poolside ordering sub-view ------------------ */
                <motion.div
                  key="order"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2 }}
                  className="p-5"
                >
                  <button
                    onClick={() => setOrdering(false)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-text mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t('client.pool.backToMap')}
                  </button>

                  <div className="flex items-center gap-2 mb-1">
                    <ConciergeBell className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-bold text-text">{t('client.pool.orderFromLounger')}</h3>
                  </div>
                  <p className="text-sm text-muted mb-5">
                    {t('client.pool.deliveryTo', { spot: describeSpot(ordering) })}
                  </p>

                  {POOLSIDE_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="mb-6">
                      <h4 className="text-sm font-semibold text-text mb-3">{cat.label}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {POOLSIDE_MENU.filter((m) => m.category === cat.id).map((item) => {
                          const Icon = item.icon
                          const qty = cartQty(item.id)
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                                qty ? 'border-accent bg-surface' : 'border-border bg-surface'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-lg bg-bg flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-text text-sm truncate">{item.name}</p>
                                <p className="text-sm text-accent font-bold">{format(item.price)}</p>
                              </div>
                              {qty ? (
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => setQty(item.id, -1)}
                                    className="w-7 h-7 rounded-lg bg-bg border border-border flex items-center justify-center text-text hover:border-accent"
                                    aria-label={t('client.pool.removeOne')}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-5 text-center font-bold text-text">{qty}</span>
                                  <button
                                    onClick={() => setQty(item.id, 1)}
                                    className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center hover:opacity-90"
                                    aria-label={t('client.pool.addOne')}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setQty(item.id, 1)}
                                  className="flex-shrink-0 inline-flex items-center gap-1 bg-accent text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:opacity-90"
                                >
                                  <Plus className="w-4 h-4" /> {t('client.pool.add')}
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Order summary bar */}
                  <div className="sticky bottom-0 -mx-5 px-5 py-4 bg-surface border-t border-border flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted">{cartCount !== 1 ? t('client.pool.itemsCountPlural', { count: cartCount }) : t('client.pool.itemsCount', { count: cartCount })}</p>
                      <p className="text-lg font-bold text-text">{format(cartTotal)}</p>
                    </div>
                    <button
                      onClick={placeOrder}
                      disabled={!cartLines.length || placing}
                      className="inline-flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {placing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
                      {placing ? t('client.pool.sending') : t('client.pool.sendOrder')}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ---------------- Map + detail view -------------------------- */
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-5"
                >
                  {/* Map column */}
                  <div className="space-y-3">
                    {/* Zone filter + poolside order shortcut */}
                    <div className="flex flex-wrap items-center gap-2">
                      {ZONE_FILTERS.map((z) => {
                        const active = focusZone === z.id
                        return (
                          <button
                            key={z.key}
                            onClick={() => setFocusZone(z.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                              active ? 'bg-accent text-white border-accent' : 'bg-surface text-muted border-border hover:border-accent'
                            }`}
                          >
                            <z.icon className="w-4 h-4" /> {t(`client.pool.filters.${z.key}`)}
                          </button>
                        )
                      })}
                      {hasReservation && (
                        <button
                          onClick={() => openOrder(myReservations[0])}
                          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary text-primary-contrast hover:opacity-90 transition"
                        >
                          <ConciergeBell className="w-4 h-4" /> {t('client.pool.orderFromLounger')}
                        </button>
                      )}
                    </div>

                    <PoolMapCanvas
                      spots={facilities}
                      selectedId={selectedId}
                      onSelect={selectSpot}
                      mineIds={myReservations.map((s) => s.id)}
                      focusZone={focusZone}
                    />

                    <MapLegend />
                  </div>

                  {/* Detail panel */}
                  <div className="lg:sticky lg:top-20 h-fit">
                    <SpotDetail
                      spot={selected}
                      isMine={selected ? isMine(selected.id) : false}
                      dateOptions={dateOptions}
                      draftDate={draftDate}
                      setDraftDate={setDraftDate}
                      draftTime={draftTime}
                      setDraftTime={setDraftTime}
                      reserving={reserving}
                      onReserve={handleReserve}
                      onCancel={handleCancel}
                      onOrder={openOrder}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white flex items-center gap-2 ${
                    toast.kind === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                >
                  {toast.kind === 'error' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {toast.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ------------------------------------------------------------- detail panel
function SpotDetail({ spot, isMine, dateOptions, draftDate, setDraftDate, draftTime, setDraftTime, reserving, onReserve, onCancel, onOrder }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  if (!spot) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center mx-auto mb-3">
          <Sun className="w-6 h-6 text-accent" />
        </div>
        <h3 className="font-bold text-text mb-1">{t('client.pool.detail.pickSpotTitle')}</h3>
        <p className="text-sm text-muted">
          {t('client.pool.detail.pickSpotHelpBefore')} <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t('client.pool.detail.pickSpotHelpLink')}</span> {t('client.pool.detail.pickSpotHelpAfter')}
        </p>
      </div>
    )
  }

  const tCfg = typeConfig(spot.type)
  const sCfg = statusConfig(spot.status)
  const TypeIcon = tCfg.icon
  const available = spot.status === 'available'

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-bg flex items-center justify-center flex-shrink-0">
            <TypeIcon className="w-5 h-5 text-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text leading-tight">{spot.label}</h3>
            <p className="flex items-center gap-1 text-xs text-muted">
              <MapPin className="w-3 h-3" /> {tCfg.label} · {zoneLabel(spot.zone)}
            </p>
          </div>
          <span className={`ml-auto flex-shrink-0 text-[11px] font-semibold px-2 py-1 rounded-md border ${sCfg.softBg} ${sCfg.softText} ${sCfg.softBorder}`}>
            {sCfg.label}
          </span>
        </div>

        <p className="text-sm text-muted mb-4">{tCfg.blurb}</p>

        {spot.price > 0 && (
          <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-border">
            <span className="text-muted">{t('client.pool.detail.pricePerDay')}</span>
            <span className="text-lg font-bold text-accent">{format(spot.price)}</span>
          </div>
        )}

        {/* --- available → reservation form --- */}
        {available && (
          <>
            <label className="block text-xs font-semibold text-muted mb-2">{t('client.pool.detail.dateLabel')}</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {dateOptions.map((d) => {
                const sel = draftDate === d.iso
                return (
                  <button
                    key={d.iso}
                    onClick={() => setDraftDate(d.iso)}
                    className={`flex flex-col items-center py-2 rounded-lg border transition ${
                      sel ? 'bg-accent text-white border-accent' : 'bg-bg border-border hover:border-accent'
                    }`}
                  >
                    <span className={`text-[10px] uppercase ${sel ? 'text-white/80' : 'text-muted'}`}>{d.dow}</span>
                    <span className="text-base font-bold leading-tight">{d.day}</span>
                    <span className={`text-[10px] ${sel ? 'text-white/80' : 'text-muted'}`}>{d.mon}</span>
                  </button>
                )
              })}
            </div>

            <label className="block text-xs font-semibold text-muted mb-2">{t('client.pool.detail.arrivalTimeLabel')}</label>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setDraftTime(t)}
                  className={`py-1.5 rounded-lg text-sm font-medium transition ${
                    draftTime === t ? 'bg-accent text-white' : 'bg-bg text-text hover:opacity-80 border border-border'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={onReserve}
              disabled={!draftDate || !draftTime || reserving}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reserving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {reserving ? t('client.pool.detail.reserving') : t('client.pool.detail.reserveThisSpot')}
            </button>
          </>
        )}

        {/* --- mine → cancel + poolside order --- */}
        {isMine && !available && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 rounded-lg p-3">
              <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                {t('client.pool.detail.yourReservation')}
                {spot.reservedFor?.date && <> · {spot.reservedFor.date}</>}
                {spot.reservedFor?.time && <> {t('client.pool.detail.atTime', { time: spot.reservedFor.time })}</>}
              </span>
            </div>
            <button
              onClick={() => onOrder(spot)}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-contrast py-3 rounded-xl font-bold hover:opacity-90 transition"
            >
              <ConciergeBell className="w-5 h-5" /> {t('client.pool.orderFromLounger')}
            </button>
            <button
              onClick={() => onCancel(spot)}
              className="w-full inline-flex items-center justify-center gap-2 bg-bg text-rose-600 dark:text-rose-400 border border-border py-2.5 rounded-xl font-semibold hover:border-rose-500/40 transition"
            >
              <X className="w-4 h-4" /> {t('client.pool.detail.cancelReservation')}
            </button>
          </div>
        )}

        {/* --- taken by someone else --- */}
        {!available && !isMine && (
          <div className="flex items-start gap-2 text-sm bg-bg text-muted border border-border rounded-lg p-3">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
            <span>
              {t('client.pool.detail.takenBefore', { status: sCfg.label.toLowerCase() })}
              {spot.guestName ? t('client.pool.detail.takenBy', { name: spot.guestName }) : ''}{t('client.pool.detail.takenAfter')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

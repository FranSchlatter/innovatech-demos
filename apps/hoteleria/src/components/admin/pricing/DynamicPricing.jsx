import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Plus,
  X,
  Tag,
  Power,
  Trash2,
  Percent,
  Save,
  Lightbulb,
  Check,
  CalendarRange,
  Sun,
  Snowflake
} from 'lucide-react'
import {
  dynamicPricing,
  ROOM_TYPES,
  initialOffers,
  initialSeasons,
  offerStatus
} from '../../../data/admin/mockPricing'
import { useAdminData } from '../../../hooks/useAdminData'

const money = (ars) => `$${Math.round(ars / 1000)}K`

const REC = {
  subir: { label: 'Subir', icon: TrendingUp, cls: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  bajar: { label: 'Bajar', icon: TrendingDown, cls: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  mantener: { label: 'Mantener', icon: Minus, cls: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' }
}

const OFFER_STATUS = {
  active: { label: 'Active', cls: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
  scheduled: { label: 'Scheduled', cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  expired: { label: 'Expired', cls: 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20' },
  paused: { label: 'Paused', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' }
}

const STORAGE_KEY = 'hotel-pricing-config'
const typeLabel = (t) => ROOM_TYPES.find((r) => r.value === t)?.label || t
const todayStr = () => new Date().toISOString().split('T')[0]
const fmtDate = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const diffDays = (fromStr, toStr) =>
  Math.round((new Date(toStr + 'T00:00:00') - new Date(fromStr + 'T00:00:00')) / 86400000)

// ---------------------------------------------------------------- Create offer modal
function OfferModal({ open, onClose, onSave }) {
  const empty = { name: '', discount: 10, roomTypes: [], startDate: todayStr(), endDate: '' }
  const [draft, setDraft] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setDraft({ ...empty, startDate: todayStr() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const toggleType = (t) =>
    setDraft((d) => ({
      ...d,
      roomTypes: d.roomTypes.includes(t) ? d.roomTypes.filter((x) => x !== t) : [...d.roomTypes, t]
    }))

  const valid =
    draft.name.trim() &&
    draft.discount > 0 &&
    draft.roomTypes.length > 0 &&
    draft.startDate &&
    draft.endDate &&
    draft.endDate >= draft.startDate

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    onSave({ ...draft, id: `OFF-${Date.now()}`, discount: Number(draft.discount), enabled: true })
    setSaving(false)
    onClose()
  }

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
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-text">Create offer</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Offer name</label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Last-minute Weekend"
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Discount</label>
                <div className="flex items-center gap-2 w-40 px-3 py-2 bg-bg border border-border rounded-lg">
                  <Percent className="w-4 h-4 text-muted" />
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={draft.discount}
                    onChange={(e) => setDraft((d) => ({ ...d, discount: e.target.value }))}
                    className="flex-1 bg-transparent focus:outline-none text-sm text-text"
                  />
                </div>
              </div>

              {/* Room types */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Applicable room types</label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_TYPES.map((t) => {
                    const active = draft.roomTypes.includes(t.value)
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => toggleType(t.value)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          active
                            ? 'bg-primary text-primary-contrast border-primary'
                            : 'bg-bg text-muted border-border hover:border-primary'
                        }`}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Start date</label>
                  <input
                    type="date"
                    value={draft.startDate}
                    onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">End date</label>
                  <input
                    type="date"
                    value={draft.endDate}
                    min={draft.startDate}
                    onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!valid || saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Create offer'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------- Add season modal
function SeasonModal({ open, onClose, onSave }) {
  const empty = { name: '', startDate: todayStr(), endDate: '', multiplier: 1.2 }
  const [draft, setDraft] = useState(empty)

  useEffect(() => {
    if (open) setDraft({ ...empty, startDate: todayStr() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const valid = draft.name.trim() && draft.startDate && draft.endDate && draft.endDate >= draft.startDate && draft.multiplier > 0

  const handleSave = () => {
    onSave({ ...draft, id: `SEA-${Date.now()}`, multiplier: Number(draft.multiplier) })
    onClose()
  }

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
            className="relative w-full max-w-md bg-surface rounded-xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarRange className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-text">Add season</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Season name</label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Peak Summer"
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Start date</label>
                  <input
                    type="date"
                    value={draft.startDate}
                    onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">End date</label>
                  <input
                    type="date"
                    value={draft.endDate}
                    min={draft.startDate}
                    onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Price multiplier <span className="text-muted font-normal">(e.g. 1.3 = +30%, 0.8 = −20%)</span>
                </label>
                <input
                  type="number"
                  step={0.05}
                  min={0.1}
                  value={draft.multiplier}
                  onChange={(e) => setDraft((d) => ({ ...d, multiplier: e.target.value }))}
                  className="w-40 px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!valid}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add season
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------- Main
export default function DynamicPricing() {
  const dp = dynamicPricing
  const maxNominal = Math.max(...dp.rows.map((r) => r.nominal))
  const { rooms, reservations } = useAdminData()

  // Persisted config (offers, seasons, dismissed/applied suggestions, lookahead).
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      /* ignore */
    }
    return {
      offers: initialOffers,
      seasons: initialSeasons,
      ignored: [],
      applied: [],
      lookahead: 3
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      /* ignore */
    }
  }, [config])

  const { offers, seasons, ignored, applied, lookahead } = config
  const setOffers = (updater) => setConfig((c) => ({ ...c, offers: typeof updater === 'function' ? updater(c.offers) : updater }))
  const setSeasons = (updater) => setConfig((c) => ({ ...c, seasons: typeof updater === 'function' ? updater(c.seasons) : updater }))

  const [showOfferModal, setShowOfferModal] = useState(false)
  const [showSeasonModal, setShowSeasonModal] = useState(false)

  // ---- Automatic suggestions: rooms with no booking in the lookahead window.
  const suggestions = useMemo(() => {
    const today = todayStr()
    const list = rooms
      .map((room) => {
        // Currently occupied? not idle.
        const occupiedNow = reservations.some(
          (r) => r.roomId === room.id && r.status === 'checked-in' && r.checkIn <= today && r.checkOut > today
        )
        if (occupiedNow) return null

        // Soonest upcoming booking.
        const upcoming = reservations
          .filter((r) => r.roomId === room.id && (r.status === 'confirmed' || r.status === 'checked-in') && r.checkIn >= today)
          .sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0]

        const daysUntilNext = upcoming ? diffDays(today, upcoming.checkIn) : Infinity
        if (daysUntilNext < lookahead) return null

        const discount = daysUntilNext === Infinity ? 20 : daysUntilNext >= 7 ? 15 : 10
        return {
          roomId: room.id,
          roomNumber: room.roomNumber,
          type: room.type,
          price: room.price,
          daysUntilNext,
          discount
        }
      })
      .filter(Boolean)
      .filter((s) => !ignored.includes(s.roomId) && !applied.includes(s.roomId))
      .sort((a, b) => b.daysUntilNext - a.daysUntilNext)
    return list.slice(0, 6)
  }, [rooms, reservations, ignored, applied, lookahead])

  const applySuggestion = (s) => {
    const today = todayStr()
    const end = new Date()
    end.setDate(end.getDate() + Math.min(14, Math.max(lookahead, 7)))
    const offer = {
      id: `OFF-${Date.now()}`,
      name: `Auto · Room ${s.roomNumber} −${s.discount}%`,
      discount: s.discount,
      roomTypes: [s.type],
      startDate: today,
      endDate: end.toISOString().split('T')[0],
      enabled: true,
      auto: true
    }
    setConfig((c) => ({ ...c, offers: [offer, ...c.offers], applied: [...c.applied, s.roomId] }))
  }

  const ignoreSuggestion = (s) => setConfig((c) => ({ ...c, ignored: [...c.ignored, s.roomId] }))
  const setLookahead = (v) => setConfig((c) => ({ ...c, lookahead: v }))

  const toggleOffer = (id) => setOffers((list) => list.map((o) => (o.id === id ? { ...o, enabled: !o.enabled } : o)))
  const deleteOffer = (id) => setOffers((list) => list.filter((o) => o.id !== id))
  const addOffer = (offer) => setOffers((list) => [offer, ...list])
  const addSeason = (season) => setSeasons((list) => [...list, season].sort((a, b) => a.startDate.localeCompare(b.startDate)))
  const deleteSeason = (id) => setSeasons((list) => list.filter((s) => s.id !== id))

  const activeOffers = offers.filter((o) => offerStatus(o) === 'active').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Tarifas y precio dinámico
        </h1>
        <p className="text-sm text-muted">Ofertas, sugerencias automáticas, temporadas y tarifa real deflactada — todo en un lugar.</p>
      </div>

      {/* ------------------------------------------------ Active offers */}
      <section className="bg-surface rounded-xl border border-border p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-text flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Ofertas activas
            </h2>
            <p className="text-xs text-muted">{activeOffers} activa{activeOffers === 1 ? '' : 's'} · {offers.length} en total</p>
          </div>
          <button
            onClick={() => setShowOfferModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Crear oferta
          </button>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="w-10 h-10 mx-auto text-muted mb-2" />
            <p className="text-sm text-muted">No hay ofertas. Creá la primera.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence initial={false}>
              {offers.map((offer) => {
                const status = offerStatus(offer)
                const st = OFFER_STATUS[status]
                return (
                  <motion.div
                    key={offer.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-bg rounded-xl border border-border p-4 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-text truncate flex items-center gap-1.5">
                          {offer.auto && <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                          {offer.name}
                        </h3>
                        <span className={`inline-flex items-center mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-primary whitespace-nowrap">−{offer.discount}%</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {offer.roomTypes.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-surface text-muted">
                          {typeLabel(t)}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-muted mb-3">
                      {fmtDate(offer.startDate)} → {fmtDate(offer.endDate)}
                    </p>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => toggleOffer(offer.id)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          offer.enabled
                            ? 'bg-surface text-muted hover:text-text'
                            : 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {offer.enabled ? 'Pausar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 transition-colors"
                        title="Eliminar oferta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ Automatic suggestions */}
      <section className="bg-surface rounded-xl border border-border p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-text flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Sugerencias automáticas
            </h2>
            <p className="text-xs text-muted">Habitaciones sin reserva en los próximos días.</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">Ventana:</span>
            <div className="flex items-center gap-1 bg-bg border border-border rounded-lg p-0.5">
              <button
                onClick={() => setLookahead(Math.max(1, lookahead - 1))}
                className="w-7 h-7 rounded-md hover:bg-surface flex items-center justify-center text-text"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-16 text-center font-semibold text-text">{lookahead} día{lookahead === 1 ? '' : 's'}</span>
              <button
                onClick={() => setLookahead(Math.min(14, lookahead + 1))}
                className="w-7 h-7 rounded-md hover:bg-surface flex items-center justify-center text-text"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <Check className="w-10 h-10 mx-auto text-green-500 mb-2" />
            <p className="text-sm text-muted">Sin sugerencias pendientes. Todas las habitaciones tienen buena ocupación.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {suggestions.map((s) => (
                <motion.div
                  key={s.roomId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="flex items-center gap-3 bg-bg rounded-xl p-3 border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text">
                      Room {s.roomNumber} <span className="font-normal text-muted">({typeLabel(s.type)})</span>
                    </p>
                    <p className="text-xs text-muted">
                      {s.daysUntilNext === Infinity
                        ? `Sin reservas próximas (más de 2 semanas)`
                        : `Próxima reserva en ${s.daysUntilNext} día${s.daysUntilNext === 1 ? '' : 's'}`}
                      {' · '}Sugerencia: <b className="text-primary">−{s.discount}%</b>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => applySuggestion(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Check className="w-3.5 h-3.5" /> Aplicar
                    </button>
                    <button
                      onClick={() => ignoreSuggestion(s)}
                      className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors"
                      title="Ignorar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ Seasons */}
      <section className="bg-surface rounded-xl border border-border p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-text flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-primary" /> Temporadas
            </h2>
            <p className="text-xs text-muted">Multiplicadores de precio por período.</p>
          </div>
          <button
            onClick={() => setShowSeasonModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>

        {seasons.length === 0 ? (
          <div className="text-center py-8">
            <CalendarRange className="w-10 h-10 mx-auto text-muted mb-2" />
            <p className="text-sm text-muted">No hay temporadas definidas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <AnimatePresence initial={false}>
              {seasons.map((s) => {
                const high = s.multiplier > 1
                const low = s.multiplier < 1
                const Icon = high ? Sun : low ? Snowflake : Minus
                const badgeCls = high
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  : low
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                const pct = Math.round((s.multiplier - 1) * 100)
                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-bg rounded-xl border border-border p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${badgeCls}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {high ? 'Alta' : low ? 'Baja' : 'Normal'}
                      </div>
                      <button
                        onClick={() => deleteSeason(s.id)}
                        className="p-1 rounded-lg text-muted hover:text-red-500 transition-colors"
                        title="Eliminar temporada"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-text">{s.name}</h3>
                    <p className="text-xs text-muted mb-3">{fmtDate(s.startDate)} → {fmtDate(s.endDate)}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">×{s.multiplier.toFixed(2)}</span>
                      <span className={`text-sm font-medium ${high ? 'text-orange-500' : low ? 'text-blue-500' : 'text-muted'}`}>
                        {pct > 0 ? `+${pct}%` : `${pct}%`}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ Nominal vs real (existing) */}
      <section>
        <h2 className="font-bold text-text flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-primary" /> Nominal vs. real (deflactada)
        </h2>
        <p className="text-sm text-muted mb-3">Separa el efecto inflación del efecto demanda — algo que ningún RMS importado hace bien en Argentina.</p>

        <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3 mb-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted">{dp.note} IPC mensual usado: <b className="text-text">{dp.ipcMonthly}%</b>.</p>
        </div>

        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_1.4fr_auto_auto] gap-4 px-4 py-3 border-b border-border text-xs font-semibold text-muted uppercase tracking-wide">
            <span>Fecha</span>
            <span>Nominal vs. real (deflactada)</span>
            <span className="text-right">Ocupación</span>
            <span className="text-right">Recomendación</span>
          </div>

          {dp.rows.map((r, i) => {
            const rec = REC[r.rec] || REC.mantener
            const RecIcon = rec.icon
            return (
              <motion.div key={r.date}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="grid grid-cols-2 md:grid-cols-[1fr_1.4fr_auto_auto] gap-3 md:gap-4 px-4 py-3 border-b border-border last:border-0 items-center">
                <span className="text-sm font-medium text-text">{r.date}</span>

                <div className="col-span-2 md:col-span-1 order-3 md:order-none space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2.5 rounded-full bg-bg overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${(r.nominal / maxNominal) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted w-20 text-right">Nom. {money(r.nominal)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2.5 rounded-full bg-bg overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(r.real / maxNominal) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted w-20 text-right">Real {money(r.real)}</span>
                  </div>
                </div>

                <span className="text-sm text-text text-right md:pr-2">{r.occ}%</span>

                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${rec.cls}`}>
                    <RecIcon className="w-3.5 h-3.5" /> {rec.label}{r.delta ? ` ${r.delta > 0 ? '+' : ''}${r.delta}%` : ''}
                  </span>
                  {r.reason !== '—' && <p className="text-[10px] text-muted mt-1">por {r.reason}</p>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <OfferModal open={showOfferModal} onClose={() => setShowOfferModal(false)} onSave={addOffer} />
      <SeasonModal open={showSeasonModal} onClose={() => setShowSeasonModal(false)} onSave={addSeason} />
    </div>
  )
}

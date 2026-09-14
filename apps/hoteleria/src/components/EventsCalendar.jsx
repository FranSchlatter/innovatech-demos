import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Check,
  X,
  Repeat,
  Sparkles,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GalleryHorizontalEnd
} from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_OPTIONS,
  spotsLeft,
  isFull,
  formatEventDate,
  formatTimeRange,
  effectiveEventDate,
  recurrenceLabel,
  todayISO
} from '../data/mockEvents'

// Guest-facing "Hotel activities" section on the landing. Reads the same shared
// state as the admin (useEvents), so an event created in EventsManagement shows
// up here, and registering bumps the counter the admin sees. Only upcoming,
// non-cancelled events are listed. Two layouts: a horizontal carousel (default,
// swipe/drag left→right with snap) and a classic grid — toggle between them.

// ---------------------------------------------------------------- Event card
function EventCard({ event, today, isRegistered, onRegister, onUnregister, mode, index }) {
  const cfg = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.social
  const CatIcon = cfg.icon
  const left = spotsLeft(event)
  const full = isFull(event)
  const registered = isRegistered(event.id)
  const shownDate = effectiveEventDate(event, today)
  const recurLabel = recurrenceLabel(event)

  // Grid animates each card as it scrolls into view; carousel cards are all in
  // view at once, so they stagger in on mount instead.
  const motionProps =
    mode === 'grid'
      ? {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: (index % 3) * 0.1 }
        }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }
        }

  return (
    <motion.article
      layout
      exit={{ opacity: 0, scale: 0.95 }}
      {...motionProps}
      className={`group rounded-lg overflow-hidden bg-bg border border-border shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col ${
        mode === 'carousel' ? 'snap-start shrink-0 w-[280px] sm:w-[340px]' : ''
      }`}
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            loading="lazy"
            draggable={false}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <CalendarDays className="w-10 h-10 text-muted" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white ${cfg.solid}`}>
          <CatIcon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
        {recurLabel && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white">
            <Repeat className="w-3 h-3" /> Semanal
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="heading-sm text-primary mb-2">{event.name}</h3>
        <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{event.description}</p>

        {/* Meta */}
        <ul className="space-y-2 text-sm text-muted mb-4">
          <li className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="capitalize">
              {recurLabel ? `Próximo: ${formatEventDate(shownDate, today)}` : formatEventDate(shownDate, today)}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            {formatTimeRange(event.startTime, event.endTime)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            {event.location}
          </li>
        </ul>

        {/* Availability + CTA */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm mb-3">
            <Users className="w-4 h-4 text-muted" />
            {full ? (
              <span className="font-semibold text-red-600 dark:text-red-400">Sin cupos disponibles</span>
            ) : left <= 5 ? (
              <span className="font-semibold text-amber-600 dark:text-amber-400">¡Últimos {left} lugares!</span>
            ) : (
              <span className="text-muted"><span className="font-semibold text-text">{left}</span> lugares disponibles</span>
            )}
          </div>

          {registered ? (
            <button
              onClick={() => onUnregister(event.id)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
            >
              <Check className="w-4 h-4" /> Estás registrado · Cancelar
            </button>
          ) : (
            <button
              onClick={() => onRegister(event)}
              disabled={full}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                full
                  ? 'bg-bg border border-border text-muted cursor-not-allowed'
                  : 'bg-accent text-bg hover:opacity-90'
              }`}
            >
              {full ? 'Sin cupos' : <>Registrarme <CalendarCheck className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// ---------------------------------------------------------------- Carousel
// Horizontal scroll-snap track: native swipe on touch, drag on desktop, and
// arrow buttons that scroll by roughly one card. Arrows disable at the ends.
function EventsCarousel({ events, ...cardProps }) {
  const trackRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [events.length])

  const scrollByCards = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(300, el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Arrows (hidden when the track fits without scrolling) */}
      {!(atStart && atEnd) && (
        <>
          <button
            onClick={() => scrollByCards(-1)}
            disabled={atStart}
            aria-label="Anterior"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center bg-surface border border-border shadow-medium text-text hover:bg-accent hover:text-bg disabled:opacity-0 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByCards(1)}
            disabled={atEnd}
            aria-label="Siguiente"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center bg-surface border border-border shadow-medium text-text hover:bg-accent hover:text-bg disabled:opacity-0 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} mode="carousel" {...cardProps} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Section
export default function EventsCalendar() {
  const { upcomingEvents, isRegistered, registerForEvent, unregisterFromEvent } = useEvents()
  const [category, setCategory] = useState('all')
  const [view, setView] = useState('carousel') // 'carousel' | 'grid'
  const [confirming, setConfirming] = useState(null) // event just registered → confirmation modal

  const today = todayISO()

  // Only show category filters that actually have upcoming events.
  const availableCategories = useMemo(() => {
    const present = new Set(upcomingEvents.map((e) => e.category))
    return EVENT_CATEGORY_OPTIONS.filter((o) => present.has(o.value))
  }, [upcomingEvents])

  const filtered = useMemo(
    () => (category === 'all' ? upcomingEvents : upcomingEvents.filter((e) => e.category === category)),
    [upcomingEvents, category]
  )

  // Close the confirmation modal with Escape.
  useEffect(() => {
    if (!confirming) return
    const onKey = (e) => e.key === 'Escape' && setConfirming(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirming])

  const handleRegister = (event) => {
    const result = registerForEvent(event.id)
    if (result === 'ok') setConfirming(event)
  }

  // Nothing to show — hide the whole section rather than render an empty state.
  if (upcomingEvents.length === 0) return null

  const cardProps = {
    today,
    isRegistered,
    onRegister: handleRegister,
    onUnregister: unregisterFromEvent
  }

  return (
    <section id="activities" className="py-20 md:py-32 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-accent mb-3">
            <Sparkles className="w-4 h-4" /> Agenda del hotel
          </span>
          <h2 className="heading-md mb-4">Actividades del hotel</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Experiencias curadas para vivir durante tu estadía. Sumate a las que más te gusten desde acá.
          </p>
        </motion.div>

        {/* Controls: category filter + view toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-12">
          {availableCategories.length > 1 ? (
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <button
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  category === 'all' ? 'bg-accent text-bg' : 'bg-bg border border-border text-muted hover:text-text'
                }`}
              >
                Todas
              </button>
              {availableCategories.map((opt) => {
                const OptIcon = opt.icon
                const active = category === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setCategory(opt.value)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      active ? 'bg-accent text-bg' : 'bg-bg border border-border text-muted hover:text-text'
                    }`}
                  >
                    <OptIcon className="w-4 h-4" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          ) : (
            <span />
          )}

          {/* View toggle */}
          <div className="inline-flex self-center lg:self-auto rounded-full border border-border bg-bg p-1">
            <button
              onClick={() => setView('carousel')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                view === 'carousel' ? 'bg-accent text-bg' : 'text-muted hover:text-text'
              }`}
            >
              <GalleryHorizontalEnd className="w-4 h-4" /> Carrusel
            </button>
            <button
              onClick={() => setView('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                view === 'grid' ? 'bg-accent text-bg' : 'text-muted hover:text-text'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Grilla
            </button>
          </div>
        </div>

        {/* Events */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted py-12">No hay actividades en esta categoría por ahora.</p>
        ) : view === 'carousel' ? (
          <EventsCarousel key={category} events={filtered} {...cardProps} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  mode="grid"
                  {...cardProps}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Registration confirmation */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirming(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-md rounded-2xl bg-surface shadow-medium overflow-hidden"
            >
              <button
                onClick={() => setConfirming(null)}
                aria-label="Cerrar"
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {confirming.image && (
                <div className="relative h-40 overflow-hidden">
                  <img src={confirming.image} alt={confirming.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
              )}

              <div className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 -mt-12 relative rounded-full bg-green-500 flex items-center justify-center shadow-medium ring-4 ring-surface">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text mb-1">¡Registro confirmado!</h3>
                <p className="text-sm text-muted mb-5">
                  Te esperamos en <span className="font-semibold text-text">{confirming.name}</span>.
                </p>

                <div className="rounded-lg bg-bg border border-border p-4 text-left space-y-2 text-sm text-muted mb-5">
                  <p className="flex items-center gap-2 capitalize">
                    <CalendarDays className="w-4 h-4 text-accent" /> {recurrenceLabel(confirming) || formatEventDate(effectiveEventDate(confirming, today), today)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" /> {formatTimeRange(confirming.startTime, confirming.endTime)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" /> {confirming.location}
                  </p>
                </div>

                <button
                  onClick={() => setConfirming(null)}
                  className="w-full px-4 py-3 rounded-lg font-semibold bg-accent text-bg hover:opacity-90 transition-opacity"
                >
                  Listo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

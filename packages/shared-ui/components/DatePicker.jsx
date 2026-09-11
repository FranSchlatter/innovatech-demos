import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

// Themed, dependency-free date picker used across every app as a drop-in
// replacement for the native <input type="date">. It renders only with theme
// tokens (bg-*, text-*, border-*, accent) so each app's palette themes it
// automatically — no hardcoded colors.
//
// Controlled contract (matches the native input, minus the event wrapper):
//   value    ISO string 'YYYY-MM-DD' (or '' when empty)
//   onChange (isoString) => void   ← receives the value directly, NOT an event
//   min/max  ISO strings that bound the selectable range (optional)

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const pad = (n) => String(n).padStart(2, '0')
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Parse 'YYYY-MM-DD' into a *local* date (avoids the UTC shift of new Date(str)).
const parseISO = (s) => {
  if (!s || typeof s !== 'string') return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export default function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = 'Select date',
  disabled = false,
  error = false,
  className = '',
  id
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const selected = parseISO(value)
  const minDate = parseISO(min)
  const maxDate = parseISO(max)

  const [viewMonth, setViewMonth] = useState(() => selected || minDate || new Date())

  // Snap the visible month to the selected/min date every time the popover opens.
  useEffect(() => {
    if (open) setViewMonth(selected || minDate || new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Build the month grid: leading blanks for the first weekday, then each day.
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

  const todayISO = toISO(startOfDay(new Date()))
  const selectedISO = selected ? toISO(selected) : null
  const minTime = minDate ? startOfDay(minDate).getTime() : null
  const maxTime = maxDate ? startOfDay(maxDate).getTime() : null

  const isDisabledDay = (d) => {
    const t = startOfDay(d).getTime()
    return (minTime !== null && t < minTime) || (maxTime !== null && t > maxTime)
  }

  const label = selected
    ? selected.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : placeholder

  const goPrev = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
  const goNext = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-4 py-3 bg-bg rounded-xl border-2 text-left outline-none transition ${
          error ? 'border-red-500' : open ? 'border-accent' : 'border-border'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent'}`}
      >
        <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
        <span className={selected ? '' : 'text-muted'}>{label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 z-50 w-72 max-w-[calc(100vw-2rem)] bg-surface border border-border rounded-2xl shadow-lg p-3"
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous month"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-bg transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold">
                {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next month"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-bg transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((w) => (
                <span key={w} className="text-[11px] text-muted text-center py-1">
                  {w}
                </span>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (!d) return <span key={`blank-${i}`} />
                const iso = toISO(d)
                const isSelected = iso === selectedISO
                const isToday = iso === todayISO
                const dayDisabled = isDisabledDay(d)
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={dayDisabled}
                    onClick={() => {
                      onChange(iso)
                      setOpen(false)
                    }}
                    className={`h-8 rounded-lg text-sm font-medium transition ${
                      isSelected
                        ? 'bg-accent text-white'
                        : dayDisabled
                        ? 'text-muted opacity-40 cursor-not-allowed'
                        : 'hover:bg-bg'
                    } ${isToday && !isSelected ? 'ring-1 ring-accent' : ''}`}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

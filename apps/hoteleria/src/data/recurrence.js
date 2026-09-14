// Shared weekly-recurrence model — used by both events (H14) and excursions
// (H17) so "recurring" means the same thing everywhere and actually generates
// real dates instead of being a cosmetic flag.
//
// A recurrence is described by the set of weekdays it repeats on (JS getDay()
// numbers: 0=Sun … 6=Sat). Helpers here expand that into concrete ISO dates,
// find the next upcoming occurrence, and render a human label.
//
// All date math uses LOCAL dates (not toISOString()/UTC) to match the calendar
// grid + DatePicker and avoid the off-by-one-day shift near midnight in UTC-3.

const pad = (n) => String(n).padStart(2, '0')

// Local ISO 'YYYY-MM-DD' (no UTC conversion).
export const localISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Parse an ISO date string as a LOCAL midnight Date (not UTC).
export const parseISO = (iso) => new Date(iso + 'T00:00:00')

export const todayISO = () => localISO(new Date())

// Weekday options in Mon→Sun display order, but carrying the JS getDay() value
// used for storage/matching. UIs should iterate this; storage keeps the values.
export const WEEKDAYS = [
  { value: 1, short: 'Lun', label: 'Lunes' },
  { value: 2, short: 'Mar', label: 'Martes' },
  { value: 3, short: 'Mié', label: 'Miércoles' },
  { value: 4, short: 'Jue', label: 'Jueves' },
  { value: 5, short: 'Vie', label: 'Viernes' },
  { value: 6, short: 'Sáb', label: 'Sábado' },
  { value: 0, short: 'Dom', label: 'Domingo' }
]

const SHORT_BY_VALUE = WEEKDAYS.reduce((m, w) => ({ ...m, [w.value]: w.short }), {})

// Sort a set of weekday values into the Mon→Sun display order.
export const sortWeekdays = (weekdays = []) =>
  [...weekdays].sort((a, b) => {
    const ia = WEEKDAYS.findIndex((w) => w.value === a)
    const ib = WEEKDAYS.findIndex((w) => w.value === b)
    return ia - ib
  })

// The weekday value of a given ISO date (0=Sun … 6=Sat).
export const weekdayOf = (iso) => parseISO(iso).getDay()

// "Lun, Mié y Vie" — natural Spanish list of the recurring weekdays.
export const describeWeekdays = (weekdays = []) => {
  const parts = sortWeekdays(weekdays).map((v) => SHORT_BY_VALUE[v]).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`
}

// First date on/after `fromISO` whose weekday is in `weekdays`. Falls back to
// `fromISO` when there are no weekdays (i.e. a one-off).
export const nextOccurrence = (weekdays = [], fromISO = todayISO()) => {
  if (!weekdays || weekdays.length === 0) return fromISO
  const from = parseISO(fromISO)
  for (let i = 0; i < 7; i++) {
    const d = new Date(from.getTime() + i * 86400000)
    if (weekdays.includes(d.getDay())) return localISO(d)
  }
  return fromISO
}

// Expand a weekly recurrence into concrete { date, time } slots. Iterates day by
// day across `weeks` weeks from `startDate`, emitting one entry per matching
// weekday × time. Times default to a single empty slot when none are given.
export const expandWeekly = ({ startDate, weekdays = [], weeks = 4, times = [] }) => {
  if (!startDate || weekdays.length === 0) return []
  const timeList = times.length ? times : ['']
  const start = parseISO(startDate)
  const end = new Date(start.getTime() + Math.max(1, weeks) * 7 * 86400000)
  const out = []
  for (let t = new Date(start); t < end; t = new Date(t.getTime() + 86400000)) {
    if (weekdays.includes(t.getDay())) {
      const iso = localISO(t)
      timeList.forEach((time) => out.push({ date: iso, time }))
    }
  }
  return out
}

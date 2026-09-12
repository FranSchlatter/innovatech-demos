// Hotel announcements — created in the admin (NewsManagement) and surfaced on
// the public landing (NewsBar) while their date window is live. Demo only, no
// backend: persisted in localStorage via the useNews hook.
//
// Each announcement:
//   id         unique string
//   title      short headline
//   message    body copy shown in the bar
//   type       'info' | 'warning' | 'event' (drives color + icon)
//   startDate  ISO 'YYYY-MM-DD' — first day it shows
//   endDate    ISO 'YYYY-MM-DD' — last day it shows (inclusive)
//   enabled    manual on/off toggle from the admin

import { Info, AlertTriangle, PartyPopper } from 'lucide-react'

// Presentation config per type. Uses standard Tailwind palette colors (blue/
// amber/green) — those DO support the /alpha modifier, unlike the theme tokens
// (bg-primary/10 is a silent no-op here), so the tinted surfaces render.
export const NEWS_TYPES = {
  info: {
    label: 'Información',
    icon: Info,
    // Front bar (full-width, high-contrast band)
    barBg: 'bg-blue-600',
    barText: 'text-white',
    // Admin badges / soft tints
    dot: 'bg-blue-500',
    softBg: 'bg-blue-500/10',
    softText: 'text-blue-600 dark:text-blue-400',
    softBorder: 'border-blue-500/20'
  },
  warning: {
    label: 'Aviso',
    icon: AlertTriangle,
    barBg: 'bg-amber-500',
    barText: 'text-black',
    dot: 'bg-amber-500',
    softBg: 'bg-amber-500/10',
    softText: 'text-amber-600 dark:text-amber-400',
    softBorder: 'border-amber-500/20'
  },
  event: {
    label: 'Evento',
    icon: PartyPopper,
    barBg: 'bg-emerald-600',
    barText: 'text-white',
    dot: 'bg-emerald-500',
    softBg: 'bg-emerald-500/10',
    softText: 'text-emerald-600 dark:text-emerald-400',
    softBorder: 'border-emerald-500/20'
  }
}

export const NEWS_TYPE_OPTIONS = Object.entries(NEWS_TYPES).map(([value, cfg]) => ({
  value,
  label: cfg.label,
  icon: cfg.icon
}))

// Build ISO dates relative to today so the seeded demo never goes stale.
const iso = (offsetDays) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

// Seed announcements — one of each state so every status is visible in the
// admin out of the box, and at least two are live for the front bar to rotate.
export const initialNews = [
  {
    id: 'NEWS-1001',
    title: 'Nueva carta de temporada',
    message: 'Nuestro restaurante estrena menú de estación con productos locales. Reservá tu mesa desde el portal.',
    type: 'info',
    startDate: iso(-3),
    endDate: iso(14),
    enabled: true
  },
  {
    id: 'NEWS-1002',
    title: 'Pileta climatizada en mantenimiento',
    message: 'La pileta permanecerá cerrada por remodelación. Disculpá las molestias; el spa sigue disponible con normalidad.',
    type: 'warning',
    startDate: iso(-1),
    endDate: iso(6),
    enabled: true
  },
  {
    id: 'NEWS-1003',
    title: 'Noche de jazz en la terraza',
    message: 'Música en vivo y coctelería de autor bajo las estrellas. Cupos limitados — sumate desde Actividades.',
    type: 'event',
    startDate: iso(5),
    endDate: iso(12),
    enabled: true
  },
  {
    id: 'NEWS-1004',
    title: 'Cierre de temporada de verano',
    message: 'Gracias por acompañarnos esta temporada. Volvemos con nuevas experiencias muy pronto.',
    type: 'info',
    startDate: iso(-40),
    endDate: iso(-10),
    enabled: true
  }
]

export const todayISO = () => new Date().toISOString().split('T')[0]

// Derive the live state of an announcement from its dates + enabled flag.
//   paused    → manually disabled
//   scheduled → starts in the future
//   expired   → already past its end date
//   active    → today is within [startDate, endDate] and enabled
export const newsStatus = (item, today = todayISO()) => {
  if (!item.enabled) return 'paused'
  if (item.startDate && today < item.startDate) return 'scheduled'
  if (item.endDate && today > item.endDate) return 'expired'
  return 'active'
}

// Shown on the front only when active (enabled + inside its date window).
export const isLive = (item, today = todayISO()) => newsStatus(item, today) === 'active'

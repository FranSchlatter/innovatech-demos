// Hotel activities & events — created in the admin (EventsManagement) and
// surfaced on the public landing (EventsCalendar) as upcoming activities guests
// can register for. Demo only, no backend: persisted in localStorage via the
// useEvents hook (same shared-state pattern as useNews).
//
// Each event:
//   id          unique string
//   name        short title
//   description one-line summary shown on the card
//   date        ISO 'YYYY-MM-DD' — the day it happens
//   startTime   'HH:MM' (24h)
//   endTime     'HH:MM' (24h)
//   location    where it takes place
//   image       cover photo URL
//   capacity    max attendees
//   registered  attendees already signed up (grows as guests register)
//   category    'social' | 'wellness' | 'culinary' | 'entertainment'
//   recurring   repeats regularly (weekly) — shown as a badge
//   cancelled   admin-cancelled flag (hidden from the front, struck in admin)

import { PartyPopper, Flower2, Wine, Music } from 'lucide-react'

// Presentation config per category. Uses standard Tailwind palette colors
// (indigo/emerald/amber/fuchsia) because those DO support the /alpha modifier,
// unlike the theme tokens (bg-primary/10 is a silent no-op here), so the tinted
// surfaces and badges actually render.
export const EVENT_CATEGORIES = {
  social: {
    label: 'Social',
    icon: PartyPopper,
    dot: 'bg-indigo-500',
    softBg: 'bg-indigo-500/10',
    softText: 'text-indigo-600 dark:text-indigo-400',
    softBorder: 'border-indigo-500/20',
    solid: 'bg-indigo-500'
  },
  wellness: {
    label: 'Bienestar',
    icon: Flower2,
    dot: 'bg-emerald-500',
    softBg: 'bg-emerald-500/10',
    softText: 'text-emerald-600 dark:text-emerald-400',
    softBorder: 'border-emerald-500/20',
    solid: 'bg-emerald-500'
  },
  culinary: {
    label: 'Gastronomía',
    icon: Wine,
    dot: 'bg-amber-500',
    softBg: 'bg-amber-500/10',
    softText: 'text-amber-600 dark:text-amber-400',
    softBorder: 'border-amber-500/20',
    solid: 'bg-amber-500'
  },
  entertainment: {
    label: 'Entretenimiento',
    icon: Music,
    dot: 'bg-fuchsia-500',
    softBg: 'bg-fuchsia-500/10',
    softText: 'text-fuchsia-600 dark:text-fuchsia-400',
    softBorder: 'border-fuchsia-500/20',
    solid: 'bg-fuchsia-500'
  }
}

export const EVENT_CATEGORY_OPTIONS = Object.entries(EVENT_CATEGORIES).map(([value, cfg]) => ({
  value,
  label: cfg.label,
  icon: cfg.icon
}))

const pad = (n) => String(n).padStart(2, '0')
// Local (not UTC) ISO date — avoids the toISOString() timezone shift so these
// strings match the calendar grid + DatePicker, which build cells from local
// dates. Otherwise events could land on the wrong day near midnight (UTC-3).
const localISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Build ISO dates relative to today so the seeded demo never goes stale.
const iso = (offsetDays) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offsetDays)
  return localISO(d)
}

// Seed events — spread across the next few weeks (plus one past event so the
// 'past' status is visible in the admin out of the box). At least one is today.
export const initialEvents = [
  {
    id: 'EVT-1001',
    name: 'Coctelería al atardecer',
    description: 'Cócteles de autor y música lounge en la terraza mientras cae el sol sobre la bahía.',
    date: iso(0),
    startTime: '19:00',
    endTime: '21:30',
    location: 'Terraza Sky Bar',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80',
    capacity: 40,
    registered: 28,
    category: 'social',
    recurring: true,
    cancelled: false
  },
  {
    id: 'EVT-1002',
    name: 'Yoga al amanecer',
    description: 'Clase guiada de yoga y meditación frente al mar para empezar el día con energía.',
    date: iso(1),
    startTime: '07:00',
    endTime: '08:00',
    location: 'Jardín Zen',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
    capacity: 20,
    registered: 12,
    category: 'wellness',
    recurring: true,
    cancelled: false
  },
  {
    id: 'EVT-1003',
    name: 'Cata de vinos & quesos',
    description: 'Recorrido por etiquetas de la región maridadas con quesos artesanales, guiado por nuestro sommelier.',
    date: iso(3),
    startTime: '18:30',
    endTime: '20:30',
    location: 'Cava del hotel',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80',
    capacity: 16,
    registered: 16,
    category: 'culinary',
    recurring: false,
    cancelled: false
  },
  {
    id: 'EVT-1004',
    name: 'Noche de jazz en vivo',
    description: 'Cuarteto de jazz en vivo y coctelería de autor bajo las estrellas.',
    date: iso(6),
    startTime: '21:00',
    endTime: '23:30',
    location: 'Terraza principal',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200&q=80',
    capacity: 60,
    registered: 34,
    category: 'entertainment',
    recurring: false,
    cancelled: false
  },
  {
    id: 'EVT-1005',
    name: 'Mesa del chef',
    description: 'Menú degustación de siete pasos servido en la cocina, con el chef ejecutivo explicando cada plato.',
    date: iso(10),
    startTime: '20:00',
    endTime: '22:30',
    location: 'Cocina principal',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=80',
    capacity: 12,
    registered: 5,
    category: 'culinary',
    recurring: false,
    cancelled: false
  },
  {
    id: 'EVT-1006',
    name: 'Cine bajo las estrellas',
    description: 'Proyección de un clásico junto a la pileta, con mantas, pochoclos y bebidas incluidas.',
    date: iso(-4),
    startTime: '21:30',
    endTime: '23:30',
    location: 'Pileta principal',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
    capacity: 50,
    registered: 41,
    category: 'entertainment',
    recurring: false,
    cancelled: false
  }
]

export const todayISO = () => localISO(new Date())

// Derive the state of an event from its date + cancelled flag.
//   cancelled → manually cancelled by the admin
//   past      → already happened (before today)
//   today     → happens today
//   upcoming  → in the future
export const eventStatus = (event, today = todayISO()) => {
  if (event.cancelled) return 'cancelled'
  if (event.date < today) return 'past'
  if (event.date === today) return 'today'
  return 'upcoming'
}

// Remaining seats (never negative).
export const spotsLeft = (event) => Math.max(0, (event.capacity || 0) - (event.registered || 0))

export const isFull = (event) => spotsLeft(event) <= 0

// Shown on the front: not cancelled and not in the past (today counts as live).
export const isUpcoming = (event, today = todayISO()) => {
  const status = eventStatus(event, today)
  return status === 'upcoming' || status === 'today'
}

// "Mié 12 de sep" style, with a "Hoy" shortcut for today.
export const formatEventDate = (dateStr, today = todayISO()) => {
  if (!dateStr) return '—'
  const label = new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
  return dateStr === today ? `Hoy · ${label}` : label
}

// "19:00 – 21:30"
export const formatTimeRange = (start, end) => {
  if (!start) return ''
  return end ? `${start} – ${end}` : start
}

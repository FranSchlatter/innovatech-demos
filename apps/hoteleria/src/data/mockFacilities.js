// Beach & pool facility map (H23) — the interactive top-down layout of loungers,
// cabanas and umbrellas around the resort's pool deck and beach. Created for the
// guest-facing BeachPoolMap (reserve a spot, order poolside) and the admin
// FacilitiesManagement (see who holds what, free positions). Demo only, no
// backend: persisted in localStorage via the useFacilities hook, which both
// surfaces share (same pattern as useEvents / useNews) so a guest reservation
// shows up instantly for the front desk.
//
// Each spot:
//   id          unique string ('CAB-1', 'LNG-3', 'UMB-2'…)
//   type        'cabana' | 'lounger' | 'umbrella'
//   zone        'pool' | 'beach'
//   label       short human name shown in tooltips / lists ('Cabaña 1')
//   x, y        position as a PERCENT (0–100) inside the map canvas — lets the
//               scene scale responsively without recomputing coordinates
//   status      'available' | 'occupied' | 'reserved'
//   price       per-day price (cabanas are paid; loungers/umbrellas included → 0)
//   guestName   who holds it (when occupied/reserved), else null
//   reservedFor { date, time } when reserved (else null)
//   heldBy      'front-desk' | 'guest' — who created the hold (else null)

import { Umbrella, Armchair, Tent, GlassWater, CupSoda, Coffee, Martini, Cookie, Sandwich, IceCreamCone } from 'lucide-react'

// ---------------------------------------------------------------- type config
// Icon + sizing per facility type. Uses lucide icons; the canvas scales the
// hit-area per type (cabanas are the biggest, umbrellas medium, loungers small).
export const FACILITY_TYPES = {
  cabana: {
    label: 'Cabaña',
    plural: 'Cabañas',
    icon: Tent,
    size: 'lg',
    paid: true,
    blurb: 'Cabaña privada con sombra, sillones y servicio dedicado.'
  },
  lounger: {
    label: 'Reposera',
    plural: 'Reposeras',
    icon: Armchair,
    size: 'sm',
    paid: false,
    blurb: 'Reposera junto a la pileta, incluida en tu estadía.'
  },
  umbrella: {
    label: 'Sombrilla',
    plural: 'Sombrillas',
    icon: Umbrella,
    size: 'md',
    paid: false,
    blurb: 'Sombrilla en la playa con dos reposeras, incluida en tu estadía.'
  }
}

// ---------------------------------------------------------------- status config
// Uses the STANDARD Tailwind palette (emerald / rose / sky) on purpose: those
// colors support the /alpha modifier, unlike the theme tokens (bg-primary/10 is
// a silent no-op in hoteleria), so the tinted chips and markers actually render.
export const FACILITY_STATUS = {
  available: {
    label: 'Disponible',
    dot: 'bg-emerald-500',
    solid: 'bg-emerald-500',
    ring: 'ring-emerald-500',
    softBg: 'bg-emerald-500/10',
    softText: 'text-emerald-600 dark:text-emerald-400',
    softBorder: 'border-emerald-500/30',
    marker: 'bg-emerald-500 text-white border-emerald-600'
  },
  occupied: {
    label: 'Ocupada',
    dot: 'bg-rose-500',
    solid: 'bg-rose-500',
    ring: 'ring-rose-500',
    softBg: 'bg-rose-500/10',
    softText: 'text-rose-600 dark:text-rose-400',
    softBorder: 'border-rose-500/30',
    marker: 'bg-rose-500 text-white border-rose-600'
  },
  reserved: {
    label: 'Reservada',
    dot: 'bg-sky-500',
    solid: 'bg-sky-500',
    ring: 'ring-sky-500',
    softBg: 'bg-sky-500/10',
    softText: 'text-sky-600 dark:text-sky-400',
    softBorder: 'border-sky-500/30',
    marker: 'bg-sky-500 text-white border-sky-600'
  }
}

export const ZONES = {
  pool: { label: 'Pileta', blurb: 'Solárium y cabanas alrededor de la pileta principal.' },
  beach: { label: 'Playa', blurb: 'Sombrillas y reposeras sobre la arena, frente al mar.' }
}

const pad = (n) => String(n).padStart(2, '0')
const localISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => localISO(new Date())

// Build the seed grid. Coordinates are hand-placed so the scene reads like a
// real resort deck: a row of cabanas along the top, loungers flanking + below
// the pool, then the beach (umbrellas + loungers) toward the water at the bottom.
const seed = (id, type, zone, label, x, y, extra = {}) => ({
  id,
  type,
  zone,
  label,
  x,
  y,
  status: 'available',
  price: FACILITY_TYPES[type].paid ? 0 : 0,
  guestName: null,
  reservedFor: null,
  heldBy: null,
  ...extra
})

// The seeded layout (21 spots). A mix of statuses so both surfaces show a
// realistic board out of the box. Reserved spots carry a date/time + holder.
export const initialFacilities = [
  // --- Cabanas: premium, paid, along the top of the pool deck -----------------
  seed('CAB-1', 'cabana', 'pool', 'Cabaña 1', 18, 11, {
    price: 95, status: 'reserved', guestName: 'Familia Gómez', heldBy: 'front-desk',
    reservedFor: { date: todayISO(), time: '10:00' }
  }),
  seed('CAB-2', 'cabana', 'pool', 'Cabaña 2', 39, 9, { price: 120 }),
  seed('CAB-3', 'cabana', 'pool', 'Cabaña 3', 61, 9, {
    price: 120, status: 'occupied', guestName: 'Sr. Klein', heldBy: 'front-desk'
  }),
  seed('CAB-4', 'cabana', 'pool', 'Cabaña 4', 82, 11, { price: 95 }),

  // --- Pool loungers flanking the pool ---------------------------------------
  seed('LNG-1', 'lounger', 'pool', 'Reposera P1', 11, 30, {
    status: 'occupied', guestName: 'Ana Torres', heldBy: 'front-desk'
  }),
  seed('LNG-2', 'lounger', 'pool', 'Reposera P2', 11, 44),
  seed('LNG-3', 'lounger', 'pool', 'Reposera P3', 11, 58),
  seed('LNG-4', 'lounger', 'pool', 'Reposera P4', 89, 30, {
    status: 'occupied', guestName: 'M. Rossi', heldBy: 'front-desk'
  }),
  seed('LNG-5', 'lounger', 'pool', 'Reposera P5', 89, 44),
  seed('LNG-6', 'lounger', 'pool', 'Reposera P6', 89, 58, {
    status: 'reserved', guestName: 'J. Pérez', heldBy: 'front-desk',
    reservedFor: { date: todayISO(), time: '14:00' }
  }),

  // --- Poolside loungers below the pool --------------------------------------
  seed('LNG-7', 'lounger', 'pool', 'Reposera P7', 34, 64),
  seed('LNG-8', 'lounger', 'pool', 'Reposera P8', 50, 66, {
    status: 'occupied', guestName: 'Laura D.', heldBy: 'front-desk'
  }),
  seed('LNG-9', 'lounger', 'pool', 'Reposera P9', 66, 64),

  // --- Beach umbrellas --------------------------------------------------------
  seed('UMB-1', 'umbrella', 'beach', 'Sombrilla 1', 16, 80),
  seed('UMB-2', 'umbrella', 'beach', 'Sombrilla 2', 37, 82, {
    status: 'occupied', guestName: 'Fam. Silva', heldBy: 'front-desk'
  }),
  seed('UMB-3', 'umbrella', 'beach', 'Sombrilla 3', 60, 82),
  seed('UMB-4', 'umbrella', 'beach', 'Sombrilla 4', 82, 80, {
    status: 'reserved', guestName: 'P. Nowak', heldBy: 'front-desk',
    reservedFor: { date: todayISO(), time: '11:30' }
  }),

  // --- Beach loungers near the water -----------------------------------------
  seed('BCH-1', 'lounger', 'beach', 'Reposera B1', 27, 90),
  seed('BCH-2', 'lounger', 'beach', 'Reposera B2', 46, 91),
  seed('BCH-3', 'lounger', 'beach', 'Reposera B3', 64, 91, {
    status: 'occupied', guestName: 'K. Weber', heldBy: 'front-desk'
  }),
  seed('BCH-4', 'lounger', 'beach', 'Reposera B4', 84, 90)
]

// ---------------------------------------------------------------- poolside menu
// The simplified drink/snack menu behind "Pedir desde mi reposera". Standard
// palette icons only; prices in USD to match the rest of the demo billing.
export const POOLSIDE_MENU = [
  { id: 'PM-1', name: 'Piña colada', category: 'drink', price: 12, icon: Martini },
  { id: 'PM-2', name: 'Mojito clásico', category: 'drink', price: 11, icon: GlassWater },
  { id: 'PM-3', name: 'Limonada de jengibre', category: 'drink', price: 7, icon: CupSoda },
  { id: 'PM-4', name: 'Café helado', category: 'drink', price: 6, icon: Coffee },
  { id: 'PM-5', name: 'Agua saborizada', category: 'drink', price: 4, icon: GlassWater },
  { id: 'PM-6', name: 'Tabla de frutas', category: 'snack', price: 14, icon: Cookie },
  { id: 'PM-7', name: 'Club sándwich', category: 'snack', price: 16, icon: Sandwich },
  { id: 'PM-8', name: 'Nachos con guacamole', category: 'snack', price: 13, icon: Cookie },
  { id: 'PM-9', name: 'Helado artesanal', category: 'snack', price: 8, icon: IceCreamCone }
]

export const POOLSIDE_CATEGORIES = [
  { id: 'drink', label: 'Bebidas' },
  { id: 'snack', label: 'Snacks' }
]

// ---------------------------------------------------------------- pure helpers
export const typeConfig = (type) => FACILITY_TYPES[type] || FACILITY_TYPES.lounger
export const statusConfig = (status) => FACILITY_STATUS[status] || FACILITY_STATUS.available
export const zoneConfig = (zone) => ZONES[zone] || ZONES.pool

export const typeLabel = (type) => typeConfig(type).label
export const zoneLabel = (zone) => zoneConfig(zone).label

// Roll up the board into counts the KPIs and availability chips read from.
export const facilityCounts = (spots = []) => {
  const base = {
    total: spots.length,
    available: 0,
    occupied: 0,
    reserved: 0,
    revenue: 0, // held (occupied+reserved) paid spots × price
    pool: { total: 0, available: 0 },
    beach: { total: 0, available: 0 }
  }
  return spots.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    if (s.status !== 'available' && s.price > 0) acc.revenue += s.price
    const z = acc[s.zone] || (acc[s.zone] = { total: 0, available: 0 })
    z.total += 1
    if (s.status === 'available') z.available += 1
    return acc
  }, base)
}

// "Cabaña 2 · Pileta" style label used in requests and lists.
export const describeSpot = (spot) =>
  spot ? `${spot.label} · ${zoneLabel(spot.zone)}` : ''

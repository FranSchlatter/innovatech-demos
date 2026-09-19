// Users & roles model for the hotel admin (H18).
// Demo only — no backend. These are the *staff accounts* that log into the
// admin panel (distinct from mockStaff, which are operational workers). Each
// user has a role that carries a default set of accessible modules, but the
// per-user `permissions` array can be edited freely (that's the whole point of
// the manager), so a role is just a starting template.
import {
  ShieldCheck,
  ConciergeBell,
  Sparkles,
  Wrench,
  UtensilsCrossed,
  MapPin,
  LayoutDashboard,
  Bot,
  TrendingUp,
  CalendarRange,
  BedDouble,
  Package,
  Bell,
  Compass,
  CalendarDays,
  Megaphone,
  Users
} from 'lucide-react'

// ---------------------------------------------------------------- Access areas
// Every module in the admin sidebar is a grantable "area". A user's
// `permissions` array is a subset of these ids. Kept in sidebar order so the
// permission matrix reads top-to-bottom like the real navigation.
export const AREAS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inbox', label: 'Bandeja IA', icon: Bot },
  { id: 'pricing', label: 'Precio dinámico', icon: TrendingUp },
  { id: 'calendar', label: 'Calendario', icon: CalendarRange },
  { id: 'rooms', label: 'Room Management', icon: BedDouble },
  { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'services', label: 'Service Requests', icon: Bell },
  { id: 'excursions', label: 'Excursiones', icon: Compass },
  { id: 'events', label: 'Actividades', icon: CalendarDays },
  { id: 'news', label: 'Noticias y avisos', icon: Megaphone },
  { id: 'users', label: 'Usuarios y roles', icon: Users }
]

export const ALL_AREA_IDS = AREAS.map((a) => a.id)
export const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a]))

// ---------------------------------------------------------------- Roles
// `defaultAreas` mirrors the intent documented in H18: what each role should
// see out of the box. Colors use the STANDARD Tailwind palette (indigo/blue/…)
// because those support the /alpha modifier — the theme tokens (var(--color-*))
// do NOT, so `bg-primary/10` would be a silent no-op. `solid` is for the avatar
// chip (solid fill), `badge` for the small role pill (soft tint + border).
export const ROLES = [
  {
    id: 'admin',
    label: 'Administrador',
    icon: ShieldCheck,
    description: 'Acceso total. Gestiona el hotel, las finanzas y a los demás usuarios.',
    solid: 'bg-violet-600 text-white',
    dot: 'bg-violet-500',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    defaultAreas: [...ALL_AREA_IDS]
  },
  {
    id: 'front-desk',
    label: 'Recepción',
    icon: ConciergeBell,
    description: 'Atiende llegadas y salidas: reservas, calendario, habitaciones y solicitudes.',
    solid: 'bg-blue-600 text-white',
    dot: 'bg-blue-500',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    defaultAreas: ['dashboard', 'calendar', 'rooms', 'services']
  },
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    icon: Sparkles,
    description: 'Gestiona la limpieza y el estado de las habitaciones. Dashboard acotado.',
    solid: 'bg-emerald-600 text-white',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    defaultAreas: ['dashboard', 'housekeeping']
  },
  {
    id: 'maintenance',
    label: 'Mantenimiento',
    icon: Wrench,
    description: 'Resuelve solicitudes de mantenimiento y el estado técnico de las habitaciones.',
    solid: 'bg-amber-600 text-white',
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    defaultAreas: ['dashboard', 'services']
  },
  {
    id: 'fnb',
    label: 'A&B (Restaurante)',
    icon: UtensilsCrossed,
    description: 'Alimentos y bebidas: pedidos del restaurante e inventario de minibar.',
    solid: 'bg-rose-600 text-white',
    dot: 'bg-rose-500',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    defaultAreas: ['dashboard', 'inventory', 'services']
  },
  {
    id: 'concierge',
    label: 'Concierge',
    icon: MapPin,
    description: 'Experiencia del huésped: excursiones, actividades y mensajería.',
    solid: 'bg-cyan-600 text-white',
    dot: 'bg-cyan-500',
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    defaultAreas: ['dashboard', 'inbox', 'excursions', 'events', 'services']
  }
]

export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]))

// Fallback so unknown roles never crash the UI.
const FALLBACK_ROLE = {
  id: 'unknown',
  label: 'Sin rol',
  icon: Users,
  description: '',
  solid: 'bg-gray-500 text-white',
  dot: 'bg-gray-400',
  badge: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  defaultAreas: []
}

export const getRole = (roleId) => ROLE_BY_ID[roleId] || FALLBACK_ROLE
export const getDefaultAreas = (roleId) => [...(ROLE_BY_ID[roleId]?.defaultAreas || [])]

// Initials for the avatar chip: first letter of first two words.
export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || '?'

// --------------------------------------------------------------- Seed users
// lastLogin is computed relative to load so the "hace X" labels always look
// fresh in the demo. Persisted after first run, so values then freeze (which is
// actually the correct behaviour for stored records).
const NOW = Date.now()
const HOUR = 3600 * 1000
const DAY = 24 * HOUR
const ago = (ms) => new Date(NOW - ms).toISOString()

export const initialUsers = [
  {
    id: 'USR-001',
    name: 'Francisco Schlatter',
    email: 'francisco@villaserena.com',
    role: 'admin',
    avatar: null,
    status: 'active',
    lastLogin: ago(0.4 * HOUR),
    permissions: getDefaultAreas('admin')
  },
  {
    id: 'USR-002',
    name: 'Valentina Rossi',
    email: 'valentina.rossi@villaserena.com',
    role: 'admin',
    avatar: null,
    status: 'active',
    lastLogin: ago(6 * HOUR),
    permissions: getDefaultAreas('admin')
  },
  {
    id: 'USR-003',
    name: 'Sofia Lopez',
    email: 'sofia.lopez@villaserena.com',
    role: 'front-desk',
    avatar: null,
    status: 'active',
    lastLogin: ago(1.5 * HOUR),
    // Customised: this receptionist also handles guest chat, so she gets inbox
    // access on top of the front-desk defaults — shows permissions are editable.
    permissions: [...getDefaultAreas('front-desk'), 'inbox']
  },
  {
    id: 'USR-004',
    name: 'David Ruiz',
    email: 'david.ruiz@villaserena.com',
    role: 'front-desk',
    avatar: null,
    status: 'inactive',
    lastLogin: ago(23 * DAY),
    permissions: getDefaultAreas('front-desk')
  },
  {
    id: 'USR-005',
    name: 'Maria Garcia',
    email: 'maria.garcia@villaserena.com',
    role: 'housekeeping',
    avatar: null,
    status: 'active',
    lastLogin: ago(3 * HOUR),
    permissions: getDefaultAreas('housekeeping')
  },
  {
    id: 'USR-006',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@villaserena.com',
    role: 'housekeeping',
    avatar: null,
    status: 'active',
    lastLogin: ago(1 * DAY),
    permissions: getDefaultAreas('housekeeping')
  },
  {
    id: 'USR-007',
    name: 'Roberto Sanchez',
    email: 'roberto.sanchez@villaserena.com',
    role: 'maintenance',
    avatar: null,
    status: 'active',
    lastLogin: ago(5 * HOUR),
    permissions: getDefaultAreas('maintenance')
  },
  {
    id: 'USR-008',
    name: 'Miguel Fernandez',
    email: 'miguel.fernandez@villaserena.com',
    role: 'concierge',
    avatar: null,
    status: 'active',
    lastLogin: ago(2 * DAY),
    permissions: getDefaultAreas('concierge')
  },
  {
    id: 'USR-009',
    name: 'Lucia Benitez',
    email: 'lucia.benitez@villaserena.com',
    role: 'fnb',
    avatar: null,
    status: 'inactive',
    lastLogin: null,
    permissions: getDefaultAreas('fnb')
  }
]

// Relative "hace X" label (Spanish). Null lastLogin → "Nunca".
export function timeAgo(iso) {
  if (!iso) return 'Nunca'
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 0) return 'ahora'
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `hace ${days} d`
  const months = Math.floor(days / 30)
  if (months < 12) return `hace ${months} mes${months === 1 ? '' : 'es'}`
  return `hace ${Math.floor(months / 12)} a`
}

// Basic email shape check for the create/edit form.
export const isValidEmail = (email = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

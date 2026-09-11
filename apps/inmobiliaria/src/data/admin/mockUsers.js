// System users & role model for the admin panel.
// Users have a role, a granular permission set and a login history.
// The role model also powers the "Accesos por rol" informative view.

export const TODAY = '2026-08-27'

/* ---------- roles ---------- */
// tone maps to StatusBadge / theme tokens; icon is resolved in the component.
export const USER_ROLES = [
  {
    id: 'admin',
    label: 'Administrador',
    icon: 'ShieldCheck',
    tone: 'accent',
    short: 'Acceso total al sistema',
    description: 'Control completo: usuarios, propiedades, finanzas y reportes.'
  },
  {
    id: 'agente-senior',
    label: 'Agente Senior',
    icon: 'Briefcase',
    tone: 'info',
    short: 'Gestiona su cartera completa',
    description: 'Administra sus propiedades, leads, visitas y operaciones asignadas.'
  },
  {
    id: 'agente-junior',
    label: 'Agente Junior',
    icon: 'UserCheck',
    tone: 'primary',
    short: 'Cartera acotada, sin edición global',
    description: 'Ve propiedades, trabaja sus leads y visitas. Sin operaciones.'
  },
  {
    id: 'asistente',
    label: 'Asistente',
    icon: 'Headphones',
    tone: 'warning',
    short: 'Agenda y soporte',
    description: 'Coordina la agenda de visitas y consulta leads en modo lectura.'
  },
  {
    id: 'tasador',
    label: 'Tasador',
    icon: 'Ruler',
    tone: 'success',
    short: 'Valuación de propiedades',
    description: 'Accede a propiedades para ver y editar su valuación. Nada más.'
  }
]

export const ROLE_META = USER_ROLES.reduce((acc, r) => ({ ...acc, [r.id]: r }), {})

/* ---------- granular permissions (checklist) ---------- */
export const PERMISSION_GROUPS = [
  {
    id: 'properties',
    label: 'Propiedades',
    perms: [
      { id: 'properties.view', label: 'Ver propiedades' },
      { id: 'properties.edit', label: 'Editar propiedades' },
      { id: 'properties.create', label: 'Crear y eliminar' },
      { id: 'properties.valuation', label: 'Editar valuación' }
    ]
  },
  {
    id: 'leads',
    label: 'Leads / CRM',
    perms: [
      { id: 'leads.view', label: 'Ver leads' },
      { id: 'leads.manage', label: 'Gestionar leads' }
    ]
  },
  {
    id: 'visits',
    label: 'Visitas',
    perms: [
      { id: 'visits.view', label: 'Ver agenda' },
      { id: 'visits.manage', label: 'Gestionar visitas' }
    ]
  },
  {
    id: 'operations',
    label: 'Operaciones',
    perms: [
      { id: 'operations.view', label: 'Ver operaciones' },
      { id: 'operations.manage', label: 'Gestionar operaciones' }
    ]
  },
  {
    id: 'finance',
    label: 'Finanzas y difusión',
    perms: [
      { id: 'liquidations.view', label: 'Ver liquidaciones' },
      { id: 'platforms.manage', label: 'Gestionar publicaciones' }
    ]
  },
  {
    id: 'admin',
    label: 'Administración',
    perms: [
      { id: 'team.view', label: 'Ver equipo' },
      { id: 'reports.view', label: 'Ver reportes y métricas' },
      { id: 'users.manage', label: 'Gestionar usuarios y roles' }
    ]
  }
]

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.perms.map((p) => p.id))
export const PERMISSION_LABEL = PERMISSION_GROUPS.flatMap((g) => g.perms).reduce(
  (acc, p) => ({ ...acc, [p.id]: p.label }),
  {}
)

// Sensible defaults applied when a role is picked in the create/edit forms.
export const ROLE_DEFAULT_PERMISSIONS = {
  admin: [...ALL_PERMISSIONS],
  'agente-senior': [
    'properties.view', 'properties.edit',
    'leads.view', 'leads.manage',
    'visits.view', 'visits.manage',
    'operations.view', 'operations.manage',
    'reports.view'
  ],
  'agente-junior': [
    'properties.view',
    'leads.view', 'leads.manage',
    'visits.view', 'visits.manage'
  ],
  asistente: ['visits.view', 'visits.manage', 'leads.view'],
  tasador: ['properties.view', 'properties.valuation']
}

/* ---------- "what each role sees" access model ---------- */
export const ACCESS_LEVELS = {
  full: { label: 'Completo', tone: 'success' },
  own: { label: 'Solo asignadas', tone: 'info' },
  valuation: { label: 'Ver + valuar', tone: 'info' },
  view: { label: 'Solo lectura', tone: 'warning' },
  limited: { label: 'Limitado', tone: 'warning' },
  none: { label: 'Sin acceso', tone: 'muted' }
}

// Modules mirror the admin sidebar (icon resolved in the component).
export const MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'properties', label: 'Propiedades', icon: 'Building2' },
  { id: 'leads', label: 'Leads / CRM', icon: 'Users' },
  { id: 'visits', label: 'Visitas', icon: 'CalendarDays' },
  { id: 'operations', label: 'Operaciones', icon: 'Handshake' },
  { id: 'contracts', label: 'Ajustes', icon: 'Calculator' },
  { id: 'liquidations', label: 'Liquidaciones', icon: 'Wallet' },
  { id: 'platforms', label: 'Plataformas', icon: 'Share2' },
  { id: 'agents', label: 'Equipo', icon: 'UserCog' },
  { id: 'users', label: 'Usuarios y Roles', icon: 'ShieldCheck' }
]

// Per-role access: moduleId -> { level, note }. Missing module = no access.
export const ROLE_ACCESS = {
  admin: {
    dashboard: { level: 'full' },
    properties: { level: 'full' },
    leads: { level: 'full' },
    visits: { level: 'full' },
    operations: { level: 'full' },
    contracts: { level: 'full' },
    liquidations: { level: 'full' },
    platforms: { level: 'full' },
    agents: { level: 'full' },
    users: { level: 'full' }
  },
  'agente-senior': {
    dashboard: { level: 'full', note: 'Métricas de su cartera' },
    properties: { level: 'own', note: 'Sus propiedades asignadas' },
    leads: { level: 'own', note: 'Sus leads' },
    visits: { level: 'own', note: 'Sus visitas' },
    operations: { level: 'own', note: 'Sus operaciones' }
  },
  'agente-junior': {
    dashboard: { level: 'limited', note: 'Vista limitada' },
    properties: { level: 'view', note: 'Solo consulta' },
    leads: { level: 'own', note: 'Sus leads' },
    visits: { level: 'own', note: 'Sus visitas' }
  },
  asistente: {
    dashboard: { level: 'limited', note: 'Panel básico' },
    leads: { level: 'view', note: 'Solo consulta' },
    visits: { level: 'full', note: 'Agenda completa' }
  },
  tasador: {
    properties: { level: 'valuation', note: 'Ver + editar valuación' }
  }
}

// Level for a role on a module (defaults to 'none').
export const accessFor = (roleId, moduleId) =>
  ROLE_ACCESS[roleId]?.[moduleId] || { level: 'none' }

// Count of modules a role can actually reach.
export const accessibleModuleCount = (roleId) =>
  MODULES.filter((m) => accessFor(roleId, m.id).level !== 'none').length

/* ---------- users ---------- */
export const USER_STATUSES = [
  { id: 'active', label: 'Activo', tone: 'success' },
  { id: 'inactive', label: 'Inactivo', tone: 'muted' }
]

export const mockUsers = [
  {
    id: 'USR-001',
    name: 'Francisco Schlatter',
    email: 'francisco.schlatter@terranova.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    status: 'active',
    lastLogin: '2026-08-27T08:12:00',
    permissions: [...ROLE_DEFAULT_PERMISSIONS.admin]
  },
  {
    id: 'USR-002',
    name: 'Valentina Ríos',
    email: 'valentina.rios@terranova.com',
    role: 'agente-senior',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    status: 'active',
    lastLogin: '2026-08-27T07:41:00',
    permissions: [...ROLE_DEFAULT_PERMISSIONS['agente-senior']]
  },
  {
    id: 'USR-003',
    name: 'Camila Ferrer',
    email: 'camila.ferrer@terranova.com',
    role: 'agente-senior',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    status: 'active',
    lastLogin: '2026-08-26T18:05:00',
    permissions: [...ROLE_DEFAULT_PERMISSIONS['agente-senior']]
  },
  {
    id: 'USR-004',
    name: 'Martín Aguirre',
    email: 'martin.aguirre@terranova.com',
    role: 'agente-junior',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    status: 'active',
    lastLogin: '2026-08-27T09:30:00',
    permissions: [...ROLE_DEFAULT_PERMISSIONS['agente-junior']]
  },
  {
    id: 'USR-005',
    name: 'Diego Santángelo',
    email: 'diego.santangelo@terranova.com',
    role: 'agente-junior',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    status: 'inactive',
    lastLogin: '2026-08-10T14:22:00',
    permissions: [...ROLE_DEFAULT_PERMISSIONS['agente-junior']]
  },
  {
    id: 'USR-006',
    name: 'Lucía Benítez',
    email: 'lucia.benitez@terranova.com',
    role: 'asistente',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    status: 'active',
    lastLogin: '2026-08-27T08:55:00',
    permissions: [...ROLE_DEFAULT_PERMISSIONS.asistente]
  },
  {
    id: 'USR-007',
    name: 'Tomás Herrera',
    email: 'tomas.herrera@terranova.com',
    role: 'asistente',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    status: 'active',
    lastLogin: '2026-08-25T11:10:00',
    permissions: ['visits.view', 'leads.view'] // deliberately reduced (custom)
  },
  {
    id: 'USR-008',
    name: 'Ricardo Vega',
    email: 'ricardo.vega@terranova.com',
    role: 'tasador',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    status: 'active',
    lastLogin: '2026-08-26T16:40:00',
    permissions: [...ROLE_DEFAULT_PERMISSIONS.tasador]
  },
  {
    id: 'USR-009',
    name: 'Sofía Ledesma',
    email: 'sofia.ledesma@terranova.com',
    role: 'tasador',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    status: 'inactive',
    lastLogin: '2026-07-29T10:03:00',
    permissions: [...ROLE_DEFAULT_PERMISSIONS.tasador]
  }
]

// Blank user scaffold for the "add user" form.
export const emptyUser = () => ({
  name: '',
  email: '',
  role: 'agente-junior',
  avatar: '',
  status: 'active',
  permissions: [...ROLE_DEFAULT_PERMISSIONS['agente-junior']]
})

// Fallback avatar for users created without a photo URL.
export const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80'

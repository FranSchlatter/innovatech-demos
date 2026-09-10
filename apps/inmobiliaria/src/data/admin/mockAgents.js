// Staff / agents for the admin panel — full HR-style records with metrics & history.

export const AGENT_ROLES = ['Director', 'Broker Senior', 'Agente Junior', 'Asesor', 'Asistente', 'Tasador']
export const AGENT_SHIFTS = [
  { id: 'morning', label: 'Mañana' },
  { id: 'afternoon', label: 'Tarde' },
  { id: 'full', label: 'Jornada completa' }
]
export const AGENT_STATUSES = [
  { id: 'active', label: 'Activo', tone: 'success' },
  { id: 'vacation', label: 'Vacaciones', tone: 'warning' },
  { id: 'inactive', label: 'Inactivo', tone: 'muted' }
]
export const SPECIALTIES = [
  { id: 'sale', label: 'Venta' },
  { id: 'rent', label: 'Alquiler' },
  { id: 'commercial', label: 'Comercial' },
  { id: 'land', label: 'Terrenos' }
]

export const mockAgents = [
  {
    id: 'AG-001',
    name: 'Valentina Ríos',
    role: 'Broker Senior',
    email: 'valentina.rios@terranova.com',
    phone: '+54 11 5123-4501',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    status: 'active',
    shift: 'full',
    zone: 'CABA',
    zones: ['Palermo', 'Recoleta', 'Belgrano'],
    specialties: ['sale', 'commercial'],
    assignedPropertyIds: ['PROP-001', 'PROP-010', 'PROP-014'],
    activeListings: 4,
    activeLeads: 3,
    closedThisMonth: 2,
    closedThisQuarter: 6,
    closedThisYear: 19,
    monthlyTarget: 3,
    commissionGenerated: 84200,
    visitsCompleted: 14,
    visitsScheduled: 17,
    avgResponseMin: 12,
    rating: 4.8,
    history: [
      { id: 'H1', type: 'operation', text: 'Cerró la venta de Semipiso 4 amb. — USD 285.000', date: '2026-08-24' },
      { id: 'H2', type: 'visit', text: 'Atendió visita en Palermo (Depto 3 amb.)', date: '2026-08-23' },
      { id: 'H3', type: 'lead', text: 'Respondió lead de ZonaProp en 8 min', date: '2026-08-22' },
      { id: 'H4', type: 'listing', text: 'Publicó Studio con amenities de hotel', date: '2026-08-20' }
    ]
  },
  {
    id: 'AG-002',
    name: 'Martín Aguirre',
    role: 'Agente Junior',
    email: 'martin.aguirre@terranova.com',
    phone: '+54 11 5123-4502',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    status: 'active',
    shift: 'morning',
    zone: 'GBA Norte',
    zones: ['Nordelta', 'Tigre', 'San Isidro'],
    specialties: ['sale', 'land'],
    assignedPropertyIds: ['PROP-013', 'PROP-007'],
    activeListings: 3,
    activeLeads: 2,
    closedThisMonth: 1,
    closedThisQuarter: 3,
    closedThisYear: 9,
    monthlyTarget: 2,
    commissionGenerated: 41800,
    visitsCompleted: 8,
    visitsScheduled: 12,
    avgResponseMin: 26,
    rating: 4.3,
    history: [
      { id: 'H1', type: 'operation', text: 'Cerró la venta de Casa colonial en country — USD 389.000', date: '2026-08-15' },
      { id: 'H2', type: 'visit', text: 'Atendió visita en Nordelta', date: '2026-08-14' },
      { id: 'H3', type: 'lead', text: 'Respondió lead de ArgenProp', date: '2026-08-12' }
    ]
  },
  {
    id: 'AG-003',
    name: 'Camila Ferrer',
    role: 'Asesor',
    email: 'camila.ferrer@terranova.com',
    phone: '+54 11 5123-4503',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    status: 'active',
    shift: 'afternoon',
    zone: 'CABA',
    zones: ['Caballito', 'Villa Crespo', 'Almagro'],
    specialties: ['rent', 'sale'],
    assignedPropertyIds: ['PROP-003', 'PROP-005'],
    activeListings: 2,
    activeLeads: 2,
    closedThisMonth: 3,
    closedThisQuarter: 7,
    closedThisYear: 22,
    monthlyTarget: 2,
    commissionGenerated: 96500,
    visitsCompleted: 19,
    visitsScheduled: 21,
    avgResponseMin: 9,
    rating: 4.9,
    history: [
      { id: 'H1', type: 'operation', text: 'Reserva de Monoambiente a estrenar — USD 74.500', date: '2026-08-22' },
      { id: 'H2', type: 'visit', text: 'Atendió 3 visitas en Caballito', date: '2026-08-21' },
      { id: 'H3', type: 'lead', text: 'Respondió lead web en 6 min', date: '2026-08-21' },
      { id: 'H4', type: 'operation', text: 'Cerró alquiler en Villa Crespo', date: '2026-08-18' }
    ]
  },
  {
    id: 'AG-004',
    name: 'Diego Santángelo',
    role: 'Asesor',
    email: 'diego.santangelo@terranova.com',
    phone: '+54 11 5123-4504',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    status: 'vacation',
    shift: 'full',
    zone: 'CABA + Costa',
    zones: ['Puerto Madero', 'Pilar'],
    specialties: ['rent', 'commercial'],
    assignedPropertyIds: ['PROP-002', 'PROP-008', 'PROP-011', 'PROP-012'],
    activeListings: 4,
    activeLeads: 2,
    closedThisMonth: 4,
    closedThisQuarter: 8,
    closedThisYear: 24,
    monthlyTarget: 4,
    commissionGenerated: 71300,
    visitsCompleted: 11,
    visitsScheduled: 15,
    avgResponseMin: 34,
    rating: 4.1,
    history: [
      { id: 'H1', type: 'operation', text: 'Cerró alquiler comercial en Puerto Madero', date: '2026-08-10' },
      { id: 'H2', type: 'visit', text: 'Atendió visita en Pilar', date: '2026-08-08' }
    ]
  }
]

// Active agents count as "on duty" for dashboard KPIs
export const getOnDutyAgents = (agents = mockAgents) => agents.filter(a => a.status === 'active')

// Blank agent scaffold for the "add agent" form
export const emptyAgent = () => ({
  name: '', role: 'Asesor', email: '', phone: '',
  photo: '', status: 'active', shift: 'full',
  zone: '', zones: [], specialties: ['sale'],
  assignedPropertyIds: [],
  activeListings: 0, activeLeads: 0,
  closedThisMonth: 0, closedThisQuarter: 0, closedThisYear: 0,
  monthlyTarget: 2, commissionGenerated: 0,
  visitsCompleted: 0, visitsScheduled: 0,
  avgResponseMin: 0, rating: 5, history: []
})

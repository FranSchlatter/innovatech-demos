// Operations / deals in progress mock data (reservations, signings, closings)
export const mockOperations = [
  {
    id: 'OP-001',
    propertyId: 'PROP-003',
    propertyTitle: 'Monoambiente a estrenar ideal inversión',
    type: 'sale',
    client: 'Grupo Inversor Andes',
    agentId: 'AG-003',
    amount: 74500,
    currency: 'USD',
    commission: 2980,
    stage: 'signing',
    reserveDate: '2026-08-22',
    closeDate: '2026-09-20',
    progress: 65
  },
  {
    id: 'OP-002',
    propertyId: 'PROP-014',
    propertyTitle: 'Studio de categoría con amenities de hotel',
    type: 'rent',
    client: 'Ignacio Vera',
    agentId: 'AG-001',
    amount: 540000,
    currency: 'ARS',
    commission: 540000,
    stage: 'reserved',
    reserveDate: '2026-08-25',
    closeDate: '2026-09-05',
    progress: 35
  },
  {
    id: 'OP-003',
    propertyId: 'PROP-013',
    propertyTitle: 'Casa estilo colonial en country consolidado',
    type: 'sale',
    client: 'Familia Zabaleta',
    agentId: 'AG-002',
    amount: 389000,
    currency: 'USD',
    commission: 15560,
    stage: 'closed',
    reserveDate: '2026-07-10',
    closeDate: '2026-08-15',
    progress: 100
  },
  {
    id: 'OP-004',
    propertyId: 'PROP-010',
    propertyTitle: 'Semipiso 4 ambientes con dependencia',
    type: 'sale',
    client: 'Tomás Belgrano',
    agentId: 'AG-001',
    amount: 285000,
    currency: 'USD',
    commission: 11400,
    stage: 'negotiation',
    reserveDate: '2026-08-26',
    closeDate: '2026-09-30',
    progress: 20
  }
]

export const OPERATION_STAGES = [
  { id: 'negotiation', label: 'Negociación' },
  { id: 'reserved', label: 'Reservada' },
  { id: 'signing', label: 'En firma' },
  { id: 'closed', label: 'Cerrada' }
]

export const getOpenOperations = (ops = mockOperations) =>
  ops.filter(o => o.stage !== 'closed')

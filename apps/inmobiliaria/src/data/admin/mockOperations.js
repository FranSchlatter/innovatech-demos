// Operations / deals in progress mock data (reservations, signings, closings)

// Standard document checklist per operation type. `done` reflects the current state.
export const SALE_DOCS = [
  'Reserva firmada',
  'Boleto de compraventa',
  'Informe de dominio',
  'Informe de inhibiciones',
  'Certificado catastral',
  'Escritura'
]
export const RENT_DOCS = [
  'Reserva firmada',
  'Garantía aprobada',
  'Contrato de locación',
  'Seguro de caución',
  'Inventario / estado del inmueble'
]

const docList = (labels, doneCount) =>
  labels.map((label, i) => ({ id: `DOC-${i + 1}`, label, done: i < doneCount }))

export const mockOperations = [
  {
    id: 'OP-001',
    propertyId: 'PROP-003',
    propertyTitle: 'Monoambiente a estrenar ideal inversión',
    type: 'sale',
    client: 'Grupo Inversor Andes',
    buyer: { name: 'Grupo Inversor Andes', email: 'contacto@grupoandes.com', phone: '+54 11 5544-1020' },
    seller: { name: 'Desarrolladora Aleph S.A.', email: 'ventas@aleph.com.ar', phone: '+54 11 4788-3300' },
    agentId: 'AG-003',
    amount: 74500,
    currency: 'USD',
    commissionPct: 4,
    commission: 2980,
    stage: 'signing',
    startDate: '2026-08-22',
    reserveDate: '2026-08-22',
    closeDate: '2026-09-20',
    progress: 65,
    documents: docList(SALE_DOCS, 4),
    timeline: [
      { id: 'T1', stage: 'negotiation', label: 'Oferta aceptada', date: '2026-08-18' },
      { id: 'T2', stage: 'reserved', label: 'Reserva cobrada', date: '2026-08-22' },
      { id: 'T3', stage: 'signing', label: 'Boleto en escribanía', date: '2026-09-02' }
    ],
    noteLog: [
      { id: 'N1', text: 'Comprador solicita adelantar la escritura al 15/09 si es posible.', at: '2026-09-01T14:20:00Z' }
    ]
  },
  {
    id: 'OP-002',
    propertyId: 'PROP-014',
    propertyTitle: 'Studio de categoría con amenities de hotel',
    type: 'rent',
    client: 'Ignacio Vera',
    buyer: { name: 'Ignacio Vera', email: 'ignacio.vera@gmail.com', phone: '+54 11 6123-8890' },
    seller: { name: 'María Elena Fuentes', email: 'me.fuentes@gmail.com', phone: '+54 11 4901-2211' },
    agentId: 'AG-001',
    amount: 540000,
    currency: 'ARS',
    commissionPct: 100,
    commission: 540000,
    stage: 'reserved',
    startDate: '2026-08-25',
    reserveDate: '2026-08-25',
    closeDate: '2026-09-05',
    progress: 35,
    documents: docList(RENT_DOCS, 2),
    timeline: [
      { id: 'T1', stage: 'negotiation', label: 'Interesado seleccionado', date: '2026-08-20' },
      { id: 'T2', stage: 'reserved', label: 'Reserva y seña recibida', date: '2026-08-25' }
    ],
    noteLog: [
      { id: 'N1', text: 'Garantía en revisión: recibos de sueldo pendientes de garante.', at: '2026-08-28T10:05:00Z' }
    ]
  },
  {
    id: 'OP-003',
    propertyId: 'PROP-013',
    propertyTitle: 'Casa estilo colonial en country consolidado',
    type: 'sale',
    client: 'Familia Zabaleta',
    buyer: { name: 'Familia Zabaleta', email: 'jzabaleta@outlook.com', phone: '+54 11 5567-4433' },
    seller: { name: 'Sucesión Iriarte', email: 'estudio.iriarte@gmail.com', phone: '+54 11 4322-9080' },
    agentId: 'AG-002',
    amount: 389000,
    currency: 'USD',
    commissionPct: 4,
    commission: 15560,
    stage: 'closed',
    startDate: '2026-07-10',
    reserveDate: '2026-07-10',
    closeDate: '2026-08-15',
    progress: 100,
    documents: docList(SALE_DOCS, 6),
    timeline: [
      { id: 'T1', stage: 'negotiation', label: 'Oferta aceptada', date: '2026-07-05' },
      { id: 'T2', stage: 'reserved', label: 'Reserva cobrada', date: '2026-07-10' },
      { id: 'T3', stage: 'signing', label: 'Boleto firmado', date: '2026-07-24' },
      { id: 'T4', stage: 'closed', label: 'Escritura y posesión', date: '2026-08-15' }
    ],
    noteLog: [
      { id: 'N1', text: 'Operación cerrada sin observaciones. Comisión facturada.', at: '2026-08-15T17:00:00Z' }
    ]
  },
  {
    id: 'OP-004',
    propertyId: 'PROP-010',
    propertyTitle: 'Semipiso 4 ambientes con dependencia',
    type: 'sale',
    client: 'Tomás Belgrano',
    buyer: { name: 'Tomás Belgrano', email: 'tomas.belgrano@gmail.com', phone: '+54 11 6788-1234' },
    seller: { name: 'Carlos y Ana Petrone', email: 'petrone.fam@gmail.com', phone: '+54 11 4555-6677' },
    agentId: 'AG-001',
    amount: 285000,
    currency: 'USD',
    commissionPct: 4,
    commission: 11400,
    stage: 'negotiation',
    startDate: '2026-08-26',
    reserveDate: '2026-08-26',
    closeDate: '2026-09-30',
    progress: 20,
    documents: docList(SALE_DOCS, 1),
    timeline: [
      { id: 'T1', stage: 'negotiation', label: 'Oferta presentada', date: '2026-08-26' }
    ],
    noteLog: []
  }
]

export const OPERATION_STAGES = [
  { id: 'negotiation', label: 'Negociación' },
  { id: 'reserved', label: 'Reservada' },
  { id: 'signing', label: 'En firma' },
  { id: 'closed', label: 'Cerrada' }
]

export const STAGE_PROGRESS = {
  negotiation: 20,
  reserved: 45,
  signing: 70,
  closed: 100
}

export const getOpenOperations = (ops = mockOperations) =>
  ops.filter(o => o.stage !== 'closed')

// Default document checklist for a fresh operation of the given type
export const defaultDocs = (type) => docList(type === 'rent' ? RENT_DOCS : SALE_DOCS, 0)

// Scheduled property visits mock data
export const mockVisits = [
  {
    id: 'VIS-001',
    propertyId: 'PROP-002',
    propertyTitle: 'Casa moderna 4 dormitorios con pileta y jardín',
    clientName: 'Renata Paz',
    clientPhone: '+54 11 6001-2202',
    agentId: 'AG-002',
    date: '2026-08-27',
    time: '11:00',
    type: 'in-person',
    status: 'confirmed',
    notes: 'Confirmada. Llevar planos y ficha técnica.'
  },
  {
    id: 'VIS-002',
    propertyId: 'PROP-007',
    propertyTitle: 'Oficina premium en torre corporativa',
    clientName: 'Estudio Contable Vega',
    clientPhone: '+54 11 6001-2203',
    agentId: 'AG-003',
    date: '2026-08-27',
    time: '15:30',
    type: 'in-person',
    status: 'scheduled',
    notes: 'Grupo de 3 personas. Coordinar acceso con seguridad de la torre.'
  },
  {
    id: 'VIS-003',
    propertyId: 'PROP-001',
    propertyTitle: 'Departamento 3 ambientes con balcón aterrazado',
    clientName: 'Gabriel Ottone',
    clientPhone: '+54 11 6001-2201',
    agentId: 'AG-001',
    date: '2026-08-28',
    time: '10:00',
    type: 'video',
    status: 'scheduled',
    notes: 'Videollamada. Enviar link de la reunión.'
  },
  {
    id: 'VIS-004',
    propertyId: 'PROP-010',
    propertyTitle: 'Semipiso 4 ambientes con dependencia',
    clientName: 'Tomás Belgrano',
    clientPhone: '+54 11 6001-2204',
    agentId: 'AG-001',
    date: '2026-08-28',
    time: '17:00',
    type: 'in-person',
    status: 'confirmed',
    notes: 'Segunda visita. Viene con su arquitecto.'
  },
  {
    id: 'VIS-005',
    propertyId: 'PROP-005',
    propertyTitle: 'Departamento 2 ambientes en alquiler amoblado',
    clientName: 'Mariana Ortiz',
    clientPhone: '+54 11 6001-2205',
    agentId: 'AG-004',
    date: '2026-08-26',
    time: '18:30',
    type: 'in-person',
    status: 'completed',
    notes: 'Le gustó. Avanza con la solicitud de alquiler.'
  },
  {
    id: 'VIS-006',
    propertyId: 'PROP-004',
    propertyTitle: 'PH 4 ambientes reciclado con terraza propia',
    clientName: 'Julián Rossi',
    clientPhone: '+54 11 6001-2207',
    agentId: 'AG-001',
    date: '2026-08-29',
    time: '12:00',
    type: 'in-person',
    status: 'scheduled',
    notes: 'Primera visita tras contacto web.'
  }
]

export const VISIT_STATUSES = ['scheduled', 'confirmed', 'completed', 'cancelled']

export const getTodayVisits = (visits = mockVisits, today = '2026-08-27') =>
  visits.filter(v => v.date === today)
export const getUpcomingVisits = (visits = mockVisits, today = '2026-08-27') =>
  visits.filter(v => v.date >= today && v.status !== 'cancelled' && v.status !== 'completed')

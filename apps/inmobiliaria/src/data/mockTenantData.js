// Tenant (inquilino) portal mock data — coherent with properties.json.
// Seeded in I12 (multi-role login); the full interactive tenant portal lives in I17.
// Money is ARS. Dates are ISO. "Today" for the demo is 2026-09-11.

export const MOCK_TENANT = {
  name: 'Martín Herrera',
  email: 'martin.herrera@email.com',
  phone: '+54 11 5678-1234',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  dni: '32.145.678'
}

// The active lease. propertyId resolves against properties.json for image/address.
export const TENANT_CONTRACT = {
  propertyId: 'PROP-005',
  landlordName: 'Sofía Alcorta',
  agency: 'Terranova Propiedades',
  startDate: '2025-03-01',
  endDate: '2028-03-01',
  termMonths: 36,
  monthsElapsed: 18, // as of 2026-09
  baseRent: 452000,
  currentRent: 620000,
  currency: 'ARS',
  deposit: 452000,
  index: 'ICL',
  adjustEveryMonths: 3,
  clauses: [
    { label: 'Plazo', value: '36 meses (Ley 27.551)' },
    { label: 'Ajuste', value: 'ICL · cada 3 meses' },
    { label: 'Depósito', value: '1 mes de alquiler' },
    { label: 'Expensas', value: 'A cargo del inquilino' },
    { label: 'Rescisión anticipada', value: 'Preaviso 60 días · 1,5 meses de multa' }
  ]
}

// Rent evolution across the lease (one point per adjustment period).
export const TENANT_RENT_HISTORY = [
  { period: 'Mar 2025', amount: 452000 },
  { period: 'Jun 2025', amount: 478000 },
  { period: 'Sep 2025', amount: 505000 },
  { period: 'Dic 2025', amount: 534000 },
  { period: 'Mar 2026', amount: 562000 },
  { period: 'Jun 2026', amount: 596000 },
  { period: 'Sep 2026', amount: 620000 }
]

// Next adjustment preview — logic mirrors AdjustmentSimulator (admin).
export const TENANT_ADJUSTMENT = {
  index: 'ICL',
  indexValue: 2.1543,
  indexDate: '2026-09-01',
  currentRent: 620000,
  estimatedRent: 652000,
  nextAdjustDate: '2026-12-01'
}

// Last 6 months of rent payments (newest first).
export const TENANT_PAYMENTS = [
  { id: 'PAY-2609', period: 'Septiembre 2026', amount: 620000, status: 'pending', dueDate: '2026-09-10', paidDate: null, method: null },
  { id: 'PAY-2608', period: 'Agosto 2026', amount: 596000, status: 'paid', dueDate: '2026-08-10', paidDate: '2026-08-03', method: 'Efectivo' },
  { id: 'PAY-2607', period: 'Julio 2026', amount: 596000, status: 'paid', dueDate: '2026-07-10', paidDate: '2026-07-04', method: 'Transferencia' },
  { id: 'PAY-2606', period: 'Junio 2026', amount: 596000, status: 'paid', dueDate: '2026-06-10', paidDate: '2026-06-02', method: 'Transferencia' },
  { id: 'PAY-2605', period: 'Mayo 2026', amount: 562000, status: 'paid', dueDate: '2026-05-10', paidDate: '2026-05-05', method: 'MercadoPago' },
  { id: 'PAY-2604', period: 'Abril 2026', amount: 562000, status: 'paid', dueDate: '2026-04-10', paidDate: '2026-04-03', method: 'Transferencia' }
]

export const TENANT_DOCUMENTS = [
  { id: 'TD1', name: 'Contrato de locación.pdf', type: 'Contrato', status: 'available', size: '480 KB' },
  { id: 'TD2', name: 'Recibos de pago 2026.pdf', type: 'Recibos', status: 'available', size: '210 KB' },
  { id: 'TD3', name: 'Garantía propietaria.pdf', type: 'Garantía', status: 'available', size: '1.1 MB' },
  { id: 'TD4', name: 'Seguro de caución.pdf', type: 'Seguro', status: 'available', size: '360 KB' },
  { id: 'TD5', name: 'Reglamento de copropiedad.pdf', type: 'Reglamento', status: 'pending', size: '—' }
]

export const TENANT_REPAIRS = [
  {
    id: 'REP-1',
    title: 'Pérdida en canilla de cocina',
    description: 'Gotea la canilla del bacha de la cocina, humedece el mueble.',
    urgency: 'medium',
    status: 'resolved',
    timeline: [
      { label: 'Solicitada', date: '2026-07-12' },
      { label: 'En revisión', date: '2026-07-13' },
      { label: 'Aprobada', date: '2026-07-14' },
      { label: 'Resuelta', date: '2026-07-18' }
    ]
  },
  {
    id: 'REP-2',
    title: 'Termotanque no calienta',
    description: 'El agua caliente no llega a los ambientes, posible falla del termotanque.',
    urgency: 'high',
    status: 'in-progress',
    timeline: [
      { label: 'Solicitada', date: '2026-09-02' },
      { label: 'En revisión', date: '2026-09-03' },
      { label: 'Aprobada', date: '2026-09-05' }
    ]
  }
]

export const REPAIR_URGENCIES = [
  { id: 'low', label: 'Baja' },
  { id: 'medium', label: 'Media' },
  { id: 'high', label: 'Alta' },
  { id: 'urgent', label: 'Urgente' }
]

export const REPAIR_STATUS = {
  requested: { label: 'Solicitada', cls: 'bg-info/15 text-info' },
  'in-review': { label: 'En revisión', cls: 'bg-warning/15 text-warning' },
  approved: { label: 'Aprobada', cls: 'bg-info/15 text-info' },
  'in-progress': { label: 'En proceso', cls: 'bg-warning/15 text-warning' },
  resolved: { label: 'Resuelta', cls: 'bg-success/15 text-success' }
}

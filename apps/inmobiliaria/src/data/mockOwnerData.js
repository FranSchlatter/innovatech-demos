// Owner (propietario / locador) portal mock data — coherent with properties.json.
// Seeded in I12 (multi-role login); the full interactive owner portal lives in I18.
// Money is ARS. "Today" for the demo is 2026-09-11.

export const MOCK_OWNER = {
  name: 'Sofía Alcorta',
  email: 'sofia.alcorta@email.com',
  phone: '+54 11 4432-9876',
  avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
  cuit: '27-28.456.789-3',
  bank: 'Banco Galicia · CBU 0070···4521'
}

// Rental portfolio. propertyId resolves against properties.json for image/address.
export const OWNER_PROPERTIES = [
  {
    propertyId: 'PROP-005',
    tenant: 'Martín Herrera',
    since: '2025-03-01',
    rent: 620000,
    currency: 'ARS',
    status: 'rented',
    contractEnd: '2028-03-01',
    monthlyExpenses: 62000,
    commissionPct: 8,
    history: [
      { tenant: 'Diego Sosa', from: '2022-02-01', to: '2025-01-31' },
      { tenant: 'Familia Paredes', from: '2019-03-01', to: '2022-01-15' }
    ]
  },
  {
    propertyId: 'PROP-011',
    tenant: 'Renzo Bianchi',
    since: '2024-11-01',
    rent: 780000,
    currency: 'ARS',
    status: 'rented',
    contractEnd: '2027-11-01',
    monthlyExpenses: 48000,
    commissionPct: 8,
    history: [
      { tenant: 'Estudio Norte SRL', from: '2021-10-01', to: '2024-09-30' }
    ]
  },
  {
    propertyId: 'PROP-014',
    tenant: null,
    since: null,
    rent: 540000,
    currency: 'ARS',
    status: 'available',
    contractEnd: null,
    monthlyExpenses: 95000,
    commissionPct: 8,
    history: [
      { tenant: 'Carla Núñez', from: '2023-06-01', to: '2026-07-31' }
    ]
  }
]

// Monthly liquidations (newest first). Amounts aggregate the rented units.
export const OWNER_LIQUIDATIONS = [
  {
    id: 'LIQ-2609',
    period: 'Septiembre 2026',
    collected: 780000,
    commission: 62400,
    expenses: 110000,
    net: 607600,
    status: 'pending'
  },
  {
    id: 'LIQ-2608',
    period: 'Agosto 2026',
    collected: 1376000,
    commission: 110080,
    expenses: 110000,
    net: 1155920,
    status: 'settled'
  },
  {
    id: 'LIQ-2607',
    period: 'Julio 2026',
    collected: 1376000,
    commission: 110080,
    expenses: 110000,
    net: 1155920,
    status: 'settled'
  }
]

// Current-month collection status per property.
export const OWNER_COLLECTION = [
  { propertyId: 'PROP-005', tenant: 'Martín Herrera', amount: 620000, status: 'overdue', dueDate: '2026-09-10' },
  { propertyId: 'PROP-011', tenant: 'Renzo Bianchi', amount: 780000, status: 'collected', dueDate: '2026-09-10' },
  { propertyId: 'PROP-014', tenant: null, amount: 540000, status: 'vacant', dueDate: null }
]

// Collection trend — last 6 months, expected vs collected (ARS).
export const OWNER_COLLECTION_HISTORY = [
  { period: 'Abr', expected: 1330000, collected: 1330000 },
  { period: 'May', expected: 1330000, collected: 1330000 },
  { period: 'Jun', expected: 1376000, collected: 1376000 },
  { period: 'Jul', expected: 1376000, collected: 1376000 },
  { period: 'Ago', expected: 1376000, collected: 1376000 },
  { period: 'Sep', expected: 1400000, collected: 780000 }
]

export const OWNER_DOCUMENTS = [
  { id: 'OD1', propertyId: 'PROP-005', name: 'Contrato con inquilino - Herrera.pdf', type: 'Contrato', status: 'available' },
  { id: 'OD2', propertyId: 'PROP-005', name: 'Título de propiedad.pdf', type: 'Título', status: 'available' },
  { id: 'OD3', propertyId: 'PROP-011', name: 'Contrato con inquilino - Bianchi.pdf', type: 'Contrato', status: 'available' },
  { id: 'OD4', propertyId: 'PROP-011', name: 'Habilitación municipal.pdf', type: 'Habilitación', status: 'available' },
  { id: 'OD5', propertyId: 'PROP-014', name: 'Certificado catastral.pdf', type: 'Catastro', status: 'available' },
  { id: 'OD6', propertyId: 'PROP-014', name: 'Póliza de seguro.pdf', type: 'Seguro', status: 'pending' }
]

export const COLLECTION_STATUS = {
  collected: { label: 'Cobrado', cls: 'bg-success/15 text-success' },
  pending: { label: 'Pendiente', cls: 'bg-warning/15 text-warning' },
  overdue: { label: 'Atrasado', cls: 'bg-error/15 text-error' },
  vacant: { label: 'Sin inquilino', cls: 'bg-surface-alt text-muted' }
}

export const PROPERTY_RENTAL_STATUS = {
  rented: { label: 'Alquilada', cls: 'bg-success/15 text-success' },
  available: { label: 'Disponible', cls: 'bg-info/15 text-info' },
  renovation: { label: 'En refacción', cls: 'bg-warning/15 text-warning' }
}

// Owner (propietario / locador) portal mock data — I18.
// Coherent with the admin: the monthly liquidations reuse the SAME engine as the
// admin panel (`computePeriod` from mockLiquidations) — collected − commission −
// expenses = net, with a per-property breakdown and the same status taxonomy
// (cobrado / parcial / pendiente / atrasado). Everything is derived from the
// rental portfolio so the portal never contradicts the agency's numbers.
// Money is ARS. "Today" for the demo is 2026-09-11 → current period Sep 2026.

import { computePeriod, periodLabel } from './admin/mockLiquidations'

export const OWNER_MGMT_FEE_PCT = 0.08

export const MOCK_OWNER = {
  name: 'Sofía Alcorta',
  email: 'sofia.alcorta@email.com',
  phone: '+54 11 4432-9876',
  avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
  cuit: '27-28.456.789-3',
  address: 'Av. del Libertador 4820 9º B, CABA',
  bank: 'Banco Galicia',
  cbu: '0070042330004500452181',
  alias: 'sofia.alcorta.alq'
}

// ---------------------------------------------------------------------------
// Rental portfolio. `propertyId` resolves against properties.json for the
// image / address / title. Rents match the listing price. Expenses are the
// owner-facing monthly line items (used both for the property card's net and
// for the liquidation breakdown).
// ---------------------------------------------------------------------------
const EXP = (type, label, amount) => ({ type, label, amount })

export const OWNER_PROPERTIES = [
  {
    propertyId: 'PROP-005',
    tenant: 'Martín Herrera',
    since: '2025-03-01',
    rent: 620000,
    currency: 'ARS',
    status: 'rented',
    contractEnd: '2028-03-01',
    commissionPct: 8,
    index: 'ICL',
    expenses: [EXP('Expensas', 'Expensas ordinarias', 42000), EXP('ABL', 'ABL e inmobiliario', 12000), EXP('Seguro', 'Seguro de incendio', 8000)],
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
    commissionPct: 8,
    index: 'ICL',
    expenses: [EXP('Expensas', 'Expensas ordinarias', 30000), EXP('ABL', 'ABL e inmobiliario', 10000), EXP('Seguro', 'Seguro de incendio', 8000)],
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
    commissionPct: 8,
    index: 'ICL',
    // While vacant the owner still carries the fixed costs (no income to offset).
    expenses: [EXP('Expensas', 'Expensas ordinarias', 68000), EXP('ABL', 'ABL e inmobiliario', 14000), EXP('Seguro', 'Seguro de incendio', 13000)],
    history: [
      { tenant: 'Carla Núñez', from: '2023-06-01', to: '2026-07-31' }
    ]
  }
]

const propMeta = (id) => OWNER_PROPERTIES.find((p) => p.propertyId === id)

// ---------------------------------------------------------------------------
// Monthly liquidation periods, built from the portfolio. Rents step up at the
// July 2026 quarterly ICL adjustment; a one-off repair lands in July so the
// breakdown isn't perfectly flat. The current month (Sep) has Herrera overdue.
// ---------------------------------------------------------------------------
const RENT_TIERS = {
  'PROP-005': { A: 578000, B: 620000 },
  'PROP-011': { A: 728000, B: 780000 }
}

// oldest → newest; `tier` picks the rent in effect, `extra` adds one-off expenses.
const PERIOD_SPECS = [
  { month: 4, tier: 'A' },
  { month: 5, tier: 'A' },
  { month: 6, tier: 'A' },
  { month: 7, tier: 'B', extra: { 'PROP-005': [EXP('Reparaciones', 'Service de aire acondicionado', 46000)] } },
  { month: 8, tier: 'B' },
  { month: 9, tier: 'B', current: true }
]

const YEAR = 2026
const ACTIVE_IDS = ['PROP-005', 'PROP-011'] // vacant unit is excluded from rent

// Base recurring expenses per property for a liquidation period (Seguro is the
// current-card cost; monthly liquidations carry Expensas + ABL).
const periodExpenses = (id) => propMeta(id).expenses
  .filter((e) => e.type !== 'Seguro')
  .map((e, i) => ({ id: `E${i + 1}`, ...e }))

function buildPeriod(spec) {
  const properties = ACTIVE_IDS.map((id) => {
    const rentDue = RENT_TIERS[id][spec.tier]
    // Current month: Herrera (PROP-005) is overdue; Bianchi already paid.
    const overdue = spec.current && id === 'PROP-005'
    const collectDate = spec.current
      ? (overdue ? null : `${YEAR}-09-08`)
      : `${YEAR}-${String(spec.month).padStart(2, '0')}-06`
    const extra = (spec.extra?.[id] || []).map((e, i) => ({ id: `EX${i + 1}`, ...e }))
    return {
      propertyId: id,
      tenant: propMeta(id).tenant,
      rentDue,
      rentCollected: overdue ? 0 : rentDue,
      collectDate,
      dueDate: `${YEAR}-${String(spec.month).padStart(2, '0')}-10`,
      status: overdue ? 'atrasado' : 'cobrado',
      expenses: [...periodExpenses(id), ...extra]
    }
  })
  return {
    id: `LIQ-${YEAR}${String(spec.month).padStart(2, '0')}`,
    period: periodLabel(spec.month, YEAR),
    month: spec.month,
    year: YEAR,
    current: !!spec.current,
    status: spec.current ? 'pending' : 'settled',
    properties
  }
}

// Newest first (matches the admin's period ordering).
export const OWNER_PERIODS = PERIOD_SPECS.map(buildPeriod).reverse()

// Compute a period's totals with the owner's management fee (admin engine).
export const computeOwnerPeriod = (period) => computePeriod(period, OWNER_MGMT_FEE_PCT)

const currentPeriod = OWNER_PERIODS[0]

// ---------------------------------------------------------------------------
// Current-month collection status per property (drives the "Estado de cobro"
// dashboard). Derived from the current period + the vacant unit.
// ---------------------------------------------------------------------------
export const OWNER_COLLECTION = [
  ...currentPeriod.properties.map((p) => ({
    propertyId: p.propertyId,
    tenant: p.tenant,
    amount: p.rentDue,
    status: p.status,
    dueDate: p.dueDate,
    collectDate: p.collectDate
  })),
  { propertyId: 'PROP-014', tenant: null, amount: 540000, status: 'vacant', dueDate: null, collectDate: null }
]

// Collection trend — last 6 months, expected vs collected (ARS). Derived.
const SHORT_MONTHS = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
export const OWNER_COLLECTION_HISTORY = [...OWNER_PERIODS]
  .reverse()
  .map((p) => {
    const c = computeOwnerPeriod(p)
    const expected = p.properties.reduce((s, x) => s + x.rentDue, 0)
    return { period: SHORT_MONTHS[p.month], expected, collected: c.grossCollected }
  })

// ---------------------------------------------------------------------------
// Documents — organised by property. Uploaded docs land as "pending" review.
// ---------------------------------------------------------------------------
export const OWNER_DOCUMENTS = [
  { id: 'OD1', propertyId: 'PROP-005', name: 'Contrato de alquiler - Herrera.pdf', type: 'contract', kind: 'pdf', size: '310 KB', uploadedAt: '2025-03-01', status: 'available' },
  { id: 'OD2', propertyId: 'PROP-005', name: 'Título de propiedad.pdf', type: 'title', kind: 'pdf', size: '2.1 MB', uploadedAt: '2019-02-10', status: 'available' },
  { id: 'OD3', propertyId: 'PROP-005', name: 'Certificado catastral.pdf', type: 'cadastre', kind: 'pdf', size: '180 KB', uploadedAt: '2024-11-20', status: 'available' },
  { id: 'OD4', propertyId: 'PROP-011', name: 'Contrato de alquiler - Bianchi.pdf', type: 'contract', kind: 'pdf', size: '298 KB', uploadedAt: '2024-11-01', status: 'available' },
  { id: 'OD5', propertyId: 'PROP-011', name: 'Habilitación municipal.pdf', type: 'permit', kind: 'pdf', size: '145 KB', uploadedAt: '2024-10-05', status: 'available' },
  { id: 'OD6', propertyId: 'PROP-011', name: 'Póliza de seguro integral.pdf', type: 'insurance', kind: 'pdf', size: '220 KB', uploadedAt: '2026-01-15', status: 'available' },
  { id: 'OD7', propertyId: 'PROP-014', name: 'Certificado catastral.pdf', type: 'cadastre', kind: 'pdf', size: '176 KB', uploadedAt: '2023-05-28', status: 'available' },
  { id: 'OD8', propertyId: 'PROP-014', name: 'Póliza de seguro integral.pdf', type: 'insurance', kind: 'pdf', size: '210 KB', uploadedAt: '2026-02-01', status: 'pending' }
]

// Document types offered in the owner upload modal.
export const OWNER_DOC_TYPES = [
  { id: 'contract', label: 'Contrato con inquilino', kind: 'pdf' },
  { id: 'title', label: 'Título de propiedad', kind: 'pdf' },
  { id: 'permit', label: 'Habilitación municipal', kind: 'pdf' },
  { id: 'cadastre', label: 'Certificado catastral', kind: 'pdf' },
  { id: 'insurance', label: 'Póliza de seguro', kind: 'pdf' },
  { id: 'other', label: 'Otro documento', kind: 'doc' }
]

export const ownerDocLabel = (type) => OWNER_DOC_TYPES.find((t) => t.id === type)?.label || 'Documento'
export const ownerDocKind = (type) => OWNER_DOC_TYPES.find((t) => t.id === type)?.kind || 'doc'
export const OWNER_DOCS_KEY = 'inmob-portal-owner-docs-v1'

export const OWNER_DOC_STATUS = {
  available: { label: 'Disponible', cls: 'bg-success text-white', dot: 'bg-success' },
  pending: { label: 'En revisión', cls: 'bg-warning text-white', dot: 'bg-warning' }
}

// ---------------------------------------------------------------------------
// Status maps — SOLID fills (alpha over theme colors is a no-op in this app).
// ---------------------------------------------------------------------------
export const COLLECTION_STATUS = {
  cobrado: { label: 'Cobrado', cls: 'bg-success text-white' },
  parcial: { label: 'Parcial', cls: 'bg-info text-white' },
  pendiente: { label: 'Pendiente', cls: 'bg-warning text-white' },
  atrasado: { label: 'Atrasado', cls: 'bg-error text-white' },
  vacant: { label: 'Sin inquilino', cls: 'bg-surface-alt text-muted' }
}

export const PROPERTY_RENTAL_STATUS = {
  rented: { label: 'Alquilada', cls: 'bg-success text-white' },
  available: { label: 'Disponible', cls: 'bg-info text-white' },
  renovation: { label: 'En refacción', cls: 'bg-warning text-white' }
}

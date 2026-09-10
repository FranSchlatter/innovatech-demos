// Owner liquidations — what each property owner gets paid each month after the
// agency's management fee and per-property expenses. ARS. Ported/adapted from v2.

export const EXPENSE_TYPES = [
  'Expensas', 'ABL', 'Impuesto inmobiliario', 'Reparaciones', 'Seguro', 'Administración', 'Otros'
]

export const COLLECTION_STATUS = [
  { id: 'cobrado', label: 'Cobrado', tone: 'success' },
  { id: 'parcial', label: 'Parcial', tone: 'info' },
  { id: 'pendiente', label: 'Pendiente', tone: 'warning' },
  { id: 'atrasado', label: 'Atrasado', tone: 'error' }
]

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const periodLabel = (month, year) => `${MONTH_NAMES[month - 1]} ${year}`

// Owners with their CURRENT-period detail. History is generated from this.
const ownerSeeds = [
  {
    id: 'OWN-001', owner: 'Roberto Salas', cuit: '20-14203945-7',
    address: 'Av. Santa Fe 2450 8º B, CABA',
    bank: { bank: 'Banco Galicia', cbu: '0070999530000012345678', alias: 'roberto.salas.alq' },
    mgmtFeePct: 0.08,
    properties: [
      {
        id: 'LP-1', title: 'Depto 2 amb. amoblado · Palermo', address: 'Gorriti 4820 3º A',
        tenant: 'Mariana Ortiz', rentDue: 654000, rentCollected: 654000, collectDate: '2026-08-05', status: 'cobrado',
        expenses: [
          { id: 'E1', type: 'Reparaciones', label: 'Reparación plomería', amount: 48000 },
          { id: 'E2', type: 'Expensas', label: 'Expensas ordinarias', amount: 26000 }
        ]
      },
      {
        id: 'LP-2', title: 'Monoambiente · Villa Crespo', address: 'Aguirre 1120 5º C',
        tenant: 'Lucas Prieto', rentDue: 415000, rentCollected: 415000, collectDate: '2026-08-07', status: 'cobrado',
        expenses: [
          { id: 'E1', type: 'Expensas', label: 'Expensas ordinarias', amount: 18000 }
        ]
      }
    ]
  },
  {
    id: 'OWN-002', owner: 'Inversiones del Litoral S.A.', cuit: '30-71099284-3',
    address: 'Torre Corporativa, Puerto Madero, CABA',
    bank: { bank: 'Banco Santander', cbu: '0720111120000098765432', alias: 'inv.litoral.sa' },
    mgmtFeePct: 0.06,
    properties: [
      {
        id: 'LP-1', title: 'Oficina premium · Torre Corporativa', address: 'Av. Alicia M. de Justo 500 12º',
        tenant: 'Estudio Contable Vega', rentDue: 2310000, rentCollected: 2310000, collectDate: '2026-08-04', status: 'cobrado',
        expenses: [
          { id: 'E1', type: 'Seguro', label: 'Seguro integral', amount: 35000 },
          { id: 'E2', type: 'Expensas', label: 'Expensas torre', amount: 145000 }
        ]
      },
      {
        id: 'LP-2', title: 'Local comercial · Centro', address: 'Florida 340 PB',
        tenant: 'Farmacia San Martín', rentDue: 890000, rentCollected: 0, collectDate: null, status: 'pendiente',
        expenses: []
      }
    ]
  },
  {
    id: 'OWN-003', owner: 'Familia Grimaldi', cuit: '27-18904562-1',
    address: 'Barrio Ayres del Pilar, Pilar, GBA',
    bank: { bank: 'Banco Nación', cbu: '0110222230000045678912', alias: 'grimaldi.familia' },
    mgmtFeePct: 0.08,
    properties: [
      {
        id: 'LP-1', title: 'Casa quinta c/ parque · Pilar', address: 'Los Robles 245, Ayres del Pilar',
        tenant: 'Familia Duarte', rentDue: 1207000, rentCollected: 1207000, collectDate: '2026-08-06', status: 'cobrado',
        expenses: [
          { id: 'E1', type: 'Reparaciones', label: 'Mantenimiento de parque', amount: 60000 },
          { id: 'E2', type: 'Otros', label: 'Poda y limpieza de pileta', amount: 28000 }
        ]
      }
    ]
  }
]

const CURRENT_MONTH = 8
const CURRENT_YEAR = 2026
// Rent creep factors for the 5 months before the current one (oldest → newest)
const HISTORY_FACTORS = [0.82, 0.86, 0.90, 0.94, 0.97]

const pid = (ownerId, year, month) => `${ownerId}-${year}${String(month).padStart(2, '0')}`

// Build a prior period from the current property template (all collected, light expenses)
const buildPriorProperties = (properties, factor) =>
  properties.map((p) => {
    const rent = Math.round(p.rentDue * factor / 1000) * 1000
    return {
      id: p.id, title: p.title, address: p.address, tenant: p.tenant,
      rentDue: rent, rentCollected: rent, collectDate: null, status: 'cobrado',
      expenses: [{ id: 'E1', type: 'Expensas', label: 'Expensas ordinarias', amount: Math.round(rent * 0.05 / 1000) * 1000 }]
    }
  })

const buildOwner = (seed) => {
  const periods = []
  // 5 prior months (March → July)
  HISTORY_FACTORS.forEach((factor, i) => {
    const monthsAgo = HISTORY_FACTORS.length - i // 5,4,3,2,1
    const month = CURRENT_MONTH - monthsAgo
    periods.push({
      id: pid(seed.id, CURRENT_YEAR, month),
      period: periodLabel(month, CURRENT_YEAR),
      month, year: CURRENT_YEAR,
      properties: buildPriorProperties(seed.properties, factor)
    })
  })
  // current month (August) — with real statuses & expenses
  periods.push({
    id: pid(seed.id, CURRENT_YEAR, CURRENT_MONTH),
    period: periodLabel(CURRENT_MONTH, CURRENT_YEAR),
    month: CURRENT_MONTH, year: CURRENT_YEAR,
    properties: seed.properties
  })
  // newest first
  periods.reverse()
  return {
    id: seed.id, owner: seed.owner, cuit: seed.cuit, address: seed.address,
    bank: seed.bank, mgmtFeePct: seed.mgmtFeePct, periods
  }
}

export const liquidations = ownerSeeds.map(buildOwner)

// Compute totals for a single period given the owner's management fee
export function computePeriod(period, mgmtFeePct) {
  const perProperty = period.properties.map((p) => {
    const collected = p.status === 'cobrado' ? p.rentCollected
      : p.status === 'parcial' ? p.rentCollected : 0
    const expensesTotal = p.expenses.reduce((a, e) => a + (Number(e.amount) || 0), 0)
    const subtotal = collected - expensesTotal
    return { ...p, collected, expensesTotal, subtotal }
  })
  const grossCollected = perProperty.reduce((a, p) => a + p.collected, 0)
  const expensesTotal = perProperty.reduce((a, p) => a + p.expensesTotal, 0)
  const mgmtFee = Math.round(grossCollected * mgmtFeePct)
  const net = grossCollected - mgmtFee - expensesTotal
  const pending = period.properties
    .filter((p) => p.status === 'pendiente' || p.status === 'atrasado')
    .reduce((a, p) => a + p.rentDue, 0)
  return { perProperty, grossCollected, expensesTotal, mgmtFee, net, pending }
}

// Legacy helper kept for backward compatibility (owner-level, current period)
export function computeLiquidation(owner) {
  const current = owner.periods?.[0]
  return current ? computePeriod(current, owner.mgmtFeePct) : { grossCollected: 0, expensesTotal: 0, mgmtFee: 0, net: 0, pending: 0 }
}

// Build a fresh (empty) period for an owner from their latest property template
export function buildNewPeriod(owner, month, year) {
  const template = owner.periods?.[0]?.properties || []
  return {
    id: pid(owner.id, year, month),
    period: periodLabel(month, year),
    month, year,
    properties: template.map((p) => ({
      id: p.id, title: p.title, address: p.address, tenant: p.tenant,
      rentDue: p.rentDue, rentCollected: p.rentDue, collectDate: null, status: 'pendiente',
      expenses: []
    }))
  }
}

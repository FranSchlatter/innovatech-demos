// Rental contracts + adjustment indices (ICL / UVA / IPC) for the live adjustment simulator.
// The differentiator for AR real estate: contracts adjust by an index every N months.
// Demo only. Monthly rates are representative averages used to compound each period.
// `value` / `asOf` are mock published index levels shown as a live ticker.

export const INDICES = {
  ICL: {
    id: 'ICL', name: 'ICL (BCRA)', monthly: 0.055, cssVar: 'var(--color-accent)',
    value: 1287.4, asOf: '2026-09-01',
    note: 'Índice de Contratos de Locación — el más usado en alquileres.'
  },
  UVA: {
    id: 'UVA', name: 'UVA', monthly: 0.050, cssVar: 'var(--color-success)',
    value: 1794.06, asOf: '2026-09-15',
    note: 'Unidad de Valor Adquisitivo, ajusta por CER.'
  },
  IPC: {
    id: 'IPC', name: 'IPC (INDEC)', monthly: 0.032, cssVar: 'var(--color-info)',
    value: 8456.78, asOf: '2026-08-31',
    note: 'Inflación minorista, ajuste más suave.'
  }
}

export const FREQUENCIES = [
  { months: 3, label: 'Trimestral' },
  { months: 4, label: 'Cuatrimestral' },
  { months: 6, label: 'Semestral' },
  { months: 12, label: 'Anual' }
]

// Demo "current date". Deterministic so the "próximo ajuste" alert is always
// reproducible; keep aligned with the app's reference date.
export const TODAY = '2026-09-19'

// Full contract records. The first three power the adjustment simulator (I24) and
// the tenant portal (I17) — their core numeric fields (baseRent/index/freqMonths/
// termMonths/startDate) MUST stay stable. Everything else is additive and feeds the
// contracts-management table (I25): parties, agent, deposit, clauses, status.
// `endDate` is optional: when null it's derived from startDate + termMonths; a
// renewal writes an explicit endDate override. `terminatedDate` flags a rescission.
export const contracts = [
  { id: 'CT-1041', tenant: 'Mariana Ortiz', property: 'Depto 2 amb. amoblado · Palermo',
    startMonth: 'Jul 2026', startDate: '2026-07-01', index: 'ICL', freqMonths: 3, termMonths: 36,
    baseRent: 620000, lateFeeDaily: 0.001,
    propertyId: 'PROP-005', address: 'Gorriti 4820 3º A · Palermo, CABA',
    tenantEmail: 'mariana.ortiz@gmail.com', tenantPhone: '+54 11 6234-8890',
    owner: 'Roberto Salas', ownerCuit: '20-14203945-7', agentId: 'AG-001',
    deposit: 620000, endDate: null, terminatedDate: null, terminatedReason: null },

  { id: 'CT-1058', tenant: 'Estudio Contable Vega', property: 'Oficina premium · Torre Corporativa',
    startMonth: 'Ene 2026', startDate: '2026-01-01', index: 'IPC', freqMonths: 6, termMonths: 36,
    baseRent: 2200000, lateFeeDaily: 0.0015,
    propertyId: 'PROP-007', address: 'Av. Alicia M. de Justo 500 12º · Catalinas, CABA',
    tenantEmail: 'admin@estudiovega.com.ar', tenantPhone: '+54 11 4311-2020',
    owner: 'Inversiones del Litoral S.A.', ownerCuit: '30-71099284-3', agentId: 'AG-003',
    deposit: 4400000, endDate: null, terminatedDate: null, terminatedReason: null,
    extraClauses: ['Destino comercial exclusivo (oficina)', 'Gastos de torre y ABL a cargo del locatario'] },

  { id: 'CT-1063', tenant: 'Familia Duarte', property: 'Casa quinta c/ parque · Pilar',
    startMonth: 'May 2026', startDate: '2026-05-01', index: 'UVA', freqMonths: 4, termMonths: 24,
    baseRent: 1150000, lateFeeDaily: 0.001,
    propertyId: 'PROP-006', address: 'Camino Real 780 · La Lonja, Pilar',
    tenantEmail: 'duarte.familia@gmail.com', tenantPhone: '+54 230 415-6677',
    owner: 'Familia Grimaldi', ownerCuit: '27-18904562-1', agentId: 'AG-002',
    deposit: 1150000, endDate: null, terminatedDate: null, terminatedReason: null,
    extraClauses: ['Mantenimiento del parque y pileta a cargo del locatario'] },

  // ---- Older / edge-case contracts (management table only) ----

  // Por vencer (43 días): renovación inminente
  { id: 'CT-1070', tenant: 'Lucas Prieto', property: 'Monoambiente · Villa Crespo',
    startMonth: 'Nov 2023', startDate: '2023-11-01', index: 'ICL', freqMonths: 3, termMonths: 36,
    baseRent: 290000, lateFeeDaily: 0.001,
    propertyId: null, address: 'Aguirre 1120 5º C · Villa Crespo, CABA',
    tenantEmail: 'lucas.prieto@outlook.com', tenantPhone: '+54 11 6712-3341',
    owner: 'Roberto Salas', ownerCuit: '20-14203945-7', agentId: 'AG-003',
    deposit: 290000, endDate: null, terminatedDate: null, terminatedReason: null },

  // Vencido (49 días atrás): candidato a renovación / cierre
  { id: 'CT-1072', tenant: 'Farmacia San Martín', property: 'Local comercial · Centro',
    startMonth: 'Ago 2023', startDate: '2023-08-01', index: 'IPC', freqMonths: 6, termMonths: 36,
    baseRent: 520000, lateFeeDaily: 0.0015,
    propertyId: null, address: 'Florida 340 PB · Centro, CABA',
    tenantEmail: 'compras@farmaciasanmartin.com', tenantPhone: '+54 11 4322-7788',
    owner: 'Inversiones del Litoral S.A.', ownerCuit: '30-71099284-3', agentId: 'AG-001',
    deposit: 1040000, endDate: null, terminatedDate: null, terminatedReason: null,
    extraClauses: ['Destino comercial (farmacia)', 'Habilitación municipal a cargo del locatario'] },

  // Rescindido anticipadamente
  { id: 'CT-1075', tenant: 'Tomás Rivas', property: 'Studio de categoría · Puerto Madero',
    startMonth: 'Mar 2025', startDate: '2025-03-01', index: 'UVA', freqMonths: 3, termMonths: 24,
    baseRent: 480000, lateFeeDaily: 0.001,
    propertyId: 'PROP-014', address: 'Juana Manso 1500 8º · Puerto Madero, CABA',
    tenantEmail: 'tomas.rivas@gmail.com', tenantPhone: '+54 11 6890-1122',
    owner: 'Grupo Delta Inversiones', ownerCuit: '30-70884512-9', agentId: 'AG-004',
    deposit: 480000, endDate: null, terminatedDate: '2026-06-15',
    terminatedReason: 'Rescisión anticipada del locatario (traslado laboral). Preaviso cumplido.' },

  // Vigente reciente
  { id: 'CT-1078', tenant: 'Sofía Belén Cabrera', property: 'Loft industrial · Palermo Hollywood',
    startMonth: 'Ago 2026', startDate: '2026-08-01', index: 'ICL', freqMonths: 3, termMonths: 24,
    baseRent: 720000, lateFeeDaily: 0.001,
    propertyId: 'PROP-011', address: 'Costa Rica 5800 PB · Palermo Hollywood, CABA',
    tenantEmail: 'sofia.cabrera@gmail.com', tenantPhone: '+54 11 6455-2210',
    owner: 'Andrea Molteni', ownerCuit: '27-30122984-4', agentId: 'AG-002',
    deposit: 720000, endDate: null, terminatedDate: null, terminatedReason: null },

  // Por vencer muy próximo (26 días) — temporario
  { id: 'CT-1080', tenant: 'Marcelo Ferreyra', property: 'Depto temporario frente al mar · Playa Grande',
    startMonth: 'Ene 2026', startDate: '2026-01-15', index: 'IPC', freqMonths: 3, termMonths: 9,
    baseRent: 900000, lateFeeDaily: 0.002,
    propertyId: 'PROP-012', address: 'Bv. Marítimo 2200 · Playa Grande, Mar del Plata',
    tenantEmail: 'marcelo.ferreyra@gmail.com', tenantPhone: '+54 223 512-9080',
    owner: 'Costa Atlántica S.R.L.', ownerCuit: '30-71544120-6', agentId: 'AG-004',
    deposit: 1800000, endDate: null, terminatedDate: null, terminatedReason: null,
    extraClauses: ['Contrato temporario (Art. 1199 CCyC)', 'Servicios y expensas incluidos en el canon'] }
]

// ---------- Date helpers (TZ-safe: build Dates from parts, never Date.parse of ISO) ----------

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISO(dt) {
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const d = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addMonths(iso, n) {
  const dt = parseISO(iso)
  dt.setMonth(dt.getMonth() + n)
  return toISO(dt)
}

export function daysBetween(fromISO, toISOv) {
  return Math.round((parseISO(toISOv) - parseISO(fromISO)) / 86400000)
}

// "01 Oct 2026"
export function fmtDate(iso) {
  const dt = parseISO(iso)
  return `${String(dt.getDate()).padStart(2, '0')} ${MONTHS_ES[dt.getMonth()]} ${dt.getFullYear()}`
}

// "Jul '26"
export function fmtMonthYear(iso) {
  const dt = parseISO(iso)
  return `${MONTHS_ES[dt.getMonth()]} '${String(dt.getFullYear()).slice(2)}`
}

// ---------- Projection engine ----------

// Project rent across the contract term, applying the index every `freqMonths`.
// If `startDate` is passed, each row also carries calendar labels/ISO ranges.
export function projectAdjustments({ baseRent, index, freqMonths, termMonths, startDate }) {
  const monthly = INDICES[index]?.monthly ?? 0
  const periodFactor = Math.pow(1 + monthly, freqMonths) // compounded index over the period
  const periods = Math.ceil(termMonths / freqMonths)
  const rows = []
  let rent = baseRent
  for (let p = 0; p < periods; p++) {
    const fromMonth = p * freqMonths + 1
    const toMonth = Math.min((p + 1) * freqMonths, termMonths)
    const pct = p === 0 ? 0 : Math.round((periodFactor - 1) * 1000) / 10
    let range = `Mes ${fromMonth}–${toMonth}`
    let short = `P${p + 1}`
    let fromDate = null
    let toDate = null
    if (startDate) {
      fromDate = addMonths(startDate, fromMonth - 1)
      toDate = addMonths(startDate, toMonth - 1)
      range = `${fmtMonthYear(fromDate)}–${fmtMonthYear(toDate)}`
      short = fmtMonthYear(fromDate)
    }
    rows.push({
      period: p + 1,
      range,
      short,
      fromMonth,
      toMonth,
      fromDate,
      toDate,
      rent: Math.round(rent),
      pct,
      cumulative: Math.round(((rent / baseRent) - 1) * 1000) / 10
    })
    rent = rent * periodFactor
  }
  return rows
}

// Given projected rows + contract cadence, work out where "today" sits: the current
// period being paid and the next scheduled adjustment (date, days away, before/after rent).
export function contractStatus({ rows, startDate, freqMonths, today = TODAY }) {
  const periods = rows.length
  let currentIndex = 0
  for (let p = 1; p < periods; p++) {
    const dateISO = addMonths(startDate, p * freqMonths)
    if (daysBetween(today, dateISO) <= 0) currentIndex = p // adjustment already applied
  }
  let next = null
  for (let p = 1; p < periods; p++) {
    const dateISO = addMonths(startDate, p * freqMonths)
    const days = daysBetween(today, dateISO)
    if (days > 0) {
      next = {
        periodIndex: p,
        dateISO,
        days,
        prevRow: rows[p - 1],
        row: rows[p],
        deltaAmount: rows[p].rent - rows[p - 1].rent,
        deltaPct: rows[p].pct
      }
      break
    }
  }
  return { currentIndex, next }
}

// ---------- Contract-management model (I25) ----------

// Visual + filter metadata per lifecycle state. Tones map to SOLID fills in the UI
// (alpha over theme colors is a no-op in this app — see project memory).
export const CONTRACT_STATUSES = [
  { id: 'active', label: 'Vigente', tone: 'success' },
  { id: 'expiring', label: 'Por vencer', tone: 'warning' },
  { id: 'expired', label: 'Vencido', tone: 'error' },
  { id: 'terminated', label: 'Rescindido', tone: 'muted' }
]

export const CONTRACT_STATUS = CONTRACT_STATUSES.reduce((acc, s) => { acc[s.id] = s; return acc }, {})

// Threshold (days) under which a live contract is flagged "por vencer".
export const EXPIRY_WINDOW_DAYS = 90

// Effective end date: explicit override (set by a renewal) wins over term-derived.
export function contractEndDate(c) {
  return c.endDate || addMonths(c.startDate, c.termMonths)
}

// Small deterministic hash so per-contract mock details (doc statuses) are stable
// across reloads without persisting them.
function seedFromId(id) {
  let h = 2166136261
  for (const ch of String(id)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) }
  return h >>> 0
}

// Standard lease clauses, composed from the contract's own terms + any extras.
export function contractClauses(c) {
  const lateFeePct = (c.lateFeeDaily * 100).toFixed(2)
  const freqLabel = FREQUENCIES.find((f) => f.months === c.freqMonths)?.label || `cada ${c.freqMonths} meses`
  const base = [
    `Plazo de locación: ${c.termMonths} meses (Ley 27.551).`,
    `Ajuste por índice ${c.index} — ${freqLabel.toLowerCase()}.`,
    `Depósito en garantía: ${c.deposit ? `equivalente a ${Math.max(1, Math.round(c.deposit / c.baseRent))} mes(es) de alquiler` : '1 mes de alquiler'}.`,
    `Interés punitorio por mora: ${lateFeePct}% diario sobre el canon vigente.`,
    'Preaviso de rescisión anticipada: 60 días corridos.',
    'Expensas ordinarias y servicios a cargo del locatario, salvo pacto en contrario.'
  ]
  return [...base, ...(c.extraClauses || [])]
}

// Documents attached to a contract. Deterministic statuses seeded by id so the
// table/detail stay consistent between renders.
export function contractDocuments(c) {
  const seed = seedFromId(c.id)
  const defs = [
    { key: 'contrato', name: `Contrato de locación ${c.id}.pdf`, kind: 'pdf', size: '1.4 MB' },
    { key: 'garantia', name: 'Garantía / Seguro de caución.pdf', kind: 'pdf', size: '820 KB' },
    { key: 'dni', name: 'DNI locatario.pdf', kind: 'pdf', size: '640 KB' },
    { key: 'deposito', name: 'Recibo de depósito en garantía.pdf', kind: 'pdf', size: '210 KB' },
    { key: 'inventario', name: 'Inventario y estado del inmueble.pdf', kind: 'pdf', size: '1.1 MB' }
  ]
  return defs.map((d, i) => {
    // ~1 in 5 documents pending; the signed contract is always verified.
    const pending = d.key !== 'contrato' && ((seed >> (i * 3)) % 5 === 0)
    return {
      id: `${c.id}-${d.key}`,
      name: d.name,
      kind: d.kind,
      size: d.size,
      date: addMonths(c.startDate, 0),
      status: pending ? 'pending' : 'verified'
    }
  })
}

// Full lifecycle derivation for one contract at a reference date. Reuses the SAME
// projection engine as the simulator and tenant/owner portals — the table shows
// exactly the numbers everyone else sees.
export function deriveContract(c, today = TODAY) {
  const rows = projectAdjustments({
    baseRent: c.baseRent, index: c.index, freqMonths: c.freqMonths,
    termMonths: c.termMonths, startDate: c.startDate
  })
  const st = contractStatus({ rows, startDate: c.startDate, freqMonths: c.freqMonths, today })
  const endDate = contractEndDate(c)
  const daysToEnd = daysBetween(today, endDate)

  let statusId
  if (c.terminatedDate) statusId = 'terminated'
  else if (daysToEnd < 0) statusId = 'expired'
  else if (daysToEnd <= EXPIRY_WINDOW_DAYS) statusId = 'expiring'
  else statusId = 'active'

  const currentRow = rows[st.currentIndex] || rows[rows.length - 1] || rows[0]

  // Adjustment history: every period boundary after the first is an adjustment.
  const adjustments = []
  for (let p = 1; p < rows.length; p++) {
    const dateISO = addMonths(c.startDate, p * c.freqMonths)
    adjustments.push({
      n: p,
      dateISO,
      applied: daysBetween(today, dateISO) <= 0,
      prevRent: rows[p - 1].rent,
      newRent: rows[p].rent,
      pct: rows[p].pct,
      cumulative: rows[p].cumulative
    })
  }

  const alive = statusId !== 'terminated' && statusId !== 'expired'

  return {
    ...c,
    rows,
    endDate,
    daysToEnd,
    statusId,
    status: CONTRACT_STATUS[statusId],
    currentRent: currentRow.rent,
    currentRange: currentRow.range,
    nextAdjustment: alive ? st.next : null,
    adjustments,
    clauses: contractClauses(c),
    documents: c.documents || contractDocuments(c)
  }
}

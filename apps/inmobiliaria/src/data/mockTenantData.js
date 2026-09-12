// Tenant (inquilino) portal mock data — coherent with properties.json AND with the
// admin AdjustmentSimulator: the whole financial model is DERIVED from the same
// `projectAdjustments` engine + `INDICES` rates used in the admin panel. That is the
// product point of the feature — "el inquilino y el propietario ven la misma
// proyección, cero sorpresas en cada ajuste".
//
// Single source of truth: from a base rent + ICL index + quarterly frequency we
// derive the rent projection, the 12 monthly payments, the rent-evolution chart,
// the next-adjustment estimate and the downloadable receipts. Change BASE_RENT or
// the index and everything below stays consistent.
//
// Money is ARS. Dates are ISO. "Today" for the demo is 2026-09-11.

import { INDICES, projectAdjustments } from './admin/mockContracts'

// ---------- Contract parameters (the seed for everything derived) ----------
const BASE_RENT = 237000          // month-1 rent (Mar 2025); back-solved so "today" ≈ $621k
const INDEX = 'ICL'               // Índice de Contratos de Locación — the usual one for AR rentals
const FREQ_MONTHS = 3             // quarterly adjustment
const TERM_MONTHS = 36            // Ley 27.551
const START = { y: 2025, m: 2 }   // March 2025 (month index 0-based: Jan=0)
const MONTHS_ELAPSED = 18         // as of 2026-09 → currently living month 19
const CURRENT_PERIOD = Math.floor(MONTHS_ELAPSED / FREQ_MONTHS) // 0-based period index of "now" → 6

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTHS_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// Calendar for a 0-based month offset from the contract start.
function cal(offset) {
  const total = START.m + offset
  const y = START.y + Math.floor(total / 12)
  const m = ((total % 12) + 12) % 12
  return { y, m }
}
const isoAt = (offset, day = 1) => {
  const { y, m } = cal(offset)
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
const shortLabel = (offset) => {
  const { y, m } = cal(offset)
  return `${MONTHS_SHORT[m]} '${String(y).slice(2)}`
}
const longLabel = (offset) => {
  const { y, m } = cal(offset)
  return `${MONTHS_LONG[m]} ${y}`
}

// The same projection the admin simulator computes for this contract.
const PROJECTION = projectAdjustments({ baseRent: BASE_RENT, index: INDEX, freqMonths: FREQ_MONTHS, termMonths: TERM_MONTHS })
const rentForMonth = (month1Based) => PROJECTION[Math.floor((month1Based - 1) / FREQ_MONTHS)].rent

const CURRENT_RENT = PROJECTION[CURRENT_PERIOD].rent
const NEXT_RENT = PROJECTION[CURRENT_PERIOD + 1]?.rent ?? CURRENT_RENT
const NEXT_ADJUST_OFFSET = (CURRENT_PERIOD + 1) * FREQ_MONTHS // month offset where next period starts

// ---------- Tenant identity ----------
export const MOCK_TENANT = {
  name: 'Martín Herrera',
  email: 'martin.herrera@email.com',
  phone: '+54 11 5678-1234',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  dni: '32.145.678'
}

// ---------- The active lease ----------
export const TENANT_CONTRACT = {
  propertyId: 'PROP-005',
  landlordName: 'Sofía Alcorta',
  agency: 'Terranova Propiedades',
  startDate: isoAt(0),
  endDate: isoAt(TERM_MONTHS),
  termMonths: TERM_MONTHS,
  monthsElapsed: MONTHS_ELAPSED,
  baseRent: BASE_RENT,
  currentRent: CURRENT_RENT,
  currency: 'ARS',
  deposit: BASE_RENT,
  index: INDEX,
  adjustEveryMonths: FREQ_MONTHS,
  nextAdjustDate: isoAt(NEXT_ADJUST_OFFSET),
  clauses: [
    { label: 'Plazo', value: '36 meses (Ley 27.551)' },
    { label: 'Ajuste', value: `${INDEX} · cada ${FREQ_MONTHS} meses` },
    { label: 'Depósito', value: '1 mes de alquiler' },
    { label: 'Expensas', value: 'A cargo del inquilino' },
    { label: 'Rescisión anticipada', value: 'Preaviso 60 días · 1,5 meses de multa' }
  ]
}

// Rent evolution across the whole lease — one bar per adjustment period, tagged as
// past / current / future so the chart can distinguish "already paid" from "projected".
export const RENT_PROJECTION = PROJECTION.map((r, p) => ({
  period: p + 1,
  label: shortLabel(p * FREQ_MONTHS),
  amount: r.rent,
  pct: r.pct,
  state: p < CURRENT_PERIOD ? 'past' : p === CURRENT_PERIOD ? 'current' : 'future'
}))

// Next-adjustment preview — derived, not hand-typed.
export const TENANT_ADJUSTMENT = {
  index: INDEX,
  indexNote: INDICES[INDEX].note,
  monthlyPct: +(INDICES[INDEX].monthly * 100).toFixed(2),
  periodPct: RENT_PROJECTION[CURRENT_PERIOD + 1]?.pct ?? 0,
  indexDate: isoAt(MONTHS_ELAPSED),
  currentRent: CURRENT_RENT,
  estimatedRent: NEXT_RENT,
  nextAdjustDate: isoAt(NEXT_ADJUST_OFFSET),
  currentPeriodLabel: `${longLabel(CURRENT_PERIOD * FREQ_MONTHS)} – ${longLabel((CURRENT_PERIOD + 1) * FREQ_MONTHS - 1)}`
}

// What the next adjustment would look like under each index (same engine, one period).
// Lets the tenant see why the index in their contract matters — mirrors the admin.
export const TENANT_INDEX_COMPARISON = Object.values(INDICES).map((ix) => {
  const factor = Math.pow(1 + ix.monthly, FREQ_MONTHS)
  return {
    id: ix.id,
    name: ix.name,
    note: ix.note,
    pct: +(((factor - 1) * 100).toFixed(1)),
    estimatedRent: Math.round(CURRENT_RENT * factor),
    isContract: ix.id === INDEX
  }
})

// ---------- 12 months of payments (newest first) ----------
const PAY_METHODS = ['Transferencia', 'MercadoPago', 'Efectivo', 'Débito automático']
export const TENANT_PAYMENTS = Array.from({ length: 12 }, (_, i) => {
  const month = MONTHS_ELAPSED + 1 - i        // 19, 18, … 8  (1-based lease month)
  const offset = month - 1
  const { y, m } = cal(offset)
  const isCurrent = i === 0                    // Sept 2026 still due
  const amount = rentForMonth(month)
  return {
    id: `PAY-${y}${String(m + 1).padStart(2, '0')}`,
    month,
    period: longLabel(offset),
    amount,
    status: isCurrent ? 'pending' : 'paid',
    dueDate: isoAt(offset, 10),
    paidDate: isCurrent ? null : isoAt(offset, (offset % 6) + 2),
    method: isCurrent ? null : PAY_METHODS[i % PAY_METHODS.length]
  }
})

// ---------- Documents (contract + guarantees; monthly receipts are derived below) ----------
export const TENANT_DOCUMENTS = [
  { id: 'TD1', name: 'Contrato de locación.pdf', type: 'Contrato', status: 'available', size: '480 KB' },
  { id: 'TD2', name: 'Garantía propietaria.pdf', type: 'Garantía', status: 'available', size: '1.1 MB' },
  { id: 'TD3', name: 'Seguro de caución.pdf', type: 'Seguro', status: 'available', size: '360 KB' },
  { id: 'TD4', name: 'Reglamento de copropiedad.pdf', type: 'Reglamento', status: 'pending', size: '—' }
]

// Downloadable rent receipts, one per settled payment (drives the "Recibos de pago" group).
export const TENANT_RECEIPTS = TENANT_PAYMENTS.filter((p) => p.status === 'paid').map((p) => ({
  id: `RC-${p.id}`,
  paymentId: p.id,
  name: `Recibo ${p.period}.pdf`,
  type: 'Recibo',
  period: p.period,
  amount: p.amount,
  paidDate: p.paidDate,
  method: p.method,
  status: 'available'
}))

// ---------- Repairs ----------
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

// Urgency levels — `dot` is a solid theme color (no alpha, which is a no-op over
// theme colors in this app).
export const REPAIR_URGENCIES = [
  { id: 'low', label: 'Baja', dot: 'bg-success' },
  { id: 'medium', label: 'Media', dot: 'bg-info' },
  { id: 'high', label: 'Alta', dot: 'bg-warning' },
  { id: 'urgent', label: 'Urgente', dot: 'bg-error' }
]

// Status pills use SOLID colors (alpha over theme colors renders transparent here).
export const REPAIR_STATUS = {
  requested: { label: 'Solicitada', cls: 'bg-info text-white' },
  'in-review': { label: 'En revisión', cls: 'bg-warning text-white' },
  approved: { label: 'Aprobada', cls: 'bg-info text-white' },
  'in-progress': { label: 'En proceso', cls: 'bg-warning text-white' },
  resolved: { label: 'Resuelta', cls: 'bg-success text-white' }
}

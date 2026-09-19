// Mortgage simulator data + finance helpers (Argentine market, mocked but realistic).
// Everything here is demo data — no live rates, no API. Numbers are plausible for a
// 2026 disinflation scenario and consistent across the simulator's tools.

// ---------------------------------------------------------------------------
// Finance helpers (French amortization system)
// ---------------------------------------------------------------------------

// Monthly instalment for a loan under the French system.
// annualRatePct is the TNA (nominal annual rate) in percent.
export function frenchMonthly(loan, annualRatePct, years) {
  const principal = Number(loan) || 0
  const r = Number(annualRatePct) / 100 / 12
  const n = Math.round(Number(years) * 12)
  if (n <= 0) return 0
  if (r === 0) return principal / n
  const factor = Math.pow(1 + r, n)
  return (principal * r * factor) / (factor - 1)
}

// Effective annual rate (TEA) from the nominal annual rate (TNA), monthly compounding.
export function teaFromTna(annualRatePct) {
  const r = Number(annualRatePct) / 100 / 12
  return (Math.pow(1 + r, 12) - 1) * 100
}

// Inverse of frenchMonthly: the largest loan whose instalment fits `cuota`.
export function maxLoanFromCuota(cuota, annualRatePct, years) {
  const c = Number(cuota) || 0
  const r = Number(annualRatePct) / 100 / 12
  const n = Math.round(Number(years) * 12)
  if (n <= 0 || c <= 0) return 0
  if (r === 0) return c * n
  const factor = Math.pow(1 + r, n)
  return (c * (factor - 1)) / (r * factor)
}

// Full or partial amortization schedule. Returns one row per month:
// { month, payment, interest, principal, balance }.
export function amortization(loan, annualRatePct, years, count) {
  const principal = Number(loan) || 0
  const r = Number(annualRatePct) / 100 / 12
  const n = Math.round(Number(years) * 12)
  const payment = frenchMonthly(principal, annualRatePct, years)
  const rows = []
  let balance = principal
  const limit = count ? Math.min(count, n) : n
  for (let m = 1; m <= limit; m++) {
    const interest = balance * r
    const principalPart = payment - interest
    balance = Math.max(0, balance - principalPart)
    rows.push({ month: m, payment, interest, principal: principalPart, balance })
  }
  return rows
}

// Group a full schedule into yearly summaries: { year, interest, principal, balance }.
export function amortizationByYear(loan, annualRatePct, years) {
  const rows = amortization(loan, annualRatePct, years)
  const out = []
  for (let y = 0; y < Math.ceil(rows.length / 12); y++) {
    const slice = rows.slice(y * 12, y * 12 + 12)
    if (!slice.length) break
    out.push({
      year: y + 1,
      interest: slice.reduce((a, b) => a + b.interest, 0),
      principal: slice.reduce((a, b) => a + b.principal, 0),
      balance: slice[slice.length - 1].balance
    })
  }
  return out
}

// ---------------------------------------------------------------------------
// UVA (Unidad de Valor Adquisitivo) — index that adjusts mortgage capital by
// inflation. Mocked current value + a 12-month climbing history (disinflation).
// ---------------------------------------------------------------------------

export const UVA_VALUE = 1486.32
export const UVA_DATE = '2026-09-01'

// Build a plausible climbing series ending near UVA_VALUE. Monthly variation
// tapers off (inflation cooling through 2026). Deterministic — no Math.random.
export const UVA_HISTORY = (() => {
  const monthlyPct = [3.4, 3.1, 2.9, 2.7, 2.5, 2.3, 2.2, 2.0, 1.9, 1.8, 1.7, 1.6]
  const labels = [
    'Oct 25', 'Nov 25', 'Dic 25', 'Ene 26', 'Feb 26', 'Mar 26',
    'Abr 26', 'May 26', 'Jun 26', 'Jul 26', 'Ago 26', 'Sep 26'
  ]
  // Back-solve the start value so the last point lands on UVA_VALUE.
  const totalFactor = monthlyPct.reduce((f, p) => f * (1 + p / 100), 1)
  let value = UVA_VALUE / totalFactor
  return labels.map((label, i) => {
    if (i > 0) value *= 1 + monthlyPct[i - 1] / 100
    return { label, value: Math.round(value * 100) / 100, pct: monthlyPct[i] }
  })
})()

// Trailing 12-month accumulated UVA inflation (%), for the "interanual" hint.
export const UVA_YOY = Math.round(
  (UVA_HISTORY.reduce((f, p) => f * (1 + p.pct / 100), 1) - 1) * 1000
) / 10

// ---------------------------------------------------------------------------
// Banks — UVA mortgage offers (mocked, ordered roughly by rate).
// tna = nominal annual rate in %. ltv = max financed share of property value.
// ---------------------------------------------------------------------------

export const BANKS = [
  {
    id: 'nacion',
    name: 'Banco Nación',
    short: 'BNA',
    color: '#00843d',
    type: 'UVA',
    tna: 4.5,
    ltv: 75,
    maxYears: 30,
    highlight: 'Tasa preferencial con cuenta sueldo o haber previsional.',
    requirements: ['Cuenta sueldo / previsional', 'Antigüedad laboral 1 año', 'Relación cuota-ingreso 25%']
  },
  {
    id: 'provincia',
    name: 'Banco Provincia',
    short: 'BAPRO',
    color: '#00953f',
    type: 'UVA',
    tna: 5.5,
    ltv: 75,
    maxYears: 30,
    highlight: 'Bonificación de tasa para clientes con paquete Cuenta DNI.',
    requirements: ['Residir en Prov. de Bs. As.', 'Recibos últimos 3 meses', 'Seguro de vida e incendio']
  },
  {
    id: 'ciudad',
    name: 'Banco Ciudad',
    short: 'BCiudad',
    color: '#e30613',
    type: 'UVA',
    tna: 6.9,
    ltv: 75,
    maxYears: 20,
    highlight: 'Líneas para primera vivienda en CABA.',
    requirements: ['Ingresos demostrables', 'Tasación a cargo del banco', 'Relación cuota-ingreso 25%']
  },
  {
    id: 'hipotecario',
    name: 'Banco Hipotecario',
    short: 'BHN',
    color: '#009fe3',
    type: 'UVA',
    tna: 8.5,
    ltv: 80,
    maxYears: 30,
    highlight: 'Mayor financiación (hasta 80%) para no clientes.',
    requirements: ['Ingresos demostrables', 'Escritura y libre deuda', 'Relación cuota-ingreso 30%']
  },
  {
    id: 'santander',
    name: 'Santander',
    short: 'Santander',
    color: '#ec0000',
    type: 'UVA',
    tna: 7.5,
    ltv: 70,
    maxYears: 30,
    highlight: 'Aprobación online para clientes Select.',
    requirements: ['Cliente con acreditación de haberes', 'Últimas 3 DDJJ (autónomos)', 'Seguro incendio']
  },
  {
    id: 'galicia',
    name: 'Banco Galicia',
    short: 'Galicia',
    color: '#f47920',
    type: 'UVA',
    tna: 8.0,
    ltv: 75,
    maxYears: 25,
    highlight: 'Precalificación desde la app en 48 hs.',
    requirements: ['Ingresos demostrables', 'Antigüedad laboral 1 año', 'Relación cuota-ingreso 25%']
  }
]

// Representative UVA real rate used by the UVA-vs-fixed comparison (market median).
export const UVA_REFERENCE_TNA = 6.0

// ---------------------------------------------------------------------------
// Documentation required — informational, grouped by owner of the requirement.
// ---------------------------------------------------------------------------

export const DOC_REQUIREMENTS = [
  {
    group: 'Datos personales',
    items: [
      'DNI (titular y cónyuge/cotitular)',
      'CUIL / CUIT',
      'Constancia de estado civil'
    ]
  },
  {
    group: 'Comprobantes de ingresos',
    items: [
      'Recibos de sueldo (últimos 3 a 6 meses)',
      'Certificación de ingresos por contador (autónomos / monotributistas)',
      'Últimas DDJJ de Ganancias y Bienes Personales'
    ]
  },
  {
    group: 'De la propiedad',
    items: [
      'Título de propiedad / escritura',
      'Informe de dominio e inhibición',
      'Libre deuda de expensas, ABL y servicios'
    ]
  },
  {
    group: 'Del crédito',
    items: [
      'Solicitud de crédito completa',
      'Tasación del inmueble (a cargo del banco)',
      'Seguro de vida + incendio sobre el inmueble'
    ]
  }
]

// Default affordability ratio: instalment should not exceed this share of income.
export const AFFORDABILITY_RATIOS = [
  { pct: 25, label: '25% (recomendado)' },
  { pct: 30, label: '30% (máximo habitual)' }
]

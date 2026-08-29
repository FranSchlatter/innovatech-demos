// Rental contracts + adjustment indices (ICL / UVA / IPC) for the live adjustment simulator.
// The differentiator for AR real estate: contracts adjust by an index every N months.
// Demo only. Monthly rates are representative averages used to compound each period.

export const INDICES = {
  ICL: { id: 'ICL', name: 'ICL (BCRA)', monthly: 0.055, note: 'Índice de Contratos de Locación — el más usado en alquileres.' },
  UVA: { id: 'UVA', name: 'UVA', monthly: 0.050, note: 'Unidad de Valor Adquisitivo, ajusta por CER.' },
  IPC: { id: 'IPC', name: 'IPC (INDEC)', monthly: 0.032, note: 'Inflación minorista, ajuste más suave.' }
}

export const FREQUENCIES = [
  { months: 3, label: 'Trimestral' },
  { months: 4, label: 'Cuatrimestral' },
  { months: 6, label: 'Semestral' },
  { months: 12, label: 'Anual' }
]

export const contracts = [
  { id: 'CT-1041', tenant: 'Mariana Ortiz', property: 'Depto 2 amb. amoblado · Palermo',
    baseRent: 620000, startMonth: 'Mar 2026', index: 'ICL', freqMonths: 3, termMonths: 36, lateFeeDaily: 0.001 },
  { id: 'CT-1058', tenant: 'Estudio Contable Vega', property: 'Oficina premium · Torre Corporativa',
    baseRent: 2200000, startMonth: 'Ene 2026', index: 'IPC', freqMonths: 6, termMonths: 36, lateFeeDaily: 0.0015 },
  { id: 'CT-1063', tenant: 'Familia Duarte', property: 'Casa quinta c/ parque · Pilar',
    baseRent: 1150000, startMonth: 'May 2026', index: 'UVA', freqMonths: 4, termMonths: 24, lateFeeDaily: 0.001 }
]

// Project rent across the contract term, applying the index every `freqMonths`.
export function projectAdjustments({ baseRent, index, freqMonths, termMonths }) {
  const monthly = INDICES[index]?.monthly ?? 0
  const periodFactor = Math.pow(1 + monthly, freqMonths) // compounded index over the period
  const periods = Math.ceil(termMonths / freqMonths)
  const rows = []
  let rent = baseRent
  for (let p = 0; p < periods; p++) {
    const fromMonth = p * freqMonths + 1
    const toMonth = Math.min((p + 1) * freqMonths, termMonths)
    const pct = p === 0 ? 0 : Math.round((periodFactor - 1) * 1000) / 10
    rows.push({
      period: p + 1,
      range: `Mes ${fromMonth}–${toMonth}`,
      rent: Math.round(rent),
      pct,
      cumulative: Math.round(((rent / baseRent) - 1) * 1000) / 10
    })
    rent = rent * periodFactor
  }
  return rows
}

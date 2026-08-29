// Dynamic pricing — separates inflation from demand (the real differentiator in AR).
// Ported from the v2 demo. Amounts in ARS.

export const dynamicPricing = {
  ipcMonthly: 3.2, // % monthly inflation used to deflate nominal rates
  note: 'La tarifa nominal sube por inflación; la recomendación se calcula sobre la tarifa real (deflactada) y la ocupación.',
  rows: [
    { date: 'Mañana', nominal: 128000, real: 128000, occ: 82, rec: 'subir', reason: 'demanda', delta: 8 },
    { date: 'En 2 días', nominal: 128000, real: 127900, occ: 79, rec: 'mantener', reason: '—', delta: 0 },
    { date: 'En 1 semana', nominal: 132000, real: 128100, occ: 61, rec: 'bajar', reason: 'ocupación baja', delta: -6 },
    { date: 'En 2 semanas', nominal: 138000, real: 128600, occ: 94, rec: 'subir', reason: 'demanda alta', delta: 14 },
    { date: 'En 1 mes', nominal: 148000, real: 129200, occ: 88, rec: 'subir', reason: 'demanda', delta: 10 }
  ]
}

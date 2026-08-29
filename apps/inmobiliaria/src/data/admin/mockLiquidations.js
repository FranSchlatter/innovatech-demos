// Owner liquidations — what each property owner gets paid this month after the agency's
// management fee and expenses. Ported/adapted from the v2 demo. ARS.

export const liquidations = [
  {
    id: 'LQ-2026-08-001', owner: 'Roberto Salas', period: 'Agosto 2026', mgmtFeePct: 0.08,
    properties: [
      { title: 'Depto 2 amb. amoblado · Palermo', tenant: 'Mariana Ortiz', rentCollected: 654000, status: 'cobrado' },
      { title: 'Monoambiente · Villa Crespo', tenant: 'Lucas Prieto', rentCollected: 415000, status: 'cobrado' }
    ],
    expenses: [
      { label: 'Reparación plomería (Palermo)', amount: 48000 },
      { label: 'Expensas extraordinarias', amount: 22000 }
    ]
  },
  {
    id: 'LQ-2026-08-002', owner: 'Inversiones del Litoral S.A.', period: 'Agosto 2026', mgmtFeePct: 0.06,
    properties: [
      { title: 'Oficina premium · Torre Corporativa', tenant: 'Estudio Contable Vega', rentCollected: 2310000, status: 'cobrado' },
      { title: 'Local comercial · Centro', tenant: 'Farmacia San Martín', rentCollected: 890000, status: 'pendiente' }
    ],
    expenses: [
      { label: 'Seguro integral', amount: 35000 }
    ]
  },
  {
    id: 'LQ-2026-08-003', owner: 'Familia Grimaldi', period: 'Agosto 2026', mgmtFeePct: 0.08,
    properties: [
      { title: 'Casa quinta c/ parque · Pilar', tenant: 'Familia Duarte', rentCollected: 1207000, status: 'cobrado' }
    ],
    expenses: [
      { label: 'Mantenimiento de parque', amount: 60000 },
      { label: 'Poda y limpieza pileta', amount: 28000 }
    ]
  }
]

export function computeLiquidation(lq) {
  const grossCollected = lq.properties.filter((p) => p.status === 'cobrado').reduce((a, p) => a + p.rentCollected, 0)
  const mgmtFee = Math.round(grossCollected * lq.mgmtFeePct)
  const expensesTotal = lq.expenses.reduce((a, e) => a + e.amount, 0)
  const net = grossCollected - mgmtFee - expensesTotal
  const pending = lq.properties.filter((p) => p.status === 'pendiente').reduce((a, p) => a + p.rentCollected, 0)
  return { grossCollected, mgmtFee, expensesTotal, net, pending }
}

// Channel mix + 6-month revenue by channel — feeds the OTA-vs-direct commission widget.
// Ported from the v2 demo (packages/demo-kit). All amounts in ARS.

export const channels = [
  { id: 'direct', name: 'Directo (web)', commission: 0, color: 'bg-green-500', hex: '#34D399' },
  { id: 'whatsapp', name: 'WhatsApp', commission: 0, color: 'bg-emerald-500', hex: '#25D366' },
  { id: 'instagram', name: 'Instagram', commission: 0, color: 'bg-pink-500', hex: '#E1306C' },
  { id: 'booking', name: 'Booking.com', commission: 0.15, color: 'bg-blue-500', hex: '#3B5CF6' },
  { id: 'expedia', name: 'Expedia', commission: 0.18, color: 'bg-amber-500', hex: '#FBBF24' }
]

export const channelMonthly = [
  { month: '2026-03', direct: 6120000, whatsapp: 3080000, instagram: 1240000, booking: 5820000, expedia: 2410000 },
  { month: '2026-04', direct: 6740000, whatsapp: 3320000, instagram: 1380000, booking: 5510000, expedia: 2280000 },
  { month: '2026-05', direct: 7180000, whatsapp: 3560000, instagram: 1420000, booking: 5240000, expedia: 2110000 },
  { month: '2026-06', direct: 7920000, whatsapp: 3810000, instagram: 1610000, booking: 4980000, expedia: 1980000 },
  { month: '2026-07', direct: 8640000, whatsapp: 4120000, instagram: 1740000, booking: 4720000, expedia: 1860000 },
  { month: '2026-08', direct: 9210000, whatsapp: 4380000, instagram: 1890000, booking: 4510000, expedia: 1720000 }
]

// Derived summary for the widget (H7): commission paid, direct revenue, cumulative savings.
export function getCommissionSummary() {
  const last = channelMonthly[channelMonthly.length - 1]
  const commByChannel = channels.map((c) => ({
    id: c.id, name: c.name, color: c.color, hex: c.hex, commission: c.commission,
    revenue: last[c.id] || 0,
    commissionPaid: Math.round((last[c.id] || 0) * c.commission)
  }))
  const otaCommission = commByChannel.reduce((a, c) => a + c.commissionPaid, 0)
  const directRevenue = commByChannel.filter((c) => c.commission === 0).reduce((a, c) => a + c.revenue, 0)
  // What own channels would have cost if they'd gone through Booking (15%), across 6 months.
  const cumulativeSavings = channelMonthly.reduce(
    (a, m) => a + Math.round((m.direct + m.whatsapp + m.instagram) * 0.15), 0
  )
  return { commByChannel, otaCommission, directRevenue, cumulativeSavings, month: last.month }
}

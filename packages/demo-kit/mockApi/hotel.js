/* Hotel mockApi — all reads async with simulated latency. Components use these,
   never the seed directly. */
import { withLatency } from './latency'
import * as S from './seeds/hotel.js'

export const hotelApi = {
  getBrand: withLatency(() => S.brand, 100, 200),
  getRoomTypes: withLatency(() => S.roomTypes),
  getChannels: withLatency(() => S.channels),
  getReviews: withLatency(() => S.reviews),
  getUpsells: withLatency(() => S.upsells),

  // H2 availability
  getAvailability: withLatency((/* {from,to,guests} */) => S.availabilityFor(), 400, 800),

  // H7 dashboard
  getKpis: withLatency(() => S.kpis),
  getChannelMonthly: withLatency(() => S.channelMonthly),
  getOccupancy12: withLatency(() => S.occupancy12),
  getArrivals: withLatency(() => S.arrivals),
  getDepartures: withLatency(() => S.departures),
  // Commission widget derived data (H7)
  getCommissionSummary: withLatency(() => {
    const last = S.channelMonthly[S.channelMonthly.length - 1]
    const commByChannel = S.channels.map((c) => ({
      id: c.id, name: c.name, color: c.color, commission: c.commission,
      revenue: last[c.id] || 0,
      commissionPaid: Math.round((last[c.id] || 0) * c.commission)
    }))
    const otaCommission = commByChannel.reduce((a, c) => a + c.commissionPaid, 0)
    const directRevenue = commByChannel.filter((c) => c.commission === 0).reduce((a, c) => a + c.revenue, 0)
    // cumulative savings across 6 months on own channels vs if they'd been Booking (15%)
    const savings = S.channelMonthly.reduce((a, m) => a + Math.round((m.direct + m.whatsapp + m.instagram) * 0.15), 0)
    return { commByChannel, otaCommission, directRevenue, cumulativeSavings: savings, month: last.month }
  }),

  // H9 inbox
  getConversations: withLatency(() => S.conversations, 300, 600),

  // H10 / H11
  getAutomations: withLatency(() => S.automations),
  getDynamicPricing: withLatency(() => S.dynamicPricing)
}

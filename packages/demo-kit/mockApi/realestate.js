/* Real-estate mockApi — async reads with latency. */
import { withLatency } from './latency'
import * as S from './seeds/realestate.js'

const PROPERTIES = S.generateProperties(60)
const CONTRACTS = S.generateContracts(40)

export const realestateApi = {
  getBrand: withLatency(() => S.brand, 100, 200),
  getProperties: withLatency((filter = {}) => {
    let list = PROPERTIES
    if (filter.operation) list = list.filter((p) => p.operation === filter.operation)
    if (filter.type) list = list.filter((p) => p.type === filter.type)
    if (filter.neighborhood) list = list.filter((p) => p.neighborhood === filter.neighborhood)
    if (filter.creditReady) list = list.filter((p) => p.creditReady)
    if (filter.petFriendly) list = list.filter((p) => p.petFriendly)
    if (filter.garage) list = list.filter((p) => p.garage)
    if (filter.q) {
      const q = filter.q.toLowerCase()
      list = list.filter((p) => (p.title + p.neighborhood + p.address).toLowerCase().includes(q))
    }
    return list
  }, 400, 800),
  getProperty: withLatency((id) => PROPERTIES.find((p) => p.id === id) || null),
  getFeatured: withLatency(() => PROPERTIES.filter((p) => p.featured)),
  getNeighborhoods: withLatency(() => [...new Set(PROPERTIES.map((p) => p.neighborhood))]),
  getAgents: withLatency(() => S.agents),

  // I5 dashboard
  getDashboard: withLatency(() => S.dashboard),

  // I7 inbox
  getConversations: withLatency(() => S.conversations, 300, 600),

  // I8 diffusion
  getPortals: withLatency(() => S.portals),

  // I9 / I10 contracts
  getContracts: withLatency((filter = {}) => {
    let list = CONTRACTS
    if (filter.status) list = list.filter((c) => c.collectionStatus === filter.status)
    if (filter.index) list = list.filter((c) => c.index === filter.index)
    return list
  }, 400, 700),
  getContract: withLatency((id) => CONTRACTS.find((c) => c.id === id) || CONTRACTS[0]),
  getAdjustmentIndices: withLatency(() => S.adjustmentIndexValues),

  // I11 liquidation
  getOwners: withLatency(() => S.owners),
  getLiquidation: withLatency((ownerId, period) => S.liquidationFor(ownerId, period), 400, 700),

  // I13 tenant portal
  getTenantAccount: withLatency(() => S.tenantAccount),

  // I4 valuation
  getComparables: withLatency(() => S.comparablesFor(), 600, 1000)
}

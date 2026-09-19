// Mock inventory data for hotel admin system
const today = new Date()
const formatDate = (date) => date.toISOString()
const subDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export const mockInventory = [
  // Linens
  {
    id: 'INV-001',
    name: 'Bath Towels - Large',
    category: 'linens',
    sku: 'LIN-TWL-001',
    currentStock: 45,
    minStock: 30,
    maxStock: 100,
    unit: 'pieces',
    location: 'Storage Room A',
    lastRestocked: formatDate(subDays(today, 5)),
    costPerUnit: 12.50,
    restockHistory: [
      { date: formatDate(subDays(today, 5)), quantity: 50, by: 'John Manager' },
      { date: formatDate(subDays(today, 20)), quantity: 40, by: 'John Manager' }
    ]
  },
  {
    id: 'INV-002',
    name: 'Bath Towels - Medium',
    category: 'linens',
    sku: 'LIN-TWL-002',
    currentStock: 60,
    minStock: 40,
    maxStock: 120,
    unit: 'pieces',
    location: 'Storage Room A',
    lastRestocked: formatDate(subDays(today, 5)),
    costPerUnit: 8.00,
    restockHistory: [
      { date: formatDate(subDays(today, 5)), quantity: 60, by: 'John Manager' }
    ]
  },
  {
    id: 'INV-003',
    name: 'Hand Towels',
    category: 'linens',
    sku: 'LIN-TWL-003',
    currentStock: 25,
    minStock: 50,
    maxStock: 150,
    unit: 'pieces',
    location: 'Storage Room A',
    lastRestocked: formatDate(subDays(today, 15)),
    costPerUnit: 5.00,
    restockHistory: [
      { date: formatDate(subDays(today, 15)), quantity: 50, by: 'John Manager' }
    ]
  },
  {
    id: 'INV-004',
    name: 'Bed Sheets - King',
    category: 'linens',
    sku: 'LIN-SHT-001',
    currentStock: 35,
    minStock: 25,
    maxStock: 80,
    unit: 'sets',
    location: 'Storage Room B',
    lastRestocked: formatDate(subDays(today, 7)),
    costPerUnit: 45.00,
    restockHistory: [
      { date: formatDate(subDays(today, 7)), quantity: 30, by: 'John Manager' }
    ]
  },
  {
    id: 'INV-005',
    name: 'Bed Sheets - Queen',
    category: 'linens',
    sku: 'LIN-SHT-002',
    currentStock: 40,
    minStock: 30,
    maxStock: 100,
    unit: 'sets',
    location: 'Storage Room B',
    lastRestocked: formatDate(subDays(today, 7)),
    costPerUnit: 38.00,
    restockHistory: [
      { date: formatDate(subDays(today, 7)), quantity: 35, by: 'John Manager' }
    ]
  },
  {
    id: 'INV-006',
    name: 'Pillowcases',
    category: 'linens',
    sku: 'LIN-PIL-001',
    currentStock: 80,
    minStock: 60,
    maxStock: 200,
    unit: 'pieces',
    location: 'Storage Room B',
    lastRestocked: formatDate(subDays(today, 10)),
    costPerUnit: 8.50,
    restockHistory: [
      { date: formatDate(subDays(today, 10)), quantity: 80, by: 'John Manager' }
    ]
  },
  // Amenities
  {
    id: 'INV-007',
    name: 'Shampoo Bottles',
    category: 'amenities',
    sku: 'AME-SHA-001',
    currentStock: 150,
    minStock: 100,
    maxStock: 400,
    unit: 'bottles',
    location: 'Amenities Storage',
    lastRestocked: formatDate(subDays(today, 3)),
    costPerUnit: 2.50,
    restockHistory: [
      { date: formatDate(subDays(today, 3)), quantity: 200, by: 'Sarah Supplies' }
    ]
  },
  {
    id: 'INV-008',
    name: 'Conditioner Bottles',
    category: 'amenities',
    sku: 'AME-CON-001',
    currentStock: 140,
    minStock: 100,
    maxStock: 400,
    unit: 'bottles',
    location: 'Amenities Storage',
    lastRestocked: formatDate(subDays(today, 3)),
    costPerUnit: 2.50,
    restockHistory: [
      { date: formatDate(subDays(today, 3)), quantity: 200, by: 'Sarah Supplies' }
    ]
  },
  {
    id: 'INV-009',
    name: 'Body Lotion',
    category: 'amenities',
    sku: 'AME-LOT-001',
    currentStock: 85,
    minStock: 80,
    maxStock: 300,
    unit: 'bottles',
    location: 'Amenities Storage',
    lastRestocked: formatDate(subDays(today, 8)),
    costPerUnit: 3.00,
    restockHistory: [
      { date: formatDate(subDays(today, 8)), quantity: 150, by: 'Sarah Supplies' }
    ]
  },
  {
    id: 'INV-010',
    name: 'Soap Bars',
    category: 'amenities',
    sku: 'AME-SOP-001',
    currentStock: 200,
    minStock: 150,
    maxStock: 500,
    unit: 'pieces',
    location: 'Amenities Storage',
    lastRestocked: formatDate(subDays(today, 5)),
    costPerUnit: 1.50,
    restockHistory: [
      { date: formatDate(subDays(today, 5)), quantity: 250, by: 'Sarah Supplies' }
    ]
  },
  {
    id: 'INV-011',
    name: 'Dental Kits',
    category: 'amenities',
    sku: 'AME-DNT-001',
    currentStock: 50,
    minStock: 80,
    maxStock: 200,
    unit: 'kits',
    location: 'Amenities Storage',
    lastRestocked: formatDate(subDays(today, 12)),
    costPerUnit: 2.00,
    restockHistory: [
      { date: formatDate(subDays(today, 12)), quantity: 100, by: 'Sarah Supplies' }
    ]
  },
  {
    id: 'INV-012',
    name: 'Shower Caps',
    category: 'amenities',
    sku: 'AME-SHC-001',
    currentStock: 180,
    minStock: 100,
    maxStock: 400,
    unit: 'pieces',
    location: 'Amenities Storage',
    lastRestocked: formatDate(subDays(today, 10)),
    costPerUnit: 0.50,
    restockHistory: [
      { date: formatDate(subDays(today, 10)), quantity: 200, by: 'Sarah Supplies' }
    ]
  },
  // Minibar
  {
    id: 'INV-013',
    name: 'Mineral Water 500ml',
    category: 'minibar',
    sku: 'MNB-WAT-001',
    currentStock: 120,
    minStock: 80,
    maxStock: 300,
    unit: 'bottles',
    location: 'Minibar Storage',
    lastRestocked: formatDate(subDays(today, 2)),
    costPerUnit: 1.00,
    restockHistory: [
      { date: formatDate(subDays(today, 2)), quantity: 150, by: 'Mike Beverages' }
    ]
  },
  {
    id: 'INV-014',
    name: 'Soft Drinks Assorted',
    category: 'minibar',
    sku: 'MNB-SOF-001',
    currentStock: 90,
    minStock: 60,
    maxStock: 200,
    unit: 'cans',
    location: 'Minibar Storage',
    lastRestocked: formatDate(subDays(today, 4)),
    costPerUnit: 1.50,
    restockHistory: [
      { date: formatDate(subDays(today, 4)), quantity: 100, by: 'Mike Beverages' }
    ]
  },
  {
    id: 'INV-015',
    name: 'Premium Snack Mix',
    category: 'minibar',
    sku: 'MNB-SNK-001',
    currentStock: 30,
    minStock: 40,
    maxStock: 100,
    unit: 'bags',
    location: 'Minibar Storage',
    lastRestocked: formatDate(subDays(today, 8)),
    costPerUnit: 4.00,
    restockHistory: [
      { date: formatDate(subDays(today, 8)), quantity: 50, by: 'Mike Beverages' }
    ]
  },
  {
    id: 'INV-016',
    name: 'Chocolate Bars',
    category: 'minibar',
    sku: 'MNB-CHO-001',
    currentStock: 55,
    minStock: 50,
    maxStock: 150,
    unit: 'pieces',
    location: 'Minibar Storage',
    lastRestocked: formatDate(subDays(today, 6)),
    costPerUnit: 3.00,
    restockHistory: [
      { date: formatDate(subDays(today, 6)), quantity: 80, by: 'Mike Beverages' }
    ]
  },
  // Cleaning supplies
  {
    id: 'INV-017',
    name: 'All-Purpose Cleaner',
    category: 'cleaning',
    sku: 'CLN-APC-001',
    currentStock: 25,
    minStock: 20,
    maxStock: 60,
    unit: 'gallons',
    location: 'Cleaning Storage',
    lastRestocked: formatDate(subDays(today, 10)),
    costPerUnit: 15.00,
    restockHistory: [
      { date: formatDate(subDays(today, 10)), quantity: 30, by: 'Clean Co.' }
    ]
  },
  {
    id: 'INV-018',
    name: 'Glass Cleaner',
    category: 'cleaning',
    sku: 'CLN-GLS-001',
    currentStock: 18,
    minStock: 15,
    maxStock: 50,
    unit: 'bottles',
    location: 'Cleaning Storage',
    lastRestocked: formatDate(subDays(today, 14)),
    costPerUnit: 8.00,
    restockHistory: [
      { date: formatDate(subDays(today, 14)), quantity: 25, by: 'Clean Co.' }
    ]
  },
  {
    id: 'INV-019',
    name: 'Toilet Bowl Cleaner',
    category: 'cleaning',
    sku: 'CLN-TBC-001',
    currentStock: 12,
    minStock: 15,
    maxStock: 40,
    unit: 'bottles',
    location: 'Cleaning Storage',
    lastRestocked: formatDate(subDays(today, 18)),
    costPerUnit: 6.00,
    restockHistory: [
      { date: formatDate(subDays(today, 18)), quantity: 20, by: 'Clean Co.' }
    ]
  },
  {
    id: 'INV-020',
    name: 'Trash Bags - Large',
    category: 'cleaning',
    sku: 'CLN-TRB-001',
    currentStock: 150,
    minStock: 100,
    maxStock: 400,
    unit: 'pieces',
    location: 'Cleaning Storage',
    lastRestocked: formatDate(subDays(today, 5)),
    costPerUnit: 0.30,
    restockHistory: [
      { date: formatDate(subDays(today, 5)), quantity: 200, by: 'Clean Co.' }
    ]
  },
  // Legacy / discontinued items — kept in the catalog but never consumed anymore.
  // They surface in the "possibly obsolete" trends section (no restock history).
  {
    id: 'INV-021',
    name: 'Cigarette Packs (Minibar)',
    category: 'minibar',
    sku: 'MNB-CIG-001',
    currentStock: 24,
    minStock: 10,
    maxStock: 60,
    unit: 'packs',
    location: 'Minibar Storage',
    lastRestocked: formatDate(subDays(today, 210)),
    costPerUnit: 9.00,
    restockHistory: []
  },
  {
    id: 'INV-022',
    name: 'Guest Sewing Kits',
    category: 'amenities',
    sku: 'AME-SEW-001',
    currentStock: 90,
    minStock: 40,
    maxStock: 200,
    unit: 'kits',
    location: 'Amenities Storage',
    lastRestocked: formatDate(subDays(today, 240)),
    costPerUnit: 1.20,
    restockHistory: []
  }
]

// Helper functions
export const getLowStockItems = () => {
  return mockInventory.filter(item => item.currentStock <= item.minStock)
}

export const getItemsByCategory = (category) => {
  return mockInventory.filter(item => item.category === category)
}

export const getTotalInventoryValue = () => {
  return mockInventory.reduce((total, item) => {
    return total + (item.currentStock * item.costPerUnit)
  }, 0)
}

export const getCategories = () => {
  return [...new Set(mockInventory.map(item => item.category))]
}

// ---------------------------------------------------------------------------
// Consumption analytics (H21)
//
// The trends below are derived from a DETERMINISTIC, seeded model keyed only by
// each item's static identity (id + category + min/max/cost). This is on purpose:
// `useAdminData` persists `inventory` to localStorage, so metrics must NOT depend
// on mutable/persisted stock — otherwise a stale save would show empty trends.
// Same seeded-PRNG pattern as mockHousekeeping (H10) and mockExcursions (H17).
// ---------------------------------------------------------------------------

// mulberry32 — tiny deterministic PRNG (identical algo used across the admin mocks)
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Stable string → uint32 hash so the same item id always yields the same numbers.
function hashSeed(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Relative demand per category: how fast stock turns over. Minibar moves fastest,
// linens slowest. Drives consumption, restock frequency and low-stock frequency.
export const CATEGORY_DEMAND = {
  linens: 0.5,
  amenities: 1.1,
  minibar: 1.5,
  cleaning: 0.7
}

// Items with no ongoing consumption — legacy/discontinued. Surface as "obsolete".
const OBSOLETE_IDS = new Set(['INV-021', 'INV-022'])

// A couple of chronically under-stocked fast movers, guaranteed to trip the
// "raise the minimum" suggestion regardless of the PRNG draw (demo reliability).
const CHRONIC_IDS = new Set(['INV-013', 'INV-007'])

const ANALYTICS_WINDOW_DAYS = 90

// Per-item consumption model. Pure + deterministic for a given item identity.
export function getItemConsumption(item) {
  if (OBSOLETE_IDS.has(item.id)) {
    return {
      monthlyConsumption: 0,
      monthlyCost: 0,
      restockVolume90: 0,
      restocks90: 0,
      lowStockHits30: 0,
      neverRestocked: true,
      recommendedMin: item.minStock
    }
  }

  const rng = mulberry32(hashSeed(item.id))
  const demand = CATEGORY_DEMAND[item.category] ?? 1
  const chronicBoost = CHRONIC_IDS.has(item.id) ? 1.6 : 1
  // Monthly turnover as a fraction of max capacity (~0.55–1.45 × demand).
  const turnover = demand * chronicBoost * (0.55 + rng() * 0.9)

  const monthlyConsumption = Math.max(1, Math.round(item.maxStock * turnover))
  const monthlyCost = Math.round(monthlyConsumption * item.costPerUnit)
  const restockVolume90 = monthlyConsumption * 3

  // Refill amount per restock ≈ (max − min); refills needed per month follow from it.
  const fillQty = Math.max(1, item.maxStock - item.minStock)
  const refillsPerMonth = monthlyConsumption / fillQty
  const restocks90 = Math.min(14, Math.max(1, Math.round(refillsPerMonth * 3)))
  // Each refill implies the item dipped to its minimum, so refills/month ≈ low-stock hits.
  const lowStockHits30 = Math.max(0, Math.round(refillsPerMonth))

  // Suggested minimum ≈ half a month of demand (a sensible reorder buffer), capped
  // below max. Only meaningful when it's actually higher than the current minimum.
  const recommendedMin = Math.min(
    item.maxStock - 1,
    Math.max(item.minStock + 1, Math.round(monthlyConsumption * 0.5))
  )

  return {
    monthlyConsumption,
    monthlyCost,
    restockVolume90,
    restocks90,
    lowStockHits30,
    neverRestocked: false,
    recommendedMin
  }
}

// Aggregate analytics over the whole inventory. Pure function of the passed array,
// so it works with both the seed data and anything persisted in localStorage.
export function getInventoryAnalytics(inventory) {
  const perItem = {}
  inventory.forEach(it => {
    perItem[it.id] = getItemConsumption(it)
  })

  // Consumption + cost per category (last 30 days).
  const catMap = {}
  inventory.forEach(it => {
    const a = perItem[it.id]
    if (!catMap[it.category]) {
      catMap[it.category] = {
        category: it.category,
        monthlyConsumption: 0,
        monthlyCost: 0,
        itemCount: 0
      }
    }
    catMap[it.category].monthlyConsumption += a.monthlyConsumption
    catMap[it.category].monthlyCost += a.monthlyCost
    catMap[it.category].itemCount += 1
  })
  const byCategory = Object.values(catMap).sort((a, b) => b.monthlyCost - a.monthlyCost)
  const totalMonthlyCost = byCategory.reduce((s, c) => s + c.monthlyCost, 0)
  const totalMonthlyConsumption = byCategory.reduce((s, c) => s + c.monthlyConsumption, 0)

  // Top consumed by 90-day restock volume.
  const topConsumed = inventory
    .filter(it => !perItem[it.id].neverRestocked)
    .map(it => ({ ...it, ...perItem[it.id] }))
    .sort((a, b) => b.restockVolume90 - a.restockVolume90)
    .slice(0, 5)

  // Never restocked → possible obsolete stock (dead capital tied up).
  const obsolete = inventory
    .filter(it => perItem[it.id].neverRestocked)
    .map(it => ({ ...it, tiedUpValue: it.currentStock * it.costPerUnit }))

  // Reorder suggestions: hit the minimum 3+ times in the last month AND the current
  // minimum sits below the recommended buffer (so applying it clears the suggestion).
  const suggestions = inventory
    .map(it => ({ item: it, a: perItem[it.id] }))
    .filter(({ item, a }) => a.lowStockHits30 >= 3 && item.minStock < a.recommendedMin)
    .map(({ item, a }) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentMin: item.minStock,
      suggestedMin: a.recommendedMin,
      hits: a.lowStockHits30
    }))
    .sort((x, y) => y.hits - x.hits)

  return {
    perItem,
    byCategory,
    totalMonthlyCost,
    totalMonthlyConsumption,
    topConsumed,
    obsolete,
    suggestions,
    windowDays: ANALYTICS_WINDOW_DAYS
  }
}

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

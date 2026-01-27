// Generate dates relative to today
const today = new Date()
const formatDate = (date) => date.toISOString().split('T')[0]
const addDays = (days) => {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

export const mockKitchenInventory = [
  // Proteins
  {
    id: 'INV-001',
    name: 'Beef Tenderloin',
    category: 'proteins',
    sku: 'BEEF-TEND-001',
    currentStock: 15,
    minStock: 10,
    maxStock: 30,
    unit: 'kg',
    costPerUnit: 45.00,
    supplier: 'Premium Meats Co.',
    location: 'Walk-in Cooler A',
    expirationDate: addDays(5),
    lastRestocked: addDays(-2),
    restockHistory: []
  },
  {
    id: 'INV-002',
    name: 'Salmon Fillet',
    category: 'proteins',
    sku: 'SALM-FILL-001',
    currentStock: 8,
    minStock: 10,
    maxStock: 25,
    unit: 'kg',
    costPerUnit: 32.00,
    supplier: 'Ocean Fresh Seafood',
    location: 'Walk-in Cooler A',
    expirationDate: addDays(3),
    lastRestocked: addDays(-1),
    restockHistory: []
  },
  {
    id: 'INV-003',
    name: 'Duck Breast',
    category: 'proteins',
    sku: 'DUCK-BRST-001',
    currentStock: 12,
    minStock: 8,
    maxStock: 20,
    unit: 'kg',
    costPerUnit: 38.00,
    supplier: 'Premium Meats Co.',
    location: 'Walk-in Cooler A',
    expirationDate: addDays(4),
    lastRestocked: addDays(-3),
    restockHistory: []
  },
  {
    id: 'INV-004',
    name: 'Lobster Tail',
    category: 'proteins',
    sku: 'LOBS-TAIL-001',
    currentStock: 5,
    minStock: 8,
    maxStock: 15,
    unit: 'pieces',
    costPerUnit: 28.00,
    supplier: 'Ocean Fresh Seafood',
    location: 'Walk-in Cooler A',
    expirationDate: addDays(2),
    lastRestocked: addDays(-1),
    restockHistory: []
  },
  {
    id: 'INV-005',
    name: 'Rack of Lamb',
    category: 'proteins',
    sku: 'LAMB-RACK-001',
    currentStock: 10,
    minStock: 6,
    maxStock: 15,
    unit: 'pieces',
    costPerUnit: 42.00,
    supplier: 'Premium Meats Co.',
    location: 'Walk-in Cooler A',
    expirationDate: addDays(6),
    lastRestocked: addDays(-4),
    restockHistory: []
  },
  // Produce
  {
    id: 'INV-006',
    name: 'Truffle (Black)',
    category: 'produce',
    sku: 'TRUF-BLK-001',
    currentStock: 0.3,
    minStock: 0.5,
    maxStock: 1,
    unit: 'kg',
    costPerUnit: 850.00,
    supplier: 'Gourmet Imports',
    location: 'Specialty Cooler',
    expirationDate: addDays(7),
    lastRestocked: addDays(-5),
    restockHistory: []
  },
  {
    id: 'INV-007',
    name: 'Roma Tomatoes',
    category: 'produce',
    sku: 'TOMA-ROMA-001',
    currentStock: 20,
    minStock: 15,
    maxStock: 40,
    unit: 'kg',
    costPerUnit: 4.50,
    supplier: 'Local Farms Direct',
    location: 'Produce Storage',
    expirationDate: addDays(4),
    lastRestocked: addDays(-1),
    restockHistory: []
  },
  {
    id: 'INV-008',
    name: 'Fresh Basil',
    category: 'produce',
    sku: 'BASI-FRSH-001',
    currentStock: 2,
    minStock: 3,
    maxStock: 8,
    unit: 'kg',
    costPerUnit: 18.00,
    supplier: 'Local Farms Direct',
    location: 'Herb Cooler',
    expirationDate: addDays(2),
    lastRestocked: addDays(-2),
    restockHistory: []
  },
  {
    id: 'INV-009',
    name: 'Arugula',
    category: 'produce',
    sku: 'ARUG-FRSH-001',
    currentStock: 5,
    minStock: 4,
    maxStock: 10,
    unit: 'kg',
    costPerUnit: 12.00,
    supplier: 'Local Farms Direct',
    location: 'Produce Storage',
    expirationDate: addDays(3),
    lastRestocked: addDays(-1),
    restockHistory: []
  },
  {
    id: 'INV-010',
    name: 'Asparagus',
    category: 'produce',
    sku: 'ASPA-FRSH-001',
    currentStock: 8,
    minStock: 5,
    maxStock: 15,
    unit: 'kg',
    costPerUnit: 14.00,
    supplier: 'Local Farms Direct',
    location: 'Produce Storage',
    expirationDate: addDays(4),
    lastRestocked: addDays(-2),
    restockHistory: []
  },
  // Dairy
  {
    id: 'INV-011',
    name: 'Parmigiano Reggiano',
    category: 'dairy',
    sku: 'PARM-REGG-001',
    currentStock: 6,
    minStock: 4,
    maxStock: 12,
    unit: 'kg',
    costPerUnit: 42.00,
    supplier: 'Italian Imports Co.',
    location: 'Cheese Cooler',
    expirationDate: addDays(60),
    lastRestocked: addDays(-10),
    restockHistory: []
  },
  {
    id: 'INV-012',
    name: 'Heavy Cream',
    category: 'dairy',
    sku: 'CREM-HEVY-001',
    currentStock: 15,
    minStock: 10,
    maxStock: 30,
    unit: 'liters',
    costPerUnit: 6.50,
    supplier: 'Dairy Direct',
    location: 'Walk-in Cooler B',
    expirationDate: addDays(7),
    lastRestocked: addDays(-2),
    restockHistory: []
  },
  {
    id: 'INV-013',
    name: 'Burrata',
    category: 'dairy',
    sku: 'BURR-FRSH-001',
    currentStock: 4,
    minStock: 6,
    maxStock: 12,
    unit: 'pieces',
    costPerUnit: 8.00,
    supplier: 'Italian Imports Co.',
    location: 'Cheese Cooler',
    expirationDate: addDays(3),
    lastRestocked: addDays(-2),
    restockHistory: []
  },
  {
    id: 'INV-014',
    name: 'Mascarpone',
    category: 'dairy',
    sku: 'MASC-CREM-001',
    currentStock: 8,
    minStock: 5,
    maxStock: 15,
    unit: 'kg',
    costPerUnit: 15.00,
    supplier: 'Italian Imports Co.',
    location: 'Cheese Cooler',
    expirationDate: addDays(14),
    lastRestocked: addDays(-5),
    restockHistory: []
  },
  // Pantry
  {
    id: 'INV-015',
    name: 'Arborio Rice',
    category: 'pantry',
    sku: 'RICE-ARBO-001',
    currentStock: 25,
    minStock: 15,
    maxStock: 50,
    unit: 'kg',
    costPerUnit: 5.50,
    supplier: 'Italian Imports Co.',
    location: 'Dry Storage',
    expirationDate: addDays(365),
    lastRestocked: addDays(-20),
    restockHistory: []
  },
  {
    id: 'INV-016',
    name: 'Extra Virgin Olive Oil',
    category: 'pantry',
    sku: 'OLIV-EVOO-001',
    currentStock: 30,
    minStock: 20,
    maxStock: 50,
    unit: 'liters',
    costPerUnit: 18.00,
    supplier: 'Mediterranean Imports',
    location: 'Dry Storage',
    expirationDate: addDays(180),
    lastRestocked: addDays(-15),
    restockHistory: []
  },
  {
    id: 'INV-017',
    name: 'San Marzano Tomatoes',
    category: 'pantry',
    sku: 'TOMA-SANM-001',
    currentStock: 48,
    minStock: 30,
    maxStock: 100,
    unit: 'cans',
    costPerUnit: 4.00,
    supplier: 'Italian Imports Co.',
    location: 'Dry Storage',
    expirationDate: addDays(540),
    lastRestocked: addDays(-30),
    restockHistory: []
  },
  {
    id: 'INV-018',
    name: 'Balsamic Vinegar (Aged)',
    category: 'pantry',
    sku: 'VNGR-BALS-001',
    currentStock: 5,
    minStock: 3,
    maxStock: 10,
    unit: 'liters',
    costPerUnit: 65.00,
    supplier: 'Gourmet Imports',
    location: 'Specialty Storage',
    expirationDate: addDays(730),
    lastRestocked: addDays(-60),
    restockHistory: []
  },
  // Beverages
  {
    id: 'INV-019',
    name: 'House Red Wine',
    category: 'beverages',
    sku: 'WINE-RED-001',
    currentStock: 24,
    minStock: 20,
    maxStock: 50,
    unit: 'bottles',
    costPerUnit: 22.00,
    supplier: 'Wine Merchants',
    location: 'Wine Cellar',
    expirationDate: null,
    lastRestocked: addDays(-7),
    restockHistory: []
  },
  {
    id: 'INV-020',
    name: 'House White Wine',
    category: 'beverages',
    sku: 'WINE-WHT-001',
    currentStock: 18,
    minStock: 20,
    maxStock: 50,
    unit: 'bottles',
    costPerUnit: 20.00,
    supplier: 'Wine Merchants',
    location: 'Wine Cellar',
    expirationDate: null,
    lastRestocked: addDays(-7),
    restockHistory: []
  },
  {
    id: 'INV-021',
    name: 'Sparkling Water',
    category: 'beverages',
    sku: 'WATR-SPRK-001',
    currentStock: 60,
    minStock: 50,
    maxStock: 150,
    unit: 'bottles',
    costPerUnit: 2.50,
    supplier: 'Beverage Distributors',
    location: 'Bar Storage',
    expirationDate: addDays(365),
    lastRestocked: addDays(-5),
    restockHistory: []
  },
  {
    id: 'INV-022',
    name: 'Espresso Beans',
    category: 'beverages',
    sku: 'COFF-ESPR-001',
    currentStock: 8,
    minStock: 5,
    maxStock: 20,
    unit: 'kg',
    costPerUnit: 35.00,
    supplier: 'Artisan Coffee Roasters',
    location: 'Bar Storage',
    expirationDate: addDays(60),
    lastRestocked: addDays(-10),
    restockHistory: []
  },
  // Desserts & Bakery
  {
    id: 'INV-023',
    name: 'Dark Chocolate (70%)',
    category: 'desserts',
    sku: 'CHOC-DRK-001',
    currentStock: 10,
    minStock: 5,
    maxStock: 20,
    unit: 'kg',
    costPerUnit: 28.00,
    supplier: 'Gourmet Imports',
    location: 'Pastry Station',
    expirationDate: addDays(180),
    lastRestocked: addDays(-14),
    restockHistory: []
  },
  {
    id: 'INV-024',
    name: 'Vanilla Beans',
    category: 'desserts',
    sku: 'VANI-BEAN-001',
    currentStock: 20,
    minStock: 25,
    maxStock: 50,
    unit: 'pieces',
    costPerUnit: 6.00,
    supplier: 'Gourmet Imports',
    location: 'Pastry Station',
    expirationDate: addDays(365),
    lastRestocked: addDays(-30),
    restockHistory: []
  }
]

// Helper functions
export const getLowStockItems = () => {
  return mockKitchenInventory.filter(item => item.currentStock <= item.minStock)
}

export const getExpiringItems = (days = 7) => {
  const threshold = addDays(days)
  return mockKitchenInventory.filter(item => {
    if (!item.expirationDate) return false
    return item.expirationDate <= threshold
  })
}

export const getItemsByCategory = (category) => {
  return mockKitchenInventory.filter(item => item.category === category)
}

export const getTotalInventoryValue = () => {
  return mockKitchenInventory.reduce(
    (sum, item) => sum + (item.currentStock * item.costPerUnit),
    0
  )
}

export const getInventoryCategories = () => {
  return [...new Set(mockKitchenInventory.map(item => item.category))]
}

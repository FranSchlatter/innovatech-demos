// Mock medical inventory data for health admin system
const today = new Date()
const formatDate = (date) => date.toISOString()

const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const subDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

const addMonths = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const mockMedicalInventory = [
  // Medications
  {
    id: 'MED-001',
    name: 'Aspirin 500mg',
    category: 'medications',
    sku: 'ASP-500-TAB',
    currentStock: 500,
    minStock: 100,
    maxStock: 1000,
    unit: 'tablets',
    costPerUnit: 0.15,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 18)),
    lastRestocked: formatDate(subDays(today, 15)),
    restockHistory: [
      { date: formatDate(subDays(today, 15)), quantity: 500, by: 'Supply Manager' }
    ]
  },
  {
    id: 'MED-002',
    name: 'Ibuprofen 400mg',
    category: 'medications',
    sku: 'IBU-400-TAB',
    currentStock: 350,
    minStock: 100,
    maxStock: 800,
    unit: 'tablets',
    costPerUnit: 0.20,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 24)),
    lastRestocked: formatDate(subDays(today, 10)),
    restockHistory: [
      { date: formatDate(subDays(today, 10)), quantity: 400, by: 'Supply Manager' }
    ]
  },
  {
    id: 'MED-003',
    name: 'Amoxicillin 500mg',
    category: 'medications',
    sku: 'AMX-500-CAP',
    currentStock: 80,
    minStock: 100,
    maxStock: 500,
    unit: 'capsules',
    costPerUnit: 0.45,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 12)),
    lastRestocked: formatDate(subDays(today, 30)),
    restockHistory: [
      { date: formatDate(subDays(today, 30)), quantity: 200, by: 'Supply Manager' }
    ]
  },
  {
    id: 'MED-004',
    name: 'Metformin 1000mg',
    category: 'medications',
    sku: 'MET-1000-TAB',
    currentStock: 200,
    minStock: 150,
    maxStock: 600,
    unit: 'tablets',
    costPerUnit: 0.30,
    location: 'Westside Specialty Clinic',
    expirationDate: formatDate(addMonths(today, 20)),
    lastRestocked: formatDate(subDays(today, 7)),
    restockHistory: [
      { date: formatDate(subDays(today, 7)), quantity: 300, by: 'Supply Manager' }
    ]
  },
  {
    id: 'MED-005',
    name: 'Lisinopril 10mg',
    category: 'medications',
    sku: 'LIS-10-TAB',
    currentStock: 180,
    minStock: 100,
    maxStock: 400,
    unit: 'tablets',
    costPerUnit: 0.25,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 16)),
    lastRestocked: formatDate(subDays(today, 20)),
    restockHistory: [
      { date: formatDate(subDays(today, 20)), quantity: 250, by: 'Supply Manager' }
    ]
  },
  {
    id: 'MED-006',
    name: 'Omeprazole 20mg',
    category: 'medications',
    sku: 'OMP-20-CAP',
    currentStock: 45,
    minStock: 80,
    maxStock: 300,
    unit: 'capsules',
    costPerUnit: 0.35,
    location: 'Westside Specialty Clinic',
    expirationDate: formatDate(addMonths(today, 2)),
    lastRestocked: formatDate(subDays(today, 45)),
    restockHistory: [
      { date: formatDate(subDays(today, 45)), quantity: 150, by: 'Supply Manager' }
    ]
  },
  {
    id: 'MED-007',
    name: 'Sertraline 100mg',
    category: 'medications',
    sku: 'SER-100-TAB',
    currentStock: 120,
    minStock: 50,
    maxStock: 250,
    unit: 'tablets',
    costPerUnit: 0.55,
    location: 'Westside Specialty Clinic',
    expirationDate: formatDate(addMonths(today, 14)),
    lastRestocked: formatDate(subDays(today, 12)),
    restockHistory: [
      { date: formatDate(subDays(today, 12)), quantity: 150, by: 'Supply Manager' }
    ]
  },

  // Medical Supplies
  {
    id: 'SUP-001',
    name: 'Disposable Gloves (M)',
    category: 'supplies',
    sku: 'GLV-M-BOX',
    currentStock: 50,
    minStock: 30,
    maxStock: 150,
    unit: 'boxes',
    costPerUnit: 8.50,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 36)),
    lastRestocked: formatDate(subDays(today, 5)),
    restockHistory: [
      { date: formatDate(subDays(today, 5)), quantity: 60, by: 'Supply Manager' }
    ]
  },
  {
    id: 'SUP-002',
    name: 'Disposable Gloves (L)',
    category: 'supplies',
    sku: 'GLV-L-BOX',
    currentStock: 35,
    minStock: 30,
    maxStock: 150,
    unit: 'boxes',
    costPerUnit: 8.50,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 36)),
    lastRestocked: formatDate(subDays(today, 5)),
    restockHistory: [
      { date: formatDate(subDays(today, 5)), quantity: 50, by: 'Supply Manager' }
    ]
  },
  {
    id: 'SUP-003',
    name: 'Surgical Masks',
    category: 'supplies',
    sku: 'MSK-SUR-BOX',
    currentStock: 100,
    minStock: 50,
    maxStock: 300,
    unit: 'boxes',
    costPerUnit: 12.00,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 48)),
    lastRestocked: formatDate(subDays(today, 3)),
    restockHistory: [
      { date: formatDate(subDays(today, 3)), quantity: 100, by: 'Supply Manager' }
    ]
  },
  {
    id: 'SUP-004',
    name: 'Syringes 5ml',
    category: 'supplies',
    sku: 'SYR-5ML-BOX',
    currentStock: 200,
    minStock: 100,
    maxStock: 500,
    unit: 'pieces',
    costPerUnit: 0.25,
    location: 'Central Imaging & Diagnostics',
    expirationDate: formatDate(addMonths(today, 60)),
    lastRestocked: formatDate(subDays(today, 8)),
    restockHistory: [
      { date: formatDate(subDays(today, 8)), quantity: 250, by: 'Supply Manager' }
    ]
  },
  {
    id: 'SUP-005',
    name: 'Bandages - Assorted',
    category: 'supplies',
    sku: 'BND-AST-BOX',
    currentStock: 75,
    minStock: 40,
    maxStock: 200,
    unit: 'boxes',
    costPerUnit: 15.00,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 36)),
    lastRestocked: formatDate(subDays(today, 14)),
    restockHistory: [
      { date: formatDate(subDays(today, 14)), quantity: 80, by: 'Supply Manager' }
    ]
  },
  {
    id: 'SUP-006',
    name: 'Alcohol Swabs',
    category: 'supplies',
    sku: 'ALC-SWB-BOX',
    currentStock: 20,
    minStock: 50,
    maxStock: 200,
    unit: 'boxes',
    costPerUnit: 5.00,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 24)),
    lastRestocked: formatDate(subDays(today, 25)),
    restockHistory: [
      { date: formatDate(subDays(today, 25)), quantity: 60, by: 'Supply Manager' }
    ]
  },
  {
    id: 'SUP-007',
    name: 'Cotton Balls',
    category: 'supplies',
    sku: 'CTN-BLL-BAG',
    currentStock: 150,
    minStock: 60,
    maxStock: 300,
    unit: 'bags',
    costPerUnit: 3.50,
    location: 'Westside Specialty Clinic',
    expirationDate: null,
    lastRestocked: formatDate(subDays(today, 10)),
    restockHistory: [
      { date: formatDate(subDays(today, 10)), quantity: 100, by: 'Supply Manager' }
    ]
  },

  // Equipment
  {
    id: 'EQP-001',
    name: 'Blood Pressure Cuffs',
    category: 'equipment',
    sku: 'BPC-STD-001',
    currentStock: 15,
    minStock: 10,
    maxStock: 30,
    unit: 'pieces',
    costPerUnit: 45.00,
    location: 'Downtown Medical Center',
    expirationDate: null,
    lastRestocked: formatDate(subDays(today, 60)),
    restockHistory: [
      { date: formatDate(subDays(today, 60)), quantity: 10, by: 'Equipment Manager' }
    ]
  },
  {
    id: 'EQP-002',
    name: 'Stethoscopes',
    category: 'equipment',
    sku: 'STH-PRO-001',
    currentStock: 8,
    minStock: 5,
    maxStock: 20,
    unit: 'pieces',
    costPerUnit: 85.00,
    location: 'Downtown Medical Center',
    expirationDate: null,
    lastRestocked: formatDate(subDays(today, 90)),
    restockHistory: [
      { date: formatDate(subDays(today, 90)), quantity: 5, by: 'Equipment Manager' }
    ]
  },
  {
    id: 'EQP-003',
    name: 'Otoscopes',
    category: 'equipment',
    sku: 'OTO-DIG-001',
    currentStock: 4,
    minStock: 3,
    maxStock: 10,
    unit: 'pieces',
    costPerUnit: 150.00,
    location: 'Westside Specialty Clinic',
    expirationDate: null,
    lastRestocked: formatDate(subDays(today, 120)),
    restockHistory: [
      { date: formatDate(subDays(today, 120)), quantity: 3, by: 'Equipment Manager' }
    ]
  },
  {
    id: 'EQP-004',
    name: 'Pulse Oximeters',
    category: 'equipment',
    sku: 'POX-FNG-001',
    currentStock: 12,
    minStock: 8,
    maxStock: 25,
    unit: 'pieces',
    costPerUnit: 35.00,
    location: 'Central Imaging & Diagnostics',
    expirationDate: null,
    lastRestocked: formatDate(subDays(today, 45)),
    restockHistory: [
      { date: formatDate(subDays(today, 45)), quantity: 10, by: 'Equipment Manager' }
    ]
  },

  // Diagnostic
  {
    id: 'DIA-001',
    name: 'Rapid COVID-19 Test Kits',
    category: 'diagnostic',
    sku: 'COV-RAP-KIT',
    currentStock: 150,
    minStock: 100,
    maxStock: 500,
    unit: 'kits',
    costPerUnit: 12.00,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 6)),
    lastRestocked: formatDate(subDays(today, 7)),
    restockHistory: [
      { date: formatDate(subDays(today, 7)), quantity: 200, by: 'Supply Manager' }
    ]
  },
  {
    id: 'DIA-002',
    name: 'Blood Glucose Test Strips',
    category: 'diagnostic',
    sku: 'GLU-TST-BOX',
    currentStock: 30,
    minStock: 50,
    maxStock: 200,
    unit: 'boxes',
    costPerUnit: 25.00,
    location: 'Westside Specialty Clinic',
    expirationDate: formatDate(addMonths(today, 8)),
    lastRestocked: formatDate(subDays(today, 20)),
    restockHistory: [
      { date: formatDate(subDays(today, 20)), quantity: 50, by: 'Supply Manager' }
    ]
  },
  {
    id: 'DIA-003',
    name: 'Urine Test Strips',
    category: 'diagnostic',
    sku: 'URI-TST-BOX',
    currentStock: 80,
    minStock: 40,
    maxStock: 150,
    unit: 'boxes',
    costPerUnit: 18.00,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 10)),
    lastRestocked: formatDate(subDays(today, 12)),
    restockHistory: [
      { date: formatDate(subDays(today, 12)), quantity: 60, by: 'Supply Manager' }
    ]
  },
  {
    id: 'DIA-004',
    name: 'Pregnancy Test Kits',
    category: 'diagnostic',
    sku: 'PRG-TST-KIT',
    currentStock: 60,
    minStock: 30,
    maxStock: 120,
    unit: 'kits',
    costPerUnit: 8.00,
    location: 'Westside Specialty Clinic',
    expirationDate: formatDate(addMonths(today, 14)),
    lastRestocked: formatDate(subDays(today, 18)),
    restockHistory: [
      { date: formatDate(subDays(today, 18)), quantity: 50, by: 'Supply Manager' }
    ]
  },
  {
    id: 'DIA-005',
    name: 'Strep A Test Kits',
    category: 'diagnostic',
    sku: 'STR-TST-KIT',
    currentStock: 40,
    minStock: 25,
    maxStock: 100,
    unit: 'kits',
    costPerUnit: 10.00,
    location: 'Downtown Medical Center',
    expirationDate: formatDate(addMonths(today, 1)),
    lastRestocked: formatDate(subDays(today, 30)),
    restockHistory: [
      { date: formatDate(subDays(today, 30)), quantity: 50, by: 'Supply Manager' }
    ]
  }
]

// Helper functions
export const getLowStockItems = () => {
  return mockMedicalInventory.filter(item => item.currentStock <= item.minStock)
}

export const getExpiringItems = (daysThreshold = 90) => {
  const thresholdDate = addDays(today, daysThreshold)
  return mockMedicalInventory.filter(item => {
    if (!item.expirationDate) return false
    return new Date(item.expirationDate) <= thresholdDate
  })
}

export const getExpiredItems = () => {
  return mockMedicalInventory.filter(item => {
    if (!item.expirationDate) return false
    return new Date(item.expirationDate) < today
  })
}

export const getItemsByCategory = (category) => {
  return mockMedicalInventory.filter(item => item.category === category)
}

export const getTotalInventoryValue = () => {
  return mockMedicalInventory.reduce((total, item) => {
    return total + (item.currentStock * item.costPerUnit)
  }, 0)
}

export const getCategories = () => {
  return [...new Set(mockMedicalInventory.map(item => item.category))]
}

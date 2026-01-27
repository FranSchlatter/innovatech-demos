export const mockTables = [
  // Main Dining Area
  {
    id: 'T-01',
    name: 'Table 1',
    capacity: 4,
    area: 'main',
    areaName: 'Main Dining',
    status: 'occupied',
    position: { x: 10, y: 10 },
    shape: 'square',
    currentOrder: 'ORD-001',
    currentReservation: 'RES-001',
    seatedAt: new Date().toISOString(),
    guestCount: 4
  },
  {
    id: 'T-02',
    name: 'Table 2',
    capacity: 2,
    area: 'main',
    areaName: 'Main Dining',
    status: 'reserved',
    position: { x: 30, y: 10 },
    shape: 'round',
    currentOrder: null,
    currentReservation: 'RES-002',
    reservationTime: '13:00',
    guestCount: 0
  },
  {
    id: 'T-03',
    name: 'Table 3',
    capacity: 4,
    area: 'main',
    areaName: 'Main Dining',
    status: 'available',
    position: { x: 50, y: 10 },
    shape: 'square',
    currentOrder: null,
    currentReservation: null,
    guestCount: 0
  },
  {
    id: 'T-04',
    name: 'Table 4',
    capacity: 4,
    area: 'main',
    areaName: 'Main Dining',
    status: 'occupied',
    position: { x: 70, y: 10 },
    shape: 'square',
    currentOrder: 'ORD-011',
    currentReservation: null,
    seatedAt: new Date().toISOString(),
    guestCount: 2
  },
  // Window Section
  {
    id: 'T-05',
    name: 'Table 5',
    capacity: 6,
    area: 'window',
    areaName: 'Window Section',
    status: 'occupied',
    position: { x: 10, y: 40 },
    shape: 'rectangle',
    currentOrder: 'ORD-004',
    currentReservation: null,
    seatedAt: new Date().toISOString(),
    guestCount: 4
  },
  {
    id: 'T-06',
    name: 'Table 6',
    capacity: 8,
    area: 'window',
    areaName: 'Window Section',
    status: 'reserved',
    position: { x: 40, y: 40 },
    shape: 'rectangle',
    currentOrder: null,
    currentReservation: 'RES-003',
    reservationTime: '14:00',
    guestCount: 0
  },
  {
    id: 'T-07',
    name: 'Table 7',
    capacity: 2,
    area: 'window',
    areaName: 'Window Section',
    status: 'cleaning',
    position: { x: 70, y: 40 },
    shape: 'round',
    currentOrder: null,
    currentReservation: null,
    guestCount: 0,
    cleaningStartedAt: new Date().toISOString()
  },
  // Patio
  {
    id: 'T-08',
    name: 'Patio 1',
    capacity: 4,
    area: 'patio',
    areaName: 'Outdoor Patio',
    status: 'available',
    position: { x: 10, y: 70 },
    shape: 'round',
    currentOrder: null,
    currentReservation: null,
    guestCount: 0
  },
  {
    id: 'T-09',
    name: 'Patio 2',
    capacity: 4,
    area: 'patio',
    areaName: 'Outdoor Patio',
    status: 'available',
    position: { x: 30, y: 70 },
    shape: 'round',
    currentOrder: null,
    currentReservation: null,
    guestCount: 0
  },
  {
    id: 'T-10',
    name: 'Patio 3',
    capacity: 6,
    area: 'patio',
    areaName: 'Outdoor Patio',
    status: 'occupied',
    position: { x: 50, y: 70 },
    shape: 'rectangle',
    currentOrder: null,
    currentReservation: null,
    seatedAt: new Date().toISOString(),
    guestCount: 5
  },
  // Private Dining
  {
    id: 'T-11',
    name: 'Private Room A',
    capacity: 12,
    area: 'private',
    areaName: 'Private Dining',
    status: 'available',
    position: { x: 10, y: 100 },
    shape: 'rectangle',
    currentOrder: null,
    currentReservation: null,
    guestCount: 0,
    isPrivate: true,
    minSpend: 500
  },
  {
    id: 'T-12',
    name: 'Private Room B',
    capacity: 20,
    area: 'private',
    areaName: 'Private Dining',
    status: 'reserved',
    position: { x: 50, y: 100 },
    shape: 'rectangle',
    currentOrder: null,
    currentReservation: 'RES-007',
    reservationTime: '20:00',
    guestCount: 0,
    isPrivate: true,
    minSpend: 800
  },
  // Bar Area
  {
    id: 'T-13',
    name: 'Bar Seat 1-4',
    capacity: 4,
    area: 'bar',
    areaName: 'Bar Area',
    status: 'occupied',
    position: { x: 80, y: 70 },
    shape: 'bar',
    currentOrder: null,
    currentReservation: null,
    seatedAt: new Date().toISOString(),
    guestCount: 2,
    isWalkInOnly: true
  },
  {
    id: 'T-14',
    name: 'Bar Seat 5-8',
    capacity: 4,
    area: 'bar',
    areaName: 'Bar Area',
    status: 'available',
    position: { x: 80, y: 85 },
    shape: 'bar',
    currentOrder: null,
    currentReservation: null,
    guestCount: 0,
    isWalkInOnly: true
  }
]

// Helper functions
export const getTablesByArea = (area) => {
  return mockTables.filter(table => table.area === area)
}

export const getTablesByStatus = (status) => {
  return mockTables.filter(table => table.status === status)
}

export const getAvailableTables = () => {
  return mockTables.filter(table => table.status === 'available')
}

export const getOccupiedTables = () => {
  return mockTables.filter(table => table.status === 'occupied')
}

export const getTableAreas = () => {
  const areas = [...new Set(mockTables.map(t => t.area))]
  return areas.map(area => ({
    id: area,
    name: mockTables.find(t => t.area === area)?.areaName || area
  }))
}

export const getTotalCapacity = () => {
  return mockTables.reduce((sum, table) => sum + table.capacity, 0)
}

export const getCurrentGuestCount = () => {
  return mockTables.reduce((sum, table) => sum + (table.guestCount || 0), 0)
}

export const getTableForPartySize = (partySize, preferredArea = null) => {
  let availableTables = mockTables.filter(
    t => t.status === 'available' && t.capacity >= partySize
  )

  if (preferredArea) {
    const preferredTables = availableTables.filter(t => t.area === preferredArea)
    if (preferredTables.length > 0) {
      availableTables = preferredTables
    }
  }

  // Return the smallest table that fits
  return availableTables.sort((a, b) => a.capacity - b.capacity)[0] || null
}

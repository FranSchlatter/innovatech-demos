// Generate dates relative to today
const today = new Date()
const formatDate = (date) => date.toISOString().split('T')[0]
const addDays = (days) => {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

export const mockReservations = [
  // Today's reservations
  {
    id: 'RES-001',
    confirmationCode: 'RES-X7K9M2',
    customerName: 'James Wilson',
    customerPhone: '+1-555-0201',
    customerEmail: 'james.w@email.com',
    date: formatDate(today),
    time: '12:00',
    partySize: 4,
    tableId: 'T-01',
    tableName: 'Table 1',
    status: 'seated',
    occasion: 'Birthday',
    specialRequests: 'Birthday cake at dessert',
    seatingPreference: 'window',
    createdAt: `${addDays(-3)}T10:00:00Z`,
    checkedInAt: `${formatDate(today)}T11:55:00Z`
  },
  {
    id: 'RES-002',
    confirmationCode: 'RES-Y3L8N5',
    customerName: 'Maria Rodriguez',
    customerPhone: '+1-555-0202',
    customerEmail: 'maria.r@email.com',
    date: formatDate(today),
    time: '13:00',
    partySize: 2,
    tableId: 'T-02',
    tableName: 'Table 2',
    status: 'confirmed',
    occasion: 'Date Night',
    specialRequests: 'Quiet table please',
    seatingPreference: 'booth',
    createdAt: `${addDays(-2)}T14:30:00Z`
  },
  {
    id: 'RES-003',
    confirmationCode: 'RES-Z9P2Q7',
    customerName: 'Robert Kim',
    customerPhone: '+1-555-0203',
    customerEmail: 'robert.k@email.com',
    date: formatDate(today),
    time: '14:00',
    partySize: 6,
    tableId: 'T-06',
    tableName: 'Table 6',
    status: 'confirmed',
    occasion: 'Business Lunch',
    specialRequests: 'Need power outlets',
    seatingPreference: 'private',
    createdAt: `${addDays(-5)}T09:00:00Z`
  },
  {
    id: 'RES-004',
    confirmationCode: 'RES-A5R4S1',
    customerName: 'Jennifer Lee',
    customerPhone: '+1-555-0204',
    customerEmail: 'jennifer.l@email.com',
    date: formatDate(today),
    time: '18:00',
    partySize: 8,
    tableId: null,
    tableName: null,
    status: 'pending',
    occasion: 'Anniversary',
    specialRequests: 'Champagne on arrival, vegetarian options needed',
    seatingPreference: 'patio',
    createdAt: `${addDays(-1)}T16:00:00Z`
  },
  {
    id: 'RES-005',
    confirmationCode: 'RES-B8T6U3',
    customerName: 'Michael Chang',
    customerPhone: '+1-555-0205',
    customerEmail: 'michael.c@email.com',
    date: formatDate(today),
    time: '19:00',
    partySize: 4,
    tableId: 'T-04',
    tableName: 'Table 4',
    status: 'confirmed',
    occasion: null,
    specialRequests: 'One guest has nut allergy',
    seatingPreference: 'any',
    createdAt: `${addDays(-4)}T11:00:00Z`
  },
  {
    id: 'RES-006',
    confirmationCode: 'RES-C2V9W4',
    customerName: 'Sarah Thompson',
    customerPhone: '+1-555-0206',
    customerEmail: 'sarah.t@email.com',
    date: formatDate(today),
    time: '19:30',
    partySize: 2,
    tableId: 'T-03',
    tableName: 'Table 3',
    status: 'confirmed',
    occasion: 'Proposal',
    specialRequests: 'VERY IMPORTANT: Hide ring in dessert, coordinate with staff',
    seatingPreference: 'window',
    createdAt: `${addDays(-7)}T20:00:00Z`
  },
  {
    id: 'RES-007',
    confirmationCode: 'RES-D7X1Y6',
    customerName: 'William Brown',
    customerPhone: '+1-555-0207',
    customerEmail: 'william.b@email.com',
    date: formatDate(today),
    time: '20:00',
    partySize: 10,
    tableId: null,
    tableName: null,
    status: 'pending',
    occasion: 'Retirement Party',
    specialRequests: 'Need cake, dietary restrictions to follow',
    seatingPreference: 'private',
    createdAt: `${formatDate(today)}T08:00:00Z`
  },
  // Tomorrow's reservations
  {
    id: 'RES-008',
    confirmationCode: 'RES-E4Z3A8',
    customerName: 'Elizabeth Davis',
    customerPhone: '+1-555-0208',
    customerEmail: 'elizabeth.d@email.com',
    date: addDays(1),
    time: '12:30',
    partySize: 3,
    tableId: null,
    tableName: null,
    status: 'confirmed',
    occasion: null,
    specialRequests: 'High chair needed',
    seatingPreference: 'booth',
    createdAt: `${addDays(-2)}T15:00:00Z`
  },
  {
    id: 'RES-009',
    confirmationCode: 'RES-F9B5C2',
    customerName: 'Corporate - FinanceFirst Inc',
    customerPhone: '+1-555-0209',
    customerEmail: 'events@financefirst.com',
    date: addDays(1),
    time: '18:30',
    partySize: 15,
    tableId: null,
    tableName: null,
    status: 'confirmed',
    occasion: 'Business Dinner',
    specialRequests: 'Pre-set menu agreed, wine pairing included',
    seatingPreference: 'private',
    createdAt: `${addDays(-10)}T10:00:00Z`
  },
  {
    id: 'RES-010',
    confirmationCode: 'RES-G6D8E4',
    customerName: 'Amanda Martinez',
    customerPhone: '+1-555-0210',
    customerEmail: 'amanda.m@email.com',
    date: addDays(1),
    time: '19:00',
    partySize: 4,
    tableId: null,
    tableName: null,
    status: 'pending',
    occasion: 'Birthday',
    specialRequests: '',
    seatingPreference: 'patio',
    createdAt: `${formatDate(today)}T10:30:00Z`
  },
  // Past reservations
  {
    id: 'RES-011',
    confirmationCode: 'RES-H2F1G7',
    customerName: 'David Johnson',
    customerPhone: '+1-555-0211',
    customerEmail: 'david.j@email.com',
    date: addDays(-1),
    time: '19:00',
    partySize: 2,
    tableId: 'T-02',
    tableName: 'Table 2',
    status: 'completed',
    occasion: 'Anniversary',
    specialRequests: 'Flowers on table',
    seatingPreference: 'window',
    createdAt: `${addDays(-5)}T12:00:00Z`,
    checkedInAt: `${addDays(-1)}T18:55:00Z`,
    completedAt: `${addDays(-1)}T21:30:00Z`
  },
  {
    id: 'RES-012',
    confirmationCode: 'RES-I5H3I9',
    customerName: 'Lisa Anderson',
    customerPhone: '+1-555-0212',
    customerEmail: 'lisa.a@email.com',
    date: addDays(-1),
    time: '20:00',
    partySize: 6,
    tableId: 'T-05',
    tableName: 'Table 5',
    status: 'no-show',
    occasion: null,
    specialRequests: '',
    seatingPreference: 'any',
    createdAt: `${addDays(-3)}T09:00:00Z`
  },
  // Future reservations
  {
    id: 'RES-013',
    confirmationCode: 'RES-J8K4L1',
    customerName: 'Thomas White',
    customerPhone: '+1-555-0213',
    customerEmail: 'thomas.w@email.com',
    date: addDays(3),
    time: '19:30',
    partySize: 4,
    tableId: null,
    tableName: null,
    status: 'confirmed',
    occasion: 'Graduation',
    specialRequests: 'Gluten-free options needed',
    seatingPreference: 'booth',
    createdAt: `${addDays(-1)}T14:00:00Z`
  },
  {
    id: 'RES-014',
    confirmationCode: 'RES-M3N7O2',
    customerName: 'Wedding Party - Smith/Johnson',
    customerPhone: '+1-555-0214',
    customerEmail: 'wedding@smithjohnson.com',
    date: addDays(7),
    time: '18:00',
    partySize: 25,
    tableId: null,
    tableName: null,
    status: 'confirmed',
    occasion: 'Rehearsal Dinner',
    specialRequests: 'Full venue booking, custom menu, decorations allowed',
    seatingPreference: 'private',
    createdAt: `${addDays(-30)}T10:00:00Z`
  },
  {
    id: 'RES-015',
    confirmationCode: 'RES-P6Q9R5',
    customerName: 'Christopher Moore',
    customerPhone: '+1-555-0215',
    customerEmail: 'chris.m@email.com',
    date: addDays(2),
    time: '13:00',
    partySize: 2,
    tableId: null,
    tableName: null,
    status: 'pending',
    occasion: null,
    specialRequests: '',
    seatingPreference: 'window',
    createdAt: `${formatDate(today)}T11:00:00Z`
  }
]

// Helper functions
export const getTodayReservations = () => {
  const todayStr = formatDate(today)
  return mockReservations.filter(res => res.date === todayStr)
}

export const getUpcomingReservations = () => {
  const todayStr = formatDate(today)
  return mockReservations.filter(res => res.date >= todayStr)
}

export const getPendingReservations = () => {
  return mockReservations.filter(res => res.status === 'pending')
}

export const getReservationsByDate = (date) => {
  return mockReservations.filter(res => res.date === date)
}

export const getReservationsByStatus = (status) => {
  return mockReservations.filter(res => res.status === status)
}

export const getTodayGuestCount = () => {
  return getTodayReservations()
    .filter(r => r.status !== 'cancelled' && r.status !== 'no-show')
    .reduce((sum, r) => sum + r.partySize, 0)
}

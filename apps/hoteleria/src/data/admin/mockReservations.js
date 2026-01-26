// Mock reservations data for hotel admin system
// Generate dates relative to today
const today = new Date()
const formatDate = (date) => date.toISOString().split('T')[0]
const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const mockReservations = [
  // Today's check-ins
  {
    id: 'RES-001',
    guestName: 'John Smith',
    guestEmail: 'john.smith@email.com',
    guestPhone: '+1-555-0101',
    roomId: 3,
    roomNumber: '305',
    roomType: 'deluxe',
    checkIn: formatDate(today),
    checkOut: formatDate(addDays(today, 3)),
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 720,
    specialRequests: 'High floor preferred',
    createdAt: formatDate(addDays(today, -7)),
    arrivalTime: '14:00'
  },
  {
    id: 'RES-002',
    guestName: 'Emily Davis',
    guestEmail: 'emily.davis@email.com',
    guestPhone: '+1-555-0102',
    roomId: 5,
    roomNumber: '412',
    roomType: 'suite',
    checkIn: formatDate(today),
    checkOut: formatDate(addDays(today, 5)),
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 2250,
    specialRequests: 'Anniversary celebration - please arrange flowers',
    createdAt: formatDate(addDays(today, -14)),
    arrivalTime: '15:00'
  },
  {
    id: 'RES-003',
    guestName: 'Michael Brown',
    guestEmail: 'michael.brown@email.com',
    guestPhone: '+1-555-0103',
    roomId: 1,
    roomNumber: '201',
    roomType: 'standard',
    checkIn: formatDate(today),
    checkOut: formatDate(addDays(today, 2)),
    guests: 1,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 300,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -3)),
    arrivalTime: '16:00'
  },
  // Currently checked in
  {
    id: 'RES-004',
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah.j@email.com',
    guestPhone: '+1-555-0104',
    roomId: 7,
    roomNumber: '508',
    roomType: 'suite',
    checkIn: formatDate(addDays(today, -2)),
    checkOut: formatDate(addDays(today, 1)),
    guests: 3,
    status: 'checked-in',
    paymentStatus: 'paid',
    totalAmount: 1350,
    specialRequests: 'Extra pillows',
    createdAt: formatDate(addDays(today, -10)),
    arrivalTime: '14:00'
  },
  {
    id: 'RES-005',
    guestName: 'Robert Wilson',
    guestEmail: 'r.wilson@email.com',
    guestPhone: '+1-555-0105',
    roomId: 4,
    roomNumber: '310',
    roomType: 'deluxe',
    checkIn: formatDate(addDays(today, -1)),
    checkOut: formatDate(addDays(today, 2)),
    guests: 2,
    status: 'checked-in',
    paymentStatus: 'paid',
    totalAmount: 720,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -5)),
    arrivalTime: '13:00'
  },
  {
    id: 'RES-006',
    guestName: 'Jennifer Taylor',
    guestEmail: 'jen.taylor@email.com',
    guestPhone: '+1-555-0106',
    roomId: 2,
    roomNumber: '205',
    roomType: 'standard',
    checkIn: formatDate(addDays(today, -3)),
    checkOut: formatDate(today),
    guests: 2,
    status: 'checked-in',
    paymentStatus: 'paid',
    totalAmount: 600,
    specialRequests: 'Late check-out requested',
    createdAt: formatDate(addDays(today, -15)),
    arrivalTime: '15:00'
  },
  {
    id: 'RES-007',
    guestName: 'William Anderson',
    guestEmail: 'w.anderson@email.com',
    guestPhone: '+1-555-0107',
    roomId: 8,
    roomNumber: '601',
    roomType: 'presidential',
    checkIn: formatDate(addDays(today, -1)),
    checkOut: formatDate(addDays(today, 4)),
    guests: 2,
    status: 'checked-in',
    paymentStatus: 'paid',
    totalAmount: 4000,
    specialRequests: 'VIP treatment - business client',
    createdAt: formatDate(addDays(today, -20)),
    arrivalTime: '12:00'
  },
  // Today's check-outs
  {
    id: 'RES-008',
    guestName: 'James Martinez',
    guestEmail: 'james.m@email.com',
    guestPhone: '+1-555-0108',
    roomId: 6,
    roomNumber: '415',
    roomType: 'deluxe',
    checkIn: formatDate(addDays(today, -4)),
    checkOut: formatDate(today),
    guests: 2,
    status: 'checked-in',
    paymentStatus: 'paid',
    totalAmount: 960,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -12)),
    arrivalTime: '14:00'
  },
  {
    id: 'RES-009',
    guestName: 'Lisa Thompson',
    guestEmail: 'lisa.t@email.com',
    guestPhone: '+1-555-0109',
    roomId: 9,
    roomNumber: '302',
    roomType: 'standard',
    checkIn: formatDate(addDays(today, -2)),
    checkOut: formatDate(today),
    guests: 1,
    status: 'checked-in',
    paymentStatus: 'paid',
    totalAmount: 300,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -8)),
    arrivalTime: '16:00'
  },
  // Future reservations
  {
    id: 'RES-010',
    guestName: 'David Lee',
    guestEmail: 'david.lee@email.com',
    guestPhone: '+1-555-0110',
    roomId: 3,
    roomNumber: '305',
    roomType: 'deluxe',
    checkIn: formatDate(addDays(today, 4)),
    checkOut: formatDate(addDays(today, 7)),
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'partial',
    totalAmount: 720,
    specialRequests: 'Quiet room away from elevator',
    createdAt: formatDate(addDays(today, -2)),
    arrivalTime: '15:00'
  },
  {
    id: 'RES-011',
    guestName: 'Patricia White',
    guestEmail: 'pat.white@email.com',
    guestPhone: '+1-555-0111',
    roomId: 10,
    roomNumber: '420',
    roomType: 'family',
    checkIn: formatDate(addDays(today, 2)),
    checkOut: formatDate(addDays(today, 6)),
    guests: 4,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 1680,
    specialRequests: 'Traveling with 2 children, need cribs',
    createdAt: formatDate(addDays(today, -5)),
    arrivalTime: '14:00'
  },
  {
    id: 'RES-012',
    guestName: 'Christopher Harris',
    guestEmail: 'chris.h@email.com',
    guestPhone: '+1-555-0112',
    roomId: 5,
    roomNumber: '412',
    roomType: 'suite',
    checkIn: formatDate(addDays(today, 6)),
    checkOut: formatDate(addDays(today, 8)),
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'pending',
    totalAmount: 900,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -1)),
    arrivalTime: '17:00'
  },
  // Cancelled reservation
  {
    id: 'RES-013',
    guestName: 'Amanda Clark',
    guestEmail: 'amanda.c@email.com',
    guestPhone: '+1-555-0113',
    roomId: 1,
    roomNumber: '201',
    roomType: 'standard',
    checkIn: formatDate(addDays(today, 1)),
    checkOut: formatDate(addDays(today, 3)),
    guests: 2,
    status: 'cancelled',
    paymentStatus: 'refunded',
    totalAmount: 300,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -10)),
    arrivalTime: '14:00'
  },
  // More upcoming check-ins for today
  {
    id: 'RES-014',
    guestName: 'Kevin Moore',
    guestEmail: 'kevin.m@email.com',
    guestPhone: '+1-555-0114',
    roomId: 11,
    roomNumber: '503',
    roomType: 'deluxe',
    checkIn: formatDate(today),
    checkOut: formatDate(addDays(today, 2)),
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 480,
    specialRequests: 'Early check-in if possible',
    createdAt: formatDate(addDays(today, -4)),
    arrivalTime: '12:00'
  },
  {
    id: 'RES-015',
    guestName: 'Michelle Young',
    guestEmail: 'michelle.y@email.com',
    guestPhone: '+1-555-0115',
    roomId: 12,
    roomNumber: '308',
    roomType: 'standard',
    checkIn: formatDate(today),
    checkOut: formatDate(addDays(today, 1)),
    guests: 1,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 150,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -1)),
    arrivalTime: '18:00'
  },
  // Past check-outs
  {
    id: 'RES-016',
    guestName: 'Steven Hall',
    guestEmail: 'steven.h@email.com',
    guestPhone: '+1-555-0116',
    roomId: 4,
    roomNumber: '310',
    roomType: 'deluxe',
    checkIn: formatDate(addDays(today, -5)),
    checkOut: formatDate(addDays(today, -2)),
    guests: 2,
    status: 'checked-out',
    paymentStatus: 'paid',
    totalAmount: 720,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -20)),
    arrivalTime: '14:00'
  },
  {
    id: 'RES-017',
    guestName: 'Nancy Allen',
    guestEmail: 'nancy.a@email.com',
    guestPhone: '+1-555-0117',
    roomId: 7,
    roomNumber: '508',
    roomType: 'suite',
    checkIn: formatDate(addDays(today, -7)),
    checkOut: formatDate(addDays(today, -3)),
    guests: 2,
    status: 'checked-out',
    paymentStatus: 'paid',
    totalAmount: 1800,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -25)),
    arrivalTime: '15:00'
  },
  // More future
  {
    id: 'RES-018',
    guestName: 'Daniel King',
    guestEmail: 'daniel.k@email.com',
    guestPhone: '+1-555-0118',
    roomId: 8,
    roomNumber: '601',
    roomType: 'presidential',
    checkIn: formatDate(addDays(today, 5)),
    checkOut: formatDate(addDays(today, 10)),
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 4000,
    specialRequests: 'Honeymoon package requested',
    createdAt: formatDate(addDays(today, -3)),
    arrivalTime: '13:00'
  },
  {
    id: 'RES-019',
    guestName: 'Betty Wright',
    guestEmail: 'betty.w@email.com',
    guestPhone: '+1-555-0119',
    roomId: 13,
    roomNumber: '210',
    roomType: 'economy',
    checkIn: formatDate(addDays(today, 1)),
    checkOut: formatDate(addDays(today, 3)),
    guests: 1,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 190,
    specialRequests: '',
    createdAt: formatDate(addDays(today, -2)),
    arrivalTime: '16:00'
  },
  {
    id: 'RES-020',
    guestName: 'George Scott',
    guestEmail: 'george.s@email.com',
    guestPhone: '+1-555-0120',
    roomId: 14,
    roomNumber: '512',
    roomType: 'premium',
    checkIn: formatDate(addDays(today, 3)),
    checkOut: formatDate(addDays(today, 5)),
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'partial',
    totalAmount: 640,
    specialRequests: 'Business trip - need good wifi',
    createdAt: formatDate(addDays(today, -1)),
    arrivalTime: '14:00'
  }
]

// Helper functions
export const getTodayCheckIns = () => {
  const todayStr = formatDate(today)
  return mockReservations.filter(r => r.checkIn === todayStr && r.status === 'confirmed')
}

export const getTodayCheckOuts = () => {
  const todayStr = formatDate(today)
  return mockReservations.filter(r => r.checkOut === todayStr && r.status === 'checked-in')
}

export const getActiveReservations = () => {
  return mockReservations.filter(r => r.status === 'confirmed' || r.status === 'checked-in')
}

export const getCheckedInReservations = () => {
  return mockReservations.filter(r => r.status === 'checked-in')
}

// Mock service requests data for hotel admin system
const today = new Date()
const formatDateTime = (date) => date.toISOString()
const addMinutes = (date, minutes) => {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}
const addHours = (date, hours) => {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export const mockServiceRequests = [
  // Pending requests
  {
    id: 'SR-001',
    roomId: 7,
    roomNumber: '508',
    guestName: 'Sarah Johnson',
    type: 'room-service',
    status: 'pending',
    priority: 'normal',
    description: '2x Club Sandwich, 1x Caesar Salad, 2x Sparkling Water',
    notes: 'No onions on sandwich please',
    assignedTo: null,
    assignedToName: null,
    createdAt: formatDateTime(addMinutes(today, -15)),
    updatedAt: formatDateTime(addMinutes(today, -15)),
    completedAt: null,
    estimatedTime: '30 minutes'
  },
  {
    id: 'SR-002',
    roomId: 4,
    roomNumber: '310',
    guestName: 'Robert Wilson',
    type: 'housekeeping',
    status: 'pending',
    priority: 'normal',
    description: 'Extra towels and toiletries needed',
    notes: '',
    assignedTo: null,
    assignedToName: null,
    createdAt: formatDateTime(addMinutes(today, -25)),
    updatedAt: formatDateTime(addMinutes(today, -25)),
    completedAt: null,
    estimatedTime: '15 minutes'
  },
  {
    id: 'SR-003',
    roomId: 8,
    roomNumber: '601',
    guestName: 'William Anderson',
    type: 'concierge',
    status: 'pending',
    priority: 'urgent',
    description: 'Need restaurant reservation for tonight at 8pm for 4 people',
    notes: 'Prefer Italian or Steakhouse',
    assignedTo: null,
    assignedToName: null,
    createdAt: formatDateTime(addMinutes(today, -5)),
    updatedAt: formatDateTime(addMinutes(today, -5)),
    completedAt: null,
    estimatedTime: '20 minutes'
  },
  // Assigned/In-progress requests
  {
    id: 'SR-004',
    roomId: 2,
    roomNumber: '205',
    guestName: 'Jennifer Taylor',
    type: 'maintenance',
    status: 'assigned',
    priority: 'normal',
    description: 'Air conditioning not cooling properly',
    notes: 'Guest mentioned it started yesterday',
    assignedTo: 'STAFF-004',
    assignedToName: 'Roberto Sanchez',
    createdAt: formatDateTime(addHours(today, -2)),
    updatedAt: formatDateTime(addMinutes(today, -30)),
    completedAt: null,
    estimatedTime: '45 minutes'
  },
  {
    id: 'SR-005',
    roomId: 5,
    roomNumber: '412',
    guestName: 'Emily Davis',
    type: 'room-service',
    status: 'in-progress',
    priority: 'normal',
    description: 'Breakfast order: 2x American Breakfast, 1x Fresh Orange Juice, 1x Coffee',
    notes: 'Eggs scrambled, bacon crispy',
    assignedTo: null,
    assignedToName: null,
    createdAt: formatDateTime(addMinutes(today, -40)),
    updatedAt: formatDateTime(addMinutes(today, -20)),
    completedAt: null,
    estimatedTime: '25 minutes'
  },
  {
    id: 'SR-006',
    roomId: 6,
    roomNumber: '415',
    guestName: 'James Martinez',
    type: 'housekeeping',
    status: 'in-progress',
    priority: 'normal',
    description: 'Full room cleaning requested',
    notes: 'Guest will be out from 10am to 2pm',
    assignedTo: 'STAFF-001',
    assignedToName: 'Maria Garcia',
    createdAt: formatDateTime(addHours(today, -1)),
    updatedAt: formatDateTime(addMinutes(today, -15)),
    completedAt: null,
    estimatedTime: '45 minutes'
  },
  // Completed requests (today)
  {
    id: 'SR-007',
    roomId: 8,
    roomNumber: '601',
    guestName: 'William Anderson',
    type: 'room-service',
    status: 'completed',
    priority: 'normal',
    description: 'Welcome amenity - Champagne and chocolate strawberries',
    notes: 'VIP guest',
    assignedTo: null,
    assignedToName: null,
    createdAt: formatDateTime(addHours(today, -5)),
    updatedAt: formatDateTime(addHours(today, -4)),
    completedAt: formatDateTime(addHours(today, -4)),
    estimatedTime: '15 minutes'
  },
  {
    id: 'SR-008',
    roomId: 7,
    roomNumber: '508',
    guestName: 'Sarah Johnson',
    type: 'housekeeping',
    status: 'completed',
    priority: 'normal',
    description: 'Extra pillows',
    notes: '',
    assignedTo: 'STAFF-002',
    assignedToName: 'Carlos Rodriguez',
    createdAt: formatDateTime(addHours(today, -6)),
    updatedAt: formatDateTime(addHours(today, -5)),
    completedAt: formatDateTime(addHours(today, -5)),
    estimatedTime: '10 minutes'
  },
  {
    id: 'SR-009',
    roomId: 4,
    roomNumber: '310',
    guestName: 'Robert Wilson',
    type: 'facilities',
    status: 'completed',
    priority: 'normal',
    description: 'Gym access card not working',
    notes: '',
    assignedTo: 'STAFF-007',
    assignedToName: 'Sofia Lopez',
    createdAt: formatDateTime(addHours(today, -4)),
    updatedAt: formatDateTime(addHours(today, -3)),
    completedAt: formatDateTime(addHours(today, -3)),
    estimatedTime: '10 minutes'
  },
  // More pending for realism
  {
    id: 'SR-010',
    roomId: 9,
    roomNumber: '302',
    guestName: 'Lisa Thompson',
    type: 'spa',
    status: 'pending',
    priority: 'normal',
    description: 'Book massage appointment for 3pm today',
    notes: 'Prefers female therapist',
    assignedTo: null,
    assignedToName: null,
    createdAt: formatDateTime(addMinutes(today, -10)),
    updatedAt: formatDateTime(addMinutes(today, -10)),
    completedAt: null,
    estimatedTime: '15 minutes'
  },
  {
    id: 'SR-011',
    roomId: 7,
    roomNumber: '508',
    guestName: 'Sarah Johnson',
    type: 'maintenance',
    status: 'pending',
    priority: 'urgent',
    description: 'TV remote not working - batteries dead',
    notes: '',
    assignedTo: null,
    assignedToName: null,
    createdAt: formatDateTime(addMinutes(today, -3)),
    updatedAt: formatDateTime(addMinutes(today, -3)),
    completedAt: null,
    estimatedTime: '10 minutes'
  }
]

// Helper functions
export const getPendingRequests = () => {
  return mockServiceRequests.filter(r => r.status === 'pending')
}

export const getActiveRequests = () => {
  return mockServiceRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled')
}

export const getRequestsByType = (type) => {
  return mockServiceRequests.filter(r => r.type === type)
}

export const getUrgentRequests = () => {
  return mockServiceRequests.filter(r => r.priority === 'urgent' && r.status !== 'completed')
}

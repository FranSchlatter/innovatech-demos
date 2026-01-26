// Mock housekeeping tasks data for hotel admin system
const today = new Date()
const formatDateTime = (date) => date.toISOString()
const addHours = (date, hours) => {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export const mockHousekeepingTasks = [
  // Pending tasks
  {
    id: 'HK-001',
    roomId: 6,
    roomNumber: '415',
    floor: 4,
    type: 'checkout-clean',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 1)),
    startedAt: null,
    completedAt: null,
    notes: 'Guest checking out at 11am',
    checklistItems: [
      { id: 1, task: 'Strip and change bed linens', completed: false },
      { id: 2, task: 'Deep clean bathroom', completed: false },
      { id: 3, task: 'Vacuum and mop floors', completed: false },
      { id: 4, task: 'Restock minibar', completed: false },
      { id: 5, task: 'Restock toiletries', completed: false },
      { id: 6, task: 'Dust all surfaces', completed: false },
      { id: 7, task: 'Check all electronics', completed: false },
      { id: 8, task: 'Final inspection', completed: false }
    ]
  },
  {
    id: 'HK-002',
    roomId: 9,
    roomNumber: '302',
    floor: 3,
    type: 'checkout-clean',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 1)),
    startedAt: null,
    completedAt: null,
    notes: 'Guest checking out at 11am',
    checklistItems: [
      { id: 1, task: 'Strip and change bed linens', completed: false },
      { id: 2, task: 'Deep clean bathroom', completed: false },
      { id: 3, task: 'Vacuum and mop floors', completed: false },
      { id: 4, task: 'Restock minibar', completed: false },
      { id: 5, task: 'Restock toiletries', completed: false },
      { id: 6, task: 'Dust all surfaces', completed: false },
      { id: 7, task: 'Final inspection', completed: false }
    ]
  },
  {
    id: 'HK-003',
    roomId: 2,
    roomNumber: '205',
    floor: 2,
    type: 'checkout-clean',
    priority: 'high',
    status: 'assigned',
    assignedTo: 'STAFF-002',
    assignedToName: 'Carlos Rodriguez',
    scheduledTime: formatDateTime(addHours(today, 0)),
    startedAt: null,
    completedAt: null,
    notes: 'Late checkout - 12pm',
    checklistItems: [
      { id: 1, task: 'Strip and change bed linens', completed: false },
      { id: 2, task: 'Deep clean bathroom', completed: false },
      { id: 3, task: 'Vacuum and mop floors', completed: false },
      { id: 4, task: 'Restock minibar', completed: false },
      { id: 5, task: 'Restock toiletries', completed: false },
      { id: 6, task: 'Dust all surfaces', completed: false },
      { id: 7, task: 'Final inspection', completed: false }
    ]
  },
  // In progress
  {
    id: 'HK-004',
    roomId: 7,
    roomNumber: '508',
    floor: 5,
    type: 'daily',
    priority: 'normal',
    status: 'in-progress',
    assignedTo: 'STAFF-001',
    assignedToName: 'Maria Garcia',
    scheduledTime: formatDateTime(addHours(today, -1)),
    startedAt: formatDateTime(addHours(today, -0.5)),
    completedAt: null,
    notes: 'Guest requested cleaning while at breakfast',
    checklistItems: [
      { id: 1, task: 'Make bed', completed: true },
      { id: 2, task: 'Clean bathroom', completed: true },
      { id: 3, task: 'Replace towels', completed: true },
      { id: 4, task: 'Empty trash', completed: false },
      { id: 5, task: 'Vacuum floor', completed: false },
      { id: 6, task: 'Restock amenities', completed: false }
    ]
  },
  {
    id: 'HK-005',
    roomId: 4,
    roomNumber: '310',
    floor: 3,
    type: 'daily',
    priority: 'normal',
    status: 'in-progress',
    assignedTo: 'STAFF-003',
    assignedToName: 'Ana Martinez',
    scheduledTime: formatDateTime(addHours(today, -1)),
    startedAt: formatDateTime(addHours(today, -0.3)),
    completedAt: null,
    notes: '',
    checklistItems: [
      { id: 1, task: 'Make bed', completed: true },
      { id: 2, task: 'Clean bathroom', completed: false },
      { id: 3, task: 'Replace towels', completed: false },
      { id: 4, task: 'Empty trash', completed: false },
      { id: 5, task: 'Vacuum floor', completed: false }
    ]
  },
  // Completed today
  {
    id: 'HK-006',
    roomId: 8,
    roomNumber: '601',
    floor: 6,
    type: 'daily',
    priority: 'high',
    status: 'completed',
    assignedTo: 'STAFF-001',
    assignedToName: 'Maria Garcia',
    scheduledTime: formatDateTime(addHours(today, -3)),
    startedAt: formatDateTime(addHours(today, -3)),
    completedAt: formatDateTime(addHours(today, -2)),
    notes: 'VIP room - extra attention required',
    checklistItems: [
      { id: 1, task: 'Make bed with premium linens', completed: true },
      { id: 2, task: 'Deep clean bathroom', completed: true },
      { id: 3, task: 'Replace all towels', completed: true },
      { id: 4, task: 'Empty trash', completed: true },
      { id: 5, task: 'Vacuum and mop', completed: true },
      { id: 6, task: 'Restock premium amenities', completed: true },
      { id: 7, task: 'Fresh flowers arrangement', completed: true },
      { id: 8, task: 'Polish all surfaces', completed: true }
    ]
  },
  {
    id: 'HK-007',
    roomId: 5,
    roomNumber: '412',
    floor: 4,
    type: 'daily',
    priority: 'normal',
    status: 'completed',
    assignedTo: 'STAFF-002',
    assignedToName: 'Carlos Rodriguez',
    scheduledTime: formatDateTime(addHours(today, -4)),
    startedAt: formatDateTime(addHours(today, -4)),
    completedAt: formatDateTime(addHours(today, -3)),
    notes: '',
    checklistItems: [
      { id: 1, task: 'Make bed', completed: true },
      { id: 2, task: 'Clean bathroom', completed: true },
      { id: 3, task: 'Replace towels', completed: true },
      { id: 4, task: 'Empty trash', completed: true },
      { id: 5, task: 'Vacuum floor', completed: true },
      { id: 6, task: 'Restock amenities', completed: true }
    ]
  },
  // Turndown service tasks
  {
    id: 'HK-008',
    roomId: 8,
    roomNumber: '601',
    floor: 6,
    type: 'turndown',
    priority: 'normal',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 8)),
    startedAt: null,
    completedAt: null,
    notes: 'VIP room',
    checklistItems: [
      { id: 1, task: 'Turn down bed', completed: false },
      { id: 2, task: 'Close curtains', completed: false },
      { id: 3, task: 'Place chocolates', completed: false },
      { id: 4, task: 'Refresh towels if needed', completed: false },
      { id: 5, task: 'Empty trash', completed: false }
    ]
  },
  {
    id: 'HK-009',
    roomId: 5,
    roomNumber: '412',
    floor: 4,
    type: 'turndown',
    priority: 'normal',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 8)),
    startedAt: null,
    completedAt: null,
    notes: 'Anniversary couple',
    checklistItems: [
      { id: 1, task: 'Turn down bed', completed: false },
      { id: 2, task: 'Close curtains', completed: false },
      { id: 3, task: 'Place rose petals', completed: false },
      { id: 4, task: 'Place chocolates', completed: false },
      { id: 5, task: 'Light candles', completed: false }
    ]
  },
  // Inspection task
  {
    id: 'HK-010',
    roomId: 3,
    roomNumber: '305',
    floor: 3,
    type: 'inspection',
    priority: 'normal',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 2)),
    startedAt: null,
    completedAt: null,
    notes: 'Pre-arrival inspection for VIP',
    checklistItems: [
      { id: 1, task: 'Check all lights working', completed: false },
      { id: 2, task: 'Check AC/Heating', completed: false },
      { id: 3, task: 'Check TV and remote', completed: false },
      { id: 4, task: 'Check minibar stocked', completed: false },
      { id: 5, task: 'Check safe working', completed: false },
      { id: 6, task: 'Check bathroom fixtures', completed: false },
      { id: 7, task: 'Overall cleanliness check', completed: false }
    ]
  }
]

// Helper functions
export const getPendingTasks = () => {
  return mockHousekeepingTasks.filter(t => t.status === 'pending')
}

export const getInProgressTasks = () => {
  return mockHousekeepingTasks.filter(t => t.status === 'in-progress')
}

export const getTasksByFloor = (floor) => {
  return mockHousekeepingTasks.filter(t => t.floor === floor)
}

export const getTasksByStaff = (staffId) => {
  return mockHousekeepingTasks.filter(t => t.assignedTo === staffId)
}

export const getCompletedTodayTasks = () => {
  const todayStart = new Date(today)
  todayStart.setHours(0, 0, 0, 0)
  return mockHousekeepingTasks.filter(t =>
    t.status === 'completed' &&
    new Date(t.completedAt) >= todayStart
  )
}

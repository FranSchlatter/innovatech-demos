export const mockStaff = [
  // Kitchen Staff
  {
    id: 'STAFF-001',
    name: 'Marco Rossi',
    role: 'head-chef',
    roleName: 'Head Chef',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200',
    status: 'on-shift',
    shift: 'morning',
    shiftStart: '06:00',
    shiftEnd: '14:00',
    phone: '+1-555-0301',
    email: 'marco.r@restaurant.com',
    hireDate: '2020-03-15',
    specialties: ['Italian', 'French', 'Pastry']
  },
  {
    id: 'STAFF-002',
    name: 'Sofia Chen',
    role: 'sous-chef',
    roleName: 'Sous Chef',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1583394293214-28ez965e47f?w=200&h=200',
    status: 'on-shift',
    shift: 'morning',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    phone: '+1-555-0302',
    email: 'sofia.c@restaurant.com',
    hireDate: '2021-06-01',
    specialties: ['Asian Fusion', 'Seafood']
  },
  {
    id: 'STAFF-003',
    name: 'James Miller',
    role: 'line-cook',
    roleName: 'Line Cook',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200',
    status: 'on-shift',
    shift: 'morning',
    shiftStart: '08:00',
    shiftEnd: '16:00',
    phone: '+1-555-0303',
    email: 'james.m@restaurant.com',
    hireDate: '2022-01-10',
    specialties: ['Grill', 'Sauté']
  },
  {
    id: 'STAFF-004',
    name: 'Maria Garcia',
    role: 'pastry-chef',
    roleName: 'Pastry Chef',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200',
    status: 'break',
    shift: 'morning',
    shiftStart: '05:00',
    shiftEnd: '13:00',
    phone: '+1-555-0304',
    email: 'maria.g@restaurant.com',
    hireDate: '2021-09-20',
    specialties: ['Desserts', 'Bread', 'Chocolate']
  },
  {
    id: 'STAFF-005',
    name: 'David Kim',
    role: 'line-cook',
    roleName: 'Line Cook',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200',
    status: 'off-shift',
    shift: 'evening',
    shiftStart: '14:00',
    shiftEnd: '22:00',
    phone: '+1-555-0305',
    email: 'david.k@restaurant.com',
    hireDate: '2023-02-15',
    specialties: ['Prep', 'Cold Station']
  },
  // Front of House
  {
    id: 'STAFF-006',
    name: 'Emily Thompson',
    role: 'manager',
    roleName: 'Floor Manager',
    department: 'front',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200',
    status: 'on-shift',
    shift: 'morning',
    shiftStart: '10:00',
    shiftEnd: '18:00',
    phone: '+1-555-0306',
    email: 'emily.t@restaurant.com',
    hireDate: '2019-11-01',
    assignedArea: 'all'
  },
  {
    id: 'STAFF-007',
    name: 'Alex Johnson',
    role: 'server',
    roleName: 'Server',
    department: 'front',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200',
    status: 'on-shift',
    shift: 'morning',
    shiftStart: '11:00',
    shiftEnd: '19:00',
    phone: '+1-555-0307',
    email: 'alex.j@restaurant.com',
    hireDate: '2022-05-01',
    assignedArea: 'main',
    assignedTables: ['T-01', 'T-02', 'T-03', 'T-04']
  },
  {
    id: 'STAFF-008',
    name: 'Jessica Lee',
    role: 'server',
    roleName: 'Server',
    department: 'front',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200',
    status: 'on-shift',
    shift: 'morning',
    shiftStart: '11:00',
    shiftEnd: '19:00',
    phone: '+1-555-0308',
    email: 'jessica.l@restaurant.com',
    hireDate: '2022-08-15',
    assignedArea: 'window',
    assignedTables: ['T-05', 'T-06', 'T-07']
  },
  {
    id: 'STAFF-009',
    name: 'Michael Brown',
    role: 'server',
    roleName: 'Server',
    department: 'front',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200',
    status: 'off-shift',
    shift: 'evening',
    shiftStart: '17:00',
    shiftEnd: '23:00',
    phone: '+1-555-0309',
    email: 'michael.b@restaurant.com',
    hireDate: '2023-01-20',
    assignedArea: 'patio'
  },
  {
    id: 'STAFF-010',
    name: 'Sarah Davis',
    role: 'host',
    roleName: 'Host/Hostess',
    department: 'front',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200',
    status: 'on-shift',
    shift: 'morning',
    shiftStart: '11:00',
    shiftEnd: '19:00',
    phone: '+1-555-0310',
    email: 'sarah.d@restaurant.com',
    hireDate: '2022-11-01',
    assignedArea: 'entrance'
  },
  // Bar
  {
    id: 'STAFF-011',
    name: 'Carlos Martinez',
    role: 'bartender',
    roleName: 'Head Bartender',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200',
    status: 'on-shift',
    shift: 'morning',
    shiftStart: '11:00',
    shiftEnd: '19:00',
    phone: '+1-555-0311',
    email: 'carlos.m@restaurant.com',
    hireDate: '2020-08-01',
    specialties: ['Cocktails', 'Wine Service']
  },
  {
    id: 'STAFF-012',
    name: 'Rachel Wilson',
    role: 'bartender',
    roleName: 'Bartender',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&h=200',
    status: 'off-shift',
    shift: 'evening',
    shiftStart: '17:00',
    shiftEnd: '01:00',
    phone: '+1-555-0312',
    email: 'rachel.w@restaurant.com',
    hireDate: '2022-04-15',
    specialties: ['Mixology', 'Craft Cocktails']
  }
]

// Helper functions
export const getStaffByDepartment = (department) => {
  return mockStaff.filter(staff => staff.department === department)
}

export const getStaffByStatus = (status) => {
  return mockStaff.filter(staff => staff.status === status)
}

export const getOnShiftStaff = () => {
  return mockStaff.filter(staff => staff.status === 'on-shift')
}

export const getKitchenStaff = () => {
  return mockStaff.filter(staff => staff.department === 'kitchen')
}

export const getFrontStaff = () => {
  return mockStaff.filter(staff => staff.department === 'front')
}

export const getStaffByRole = (role) => {
  return mockStaff.filter(staff => staff.role === role)
}

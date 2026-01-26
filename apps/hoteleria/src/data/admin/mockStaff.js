// Mock staff data for hotel admin system
export const mockStaff = [
  {
    id: 'STAFF-001',
    name: 'Maria Garcia',
    role: 'housekeeping',
    email: 'maria.garcia@hotelluxury.com',
    phone: 'ext. 201',
    avatar: null,
    status: 'on-duty',
    shift: 'morning'
  },
  {
    id: 'STAFF-002',
    name: 'Carlos Rodriguez',
    role: 'housekeeping',
    email: 'carlos.rodriguez@hotelluxury.com',
    phone: 'ext. 202',
    avatar: null,
    status: 'on-duty',
    shift: 'morning'
  },
  {
    id: 'STAFF-003',
    name: 'Ana Martinez',
    role: 'housekeeping',
    email: 'ana.martinez@hotelluxury.com',
    phone: 'ext. 203',
    avatar: null,
    status: 'break',
    shift: 'morning'
  },
  {
    id: 'STAFF-004',
    name: 'Roberto Sanchez',
    role: 'maintenance',
    email: 'roberto.sanchez@hotelluxury.com',
    phone: 'ext. 301',
    avatar: null,
    status: 'on-duty',
    shift: 'morning'
  },
  {
    id: 'STAFF-005',
    name: 'Laura Torres',
    role: 'maintenance',
    email: 'laura.torres@hotelluxury.com',
    phone: 'ext. 302',
    avatar: null,
    status: 'on-duty',
    shift: 'afternoon'
  },
  {
    id: 'STAFF-006',
    name: 'Miguel Fernandez',
    role: 'concierge',
    email: 'miguel.fernandez@hotelluxury.com',
    phone: 'ext. 101',
    avatar: null,
    status: 'on-duty',
    shift: 'morning'
  },
  {
    id: 'STAFF-007',
    name: 'Sofia Lopez',
    role: 'front-desk',
    email: 'sofia.lopez@hotelluxury.com',
    phone: 'ext. 100',
    avatar: null,
    status: 'on-duty',
    shift: 'morning'
  },
  {
    id: 'STAFF-008',
    name: 'David Ruiz',
    role: 'front-desk',
    email: 'david.ruiz@hotelluxury.com',
    phone: 'ext. 100',
    avatar: null,
    status: 'off-duty',
    shift: 'night'
  }
]

export const getStaffByRole = (role) => mockStaff.filter(s => s.role === role)
export const getOnDutyStaff = () => mockStaff.filter(s => s.status === 'on-duty')

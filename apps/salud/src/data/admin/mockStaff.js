// Mock staff data for health admin system

export const mockStaff = [
  // Nurses
  {
    id: 'STAFF-001',
    name: 'Maria Garcia',
    role: 'nurse',
    department: 'Cardiology',
    location: 'Downtown Medical Center',
    status: 'on-duty',
    shift: 'morning',
    phone: '+1-555-2001',
    email: 'mgarcia@hospital.com',
    hireDate: '2020-03-15',
    certifications: ['RN', 'BLS', 'ACLS']
  },
  {
    id: 'STAFF-002',
    name: 'Jennifer Williams',
    role: 'nurse',
    department: 'Pediatrics',
    location: 'Westside Specialty Clinic',
    status: 'on-duty',
    shift: 'morning',
    phone: '+1-555-2002',
    email: 'jwilliams@hospital.com',
    hireDate: '2019-07-22',
    certifications: ['RN', 'BLS', 'PALS']
  },
  {
    id: 'STAFF-003',
    name: 'Michael Johnson',
    role: 'nurse',
    department: 'Emergency',
    location: 'Downtown Medical Center',
    status: 'break',
    shift: 'morning',
    phone: '+1-555-2003',
    email: 'mjohnson@hospital.com',
    hireDate: '2021-01-10',
    certifications: ['RN', 'BLS', 'ACLS', 'TNCC']
  },
  {
    id: 'STAFF-004',
    name: 'Sarah Thompson',
    role: 'nurse',
    department: 'Neurology',
    location: 'Central Imaging & Diagnostics',
    status: 'on-duty',
    shift: 'afternoon',
    phone: '+1-555-2004',
    email: 'sthompson@hospital.com',
    hireDate: '2018-11-05',
    certifications: ['RN', 'BLS', 'CNRN']
  },

  // Medical Assistants
  {
    id: 'STAFF-005',
    name: 'David Martinez',
    role: 'medical-assistant',
    department: 'Dermatology',
    location: 'Downtown Medical Center',
    status: 'on-duty',
    shift: 'morning',
    phone: '+1-555-2005',
    email: 'dmartinez@hospital.com',
    hireDate: '2022-04-18',
    certifications: ['CMA', 'BLS']
  },
  {
    id: 'STAFF-006',
    name: 'Emily Brown',
    role: 'medical-assistant',
    department: 'Orthopedics',
    location: 'Downtown Medical Center',
    status: 'on-duty',
    shift: 'morning',
    phone: '+1-555-2006',
    email: 'ebrown@hospital.com',
    hireDate: '2021-08-30',
    certifications: ['CMA', 'BLS', 'CPT']
  },
  {
    id: 'STAFF-007',
    name: 'Robert Lee',
    role: 'medical-assistant',
    department: 'Gastroenterology',
    location: 'Westside Specialty Clinic',
    status: 'off-duty',
    shift: 'afternoon',
    phone: '+1-555-2007',
    email: 'rlee@hospital.com',
    hireDate: '2020-12-01',
    certifications: ['CMA', 'BLS']
  },

  // Receptionists
  {
    id: 'STAFF-008',
    name: 'Amanda Wilson',
    role: 'receptionist',
    department: 'Front Desk',
    location: 'Downtown Medical Center',
    status: 'on-duty',
    shift: 'morning',
    phone: '+1-555-2008',
    email: 'awilson@hospital.com',
    hireDate: '2019-05-12',
    certifications: []
  },
  {
    id: 'STAFF-009',
    name: 'Christopher Davis',
    role: 'receptionist',
    department: 'Front Desk',
    location: 'Westside Specialty Clinic',
    status: 'on-duty',
    shift: 'morning',
    phone: '+1-555-2009',
    email: 'cdavis@hospital.com',
    hireDate: '2022-02-28',
    certifications: []
  },
  {
    id: 'STAFF-010',
    name: 'Lisa Anderson',
    role: 'receptionist',
    department: 'Front Desk',
    location: 'Central Imaging & Diagnostics',
    status: 'on-duty',
    shift: 'morning',
    phone: '+1-555-2010',
    email: 'landerson@hospital.com',
    hireDate: '2021-06-15',
    certifications: []
  },

  // Schedulers
  {
    id: 'STAFF-011',
    name: 'Patricia Moore',
    role: 'scheduler',
    department: 'Administration',
    location: 'Downtown Medical Center',
    status: 'on-duty',
    shift: 'morning',
    phone: '+1-555-2011',
    email: 'pmoore@hospital.com',
    hireDate: '2018-09-20',
    certifications: []
  },
  {
    id: 'STAFF-012',
    name: 'Daniel Taylor',
    role: 'scheduler',
    department: 'Administration',
    location: 'Westside Specialty Clinic',
    status: 'on-leave',
    shift: 'morning',
    phone: '+1-555-2012',
    email: 'dtaylor@hospital.com',
    hireDate: '2020-01-08',
    certifications: []
  }
]

// Helper functions
export const getStaffByRole = (role) => {
  return mockStaff.filter(staff => staff.role === role)
}

export const getStaffByLocation = (location) => {
  return mockStaff.filter(staff => staff.location === location)
}

export const getStaffByStatus = (status) => {
  return mockStaff.filter(staff => staff.status === status)
}

export const getOnDutyStaff = () => {
  return mockStaff.filter(staff => staff.status === 'on-duty')
}

export const getNurses = () => {
  return mockStaff.filter(staff => staff.role === 'nurse')
}

export const getStaffByDepartment = (department) => {
  return mockStaff.filter(staff => staff.department === department)
}

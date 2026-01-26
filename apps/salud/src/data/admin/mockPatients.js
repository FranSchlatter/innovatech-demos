// Mock patients data for health admin system
const today = new Date()
const formatDate = (date) => date.toISOString().split('T')[0]

const subDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

const subYears = (date, years) => {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() - years)
  return result
}

export const mockPatients = [
  {
    id: 'PAT-001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: formatDate(subYears(today, 45)),
    gender: 'male',
    phone: '+1-555-0101',
    email: 'john.smith@email.com',
    address: '123 Main Street, Downtown',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    conditions: ['Hypertension', 'High Cholesterol'],
    medications: ['Lisinopril 10mg', 'Atorvastatin 20mg'],
    insurance: 'BlueCross',
    insuranceNumber: 'BC-789456123',
    emergencyContact: {
      name: 'Mary Smith',
      phone: '+1-555-0102',
      relation: 'Spouse'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 90)), doctor: 'Dr. James Mitchell', reason: 'Annual checkup' },
      { date: formatDate(subDays(today, 180)), doctor: 'Dr. James Mitchell', reason: 'Blood pressure follow-up' }
    ],
    registrationDate: formatDate(subDays(today, 730)),
    lastVisit: formatDate(subDays(today, 90)),
    status: 'active'
  },
  {
    id: 'PAT-002',
    firstName: 'Emily',
    lastName: 'Johnson',
    dateOfBirth: formatDate(subYears(today, 32)),
    gender: 'female',
    phone: '+1-555-0102',
    email: 'emily.j@email.com',
    address: '456 Oak Avenue, Westside',
    bloodType: 'A+',
    allergies: [],
    conditions: ['Eczema'],
    medications: [],
    insurance: 'Aetna',
    insuranceNumber: 'AE-456789012',
    emergencyContact: {
      name: 'Robert Johnson',
      phone: '+1-555-0103',
      relation: 'Father'
    },
    visitHistory: [],
    registrationDate: formatDate(subDays(today, 3)),
    lastVisit: null,
    status: 'new-patient'
  },
  {
    id: 'PAT-003',
    firstName: 'Michael',
    lastName: 'Brown',
    dateOfBirth: formatDate(subYears(today, 38)),
    gender: 'male',
    phone: '+1-555-0103',
    email: 'mbrown@email.com',
    address: '789 Pine Road, Central',
    bloodType: 'B+',
    allergies: ['Sulfa drugs', 'Latex'],
    conditions: ['Torn ACL (recovering)'],
    medications: ['Ibuprofen 400mg PRN'],
    insurance: 'United',
    insuranceNumber: 'UN-321654987',
    emergencyContact: {
      name: 'Lisa Brown',
      phone: '+1-555-0104',
      relation: 'Wife'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 30)), doctor: 'Dr. Michael Rodriguez', reason: 'Knee injury evaluation' },
      { date: formatDate(subDays(today, 14)), doctor: 'Dr. Michael Rodriguez', reason: 'MRI review' }
    ],
    registrationDate: formatDate(subDays(today, 60)),
    lastVisit: formatDate(subDays(today, 14)),
    status: 'active'
  },
  {
    id: 'PAT-004',
    firstName: 'Sarah',
    lastName: 'Davis',
    dateOfBirth: formatDate(subYears(today, 5)),
    gender: 'female',
    phone: '+1-555-0104',
    email: 'sarah.d@email.com',
    address: '234 Elm Street, Northside',
    bloodType: 'AB+',
    allergies: ['Eggs'],
    conditions: [],
    medications: [],
    insurance: 'Cigna',
    insuranceNumber: 'CG-147258369',
    emergencyContact: {
      name: 'Jennifer Davis',
      phone: '+1-555-0105',
      relation: 'Mother'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 365)), doctor: 'Dr. Emma Thompson', reason: '4-year checkup' },
      { date: formatDate(subDays(today, 180)), doctor: 'Dr. Emma Thompson', reason: 'Flu symptoms' }
    ],
    registrationDate: formatDate(subDays(today, 1825)),
    lastVisit: formatDate(subDays(today, 180)),
    status: 'active'
  },
  {
    id: 'PAT-005',
    firstName: 'Robert',
    lastName: 'Wilson',
    dateOfBirth: formatDate(subYears(today, 52)),
    gender: 'male',
    phone: '+1-555-0105',
    email: 'rwilson@email.com',
    address: '567 Maple Drive, Eastside',
    bloodType: 'O-',
    allergies: ['Aspirin', 'NSAIDs'],
    conditions: ['Chronic Migraines', 'Insomnia'],
    medications: ['Sumatriptan 50mg', 'Melatonin 5mg'],
    insurance: 'BlueCross',
    insuranceNumber: 'BC-963852741',
    emergencyContact: {
      name: 'Susan Wilson',
      phone: '+1-555-0106',
      relation: 'Wife'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 60)), doctor: 'Dr. David Patel', reason: 'Migraine management' },
      { date: formatDate(subDays(today, 30)), doctor: 'Dr. David Patel', reason: 'Medication adjustment' }
    ],
    registrationDate: formatDate(subDays(today, 540)),
    lastVisit: formatDate(today),
    status: 'active'
  },
  {
    id: 'PAT-006',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    dateOfBirth: formatDate(subYears(today, 41)),
    gender: 'female',
    phone: '+1-555-0106',
    email: 'jmartinez@email.com',
    address: '890 Cedar Lane, Southside',
    bloodType: 'A-',
    allergies: [],
    conditions: ['IBS'],
    medications: [],
    insurance: 'Medicare',
    insuranceNumber: 'MC-852963741',
    emergencyContact: {
      name: 'Carlos Martinez',
      phone: '+1-555-0107',
      relation: 'Husband'
    },
    visitHistory: [],
    registrationDate: formatDate(subDays(today, 2)),
    lastVisit: null,
    status: 'new-patient'
  },
  {
    id: 'PAT-007',
    firstName: 'David',
    lastName: 'Anderson',
    dateOfBirth: formatDate(subYears(today, 35)),
    gender: 'male',
    phone: '+1-555-0107',
    email: 'danderson@email.com',
    address: '345 Birch Court, Downtown',
    bloodType: 'B-',
    allergies: [],
    conditions: ['Anxiety Disorder', 'Depression'],
    medications: ['Sertraline 100mg', 'Alprazolam 0.5mg PRN'],
    insurance: 'Aetna',
    insuranceNumber: 'AE-741852963',
    emergencyContact: {
      name: 'Angela Anderson',
      phone: '+1-555-0108',
      relation: 'Sister'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 7)), doctor: 'Dr. Robert Williams', reason: 'Therapy session' },
      { date: formatDate(subDays(today, 14)), doctor: 'Dr. Robert Williams', reason: 'Therapy session' },
      { date: formatDate(subDays(today, 21)), doctor: 'Dr. Robert Williams', reason: 'Therapy session' }
    ],
    registrationDate: formatDate(subDays(today, 365)),
    lastVisit: formatDate(subDays(today, 7)),
    status: 'active'
  },
  {
    id: 'PAT-008',
    firstName: 'Lisa',
    lastName: 'Garcia',
    dateOfBirth: formatDate(subYears(today, 28)),
    gender: 'female',
    phone: '+1-555-0108',
    email: 'lgarcia@email.com',
    address: '678 Walnut Way, Westside',
    bloodType: 'AB-',
    allergies: ['Shellfish'],
    conditions: ['Myopia'],
    medications: [],
    insurance: 'United',
    insuranceNumber: 'UN-159357852',
    emergencyContact: {
      name: 'Maria Garcia',
      phone: '+1-555-0109',
      relation: 'Mother'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 180)), doctor: 'Dr. Amanda Lee', reason: 'Annual eye exam' }
    ],
    registrationDate: formatDate(subDays(today, 730)),
    lastVisit: formatDate(subDays(today, 180)),
    status: 'active'
  },
  {
    id: 'PAT-009',
    firstName: 'Thomas',
    lastName: 'Lee',
    dateOfBirth: formatDate(subYears(today, 58)),
    gender: 'male',
    phone: '+1-555-0109',
    email: 'tlee@email.com',
    address: '901 Spruce Street, Central',
    bloodType: 'O+',
    allergies: ['Codeine'],
    conditions: ['Atrial Fibrillation', 'Type 2 Diabetes'],
    medications: ['Metformin 1000mg', 'Warfarin 5mg', 'Metoprolol 50mg'],
    insurance: 'Cigna',
    insuranceNumber: 'CG-357159852',
    emergencyContact: {
      name: 'Helen Lee',
      phone: '+1-555-0110',
      relation: 'Wife'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 30)), doctor: 'Dr. James Mitchell', reason: 'Cardiology follow-up' },
      { date: formatDate(subDays(today, 90)), doctor: 'Dr. James Mitchell', reason: 'EKG' }
    ],
    registrationDate: formatDate(subDays(today, 1095)),
    lastVisit: formatDate(subDays(today, 30)),
    status: 'active'
  },
  {
    id: 'PAT-010',
    firstName: 'Amanda',
    lastName: 'White',
    dateOfBirth: formatDate(subYears(today, 23)),
    gender: 'female',
    phone: '+1-555-0110',
    email: 'awhite@email.com',
    address: '123 Oak Lane, Northside',
    bloodType: 'A+',
    allergies: [],
    conditions: ['Acne'],
    medications: [],
    insurance: 'BlueCross',
    insuranceNumber: 'BC-951753852',
    emergencyContact: {
      name: 'Carol White',
      phone: '+1-555-0111',
      relation: 'Mother'
    },
    visitHistory: [],
    registrationDate: formatDate(subDays(today, 1)),
    lastVisit: null,
    status: 'new-patient'
  },
  {
    id: 'PAT-011',
    firstName: 'Christopher',
    lastName: 'Taylor',
    dateOfBirth: formatDate(subYears(today, 29)),
    gender: 'male',
    phone: '+1-555-0111',
    email: 'ctaylor@email.com',
    address: '456 Pine Avenue, Eastside',
    bloodType: 'B+',
    allergies: [],
    conditions: ['Rotator cuff tear'],
    medications: ['Naproxen 500mg'],
    insurance: 'Aetna',
    insuranceNumber: 'AE-852456123',
    emergencyContact: {
      name: 'Mark Taylor',
      phone: '+1-555-0112',
      relation: 'Brother'
    },
    visitHistory: [],
    registrationDate: formatDate(subDays(today, 6)),
    lastVisit: null,
    status: 'new-patient'
  },
  {
    id: 'PAT-012',
    firstName: 'Patricia',
    lastName: 'Moore',
    dateOfBirth: formatDate(subYears(today, 8)),
    gender: 'female',
    phone: '+1-555-0112',
    email: 'pmoore@email.com',
    address: '789 Elm Drive, Southside',
    bloodType: 'O+',
    allergies: ['Peanuts'],
    conditions: [],
    medications: [],
    insurance: 'Medicaid',
    insuranceNumber: 'MD-753951852',
    emergencyContact: {
      name: 'Richard Moore',
      phone: '+1-555-0113',
      relation: 'Father'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 1)), doctor: 'Dr. Emma Thompson', reason: 'Well-child visit' },
      { date: formatDate(subDays(today, 365)), doctor: 'Dr. Emma Thompson', reason: 'Annual checkup' }
    ],
    registrationDate: formatDate(subDays(today, 2920)),
    lastVisit: formatDate(subDays(today, 1)),
    status: 'active'
  },
  {
    id: 'PAT-013',
    firstName: 'Daniel',
    lastName: 'Jackson',
    dateOfBirth: formatDate(subYears(today, 47)),
    gender: 'male',
    phone: '+1-555-0113',
    email: 'djackson@email.com',
    address: '234 Maple Court, Downtown',
    bloodType: 'A-',
    allergies: ['Iodine'],
    conditions: ['Epilepsy'],
    medications: ['Levetiracetam 500mg'],
    insurance: 'United',
    insuranceNumber: 'UN-456789321',
    emergencyContact: {
      name: 'Barbara Jackson',
      phone: '+1-555-0114',
      relation: 'Wife'
    },
    visitHistory: [],
    registrationDate: formatDate(subDays(today, 10)),
    lastVisit: null,
    status: 'new-patient'
  },
  {
    id: 'PAT-014',
    firstName: 'Nancy',
    lastName: 'Harris',
    dateOfBirth: formatDate(subYears(today, 62)),
    gender: 'female',
    phone: '+1-555-0114',
    email: 'nharris@email.com',
    address: '567 Cedar Road, Westside',
    bloodType: 'B-',
    allergies: [],
    conditions: ['GERD', 'Osteoarthritis'],
    medications: ['Omeprazole 20mg', 'Acetaminophen 500mg'],
    insurance: 'Medicare',
    insuranceNumber: 'MC-321654789',
    emergencyContact: {
      name: 'William Harris',
      phone: '+1-555-0115',
      relation: 'Husband'
    },
    visitHistory: [
      { date: formatDate(subDays(today, 1)), doctor: 'Dr. Lisa Johnson', reason: 'Colonoscopy results' },
      { date: formatDate(subDays(today, 14)), doctor: 'Dr. Lisa Johnson', reason: 'Colonoscopy' }
    ],
    registrationDate: formatDate(subDays(today, 1460)),
    lastVisit: formatDate(subDays(today, 1)),
    status: 'active'
  },
  {
    id: 'PAT-015',
    firstName: 'Kevin',
    lastName: 'Clark',
    dateOfBirth: formatDate(subYears(today, 33)),
    gender: 'male',
    phone: '+1-555-0115',
    email: 'kclark@email.com',
    address: '890 Birch Lane, Central',
    bloodType: 'AB+',
    allergies: [],
    conditions: [],
    medications: [],
    insurance: 'BlueCross',
    insuranceNumber: 'BC-654987321',
    emergencyContact: {
      name: 'Linda Clark',
      phone: '+1-555-0116',
      relation: 'Mother'
    },
    visitHistory: [],
    registrationDate: formatDate(today),
    lastVisit: null,
    status: 'new-patient'
  }
]

// Helper functions
export const getActivePatients = () => {
  return mockPatients.filter(p => p.status === 'active')
}

export const getNewPatients = () => {
  return mockPatients.filter(p => p.status === 'new-patient')
}

export const searchPatients = (query) => {
  const lowerQuery = query.toLowerCase()
  return mockPatients.filter(p =>
    p.firstName.toLowerCase().includes(lowerQuery) ||
    p.lastName.toLowerCase().includes(lowerQuery) ||
    p.email.toLowerCase().includes(lowerQuery) ||
    p.phone.includes(query)
  )
}

export const getPatientById = (id) => {
  return mockPatients.find(p => p.id === id)
}

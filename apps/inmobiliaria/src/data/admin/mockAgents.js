// Staff / agents with duty status for the admin panel
export const mockAgents = [
  {
    id: 'AG-001',
    name: 'Valentina Ríos',
    role: 'Broker Senior',
    email: 'valentina.rios@terranova.com',
    phone: '+54 11 5123-4501',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    status: 'on-duty',
    zone: 'CABA',
    activeListings: 4,
    activeLeads: 3,
    closedThisMonth: 2,
    monthlyTarget: 3
  },
  {
    id: 'AG-002',
    name: 'Martín Aguirre',
    role: 'Broker Zona Norte',
    email: 'martin.aguirre@terranova.com',
    phone: '+54 11 5123-4502',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    status: 'on-duty',
    zone: 'GBA Norte',
    activeListings: 3,
    activeLeads: 2,
    closedThisMonth: 1,
    monthlyTarget: 2
  },
  {
    id: 'AG-003',
    name: 'Camila Ferrer',
    role: 'Asesora Comercial',
    email: 'camila.ferrer@terranova.com',
    phone: '+54 11 5123-4503',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    status: 'on-duty',
    zone: 'CABA',
    activeListings: 2,
    activeLeads: 2,
    closedThisMonth: 3,
    monthlyTarget: 2
  },
  {
    id: 'AG-004',
    name: 'Diego Santángelo',
    role: 'Asesor de Alquileres',
    email: 'diego.santangelo@terranova.com',
    phone: '+54 11 5123-4504',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    status: 'off-duty',
    zone: 'CABA + Costa',
    activeListings: 4,
    activeLeads: 2,
    closedThisMonth: 4,
    monthlyTarget: 4
  }
]

export const getOnDutyAgents = (agents = mockAgents) => agents.filter(a => a.status === 'on-duty')

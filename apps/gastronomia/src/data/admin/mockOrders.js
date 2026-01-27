// Generate dates relative to today
const today = new Date()
const formatDate = (date) => date.toISOString().split('T')[0]
const addDays = (days) => {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

export const mockOrders = [
  // Today's orders - Various statuses
  {
    id: 'ORD-001',
    orderNumber: 'ORD-A7K9M2',
    type: 'dine-in',
    tableId: 'T-01',
    tableName: 'Table 1',
    status: 'preparing',
    items: [
      { dishId: 1, name: 'Truffle Risotto', quantity: 2, price: 32, notes: 'Extra parmesan' },
      { dishId: 5, name: 'Grilled Salmon', quantity: 1, price: 38, notes: '' },
      { dishId: 18, name: 'Tiramisu', quantity: 2, price: 14, notes: '' }
    ],
    subtotal: 130,
    tax: 13,
    total: 143,
    customerName: 'John Smith',
    customerPhone: '+1-555-0101',
    createdAt: `${formatDate(today)}T12:30:00Z`,
    estimatedTime: '12:55',
    notes: 'Anniversary dinner',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-002',
    orderNumber: 'ORD-B3L8N5',
    type: 'delivery',
    status: 'confirmed',
    items: [
      { dishId: 2, name: 'Beef Wellington', quantity: 1, price: 58, notes: 'Medium rare' },
      { dishId: 8, name: 'Caesar Salad', quantity: 1, price: 16, notes: 'No anchovies' }
    ],
    subtotal: 74,
    tax: 7.40,
    deliveryFee: 5,
    total: 86.40,
    customerName: 'Emily Johnson',
    customerPhone: '+1-555-0102',
    customerEmail: 'emily@email.com',
    deliveryAddress: '456 Oak Avenue, Apt 3B',
    createdAt: `${formatDate(today)}T12:45:00Z`,
    estimatedTime: '13:30',
    notes: '',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-003',
    orderNumber: 'ORD-C9P2Q7',
    type: 'takeout',
    status: 'ready',
    items: [
      { dishId: 10, name: 'Margherita Pizza', quantity: 2, price: 22, notes: '' },
      { dishId: 19, name: 'Chocolate Fondant', quantity: 1, price: 16, notes: '' }
    ],
    subtotal: 60,
    tax: 6,
    total: 66,
    customerName: 'Michael Chen',
    customerPhone: '+1-555-0103',
    createdAt: `${formatDate(today)}T11:15:00Z`,
    estimatedTime: '11:45',
    notes: 'Call when ready',
    paymentMethod: 'cash',
    paymentStatus: 'pending'
  },
  {
    id: 'ORD-004',
    orderNumber: 'ORD-D5R4S1',
    type: 'dine-in',
    tableId: 'T-05',
    tableName: 'Table 5',
    status: 'pending',
    items: [
      { dishId: 3, name: 'Lobster Thermidor', quantity: 2, price: 65, notes: '' },
      { dishId: 7, name: 'French Onion Soup', quantity: 2, price: 14, notes: '' },
      { dishId: 20, name: 'Crème Brûlée', quantity: 2, price: 15, notes: '' }
    ],
    subtotal: 188,
    tax: 18.80,
    total: 206.80,
    customerName: 'Sarah Williams',
    customerPhone: '+1-555-0104',
    createdAt: `${formatDate(today)}T13:00:00Z`,
    estimatedTime: '13:40',
    notes: 'VIP guests',
    paymentMethod: 'card',
    paymentStatus: 'pending'
  },
  {
    id: 'ORD-005',
    orderNumber: 'ORD-E8T6U3',
    type: 'delivery',
    status: 'preparing',
    items: [
      { dishId: 4, name: 'Duck Confit', quantity: 1, price: 42, notes: '' },
      { dishId: 9, name: 'Bruschetta', quantity: 1, price: 12, notes: 'Extra tomatoes' }
    ],
    subtotal: 54,
    tax: 5.40,
    deliveryFee: 5,
    total: 64.40,
    customerName: 'David Brown',
    customerPhone: '+1-555-0105',
    customerEmail: 'david.b@email.com',
    deliveryAddress: '789 Pine Street, Suite 101',
    createdAt: `${formatDate(today)}T12:50:00Z`,
    estimatedTime: '13:35',
    notes: 'Leave at door',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-006',
    orderNumber: 'ORD-F2V9W4',
    type: 'dine-in',
    tableId: 'T-03',
    tableName: 'Table 3',
    status: 'completed',
    items: [
      { dishId: 6, name: 'Rack of Lamb', quantity: 2, price: 52, notes: 'Medium' },
      { dishId: 11, name: 'Caprese Salad', quantity: 1, price: 14, notes: '' }
    ],
    subtotal: 118,
    tax: 11.80,
    total: 129.80,
    customerName: 'Jennifer Martinez',
    customerPhone: '+1-555-0106',
    createdAt: `${formatDate(today)}T11:00:00Z`,
    completedAt: `${formatDate(today)}T12:15:00Z`,
    notes: '',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-007',
    orderNumber: 'ORD-G7X1Y6',
    type: 'takeout',
    status: 'delivered',
    items: [
      { dishId: 12, name: 'Pasta Carbonara', quantity: 3, price: 24, notes: '' },
      { dishId: 13, name: 'Garlic Bread', quantity: 2, price: 8, notes: '' }
    ],
    subtotal: 88,
    tax: 8.80,
    total: 96.80,
    customerName: 'Robert Taylor',
    customerPhone: '+1-555-0107',
    createdAt: `${formatDate(today)}T10:30:00Z`,
    completedAt: `${formatDate(today)}T11:00:00Z`,
    notes: '',
    paymentMethod: 'cash',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-008',
    orderNumber: 'ORD-H4Z3A8',
    type: 'dine-in',
    tableId: 'T-02',
    tableName: 'Table 2',
    status: 'cancelled',
    items: [
      { dishId: 14, name: 'Seafood Paella', quantity: 1, price: 48, notes: '' }
    ],
    subtotal: 48,
    tax: 4.80,
    total: 52.80,
    customerName: 'Amanda Wilson',
    customerPhone: '+1-555-0108',
    createdAt: `${formatDate(today)}T09:45:00Z`,
    cancelledAt: `${formatDate(today)}T10:00:00Z`,
    cancelReason: 'Customer request - changed plans',
    notes: '',
    paymentMethod: 'card',
    paymentStatus: 'refunded'
  },
  // Yesterday's orders
  {
    id: 'ORD-009',
    orderNumber: 'ORD-I9B5C2',
    type: 'delivery',
    status: 'completed',
    items: [
      { dishId: 15, name: 'Vegetarian Lasagna', quantity: 2, price: 26, notes: '' },
      { dishId: 16, name: 'Minestrone Soup', quantity: 2, price: 12, notes: '' }
    ],
    subtotal: 76,
    tax: 7.60,
    deliveryFee: 5,
    total: 88.60,
    customerName: 'Chris Anderson',
    customerPhone: '+1-555-0109',
    customerEmail: 'chris.a@email.com',
    deliveryAddress: '321 Elm Road',
    createdAt: `${addDays(-1)}T19:30:00Z`,
    completedAt: `${addDays(-1)}T20:15:00Z`,
    notes: '',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-010',
    orderNumber: 'ORD-J6D8E4',
    type: 'dine-in',
    tableId: 'T-06',
    tableName: 'Table 6',
    status: 'completed',
    items: [
      { dishId: 1, name: 'Truffle Risotto', quantity: 4, price: 32, notes: '' },
      { dishId: 2, name: 'Beef Wellington', quantity: 2, price: 58, notes: '' },
      { dishId: 17, name: 'Wine Selection', quantity: 2, price: 45, notes: '' }
    ],
    subtotal: 334,
    tax: 33.40,
    total: 367.40,
    customerName: 'Corporate Event - TechCorp',
    customerPhone: '+1-555-0110',
    createdAt: `${addDays(-1)}T18:00:00Z`,
    completedAt: `${addDays(-1)}T21:00:00Z`,
    notes: 'Business dinner - 8 guests',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  // More orders for variety
  {
    id: 'ORD-011',
    orderNumber: 'ORD-K2F1G7',
    type: 'dine-in',
    tableId: 'T-04',
    tableName: 'Table 4',
    status: 'preparing',
    items: [
      { dishId: 21, name: 'Seared Tuna', quantity: 2, price: 36, notes: 'Rare' },
      { dishId: 8, name: 'Caesar Salad', quantity: 2, price: 16, notes: '' }
    ],
    subtotal: 104,
    tax: 10.40,
    total: 114.40,
    customerName: 'Lisa Garcia',
    customerPhone: '+1-555-0111',
    createdAt: `${formatDate(today)}T13:15:00Z`,
    estimatedTime: '13:45',
    notes: 'Allergic to shellfish',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-012',
    orderNumber: 'ORD-L5H3I9',
    type: 'delivery',
    status: 'pending',
    items: [
      { dishId: 10, name: 'Margherita Pizza', quantity: 1, price: 22, notes: '' },
      { dishId: 12, name: 'Pasta Carbonara', quantity: 1, price: 24, notes: '' },
      { dishId: 18, name: 'Tiramisu', quantity: 1, price: 14, notes: '' }
    ],
    subtotal: 60,
    tax: 6,
    deliveryFee: 5,
    total: 71,
    customerName: 'Kevin Lee',
    customerPhone: '+1-555-0112',
    customerEmail: 'kevin.l@email.com',
    deliveryAddress: '555 Maple Drive',
    createdAt: `${formatDate(today)}T13:20:00Z`,
    estimatedTime: '14:05',
    notes: '',
    paymentMethod: 'card',
    paymentStatus: 'pending'
  }
]

// Helper functions
export const getTodayOrders = () => {
  const todayStr = formatDate(today)
  return mockOrders.filter(order => order.createdAt.startsWith(todayStr))
}

export const getPendingOrders = () => {
  return mockOrders.filter(order =>
    order.status === 'pending' || order.status === 'confirmed'
  )
}

export const getPreparingOrders = () => {
  return mockOrders.filter(order => order.status === 'preparing')
}

export const getReadyOrders = () => {
  return mockOrders.filter(order => order.status === 'ready')
}

export const getOrdersByType = (type) => {
  return mockOrders.filter(order => order.type === type)
}

export const getOrdersByStatus = (status) => {
  return mockOrders.filter(order => order.status === status)
}

export const getTodayRevenue = () => {
  const todayOrders = getTodayOrders()
  return todayOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0)
}

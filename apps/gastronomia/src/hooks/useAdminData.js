import { useState, useEffect, useCallback } from 'react'
import {
  mockOrders,
  getTodayOrders,
  getTodayRevenue
} from '../data/admin/mockOrders'
import {
  mockReservations,
  getTodayReservations,
  getTodayGuestCount
} from '../data/admin/mockReservations'
import {
  mockKitchenInventory,
  getLowStockItems,
  getExpiringItems,
  getTotalInventoryValue
} from '../data/admin/mockKitchenInventory'
import {
  mockTables,
  getAvailableTables,
  getOccupiedTables,
  getCurrentGuestCount
} from '../data/admin/mockTables'
import {
  mockStaff,
  getOnShiftStaff
} from '../data/admin/mockStaff'

// Import menu data from shared
import gastroData from '@shared-data/gastronomy.json'

const STORAGE_KEY = 'gastronomy_admin_data'

// Simulate API delay
const simulateDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

export function useAdminData() {
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [inventory, setInventory] = useState([])
  const [tables, setTables] = useState([])
  const [staff, setStaff] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load data from localStorage or use mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await simulateDelay(500, 1000)

        const storedData = localStorage.getItem(STORAGE_KEY)
        if (storedData) {
          const parsed = JSON.parse(storedData)
          setOrders(parsed.orders || mockOrders)
          setReservations(parsed.reservations || mockReservations)
          setInventory(parsed.inventory || mockKitchenInventory)
          setTables(parsed.tables || mockTables)
          setStaff(parsed.staff || mockStaff)
        } else {
          setOrders(mockOrders)
          setReservations(mockReservations)
          setInventory(mockKitchenInventory)
          setTables(mockTables)
          setStaff(mockStaff)
        }

        // Load menu items from shared data and add admin fields
        const menuWithStatus = gastroData.dishes.map((dish, index) => ({
          ...dish,
          status: index % 10 === 0 ? 'out-of-stock' : 'active',
          featured: index < 4,
          ordersToday: Math.floor(Math.random() * 15),
          totalOrders: Math.floor(Math.random() * 500) + 100
        }))
        setMenuItems(menuWithStatus)

        setError(null)
      } catch (err) {
        setError('Failed to load data')
        console.error('Error loading admin data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (!loading && orders.length > 0) {
      const dataToStore = {
        orders,
        reservations,
        inventory,
        tables,
        staff,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
    }
  }, [orders, reservations, inventory, tables, staff, loading])

  // Get KPIs for dashboard
  const getKPIs = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders.filter(o => o.createdAt.startsWith(today))
    const todayRes = reservations.filter(r => r.date === today)

    return {
      // Orders
      todayOrders: todayOrders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      preparingOrders: orders.filter(o => o.status === 'preparing').length,
      readyOrders: orders.filter(o => o.status === 'ready').length,
      completedOrdersToday: todayOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
      todayRevenue: todayOrders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0),

      // Reservations
      todayReservations: todayRes.length,
      pendingReservations: reservations.filter(r => r.status === 'pending').length,
      upcomingReservations: reservations.filter(r => r.date >= today && r.status !== 'cancelled').length,
      expectedGuests: todayRes
        .filter(r => r.status !== 'cancelled' && r.status !== 'no-show')
        .reduce((sum, r) => sum + r.partySize, 0),

      // Tables
      availableTables: tables.filter(t => t.status === 'available').length,
      occupiedTables: tables.filter(t => t.status === 'occupied').length,
      reservedTables: tables.filter(t => t.status === 'reserved').length,
      totalCapacity: tables.reduce((sum, t) => sum + t.capacity, 0),
      currentGuests: tables.reduce((sum, t) => sum + (t.guestCount || 0), 0),

      // Inventory
      lowStockItems: inventory.filter(i => i.currentStock <= i.minStock).length,
      expiringItems: inventory.filter(i => {
        if (!i.expirationDate) return false
        const expDate = new Date(i.expirationDate)
        const threshold = new Date()
        threshold.setDate(threshold.getDate() + 7)
        return expDate <= threshold
      }).length,
      inventoryValue: inventory.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0),

      // Staff
      onShiftStaff: staff.filter(s => s.status === 'on-shift').length,
      totalStaff: staff.length,

      // Menu
      activeMenuItems: menuItems.filter(m => m.status === 'active').length,
      outOfStockItems: menuItems.filter(m => m.status === 'out-of-stock').length
    }
  }, [orders, reservations, tables, inventory, staff, menuItems])

  // Order actions
  const updateOrder = useCallback(async (orderId, updates) => {
    await simulateDelay()
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    )
  }, [])

  const updateOrderStatus = useCallback(async (orderId, status) => {
    await simulateDelay()
    const now = new Date().toISOString()
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const updates = { status }
          if (status === 'completed' || status === 'delivered') {
            updates.completedAt = now
          }
          if (status === 'cancelled') {
            updates.cancelledAt = now
          }
          return { ...order, ...updates }
        }
        return order
      })
    )
  }, [])

  // Reservation actions
  const updateReservation = useCallback(async (reservationId, updates) => {
    await simulateDelay()
    setReservations(prev =>
      prev.map(res =>
        res.id === reservationId ? { ...res, ...updates } : res
      )
    )
  }, [])

  const assignTable = useCallback(async (reservationId, tableId) => {
    await simulateDelay()
    const table = tables.find(t => t.id === tableId)
    setReservations(prev =>
      prev.map(res =>
        res.id === reservationId
          ? { ...res, tableId, tableName: table?.name }
          : res
      )
    )
  }, [tables])

  const seatReservation = useCallback(async (reservationId) => {
    await simulateDelay()
    const now = new Date().toISOString()
    const reservation = reservations.find(r => r.id === reservationId)

    // Update reservation status
    setReservations(prev =>
      prev.map(res =>
        res.id === reservationId
          ? { ...res, status: 'seated', checkedInAt: now }
          : res
      )
    )

    // Update table status
    if (reservation?.tableId) {
      setTables(prev =>
        prev.map(table =>
          table.id === reservation.tableId
            ? {
                ...table,
                status: 'occupied',
                currentReservation: reservationId,
                seatedAt: now,
                guestCount: reservation.partySize
              }
            : table
        )
      )
    }
  }, [reservations])

  // Table actions
  const updateTable = useCallback(async (tableId, updates) => {
    await simulateDelay()
    setTables(prev =>
      prev.map(table =>
        table.id === tableId ? { ...table, ...updates } : table
      )
    )
  }, [])

  const clearTable = useCallback(async (tableId) => {
    await simulateDelay()
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              status: 'cleaning',
              currentOrder: null,
              currentReservation: null,
              guestCount: 0,
              seatedAt: null,
              cleaningStartedAt: new Date().toISOString()
            }
          : table
      )
    )
  }, [])

  const markTableAvailable = useCallback(async (tableId) => {
    await simulateDelay()
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              status: 'available',
              cleaningStartedAt: null
            }
          : table
      )
    )
  }, [])

  // Inventory actions
  const restockItem = useCallback(async (itemId, quantity, by = 'Admin') => {
    await simulateDelay()
    setInventory(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newHistory = [
            { date: new Date().toISOString(), quantity, by },
            ...(item.restockHistory || [])
          ]
          return {
            ...item,
            currentStock: item.currentStock + quantity,
            lastRestocked: new Date().toISOString(),
            restockHistory: newHistory
          }
        }
        return item
      })
    )
  }, [])

  const updateInventory = useCallback(async (itemId, updates) => {
    await simulateDelay()
    setInventory(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    )
  }, [])

  // Menu actions
  const updateMenuItem = useCallback(async (dishId, updates) => {
    await simulateDelay()
    setMenuItems(prev =>
      prev.map(item =>
        item.id === dishId ? { ...item, ...updates } : item
      )
    )
  }, [])

  const toggleMenuItemStatus = useCallback(async (dishId) => {
    await simulateDelay()
    setMenuItems(prev =>
      prev.map(item =>
        item.id === dishId
          ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
          : item
      )
    )
  }, [])

  // Staff actions
  const updateStaff = useCallback(async (staffId, updates) => {
    await simulateDelay()
    setStaff(prev =>
      prev.map(s =>
        s.id === staffId ? { ...s, ...updates } : s
      )
    )
  }, [])

  // Reset all data
  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setOrders(mockOrders)
    setReservations(mockReservations)
    setInventory(mockKitchenInventory)
    setTables(mockTables)
    setStaff(mockStaff)
  }, [])

  return {
    // Data
    orders,
    reservations,
    inventory,
    tables,
    staff,
    menuItems,
    loading,
    error,

    // KPIs
    getKPIs,

    // Order actions
    updateOrder,
    updateOrderStatus,

    // Reservation actions
    updateReservation,
    assignTable,
    seatReservation,

    // Table actions
    updateTable,
    clearTable,
    markTableAvailable,

    // Inventory actions
    restockItem,
    updateInventory,

    // Menu actions
    updateMenuItem,
    toggleMenuItemStatus,

    // Staff actions
    updateStaff,

    // Utility
    resetData
  }
}

import { useState, useEffect, useCallback } from 'react'
import { mockReservations, getTodayCheckIns, getTodayCheckOuts, getActiveReservations } from '../data/admin/mockReservations'
import { mockServiceRequests, getPendingRequests, getActiveRequests } from '../data/admin/mockServiceRequests'
import { mockHousekeepingTasks, getPendingTasks as getPendingHKTasks, getCompletedTodayTasks } from '../data/admin/mockHousekeeping'
import { mockInventory, getLowStockItems } from '../data/admin/mockInventory'
import { mockStaff, getOnDutyStaff } from '../data/admin/mockStaff'
import rooms from '@shared-data/rooms.json'

const STORAGE_KEY = 'hotel-admin-data'

// Simulated API delay for realism
const simulateApiDelay = (min = 300, max = 800) => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Generate room status based on reservations
const generateRoomStatuses = (roomsData, reservationsData) => {
  const today = new Date().toISOString().split('T')[0]

  return roomsData.map(room => {
    // Find if room is currently occupied
    const currentReservation = reservationsData.find(r =>
      r.roomId === room.id &&
      r.status === 'checked-in'
    )

    // Find next reservation for this room
    const nextReservation = reservationsData.find(r =>
      r.roomId === room.id &&
      r.status === 'confirmed' &&
      r.checkIn >= today
    )

    let status = 'available'
    if (currentReservation) {
      status = 'occupied'
    } else if (room.id % 7 === 0) {
      status = 'maintenance'
    } else if (room.id % 5 === 0) {
      status = 'cleaning'
    }

    return {
      ...room,
      roomNumber: `${room.floor}0${room.id}`,
      status,
      currentReservation: currentReservation?.id || null,
      currentGuest: currentReservation?.guestName || null,
      nextReservation: nextReservation?.id || null,
      lastCleaned: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }
  })
}

export function useAdminData() {
  const [data, setData] = useState({
    reservations: mockReservations,
    serviceRequests: mockServiceRequests,
    housekeepingTasks: mockHousekeepingTasks,
    inventory: mockInventory,
    staff: mockStaff,
    rooms: generateRoomStatuses(rooms, mockReservations)
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setData(prev => ({
          ...prev,
          ...parsed,
          // Always regenerate room statuses
          rooms: generateRoomStatuses(rooms, parsed.reservations || mockReservations)
        }))
      }
    } catch (err) {
      console.error('Error loading admin data:', err)
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      const toSave = {
        reservations: data.reservations,
        serviceRequests: data.serviceRequests,
        housekeepingTasks: data.housekeepingTasks,
        inventory: data.inventory
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (err) {
      console.error('Error saving admin data:', err)
    }
  }, [data])

  // Calculate KPIs
  const getKPIs = useCallback(() => {
    const totalRooms = data.rooms.length
    const occupiedRooms = data.rooms.filter(r => r.status === 'occupied').length
    const availableRooms = data.rooms.filter(r => r.status === 'available').length
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100)

    const todayCheckIns = data.reservations.filter(r => {
      const today = new Date().toISOString().split('T')[0]
      return r.checkIn === today && r.status === 'confirmed'
    })

    const todayCheckOuts = data.reservations.filter(r => {
      const today = new Date().toISOString().split('T')[0]
      return r.checkOut === today && r.status === 'checked-in'
    })

    const activeReservations = data.reservations.filter(
      r => r.status === 'confirmed' || r.status === 'checked-in'
    )

    const pendingServices = data.serviceRequests.filter(
      r => r.status === 'pending' || r.status === 'assigned'
    )

    // Calculate revenue
    const todayRevenue = data.reservations
      .filter(r => r.status === 'checked-in' || r.status === 'checked-out')
      .reduce((sum, r) => sum + r.totalAmount, 0)

    return {
      occupancyRate,
      totalRooms,
      occupiedRooms,
      availableRooms,
      maintenanceRooms: data.rooms.filter(r => r.status === 'maintenance').length,
      cleaningRooms: data.rooms.filter(r => r.status === 'cleaning').length,
      todayCheckIns: todayCheckIns.length,
      todayCheckInsList: todayCheckIns,
      todayCheckOuts: todayCheckOuts.length,
      todayCheckOutsList: todayCheckOuts,
      activeReservations: activeReservations.length,
      pendingServices: pendingServices.length,
      lowStockItems: data.inventory.filter(i => i.currentStock <= i.minStock).length,
      pendingHousekeeping: data.housekeepingTasks.filter(t => t.status === 'pending').length,
      onDutyStaff: data.staff.filter(s => s.status === 'on-duty').length,
      todayRevenue
    }
  }, [data])

  // Update reservation
  const updateReservation = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        reservations: prev.reservations.map(r =>
          r.id === id ? { ...r, ...updates } : r
        ),
        rooms: generateRoomStatuses(
          rooms,
          prev.reservations.map(r => r.id === id ? { ...r, ...updates } : r)
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update service request
  const updateServiceRequest = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        serviceRequests: prev.serviceRequests.map(r =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update housekeeping task
  const updateHousekeepingTask = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        housekeepingTasks: prev.housekeepingTasks.map(t =>
          t.id === id ? { ...t, ...updates } : t
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update room status
  const updateRoomStatus = useCallback(async (roomId, status, notes = '') => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        rooms: prev.rooms.map(r =>
          r.id === roomId ? { ...r, status, notes } : r
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update inventory
  const updateInventory = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        inventory: prev.inventory.map(i =>
          i.id === id ? { ...i, ...updates } : i
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Restock inventory item
  const restockItem = useCallback(async (id, quantity, by = 'Admin') => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        inventory: prev.inventory.map(i => {
          if (i.id !== id) return i
          return {
            ...i,
            currentStock: i.currentStock + quantity,
            lastRestocked: new Date().toISOString(),
            restockHistory: [
              { date: new Date().toISOString(), quantity, by },
              ...i.restockHistory
            ]
          }
        })
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset to initial data
  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setData({
      reservations: mockReservations,
      serviceRequests: mockServiceRequests,
      housekeepingTasks: mockHousekeepingTasks,
      inventory: mockInventory,
      staff: mockStaff,
      rooms: generateRoomStatuses(rooms, mockReservations)
    })
  }, [])

  return {
    ...data,
    loading,
    error,
    getKPIs,
    updateReservation,
    updateServiceRequest,
    updateHousekeepingTask,
    updateRoomStatus,
    updateInventory,
    restockItem,
    resetData
  }
}

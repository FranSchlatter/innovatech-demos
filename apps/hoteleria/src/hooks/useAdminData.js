import { useState, useEffect, useCallback, useMemo } from 'react'
import { mockServiceRequests, getPendingRequests, getActiveRequests } from '../data/admin/mockServiceRequests'
import { mockHousekeepingTasks, getPendingTasks as getPendingHKTasks, getCompletedTodayTasks } from '../data/admin/mockHousekeeping'
import { mockInventory, getLowStockItems } from '../data/admin/mockInventory'
import { mockStaff, getOnDutyStaff } from '../data/admin/mockStaff'
import rooms from '@shared-data/rooms.json'
import { useReservations } from './useReservations'

const STORAGE_KEY = 'hotel-admin-data'

// Simulated API delay for realism
const simulateApiDelay = (min = 300, max = 800) => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Staff who can be assigned as a room's manager (used for the default assignment).
const MANAGER_POOL = mockStaff.filter(s =>
  ['housekeeping', 'front-desk', 'concierge'].includes(s.role)
)

// Generate room status based on reservations, then apply any persisted overrides
// (manual edits from the Room Management modal: status, price, manager, etc.).
const generateRoomStatuses = (roomsData, reservationsData, overrides = {}) => {
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

    const base = {
      ...room,
      roomNumber: `${room.floor}0${room.id}`,
      status,
      currentReservation: currentReservation?.id || null,
      currentGuest: currentReservation?.guestName || null,
      nextReservation: nextReservation?.id || null,
      // Default manager assigned round-robin so the grid is populated out of the box.
      managerId: MANAGER_POOL[(room.id - 1) % MANAGER_POOL.length]?.id || null,
      history: [],
      lastCleaned: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }

    // Persisted manual edits win over generated defaults.
    return overrides[room.id] ? { ...base, ...overrides[room.id] } : base
  })
}

export function useAdminData() {
  // Reservations now live in the shared, event-synced store (H26) so Dashboard,
  // Calendar, Reception and the Guest Portal all see the same data live.
  const resStore = useReservations()
  const reservations = resStore.reservations

  // Everything else (service requests, housekeeping, inventory, room overrides)
  // stays owned here and persisted to `hotel-admin-data`.
  const [data, setData] = useState({
    serviceRequests: mockServiceRequests,
    housekeepingTasks: mockHousekeepingTasks,
    inventory: mockInventory,
    staff: mockStaff,
    roomOverrides: {}
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Rooms are derived from the live reservations + persisted overrides, so a
  // check-in in any surface immediately flips the relevant room to "occupied".
  const roomsState = useMemo(
    () => generateRoomStatuses(rooms, reservations, data.roomOverrides),
    [reservations, data.roomOverrides]
  )

  // Load from localStorage on mount (reservations are excluded — they come from
  // the shared store now; any legacy reservations key is ignored).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setData(prev => ({
          ...prev,
          serviceRequests: parsed.serviceRequests || prev.serviceRequests,
          housekeepingTasks: parsed.housekeepingTasks || prev.housekeepingTasks,
          inventory: parsed.inventory || prev.inventory,
          roomOverrides: parsed.roomOverrides || {}
        }))
      }
    } catch (err) {
      console.error('Error loading admin data:', err)
    }
  }, [])

  // Persist to localStorage on change (no reservations — those persist in the store).
  useEffect(() => {
    try {
      const toSave = {
        serviceRequests: data.serviceRequests,
        housekeepingTasks: data.housekeepingTasks,
        inventory: data.inventory,
        roomOverrides: data.roomOverrides
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (err) {
      console.error('Error saving admin data:', err)
    }
  }, [data])

  // Calculate KPIs
  const getKPIs = useCallback(() => {
    const totalRooms = roomsState.length
    const occupiedRooms = roomsState.filter(r => r.status === 'occupied').length
    const availableRooms = roomsState.filter(r => r.status === 'available').length
    const occupancyRate = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    const today = new Date().toISOString().split('T')[0]

    const todayCheckIns = reservations.filter(r =>
      r.checkIn === today && r.status === 'confirmed'
    )

    const todayCheckOuts = reservations.filter(r =>
      r.checkOut === today && r.status === 'checked-in'
    )

    const activeReservations = reservations.filter(
      r => r.status === 'confirmed' || r.status === 'checked-in'
    )

    const pendingServices = data.serviceRequests.filter(
      r => r.status === 'pending' || r.status === 'assigned'
    )

    // Calculate revenue
    const todayRevenue = reservations
      .filter(r => r.status === 'checked-in' || r.status === 'checked-out')
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0)

    return {
      occupancyRate,
      totalRooms,
      occupiedRooms,
      availableRooms,
      maintenanceRooms: roomsState.filter(r => r.status === 'maintenance').length,
      cleaningRooms: roomsState.filter(r => r.status === 'cleaning').length,
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
  }, [reservations, roomsState, data.serviceRequests, data.inventory, data.housekeepingTasks, data.staff])

  // Update reservation — delegates to the shared store. Status changes also
  // record a timestamped history entry (used by the Reception timeline).
  const updateReservation = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      const { status, ...rest } = updates || {}
      if (Object.keys(rest).length) resStore.updateReservation(id, rest)
      if (status) resStore.setStatus(id, status, 'admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [resStore])

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

  // Merge arbitrary room fields (status, price, description, amenities, manager,
  // notes, gallery, history…) and persist them as an override so edits survive
  // refresh. Rooms recompute from overrides via the memo above.
  const updateRoom = useCallback(async (roomId, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        roomOverrides: {
          ...prev.roomOverrides,
          [roomId]: { ...(prev.roomOverrides[roomId] || {}), ...updates }
        }
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Backwards-compatible helper — status + notes only.
  const updateRoomStatus = useCallback((roomId, status, notes = '') =>
    updateRoom(roomId, { status, notes }), [updateRoom])

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

  // Reset to initial data (also resets the shared reservations store).
  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    resStore.resetReservations()
    setData({
      serviceRequests: mockServiceRequests,
      housekeepingTasks: mockHousekeepingTasks,
      inventory: mockInventory,
      staff: mockStaff,
      roomOverrides: {}
    })
  }, [resStore])

  return {
    ...data,
    reservations,
    rooms: roomsState,
    loading,
    error,
    getKPIs,
    updateReservation,
    updateServiceRequest,
    updateHousekeepingTask,
    updateRoom,
    updateRoomStatus,
    updateInventory,
    restockItem,
    resetData,
    // Direct access to the reservations store for surfaces that need richer
    // actions (Reception check-in, Calendar) without going through the delay.
    reservationsStore: resStore
  }
}

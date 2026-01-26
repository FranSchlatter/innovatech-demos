import { useState, useEffect, useCallback } from 'react'
import {
  mockAppointments,
  getTodayAppointments,
  getPendingAppointments
} from '../data/admin/mockAppointments'
import {
  mockPatients,
  getActivePatients,
  getNewPatients
} from '../data/admin/mockPatients'
import {
  mockMedicalInventory,
  getLowStockItems,
  getExpiringItems,
  getTotalInventoryValue
} from '../data/admin/mockMedicalInventory'
import {
  mockStaff,
  getOnDutyStaff
} from '../data/admin/mockStaff'

// Import doctors from shared data
import doctorsData from '@shared-data/doctors.json'

const STORAGE_KEY = 'salud_admin_data'

// Simulate API delay
const simulateDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

export function useAdminData() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [inventory, setInventory] = useState([])
  const [staff, setStaff] = useState([])
  const [doctors, setDoctors] = useState([])
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
          setAppointments(parsed.appointments || mockAppointments)
          setPatients(parsed.patients || mockPatients)
          setInventory(parsed.inventory || mockMedicalInventory)
          setStaff(parsed.staff || mockStaff)
        } else {
          setAppointments(mockAppointments)
          setPatients(mockPatients)
          setInventory(mockMedicalInventory)
          setStaff(mockStaff)
        }

        // Add status to doctors
        const doctorsWithStatus = doctorsData.map((doc, index) => ({
          ...doc,
          status: index % 4 === 0 ? 'busy' : index % 3 === 0 ? 'break' : 'on-duty',
          todayAppointments: Math.floor(Math.random() * 8) + 2,
          completedToday: Math.floor(Math.random() * 5)
        }))
        setDoctors(doctorsWithStatus)

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
    if (!loading && appointments.length > 0) {
      const dataToStore = {
        appointments,
        patients,
        inventory,
        staff,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
    }
  }, [appointments, patients, inventory, staff, loading])

  // Get KPIs for dashboard
  const getKPIs = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayAppts = appointments.filter(a => a.date === today)

    return {
      todayAppointments: todayAppts.length,
      pendingConfirmations: appointments.filter(a => a.status === 'scheduled').length,
      availableDoctors: doctors.filter(d => d.status === 'on-duty').length,
      patientsInQueue: todayAppts.filter(a => a.status === 'confirmed' || a.status === 'scheduled').length,
      lowStockAlerts: inventory.filter(i => i.currentStock <= i.minStock).length,
      completedToday: todayAppts.filter(a => a.status === 'completed').length,
      totalPatients: patients.length,
      newPatients: patients.filter(p => p.status === 'new-patient').length,
      inventoryValue: inventory.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0),
      expiringItems: inventory.filter(i => {
        if (!i.expirationDate) return false
        const expDate = new Date(i.expirationDate)
        const thresholdDate = new Date()
        thresholdDate.setDate(thresholdDate.getDate() + 90)
        return expDate <= thresholdDate
      }).length
    }
  }, [appointments, doctors, patients, inventory])

  // Update appointment status
  const updateAppointment = useCallback(async (appointmentId, updates) => {
    await simulateDelay()
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, ...updates } : apt
      )
    )
  }, [])

  // Check in patient
  const checkInPatient = useCallback(async (appointmentId) => {
    await simulateDelay()
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'in-progress', checkInTime: now }
          : apt
      )
    )
  }, [])

  // Complete appointment
  const completeAppointment = useCallback(async (appointmentId, notes = '') => {
    await simulateDelay()
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'completed', notes: notes || apt.notes }
          : apt
      )
    )
  }, [])

  // Cancel appointment
  const cancelAppointment = useCallback(async (appointmentId, reason = '') => {
    await simulateDelay()
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'cancelled', notes: reason || apt.notes }
          : apt
      )
    )
  }, [])

  // Update doctor status
  const updateDoctorStatus = useCallback(async (doctorId, status) => {
    await simulateDelay()
    setDoctors(prev =>
      prev.map(doc =>
        doc.id === doctorId ? { ...doc, status } : doc
      )
    )
  }, [])

  // Update patient
  const updatePatient = useCallback(async (patientId, updates) => {
    await simulateDelay()
    setPatients(prev =>
      prev.map(patient =>
        patient.id === patientId ? { ...patient, ...updates } : patient
      )
    )
  }, [])

  // Restock inventory item
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

  // Update inventory item
  const updateInventory = useCallback(async (itemId, updates) => {
    await simulateDelay()
    setInventory(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    )
  }, [])

  // Reset all data
  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setAppointments(mockAppointments)
    setPatients(mockPatients)
    setInventory(mockMedicalInventory)
    setStaff(mockStaff)
  }, [])

  return {
    // Data
    appointments,
    patients,
    inventory,
    staff,
    doctors,
    loading,
    error,

    // KPIs
    getKPIs,

    // Appointment actions
    updateAppointment,
    checkInPatient,
    completeAppointment,
    cancelAppointment,

    // Doctor actions
    updateDoctorStatus,

    // Patient actions
    updatePatient,

    // Inventory actions
    restockItem,
    updateInventory,

    // Utility
    resetData
  }
}

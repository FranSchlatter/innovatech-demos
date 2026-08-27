import { useState, useEffect, useCallback } from 'react'
import { mockLeads, getNewLeads, getActiveLeads } from '../data/admin/mockLeads'
import { mockVisits, getTodayVisits, getUpcomingVisits } from '../data/admin/mockVisits'
import { mockOperations, getOpenOperations } from '../data/admin/mockOperations'
import { mockAgents, getOnDutyAgents } from '../data/admin/mockAgents'
import properties from '../data/properties.json'

const STORAGE_KEY = 'terranova-admin-data'
const TODAY = '2026-08-27'

// Simulated API delay for realism
const simulateApiDelay = (min = 300, max = 800) => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

export function useAdminData() {
  const [data, setData] = useState({
    properties,
    leads: mockLeads,
    visits: mockVisits,
    operations: mockOperations,
    agents: mockAgents
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setData(prev => ({ ...prev, ...parsed }))
      }
    } catch (err) {
      console.error('Error loading admin data:', err)
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      const toSave = {
        properties: data.properties,
        leads: data.leads,
        visits: data.visits,
        operations: data.operations
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (err) {
      console.error('Error saving admin data:', err)
    }
  }, [data])

  // Calculate KPIs
  const getKPIs = useCallback(() => {
    const totalProperties = data.properties.length
    const availableProperties = data.properties.filter(p => p.status === 'available').length
    const reservedProperties = data.properties.filter(p => p.status === 'reserved').length
    const soldProperties = data.properties.filter(p => p.status === 'sold').length
    const rentedProperties = data.properties.filter(p => p.status === 'rented').length

    const forSale = data.properties.filter(p => p.operation === 'sale').length
    const forRent = data.properties.filter(p => p.operation === 'rent' || p.operation === 'temporary').length

    const newLeads = getNewLeads(data.leads)
    const activeLeads = getActiveLeads(data.leads)
    const closedLeads = data.leads.filter(l => l.stage === 'closed')

    const todayVisits = getTodayVisits(data.visits, TODAY)
    const upcomingVisits = getUpcomingVisits(data.visits, TODAY)

    const openOps = getOpenOperations(data.operations)
    const closedOps = data.operations.filter(o => o.stage === 'closed')

    // Commission revenue from closed operations (normalized to USD for display)
    const monthlyCommission = closedOps.reduce((sum, o) => {
      const usd = o.currency === 'USD' ? o.commission : o.commission / 1000
      return sum + usd
    }, 0)

    // Conversion rate
    const conversionRate = data.leads.length
      ? Math.round((closedLeads.length / data.leads.length) * 100)
      : 0

    const totalViews = data.properties.reduce((sum, p) => sum + (p.views || 0), 0)

    return {
      totalProperties,
      availableProperties,
      reservedProperties,
      soldProperties,
      rentedProperties,
      forSale,
      forRent,
      newLeads: newLeads.length,
      activeLeads: activeLeads.length,
      closedLeads: closedLeads.length,
      todayVisits: todayVisits.length,
      todayVisitsList: todayVisits,
      upcomingVisits: upcomingVisits.length,
      openOperations: openOps.length,
      closedOperations: closedOps.length,
      monthlyCommission: Math.round(monthlyCommission),
      conversionRate,
      totalViews,
      onDutyAgents: getOnDutyAgents(data.agents).length
    }
  }, [data])

  // Update property
  const updateProperty = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        properties: prev.properties.map(p =>
          p.id === id ? { ...p, ...updates } : p
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update lead (e.g. move stage in pipeline)
  const updateLead = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        leads: prev.leads.map(l =>
          l.id === id ? { ...l, ...updates, lastContact: new Date().toISOString() } : l
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update visit
  const updateVisit = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        visits: prev.visits.map(v =>
          v.id === id ? { ...v, ...updates } : v
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update operation
  const updateOperation = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        operations: prev.operations.map(o =>
          o.id === id ? { ...o, ...updates } : o
        )
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
      properties,
      leads: mockLeads,
      visits: mockVisits,
      operations: mockOperations,
      agents: mockAgents
    })
  }, [])

  return {
    ...data,
    loading,
    error,
    getKPIs,
    updateProperty,
    updateLead,
    updateVisit,
    updateOperation,
    resetData
  }
}

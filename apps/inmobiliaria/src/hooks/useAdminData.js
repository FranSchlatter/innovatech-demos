import { useState, useEffect, useCallback } from 'react'
import { mockLeads, getNewLeads, getActiveLeads } from '../data/admin/mockLeads'
import { mockVisits, getTodayVisits, getUpcomingVisits } from '../data/admin/mockVisits'
import { mockOperations, getOpenOperations } from '../data/admin/mockOperations'
import { mockAgents, getOnDutyAgents } from '../data/admin/mockAgents'
import properties from '../data/properties.json'

// v3: operation documents are now stage-scoped with an upload/verify status
// (pending|uploaded|verified) — bump the key so returning demos load the new shape.
const STORAGE_KEY = 'terranova-admin-data-v3'
const TODAY = '2026-08-27'

// Simulated API delay for realism
const simulateApiDelay = (min = 300, max = 800) => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Generate the next sequential id for a collection (e.g. PROP-013, LEAD-010)
const nextId = (items, prefix) => {
  const max = items.reduce((acc, item) => {
    const n = parseInt(String(item.id).replace(`${prefix}-`, ''), 10)
    return Number.isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `${prefix}-${String(max + 1).padStart(3, '0')}`
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
        operations: data.operations,
        agents: data.agents
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

  // Add a brand-new property (returns the created record)
  const addProperty = useCallback(async (property) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      let created = null
      setData(prev => {
        created = { id: nextId(prev.properties, 'PROP'), ...property }
        return { ...prev, properties: [created, ...prev.properties] }
      })
      return created
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete a property
  const deleteProperty = useCallback(async (id) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        properties: prev.properties.filter(p => p.id !== id)
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update lead (e.g. move stage in pipeline). Bumps lastContact so the
  // "última interacción" stays fresh on any edit.
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

  // Add a brand-new lead (returns the created record)
  const addLead = useCallback(async (lead) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      let created = null
      setData(prev => {
        const now = new Date().toISOString()
        created = {
          id: nextId(prev.leads, 'LEAD'),
          createdAt: now,
          lastContact: now,
          noteLog: [],
          contactLog: [],
          ...lead
        }
        return { ...prev, leads: [created, ...prev.leads] }
      })
      return created
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete a lead
  const deleteLead = useCallback(async (id) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        leads: prev.leads.filter(l => l.id !== id)
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

  // Add a brand-new visit (returns the created record)
  const addVisit = useCallback(async (visit) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      let created = null
      setData(prev => {
        created = { id: nextId(prev.visits, 'VIS'), status: 'scheduled', ...visit }
        return { ...prev, visits: [created, ...prev.visits] }
      })
      return created
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

  // Add a brand-new operation (returns the created record)
  const addOperation = useCallback(async (operation) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      let created = null
      setData(prev => {
        created = { id: nextId(prev.operations, 'OP'), ...operation }
        return { ...prev, operations: [created, ...prev.operations] }
      })
      return created
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update agent
  const updateAgent = useCallback(async (id, updates) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      setData(prev => ({
        ...prev,
        agents: prev.agents.map(a =>
          a.id === id ? { ...a, ...updates } : a
        )
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Add a brand-new agent (returns the created record)
  const addAgent = useCallback(async (agent) => {
    setLoading(true)
    try {
      await simulateApiDelay()
      let created = null
      setData(prev => {
        created = { id: nextId(prev.agents, 'AG'), ...agent }
        return { ...prev, agents: [...prev.agents, created] }
      })
      return created
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
    addProperty,
    deleteProperty,
    updateLead,
    addLead,
    deleteLead,
    updateVisit,
    addVisit,
    updateOperation,
    addOperation,
    updateAgent,
    addAgent,
    resetData
  }
}

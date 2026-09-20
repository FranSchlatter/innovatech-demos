import { useState, useEffect, useCallback } from 'react'
import { contracts as seedContracts, contractEndDate, addMonths, toISO, parseISO } from '../data/admin/mockContracts'

const STORAGE_KEY = 'terranova-contracts-v1'

// Next sequential id (CT-1081, …) based on the current collection.
function nextId(list) {
  const max = list.reduce((acc, c) => {
    const n = parseInt(String(c.id).replace('CT-', ''), 10)
    return Number.isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `CT-${max + 1}`
}

// Guarantee every stored record carries the fields the UI relies on, so a demo
// that persisted an older shape still loads cleanly.
function normalize(c) {
  return {
    endDate: null,
    terminatedDate: null,
    terminatedReason: null,
    propertyId: null,
    address: '',
    tenantEmail: '',
    tenantPhone: '',
    owner: '',
    ownerCuit: '',
    agentId: '',
    deposit: c.baseRent || 0,
    extraClauses: [],
    renewals: [],
    ...c
  }
}

// Contracts store with localStorage persistence (I25). Independent of useAdminData
// so the simulator's static seed list stays untouched.
export function useContracts() {
  const [contracts, setContracts] = useState(() => seedContracts.map(normalize))

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) setContracts(parsed.map(normalize))
      }
    } catch (err) {
      console.error('Error loading contracts:', err)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts))
    } catch (err) {
      console.error('Error saving contracts:', err)
    }
  }, [contracts])

  const addContract = useCallback((contract) => {
    let created = null
    setContracts((prev) => {
      created = normalize({ ...contract, id: nextId(prev) })
      return [created, ...prev]
    })
    return created
  }, [])

  const updateContract = useCallback((id, updates) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? normalize({ ...c, ...updates }) : c)))
  }, [])

  // Renew: push the end date forward by `months` (from the current end) and clear
  // any terminated flag — flips the status back to "vigente". Logs the renewal.
  const renewContract = useCallback((id, months = 24) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const from = contractEndDate(c)
        const newEnd = addMonths(from, months)
        return normalize({
          ...c,
          endDate: newEnd,
          terminatedDate: null,
          terminatedReason: null,
          renewals: [...(c.renewals || []), { from, to: newEnd, months }]
        })
      })
    )
  }, [])

  // Rescind: record a termination date (defaults to today via caller) + reason.
  const terminateContract = useCallback((id, dateISO, reason = '') => {
    setContracts((prev) =>
      prev.map((c) => (c.id === id ? normalize({ ...c, terminatedDate: dateISO, terminatedReason: reason }) : c))
    )
  }, [])

  const deleteContract = useCallback((id) => {
    setContracts((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const resetContracts = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setContracts(seedContracts.map(normalize))
  }, [])

  return { contracts, addContract, updateContract, renewContract, terminateContract, deleteContract, resetContracts }
}

// Re-export for callers that build ISO dates alongside the hook.
export { toISO, parseISO }

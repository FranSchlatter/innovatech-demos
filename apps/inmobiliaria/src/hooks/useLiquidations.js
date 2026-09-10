import { useState, useEffect, useCallback } from 'react'
import { liquidations as seed, buildNewPeriod } from '../data/admin/mockLiquidations'

const STORAGE_KEY = 'terranova-liquidations'

// Owner-liquidations state with localStorage persistence and granular mutations.
export function useLiquidations() {
  const [owners, setOwners] = useState(seed)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) setOwners(parsed)
      }
    } catch (err) {
      console.error('Error loading liquidations:', err)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(owners))
    } catch (err) {
      console.error('Error saving liquidations:', err)
    }
  }, [owners])

  // Map a single period of a single owner
  const mapPeriod = useCallback((ownerId, periodId, fn) => {
    setOwners((prev) => prev.map((o) => {
      if (o.id !== ownerId) return o
      return { ...o, periods: o.periods.map((p) => (p.id === periodId ? fn(p) : p)) }
    }))
  }, [])

  const mapProperty = useCallback((ownerId, periodId, propId, fn) => {
    mapPeriod(ownerId, periodId, (p) => ({
      ...p,
      properties: p.properties.map((pr) => (pr.id === propId ? fn(pr) : pr))
    }))
  }, [mapPeriod])

  const setPropertyStatus = useCallback((ownerId, periodId, propId, status) => {
    mapProperty(ownerId, periodId, propId, (pr) => ({
      ...pr,
      status,
      rentCollected: status === 'pendiente' || status === 'atrasado' ? 0 : (pr.rentCollected || pr.rentDue),
      collectDate: status === 'cobrado' && !pr.collectDate ? '2026-08-08' : pr.collectDate
    }))
  }, [mapProperty])

  const addExpense = useCallback((ownerId, periodId, propId, expense) => {
    mapProperty(ownerId, periodId, propId, (pr) => ({
      ...pr,
      expenses: [...pr.expenses, { id: `E-${Date.now()}`, ...expense }]
    }))
  }, [mapProperty])

  const updateExpense = useCallback((ownerId, periodId, propId, expId, patch) => {
    mapProperty(ownerId, periodId, propId, (pr) => ({
      ...pr,
      expenses: pr.expenses.map((e) => (e.id === expId ? { ...e, ...patch } : e))
    }))
  }, [mapProperty])

  const removeExpense = useCallback((ownerId, periodId, propId, expId) => {
    mapProperty(ownerId, periodId, propId, (pr) => ({
      ...pr,
      expenses: pr.expenses.filter((e) => e.id !== expId)
    }))
  }, [mapProperty])

  const setMgmtFee = useCallback((ownerId, pct) => {
    setOwners((prev) => prev.map((o) => (o.id === ownerId ? { ...o, mgmtFeePct: pct } : o)))
  }, [])

  // Add a fresh period to an owner (returns the new period id, or null if it exists)
  const addPeriod = useCallback((ownerId, month, year) => {
    let newId = null
    setOwners((prev) => prev.map((o) => {
      if (o.id !== ownerId) return o
      const period = buildNewPeriod(o, month, year)
      if (o.periods.some((p) => p.id === period.id)) return o
      newId = period.id
      const periods = [period, ...o.periods].sort((a, b) => (b.year - a.year) || (b.month - a.month))
      return { ...o, periods }
    }))
    return newId
  }, [])

  const resetLiquidations = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setOwners(seed)
  }, [])

  return {
    owners,
    setPropertyStatus,
    addExpense,
    updateExpense,
    removeExpense,
    setMgmtFee,
    addPeriod,
    resetLiquidations
  }
}

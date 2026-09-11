import { useState, useEffect, useCallback } from 'react'
import properties from '../data/properties.json'
import {
  PLATFORMS,
  TODAY,
  buildInitialPlatformState
} from '../data/admin/mockPlatforms'

const STORAGE_KEY = 'terranova-platforms-v1'

// Overlay any saved state on top of a freshly-generated base so new properties
// or platforms added later still get their deterministic seed (schema-safe).
function mergeState(base, saved) {
  if (!saved || typeof saved !== 'object') return base
  const merged = {}
  for (const propId of Object.keys(base)) {
    merged[propId] = {}
    for (const platId of Object.keys(base[propId])) {
      const savedCell = saved[propId]?.[platId]
      merged[propId][platId] = savedCell
        ? { ...base[propId][platId], ...savedCell }
        : base[propId][platId]
    }
  }
  return merged
}

// Per-property / per-platform publication state with localStorage persistence.
// Status is user-editable (publish / pause / unpublish); metrics stay as seeded.
export function usePlatforms() {
  const [state, setState] = useState(() => buildInitialPlatformState(properties))

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setState((prev) => mergeState(prev, JSON.parse(saved)))
    } catch (err) {
      console.error('Error loading platform state:', err)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (err) {
      console.error('Error saving platform state:', err)
    }
  }, [state])

  // Change the publication status of one property on one platform.
  // Publishing (from a non-published state) stamps a fresh publishedAt.
  // Tolerates cells that don't exist yet (e.g. a property added via the CRM).
  const setStatus = useCallback((propId, platId, status) => {
    setState((prev) => {
      const propCells = prev[propId] || {}
      const cell = propCells[platId] || {
        status: 'unpublished', publishedAt: null, visits: 0, inquiries: 0, series: [0, 0, 0, 0, 0, 0, 0]
      }
      let { publishedAt } = cell
      if (status === 'published' && cell.status !== 'published') {
        publishedAt = cell.publishedAt || TODAY
      }
      if (status === 'unpublished') publishedAt = null
      return {
        ...prev,
        [propId]: {
          ...propCells,
          [platId]: { ...cell, status, publishedAt }
        }
      }
    })
  }, [])

  const resetPlatforms = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(buildInitialPlatformState(properties))
  }, [])

  return { platformState: state, platforms: PLATFORMS, setStatus, resetPlatforms }
}

import { useState, useEffect, useCallback, useMemo } from 'react'
import { initialFacilities, facilityCounts } from '../data/mockFacilities'

// Shared facility-map state between the guest-facing BeachPoolMap and the admin
// FacilitiesManagement. Both surfaces read/write the same localStorage entry, so
// a lounger a guest reserves turns blue for the front desk without a reload, and
// a spot the front desk frees becomes bookable again for the guest. Demo only —
// no backend. Mirrors the useEvents / useNews pattern (custom + storage events).
const STORAGE_KEY = 'hotel-facilities'
// The spots THIS visitor holds, so the guest surface knows which markers it may
// cancel / order from — kept apart from the admin-managed board.
const MINE_KEY = 'hotel-facilities-mine'
// Custom event so multiple hook instances in the SAME tab stay in sync (the
// native 'storage' event only fires in OTHER tabs).
const SYNC_EVENT = 'hotel-facilities-sync'

function loadFacilities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    // Corrupt or unavailable storage (private mode) — fall back to seed.
  }
  return initialFacilities
}

function loadMine() {
  try {
    const raw = localStorage.getItem(MINE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // ignore
  }
  return []
}

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors (private mode, quota).
  }
  window.dispatchEvent(new Event(SYNC_EVENT))
}

export function useFacilities() {
  const [facilities, setFacilities] = useState(loadFacilities)
  const [mine, setMine] = useState(loadMine)

  // Keep every mounted instance in sync — same tab (custom event) and across
  // tabs/windows (native storage event).
  useEffect(() => {
    const sync = () => {
      setFacilities(loadFacilities())
      setMine(loadMine())
    }
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // Always mutate a freshly-read list so we never clobber a concurrent write
  // from the other surface (guest vs admin).
  const writeFacilities = useCallback((mapper) => {
    const next = loadFacilities().map(mapper)
    setFacilities(next)
    persist(STORAGE_KEY, next)
    return next
  }, [])

  // ---- Guest: reserve an available spot. Returns 'ok' | 'taken' | 'missing'.
  const reserveFacility = useCallback((id, { guestName, date, time } = {}) => {
    const current = loadFacilities()
    const target = current.find((s) => s.id === id)
    if (!target) return 'missing'
    if (target.status !== 'available') return 'taken'

    writeFacilities((s) =>
      s.id === id
        ? {
            ...s,
            status: 'reserved',
            guestName: guestName || 'Huésped',
            reservedFor: { date: date || null, time: time || null },
            heldBy: 'guest'
          }
        : s
    )
    const nextMine = loadMine().includes(id) ? loadMine() : [...loadMine(), id]
    setMine(nextMine)
    persist(MINE_KEY, nextMine)
    return 'ok'
  }, [writeFacilities])

  // ---- Guest: cancel a reservation this visitor made — frees the spot.
  const cancelReservation = useCallback((id) => {
    writeFacilities((s) =>
      s.id === id
        ? { ...s, status: 'available', guestName: null, reservedFor: null, heldBy: null }
        : s
    )
    const nextMine = loadMine().filter((x) => x !== id)
    setMine(nextMine)
    persist(MINE_KEY, nextMine)
  }, [writeFacilities])

  // ---- Admin: free any position back to available (also drops it from the
  // visitor's "mine" list so the guest surface stops treating it as theirs).
  const releaseFacility = useCallback((id) => {
    writeFacilities((s) =>
      s.id === id
        ? { ...s, status: 'available', guestName: null, reservedFor: null, heldBy: null }
        : s
    )
    if (loadMine().includes(id)) {
      const nextMine = loadMine().filter((x) => x !== id)
      setMine(nextMine)
      persist(MINE_KEY, nextMine)
    }
  }, [writeFacilities])

  // ---- Admin: mark an available spot as occupied by a walk-in guest.
  const occupyFacility = useCallback((id, guestName) => {
    writeFacilities((s) =>
      s.id === id
        ? { ...s, status: 'occupied', guestName: guestName?.trim() || 'Huésped', reservedFor: null, heldBy: 'front-desk' }
        : s
    )
  }, [writeFacilities])

  // ---- Reset the whole board to the seed layout (admin convenience).
  const resetFacilities = useCallback(() => {
    setFacilities(initialFacilities)
    setMine([])
    persist(STORAGE_KEY, initialFacilities)
    persist(MINE_KEY, [])
  }, [])

  const isMine = useCallback((id) => mine.includes(id), [mine])

  const counts = useMemo(() => facilityCounts(facilities), [facilities])
  const myReservations = useMemo(
    () => facilities.filter((s) => mine.includes(s.id)),
    [facilities, mine]
  )

  return {
    facilities,
    counts,
    mine,
    myReservations,
    isMine,
    reserveFacility,
    cancelReservation,
    releaseFacility,
    occupyFacility,
    resetFacilities
  }
}

import { useState, useEffect, useCallback, useMemo } from 'react'
import { initialEvents, isUpcoming, isFull, todayISO } from '../data/mockEvents'

// Shared event state between the admin (EventsManagement) and the public landing
// (EventsCalendar). Both surfaces read/write the same localStorage entry, so an
// event created in the admin appears on the landing without a reload, and a guest
// registration bumps the counter the admin sees. Demo only — no backend. Mirrors
// the useNews / useLiveChat pattern (custom + storage events).
const STORAGE_KEY = 'hotel-events'
// Per-visitor registrations live in their own key so the front knows which
// events *this* guest already joined, without mutating the admin-managed list.
const REGISTERED_KEY = 'hotel-events-registered'
// Custom event so multiple hook instances in the SAME tab stay in sync (the
// native 'storage' event only fires in OTHER tabs).
const SYNC_EVENT = 'hotel-events-sync'

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Corrupt or unavailable storage (private mode) — fall back to seed.
  }
  return initialEvents
}

function loadRegistered() {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY)
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

export function useEvents() {
  const [events, setEvents] = useState(loadEvents)
  const [registered, setRegistered] = useState(loadRegistered)

  // Keep every mounted instance in sync — same tab (custom event) and across
  // tabs/windows (native storage event).
  useEffect(() => {
    const sync = () => {
      setEvents(loadEvents())
      setRegistered(loadRegistered())
    }
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // ---- Admin mutations (write fresh state so we never clobber a concurrent edit)
  const addEvent = useCallback((item) => {
    const entry = {
      recurring: false,
      cancelled: false,
      registered: 0,
      ...item,
      id: item.id || `EVT-${Date.now()}`
    }
    const next = [entry, ...loadEvents()]
    setEvents(next)
    persist(STORAGE_KEY, next)
    return entry
  }, [])

  const updateEvent = useCallback((id, patch) => {
    const next = loadEvents().map((e) => (e.id === id ? { ...e, ...patch } : e))
    setEvents(next)
    persist(STORAGE_KEY, next)
  }, [])

  const deleteEvent = useCallback((id) => {
    const next = loadEvents().filter((e) => e.id !== id)
    setEvents(next)
    persist(STORAGE_KEY, next)
  }, [])

  // Toggle the admin cancel flag (kept in the list so it shows as cancelled).
  const toggleCancel = useCallback((id) => {
    const next = loadEvents().map((e) => (e.id === id ? { ...e, cancelled: !e.cancelled } : e))
    setEvents(next)
    persist(STORAGE_KEY, next)
  }, [])

  // ---- Front registration (per visitor). Bumps the shared counter AND records
  // this visitor's registration. Returns 'ok' | 'already' | 'full' | 'missing'
  // so the caller can show the right confirmation state.
  const registerForEvent = useCallback((id) => {
    const current = loadRegistered()
    if (current.includes(id)) return 'already'

    const list = loadEvents()
    const target = list.find((e) => e.id === id)
    if (!target || target.cancelled) return 'missing'
    if (isFull(target)) return 'full'

    const nextEvents = list.map((e) =>
      e.id === id ? { ...e, registered: (e.registered || 0) + 1 } : e
    )
    const nextRegistered = [...current, id]
    setEvents(nextEvents)
    setRegistered(nextRegistered)
    persist(STORAGE_KEY, nextEvents)
    persist(REGISTERED_KEY, nextRegistered)
    return 'ok'
  }, [])

  // Cancel a registration this visitor made — frees the seat again.
  const unregisterFromEvent = useCallback((id) => {
    const current = loadRegistered()
    if (!current.includes(id)) return
    const nextEvents = loadEvents().map((e) =>
      e.id === id ? { ...e, registered: Math.max(0, (e.registered || 0) - 1) } : e
    )
    const nextRegistered = current.filter((x) => x !== id)
    setEvents(nextEvents)
    setRegistered(nextRegistered)
    persist(STORAGE_KEY, nextEvents)
    persist(REGISTERED_KEY, nextRegistered)
  }, [])

  const isRegistered = useCallback((id) => registered.includes(id), [registered])

  // Live events for the front: not cancelled, not past, soonest first.
  const upcomingEvents = useMemo(() => {
    const today = todayISO()
    return events
      .filter((e) => isUpcoming(e, today))
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
  }, [events])

  return {
    events,
    upcomingEvents,
    registered,
    isRegistered,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleCancel,
    registerForEvent,
    unregisterFromEvent
  }
}

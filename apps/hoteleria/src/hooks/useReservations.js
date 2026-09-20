import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  mergeReservations, applyLegacyMigration, reservationBucket, safeParse,
} from '../data/admin/reservationsModel'

// Re-export the pure helpers so existing importers keep working.
export { mergeReservations, reservationBucket }

// ---------------------------------------------------------------------------
// H26 — Unified reservations store.
//
// Before H26 reservations lived in THREE disconnected places:
//   - useAdminData      → `hotel-admin-data`.reservations (Dashboard, Pricing, Rooms)
//   - CalendarManagement → `mockReservations` + `hotel-admin-calendar-extra`/`-status`
//   - GuestPortal        → `hotel-luxury-guest-checkin`
// so a check-in in one surface never showed up in the others.
//
// This hook is now the single source of truth. Every surface (Dashboard,
// Calendar, Reception, Guest Portal) reads/writes it and stays in sync live via
// a custom event (same tab) + the native storage event (other tabs) — the same
// pattern as useNews / useLiveChat / useFacilities.
//
// Storage strategy: we do NOT persist the full reservation array (mock dates are
// relative to "today", so freezing them would make "arriving today" demos rot).
// Instead we persist a small delta:
//   { overrides: { [id]: {...patch} }, extras: [ ...runtime-created reservations ] }
// and merge it over the always-fresh mock seed on every read. Runtime-created
// reservations (calendar quick-create) carry their own absolute dates in extras.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'hotel-reservations'
const SYNC_EVENT = 'hotel-reservations-sync'

// Legacy keys we migrate from on first run so existing demo state isn't lost.
const LEGACY_EXTRA_KEY = 'hotel-admin-calendar-extra'
const LEGACY_STATUS_KEY = 'hotel-admin-calendar-status'

const nowISO = () => new Date().toISOString()

// Build the persisted delta, running a one-time migration from the old calendar
// keys the very first time (before `hotel-reservations` exists).
function loadDelta() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = safeParse(raw, null)
      if (parsed && typeof parsed === 'object') {
        return {
          overrides: parsed.overrides && typeof parsed.overrides === 'object' ? parsed.overrides : {},
          extras: Array.isArray(parsed.extras) ? parsed.extras : [],
        }
      }
    }
  } catch {
    // fall through to migration / empty
  }
  return migrateLegacy()
}

// One-time merge of the pre-H26 calendar state into the new delta shape. Pure
// transformation lives in reservationsModel; here we only read localStorage.
function migrateLegacy() {
  try {
    return applyLegacyMigration(
      localStorage.getItem(LEGACY_EXTRA_KEY),
      localStorage.getItem(LEGACY_STATUS_KEY)
    )
  } catch {
    return { overrides: {}, extras: [] }
  }
}

function persist(delta) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(delta))
  } catch {
    // Ignore storage errors (private mode, quota).
  }
  window.dispatchEvent(new Event(SYNC_EVENT))
}

export function useReservations() {
  const [delta, setDelta] = useState(loadDelta)

  // Keep every mounted instance in sync — same tab (custom event) and across
  // tabs/windows (native storage event).
  useEffect(() => {
    const sync = () => setDelta(loadDelta())
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const reservations = useMemo(() => mergeReservations(delta), [delta])

  // Write a patch to a reservation's override (create the override if needed).
  // Always reads fresh from storage so concurrent instances never clobber.
  const patch = useCallback((id, updater) => {
    const current = loadDelta()
    const prevOverride = current.overrides[id] || {}
    const nextOverride = typeof updater === 'function' ? updater(prevOverride) : { ...prevOverride, ...updater }
    const next = {
      ...current,
      overrides: { ...current.overrides, [id]: nextOverride },
    }
    setDelta(next)
    persist(next)
    return nextOverride
  }, [])

  const updateReservation = useCallback((id, updates) => {
    patch(id, (prev) => ({ ...prev, ...updates }))
  }, [patch])

  // Change status and append a timestamped history entry (drives the timeline).
  const setStatus = useCallback((id, status, by = 'reception') => {
    patch(id, (prev) => ({
      ...prev,
      status,
      statusHistory: [...(prev.statusHistory || []), { status, at: nowISO(), by }],
    }))
  }, [patch])

  // Save resumable station progress WITHOUT completing check-in. This is what
  // lets a guest start online and reception finish later.
  const saveStation = useCallback((id, station, by = 'guest') => {
    patch(id, (prev) => ({
      ...prev,
      station: { ...station, lastUpdatedBy: by, lastUpdatedAt: nowISO() },
    }))
  }, [patch])

  // Complete check-in: flip to checked-in, assign the room (so occupancy KPIs
  // and the tape chart pick it up), stamp the digital key + history.
  const checkIn = useCallback((id, { station, room, digitalKey, keyCards, mobileKey, by = 'reception' } = {}) => {
    patch(id, (prev) => {
      const assignedRoomId = room?.id ?? prev.assignedRoomId ?? null
      const assignedRoomNumber = room?.number ?? prev.assignedRoomNumber ?? null
      return {
        ...prev,
        status: 'checked-in',
        // Reflect the assignment onto the reservation's own room fields so
        // generateRoomStatuses() marks the room occupied and the tape chart
        // draws the bar on the right row.
        ...(assignedRoomId != null ? { roomId: assignedRoomId } : {}),
        ...(assignedRoomNumber != null ? { roomNumber: assignedRoomNumber } : {}),
        assignedRoomId,
        assignedRoomNumber,
        station: station ? { ...station, lastUpdatedBy: by, lastUpdatedAt: nowISO() } : prev.station,
        digitalKey: digitalKey || prev.digitalKey || null,
        keyCards: keyCards ?? prev.keyCards ?? null,
        mobileKey: mobileKey ?? prev.mobileKey ?? null,
        checkedInAt: nowISO(),
        statusHistory: [...(prev.statusHistory || []), { status: 'checked-in', at: nowISO(), by }],
      }
    })
  }, [patch])

  const checkOut = useCallback((id, by = 'reception') => {
    patch(id, (prev) => ({
      ...prev,
      status: 'checked-out',
      checkedOutAt: nowISO(),
      statusHistory: [...(prev.statusHistory || []), { status: 'checked-out', at: nowISO(), by }],
    }))
  }, [patch])

  // Add a runtime-created reservation (calendar quick-create).
  const addReservation = useCallback((res) => {
    const current = loadDelta()
    const entry = { id: res.id || `RES-C-${Date.now()}`, ...res }
    const next = { ...current, extras: [...current.extras, entry] }
    setDelta(next)
    persist(next)
    return entry
  }, [])

  const resetReservations = useCallback(() => {
    const empty = { overrides: {}, extras: [] }
    try {
      localStorage.removeItem(STORAGE_KEY)
      // Clear legacy keys too so a reset is a true clean slate.
      localStorage.removeItem(LEGACY_EXTRA_KEY)
      localStorage.removeItem(LEGACY_STATUS_KEY)
    } catch { /* ignore */ }
    setDelta(empty)
    persist(empty)
  }, [])

  const getReservation = useCallback(
    (id) => reservations.find((r) => r.id === id) || null,
    [reservations]
  )

  return {
    reservations,
    getReservation,
    updateReservation,
    setStatus,
    saveStation,
    checkIn,
    checkOut,
    addReservation,
    resetReservations,
  }
}

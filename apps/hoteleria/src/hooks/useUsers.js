import { useState, useEffect, useCallback } from 'react'
import { initialUsers, getDefaultAreas } from '../data/mockUsers'

// Persisted list of admin user accounts (H18). Demo only — no backend. Mirrors
// the useNews pattern: a single localStorage entry is the source of truth, and
// every mounted instance stays in sync via a custom event (same tab) plus the
// native storage event (other tabs).
const STORAGE_KEY = 'hotel-users'
const SYNC_EVENT = 'hotel-users-sync'

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Corrupt or unavailable storage (private mode) — fall back to seed.
  }
  return initialUsers
}

function persist(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Ignore storage errors (private mode, quota).
  }
  window.dispatchEvent(new Event(SYNC_EVENT))
}

export function useUsers() {
  const [users, setUsers] = useState(loadUsers)

  useEffect(() => {
    const sync = () => setUsers(loadUsers())
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // Always mutate the freshest persisted state so we never clobber a concurrent
  // edit from another mounted instance.
  const addUser = useCallback((user) => {
    const entry = {
      id: user.id || `USR-${Date.now()}`,
      name: (user.name || '').trim(),
      email: (user.email || '').trim(),
      role: user.role || 'front-desk',
      avatar: user.avatar ?? null,
      status: user.status || 'active',
      lastLogin: user.lastLogin ?? null, // brand-new account: never logged in
      permissions: user.permissions || getDefaultAreas(user.role)
    }
    const next = [entry, ...loadUsers()]
    setUsers(next)
    persist(next)
    return entry
  }, [])

  const updateUser = useCallback((id, patch) => {
    const next = loadUsers().map((u) => (u.id === id ? { ...u, ...patch } : u))
    setUsers(next)
    persist(next)
  }, [])

  const deleteUser = useCallback((id) => {
    const next = loadUsers().filter((u) => u.id !== id)
    setUsers(next)
    persist(next)
  }, [])

  const toggleUserStatus = useCallback((id) => {
    const next = loadUsers().map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    )
    setUsers(next)
    persist(next)
  }, [])

  const resetUsers = useCallback(() => {
    setUsers(initialUsers)
    persist(initialUsers)
  }, [])

  return { users, addUser, updateUser, deleteUser, toggleUserStatus, resetUsers }
}

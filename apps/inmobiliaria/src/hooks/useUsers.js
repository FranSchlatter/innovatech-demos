import { useState, useEffect, useCallback } from 'react'
import { mockUsers, FALLBACK_AVATAR } from '../data/admin/mockUsers'

const STORAGE_KEY = 'terranova-users-v1'

// Next sequential id (USR-010, …) based on the current collection.
function nextId(users) {
  const max = users.reduce((acc, u) => {
    const n = parseInt(String(u.id).replace('USR-', ''), 10)
    return Number.isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `USR-${String(max + 1).padStart(3, '0')}`
}

// Guarantee every stored record has the fields the UI relies on (schema-safe
// for demos that persisted an older shape).
function normalize(u) {
  return {
    id: u.id,
    name: u.name || 'Sin nombre',
    email: u.email || '',
    role: u.role || 'agente-junior',
    avatar: u.avatar || FALLBACK_AVATAR,
    status: u.status === 'inactive' ? 'inactive' : 'active',
    lastLogin: u.lastLogin || null,
    permissions: Array.isArray(u.permissions) ? u.permissions : []
  }
}

// System-users store with localStorage persistence.
export function useUsers() {
  const [users, setUsers] = useState(() => mockUsers.map(normalize))

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) setUsers(parsed.map(normalize))
      }
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    } catch (err) {
      console.error('Error saving users:', err)
    }
  }, [users])

  const addUser = useCallback((user) => {
    let created = null
    setUsers((prev) => {
      created = normalize({
        ...user,
        id: nextId(prev),
        lastLogin: null // never logged in yet
      })
      return [created, ...prev]
    })
    return created
  }, [])

  const updateUser = useCallback((id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? normalize({ ...u, ...updates }) : u)))
  }, [])

  const toggleUserStatus = useCallback((id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    )
  }, [])

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const resetUsers = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUsers(mockUsers.map(normalize))
  }, [])

  return { users, addUser, updateUser, toggleUserStatus, deleteUser, resetUsers }
}

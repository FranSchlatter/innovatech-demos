import { useState, useEffect, useCallback, useMemo } from 'react'
import { initialNews, isLive, todayISO } from '../data/mockNews'

// Shared announcement state between the admin (NewsManagement) and the public
// landing (NewsBar). Both surfaces read/write the same localStorage entry, so a
// notice created in the admin appears on the landing without a reload. Demo
// only — no backend. Mirrors the useLiveChat pattern (custom + storage events).
const STORAGE_KEY = 'hotel-news'
// Per-visitor dismissals live in their own key so clearing an announcement on
// the front never mutates the admin-managed content.
const DISMISSED_KEY = 'hotel-news-dismissed'
// Custom event so multiple hook instances in the SAME tab stay in sync (the
// native 'storage' event only fires in OTHER tabs).
const SYNC_EVENT = 'hotel-news-sync'

function loadNews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Corrupt or unavailable storage (private mode) — fall back to seed.
  }
  return initialNews
}

function loadDismissed() {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY)
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

export function useNews() {
  const [news, setNews] = useState(loadNews)
  const [dismissed, setDismissed] = useState(loadDismissed)

  // Keep every mounted instance in sync — same tab (custom event) and across
  // tabs/windows (native storage event).
  useEffect(() => {
    const sync = () => {
      setNews(loadNews())
      setDismissed(loadDismissed())
    }
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // ---- Admin mutations (write fresh state so we never clobber a concurrent edit)
  const addNews = useCallback((item) => {
    const entry = {
      ...item,
      id: item.id || `NEWS-${Date.now()}`,
      enabled: item.enabled ?? true
    }
    const next = [entry, ...loadNews()]
    setNews(next)
    persist(STORAGE_KEY, next)
    return entry
  }, [])

  const updateNews = useCallback((id, patch) => {
    const next = loadNews().map((n) => (n.id === id ? { ...n, ...patch } : n))
    setNews(next)
    persist(STORAGE_KEY, next)
  }, [])

  const deleteNews = useCallback((id) => {
    const next = loadNews().filter((n) => n.id !== id)
    setNews(next)
    persist(STORAGE_KEY, next)
  }, [])

  const toggleNews = useCallback((id) => {
    const next = loadNews().map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    setNews(next)
    persist(STORAGE_KEY, next)
  }, [])

  // ---- Front dismissal (per visitor, keyed by announcement id)
  const dismiss = useCallback((id) => {
    const current = loadDismissed()
    if (current.includes(id)) return
    const next = [...current, id]
    setDismissed(next)
    persist(DISMISSED_KEY, next)
  }, [])

  // Announcements currently live (enabled + inside date window) and not yet
  // dismissed by this visitor — this is what the front bar renders.
  const liveNews = useMemo(() => {
    const today = todayISO()
    return news.filter((n) => isLive(n, today) && !dismissed.includes(n.id))
  }, [news, dismissed])

  return {
    news,
    liveNews,
    addNews,
    updateNews,
    deleteNews,
    toggleNews,
    dismiss
  }
}

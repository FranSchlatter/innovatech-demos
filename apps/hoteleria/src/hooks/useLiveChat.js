import { useState, useEffect, useCallback } from 'react'

// Shared live-chat state between the guest portal (Help > Live Chat) and the
// admin unified inbox (Bandeja IA). Both views read/write the same localStorage
// entry, so a message sent from one surface appears instantly on the other.
// Demo only — no backend. Persistence + cross-view sync via localStorage.
const STORAGE_KEY = 'hotel-live-chat'
// Custom event so multiple hook instances mounted in the SAME tab stay in sync
// (the native 'storage' event only fires in OTHER tabs).
const SYNC_EVENT = 'hotel-live-chat-sync'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        guest: parsed.guest || null,
        messages: Array.isArray(parsed.messages) ? parsed.messages : []
      }
    }
  } catch {
    // Corrupt or unavailable storage (e.g. private mode) — fall back to empty.
  }
  return { guest: null, messages: [] }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors (private mode, quota).
  }
  // Notify other mounted instances within this tab.
  window.dispatchEvent(new Event(SYNC_EVENT))
}

// Read the freshest state synchronously (used outside React render, e.g. inside
// a setTimeout, where hook state would be stale).
export function peekLiveChat() {
  return loadState()
}

export function useLiveChat() {
  const [state, setState] = useState(loadState)

  // Keep every mounted instance in sync — same tab (custom event) and across
  // tabs/windows (native storage event).
  useEffect(() => {
    const sync = () => setState(loadState())
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // from: 'guest' | 'staff' | 'ai'
  const sendMessage = useCallback((text, from = 'guest') => {
    const trimmed = (text || '').trim()
    if (!trimmed) return null
    const message = {
      id: `LC-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      from,
      text: trimmed,
      ts: Date.now()
    }
    // Read fresh state so we never clobber messages the other view wrote since
    // our last render.
    const current = loadState()
    const next = { ...current, messages: [...current.messages, message] }
    setState(next)
    persist(next)
    return message
  }, [])

  const setGuest = useCallback((guest) => {
    const current = loadState()
    if (current.guest && current.guest.name === guest?.name) return
    const next = { ...current, guest: guest || null }
    setState(next)
    persist(next)
  }, [])

  const clearChat = useCallback(() => {
    const next = { guest: loadState().guest, messages: [] }
    setState(next)
    persist(next)
  }, [])

  return {
    guest: state.guest,
    messages: state.messages,
    sendMessage,
    setGuest,
    clearChat
  }
}

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { MARKETS, DEFAULT_MARKET } from './markets'

const DemoContext = createContext(null)
const STORE_KEY = 'dk-demo-v1'

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {}
  } catch {
    return {}
  }
}

function readTourFromUrl() {
  try {
    const q = new URLSearchParams(window.location.search)
    const vertical = q.get('tour')
    const step = parseInt(q.get('step') || '1', 10)
    if (vertical) return { active: true, vertical, step: Number.isFinite(step) ? step : 1 }
  } catch { /* noop */ }
  return { active: false, vertical: null, step: 1 }
}

function writeTourToUrl(tour) {
  try {
    const url = new URL(window.location.href)
    if (tour.active && tour.vertical) {
      url.searchParams.set('tour', tour.vertical)
      url.searchParams.set('step', String(tour.step))
    } else {
      url.searchParams.delete('tour')
      url.searchParams.delete('step')
    }
    window.history.replaceState({}, '', url)
  } catch { /* noop */ }
}

/**
 * DemoProvider — in-memory demo state: market, currency, language, dark/light,
 * guided-tour flag (URL deep-linkable), and a reset button signal.
 * @param {string} defaultMode 'dark' | 'light' — theme default for this app.
 */
export function DemoProvider({ children, market: initialMarket = DEFAULT_MARKET, defaultMode = 'dark' }) {
  const stored = readStore()
  const [marketCode, setMarketCode] = useState(stored.market || initialMarket)
  const market = MARKETS[marketCode] || MARKETS[DEFAULT_MARKET]

  const [currency, setCurrencyRaw] = useState(stored.currency || market.defaultCurrency)
  const [lang, setLang] = useState(stored.lang || market.lang || 'es')
  const [mode, setMode] = useState(stored.mode || defaultMode)
  const [tour, setTour] = useState(readTourFromUrl)
  const [resetSignal, setResetSignal] = useState(0)

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ market: marketCode, currency, lang, mode }))
  }, [marketCode, currency, lang, mode])

  // Keep currency valid for the selected market
  useEffect(() => {
    if (!market.currencies.includes(currency)) setCurrencyRaw(market.defaultCurrency)
  }, [marketCode]) // eslint-disable-line

  useEffect(() => { writeTourToUrl(tour) }, [tour])

  const setCurrency = useCallback((c) => {
    if (market.currencies.includes(c)) setCurrencyRaw(c)
  }, [market])

  const setMarket = useCallback((code) => { if (MARKETS[code]) setMarketCode(code) }, [])
  const toggleMode = useCallback(() => setMode((m) => (m === 'dark' ? 'light' : 'dark')), [])

  const startTour = useCallback((vertical) => setTour({ active: true, vertical, step: 1 }), [])
  const setStep = useCallback((step) => setTour((t) => ({ ...t, step })), [])
  const nextStep = useCallback(() => setTour((t) => ({ ...t, step: t.step + 1 })), [])
  const prevStep = useCallback(() => setTour((t) => ({ ...t, step: Math.max(1, t.step - 1) })), [])
  const exitTour = useCallback(() => setTour({ active: false, vertical: null, step: 1 }), [])

  const reset = useCallback(() => {
    setResetSignal((n) => n + 1)
    exitTour()
  }, [exitTour])

  const value = useMemo(() => ({
    market, marketCode, setMarket,
    currency, setCurrency, fx: market.fx,
    lang, setLang,
    mode, setMode, toggleMode, isDark: mode === 'dark',
    tour, startTour, setStep, nextStep, prevStep, exitTour,
    resetSignal, reset
  }), [market, marketCode, setMarket, currency, setCurrency, lang, mode, toggleMode, tour, startTour, setStep, nextStep, prevStep, exitTour, resetSignal, reset])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within <DemoProvider>')
  return ctx
}

export function useTour() {
  const { tour, startTour, setStep, nextStep, prevStep, exitTour } = useDemo()
  return { ...tour, startTour, setStep, nextStep, prevStep, exitTour }
}

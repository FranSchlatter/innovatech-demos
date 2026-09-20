import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  getCurrency,
  formatMoney,
  convertMoney,
} from '../data/currencies'

// H25 — shared display-currency preference across every guest-facing surface
// (landing navbar, room detail, booking, offers, portal, dining, pool map).
// Mirrors the useNews/useLiveChat pattern: a single localStorage entry kept in
// sync within the tab (custom event) and across tabs (native storage event), so
// picking a currency in the navbar instantly reformats prices in an open portal.
// No Context/provider needed — every component that shows a price just calls
// useCurrency() and re-renders when the shared value changes.
const STORAGE_KEY = 'hotel-currency'
const SYNC_EVENT = 'hotel-currency-sync'

function loadCurrency() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && CURRENCIES.some((c) => c.code === saved)) return saved
  } catch {
    // Corrupt or unavailable storage (private mode) — fall back to the default.
  }
  return DEFAULT_CURRENCY
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState(loadCurrency)

  // Keep every mounted instance in sync — same tab (custom event) and across
  // tabs/windows (native storage event).
  useEffect(() => {
    const sync = () => setCurrencyState(loadCurrency())
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const setCurrency = useCallback((code) => {
    if (!CURRENCIES.some((c) => c.code === code)) return
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // Ignore storage errors (private mode, quota).
    }
    setCurrencyState(code)
    window.dispatchEvent(new Event(SYNC_EVENT))
  }, [])

  // `format` takes a USD-base amount and returns the localized, symbol-prefixed
  // string in the active currency; `convert` returns the raw converted number.
  const format = useCallback((usdAmount) => formatMoney(usdAmount, currency), [currency])
  const convert = useCallback((usdAmount) => convertMoney(usdAmount, currency), [currency])
  const active = useMemo(() => getCurrency(currency), [currency])

  return { currency, active, setCurrency, currencies: CURRENCIES, format, convert }
}

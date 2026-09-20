// H25 — Multi-currency support (mock).
// Every price in the app is authored in USD (the base currency). Each currency
// carries a *mock reference* FX rate relative to USD plus locale-aware grouping,
// so switching currency recomputes every displayed price from the same source of
// truth. Demo only — rates are illustrative, not a live feed.

export const BASE_CURRENCY = 'USD'

// Spanish-first audience, but the hotel quotes in USD, so USD opens by default
// and the guest can flip to ARS/EUR from the navbar (persisted in localStorage).
export const DEFAULT_CURRENCY = 'USD'

// symbol is always rendered as a PREFIX for visual consistency across currencies;
// `locale` only drives the thousands/decimal grouping (Intl decimal style), never
// the symbol, so we never get a duplicate/ambiguous "$" from Intl currency style.
export const CURRENCIES = [
  { code: 'USD', label: 'USD', symbol: 'US$', name: 'US Dollar',       flag: '🇺🇸', rate: 1,    locale: 'en-US', decimals: 0 },
  { code: 'ARS', label: 'ARS', symbol: '$',   name: 'Peso argentino',  flag: '🇦🇷', rate: 1180, locale: 'es-AR', decimals: 0 },
  { code: 'EUR', label: 'EUR', symbol: '€',   name: 'Euro',            flag: '🇪🇺', rate: 0.92, locale: 'de-DE', decimals: 0 },
]

// Resolve a currency descriptor by code, falling back to the base currency so
// callers never crash on a stale/unknown persisted value.
export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0]
}

// Convert a USD-base amount into the target currency's raw numeric value.
export function convertMoney(usdAmount, code = BASE_CURRENCY) {
  const cur = getCurrency(code)
  return (Number(usdAmount) || 0) * cur.rate
}

// Format a USD-base amount for display in the target currency:
// convert → round to the currency's precision → group by locale → prefix symbol.
export function formatMoney(usdAmount, code = BASE_CURRENCY) {
  const cur = getCurrency(code)
  const converted = (Number(usdAmount) || 0) * cur.rate
  const factor = 10 ** cur.decimals
  const rounded = Math.round(converted * factor) / factor
  const number = new Intl.NumberFormat(cur.locale, {
    minimumFractionDigits: cur.decimals,
    maximumFractionDigits: cur.decimals,
  }).format(rounded)
  return `${cur.symbol}${number}`
}

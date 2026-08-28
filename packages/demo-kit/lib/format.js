/* Formatting helpers. Multi-currency without fake totals (§4.3):
   groupByCurrency() keeps each currency separate; convert() is explicit + dated. */

const SYMBOLS = { ARS: '$', USD: 'US$', UYU: '$U', EUR: '€' }

export function formatMoney(amount, currency = 'ARS', locale = 'es-AR', opts = {}) {
  const { compact = false, decimals } = opts
  const sym = SYMBOLS[currency] || currency + ' '
  const n = Number(amount || 0)
  const nf = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 0,
    notation: compact && Math.abs(n) >= 10000 ? 'compact' : 'standard'
  })
  return `${sym}${nf.format(n)}`
}

export function formatNumber(n, locale = 'es-AR', opts = {}) {
  return new Intl.NumberFormat(locale, opts).format(Number(n || 0))
}

export function formatPercent(n, locale = 'es-AR', decimals = 1) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(Number(n || 0) / 100)
}

export function formatDate(iso, locale = 'es-AR', opts = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(locale, opts).format(new Date(iso))
  } catch {
    return String(iso)
  }
}

export function timeAgo(iso, now = new Date('2026-08-27T12:00:00')) {
  if (!iso) return ''
  const diff = now - new Date(iso)
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  return `hace ${days} d`
}

/* Group amounts by currency — the honest way to total multi-currency data. */
export function groupByCurrency(items, amountKey = 'amount', currencyKey = 'currency') {
  return items.reduce((acc, it) => {
    const c = it[currencyKey] || 'ARS'
    acc[c] = (acc[c] || 0) + Number(it[amountKey] || 0)
    return acc
  }, {})
}

/* Explicit, dated conversion — only when the user asks for it. */
export function convert(amount, from, to, fx, date = '2026-08-27') {
  if (from === to) return { amount, note: null }
  const inUsd = amount / (from === 'USD' ? 1 : fx[from] ?? 1) // fx is units-per-USD-ish; demo simplification
  const out = to === 'USD' ? inUsd : inUsd * (fx[to] ?? 1)
  return { amount: out, note: `TC ${from}→${to} · ${date}` }
}

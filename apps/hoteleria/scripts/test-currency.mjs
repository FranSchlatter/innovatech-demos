// Logic test for the H25 multi-currency support.
// Run: node apps/hoteleria/scripts/test-currency.mjs
import {
  CURRENCIES, BASE_CURRENCY, DEFAULT_CURRENCY,
  getCurrency, convertMoney, formatMoney,
} from '../src/data/currencies.js'

let passed = 0
let failed = 0
function check(name, cond) {
  if (cond) { passed++; console.log(`  ✓ ${name}`) }
  else { failed++; console.error(`  ✗ ${name}`) }
}

// --- Config integrity -------------------------------------------------------
console.log('Config integrity')
check('has 3 currencies', CURRENCIES.length === 3)
check('codes are USD/ARS/EUR', CURRENCIES.map((c) => c.code).join(',') === 'USD,ARS,EUR')
check('all codes unique', new Set(CURRENCIES.map((c) => c.code)).size === CURRENCIES.length)
check('base currency is USD', BASE_CURRENCY === 'USD')
check('default currency is a known code', CURRENCIES.some((c) => c.code === DEFAULT_CURRENCY))
check('every currency has required fields', CURRENCIES.every((c) =>
  c.code && c.label && c.symbol && c.name && typeof c.rate === 'number' && c.locale && typeof c.decimals === 'number'))
check('USD rate is exactly 1 (base)', getCurrency('USD').rate === 1)
check('all rates are positive', CURRENCIES.every((c) => c.rate > 0))

// --- getCurrency ------------------------------------------------------------
console.log('\ngetCurrency')
check('resolves a known code', getCurrency('EUR').code === 'EUR')
check('unknown code falls back to base', getCurrency('XYZ').code === BASE_CURRENCY)
check('undefined falls back to base', getCurrency(undefined).code === BASE_CURRENCY)

// --- convertMoney -----------------------------------------------------------
console.log('\nconvertMoney')
check('USD → USD is identity', convertMoney(189, 'USD') === 189)
check('ARS applies its rate', convertMoney(100, 'ARS') === 100 * getCurrency('ARS').rate)
check('EUR applies its rate', convertMoney(100, 'EUR') === 100 * getCurrency('EUR').rate)
check('zero stays zero', convertMoney(0, 'ARS') === 0)
check('non-numeric → 0', convertMoney(undefined, 'EUR') === 0 && convertMoney(null, 'ARS') === 0)
check('no code defaults to base (identity)', convertMoney(250) === 250)

// --- formatMoney ------------------------------------------------------------
console.log('\nformatMoney')
const usd = formatMoney(189, 'USD')
check('USD is symbol-prefixed', usd.startsWith('US$'))
check('USD 189 → US$189 (0 decimals)', usd === 'US$189')
check('EUR uses € prefix', formatMoney(100, 'EUR').startsWith('€'))
check('ARS uses $ prefix', formatMoney(100, 'ARS').startsWith('$') && !formatMoney(100, 'ARS').startsWith('US$'))
check('rounds to whole units (no cents shown)', !formatMoney(173.88, 'EUR').includes(','.replace(',', '.')) || /^€\d+$/.test(formatMoney(173.88, 'EUR')))
check('EUR 189 rounds 173.88 → €174', formatMoney(189, 'EUR') === `€${Math.round(189 * getCurrency('EUR').rate)}`)
check('large ARS amount is grouped', /\d[.,]\d{3}/.test(formatMoney(1000, 'ARS')))
check('zero formats cleanly', formatMoney(0, 'USD') === 'US$0')
check('non-numeric formats as zero', formatMoney(undefined, 'ARS') === formatMoney(0, 'ARS'))
check('no code defaults to base symbol', formatMoney(50).startsWith('US$'))

// --- Determinism ------------------------------------------------------------
console.log('\nDeterminism')
check('formatMoney is stable across calls', formatMoney(1234.56, 'ARS') === formatMoney(1234.56, 'ARS'))
check('convertMoney is stable across calls', convertMoney(1234.56, 'EUR') === convertMoney(1234.56, 'EUR'))
check('higher rate → larger converted value (USD<EUR? depends) ARS>USD', convertMoney(100, 'ARS') > convertMoney(100, 'USD'))

// --- Consistency: format == symbol + grouped(convert) -----------------------
console.log('\nConsistency')
check('format equals symbol + rounded-converted for every currency', CURRENCIES.every((c) => {
  const amount = 1500
  const rounded = Math.round(convertMoney(amount, c.code))
  const grouped = new Intl.NumberFormat(c.locale, { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals }).format(rounded)
  return formatMoney(amount, c.code) === `${c.symbol}${grouped}`
}))

// --- summary ----------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)

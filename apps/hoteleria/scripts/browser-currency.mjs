import { chromium } from 'playwright-core'

// H25 — real-browser smoke test for the currency switcher.
// Run the dev server first, then: URL=http://localhost:3001/ node apps/hoteleria/scripts/browser-currency.mjs
const URL = process.env.URL || 'http://localhost:3001/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const results = []
const check = (name, cond, extra = '') => { results.push({ name, ok: !!cond, extra }); console.log(`${cond ? '✓' : '✗'} ${name}${extra ? ' — ' + extra : ''}`) }

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(700)

const bodyText = () => page.evaluate(() => document.body.innerText)
const storedCur = () => page.evaluate(() => localStorage.getItem('hotel-currency'))
// Scope price scanning to the Accommodation section so we assert on real prices.
const accommodationText = () => page.evaluate(() => {
  const el = document.getElementById('accommodation')
  return el ? el.innerText : ''
})

// --- Default currency: USD (prices show US$) ---
let acc = await accommodationText()
check('currency toggle present (USD/ARS/EUR)',
  (await page.getByRole('button', { name: 'USD', exact: true }).count()) > 0 &&
  (await page.getByRole('button', { name: 'ARS', exact: true }).count()) > 0 &&
  (await page.getByRole('button', { name: 'EUR', exact: true }).count()) > 0)
check('default shows USD prices (US$)', /US\$\d/.test(acc), (acc.match(/US\$[\d.,]+/) || [''])[0])

// --- Switch to ARS ---
await page.getByRole('button', { name: 'ARS', exact: true }).first().click()
await page.waitForTimeout(400)
acc = await accommodationText()
check('stored hotel-currency = ARS', (await storedCur()) === 'ARS', await storedCur())
check('ARS prices are grouped (thousands)', /\$\d{1,3}[.,]\d{3}/.test(acc), (acc.match(/\$[\d.,]+/) || [''])[0])
check('no more US$ after switching to ARS', !/US\$/.test(acc))

// --- Switch to EUR ---
await page.getByRole('button', { name: 'EUR', exact: true }).first().click()
await page.waitForTimeout(400)
acc = await accommodationText()
check('stored hotel-currency = EUR', (await storedCur()) === 'EUR', await storedCur())
check('EUR prices use € symbol', /€\d/.test(acc), (acc.match(/€[\d.,]+/) || [''])[0])

// --- Reload persists EUR ---
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(600)
check('EUR persists after reload', (await storedCur()) === 'EUR', await storedCur())
acc = await accommodationText()
check('prices still € after reload', /€\d/.test(acc))

// --- Guest Portal billing reflects the chosen currency ---
await page.getByRole('link', { name: /Portal|Guest Portal|Portal del/i }).first().click().catch(() => {})
await page.waitForTimeout(500)
const emailInput = page.locator('input[type="email"]').first()
if (await emailInput.count()) await emailInput.fill('demo@demo.com')
const pass = page.locator('input[type="password"]').first()
if (await pass.count()) await pass.fill('demo1234')
await page.getByRole('button', { name: /Iniciar|Ingresar|Entrar|Sign in|Log/i }).first().click().catch(() => {})
await page.waitForTimeout(900)
let portalTxt = await bodyText()
check('portal billing uses € (persisted currency)', /€\d/.test(portalTxt), (portalTxt.match(/€[\d.,]+/) || [''])[0])
check('portal has its own currency switch', (await page.getByRole('button', { name: 'USD', exact: true }).count()) > 0)

// --- Switch portal back to USD, billing recomputes ---
await page.getByRole('button', { name: 'USD', exact: true }).first().click().catch(() => {})
await page.waitForTimeout(400)
portalTxt = await bodyText()
check('portal billing recomputes to US$', /US\$\d/.test(portalTxt), (portalTxt.match(/US\$[\d.,]+/) || [''])[0])
check('stored currency now USD', (await storedCur()) === 'USD', await storedCur())

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log(`\nConsole errors: ${errors.length}`)
errors.slice(0, 12).forEach((e) => console.log('  ! ' + e))
console.log(`\n${failed.length === 0 && errors.length === 0 ? '✅ BROWSER TEST PASSED' : '❌ ISSUES: ' + failed.length + ' checks failed, ' + errors.length + ' console errors'}`)
process.exit(failed.length === 0 && errors.length === 0 ? 0 : 1)

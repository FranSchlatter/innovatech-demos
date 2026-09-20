import { chromium } from 'playwright-core'

const URL = process.env.SMOKE_URL || 'http://localhost:3004'
const errors = []
let browser

const log = (...a) => console.log(...a)
const assert = (cond, msg) => {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg)
  log('  ✓', msg)
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } })
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

  await page.goto(URL, { waitUntil: 'networkidle' })
  log('Loaded', URL)

  // Open first property detail via "Ver detalle"
  await page.getByRole('button', { name: 'Ver detalle' }).first().click()
  await page.waitForTimeout(700)

  // Section present
  const nearby = page.getByRole('heading', { name: 'Qué hay cerca' })
  await nearby.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  assert(await nearby.isVisible(), 'section "Qué hay cerca" visible')

  // Score badge: "/ 10" present and a numeric score
  assert(await page.getByText('/ 10').first().isVisible(), 'score badge (/ 10) visible')
  const scoreLabels = ['Ubicación excelente', 'Muy buena ubicación', 'Buena ubicación', 'Ubicación tranquila']
  let labelFound = false
  for (const l of scoreLabels) {
    if (await page.getByText(l).first().isVisible().catch(() => false)) {
      labelFound = true
      log('    score label:', l)
      break
    }
  }
  assert(labelFound, 'score qualitative label visible')

  // "N lugares cerca · M categorías" caption
  assert(await page.getByText(/lugares cerca/).first().isVisible(), 'nearby count caption visible')

  // Category headers — expect all 5 categories to be present for a Palermo prop
  const cats = ['Educación', 'Salud', 'Transporte', 'Comercio', 'Recreación']
  let catCount = 0
  for (const c of cats) {
    if (await page.getByRole('heading', { name: c, exact: true }).first().isVisible().catch(() => false)) catCount++
  }
  assert(catCount >= 4, `at least 4 POI categories rendered (found ${catCount})`)

  // POI cards contain distance (m or km) + travel time (min)
  assert(await page.getByText(/\d+\s*m$/).first().isVisible().catch(() => false) ||
         await page.getByText(/km$/).first().isVisible().catch(() => false), 'distance labels visible')
  assert(await page.getByText(/\d+ min$/).first().isVisible(), 'travel time labels visible')

  const themeOf = () => page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light')
  const mode1 = await themeOf()
  await nearby.scrollIntoViewIfNeeded()
  await page.screenshot({ path: `scripts/pois-${mode1}-section.png` })
  log('    initial theme:', mode1)

  // Toggle theme (navbar button holds a Moon/Sun lucide icon, no aria-label)
  await page.locator('button:has(svg.lucide-moon), button:has(svg.lucide-sun)').first().click()
  await page.waitForTimeout(500)
  const mode2 = await themeOf()
  assert(mode2 !== mode1, `theme toggled (${mode1} -> ${mode2})`)
  await nearby.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  assert(await nearby.isVisible(), `section still visible in ${mode2} mode`)
  assert(await page.getByText('/ 10').first().isVisible(), `score badge visible in ${mode2} mode`)
  await page.screenshot({ path: `scripts/pois-${mode2}-section.png` })

  // Mobile viewport — single column should still render
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(300)
  await nearby.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  assert(await nearby.isVisible(), 'section renders on mobile viewport')
  await page.screenshot({ path: 'scripts/pois-mobile.png' })

  log('\nConsole errors:', errors.length)
  errors.forEach((e) => log('  !', e))
  if (errors.length) throw new Error(`${errors.length} console error(s)`)
  log('\nSMOKE PASS ✓')
} catch (e) {
  console.error('\nSMOKE FAIL:', e.message)
  errors.forEach((x) => console.error('  !', x))
  process.exitCode = 1
} finally {
  if (browser) await browser.close()
}

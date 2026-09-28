import { chromium } from 'playwright-core'

const BASE = process.env.SMOKE_URL || 'http://localhost:3004'
const errors = []
let browser

const log = (...a) => console.log(...a)
const assert = (cond, msg) => {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg)
  log('  ✓', msg)
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

  // --- 1. Isolated embed preview: only the widget, no shell ---
  await page.goto(`${BASE}/?embed=mortgage-calculator&theme=dark`, { waitUntil: 'networkidle' })
  log('Loaded embed mortgage-calculator')
  assert(await page.getByRole('heading', { name: 'Simulá tu crédito hipotecario' }).isVisible(), 'mortgage widget renders in embed')
  assert(await page.locator('nav').count() === 0, 'no navbar in embed mode')
  assert(await page.getByText('Villa Serena').count() === 0 && await page.locator('footer').count() === 0, 'no footer/brand shell in embed mode')
  assert(await page.evaluate(() => document.documentElement.getAttribute('data-theme')) === 'dark', 'embed honored ?theme=dark')
  await page.screenshot({ path: 'scripts/embed-mortgage-dark.png', fullPage: false })

  // theme=light param respected
  await page.goto(`${BASE}/?embed=mortgage-calculator&theme=light`, { waitUntil: 'networkidle' })
  assert(await page.evaluate(() => document.documentElement.getAttribute('data-theme')) !== 'dark', 'embed honored ?theme=light')
  await page.screenshot({ path: 'scripts/embed-mortgage-light.png' })

  // --- 2. Every other embeddable feature renders with no shell and no crash ---
  for (const id of ['property-valuation', 'nearby-places', 'adjustment-simulator']) {
    await page.goto(`${BASE}/?embed=${id}&theme=dark`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    log('Loaded embed', id)
    assert(await page.locator('nav').count() === 0, `${id} embed has no navbar`)
    assert(await page.getByText('Feature no disponible').count() === 0, `${id} resolved to a real widget`)
    await page.screenshot({ path: `scripts/embed-${id}-dark.png` })
  }

  // --- 3. Unknown id → graceful fallback message, not a crash ---
  await page.goto(`${BASE}/?embed=does-not-exist`, { waitUntil: 'networkidle' })
  assert(await page.getByText('Feature no disponible').isVisible(), 'unknown embed id shows fallback')

  // --- 4. Deep-link "ver en vivo": full demo WITH shell, scrolled to the feature ---
  await page.goto(`${BASE}/?feature=mortgage-calculator`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  log('Loaded live deep-link ?feature=mortgage-calculator')
  assert(await page.locator('nav').count() > 0, 'full demo shell present on deep-link')
  assert(await page.getByRole('heading', { name: 'Simulá tu crédito hipotecario' }).isVisible(), 'deep-link scrolled to the calculator')
  await page.screenshot({ path: 'scripts/embed-live-deeplink.png' })

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

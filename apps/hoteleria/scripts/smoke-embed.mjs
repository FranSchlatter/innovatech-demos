import { chromium } from 'playwright-core'

const BASE = process.env.SMOKE_URL || 'http://localhost:3001'
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

  // --- Every embeddable feature renders isolated (no shell) and doesn't crash ---
  for (const id of ['events-calendar', 'guest-services', 'beach-pool-map']) {
    await page.goto(`${BASE}/?embed=${id}&theme=dark`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    log('Loaded embed', id)
    assert(await page.locator('nav').count() === 0, `${id} embed has no navbar`)
    assert(await page.locator('footer').count() === 0, `${id} embed has no footer`)
    assert(await page.getByText('Feature no disponible').count() === 0, `${id} resolved to a real widget`)
    assert(await page.evaluate(() => document.documentElement.getAttribute('data-theme')) === 'dark', `${id} honored ?theme=dark`)
    await page.screenshot({ path: `scripts/embed-${id}-dark.png` })
  }

  // --- Unknown id → graceful fallback, not a crash ---
  await page.goto(`${BASE}/?embed=nope`, { waitUntil: 'networkidle' })
  assert(await page.getByText('Feature no disponible').isVisible(), 'unknown embed id shows fallback')

  // --- Deep-link "ver en vivo": full demo shell, scrolled to the section ---
  await page.goto(`${BASE}/?feature=events-calendar`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  assert(await page.locator('nav').count() > 0, 'full demo shell present on deep-link')
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

import { chromium } from 'playwright-core'

// Landing marketplace page. Demos must be running on 3001/3004 for iframes to load.
const BASE = process.env.SMOKE_URL || 'http://localhost:3000'
const errors = []
let browser

const log = (...a) => console.log(...a)
const assert = (cond, msg) => {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg)
  log('  ✓', msg)
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 950 } })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

  await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })
  log('Loaded /marketplace')

  assert(await page.getByRole('heading', { name: /Probá cada funcionalidad/ }).isVisible(), 'hero heading visible')

  // Feature cards
  const addButtons = page.getByRole('button', { name: 'Agregar' })
  const cardCount = await addButtons.count()
  assert(cardCount >= 6, `feature cards rendered (found ${cardCount})`)

  // Curated packs
  assert(await page.getByRole('heading', { name: 'Packs listos para arrancar' }).isVisible(), 'curated packs section visible')

  await page.screenshot({ path: 'scripts/marketplace-catalog.png', fullPage: false })

  // Add to pack → floating bar appears with a count
  await addButtons.first().click()
  await page.waitForTimeout(300)
  assert(await page.getByRole('button', { name: /Mi pack/ }).isVisible(), 'pack bar appears after adding')

  // Filter by rubro
  await page.getByRole('button', { name: 'Inmobiliaria' }).first().click()
  await page.waitForTimeout(300)
  assert(await page.getByRole('button', { name: 'Todos los rubros' }).isVisible(), 'rubro filters interactive')

  // Open a preview modal → the embed iframe mounts
  await page.getByRole('button', { name: 'Probar' }).first().click()
  await page.waitForTimeout(1500)
  const iframe = page.locator('iframe[title^="Preview:"]')
  assert(await iframe.count() === 1, 'preview iframe mounted')
  const src = await iframe.getAttribute('src')
  assert(/\?embed=/.test(src), `iframe points at an embed URL (${src})`)
  await page.screenshot({ path: 'scripts/marketplace-preview.png', fullPage: false })

  // Open pack drawer → budget CTA present
  await page.keyboard.press('Escape').catch(() => {})
  await page.getByRole('button', { name: /Mi pack/ }).first().click()
  await page.waitForTimeout(400)
  assert(await page.getByRole('button', { name: /Pedir presupuesto/ }).isVisible(), 'budget CTA in pack drawer')
  await page.screenshot({ path: 'scripts/marketplace-pack.png', fullPage: false })
  await page.keyboard.press('Escape').catch(() => {})
  await page.mouse.click(10, 10)
  await page.waitForTimeout(300)

  // --- Assistant chat (retrieval) ---
  await page.getByRole('button', { name: /asistente/i }).first().click()
  await page.waitForTimeout(400)
  assert(await page.getByText(/Soy el asistente del catálogo/).isVisible(), 'assistant greeting shows')

  await page.getByPlaceholder('Escribí qué necesitás…').fill('quiero una calculadora de créditos hipotecarios')
  await page.getByRole('button', { name: 'Enviar' }).click()
  await page.waitForTimeout(1600)
  // The reply recommends the mortgage calculator as a card inside the chat
  assert(await page.getByText(/Para eso te sirve/).isVisible(), 'assistant replied with a match')
  const recommend = page.locator('p.font-semibold', { hasText: 'Calculadora hipotecaria' })
  assert(await recommend.count() >= 1, 'assistant recommended the mortgage calculator')
  await page.screenshot({ path: 'scripts/marketplace-assistant.png', fullPage: false })

  // Unmatched query → graceful fallback, no crash
  await page.getByPlaceholder('Escribí qué necesitás…').fill('xyzzy no existe esto')
  await page.getByRole('button', { name: 'Enviar' }).click()
  await page.waitForTimeout(1400)
  assert(await page.getByText(/No encontré una funcionalidad exacta/).isVisible(), 'assistant handles no-match gracefully')

  log('\nConsole errors:', errors.length)
  errors.forEach((e) => log('  !', e))
  // iframe cross-origin dev noise is tolerated; only fail on real page errors
  const real = errors.filter((e) => !/favicon|Failed to load resource/.test(e))
  if (real.length) throw new Error(`${real.length} console error(s)`)
  log('\nSMOKE PASS ✓')
} catch (e) {
  console.error('\nSMOKE FAIL:', e.message)
  errors.forEach((x) => console.error('  !', x))
  process.exitCode = 1
} finally {
  if (browser) await browser.close()
}

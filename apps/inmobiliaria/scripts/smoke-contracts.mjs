import { chromium } from 'playwright-core'

const URL = process.env.SMOKE_URL || 'http://localhost:4180'
const errors = []
let browser

const log = (...a) => console.log(...a)
const assert = (cond, msg) => { if (!cond) { throw new Error('ASSERT FAILED: ' + msg) } log('  ✓', msg) }

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newContext({ viewport: { width: 1400, height: 900 } }).then((c) => c.newPage())
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

  await page.goto(URL, { waitUntil: 'networkidle' })
  log('Loaded', URL)

  // Enter admin (nav item is a link)
  await page.getByText('Admin', { exact: true }).first().click()
  await page.waitForTimeout(600)

  // Navigate to Contratos
  await page.getByRole('button', { name: 'Contratos' }).first().click()
  await page.waitForTimeout(600)

  assert(await page.getByText('Contratos de locación').first().isVisible(), 'header visible')
  assert(await page.getByText('Por vencer', { exact: false }).first().isVisible(), 'expiry banner / status present')

  // Table rows: count contract id cells
  const rowCount = await page.locator('table tbody tr').count()
  assert(rowCount >= 8, `table has ${rowCount} rows (>=8)`)

  // KPI cards
  assert(await page.getByText('Vigentes').first().isVisible(), 'KPI Vigentes visible')
  assert(await page.getByText('Renta mensual').first().isVisible(), 'KPI Renta mensual visible')

  // Filter by estado = Vencido
  await page.locator('select').filter({ hasText: 'Estado: todos' }).selectOption('expired')
  await page.waitForTimeout(300)
  const expiredRows = await page.locator('table tbody tr').count()
  assert(expiredRows === 1, `estado=Vencido filters to ${expiredRows} row (expected 1)`)
  await page.locator('select').filter({ hasText: 'Estado: todos' }).selectOption('all')
  await page.waitForTimeout(200)

  // Open a detail modal (first row)
  await page.locator('table tbody tr').first().click()
  await page.waitForTimeout(500)
  assert(await page.getByText('Cláusulas del contrato').first().isVisible(), 'detail: clauses section')
  assert(await page.getByText('Historial de ajustes', { exact: false }).first().isVisible(), 'detail: adjustment history')
  assert(await page.getByText('Documentos asociados').first().isVisible(), 'detail: documents')
  assert(await page.getByRole('button', { name: 'Renovar' }).last().isVisible(), 'detail: Renovar button')

  // Open Renovar sub-modal (footer button is last in DOM, after the banner ones)
  await page.getByRole('button', { name: 'Renovar' }).last().click()
  await page.waitForTimeout(400)
  assert(await page.getByText('Nuevo vencimiento').first().isVisible(), 'renew modal: nuevo vencimiento')
  await page.getByRole('button', { name: 'Cancelar' }).first().click()
  await page.waitForTimeout(300)

  // Close detail (Escape)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)

  // New contract modal opens
  await page.getByRole('button', { name: 'Nuevo contrato' }).first().click()
  await page.waitForTimeout(500)
  assert(await page.getByText('Propiedad en cartera', { exact: false }).first().isVisible(), 'new contract modal opens')
  assert(await page.getByText('Alquiler base (mes 1)', { exact: false }).first().isVisible(), 'new contract: rent field')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)

  // Switch to simulator tab
  await page.getByRole('button', { name: 'Simulador de ajuste' }).first().click()
  await page.waitForTimeout(500)
  assert(await page.getByText('Simulador de ajuste de alquiler').first().isVisible(), 'simulator tab renders')

  // Dark mode toggle (theme button in header)
  await page.getByRole('button', { name: 'Cambiar tema' }).first().click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'Contratos vigentes' }).first().click()
  await page.waitForTimeout(400)
  assert(await page.locator('table tbody tr').count() >= 8, 'table still renders in dark mode')

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

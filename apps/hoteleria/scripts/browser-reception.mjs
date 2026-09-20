import { chromium } from 'playwright-core'

// H26 — real-browser smoke test for the Reception module + shared check-in
// station. Run the dev server first, then:
//   URL=http://localhost:3001/ node apps/hoteleria/scripts/browser-reception.mjs
const URL = process.env.URL || 'http://localhost:3001/'
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const results = []
const check = (name, cond, extra = '') => {
  results.push({ name, ok: !!cond })
  console.log(`${cond ? '✓' : '✗'} ${name}${extra ? ' — ' + extra : ''}`)
}

// Raw i18n keys leaking into the UI would look like "station.documents.title".
const RAW_KEY = /\b(station|admin\.reception|admin\.calendar|portal|common)\.[a-z][a-zA-Z]+\.[a-zA-Z]/

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage({ viewport: { width: 1360, height: 900 } })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

const bodyText = () => page.evaluate(() => document.body.innerText)
const clickFirst = async (re) => { try { await page.getByRole('button', { name: re }).first().click({ timeout: 4000 }); return true } catch { return false } }

// Ensure a clean store before we start.
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => { localStorage.removeItem('hotel-reservations') })

// --- A. Landing loads clean ------------------------------------------------
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(700)
check('landing renders', (await bodyText()).length > 100)
check('admin entry present', (await page.getByRole('link', { name: /^Admin$/i }).count()) > 0)

// --- B. Admin → Reception --------------------------------------------------
await page.getByRole('link', { name: /^Admin$/i }).first().click()
await page.waitForTimeout(600)
await clickFirst(/^Recepción$/)
await page.waitForTimeout(500)
let txt = await bodyText()
check('reception title renders', /Recepci/.test(txt))
check('reception KPIs render', /Llegadas hoy/.test(txt) && /En casa/.test(txt))
check('reception lists the portal guest (arrival)', /Carlos Rodriguez/.test(txt))
check('reception has no raw i18n keys', !RAW_KEY.test(txt), (txt.match(RAW_KEY) || [''])[0])

// --- C. Open the check-in station (reception mode) -------------------------
await clickFirst(/Check-in/)
await page.waitForTimeout(500)
let dialog = await page.evaluate(() => document.querySelector('[role="dialog"]')?.innerText || '')
check('station opens (identify step)', /Confirmar la reserva|Reserva/.test(dialog))
check('station shows step rail', /Documentos/.test(dialog) && /Firma/.test(dialog))
check('station has no raw i18n keys', !RAW_KEY.test(dialog), (dialog.match(RAW_KEY) || [''])[0])
// advance one step to confirm the flow moves
await clickFirst(/Continuar/)
await page.waitForTimeout(400)
dialog = await page.evaluate(() => document.querySelector('[role="dialog"]')?.innerText || '')
check('station advances to documents', /Documento de identidad|Número/.test(dialog))
await clickFirst(/^Cerrar$/) // close the modal
await page.waitForTimeout(300)

// --- D. Reception check-OUT reflects in the store + KPIs -------------------
await clickFirst(/En casa/) // inhouse filter (button carries a count badge)
await page.waitForTimeout(400)
const outBefore = await page.getByRole('button', { name: /Check-out/ }).count()
check('there are in-house reservations to check out', outBefore > 0, `count=${outBefore}`)
if (outBefore > 0) {
  await page.getByRole('button', { name: /Check-out/ }).first().click()
  await page.waitForTimeout(500)
  const outAfter = await page.getByRole('button', { name: /Check-out/ }).count()
  check('check-out removes a row from in-house', outAfter === outBefore - 1, `before=${outBefore} after=${outAfter}`)
  const persisted = await page.evaluate(() => {
    try {
      const d = JSON.parse(localStorage.getItem('hotel-reservations') || '{}')
      return Object.values(d.overrides || {}).some((o) => o.status === 'checked-out')
    } catch { return false }
  })
  check('check-out persisted to unified store', persisted)
}

// --- E. Dashboard + Calendar render clean ----------------------------------
await clickFirst(/^Dashboard$/)
await page.waitForTimeout(500)
txt = await bodyText()
check('dashboard renders (occupancy)', /Ocupaci/.test(txt))
check('dashboard no raw keys', !RAW_KEY.test(txt), (txt.match(RAW_KEY) || [''])[0])
await clickFirst(/^Calendario$/)
await page.waitForTimeout(500)
txt = await bodyText()
check('calendar renders (tape chart)', /Ocupaci|Hab\./.test(txt))
check('calendar no raw keys', !RAW_KEY.test(txt), (txt.match(RAW_KEY) || [''])[0])

// --- F. Reception SEES the guest's online pre-check-in progress ------------
// Seed a partial station (as if the guest advanced online) for the portal guest.
await page.evaluate(() => {
  const d = JSON.parse(localStorage.getItem('hotel-reservations') || '{"overrides":{},"extras":[]}')
  d.overrides = d.overrides || {}
  d.overrides['RES-2024-5678'] = {
    station: {
      documentNumber: 'AA-4521887', nationality: 'Argentina', birthDate: '1990-05-10',
      documentPhoto: 'data:image/png;base64,iVBORw0KGgo=',
      completedSteps: ['documents'], lastUpdatedBy: 'guest', lastUpdatedAt: '2026-09-20T10:00:00Z',
    },
  }
  localStorage.setItem('hotel-reservations', JSON.stringify(d))
})
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(500)
await page.getByRole('link', { name: /^Admin$/i }).first().click().catch(() => {})
await page.waitForTimeout(500)
await clickFirst(/^Recepción$/)
await page.waitForTimeout(500)
txt = await bodyText()
check('reception shows guest pre-check-in progress', /Pre-check-in/.test(txt))
check('reception offers to resume the check-in', /Continuar check-in/.test(txt))

// --- G. Guest Portal opens the SAME station in guest mode -------------------
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(600)
await page.getByRole('link', { name: /Portal/i }).first().click().catch(() => {})
await page.waitForTimeout(600)
// The login form has required email/password fields — fill them (any value works, demo).
await page.fill('input[type="email"]', 'demo@guest.com').catch(() => {})
await page.fill('input[type="password"]', 'demo1234').catch(() => {})
await clickFirst(/Iniciar|Ingresar|Entrar|Sign|Acceder|Continuar/)
await page.waitForTimeout(900)
txt = await bodyText()
check('portal overview renders', /Mi estadía|My Stay|Carlos/.test(txt))
const opened = await clickFirst(/Check-?in/i)
await page.waitForTimeout(500)
dialog = await page.evaluate(() => document.querySelector('[role="dialog"]')?.innerText || '')
check('portal opens shared station (guest mode)', opened && /Documento de identidad|Check-in online/.test(dialog))
check('portal station skips reception-only identify step', !/Confirmar la reserva/.test(dialog))
check('portal station has no raw keys', !RAW_KEY.test(dialog), (dialog.match(RAW_KEY) || [''])[0])

// --- summary ---------------------------------------------------------------
check('no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '))
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (errors.length) { console.log('\nConsole errors:'); errors.slice(0, 8).forEach((e) => console.log('  - ' + e)) }
await browser.close()
process.exit(failed.length ? 1 : 0)

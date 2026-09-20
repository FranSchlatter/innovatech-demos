import { chromium } from 'playwright-core'

const URL = process.env.URL || 'http://localhost:3010/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const results = []
const check = (name, cond, extra = '') => { results.push({ name, ok: !!cond, extra }); console.log(`${cond ? '✓' : '✗'} ${name}${extra ? ' — ' + extra : ''}`) }

// A real leftover key surfaces as a full dotted path (>=2 segments after the
// namespace), e.g. "portal.header.welcome". A sentence ending in "portal."
// has nothing after the dot, so require a second dotted segment.
const RAW_KEY = /\b(landing|portal|client|admin|common|nav)\.[a-zA-Z]+\.[a-zA-Z]/
const rawKeyHit = (txt) => (txt.match(RAW_KEY) || [''])[0]

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(700)

const bodyText = () => page.evaluate(() => document.body.innerText)
const lang = () => page.evaluate(() => document.documentElement.getAttribute('lang'))
const storedLang = () => page.evaluate(() => localStorage.getItem('hotel-language'))

// --- Default should be Spanish ---
let txt = await bodyText()
check('default lang attribute is es', (await lang()) === 'es', await lang())
check('landing shows Spanish nav (Inicio/Habitaciones)', /Inicio/.test(txt) && /Habitaciones/.test(txt))
check('hero heading Spanish (Elegancia Atemporal)', /Elegancia Atemporal/.test(txt))
check('no raw i18n keys on landing (ES)', !RAW_KEY.test(txt), rawKeyHit(txt))

// --- Toggle to EN ---
await page.getByRole('button', { name: 'EN', exact: true }).first().click()
await page.waitForTimeout(400)
txt = await bodyText()
check('after EN toggle, lang attr is en', (await lang()) === 'en', await lang())
check('stored hotel-language = en', (await storedLang()) === 'en', await storedLang())
check('landing English nav (Home/Accommodation)', /Home/.test(txt) && /Accommodation/.test(txt))
check('hero heading English (Timeless Elegance)', /Timeless Elegance/.test(txt))
check('no raw i18n keys on landing (EN)', !RAW_KEY.test(txt), rawKeyHit(txt))

// --- Reload persists EN ---
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(500)
check('EN persists after reload', (await lang()) === 'en', await lang())

// --- Guest Portal (login) ---
await page.getByRole('link', { name: /Guest Portal/i }).first().click()
await page.waitForTimeout(500)
txt = await bodyText()
check('portal login language switch present', (await page.getByRole('button', { name: 'ES', exact: true }).count()) > 0)
check('portal login no raw keys (EN)', !RAW_KEY.test(txt), rawKeyHit(txt))

// switch portal to ES and log in
await page.getByRole('button', { name: 'ES', exact: true }).first().click()
await page.waitForTimeout(300)
check('portal switched to es', (await lang()) === 'es', await lang())
// log in (any credentials) — submit the form
const emailInput = page.locator('input[type="email"]').first()
if (await emailInput.count()) { await emailInput.fill('demo@demo.com') }
const pass = page.locator('input[type="password"]').first()
if (await pass.count()) { await pass.fill('demo1234') }
await page.getByRole('button', { name: /Iniciar|Ingresar|Entrar|Sign/i }).first().click().catch(() => {})
await page.waitForTimeout(900)
txt = await bodyText()
check('portal dashboard renders after login', txt.length > 60)
check('portal (logged-in) no raw keys (ES)', !RAW_KEY.test(txt), rawKeyHit(txt))

// --- Admin panel ---
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(500)
await page.getByRole('link', { name: /^Admin$/i }).first().click()
await page.waitForTimeout(800)
txt = await bodyText()
check('admin panel renders', txt.length > 60)
check('admin language switch present', (await page.getByRole('button', { name: 'EN', exact: true }).count()) > 0)
check('admin no raw keys (ES)', !RAW_KEY.test(txt), rawKeyHit(txt))
await page.getByRole('button', { name: 'EN', exact: true }).first().click()
await page.waitForTimeout(400)
txt = await bodyText()
check('admin switches to EN', (await lang()) === 'en', await lang())
check('admin no raw keys (EN)', !RAW_KEY.test(txt), rawKeyHit(txt))

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log(`\nConsole errors: ${errors.length}`)
errors.slice(0, 12).forEach((e) => console.log('  ! ' + e))
console.log(`\n${failed.length === 0 && errors.length === 0 ? '✅ BROWSER TEST PASSED' : '❌ ISSUES: ' + failed.length + ' checks failed, ' + errors.length + ' console errors'}`)
process.exit(failed.length === 0 && errors.length === 0 ? 0 : 1)

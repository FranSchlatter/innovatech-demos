import { chromium } from 'playwright-core'
const URL = process.env.URL || 'http://localhost:3010/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

// Words that only appear in Spanish copy — if any shows while lang=en, it's an
// un-wrapped literal. Kept conservative to avoid brand/content false positives.
const ES_WORDS = ['Habitaciones','Habitación','Guardar','Buscar','Nuevo','Nueva','Eliminar','Huésped','Huéspedes','Desde','Hasta','Reservar','Cerrar','Semana','Ocupación','Disponibles','Llegadas','Salidas','Gestión','Actividades','Precio dinámico','Usuarios','Permisos','Métricas','Ajustes','Agregar','Editar','Enviar','Buscar…','Estado']

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(500)
// force EN
await page.getByRole('button', { name: 'EN', exact: true }).first().click().catch(()=>{})
await page.waitForTimeout(200)
await page.getByRole('link', { name: /^Admin$/i }).first().click()
await page.waitForTimeout(700)
// ensure EN inside admin
await page.getByRole('button', { name: 'EN', exact: true }).first().click().catch(()=>{})
await page.waitForTimeout(300)

// Collect sidebar nav buttons (aside/nav area)
const navButtons = await page.locator('aside button, nav button').all()
console.log('sidebar buttons found:', navButtons.length)

const hits = {}
async function scan(label) {
  const txt = await page.evaluate(() => document.body.innerText)
  for (const w of ES_WORDS) {
    const re = new RegExp('(^|[^a-zA-Zá-ú])' + w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '([^a-zA-Zá-ú]|$)')
    if (re.test(txt)) { (hits[w] ||= []).push(label) }
  }
}

// Iterate each sidebar item by visible text
const items = await page.locator('aside button').allInnerTexts().catch(()=>[])
const uniq = [...new Set(items.map(s=>s.trim()).filter(Boolean))]
console.log('nav items:', JSON.stringify(uniq))
for (const it of uniq) {
  await page.getByRole('button', { name: it, exact: true }).first().click().catch(()=>{})
  await page.waitForTimeout(450)
  await scan(it)
}

console.log('\nConsole errors:', errors.length)
errors.slice(0,10).forEach(e=>console.log('  ! '+e))
const found = Object.entries(hits)
if (found.length) {
  console.log('\n⚠ Spanish words seen in EN admin:')
  found.forEach(([w, where]) => console.log(`  "${w}" in view(s): ${[...new Set(where)].join(', ')}`))
} else {
  console.log('\n✅ No Spanish stopwords found across admin views in EN mode')
}
await browser.close()
process.exit(found.length === 0 && errors.length === 0 ? 0 : 1)

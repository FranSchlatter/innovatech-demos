// i18n coverage & integrity test (no deps, no bundler).
// 1. Loads every namespace file by evaluating its `export default {…}` literal.
// 2. Builds the merged es/en dictionaries exactly like translations/index.js.
// 3. Asserts es and en have identical key structure (missing/extra keys).
// 4. Scans all source for t('static.key') calls and asserts each resolves in BOTH
//    languages; for dynamic keys t(`ns.a.${x}`) asserts the static prefix is an object.
// 5. Sanity-checks the lookup + interpolation semantics.
//
// Run: node apps/hoteleria/scripts/test-i18n.mjs   (cwd = repo root or app root)

import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '../src')
const I18N = join(SRC, 'i18n/translations')

let failures = 0
const fail = (msg) => { failures++; console.error('  ✗ ' + msg) }
const ok = (msg) => console.log('  ✓ ' + msg)

// --- 1. Load a namespace file's default export object ---------------------
function loadNamespace(lang, name) {
  const src = readFileSync(join(I18N, lang, `${name}.js`), 'utf8')
  const body = src.replace(/export\s+default\s*/, 'return ')
  // Namespace files are pure object literals with no imports; safe to eval here.
  return new Function(body)()
}

const NAMESPACES = ['common', 'nav', 'landing', 'landingExtra', 'portal', 'client', 'station', 'adminA', 'adminB', 'adminC', 'adminD']
const es = {}
const en = {}
for (const ns of NAMESPACES) { es[ns] = loadNamespace('es', ns); en[ns] = loadNamespace('en', ns) }

// Merge exactly like index.js
const build = (d) => ({
  common: d.common,
  nav: d.nav,
  landing: { ...d.landing, ...d.landingExtra },
  portal: d.portal,
  client: d.client,
  station: d.station,
  admin: { ...d.adminA, ...d.adminB, ...d.adminC, ...d.adminD },
})
const ES = build(es)
const EN = build(en)

// --- 2. Deep key-path collection -----------------------------------------
function paths(obj, prefix = '') {
  const out = []
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...paths(v, p))
    else out.push(p + (Array.isArray(v) ? `[${v.length}]` : ''))
  }
  return out
}

console.log('\n[1] Key-structure parity es <-> en')
const esPaths = new Set(paths(ES))
const enPaths = new Set(paths(EN))
const missingInEn = [...esPaths].filter((p) => !enPaths.has(p))
const missingInEs = [...enPaths].filter((p) => !esPaths.has(p))
if (missingInEn.length) fail(`keys in ES missing/mismatched in EN (${missingInEn.length}): ${missingInEn.slice(0, 12).join(', ')}`)
if (missingInEs.length) fail(`keys in EN missing/mismatched in ES (${missingInEs.length}): ${missingInEs.slice(0, 12).join(', ')}`)
if (!missingInEn.length && !missingInEs.length) ok(`${esPaths.size} leaf paths identical across es/en`)

// --- 3. lookup + used-key resolution -------------------------------------
function lookup(dict, key) {
  return key.split('.').reduce((a, s) => (a && typeof a === 'object' ? a[s] : undefined), dict)
}

function walkFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'i18n' || entry.name === 'node_modules') continue
      out.push(...walkFiles(full))
    } else if (/\.jsx?$/.test(entry.name)) out.push(full)
  }
  return out
}

const files = walkFiles(SRC)
// Match t('a.b'), t("a.b") and t(`a.b.${x}`)
const staticRe = /\bt\(\s*['"]([a-zA-Z0-9_.]+)['"]/g
const dynRe = /\bt\(\s*`([a-zA-Z0-9_.]+)\.\$\{/g

const staticKeys = new Set()
const dynPrefixes = new Set()
for (const f of files) {
  const txt = readFileSync(f, 'utf8')
  let m
  while ((m = staticRe.exec(txt))) staticKeys.add(m[1])
  while ((m = dynRe.exec(txt))) dynPrefixes.add(m[1])
}

console.log(`\n[2] Static t() keys resolve in both languages (${staticKeys.size} unique)`)
let badStatic = []
for (const key of staticKeys) {
  const inEs = lookup(ES, key)
  const inEn = lookup(EN, key)
  const good = (v) => typeof v === 'string' || Array.isArray(v)
  if (!good(inEs) || !good(inEn)) badStatic.push(key + (good(inEs) ? '' : ' [es]') + (good(inEn) ? '' : ' [en]'))
}
if (badStatic.length) { badStatic.slice(0, 40).forEach((k) => fail(`unresolved key: ${k}`)); if (badStatic.length > 40) fail(`…and ${badStatic.length - 40} more`) }
else ok('all static keys resolve to a string/array in es & en')

console.log(`\n[3] Dynamic t(\`prefix.\${…}\`) prefixes are objects (${dynPrefixes.size} unique)`)
let badDyn = []
for (const pre of dynPrefixes) {
  const inEs = lookup(ES, pre)
  const inEn = lookup(EN, pre)
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
  if (!isObj(inEs) || !isObj(inEn)) badDyn.push(pre)
}
if (badDyn.length) badDyn.forEach((k) => fail(`dynamic prefix not an object in es/en: ${k}`))
else ok('all dynamic key prefixes are objects in es & en')

// --- 4. interpolation / fallback semantics -------------------------------
console.log('\n[3] Semantics: interpolation + array mapping')
function interpolate(str, vars) {
  if (typeof str !== 'string' || !vars) return str
  return str.replace(/\{(\w+)\}/g, (mm, n) => (Object.prototype.hasOwnProperty.call(vars, n) ? String(vars[n]) : mm))
}
const sample = interpolate('Hola {name}, {count} items', { name: 'Ana', count: 3 })
sample === 'Hola Ana, 3 items' ? ok('interpolation replaces placeholders') : fail(`interpolation: got "${sample}"`)
const arrVal = lookup(ES, 'landing.hero.features')
Array.isArray(arrVal) && arrVal.length === 4 ? ok('array value returns array (hero.features)') : fail('hero.features not a 4-item array')

// --- summary --------------------------------------------------------------
console.log('\n' + (failures === 0 ? '✅ i18n test PASSED' : `❌ i18n test FAILED (${failures} problem(s))`))
process.exit(failures === 0 ? 0 : 1)

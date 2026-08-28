/* Real-estate seed — 60 properties, 40 contracts (6 adjustment schemes),
   AI lead qualification inbox, dashboard with response-time KPI, liquidations,
   owner/tenant portals, valuation comparables. */
import { img, seeded } from '../latency'

const TODAY = new Date('2026-08-27T12:00:00')
const iso = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => iso(new Date(TODAY.getTime() - n * 864e5))
const daysAhead = (n) => iso(new Date(TODAY.getTime() + n * 864e5))
const minsAgo = (n) => new Date(TODAY.getTime() - n * 6e4).toISOString()

export const brand = { name: 'Terranova Propiedades', location: 'Santa Fe · Rosario', phone: '+54 342 154-2200' }

const NEIGHBORHOODS = [
  { name: 'Centro', city: 'Santa Fe', x: 30, y: 40 },
  { name: 'Candioti', city: 'Santa Fe', x: 44, y: 32 },
  { name: 'Guadalupe', city: 'Santa Fe', x: 58, y: 22 },
  { name: 'Fisherton', city: 'Rosario', x: 20, y: 68 },
  { name: 'Pichincha', city: 'Rosario', x: 66, y: 58 },
  { name: 'Puerto Norte', city: 'Rosario', x: 74, y: 46 }
]
const STREETS = ['San Martín', 'Bv. Gálvez', 'Rivadavia', 'San Jerónimo', 'Córdoba', 'Salta', 'Mendoza', 'Rioja', 'Urquiza', 'Belgrano']
const TYPES = [
  { key: 'apartment', label: 'Departamento' },
  { key: 'house', label: 'Casa' },
  { key: 'ph', label: 'PH' },
  { key: 'office', label: 'Oficina' },
  { key: 'commercial', label: 'Local' }
]
const OPS = ['sale', 'rent', 'temporary']

export function generateProperties(n = 60) {
  const rnd = seeded('terranova-props')
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)]
  const out = []
  for (let i = 1; i <= n; i++) {
    const nb = pick(NEIGHBORHOODS)
    const t = pick(TYPES)
    const op = pick(OPS)
    const rooms = 1 + Math.floor(rnd() * 4)
    const area = 30 + Math.floor(rnd() * 140)
    const isUsd = op !== 'rent'
    const price = op === 'sale'
      ? 60000 + Math.floor(rnd() * 480000)
      : op === 'temporary'
        ? 45000 + Math.floor(rnd() * 90000)
        : 320000 + Math.floor(rnd() * 900000)
    out.push({
      id: `PROP-${String(i).padStart(3, '0')}`,
      title: `${t.label} ${rooms} amb. en ${nb.name}`,
      operation: op, type: t.key, typeLabel: t.label,
      status: rnd() > 0.82 ? 'reserved' : 'available',
      price, currency: isUsd ? 'USD' : 'ARS',
      expenses: t.key === 'house' ? 0 : 30000 + Math.floor(rnd() * 90000),
      address: `${pick(STREETS)} ${100 + Math.floor(rnd() * 3800)}`,
      neighborhood: nb.name, city: nb.city, x: nb.x + (rnd() * 8 - 4), y: nb.y + (rnd() * 8 - 4),
      rooms, bedrooms: Math.max(1, rooms - 1), bathrooms: 1 + Math.floor(rnd() * 2),
      area, garage: rnd() > 0.5 ? 1 : 0,
      creditReady: rnd() > 0.45, petFriendly: rnd() > 0.5,
      yearBuilt: 1990 + Math.floor(rnd() * 34),
      featured: i <= 6,
      images: [img(`prop-${i}-a`, 1000, 700), img(`prop-${i}-b`, 1000, 700), img(`prop-${i}-c`, 1000, 700)],
      agentId: `AG-00${1 + (i % 4)}`,
      publishedAt: daysAgo(Math.floor(rnd() * 90)),
      daysOnMarket: Math.floor(rnd() * 90),
      views: 40 + Math.floor(rnd() * 600),
      amenities: ['Balcón', 'Cochera', 'Seguridad 24h', 'SUM', 'Gimnasio'].filter(() => rnd() > 0.5)
    })
  }
  return out
}

export const agents = [
  { id: 'AG-001', name: 'Valentina Ríos', avgResponseMin: 6, leads: 42, deals: 7 },
  { id: 'AG-002', name: 'Mariano Sosa', avgResponseMin: 22, leads: 38, deals: 5 },
  { id: 'AG-003', name: 'Julieta Paz', avgResponseMin: 74, leads: 31, deals: 3 },
  { id: 'AG-004', name: 'Federico Luna', avgResponseMin: 14, leads: 45, deals: 8 }
]

export const dashboard = {
  leadsByOrigin: [
    { origin: 'ZonaProp', value: 128 },
    { origin: 'Orgánico', value: 74 },
    { origin: 'Ads', value: 56 },
    { origin: 'Referido', value: 39 }
  ],
  funnel: [
    { stage: 'Consultas', value: 297 },
    { stage: 'Contactados', value: 241 },
    { stage: 'Visitas', value: 118 },
    { stage: 'Ofertas', value: 44 },
    { stage: 'Cerrados', value: 19 }
  ],
  avgResponseMin: 18,   // overall — anchors the sale (I5)
  propertiesByStatus: [
    { status: 'Disponible', value: 47 },
    { status: 'Reservada', value: 9 },
    { status: 'Vendida (mes)', value: 4 }
  ]
}

// ---- Inbox with AI lead qualification (I7) ----
export const conversations = [
  {
    id: 'L1', channel: 'whatsapp', name: 'Gabriel Ponce', avatar: img('lead-gabriel', 80, 80),
    unread: 0, lastAt: minsAgo(3), aiHandled: true,
    score: 86, qualification: { presupuesto: 'USD 150–180k', zona: 'Candioti', plazo: '60 días', credito: 'Sí (UVA pre-aprobado)', garantia: 'Propietaria' },
    context: { property: 'PROP-002 · Depto 3 amb Candioti', lastActivity: 'Vio 4 propiedades' },
    messages: [
      { from: 'guest', at: minsAgo(41), text: 'Hola, vi el depto de Bv. Gálvez. Sigue disponible? Entró un sábado a la noche 🙏' },
      { from: 'ai', at: minsAgo(40), text: '¡Hola Gabriel! Sí, disponible 🙌 Es un 3 ambientes de 68 m², USD 165.000. ¿Es para vivienda o inversión?', meta: 'IA · respondió en 40 s' },
      { from: 'guest', at: minsAgo(28), text: 'Para vivir. Tengo crédito UVA pre-aprobado por 180 mil.' },
      { from: 'ai', at: minsAgo(27), text: 'Excelente. ¿Tenés garantía propietaria o necesitás seguro de caución? Y ¿en qué plazo pensás mudarte?', meta: 'IA · calificando lead' },
      { from: 'guest', at: minsAgo(8), text: 'Garantía propietaria sí. En unos 2 meses.' },
      { from: 'ai', at: minsAgo(3), text: 'Perfecto Gabriel 👌 Te agendo una visita. ¿Te viene bien el jueves 17:30?', meta: 'IA · agendó visita · score 86' }
    ]
  },
  {
    id: 'L2', channel: 'zonaprop', name: 'Consulta ZonaProp', avatar: img('lead-zp', 80, 80),
    unread: 1, lastAt: minsAgo(52), aiHandled: true,
    score: 41, qualification: { presupuesto: 'ARS 400k/mes', zona: 'Centro', plazo: 'Inmediato', credito: 'No aplica (alquiler)', garantia: 'A definir' },
    context: { property: 'PROP-014 · 2 amb alquiler Centro', lastActivity: 'Primera consulta' },
    messages: [
      { from: 'guest', at: minsAgo(58), text: 'Buenas, el alquiler de Rivadavia acepta mascotas?' },
      { from: 'ai', at: minsAgo(57), text: '¡Hola! Sí, es pet friendly 🐶 El valor es ARS 380.000 + expensas. ¿Contás con garantía propietaria o recibo de sueldo?', meta: 'IA · calificando' },
      { from: 'guest', at: minsAgo(52), text: 'Recibo de sueldo tengo' }
    ]
  },
  {
    id: 'L3', channel: 'instagram', name: 'Rocío Vega', avatar: img('lead-rocio', 80, 80),
    unread: 0, lastAt: minsAgo(180), aiHandled: false,
    score: 68, qualification: { presupuesto: 'USD 90–110k', zona: 'Fisherton', plazo: '4–6 meses', credito: 'Consultando', garantia: '—' },
    context: { property: '—', lastActivity: 'Escaló a Federico' },
    messages: [
      { from: 'guest', at: minsAgo(200), text: 'Tienen PHs en Fisherton hasta 110 mil dólares?' },
      { from: 'ai', at: minsAgo(199), text: 'Tengo 2 opciones que encajan 🙌 Te paso con Federico que maneja la zona y coordina visita.', meta: 'IA · escaló a humano · score 68' },
      { from: 'staff', at: minsAgo(180), text: 'Hola Rocío! Soy Fede. Te mando fichas de 2 PHs recién ingresados 📩', meta: 'Federico Luna' }
    ]
  }
]

// ---- Rental contracts (I9) — 6 adjustment schemes ----
const CONTRACT_SEED = [
  { index: 'IPC', freq: 3 }, { index: 'IPC', freq: 4 }, { index: 'ICL', freq: 6 },
  { index: 'UVA', freq: 1 }, { index: 'Fijo', freq: 6 }, { index: 'Fijo', freq: 12 }
]
export function generateContracts(n = 40) {
  const rnd = seeded('terranova-contracts')
  const tenants = ['Laura Benítez', 'Pedro Almada', 'Sofía Cabrera', 'Nicolás Ferro', 'Camila Ojeda', 'Tomás Roldán', 'Malena Ruiz', 'Iván Correa', 'Paula Vera', 'Bruno Sanz']
  const out = []
  for (let i = 1; i <= n; i++) {
    const s = CONTRACT_SEED[i % CONTRACT_SEED.length]
    const currency = rnd() > 0.7 ? 'USD' : 'ARS'
    const amount = currency === 'USD' ? 300 + Math.floor(rnd() * 500) : 300000 + Math.floor(rnd() * 700000)
    const daysToAdj = Math.floor(rnd() * 120) - 10
    const collection = rnd() > 0.78 ? 'vencido' : rnd() > 0.2 ? 'al día' : 'parcial'
    out.push({
      id: `CT-${String(i).padStart(3, '0')}`,
      tenant: tenants[i % tenants.length],
      property: `PROP-${String(1 + (i % 60)).padStart(3, '0')}`,
      propertyLabel: `${['Depto', 'PH', 'Casa', 'Local'][i % 4]} · ${NEIGHBORHOODS[i % NEIGHBORHOODS.length].name}`,
      amount, currency, index: s.index, frequencyMonths: s.freq,
      baseDate: daysAgo(180 + (i % 180)),
      nextAdjustment: daysAhead(daysToAdj), daysToAdjustment: daysToAdj,
      collectionStatus: collection,
      owner: `OWN-00${1 + (i % 5)}`
    })
  }
  return out
}

// Adjustment index values (for the live simulator I10)
export const adjustmentIndexValues = {
  IPC: 0.089,   // accumulated over the period (demo)
  ICL: 0.113,
  UVA: 0.041,
  Fijo: 0.10    // fixed % agreed
}

export const owners = [
  { id: 'OWN-001', name: 'Estudio Migliore', properties: 6, unit: '' },
  { id: 'OWN-002', name: 'Raúl Etchegoyen', properties: 2 },
  { id: 'OWN-003', name: 'Sucesión Paladino', properties: 3 },
  { id: 'OWN-004', name: 'Marta Gil', properties: 1 },
  { id: 'OWN-005', name: 'Grupo Aurora SA', properties: 9 }
]

// Owner liquidation (I11) — liquidate over collected, not billed
export function liquidationFor(ownerId, period = '2026-08') {
  const rnd = seeded(ownerId + period)
  const rows = Array.from({ length: 3 + Math.floor(rnd() * 3) }, (_, k) => {
    const billed = 300000 + Math.floor(rnd() * 500000)
    const collected = rnd() > 0.75 ? Math.floor(billed * 0.5) : billed // partial payment case
    return {
      contract: `CT-${String(1 + Math.floor(rnd() * 40)).padStart(3, '0')}`,
      tenant: ['Laura B.', 'Pedro A.', 'Sofía C.', 'Nicolás F.'][k % 4],
      billed, collected, currency: 'ARS', partial: collected < billed
    }
  })
  const grossCollected = rows.reduce((a, r) => a + r.collected, 0)
  const commission = Math.round(grossCollected * 0.08)
  return { ownerId, period, rows, grossCollected, commission, net: grossCollected - commission, currency: 'ARS' }
}

// Tenant portal (I13)
export const tenantAccount = {
  name: 'Laura Benítez', contract: 'CT-001', property: 'Depto 2 amb · Candioti',
  amount: 385000, currency: 'ARS', nextDue: daysAhead(4),
  nextAdjustment: { date: daysAhead(38), index: 'IPC', estimatedPct: 8.9 },
  receipts: [
    { period: 'Ago 2026', amount: 385000, paidAt: daysAgo(23), status: 'pagado' },
    { period: 'Jul 2026', amount: 385000, paidAt: daysAgo(54), status: 'pagado' },
    { period: 'Jun 2026', amount: 352000, paidAt: daysAgo(85), status: 'pagado' }
  ],
  maintenance: [
    { id: 'M1', title: 'Pérdida en canilla cocina', status: 'resuelto', at: daysAgo(20) },
    { id: 'M2', title: 'Portero eléctrico', status: 'en curso', at: daysAgo(3) }
  ]
}

// Public valuation comparables (I4) — offer prices, not closing prices
export function comparablesFor() {
  const rnd = seeded('avm-comps')
  return {
    range: { min: 142000, mid: 158000, max: 174000, currency: 'USD' },
    pricePerM2: 2320,
    disclaimer: 'Estimación basada en precios de OFERTA publicados, no de cierre. Es una referencia, no una tasación oficial.',
    comps: Array.from({ length: 5 }, (_, k) => ({
      address: `${STREETS[k]} ${400 + Math.floor(rnd() * 2000)}`,
      area: 60 + Math.floor(rnd() * 30),
      price: 140000 + Math.floor(rnd() * 40000),
      pricePerM2: 2100 + Math.floor(rnd() * 500),
      daysListed: 10 + Math.floor(rnd() * 120)
    }))
  }
}

export const portals = [
  { id: 'zonaprop', name: 'ZonaProp', published: true, views: 412, inquiries: 18 },
  { id: 'argenprop', name: 'ArgenProp', published: true, views: 236, inquiries: 9 },
  { id: 'mercadolibre', name: 'MercadoLibre', published: true, views: 588, inquiries: 22 },
  { id: 'instagram', name: 'Instagram', published: false, views: 0, inquiries: 0 }
]

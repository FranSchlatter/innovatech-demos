/* Hotel seed — 24 rooms, ~90 days of reservations, channel mix with commission,
   AI inbox, automations, dynamic pricing. All amounts ARS unless noted. */
import { img } from '../latency'

const TODAY = new Date('2026-08-27T12:00:00')
const iso = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => iso(new Date(TODAY.getTime() - n * 864e5))
const daysAhead = (n) => iso(new Date(TODAY.getTime() + n * 864e5))
const hoursAgo = (n) => new Date(TODAY.getTime() - n * 36e5).toISOString()
const minsAgo = (n) => new Date(TODAY.getTime() - n * 6e4).toISOString()

export const brand = {
  name: 'Hotel Costa Serena',
  tagline: 'Frente al río, en el corazón de la ciudad',
  location: 'Santa Fe, Argentina',
  rooms: 24,
  phone: '+54 342 155-0192'
}

export const roomTypes = [
  { id: 'std', name: 'Estándar Doble', capacity: 2, base: 82000, size: 22, image: img('room-std', 900, 650),
    amenities: ['WiFi', 'Aire acondicionado', 'TV Smart 43"', 'Caja de seguridad'],
    desc: 'Habitación cálida y funcional, ideal para viajeros de negocios.' },
  { id: 'sup', name: 'Superior Vista Río', capacity: 2, base: 118000, size: 28, image: img('room-sup', 900, 650),
    amenities: ['WiFi', 'AC', 'TV 50"', 'Balcón', 'Minibar', 'Nespresso'],
    desc: 'Vista abierta al río desde balcón privado.' },
  { id: 'fam', name: 'Familiar', capacity: 4, base: 156000, size: 36, image: img('room-fam', 900, 650),
    amenities: ['WiFi', 'AC', '2 ambientes', 'Minibar', 'Sofá cama'],
    desc: 'Dos ambientes, pensada para familias.' },
  { id: 'suite', name: 'Suite Serena', capacity: 2, base: 214000, size: 48, image: img('room-suite', 900, 650),
    amenities: ['WiFi', 'AC', 'Jacuzzi', 'Living', 'Minibar premium', 'Late checkout'],
    desc: 'Nuestra suite insignia con jacuzzi y living independiente.' }
]

export const channels = [
  { id: 'direct', name: 'Directo (web)', commission: 0, color: '#34D399' },
  { id: 'whatsapp', name: 'WhatsApp', commission: 0, color: '#25D366' },
  { id: 'instagram', name: 'Instagram', commission: 0, color: '#E1306C' },
  { id: 'booking', name: 'Booking.com', commission: 0.15, color: '#3B5CF6' },
  { id: 'expedia', name: 'Expedia', commission: 0.18, color: '#FBBF24' }
]

// 6-month revenue by channel — drives the commission widget (H7)
export const channelMonthly = [
  { month: '2026-03', direct: 6120000, whatsapp: 3080000, instagram: 1240000, booking: 5820000, expedia: 2410000 },
  { month: '2026-04', direct: 6740000, whatsapp: 3320000, instagram: 1380000, booking: 5510000, expedia: 2280000 },
  { month: '2026-05', direct: 7180000, whatsapp: 3560000, instagram: 1420000, booking: 5240000, expedia: 2110000 },
  { month: '2026-06', direct: 7920000, whatsapp: 3810000, instagram: 1610000, booking: 4980000, expedia: 1980000 },
  { month: '2026-07', direct: 8640000, whatsapp: 4120000, instagram: 1740000, booking: 4720000, expedia: 1860000 },
  { month: '2026-08', direct: 9210000, whatsapp: 4380000, instagram: 1890000, booking: 4510000, expedia: 1720000 }
]

// 12-month occupancy series
export const occupancy12 = [
  { month: 'Sep', occ: 61 }, { month: 'Oct', occ: 68 }, { month: 'Nov', occ: 74 },
  { month: 'Dic', occ: 88 }, { month: 'Ene', occ: 92 }, { month: 'Feb', occ: 85 },
  { month: 'Mar', occ: 71 }, { month: 'Abr', occ: 66 }, { month: 'May', occ: 63 },
  { month: 'Jun', occ: 69 }, { month: 'Jul', occ: 78 }, { month: 'Ago', occ: 76 }
]

export const kpis = {
  occupancy: 76,          // %
  adr: 128400,            // ARS
  revpar: 97584,          // ARS
  reservationsMonth: 214,
  directShare: 62         // % of revenue from direct+own channels
}

export const arrivals = [
  { id: 'A1', guest: 'Familia Gómez', room: '204 · Superior', people: 3, time: '14:30', nights: 3, channel: 'direct' },
  { id: 'A2', guest: 'Lucía Ferreyra', room: '112 · Estándar', people: 1, time: '16:00', nights: 2, channel: 'whatsapp' },
  { id: 'A3', guest: 'Martín Ibáñez', room: '301 · Suite', people: 2, time: '18:15', nights: 4, channel: 'booking' },
  { id: 'A4', guest: 'Delegación UNL', room: '105-108', people: 6, time: '20:00', nights: 1, channel: 'direct' }
]

export const departures = [
  { id: 'D1', guest: 'Roberto Salas', room: '210 · Superior', checkout: '11:00', balance: 0 },
  { id: 'D2', guest: 'Ana Duarte', room: '118 · Familiar', checkout: '10:00', balance: 24000 }
]

// ---- Unified inbox (H9): the AI is visibly working ----
export const conversations = [
  {
    id: 'C1', channel: 'whatsapp', guest: 'Carolina Núñez', avatar: img('guest-caro', 80, 80),
    unread: 0, lastAt: minsAgo(6), aiHandled: true, tag: 'Reserva directa',
    context: { reservation: '#RS-8842 · Superior · 2 noches', previousStays: 1, notes: 'Prefiere piso alto.' },
    messages: [
      { from: 'guest', at: minsAgo(14), text: 'Hola! Tienen una habitación para el finde que viene? Somos 2.' },
      { from: 'ai', at: minsAgo(13), text: '¡Hola Carolina! 😊 Sí, para el 5 y 6 de septiembre tengo la Superior Vista Río con balcón. Total ARS 236.000 las 2 noches, desayuno incluido. ¿Te la reservo?', meta: 'IA · consultó disponibilidad real' },
      { from: 'guest', at: minsAgo(9), text: 'Dale, perfecto. Se puede piso alto?' },
      { from: 'ai', at: minsAgo(8), text: 'Anotado, te asigno la 204 (2° con vista abierta). Te paso el link de pago directo, sin comisiones de intermediarios. 🙌', meta: 'IA · upsell disponible: late checkout +ARS 12.000' },
      { from: 'guest', at: minsAgo(6), text: 'Genial, gracias!' }
    ]
  },
  {
    id: 'C2', channel: 'booking', guest: 'James Whitfield', avatar: img('guest-james', 80, 80),
    unread: 2, lastAt: minsAgo(38), aiHandled: true, tag: 'Consulta',
    context: { reservation: '#BK-2291 · Estándar · 1 noche', previousStays: 0, notes: 'Habla inglés.' },
    messages: [
      { from: 'guest', at: minsAgo(52), text: 'Hi! Is early check-in possible for tomorrow?' },
      { from: 'ai', at: minsAgo(51), text: 'Hello James! Early check-in from 11:00 is available for ARS 15.000, subject to housekeeping. Shall I request it?', meta: 'AI · replied in EN' },
      { from: 'guest', at: minsAgo(38), text: 'Yes please, and can I get airport pickup?' }
    ]
  },
  {
    id: 'C3', channel: 'instagram', guest: 'Flor & Nico', avatar: img('guest-flor', 80, 80),
    unread: 0, lastAt: hoursAgo(3), aiHandled: false, tag: 'Escalado a humano',
    context: { reservation: '—', previousStays: 0, notes: 'Consulta por evento (30 personas).' },
    messages: [
      { from: 'guest', at: hoursAgo(4), text: 'Hacen eventos? Queremos festejar un aniversario, seríamos 30.' },
      { from: 'ai', at: hoursAgo(4), text: 'Gracias por escribir 💫 Para eventos de 30 personas prefiero pasarte con nuestro equipo, que arma una propuesta a medida.', meta: 'IA · escaló a humano' },
      { from: 'staff', at: hoursAgo(3), text: 'Hola! Soy Vale del hotel. Te comparto opciones de salón para 30 pax con catering 🥂', meta: 'Vale · recepción' }
    ]
  },
  {
    id: 'C4', channel: 'web', guest: 'Sebastián Roldán', avatar: img('guest-seba', 80, 80),
    unread: 0, lastAt: hoursAgo(20), aiHandled: true, tag: 'Carrito abandonado',
    context: { reservation: 'Cotización Suite · 3 noches', previousStays: 2, notes: 'Cliente recurrente.' },
    messages: [
      { from: 'ai', at: hoursAgo(21), text: 'Hola Sebastián, vi que quedaste a mitad de una reserva de la Suite Serena. Te guardé la tarifa por 24 h. ¿La confirmamos?', meta: 'IA · flujo carrito abandonado' },
      { from: 'guest', at: hoursAgo(20), text: 'Uh gracias, sí la confirmo esta tarde' }
    ]
  }
]

export const automations = [
  { id: 'F1', name: 'Carrito abandonado', active: true, trigger: 'Reserva iniciada sin pago', steps: 3, sent: 128, conv: 31 },
  { id: 'F2', name: 'Pre-arribo', active: true, trigger: '48 h antes del check-in', steps: 2, sent: 210, conv: 74 },
  { id: 'F3', name: 'Bienvenida', active: true, trigger: 'Check-in confirmado', steps: 1, sent: 214, conv: 92 },
  { id: 'F4', name: 'Checkout + reseña', active: true, trigger: 'Día de salida', steps: 2, sent: 198, conv: 41 },
  { id: 'F5', name: 'Reactivación', active: false, trigger: '90 días sin reservar', steps: 3, sent: 0, conv: 0 }
]

// Dynamic pricing (H11): separates inflation from demand (§4.2)
export const dynamicPricing = {
  ipcMonthly: 3.2, // % monthly inflation used to deflate
  rows: [
    { date: daysAhead(1), nominal: 128000, real: 128000, occ: 82, rec: 'subir', reason: 'demanda', delta: 8 },
    { date: daysAhead(2), nominal: 128000, real: 127900, occ: 79, rec: 'mantener', reason: '—', delta: 0 },
    { date: daysAhead(7), nominal: 132000, real: 128100, occ: 61, rec: 'bajar', reason: 'ocupación baja', delta: -6 },
    { date: daysAhead(14), nominal: 138000, real: 128600, occ: 94, rec: 'subir', reason: 'demanda alta', delta: 14 },
    { date: daysAhead(30), nominal: 148000, real: 129200, occ: 88, rec: 'subir', reason: 'demanda', delta: 10 }
  ],
  note: 'La tarifa nominal sube por inflación; la recomendación se calcula sobre la tarifa real y la ocupación.'
}

export const reviews = [
  { id: 'R1', name: 'Paula M.', date: daysAgo(4), score: 5, text: 'Atención impecable y la vista al río espectacular.' },
  { id: 'R2', name: 'Diego F.', date: daysAgo(11), score: 5, text: 'Reservé directo por WhatsApp en 2 minutos. Buenísimo.' },
  { id: 'R3', name: 'Sofía L.', date: daysAgo(19), score: 4, text: 'Muy cómodo, desayuno variado. Volvería.' }
]

// availability for a date range (H2) — deterministic per room type
export function availabilityFor() {
  return roomTypes.map((rt) => ({
    typeId: rt.id, name: rt.name, image: rt.image, capacity: rt.capacity,
    size: rt.size, amenities: rt.amenities, desc: rt.desc,
    available: rt.id === 'suite' ? 1 : rt.id === 'fam' ? 2 : 4,
    rates: [
      { id: 'flex', label: 'Tarifa flexible', price: rt.base, refundable: true, breakfast: true },
      { id: 'nonref', label: 'No reembolsable', price: Math.round(rt.base * 0.86), refundable: false, breakfast: true },
      { id: 'room', label: 'Solo habitación', price: Math.round(rt.base * 0.78), refundable: true, breakfast: false }
    ]
  }))
}

export const upsells = [
  { id: 'u-breakfast', label: 'Desayuno buffet', price: 9800, per: 'por persona/día' },
  { id: 'u-late', label: 'Late checkout (14 h)', price: 12000, per: 'por estadía' },
  { id: 'u-upgrade', label: 'Upgrade a Suite', price: 42000, per: 'por noche' },
  { id: 'u-transfer', label: 'Traslado aeropuerto', price: 18500, per: 'por trayecto' }
]

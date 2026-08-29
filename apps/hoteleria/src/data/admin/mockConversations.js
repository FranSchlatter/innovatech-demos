// Unified inbox conversations with AI agent — WhatsApp / Instagram / Web / Booking.
// Ported from the v2 demo. Times are pre-rendered relative strings (demo, no backend).

export const mockConversations = [
  {
    id: 'C1', channel: 'whatsapp', guest: 'Carolina Núñez', avatar: 'https://picsum.photos/seed/guest-caro/80/80',
    unread: 0, lastAt: 'hace 6 min', aiHandled: true, tag: 'Reserva directa',
    context: { reservation: '#RS-8842 · Superior · 2 noches', previousStays: 1, notes: 'Prefiere piso alto.' },
    messages: [
      { from: 'guest', at: 'hace 14 min', text: 'Hola! Tienen una habitación para el finde que viene? Somos 2.' },
      { from: 'ai', at: 'hace 13 min', text: '¡Hola Carolina! 😊 Sí, para el 5 y 6 de septiembre tengo la Superior Vista Río con balcón. Total ARS 236.000 las 2 noches, desayuno incluido. ¿Te la reservo?', meta: 'IA · consultó disponibilidad real' },
      { from: 'guest', at: 'hace 9 min', text: 'Dale, perfecto. Se puede piso alto?' },
      { from: 'ai', at: 'hace 8 min', text: 'Anotado, te asigno la 204 (2° con vista abierta). Te paso el link de pago directo, sin comisiones de intermediarios. 🙌', meta: 'IA · upsell disponible: late checkout +ARS 12.000' },
      { from: 'guest', at: 'hace 6 min', text: 'Genial, gracias!' }
    ]
  },
  {
    id: 'C2', channel: 'booking', guest: 'James Whitfield', avatar: 'https://picsum.photos/seed/guest-james/80/80',
    unread: 2, lastAt: 'hace 38 min', aiHandled: true, tag: 'Consulta',
    context: { reservation: '#BK-2291 · Estándar · 1 noche', previousStays: 0, notes: 'Habla inglés.' },
    messages: [
      { from: 'guest', at: 'hace 52 min', text: 'Hi! Is early check-in possible for tomorrow?' },
      { from: 'ai', at: 'hace 51 min', text: 'Hello James! Early check-in from 11:00 is available for ARS 15.000, subject to housekeeping. Shall I request it?', meta: 'IA · respondió en EN' },
      { from: 'guest', at: 'hace 38 min', text: 'Yes please, and can I get airport pickup?' }
    ]
  },
  {
    id: 'C3', channel: 'instagram', guest: 'Flor & Nico', avatar: 'https://picsum.photos/seed/guest-flor/80/80',
    unread: 0, lastAt: 'hace 3 h', aiHandled: false, tag: 'Escalado a humano',
    context: { reservation: '—', previousStays: 0, notes: 'Consulta por evento (30 personas).' },
    messages: [
      { from: 'guest', at: 'hace 4 h', text: 'Hacen eventos? Queremos festejar un aniversario, seríamos 30.' },
      { from: 'ai', at: 'hace 4 h', text: 'Gracias por escribir 💫 Para eventos de 30 personas prefiero pasarte con nuestro equipo, que arma una propuesta a medida.', meta: 'IA · escaló a humano' },
      { from: 'staff', at: 'hace 3 h', text: 'Hola! Soy Vale del hotel. Te comparto opciones de salón para 30 pax con catering 🥂', meta: 'Vale · recepción' }
    ]
  },
  {
    id: 'C4', channel: 'web', guest: 'Sebastián Roldán', avatar: 'https://picsum.photos/seed/guest-seba/80/80',
    unread: 0, lastAt: 'hace 20 h', aiHandled: true, tag: 'Carrito abandonado',
    context: { reservation: 'Cotización Suite · 3 noches', previousStays: 2, notes: 'Cliente recurrente.' },
    messages: [
      { from: 'ai', at: 'hace 21 h', text: 'Hola Sebastián, vi que quedaste a mitad de una reserva de la Suite Serena. Te guardé la tarifa por 24 h. ¿La confirmamos?', meta: 'IA · flujo carrito abandonado' },
      { from: 'guest', at: 'hace 20 h', text: 'Uh gracias, sí la confirmo esta tarde' }
    ]
  }
]

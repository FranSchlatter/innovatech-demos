// Unified inbox with AI lead qualification — WhatsApp / portals / web.
// The AI replies instantly, scores the lead (hot/warm/cold) and books visits.
// Ported/adapted from the v2 demo. Demo only, no backend.

export const mockConversations = [
  {
    id: 'RC1', channel: 'whatsapp', name: 'Gabriel Ottone', avatar: 'https://picsum.photos/seed/lead-gabriel/80/80',
    unread: 0, lastAt: 'hace 4 min', aiHandled: true, score: 'hot', tag: 'Visita agendada',
    context: { property: 'Depto 3 amb. c/ balcón aterrazado', budget: 'USD 200.000', operation: 'Compra', agent: 'Sofía Vera' },
    messages: [
      { from: 'lead', at: 'hace 12 min', text: 'Hola, vi el depto de 3 ambientes. Está disponible? Tiene cochera?' },
      { from: 'ai', at: 'hace 12 min', text: '¡Hola Gabriel! Sí, disponible. Tiene cochera cubierta y baulera. ¿Querés que te agende una visita esta semana?', meta: 'IA · respondió en 40 s · sábado 23:14' },
      { from: 'lead', at: 'hace 6 min', text: 'Dale, el jueves a la tarde puedo' },
      { from: 'ai', at: 'hace 5 min', text: 'Listo, te agendo jueves 16:30 con Sofía Vera. Te llega confirmación por WhatsApp. 🔑', meta: 'IA · agendó visita · calificó lead como CALIENTE' },
      { from: 'lead', at: 'hace 4 min', text: 'Perfecto, gracias!' }
    ]
  },
  {
    id: 'RC2', channel: 'portal', name: 'Renata Paz', avatar: 'https://picsum.photos/seed/lead-renata/80/80',
    unread: 1, lastAt: 'hace 25 min', aiHandled: true, score: 'hot', tag: 'Financiación',
    context: { property: 'Casa 4 dorm. c/ pileta y jardín', budget: 'USD 480.000', operation: 'Compra', agent: 'Martín Ávila' },
    messages: [
      { from: 'lead', at: 'hace 40 min', text: 'Buenas, la casa acepta crédito hipotecario?' },
      { from: 'ai', at: 'hace 39 min', text: 'Hola Renata! Sí, es apta crédito. Te puedo pasar una simulación con tasa UVA aproximada. ¿Cuánto tenés de anticipo?', meta: 'IA · lead con presupuesto alto → prioridad' },
      { from: 'lead', at: 'hace 25 min', text: 'Tengo el 40%. Quiero mudarme antes de fin de año' }
    ]
  },
  {
    id: 'RC3', channel: 'web', name: 'Estudio Contable Vega', avatar: 'https://picsum.photos/seed/lead-vega/80/80',
    unread: 0, lastAt: 'hace 2 h', aiHandled: false, score: 'warm', tag: 'Escalado a agente',
    context: { property: 'Oficina premium en torre corporativa', budget: 'ARS 2.200.000/mes', operation: 'Alquiler', agent: 'Lucía Rossi' },
    messages: [
      { from: 'lead', at: 'hace 3 h', text: 'Necesitamos una oficina para 20 puestos. La de la torre cuántos m² tiene?' },
      { from: 'ai', at: 'hace 3 h', text: 'Hola! Son 180 m² divisibles, con 2 cocheras. Para 20 puestos entra cómodo. Te paso con un asesor para condiciones comerciales.', meta: 'IA · consulta corporativa → escaló a humano' },
      { from: 'staff', at: 'hace 2 h', text: 'Hola, soy Lucía. Les preparo una propuesta con planos y expensas. ¿Les viene bien una visita el martes?', meta: 'Lucía · asesora comercial' }
    ]
  },
  {
    id: 'RC4', channel: 'portal', name: 'Andrés Coll', avatar: 'https://picsum.photos/seed/lead-andres/80/80',
    unread: 0, lastAt: 'hace 6 h', aiHandled: true, score: 'cold', tag: 'Fuera de zona',
    context: { property: 'Depto temporario frente al mar', budget: 'USD 90/noche', operation: 'Temporario', agent: '—' },
    messages: [
      { from: 'lead', at: 'hace 6 h', text: 'Hola, tienen algo en la montaña para enero?' },
      { from: 'ai', at: 'hace 6 h', text: 'Hola Andrés! Por ahora solo operamos propiedades en la costa y la ciudad. Te aviso si sumamos zona de montaña. 🙌', meta: 'IA · sin match → calificó FRÍO, sin ocupar tiempo del equipo' }
    ]
  }
]

export const SCORE = {
  hot: { label: 'Caliente', cls: 'bg-error/15 text-error' },
  warm: { label: 'Tibio', cls: 'bg-warning/15 text-warning' },
  cold: { label: 'Frío', cls: 'bg-info/15 text-info' }
}

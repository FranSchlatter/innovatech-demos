// Pure helpers for the "service request → unified Inbox" handoff (H22).
// Kept framework-free so they can be unit tested in isolation.

// Human-readable Spanish labels for service request types. Mirrors the types
// used in mockServiceRequests / ServiceRequestsMonitor.
export const SERVICE_TYPE_LABELS = {
  'room-service': 'room service',
  'housekeeping': 'limpieza',
  'maintenance': 'mantenimiento',
  'spa': 'spa',
  'concierge': 'conserjería',
  'facilities': 'instalaciones'
}

// Stable conversation id for a guest's service thread, so the same guest+room
// always maps to one conversation (repeated clicks reselect, never duplicate).
export function serviceConvId(target) {
  const slug = `${target.roomNumber || 'na'}-${target.guestName || 'guest'}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `SVC-${slug}`
}

// First-name greeting used by the reply template.
export function firstNameOf(fullName) {
  return (fullName || '').trim().split(/\s+/)[0] || 'huésped'
}

// Pre-filled reply the composer opens with.
export function serviceReplyTemplate(target) {
  const typeLabel = SERVICE_TYPE_LABELS[target.type] || 'servicio'
  return `Hola ${firstNameOf(target.guestName)}, respecto a su solicitud de ${typeLabel}, `
}

// Build a fresh conversation seeded with the guest's request, so the staff has
// context the moment the thread opens. `ts` makes the seed message time stable
// across reloads (it is persisted).
export function buildServiceConversation(target, ts) {
  const id = serviceConvId(target)
  const typeLabel = SERVICE_TYPE_LABELS[target.type] || 'servicio'
  return {
    id,
    channel: 'service',
    guest: target.guestName || 'Huésped',
    avatar: `https://picsum.photos/seed/${id}/80/80`,
    unread: 0,
    aiHandled: false,
    tag: 'Solicitud de servicio',
    lastAt: '',
    context: {
      reservation: target.roomNumber ? `Habitación ${target.roomNumber}` : '—',
      previousStays: '—',
      notes: `Abrió una solicitud de ${typeLabel}${target.roomNumber ? ` desde la habitación ${target.roomNumber}` : ''}.`
    },
    messages: [
      {
        id: `SVC-SEED-${id}`,
        from: 'guest',
        text: target.description || `Solicitud de ${typeLabel}.`,
        meta: `Solicitud ${target.requestId || ''} · ${typeLabel}`.trim(),
        ts
      }
    ]
  }
}

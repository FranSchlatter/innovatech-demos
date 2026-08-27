// Shared formatting helpers for the real-estate demo

export const OPERATION_LABELS = {
  sale: 'Venta',
  rent: 'Alquiler',
  temporary: 'Temporario'
}

export const TYPE_LABELS = {
  apartment: 'Departamento',
  house: 'Casa',
  ph: 'PH',
  office: 'Oficina',
  commercial: 'Local',
  land: 'Terreno'
}

export const STATUS_LABELS = {
  available: 'Disponible',
  reserved: 'Reservada',
  sold: 'Vendida',
  rented: 'Alquilada'
}

// Format a price with currency + per-period suffix depending on operation
export function formatPrice(price, currency = 'USD', operation = 'sale') {
  const symbol = currency === 'USD' ? 'USD ' : '$'
  const formatted = new Intl.NumberFormat('es-AR').format(price)
  let suffix = ''
  if (operation === 'rent') suffix = '/mes'
  if (operation === 'temporary') suffix = '/noche'
  return `${symbol}${formatted}${suffix}`
}

export function formatArea(m2) {
  if (!m2) return '—'
  return `${m2} m²`
}

export function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function timeAgo(iso, now = new Date('2026-08-27T12:00:00Z')) {
  if (!iso) return ''
  const diff = now - new Date(iso)
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  return `hace ${days} d`
}

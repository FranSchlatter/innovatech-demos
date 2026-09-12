// Buyer (interesado) documents — grouped by property/operation, with a
// requirements checklist per operation type. All mock / client-side; the
// upload flow is simulated (no real files leave the browser).

// Catalog of document types the buyer can upload. `kind` drives the card icon
// (pdf / doc → FileText, img → Image). Labels are used in badges and selectors.
export const BUYER_DOC_TYPES = [
  { id: 'dni', label: 'DNI', kind: 'img' },
  { id: 'payslip', label: 'Recibo de sueldo', kind: 'pdf' },
  { id: 'cuit', label: 'Constancia de CUIT', kind: 'pdf' },
  { id: 'bcra', label: 'Certificado BCRA', kind: 'pdf' },
  { id: 'guarantee', label: 'Garantía propietaria', kind: 'doc' },
  { id: 'guarantor-cuit', label: 'CUIT del garante', kind: 'pdf' },
  { id: 'deed', label: 'Certificado de dominio', kind: 'pdf' },
  { id: 'reserve', label: 'Reserva', kind: 'pdf' },
  { id: 'contract', label: 'Contrato', kind: 'doc' },
  { id: 'income', label: 'Comprobante de ingresos', kind: 'pdf' },
  { id: 'other', label: 'Otro documento', kind: 'doc' }
]

export const docType = (id) => BUYER_DOC_TYPES.find((t) => t.id === id)
export const docTypeLabel = (id) => docType(id)?.label ?? 'Documento'
export const docTypeKind = (id) => docType(id)?.kind ?? 'doc'

// Default filename suggested when a given type is selected in the upload modal.
const DEFAULT_EXT = { img: 'jpg', pdf: 'pdf', doc: 'pdf' }
export const suggestedFileName = (typeId) => {
  const t = docType(typeId)
  if (!t) return 'documento.pdf'
  const slug = t.label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug}.${DEFAULT_EXT[t.kind] || 'pdf'}`
}

// Document lifecycle. A freshly uploaded doc lands on `pending`; the agency can
// then verify or reject it. `uploaded` covers older files received before review.
// NOTE: alpha over theme colors (bg-accent/15, …) is a silent no-op in this app
// (CSS vars hold hex, not channels) → pills use a solid bg-surface-alt fill and
// carry their colour through the text + a solid status dot.
export const DOC_STATUS = {
  uploaded: { label: 'Subido', cls: 'bg-surface-alt text-info', dot: 'bg-info' },
  pending: { label: 'Pendiente de verificación', cls: 'bg-surface-alt text-warning', dot: 'bg-warning' },
  verified: { label: 'Verificado', cls: 'bg-surface-alt text-success', dot: 'bg-success' },
  rejected: { label: 'Rechazado', cls: 'bg-surface-alt text-error', dot: 'bg-error' }
}

// A document counts toward a requirement when it's been submitted and not
// rejected (i.e. it's on its way to being verified, or already verified).
export const DOC_SUBMITTED = ['uploaded', 'pending', 'verified']

// Required documents per operation. `count` defaults to 1 (e.g. payslips x3).
export const DOC_REQUIREMENTS = {
  purchase: {
    id: 'purchase',
    label: 'Compra',
    items: [
      { type: 'dni', label: 'DNI (frente y dorso)' },
      { type: 'cuit', label: 'Constancia de CUIT' },
      { type: 'payslip', label: 'Recibos de sueldo', count: 3 },
      { type: 'bcra', label: 'Certificado BCRA (libre deuda)' }
    ]
  },
  rent: {
    id: 'rent',
    label: 'Alquiler',
    items: [
      { type: 'dni', label: 'DNI (frente y dorso)' },
      { type: 'payslip', label: 'Recibos de sueldo', count: 3 },
      { type: 'guarantee', label: 'Garantía propietaria' },
      { type: 'guarantor-cuit', label: 'CUIT del garante' }
    ]
  }
}

export const REQUIREMENT_ORDER = ['purchase', 'rent']

// Seed documents. propertyId null → "Documentos generales" (personal docs that
// apply to any operation). Property-scoped docs live under their property group.
export const INITIAL_BUYER_DOCUMENTS = [
  { id: 'D1', name: 'DNI - Frente y dorso.jpg', type: 'dni', kind: 'img', propertyId: null, status: 'verified', uploadedAt: '2026-08-22', size: '1.2 MB' },
  { id: 'D2', name: 'Constancia de CUIT - AFIP.pdf', type: 'cuit', kind: 'pdf', propertyId: null, status: 'verified', uploadedAt: '2026-08-22', size: '180 KB' },
  { id: 'D3', name: 'Recibo de sueldo - Julio 2026.pdf', type: 'payslip', kind: 'pdf', propertyId: null, status: 'verified', uploadedAt: '2026-08-25', size: '210 KB' },
  { id: 'D4', name: 'Recibo de sueldo - Agosto 2026.pdf', type: 'payslip', kind: 'pdf', propertyId: null, status: 'pending', uploadedAt: '2026-09-06', size: '205 KB' },
  { id: 'D5', name: 'Reserva - Departamento Palermo.pdf', type: 'reserve', kind: 'pdf', propertyId: 'PROP-001', status: 'uploaded', uploadedAt: '2026-08-06', size: '240 KB' },
  { id: 'D6', name: 'Contrato (borrador).pdf', type: 'contract', kind: 'doc', propertyId: 'PROP-001', status: 'pending', uploadedAt: '2026-09-02', size: '320 KB' },
  { id: 'D7', name: 'Certificado de dominio.pdf', type: 'deed', kind: 'pdf', propertyId: 'PROP-010', status: 'rejected', uploadedAt: '2026-08-28', size: '150 KB', rejectReason: 'El certificado está vencido (más de 90 días). Pedí uno actualizado en el Registro de la Propiedad.' }
]

export const BUYER_DOCUMENTS_KEY = 'inmob-portal-documents-v1'

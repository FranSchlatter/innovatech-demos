import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Heart, CalendarCheck, FileText, Tag, FolderOpen, BellRing,
  LogOut, Sun, Moon, Video, MapPin, Download, Upload, Mail, Lock, CheckCircle,
  Plus, X, Search, Home, Wrench, CreditCard, TrendingUp, Wallet, DollarSign,
  ChevronRight, AlertTriangle, Users, Repeat, Clock, ShieldCheck,
  Phone, Star, MessageSquare, Send, ThumbsUp, ThumbsDown, CalendarClock,
  ChevronDown, ArrowRight, Banknote, ArrowLeftRight, Handshake, History,
  Image as ImageIcon, UploadCloud, Loader2, Check, Paperclip, RotateCcw,
  Pencil, Trash2, Eye, BedDouble, Ruler, Receipt, Calendar
} from 'lucide-react'
import DatePicker from '@shared-ui/components/DatePicker'
import properties from '../data/properties.json'
import neighborhoods from '../data/neighborhoods.json'
import { mockAgents } from '../data/admin/mockAgents'
import { formatPrice, formatDate, TYPE_LABELS, OPERATION_LABELS } from '../utils/format'
import {
  MOCK_TENANT, TENANT_CONTRACT, RENT_PROJECTION, TENANT_ADJUSTMENT, TENANT_INDEX_COMPARISON,
  TENANT_PAYMENTS, TENANT_DOCUMENTS, TENANT_RECEIPTS, TENANT_REPAIRS, REPAIR_URGENCIES, REPAIR_STATUS
} from '../data/mockTenantData'
import {
  MOCK_OWNER, OWNER_PROPERTIES, OWNER_LIQUIDATIONS, OWNER_COLLECTION,
  OWNER_COLLECTION_HISTORY, OWNER_DOCUMENTS, COLLECTION_STATUS, PROPERTY_RENTAL_STATUS
} from '../data/mockOwnerData'
import {
  BUYER_DOC_TYPES, docTypeLabel, docTypeKind, suggestedFileName,
  DOC_STATUS, DOC_SUBMITTED, DOC_REQUIREMENTS, REQUIREMENT_ORDER,
  INITIAL_BUYER_DOCUMENTS, BUYER_DOCUMENTS_KEY
} from '../data/mockBuyerDocuments'
import PropertyCard from './PropertyCard'

const TODAY = new Date('2026-09-11T12:00:00')

// ---------- Buyer (interesado) mock data ----------
const BUYER_USER = {
  name: 'Lucía Méndez',
  email: 'lucia.mendez@email.com',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80'
}

// Buyer visits are linked to real listings + agents so the card can show the
// property thumbnail, price and the assigned advisor's contact details.
const MOCK_VISITS = [
  { id: 'V1', propertyId: 'PROP-001', agentId: 'AG-001', date: '2026-09-16', time: '10:00', type: 'video', status: 'confirmed' },
  { id: 'V2', propertyId: 'PROP-004', agentId: 'AG-001', date: '2026-09-19', time: '12:00', type: 'in-person', status: 'scheduled' },
  { id: 'V3', propertyId: 'PROP-010', agentId: 'AG-001', date: '2026-09-22', time: '17:00', type: 'in-person', status: 'scheduled' },
  { id: 'V4', propertyId: 'PROP-005', agentId: 'AG-003', date: '2026-09-05', time: '18:30', type: 'in-person', status: 'completed' },
  { id: 'V5', propertyId: 'PROP-014', agentId: 'AG-001', date: '2026-08-28', time: '16:00', type: 'in-person', status: 'completed', feedback: { rating: 4, interest: 'interested', note: 'Muy luminoso y bien ubicado. Quiero avanzar con una oferta.' } },
  { id: 'V6', propertyId: 'PROP-007', agentId: 'AG-003', date: '2026-08-20', time: '15:30', type: 'in-person', status: 'cancelled', cancelReason: 'Me surgió un imprevisto y no pude asistir.' }
]

const VISIT_STATUS = {
  scheduled: { label: 'Agendada', cls: 'bg-info/15 text-info' },
  confirmed: { label: 'Confirmada', cls: 'bg-success/15 text-success' },
  completed: { label: 'Realizada', cls: 'bg-accent/15 text-accent' },
  cancelled: { label: 'Cancelada', cls: 'bg-error/15 text-error' }
}

// Reasons offered when a buyer cancels a visit (demo).
const CANCEL_REASONS = [
  'Ya no me interesa la propiedad',
  'Me surgió un imprevisto',
  'Encontré otra propiedad',
  'Quiero reprogramar para más adelante',
  'Otro motivo'
]

const agentById = (id) => mockAgents.find((a) => a.id === id)

// Upcoming visits sort ascending (soonest first); past ones descending (latest first).
const isUpcoming = (v) => v.status === 'scheduled' || v.status === 'confirmed'

// Each offer links to a real listing and carries the full negotiation history,
// so the timeline can be rebuilt from `history` and the "current" amounts derived.
// status: sent → review → counter → accepted | rejected
const MOCK_OFFERS = [
  {
    id: 'O1',
    propertyId: 'PROP-010',
    currency: 'USD',
    condition: 'financed',
    validityDays: 20,
    status: 'counter',
    history: [
      { actor: 'buyer', amount: 285000, date: '2026-08-26', note: 'Oferta inicial. Puedo escriturar en 60 días.' },
      { actor: 'seller', amount: 296000, date: '2026-08-30', note: 'El propietario contraoferta y ofrece escriturar en 45 días.' }
    ]
  },
  {
    id: 'O2',
    propertyId: 'PROP-004',
    currency: 'USD',
    condition: 'cash',
    validityDays: 15,
    status: 'review',
    history: [
      { actor: 'buyer', amount: 150000, date: '2026-09-02', note: 'Pago de contado, escritura inmediata.' }
    ]
  },
  {
    id: 'O3',
    propertyId: 'PROP-001',
    currency: 'USD',
    condition: 'cash',
    validityDays: 10,
    status: 'accepted',
    history: [
      { actor: 'buyer', amount: 180000, date: '2026-07-30', note: '' },
      { actor: 'seller', amount: 186000, date: '2026-08-02', note: 'Contraoferta del propietario.' },
      { actor: 'buyer', amount: 184000, date: '2026-08-04', note: 'Última oferta, cerramos en este valor.' },
      { actor: 'seller', amount: 184000, date: '2026-08-06', note: '¡El propietario aceptó tu oferta!', accepted: true }
    ]
  },
  {
    id: 'O4',
    propertyId: 'PROP-003',
    currency: 'USD',
    condition: 'financed',
    validityDays: 15,
    status: 'rejected',
    history: [
      { actor: 'buyer', amount: 62000, date: '2026-08-10', note: 'Oferta con crédito hipotecario pre-aprobado.' },
      { actor: 'seller', amount: null, date: '2026-08-12', note: 'El propietario rechazó la oferta por estar debajo del valor buscado.', rejected: true }
    ]
  }
]

// step drives the status stepper (1..4); cls drives the status pill.
const OFFER_STATUS = {
  sent: { label: 'Enviada', cls: 'bg-info/15 text-info', step: 1 },
  review: { label: 'En revisión', cls: 'bg-warning/15 text-warning', step: 2 },
  counter: { label: 'Contraoferta', cls: 'bg-accent/15 text-accent', step: 3 },
  accepted: { label: 'Aceptada', cls: 'bg-success/15 text-success', step: 4 },
  rejected: { label: 'Rechazada', cls: 'bg-error/15 text-error', step: 4 }
}

const OFFER_CONDITIONS = {
  cash: { label: 'Contado', icon: Banknote },
  financed: { label: 'Financiado', icon: CreditCard },
  trade: { label: 'Permuta', icon: ArrowLeftRight }
}

// Latest amount the buyer put on the table (their current position).
const buyerAmount = (o) => {
  for (let i = o.history.length - 1; i >= 0; i--) {
    const e = o.history[i]
    if (e.actor === 'buyer' && e.amount != null) return e.amount
  }
  return null
}

// Seller's pending counter — present only while it's the buyer's turn to respond.
const sellerCounter = (o) => {
  const last = o.history[o.history.length - 1]
  return last && last.actor === 'seller' && last.amount != null && !last.rejected ? last.amount : null
}

// Alert criteria model (I16): multi-select types/zones, currency, min rooms/area.
// `seenIds` tracks which matching listings the buyer has already reviewed so the
// card + tab badge can surface only genuinely-new coincidences.
const EMPTY_CRITERIA = {
  operation: 'sale', types: [], neighborhoods: [], currency: 'USD',
  min: '', max: '', minRooms: 0, minArea: ''
}

const INITIAL_ALERTS = [
  {
    id: 'A1',
    name: 'Deptos en Palermo hasta USD 200.000',
    criteria: { ...EMPTY_CRITERIA, operation: 'sale', types: ['apartment'], neighborhoods: ['Palermo', 'Palermo Soho', 'Palermo Hollywood'], currency: 'USD', max: 200000 },
    active: true,
    seenIds: []
  },
  {
    id: 'A2',
    name: 'Alquiler 2+ ambientes en Barrio Norte',
    criteria: { ...EMPTY_CRITERIA, operation: 'rent', types: ['apartment', 'ph'], neighborhoods: ['Barrio Norte'], currency: 'ARS', minRooms: 1 },
    active: true,
    seenIds: []
  },
  {
    id: 'A3',
    name: 'Casas en zona norte con jardín',
    criteria: { ...EMPTY_CRITERIA, operation: 'sale', types: ['house'], neighborhoods: ['Nordelta', 'Santa Bárbara', 'La Lonja'], currency: 'USD', min: 300000, minRooms: 3, minArea: 200 },
    active: false,
    seenIds: []
  }
]

// v2: criteria model changed from single-value to multi-select. Bumped key so a
// legacy v1 payload doesn't break the new UI.
const ALERTS_KEY = 'inmob-portal-alerts-v2'
const TENANT_KEY = 'inmob-portal-tenant-v1'
const VISITS_KEY = 'inmob-portal-visits-v1'
const OFFERS_KEY = 'inmob-portal-offers-v1'

// ---------- Role config ----------
const ROLES = {
  buyer: {
    id: 'buyer',
    label: 'Interesado',
    icon: Search,
    title: 'Interesado en comprar/alquilar',
    desc: 'Seguí favoritos, visitas y ofertas.',
    user: BUYER_USER,
    nav: [
      { id: 'favorites', label: 'Favoritos', icon: Heart },
      { id: 'visits', label: 'Mis visitas', icon: CalendarCheck },
      { id: 'offers', label: 'Mis ofertas', icon: Tag },
      { id: 'documents', label: 'Documentos', icon: FolderOpen },
      { id: 'alerts', label: 'Alertas', icon: BellRing }
    ]
  },
  tenant: {
    id: 'tenant',
    label: 'Inquilino',
    icon: Home,
    title: 'Soy inquilino',
    desc: 'Gestioná tu contrato, pagos y reparaciones.',
    user: MOCK_TENANT,
    nav: [
      { id: 'contract', label: 'Mi contrato', icon: FileText },
      { id: 'payments', label: 'Pagos', icon: CreditCard },
      { id: 'adjustment', label: 'Próximo ajuste', icon: TrendingUp },
      { id: 'documents', label: 'Documentos', icon: FolderOpen },
      { id: 'repairs', label: 'Reparaciones', icon: Wrench }
    ]
  },
  owner: {
    id: 'owner',
    label: 'Propietario',
    icon: Building2,
    title: 'Soy propietario',
    desc: 'Controlá propiedades, liquidaciones y cobros.',
    user: MOCK_OWNER,
    nav: [
      { id: 'properties', label: 'Mis propiedades', icon: Building2 },
      { id: 'liquidations', label: 'Liquidaciones', icon: Wallet },
      { id: 'documents', label: 'Documentos', icon: FolderOpen },
      { id: 'collection', label: 'Estado de cobro', icon: DollarSign }
    ]
  }
}

const ROLE_ORDER = ['buyer', 'tenant', 'owner']

// Listings matching a set of alert criteria (real data). Empty multi-selects mean
// "any", so an alert with no zones/types selected matches across all of them.
function matchProperties(c) {
  if (!c) return []
  return properties.filter((p) => {
    if (c.operation && p.operation !== c.operation) return false
    if (c.currency && p.currency !== c.currency) return false
    if (c.types?.length && !c.types.includes(p.type)) return false
    if (c.neighborhoods?.length && !c.neighborhoods.includes(p.neighborhood)) return false
    if (c.min && p.price < Number(c.min)) return false
    if (c.max && p.price > Number(c.max)) return false
    if (c.minRooms && (p.bedrooms || 0) < Number(c.minRooms)) return false
    if (c.minArea && (p.areaTotal || 0) < Number(c.minArea)) return false
    return true
  })
}

const countMatches = (c) => matchProperties(c).length

// Listings that match the alert but the buyer hasn't reviewed yet (drives the
// "X nuevas" pill on the card and the red badge on the Alertas tab).
function newMatchIds(alert) {
  if (!alert?.active) return []
  const seen = alert.seenIds || []
  return matchProperties(alert.criteria).map((p) => p.id).filter((id) => !seen.includes(id))
}

// Short criteria chips shown on the alert card.
function criteriaTags(c) {
  const tags = [OPERATION_LABELS[c.operation] || 'Venta']
  if (c.types?.length) {
    tags.push(c.types.length <= 2 ? c.types.map((t) => TYPE_LABELS[t]).join(' / ') : `${c.types.length} tipologías`)
  }
  if (c.neighborhoods?.length) {
    tags.push(c.neighborhoods.length <= 2 ? c.neighborhoods.join(' · ') : `${c.neighborhoods.length} zonas`)
  }
  const cur = c.currency || 'USD'
  const money = (n) => `${cur} ${Number(n).toLocaleString('es-AR')}`
  if (c.min && c.max) tags.push(`${money(c.min)}–${money(c.max)}`)
  else if (c.max) tags.push(`hasta ${money(c.max)}`)
  else if (c.min) tags.push(`desde ${money(c.min)}`)
  if (c.minRooms) tags.push(`${c.minRooms}+ dorm.`)
  if (c.minArea) tags.push(`${c.minArea}+ m²`)
  return tags
}

// Auto-suggested name when the buyer leaves the name field empty.
function suggestAlertName(c) {
  const typePart = c.types?.length === 1 ? `${TYPE_LABELS[c.types[0]]}s` : 'Propiedades'
  const op = (OPERATION_LABELS[c.operation] || 'Venta').toLowerCase()
  let zone = ''
  if (c.neighborhoods?.length === 1) zone = ` en ${c.neighborhoods[0]}`
  else if (c.neighborhoods?.length) zone = ` en ${c.neighborhoods.length} zonas`
  return `${typePart} en ${op}${zone}`
}

// Schema-safe coercion for whatever comes back from localStorage.
function normalizeAlert(a) {
  if (!a || typeof a !== 'object') return null
  return {
    id: a.id || `A-${Math.round(performance.now())}`,
    name: typeof a.name === 'string' && a.name.trim() ? a.name : suggestAlertName(a.criteria || EMPTY_CRITERIA),
    criteria: { ...EMPTY_CRITERIA, ...(a.criteria || {}) },
    active: a.active !== false,
    seenIds: Array.isArray(a.seenIds) ? a.seenIds : []
  }
}

const propById = (id) => properties.find((p) => p.id === id)

function daysLate(dueISO) {
  if (!dueISO) return 0
  const diff = TODAY - new Date(dueISO + 'T12:00:00')
  return Math.max(0, Math.floor(diff / 86400000))
}

const reveal = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      <p className="text-sm text-muted mt-1">{subtitle}</p>
    </div>
  )
}

export default function ClientPortal({ onExit, favorites, onSelectProperty, isDark, toggleTheme }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('buyer')
  const [selectedRole, setSelectedRole] = useState('buyer')
  const [submitting, setSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState('favorites')

  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem(ALERTS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed.map(normalizeAlert).filter(Boolean)
      }
    } catch {
      /* ignore corrupt storage */
    }
    return INITIAL_ALERTS
  })

  // Tenant mutable state (payments + repairs), persisted together.
  const [tenantData, setTenantData] = useState(() => {
    try {
      const saved = localStorage.getItem(TENANT_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      /* ignore */
    }
    return { payments: TENANT_PAYMENTS, repairs: TENANT_REPAIRS }
  })

  // Buyer visits (mutable: reschedule / cancel / post-visit feedback), persisted.
  const [visits, setVisits] = useState(() => {
    try {
      const saved = localStorage.getItem(VISITS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      /* ignore */
    }
    return MOCK_VISITS
  })

  // Buyer offers (mutable: new offer / counter-offer / accept / reject), persisted.
  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem(OFFERS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      /* ignore */
    }
    return MOCK_OFFERS
  })

  // Buyer documents (mutable: simulated uploads), persisted.
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(BUYER_DOCUMENTS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      /* ignore */
    }
    return INITIAL_BUYER_DOCUMENTS
  })

  const [toast, setToast] = useState(null)
  // Alerts (I16): form target ('new' | alert to edit | null), matches viewer, delete confirm.
  const [alertFormTarget, setAlertFormTarget] = useState(null)
  const [alertMatchesTarget, setAlertMatchesTarget] = useState(null)
  const [alertDeleteTarget, setAlertDeleteTarget] = useState(null)
  const [repairFormOpen, setRepairFormOpen] = useState(false)
  const [payingId, setPayingId] = useState(null)

  // Visit-related modal targets (a visit being rescheduled / cancelled / messaged).
  const [rescheduleTarget, setRescheduleTarget] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [messageTarget, setMessageTarget] = useState(null)

  // Offer-related modal targets + async submit flag.
  const [offerFormOpen, setOfferFormOpen] = useState(false)
  const [counterTarget, setCounterTarget] = useState(null)
  const [decisionTarget, setDecisionTarget] = useState(null) // { offer, action: 'accept' | 'reject' }
  const [offerSubmitting, setOfferSubmitting] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
    } catch {
      /* ignore quota errors */
    }
  }, [alerts])

  useEffect(() => {
    try {
      localStorage.setItem(TENANT_KEY, JSON.stringify(tenantData))
    } catch {
      /* ignore quota errors */
    }
  }, [tenantData])

  useEffect(() => {
    try {
      localStorage.setItem(VISITS_KEY, JSON.stringify(visits))
    } catch {
      /* ignore quota errors */
    }
  }, [visits])

  useEffect(() => {
    try {
      localStorage.setItem(OFFERS_KEY, JSON.stringify(offers))
    } catch {
      /* ignore quota errors */
    }
  }, [offers])

  useEffect(() => {
    try {
      localStorage.setItem(BUYER_DOCUMENTS_KEY, JSON.stringify(documents))
    } catch {
      /* ignore quota errors */
    }
  }, [documents])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (message, tone = 'success') => setToast({ key: Date.now(), message, tone })

  const handleLogin = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setUserRole(selectedRole)
      setActiveSection(ROLES[selectedRole].nav[0].id)
      setLoggedIn(true)
    }, 500)
  }

  const changeProfile = () => {
    setLoggedIn(false)
  }

  const rescheduleVisit = (id, { date, time }) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, date, time, status: 'scheduled', rescheduled: true } : v))
    )
    setRescheduleTarget(null)
    showToast('Visita reprogramada')
  }

  const cancelVisit = (id, reason) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'cancelled', cancelReason: reason } : v))
    )
    setCancelTarget(null)
    showToast('Visita cancelada', 'muted')
  }

  const saveVisitFeedback = (id, feedback) => {
    setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, feedback } : v)))
    showToast('¡Gracias por tu feedback!')
  }

  // ---- Offers ----
  const createOffer = ({ propertyId, amount, currency, condition, message, validityDays }) => {
    setOfferSubmitting(true)
    setTimeout(() => {
      const offer = {
        id: `O-${Date.now()}`,
        propertyId,
        currency,
        condition,
        validityDays: Number(validityDays) || 15,
        status: 'sent',
        history: [{ actor: 'buyer', amount: Number(amount), date: '2026-09-11', note: message.trim() }]
      }
      setOffers((prev) => [offer, ...prev])
      setOfferSubmitting(false)
      setOfferFormOpen(false)
      showToast('Oferta enviada al propietario')
    }, 700)
  }

  // Buyer answers a seller counter with a new amount → back to the seller's court.
  const submitCounter = (id, { amount, note }) => {
    setOfferSubmitting(true)
    setTimeout(() => {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                status: 'review',
                history: [...o.history, { actor: 'buyer', amount: Number(amount), date: '2026-09-11', note: note.trim() }]
              }
            : o
        )
      )
      setOfferSubmitting(false)
      setCounterTarget(null)
      showToast('Contraoferta enviada')
    }, 700)
  }

  // Buyer accepts or rejects the seller's pending counter.
  const resolveOffer = (id, action) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        if (action === 'accept') {
          return {
            ...o,
            status: 'accepted',
            history: [...o.history, { actor: 'buyer', amount: sellerCounter(o), date: '2026-09-11', note: 'Aceptaste la contraoferta del propietario.', accepted: true }]
          }
        }
        return {
          ...o,
          status: 'rejected',
          history: [...o.history, { actor: 'buyer', amount: null, date: '2026-09-11', note: 'Rechazaste la contraoferta del propietario.', rejected: true }]
        }
      })
    )
    setDecisionTarget(null)
    showToast(
      action === 'accept' ? '¡Oferta aceptada! Un asesor te contactará para la reserva.' : 'Contraoferta rechazada',
      action === 'accept' ? 'success' : 'muted'
    )
  }

  // ---- Documents ----
  // A simulated upload lands as "pending" (awaiting the agency's verification).
  const addDocument = ({ name, type, propertyId, size }) => {
    const doc = {
      id: `DOC-${Date.now()}`,
      name,
      type,
      kind: docTypeKind(type),
      propertyId: propertyId || null,
      status: 'pending',
      uploadedAt: '2026-09-11',
      size
    }
    setDocuments((prev) => [doc, ...prev])
    showToast('Documento subido · pendiente de verificación')
  }

  const deleteDocument = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    showToast('Documento eliminado', 'muted')
  }

  const toggleAlert = (id) => {
    const target = alerts.find((a) => a.id === id)
    if (!target) return
    const nowActive = !target.active
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: nowActive } : a)))
    showToast(nowActive ? 'Alerta activada' : 'Alerta pausada', nowActive ? 'success' : 'muted')
  }

  // Create (no id) or update (id present) from the alert form.
  const saveAlert = ({ id, name, criteria }) => {
    const cleanName = name.trim() || suggestAlertName(criteria)
    if (id) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, name: cleanName, criteria } : a)))
      showToast('Alerta actualizada')
    } else {
      const newAlert = { id: `A-${Date.now()}`, name: cleanName, criteria, active: true, seenIds: [] }
      setAlerts((prev) => [newAlert, ...prev])
      showToast('Alerta creada')
    }
    setAlertFormTarget(null)
  }

  const deleteAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    setAlertDeleteTarget(null)
    showToast('Alerta eliminada', 'muted')
  }

  // Open the matches viewer and mark every current match as reviewed → clears the
  // "nuevas" pill on the card and the red badge on the tab.
  const viewAlertMatches = (alert) => {
    const ids = matchProperties(alert.criteria).map((p) => p.id)
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, seenIds: ids } : a)))
    setAlertMatchesTarget(alert)
  }

  const payRent = (id) => {
    setPayingId(id)
    setTimeout(() => {
      setTenantData((prev) => ({
        ...prev,
        payments: prev.payments.map((p) =>
          p.id === id
            ? { ...p, status: 'paid', paidDate: '2026-09-11', method: 'MercadoPago' }
            : p
        )
      }))
      setPayingId(null)
      showToast('Pago registrado con MercadoPago')
    }, 800)
  }

  const createRepair = (data) => {
    const repair = {
      id: `REP-${Date.now()}`,
      title: data.title,
      description: data.description,
      urgency: data.urgency,
      status: 'requested',
      timeline: [{ label: 'Solicitada', date: '2026-09-11' }]
    }
    setTenantData((prev) => ({ ...prev, repairs: [repair, ...prev.repairs] }))
    setRepairFormOpen(false)
    showToast('Solicitud de reparación enviada')
  }

  // ---------- PHASE 1: LOGIN ----------
  if (!loggedIn) {
    return (
      <LoginScreen
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        submitting={submitting}
        onSubmit={handleLogin}
        onExit={onExit}
      />
    )
  }

  // ---------- PHASE 2: PORTAL ----------
  const role = ROLES[userRole]
  const RoleIcon = role.icon

  const sharedProps = { showToast, propById }

  // Offers awaiting the buyer's response (seller countered) → red badge on the tab.
  const pendingOffers = userRole === 'buyer' ? offers.filter((o) => o.status === 'counter').length : 0
  // Alerts with unreviewed matching listings → red badge on the Alertas tab.
  const newAlertMatches = userRole === 'buyer'
    ? alerts.reduce((sum, a) => sum + newMatchIds(a).length, 0)
    : 0
  const navBadges = { offers: pendingOffers, alerts: newAlertMatches }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-primary text-primary-contrast shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-semibold text-primary truncate hidden sm:inline">
              Mi Portal · Terranova
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold ml-1">
              <RoleIcon className="w-3.5 h-3.5" /> {role.label}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="p-2 rounded-lg hover:bg-surface-alt text-text transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <img src={role.user.avatar} alt={role.user.name} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-medium text-text">{role.user.name}</span>
            </div>

            <button
              onClick={changeProfile}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-text text-sm font-medium hover:bg-surface-alt transition-colors"
            >
              <Repeat className="w-4 h-4" /> <span className="hidden sm:inline">Cambiar perfil</span>
            </button>

            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-contrast text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:flex lg:gap-8">
        {/* Sidebar / tabs */}
        <nav className="lg:w-60 lg:shrink-0 mb-6 lg:mb-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {role.nav.map((item) => {
              const Icon = item.icon
              const active = activeSection === item.id
              const badge = navBadges[item.id] || 0
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'bg-primary text-primary-contrast' : 'text-text hover:bg-surface-alt'
                  }`}
                >
                  <Icon className="w-5 h-5" /> {item.label}
                  {badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-error text-white text-[11px] font-bold leading-none">
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.section key={`${userRole}-${activeSection}`} {...reveal}>
              {userRole === 'buyer' && (
                <BuyerSections
                  section={activeSection}
                  favorites={favorites}
                  onSelectProperty={onSelectProperty}
                  visits={visits}
                  onReschedule={(v) => setRescheduleTarget(v)}
                  onCancel={(v) => setCancelTarget(v)}
                  onMessageAgent={(v, agent) => setMessageTarget({ visit: v, agent })}
                  onSaveFeedback={saveVisitFeedback}
                  offers={offers}
                  onNewOffer={() => setOfferFormOpen(true)}
                  onCounterOffer={(o) => setCounterTarget(o)}
                  onOfferDecision={(o, action) => setDecisionTarget({ offer: o, action })}
                  documents={documents}
                  onUploadDocument={addDocument}
                  onDeleteDocument={deleteDocument}
                  alerts={alerts}
                  toggleAlert={toggleAlert}
                  openAlertForm={() => setAlertFormTarget('new')}
                  onEditAlert={(a) => setAlertFormTarget(a)}
                  onDeleteAlert={(a) => setAlertDeleteTarget(a)}
                  onViewMatches={viewAlertMatches}
                  showToast={showToast}
                />
              )}
              {userRole === 'tenant' && (
                <TenantSections
                  section={activeSection}
                  payments={tenantData.payments}
                  repairs={tenantData.repairs}
                  onPay={payRent}
                  payingId={payingId}
                  openRepairForm={() => setRepairFormOpen(true)}
                  {...sharedProps}
                />
              )}
              {userRole === 'owner' && (
                <OwnerSections section={activeSection} {...sharedProps} />
              )}
            </motion.section>
          </AnimatePresence>
        </main>
      </div>

      <AlertFormModal
        target={alertFormTarget}
        onClose={() => setAlertFormTarget(null)}
        onSave={saveAlert}
      />
      <AlertMatchesModal
        alert={alertMatchesTarget}
        onClose={() => setAlertMatchesTarget(null)}
        onSelectProperty={onSelectProperty}
      />
      <ConfirmDialog
        open={!!alertDeleteTarget}
        onClose={() => setAlertDeleteTarget(null)}
        onConfirm={() => alertDeleteTarget && deleteAlert(alertDeleteTarget.id)}
        title="Eliminar alerta"
        message={alertDeleteTarget ? `¿Seguro que querés eliminar “${alertDeleteTarget.name}”? Esta acción no se puede deshacer.` : ''}
        confirmLabel="Eliminar"
      />
      <RepairRequestModal
        open={repairFormOpen}
        onClose={() => setRepairFormOpen(false)}
        onCreate={createRepair}
      />
      <RescheduleVisitModal
        visit={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirm={rescheduleVisit}
      />
      <CancelVisitModal
        visit={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={cancelVisit}
      />
      <MessageAgentModal
        target={messageTarget}
        onClose={() => setMessageTarget(null)}
        onSend={(agentName) => {
          setMessageTarget(null)
          showToast(`Mensaje enviado a ${agentName}`)
        }}
      />
      <NewOfferModal
        open={offerFormOpen}
        onClose={() => setOfferFormOpen(false)}
        onCreate={createOffer}
        submitting={offerSubmitting}
        favorites={favorites}
      />
      <CounterOfferModal
        offer={counterTarget}
        onClose={() => setCounterTarget(null)}
        onConfirm={submitCounter}
        submitting={offerSubmitting}
      />
      <OfferDecisionModal
        target={decisionTarget}
        onClose={() => setDecisionTarget(null)}
        onConfirm={resolveOffer}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-surface border border-border shadow-medium"
          >
            <CheckCircle className={`w-5 h-5 ${toast.tone === 'muted' ? 'text-muted' : 'text-success'}`} />
            <span className="text-sm font-medium text-text">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// LOGIN
// ============================================================
function LoginScreen({ selectedRole, setSelectedRole, submitting, onSubmit, onExit }) {
  // Pre-fill credentials for a frictionless demo; email follows the selected role.
  const [email, setEmail] = useState(ROLES[selectedRole].user.email)
  const [password, setPassword] = useState('demo1234')

  useEffect(() => {
    setEmail(ROLES[selectedRole].user.email)
  }, [selectedRole])

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-medium p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2.5 rounded-xl bg-primary text-primary-contrast">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-primary leading-tight">Terranova</div>
            <div className="text-xs text-muted tracking-wide uppercase">Mi Portal</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-primary">Ingresá a tu portal</h1>
        <p className="text-sm text-muted mt-1 mb-6">
          Elegí tu perfil y accedé a un espacio pensado para vos.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-alt border border-border text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-alt border border-border text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Ingresás como…</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ROLE_ORDER.map((key) => {
                const r = ROLES[key]
                const Icon = r.icon
                const active = selectedRole === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedRole(key)}
                    aria-pressed={active}
                    className={`relative text-left rounded-xl border p-3.5 transition-colors ${
                      active
                        ? 'border-accent bg-accent/10 ring-2 ring-accent'
                        : 'border-border bg-surface-alt hover:border-accent/60'
                    }`}
                  >
                    <div className={`inline-flex p-2 rounded-lg mb-2 ${active ? 'bg-accent text-primary' : 'bg-surface text-primary'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-primary text-sm leading-tight">{r.title}</div>
                    <div className="text-xs text-muted mt-1">{r.desc}</div>
                    {active && (
                      <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-accent" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? 'Ingresando…' : `Ingresar como ${ROLES[selectedRole].label}`}
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-3">
          Demo: ingresá con cualquier email y contraseña.
        </p>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted">o</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          disabled
          className="w-full py-2.5 rounded-lg border border-border text-text font-medium flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
        >
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-surface-alt text-xs font-bold">G</span>
          Continuar con Google
        </button>

        <button
          type="button"
          onClick={onExit}
          className="w-full mt-5 text-sm text-muted hover:text-accent transition-colors"
        >
          Volver al sitio
        </button>
      </motion.div>
    </div>
  )
}

// ============================================================
// BUYER SECTIONS (interesado) — unchanged behaviour
// ============================================================
function BuyerSections({ section, favorites, onSelectProperty, visits, onReschedule, onCancel, onMessageAgent, onSaveFeedback, offers, onNewOffer, onCounterOffer, onOfferDecision, documents, onUploadDocument, onDeleteDocument, alerts, toggleAlert, openAlertForm, onEditAlert, onDeleteAlert, onViewMatches, showToast }) {
  const [favFilter, setFavFilter] = useState('all')
  const [expandedOffer, setExpandedOffer] = useState(null)
  const favProps = properties.filter((p) => favorites.favorites.includes(p.id))

  if (section === 'favorites') {
    // Group by operation so a renter sees their rentals distinctly from purchases.
    const saleFavs = favProps.filter((p) => p.operation === 'sale')
    const rentFavs = favProps.filter((p) => p.operation !== 'sale')
    const filters = [
      { id: 'all', label: 'Todas', count: favProps.length },
      { id: 'sale', label: 'Venta', count: saleFavs.length },
      { id: 'rent', label: 'Alquiler', count: rentFavs.length }
    ]
    const shown = favFilter === 'sale' ? saleFavs : favFilter === 'rent' ? rentFavs : favProps

    return (
      <>
        <SectionHeading title="Favoritos" subtitle="Las propiedades que guardaste para revisar más tarde." />
        {favProps.length === 0 ? (
          <EmptyState icon={Heart} title="Todavía no guardaste propiedades" text="Explorá el catálogo y tocá el corazón para guardarlas." />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <span className="text-sm text-muted">
                <span className="font-semibold text-text">{favProps.length}</span>{' '}
                {favProps.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}
              </span>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => {
                  const active = favFilter === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFavFilter(f.id)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        active ? 'bg-primary text-primary-contrast' : 'bg-surface-alt text-text hover:text-accent'
                      }`}
                    >
                      {f.label}
                      <span className={`text-xs ${active ? 'text-primary-contrast/80' : 'text-muted'}`}>{f.count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {shown.length === 0 ? (
              <EmptyState icon={Heart} title="Sin favoritos en esta categoría" text="Cambiá el filtro para ver el resto de tus propiedades guardadas." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {shown.map((p) => {
                  const isRent = p.operation !== 'sale'
                  return (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      isFavorite={favorites.isFavorite(p.id)}
                      onToggleFavorite={favorites.toggleFavorite}
                      onSelect={onSelectProperty}
                      footer={
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSelectProperty?.(p, 'schedule')}
                            className="flex-1 px-4 py-2.5 border border-primary text-primary text-xs font-semibold uppercase tracking-widest hover:bg-primary hover:text-primary-contrast transition-colors"
                          >
                            Agendar visita
                          </button>
                          <button
                            onClick={() =>
                              showToast?.(
                                isRent
                                  ? 'Enviamos tu consulta de alquiler. Te contactamos a la brevedad.'
                                  : 'Recibimos tu interés. Un asesor te contactará para tu oferta.'
                              )
                            }
                            className="flex-1 px-4 py-2.5 bg-gold text-primary text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
                          >
                            {isRent ? 'Consultar alquiler' : 'Hacer oferta'}
                          </button>
                        </div>
                      }
                    />
                  )
                })}
              </div>
            )}
          </>
        )}
      </>
    )
  }

  if (section === 'visits') {
    const upcoming = visits
      .filter(isUpcoming)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    const past = visits
      .filter((v) => !isUpcoming(v))
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    const pendingFeedback = past.filter((v) => v.status === 'completed' && !v.feedback).length

    return (
      <>
        <SectionHeading title="Mis visitas" subtitle="Tus visitas presenciales y videollamadas, con el detalle de cada propiedad y asesor." />

        {visits.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No tenés visitas agendadas" text="Cuando agendes una visita desde una propiedad, vas a poder seguirla y gestionarla acá." />
        ) : (
          <div className="space-y-8">
            <VisitGroup
              label="Próximas"
              icon={CalendarClock}
              count={upcoming.length}
              empty="No tenés visitas próximas."
              visits={upcoming}
              onReschedule={onReschedule}
              onCancel={onCancel}
              onMessageAgent={onMessageAgent}
              onSaveFeedback={onSaveFeedback}
            />
            <VisitGroup
              label="Anteriores"
              icon={Clock}
              count={past.length}
              badge={pendingFeedback > 0 ? `${pendingFeedback} sin calificar` : null}
              empty="Todavía no tenés visitas realizadas."
              visits={past}
              onReschedule={onReschedule}
              onCancel={onCancel}
              onMessageAgent={onMessageAgent}
              onSaveFeedback={onSaveFeedback}
            />
          </div>
        )}
      </>
    )
  }

  if (section === 'offers') {
    const pending = offers.filter((o) => o.status === 'counter').length
    return (
      <>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <SectionHeading title="Mis ofertas" subtitle="Seguí cada oferta, respondé contraofertas y presentá nuevas." />
          <button
            onClick={onNewOffer}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-4 h-4" /> Nueva oferta
          </button>
        </div>

        {pending > 0 && (
          <div className="flex items-center gap-2.5 rounded-xl border border-accent bg-surface-alt px-4 py-3 mb-5">
            <Handshake className="w-5 h-5 text-accent shrink-0" />
            <span className="text-sm text-text">
              Tenés <span className="font-semibold text-accent">{pending}</span>{' '}
              {pending === 1 ? 'contraoferta esperando' : 'contraofertas esperando'} tu respuesta.
            </span>
          </div>
        )}

        {offers.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="Todavía no presentaste ofertas"
            text="Cuando hagas una oferta por una propiedad, vas a poder seguir su estado y negociar desde acá."
          />
        ) : (
          <div className="space-y-4">
            {offers.map((o) => (
              <OfferCard
                key={o.id}
                offer={o}
                expanded={expandedOffer === o.id}
                onToggle={() => setExpandedOffer(expandedOffer === o.id ? null : o.id)}
                onCounter={onCounterOffer}
                onDecision={onOfferDecision}
              />
            ))}
          </div>
        )}
      </>
    )
  }

  if (section === 'documents') {
    return (
      <BuyerDocuments
        documents={documents}
        offers={offers}
        onUpload={onUploadDocument}
        onDelete={onDeleteDocument}
        showToast={showToast}
      />
    )
  }

  if (section === 'alerts') {
    const activeCount = alerts.filter((a) => a.active).length
    const totalNew = alerts.reduce((sum, a) => sum + newMatchIds(a).length, 0)
    return (
      <>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <SectionHeading title="Alertas" subtitle="Recibí avisos cuando aparezcan propiedades que coincidan con tus búsquedas." />
          <button
            onClick={openAlertForm}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-4 h-4" /> Crear nueva alerta
          </button>
        </div>

        {alerts.length === 0 ? (
          <EmptyState icon={BellRing} title="No tenés alertas todavía" text="Creá una alerta con tus criterios y te avisamos cuando aparezcan coincidencias." />
        ) : (
          <>
            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <StatPill label="Alertas" value={alerts.length} />
              <StatPill label="Activas" value={activeCount} tone="accent" />
              <StatPill label="Nuevas" value={totalNew} tone={totalNew > 0 ? 'error' : 'muted'} />
            </div>

            <div className="space-y-3">
              {alerts.map((a) => (
                <AlertCard
                  key={a.id}
                  alert={a}
                  onToggle={() => toggleAlert(a.id)}
                  onEdit={() => onEditAlert(a)}
                  onDelete={() => onDeleteAlert(a)}
                  onViewMatches={() => onViewMatches(a)}
                />
              ))}
            </div>
          </>
        )}
      </>
    )
  }

  return null
}

// ============================================================
// BUYER DOCUMENTS (I15) — grouped by property + requirements checklist + upload
// ============================================================
const KindIcon = ({ kind, className }) =>
  kind === 'img' ? <ImageIcon className={className} /> : <FileText className={className} />

// Mock file size suggested per document kind (no real file is read).
const KIND_SIZE = { img: '1.1 MB', pdf: '240 KB', doc: '320 KB' }

function BuyerDocuments({ documents, offers, onUpload, onDelete, showToast }) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [prefill, setPrefill] = useState(null)

  // Candidate properties = anything the buyer is dealing with (offers) or that
  // already has a document. Used both for grouping and the upload association.
  const candidateIds = [
    ...new Set([
      ...offers.map((o) => o.propertyId),
      ...documents.map((d) => d.propertyId).filter(Boolean)
    ])
  ]
  const candidateProps = candidateIds.map(propById).filter(Boolean)

  const propGroups = candidateProps
    .map((p) => ({ prop: p, docs: documents.filter((d) => d.propertyId === p.id) }))
    .filter((g) => g.docs.length > 0)
  const generalDocs = documents.filter((d) => !d.propertyId)

  const openUpload = (pre = null) => {
    setPrefill(pre)
    setUploadOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <SectionHeading title="Documentos" subtitle="Organizá tu documentación por operación y seguí el estado de verificación." />
        <button
          onClick={() => openUpload()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
        >
          <UploadCloud className="w-4 h-4" /> Subir documento
        </button>
      </div>

      {/* Requirements checklist */}
      <DocChecklist documents={documents} />

      {/* Upload dropzone */}
      <UploadDropzone onActivate={() => openUpload()} />

      {/* Document groups */}
      {documents.length === 0 ? (
        <EmptyState icon={FolderOpen} title="Todavía no subiste documentos" text="Subí tu documentación para avanzar con reservas, ofertas y operaciones." />
      ) : (
        <div className="space-y-6 mt-6">
          {propGroups.map((g) => (
            <DocGroup
              key={g.prop.id}
              icon={Building2}
              title={`Documentos para ${g.prop.title}`}
              subtitle={`${g.prop.neighborhood} · ${OPERATION_LABELS[g.prop.operation]}`}
              docs={g.docs}
              onDownload={(d) => showToast(`Descargando ${d.name}…`)}
              onReplace={(d) => openUpload({ type: d.type, propertyId: d.propertyId })}
              onDelete={onDelete}
            />
          ))}
          {generalDocs.length > 0 && (
            <DocGroup
              icon={FolderOpen}
              title="Documentos generales"
              subtitle="Documentación personal que aplica a cualquier operación"
              docs={generalDocs}
              onDownload={(d) => showToast(`Descargando ${d.name}…`)}
              onReplace={(d) => openUpload({ type: d.type, propertyId: null })}
              onDelete={onDelete}
            />
          )}
        </div>
      )}

      <UploadDocumentModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={onUpload}
        properties={candidateProps}
        prefill={prefill}
      />
    </>
  )
}

// Requirements checklist with a Compra / Alquiler toggle. A requirement is met
// when there are enough submitted (non-rejected) docs of that type.
function DocChecklist({ documents }) {
  const [op, setOp] = useState('purchase')
  const req = DOC_REQUIREMENTS[op]

  const evaluated = req.items.map((item) => {
    const need = item.count || 1
    const matches = documents.filter((d) => d.type === item.type)
    const have = matches.filter((d) => DOC_SUBMITTED.includes(d.status)).length
    const rejected = matches.some((d) => d.status === 'rejected') && have < need
    return { ...item, need, have, done: have >= need, rejected }
  })
  const doneCount = evaluated.filter((e) => e.done).length
  const total = evaluated.length
  const pct = Math.round((doneCount / total) * 100)

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" /> Requisitos de documentación
          </h3>
          <p className="text-xs text-muted mt-0.5">
            {doneCount} de {total} requisitos completos
          </p>
        </div>
        <div className="inline-flex rounded-lg bg-surface-alt border border-border p-0.5">
          {REQUIREMENT_ORDER.map((key) => (
            <button
              key={key}
              onClick={() => setOp(key)}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                op === key ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-text'
              }`}
            >
              {DOC_REQUIREMENTS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-surface-alt overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <ul className="space-y-2">
        {evaluated.map((e) => (
          <li key={e.type} className="flex items-center gap-3">
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${
                e.done ? 'bg-success text-white' : e.rejected ? 'bg-error text-white' : 'bg-surface-alt text-muted'
              }`}
            >
              {e.done ? <Check className="w-4 h-4" /> : e.rejected ? <X className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
            </span>
            <span className={`text-sm flex-1 ${e.done ? 'text-text' : 'text-muted'}`}>{e.label}</span>
            {e.need > 1 && (
              <span className={`text-xs font-semibold ${e.done ? 'text-success' : 'text-muted'}`}>
                {Math.min(e.have, e.need)}/{e.need}
              </span>
            )}
            {e.rejected && <span className="text-xs font-medium text-error">Rechazado</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

function UploadDropzone({ onActivate }) {
  const [drag, setDrag] = useState(false)
  return (
    <button
      type="button"
      onClick={onActivate}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        onActivate()
      }}
      className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        drag ? 'border-accent bg-surface-alt' : 'border-border bg-surface-alt/50 hover:border-accent/60'
      }`}
    >
      <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${drag ? 'text-accent' : 'text-muted'}`} />
      <p className="text-sm font-medium text-text">Arrastrá tus documentos aquí</p>
      <p className="text-xs text-muted mt-1">o hacé clic para seleccionar · PDF, JPG o PNG · hasta 5 MB</p>
    </button>
  )
}

function DocGroup({ icon: Icon, title, subtitle, docs, onDownload, onReplace, onDelete }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface-alt transition-colors"
      >
        <span className="p-2 rounded-lg bg-surface-alt text-accent shrink-0">
          <Icon className="w-4 h-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-primary truncate">{title}</span>
          <span className="block text-xs text-muted truncate">{subtitle}</span>
        </span>
        <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-surface-alt text-xs font-semibold text-text shrink-0">
          {docs.length}
        </span>
        <ChevronDown className={`w-5 h-5 text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-3">
              {docs.map((d) => (
                <BuyerDocCard
                  key={d.id}
                  doc={d}
                  onDownload={() => onDownload(d)}
                  onReplace={() => onReplace(d)}
                  onDelete={() => onDelete(d.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BuyerDocCard({ doc, onDownload, onReplace, onDelete }) {
  const st = DOC_STATUS[doc.status] || DOC_STATUS.uploaded
  const rejected = doc.status === 'rejected'
  return (
    <div className={`rounded-xl border p-4 ${rejected ? 'border-error bg-surface-alt' : 'border-border bg-surface'}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg shrink-0 ${rejected ? 'bg-surface-alt text-error' : 'bg-surface-alt text-primary'}`}>
          <KindIcon kind={doc.kind} className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-text truncate">{doc.name}</div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="px-2 py-0.5 rounded bg-surface-alt text-xs font-medium text-text">{docTypeLabel(doc.type)}</span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${st.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} /> {st.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> {formatDate(doc.uploadedAt)}</span>
            {doc.size && <span>{doc.size}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onDownload}
            aria-label="Descargar"
            className="p-2 rounded-lg hover:bg-surface-alt text-accent transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            aria-label="Eliminar"
            className="p-2 rounded-lg hover:bg-surface-alt text-muted hover:text-error transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {rejected && (
        <div className="mt-3 pl-1 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-text">{doc.rejectReason}</p>
            <button
              onClick={onReplace}
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-gold text-primary text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reemplazar documento
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function UploadDocumentModal({ open, onClose, onUpload, properties, prefill }) {
  const [type, setType] = useState('dni')
  const [propertyId, setPropertyId] = useState('')
  const [phase, setPhase] = useState('idle') // idle | picking | ready | uploading
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)

  // Reset each time the modal opens (honouring any prefill from "Reemplazar").
  useEffect(() => {
    if (!open) return
    setType(prefill?.type || 'dni')
    setPropertyId(prefill?.propertyId || '')
    setPhase('idle')
    setFileName('')
    setProgress(0)
  }, [open, prefill])

  // Keep the suggested filename in sync while the user is still choosing a type.
  useEffect(() => {
    if (phase === 'ready') setFileName(suggestedFileName(type))
  }, [type, phase])

  // Simulated "file picker": a short delay, then a file is "chosen".
  const pickFile = () => {
    setPhase('picking')
    setTimeout(() => {
      setFileName(suggestedFileName(type))
      setPhase('ready')
    }, 650)
  }

  // Progress animation while uploading; fires onUpload once it reaches 100%.
  useEffect(() => {
    if (phase !== 'uploading') return
    let pct = 0
    const id = setInterval(() => {
      pct = Math.min(100, pct + 12)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(id)
        setTimeout(() => {
          onUpload({ name: fileName, type, propertyId, size: KIND_SIZE[docTypeKind(type)] || '240 KB' })
          onClose()
        }, 350)
      }
    }, 140)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const startUpload = () => {
    if (phase !== 'ready') return
    setProgress(0)
    setPhase('uploading')
  }

  const busy = phase === 'picking' || phase === 'uploading'

  return (
    <ModalShell open={open} onClose={busy ? () => {} : onClose} icon={UploadCloud} title="Subir documento">
      <div className="p-5 md:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Tipo de documento</label>
            <select value={type} onChange={(e) => setType(e.target.value)} disabled={busy} className={fieldCls}>
              {BUYER_DOC_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Propiedad asociada</label>
            <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} disabled={busy} className={fieldCls}>
              <option value="">General (sin propiedad)</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* File area — changes with the flow phase */}
        {phase === 'ready' || phase === 'uploading' ? (
          <div className="rounded-xl border border-border bg-surface-alt p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-surface text-primary shrink-0">
                <KindIcon kind={docTypeKind(type)} className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-text truncate">{fileName}</div>
                <div className="text-xs text-muted">{KIND_SIZE[docTypeKind(type)] || '240 KB'}</div>
              </div>
              {phase === 'ready' && (
                <button onClick={pickFile} className="text-xs font-medium text-accent hover:underline shrink-0">
                  Cambiar
                </button>
              )}
            </div>
            {phase === 'uploading' && (
              <div className="mt-3">
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <div className="h-full rounded-full bg-accent transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo… {progress}%
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={pickFile}
            disabled={busy}
            className="w-full border-2 border-dashed border-border rounded-xl p-7 text-center bg-surface-alt/50 hover:border-accent/60 transition-colors disabled:opacity-60"
          >
            {phase === 'picking' ? (
              <>
                <Loader2 className="w-7 h-7 mx-auto text-accent mb-2 animate-spin" />
                <p className="text-sm font-medium text-text">Seleccionando archivo…</p>
              </>
            ) : (
              <>
                <Paperclip className="w-7 h-7 mx-auto text-muted mb-2" />
                <p className="text-sm font-medium text-text">Seleccionar archivo</p>
                <p className="text-xs text-muted mt-1">Simulado para la demo · no se sube nada real</p>
              </>
            )}
          </button>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={startUpload}
            disabled={phase !== 'ready'}
            className="flex-1 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Subir documento
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

// ============================================================
// BUYER VISITS — expanded cards (property + agent + feedback)
// ============================================================
function VisitGroup({ label, icon: Icon, count, badge, empty, visits, onReschedule, onCancel, onMessageAgent, onSaveFeedback }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <Icon className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{label}</h3>
        <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-surface-alt text-xs font-semibold text-text">{count}</span>
        {badge && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-warning/15 text-warning text-xs font-semibold">
            <Star className="w-3 h-3" /> {badge}
          </span>
        )}
        <div className="flex-1 h-px bg-border ml-1" />
      </div>
      {count === 0 ? (
        <p className="text-sm text-muted py-1">{empty}</p>
      ) : (
        <div className="space-y-4">
          {visits.map((v) => (
            <VisitCard
              key={v.id}
              visit={v}
              onReschedule={onReschedule}
              onCancel={onCancel}
              onMessageAgent={onMessageAgent}
              onSaveFeedback={onSaveFeedback}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function VisitCard({ visit, onReschedule, onCancel, onMessageAgent, onSaveFeedback }) {
  const prop = propById(visit.propertyId)
  const agent = agentById(visit.agentId)
  const st = VISIT_STATUS[visit.status]
  const TypeIcon = visit.type === 'video' ? Video : MapPin
  const upcoming = isUpcoming(visit)
  const completed = visit.status === 'completed'
  const cancelled = visit.status === 'cancelled'

  return (
    <motion.div layout className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft">
      <div className="sm:flex">
        {/* Property thumbnail */}
        <div className="relative sm:w-44 h-40 sm:h-auto shrink-0">
          <img src={prop?.images?.[0]} alt={prop?.title} className="w-full h-full object-cover" />
          {prop?.operation && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur">
              {OPERATION_LABELS[prop.operation]}
            </span>
          )}
        </div>

        <div className="p-5 flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-primary leading-snug">{prop?.title}</h3>
              <div className="inline-flex items-center gap-1.5 text-sm text-muted mt-1">
                <MapPin className="w-4 h-4 shrink-0" /> {prop?.address}, {prop?.neighborhood}
              </div>
              <div className="text-sm mt-1.5">
                <span className="font-semibold text-gold">{formatPrice(prop?.price, prop?.currency, prop?.operation)}</span>
                <span className="text-muted"> · {TYPE_LABELS[prop?.type]}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${st.cls}`}>{st.label}</span>
          </div>

          {/* Date / time / visit type */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-text">
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-accent" /> {formatDate(visit.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" /> {visit.time} hs
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted">
              <TypeIcon className="w-4 h-4" /> {visit.type === 'video' ? 'Videollamada' : 'Presencial'}
            </span>
            {visit.rescheduled && upcoming && (
              <span className="inline-flex items-center gap-1 text-xs text-info"><Repeat className="w-3.5 h-3.5" /> Reprogramada</span>
            )}
          </div>
        </div>
      </div>

      {/* Agent strip */}
      {agent && (
        <div className="px-5 py-4 border-t border-border bg-surface-alt/40">
          <div className="flex flex-wrap items-center gap-3">
            <img src={agent.photo} alt={agent.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted">Asesor asignado</div>
              <div className="font-medium text-text truncate">{agent.name}</div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <a
                href={`tel:${agent.phone.replace(/\s/g, '')}`}
                aria-label={`Llamar a ${agent.name}`}
                title={agent.phone}
                className="p-2 rounded-lg border border-border text-text hover:bg-surface hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${agent.email}`}
                aria-label={`Enviar email a ${agent.name}`}
                title={agent.email}
                className="p-2 rounded-lg border border-border text-text hover:bg-surface hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <button
                onClick={() => onMessageAgent(visit, agent)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-contrast text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <MessageSquare className="w-4 h-4" /> <span className="hidden sm:inline">Enviar mensaje</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer actions / states */}
      <div className="px-5 py-4 border-t border-border">
        {upcoming && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onReschedule(visit)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-surface-alt transition-colors"
            >
              <CalendarClock className="w-4 h-4" /> Reprogramar
            </button>
            <button
              onClick={() => onCancel(visit)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-error hover:bg-error/15 transition-colors"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        )}

        {completed && <VisitFeedback visit={visit} onSave={onSaveFeedback} />}

        {cancelled && (
          <div className="flex items-start gap-2 text-sm text-muted">
            <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <span>Visita cancelada{visit.cancelReason ? `: ${visit.cancelReason}` : '.'}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function StarRating({ value, onChange, readOnly }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
            className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          >
            <Star className={`w-5 h-5 transition-colors ${filled ? 'fill-current text-gold' : 'fill-none text-muted'}`} />
          </button>
        )
      })}
    </div>
  )
}

function VisitFeedback({ visit, onSave }) {
  const existing = visit.feedback
  const [editing, setEditing] = useState(!existing)
  const [rating, setRating] = useState(existing?.rating || 0)
  const [interest, setInterest] = useState(existing?.interest || null)
  const [note, setNote] = useState(existing?.note || '')

  // Re-sync the local form when the card switches to a different visit.
  useEffect(() => {
    setRating(existing?.rating || 0)
    setInterest(existing?.interest || null)
    setNote(existing?.note || '')
    setEditing(!existing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visit.id])

  if (existing && !editing) {
    return (
      <div className="rounded-xl bg-surface-alt/60 border border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StarRating value={existing.rating} readOnly />
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${existing.interest === 'interested' ? 'text-success' : 'text-muted'}`}>
              {existing.interest === 'interested'
                ? <><ThumbsUp className="w-4 h-4" /> Me interesa</>
                : <><ThumbsDown className="w-4 h-4" /> No me interesa</>}
            </span>
          </div>
          <button onClick={() => setEditing(true)} className="text-sm font-medium text-accent hover:underline">Editar</button>
        </div>
        {existing.note && <p className="text-sm text-muted mt-2 italic">“{existing.note}”</p>}
      </div>
    )
  }

  const valid = rating > 0 && interest
  const submit = () => {
    if (!valid) return
    onSave(visit.id, { rating, interest, note: note.trim() })
    setEditing(false)
  }

  return (
    <div className="rounded-xl bg-surface-alt/60 border border-border p-4 space-y-3">
      <div className="flex items-center gap-1.5 text-sm font-medium text-text">
        <Star className="w-4 h-4 text-accent" /> ¿Qué te pareció la propiedad?
      </div>
      <StarRating value={rating} onChange={setRating} />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setInterest('interested')}
          aria-pressed={interest === 'interested'}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            interest === 'interested' ? 'border-success bg-success/15 text-success' : 'border-border text-text hover:bg-surface'
          }`}
        >
          <ThumbsUp className="w-4 h-4" /> Me interesa
        </button>
        <button
          onClick={() => setInterest('not-interested')}
          aria-pressed={interest === 'not-interested'}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            interest === 'not-interested' ? 'border-error bg-error/15 text-error' : 'border-border text-text hover:bg-surface'
          }`}
        >
          <ThumbsDown className="w-4 h-4" /> No me interesa
        </button>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Nota (opcional): ¿qué te gustó o qué no?"
        className={`${fieldCls} resize-none`}
      />
      <div className="flex justify-end gap-2">
        {existing && (
          <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-surface transition-colors">
            Cancelar
          </button>
        )}
        <button
          onClick={submit}
          disabled={!valid}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4" /> Guardar feedback
        </button>
      </div>
    </div>
  )
}

// ============================================================
// BUYER OFFERS — expandable cards (property + negotiation timeline)
// ============================================================
function OfferCard({ offer, expanded, onToggle, onCounter, onDecision }) {
  const prop = propById(offer.propertyId)
  const st = OFFER_STATUS[offer.status]
  const cond = OFFER_CONDITIONS[offer.condition]
  const CondIcon = cond?.icon || Banknote
  const myAmount = buyerAmount(offer)
  const counter = sellerCounter(offer)
  const firstDate = offer.history[0]?.date
  const lastDate = offer.history[offer.history.length - 1]?.date

  return (
    <motion.div layout className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft">
      {/* Collapsed header — click to expand */}
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full text-left flex items-center gap-4 p-4 hover:bg-surface-alt transition-colors"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
          <img src={prop?.images?.[0]} alt={prop?.title} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-primary truncate">{prop?.title}</h3>
          <div className="text-sm mt-0.5">
            <span className="text-muted">Tu oferta: </span>
            <span className="font-semibold text-gold">
              {myAmount != null ? formatPrice(myAmount, offer.currency, 'sale') : '—'}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted mt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" /> {prop?.neighborhood}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
          {offer.status === 'counter' && (
            <span className="text-xs font-medium text-accent">Respuesta pendiente</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-muted shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-5 space-y-6">
              {/* Property + my offer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-surface-alt border border-border overflow-hidden">
                  <img src={prop?.images?.[0]} alt={prop?.title} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <div className="text-xs text-muted uppercase tracking-wider">Propiedad</div>
                    <div className="font-medium text-text mt-0.5">{prop?.title}</div>
                    <div className="inline-flex items-center gap-1.5 text-sm text-muted mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" /> {prop?.address}, {prop?.neighborhood}
                    </div>
                    <div className="text-sm mt-1.5">
                      <span className="text-muted">Precio publicado: </span>
                      <span className="font-semibold text-primary">{formatPrice(prop?.price, prop?.currency, 'sale')}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-surface-alt border border-border p-4">
                  <div className="text-xs text-muted uppercase tracking-wider">Mi oferta</div>
                  <div className="text-2xl font-bold text-gold mt-1">
                    {myAmount != null ? formatPrice(myAmount, offer.currency, 'sale') : '—'}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Info label="Condición" value={<span className="inline-flex items-center gap-1.5"><CondIcon className="w-4 h-4" /> {cond?.label}</span>} />
                    <Info label="Validez" value={`${offer.validityDays} días`} />
                    <Info label="Presentada" value={formatDate(firstDate)} />
                    <Info label="Último movimiento" value={formatDate(lastDate)} />
                  </div>
                </div>
              </div>

              {/* Status stepper */}
              <OfferStepper status={offer.status} />

              {/* Negotiation timeline */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-accent" />
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">Historial de la negociación</h4>
                </div>
                <OfferTimeline offer={offer} />
              </div>

              {/* Pending counter → decision actions */}
              {offer.status === 'counter' && counter != null && (
                <div className="rounded-xl border border-accent bg-surface-alt p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider">Contraoferta del propietario</div>
                      <div className="text-xl font-bold text-accent mt-0.5">{formatPrice(counter, offer.currency, 'sale')}</div>
                    </div>
                    <Handshake className="w-8 h-8 text-accent shrink-0" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => onDecision(offer, 'accept')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <ThumbsUp className="w-4 h-4" /> Aceptar
                    </button>
                    <button
                      onClick={() => onCounter(offer)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <ArrowLeftRight className="w-4 h-4" /> Contraofertar
                    </button>
                    <button
                      onClick={() => onDecision(offer, 'reject')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-error text-sm font-semibold hover:bg-surface transition-colors"
                    >
                      <X className="w-4 h-4" /> Rechazar
                    </button>
                  </div>
                </div>
              )}

              {offer.status === 'accepted' && (
                <div className="rounded-xl border border-success bg-surface-alt p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                  <div className="text-sm text-text">
                    <span className="font-semibold text-success">¡Oferta aceptada!</span> Acordaron{' '}
                    <span className="font-semibold">{myAmount != null ? formatPrice(myAmount, offer.currency, 'sale') : '—'}</span>.
                    Un asesor te contactará para avanzar con la reserva.
                  </div>
                </div>
              )}

              {offer.status === 'rejected' && (
                <div className="rounded-xl border border-border bg-surface-alt p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-error mt-0.5 shrink-0" />
                  <div className="text-sm text-muted">
                    Esta oferta fue rechazada. Podés presentar una nueva oferta cuando quieras.
                  </div>
                </div>
              )}

              {(offer.status === 'sent' || offer.status === 'review') && (
                <div className="inline-flex items-center gap-2 text-sm text-muted">
                  <Clock className="w-4 h-4" /> Esperando la respuesta del propietario.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Compact horizontal stepper: Enviada → En revisión → Contraoferta → Resolución.
function OfferStepper({ status }) {
  const current = OFFER_STATUS[status].step
  const finalTone = status === 'accepted' ? 'success' : status === 'rejected' ? 'error' : null
  const steps = [
    'Enviada',
    'En revisión',
    'Contraoferta',
    status === 'accepted' ? 'Aceptada' : status === 'rejected' ? 'Rechazada' : 'Resolución'
  ]
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((label, i) => {
        const n = i + 1
        const reached = n <= current
        const isFinal = n === 4
        const cls =
          isFinal && finalTone && reached
            ? finalTone === 'success'
              ? 'bg-success text-white'
              : 'bg-error text-white'
            : reached
              ? 'bg-accent text-primary'
              : 'bg-surface-alt text-muted'
        return (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
              {reached && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
              {label}
            </span>
            {i < steps.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-muted shrink-0" />}
          </div>
        )
      })}
    </div>
  )
}

// Vertical timeline of every move in the negotiation.
function OfferTimeline({ offer }) {
  return (
    <ol className="relative border-l-2 border-border ml-1.5 space-y-4">
      {offer.history.map((e, i) => {
        const isBuyer = e.actor === 'buyer'
        const dotCls = e.accepted ? 'bg-success' : e.rejected ? 'bg-error' : isBuyer ? 'bg-gold' : 'bg-accent'
        const who = isBuyer
          ? e.accepted
            ? 'Aceptaste la contraoferta'
            : e.rejected
              ? 'Rechazaste la contraoferta'
              : i === 0
                ? 'Tu oferta'
                : 'Tu contraoferta'
          : e.rejected
            ? 'El propietario rechazó'
            : e.accepted
              ? 'El propietario aceptó'
              : 'Contraoferta del propietario'
        return (
          <li key={i} className="ml-5 relative">
            <span className={`absolute -left-[26px] top-1 w-3 h-3 rounded-full ring-4 ring-surface ${dotCls}`} />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-sm font-medium text-text">{who}</span>
              <span className="text-xs text-muted">{formatDate(e.date)}</span>
            </div>
            {e.amount != null && (
              <div className={`text-sm font-semibold mt-0.5 ${isBuyer ? 'text-gold' : 'text-accent'}`}>
                {formatPrice(e.amount, offer.currency, 'sale')}
              </div>
            )}
            {e.note && <p className="text-sm text-muted mt-0.5">{e.note}</p>}
          </li>
        )
      })}
    </ol>
  )
}

// ============================================================
// TENANT SECTIONS (inquilino)
// ============================================================
// ARS amount without the "/mes" suffix — used across the tenant financial views.
const arsMoney = (n) => formatPrice(n, 'ARS', 'sale')

function TenantSections({ section, payments, repairs, onPay, payingId, openRepairForm, showToast, propById }) {
  if (section === 'contract') return <TenantContract showToast={showToast} propById={propById} />
  if (section === 'payments') return <TenantPayments payments={payments} onPay={onPay} payingId={payingId} showToast={showToast} />
  if (section === 'adjustment') return <TenantAdjustment showToast={showToast} />
  if (section === 'documents') return <TenantDocuments showToast={showToast} />
  if (section === 'repairs') return <TenantRepairs repairs={repairs} openRepairForm={openRepairForm} />
  return null
}

function TenantContract({ showToast, propById }) {
  const c = TENANT_CONTRACT
  const prop = propById(c.propertyId)
  const pct = Math.round((c.monthsElapsed / c.termMonths) * 100)
  const remaining = c.termMonths - c.monthsElapsed

  return (
    <>
      <SectionHeading title="Mi contrato" subtitle="Los datos de tu locación vigente." />
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft">
        <div className="sm:flex">
          <div className="sm:w-56 h-40 sm:h-auto shrink-0">
            <img src={prop?.images?.[0]} alt={prop?.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success text-white text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Contrato vigente
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-alt text-accent text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> Ajuste {c.index}
              </span>
            </div>
            <h3 className="font-semibold text-primary text-lg mt-2">{prop?.title}</h3>
            <div className="inline-flex items-center gap-1.5 text-sm text-muted mt-1">
              <MapPin className="w-4 h-4" /> {prop?.address}, {prop?.neighborhood}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Info label="Alquiler actual" value={formatPrice(c.currentRent, c.currency, 'rent')} strong />
              <Info label="Depósito" value={arsMoney(c.deposit)} />
              <Info label="Inicio" value={formatDate(c.startDate)} />
              <Info label="Vencimiento" value={formatDate(c.endDate)} />
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted">Mes {c.monthsElapsed} de {c.termMonths}</span>
            <span className="font-semibold text-accent">Restan {remaining} meses</span>
          </div>
          <div className="h-2.5 rounded-full bg-surface-alt overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full bg-accent rounded-full"
            />
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Calendar className="w-4 h-4 text-accent shrink-0" />
            Próximo ajuste el <span className="font-semibold text-text">{formatDate(c.nextAdjustDate)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h4 className="font-semibold text-primary mb-3">Cláusulas principales</h4>
          <ul className="space-y-2.5">
            {c.clauses.map((cl) => (
              <li key={cl.label} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-muted">{cl.label}</span>
                <span className="text-text font-medium text-right">{cl.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col">
          <h4 className="font-semibold text-primary mb-3">Datos del propietario</h4>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-surface-alt text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-text">{c.landlordName}</div>
              <div className="text-sm text-muted">{c.agency}</div>
            </div>
          </div>
          <div className="mt-auto pt-5">
            <button
              onClick={() => showToast('Descargando contrato…')}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" /> Descargar contrato
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function TenantPayments({ payments, onPay, payingId, showToast }) {
  const [receipt, setReceipt] = useState(null)
  const pending = payments.find((p) => p.status === 'pending')
  const overdueDays = pending ? daysLate(pending.dueDate) : 0
  const interest = pending && overdueDays > 0 ? Math.round(pending.amount * 0.001 * overdueDays) : 0
  const totalDue = pending ? pending.amount + interest : 0
  const paidTotal = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

  return (
    <>
      <SectionHeading title="Pagos" subtitle="Tus pagos de alquiler de los últimos 12 meses." />

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Alquiler actual" value={arsMoney(TENANT_CONTRACT.currentRent)} sub="Vigente este período" icon={CreditCard} />
        <StatCard label="Pagado (12 meses)" value={arsMoney(paidTotal)} sub={`${payments.filter((p) => p.status === 'paid').length} pagos registrados`} icon={Wallet} />
        <StatCard
          label={pending ? 'Próximo vencimiento' : 'Estado'}
          value={pending ? formatDate(pending.dueDate) : 'Al día'}
          sub={pending ? pending.period : 'Sin pagos pendientes'}
          icon={Calendar}
          accent={!!pending}
        />
      </div>

      {/* Summary — al día / deuda (solid fills; alpha over theme colors is a no-op here) */}
      <div className={`rounded-2xl p-5 mb-6 border bg-surface-alt ${pending ? 'border-warning' : 'border-success'}`}>
        {pending ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-warning font-semibold">
                <AlertTriangle className="w-5 h-5" />
                {overdueDays > 0 ? `Pago atrasado · ${overdueDays} ${overdueDays === 1 ? 'día' : 'días'} de mora` : 'Tenés un pago pendiente'}
              </div>
              <div className="text-sm text-muted mt-1">
                {pending.period} · vence {formatDate(pending.dueDate)}
              </div>
              {interest > 0 && (
                <div className="text-sm text-muted mt-0.5">
                  Alquiler {arsMoney(pending.amount)} + interés {arsMoney(interest)}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{arsMoney(totalDue)}</div>
              <button
                onClick={() => onPay(pending.id)}
                disabled={payingId === pending.id}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {payingId === pending.id ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Procesando…</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pagar con MercadoPago</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-success font-semibold">
            <CheckCircle className="w-5 h-5" /> Estás al día con tus pagos
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {payments.map((p) => {
          const paid = p.status === 'paid'
          return (
            <div key={p.id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg shrink-0 bg-surface-alt ${paid ? 'text-success' : 'text-warning'}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-text">{p.period}</div>
                <div className="text-sm text-muted mt-0.5">
                  {paid ? `Pagado el ${formatDate(p.paidDate)} · ${p.method}` : `Vence ${formatDate(p.dueDate)}`}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-primary">{arsMoney(p.amount)}</div>
                {paid ? (
                  <button
                    onClick={() => setReceipt(p)}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    <Receipt className="w-3.5 h-3.5" /> Ver recibo
                  </button>
                ) : (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning text-white">
                    Pendiente
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} showToast={showToast} />
    </>
  )
}

function TenantAdjustment({ showToast }) {
  const a = TENANT_ADJUSTMENT
  const diff = a.estimatedRent - a.currentRent
  const pct = ((diff / a.currentRent) * 100).toFixed(1)
  // Headroom so the tallest bar leaves room for its value label above it.
  const max = Math.max(...RENT_PROJECTION.map((h) => h.amount)) * 1.16

  return (
    <>
      <SectionHeading title="Próximo ajuste" subtitle="Cómo evoluciona tu alquiler según el índice de tu contrato — la misma proyección que ve la inmobiliaria." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Índice del contrato" value={a.index} sub={`${a.monthlyPct}% mensual · dato al ${formatDate(a.indexDate)}`} icon={TrendingUp} />
        <StatCard label="Alquiler actual" value={arsMoney(a.currentRent)} sub="Vigente este período" icon={CreditCard} />
        <StatCard
          label="Estimado post-ajuste"
          value={arsMoney(a.estimatedRent)}
          sub={`+${pct}% · desde ${formatDate(a.nextAdjustDate)}`}
          icon={Wallet}
          accent
        />
      </div>

      <div className="rounded-2xl border border-warning bg-surface-alt p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm text-text">
          Tu próximo ajuste es el <span className="font-semibold">{formatDate(a.nextAdjustDate)}</span>. Aplicando el
          índice <span className="font-semibold">{a.index}</span> (+{a.periodPct}% en el trimestre), el alquiler pasaría de{' '}
          {arsMoney(a.currentRent)} a <span className="font-semibold text-primary">{arsMoney(a.estimatedRent)}</span> (estimado).
        </div>
      </div>

      {/* Rent evolution — past / current / projected. Solid fills only. */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h4 className="font-semibold text-primary">Evolución del alquiler</h4>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary" /> Pagado</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent" /> Actual</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-surface-alt border border-accent" /> Proyectado</span>
          </div>
        </div>
        <div className="flex items-end gap-1.5 sm:gap-2 h-56">
          {RENT_PROJECTION.map((h, i) => {
            const barCls =
              h.state === 'current' ? 'bg-accent'
                : h.state === 'future' ? 'bg-surface-alt border border-accent'
                  : 'bg-primary'
            return (
              <div key={h.period} className="flex-1 h-full flex flex-col items-center min-w-0">
                <div className="flex-1 w-full flex flex-col justify-end items-center gap-1">
                  <span className={`text-[9px] sm:text-[11px] font-medium ${h.state === 'future' ? 'text-muted' : 'text-text'}`}>{Math.round(h.amount / 1000)}k</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(h.amount / max) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                    className={`w-full rounded-t-md min-h-[4px] ${barCls}`}
                  />
                </div>
                <span className="mt-2 text-[8px] sm:text-[10px] text-muted truncate w-full text-center">{h.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Index comparison — what the next adjustment would look like under each index */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h4 className="font-semibold text-primary mb-1">Comparación de índices</h4>
        <p className="text-sm text-muted mb-4">Cuánto sería tu próximo ajuste trimestral según cada índice, partiendo de {arsMoney(a.currentRent)}.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TENANT_INDEX_COMPARISON.map((ix) => (
            <div
              key={ix.id}
              className={`rounded-xl p-4 border ${ix.isContract ? 'border-accent bg-surface-alt' : 'border-border bg-surface'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-primary">{ix.id}</span>
                {ix.isContract && (
                  <span className="px-2 py-0.5 rounded-full bg-accent text-primary text-[10px] font-bold uppercase tracking-wide">Tu índice</span>
                )}
              </div>
              <div className="text-lg font-bold text-text mt-2">{arsMoney(ix.estimatedRent)}</div>
              <div className="text-xs font-semibold text-warning mt-0.5">+{ix.pct}% en el trimestre</div>
              <p className="text-[11px] text-muted mt-2 leading-snug">{ix.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => showToast('Consulta enviada a la inmobiliaria')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-surface-alt transition-colors"
          >
            <Mail className="w-4 h-4" /> Consultar el ajuste
          </button>
        </div>
      </div>
    </>
  )
}

function TenantRepairs({ repairs, openRepairForm }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <SectionHeading title="Reparaciones" subtitle="Tus solicitudes de mantenimiento y su estado." />
        <button
          onClick={openRepairForm}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" /> Solicitar reparación
        </button>
      </div>

      {repairs.length === 0 ? (
        <EmptyState icon={Wrench} title="No tenés solicitudes" text="Cuando reportes un desperfecto, vas a poder seguir su estado acá." />
      ) : (
        <div className="space-y-4">
          {repairs.map((r) => {
            const st = REPAIR_STATUS[r.status] || REPAIR_STATUS.requested
            const urg = REPAIR_URGENCIES.find((u) => u.id === r.urgency)
            return (
              <div key={r.id} className="bg-surface border border-border rounded-xl p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-primary">{r.title}</h3>
                    <p className="text-sm text-muted mt-1">{r.description}</p>
                    <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded bg-surface-alt text-xs font-medium text-text">
                      <span className={`w-2 h-2 rounded-full ${urg?.dot || 'bg-muted'}`} /> Urgencia: {urg?.label || '—'}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
                </div>
                {/* Timeline */}
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {r.timeline.map((t, i) => {
                    const done = i === r.timeline.length - 1 && r.status !== 'resolved'
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${done ? 'bg-accent animate-pulse' : 'bg-accent'}`} />
                        <span className="text-text font-medium">{t.label}</span>
                        <span className="text-muted">{formatDate(t.date)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

// ---------- Tenant documents: contract & guarantees + monthly rent receipts ----------
function TenantDocuments({ showToast }) {
  const [receipt, setReceipt] = useState(null)

  return (
    <>
      <SectionHeading title="Documentos" subtitle="Tu documentación del alquiler y los recibos de pago." />

      <div className="mb-7">
        <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-accent" /> Contrato y garantías
        </h4>
        <div className="space-y-3">
          {TENANT_DOCUMENTS.map((d) => (
            <DocRow key={d.id} doc={d} showToast={showToast} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-accent" /> Recibos de pago
          <span className="text-xs font-normal text-muted">({TENANT_RECEIPTS.length})</span>
        </h4>
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {TENANT_RECEIPTS.map((rc) => (
            <div key={rc.id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-lg shrink-0 bg-surface-alt text-accent">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-text truncate">{rc.name}</div>
                <div className="text-sm text-muted mt-0.5">{arsMoney(rc.amount)} · {rc.method}</div>
              </div>
              <button
                onClick={() => setReceipt(rc)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-accent hover:bg-surface-alt transition-colors shrink-0"
              >
                <Eye className="w-4 h-4" /> Ver
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-surface-alt/50">
        <Upload className="w-8 h-8 mx-auto text-muted mb-2" />
        <p className="text-sm font-medium text-text">Arrastrá o subí un documento</p>
        <p className="text-xs text-muted mt-1">PDF, JPG o PNG · hasta 5 MB</p>
      </div>

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} showToast={showToast} />
    </>
  )
}

// PDF-style rent receipt, reused by the payments list and the documents section.
function ReceiptModal({ receipt, onClose, showToast }) {
  const prop = propById(TENANT_CONTRACT.propertyId)
  const c = TENANT_CONTRACT
  return (
    <ModalShell open={!!receipt} onClose={onClose} icon={Receipt} title="Recibo de alquiler" maxW="max-w-md">
      {receipt && (
        <div className="p-5 md:p-6">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-primary text-primary-contrast px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-bold leading-tight">{c.agency}</div>
                <div className="text-xs opacity-80">Recibo de alquiler</div>
              </div>
              <Building2 className="w-7 h-7 opacity-90" />
            </div>
            <div className="p-5 space-y-2.5 text-sm">
              <ReceiptRow label="Recibo N°" value={receipt.id} />
              <ReceiptRow label="Período" value={receipt.period} />
              <ReceiptRow label="Inquilino" value={MOCK_TENANT.name} />
              <ReceiptRow label="Propietario" value={c.landlordName} />
              <ReceiptRow label="Inmueble" value={prop?.title || '—'} />
              <ReceiptRow label="Medio de pago" value={receipt.method || '—'} />
              <ReceiptRow label="Fecha de pago" value={formatDate(receipt.paidDate)} />
              <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
                <span className="text-muted">Alquiler</span>
                <span className="text-text font-medium">{arsMoney(receipt.amount)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold">
                <span className="text-text">Total pagado</span>
                <span className="text-accent">{arsMoney(receipt.amount)}</span>
              </div>
              <p className="text-[11px] text-muted pt-2 leading-snug">
                Documento sin validez fiscal. Comprobante generado por {c.agency} a modo de constancia de pago.
              </p>
            </div>
          </div>
          <button
            onClick={() => { showToast('Recibo descargado'); onClose() }}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" /> Descargar PDF
          </button>
        </div>
      )}
    </ModalShell>
  )
}

function ReceiptRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-text font-medium text-right truncate">{value}</span>
    </div>
  )
}

// ============================================================
// OWNER SECTIONS (propietario)
// ============================================================
function OwnerSections({ section, showToast, propById }) {
  if (section === 'properties') return <OwnerProperties propById={propById} />
  if (section === 'liquidations') return <OwnerLiquidations showToast={showToast} />
  if (section === 'documents') return <OwnerDocuments propById={propById} showToast={showToast} />
  if (section === 'collection') return <OwnerCollection propById={propById} />
  return null
}

function OwnerProperties({ propById }) {
  return (
    <>
      <SectionHeading title="Mis propiedades" subtitle="Tu cartera en alquiler y su estado actual." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {OWNER_PROPERTIES.map((item) => {
          const prop = propById(item.propertyId)
          const st = PROPERTY_RENTAL_STATUS[item.status] || PROPERTY_RENTAL_STATUS.rented
          const net = item.status === 'rented' ? item.rent - item.monthlyExpenses - Math.round(item.rent * item.commissionPct / 100) : 0
          return (
            <div key={item.propertyId} className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft">
              <div className="relative h-40">
                <img src={prop?.images?.[0]} alt={prop?.title} className="w-full h-full object-cover" />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-primary">{prop?.title}</h3>
                <div className="inline-flex items-center gap-1.5 text-sm text-muted mt-1">
                  <MapPin className="w-4 h-4" /> {prop?.address}, {prop?.neighborhood}
                </div>

                {item.status === 'rented' ? (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Info label="Inquilino" value={item.tenant} />
                    <Info label="Desde" value={formatDate(item.since)} />
                    <Info label="Alquiler" value={formatPrice(item.rent, item.currency, 'rent')} strong />
                    <Info label="Vence contrato" value={formatDate(item.contractEnd)} />
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg bg-surface-alt border border-border p-3 text-sm text-muted">
                    Unidad disponible. Último inquilino: {item.history?.[0]?.tenant || '—'}.
                  </div>
                )}

                {item.status === 'rented' && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted">Neto estimado / mes</span>
                    <span className="font-semibold text-success">{formatPrice(net, item.currency).replace('/mes', '')}</span>
                  </div>
                )}

                {item.history?.length > 0 && (
                  <details className="mt-3 group">
                    <summary className="cursor-pointer text-sm font-medium text-accent inline-flex items-center gap-1">
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                      Historial de inquilinos ({item.history.length})
                    </summary>
                    <ul className="mt-2 space-y-1.5 pl-5">
                      {item.history.map((h, i) => (
                        <li key={i} className="text-sm text-muted flex items-center justify-between gap-3">
                          <span className="text-text">{h.tenant}</span>
                          <span>{formatDate(h.from)} – {formatDate(h.to)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function OwnerLiquidations({ showToast }) {
  const year = OWNER_LIQUIDATIONS.reduce(
    (acc, l) => ({
      collected: acc.collected + l.collected,
      commission: acc.commission + l.commission,
      expenses: acc.expenses + l.expenses,
      net: acc.net + l.net
    }),
    { collected: 0, commission: 0, expenses: 0, net: 0 }
  )

  return (
    <>
      <SectionHeading title="Liquidaciones" subtitle="El detalle mensual de lo que recibís por tus propiedades." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Cobrado (3 meses)" value={formatPrice(year.collected, 'ARS').replace('/mes', '')} icon={Wallet} />
        <StatCard label="Comisión" value={formatPrice(year.commission, 'ARS').replace('/mes', '')} icon={DollarSign} />
        <StatCard label="Gastos" value={formatPrice(year.expenses, 'ARS').replace('/mes', '')} icon={FileText} />
        <StatCard label="Neto" value={formatPrice(year.net, 'ARS').replace('/mes', '')} icon={TrendingUp} accent />
      </div>

      <div className="space-y-3">
        {OWNER_LIQUIDATIONS.map((l) => {
          const settled = l.status === 'settled'
          return (
            <div key={l.id} className="bg-surface border border-border rounded-xl p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-primary">{l.period}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${settled ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                      {settled ? 'Liquidada' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="text-sm text-muted mt-1">Neto a cobrar</div>
                  <div className="text-xl font-bold text-primary">{formatPrice(l.net, 'ARS').replace('/mes', '')}</div>
                </div>
                <button
                  onClick={() => showToast(`PDF de ${l.period} generado`)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-surface-alt transition-colors"
                >
                  <Download className="w-4 h-4" /> Descargar PDF
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border text-sm">
                <div>
                  <div className="text-muted">Cobrado</div>
                  <div className="font-semibold text-text">{formatPrice(l.collected, 'ARS').replace('/mes', '')}</div>
                </div>
                <div>
                  <div className="text-muted">Comisión</div>
                  <div className="font-semibold text-text">−{formatPrice(l.commission, 'ARS').replace('/mes', '')}</div>
                </div>
                <div>
                  <div className="text-muted">Gastos</div>
                  <div className="font-semibold text-text">−{formatPrice(l.expenses, 'ARS').replace('/mes', '')}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function OwnerCollection({ propById }) {
  const expected = OWNER_COLLECTION.filter((c) => c.status !== 'vacant').reduce((s, c) => s + c.amount, 0)
  const collected = OWNER_COLLECTION.filter((c) => c.status === 'collected').reduce((s, c) => s + c.amount, 0)
  const pct = expected ? Math.round((collected / expected) * 100) : 0
  const max = Math.max(...OWNER_COLLECTION_HISTORY.map((h) => h.expected))

  return (
    <>
      <SectionHeading title="Estado de cobro" subtitle="El cobro del mes en curso, propiedad por propiedad." />

      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm text-muted">Cobrado este mes</div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(collected, 'ARS').replace('/mes', '')}
              <span className="text-base font-medium text-muted"> / {formatPrice(expected, 'ARS').replace('/mes', '')}</span>
            </div>
          </div>
          <span className="text-lg font-bold text-accent">{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-surface-alt overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="h-full bg-success rounded-full"
          />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {OWNER_COLLECTION.map((c) => {
          const prop = propById(c.propertyId)
          const st = COLLECTION_STATUS[c.status] || COLLECTION_STATUS.pending
          const late = c.status === 'overdue'
          return (
            <div key={c.propertyId} className={`bg-surface border rounded-xl p-4 flex flex-wrap items-center gap-4 ${late ? 'border-error/40' : 'border-border'}`}>
              <img src={prop?.images?.[0]} alt={prop?.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-text truncate">{prop?.title}</div>
                <div className="text-sm text-muted">{c.tenant || 'Sin inquilino'}{c.dueDate ? ` · vence ${formatDate(c.dueDate)}` : ''}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-primary">{formatPrice(c.amount, 'ARS').replace('/mes', '')}</div>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h4 className="font-semibold text-primary mb-4">Cobros · últimos 6 meses</h4>
        <div className="flex items-end gap-2 sm:gap-3 h-44">
          {OWNER_COLLECTION_HISTORY.map((h, i) => {
            const full = h.collected >= h.expected
            return (
              <div key={h.period} className="flex-1 h-full flex flex-col items-center min-w-0">
                <div className="flex-1 w-full flex flex-col justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(h.collected / max) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                    className={`w-full rounded-t-md min-h-[4px] ${full ? 'bg-success' : 'bg-warning'}`}
                  />
                </div>
                <span className="mt-2 text-xs text-muted">{h.period}</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-success" /> Cobrado completo</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warning" /> Cobro parcial</span>
        </div>
      </div>
    </>
  )
}

function OwnerDocuments({ propById, showToast }) {
  // Group docs by property.
  const groups = OWNER_PROPERTIES.map((p) => ({
    prop: propById(p.propertyId),
    docs: OWNER_DOCUMENTS.filter((d) => d.propertyId === p.propertyId)
  })).filter((g) => g.docs.length > 0)

  return (
    <>
      <SectionHeading title="Documentos" subtitle="Documentación organizada por propiedad." />
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.prop?.id}>
            <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" /> {g.prop?.title}
            </h4>
            <div className="space-y-3">
              {g.docs.map((d) => (
                <DocRow key={d.id} doc={d} showToast={showToast} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ============================================================
// SHARED UI
// ============================================================
function Info({ label, value, strong }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-muted">{label}</div>
      <div className={`truncate ${strong ? 'font-semibold text-gold' : 'font-medium text-text'}`}>{value}</div>
    </div>
  )
}

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className={`rounded-2xl p-4 border ${accent ? 'border-accent bg-surface-alt' : 'border-border bg-surface'}`}>
      <div className="flex items-center gap-2 text-muted text-xs font-medium">
        {Icon && <Icon className="w-4 h-4" />} {label}
      </div>
      <div className="text-xl font-bold text-primary mt-1.5">{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  )
}

function DocRow({ doc, showToast }) {
  const available = doc.status === 'available'
  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg shrink-0 ${available ? 'bg-primary/15 text-primary' : 'bg-surface-alt text-muted'}`}>
        <FileText className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-text truncate">{doc.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 rounded bg-surface-alt text-xs font-medium text-text">{doc.type}</span>
          <span className={`text-xs font-medium ${available ? 'text-success' : 'text-muted'}`}>
            {available ? 'Disponible' : 'Pendiente'}
          </span>
        </div>
      </div>
      <button
        onClick={() => available && showToast(`Descargando ${doc.type.toLowerCase()}…`)}
        disabled={!available}
        aria-label="Descargar"
        className="p-2 rounded-lg hover:bg-surface-alt text-accent transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  )
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-12 text-center">
      <div className="inline-flex p-4 rounded-full bg-surface-alt text-muted mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm text-muted mt-1 max-w-sm mx-auto">{text}</p>
    </div>
  )
}

// ============================================================
// MODALS
// ============================================================
const ALERT_TYPES = ['apartment', 'house', 'ph', 'commercial', 'land']

const fieldCls =
  'w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-accent'

function ModalShell({ open, onClose, icon: Icon, title, children, maxW = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxW} bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border`}
          >
            <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                {Icon && <Icon className="w-5 h-5 text-accent" />}
                <h3 className="font-semibold text-primary">{title}</h3>
              </div>
              <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-alt transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------- Alerts (I16) ----------
const ROOM_OPTIONS = [
  { value: 0, label: 'Indistinto' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' }
]

// Small KPI pill for the alerts summary strip.
function StatPill({ label, value, tone = 'text' }) {
  const valueCls = tone === 'accent' ? 'text-accent' : tone === 'error' ? 'text-error' : tone === 'muted' ? 'text-muted' : 'text-primary'
  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-3 text-center">
      <div className={`text-2xl font-bold leading-none ${valueCls}`}>{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  )
}

// Toggle chip used for multi-select criteria (types, zones).
function ChipToggle({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'bg-primary text-primary-contrast border-primary'
          : 'bg-surface-alt text-text border-border hover:text-accent'
      }`}
    >
      {children}
    </button>
  )
}

function AlertCard({ alert, onToggle, onEdit, onDelete, onViewMatches }) {
  const matches = matchProperties(alert.criteria)
  const newCount = newMatchIds(alert).length
  const tags = criteriaTags(alert.criteria)
  const active = alert.active

  return (
    <motion.div
      layout
      className={`bg-surface border rounded-xl p-4 transition-colors ${active ? 'border-border' : 'border-border opacity-70'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg shrink-0 ${active ? 'bg-surface-alt text-accent' : 'bg-surface-alt text-muted'}`}>
          <BellRing className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-text">{alert.name}</span>
            {newCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error text-white text-[11px] font-bold leading-none">
                {newCount} {newCount === 1 ? 'nueva' : 'nuevas'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((t, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-alt text-muted text-xs font-medium">
                {t}
              </span>
            ))}
          </div>

          <div className="text-sm mt-2.5">
            {active ? (
              <span className="text-muted">
                <span className="font-semibold text-accent">{matches.length}</span>{' '}
                {matches.length === 1 ? 'propiedad coincide' : 'propiedades coinciden'}
              </span>
            ) : (
              <span className="text-muted">Alerta pausada</span>
            )}
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={onToggle}
          role="switch"
          aria-checked={active}
          aria-label={active ? 'Pausar alerta' : 'Activar alerta'}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${active ? 'bg-accent' : 'bg-border'}`}
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow ${active ? 'right-0.5' : 'left-0.5'}`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
        <button
          onClick={onViewMatches}
          disabled={matches.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-contrast text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Eye className="w-4 h-4" /> Ver {matches.length} {matches.length === 1 ? 'propiedad' : 'propiedades'}
        </button>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text text-sm font-medium hover:bg-surface-alt transition-colors"
        >
          <Pencil className="w-4 h-4" /> Editar
        </button>
        <button
          onClick={onDelete}
          aria-label="Eliminar alerta"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-error text-sm font-medium hover:bg-surface-alt transition-colors ml-auto"
        >
          <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Eliminar</span>
        </button>
      </div>
    </motion.div>
  )
}

// Create + edit form. `target` is 'new' | alert-to-edit | null.
function AlertFormModal({ target, onClose, onSave }) {
  const open = !!target
  const editing = target && target !== 'new'
  const [name, setName] = useState('')
  const [form, setForm] = useState(EMPTY_CRITERIA)

  useEffect(() => {
    if (!open) return
    if (editing) {
      setName(target.name || '')
      setForm({ ...EMPTY_CRITERIA, ...target.criteria })
    } else {
      setName('')
      setForm(EMPTY_CRITERIA)
    }
  }, [open, editing, target])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  const toggleIn = (field, value) =>
    setForm((prev) => {
      const arr = prev[field] || []
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
    })

  const rangeInvalid = form.min && form.max && Number(form.min) > Number(form.max)
  const preview = rangeInvalid ? 0 : countMatches(form)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rangeInvalid) return
    onSave({ id: editing ? target.id : undefined, name, criteria: form })
  }

  return (
    <ModalShell open={open} onClose={onClose} icon={BellRing} title={editing ? 'Editar alerta' : 'Nueva alerta'} maxW="max-w-2xl">
      <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-5 md:p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Nombre de la alerta</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={suggestAlertName(form)}
            className={fieldCls}
          />
          <p className="text-xs text-muted mt-1.5">Si lo dejás vacío, usamos un nombre según los criterios.</p>
        </div>

        {/* Operation + currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Operación</label>
            <select value={form.operation} onChange={set('operation')} className={fieldCls}>
              {Object.entries(OPERATION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Moneda</label>
            <div className="inline-flex w-full rounded-lg bg-surface-alt border border-border p-0.5">
              {['USD', 'ARS'].map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, currency: cur }))}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    form.currency === cur ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-text'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Property types (multi) */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Tipo de propiedad</label>
          <div className="flex flex-wrap gap-2">
            {ALERT_TYPES.map((value) => (
              <ChipToggle key={value} active={form.types.includes(value)} onClick={() => toggleIn('types', value)}>
                {TYPE_LABELS[value]}
              </ChipToggle>
            ))}
          </div>
          <p className="text-xs text-muted mt-1.5">Sin selección = todas las tipologías.</p>
        </div>

        {/* Neighborhoods (multi) */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Zonas / Barrios</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-0.5">
            {neighborhoods.map((n) => (
              <ChipToggle key={n} active={form.neighborhoods.includes(n)} onClick={() => toggleIn('neighborhoods', n)}>
                {n}
              </ChipToggle>
            ))}
          </div>
          <p className="text-xs text-muted mt-1.5">Sin selección = todas las zonas.</p>
        </div>

        {/* Price range */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Rango de precio ({form.currency})</label>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" min="0" inputMode="numeric" value={form.min} onChange={set('min')} placeholder="Mínimo" className={fieldCls} />
            <input type="number" min="0" inputMode="numeric" value={form.max} onChange={set('max')} placeholder="Máximo" className={fieldCls} />
          </div>
          {rangeInvalid && <p className="text-xs text-error mt-1.5">El mínimo no puede ser mayor que el máximo.</p>}
        </div>

        {/* Rooms + area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Dormitorios (mínimo)</label>
            <select value={form.minRooms} onChange={(e) => setForm((prev) => ({ ...prev, minRooms: Number(e.target.value) }))} className={fieldCls}>
              {ROOM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Superficie mínima (m²)</label>
            <input type="number" min="0" inputMode="numeric" value={form.minArea} onChange={set('minArea')} placeholder="Ej: 60" className={fieldCls} />
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-lg bg-surface-alt border border-border px-4 py-3 text-sm text-muted">
          {rangeInvalid ? 'Ajustá el rango para ver coincidencias.' : (
            <>
              <span className="font-semibold text-accent">{preview}</span>{' '}
              {preview === 1 ? 'propiedad coincide' : 'propiedades coinciden'} con estos criterios hoy.
            </>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={rangeInvalid} className="flex-1 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
            {editing ? 'Guardar cambios' : 'Crear alerta'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

// Lists the listings matching an alert; clicking one opens the property detail.
function AlertMatchesModal({ alert, onClose, onSelectProperty }) {
  const matches = alert ? matchProperties(alert.criteria) : []
  return (
    <ModalShell open={!!alert} onClose={onClose} icon={Eye} title={alert ? alert.name : ''} maxW="max-w-2xl">
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {alert && criteriaTags(alert.criteria).map((t, i) => (
            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-alt text-muted text-xs font-medium">
              {t}
            </span>
          ))}
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-flex p-4 rounded-full bg-surface-alt text-muted mb-3">
              <Search className="w-7 h-7" />
            </div>
            <p className="text-sm text-muted">No hay propiedades que coincidan con estos criterios por ahora.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-0.5">
            <p className="text-sm text-muted">
              <span className="font-semibold text-text">{matches.length}</span>{' '}
              {matches.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
            {matches.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelectProperty?.(p); onClose() }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-accent hover:bg-surface-alt transition-colors text-left"
              >
                <img src={p.images?.[0]} alt="" className="w-20 h-16 rounded-lg object-cover shrink-0 bg-surface-alt" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-text truncate">{p.title}</div>
                  <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {p.neighborhood}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted mt-1">
                    <span className="inline-flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms}</span>
                    <span className="inline-flex items-center gap-1"><Ruler className="w-3.5 h-3.5" />{p.areaTotal} m²</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-accent text-sm">{formatPrice(p.price, p.currency, p.operation)}</div>
                  <span className="inline-flex items-center gap-1 text-xs text-accent mt-1">Ver <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  )
}

// Generic confirm dialog (reused for the alert delete confirmation).
function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar' }) {
  return (
    <ModalShell open={open} onClose={onClose} icon={AlertTriangle} title={title}>
      <div className="p-5 md:p-6">
        <p className="text-sm text-muted">{message}</p>
        <div className="flex gap-3 pt-5">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-error text-white font-semibold hover:opacity-90 transition-opacity">
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

function RepairRequestModal({ open, onClose, onCreate }) {
  const empty = { title: '', description: '', urgency: 'medium' }
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) setForm(empty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  const valid = form.title.trim() && form.description.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valid) return
    onCreate(form)
  }

  return (
    <ModalShell open={open} onClose={onClose} icon={Wrench} title="Solicitar reparación">
      <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Título</label>
          <input value={form.title} onChange={set('title')} placeholder="Ej: Pérdida de agua en el baño" className={fieldCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Descripción</label>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Contanos qué pasa con el mayor detalle posible." className={`${fieldCls} resize-none`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Urgencia</label>
          <select value={form.urgency} onChange={set('urgency')} className={fieldCls}>
            {REPAIR_URGENCIES.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>
        <div className="border-2 border-dashed border-border rounded-xl p-5 text-center bg-surface-alt/50">
          <Upload className="w-6 h-6 mx-auto text-muted mb-1.5" />
          <p className="text-xs text-muted">Adjuntá una foto (opcional)</p>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={!valid} className="flex-1 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
            Enviar solicitud
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

const VISIT_TIMES = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00', '19:00']

function RescheduleVisitModal({ visit, onClose, onConfirm }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    if (visit) {
      setDate(visit.date)
      setTime(visit.time)
    }
  }, [visit])

  const prop = visit ? propById(visit.propertyId) : null
  const valid = date && time

  return (
    <ModalShell open={!!visit} onClose={onClose} icon={CalendarClock} title="Reprogramar visita">
      <div className="p-5 md:p-6 space-y-4">
        {prop && (
          <div className="flex items-center gap-3 rounded-lg bg-surface-alt border border-border p-3">
            <img src={prop.images?.[0]} alt={prop.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-text truncate">{prop.title}</div>
              <div className="text-sm text-muted truncate">{prop.neighborhood}</div>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Nueva fecha</label>
          <DatePicker value={date} onChange={setDate} min="2026-09-12" placeholder="Elegí una fecha" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Nuevo horario</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className={fieldCls}>
            <option value="">Elegí un horario</option>
            {VISIT_TIMES.map((t) => (
              <option key={t} value={t}>{t} hs</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => valid && onConfirm(visit.id, { date, time })}
            disabled={!valid}
            className="flex-1 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar cambio
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

function CancelVisitModal({ visit, onClose, onConfirm }) {
  const [reason, setReason] = useState(CANCEL_REASONS[0])
  const [custom, setCustom] = useState('')

  useEffect(() => {
    if (visit) {
      setReason(CANCEL_REASONS[0])
      setCustom('')
    }
  }, [visit])

  const prop = visit ? propById(visit.propertyId) : null
  const isOther = reason === 'Otro motivo'
  const finalReason = isOther ? custom.trim() : reason
  const valid = !isOther || custom.trim()

  return (
    <ModalShell open={!!visit} onClose={onClose} icon={AlertTriangle} title="Cancelar visita">
      <div className="p-5 md:p-6 space-y-4">
        <p className="text-sm text-muted">
          {prop
            ? <>¿Seguro que querés cancelar tu visita a <span className="font-medium text-text">{prop.title}</span>?</>
            : '¿Seguro que querés cancelar esta visita?'}
        </p>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Motivo</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className={fieldCls}>
            {CANCEL_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {isOther && (
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            rows={2}
            placeholder="Contanos el motivo"
            className={`${fieldCls} resize-none`}
          />
        )}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Volver
          </button>
          <button
            onClick={() => valid && onConfirm(visit.id, finalReason)}
            disabled={!valid}
            className="flex-1 py-2.5 rounded-lg bg-error text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar visita
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

const AGENT_QUICK_MESSAGES = [
  '¿Podemos confirmar el horario de la visita?',
  '¿Se puede adelantar la visita?',
  '¿Tenés más fotos de la propiedad?'
]

function MessageAgentModal({ target, onClose, onSend }) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (target) setText('')
  }, [target])

  const agent = target?.agent
  const prop = target ? propById(target.visit.propertyId) : null
  const valid = text.trim()

  return (
    <ModalShell open={!!target} onClose={onClose} icon={MessageSquare} title="Enviar mensaje al asesor">
      <div className="p-5 md:p-6 space-y-4">
        {agent && (
          <div className="flex items-center gap-3">
            <img src={agent.photo} alt={agent.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="font-medium text-text">{agent.name}</div>
              <div className="text-sm text-muted truncate">{prop?.title}</div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {AGENT_QUICK_MESSAGES.map((q) => (
            <button
              key={q}
              onClick={() => setText(q)}
              className="px-2.5 py-1.5 rounded-full bg-surface-alt border border-border text-xs font-medium text-text hover:text-accent transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Escribí tu mensaje…"
          className={`${fieldCls} resize-none`}
        />
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => valid && onSend(agent?.name || 'tu asesor')}
            disabled={!valid}
            className="flex-1 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Enviar
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

const CURRENCIES = ['USD', 'ARS']

function NewOfferModal({ open, onClose, onCreate, submitting, favorites }) {
  const favIds = favorites?.favorites || []
  const favProps = properties.filter((p) => favIds.includes(p.id))
  const otherProps = properties.filter((p) => !favIds.includes(p.id))

  const empty = { propertyId: '', amount: '', currency: 'USD', condition: 'cash', message: '', validityDays: '15' }
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) setForm(empty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  // Picking a property adopts its currency as a sensible default.
  const selectProperty = (e) => {
    const id = e.target.value
    const prop = propById(id)
    setForm((prev) => ({ ...prev, propertyId: id, currency: prop?.currency || prev.currency }))
  }

  const prop = propById(form.propertyId)
  const valid = form.propertyId && Number(form.amount) > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valid || submitting) return
    onCreate(form)
  }

  return (
    <ModalShell open={open} onClose={onClose} icon={Tag} title="Nueva oferta">
      <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Propiedad</label>
          <select value={form.propertyId} onChange={selectProperty} className={fieldCls}>
            <option value="">Elegí una propiedad</option>
            {favProps.length > 0 && (
              <optgroup label="Tus favoritos">
                {favProps.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </optgroup>
            )}
            <optgroup label="Todas las propiedades">
              {otherProps.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {prop && (
          <div className="flex items-center gap-3 rounded-lg bg-surface-alt border border-border p-3">
            <img src={prop.images?.[0]} alt={prop.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-text truncate">{prop.neighborhood} · {TYPE_LABELS[prop.type]}</div>
              <div className="text-sm text-muted">
                Publicado: <span className="font-semibold text-primary">{formatPrice(prop.price, prop.currency, 'sale')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Monto ofertado</label>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={form.amount}
              onChange={set('amount')}
              placeholder={prop ? String(prop.price) : 'Ej: 180000'}
              className={fieldCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Moneda</label>
            <select value={form.currency} onChange={set('currency')} className={fieldCls}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Condición de pago</label>
            <select value={form.condition} onChange={set('condition')} className={fieldCls}>
              {Object.entries(OFFER_CONDITIONS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Validez (días)</label>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              value={form.validityDays}
              onChange={set('validityDays')}
              className={fieldCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Mensaje al propietario</label>
          <textarea
            value={form.message}
            onChange={set('message')}
            rows={3}
            placeholder="Contale al propietario los detalles de tu oferta (opcional)."
            className={`${fieldCls} resize-none`}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!valid || submitting}
            className="flex-1 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {submitting ? 'Enviando…' : <><Send className="w-4 h-4" /> Enviar oferta</>}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function CounterOfferModal({ offer, onClose, onConfirm, submitting }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (offer) {
      setAmount('')
      setNote('')
    }
  }, [offer])

  const prop = offer ? propById(offer.propertyId) : null
  const counter = offer ? sellerCounter(offer) : null
  const mine = offer ? buyerAmount(offer) : null
  const valid = Number(amount) > 0

  return (
    <ModalShell open={!!offer} onClose={onClose} icon={ArrowLeftRight} title="Contraofertar">
      <div className="p-5 md:p-6 space-y-4">
        {prop && (
          <div className="flex items-center gap-3 rounded-lg bg-surface-alt border border-border p-3">
            <img src={prop.images?.[0]} alt={prop.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-text truncate">{prop.title}</div>
              <div className="text-sm text-muted truncate">{prop.neighborhood}</div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-surface-alt border border-border p-3">
            <div className="text-xs text-muted">Tu última oferta</div>
            <div className="font-semibold text-gold mt-0.5">{mine != null ? formatPrice(mine, offer.currency, 'sale') : '—'}</div>
          </div>
          <div className="rounded-lg bg-surface-alt border border-accent p-3">
            <div className="text-xs text-muted">Contraoferta</div>
            <div className="font-semibold text-accent mt-0.5">{counter != null ? formatPrice(counter, offer.currency, 'sale') : '—'}</div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Tu nueva oferta ({offer?.currency})</label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={counter != null ? String(counter) : 'Monto'}
            className={fieldCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Mensaje (opcional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Justificá tu contraoferta."
            className={`${fieldCls} resize-none`}
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => valid && !submitting && onConfirm(offer.id, { amount, note })}
            disabled={!valid || submitting}
            className="flex-1 py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {submitting ? 'Enviando…' : <><Send className="w-4 h-4" /> Enviar contraoferta</>}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

function OfferDecisionModal({ target, onClose, onConfirm }) {
  const offer = target?.offer
  const action = target?.action
  const prop = offer ? propById(offer.propertyId) : null
  const counter = offer ? sellerCounter(offer) : null
  const isAccept = action === 'accept'

  return (
    <ModalShell
      open={!!target}
      onClose={onClose}
      icon={isAccept ? Handshake : AlertTriangle}
      title={isAccept ? 'Aceptar contraoferta' : 'Rechazar contraoferta'}
    >
      <div className="p-5 md:p-6 space-y-4">
        {prop && (
          <div className="flex items-center gap-3 rounded-lg bg-surface-alt border border-border p-3">
            <img src={prop.images?.[0]} alt={prop.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-text truncate">{prop.title}</div>
              <div className="text-sm text-muted truncate">{prop.neighborhood}</div>
            </div>
          </div>
        )}
        <p className="text-sm text-muted">
          {isAccept ? (
            <>
              Vas a aceptar la contraoferta de{' '}
              <span className="font-semibold text-accent">{counter != null ? formatPrice(counter, offer.currency, 'sale') : '—'}</span>.
              Con esto queda cerrado el acuerdo y un asesor te contactará para la reserva.
            </>
          ) : (
            <>Vas a rechazar la contraoferta del propietario. La oferta quedará cerrada, pero podés presentar una nueva cuando quieras.</>
          )}
        </p>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors">
            Volver
          </button>
          <button
            onClick={() => offer && onConfirm(offer.id, action)}
            className={`flex-1 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 ${isAccept ? 'bg-success text-white' : 'bg-error text-white'}`}
          >
            {isAccept ? <><ThumbsUp className="w-4 h-4" /> Aceptar oferta</> : <><X className="w-4 h-4" /> Rechazar</>}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

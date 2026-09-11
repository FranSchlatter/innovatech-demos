import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Heart, CalendarCheck, FileText, Tag, FolderOpen, BellRing,
  LogOut, Sun, Moon, Video, MapPin, Download, Upload, Mail, Lock, CheckCircle,
  Plus, X, Search, Home, Wrench, CreditCard, TrendingUp, Wallet, DollarSign,
  ChevronRight, AlertTriangle, Users, Repeat, Clock, ShieldCheck
} from 'lucide-react'
import properties from '../data/properties.json'
import neighborhoods from '../data/neighborhoods.json'
import { formatPrice, formatDate, TYPE_LABELS, OPERATION_LABELS } from '../utils/format'
import {
  MOCK_TENANT, TENANT_CONTRACT, TENANT_RENT_HISTORY, TENANT_ADJUSTMENT,
  TENANT_PAYMENTS, TENANT_DOCUMENTS, TENANT_REPAIRS, REPAIR_URGENCIES, REPAIR_STATUS
} from '../data/mockTenantData'
import {
  MOCK_OWNER, OWNER_PROPERTIES, OWNER_LIQUIDATIONS, OWNER_COLLECTION,
  OWNER_COLLECTION_HISTORY, OWNER_DOCUMENTS, COLLECTION_STATUS, PROPERTY_RENTAL_STATUS
} from '../data/mockOwnerData'
import PropertyCard from './PropertyCard'

const TODAY = new Date('2026-09-11T12:00:00')

// ---------- Buyer (interesado) mock data ----------
const BUYER_USER = {
  name: 'Lucía Méndez',
  email: 'lucia.mendez@email.com',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80'
}

const MOCK_VISITS = [
  { id: 'V1', propertyTitle: 'Departamento 3 ambientes con balcón aterrazado', date: '2026-08-28', time: '10:00', type: 'video', status: 'confirmed' },
  { id: 'V2', propertyTitle: 'PH 4 ambientes reciclado con terraza propia', date: '2026-08-29', time: '12:00', type: 'in-person', status: 'scheduled' },
  { id: 'V3', propertyTitle: 'Semipiso 4 ambientes con dependencia', date: '2026-08-20', time: '17:00', type: 'in-person', status: 'completed' }
]

const VISIT_STATUS = {
  scheduled: { label: 'Agendada', cls: 'bg-info/15 text-info' },
  confirmed: { label: 'Confirmada', cls: 'bg-success/15 text-success' },
  completed: { label: 'Realizada', cls: 'bg-surface-alt text-muted' }
}

const MOCK_OFFERS = [
  { id: 'O1', propertyTitle: 'Semipiso 4 ambientes con dependencia', amount: 285000, currency: 'USD', date: '2026-08-26', status: 'review' },
  { id: 'O2', propertyTitle: 'Monoambiente a estrenar ideal inversión', amount: 73000, currency: 'USD', date: '2026-08-10', status: 'rejected' }
]

const OFFER_STATUS = {
  sent: { label: 'Enviada', cls: 'bg-info/15 text-info' },
  review: { label: 'En revisión', cls: 'bg-warning/15 text-warning' },
  accepted: { label: 'Aceptada', cls: 'bg-success/15 text-success' },
  rejected: { label: 'Rechazada', cls: 'bg-error/15 text-error' }
}

const MOCK_DOCUMENTS = [
  { name: 'Reserva - Semipiso Las Cañitas.pdf', type: 'Reserva', size: '240 KB' },
  { name: 'DNI - Frente y dorso.pdf', type: 'Identidad', size: '1.2 MB' },
  { name: 'Recibo de sueldo.pdf', type: 'Ingresos', size: '180 KB' },
  { name: 'Contrato (borrador).pdf', type: 'Contrato', size: '320 KB' }
]

const INITIAL_ALERTS = [
  { id: 'A1', label: 'Departamentos en Palermo hasta USD 200.000', matches: 3, active: true },
  { id: 'A2', label: 'Alquiler 2 ambientes en Barrio Norte', matches: 5, active: true },
  { id: 'A3', label: 'Casas en Nordelta con pileta', matches: 2, active: false }
]

const ALERTS_KEY = 'inmob-portal-alerts'
const TENANT_KEY = 'inmob-portal-tenant-v1'

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

// Count how many listings would match a set of alert criteria (real data).
function countMatches({ operation, type, neighborhood, min, max }) {
  return properties.filter((p) => {
    if (operation && p.operation !== operation) return false
    if (type && p.type !== type) return false
    if (neighborhood && p.neighborhood !== neighborhood) return false
    if (min && p.price < Number(min)) return false
    if (max && p.price > Number(max)) return false
    return true
  }).length
}

// Human-readable label from the alert criteria.
function buildAlertLabel({ operation, type, neighborhood, min, max }) {
  const parts = []
  parts.push(type ? TYPE_LABELS[type] + 's' : 'Propiedades')
  if (operation) parts.push(`en ${OPERATION_LABELS[operation].toLowerCase()}`)
  if (neighborhood) parts.push(`· ${neighborhood}`)
  if (min && max) parts.push(`· USD ${Number(min).toLocaleString('es-AR')}–${Number(max).toLocaleString('es-AR')}`)
  else if (max) parts.push(`· hasta USD ${Number(max).toLocaleString('es-AR')}`)
  else if (min) parts.push(`· desde USD ${Number(min).toLocaleString('es-AR')}`)
  return parts.join(' ')
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
      if (saved) return JSON.parse(saved)
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

  const [visitNotes, setVisitNotes] = useState({})
  const [toast, setToast] = useState(null)
  const [alertFormOpen, setAlertFormOpen] = useState(false)
  const [repairFormOpen, setRepairFormOpen] = useState(false)
  const [payingId, setPayingId] = useState(null)

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
    setVisitNotes({})
  }

  const toggleAlert = (id) => {
    const target = alerts.find((a) => a.id === id)
    if (!target) return
    const nowActive = !target.active
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: nowActive } : a)))
    showToast(nowActive ? 'Alerta activada' : 'Alerta pausada', nowActive ? 'success' : 'muted')
  }

  const createAlert = (criteria) => {
    const newAlert = {
      id: `A-${Date.now()}`,
      label: buildAlertLabel(criteria),
      matches: countMatches(criteria),
      active: true,
      criteria
    }
    setAlerts((prev) => [newAlert, ...prev])
    setAlertFormOpen(false)
    showToast('Alerta creada')
  }

  const noteVisit = (id) => setVisitNotes((prev) => ({ ...prev, [id]: true }))

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
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'bg-primary text-primary-contrast' : 'text-text hover:bg-surface-alt'
                  }`}
                >
                  <Icon className="w-5 h-5" /> {item.label}
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
                  visitNotes={visitNotes}
                  noteVisit={noteVisit}
                  alerts={alerts}
                  toggleAlert={toggleAlert}
                  openAlertForm={() => setAlertFormOpen(true)}
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

      <CreateAlertModal
        open={alertFormOpen}
        onClose={() => setAlertFormOpen(false)}
        onCreate={createAlert}
      />
      <RepairRequestModal
        open={repairFormOpen}
        onClose={() => setRepairFormOpen(false)}
        onCreate={createRepair}
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
function BuyerSections({ section, favorites, onSelectProperty, visitNotes, noteVisit, alerts, toggleAlert, openAlertForm }) {
  const favProps = properties.filter((p) => favorites.favorites.includes(p.id))

  if (section === 'favorites') {
    return (
      <>
        <SectionHeading title="Favoritos" subtitle="Las propiedades que guardaste para revisar más tarde." />
        {favProps.length === 0 ? (
          <EmptyState icon={Heart} title="Todavía no guardaste propiedades" text="Explorá el catálogo y tocá el corazón para guardarlas." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favProps.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isFavorite={favorites.isFavorite(p.id)}
                onToggleFavorite={favorites.toggleFavorite}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        )}
      </>
    )
  }

  if (section === 'visits') {
    return (
      <>
        <SectionHeading title="Mis visitas" subtitle="Tus visitas presenciales y videollamadas agendadas." />
        <div className="space-y-4">
          {MOCK_VISITS.map((v) => {
            const st = VISIT_STATUS[v.status]
            const TypeIcon = v.type === 'video' ? Video : MapPin
            const upcoming = v.status !== 'completed'
            return (
              <div key={v.id} className="bg-surface border border-border rounded-xl p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-muted mb-1">
                      <CalendarCheck className="w-4 h-4 text-accent" />
                      <span>{formatDate(v.date)} · {v.time} hs</span>
                    </div>
                    <h3 className="font-semibold text-primary">{v.propertyTitle}</h3>
                    <div className="inline-flex items-center gap-1.5 text-sm text-muted mt-1.5">
                      <TypeIcon className="w-4 h-4" />
                      {v.type === 'video' ? 'Videollamada' : 'Visita presencial'}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
                </div>

                {upcoming && (
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <button onClick={() => noteVisit(v.id)} className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-surface-alt transition-colors">
                      Reprogramar
                    </button>
                    <button onClick={() => noteVisit(v.id)} className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-error hover:bg-error/15 transition-colors">
                      Cancelar
                    </button>
                    {visitNotes[v.id] && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-success">
                        <CheckCircle className="w-4 h-4" /> Solicitud enviada
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </>
    )
  }

  if (section === 'offers') {
    return (
      <>
        <SectionHeading title="Mis ofertas" subtitle="Seguí el estado de las ofertas que presentaste." />
        <div className="space-y-4">
          {MOCK_OFFERS.map((o) => {
            const st = OFFER_STATUS[o.status]
            return (
              <div key={o.id} className="bg-surface border border-border rounded-xl p-5 shadow-soft flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-primary">{o.propertyTitle}</h3>
                  <div className="text-sm mt-1">
                    <span className="text-muted">Tu oferta: </span>
                    <span className="font-semibold text-gold">{formatPrice(o.amount, o.currency, 'sale')}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-sm text-muted mt-1.5">
                    <Tag className="w-4 h-4" /> {formatDate(o.date)}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  if (section === 'documents') {
    return (
      <>
        <SectionHeading title="Documentos" subtitle="Tu documentación para reservas y operaciones." />
        <div className="space-y-3 mb-6">
          {MOCK_DOCUMENTS.map((d) => (
            <div key={d.name} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-primary/15 text-primary shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-text truncate">{d.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-surface-alt text-xs font-medium text-text">{d.type}</span>
                  <span className="text-xs text-muted">{d.size}</span>
                </div>
              </div>
              <button aria-label="Descargar" className="p-2 rounded-lg hover:bg-surface-alt text-accent transition-colors shrink-0">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-surface-alt/50">
          <Upload className="w-8 h-8 mx-auto text-muted mb-2" />
          <p className="text-sm font-medium text-text">Arrastrá o subí un documento</p>
          <p className="text-xs text-muted mt-1">PDF, JPG o PNG · hasta 5 MB</p>
        </div>
      </>
    )
  }

  if (section === 'alerts') {
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
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-lg shrink-0 ${a.active ? 'bg-accent/15 text-accent' : 'bg-surface-alt text-muted'}`}>
                  <BellRing className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-text">{a.label}</div>
                  <div className={`text-sm mt-0.5 ${a.active ? 'text-accent' : 'text-muted'}`}>
                    {a.active ? `${a.matches} ${a.matches === 1 ? 'coincidencia' : 'coincidencias'}` : 'Alerta pausada'}
                  </div>
                </div>
                <button
                  onClick={() => toggleAlert(a.id)}
                  role="switch"
                  aria-checked={a.active}
                  aria-label={a.active ? 'Pausar alerta' : 'Activar alerta'}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${a.active ? 'bg-accent' : 'bg-muted/40'}`}
                >
                  <span className={`absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow transition-transform ${a.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  return null
}

// ============================================================
// TENANT SECTIONS (inquilino)
// ============================================================
function TenantSections({ section, payments, repairs, onPay, payingId, openRepairForm, showToast, propById }) {
  if (section === 'contract') return <TenantContract showToast={showToast} propById={propById} />
  if (section === 'payments') return <TenantPayments payments={payments} onPay={onPay} payingId={payingId} />
  if (section === 'adjustment') return <TenantAdjustment showToast={showToast} />
  if (section === 'documents') return <DocumentsList title="Documentos" subtitle="Tu documentación del alquiler." docs={TENANT_DOCUMENTS} showToast={showToast} />
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Contrato vigente
            </span>
            <h3 className="font-semibold text-primary text-lg mt-2">{prop?.title}</h3>
            <div className="inline-flex items-center gap-1.5 text-sm text-muted mt-1">
              <MapPin className="w-4 h-4" /> {prop?.address}, {prop?.neighborhood}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Info label="Alquiler actual" value={formatPrice(c.currentRent, c.currency, 'rent')} strong />
              <Info label="Propietario" value={c.landlordName} />
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
            <div className="p-2.5 rounded-lg bg-primary/15 text-primary">
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

function TenantPayments({ payments, onPay, payingId }) {
  const pending = payments.find((p) => p.status === 'pending')
  const overdueDays = pending ? daysLate(pending.dueDate) : 0
  const interest = pending && overdueDays > 0 ? Math.round(pending.amount * 0.001 * overdueDays) : 0
  const totalDue = pending ? pending.amount + interest : 0

  return (
    <>
      <SectionHeading title="Pagos" subtitle="Tus pagos de alquiler de los últimos meses." />

      {/* Summary */}
      <div className={`rounded-2xl p-5 mb-6 border ${pending ? 'border-warning/40 bg-warning/10' : 'border-success/40 bg-success/10'}`}>
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
                  Alquiler {formatPrice(pending.amount, 'ARS', 'rent').replace('/mes', '')} + interés {formatPrice(interest, 'ARS').replace('/mes', '')}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{formatPrice(totalDue, 'ARS').replace('/mes', '')}</div>
              <button
                onClick={() => onPay(pending.id)}
                disabled={payingId === pending.id}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {payingId === pending.id ? (
                  <><Clock className="w-4 h-4 animate-spin" /> Procesando…</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pagar ahora</>
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

      <div className="space-y-3">
        {payments.map((p) => {
          const paid = p.status === 'paid'
          return (
            <div key={p.id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg shrink-0 ${paid ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-text">{p.period}</div>
                <div className="text-sm text-muted mt-0.5">
                  {paid ? `Pagado el ${formatDate(p.paidDate)} · ${p.method}` : `Vence ${formatDate(p.dueDate)}`}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-primary">{formatPrice(p.amount, 'ARS').replace('/mes', '')}</div>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${paid ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                  {paid ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function TenantAdjustment({ showToast }) {
  const a = TENANT_ADJUSTMENT
  const diff = a.estimatedRent - a.currentRent
  const pct = ((diff / a.currentRent) * 100).toFixed(1)
  const max = Math.max(...TENANT_RENT_HISTORY.map((h) => h.amount))

  return (
    <>
      <SectionHeading title="Próximo ajuste" subtitle="Cómo evoluciona tu alquiler según el índice de tu contrato." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Índice" value={a.index} sub={`Valor ${a.indexValue} · dato al ${formatDate(a.indexDate)}`} icon={TrendingUp} />
        <StatCard label="Alquiler actual" value={formatPrice(a.currentRent, 'ARS').replace('/mes', '')} sub="Vigente este período" icon={CreditCard} />
        <StatCard
          label="Estimado post-ajuste"
          value={formatPrice(a.estimatedRent, 'ARS').replace('/mes', '')}
          sub={`+${pct}% · desde ${formatDate(a.nextAdjustDate)}`}
          icon={Wallet}
          accent
        />
      </div>

      <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm text-text">
          Tu próximo ajuste es el <span className="font-semibold">{formatDate(a.nextAdjustDate)}</span>. El alquiler
          pasaría de {formatPrice(a.currentRent, 'ARS').replace('/mes', '')} a{' '}
          <span className="font-semibold text-primary">{formatPrice(a.estimatedRent, 'ARS').replace('/mes', '')}</span> (estimado).
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h4 className="font-semibold text-primary mb-4">Evolución del alquiler</h4>
        <div className="flex items-end gap-2 sm:gap-3 h-48">
          {TENANT_RENT_HISTORY.map((h, i) => (
            <div key={h.period} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <span className="text-[10px] sm:text-xs font-medium text-text">{(h.amount / 1000).toFixed(0)}k</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(h.amount / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                className={`w-full rounded-t-md ${i === TENANT_RENT_HISTORY.length - 1 ? 'bg-accent' : 'bg-primary/40'}`}
              />
              <span className="text-[10px] sm:text-xs text-muted truncate w-full text-center">{h.period}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => showToast('Notificación enviada al propietario')}
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
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-surface-alt text-xs font-medium text-text">
                      Urgencia: {urg?.label || '—'}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
                </div>
                {/* Timeline */}
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {r.timeline.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-text font-medium">{t.label}</span>
                      <span className="text-muted">{formatDate(t.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
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
        <div className="flex items-end gap-2 sm:gap-3 h-40">
          {OWNER_COLLECTION_HISTORY.map((h, i) => {
            const full = h.collected >= h.expected
            return (
              <div key={h.period} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(h.collected / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                  className={`w-full rounded-t-md ${full ? 'bg-success' : 'bg-warning'}`}
                />
                <span className="text-xs text-muted">{h.period}</span>
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
    <div className={`rounded-2xl p-4 border ${accent ? 'border-accent/40 bg-accent/10' : 'border-border bg-surface'}`}>
      <div className="flex items-center gap-2 text-muted text-xs font-medium">
        {Icon && <Icon className="w-4 h-4" />} {label}
      </div>
      <div className="text-xl font-bold text-primary mt-1.5">{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  )
}

function DocumentsList({ title, subtitle, docs, showToast }) {
  return (
    <>
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="space-y-3 mb-6">
        {docs.map((d) => (
          <DocRow key={d.id} doc={d} showToast={showToast} />
        ))}
      </div>
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-surface-alt/50">
        <Upload className="w-8 h-8 mx-auto text-muted mb-2" />
        <p className="text-sm font-medium text-text">Arrastrá o subí un documento</p>
        <p className="text-xs text-muted mt-1">PDF, JPG o PNG · hasta 5 MB</p>
      </div>
    </>
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

function ModalShell({ open, onClose, icon: Icon, title, children }) {
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
            className="relative w-full max-w-lg bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border"
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

function CreateAlertModal({ open, onClose, onCreate }) {
  const empty = { operation: 'sale', type: 'apartment', neighborhood: '', min: '', max: '' }
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) setForm(empty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  const rangeInvalid = form.min && form.max && Number(form.min) > Number(form.max)
  const preview = countMatches(form)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rangeInvalid) return
    onCreate(form)
  }

  return (
    <ModalShell open={open} onClose={onClose} icon={BellRing} title="Nueva alerta">
      <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
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
            <label className="block text-sm font-medium text-text mb-1.5">Tipo de propiedad</label>
            <select value={form.type} onChange={set('type')} className={fieldCls}>
              {ALERT_TYPES.map((value) => (
                <option key={value} value={value}>{TYPE_LABELS[value]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Zona / Barrio</label>
          <select value={form.neighborhood} onChange={set('neighborhood')} className={fieldCls}>
            <option value="">Todas las zonas</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Rango de precio (USD)</label>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" min="0" inputMode="numeric" value={form.min} onChange={set('min')} placeholder="Mínimo" className={fieldCls} />
            <input type="number" min="0" inputMode="numeric" value={form.max} onChange={set('max')} placeholder="Máximo" className={fieldCls} />
          </div>
          {rangeInvalid && <p className="text-xs text-error mt-1.5">El mínimo no puede ser mayor que el máximo.</p>}
        </div>

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
            Guardar alerta
          </button>
        </div>
      </form>
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

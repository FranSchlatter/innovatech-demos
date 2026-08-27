import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Heart, CalendarCheck, FileText, Tag, FolderOpen, BellRing,
  LogOut, Sun, Moon, Video, MapPin, Download, Upload, Mail, Lock, CheckCircle
} from 'lucide-react'
import properties from '../data/properties.json'
import { formatPrice, formatDate, TYPE_LABELS, OPERATION_LABELS } from '../utils/format'
import PropertyCard from './PropertyCard'

const user = {
  name: 'Lucía Méndez',
  email: 'lucia.mendez@email.com',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80'
}

const NAV_ITEMS = [
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'visits', label: 'Mis visitas', icon: CalendarCheck },
  { id: 'offers', label: 'Mis ofertas', icon: Tag },
  { id: 'documents', label: 'Documentos', icon: FolderOpen },
  { id: 'alerts', label: 'Alertas', icon: BellRing }
]

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
  const [submitting, setSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState('favorites')
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [visitNotes, setVisitNotes] = useState({})

  const handleLogin = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setLoggedIn(true)
    }, 500)
  }

  const toggleAlert = (id) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)))

  const noteVisit = (id) => setVisitNotes((prev) => ({ ...prev, [id]: true }))

  // ---------- PHASE 1: LOGIN ----------
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-medium p-8"
        >
          <div className="flex items-center gap-3 mb-8">
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
            Gestioná tus favoritos, visitas, ofertas y documentos en un solo lugar.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-gold text-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? 'Ingresando…' : 'Ingresar'}
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

  // ---------- PHASE 2: PORTAL ----------
  const favProps = properties.filter((p) => favorites.favorites.includes(p.id))

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-primary text-primary-contrast shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-semibold text-primary truncate">Mi Portal · Terranova</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="p-2 rounded-lg hover:bg-surface-alt text-text transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-medium text-text">{user.name}</span>
            </div>

            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-contrast text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:flex lg:gap-8">
        {/* Sidebar / tabs */}
        <nav className="lg:w-60 lg:shrink-0 mb-6 lg:mb-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-primary text-primary-contrast'
                      : 'text-text hover:bg-surface-alt'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" /> {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.section key={activeSection} {...reveal}>
              {activeSection === 'favorites' && (
                <>
                  <SectionHeading
                    title="Favoritos"
                    subtitle="Las propiedades que guardaste para revisar más tarde."
                  />
                  {favProps.length === 0 ? (
                    <EmptyState
                      icon={Heart}
                      title="Todavía no guardaste propiedades"
                      text="Explorá el catálogo y tocá el corazón para guardarlas."
                    />
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
              )}

              {activeSection === 'visits' && (
                <>
                  <SectionHeading
                    title="Mis visitas"
                    subtitle="Tus visitas presenciales y videollamadas agendadas."
                  />
                  <div className="space-y-4">
                    {MOCK_VISITS.map((v) => {
                      const st = VISIT_STATUS[v.status]
                      const TypeIcon = v.type === 'video' ? Video : MapPin
                      const upcoming = v.status !== 'completed'
                      return (
                        <div
                          key={v.id}
                          className="bg-surface border border-border rounded-xl p-5 shadow-soft"
                        >
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
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                              {st.label}
                            </span>
                          </div>

                          {upcoming && (
                            <div className="flex flex-wrap items-center gap-2 mt-4">
                              <button
                                onClick={() => noteVisit(v.id)}
                                className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-surface-alt transition-colors"
                              >
                                Reprogramar
                              </button>
                              <button
                                onClick={() => noteVisit(v.id)}
                                className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-error hover:bg-error/15 transition-colors"
                              >
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
              )}

              {activeSection === 'offers' && (
                <>
                  <SectionHeading
                    title="Mis ofertas"
                    subtitle="Seguí el estado de las ofertas que presentaste."
                  />
                  <div className="space-y-4">
                    {MOCK_OFFERS.map((o) => {
                      const st = OFFER_STATUS[o.status]
                      return (
                        <div
                          key={o.id}
                          className="bg-surface border border-border rounded-xl p-5 shadow-soft flex flex-wrap items-start justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <h3 className="font-semibold text-primary">{o.propertyTitle}</h3>
                            <div className="text-sm mt-1">
                              <span className="text-muted">Tu oferta: </span>
                              <span className="font-semibold text-gold">
                                {formatPrice(o.amount, o.currency, 'sale')}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-sm text-muted mt-1.5">
                              <Tag className="w-4 h-4" /> {formatDate(o.date)}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                            {st.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {activeSection === 'documents' && (
                <>
                  <SectionHeading
                    title="Documentos"
                    subtitle="Tu documentación para reservas y operaciones."
                  />
                  <div className="space-y-3 mb-6">
                    {MOCK_DOCUMENTS.map((d) => (
                      <div
                        key={d.name}
                        className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4"
                      >
                        <div className="p-2.5 rounded-lg bg-primary/15 text-primary shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-text truncate">{d.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-surface-alt text-xs font-medium text-text">
                              {d.type}
                            </span>
                            <span className="text-xs text-muted">{d.size}</span>
                          </div>
                        </div>
                        <button
                          aria-label="Descargar"
                          className="p-2 rounded-lg hover:bg-surface-alt text-accent transition-colors shrink-0"
                        >
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
              )}

              {activeSection === 'alerts' && (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                    <SectionHeading
                      title="Alertas"
                      subtitle="Recibí avisos cuando aparezcan propiedades que coincidan con tus búsquedas."
                    />
                    <button className="px-4 py-2.5 rounded-lg bg-gold text-primary text-sm font-semibold hover:opacity-90 transition-opacity shrink-0">
                      Crear nueva alerta
                    </button>
                  </div>
                  <div className="space-y-3">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4"
                      >
                        <div className="p-2.5 rounded-lg bg-accent/15 text-accent shrink-0">
                          <BellRing className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-text">{a.label}</div>
                          <div className="text-sm text-accent mt-0.5">
                            {a.matches} nuevas coincidencias
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAlert(a.id)}
                          role="switch"
                          aria-checked={a.active}
                          aria-label="Activar alerta"
                          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                            a.active ? 'bg-accent' : 'bg-surface-alt border border-border'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                              a.active ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.section>
          </AnimatePresence>
        </main>
      </div>
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

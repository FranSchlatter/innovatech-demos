import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone, Mail, MapPin, Plus, Pencil, Star, Trophy, Timer, Users,
  LayoutGrid, Table as TableIcon, Building2, ArrowUpRight, Clock,
  Handshake, CalendarCheck, MessageSquare, Home, Award
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useAdmin } from '../../../context/AdminContext'
import StatusBadge from '../shared/StatusBadge'
import Modal from '../shared/Modal'
import { useToast } from '../shared/useToast'
import { fieldCls, labelCls, btnPrimary, btnGhost } from '../shared/formStyles'
import {
  AGENT_ROLES, AGENT_SHIFTS, AGENT_STATUSES, SPECIALTIES, emptyAgent
} from '../../../data/admin/mockAgents'
import neighborhoods from '../../../data/neighborhoods.json'
import { formatPrice } from '../../../utils/format'

const STATUS_META = AGENT_STATUSES.reduce((acc, s) => ({ ...acc, [s.id]: s }), {})
const SHIFT_LABEL = AGENT_SHIFTS.reduce((acc, s) => ({ ...acc, [s.id]: s.label }), {})
const SPECIALTY_LABEL = SPECIALTIES.reduce((acc, s) => ({ ...acc, [s.id]: s.label }), {})

const HISTORY_ICON = {
  operation: Handshake, visit: CalendarCheck, lead: MessageSquare, listing: Home
}

const usd = (n) => `USD ${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`
const conversion = (a) => (a.visitsScheduled ? Math.round((a.visitsCompleted / a.visitsScheduled) * 100) : 0)
const targetPct = (a) => (a.monthlyTarget ? Math.min(100, Math.round((a.closedThisMonth / a.monthlyTarget) * 100)) : 0)

const formatDate = (iso) => {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch { return iso }
}

export default function AgentsManagement() {
  const { agents, properties, updateAgent, addAgent } = useAdminData()
  const { setView, setFilter } = useAdmin()
  const { showToast, toastNode } = useToast()

  const [viewMode, setViewMode] = useState('cards') // cards | table
  const [selectedId, setSelectedId] = useState(null)
  const [newOpen, setNewOpen] = useState(false)

  // Ranking by commission generated (desc)
  const ranked = [...agents].sort((a, b) => (b.commissionGenerated || 0) - (a.commissionGenerated || 0))
  const rankOf = (id) => ranked.findIndex((a) => a.id === id) + 1

  const activeCount = agents.filter((a) => a.status === 'active').length
  const closedThisMonth = agents.reduce((sum, a) => sum + (a.closedThisMonth || 0), 0)
  const totalCommission = agents.reduce((sum, a) => sum + (a.commissionGenerated || 0), 0)
  const avgConversion = agents.length
    ? Math.round(agents.reduce((s, a) => s + conversion(a), 0) / agents.length)
    : 0
  const bestAgent = agents.reduce(
    (best, a) => ((a.closedThisMonth || 0) > (best?.closedThisMonth || -1) ? a : best),
    null
  )

  const liveSelected = selectedId ? agents.find((a) => a.id === selectedId) || null : null

  const goToLeads = (agentId) => {
    setFilter('leads', 'agent', agentId)
    setView('leads')
  }

  const summary = [
    { label: 'Agentes activos', value: `${activeCount}/${agents.length}`, tone: 'text-success', icon: Users },
    { label: 'Cierres del mes', value: closedThisMonth, tone: 'text-accent', icon: Handshake },
    { label: 'Comisión generada', value: usd(totalCommission), tone: 'text-gold', icon: Award },
    { label: 'Conversión de visitas', value: `${avgConversion}%`, tone: 'text-text', icon: CalendarCheck }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Equipo</h2>
          <p className="text-sm text-muted mt-1">Gestión de agentes: métricas, zonas, cartera e historial</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <ViewToggle active={viewMode === 'cards'} onClick={() => setViewMode('cards')} label="Tarjetas">
              <LayoutGrid className="w-4 h-4" />
            </ViewToggle>
            <ViewToggle active={viewMode === 'table'} onClick={() => setViewMode('table')} label="Tabla">
              <TableIcon className="w-4 h-4" />
            </ViewToggle>
          </div>
          <button type="button" onClick={() => setNewOpen(true)} className={btnPrimary}>
            <Plus className="w-4 h-4" /> Agregar agente
          </button>
        </div>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summary.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="bg-surface border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">{s.label}</p>
                <s.icon className="w-4 h-4 text-muted" />
              </div>
              <p className={`text-xl font-bold mt-1 ${s.tone}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Best agent of the month */}
        {bestAgent && (
          <motion.button
            type="button"
            onClick={() => setSelectedId(bestAgent.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="text-left bg-gradient-to-br from-accent/15 to-gold/10 border border-accent/40 rounded-xl p-4 flex items-center gap-3 hover:border-accent transition-colors"
          >
            <div className="relative shrink-0">
              <img src={bestAgent.photo} alt={bestAgent.name} className="w-14 h-14 rounded-full object-cover" />
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold text-primary-contrast flex items-center justify-center shadow">
                <Trophy className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Mejor agente del mes</p>
              <p className="font-bold text-text truncate">{bestAgent.name}</p>
              <p className="text-xs text-muted">{bestAgent.closedThisMonth} cierres · {usd(bestAgent.commissionGenerated)}</p>
            </div>
          </motion.button>
        )}
      </div>

      {/* Cards view */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((a, i) => (
            <AgentCard
              key={a.id} a={a} i={i} rank={rankOf(a.id)} total={agents.length}
              onOpen={() => setSelectedId(a.id)}
            />
          ))}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-surface border border-border rounded-xl overflow-x-auto"
        >
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-muted border-b border-border bg-surface-alt/50">
                <th className="px-4 py-3 font-semibold">Agente</th>
                <th className="px-4 py-3 font-semibold">Rol</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Cierres mes</th>
                <th className="px-4 py-3 font-semibold">Comisión</th>
                <th className="px-4 py-3 font-semibold">Conv.</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
                <th className="px-4 py-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => {
                const st = STATUS_META[a.status] || STATUS_META.inactive
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface-alt/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedId(a.id)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={a.photo} alt={a.name} className="w-9 h-9 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="font-semibold text-text truncate">{a.name}</p>
                          <p className="text-xs text-muted truncate">{a.zones?.join(', ') || a.zone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text whitespace-nowrap">{a.role}</td>
                    <td className="px-4 py-3"><StatusBadge label={st.label} tone={st.tone} /></td>
                    <td className="px-4 py-3 text-text">{a.closedThisMonth} / {a.monthlyTarget}</td>
                    <td className="px-4 py-3 text-gold font-medium whitespace-nowrap">{usd(a.commissionGenerated)}</td>
                    <td className="px-4 py-3 text-text">{conversion(a)}%</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-text"><Star className="w-3.5 h-3.5 text-gold fill-gold" /> {a.rating}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                        Ver <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      <AgentDetailModal
        agent={liveSelected}
        properties={properties}
        rank={liveSelected ? rankOf(liveSelected.id) : 0}
        total={agents.length}
        onClose={() => setSelectedId(null)}
        updateAgent={updateAgent}
        goToLeads={goToLeads}
        showToast={showToast}
      />

      <NewAgentModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        properties={properties}
        addAgent={addAgent}
        showToast={showToast}
      />

      {toastNode}
    </div>
  )
}

/* ---------- Agent card ---------- */

function AgentCard({ a, i, rank, total, onOpen }) {
  const st = STATUS_META[a.status] || STATUS_META.inactive
  const pct = targetPct(a)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: i * 0.05 }}
      className="bg-surface border border-border rounded-xl p-5 flex flex-col"
    >
      <div className="flex items-start gap-3">
        <img src={a.photo} alt={a.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text truncate">{a.name}</p>
          <p className="text-sm text-muted">{a.role}</p>
          <p className="text-xs text-muted inline-flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {a.zones?.join(' · ') || a.zone}
          </p>
        </div>
        <StatusBadge label={st.label} tone={st.tone} />
      </div>

      {/* Rating + rank */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <span className="inline-flex items-center gap-1 text-text">
          <Star className="w-3.5 h-3.5 text-gold fill-gold" /> {a.rating}
          <span className="text-muted">rating</span>
        </span>
        <span className="inline-flex items-center gap-1 text-muted">
          <Trophy className="w-3.5 h-3.5 text-gold" /> #{rank} de {total}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Stat label="Cartera" value={a.assignedPropertyIds?.length ?? a.activeListings} />
        <Stat label="Leads activos" value={a.activeLeads} />
        <Stat label="Comisión" value={usd(a.commissionGenerated)} small />
        <Stat label="Conversión" value={`${conversion(a)}%`} />
      </div>

      {/* Monthly target */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted">Objetivo mensual</span>
          <span className="font-semibold text-text">{a.closedThisMonth} / {a.monthlyTarget} cierres</span>
        </div>
        <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
          <motion.div className="h-full bg-accent rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <button type="button" onClick={onOpen} className="inline-flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold rounded-lg px-3 py-2 bg-accent text-primary-contrast hover:opacity-90 transition-opacity">
          <Pencil className="w-3.5 h-3.5" /> Ver / editar
        </button>
        <a href={`tel:${a.phone}`} aria-label="Llamar" className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted hover:text-text hover:bg-surface-alt transition-colors">
          <Phone className="w-4 h-4" />
        </a>
        <a href={`mailto:${a.email}`} aria-label="Email" className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted hover:text-text hover:bg-surface-alt transition-colors">
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  )
}

function Stat({ label, value, small }) {
  return (
    <div className="bg-surface-alt rounded-lg px-3 py-2">
      <p className="text-[11px] text-muted">{label}</p>
      <p className={`font-bold text-text ${small ? 'text-sm' : 'text-lg'}`}>{value}</p>
    </div>
  )
}

function ViewToggle({ active, onClick, label, children }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className={`inline-flex items-center justify-center w-9 h-9 transition-colors ${
        active ? 'bg-accent text-primary-contrast' : 'bg-surface text-muted hover:text-text hover:bg-surface-alt'
      }`}>
      {children}
    </button>
  )
}

/* ---------- Agent detail (editable + metrics + history) ---------- */

function AgentDetailModal({ agent, properties, rank, total, onClose, updateAgent, goToLeads, showToast }) {
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (!agent) return
    setForm({
      name: agent.name, email: agent.email, phone: agent.phone, photo: agent.photo,
      role: agent.role, status: agent.status, shift: agent.shift,
      zones: agent.zones || [], specialties: agent.specialties || [],
      assignedPropertyIds: agent.assignedPropertyIds || [],
      monthlyTarget: agent.monthlyTarget
    })
  }, [agent?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!agent || !form) return null

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  const toggleIn = (field, value) => setForm((prev) => ({
    ...prev,
    [field]: prev[field].includes(value) ? prev[field].filter((x) => x !== value) : [...prev[field], value]
  }))

  const save = () => {
    updateAgent(agent.id, {
      name: form.name, email: form.email, phone: form.phone, photo: form.photo,
      role: form.role, status: form.status, shift: form.shift,
      zones: form.zones, zone: form.zones[0] || form.zones.join(', ') || agent.zone,
      specialties: form.specialties,
      assignedPropertyIds: form.assignedPropertyIds,
      activeListings: form.assignedPropertyIds.length,
      monthlyTarget: Number(form.monthlyTarget) || 0
    })
    showToast('Agente actualizado')
    onClose()
  }

  const conv = conversion(agent)
  const ratingStars = Math.round(agent.rating)

  return (
    <Modal
      open={!!agent}
      onClose={onClose}
      title={agent.name}
      icon={Pencil}
      size="xl"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cerrar</button>
          <button type="button" onClick={save} className={btnPrimary}>Guardar cambios</button>
        </div>
      }
    >
      <div className="grid md:grid-cols-[1fr_300px]">
        {/* Left: editable profile */}
        <div className="p-5 md:p-6 space-y-6 md:border-r border-border">
          <div className="flex items-center gap-4">
            <img src={form.photo} alt={form.name} className="w-16 h-16 rounded-full object-cover bg-surface-alt" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Trophy className="w-3.5 h-3.5 text-gold" /> Ranking #{rank} de {total} · comisión generada
              </div>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`w-4 h-4 ${n <= ratingStars ? 'text-gold fill-gold' : 'text-border'}`} />
                ))}
                <span className="text-xs text-muted ml-1">{agent.rating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nombre</label>
              <input value={form.name} onChange={set('name')} className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Rol</label>
              <select value={form.role} onChange={set('role')} className={fieldCls}>
                {AGENT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={set('email')} className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input value={form.phone} onChange={set('phone')} className={fieldCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Foto (URL)</label>
              <input value={form.photo} onChange={set('photo')} className={fieldCls} placeholder="https://…" />
            </div>
            <div>
              <label className={labelCls}>Estado</label>
              <select value={form.status} onChange={set('status')} className={fieldCls}>
                {AGENT_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Turno</label>
              <select value={form.shift} onChange={set('shift')} className={fieldCls}>
                {AGENT_SHIFTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Objetivo mensual (cierres)</label>
              <input type="number" min="0" value={form.monthlyTarget} onChange={set('monthlyTarget')} className={fieldCls} />
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className={labelCls}>Especialidad</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => {
                const active = form.specialties.includes(s.id)
                return (
                  <button key={s.id} type="button" onClick={() => toggleIn('specialties', s.id)}
                    className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                      active ? 'bg-accent/15 text-accent border-accent/50' : 'bg-surface-alt text-muted border-border hover:text-text'
                    }`}>
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Zones */}
          <div>
            <label className={labelCls}>Zonas asignadas</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
              {neighborhoods.map((n) => {
                const active = form.zones.includes(n)
                return (
                  <button key={n} type="button" onClick={() => toggleIn('zones', n)}
                    className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                      active ? 'bg-accent/15 text-accent border-accent/50' : 'bg-surface-alt text-muted border-border hover:text-text'
                    }`}>
                    {n}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Assigned properties */}
          <div>
            <label className={labelCls}>Propiedades asignadas ({form.assignedPropertyIds.length})</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto border border-border rounded-lg p-2">
              {properties.map((p) => {
                const active = form.assignedPropertyIds.includes(p.id)
                return (
                  <label key={p.id} className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer transition-colors ${active ? 'bg-accent/10' : 'hover:bg-surface-alt'}`}>
                    <input type="checkbox" checked={active} onChange={() => toggleIn('assignedPropertyIds', p.id)} className="w-4 h-4 accent-accent" />
                    <Building2 className="w-3.5 h-3.5 text-muted shrink-0" />
                    <span className="text-sm text-text truncate flex-1">{p.title}</span>
                    <span className="text-[11px] text-muted shrink-0">{p.neighborhood}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: metrics + history */}
        <div className="p-5 md:p-6 space-y-6 bg-surface-alt/30">
          <div>
            <h4 className="text-sm font-bold text-text mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-accent" /> Métricas</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <MetricMini label="Mes" value={agent.closedThisMonth} />
              <MetricMini label="Trimestre" value={agent.closedThisQuarter} />
              <MetricMini label="Año" value={agent.closedThisYear} />
            </div>
            <div className="mt-3 space-y-2">
              <MetricRow icon={Award} label="Comisión generada" value={usd(agent.commissionGenerated)} tone="text-gold" />
              <button type="button" onClick={() => goToLeads(agent.id)}
                className="w-full flex items-center justify-between rounded-lg bg-surface border border-border px-3 py-2 hover:border-accent/60 transition-colors group">
                <span className="text-xs text-muted flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Leads activos</span>
                <span className="text-sm font-semibold text-accent inline-flex items-center gap-1">{agent.activeLeads} <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></span>
              </button>
              <MetricRow icon={CalendarCheck} label="Visitas (compl./agend.)" value={`${agent.visitsCompleted}/${agent.visitsScheduled} · ${conv}%`} />
              <MetricRow icon={Timer} label="Resp. promedio" value={`${agent.avgResponseMin} min`} />
            </div>
          </div>

          {/* History */}
          <div>
            <h4 className="text-sm font-bold text-text mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-accent" /> Historial reciente</h4>
            <ol className="space-y-3">
              {(agent.history || []).slice(0, 10).map((h) => {
                const Icon = HISTORY_ICON[h.type] || Clock
                return (
                  <li key={h.id} className="flex gap-2.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-text leading-snug">{h.text}</p>
                      <p className="text-[10px] text-muted mt-0.5">{formatDate(h.date)}</p>
                    </div>
                  </li>
                )
              })}
              {(agent.history || []).length === 0 && <li className="text-xs text-muted">Sin actividad registrada.</li>}
            </ol>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function MetricMini({ label, value }) {
  return (
    <div className="bg-surface border border-border rounded-lg py-2">
      <p className="text-lg font-bold text-text">{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  )
}

function MetricRow({ icon: Icon, label, value, tone = 'text-text' }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface border border-border px-3 py-2">
      <span className="text-xs text-muted flex items-center gap-2"><Icon className="w-3.5 h-3.5" /> {label}</span>
      <span className={`text-sm font-semibold ${tone}`}>{value}</span>
    </div>
  )
}

/* ---------- New agent ---------- */

function NewAgentModal({ open, onClose, properties, addAgent, showToast }) {
  const [form, setForm] = useState(emptyAgent())
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) { setForm(emptyAgent()); setTouched(false) }
  }, [open])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  const toggleIn = (field, value) => setForm((prev) => ({
    ...prev,
    [field]: prev[field].includes(value) ? prev[field].filter((x) => x !== value) : [...prev[field], value]
  }))

  const nameInvalid = touched && !form.name.trim()
  const emailInvalid = touched && !form.email.trim()

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.name.trim() || !form.email.trim()) return
    addAgent({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      photo: form.photo.trim() || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80',
      zone: form.zones[0] || '',
      activeListings: form.assignedPropertyIds.length,
      monthlyTarget: Number(form.monthlyTarget) || 0
    })
    showToast('Agente agregado')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Agregar agente"
      icon={Plus}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancelar</button>
          <button type="submit" form="new-agent-form" className={btnPrimary}>Crear agente</button>
        </div>
      }
    >
      <form id="new-agent-form" onSubmit={submit} className="p-5 md:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nombre *</label>
            <input value={form.name} onChange={set('name')} className={fieldCls} placeholder="Nombre y apellido" />
            {nameInvalid && <p className="text-xs text-error mt-1">El nombre es obligatorio.</p>}
          </div>
          <div>
            <label className={labelCls}>Rol</label>
            <select value={form.role} onChange={set('role')} className={fieldCls}>
              {AGENT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input type="email" value={form.email} onChange={set('email')} className={fieldCls} placeholder="email@terranova.com" />
            {emailInvalid && <p className="text-xs text-error mt-1">El email es obligatorio.</p>}
          </div>
          <div>
            <label className={labelCls}>Teléfono</label>
            <input value={form.phone} onChange={set('phone')} className={fieldCls} placeholder="+54 11 …" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Foto (URL)</label>
            <input value={form.photo} onChange={set('photo')} className={fieldCls} placeholder="https://… (opcional)" />
          </div>
          <div>
            <label className={labelCls}>Estado</label>
            <select value={form.status} onChange={set('status')} className={fieldCls}>
              {AGENT_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Turno</label>
            <select value={form.shift} onChange={set('shift')} className={fieldCls}>
              {AGENT_SHIFTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Objetivo mensual</label>
            <input type="number" min="0" value={form.monthlyTarget} onChange={set('monthlyTarget')} className={fieldCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Especialidad</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map((s) => {
              const active = form.specialties.includes(s.id)
              return (
                <button key={s.id} type="button" onClick={() => toggleIn('specialties', s.id)}
                  className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                    active ? 'bg-accent/15 text-accent border-accent/50' : 'bg-surface-alt text-muted border-border hover:text-text'
                  }`}>
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className={labelCls}>Zonas asignadas</label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
            {neighborhoods.map((n) => {
              const active = form.zones.includes(n)
              return (
                <button key={n} type="button" onClick={() => toggleIn('zones', n)}
                  className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                    active ? 'bg-accent/15 text-accent border-accent/50' : 'bg-surface-alt text-muted border-border hover:text-text'
                  }`}>
                  {n}
                </button>
              )
            })}
          </div>
        </div>
      </form>
    </Modal>
  )
}

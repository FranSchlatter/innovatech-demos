import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, X, Filter, Search, Plus, Trash2,
  Phone, Mail, MessageSquare, MapPin, Clock, StickyNote, UserRound
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useAdmin } from '../../../context/AdminContext'
import StatusBadge from '../shared/StatusBadge'
import Modal from '../shared/Modal'
import { useToast } from '../shared/useToast'
import { fieldCls, labelCls, btnPrimary, btnGhost } from '../shared/formStyles'
import { formatPrice, OPERATION_LABELS } from '../../../utils/format'
import { LEAD_STAGES } from '../../../data/admin/mockLeads'

const STAGE_ACCENT = {
  info: 'bg-info', warning: 'bg-warning', accent: 'bg-accent',
  primary: 'bg-primary', success: 'bg-success', error: 'bg-error'
}
const STAGE_TEXT = {
  info: 'text-info', warning: 'text-warning', accent: 'text-accent',
  primary: 'text-primary', success: 'text-success', error: 'text-error'
}

const SCORE_TONE = { hot: 'error', warm: 'warning', cold: 'muted' }
const SCORE_LABEL = { hot: 'Caliente', warm: 'Templado', cold: 'Frío' }
const SCORE_OPTIONS = ['hot', 'warm', 'cold']
// Static (JIT-safe) active-button classes per score
const SCORE_ACTIVE_CLS = {
  hot: 'bg-error/15 text-error border-error/50',
  warm: 'bg-warning/15 text-warning border-warning/50',
  cold: 'bg-muted/15 text-muted border-muted/50'
}

const SOURCE_LABELS = {
  web: 'Web', portal: 'Portal', zonaprop: 'ZonaProp', argenprop: 'ArgenProp',
  referral: 'Referido', social: 'Redes', phone: 'Teléfono'
}
const SOURCE_OPTIONS = ['web', 'zonaprop', 'argenprop', 'portal', 'referral', 'social', 'phone']

const CONTACT_TYPES = [
  { id: 'call', label: 'Llamada', icon: Phone },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'visit', label: 'Visita', icon: MapPin },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }
]
const CONTACT_META = CONTACT_TYPES.reduce((acc, c) => ({ ...acc, [c.id]: c }), {})

const CURRENCIES = ['USD', 'ARS']

const formatDateTime = (iso) => {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function LeadsManagement() {
  const { leads, agents, properties, updateLead, addLead, deleteLead } = useAdminData()
  const { filters, setFilter } = useAdmin()
  const { showToast, toastNode } = useToast()

  // Agent filter is driven by AdminContext so other modules (e.g. the team
  // panel) can deep-link into "leads of agent X".
  const agentFilter = filters.leads.agent
  const setAgentFilter = (value) => setFilter('leads', 'agent', value)
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [newOpen, setNewOpen] = useState(false)

  // Stage focus comes from the dashboard pipeline (SET_FILTER + SET_VIEW)
  const stageFilter = filters.leads.stage
  const activeStage = stageFilter !== 'all' ? LEAD_STAGES.find((s) => s.id === stageFilter) : null
  const focusRef = useRef(null)

  useEffect(() => {
    if (activeStage && focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [stageFilter, activeStage])

  const clearStageFilter = () => setFilter('leads', 'stage', 'all')

  const agentName = (id) => agents.find((a) => a.id === id)?.name || '—'

  const visibleLeads = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter((l) => {
      if (agentFilter !== 'all' && l.agentId !== agentFilter) return false
      if (q) {
        const hay = `${l.name} ${l.propertyTitle} ${l.email}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [leads, agentFilter, search])

  const stageOrder = LEAD_STAGES.map((s) => s.id)

  const moveStage = (lead, dir) => {
    const idx = stageOrder.indexOf(lead.stage)
    const nextIdx = idx + dir
    if (nextIdx < 0 || nextIdx >= stageOrder.length) return
    updateLead(lead.id, { stage: stageOrder[nextIdx] })
  }

  const markLost = (lead) => {
    if (lead.stage === 'lost') return
    updateLead(lead.id, { stage: 'lost' })
  }

  // Keep the open detail modal in sync with the latest lead data
  const liveSelected = selectedLead ? leads.find((l) => l.id === selectedLead.id) || selectedLead : null

  const totalLeads = leads.length
  const activeCount = leads.filter((l) => l.stage !== 'closed' && l.stage !== 'lost').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Leads / CRM</h2>
          <p className="text-sm text-muted mt-1">
            {totalLeads} leads · <span className="text-accent font-medium">{activeCount} activos</span> · seguimiento del embudo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="all">Todos los agentes</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setNewOpen(true)}
            className={btnPrimary}
          >
            <Plus className="w-4 h-4" /> Nuevo lead
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, propiedad o email…"
          className="w-full text-sm rounded-lg border border-border bg-surface-alt text-text pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      {/* Active stage focus (from dashboard pipeline) */}
      {activeStage && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2">
          <p className="flex items-center gap-2 text-sm text-text">
            <Filter className="w-4 h-4 text-accent shrink-0" />
            Enfocando la etapa <span className="font-semibold">{activeStage.label}</span>
          </p>
          <button
            type="button"
            onClick={clearStageFilter}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-text transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Quitar
          </button>
        </div>
      )}

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_STAGES.map((stage) => {
          const stageLeads = visibleLeads.filter((l) => l.stage === stage.id)
          const focused = activeStage?.id === stage.id
          return (
            <div key={stage.id} ref={focused ? focusRef : null} className="w-72 flex-shrink-0">
              <div
                className={`bg-surface border rounded-xl overflow-hidden transition-shadow ${
                  focused ? 'border-accent ring-2 ring-accent/40 shadow-md' : 'border-border'
                }`}
              >
                <div className={`h-1 ${STAGE_ACCENT[stage.color]}`} />
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${STAGE_ACCENT[stage.color]}`} />
                    <span className={`text-sm font-bold ${STAGE_TEXT[stage.color]}`}>{stage.label}</span>
                  </div>
                  <span className="text-xs font-semibold rounded-full bg-surface-alt text-muted px-2 py-0.5">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Scrollable card list — ~4 cards visible, rest scroll */}
                <div className="p-2 space-y-2 min-h-[120px] max-h-[calc(100vh-360px)] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {stageLeads.map((lead) => {
                      const idx = stageOrder.indexOf(lead.stage)
                      return (
                        <motion.button
                          key={lead.id}
                          layout
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="w-full text-left bg-surface-alt border border-border rounded-lg p-3 hover:border-accent/60 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-text text-sm leading-tight">{lead.name}</p>
                            <StatusBadge label={SCORE_LABEL[lead.score]} tone={SCORE_TONE[lead.score]} dot={false} />
                          </div>

                          <p className="text-xs text-muted truncate mt-1">{lead.propertyTitle}</p>

                          <p className="text-sm font-semibold text-text mt-1.5">
                            {formatPrice(lead.budget, lead.currency, lead.operation)}
                          </p>

                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <span className="rounded-full bg-surface border border-border text-muted px-2 py-0.5">
                              {SOURCE_LABELS[lead.source] || lead.source}
                            </span>
                            <span className="text-muted truncate">{agentName(lead.agentId)}</span>
                          </div>

                          <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-border">
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => { e.stopPropagation(); moveStage(lead, -1) }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); moveStage(lead, -1) } }}
                              aria-disabled={idx <= 0}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border text-muted transition-colors ${
                                idx <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-text hover:bg-surface cursor-pointer'
                              }`}
                              aria-label="Etapa anterior"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </span>

                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => { e.stopPropagation(); markLost(lead) }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); markLost(lead) } }}
                              aria-disabled={lead.stage === 'lost'}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border text-muted transition-colors ${
                                lead.stage === 'lost' ? 'opacity-30 cursor-not-allowed' : 'hover:text-error hover:bg-error/10 cursor-pointer'
                              }`}
                              aria-label="Marcar como perdido"
                            >
                              <X className="w-4 h-4" />
                            </span>

                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => { e.stopPropagation(); moveStage(lead, 1) }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); moveStage(lead, 1) } }}
                              aria-disabled={idx >= stageOrder.length - 1}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border text-muted transition-colors ${
                                idx >= stageOrder.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-accent hover:bg-accent/10 cursor-pointer'
                              }`}
                              aria-label="Etapa siguiente"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </motion.button>
                      )
                    })}
                  </AnimatePresence>

                  {stageLeads.length === 0 && (
                    <p className="text-center text-xs text-muted py-6">Sin leads</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <LeadDetailModal
        lead={liveSelected}
        agents={agents}
        properties={properties}
        onClose={() => setSelectedLead(null)}
        updateLead={updateLead}
        deleteLead={deleteLead}
        showToast={showToast}
      />

      <NewLeadModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        agents={agents}
        properties={properties}
        addLead={addLead}
        showToast={showToast}
      />

      {toastNode}
    </div>
  )
}

/* ---------- Lead detail (editable + notes + contact history) ---------- */

function LeadDetailModal({ lead, agents, properties, onClose, updateLead, deleteLead, showToast }) {
  const [form, setForm] = useState({})
  const [noteLog, setNoteLog] = useState([])
  const [contactLog, setContactLog] = useState([])
  const [noteDraft, setNoteDraft] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Seed working copy each time a new lead is opened
  useEffect(() => {
    if (!lead) return
    setForm({
      name: lead.name, email: lead.email, phone: lead.phone,
      propertyId: lead.propertyId, operation: lead.operation,
      budget: lead.budget, currency: lead.currency,
      score: lead.score, agentId: lead.agentId, source: lead.source
    })
    // Legacy string note becomes the first history entry
    const seededNotes = lead.noteLog?.length
      ? lead.noteLog
      : lead.notes
        ? [{ id: 'legacy', text: lead.notes, at: lead.createdAt }]
        : []
    setNoteLog(seededNotes)
    setContactLog(lead.contactLog || [])
    setNoteDraft('')
    setConfirmDelete(false)
  }, [lead?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const propertyTitleFor = (id) => properties.find((p) => p.id === id)?.title || ''

  const handlePropertyChange = (e) => {
    const id = e.target.value
    const prop = properties.find((p) => p.id === id)
    setForm((prev) => ({
      ...prev,
      propertyId: id,
      operation: prop?.operation || prev.operation,
      currency: prop?.currency || prev.currency
    }))
  }

  const saveFields = () => {
    updateLead(lead.id, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      propertyId: form.propertyId,
      propertyTitle: propertyTitleFor(form.propertyId) || lead.propertyTitle,
      operation: form.operation,
      budget: Number(form.budget) || 0,
      currency: form.currency,
      score: form.score,
      agentId: form.agentId,
      source: form.source
    })
    showToast('Lead actualizado')
    onClose()
  }

  const addNote = () => {
    const text = noteDraft.trim()
    if (!text) return
    const entry = { id: `N-${Date.now()}`, text, at: new Date().toISOString() }
    const next = [entry, ...noteLog]
    setNoteLog(next)
    setNoteDraft('')
    updateLead(lead.id, { noteLog: next })
    showToast('Nota agregada')
  }

  const registerContact = (type) => {
    const entry = { id: `C-${Date.now()}`, type, at: new Date().toISOString() }
    const next = [entry, ...contactLog]
    setContactLog(next)
    updateLead(lead.id, { contactLog: next })
    showToast(`${CONTACT_META[type].label} registrada`)
  }

  const handleDelete = () => {
    deleteLead(lead.id)
    showToast('Lead eliminado', 'muted')
    onClose()
  }

  return (
    <Modal
      open={!!lead}
      onClose={onClose}
      title={form.name || 'Detalle del lead'}
      icon={UserRound}
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-error">¿Eliminar este lead?</span>
              <button type="button" onClick={handleDelete} className="text-xs font-semibold rounded-lg px-3 py-2 bg-error text-white hover:opacity-90">
                Sí, eliminar
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs font-medium rounded-lg px-3 py-2 border border-border text-text hover:bg-surface-alt">
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-error hover:bg-error/10 rounded-lg px-3 py-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>
          )}
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className={btnGhost}>Cerrar</button>
            <button type="button" onClick={saveFields} className={btnPrimary}>Guardar cambios</button>
          </div>
        </div>
      }
    >
      <div className="p-5 md:p-6 space-y-6">
        {/* Editable fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nombre</label>
            <input value={form.name || ''} onChange={set('name')} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email || ''} onChange={set('email')} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Teléfono</label>
            <input value={form.phone || ''} onChange={set('phone')} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Propiedad de interés</label>
            <select value={form.propertyId || ''} onChange={handlePropertyChange} className={fieldCls}>
              <option value="">— Sin asignar —</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Presupuesto</label>
            <div className="flex gap-2">
              <input type="number" min="0" value={form.budget ?? ''} onChange={set('budget')} className={fieldCls} />
              <select value={form.currency || 'USD'} onChange={set('currency')} className={`${fieldCls} w-24`}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Operación</label>
            <select value={form.operation || 'sale'} onChange={set('operation')} className={fieldCls}>
              {Object.entries(OPERATION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Agente asignado</label>
            <select value={form.agentId || ''} onChange={set('agentId')} className={fieldCls}>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Fuente</label>
            <select value={form.source || 'web'} onChange={set('source')} className={fieldCls}>
              {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
            </select>
          </div>
        </div>

        {/* Score selector */}
        <div>
          <label className={labelCls}>Score</label>
          <div className="flex gap-2">
            {SCORE_OPTIONS.map((s) => {
              const active = form.score === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, score: s }))}
                  className={`flex-1 text-sm font-semibold rounded-lg px-3 py-2 border transition-colors ${
                    active ? SCORE_ACTIVE_CLS[s] : 'bg-surface-alt text-muted border-border hover:text-text'
                  }`}
                >
                  {SCORE_LABEL[s]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-bold text-text">Notas</h4>
          </div>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Escribir una nota…"
              className={`${fieldCls} resize-none`}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button type="button" onClick={addNote} disabled={!noteDraft.trim()} className={btnPrimary}>
              <Plus className="w-4 h-4" /> Agregar nota
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {noteLog.length === 0 && <p className="text-xs text-muted">Sin notas registradas.</p>}
            {noteLog.map((n) => (
              <div key={n.id} className="rounded-lg bg-surface-alt border border-border px-3 py-2">
                <p className="text-sm text-text whitespace-pre-wrap">{n.text}</p>
                <p className="text-[11px] text-muted mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDateTime(n.at)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact history */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-bold text-text">Historial de contacto</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {CONTACT_TYPES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => registerContact(c.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 border border-border bg-surface-alt text-text hover:border-accent/60 hover:text-accent transition-colors"
              >
                <c.icon className="w-3.5 h-3.5" /> {c.label}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {contactLog.length === 0 && <p className="text-xs text-muted">Sin contactos registrados.</p>}
            {contactLog.map((c) => {
              const meta = CONTACT_META[c.type]
              const Icon = meta?.icon || Phone
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-lg bg-surface-alt border border-border px-3 py-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text">{meta?.label || c.type}</p>
                    <p className="text-[11px] text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDateTime(c.at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Modal>
  )
}

/* ---------- New lead ---------- */

function NewLeadModal({ open, onClose, agents, properties, addLead, showToast }) {
  const blank = {
    name: '', email: '', phone: '', propertyId: '',
    operation: 'sale', budget: '', currency: 'USD',
    source: 'web', agentId: agents[0]?.id || '', score: 'warm'
  }
  const [form, setForm] = useState(blank)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) { setForm({ ...blank, agentId: agents[0]?.id || '' }); setTouched(false) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handlePropertyChange = (e) => {
    const id = e.target.value
    const prop = properties.find((p) => p.id === id)
    setForm((prev) => ({
      ...prev,
      propertyId: id,
      operation: prop?.operation || prev.operation,
      currency: prop?.currency || prev.currency
    }))
  }

  const nameInvalid = touched && !form.name.trim()

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.name.trim()) return
    const prop = properties.find((p) => p.id === form.propertyId)
    addLead({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      propertyId: form.propertyId,
      propertyTitle: prop?.title || 'Sin asignar',
      operation: form.operation,
      source: form.source,
      stage: 'new',
      score: form.score,
      budget: Number(form.budget) || 0,
      currency: form.currency,
      agentId: form.agentId,
      notes: ''
    })
    showToast('Lead creado')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo lead"
      icon={Plus}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancelar</button>
          <button type="submit" form="new-lead-form" className={btnPrimary}>Crear lead</button>
        </div>
      }
    >
      <form id="new-lead-form" onSubmit={submit} className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nombre *</label>
          <input value={form.name} onChange={set('name')} className={fieldCls} placeholder="Nombre y apellido" />
          {nameInvalid && <p className="text-xs text-error mt-1">El nombre es obligatorio.</p>}
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" value={form.email} onChange={set('email')} className={fieldCls} placeholder="email@ejemplo.com" />
        </div>
        <div>
          <label className={labelCls}>Teléfono</label>
          <input value={form.phone} onChange={set('phone')} className={fieldCls} placeholder="+54 11 …" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Propiedad de interés</label>
          <select value={form.propertyId} onChange={handlePropertyChange} className={fieldCls}>
            <option value="">— Sin asignar —</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Presupuesto</label>
          <div className="flex gap-2">
            <input type="number" min="0" value={form.budget} onChange={set('budget')} className={fieldCls} placeholder="0" />
            <select value={form.currency} onChange={set('currency')} className={`${fieldCls} w-24`}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Operación</label>
          <select value={form.operation} onChange={set('operation')} className={fieldCls}>
            {Object.entries(OPERATION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Fuente</label>
          <select value={form.source} onChange={set('source')} className={fieldCls}>
            {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Agente asignado</label>
          <select value={form.agentId} onChange={set('agentId')} className={fieldCls}>
            {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Score inicial</label>
          <div className="flex gap-2">
            {SCORE_OPTIONS.map((s) => {
              const active = form.score === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, score: s }))}
                  className={`flex-1 text-sm font-semibold rounded-lg px-3 py-2 border transition-colors ${
                    active ? SCORE_ACTIVE_CLS[s] : 'bg-surface-alt text-muted border-border hover:text-text'
                  }`}
                >
                  {SCORE_LABEL[s]}
                </button>
              )
            })}
          </div>
        </div>
      </form>
    </Modal>
  )
}

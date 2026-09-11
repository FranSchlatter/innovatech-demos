import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import DatePicker from '@shared-ui/components/DatePicker'
import {
  MapPin, Video, Phone, User, Plus, Mail, CalendarClock, Link2,
  Copy, Check, CalendarDays, Building2, ChevronRight
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'
import Modal from '../shared/Modal'
import { useToast } from '../shared/useToast'
import { fieldCls, labelCls, btnPrimary, btnGhost } from '../shared/formStyles'
import { formatDate, formatPrice } from '../../../utils/format'
import { VISIT_STATUSES } from '../../../data/admin/mockVisits'

const TODAY = '2026-08-27'

const STATUS_LABELS = {
  scheduled: 'Agendada', confirmed: 'Confirmada', completed: 'Realizada', cancelled: 'Cancelada'
}
const STATUS_TONE = {
  scheduled: 'info', confirmed: 'success', completed: 'muted', cancelled: 'error'
}

const RESULT_OPTIONS = [
  { id: 'interested', label: 'Interesado', tone: 'success' },
  { id: 'not-interested', label: 'No interesado', tone: 'error' },
  { id: 'will-offer', label: 'Hará oferta', tone: 'accent' }
]
const RESULT_META = RESULT_OPTIONS.reduce((acc, r) => ({ ...acc, [r.id]: r }), {})

// 30-min slots 08:00–20:00
const TIME_SLOTS = Array.from({ length: 25 }, (_, i) => {
  const h = 8 + Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2, '0')}:${m}`
})

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function VisitsScheduler() {
  const { visits, agents, properties, updateVisit, addVisit } = useAdminData()
  const { showToast, toastNode } = useToast()

  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)

  const agentName = (id) => agents.find((a) => a.id === id)?.name || '—'

  const filtered = useMemo(
    () => (filter === 'all' ? visits : visits.filter((v) => v.status === filter)),
    [visits, filter]
  )

  const groups = useMemo(() => {
    const map = {}
    filtered.forEach((v) => {
      if (!map[v.date]) map[v.date] = []
      map[v.date].push(v)
    })
    return Object.keys(map)
      .sort()
      .map((date) => ({
        date,
        visits: map[date].sort((a, b) => a.time.localeCompare(b.time))
      }))
  }, [filtered])

  // keep selected visit in sync with store
  const liveSelected = selected ? visits.find((v) => v.id === selected.id) || selected : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Agenda de visitas</h2>
          <p className="text-sm text-muted mt-1">Coordinación y seguimiento de visitas a propiedades</p>
        </div>
        <button type="button" onClick={() => setScheduleOpen(true)} className={btnPrimary}>
          <Plus className="w-4 h-4" /> Agendar visita
        </button>
      </div>

      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>Todas</FilterButton>
        {VISIT_STATUSES.map((s) => (
          <FilterButton key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUS_LABELS[s]}
          </FilterButton>
        ))}
      </div>

      {groups.length === 0 && (
        <p className="text-center text-muted py-12">No hay visitas para este filtro.</p>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-text uppercase tracking-wide">{formatDate(group.date)}</h3>
              {group.date === TODAY && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-gold/20 text-gold px-2 py-0.5">Hoy</span>
              )}
              <span className="text-xs text-muted">· {group.visits.length} visitas</span>
            </div>

            <div className="space-y-3">
              {group.visits.map((v, i) => {
                const prop = properties.find((p) => p.id === v.propertyId)
                return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    onClick={() => setSelected(v)}
                    className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:border-accent/60 hover:shadow-sm transition-all"
                  >
                    {/* Time */}
                    <div className="flex items-center gap-3 md:w-24 md:flex-shrink-0">
                      <span className="font-bold text-lg text-text">{v.time}</span>
                    </div>

                    {/* Property thumb + details */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {prop?.images?.[0] && (
                        <img src={prop.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 bg-surface-alt hidden sm:block" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted mb-1">
                          {v.type === 'in-person'
                            ? <><MapPin className="w-3.5 h-3.5" /> Presencial</>
                            : <><Video className="w-3.5 h-3.5" /> Videollamada</>}
                        </div>
                        <p className="font-semibold text-text truncate">{v.propertyTitle}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mt-1">
                          <span className="inline-flex items-center gap-1"><User className="w-3.5 h-3.5" /> {v.clientName}</span>
                          <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {v.clientPhone}</span>
                          <span>Agente: {agentName(v.agentId)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status + quick actions */}
                    <div className="flex items-center gap-2 md:flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge label={STATUS_LABELS[v.status]} tone={STATUS_TONE[v.status]} />
                      {v.status === 'scheduled' && (
                        <>
                          <ActionButton tone="success" onClick={() => updateVisit(v.id, { status: 'confirmed' })}>Confirmar</ActionButton>
                          <ActionButton tone="error" onClick={() => updateVisit(v.id, { status: 'cancelled' })}>Cancelar</ActionButton>
                        </>
                      )}
                      {v.status === 'confirmed' && (
                        <>
                          <ActionButton tone="accent" onClick={() => updateVisit(v.id, { status: 'completed' })}>Realizada</ActionButton>
                          <ActionButton tone="error" onClick={() => updateVisit(v.id, { status: 'cancelled' })}>Cancelar</ActionButton>
                        </>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted hidden md:block" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <VisitDetailModal
        visit={liveSelected}
        agents={agents}
        properties={properties}
        onClose={() => setSelected(null)}
        updateVisit={updateVisit}
        showToast={showToast}
        agentName={agentName}
      />

      <ScheduleVisitModal
        open={scheduleOpen}
        agents={agents}
        properties={properties}
        onClose={() => setScheduleOpen(false)}
        addVisit={addVisit}
        showToast={showToast}
      />

      {toastNode}
    </div>
  )
}

/* ---------- Visit detail (edit + reschedule + reminders) ---------- */

function VisitDetailModal({ visit, agents, properties, onClose, updateVisit, showToast, agentName }) {
  const [form, setForm] = useState({})
  const [reschedule, setReschedule] = useState(null) // {date, time} while rescheduling
  const [videoLink, setVideoLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!visit) return
    setForm({
      clientName: visit.clientName,
      clientEmail: visit.clientEmail || '',
      clientPhone: visit.clientPhone,
      agentId: visit.agentId,
      notes: visit.notes || '',
      result: visit.result || ''
    })
    setReschedule(null)
    setVideoLink(visit.videoLink || '')
    setCopied(false)
  }, [visit?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const prop = visit ? properties.find((p) => p.id === visit.propertyId) : null
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const save = () => {
    updateVisit(visit.id, {
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      agentId: form.agentId,
      notes: form.notes,
      result: form.result || undefined
    })
    showToast('Visita actualizada')
    onClose()
  }

  const startReschedule = () => setReschedule({ date: visit.date, time: visit.time })
  const confirmReschedule = () => {
    updateVisit(visit.id, { date: reschedule.date, time: reschedule.time, status: 'scheduled' })
    showToast('Visita reagendada')
    setReschedule(null)
  }

  const sendReminder = () => {
    const to = form.clientEmail?.trim() || 'el cliente'
    showToast(`Recordatorio enviado a ${to}`)
  }

  const generateLink = () => {
    const link = `https://meet.terranova.com/v/${visit.id.toLowerCase()}`
    setVideoLink(link)
    updateVisit(visit.id, { videoLink: link })
    showToast('Link de videollamada generado')
  }

  const copyLink = () => {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(videoLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const setStatus = (status) => {
    updateVisit(visit.id, { status })
    showToast(`Visita ${STATUS_LABELS[status].toLowerCase()}`)
  }

  return (
    <Modal
      open={!!visit}
      onClose={onClose}
      title="Detalle de la visita"
      icon={CalendarDays}
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
          <button type="button" onClick={startReschedule}
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg px-3 py-2 transition-colors">
            <CalendarClock className="w-4 h-4" /> Reagendar
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className={btnGhost}>Cerrar</button>
            <button type="button" onClick={save} className={btnPrimary}>Guardar cambios</button>
          </div>
        </div>
      }
    >
      {visit && (
        <div className="p-5 md:p-6 space-y-6">
          {/* Property panel */}
          <div className="flex items-center gap-4 rounded-xl bg-surface-alt border border-border p-3">
            {prop?.images?.[0]
              ? <img src={prop.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
              : <div className="w-16 h-16 rounded-lg bg-surface flex items-center justify-center shrink-0"><Building2 className="w-6 h-6 text-muted" /></div>}
            <div className="min-w-0">
              <p className="font-semibold text-text truncate">{visit.propertyTitle}</p>
              {prop && <p className="text-xs text-muted truncate">{prop.address} · {prop.neighborhood}</p>}
              {prop && <p className="text-sm font-bold text-text mt-0.5">{formatPrice(prop.price, prop.currency, prop.operation)}</p>}
            </div>
          </div>

          {/* Schedule summary + status */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 text-text font-medium">
              <CalendarDays className="w-4 h-4 text-accent" /> {formatDate(visit.date)} · {visit.time}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted">
              {visit.type === 'in-person' ? <MapPin className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              {visit.type === 'in-person' ? 'Presencial' : 'Videollamada'}
            </span>
            <StatusBadge label={STATUS_LABELS[visit.status]} tone={STATUS_TONE[visit.status]} />
          </div>

          {/* Reschedule inline panel */}
          {reschedule && (
            <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
              <p className="text-sm font-semibold text-text mb-3">Reagendar visita</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nueva fecha</label>
                  <DatePicker value={reschedule.date}
                    onChange={(value) => setReschedule((r) => ({ ...r, date: value }))} />
                </div>
                <div>
                  <label className={labelCls}>Nueva hora</label>
                  <select value={reschedule.time}
                    onChange={(e) => setReschedule((r) => ({ ...r, time: e.target.value }))} className={fieldCls}>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setReschedule(null)} className={btnGhost}>Cancelar</button>
                <button type="button" onClick={confirmReschedule} className={btnPrimary}>Confirmar</button>
              </div>
            </div>
          )}

          {/* Client + agent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cliente</label>
              <input value={form.clientName || ''} onChange={set('clientName')} className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.clientEmail || ''} onChange={set('clientEmail')} className={fieldCls} placeholder="email@ejemplo.com" />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input value={form.clientPhone || ''} onChange={set('clientPhone')} className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Agente asignado</label>
              <select value={form.agentId || ''} onChange={set('agentId')} className={fieldCls}>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notas de la visita</label>
            <textarea rows={3} value={form.notes || ''} onChange={set('notes')} className={`${fieldCls} resize-none`} placeholder="Observaciones, indicaciones…" />
          </div>

          {/* Result (when completed) */}
          {visit.status === 'completed' && (
            <div>
              <label className={labelCls}>Resultado</label>
              <div className="flex flex-wrap gap-2">
                {RESULT_OPTIONS.map((r) => {
                  const active = form.result === r.id
                  return (
                    <button key={r.id} type="button"
                      onClick={() => setForm((prev) => ({ ...prev, result: active ? '' : r.id }))}
                      className={`text-sm font-semibold rounded-lg px-3 py-2 border transition-colors ${
                        active ? RESULT_ACTIVE_CLS[r.id] : 'bg-surface-alt text-muted border-border hover:text-text'
                      }`}>
                      {r.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Communication actions */}
          <div className="border-t border-border pt-5 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={sendReminder}
                className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-2 border border-border bg-surface-alt text-text hover:border-accent/60 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" /> Enviar recordatorio
              </button>
              {visit.type === 'video' && (
                <button type="button" onClick={generateLink}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-2 border border-border bg-surface-alt text-text hover:border-accent/60 hover:text-accent transition-colors">
                  <Link2 className="w-4 h-4" /> Generar link de videollamada
                </button>
              )}
              {visit.status !== 'cancelled' && visit.status !== 'completed' && (
                <button type="button" onClick={() => setStatus('completed')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-2 border border-border bg-surface-alt text-text hover:border-success/60 hover:text-success transition-colors">
                  <Check className="w-4 h-4" /> Marcar realizada
                </button>
              )}
            </div>

            {videoLink && (
              <div className="flex items-center gap-2 rounded-lg bg-surface-alt border border-border px-3 py-2">
                <Link2 className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm text-text truncate flex-1">{videoLink}</span>
                <button type="button" onClick={copyLink} aria-label="Copiar link"
                  className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

const RESULT_ACTIVE_CLS = {
  interested: 'bg-success/15 text-success border-success/50',
  'not-interested': 'bg-error/15 text-error border-error/50',
  'will-offer': 'bg-accent/15 text-accent border-accent/50'
}

/* ---------- Schedule new visit ---------- */

function ScheduleVisitModal({ open, agents, properties, onClose, addVisit, showToast }) {
  const blank = {
    propertyId: properties[0]?.id || '',
    clientName: '', clientEmail: '', clientPhone: '',
    date: todayISO(), time: '10:00', type: 'in-person',
    agentId: agents[0]?.id || ''
  }
  const [form, setForm] = useState(blank)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({ ...blank, propertyId: properties[0]?.id || '', agentId: agents[0]?.id || '' })
      setTouched(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const invalid = {
    property: touched && !form.propertyId,
    name: touched && !form.clientName.trim(),
    date: touched && !form.date
  }

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.propertyId || !form.clientName.trim() || !form.date) return
    const prop = properties.find((p) => p.id === form.propertyId)
    addVisit({
      propertyId: form.propertyId,
      propertyTitle: prop?.title || '',
      clientName: form.clientName.trim(),
      clientEmail: form.clientEmail.trim(),
      clientPhone: form.clientPhone.trim(),
      agentId: form.agentId,
      date: form.date,
      time: form.time,
      type: form.type,
      status: 'scheduled',
      notes: ''
    })
    showToast('Visita agendada')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Agendar visita"
      icon={CalendarClock}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancelar</button>
          <button type="submit" form="schedule-visit-form" className={btnPrimary}>Agendar</button>
        </div>
      }
    >
      <form id="schedule-visit-form" onSubmit={submit} className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Propiedad *</label>
          <select value={form.propertyId} onChange={set('propertyId')} className={fieldCls}>
            <option value="">— Seleccionar —</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          {invalid.property && <p className="text-xs text-error mt-1">Elegí una propiedad.</p>}
        </div>
        <div>
          <label className={labelCls}>Cliente *</label>
          <input value={form.clientName} onChange={set('clientName')} className={fieldCls} placeholder="Nombre y apellido" />
          {invalid.name && <p className="text-xs text-error mt-1">El nombre es obligatorio.</p>}
        </div>
        <div>
          <label className={labelCls}>Teléfono</label>
          <input value={form.clientPhone} onChange={set('clientPhone')} className={fieldCls} placeholder="+54 11 …" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Email</label>
          <input type="email" value={form.clientEmail} onChange={set('clientEmail')} className={fieldCls} placeholder="email@ejemplo.com" />
        </div>
        <div>
          <label className={labelCls}>Fecha *</label>
          <DatePicker value={form.date} onChange={(value) => setForm((prev) => ({ ...prev, date: value }))} />
          {invalid.date && <p className="text-xs text-error mt-1">Elegí una fecha.</p>}
        </div>
        <div>
          <label className={labelCls}>Hora</label>
          <select value={form.time} onChange={set('time')} className={fieldCls}>
            {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Tipo</label>
          <select value={form.type} onChange={set('type')} className={fieldCls}>
            <option value="in-person">Presencial</option>
            <option value="video">Videollamada</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Agente asignado</label>
          <select value={form.agentId} onChange={set('agentId')} className={fieldCls}>
            {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </form>
    </Modal>
  )
}

/* ---------- small buttons ---------- */

function FilterButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`text-sm font-medium rounded-lg px-3 py-1.5 border transition-colors ${
        active ? 'bg-primary text-primary-contrast border-primary'
               : 'bg-surface text-muted border-border hover:text-text hover:bg-surface-alt'
      }`}>
      {children}
    </button>
  )
}

const TONE_CLASSES = {
  success: 'text-success border-success/40 hover:bg-success/10',
  error: 'text-error border-error/40 hover:bg-error/10',
  accent: 'text-accent border-accent/40 hover:bg-accent/10'
}

function ActionButton({ tone, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border bg-surface transition-colors whitespace-nowrap ${TONE_CLASSES[tone]}`}>
      {children}
    </button>
  )
}

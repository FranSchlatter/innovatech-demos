import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, Calendar, TrendingUp, Plus, FileCheck2, Clock,
  StickyNote, Handshake, Building2, MapPin, CheckCircle2, Circle, Timer, Percent
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'
import Modal from '../shared/Modal'
import { useToast } from '../shared/useToast'
import { fieldCls, labelCls, btnPrimary, btnGhost } from '../shared/formStyles'
import { formatPrice, formatDate } from '../../../utils/format'
import {
  OPERATION_STAGES, STAGE_PROGRESS, defaultDocs
} from '../../../data/admin/mockOperations'

const STAGE_LABELS = {
  negotiation: 'Negociación',
  reserved: 'Reservada',
  signing: 'En firma',
  closed: 'Cerrada'
}
const STAGE_TONE = {
  negotiation: 'warning',
  reserved: 'info',
  signing: 'accent',
  closed: 'success'
}
const TYPE_LABELS = { sale: 'Venta', rent: 'Alquiler' }

const numberAR = (n) => new Intl.NumberFormat('es-AR').format(Math.round(n))
const todayISO = () => new Date().toISOString().slice(0, 10)
const daysBetween = (a, b) => Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000))

const formatDateTime = (iso) => {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso))
  } catch { return iso }
}

// Commission for a given amount + percentage (rent uses % of a month's rent)
const computeCommission = (amount, pct) => Math.round((Number(amount) || 0) * (Number(pct) || 0) / 100)
// USD-equivalent so mixed-currency averages stay comparable (same heuristic as KPIs)
const toUsd = (value, currency) => (currency === 'USD' ? value : value / 1000)

export default function OperationsManagement() {
  const { operations, agents, properties, updateOperation, addOperation } = useAdminData()
  const { showToast, toastNode } = useToast()

  const [selectedId, setSelectedId] = useState(null)
  const [newOpen, setNewOpen] = useState(false)

  const agentName = (id) => agents.find((a) => a.id === id)?.name || '—'
  const propertyOf = (op) => properties.find((p) => p.id === op.propertyId)

  const openOps = operations.filter((o) => o.stage !== 'closed')
  const closedOps = operations.filter((o) => o.stage === 'closed')
  const pipelineValue = openOps.reduce((sum, o) => sum + (o.amount || 0), 0)
  const estCommission = openOps.reduce((sum, o) => sum + (o.commission || 0), 0)

  // Expanded KPIs
  const avgCloseDays = closedOps.length
    ? Math.round(closedOps.reduce((s, o) => s + daysBetween(o.startDate || o.reserveDate, o.closeDate), 0) / closedOps.length)
    : 0
  const avgCommissionUsd = operations.length
    ? Math.round(operations.reduce((s, o) => s + toUsd(o.commission || 0, o.currency), 0) / operations.length)
    : 0

  const stageOrder = OPERATION_STAGES.map((s) => s.id)

  const liveSelected = selectedId ? operations.find((o) => o.id === selectedId) || null : null

  const advanceStage = (op) => {
    const idx = stageOrder.indexOf(op.stage)
    if (idx < 0 || idx >= stageOrder.length - 1) return
    const nextStage = stageOrder[idx + 1]
    const entry = {
      id: `T-${Date.now()}`,
      stage: nextStage,
      label: `Avanzó a ${STAGE_LABELS[nextStage]}`,
      date: todayISO()
    }
    updateOperation(op.id, {
      stage: nextStage,
      progress: STAGE_PROGRESS[nextStage],
      timeline: [...(op.timeline || []), entry]
    })
    showToast(`Etapa: ${STAGE_LABELS[nextStage]}`)
  }

  const summary = [
    { label: 'Operaciones abiertas', value: openOps.length, tone: 'text-text' },
    { label: 'Valor en pipeline', value: `USD ${numberAR(pipelineValue)}`, tone: 'text-text', hint: 'valor combinado' },
    { label: 'Comisiones estimadas', value: `USD ${numberAR(estCommission)}`, tone: 'text-gold', hint: 'operaciones abiertas' },
    { label: 'Cerradas', value: closedOps.length, tone: 'text-success' },
    { label: 'Tiempo prom. de cierre', value: avgCloseDays ? `${avgCloseDays} días` : '—', tone: 'text-text', hint: 'operaciones cerradas' },
    { label: 'Comisión promedio', value: `USD ${numberAR(avgCommissionUsd)}`, tone: 'text-gold', hint: 'equivalente' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Operaciones</h2>
          <p className="text-sm text-muted mt-1">Reservas, firmas y cierres en curso · tocá una operación para ver el detalle</p>
        </div>
        <button type="button" onClick={() => setNewOpen(true)} className={btnPrimary}>
          <Plus className="w-4 h-4" /> Nueva operación
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {summary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="bg-surface border border-border rounded-xl p-4"
          >
            <p className="text-xs text-muted">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.tone}`}>{s.value}</p>
            {s.hint && <p className="text-[10px] text-muted mt-0.5">{s.hint}</p>}
          </motion.div>
        ))}
      </div>

      {/* Operation cards */}
      <div className="space-y-3">
        {operations.map((op, i) => {
          const isClosed = op.stage === 'closed'
          const docsDone = (op.documents || []).filter((d) => d.done).length
          const docsTotal = (op.documents || []).length
          return (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.04 }}
              onClick={() => setSelectedId(op.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedId(op.id) }}
              className="bg-surface border border-border rounded-xl p-4 cursor-pointer hover:border-accent/60 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: identity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge label={STAGE_LABELS[op.stage]} tone={STAGE_TONE[op.stage]} />
                    <span className="text-xs font-semibold rounded-full bg-surface-alt text-muted px-2 py-0.5">
                      {TYPE_LABELS[op.type] || op.type}
                    </span>
                    {docsTotal > 0 && (
                      <span className="text-xs text-muted inline-flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5" /> {docsDone}/{docsTotal} docs
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-text mt-2 truncate">{op.propertyTitle}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {op.buyer?.name || op.client} · Agente: {agentName(op.agentId)}
                  </p>
                </div>

                {/* Middle: money */}
                <div className="lg:w-56 lg:flex-shrink-0">
                  <p className="text-lg font-bold text-text">
                    {formatPrice(op.amount, op.currency, op.type === 'rent' ? 'rent' : 'sale')}
                  </p>
                  <p className="text-xs text-gold inline-flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Comisión: {formatPrice(op.commission, op.currency, 'sale')}
                  </p>
                  <p className="text-xs text-muted inline-flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(op.startDate || op.reserveDate)} → {formatDate(op.closeDate)}
                  </p>
                </div>

                {/* Right: progress + action */}
                <div className="lg:w-64 lg:flex-shrink-0">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span>Progreso</span>
                    <span className="font-semibold text-text">{op.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${op.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); advanceStage(op) }}
                    disabled={isClosed}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 bg-primary text-primary-contrast hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  >
                    {isClosed ? 'Operación cerrada' : 'Avanzar etapa'}
                    {!isClosed && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <OperationDetailModal
        operation={liveSelected}
        property={liveSelected ? propertyOf(liveSelected) : null}
        agents={agents}
        stageOrder={stageOrder}
        onClose={() => setSelectedId(null)}
        onAdvance={advanceStage}
        updateOperation={updateOperation}
        showToast={showToast}
      />

      <NewOperationModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        agents={agents}
        properties={properties}
        addOperation={addOperation}
        showToast={showToast}
      />

      {toastNode}
    </div>
  )
}

/* ---------- Operation detail (editable + docs + timeline + notes) ---------- */

function OperationDetailModal({ operation, property, agents, stageOrder, onClose, onAdvance, updateOperation, showToast }) {
  const [form, setForm] = useState({})
  const [documents, setDocuments] = useState([])
  const [noteLog, setNoteLog] = useState([])
  const [noteDraft, setNoteDraft] = useState('')

  useEffect(() => {
    if (!operation) return
    setForm({
      buyer: { ...(operation.buyer || { name: operation.client || '', email: '', phone: '' }) },
      seller: { ...(operation.seller || { name: '', email: '', phone: '' }) },
      amount: operation.amount,
      currency: operation.currency,
      commissionPct: operation.commissionPct ?? 4,
      startDate: operation.startDate || operation.reserveDate || '',
      closeDate: operation.closeDate || '',
      agentId: operation.agentId
    })
    setDocuments(operation.documents || [])
    setNoteLog(operation.noteLog || [])
    setNoteDraft('')
  }, [operation?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!operation) return null

  const isClosed = operation.stage === 'closed'
  const idx = stageOrder.indexOf(operation.stage)
  const commission = computeCommission(form.amount, form.commissionPct)

  const setContact = (party, field) => (e) =>
    setForm((prev) => ({ ...prev, [party]: { ...prev[party], [field]: e.target.value } }))
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const toggleDoc = (docId) => {
    const next = documents.map((d) => (d.id === docId ? { ...d, done: !d.done } : d))
    setDocuments(next)
    updateOperation(operation.id, { documents: next })
  }

  const addNote = () => {
    const text = noteDraft.trim()
    if (!text) return
    const entry = { id: `N-${Date.now()}`, text, at: new Date().toISOString() }
    const next = [entry, ...noteLog]
    setNoteLog(next)
    setNoteDraft('')
    updateOperation(operation.id, { noteLog: next })
    showToast('Nota agregada')
  }

  const save = () => {
    updateOperation(operation.id, {
      buyer: form.buyer,
      seller: form.seller,
      client: form.buyer?.name || operation.client,
      amount: Number(form.amount) || 0,
      currency: form.currency,
      commissionPct: Number(form.commissionPct) || 0,
      commission: computeCommission(form.amount, form.commissionPct),
      startDate: form.startDate,
      reserveDate: form.startDate,
      closeDate: form.closeDate,
      agentId: form.agentId
    })
    showToast('Operación actualizada')
    onClose()
  }

  const docsDone = documents.filter((d) => d.done).length

  return (
    <Modal
      open={!!operation}
      onClose={onClose}
      title={operation.propertyTitle}
      icon={Handshake}
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
          <button
            type="button"
            onClick={() => onAdvance(operation)}
            disabled={isClosed}
            className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-2.5 bg-primary text-primary-contrast hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {isClosed ? 'Operación cerrada' : <>Avanzar etapa <ArrowRight className="w-4 h-4" /></>}
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className={btnGhost}>Cerrar</button>
            <button type="button" onClick={save} className={btnPrimary}>Guardar cambios</button>
          </div>
        </div>
      }
    >
      <div className="p-5 md:p-6 space-y-6">
        {/* Stage + property */}
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge label={STAGE_LABELS[operation.stage]} tone={STAGE_TONE[operation.stage]} />
          <span className="text-xs font-semibold rounded-full bg-surface-alt text-muted px-2 py-0.5">
            {TYPE_LABELS[operation.type] || operation.type}
          </span>
          <span className="text-xs text-muted">{operation.id}</span>
        </div>

        <div className="flex gap-3 rounded-xl bg-surface-alt border border-border p-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface shrink-0">
            {property?.images?.[0]
              ? <img src={property.images[0]} alt={operation.propertyTitle} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-muted"><Building2 className="w-6 h-6" /></div>}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text leading-tight">{operation.propertyTitle}</p>
            {property?.address && (
              <p className="text-xs text-muted mt-1 inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {property.address}, {property.neighborhood}
              </p>
            )}
            {property && (
              <p className="text-xs text-muted mt-1">
                Precio publicado: <span className="text-text font-medium">{formatPrice(property.price, property.currency, property.operation)}</span>
              </p>
            )}
          </div>
        </div>

        {/* Buyer / Seller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ContactBlock
            title={operation.type === 'rent' ? 'Inquilino' : 'Comprador'}
            party="buyer" form={form} setContact={setContact}
          />
          <ContactBlock
            title={operation.type === 'rent' ? 'Propietario' : 'Vendedor'}
            party="seller" form={form} setContact={setContact}
          />
        </div>

        {/* Money + dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-5">
          <div>
            <label className={labelCls}>Monto acordado</label>
            <div className="flex gap-2">
              <input type="number" min="0" value={form.amount ?? ''} onChange={set('amount')} className={fieldCls} />
              <select value={form.currency} onChange={set('currency')} className={`${fieldCls} w-24`}>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Comisión (%)</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                <input type="number" min="0" step="0.5" value={form.commissionPct ?? ''} onChange={set('commissionPct')} className={fieldCls} />
              </div>
              <span className="text-sm font-semibold text-gold whitespace-nowrap">
                = {formatPrice(commission, form.currency, 'sale')}
              </span>
            </div>
          </div>
          <div>
            <label className={labelCls}>Fecha de inicio</label>
            <input type="date" value={form.startDate || ''} onChange={set('startDate')} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Fecha estimada de cierre</label>
            <input type="date" value={form.closeDate || ''} onChange={set('closeDate')} className={fieldCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Agente asignado</label>
            <select value={form.agentId || ''} onChange={set('agentId')} className={fieldCls}>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {/* Documents checklist */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-accent" />
              <h4 className="text-sm font-bold text-text">Documentación</h4>
            </div>
            <span className="text-xs text-muted">{docsDone}/{documents.length} completos</span>
          </div>
          <div className="space-y-1.5">
            {documents.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleDoc(d.id)}
                className="w-full flex items-center gap-2.5 text-left rounded-lg px-3 py-2 border border-border bg-surface-alt hover:border-accent/50 transition-colors"
              >
                {d.done
                  ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  : <Circle className="w-4 h-4 text-muted shrink-0" />}
                <span className={`text-sm ${d.done ? 'text-text line-through decoration-success/60' : 'text-text'}`}>{d.label}</span>
              </button>
            ))}
            {documents.length === 0 && <p className="text-xs text-muted">Sin documentos.</p>}
          </div>
        </div>

        {/* Timeline */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Timer className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-bold text-text">Línea de tiempo</h4>
          </div>
          <ol className="relative border-l border-border ml-2 space-y-4">
            {(operation.timeline || []).map((t) => (
              <li key={t.id} className="ml-4">
                <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-accent border-2 border-surface" />
                <p className="text-sm font-medium text-text">{t.label}</p>
                <p className="text-[11px] text-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {formatDate(t.date)} · {STAGE_LABELS[t.stage] || t.stage}
                </p>
              </li>
            ))}
            {(operation.timeline || []).length === 0 && (
              <li className="ml-4"><p className="text-xs text-muted">Sin avances registrados.</p></li>
            )}
          </ol>
        </div>

        {/* Notes */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-bold text-text">Notas</h4>
          </div>
          <textarea
            rows={2}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Escribir una nota…"
            className={`${fieldCls} resize-none`}
          />
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
      </div>
    </Modal>
  )
}

function ContactBlock({ title, party, form, setContact }) {
  const c = form[party] || {}
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{title}</p>
      <div className="space-y-2">
        <input value={c.name || ''} onChange={setContact(party, 'name')} className={fieldCls} placeholder="Nombre" />
        <input type="email" value={c.email || ''} onChange={setContact(party, 'email')} className={fieldCls} placeholder="Email" />
        <input value={c.phone || ''} onChange={setContact(party, 'phone')} className={fieldCls} placeholder="Teléfono" />
      </div>
    </div>
  )
}

/* ---------- New operation ---------- */

function NewOperationModal({ open, onClose, agents, properties, addOperation, showToast }) {
  const blank = {
    propertyId: '', type: 'sale',
    buyerName: '', buyerEmail: '', buyerPhone: '',
    sellerName: '', sellerEmail: '', sellerPhone: '',
    amount: '', currency: 'USD', commissionPct: 4,
    startDate: todayISO(), closeDate: '', agentId: agents[0]?.id || ''
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
      type: prop?.operation === 'rent' || prop?.operation === 'temporary' ? 'rent' : 'sale',
      amount: prop?.price ?? prev.amount,
      currency: prop?.currency || prev.currency,
      commissionPct: prop?.operation === 'rent' ? 100 : 4,
      sellerName: prev.sellerName
    }))
  }

  const selectedProp = properties.find((p) => p.id === form.propertyId)
  const propInvalid = touched && !form.propertyId
  const buyerInvalid = touched && !form.buyerName.trim()
  const amountInvalid = touched && (form.amount === '' || Number(form.amount) <= 0)

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.propertyId || !form.buyerName.trim() || Number(form.amount) <= 0) return
    const commission = computeCommission(form.amount, form.commissionPct)
    addOperation({
      propertyId: form.propertyId,
      propertyTitle: selectedProp?.title || 'Propiedad',
      type: form.type,
      client: form.buyerName.trim(),
      buyer: { name: form.buyerName.trim(), email: form.buyerEmail.trim(), phone: form.buyerPhone.trim() },
      seller: { name: form.sellerName.trim(), email: form.sellerEmail.trim(), phone: form.sellerPhone.trim() },
      agentId: form.agentId,
      amount: Number(form.amount) || 0,
      currency: form.currency,
      commissionPct: Number(form.commissionPct) || 0,
      commission,
      stage: 'negotiation',
      startDate: form.startDate,
      reserveDate: form.startDate,
      closeDate: form.closeDate || form.startDate,
      progress: STAGE_PROGRESS.negotiation,
      documents: defaultDocs(form.type),
      timeline: [{ id: `T-${Date.now()}`, stage: 'negotiation', label: 'Operación iniciada', date: form.startDate }],
      noteLog: []
    })
    showToast('Operación creada')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva operación"
      icon={Plus}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancelar</button>
          <button type="submit" form="new-operation-form" className={btnPrimary}>Crear operación</button>
        </div>
      }
    >
      <form id="new-operation-form" onSubmit={submit} className="p-5 md:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Propiedad *</label>
            <select value={form.propertyId} onChange={handlePropertyChange} className={fieldCls}>
              <option value="">— Seleccionar propiedad —</option>
              {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            {propInvalid && <p className="text-xs text-error mt-1">Elegí una propiedad.</p>}
          </div>
          <div>
            <label className={labelCls}>Tipo</label>
            <select value={form.type} onChange={set('type')} className={fieldCls}>
              <option value="sale">Venta</option>
              <option value="rent">Alquiler</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Monto acordado *</label>
            <div className="flex gap-2">
              <input type="number" min="0" value={form.amount} onChange={set('amount')} className={fieldCls} placeholder="0" />
              <select value={form.currency} onChange={set('currency')} className={`${fieldCls} w-24`}>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </div>
            {amountInvalid && <p className="text-xs text-error mt-1">Ingresá un monto válido.</p>}
          </div>
          <div>
            <label className={labelCls}>Comisión (%)</label>
            <input type="number" min="0" step="0.5" value={form.commissionPct} onChange={set('commissionPct')} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Agente asignado</label>
            <select value={form.agentId} onChange={set('agentId')} className={fieldCls}>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Fecha de inicio</label>
            <input type="date" value={form.startDate} onChange={set('startDate')} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Fecha estimada de cierre</label>
            <input type="date" value={form.closeDate} onChange={set('closeDate')} className={fieldCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-border pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Comprador / Inquilino *</p>
            <div className="space-y-2">
              <input value={form.buyerName} onChange={set('buyerName')} className={fieldCls} placeholder="Nombre" />
              {buyerInvalid && <p className="text-xs text-error">El nombre es obligatorio.</p>}
              <input type="email" value={form.buyerEmail} onChange={set('buyerEmail')} className={fieldCls} placeholder="Email" />
              <input value={form.buyerPhone} onChange={set('buyerPhone')} className={fieldCls} placeholder="Teléfono" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Vendedor / Propietario</p>
            <div className="space-y-2">
              <input value={form.sellerName} onChange={set('sellerName')} className={fieldCls} placeholder="Nombre" />
              <input type="email" value={form.sellerEmail} onChange={set('sellerEmail')} className={fieldCls} placeholder="Email" />
              <input value={form.sellerPhone} onChange={set('sellerPhone')} className={fieldCls} placeholder="Teléfono" />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

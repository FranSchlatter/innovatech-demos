import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet, Download, Building2, Check, Clock, Landmark, Plus, Trash2,
  FileText, Receipt, CreditCard, X, CalendarDays
} from 'lucide-react'
import { useLiquidations } from '../../../hooks/useLiquidations'
import {
  computePeriod, EXPENSE_TYPES, COLLECTION_STATUS, periodLabel
} from '../../../data/admin/mockLiquidations'
import StatusBadge from '../shared/StatusBadge'
import Modal from '../shared/Modal'
import { useToast } from '../shared/useToast'
import { fieldCls, labelCls, btnPrimary, btnGhost } from '../shared/formStyles'

const ars = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`
const STATUS_META = COLLECTION_STATUS.reduce((acc, s) => ({ ...acc, [s.id]: s }), {})
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const formatCollectDate = (iso) => {
  if (!iso) return null
  try {
    return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' }).format(new Date(iso))
  } catch { return iso }
}

export default function OwnerLiquidations() {
  const {
    owners, setPropertyStatus, addExpense, updateExpense, removeExpense,
    setMgmtFee, addPeriod
  } = useLiquidations()
  const { showToast, toastNode } = useToast()

  const [activeOwnerId, setActiveOwnerId] = useState(owners[0]?.id)
  const [activePeriodId, setActivePeriodId] = useState(owners[0]?.periods[0]?.id)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [newOpen, setNewOpen] = useState(false)

  const owner = owners.find((o) => o.id === activeOwnerId) || owners[0]
  const period = owner?.periods.find((p) => p.id === activePeriodId) || owner?.periods[0]
  const c = useMemo(() => (period ? computePeriod(period, owner.mgmtFeePct) : null), [period, owner])

  const selectOwner = (id) => {
    const o = owners.find((x) => x.id === id)
    setActiveOwnerId(id)
    setActivePeriodId(o?.periods[0]?.id)
  }

  if (!owner || !period || !c) return null

  const addBlankExpense = (propId) =>
    addExpense(owner.id, period.id, propId, { type: 'Otros', label: 'Nuevo gasto', amount: 0 })

  const handleNewPeriod = (ownerId, month, year) => {
    const newId = addPeriod(ownerId, month, year)
    setActiveOwnerId(ownerId)
    if (newId) {
      setActivePeriodId(newId)
      showToast(`Liquidación de ${periodLabel(month, year)} creada`)
    } else {
      showToast('Ese período ya existe', 'warning')
    }
    setNewOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2"><Wallet className="w-5 h-5 text-accent" /> Liquidación al propietario</h1>
          <p className="text-muted mt-1">Lo cobrado, menos comisión y gastos, es lo que recibe cada propietario — con recibo listo para enviar.</p>
        </div>
        <button type="button" onClick={() => setNewOpen(true)} className={btnPrimary}>
          <Plus className="w-4 h-4" /> Nueva liquidación
        </button>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-4">
        {/* Owner list */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden h-fit">
          {owners.map((o) => {
            const cur = computePeriod(o.periods[0], o.mgmtFeePct)
            const active = o.id === owner.id
            return (
              <button key={o.id} onClick={() => selectOwner(o.id)}
                className={`w-full text-left p-4 border-b border-border last:border-0 transition-colors ${active ? 'bg-primary/10' : 'hover:bg-surface-alt'}`}>
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-muted shrink-0" />
                  <p className="text-sm font-semibold text-text truncate">{o.owner}</p>
                </div>
                <p className="text-xs text-muted mt-1">{o.periods[0].properties.length} propiedad{o.periods[0].properties.length > 1 ? 'es' : ''} · {o.periods[0].period}</p>
                <p className="text-sm font-bold text-accent mt-1">Neto {ars(cur.net)}</p>
              </button>
            )
          })}
        </div>

        {/* Detail */}
        <motion.div key={owner.id + period.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 p-5 border-b border-border">
            <div className="min-w-0">
              <h2 className="font-bold text-text text-lg">{owner.owner}</h2>
              <p className="text-xs text-muted mt-0.5">CUIT {owner.cuit}</p>
              <p className="text-xs text-muted">{owner.address}</p>
              <p className="text-xs text-muted mt-1 inline-flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> {owner.bank.bank} · {owner.bank.alias}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Period selector */}
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <select value={period.id} onChange={(e) => setActivePeriodId(e.target.value)}
                  className="text-sm rounded-lg border border-border bg-surface-alt text-text pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40">
                  {owner.periods.map((p) => <option key={p.id} value={p.id}>{p.period}</option>)}
                </select>
              </div>
              <button type="button" onClick={() => setReceiptOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-accent text-primary-contrast hover:opacity-90 transition-opacity">
                <FileText className="w-4 h-4" /> Generar recibo
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Per-property breakdown */}
            <div className="space-y-4">
              {c.perProperty.map((p) => {
                const st = STATUS_META[p.status] || STATUS_META.pendiente
                return (
                  <div key={p.id} className="rounded-xl border border-border overflow-hidden">
                    {/* Property head */}
                    <div className="flex flex-wrap items-start justify-between gap-3 p-3 bg-surface-alt/50">
                      <div className="min-w-0 flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text truncate">{p.title}</p>
                          <p className="text-xs text-muted truncate">{p.address} · {p.tenant}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select value={p.status} onChange={(e) => setPropertyStatus(owner.id, period.id, p.id, e.target.value)}
                          className="text-xs font-semibold rounded-lg border border-border bg-surface text-text px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent/40">
                          {COLLECTION_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                        <StatusBadge label={st.label} tone={st.tone} dot={false} />
                      </div>
                    </div>

                    {/* Rent + expenses */}
                    <div className="p-3 space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted flex items-center gap-2">
                          Alquiler cobrado
                          {p.collectDate && <span className="text-[10px] text-muted">· {formatCollectDate(p.collectDate)}</span>}
                        </span>
                        <span className={`font-medium ${p.collected ? 'text-text' : 'text-muted'}`}>{ars(p.collected)}</span>
                      </div>

                      {/* Expenses (editable) */}
                      {p.expenses.map((e) => (
                        <div key={e.id} className="flex items-center gap-2 pl-3">
                          <select value={e.type} onChange={(ev) => updateExpense(owner.id, period.id, p.id, e.id, { type: ev.target.value })}
                            className="text-xs rounded-lg border border-border bg-surface-alt text-text px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/40 w-32 shrink-0">
                            {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <input value={e.label} onChange={(ev) => updateExpense(owner.id, period.id, p.id, e.id, { label: ev.target.value })}
                            className="text-xs rounded-lg border border-border bg-surface-alt text-text px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/40 flex-1 min-w-0" placeholder="Concepto" />
                          <div className="relative shrink-0">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted">$</span>
                            <input type="number" min="0" value={e.amount} onChange={(ev) => updateExpense(owner.id, period.id, p.id, e.id, { amount: Number(ev.target.value) || 0 })}
                              className="text-xs rounded-lg border border-border bg-surface-alt text-error pl-5 pr-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/40 w-28 text-right" />
                          </div>
                          <button type="button" onClick={() => removeExpense(owner.id, period.id, p.id, e.id)} aria-label="Quitar gasto"
                            className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error/10 shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button type="button" onClick={() => addBlankExpense(p.id)}
                        className="ml-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
                        <Plus className="w-3.5 h-3.5" /> Agregar gasto
                      </button>

                      {/* Subtotal */}
                      <div className="flex justify-between pt-2 mt-1 border-t border-border">
                        <span className="text-muted font-medium">Subtotal propiedad</span>
                        <span className={`font-bold ${p.subtotal >= 0 ? 'text-text' : 'text-error'}`}>{ars(p.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* General summary */}
            <div className="rounded-xl border border-border p-4 space-y-2 text-sm bg-surface-alt/30">
              <div className="flex justify-between"><span className="text-muted">Total cobrado</span><span className="text-text font-medium">{ars(c.grossCollected)}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-muted inline-flex items-center gap-2">
                  Comisión de administración
                  <span className="relative inline-flex items-center">
                    <input type="number" min="0" max="100" step="0.5" value={(owner.mgmtFeePct * 100).toFixed(1).replace(/\.0$/, '')}
                      onChange={(e) => setMgmtFee(owner.id, (Number(e.target.value) || 0) / 100)}
                      className="w-16 text-xs rounded-lg border border-border bg-surface text-text px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-accent/40" />
                    <span className="ml-1 text-xs text-muted">%</span>
                  </span>
                </span>
                <span className="text-error">− {ars(c.mgmtFee)}</span>
              </div>
              <div className="flex justify-between"><span className="text-muted">Gastos de las propiedades</span><span className="text-error">− {ars(c.expensesTotal)}</span></div>
              <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                <span className="text-text">Neto al propietario</span><span className="text-accent">{ars(c.net)}</span>
              </div>
              {c.pending > 0 && (
                <p className="text-xs text-warning flex items-center gap-1 pt-1">
                  <Clock className="w-3.5 h-3.5" /> {ars(c.pending)} pendiente de cobro (no incluido en el neto)
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <ReceiptModal open={receiptOpen} onClose={() => setReceiptOpen(false)} owner={owner} period={period} c={c} showToast={showToast} />
      <NewLiquidationModal open={newOpen} onClose={() => setNewOpen(false)} owners={owners} onCreate={handleNewPeriod} />

      {toastNode}
    </div>
  )
}

/* ---------- Receipt preview (PDF-style) ---------- */

function ReceiptModal({ open, onClose, owner, period, c, showToast }) {
  const [downloaded, setDownloaded] = useState(false)

  const download = () => {
    setDownloaded(true)
    showToast('Recibo descargado (PDF)')
  }

  return (
    <Modal
      open={open}
      onClose={() => { setDownloaded(false); onClose() }}
      title={`Recibo de liquidación · ${period.period}`}
      icon={Receipt}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={() => { setDownloaded(false); onClose() }} className={btnGhost}>Cerrar</button>
          <button type="button" onClick={download}
            className={`inline-flex items-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-colors ${downloaded ? 'bg-success/15 text-success' : 'bg-accent text-primary-contrast hover:opacity-90'}`}>
            {downloaded ? <><Check className="w-4 h-4" /> Descargado</> : <><Download className="w-4 h-4" /> Descargar PDF</>}
          </button>
        </div>
      }
    >
      <div className="p-5 md:p-6">
        {/* Paper */}
        <div className="rounded-xl border border-border bg-bg p-6 space-y-5">
          {/* Agency header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-lg font-bold text-text">TerraNova Propiedades</p>
              <p className="text-xs text-muted">Administración de alquileres · CUIT 30-71234567-8</p>
              <p className="text-xs text-muted">Av. Corrientes 1234, CABA · (011) 4000-1234</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Recibo de liquidación</p>
              <p className="text-xs text-muted mt-1">Período: {period.period}</p>
              <p className="text-xs text-muted">N° {period.id}</p>
            </div>
          </div>

          {/* Owner */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Propietario</p>
            <p className="text-sm font-semibold text-text">{owner.owner}</p>
            <p className="text-xs text-muted">CUIT {owner.cuit} · {owner.address}</p>
            <p className="text-xs text-muted">{owner.bank.bank} · CBU {owner.bank.cbu}</p>
          </div>

          {/* Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="py-2 font-semibold">Propiedad / Inquilino</th>
                <th className="py-2 font-semibold text-right">Cobrado</th>
                <th className="py-2 font-semibold text-right">Gastos</th>
                <th className="py-2 font-semibold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {c.perProperty.map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="py-2 pr-2">
                    <p className="text-text font-medium">{p.title}</p>
                    <p className="text-muted">{p.tenant} · {STATUS_META[p.status]?.label}</p>
                  </td>
                  <td className="py-2 text-right text-text whitespace-nowrap">{ars(p.collected)}</td>
                  <td className="py-2 text-right text-error whitespace-nowrap">{p.expensesTotal ? `− ${ars(p.expensesTotal)}` : '—'}</td>
                  <td className="py-2 text-right font-semibold text-text whitespace-nowrap">{ars(p.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="ml-auto max-w-xs space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-muted">Total cobrado</span><span className="text-text">{ars(c.grossCollected)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Comisión ({(owner.mgmtFeePct * 100).toFixed(1).replace(/\.0$/, '')}%)</span><span className="text-error">− {ars(c.mgmtFee)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Gastos</span><span className="text-error">− {ars(c.expensesTotal)}</span></div>
            <div className="flex justify-between pt-2 border-t border-border text-sm font-bold"><span className="text-text">Neto a pagar</span><span className="text-accent">{ars(c.net)}</span></div>
          </div>

          <p className="text-[10px] text-muted border-t border-border pt-3">
            Documento generado automáticamente con fines demostrativos. No posee validez fiscal. Los montos corresponden al período indicado y quedan sujetos a la rendición definitiva de gastos.
          </p>
        </div>
      </div>
    </Modal>
  )
}

/* ---------- New liquidation ---------- */

function NewLiquidationModal({ open, onClose, owners, onCreate }) {
  const [ownerId, setOwnerId] = useState(owners[0]?.id || '')
  const [month, setMonth] = useState(9)
  const [year, setYear] = useState(2026)

  const submit = (e) => {
    e.preventDefault()
    onCreate(ownerId, Number(month), Number(year))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva liquidación"
      icon={Plus}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancelar</button>
          <button type="submit" form="new-liquidation-form" className={btnPrimary}>Generar</button>
        </div>
      }
    >
      <form id="new-liquidation-form" onSubmit={submit} className="p-5 md:p-6 space-y-4">
        <p className="text-xs text-muted">
          Se crea un período nuevo tomando las propiedades del propietario. Los alquileres arrancan como <span className="font-semibold">pendientes</span> y sin gastos, listos para completar.
        </p>
        <div>
          <label className={labelCls}>Propietario</label>
          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} className={fieldCls}>
            {owners.map((o) => <option key={o.id} value={o.id}>{o.owner}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Mes</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className={fieldCls}>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Año</label>
            <input type="number" min="2024" max="2030" value={year} onChange={(e) => setYear(e.target.value)} className={fieldCls} />
          </div>
        </div>
      </form>
    </Modal>
  )
}

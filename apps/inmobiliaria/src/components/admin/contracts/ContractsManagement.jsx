import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Calculator, Building2, AlertTriangle, ChevronRight, Plus, Search,
  ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, User, Users, CalendarClock,
  TrendingUp, FileSignature, Download, CheckCircle, Clock, XCircle, RefreshCw,
  Ban, Wallet, ShieldCheck
} from 'lucide-react'
import DatePicker from '@shared-ui/components/DatePicker'
import {
  INDICES, FREQUENCIES, CONTRACT_STATUSES, deriveContract, contractEndDate,
  fmtDate, fmtMonthYear, TODAY, toISO, parseISO
} from '../../../data/admin/mockContracts'
import { contracts as seedContracts } from '../../../data/admin/mockContracts'
import { mockAgents } from '../../../data/admin/mockAgents'
import properties from '../../../data/properties.json'
import { useContracts } from '../../../hooks/useContracts'
import { useToast } from '../shared/useToast'
import Modal from '../shared/Modal'
import { fieldCls, labelCls, btnPrimary, btnGhost } from '../shared/formStyles'
import AdjustmentSimulator from './AdjustmentSimulator'

const ars = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n))}`
const arsK = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1000)}k`
  return `$${Math.round(n)}`
}

const agentById = (id) => mockAgents.find((a) => a.id === id)
const propById = (id) => properties.find((p) => p.id === id)
const seedIds = new Set(seedContracts.map((c) => c.id))
const RENTAL_PROPS = properties.filter((p) => p.operation === 'rent' || p.operation === 'temporary')

// ---------- shared bits ----------

function StatusBadge({ status, size = 'sm' } = {}) {
  if (!status) return null
  const pad = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
  if (status.tone === 'muted') {
    return (
      <span className={`inline-flex items-center rounded-full ${pad} font-semibold bg-surface-alt text-muted border border-border`}>
        {status.label}
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center rounded-full ${pad} font-semibold text-white`}
      style={{ backgroundColor: `var(--color-${status.tone})` }}
    >
      {status.label}
    </span>
  )
}

function KpiCard({ icon: Icon, label, value, hint, accent }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wide">
        <Icon className={`w-4 h-4 ${accent ? 'text-accent' : ''}`} /> {label}
      </div>
      <div className="mt-1.5 text-2xl font-bold text-text tabular-nums">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </div>
  )
}

// ==================================================================
// Root — tabbed container (management table + adjustment simulator)
// ==================================================================

export default function ContractsManagement() {
  const [tab, setTab] = useState('list') // list | sim
  const [simContractId, setSimContractId] = useState(seedContracts[0].id)

  const goSimulate = (id) => {
    setSimContractId(seedIds.has(id) ? id : seedContracts[0].id)
    setTab('sim')
  }

  const TABS = [
    { id: 'list', label: 'Contratos vigentes', icon: FileSignature },
    { id: 'sim', label: 'Simulador de ajuste', icon: Calculator }
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" /> Contratos de locación
        </h1>
        <p className="text-muted mt-1">Gestión de contratos vigentes y proyección de ajustes por índice — el diferencial para alquileres en Argentina.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                active ? 'text-accent' : 'text-muted hover:text-text'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
              {active && (
                <motion.span layoutId="contracts-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {tab === 'list'
        ? <ContractsTable onSimulate={goSimulate} />
        : <AdjustmentSimulator key={simContractId} initialContractId={simContractId} />}
    </div>
  )
}

// ==================================================================
// Management table
// ==================================================================

const COLUMNS = [
  { key: 'property', label: 'Propiedad', sortable: true },
  { key: 'tenant', label: 'Inquilino', sortable: true },
  { key: 'owner', label: 'Propietario', sortable: true, hideBelow: 'xl' },
  { key: 'start', label: 'Inicio', sortable: true, hideBelow: 'lg', align: 'right' },
  { key: 'end', label: 'Vencimiento', sortable: true, align: 'right' },
  { key: 'rent', label: 'Monto actual', sortable: true, align: 'right' },
  { key: 'index', label: 'Índice', sortable: true, align: 'center', hideBelow: 'lg' },
  { key: 'next', label: 'Próx. ajuste', sortable: true, hideBelow: 'xl', align: 'right' },
  { key: 'status', label: 'Estado', sortable: true, align: 'center' }
]

const STATUS_ORDER = { expired: 0, expiring: 1, active: 2, terminated: 3 }

function ContractsTable({ onSimulate }) {
  const { contracts, addContract, renewContract, terminateContract, resetContracts } = useContracts()
  const { showToast, toastNode } = useToast()

  const [query, setQuery] = useState('')
  const [fStatus, setFStatus] = useState('all')
  const [fIndex, setFIndex] = useState('all')
  const [fAgent, setFAgent] = useState('all')
  const [sortKey, setSortKey] = useState('end')
  const [sortDir, setSortDir] = useState('asc')

  const [detailId, setDetailId] = useState(null)
  const [newOpen, setNewOpen] = useState(false)

  // Derive lifecycle for every contract at the reference date.
  const derived = useMemo(() => contracts.map((c) => deriveContract(c, TODAY)), [contracts])
  const detail = detailId ? derived.find((c) => c.id === detailId) : null

  // KPIs
  const kpis = useMemo(() => {
    const alive = derived.filter((c) => c.statusId === 'active' || c.statusId === 'expiring')
    const monthly = alive.reduce((s, c) => s + c.currentRent, 0)
    const expiring = derived.filter((c) => c.statusId === 'expiring')
    const nextAdj = alive
      .map((c) => c.nextAdjustment)
      .filter(Boolean)
      .sort((a, b) => a.days - b.days)[0]
    return {
      active: derived.filter((c) => c.statusId === 'active').length,
      expiring: expiring.length,
      monthly,
      nextAdj
    }
  }, [derived])

  const expiringList = useMemo(
    () => derived.filter((c) => c.statusId === 'expiring').sort((a, b) => a.daysToEnd - b.daysToEnd),
    [derived]
  )

  // Filter + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return derived.filter((c) => {
      if (fStatus !== 'all' && c.statusId !== fStatus) return false
      if (fIndex !== 'all' && c.index !== fIndex) return false
      if (fAgent !== 'all' && c.agentId !== fAgent) return false
      if (q) {
        const hay = `${c.id} ${c.property} ${c.tenant} ${c.owner} ${c.address}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [derived, query, fStatus, fIndex, fAgent])

  // Sort
  const sorted = useMemo(() => {
    const val = (c) => {
      switch (sortKey) {
        case 'property': return c.property.toLowerCase()
        case 'tenant': return c.tenant.toLowerCase()
        case 'owner': return c.owner.toLowerCase()
        case 'start': return c.startDate
        case 'end': return c.endDate
        case 'rent': return c.currentRent
        case 'index': return c.index
        case 'next': return c.nextAdjustment ? c.nextAdjustment.days : Number.POSITIVE_INFINITY
        case 'status': return STATUS_ORDER[c.statusId] ?? 9
        default: return c.id
      }
    }
    const arr = [...filtered].sort((a, b) => {
      const va = val(a), vb = val(b)
      if (va < vb) return -1
      if (va > vb) return 1
      return a.id < b.id ? -1 : 1
    })
    return sortDir === 'asc' ? arr : arr.reverse()
  }, [filtered, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const activeFilters = (fStatus !== 'all') + (fIndex !== 'all') + (fAgent !== 'all') + (query.trim() ? 1 : 0)

  const handleCreate = (payload) => {
    const created = addContract(payload)
    setNewOpen(false)
    showToast(`Contrato ${created.id} creado para ${created.tenant}.`, 'success')
  }
  const handleRenew = (id, months) => {
    renewContract(id, months)
    showToast(`Contrato ${id} renovado por ${months} meses.`, 'success')
  }
  const handleTerminate = (id, dateISO, reason) => {
    terminateContract(id, dateISO, reason)
    showToast(`Contrato ${id} rescindido con fecha ${fmtDate(dateISO)}.`, 'info')
  }

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={ShieldCheck} label="Vigentes" value={kpis.active} hint="contratos activos" accent />
        <KpiCard icon={CalendarClock} label="Por vencer" value={kpis.expiring} hint="< 90 días" />
        <KpiCard icon={Wallet} label="Renta mensual" value={arsK(kpis.monthly)} hint="cartera activa" />
        <KpiCard
          icon={TrendingUp}
          label="Próximo ajuste"
          value={kpis.nextAdj ? `${kpis.nextAdj.days}d` : '—'}
          hint={kpis.nextAdj ? fmtDate(kpis.nextAdj.dateISO) : 'sin ajustes próximos'}
        />
      </div>

      {/* Expiry alert banner */}
      <AnimatePresence initial={false}>
        {expiringList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border px-4 py-3.5"
            style={{ backgroundColor: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
          >
            <div className="flex items-start gap-2.5 text-white">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">
                  {expiringList.length} contrato{expiringList.length > 1 ? 's' : ''} por vencer en los próximos 90 días
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {expiringList.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-3 bg-white/15 rounded-lg px-3 py-2">
                      <button onClick={() => setDetailId(c.id)} className="flex-1 min-w-0 text-left">
                        <span className="text-sm font-semibold truncate block">{c.property}</span>
                        <span className="text-xs text-white/85">{c.tenant} · vence {fmtDate(c.endDate)} · en {c.daysToEnd} días</span>
                      </button>
                      <button
                        onClick={() => handleRenew(c.id, c.termMonths)}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-white text-warning font-semibold text-xs px-3 py-1.5 hover:opacity-90 transition-opacity"
                        style={{ color: 'var(--color-warning)' }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Renovar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="bg-surface border border-border rounded-xl p-3.5 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por propiedad, inquilino, propietario o N° de contrato…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-alt border border-border text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/50">
            <option value="all">Estado: todos</option>
            {CONTRACT_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={fIndex} onChange={(e) => setFIndex(e.target.value)} className="rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/50">
            <option value="all">Índice: todos</option>
            {Object.values(INDICES).map((ix) => <option key={ix.id} value={ix.id}>{ix.id}</option>)}
          </select>
          <select value={fAgent} onChange={(e) => setFAgent(e.target.value)} className="rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/50">
            <option value="all">Agente: todos</option>
            {mockAgents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {activeFilters > 0 && (
            <button
              onClick={() => { setQuery(''); setFStatus('all'); setFIndex('all'); setFAgent('all') }}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors px-2 py-2.5"
            >
              <RotateCcw className="w-4 h-4" /> Limpiar
            </button>
          )}
          <button onClick={() => setNewOpen(true)} className={btnPrimary}>
            <Plus className="w-4 h-4" /> Nuevo contrato
          </button>
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                {COLUMNS.map((col) => {
                  const hide = col.hideBelow === 'lg' ? 'hidden lg:table-cell' : col.hideBelow === 'xl' ? 'hidden xl:table-cell' : ''
                  const alignCls = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  const active = sortKey === col.key
                  const SortIcon = !active ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown
                  return (
                    <th key={col.key} className={`${hide} ${alignCls} px-3 py-3 font-semibold text-muted whitespace-nowrap`}>
                      <button
                        onClick={() => toggleSort(col.key)}
                        className={`inline-flex items-center gap-1 hover:text-text transition-colors ${active ? 'text-text' : ''} ${col.align === 'right' ? 'flex-row-reverse' : ''}`}
                      >
                        {col.label}
                        <SortIcon className={`w-3.5 h-3.5 ${active ? 'text-accent' : 'text-muted/60'}`} />
                      </button>
                    </th>
                  )
                })}
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setDetailId(c.id)}
                  className="border-b border-border last:border-0 hover:bg-surface-alt/60 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-3">
                    <div className="font-medium text-text max-w-[220px] truncate">{c.property}</div>
                    <div className="text-xs text-muted">{c.id}</div>
                  </td>
                  <td className="px-3 py-3 text-text whitespace-nowrap">{c.tenant}</td>
                  <td className="px-3 py-3 text-muted whitespace-nowrap hidden xl:table-cell">{c.owner}</td>
                  <td className="px-3 py-3 text-right text-muted whitespace-nowrap hidden lg:table-cell tabular-nums">{fmtMonthYear(c.startDate)}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap tabular-nums">
                    <span className={c.statusId === 'expiring' ? 'text-warning font-semibold' : c.statusId === 'expired' ? 'text-error font-semibold' : 'text-text'}>
                      {fmtDate(c.endDate)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-text whitespace-nowrap tabular-nums">{ars(c.currentRent)}</td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-text">
                      <span className="w-2 h-2 rounded-full" style={{ background: INDICES[c.index].cssVar }} /> {c.index}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap hidden xl:table-cell">
                    {c.nextAdjustment
                      ? <span className="text-xs text-muted">en {c.nextAdjustment.days}d<br /><span className="tabular-nums">{fmtDate(c.nextAdjustment.dateISO)}</span></span>
                      : <span className="text-xs text-muted">—</span>}
                  </td>
                  <td className="px-3 py-3 text-center"><StatusBadge status={c.status} /></td>
                  <td className="px-3 py-3 text-right">
                    <ChevronRight className="w-4 h-4 text-muted inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && <EmptyRow />}
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden space-y-3">
        {sorted.map((c) => (
          <button
            key={c.id}
            onClick={() => setDetailId(c.id)}
            className="w-full text-left bg-surface border border-border rounded-xl p-4 hover:bg-surface-alt/60 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-text truncate">{c.property}</div>
                <div className="text-xs text-muted">{c.id} · {c.tenant}</div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><div className="text-muted">Vencimiento</div><div className={`font-medium tabular-nums ${c.statusId === 'expiring' ? 'text-warning' : c.statusId === 'expired' ? 'text-error' : 'text-text'}`}>{fmtDate(c.endDate)}</div></div>
              <div className="text-right"><div className="text-muted">Monto actual</div><div className="font-semibold text-text tabular-nums">{ars(c.currentRent)}</div></div>
              <div><div className="text-muted">Índice</div><div className="font-medium text-text">{c.index} · cada {c.freqMonths}m</div></div>
              <div className="text-right"><div className="text-muted">Próx. ajuste</div><div className="font-medium text-text">{c.nextAdjustment ? `en ${c.nextAdjustment.days}d` : '—'}</div></div>
            </div>
          </button>
        ))}
        {sorted.length === 0 && <EmptyRow />}
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>{sorted.length} de {derived.length} contratos</span>
        <button onClick={() => { resetContracts(); showToast('Contratos restaurados a los datos de demo.', 'info') }} className="inline-flex items-center gap-1.5 hover:text-text transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Restaurar demo
        </button>
      </div>

      <ContractDetailModal
        contract={detail}
        onClose={() => setDetailId(null)}
        onSimulate={onSimulate}
        onRenew={handleRenew}
        onTerminate={handleTerminate}
        onDownload={(name) => showToast(`Descargando ${name}…`, 'success')}
      />

      <NewContractModal open={newOpen} onClose={() => setNewOpen(false)} onCreate={handleCreate} />

      {toastNode}
    </div>
  )
}

function EmptyRow() {
  return (
    <div className="py-12 text-center">
      <FileText className="w-10 h-10 text-muted/50 mx-auto mb-3" />
      <p className="text-sm text-muted">No hay contratos que coincidan con los filtros.</p>
    </div>
  )
}

// ==================================================================
// Detail modal
// ==================================================================

function ContractDetailModal({ contract, onClose, onSimulate, onRenew, onTerminate, onDownload }) {
  const [renewOpen, setRenewOpen] = useState(false)
  const [terminateOpen, setTerminateOpen] = useState(false)

  if (!contract) return null
  const c = contract
  const agent = agentById(c.agentId)
  const prop = c.propertyId ? propById(c.propertyId) : null
  const appliedCount = c.adjustments.filter((a) => a.applied).length

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {seedIds.has(c.id)
        ? <button onClick={() => { onSimulate(c.id); onClose() }} className={btnGhost}><Calculator className="w-4 h-4" /> Simular ajuste</button>
        : <span className="text-xs text-muted">Contrato creado en esta sesión</span>}
      <div className="flex items-center gap-2">
        {c.statusId !== 'terminated' && (
          <button onClick={() => setTerminateOpen(true)} className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-error text-error font-medium hover:bg-error hover:text-white transition-colors">
            <Ban className="w-4 h-4" /> Rescindir
          </button>
        )}
        <button onClick={() => setRenewOpen(true)} className={btnPrimary}><RefreshCw className="w-4 h-4" /> Renovar</button>
      </div>
    </div>
  )

  return (
    <>
      <Modal open={!!contract && !renewOpen && !terminateOpen} onClose={onClose} title={`${c.id} · ${c.property}`} icon={FileSignature} size="xl" footer={footer}>
        <div className="p-5 md:p-6 space-y-5">
          {/* Header strip */}
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={c.status} size="lg" />
            <span className="text-sm text-muted flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {c.address || '—'}</span>
            {c.statusId === 'expiring' && <span className="text-xs font-semibold text-warning">Vence en {c.daysToEnd} días</span>}
            {c.statusId === 'expired' && <span className="text-xs font-semibold text-error">Vencido hace {Math.abs(c.daysToEnd)} días</span>}
          </div>

          {prop && (
            <div className="flex items-center gap-3 bg-surface-alt rounded-xl p-3">
              <img src={prop.images?.[0]} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text truncate">{prop.title}</div>
                <div className="text-xs text-muted">{prop.neighborhood} · {prop.type} · {prop.areaTotal} m²</div>
              </div>
            </div>
          )}

          {/* Parties + terms */}
          <div className="grid sm:grid-cols-2 gap-4">
            <InfoBlock icon={User} title="Inquilino">
              <Field label="Nombre" value={c.tenant} />
              {c.tenantEmail && <Field label="Email" value={<a href={`mailto:${c.tenantEmail}`} className="text-accent hover:underline">{c.tenantEmail}</a>} />}
              {c.tenantPhone && <Field label="Teléfono" value={<a href={`tel:${c.tenantPhone}`} className="text-accent hover:underline">{c.tenantPhone}</a>} />}
            </InfoBlock>
            <InfoBlock icon={Users} title="Propietario">
              <Field label="Nombre" value={c.owner || '—'} />
              {c.ownerCuit && <Field label="CUIT" value={c.ownerCuit} />}
              <Field label="Agente" value={agent ? agent.name : '—'} />
            </InfoBlock>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Inicio" value={fmtDate(c.startDate)} />
            <Stat label="Vencimiento" value={fmtDate(c.endDate)} tone={c.statusId === 'expiring' ? 'warning' : c.statusId === 'expired' ? 'error' : undefined} />
            <Stat label="Plazo" value={`${c.termMonths} meses`} />
            <Stat label="Índice" value={`${c.index} · cada ${c.freqMonths}m`} />
            <Stat label="Alquiler base" value={ars(c.baseRent)} />
            <Stat label="Alquiler actual" value={ars(c.currentRent)} tone="accent" />
            <Stat label="Depósito" value={ars(c.deposit || 0)} />
            <Stat label="Punitorio" value={`${(c.lateFeeDaily * 100).toFixed(2)}%/día`} />
          </div>

          {c.terminatedDate && (
            <div className="rounded-xl border border-border bg-surface-alt p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-text"><Ban className="w-4 h-4 text-muted" /> Contrato rescindido · {fmtDate(c.terminatedDate)}</div>
              {c.terminatedReason && <p className="text-xs text-muted mt-1">{c.terminatedReason}</p>}
            </div>
          )}

          {/* Clauses */}
          <Section title="Cláusulas del contrato" icon={FileText}>
            <ul className="space-y-1.5">
              {c.clauses.map((cl, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text">
                  <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {cl}
                </li>
              ))}
            </ul>
          </Section>

          {/* Adjustment history */}
          <Section title={`Historial de ajustes · ${appliedCount} de ${c.adjustments.length} aplicados`} icon={TrendingUp}>
            {c.adjustments.length === 0 ? (
              <p className="text-sm text-muted">Este contrato no tiene ajustes programados.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-alt/50 text-muted text-xs">
                      <th className="text-left px-3 py-2 font-semibold">Fecha</th>
                      <th className="text-center px-3 py-2 font-semibold">Índice</th>
                      <th className="text-right px-3 py-2 font-semibold">Monto anterior</th>
                      <th className="text-right px-3 py-2 font-semibold">Monto nuevo</th>
                      <th className="text-right px-3 py-2 font-semibold">Var.</th>
                      <th className="text-center px-3 py-2 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.adjustments.map((a) => (
                      <tr key={a.n} className="border-t border-border">
                        <td className="px-3 py-2 text-text whitespace-nowrap tabular-nums">{fmtDate(a.dateISO)}</td>
                        <td className="px-3 py-2 text-center text-muted">{c.index}</td>
                        <td className="px-3 py-2 text-right text-muted tabular-nums">{ars(a.prevRent)}</td>
                        <td className="px-3 py-2 text-right font-semibold text-text tabular-nums">{ars(a.newRent)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-warning font-semibold">+{a.pct}%</td>
                        <td className="px-3 py-2 text-center">
                          {a.applied
                            ? <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle className="w-3.5 h-3.5" /> Aplicado</span>
                            : <span className="inline-flex items-center gap-1 text-xs text-muted"><Clock className="w-3.5 h-3.5" /> Programado</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Documents */}
          <Section title="Documentos asociados" icon={FileText}>
            <div className="space-y-2">
              {c.documents.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                  <FileText className="w-5 h-5 text-accent shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-text truncate">{d.name}</div>
                    <div className="text-xs text-muted">{d.size}</div>
                  </div>
                  {d.status === 'verified'
                    ? <span className="inline-flex items-center gap-1 text-xs text-success shrink-0"><CheckCircle className="w-3.5 h-3.5" /> Verificado</span>
                    : <span className="inline-flex items-center gap-1 text-xs text-warning shrink-0"><Clock className="w-3.5 h-3.5" /> Pendiente</span>}
                  <button onClick={() => onDownload(d.name)} className="shrink-0 p-2 rounded-lg text-muted hover:text-text hover:bg-surface-alt transition-colors" aria-label="Descargar">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </Modal>

      <RenewModal
        open={renewOpen}
        contract={c}
        onClose={() => setRenewOpen(false)}
        onConfirm={(months) => { onRenew(c.id, months); setRenewOpen(false); onClose() }}
      />
      <TerminateModal
        open={terminateOpen}
        contract={c}
        onClose={() => setTerminateOpen(false)}
        onConfirm={(dateISO, reason) => { onTerminate(c.id, dateISO, reason); setTerminateOpen(false); onClose() }}
      />
    </>
  )
}

function InfoBlock({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-text mb-2"><Icon className="w-4 h-4 text-accent" /> {title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}
function Field({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-text text-right min-w-0 truncate">{value}</span>
    </div>
  )
}
function Stat({ label, value, tone }) {
  const color = tone === 'accent' ? 'text-accent' : tone === 'warning' ? 'text-warning' : tone === 'error' ? 'text-error' : 'text-text'
  return (
    <div className="rounded-lg bg-surface-alt px-3 py-2.5">
      <div className="text-[11px] text-muted uppercase tracking-wide">{label}</div>
      <div className={`text-sm font-bold tabular-nums mt-0.5 ${color}`}>{value}</div>
    </div>
  )
}
function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-text flex items-center gap-2 mb-2.5"><Icon className="w-4 h-4 text-accent" /> {title}</h4>
      {children}
    </div>
  )
}

// ==================================================================
// Renew / Terminate mini-modals
// ==================================================================

function RenewModal({ open, contract, onClose, onConfirm }) {
  const [months, setMonths] = useState(24)
  if (!contract) return null
  const from = contractEndDate(contract)
  const to = (() => {
    const dt = parseISO(from); dt.setMonth(dt.getMonth() + months); return toISO(dt)
  })()
  return (
    <Modal open={open} onClose={onClose} title="Renovar contrato" icon={RefreshCw} size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className={btnGhost}>Cancelar</button>
          <button onClick={() => onConfirm(months)} className={btnPrimary}><RefreshCw className="w-4 h-4" /> Confirmar renovación</button>
        </div>
      }
    >
      <div className="p-5 space-y-4">
        <p className="text-sm text-muted">Se extenderá el contrato <span className="font-semibold text-text">{contract.id}</span> con {contract.tenant}. El nuevo vencimiento se calcula desde el vencimiento actual.</p>
        <div>
          <label className={labelCls}>Plazo de renovación</label>
          <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className={fieldCls}>
            <option value={12}>12 meses</option>
            <option value={24}>24 meses</option>
            <option value={36}>36 meses</option>
          </select>
        </div>
        <div className="rounded-lg bg-surface-alt p-3 text-sm flex items-center justify-between">
          <span className="text-muted">Nuevo vencimiento</span>
          <span className="font-bold text-accent tabular-nums">{fmtDate(to)}</span>
        </div>
      </div>
    </Modal>
  )
}

function TerminateModal({ open, contract, onClose, onConfirm }) {
  const [date, setDate] = useState(TODAY)
  const [reason, setReason] = useState('')
  if (!contract) return null
  return (
    <Modal open={open} onClose={onClose} title="Rescindir contrato" icon={Ban} size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className={btnGhost}>Cancelar</button>
          <button
            onClick={() => onConfirm(date, reason.trim())}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-error text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <Ban className="w-4 h-4" /> Confirmar rescisión
          </button>
        </div>
      }
    >
      <div className="p-5 space-y-4">
        <div className="rounded-lg border border-error bg-surface-alt p-3 flex items-start gap-2 text-sm">
          <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <p className="text-text">Vas a rescindir el contrato <span className="font-semibold">{contract.id}</span> con {contract.tenant}. Esta acción cambia el estado a <span className="font-semibold">Rescindido</span>.</p>
        </div>
        <div>
          <label className={labelCls}>Fecha de rescisión</label>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <div>
          <label className={labelCls}>Motivo (opcional)</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Ej.: rescisión anticipada del locatario…" className={fieldCls} />
        </div>
      </div>
    </Modal>
  )
}

// ==================================================================
// New contract modal
// ==================================================================

const EMPTY_FORM = {
  propertyId: '', property: '', address: '', tenant: '', tenantEmail: '', tenantPhone: '',
  owner: '', ownerCuit: '', agentId: 'AG-001', startDate: TODAY, termMonths: 36,
  index: 'ICL', freqMonths: 3, baseRent: '', deposit: ''
}

function NewContractModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState(false)

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const onPickProperty = (id) => {
    const p = propById(id)
    if (!p) { set({ propertyId: '', property: '', address: '' }); return }
    set({
      propertyId: id,
      property: p.title,
      address: `${p.address} · ${p.neighborhood}, ${p.city}`,
      baseRent: p.currency === 'ARS' ? String(p.price) : form.baseRent,
      agentId: p.agentId || form.agentId
    })
  }

  const errors = {
    property: !form.property.trim(),
    tenant: !form.tenant.trim(),
    baseRent: !(Number(form.baseRent) > 0)
  }
  const valid = !errors.property && !errors.tenant && !errors.baseRent

  const submit = () => {
    setTouched(true)
    if (!valid) return
    onCreate({
      property: form.property.trim(),
      propertyId: form.propertyId || null,
      address: form.address.trim(),
      tenant: form.tenant.trim(),
      tenantEmail: form.tenantEmail.trim(),
      tenantPhone: form.tenantPhone.trim(),
      owner: form.owner.trim(),
      ownerCuit: form.ownerCuit.trim(),
      agentId: form.agentId,
      startDate: form.startDate,
      startMonth: fmtMonthYear(form.startDate),
      termMonths: Number(form.termMonths),
      index: form.index,
      freqMonths: Number(form.freqMonths),
      baseRent: Number(form.baseRent),
      deposit: Number(form.deposit) || Number(form.baseRent),
      lateFeeDaily: 0.001
    })
    setForm(EMPTY_FORM)
    setTouched(false)
  }

  const close = () => { setForm(EMPTY_FORM); setTouched(false); onClose() }

  const errCls = (bad) => `${fieldCls} ${touched && bad ? '!border-error' : ''}`

  return (
    <Modal open={open} onClose={close} title="Nuevo contrato" icon={Plus} size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={close} className={btnGhost}>Cancelar</button>
          <button onClick={submit} className={btnPrimary}><Plus className="w-4 h-4" /> Crear contrato</button>
        </div>
      }
    >
      <div className="p-5 md:p-6 space-y-5">
        {/* Property */}
        <div>
          <label className={labelCls}>Propiedad en cartera (autocompleta)</label>
          <select value={form.propertyId} onChange={(e) => onPickProperty(e.target.value)} className={fieldCls}>
            <option value="">— Elegir de la cartera de alquileres —</option>
            {RENTAL_PROPS.map((p) => (
              <option key={p.id} value={p.id}>{p.title} · {p.neighborhood}</option>
            ))}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Título de la propiedad *</label>
            <input value={form.property} onChange={(e) => set({ property: e.target.value })} className={errCls(errors.property)} placeholder="Depto 2 amb. · Palermo" />
          </div>
          <div>
            <label className={labelCls}>Dirección</label>
            <input value={form.address} onChange={(e) => set({ address: e.target.value })} className={fieldCls} placeholder="Calle 1234 · Barrio, Ciudad" />
          </div>
        </div>

        {/* Parties */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Inquilino *</label>
            <input value={form.tenant} onChange={(e) => set({ tenant: e.target.value })} className={errCls(errors.tenant)} placeholder="Nombre y apellido" />
          </div>
          <div>
            <label className={labelCls}>Email inquilino</label>
            <input value={form.tenantEmail} onChange={(e) => set({ tenantEmail: e.target.value })} className={fieldCls} placeholder="email@ejemplo.com" />
          </div>
          <div>
            <label className={labelCls}>Teléfono inquilino</label>
            <input value={form.tenantPhone} onChange={(e) => set({ tenantPhone: e.target.value })} className={fieldCls} placeholder="+54 11 …" />
          </div>
          <div>
            <label className={labelCls}>Agente asignado</label>
            <select value={form.agentId} onChange={(e) => set({ agentId: e.target.value })} className={fieldCls}>
              {mockAgents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Propietario</label>
            <input value={form.owner} onChange={(e) => set({ owner: e.target.value })} className={fieldCls} placeholder="Nombre / razón social" />
          </div>
          <div>
            <label className={labelCls}>CUIT propietario</label>
            <input value={form.ownerCuit} onChange={(e) => set({ ownerCuit: e.target.value })} className={fieldCls} placeholder="20-XXXXXXXX-X" />
          </div>
        </div>

        {/* Terms */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Fecha de inicio</label>
            <DatePicker value={form.startDate} onChange={(v) => set({ startDate: v })} />
          </div>
          <div>
            <label className={labelCls}>Plazo</label>
            <select value={form.termMonths} onChange={(e) => set({ termMonths: Number(e.target.value) })} className={fieldCls}>
              <option value={12}>12 meses</option>
              <option value={24}>24 meses</option>
              <option value={36}>36 meses</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Índice de ajuste</label>
            <select value={form.index} onChange={(e) => set({ index: e.target.value })} className={fieldCls}>
              {Object.values(INDICES).map((ix) => <option key={ix.id} value={ix.id}>{ix.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Frecuencia de ajuste</label>
            <select value={form.freqMonths} onChange={(e) => set({ freqMonths: Number(e.target.value) })} className={fieldCls}>
              {FREQUENCIES.map((f) => <option key={f.months} value={f.months}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Alquiler base (mes 1) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <input type="number" value={form.baseRent} onChange={(e) => set({ baseRent: e.target.value })} className={`${errCls(errors.baseRent)} pl-7`} placeholder="0" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Depósito en garantía</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <input type="number" value={form.deposit} onChange={(e) => set({ deposit: e.target.value })} className={`${fieldCls} pl-7`} placeholder="= 1 mes si vacío" />
            </div>
          </div>
        </div>

        {touched && !valid && (
          <p className="text-sm text-error flex items-center gap-1.5"><XCircle className="w-4 h-4" /> Completá los campos obligatorios (*).</p>
        )}
      </div>
    </Modal>
  )
}

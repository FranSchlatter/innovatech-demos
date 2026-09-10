import { motion } from 'framer-motion'
import {
  Building2,
  UserPlus,
  CalendarDays,
  Handshake,
  DollarSign,
  TrendingUp,
  Tag,
  Eye,
  MapPin,
  Video,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CalendarPlus,
  Home
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useAdmin } from '../../../context/AdminContext'
import { LEAD_STAGES } from '../../../data/admin/mockLeads'
import { OPERATION_STAGES } from '../../../data/admin/mockOperations'
import StatusBadge from '../shared/StatusBadge'
import ResponseTimeWidget from './ResponseTimeWidget'
import { formatPrice } from '../../../utils/format'

// Tone map used by the leads pipeline bars
const STAGE_BAR = {
  new: 'bg-info',
  contacted: 'bg-warning',
  visit: 'bg-accent',
  negotiation: 'bg-primary',
  closed: 'bg-success',
  lost: 'bg-error'
}

const OP_TONE = {
  negotiation: 'primary',
  reserved: 'warning',
  signing: 'info',
  closed: 'success'
}

// Trend series for the dashboard mini-charts. Demo data, coherent with the KPIs.
const LEADS_WEEKLY = [
  { k: 'Sem 1', v: 6 },
  { k: 'Sem 2', v: 5 },
  { k: 'Sem 3', v: 8 },
  { k: 'Sem 4', v: 9 }
]
const VISITS_WEEKLY = [
  { k: 'Sem 1', v: 9 },
  { k: 'Sem 2', v: 12 },
  { k: 'Sem 3', v: 10 },
  { k: 'Sem 4', v: 14 }
]
const OPS_MONTHLY = [
  { k: 'Abr', v: 2 },
  { k: 'May', v: 3 },
  { k: 'Jun', v: 3 },
  { k: 'Jul', v: 4 },
  { k: 'Ago', v: 5 }
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
}

function KpiCard({ icon: Icon, value, label, subtext, trend, onClick }) {
  return (
    <motion.button
      type="button"
      variants={item}
      onClick={onClick}
      className="group text-left bg-surface border border-border rounded-xl p-5 transition-all hover:border-accent/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/15 text-accent mb-3">
          <Icon className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
      <p className="text-2xl font-bold text-text leading-tight">{value}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <p className="text-sm font-medium text-text">{label}</p>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              trend.up ? 'text-success' : 'text-error'
            }`}
          >
            {trend.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-muted mt-1">{subtext}</p>}
    </motion.button>
  )
}

function TrendChart({ title, unit, tone, data, delay = 0 }) {
  const max = Math.max(1, ...data.map((d) => d.v))
  const last = data[data.length - 1].v
  const prev = data[data.length - 2]?.v ?? last
  const delta = prev ? Math.round(((last - prev) / prev) * 100) : 0
  const up = delta >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface border border-border rounded-xl p-4"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-sm font-semibold text-text">{title}</p>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
            up ? 'text-success' : 'text-error'
          }`}
        >
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {up ? '+' : ''}
          {delta}%
        </span>
      </div>
      {/* Bars are direct children of a fixed-height flex row so the % height
          resolves against a definite container (nested flex-1 collapsed to 0). */}
      <div className="flex items-end gap-1.5 h-24">
        {data.map((d, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(4, (d.v / max) * 100)}%` }}
            transition={{ duration: 0.6, delay: delay + i * 0.05 }}
            className={`flex-1 rounded-t-md ${tone}`}
            title={`${d.k}: ${d.v} ${unit}`}
          />
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-[10px] text-muted truncate text-center">{d.k}</span>
        ))}
      </div>
    </motion.div>
  )
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3 text-left transition-colors hover:border-accent/50 hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/15 text-accent shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-sm font-medium text-text">{label}</span>
    </button>
  )
}

export default function AdminDashboard() {
  const data = useAdminData()
  const { setView, setFilter } = useAdmin()
  const k = data.getKPIs()

  // Commission: reuse formatPrice for USD formatting, strip any operation suffix
  const commissionLabel = formatPrice(k.monthlyCommission, 'USD', 'sale')

  // Leads pipeline
  const stageCounts = LEAD_STAGES.map((stage) => ({
    ...stage,
    count: data.leads.filter((l) => l.stage === stage.id).length
  }))
  const maxCount = Math.max(1, ...stageCounts.map((s) => s.count))

  // Ongoing operations
  const ongoing = data.operations.filter((o) => o.stage !== 'closed')

  // Jump to the leads board pre-filtered by a pipeline stage
  const goToStage = (stageId) => {
    setFilter('leads', 'stage', stageId)
    setView('leads')
  }

  const kpis = [
    {
      icon: Building2,
      value: `${k.availableProperties} / ${k.totalProperties}`,
      label: 'Propiedades activas',
      subtext: 'Disponibles sobre el total',
      view: 'properties',
      trend: { up: true, value: '+3%' }
    },
    {
      icon: UserPlus,
      value: k.newLeads,
      label: 'Leads nuevos',
      subtext: `${k.activeLeads} activos`,
      view: 'leads',
      trend: { up: true, value: '+12%' }
    },
    {
      icon: CalendarDays,
      value: k.todayVisits,
      label: 'Visitas hoy',
      subtext: `${k.upcomingVisits} próximas`,
      view: 'visits',
      trend: { up: true, value: '+8%' }
    },
    {
      icon: Handshake,
      value: k.openOperations,
      label: 'Operaciones abiertas',
      subtext: `${k.closedOperations} cerradas`,
      view: 'operations',
      trend: { up: false, value: '-4%' }
    },
    {
      icon: DollarSign,
      value: commissionLabel,
      label: 'Comisión del mes',
      subtext: 'Operaciones cerradas',
      view: 'operations',
      trend: { up: true, value: '+15%' }
    },
    {
      icon: TrendingUp,
      value: `${k.conversionRate}%`,
      label: 'Tasa de conversión',
      subtext: 'Leads cerrados / total',
      view: 'leads',
      trend: { up: true, value: '+5%' }
    },
    {
      icon: Tag,
      value: `${k.forSale} / ${k.forRent}`,
      label: 'En venta / En alquiler',
      subtext: 'Distribución del portfolio',
      view: 'properties',
      trend: { up: false, value: '-2%' }
    },
    {
      icon: Eye,
      value: k.totalViews.toLocaleString('es-AR'),
      label: 'Visualizaciones',
      subtext: 'Total del portfolio',
      view: 'properties',
      trend: { up: true, value: '+21%' }
    }
  ]

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <h1 className="text-2xl font-bold text-text">Panel general</h1>
        <p className="text-muted mt-1">Resumen de tu operación inmobiliaria</p>
      </div>

      {/* KPI cards — each navigates to its module */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} onClick={() => setView(kpi.view)} />
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-surface border border-border rounded-xl p-5"
      >
        <h2 className="font-bold text-text mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickAction icon={CalendarPlus} label="Agendar visita" onClick={() => setView('visits')} />
          <QuickAction icon={UserPlus} label="Crear lead" onClick={() => setView('leads')} />
          <QuickAction icon={Home} label="Agregar propiedad" onClick={() => setView('properties')} />
        </div>
      </motion.div>

      {/* Response time per agent — the metric that sells (ported from v2) */}
      <ResponseTimeWidget />

      {/* Trends */}
      <div>
        <h2 className="font-bold text-text mb-3">Tendencias</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <TrendChart title="Leads por semana" unit="leads" tone="bg-info" data={LEADS_WEEKLY} delay={0.1} />
          <TrendChart title="Visitas por semana" unit="visitas" tone="bg-accent" data={VISITS_WEEKLY} delay={0.15} />
          <TrendChart title="Operaciones cerradas / mes" unit="operaciones" tone="bg-success" data={OPS_MONTHLY} delay={0.2} />
        </div>
      </div>

      {/* Panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leads pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface border border-border rounded-xl p-5"
          >
            <h2 className="font-bold text-text mb-4">Pipeline de leads</h2>
            <div className="space-y-1">
              {stageCounts.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => goToStage(stage.id)}
                  className="group w-full flex items-center gap-3 rounded-lg -mx-2 px-2 py-1.5 transition-colors hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <span className="w-24 shrink-0 text-sm text-text text-left">{stage.label}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-surface-alt overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${STAGE_BAR[stage.id] || 'bg-accent'}`}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-sm font-semibold text-text">
                    {stage.count}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Ongoing operations */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface border border-border rounded-xl p-5"
          >
            <h2 className="font-bold text-text mb-4">Operaciones en curso</h2>
            {ongoing.length === 0 ? (
              <p className="text-sm text-muted">Sin operaciones en curso</p>
            ) : (
              <div className="space-y-4">
                {ongoing.map((op) => {
                  const stageInfo = OPERATION_STAGES.find((s) => s.id === op.stage)
                  return (
                    <div key={op.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text truncate">{op.propertyTitle}</p>
                          <p className="text-xs text-muted truncate">{op.client}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-text">
                            {formatPrice(op.amount, op.currency, op.type === 'rent' ? 'rent' : 'sale')}
                          </p>
                          <StatusBadge
                            label={stageInfo ? stageInfo.label : op.stage}
                            tone={OP_TONE[op.stage] || 'muted'}
                            dot={false}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-surface-alt overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${op.progress}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full rounded-full bg-accent"
                          />
                        </div>
                        <span className="text-xs text-muted w-9 text-right">{op.progress}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Today's visits */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-bold text-text mb-4">Visitas de hoy</h2>
            {k.todayVisitsList.length === 0 ? (
              <p className="text-sm text-muted">Sin visitas para hoy</p>
            ) : (
              <div className="space-y-3">
                {k.todayVisitsList.map((visit) => {
                  const TypeIcon = visit.type === 'in-person' ? MapPin : Video
                  return (
                    <div key={visit.id} className="flex items-start gap-3">
                      <span className="font-bold text-text text-sm w-12 shrink-0">{visit.time}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-text truncate">{visit.propertyTitle}</p>
                        <p className="text-xs text-muted truncate">{visit.clientName}</p>
                      </div>
                      <TypeIcon className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active team mini-stat */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-bold text-text mb-2">Equipo activo</h2>
            <p className="text-sm text-muted">
              <span className="text-lg font-bold text-text">{k.onDutyAgents}</span> agentes en línea
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

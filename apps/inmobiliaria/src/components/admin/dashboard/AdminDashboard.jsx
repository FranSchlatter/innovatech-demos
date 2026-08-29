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
  Video
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
}

function KpiCard({ icon: Icon, value, label, subtext }) {
  return (
    <motion.div
      variants={item}
      className="bg-surface border border-border rounded-xl p-5"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/15 text-accent mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-text leading-tight">{value}</p>
      <p className="text-sm font-medium text-text mt-0.5">{label}</p>
      {subtext && <p className="text-xs text-muted mt-1">{subtext}</p>}
    </motion.div>
  )
}

export default function AdminDashboard() {
  const data = useAdminData()
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

  const kpis = [
    {
      icon: Building2,
      value: `${k.availableProperties} / ${k.totalProperties}`,
      label: 'Propiedades activas',
      subtext: 'Disponibles sobre el total'
    },
    { icon: UserPlus, value: k.newLeads, label: 'Leads nuevos', subtext: `${k.activeLeads} activos` },
    { icon: CalendarDays, value: k.todayVisits, label: 'Visitas hoy', subtext: `${k.upcomingVisits} próximas` },
    { icon: Handshake, value: k.openOperations, label: 'Operaciones abiertas', subtext: `${k.closedOperations} cerradas` },
    { icon: DollarSign, value: commissionLabel, label: 'Comisión del mes', subtext: 'Operaciones cerradas' },
    { icon: TrendingUp, value: `${k.conversionRate}%`, label: 'Tasa de conversión', subtext: 'Leads cerrados / total' },
    { icon: Tag, value: `${k.forSale} / ${k.forRent}`, label: 'En venta / En alquiler', subtext: 'Distribución del portfolio' },
    { icon: Eye, value: k.totalViews.toLocaleString('es-AR'), label: 'Visualizaciones', subtext: 'Total del portfolio' }
  ]

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <h1 className="text-2xl font-bold text-text">Panel general</h1>
        <p className="text-muted mt-1">Resumen de tu operación inmobiliaria</p>
      </div>

      {/* KPI cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </motion.div>

      {/* Response time per agent — the metric that sells (ported from v2) */}
      <ResponseTimeWidget />

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
            <div className="space-y-3">
              {stageCounts.map((stage) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-text">{stage.label}</span>
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
                </div>
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

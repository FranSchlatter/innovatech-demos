import { motion } from 'framer-motion'
import { ArrowRight, Calendar, TrendingUp } from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'
import { formatPrice, formatDate } from '../../../utils/format'
import { OPERATION_STAGES } from '../../../data/admin/mockOperations'

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

const STAGE_PROGRESS = {
  negotiation: 20,
  reserved: 45,
  signing: 70,
  closed: 100
}

const TYPE_LABELS = { sale: 'Venta', rent: 'Alquiler' }

const numberAR = (n) => new Intl.NumberFormat('es-AR').format(Math.round(n))

export default function OperationsManagement() {
  const { operations, agents, updateOperation } = useAdminData()

  const agentName = (id) => agents.find((a) => a.id === id)?.name || '—'

  const openOps = operations.filter((o) => o.stage !== 'closed')
  const closedOps = operations.filter((o) => o.stage === 'closed')
  const pipelineValue = openOps.reduce((sum, o) => sum + (o.amount || 0), 0)
  const estCommission = openOps.reduce((sum, o) => sum + (o.commission || 0), 0)

  const stageOrder = OPERATION_STAGES.map((s) => s.id)

  const advanceStage = (op) => {
    const idx = stageOrder.indexOf(op.stage)
    if (idx < 0 || idx >= stageOrder.length - 1) return
    const nextStage = stageOrder[idx + 1]
    updateOperation(op.id, {
      stage: nextStage,
      progress: STAGE_PROGRESS[nextStage]
    })
  }

  const summary = [
    { label: 'Operaciones abiertas', value: openOps.length, tone: 'text-text' },
    { label: 'Valor en pipeline', value: `USD ${numberAR(pipelineValue)}`, tone: 'text-text', hint: 'valor combinado' },
    { label: 'Comisiones estimadas', value: `USD ${numberAR(estCommission)}`, tone: 'text-gold', hint: 'valor combinado' },
    { label: 'Cerradas', value: closedOps.length, tone: 'text-success' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Operaciones</h2>
          <p className="text-sm text-muted mt-1">Reservas, firmas y cierres en curso</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          return (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.04 }}
              className="bg-surface border border-border rounded-xl p-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: identity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge label={STAGE_LABELS[op.stage]} tone={STAGE_TONE[op.stage]} />
                    <span className="text-xs font-semibold rounded-full bg-surface-alt text-muted px-2 py-0.5">
                      {TYPE_LABELS[op.type] || op.type}
                    </span>
                  </div>
                  <p className="font-semibold text-text mt-2 truncate">{op.propertyTitle}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {op.client} · Agente: {agentName(op.agentId)}
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
                    {formatDate(op.reserveDate)} → {formatDate(op.closeDate)}
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
                    onClick={() => advanceStage(op)}
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
    </div>
  )
}

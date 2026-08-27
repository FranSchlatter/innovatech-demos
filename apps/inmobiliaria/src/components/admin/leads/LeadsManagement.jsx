import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'
import { formatPrice } from '../../../utils/format'
import { LEAD_STAGES } from '../../../data/admin/mockLeads'

const STAGE_ACCENT = {
  info: 'bg-info',
  warning: 'bg-warning',
  accent: 'bg-accent',
  primary: 'bg-primary',
  success: 'bg-success',
  error: 'bg-error'
}

const STAGE_TEXT = {
  info: 'text-info',
  warning: 'text-warning',
  accent: 'text-accent',
  primary: 'text-primary',
  success: 'text-success',
  error: 'text-error'
}

const SCORE_TONE = { hot: 'error', warm: 'warning', cold: 'muted' }
const SCORE_LABEL = { hot: 'Caliente', warm: 'Templado', cold: 'Frío' }

const SOURCE_LABELS = {
  web: 'Web',
  portal: 'Portal',
  referral: 'Referido',
  social: 'Redes',
  phone: 'Teléfono'
}

export default function LeadsManagement() {
  const { leads, agents, updateLead } = useAdminData()
  const [agentFilter, setAgentFilter] = useState('all')

  const agentName = (id) => agents.find((a) => a.id === id)?.name || '—'

  const visibleLeads = useMemo(() => {
    if (agentFilter === 'all') return leads
    return leads.filter((l) => l.agentId === agentFilter)
  }, [leads, agentFilter])

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Leads / CRM</h2>
          <p className="text-sm text-muted mt-1">Seguimiento del embudo de ventas</p>
        </div>
        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">Todos los agentes</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_STAGES.map((stage) => {
          const stageLeads = visibleLeads.filter((l) => l.stage === stage.id)
          return (
            <div key={stage.id} className="w-72 flex-shrink-0">
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
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

                <div className="p-2 space-y-2 min-h-[120px]">
                  <AnimatePresence mode="popLayout">
                    {stageLeads.map((lead) => {
                      const idx = stageOrder.indexOf(lead.stage)
                      return (
                        <motion.div
                          key={lead.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="bg-surface-alt border border-border rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-text text-sm leading-tight">{lead.name}</p>
                            <StatusBadge
                              label={SCORE_LABEL[lead.score]}
                              tone={SCORE_TONE[lead.score]}
                              dot={false}
                            />
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
                            <button
                              type="button"
                              onClick={() => moveStage(lead, -1)}
                              disabled={idx <= 0}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border text-muted hover:text-text hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              aria-label="Etapa anterior"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => markLost(lead)}
                              disabled={lead.stage === 'lost'}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border text-muted hover:text-error hover:bg-error/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              aria-label="Marcar como perdido"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => moveStage(lead, 1)}
                              disabled={idx >= stageOrder.length - 1}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border text-muted hover:text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              aria-label="Etapa siguiente"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
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
    </div>
  )
}

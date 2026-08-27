import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Video, Phone, User } from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'
import { formatDate } from '../../../utils/format'
import { VISIT_STATUSES } from '../../../data/admin/mockVisits'

const TODAY = '2026-08-27'

const STATUS_LABELS = {
  scheduled: 'Agendada',
  confirmed: 'Confirmada',
  completed: 'Realizada',
  cancelled: 'Cancelada'
}

const STATUS_TONE = {
  scheduled: 'info',
  confirmed: 'success',
  completed: 'muted',
  cancelled: 'error'
}

export default function VisitsScheduler() {
  const { visits, agents, updateVisit } = useAdminData()
  const [filter, setFilter] = useState('all')

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Agenda de visitas</h2>
          <p className="text-sm text-muted mt-1">Coordinación y seguimiento de visitas a propiedades</p>
        </div>
      </div>

      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          Todas
        </FilterButton>
        {VISIT_STATUSES.map((s) => (
          <FilterButton key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUS_LABELS[s]}
          </FilterButton>
        ))}
      </div>

      {/* Grouped by date */}
      {groups.length === 0 && (
        <p className="text-center text-muted py-12">No hay visitas para este filtro.</p>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-text uppercase tracking-wide">
                {formatDate(group.date)}
              </h3>
              {group.date === TODAY && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-gold/20 text-gold px-2 py-0.5">
                  Hoy
                </span>
              )}
              <span className="text-xs text-muted">· {group.visits.length} visitas</span>
            </div>

            <div className="space-y-3">
              {group.visits.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  {/* Time */}
                  <div className="flex items-center gap-3 md:w-28 md:flex-shrink-0">
                    <span className="font-bold text-lg text-text">{v.time}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      {v.type === 'in-person' ? (
                        <>
                          <MapPin className="w-3.5 h-3.5" /> Presencial
                        </>
                      ) : (
                        <>
                          <Video className="w-3.5 h-3.5" /> Videollamada
                        </>
                      )}
                    </div>
                    <p className="font-semibold text-text truncate">{v.propertyTitle}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mt-1">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {v.clientName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {v.clientPhone}
                      </span>
                      <span>Agente: {agentName(v.agentId)}</span>
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-2 md:flex-shrink-0">
                    <StatusBadge label={STATUS_LABELS[v.status]} tone={STATUS_TONE[v.status]} />

                    {v.status === 'scheduled' && (
                      <>
                        <ActionButton
                          tone="success"
                          onClick={() => updateVisit(v.id, { status: 'confirmed' })}
                        >
                          Confirmar
                        </ActionButton>
                        <ActionButton
                          tone="error"
                          onClick={() => updateVisit(v.id, { status: 'cancelled' })}
                        >
                          Cancelar
                        </ActionButton>
                      </>
                    )}

                    {v.status === 'confirmed' && (
                      <>
                        <ActionButton
                          tone="accent"
                          onClick={() => updateVisit(v.id, { status: 'completed' })}
                        >
                          Marcar realizada
                        </ActionButton>
                        <ActionButton
                          tone="error"
                          onClick={() => updateVisit(v.id, { status: 'cancelled' })}
                        >
                          Cancelar
                        </ActionButton>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm font-medium rounded-lg px-3 py-1.5 border transition-colors ${
        active
          ? 'bg-primary text-primary-contrast border-primary'
          : 'bg-surface text-muted border-border hover:text-text hover:bg-surface-alt'
      }`}
    >
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
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border bg-surface transition-colors whitespace-nowrap ${TONE_CLASSES[tone]}`}
    >
      {children}
    </button>
  )
}

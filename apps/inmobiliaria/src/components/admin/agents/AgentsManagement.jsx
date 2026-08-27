import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

export default function AgentsManagement() {
  const { agents } = useAdminData()

  const totalAgents = agents.length
  const onDuty = agents.filter((a) => a.status === 'on-duty').length
  const closedThisMonth = agents.reduce((sum, a) => sum + (a.closedThisMonth || 0), 0)
  const monthlyTarget = agents.reduce((sum, a) => sum + (a.monthlyTarget || 0), 0)

  const summary = [
    { label: 'Agentes totales', value: totalAgents, tone: 'text-text' },
    { label: 'En línea', value: onDuty, tone: 'text-success' },
    { label: 'Cierres del mes', value: closedThisMonth, tone: 'text-accent' },
    { label: 'Objetivo mensual', value: monthlyTarget, tone: 'text-gold' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Equipo</h2>
          <p className="text-sm text-muted mt-1">Rendimiento y disponibilidad de los agentes</p>
        </div>
      </div>

      {/* Team summary */}
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
          </motion.div>
        ))}
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((a, i) => {
          const target = a.monthlyTarget || 0
          const pct = target ? Math.min(100, Math.round((a.closedThisMonth / target) * 100)) : 0
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.05 }}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                <img
                  src={a.photo}
                  alt={a.name}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text truncate">{a.name}</p>
                  <p className="text-sm text-muted">{a.role}</p>
                  <p className="text-xs text-muted inline-flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {a.zone}
                  </p>
                </div>
                <StatusBadge
                  label={a.status === 'on-duty' ? 'En línea' : 'Fuera de línea'}
                  tone={a.status === 'on-duty' ? 'success' : 'muted'}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-surface-alt rounded-lg px-3 py-2">
                  <p className="text-[11px] text-muted">Propiedades activas</p>
                  <p className="text-lg font-bold text-text">{a.activeListings}</p>
                </div>
                <div className="bg-surface-alt rounded-lg px-3 py-2">
                  <p className="text-[11px] text-muted">Leads activos</p>
                  <p className="text-lg font-bold text-text">{a.activeLeads}</p>
                </div>
              </div>

              {/* Monthly target */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted">Objetivo mensual</span>
                  <span className="font-semibold text-text">
                    {a.closedThisMonth} / {target} cierres
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <a
                  href={`tel:${a.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold rounded-lg px-3 py-2 border border-border text-muted hover:text-text hover:bg-surface-alt transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Llamar
                </a>
                <a
                  href={`mailto:${a.email}`}
                  className="inline-flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold rounded-lg px-3 py-2 border border-border text-muted hover:text-text hover:bg-surface-alt transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

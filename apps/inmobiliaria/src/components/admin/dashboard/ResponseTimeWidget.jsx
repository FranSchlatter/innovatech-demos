import { motion } from 'framer-motion'
import { Timer, Bot, TrendingDown } from 'lucide-react'
import { responseTimes, lightFor } from '../../../data/admin/mockResponseTimes'

const LIGHT = {
  green: 'bg-success',
  amber: 'bg-warning',
  red: 'bg-error'
}

export default function ResponseTimeWidget() {
  const rt = responseTimes
  const maxAvg = Math.max(...rt.agents.map((a) => a.avgMin))
  const improvement = Math.round(((rt.teamPrev - rt.teamAvg) / rt.teamPrev) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="bg-surface border border-border rounded-xl p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-bold text-text flex items-center gap-2"><Timer className="w-4 h-4 text-accent" /> Tiempo de respuesta por agente</h2>
          <p className="text-xs text-muted mt-0.5">Los portales penalizan la demora. La IA cubre noches y fines de semana.</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-success/15 text-success whitespace-nowrap">
          <TrendingDown className="w-3.5 h-3.5" /> −{improvement}% vs. antes
        </span>
      </div>

      {/* Team summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg p-3 bg-bg border border-border">
          <p className="text-xs text-muted">Promedio equipo</p>
          <p className="text-lg font-bold text-text mt-0.5">{rt.teamAvg} min</p>
        </div>
        <div className="rounded-lg p-3 bg-bg border border-border">
          <p className="text-xs text-muted">Objetivo (SLA)</p>
          <p className="text-lg font-bold text-text mt-0.5">{rt.slaTarget} min</p>
        </div>
        <div className="rounded-lg p-3 bg-primary/10 border border-primary/20">
          <p className="text-xs text-muted flex items-center gap-1"><Bot className="w-3.5 h-3.5 text-primary" /> IA fuera de hora</p>
          <p className="text-lg font-bold text-primary mt-0.5">{rt.aiAfterHoursShare}%</p>
        </div>
      </div>

      {/* Per-agent bars with traffic light */}
      <div className="space-y-3">
        {rt.agents.map((a) => {
          const light = lightFor(a.avgMin, rt.slaTarget)
          return (
            <div key={a.id} className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${LIGHT[light]}`} />
              <span className="w-28 shrink-0 text-sm text-text truncate">{a.name}</span>
              <div className="flex-1 h-2.5 rounded-full bg-surface-alt overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(a.avgMin / maxAvg) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-full rounded-full ${LIGHT[light]}`}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-sm font-semibold text-text">{a.avgMin} min</span>
              <span className="hidden sm:inline w-24 shrink-0 text-right text-xs text-muted">{a.converted}/{a.leads} cerrados</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

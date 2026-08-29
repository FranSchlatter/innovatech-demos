import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'
import { dynamicPricing } from '../../../data/admin/mockPricing'

const money = (ars) => `$${Math.round(ars / 1000)}K`

const REC = {
  subir: { label: 'Subir', icon: TrendingUp, cls: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  bajar: { label: 'Bajar', icon: TrendingDown, cls: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  mantener: { label: 'Mantener', icon: Minus, cls: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' }
}

export default function DynamicPricing() {
  const dp = dynamicPricing
  const maxNominal = Math.max(...dp.rows.map((r) => r.nominal))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Tarifas y precio dinámico
        </h1>
        <p className="text-sm text-muted">Separa el efecto inflación del efecto demanda — algo que ningún RMS importado hace bien en Argentina.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted">{dp.note} IPC mensual usado: <b className="text-text">{dp.ipcMonthly}%</b>.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1fr_1.4fr_auto_auto] gap-4 px-4 py-3 border-b border-border text-xs font-semibold text-muted uppercase tracking-wide">
          <span>Fecha</span>
          <span>Nominal vs. real (deflactada)</span>
          <span className="text-right">Ocupación</span>
          <span className="text-right">Recomendación</span>
        </div>

        {dp.rows.map((r, i) => {
          const rec = REC[r.rec] || REC.mantener
          const RecIcon = rec.icon
          return (
            <motion.div key={r.date}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="grid grid-cols-2 md:grid-cols-[1fr_1.4fr_auto_auto] gap-3 md:gap-4 px-4 py-3 border-b border-border last:border-0 items-center">
              <span className="text-sm font-medium text-text">{r.date}</span>

              {/* Nominal vs real bars */}
              <div className="col-span-2 md:col-span-1 order-3 md:order-none space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 rounded-full bg-bg overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${(r.nominal / maxNominal) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted w-20 text-right">Nom. {money(r.nominal)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 rounded-full bg-bg overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(r.real / maxNominal) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted w-20 text-right">Real {money(r.real)}</span>
                </div>
              </div>

              <span className="text-sm text-text text-right md:pr-2">{r.occ}%</span>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${rec.cls}`}>
                  <RecIcon className="w-3.5 h-3.5" /> {rec.label}{r.delta ? ` ${r.delta > 0 ? '+' : ''}${r.delta}%` : ''}
                </span>
                {r.reason !== '—' && <p className="text-[10px] text-muted mt-1">por {r.reason}</p>}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

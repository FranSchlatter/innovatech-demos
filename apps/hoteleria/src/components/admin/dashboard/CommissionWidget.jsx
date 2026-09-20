import { motion } from 'framer-motion'
import { PiggyBank, TrendingDown, Building2 } from 'lucide-react'
import { getCommissionSummary } from '../../../data/admin/mockChannels'
import { useTranslation } from '../../../i18n/LanguageProvider'

const money = (ars) => {
  if (ars >= 1_000_000) return `$${(ars / 1_000_000).toFixed(1)}M`
  if (ars >= 1_000) return `$${Math.round(ars / 1_000)}K`
  return `$${ars}`
}

/* OTA-vs-direct commission widget — the chart that sells (ported from v2, CSS bars, no chart lib). */
export default function CommissionWidget() {
  const { t } = useTranslation()
  const comm = getCommissionSummary()
  const maxRevenue = Math.max(...comm.commByChannel.map((c) => c.revenue))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-6"
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-text">{t('admin.dashboard.commission.title')}</h3>
          <p className="text-xs sm:text-sm text-muted mt-0.5">{t('admin.dashboard.commission.subtitle')}</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 whitespace-nowrap">
          <PiggyBank className="w-3.5 h-3.5" /> {t('admin.dashboard.commission.savings6m', { value: money(comm.cumulativeSavings) })}
        </span>
      </div>

      {/* Revenue bars by channel */}
      <div className="space-y-3">
        {comm.commByChannel.map((c) => (
          <div key={c.id}>
            <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
              <span className="text-text font-medium">{c.name}</span>
              <span className="text-muted">
                {money(c.revenue)}
                {c.commissionPaid > 0 && (
                  <span className="text-red-500 ml-2">− {money(c.commissionPaid)} {t('admin.dashboard.commission.commissionSuffix')}</span>
                )}
                {c.commission === 0 && <span className="text-green-500 ml-2">{t('admin.dashboard.commission.noCommission')}</span>}
              </span>
            </div>
            <div className="h-3 rounded-full bg-bg overflow-hidden">
              <div
                className={`h-full rounded-full ${c.color} transition-all duration-500`}
                style={{ width: `${(c.revenue / maxRevenue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <div className="rounded-lg p-3 bg-bg border border-border">
          <p className="text-xs text-muted flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5 text-red-500" /> {t('admin.dashboard.commission.otaMonth')}</p>
          <p className="text-lg font-bold text-red-500 mt-1">{money(comm.otaCommission)}</p>
        </div>
        <div className="rounded-lg p-3 bg-bg border border-border">
          <p className="text-xs text-muted flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-green-500" /> {t('admin.dashboard.commission.directRevenue')}</p>
          <p className="text-lg font-bold text-green-500 mt-1">{money(comm.directRevenue)}</p>
        </div>
        <div className="rounded-lg p-3 bg-primary/10 border border-primary/20">
          <p className="text-xs text-muted flex items-center gap-1"><PiggyBank className="w-3.5 h-3.5 text-primary" /> {t('admin.dashboard.commission.cumulativeSavings')}</p>
          <p className="text-lg font-bold text-primary mt-1">{money(comm.cumulativeSavings)}</p>
        </div>
      </div>
    </motion.div>
  )
}

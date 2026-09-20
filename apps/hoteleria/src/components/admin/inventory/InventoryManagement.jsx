import { useState, useMemo, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  Box,
  Shirt,
  Sparkles,
  Wine,
  SprayCan,
  X,
  Plus,
  History,
  MapPin,
  DollarSign,
  BarChart3,
  LineChart,
  Archive,
  Lightbulb,
  Trophy,
  Layers,
  ArrowUp,
  Check
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useTranslation } from '../../../i18n/LanguageProvider'
import { getInventoryAnalytics, getItemConsumption } from '../../../data/admin/mockInventory'

const categoryConfig = {
  linens: { icon: Shirt, color: 'bg-blue-500' },
  amenities: { icon: Sparkles, color: 'bg-purple-500' },
  minibar: { icon: Wine, color: 'bg-amber-500' },
  cleaning: { icon: SprayCan, color: 'bg-green-500' }
}

const categoryFilters = [
  { value: 'all', key: 'admin.inventory.filters.allCategories' },
  { value: 'linens', key: 'admin.inventory.categories.linens' },
  { value: 'amenities', key: 'admin.inventory.categories.amenities' },
  { value: 'minibar', key: 'admin.inventory.categories.minibar' },
  { value: 'cleaning', key: 'admin.inventory.categories.cleaning' }
]

const stockFilters = [
  { value: 'all', key: 'admin.inventory.filters.allStockLevels' },
  { value: 'low', key: 'admin.inventory.filters.low' },
  { value: 'normal', key: 'admin.inventory.filters.normal' },
  { value: 'high', key: 'admin.inventory.filters.high' }
]

function StockLevelBar({ current, min, max }) {
  const { t } = useTranslation()
  const percentage = Math.min((current / max) * 100, 100)
  const isLow = current <= min
  const isVeryLow = current < min * 0.5

  let barColor = 'bg-green-500'
  if (isVeryLow) barColor = 'bg-red-500'
  else if (isLow) barColor = 'bg-amber-500'

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted mb-1">
        <span>{current} / {max}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${barColor} rounded-full`}
        />
      </div>
      {isLow && (
        <p className="text-xs text-amber-500 mt-1">{t('admin.inventory.stock.min', { min })}</p>
      )}
    </div>
  )
}

function LowStockAlerts({ items, onRestock }) {
  const { t } = useTranslation()
  if (items.length === 0) {
    return (
      <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="font-medium text-green-600 dark:text-green-400">{t('admin.inventory.alerts.allOkTitle')}</p>
            <p className="text-sm text-muted">{t('admin.inventory.alerts.allOkSubtitle')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-500/10 rounded-xl border border-amber-500/20 overflow-hidden">
      <div className="p-4 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="font-medium text-amber-600 dark:text-amber-400">
              {t('admin.inventory.alerts.lowTitle', { count: items.length })}
            </p>
            <p className="text-sm text-muted">{t('admin.inventory.alerts.lowSubtitle')}</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-amber-500/10 max-h-[300px] overflow-y-auto">
        {items.map(item => {
          const config = categoryConfig[item.category]
          const Icon = config?.icon || Box
          const deficit = item.minStock - item.currentStock

          return (
            <div key={item.id} className="p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-1.5 rounded-lg ${config?.color || 'bg-gray-500'}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text truncate">{item.name}</p>
                  <p className="text-xs text-red-500">
                    {t('admin.inventory.alerts.need', { deficit, unit: item.unit })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRestock(item)}
                className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg
                  hover:bg-amber-600 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <Plus className="w-3 h-3" />
                {t('admin.inventory.alerts.restock')}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InventoryStats({ inventory }) {
  const { t } = useTranslation()
  const stats = useMemo(() => {
    const totalItems = inventory.length
    const lowStock = inventory.filter(i => i.currentStock <= i.minStock).length
    const totalValue = inventory.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0)
    const categoryStats = Object.entries(categoryConfig).map(([key, config]) => ({
      category: key,
      count: inventory.filter(i => i.category === key).length,
      color: config.color
    }))

    return { totalItems, lowStock, totalValue, categoryStats }
  }, [inventory])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">{stats.totalItems}</p>
            <p className="text-xs text-muted">{t('admin.inventory.stats.totalItems')}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <TrendingDown className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-500">{stats.lowStock}</p>
            <p className="text-xs text-muted">{t('admin.inventory.stats.lowStock')}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">${stats.totalValue.toLocaleString()}</p>
            <p className="text-xs text-muted">{t('admin.inventory.stats.totalValue')}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex gap-1">
            {stats.categoryStats.map(cat => (
              <div
                key={cat.category}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${cat.color}`}
                title={`${t(`admin.inventory.categories.${cat.category}`)}: ${cat.count}`}
              >
                {cat.count}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const InventoryCard = forwardRef(function InventoryCard({ item, onRestock, onViewHistory }, ref) {
  const { t } = useTranslation()
  const config = categoryConfig[item.category]
  const Icon = config?.icon || Box
  const isLow = item.currentStock <= item.minStock
  const consumption = getItemConsumption(item)

  const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return t('admin.inventory.timeAgo.today')
    if (diffDays === 1) return t('admin.inventory.timeAgo.yesterday')
    if (diffDays < 7) return t('admin.inventory.timeAgo.daysAgo', { days: diffDays })
    if (diffDays < 30) return t('admin.inventory.timeAgo.weeksAgo', { weeks: Math.floor(diffDays / 7) })
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-surface rounded-xl border p-4 transition-all ${
        isLow ? 'border-amber-500/50 bg-amber-500/5' : 'border-border hover:border-primary/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config?.color || 'bg-gray-500'}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-text">{item.name}</h3>
            <p className="text-xs text-muted">{item.sku}</p>
          </div>
        </div>
        {isLow && (
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-full font-medium">
            {t('admin.inventory.card.low')}
          </span>
        )}
      </div>

      {/* Stock Level */}
      <div className="mb-3">
        <StockLevelBar
          current={item.currentStock}
          min={item.minStock}
          max={item.maxStock}
        />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="flex items-center gap-1 text-muted">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{item.location}</span>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <DollarSign className="w-3 h-3" />
          <span>{t('admin.inventory.card.perUnit', { cost: item.costPerUnit.toFixed(2), unit: item.unit })}</span>
        </div>
      </div>

      {/* Last Restocked + monthly consumption */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted mb-3">
        <div className="flex items-center gap-1 min-w-0">
          <History className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{t('admin.inventory.card.restockedAgo', { ago: timeAgo(item.lastRestocked) })}</span>
        </div>
        {consumption.neverRestocked ? (
          <span className="flex items-center gap-1 text-muted whitespace-nowrap" title={t('admin.inventory.card.noUsageTitle')}>
            <Archive className="w-3 h-3" />
            {t('admin.inventory.card.noUsage')}
          </span>
        ) : (
          <span
            className="flex items-center gap-1 text-primary whitespace-nowrap font-medium"
            title={t('admin.inventory.card.monthlyConsumptionTitle')}
          >
            <TrendingDown className="w-3 h-3" />
            {t('admin.inventory.card.monthlyConsumption', { value: consumption.monthlyConsumption, unit: item.unit })}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => onViewHistory(item)}
          className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg text-xs font-medium
            text-text hover:bg-surface transition-colors flex items-center justify-center gap-1"
        >
          <History className="w-3 h-3" />
          {t('admin.inventory.card.history')}
        </button>
        <button
          onClick={() => onRestock(item)}
          className="flex-1 px-3 py-2 bg-primary text-primary-contrast rounded-lg text-xs font-medium
            hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
        >
          <ArrowUpCircle className="w-3 h-3" />
          {t('admin.inventory.card.restock')}
        </button>
      </div>
    </motion.div>
  )
})

function RestockModal({ item, onClose, onRestock }) {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState('')
  const [restockedBy, setRestockedBy] = useState('')

  const suggestedQuantity = item.maxStock - item.currentStock

  const handleSubmit = (e) => {
    e.preventDefault()
    if (quantity && parseInt(quantity) > 0) {
      onRestock(item.id, parseInt(quantity), restockedBy || 'Admin')
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl border border-border w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${categoryConfig[item.category]?.color || 'bg-gray-500'}`}>
              <ArrowUpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text">{t('admin.inventory.restockModal.title')}</h3>
              <p className="text-sm text-muted">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg transition-colors text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Current Stock Info */}
          <div className="bg-bg rounded-lg p-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">{t('admin.inventory.restockModal.currentStock')}</span>
              <span className="font-medium text-text">{item.currentStock} {item.unit}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">{t('admin.inventory.restockModal.minStock')}</span>
              <span className="font-medium text-amber-500">{item.minStock} {item.unit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">{t('admin.inventory.restockModal.maxStock')}</span>
              <span className="font-medium text-text">{item.maxStock} {item.unit}</span>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              {t('admin.inventory.restockModal.quantityToAdd')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={t('admin.inventory.restockModal.suggested', { value: suggestedQuantity })}
                min="1"
                max={item.maxStock - item.currentStock}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text
                  placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                {item.unit}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setQuantity(suggestedQuantity.toString())}
              className="mt-2 text-xs text-primary hover:underline"
            >
              {t('admin.inventory.restockModal.fillToMax', { value: suggestedQuantity, unit: item.unit })}
            </button>
          </div>

          {/* Restocked By */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              {t('admin.inventory.restockModal.restockedBy')}
            </label>
            <input
              type="text"
              value={restockedBy}
              onChange={(e) => setRestockedBy(e.target.value)}
              placeholder={t('admin.inventory.restockModal.enterName')}
              className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text
                placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Preview */}
          {quantity && (
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400">
                {t('admin.inventory.restockModal.newLevel')} <strong>{item.currentStock + parseInt(quantity || 0)} {item.unit}</strong>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg text-text
                font-medium hover:bg-surface transition-colors"
            >
              {t('common.actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={!quantity || parseInt(quantity) <= 0}
              className="flex-1 px-4 py-2 bg-primary text-primary-contrast rounded-lg font-medium
                hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('admin.inventory.restockModal.confirm')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function HistoryModal({ item, onClose }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl border border-border w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${categoryConfig[item.category]?.color || 'bg-gray-500'}`}>
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text">{t('admin.inventory.historyModal.title')}</h3>
              <p className="text-sm text-muted">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg transition-colors text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {item.restockHistory && item.restockHistory.length > 0 ? (
            <div className="space-y-3">
              {item.restockHistory.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-bg rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-text">
                      +{entry.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-muted">{t('admin.inventory.historyModal.by', { name: entry.by })}</p>
                  </div>
                  <p className="text-xs text-muted">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-8">{t('admin.inventory.historyModal.empty')}</p>
          )}
        </div>

        {/* Close */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text
              font-medium hover:bg-surface transition-colors"
          >
            {t('common.actions.close')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// --- Trends tab (H21) -------------------------------------------------------

function TrendCard({ children, className = '' }) {
  return (
    <div className={`bg-surface rounded-xl border border-border p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  )
}

function ReorderSuggestions({ suggestions, adjustedIds, onAdjust }) {
  const { t } = useTranslation()
  if (suggestions.length === 0) return null

  return (
    <TrendCard className="border-amber-500/40 bg-amber-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Lightbulb className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-text">{t('admin.inventory.trends.reorderTitle')}</h3>
          <p className="text-sm text-muted">
            {t('admin.inventory.trends.reorderSubtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {suggestions.map((s) => {
          const config = categoryConfig[s.category]
          const Icon = config?.icon || Box
          const done = adjustedIds.has(s.id)

          return (
            <div
              key={s.id}
              className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-border"
            >
              <div className={`p-1.5 rounded-lg ${config?.color || 'bg-gray-500'} flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text truncate">{s.name}</p>
                <p className="text-xs text-muted flex items-center gap-1.5 flex-wrap">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {t('admin.inventory.trends.lowThisMonth', { hits: s.hits })}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    {t('admin.inventory.trends.minFromTo', { from: s.currentMin })}
                    <ArrowUp className="w-3 h-3 rotate-45" />
                    <strong className="text-text">{s.suggestedMin}</strong> {s.unit}
                  </span>
                </p>
              </div>
              {done ? (
                <span className="px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1 whitespace-nowrap">
                  <Check className="w-3.5 h-3.5" />
                  {t('admin.inventory.trends.adjusted')}
                </span>
              ) : (
                <button
                  onClick={() => onAdjust(s.id, s.suggestedMin)}
                  className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg
                    hover:bg-amber-600 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <ArrowUp className="w-3 h-3" />
                  {t('admin.inventory.trends.setMin', { value: s.suggestedMin })}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </TrendCard>
  )
}

function CategoryConsumptionChart({ byCategory, totalMonthlyCost }) {
  const { t } = useTranslation()
  const maxConsumption = Math.max(...byCategory.map(c => c.monthlyConsumption), 1)

  return (
    <TrendCard>
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-text">{t('admin.inventory.trends.byCategoryTitle')}</h3>
        <span className="ml-auto text-xs text-muted">{t('admin.inventory.trends.last30days')}</span>
      </div>

      <div className="space-y-4">
        {byCategory.map((cat) => {
          const config = categoryConfig[cat.category]
          const Icon = config?.icon || Box
          const width = (cat.monthlyConsumption / maxConsumption) * 100
          const costShare = totalMonthlyCost > 0
            ? Math.round((cat.monthlyCost / totalMonthlyCost) * 100)
            : 0

          return (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5 text-sm">
                <span className="flex items-center gap-2 text-text font-medium">
                  <span className={`p-1 rounded ${config?.color || 'bg-gray-500'}`}>
                    <Icon className="w-3 h-3 text-white" />
                  </span>
                  {t(`admin.inventory.categories.${cat.category}`)}
                </span>
                <span className="text-muted">
                  <strong className="text-text">{cat.monthlyConsumption.toLocaleString()}</strong> u
                  <span className="mx-1.5">·</span>
                  ${cat.monthlyCost.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full ${config?.color || 'bg-gray-500'} rounded-full`}
                  />
                </div>
                <span className="text-xs text-muted w-10 text-right">{costShare}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted">{t('admin.inventory.trends.totalMonthlySpend')}</span>
        <span className="text-lg font-bold text-text">${totalMonthlyCost.toLocaleString()}</span>
      </div>
    </TrendCard>
  )
}

const medalColor = ['bg-amber-400', 'bg-gray-300', 'bg-amber-600']

function TopConsumedList({ items }) {
  const { t } = useTranslation()
  const maxVolume = Math.max(...items.map(i => i.restockVolume90), 1)

  return (
    <TrendCard>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-text">{t('admin.inventory.trends.topConsumedTitle')}</h3>
        <span className="ml-auto text-xs text-muted">{t('admin.inventory.trends.by90dayVolume')}</span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const config = categoryConfig[item.category]
          const width = (item.restockVolume90 / maxVolume) * 100

          return (
            <div key={item.id} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${idx < 3 ? `${medalColor[idx]} text-black` : 'bg-border text-muted'}`}
              >
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="text-text font-medium truncate">{item.name}</span>
                  <span className="text-muted whitespace-nowrap ml-2">
                    {item.restockVolume90.toLocaleString()} {item.unit}
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.06 }}
                    className={`h-full ${config?.color || 'bg-gray-500'} rounded-full`}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TrendCard>
  )
}

function ObsoleteItems({ items }) {
  const { t } = useTranslation()
  const tiedUp = items.reduce((s, i) => s + i.tiedUpValue, 0)

  return (
    <TrendCard>
      <div className="flex items-center gap-2 mb-4">
        <Archive className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-text">{t('admin.inventory.trends.obsoleteTitle')}</h3>
        <span className="ml-auto text-xs text-muted">{t('admin.inventory.trends.neverRestocked')}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted py-4 text-center">
          {t('admin.inventory.trends.obsoleteEmpty')}
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => {
              const config = categoryConfig[item.category]
              const Icon = config?.icon || Box

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-border"
                >
                  <div className={`p-1.5 rounded-lg ${config?.color || 'bg-gray-500'} flex-shrink-0 opacity-70`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text truncate">{item.name}</p>
                    <p className="text-xs text-muted">{item.sku} · {item.location}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-sm font-medium text-text">${item.tiedUpValue.toLocaleString()}</p>
                    <p className="text-xs text-muted">{item.currentStock} {item.unit}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted">{t('admin.inventory.trends.capitalTiedUp')}</span>
            <span className="text-lg font-bold text-text">${tiedUp.toLocaleString()}</span>
          </div>
        </>
      )}
    </TrendCard>
  )
}

function TrendsView({ inventory, onAdjustMin }) {
  const { t } = useTranslation()
  const analytics = useMemo(() => getInventoryAnalytics(inventory), [inventory])
  const [adjustedIds, setAdjustedIds] = useState(new Set())

  const handleAdjust = (id, min) => {
    onAdjustMin(id, min)
    setAdjustedIds(prev => new Set(prev).add(id))
  }

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">${analytics.totalMonthlyCost.toLocaleString()}</p>
              <p className="text-xs text-muted">{t('admin.inventory.trends.monthlySpend')}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingDown className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{analytics.totalMonthlyConsumption.toLocaleString()}</p>
              <p className="text-xs text-muted">{t('admin.inventory.trends.unitsPerMonth')}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-500">{analytics.suggestions.length}</p>
              <p className="text-xs text-muted">{t('admin.inventory.trends.reorderAlerts')}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Archive className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{analytics.obsolete.length}</p>
              <p className="text-xs text-muted">{t('admin.inventory.trends.possiblyObsolete')}</p>
            </div>
          </div>
        </div>
      </div>

      <ReorderSuggestions
        suggestions={analytics.suggestions}
        adjustedIds={adjustedIds}
        onAdjust={handleAdjust}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryConsumptionChart
          byCategory={analytics.byCategory}
          totalMonthlyCost={analytics.totalMonthlyCost}
        />
        <TopConsumedList items={analytics.topConsumed} />
      </div>

      <ObsoleteItems items={analytics.obsolete} />
    </div>
  )
}

export default function InventoryManagement() {
  const { t } = useTranslation()
  const { inventory, restockItem, updateInventory } = useAdminData()
  const [view, setView] = useState('inventory') // 'inventory' | 'trends'
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [restockModal, setRestockModal] = useState(null)
  const [historyModal, setHistoryModal] = useState(null)

  const handleAdjustMin = (id, minStock) => {
    updateInventory(id, { minStock })
  }

  // Get low stock items
  const lowStockItems = useMemo(() => {
    return inventory.filter(item => item.currentStock <= item.minStock)
  }, [inventory])

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false

      // Stock filter
      if (stockFilter !== 'all') {
        const stockPercentage = (item.currentStock / item.maxStock) * 100
        if (stockFilter === 'low' && item.currentStock > item.minStock) return false
        if (stockFilter === 'normal' && (item.currentStock <= item.minStock || stockPercentage > 75)) return false
        if (stockFilter === 'high' && stockPercentage <= 75) return false
      }

      return true
    })
  }, [inventory, searchQuery, categoryFilter, stockFilter])

  const handleRestock = async (itemId, quantity, by) => {
    await restockItem(itemId, quantity, by)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text">{t('admin.inventory.title')}</h2>
          <p className="text-sm text-muted">
            {view === 'inventory' ? t('admin.inventory.itemsCount', { count: filteredInventory.length }) : t('admin.inventory.trendsSubtitle')}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex bg-bg border border-border rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setView('inventory')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              view === 'inventory'
                ? 'bg-primary text-primary-contrast'
                : 'text-muted hover:text-text'
            }`}
          >
            <Package className="w-4 h-4" />
            {t('admin.inventory.tabs.inventory')}
          </button>
          <button
            onClick={() => setView('trends')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              view === 'trends'
                ? 'bg-primary text-primary-contrast'
                : 'text-muted hover:text-text'
            }`}
          >
            <LineChart className="w-4 h-4" />
            {t('admin.inventory.tabs.trends')}
          </button>
        </div>
      </div>

      {view === 'trends' ? (
        <TrendsView inventory={inventory} onAdjustMin={handleAdjustMin} />
      ) : (
      <>
      {/* Stats */}
      <InventoryStats inventory={inventory} />

      {/* Low Stock Alerts */}
      <LowStockAlerts
        items={lowStockItems}
        onRestock={(item) => setRestockModal(item)}
      />

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder={t('admin.inventory.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                text-text placeholder:text-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {categoryFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {t(filter.key)}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {stockFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {t(filter.key)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredInventory.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onRestock={(item) => setRestockModal(item)}
              onViewHistory={(item) => setHistoryModal(item)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">{t('admin.inventory.empty.title')}</h3>
          <p className="text-sm text-muted">
            {t('admin.inventory.empty.subtitle')}
          </p>
        </motion.div>
      )}
      </>
      )}

      {/* Modals */}
      <AnimatePresence>
        {restockModal && (
          <RestockModal
            item={restockModal}
            onClose={() => setRestockModal(null)}
            onRestock={handleRestock}
          />
        )}
        {historyModal && (
          <HistoryModal
            item={historyModal}
            onClose={() => setHistoryModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

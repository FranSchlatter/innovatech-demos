import { useState, useMemo } from 'react'
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
  BarChart3
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'

const categoryConfig = {
  linens: { icon: Shirt, color: 'bg-blue-500', label: 'Linens' },
  amenities: { icon: Sparkles, color: 'bg-purple-500', label: 'Amenities' },
  minibar: { icon: Wine, color: 'bg-amber-500', label: 'Minibar' },
  cleaning: { icon: SprayCan, color: 'bg-green-500', label: 'Cleaning' }
}

const categoryFilters = [
  { value: 'all', label: 'All Categories' },
  { value: 'linens', label: 'Linens' },
  { value: 'amenities', label: 'Amenities' },
  { value: 'minibar', label: 'Minibar' },
  { value: 'cleaning', label: 'Cleaning' }
]

const stockFilters = [
  { value: 'all', label: 'All Stock Levels' },
  { value: 'low', label: 'Low Stock' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'Well Stocked' }
]

function StockLevelBar({ current, min, max }) {
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
        <p className="text-xs text-amber-500 mt-1">Min: {min}</p>
      )}
    </div>
  )
}

function LowStockAlerts({ items, onRestock }) {
  if (items.length === 0) {
    return (
      <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="font-medium text-green-600 dark:text-green-400">All Stock Levels OK</p>
            <p className="text-sm text-muted">No items need restocking</p>
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
              {items.length} Items Low on Stock
            </p>
            <p className="text-sm text-muted">Immediate attention required</p>
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
                    Need +{deficit} {item.unit}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRestock(item)}
                className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg
                  hover:bg-amber-600 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <Plus className="w-3 h-3" />
                Restock
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InventoryStats({ inventory }) {
  const stats = useMemo(() => {
    const totalItems = inventory.length
    const lowStock = inventory.filter(i => i.currentStock <= i.minStock).length
    const totalValue = inventory.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0)
    const categoryStats = Object.entries(categoryConfig).map(([key, config]) => ({
      category: key,
      label: config.label,
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
            <p className="text-xs text-muted">Total Items</p>
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
            <p className="text-xs text-muted">Low Stock</p>
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
            <p className="text-xs text-muted">Total Value</p>
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
                title={`${cat.label}: ${cat.count}`}
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

function InventoryCard({ item, onRestock, onViewHistory }) {
  const config = categoryConfig[item.category]
  const Icon = config?.icon || Box
  const isLow = item.currentStock <= item.minStock

  const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
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
            Low
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
          <span>${item.costPerUnit.toFixed(2)}/{item.unit}</span>
        </div>
      </div>

      {/* Last Restocked */}
      <div className="flex items-center gap-1 text-xs text-muted mb-3">
        <History className="w-3 h-3" />
        <span>Restocked {timeAgo(item.lastRestocked)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => onViewHistory(item)}
          className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg text-xs font-medium
            text-text hover:bg-surface transition-colors flex items-center justify-center gap-1"
        >
          <History className="w-3 h-3" />
          History
        </button>
        <button
          onClick={() => onRestock(item)}
          className="flex-1 px-3 py-2 bg-primary text-primary-contrast rounded-lg text-xs font-medium
            hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
        >
          <ArrowUpCircle className="w-3 h-3" />
          Restock
        </button>
      </div>
    </motion.div>
  )
}

function RestockModal({ item, onClose, onRestock }) {
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
              <h3 className="font-semibold text-text">Restock Item</h3>
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
              <span className="text-muted">Current Stock</span>
              <span className="font-medium text-text">{item.currentStock} {item.unit}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Minimum Stock</span>
              <span className="font-medium text-amber-500">{item.minStock} {item.unit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Maximum Stock</span>
              <span className="font-medium text-text">{item.maxStock} {item.unit}</span>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Quantity to Add
            </label>
            <div className="relative">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Suggested: ${suggestedQuantity}`}
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
              Fill to max ({suggestedQuantity} {item.unit})
            </button>
          </div>

          {/* Restocked By */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Restocked By
            </label>
            <input
              type="text"
              value={restockedBy}
              onChange={(e) => setRestockedBy(e.target.value)}
              placeholder="Enter name (optional)"
              className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text
                placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Preview */}
          {quantity && (
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400">
                New stock level: <strong>{item.currentStock + parseInt(quantity || 0)} {item.unit}</strong>
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={!quantity || parseInt(quantity) <= 0}
              className="flex-1 px-4 py-2 bg-primary text-primary-contrast rounded-lg font-medium
                hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Restock
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function HistoryModal({ item, onClose }) {
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
              <h3 className="font-semibold text-text">Restock History</h3>
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
                    <p className="text-xs text-muted">by {entry.by}</p>
                  </div>
                  <p className="text-xs text-muted">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-8">No restock history available</p>
          )}
        </div>

        {/* Close */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text
              font-medium hover:bg-surface transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function InventoryManagement() {
  const { inventory, restockItem } = useAdminData()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [restockModal, setRestockModal] = useState(null)
  const [historyModal, setHistoryModal] = useState(null)

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
      <div>
        <h2 className="text-xl font-bold text-text">Inventory Management</h2>
        <p className="text-sm text-muted">
          {filteredInventory.length} items
        </p>
      </div>

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
              placeholder="Search items, SKUs, locations..."
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
                  {filter.label}
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
                  {filter.label}
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
          <h3 className="text-lg font-medium text-text mb-2">No items found</h3>
          <p className="text-sm text-muted">
            Try adjusting your search or filters
          </p>
        </motion.div>
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

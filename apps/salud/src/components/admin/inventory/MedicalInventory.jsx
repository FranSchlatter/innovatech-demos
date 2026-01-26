import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Search,
  Pill,
  Syringe,
  Stethoscope,
  TestTube,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  X,
  Plus,
  History,
  MapPin,
  DollarSign
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'

const categoryConfig = {
  medications: { icon: Pill, color: 'bg-purple-500', label: 'Medications' },
  supplies: { icon: Syringe, color: 'bg-blue-500', label: 'Supplies' },
  equipment: { icon: Stethoscope, color: 'bg-green-500', label: 'Equipment' },
  diagnostic: { icon: TestTube, color: 'bg-amber-500', label: 'Diagnostic' }
}

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
      {isLow && <p className="text-xs text-amber-500 mt-1">Min: {min}</p>}
    </div>
  )
}

function ExpirationBadge({ expirationDate }) {
  if (!expirationDate) return null

  const expDate = new Date(expirationDate)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) {
    return (
      <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-xs rounded-full font-medium">
        Expired
      </span>
    )
  }

  if (daysUntilExpiry <= 30) {
    return (
      <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-xs rounded-full font-medium">
        Expires in {daysUntilExpiry}d
      </span>
    )
  }

  if (daysUntilExpiry <= 90) {
    return (
      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs rounded-full font-medium">
        Expires in {daysUntilExpiry}d
      </span>
    )
  }

  return null
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
      <div className="divide-y divide-amber-500/10 max-h-[200px] overflow-y-auto">
        {items.map(item => {
          const config = categoryConfig[item.category]
          const Icon = config?.icon || Package
          const deficit = item.minStock - item.currentStock

          return (
            <div key={item.id} className="p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-1.5 rounded-lg ${config?.color || 'bg-gray-500'}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text truncate">{item.name}</p>
                  <p className="text-xs text-red-500">Need +{deficit} {item.unit}</p>
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

function ExpiringAlerts({ items }) {
  if (items.length === 0) return null

  return (
    <div className="bg-orange-500/10 rounded-xl border border-orange-500/20 overflow-hidden">
      <div className="p-4 border-b border-orange-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-medium text-orange-600 dark:text-orange-400">
              {items.length} Items Expiring Soon
            </p>
            <p className="text-sm text-muted">Review before expiration</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-orange-500/10 max-h-[150px] overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="p-3 flex items-center justify-between">
            <span className="text-sm text-text truncate flex-1">{item.name}</span>
            <span className="text-xs text-orange-500 whitespace-nowrap">
              {new Date(item.expirationDate).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RestockModal({ item, onClose, onRestock }) {
  const [quantity, setQuantity] = useState('')
  const config = categoryConfig[item.category]
  const Icon = config?.icon || Package
  const suggestedQuantity = item.maxStock - item.currentStock

  const handleSubmit = (e) => {
    e.preventDefault()
    if (quantity && parseInt(quantity) > 0) {
      onRestock(item.id, parseInt(quantity), 'Admin')
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
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config?.color || 'bg-gray-500'}`}>
              <ArrowUpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text">Restock Item</h3>
              <p className="text-sm text-muted">{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg transition-colors text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-text mb-2">Quantity to Add</label>
            <div className="relative">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Suggested: ${suggestedQuantity}`}
                min="1"
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text
                  placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">{item.unit}</span>
            </div>
            <button
              type="button"
              onClick={() => setQuantity(suggestedQuantity.toString())}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Fill to max ({suggestedQuantity} {item.unit})
            </button>
          </div>

          {quantity && (
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400">
                New stock level: <strong>{item.currentStock + parseInt(quantity || 0)} {item.unit}</strong>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg text-text font-medium hover:bg-surface transition-colors"
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

function InventoryCard({ item, onRestock }) {
  const config = categoryConfig[item.category]
  const Icon = config?.icon || Package
  const isLow = item.currentStock <= item.minStock

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-xl border p-4 transition-all ${
        isLow ? 'border-amber-500/50 bg-amber-500/5' : 'border-border hover:border-primary/30'
      }`}
    >
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
        <div className="flex flex-col items-end gap-1">
          {isLow && (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs rounded-full font-medium">Low</span>
          )}
          <ExpirationBadge expirationDate={item.expirationDate} />
        </div>
      </div>

      <div className="mb-3">
        <StockLevelBar current={item.currentStock} min={item.minStock} max={item.maxStock} />
      </div>

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

      <button
        onClick={() => onRestock(item)}
        className="w-full px-3 py-2 bg-primary text-primary-contrast rounded-lg text-xs font-medium
          hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
      >
        <ArrowUpCircle className="w-3 h-3" />
        Restock
      </button>
    </motion.div>
  )
}

export default function MedicalInventory() {
  const { inventory, restockItem, loading } = useAdminData()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [restockModal, setRestockModal] = useState(null)

  const lowStockItems = useMemo(() => {
    return inventory.filter(item => item.currentStock <= item.minStock)
  }, [inventory])

  const expiringItems = useMemo(() => {
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + 90)
    return inventory
      .filter(item => item.expirationDate && new Date(item.expirationDate) <= thresholdDate)
      .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))
  }, [inventory])

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!item.name.toLowerCase().includes(query) && !item.sku.toLowerCase().includes(query)) return false
      }
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      return true
    })
  }, [inventory, searchQuery, categoryFilter])

  const stats = useMemo(() => ({
    total: inventory.length,
    lowStock: lowStockItems.length,
    expiring: expiringItems.length,
    totalValue: inventory.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0)
  }), [inventory, lowStockItems, expiringItems])

  const handleRestock = async (itemId, quantity, by) => {
    await restockItem(itemId, quantity, by)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Medical Inventory</h2>
        <p className="text-sm text-muted">{filteredInventory.length} items</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{stats.total}</p>
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
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">{stats.expiring}</p>
              <p className="text-xs text-muted">Expiring Soon</p>
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
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LowStockAlerts items={lowStockItems} onRestock={setRestockModal} />
        <ExpiringAlerts items={expiringItems} />
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search items, SKUs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                text-text placeholder:text-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
              focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredInventory.map((item) => (
            <InventoryCard key={item.id} item={item} onRestock={setRestockModal} />
          ))}
        </AnimatePresence>
      </div>

      {filteredInventory.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No items found</h3>
          <p className="text-sm text-muted">Try adjusting your search or filters</p>
        </motion.div>
      )}

      <AnimatePresence>
        {restockModal && (
          <RestockModal item={restockModal} onClose={() => setRestockModal(null)} onRestock={handleRestock} />
        )}
      </AnimatePresence>
    </div>
  )
}

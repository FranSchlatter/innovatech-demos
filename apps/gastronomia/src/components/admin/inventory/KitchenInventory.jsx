import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Search,
  AlertTriangle,
  Clock,
  Plus,
  X,
  TrendingDown,
  DollarSign
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'proteins', label: 'Proteins' },
  { id: 'produce', label: 'Produce' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'pantry', label: 'Pantry' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'desserts', label: 'Desserts' }
]

function StatsBar({ inventory }) {
  const stats = useMemo(() => {
    const lowStock = inventory.filter(i => i.currentStock <= i.minStock).length
    const today = new Date()
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)

    const expiringSoon = inventory.filter(i => {
      if (!i.expirationDate) return false
      return new Date(i.expirationDate) <= weekFromNow
    }).length

    const totalValue = inventory.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0)

    return {
      totalItems: inventory.length,
      lowStock,
      expiringSoon,
      totalValue
    }
  }, [inventory])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-surface rounded-lg border border-border p-3 text-center">
        <p className="text-2xl font-bold text-text">{stats.totalItems}</p>
        <p className="text-xs text-muted">Total Items</p>
      </div>
      <div className="bg-amber-500/10 rounded-lg border border-amber-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.lowStock}</p>
        <p className="text-xs text-muted">Low Stock</p>
      </div>
      <div className="bg-orange-500/10 rounded-lg border border-orange-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.expiringSoon}</p>
        <p className="text-xs text-muted">Expiring Soon</p>
      </div>
      <div className="bg-primary/10 rounded-lg border border-primary/20 p-3 text-center">
        <p className="text-2xl font-bold text-primary">${stats.totalValue.toFixed(0)}</p>
        <p className="text-xs text-muted">Total Value</p>
      </div>
    </div>
  )
}

function RestockModal({ isOpen, onClose, item, onRestock }) {
  const [quantity, setQuantity] = useState('')

  if (!isOpen || !item) return null

  const handleSubmit = () => {
    const qty = parseInt(quantity)
    if (qty > 0) {
      onRestock(item.id, qty)
      setQuantity('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-xl border border-border w-full max-w-md overflow-hidden"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-text">Restock Item</h3>
            <button onClick={onClose} className="p-1 hover:bg-bg rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-bg rounded-lg p-3">
              <p className="font-medium text-text">{item.name}</p>
              <p className="text-sm text-muted">{item.sku}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted">Current Stock:</span>
                <span className="font-medium text-text">{item.currentStock} {item.unit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Min Stock:</span>
                <span className="font-medium text-text">{item.minStock} {item.unit}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Quantity to Add
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Enter quantity (${item.unit})`}
                min="1"
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="p-4 border-t border-border flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!quantity || parseInt(quantity) <= 0}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Stock
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function InventoryCard({ item, onRestock }) {
  const stockPercentage = (item.currentStock / item.maxStock) * 100
  const isLowStock = item.currentStock <= item.minStock

  const today = new Date()
  const expDate = item.expirationDate ? new Date(item.expirationDate) : null
  const daysUntilExpiry = expDate ? Math.ceil((expDate - today) / (1000 * 60 * 60 * 24)) : null
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-xl border overflow-hidden ${
        isExpired ? 'border-red-500' :
        isLowStock || isExpiringSoon ? 'border-amber-500' : 'border-border'
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-text">{item.name}</h3>
            <p className="text-xs text-muted">{item.sku}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isExpired && <StatusBadge status="expired" size="xs" />}
            {!isExpired && isExpiringSoon && <StatusBadge status="expiring" size="xs" />}
            {isLowStock && <StatusBadge status="low-stock" size="xs" />}
            {!isLowStock && !isExpired && !isExpiringSoon && <StatusBadge status="in-stock" size="xs" />}
          </div>
        </div>

        {/* Stock Level */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted">Stock Level</span>
            <span className="font-medium text-text">
              {item.currentStock} / {item.maxStock} {item.unit}
            </span>
          </div>
          <div className="h-2 bg-bg rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isLowStock ? 'bg-red-500' :
                stockPercentage < 50 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-1">Min: {item.minStock} {item.unit}</p>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Category</span>
            <span className="text-text capitalize">{item.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Location</span>
            <span className="text-text">{item.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Unit Cost</span>
            <span className="text-text">${item.costPerUnit.toFixed(2)}</span>
          </div>
          {expDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted">Expires</span>
              <span className={`${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-text'}`}>
                {expDate.toLocaleDateString()}
                {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                  <span className="text-xs ml-1">({daysUntilExpiry}d)</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Restock Button */}
        <button
          onClick={() => onRestock(item)}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Restock
        </button>
      </div>
    </motion.div>
  )
}

export default function KitchenInventory() {
  const { inventory, loading, restockItem } = useAdminData()

  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)
  const [restockModal, setRestockModal] = useState({ isOpen: false, item: null })

  const filteredInventory = useMemo(() => {
    let result = [...inventory]

    // Category filter
    if (category !== 'all') {
      result = result.filter(i => i.category === category)
    }

    // Low stock only
    if (showLowStockOnly) {
      result = result.filter(i => i.currentStock <= i.minStock)
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.sku.toLowerCase().includes(query) ||
        i.supplier?.toLowerCase().includes(query)
      )
    }

    // Sort: low stock first, then by name
    result.sort((a, b) => {
      const aLow = a.currentStock <= a.minStock ? 0 : 1
      const bLow = b.currentStock <= b.minStock ? 0 : 1
      if (aLow !== bLow) return aLow - bLow
      return a.name.localeCompare(b.name)
    })

    return result
  }, [inventory, category, searchQuery, showLowStockOnly])

  const handleRestock = async (itemId, quantity) => {
    await restockItem(itemId, quantity)
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
    <div className="space-y-4">
      {/* Stats */}
      <StatsBar inventory={inventory} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl border border-border p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by name, SKU, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-sm bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
            />
            <span className="text-sm text-muted flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Low stock only
            </span>
          </label>
        </div>
      </motion.div>

      {/* Inventory Grid */}
      {filteredInventory.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface rounded-xl border border-border p-8 text-center"
        >
          <Package className="w-12 h-12 mx-auto mb-3 text-muted opacity-50" />
          <p className="text-muted">No inventory items found</p>
          <p className="text-sm text-muted mt-1">Try adjusting your filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInventory.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onRestock={(item) => setRestockModal({ isOpen: true, item })}
            />
          ))}
        </div>
      )}

      {/* Restock Modal */}
      <RestockModal
        isOpen={restockModal.isOpen}
        onClose={() => setRestockModal({ isOpen: false, item: null })}
        item={restockModal.item}
        onRestock={handleRestock}
      />
    </div>
  )
}

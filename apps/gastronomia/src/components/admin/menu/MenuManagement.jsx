import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  UtensilsCrossed,
  Search,
  Star,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  TrendingUp,
  Award
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const CATEGORIES = ['All', 'Appetizers', 'Main Courses', 'Desserts', 'Drinks']

function StatsBar({ menuItems }) {
  const stats = useMemo(() => {
    return {
      total: menuItems.length,
      active: menuItems.filter(m => m.status === 'active').length,
      outOfStock: menuItems.filter(m => m.status === 'out-of-stock').length,
      featured: menuItems.filter(m => m.featured).length,
      avgRating: (menuItems.reduce((sum, m) => sum + m.rating, 0) / menuItems.length).toFixed(2)
    }
  }, [menuItems])

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="bg-surface rounded-lg border border-border p-3 text-center">
        <p className="text-2xl font-bold text-text">{stats.total}</p>
        <p className="text-xs text-muted">Total Items</p>
      </div>
      <div className="bg-green-500/10 rounded-lg border border-green-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
        <p className="text-xs text-muted">Active</p>
      </div>
      <div className="bg-red-500/10 rounded-lg border border-red-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.outOfStock}</p>
        <p className="text-xs text-muted">Out of Stock</p>
      </div>
      <div className="bg-primary/10 rounded-lg border border-primary/20 p-3 text-center">
        <p className="text-2xl font-bold text-primary">{stats.featured}</p>
        <p className="text-xs text-muted">Featured</p>
      </div>
      <div className="bg-amber-500/10 rounded-lg border border-amber-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.avgRating}</p>
        <p className="text-xs text-muted">Avg Rating</p>
      </div>
    </div>
  )
}

function MenuItemCard({ item, onToggleStatus, onToggleFeatured }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-video">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.featured && (
          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Award className="w-3 h-3" />
            Featured
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={item.status} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-text">{item.name}</h3>
            <p className="text-sm text-muted">{item.category}</p>
          </div>
          <p className="text-lg font-bold text-primary">${item.price}</p>
        </div>

        <p className="text-sm text-muted line-clamp-2 mb-3">{item.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted mb-3">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500" />
            {item.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {item.preparationTime} min
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {item.ordersToday || 0} today
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs bg-bg text-muted px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <button
            onClick={() => onToggleStatus(item.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.status === 'active'
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
            }`}
          >
            {item.status === 'active' ? (
              <>
                <EyeOff className="w-4 h-4" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Activate
              </>
            )}
          </button>
          <button
            onClick={() => onToggleFeatured(item.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.featured
                ? 'bg-primary/10 text-primary'
                : 'bg-bg text-muted hover:bg-bg/80'
            }`}
          >
            <Award className="w-4 h-4" />
            {item.featured ? 'Unfeatured' : 'Feature'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function MenuManagement() {
  const { menuItems, loading, toggleMenuItemStatus, updateMenuItem } = useAdminData()

  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  const filteredItems = useMemo(() => {
    let result = [...menuItems]

    // Category filter
    if (category !== 'All') {
      result = result.filter(m => m.category === category)
    }

    // Active only
    if (showOnlyActive) {
      result = result.filter(m => m.status === 'active')
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query) ||
        m.tags?.some(t => t.toLowerCase().includes(query))
      )
    }

    return result
  }, [menuItems, category, searchQuery, showOnlyActive])

  const handleToggleStatus = async (itemId) => {
    await toggleMenuItemStatus(itemId)
  }

  const handleToggleFeatured = async (itemId) => {
    const item = menuItems.find(m => m.id === itemId)
    await updateMenuItem(itemId, { featured: !item.featured })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <StatsBar menuItems={menuItems} />

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
              placeholder="Search dishes by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  category === cat
                    ? 'bg-primary text-white'
                    : 'bg-bg text-muted hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={(e) => setShowOnlyActive(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
            />
            <span className="text-sm text-muted">Active only</span>
          </label>
        </div>
      </motion.div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface rounded-xl border border-border p-8 text-center"
        >
          <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-muted opacity-50" />
          <p className="text-muted">No menu items found</p>
          <p className="text-sm text-muted mt-1">Try adjusting your filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onToggleStatus={handleToggleStatus}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      )}
    </div>
  )
}

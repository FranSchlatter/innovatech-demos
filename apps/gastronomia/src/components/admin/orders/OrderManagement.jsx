import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Search,
  Filter,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  User,
  DollarSign,
  CheckCircle2,
  XCircle,
  ChefHat,
  Truck,
  UtensilsCrossed,
  Package
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const ORDER_FILTERS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' }
]

const TYPE_FILTERS = [
  { id: 'all', label: 'All Types' },
  { id: 'dine-in', label: 'Dine-In' },
  { id: 'takeout', label: 'Takeout' },
  { id: 'delivery', label: 'Delivery' }
]

function StatsBar({ orders }) {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders.filter(o => o.createdAt.startsWith(today))

    return {
      total: todayOrders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: todayOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
      revenue: todayOrders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0)
    }
  }, [orders])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <div className="bg-surface rounded-lg border border-border p-3 text-center">
        <p className="text-2xl font-bold text-text">{stats.total}</p>
        <p className="text-xs text-muted">Today's Orders</p>
      </div>
      <div className="bg-amber-500/10 rounded-lg border border-amber-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
        <p className="text-xs text-muted">Pending</p>
      </div>
      <div className="bg-purple-500/10 rounded-lg border border-purple-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.preparing}</p>
        <p className="text-xs text-muted">Preparing</p>
      </div>
      <div className="bg-teal-500/10 rounded-lg border border-teal-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.ready}</p>
        <p className="text-xs text-muted">Ready</p>
      </div>
      <div className="bg-green-500/10 rounded-lg border border-green-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        <p className="text-xs text-muted">Completed</p>
      </div>
      <div className="bg-primary/10 rounded-lg border border-primary/20 p-3 text-center">
        <p className="text-2xl font-bold text-primary">${stats.revenue.toFixed(0)}</p>
        <p className="text-xs text-muted">Revenue</p>
      </div>
    </div>
  )
}

function OrderCard({ order, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false)

  const getNextStatus = () => {
    const workflow = {
      'pending': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'ready',
      'ready': order.type === 'delivery' ? 'delivered' : 'completed'
    }
    return workflow[order.status]
  }

  const getStatusAction = () => {
    const actions = {
      'pending': 'Confirm Order',
      'confirmed': 'Start Preparing',
      'preparing': 'Mark Ready',
      'ready': order.type === 'delivery' ? 'Out for Delivery' : 'Complete Order'
    }
    return actions[order.status]
  }

  const typeIcons = {
    'dine-in': UtensilsCrossed,
    'takeout': Package,
    'delivery': Truck
  }
  const TypeIcon = typeIcons[order.type] || ShoppingBag

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-bg/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              order.type === 'dine-in' ? 'bg-blue-500/10' :
              order.type === 'takeout' ? 'bg-teal-500/10' : 'bg-purple-500/10'
            }`}>
              <TypeIcon className={`w-5 h-5 ${
                order.type === 'dine-in' ? 'text-blue-500' :
                order.type === 'takeout' ? 'text-teal-500' : 'text-purple-500'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-text">{order.orderNumber}</span>
                <StatusBadge status={order.status} size="xs" />
              </div>
              <p className="text-sm text-text mt-0.5">{order.customerName}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={order.type} size="xs" />
                {order.tableName && (
                  <span className="text-xs text-muted">• {order.tableName}</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right flex items-start gap-2">
            <div>
              <p className="text-lg font-bold text-text">${order.total.toFixed(2)}</p>
              <p className="text-xs text-muted flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" />
                {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              {/* Customer Info */}
              <div className="bg-bg rounded-lg p-3">
                <h4 className="text-sm font-medium text-text mb-2">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <User className="w-4 h-4" />
                    {order.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Phone className="w-4 h-4" />
                    {order.customerPhone}
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-center gap-2 text-muted">
                      <Mail className="w-4 h-4" />
                      {order.customerEmail}
                    </div>
                  )}
                  {order.deliveryAddress && (
                    <div className="flex items-center gap-2 text-muted md:col-span-2">
                      <MapPin className="w-4 h-4" />
                      {order.deliveryAddress}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium text-text mb-2">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-bg rounded-lg p-2">
                      <div>
                        <span className="font-medium text-text">{item.quantity}x {item.name}</span>
                        {item.notes && (
                          <p className="text-xs text-muted mt-0.5">{item.notes}</p>
                        )}
                      </div>
                      <span className="text-text">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-text">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Tax</span>
                    <span className="text-text">${order.tax.toFixed(2)}</span>
                  </div>
                  {order.deliveryFee && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Delivery Fee</span>
                      <span className="text-text">${order.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-1">
                    <span className="text-text">Total</span>
                    <span className="text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    <strong>Note:</strong> {order.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              {!['completed', 'delivered', 'cancelled'].includes(order.status) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => onUpdateStatus(order.id, getNextStatus())}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {getStatusAction()}
                  </button>
                  <button
                    onClick={() => onUpdateStatus(order.id, 'cancelled')}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Payment Status */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted">Payment Status</span>
                <StatusBadge
                  status={order.paymentStatus === 'paid' ? 'completed' : 'pending'}
                  size="sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function OrderManagement() {
  const { orders, loading, updateOrderStatus } = useAdminData()

  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = useMemo(() => {
    let result = [...orders]

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(o => o.type === typeFilter)
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.customerPhone?.includes(query)
      )
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return result
  }, [orders, statusFilter, typeFilter, searchQuery])

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <StatsBar orders={orders} />

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
              placeholder="Search by order #, customer name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {ORDER_FILTERS.slice(0, 5).map(filter => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-bg text-muted hover:text-text'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {TYPE_FILTERS.map(filter => (
              <option key={filter.id} value={filter.id}>{filter.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface rounded-xl border border-border p-8 text-center"
          >
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted opacity-50" />
            <p className="text-muted">No orders found</p>
            <p className="text-sm text-muted mt-1">Try adjusting your filters</p>
          </motion.div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}

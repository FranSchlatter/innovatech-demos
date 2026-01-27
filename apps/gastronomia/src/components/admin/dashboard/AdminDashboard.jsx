import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Clock,
  DollarSign,
  Users,
  CalendarDays,
  UtensilsCrossed,
  Package,
  AlertTriangle,
  TrendingUp,
  ChefHat,
  CheckCircle2,
  Timer
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

function KPICard({ icon: Icon, label, value, subValue, color, trend, prefix = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl border border-border p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium flex items-center gap-1 ${
            trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-muted'
          }`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-text">{prefix}{value}</p>
        <p className="text-sm text-muted">{label}</p>
        {subValue && (
          <p className="text-xs text-muted mt-1">{subValue}</p>
        )}
      </div>
    </motion.div>
  )
}

function ActiveOrders({ orders }) {
  const activeOrders = useMemo(() => {
    return orders
      .filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status))
      .sort((a, b) => {
        const statusOrder = { 'pending': 0, 'confirmed': 1, 'preparing': 2, 'ready': 3 }
        return statusOrder[a.status] - statusOrder[b.status]
      })
      .slice(0, 6)
  }, [orders])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface rounded-xl border border-border overflow-hidden"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Active Orders
          </h3>
          <span className="text-xs text-muted bg-bg px-2 py-1 rounded-full">
            {activeOrders.length} orders
          </span>
        </div>
      </div>

      <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
        {activeOrders.length === 0 ? (
          <div className="p-6 text-center text-muted">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No active orders</p>
          </div>
        ) : (
          activeOrders.map((order) => (
            <div key={order.id} className="p-3 hover:bg-bg transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-mono font-medium text-text">{order.orderNumber}</span>
                <StatusBadge status={order.status} size="xs" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text">{order.customerName}</p>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <StatusBadge status={order.type} size="xs" />
                    <span>• {order.items.length} items</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-muted">{order.estimatedTime || '--:--'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

function TodayReservations({ reservations }) {
  const today = new Date().toISOString().split('T')[0]
  const todayRes = useMemo(() => {
    return reservations
      .filter(r => r.date === today && r.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 6)
  }, [reservations, today])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-surface rounded-xl border border-border overflow-hidden"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Today's Reservations
          </h3>
          <span className="text-xs text-muted">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
        {todayRes.length === 0 ? (
          <div className="p-6 text-center text-muted">
            <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No reservations today</p>
          </div>
        ) : (
          todayRes.map((res) => (
            <div key={res.id} className="p-3 hover:bg-bg transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-text flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted" />
                  {res.time}
                </span>
                <StatusBadge status={res.status} size="xs" />
              </div>
              <p className="text-sm text-text">{res.customerName}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {res.partySize} guests
                </p>
                <p className="text-xs text-muted">
                  {res.tableName || 'Unassigned'}
                </p>
              </div>
              {res.occasion && (
                <p className="text-xs text-primary mt-1">{res.occasion}</p>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

function KitchenAlerts({ inventory, orders }) {
  const lowStockItems = useMemo(() => {
    return inventory
      .filter(item => item.currentStock <= item.minStock)
      .slice(0, 4)
  }, [inventory])

  const expiringItems = useMemo(() => {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() + 3)
    return inventory
      .filter(item => {
        if (!item.expirationDate) return false
        return new Date(item.expirationDate) <= threshold
      })
      .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))
      .slice(0, 4)
  }, [inventory])

  const kitchenOrders = useMemo(() => {
    return orders.filter(o => o.status === 'preparing').length
  }, [orders])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-surface rounded-xl border border-border overflow-hidden"
    >
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-text flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-primary" />
          Kitchen Alerts
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Kitchen Queue */}
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Kitchen Queue
            </span>
          </div>
          <p className="text-2xl font-bold text-text">{kitchenOrders}</p>
          <p className="text-xs text-muted">orders being prepared</p>
        </div>

        {/* Low Stock */}
        {lowStockItems.length > 0 && (
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Low Stock ({lowStockItems.length})
              </span>
            </div>
            <div className="space-y-1">
              {lowStockItems.map(item => (
                <p key={item.id} className="text-xs text-muted">
                  • {item.name}: {item.currentStock} {item.unit}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Expiring Soon */}
        {expiringItems.length > 0 && (
          <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Expiring Soon ({expiringItems.length})
              </span>
            </div>
            <div className="space-y-1">
              {expiringItems.map(item => (
                <p key={item.id} className="text-xs text-muted">
                  • {item.name}: {new Date(item.expirationDate).toLocaleDateString()}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* All Clear */}
        {lowStockItems.length === 0 && expiringItems.length === 0 && (
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Inventory looks good!
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function TableOverview({ tables }) {
  const stats = useMemo(() => {
    return {
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      cleaning: tables.filter(t => t.status === 'cleaning').length,
      totalCapacity: tables.reduce((sum, t) => sum + t.capacity, 0),
      currentGuests: tables.reduce((sum, t) => sum + (t.guestCount || 0), 0)
    }
  }, [tables])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-surface rounded-xl border border-border p-4"
    >
      <h3 className="font-semibold text-text flex items-center gap-2 mb-4">
        <UtensilsCrossed className="w-5 h-5 text-primary" />
        Table Overview
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-500/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available}</p>
          <p className="text-xs text-muted">Available</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.occupied}</p>
          <p className="text-xs text-muted">Occupied</p>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.reserved}</p>
          <p className="text-xs text-muted">Reserved</p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.cleaning}</p>
          <p className="text-xs text-muted">Cleaning</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Current Guests</span>
          <span className="text-lg font-bold text-text">
            {stats.currentGuests} / {stats.totalCapacity}
          </span>
        </div>
        <div className="mt-2 h-2 bg-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(stats.currentGuests / stats.totalCapacity) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { orders, reservations, inventory, tables, loading, getKPIs } = useAdminData()

  const kpis = useMemo(() => getKPIs(), [getKPIs])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          icon={ShoppingBag}
          label="Today's Orders"
          value={kpis.todayOrders}
          subValue={`${kpis.completedOrdersToday} completed`}
          color="bg-blue-500"
        />
        <KPICard
          icon={DollarSign}
          label="Today's Revenue"
          value={kpis.todayRevenue.toFixed(0)}
          prefix="$"
          color="bg-green-500"
        />
        <KPICard
          icon={CalendarDays}
          label="Reservations"
          value={kpis.todayReservations}
          subValue={`${kpis.expectedGuests} expected guests`}
          color="bg-purple-500"
        />
        <KPICard
          icon={Users}
          label="Current Guests"
          value={kpis.currentGuests}
          subValue={`${kpis.availableTables} tables free`}
          color="bg-teal-500"
        />
        <KPICard
          icon={Package}
          label="Low Stock Items"
          value={kpis.lowStockItems}
          color={kpis.lowStockItems > 0 ? 'bg-amber-500' : 'bg-gray-500'}
        />
        <KPICard
          icon={ChefHat}
          label="Staff On Shift"
          value={kpis.onShiftStaff}
          subValue={`of ${kpis.totalStaff} total`}
          color="bg-primary"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Orders */}
        <ActiveOrders orders={orders} />

        {/* Today's Reservations */}
        <TodayReservations reservations={reservations} />

        {/* Kitchen Alerts */}
        <KitchenAlerts inventory={inventory} orders={orders} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Overview */}
        <TableOverview tables={tables} />
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import {
  Building2,
  BedDouble,
  CalendarCheck,
  Bell,
  UserCheck,
  UserMinus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Users
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'

function KPICard({ label, value, icon: Icon, color, change, trend, index }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-5 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 sm:p-3 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        {TrendIcon && change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            <TrendIcon className="w-3 h-3" />
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text">{value}</h3>
        <p className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1">{label}</p>
      </div>
    </motion.div>
  )
}

function TodayActivity({ checkIns, checkOuts }) {
  const activities = [
    ...checkIns.map(r => ({ ...r, type: 'checkin', time: r.arrivalTime })),
    ...checkOuts.map(r => ({ ...r, type: 'checkout', time: '11:00' }))
  ].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 8)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-text">Today's Activity</h3>
        <span className="text-xs text-muted">{activities.length} events</span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted">
          <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No scheduled activities for today</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 max-h-[320px] overflow-y-auto">
          {activities.map((activity, idx) => (
            <div
              key={`${activity.id}-${activity.type}`}
              className="flex items-center justify-between py-2 sm:py-2.5 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.type === 'checkin' ? 'bg-green-500' : 'bg-orange-500'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-text truncate">
                    {activity.guestName}
                  </p>
                  <p className="text-xs text-muted">Room {activity.roomNumber}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  activity.type === 'checkin'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                }`}>
                  {activity.type === 'checkin' ? 'In' : 'Out'}
                </span>
                <p className="text-xs text-muted mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function RoomStatusOverview({ rooms }) {
  const statusCounts = {
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
  }

  const total = rooms.length
  const statuses = [
    { key: 'available', label: 'Available', color: 'bg-green-500', count: statusCounts.available },
    { key: 'occupied', label: 'Occupied', color: 'bg-blue-500', count: statusCounts.occupied },
    { key: 'cleaning', label: 'Cleaning', color: 'bg-purple-500', count: statusCounts.cleaning },
    { key: 'maintenance', label: 'Maintenance', color: 'bg-amber-500', count: statusCounts.maintenance }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-bold text-text mb-4">Room Status</h3>

      {/* Progress bar */}
      <div className="h-3 sm:h-4 rounded-full bg-bg overflow-hidden flex mb-4">
        {statuses.map(status => (
          <div
            key={status.key}
            className={`${status.color} transition-all duration-500`}
            style={{ width: `${(status.count / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {statuses.map(status => (
          <div key={status.key} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${status.color}`} />
            <span className="text-xs sm:text-sm text-muted">{status.label}</span>
            <span className="text-xs sm:text-sm font-semibold text-text ml-auto">
              {status.count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function QuickStats({ kpis }) {
  const stats = [
    {
      icon: AlertTriangle,
      label: 'Low Stock Items',
      value: kpis.lowStockItems,
      color: kpis.lowStockItems > 0 ? 'text-amber-500' : 'text-green-500'
    },
    {
      icon: Sparkles,
      label: 'Pending Housekeeping',
      value: kpis.pendingHousekeeping,
      color: 'text-purple-500'
    },
    {
      icon: Users,
      label: 'Staff On Duty',
      value: kpis.onDutyStaff,
      color: 'text-blue-500'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-bold text-text mb-4">Quick Stats</h3>

      <div className="space-y-3 sm:space-y-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
              <span className="text-xs sm:text-sm text-muted">{stat.label}</span>
            </div>
            <span className={`text-base sm:text-lg font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { getKPIs, rooms } = useAdminData()
  const kpis = getKPIs()

  const kpiCards = [
    {
      id: 'occupancy',
      label: 'Current Occupancy',
      value: `${kpis.occupancyRate}%`,
      icon: Building2,
      color: 'bg-blue-500',
      change: '+5%',
      trend: 'up'
    },
    {
      id: 'available',
      label: 'Available Rooms',
      value: kpis.availableRooms.toString(),
      icon: BedDouble,
      color: 'bg-green-500'
    },
    {
      id: 'reservations',
      label: 'Active Reservations',
      value: kpis.activeReservations.toString(),
      icon: CalendarCheck,
      color: 'bg-purple-500'
    },
    {
      id: 'services',
      label: 'Pending Services',
      value: kpis.pendingServices.toString(),
      icon: Bell,
      color: kpis.pendingServices > 5 ? 'bg-red-500' : 'bg-orange-500'
    },
    {
      id: 'checkins',
      label: "Today's Check-ins",
      value: kpis.todayCheckIns.toString(),
      icon: UserCheck,
      color: 'bg-teal-500'
    },
    {
      id: 'checkouts',
      label: "Today's Check-outs",
      value: kpis.todayCheckOuts.toString(),
      icon: UserMinus,
      color: 'bg-rose-500'
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpiCards.map((kpi, index) => (
          <KPICard key={kpi.id} {...kpi} index={index} />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <TodayActivity
          checkIns={kpis.todayCheckInsList}
          checkOuts={kpis.todayCheckOutsList}
        />
        <RoomStatusOverview rooms={rooms} />
        <QuickStats kpis={kpis} />
      </div>
    </div>
  )
}

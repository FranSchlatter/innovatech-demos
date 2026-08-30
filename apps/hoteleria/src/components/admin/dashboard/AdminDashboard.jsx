import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Users,
  X,
  Mail,
  Phone,
  Moon,
  CreditCard,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Package
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useAdmin } from '../../../context/AdminContext'
import CommissionWidget from './CommissionWidget'

const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(1, Math.round(ms / 86400000))
}

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

function ActivityDetailModal({ activity, onClose, onCheckIn, onCheckOut }) {
  const [working, setWorking] = useState(false)
  const isCheckin = activity?.type === 'checkin'

  const handleAction = async () => {
    setWorking(true)
    try {
      if (isCheckin) await onCheckIn(activity.id)
      else await onCheckOut(activity.id)
      onClose()
    } finally {
      setWorking(false)
    }
  }

  return (
    <AnimatePresence>
      {activity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-surface rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${isCheckin ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                  {isCheckin
                    ? <UserCheck className="w-5 h-5 text-green-500" />
                    : <UserMinus className="w-5 h-5 text-orange-500" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">{activity.guestName}</h2>
                  <p className="text-sm text-muted">
                    {isCheckin ? 'Check-in' : 'Check-out'} · {activity.id}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Stay summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg rounded-lg p-3">
                  <p className="text-xs text-muted">Room</p>
                  <p className="font-semibold text-text">{activity.roomNumber}</p>
                  <p className="text-xs text-muted capitalize">{activity.roomType}</p>
                </div>
                <div className="bg-bg rounded-lg p-3">
                  <p className="text-xs text-muted">Guests</p>
                  <p className="font-semibold text-text">{activity.guests}</p>
                  <p className="text-xs text-muted">{nightsBetween(activity.checkIn, activity.checkOut)} nights</p>
                </div>
                <div className="bg-bg rounded-lg p-3 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-muted shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Check-in</p>
                    <p className="text-sm font-medium text-text">{activity.checkIn}</p>
                  </div>
                </div>
                <div className="bg-bg rounded-lg p-3 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-muted shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Check-out</p>
                    <p className="text-sm font-medium text-text">{activity.checkOut}</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center justify-between bg-bg rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted" />
                  <span className="text-sm text-muted">Total</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-text">${activity.totalAmount?.toLocaleString?.() ?? activity.totalAmount}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                    activity.paymentStatus === 'paid'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {activity.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>

              {/* Special requests */}
              {activity.specialRequests && (
                <div className="rounded-lg p-3 bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Special request</span>
                  </div>
                  <p className="text-sm text-text">{activity.specialRequests}</p>
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-wrap gap-2">
                {activity.guestEmail && (
                  <a href={`mailto:${activity.guestEmail}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-bg hover:bg-primary hover:text-primary-contrast text-sm text-text transition-colors">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
                {activity.guestPhone && (
                  <a href={`tel:${activity.guestPhone}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-bg hover:bg-primary hover:text-primary-contrast text-sm text-text transition-colors">
                    <Phone className="w-4 h-4" /> {activity.guestPhone}
                  </a>
                )}
              </div>
            </div>

            {/* Footer action */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                Close
              </button>
              <button
                onClick={handleAction}
                disabled={working}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isCheckin ? <UserCheck className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                {working ? 'Saving…' : isCheckin ? 'Confirm check-in' : 'Confirm check-out'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TodayActivity({ checkIns, checkOuts, onCheckIn, onCheckOut }) {
  const [selected, setSelected] = useState(null)

  const activities = [
    ...checkIns.map(r => ({ ...r, type: 'checkin', time: r.arrivalTime })),
    ...checkOuts.map(r => ({ ...r, type: 'checkout', time: '11:00' }))
  ].sort((a, b) => (a.time || '').localeCompare(b.time || '')).slice(0, 8)

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
        <div className="space-y-1 max-h-[320px] overflow-y-auto -mx-2">
          {activities.map((activity) => (
            <button
              key={`${activity.id}-${activity.type}`}
              onClick={() => setSelected(activity)}
              className="w-full flex items-center justify-between gap-2 px-2 py-2.5 rounded-lg hover:bg-bg transition-colors text-left group"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.type === 'checkin' ? 'bg-green-500' : 'bg-orange-500'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-text truncate">{activity.guestName}</p>
                  <p className="text-xs text-muted">Room {activity.roomNumber} · {activity.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  activity.type === 'checkin'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                }`}>
                  {activity.type === 'checkin' ? 'In' : 'Out'}
                </span>
                <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      )}

      <ActivityDetailModal
        activity={selected}
        onClose={() => setSelected(null)}
        onCheckIn={onCheckIn}
        onCheckOut={onCheckOut}
      />
    </motion.div>
  )
}

function RoomStatusOverview({ kpis, onOpenRooms }) {
  const { occupancyRate, totalRooms, occupiedRooms, availableRooms, cleaningRooms, maintenanceRooms } = kpis
  const attention = cleaningRooms + maintenanceRooms

  const statuses = [
    { key: 'occupied', label: 'Occupied', color: 'bg-blue-500', count: occupiedRooms },
    { key: 'available', label: 'Available', color: 'bg-green-500', count: availableRooms },
    { key: 'cleaning', label: 'Cleaning', color: 'bg-purple-500', count: cleaningRooms },
    { key: 'maintenance', label: 'Maintenance', color: 'bg-amber-500', count: maintenanceRooms }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-text">Room Status</h3>
        <button onClick={onOpenRooms} className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
          Manage <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Occupancy headline */}
      <div className="flex items-end gap-3 mb-4">
        <span className="text-3xl sm:text-4xl font-bold text-text leading-none">{occupancyRate}%</span>
        <span className="text-xs text-muted mb-1">occupancy · {occupiedRooms}/{totalRooms} rooms</span>
      </div>

      {/* Segmented bar */}
      <div className="h-3 sm:h-4 rounded-full bg-bg overflow-hidden flex mb-4">
        {statuses.map(status => (
          <div
            key={status.key}
            className={`${status.color} transition-all duration-500`}
            style={{ width: `${totalRooms ? (status.count / totalRooms) * 100 : 0}%` }}
            title={`${status.label}: ${status.count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {statuses.map(status => (
          <div key={status.key} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${status.color}`} />
            <span className="text-xs sm:text-sm text-muted">{status.label}</span>
            <span className="text-xs sm:text-sm font-semibold text-text ml-auto">{status.count}</span>
          </div>
        ))}
      </div>

      {attention > 0 && (
        <button
          onClick={onOpenRooms}
          className="mt-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 hover:underline"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {attention} {attention === 1 ? 'room needs' : 'rooms need'} attention
        </button>
      )}
    </motion.div>
  )
}

function QuickActions({ kpis, onNavigate }) {
  const actions = [
    { icon: Bell, label: 'Pending services', value: kpis.pendingServices, view: 'services', urgent: kpis.pendingServices > 5, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { icon: Sparkles, label: 'Pending housekeeping', value: kpis.pendingHousekeeping, view: 'housekeeping', urgent: kpis.pendingHousekeeping > 5, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Package, label: 'Low stock items', value: kpis.lowStockItems, view: 'inventory', urgent: kpis.lowStockItems > 0, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-text">Quick actions</h3>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Users className="w-3.5 h-3.5" /> {kpis.onDutyStaff} on duty
        </span>
      </div>

      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.view}
            onClick={() => onNavigate(action.view)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-colors group text-left"
          >
            <span className={`p-2 rounded-lg ${action.bg}`}>
              <action.icon className={`w-4 h-4 ${action.color}`} />
            </span>
            <span className="text-sm text-text flex-1">{action.label}</span>
            <span className={`text-sm font-bold ${action.urgent ? action.color : 'text-text'}`}>{action.value}</span>
            <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { getKPIs, updateReservation } = useAdminData()
  const { setView } = useAdmin()
  const kpis = getKPIs()

  const handleCheckIn = (id) => updateReservation(id, { status: 'checked-in' })
  const handleCheckOut = (id) => updateReservation(id, { status: 'checked-out' })

  const kpiCards = [
    { id: 'occupancy', label: 'Current Occupancy', value: `${kpis.occupancyRate}%`, icon: Building2, color: 'bg-blue-500', change: '+5%', trend: 'up' },
    { id: 'available', label: 'Available Rooms', value: kpis.availableRooms.toString(), icon: BedDouble, color: 'bg-green-500' },
    { id: 'reservations', label: 'Active Reservations', value: kpis.activeReservations.toString(), icon: CalendarCheck, color: 'bg-purple-500' },
    { id: 'services', label: 'Pending Services', value: kpis.pendingServices.toString(), icon: Bell, color: kpis.pendingServices > 5 ? 'bg-red-500' : 'bg-orange-500' },
    { id: 'checkins', label: "Today's Check-ins", value: kpis.todayCheckIns.toString(), icon: UserCheck, color: 'bg-teal-500' },
    { id: 'checkouts', label: "Today's Check-outs", value: kpis.todayCheckOuts.toString(), icon: UserMinus, color: 'bg-rose-500' }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpiCards.map((kpi, index) => (
          <KPICard key={kpi.id} {...kpi} index={index} />
        ))}
      </div>

      {/* Commission widget — OTA vs direct (ported from v2) */}
      <CommissionWidget />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <TodayActivity
          checkIns={kpis.todayCheckInsList}
          checkOuts={kpis.todayCheckOutsList}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
        <RoomStatusOverview kpis={kpis} onOpenRooms={() => setView('rooms')} />
        <QuickActions kpis={kpis} onNavigate={setView} />
      </div>
    </div>
  )
}

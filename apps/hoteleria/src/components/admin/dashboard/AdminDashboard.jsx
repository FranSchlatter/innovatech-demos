import { useState, useMemo } from 'react'
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
import { useTranslation } from '../../../i18n/LanguageProvider'
import CommissionWidget from './CommissionWidget'
import CheckInStation from '../../client/checkin/CheckInStation'

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
  const { t } = useTranslation()
  const [working, setWorking] = useState(false)
  const isCheckin = activity?.type === 'checkin'

  const handleAction = async () => {
    // Check-in now opens the full station wizard (documents, room, keys…);
    // check-out stays a one-tap confirm.
    if (isCheckin) {
      onCheckIn(activity)
      onClose()
      return
    }
    setWorking(true)
    try {
      await onCheckOut(activity.id)
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
                    {isCheckin ? t('admin.dashboard.activity.checkin') : t('admin.dashboard.activity.checkout')} · {activity.id}
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
                  <p className="text-xs text-muted">{t('common.labels.room')}</p>
                  <p className="font-semibold text-text">{activity.roomNumber}</p>
                  <p className="text-xs text-muted capitalize">{activity.roomType}</p>
                </div>
                <div className="bg-bg rounded-lg p-3">
                  <p className="text-xs text-muted">{t('common.labels.guests')}</p>
                  <p className="font-semibold text-text">{activity.guests}</p>
                  <p className="text-xs text-muted">{t('admin.dashboard.activity.nights', { count: nightsBetween(activity.checkIn, activity.checkOut) })}</p>
                </div>
                <div className="bg-bg rounded-lg p-3 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-muted shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{t('admin.dashboard.activity.checkin')}</p>
                    <p className="text-sm font-medium text-text">{activity.checkIn}</p>
                  </div>
                </div>
                <div className="bg-bg rounded-lg p-3 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-muted shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{t('admin.dashboard.activity.checkout')}</p>
                    <p className="text-sm font-medium text-text">{activity.checkOut}</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center justify-between bg-bg rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted" />
                  <span className="text-sm text-muted">{t('common.labels.total')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-text">${activity.totalAmount?.toLocaleString?.() ?? activity.totalAmount}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                    activity.paymentStatus === 'paid'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {activity.paymentStatus === 'paid'
                      ? t('admin.shared.paymentStatus.paid')
                      : t('admin.shared.paymentStatus.pending')}
                  </span>
                </div>
              </div>

              {/* Special requests */}
              {activity.specialRequests && (
                <div className="rounded-lg p-3 bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{t('admin.dashboard.activity.specialRequest')}</span>
                  </div>
                  <p className="text-sm text-text">{activity.specialRequests}</p>
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-wrap gap-2">
                {activity.guestEmail && (
                  <a href={`mailto:${activity.guestEmail}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-bg hover:bg-primary hover:text-primary-contrast text-sm text-text transition-colors">
                    <Mail className="w-4 h-4" /> {t('common.labels.email')}
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
                {t('common.actions.close')}
              </button>
              <button
                onClick={handleAction}
                disabled={working}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isCheckin ? <UserCheck className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                {working ? t('common.actions.saving') : isCheckin ? t('admin.dashboard.activity.confirmCheckin') : t('admin.dashboard.activity.confirmCheckout')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TodayActivity({ checkIns, checkOuts, onCheckIn, onCheckOut }) {
  const { t } = useTranslation()
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
        <h3 className="text-base sm:text-lg font-bold text-text">{t('admin.dashboard.activity.title')}</h3>
        <span className="text-xs text-muted">{t('admin.dashboard.activity.events', { count: activities.length })}</span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted">
          <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{t('admin.dashboard.activity.empty')}</p>
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
                  <p className="text-xs text-muted">{t('admin.dashboard.activity.roomAt', { room: activity.roomNumber, time: activity.time })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  activity.type === 'checkin'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                }`}>
                  {activity.type === 'checkin' ? t('admin.dashboard.activity.in') : t('admin.dashboard.activity.out')}
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
  const { t } = useTranslation()
  const { occupancyRate, totalRooms, occupiedRooms, availableRooms, cleaningRooms, maintenanceRooms } = kpis
  const attention = cleaningRooms + maintenanceRooms

  const statuses = [
    { key: 'occupied', label: t('admin.dashboard.roomStatus.occupied'), color: 'bg-blue-500', count: occupiedRooms },
    { key: 'available', label: t('admin.dashboard.roomStatus.available'), color: 'bg-green-500', count: availableRooms },
    { key: 'cleaning', label: t('admin.dashboard.roomStatus.cleaning'), color: 'bg-purple-500', count: cleaningRooms },
    { key: 'maintenance', label: t('admin.dashboard.roomStatus.maintenance'), color: 'bg-amber-500', count: maintenanceRooms }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-text">{t('admin.dashboard.roomStatus.title')}</h3>
        <button onClick={onOpenRooms} className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
          {t('admin.dashboard.roomStatus.manage')} <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Occupancy headline */}
      <div className="flex items-end gap-3 mb-4">
        <span className="text-3xl sm:text-4xl font-bold text-text leading-none">{occupancyRate}%</span>
        <span className="text-xs text-muted mb-1">{t('admin.dashboard.roomStatus.occupancyDetail', { occupied: occupiedRooms, total: totalRooms })}</span>
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
          {attention === 1
            ? t('admin.dashboard.roomStatus.attentionOne', { count: attention })
            : t('admin.dashboard.roomStatus.attentionMany', { count: attention })}
        </button>
      )}
    </motion.div>
  )
}

function QuickActions({ kpis, onNavigate }) {
  const { t } = useTranslation()
  const actions = [
    { icon: Bell, label: t('admin.dashboard.quickActions.pendingServices'), value: kpis.pendingServices, view: 'services', urgent: kpis.pendingServices > 5, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { icon: Sparkles, label: t('admin.dashboard.quickActions.pendingHousekeeping'), value: kpis.pendingHousekeeping, view: 'housekeeping', urgent: kpis.pendingHousekeeping > 5, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Package, label: t('admin.dashboard.quickActions.lowStock'), value: kpis.lowStockItems, view: 'inventory', urgent: kpis.lowStockItems > 0, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-text">{t('admin.dashboard.quickActions.title')}</h3>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Users className="w-3.5 h-3.5" /> {t('admin.dashboard.quickActions.onDuty', { count: kpis.onDutyStaff })}
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
  const { getKPIs, reservations, rooms, reservationsStore } = useAdminData()
  const { setView } = useAdmin()
  const { t } = useTranslation()
  const kpis = getKPIs()
  const [station, setStation] = useState(null)

  const availableRooms = useMemo(
    () => rooms.filter((r) => r.status === 'available').map((r) => ({ id: r.id, number: r.roomNumber, floor: r.floor, type: r.type })),
    [rooms]
  )

  // Check-in opens the shared station wizard; check-out is a quick confirm.
  const handleCheckIn = (activity) => setStation(activity)
  const handleCheckOut = (id) => reservationsStore.checkOut(id, 'admin')

  const stationReservation = station ? reservations.find((r) => r.id === station.id) || station : null
  const handleStationComplete = ({ station: stationData, room, digitalKey, keyCards, mobileKey }) => {
    if (station) reservationsStore.checkIn(station.id, { station: stationData, room, digitalKey, keyCards, mobileKey, by: 'admin' })
  }
  const handleStationSave = (partial) => {
    if (station) reservationsStore.saveStation(station.id, partial, 'admin')
  }

  const kpiCards = [
    { id: 'occupancy', label: t('admin.dashboard.kpis.occupancy'), value: `${kpis.occupancyRate}%`, icon: Building2, color: 'bg-blue-500', change: '+5%', trend: 'up' },
    { id: 'available', label: t('admin.dashboard.kpis.available'), value: kpis.availableRooms.toString(), icon: BedDouble, color: 'bg-green-500' },
    { id: 'reservations', label: t('admin.dashboard.kpis.reservations'), value: kpis.activeReservations.toString(), icon: CalendarCheck, color: 'bg-purple-500' },
    { id: 'services', label: t('admin.dashboard.kpis.services'), value: kpis.pendingServices.toString(), icon: Bell, color: kpis.pendingServices > 5 ? 'bg-red-500' : 'bg-orange-500' },
    { id: 'checkins', label: t('admin.dashboard.kpis.checkins'), value: kpis.todayCheckIns.toString(), icon: UserCheck, color: 'bg-teal-500' },
    { id: 'checkouts', label: t('admin.dashboard.kpis.checkouts'), value: kpis.todayCheckOuts.toString(), icon: UserMinus, color: 'bg-rose-500' }
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

      {/* Shared check-in station (opened from Today's Activity) */}
      <CheckInStation
        open={!!station}
        onClose={() => setStation(null)}
        reservation={stationReservation}
        mode="reception"
        availableRooms={availableRooms}
        onComplete={handleStationComplete}
        onSaveProgress={handleStationSave}
      />
    </div>
  )
}

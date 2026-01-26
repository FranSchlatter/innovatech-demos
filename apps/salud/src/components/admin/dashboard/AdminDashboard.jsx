import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  Stethoscope,
  Package,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  TrendingUp,
  Activity
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

function KPICard({ icon: Icon, label, value, subValue, color, trend }) {
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
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-1 ${
            trend > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-text">{value}</p>
        <p className="text-sm text-muted">{label}</p>
        {subValue && (
          <p className="text-xs text-muted mt-1">{subValue}</p>
        )}
      </div>
    </motion.div>
  )
}

function TodaySchedule({ appointments }) {
  const today = new Date().toISOString().split('T')[0]
  const todayAppts = useMemo(() => {
    return appointments
      .filter(a => a.date === today)
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 6)
  }, [appointments, today])

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
            <Calendar className="w-5 h-5 text-primary" />
            Today's Schedule
          </h3>
          <span className="text-xs text-muted">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
        {todayAppts.length === 0 ? (
          <div className="p-6 text-center text-muted">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No appointments scheduled for today</p>
          </div>
        ) : (
          todayAppts.map((apt) => (
            <div key={apt.id} className="p-3 hover:bg-bg transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-text">{apt.time}</span>
                <StatusBadge status={apt.status} size="xs" />
              </div>
              <p className="text-sm text-text font-medium">{apt.patientName}</p>
              <p className="text-xs text-muted">{apt.doctorName} • {apt.specialty}</p>
            </div>
          ))
        )}
      </div>

      {todayAppts.length > 0 && (
        <div className="p-3 bg-bg border-t border-border">
          <p className="text-xs text-center text-muted">
            Showing {todayAppts.length} of {appointments.filter(a => a.date === today).length} appointments
          </p>
        </div>
      )}
    </motion.div>
  )
}

function DoctorAvailability({ doctors }) {
  const sortedDoctors = useMemo(() => {
    return [...doctors]
      .sort((a, b) => {
        const statusOrder = { 'on-duty': 0, 'busy': 1, 'break': 2, 'off-duty': 3 }
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99)
      })
      .slice(0, 6)
  }, [doctors])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-surface rounded-xl border border-border overflow-hidden"
    >
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-text flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          Doctor Availability
        </h3>
      </div>

      <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
        {sortedDoctors.map((doctor) => (
          <div key={doctor.id} className="p-3 flex items-center gap-3 hover:bg-bg transition-colors">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{doctor.name}</p>
              <p className="text-xs text-muted">{doctor.specialty}</p>
            </div>
            <div className="text-right">
              <StatusBadge status={doctor.status} size="xs" />
              <p className="text-xs text-muted mt-1">{doctor.todayAppointments} appts</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function QuickStats({ kpis, inventory }) {
  const lowStockItems = useMemo(() => {
    return inventory
      .filter(item => item.currentStock <= item.minStock)
      .slice(0, 4)
  }, [inventory])

  const expiringItems = useMemo(() => {
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + 90)
    return inventory
      .filter(item => {
        if (!item.expirationDate) return false
        return new Date(item.expirationDate) <= thresholdDate
      })
      .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))
      .slice(0, 4)
  }, [inventory])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-surface rounded-xl border border-border overflow-hidden"
    >
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-text flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Alerts & Quick Stats
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Low Stock ({kpis.lowStockAlerts} items)
              </span>
            </div>
            <div className="space-y-1">
              {lowStockItems.map(item => (
                <p key={item.id} className="text-xs text-muted">
                  • {item.name}: {item.currentStock}/{item.minStock} {item.unit}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Expiring Items */}
        {expiringItems.length > 0 && (
          <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Expiring Soon ({kpis.expiringItems} items)
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
                All systems operational
              </span>
            </div>
            <p className="text-xs text-muted mt-1">
              No critical alerts at this time
            </p>
          </div>
        )}

        {/* Patient Stats */}
        <div className="bg-bg rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text">Patient Overview</span>
            <Users className="w-4 h-4 text-muted" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-lg font-bold text-text">{kpis.totalPatients}</p>
              <p className="text-xs text-muted">Total Patients</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{kpis.newPatients}</p>
              <p className="text-xs text-muted">New This Week</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { appointments, doctors, inventory, loading, getKPIs } = useAdminData()

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
          icon={Calendar}
          label="Today's Appointments"
          value={kpis.todayAppointments}
          color="bg-blue-500"
        />
        <KPICard
          icon={Clock}
          label="Pending Confirmation"
          value={kpis.pendingConfirmations}
          color="bg-amber-500"
        />
        <KPICard
          icon={Stethoscope}
          label="Doctors Available"
          value={kpis.availableDoctors}
          subValue={`of ${doctors.length} total`}
          color="bg-green-500"
        />
        <KPICard
          icon={Users}
          label="In Queue"
          value={kpis.patientsInQueue}
          color="bg-purple-500"
        />
        <KPICard
          icon={Package}
          label="Low Stock Alerts"
          value={kpis.lowStockAlerts}
          color={kpis.lowStockAlerts > 0 ? 'bg-red-500' : 'bg-teal-500'}
        />
        <KPICard
          icon={CheckCircle2}
          label="Completed Today"
          value={kpis.completedToday}
          color="bg-emerald-500"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <TodaySchedule appointments={appointments} />

        {/* Doctor Availability */}
        <DoctorAvailability doctors={doctors} />

        {/* Quick Stats & Alerts */}
        <QuickStats kpis={kpis} inventory={inventory} />
      </div>
    </div>
  )
}

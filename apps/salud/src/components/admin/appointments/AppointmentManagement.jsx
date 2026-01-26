import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Search,
  Filter,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Play,
  AlertCircle,
  ChevronDown
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no-show', label: 'No Show' }
]

const dateFilters = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'week', label: 'This Week' },
  { value: 'past', label: 'Past' }
]

function StatsBar({ appointments }) {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayAppts = appointments.filter(a => a.date === today)

    return {
      total: todayAppts.length,
      scheduled: todayAppts.filter(a => a.status === 'scheduled').length,
      confirmed: todayAppts.filter(a => a.status === 'confirmed').length,
      inProgress: todayAppts.filter(a => a.status === 'in-progress').length,
      completed: todayAppts.filter(a => a.status === 'completed').length,
      cancelled: todayAppts.filter(a => a.status === 'cancelled' || a.status === 'no-show').length
    }
  }, [appointments])

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-4 bg-surface rounded-xl border border-border">
      <div className="text-center p-2">
        <p className="text-2xl font-bold text-text">{stats.total}</p>
        <p className="text-xs text-muted">Today</p>
      </div>
      <div className="text-center p-2">
        <p className="text-2xl font-bold text-blue-500">{stats.scheduled}</p>
        <p className="text-xs text-muted">Scheduled</p>
      </div>
      <div className="text-center p-2">
        <p className="text-2xl font-bold text-green-500">{stats.confirmed}</p>
        <p className="text-xs text-muted">Confirmed</p>
      </div>
      <div className="text-center p-2">
        <p className="text-2xl font-bold text-purple-500">{stats.inProgress}</p>
        <p className="text-xs text-muted">In Progress</p>
      </div>
      <div className="text-center p-2">
        <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
        <p className="text-xs text-muted">Completed</p>
      </div>
      <div className="text-center p-2">
        <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
        <p className="text-xs text-muted">Cancelled</p>
      </div>
    </div>
  )
}

function AppointmentCard({ appointment, onConfirm, onCheckIn, onComplete, onCancel }) {
  const [expanded, setExpanded] = useState(false)

  const canConfirm = appointment.status === 'scheduled'
  const canCheckIn = appointment.status === 'confirmed'
  const canComplete = appointment.status === 'in-progress'
  const canCancel = appointment.status === 'scheduled' || appointment.status === 'confirmed'

  const isToday = appointment.date === new Date().toISOString().split('T')[0]
  const isPast = new Date(appointment.date) < new Date(new Date().toISOString().split('T')[0])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-surface rounded-xl border overflow-hidden transition-all ${
        isToday && appointment.status !== 'completed' && appointment.status !== 'cancelled'
          ? 'border-primary/50'
          : 'border-border'
      }`}
    >
      {/* Main Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center
              ${isPast ? 'opacity-60' : ''}`}
            >
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text">{appointment.patientName}</h3>
              <p className="text-xs text-muted">
                {appointment.isFirstVisit && (
                  <span className="text-blue-500 font-medium mr-2">New Patient</span>
                )}
                {appointment.id}
              </p>
            </div>
          </div>
          <StatusBadge status={appointment.status} size="sm" pulse={appointment.status === 'in-progress'} />
        </div>

        {/* Appointment Info */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted" />
            <span className={`${isToday ? 'text-primary font-medium' : 'text-text'}`}>
              {isToday ? 'Today' : new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted" />
            <span className="text-text">{appointment.time} ({appointment.duration}min)</span>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-2">
            <Stethoscope className="w-4 h-4 text-muted" />
            <span className="text-text truncate">{appointment.doctorName}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-bg rounded-lg p-2 mb-3">
          <p className="text-xs text-muted mb-1">Reason for visit</p>
          <p className="text-sm text-text">{appointment.reasonForVisit}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {canConfirm && (
            <button
              onClick={() => onConfirm(appointment.id)}
              className="flex-1 min-w-[100px] px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg
                hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Confirm
            </button>
          )}
          {canCheckIn && (
            <button
              onClick={() => onCheckIn(appointment.id)}
              className="flex-1 min-w-[100px] px-3 py-2 bg-primary text-primary-contrast text-xs font-medium rounded-lg
                hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
            >
              <Play className="w-3 h-3" />
              Check In
            </button>
          )}
          {canComplete && (
            <button
              onClick={() => onComplete(appointment.id)}
              className="flex-1 min-w-[100px] px-3 py-2 bg-emerald-500 text-white text-xs font-medium rounded-lg
                hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Complete
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="px-3 py-2 bg-red-500/10 text-red-500 text-xs font-medium rounded-lg
                hover:bg-red-500/20 transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" />
              Cancel
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 bg-bg border border-border text-text text-xs font-medium rounded-lg
              hover:bg-surface transition-colors flex items-center gap-1"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            Details
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 bg-bg space-y-3">
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted" />
                  <a href={`tel:${appointment.patientPhone}`} className="text-primary hover:underline">
                    {appointment.patientPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted" />
                  <a href={`mailto:${appointment.patientEmail}`} className="text-primary hover:underline truncate">
                    {appointment.patientEmail}
                  </a>
                </div>
              </div>

              {/* Location & Insurance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted" />
                  <span className="text-text truncate">{appointment.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-muted" />
                  <span className="text-text">{appointment.insurance}</span>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-xs text-muted mb-1">Notes</p>
                  <p className="text-sm text-text">{appointment.notes}</p>
                </div>
              )}

              {/* Check-in Time */}
              {appointment.checkInTime && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Checked in at {appointment.checkInTime}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AppointmentManagement() {
  const {
    appointments,
    doctors,
    loading,
    updateAppointment,
    checkInPatient,
    completeAppointment,
    cancelAppointment
  } = useAdminData()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')
  const [doctorFilter, setDoctorFilter] = useState('all')

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)

    return appointments.filter(apt => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          apt.patientName.toLowerCase().includes(query) ||
          apt.doctorName.toLowerCase().includes(query) ||
          apt.id.toLowerCase().includes(query) ||
          apt.patientEmail.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false

      // Doctor filter
      if (doctorFilter !== 'all' && apt.doctorId !== parseInt(doctorFilter)) return false

      // Date filter
      if (dateFilter !== 'all') {
        const aptDate = new Date(apt.date)
        if (dateFilter === 'today' && apt.date !== todayStr) return false
        if (dateFilter === 'tomorrow' && apt.date !== tomorrowStr) return false
        if (dateFilter === 'week' && (aptDate < today || aptDate > weekEnd)) return false
        if (dateFilter === 'past' && apt.date >= todayStr) return false
      }

      return true
    }).sort((a, b) => {
      // Sort by date, then by time
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
  }, [appointments, searchQuery, statusFilter, dateFilter, doctorFilter])

  const handleConfirm = async (id) => {
    await updateAppointment(id, { status: 'confirmed' })
  }

  const handleCheckIn = async (id) => {
    await checkInPatient(id)
  }

  const handleComplete = async (id) => {
    await completeAppointment(id)
  }

  const handleCancel = async (id) => {
    await cancelAppointment(id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text">Appointments</h2>
        <p className="text-sm text-muted">{filteredAppointments.length} appointments</p>
      </div>

      {/* Stats Bar */}
      <StatsBar appointments={appointments} />

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search patients, doctors, IDs..."
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
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {dateFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {statusFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirm={handleConfirm}
              onCheckIn={handleCheckIn}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No appointments found</h3>
          <p className="text-sm text-muted">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}
    </div>
  )
}

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  User,
  MapPin,
  X,
  Check,
  AlertCircle,
  Stethoscope,
  CalendarOff,
  CalendarCheck,
  Users
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

// Time slots for the day (8 AM to 6 PM)
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30'
]

// Days of the week
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getWeekDates(date) {
  const week = []
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  start.setDate(diff)

  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    week.push(d)
  }
  return week
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function WeekNavigation({ currentDate, onPrevWeek, onNextWeek, onToday }) {
  const weekDates = getWeekDates(currentDate)
  const startDate = weekDates[0]
  const endDate = weekDates[6]

  const formatRange = () => {
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' })
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' })
    const year = endDate.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${year}`
    }
    return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${year}`
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToday}
        className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
      >
        Today
      </button>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevWeek}
          className="p-1.5 rounded-lg hover:bg-bg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted" />
        </button>
        <button
          onClick={onNextWeek}
          className="p-1.5 rounded-lg hover:bg-bg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted" />
        </button>
      </div>
      <span className="text-sm font-medium text-text min-w-[180px]">{formatRange()}</span>
    </div>
  )
}

function DoctorFilter({ doctors, selectedDoctor, onSelectDoctor, selectedLocation, onSelectLocation }) {
  const locations = useMemo(() => {
    const locs = [...new Set(doctors.map(d => d.location))]
    return locs.sort()
  }, [doctors])

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={selectedDoctor}
        onChange={(e) => onSelectDoctor(e.target.value)}
        className="px-3 py-1.5 text-sm bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">All Doctors</option>
        {doctors.map(doc => (
          <option key={doc.id} value={doc.id}>{doc.name}</option>
        ))}
      </select>

      <select
        value={selectedLocation}
        onChange={(e) => onSelectLocation(e.target.value)}
        className="px-3 py-1.5 text-sm bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">All Locations</option>
        {locations.map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
    </div>
  )
}

function TimeSlotCell({ time, appointments, doctor, date, onBlockTime, isBlocked }) {
  const dateStr = formatDate(date)
  const slotAppointments = appointments.filter(
    apt => apt.date === dateStr &&
           apt.time === time &&
           apt.doctorId === doctor.id
  )

  const hasAppointment = slotAppointments.length > 0
  const appointment = slotAppointments[0]
  const isAvailable = doctor.availability?.includes(time)
  const isBreakTime = time >= '12:00' && time < '13:00'
  const isPast = new Date(dateStr + 'T' + time) < new Date()

  if (isBlocked) {
    return (
      <div className="h-10 bg-red-500/10 border border-red-500/20 rounded flex items-center justify-center">
        <CalendarOff className="w-3 h-3 text-red-500" />
      </div>
    )
  }

  if (isBreakTime) {
    return (
      <div className="h-10 bg-amber-500/10 border border-amber-500/20 rounded flex items-center justify-center">
        <span className="text-[10px] text-amber-600 dark:text-amber-400">Break</span>
      </div>
    )
  }

  if (!isAvailable) {
    return (
      <div className="h-10 bg-bg border border-border/50 rounded" />
    )
  }

  if (hasAppointment) {
    const statusColors = {
      'scheduled': 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400',
      'confirmed': 'bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-400',
      'in-progress': 'bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400',
      'completed': 'bg-teal-500/20 border-teal-500/30 text-teal-600 dark:text-teal-400',
      'cancelled': 'bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400',
      'no-show': 'bg-gray-500/20 border-gray-500/30 text-gray-600 dark:text-gray-400'
    }

    return (
      <div
        className={`h-10 rounded border flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${statusColors[appointment.status] || statusColors.scheduled}`}
        title={`${appointment.patientName} - ${appointment.status}`}
      >
        <User className="w-3 h-3" />
      </div>
    )
  }

  return (
    <button
      onClick={() => onBlockTime(doctor.id, dateStr, time)}
      disabled={isPast}
      className={`h-10 rounded border border-dashed border-primary/30 hover:bg-primary/10 transition-colors ${isPast ? 'opacity-30 cursor-not-allowed' : ''}`}
      title="Available - Click to block"
    >
      <Check className="w-3 h-3 text-primary mx-auto opacity-0 group-hover:opacity-100" />
    </button>
  )
}

function DoctorRow({ doctor, weekDates, appointments, blockedSlots, onBlockTime }) {
  return (
    <div className="border-b border-border last:border-0">
      {/* Doctor Info - Fixed Left */}
      <div className="flex">
        <div className="w-48 flex-shrink-0 p-3 border-r border-border bg-surface sticky left-0 z-10">
          <div className="flex items-center gap-2">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text truncate">{doctor.name}</p>
              <p className="text-xs text-muted truncate">{doctor.specialty}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <StatusBadge status={doctor.status} size="xs" />
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="grid grid-cols-7 min-w-[700px]">
            {weekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="p-2 border-r border-border last:border-0 space-y-1">
                {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((time, slotIndex) => {
                  const dateStr = formatDate(date)
                  const isBlocked = blockedSlots.some(
                    b => b.doctorId === doctor.id && b.date === dateStr && b.time === time
                  )
                  return (
                    <TimeSlotCell
                      key={slotIndex}
                      time={time}
                      appointments={appointments}
                      doctor={doctor}
                      date={date}
                      onBlockTime={onBlockTime}
                      isBlocked={isBlocked}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BlockTimeModal({ isOpen, onClose, doctor, date, time, onConfirm }) {
  const [reason, setReason] = useState('')

  if (!isOpen) return null

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
            <h3 className="font-semibold text-text">Block Time Slot</h3>
            <button onClick={onClose} className="p-1 hover:bg-bg rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-bg rounded-lg p-3">
              <div className="flex items-center gap-3">
                <img
                  src={doctor?.image}
                  alt={doctor?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-text">{doctor?.name}</p>
                  <p className="text-sm text-muted">{doctor?.specialty}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {time}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Meeting, Personal, Training..."
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={2}
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
              onClick={() => onConfirm(reason)}
              className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Block Time
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ScheduleStats({ doctors, appointments, weekDates }) {
  const stats = useMemo(() => {
    const weekStart = formatDate(weekDates[0])
    const weekEnd = formatDate(weekDates[6])

    const weekAppointments = appointments.filter(
      apt => apt.date >= weekStart && apt.date <= weekEnd
    )

    const totalSlots = doctors.length * 7 * 10 // 10 slots per day per doctor
    const bookedSlots = weekAppointments.length
    const availableDoctors = doctors.filter(d => d.status === 'on-duty' || d.status === 'busy').length

    return {
      totalAppointments: weekAppointments.length,
      confirmedAppointments: weekAppointments.filter(a => a.status === 'confirmed').length,
      pendingAppointments: weekAppointments.filter(a => a.status === 'scheduled').length,
      utilization: Math.round((bookedSlots / totalSlots) * 100),
      availableDoctors
    }
  }, [doctors, appointments, weekDates])

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div className="bg-surface rounded-lg border border-border p-3">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-muted">Week Total</span>
        </div>
        <p className="text-xl font-bold text-text">{stats.totalAppointments}</p>
      </div>

      <div className="bg-surface rounded-lg border border-border p-3">
        <div className="flex items-center gap-2 mb-1">
          <CalendarCheck className="w-4 h-4 text-green-500" />
          <span className="text-xs text-muted">Confirmed</span>
        </div>
        <p className="text-xl font-bold text-text">{stats.confirmedAppointments}</p>
      </div>

      <div className="bg-surface rounded-lg border border-border p-3">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-muted">Pending</span>
        </div>
        <p className="text-xl font-bold text-text">{stats.pendingAppointments}</p>
      </div>

      <div className="bg-surface rounded-lg border border-border p-3">
        <div className="flex items-center gap-2 mb-1">
          <Stethoscope className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted">Active Doctors</span>
        </div>
        <p className="text-xl font-bold text-text">{stats.availableDoctors}</p>
      </div>

      <div className="bg-surface rounded-lg border border-border p-3">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-muted">Utilization</span>
        </div>
        <p className="text-xl font-bold text-text">{stats.utilization}%</p>
      </div>
    </div>
  )
}

function ScheduleLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded border border-dashed border-primary/30 bg-white dark:bg-surface" />
        <span>Available</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/30" />
        <span>Scheduled</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30" />
        <span>Confirmed</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-purple-500/20 border border-purple-500/30" />
        <span>In Progress</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/20" />
        <span>Break</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-red-500/10 border border-red-500/20" />
        <span>Blocked</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-bg border border-border/50" />
        <span>Unavailable</span>
      </div>
    </div>
  )
}

export default function ScheduleManagement() {
  const { appointments, doctors, loading } = useAdminData()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [blockedSlots, setBlockedSlots] = useState([])
  const [blockModal, setBlockModal] = useState({
    isOpen: false,
    doctor: null,
    date: null,
    time: null
  })

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])

  const filteredDoctors = useMemo(() => {
    let result = doctors

    if (selectedDoctor !== 'all') {
      result = result.filter(d => d.id === parseInt(selectedDoctor))
    }

    if (selectedLocation !== 'all') {
      result = result.filter(d => d.location === selectedLocation)
    }

    return result
  }, [doctors, selectedDoctor, selectedLocation])

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleBlockTime = (doctorId, date, time) => {
    const doctor = doctors.find(d => d.id === doctorId)
    setBlockModal({
      isOpen: true,
      doctor,
      date,
      time
    })
  }

  const handleConfirmBlock = (reason) => {
    setBlockedSlots(prev => [
      ...prev,
      {
        doctorId: blockModal.doctor.id,
        date: blockModal.date,
        time: blockModal.time,
        reason
      }
    ])
    setBlockModal({ isOpen: false, doctor: null, date: null, time: null })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <ScheduleStats
        doctors={doctors}
        appointments={appointments}
        weekDates={weekDates}
      />

      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl border border-border p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <WeekNavigation
            currentDate={currentDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
          />

          <DoctorFilter
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={setSelectedDoctor}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <ScheduleLegend />
        </div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-border overflow-hidden"
      >
        {/* Week Header */}
        <div className="flex border-b border-border bg-bg">
          <div className="w-48 flex-shrink-0 p-3 border-r border-border">
            <span className="text-sm font-medium text-muted">Doctor</span>
          </div>
          <div className="flex-1 grid grid-cols-7 min-w-[700px]">
            {weekDates.map((date, index) => {
              const isToday = formatDate(date) === formatDate(new Date())
              return (
                <div
                  key={index}
                  className={`p-3 text-center border-r border-border last:border-0 ${isToday ? 'bg-primary/5' : ''}`}
                >
                  <p className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted'}`}>
                    {DAYS[index]}
                  </p>
                  <p className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-text'}`}>
                    {date.getDate()}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Time Labels Row */}
        <div className="flex border-b border-border bg-bg/50">
          <div className="w-48 flex-shrink-0 p-2 border-r border-border">
            <span className="text-xs text-muted">Time slots</span>
          </div>
          <div className="flex-1 grid grid-cols-7 min-w-[700px]">
            {weekDates.map((_, dayIndex) => (
              <div key={dayIndex} className="p-1 border-r border-border last:border-0">
                <div className="grid grid-cols-5 gap-0.5">
                  {['8', '10', '12', '14', '16'].map((hour) => (
                    <span key={hour} className="text-[9px] text-muted text-center">{hour}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Rows */}
        <div className="max-h-[600px] overflow-y-auto">
          {filteredDoctors.length === 0 ? (
            <div className="p-8 text-center">
              <Stethoscope className="w-12 h-12 mx-auto mb-3 text-muted opacity-50" />
              <p className="text-muted">No doctors match your filters</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <DoctorRow
                key={doctor.id}
                doctor={doctor}
                weekDates={weekDates}
                appointments={appointments}
                blockedSlots={blockedSlots}
                onBlockTime={handleBlockTime}
              />
            ))
          )}
        </div>
      </motion.div>

      {/* Block Time Modal */}
      <BlockTimeModal
        isOpen={blockModal.isOpen}
        onClose={() => setBlockModal({ isOpen: false, doctor: null, date: null, time: null })}
        doctor={blockModal.doctor}
        date={blockModal.date}
        time={blockModal.time}
        onConfirm={handleConfirmBlock}
      />
    </div>
  )
}

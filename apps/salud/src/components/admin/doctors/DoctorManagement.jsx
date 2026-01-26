import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stethoscope,
  Search,
  Star,
  MapPin,
  Clock,
  Calendar,
  Users,
  Phone,
  Mail,
  Globe,
  Shield,
  X
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const statusOptions = [
  { value: 'on-duty', label: 'On Duty', color: 'bg-green-500' },
  { value: 'busy', label: 'Busy', color: 'bg-purple-500' },
  { value: 'break', label: 'On Break', color: 'bg-amber-500' },
  { value: 'off-duty', label: 'Off Duty', color: 'bg-gray-500' }
]

function DoctorStatusModal({ doctor, onClose, onSave }) {
  const [selectedStatus, setSelectedStatus] = useState(doctor.status)

  const handleSave = () => {
    onSave(doctor.id, selectedStatus)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl border border-border w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-text">{doctor.name}</h3>
              <p className="text-sm text-muted">{doctor.specialty}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg transition-colors text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Options */}
        <div className="p-4 space-y-3">
          <p className="text-sm font-medium text-text mb-3">Update Status</p>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedStatus === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-bg'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${option.color}`} />
              <span className="text-text font-medium">{option.label}</span>
              {selectedStatus === option.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg text-text
              font-medium hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary text-primary-contrast rounded-lg font-medium
              hover:opacity-90 transition-opacity"
          >
            Update Status
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function DoctorCard({ doctor, appointments, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false)

  // Get today's appointments for this doctor
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = useMemo(() => {
    return appointments.filter(a => a.doctorId === doctor.id && a.date === today)
  }, [appointments, doctor.id, today])

  const completedToday = todayAppointments.filter(a => a.status === 'completed').length
  const pendingToday = todayAppointments.filter(a =>
    a.status === 'scheduled' || a.status === 'confirmed' || a.status === 'in-progress'
  ).length

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Header with Image */}
        <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="absolute bottom-0 left-4 w-20 h-20 rounded-xl object-cover border-4 border-surface translate-y-10"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={doctor.status} size="sm" pulse={doctor.status === 'on-duty'} />
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-4 pb-4">
          {/* Name & Specialty */}
          <div className="mb-3">
            <h3 className="font-semibold text-text text-lg">{doctor.name}</h3>
            <p className="text-sm text-primary">{doctor.specialty}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-text">{doctor.rating}</span>
            </div>
            <span className="text-xs text-muted">({doctor.reviews} reviews)</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-bg rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-text">{todayAppointments.length}</p>
              <p className="text-xs text-muted">Today's Appts</p>
            </div>
            <div className="bg-bg rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-green-500">{completedToday}</p>
              <p className="text-xs text-muted">Completed</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted mb-3">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{doctor.location}</span>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-2 text-sm text-muted mb-3">
            <Globe className="w-4 h-4" />
            <span className="truncate">{doctor.languages?.join(', ') || 'English'}</span>
          </div>

          {/* Insurance */}
          <div className="flex items-center gap-2 text-sm text-muted mb-4">
            <Shield className="w-4 h-4" />
            <span className="truncate">{doctor.insurance?.slice(0, 3).join(', ')}{doctor.insurance?.length > 3 ? '...' : ''}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 px-3 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg
                hover:opacity-90 transition-opacity"
            >
              Update Status
            </button>
            <button
              className="px-3 py-2 bg-bg border border-border text-text text-sm font-medium rounded-lg
                hover:bg-surface transition-colors"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Status Modal */}
      <AnimatePresence>
        {showModal && (
          <DoctorStatusModal
            doctor={doctor}
            onClose={() => setShowModal(false)}
            onSave={onUpdateStatus}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function StatsOverview({ doctors, appointments }) {
  const stats = useMemo(() => {
    return {
      total: doctors.length,
      onDuty: doctors.filter(d => d.status === 'on-duty').length,
      busy: doctors.filter(d => d.status === 'busy').length,
      onBreak: doctors.filter(d => d.status === 'break').length,
      offDuty: doctors.filter(d => d.status === 'off-duty').length
    }
  }, [doctors])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="bg-surface rounded-xl border border-border p-4 text-center">
        <Stethoscope className="w-6 h-6 mx-auto mb-2 text-primary" />
        <p className="text-2xl font-bold text-text">{stats.total}</p>
        <p className="text-xs text-muted">Total Doctors</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4 text-center">
        <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <p className="text-2xl font-bold text-green-500">{stats.onDuty}</p>
        <p className="text-xs text-muted">On Duty</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4 text-center">
        <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
        </div>
        <p className="text-2xl font-bold text-purple-500">{stats.busy}</p>
        <p className="text-xs text-muted">Busy</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4 text-center">
        <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-amber-500/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
        </div>
        <p className="text-2xl font-bold text-amber-500">{stats.onBreak}</p>
        <p className="text-xs text-muted">On Break</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4 text-center">
        <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-gray-500/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
        </div>
        <p className="text-2xl font-bold text-gray-500">{stats.offDuty}</p>
        <p className="text-xs text-muted">Off Duty</p>
      </div>
    </div>
  )
}

export default function DoctorManagement() {
  const { doctors, appointments, loading, updateDoctorStatus } = useAdminData()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')

  // Get unique specialties
  const specialties = useMemo(() => {
    return [...new Set(doctors.map(d => d.specialty))].sort()
  }, [doctors])

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query) ||
          doctor.location?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && doctor.status !== statusFilter) return false

      // Specialty filter
      if (specialtyFilter !== 'all' && doctor.specialty !== specialtyFilter) return false

      return true
    }).sort((a, b) => {
      // Sort by status (on-duty first), then by name
      const statusOrder = { 'on-duty': 0, 'busy': 1, 'break': 2, 'off-duty': 3 }
      const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99)
      if (statusDiff !== 0) return statusDiff
      return a.name.localeCompare(b.name)
    })
  }, [doctors, searchQuery, statusFilter, specialtyFilter])

  const handleUpdateStatus = async (doctorId, status) => {
    await updateDoctorStatus(doctorId, status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text">Doctors</h2>
        <p className="text-sm text-muted">{filteredDoctors.length} doctors</p>
      </div>

      {/* Stats Overview */}
      <StatsOverview doctors={doctors} appointments={appointments} />

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search doctors, specialties..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              appointments={appointments}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Stethoscope className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No doctors found</h3>
          <p className="text-sm text-muted">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}
    </div>
  )
}

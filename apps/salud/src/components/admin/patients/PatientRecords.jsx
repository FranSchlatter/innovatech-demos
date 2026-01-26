import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Pill,
  AlertTriangle,
  FileText,
  X,
  ChevronDown,
  Shield,
  Clock
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

function PatientDetailModal({ patient, appointments, onClose }) {
  const patientAppointments = useMemo(() => {
    return appointments
      .filter(a => a.patientId === patient.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [appointments, patient.id])

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
        className="bg-surface rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text">{patient.firstName} {patient.lastName}</h3>
              <p className="text-sm text-muted">{patient.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={patient.status} size="sm" />
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg transition-colors text-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Personal Info */}
          <div className="bg-bg rounded-lg p-4">
            <h4 className="font-medium text-text mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted">Date of Birth</p>
                <p className="text-text">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted">Gender</p>
                <p className="text-text capitalize">{patient.gender}</p>
              </div>
              <div>
                <p className="text-muted">Blood Type</p>
                <p className="text-text font-medium text-red-500">{patient.bloodType}</p>
              </div>
              <div>
                <p className="text-muted">Registered</p>
                <p className="text-text">{new Date(patient.registrationDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-bg rounded-lg p-4">
            <h4 className="font-medium text-text mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Contact Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted" />
                <a href={`tel:${patient.phone}`} className="text-primary hover:underline">{patient.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted" />
                <a href={`mailto:${patient.email}`} className="text-primary hover:underline">{patient.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted" />
                <span className="text-text">{patient.address}</span>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allergies */}
            <div className="bg-bg rounded-lg p-4">
              <h4 className="font-medium text-text mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Allergies
              </h4>
              {patient.allergies?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, i) => (
                    <span key={i} className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No known allergies</p>
              )}
            </div>

            {/* Conditions */}
            <div className="bg-bg rounded-lg p-4">
              <h4 className="font-medium text-text mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                Conditions
              </h4>
              {patient.conditions?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.conditions.map((condition, i) => (
                    <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {condition}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No conditions recorded</p>
              )}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-bg rounded-lg p-4">
            <h4 className="font-medium text-text mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-purple-500" />
              Current Medications
            </h4>
            {patient.medications?.length > 0 ? (
              <div className="space-y-2">
                {patient.medications.map((med, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-text">{med}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No current medications</p>
            )}
          </div>

          {/* Insurance */}
          <div className="bg-bg rounded-lg p-4">
            <h4 className="font-medium text-text mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              Insurance
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted">Provider</p>
                <p className="text-text">{patient.insurance}</p>
              </div>
              <div>
                <p className="text-muted">Policy Number</p>
                <p className="text-text font-mono">{patient.insuranceNumber}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-bg rounded-lg p-4">
            <h4 className="font-medium text-text mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Emergency Contact
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted">Name</p>
                <p className="text-text">{patient.emergencyContact?.name}</p>
              </div>
              <div>
                <p className="text-muted">Relation</p>
                <p className="text-text capitalize">{patient.emergencyContact?.relation}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted">Phone</p>
                <a href={`tel:${patient.emergencyContact?.phone}`} className="text-primary hover:underline">
                  {patient.emergencyContact?.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Visit History */}
          <div className="bg-bg rounded-lg p-4">
            <h4 className="font-medium text-text mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Appointments
            </h4>
            {patientAppointments.length > 0 ? (
              <div className="space-y-2">
                {patientAppointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between text-sm p-2 bg-surface rounded-lg">
                    <div>
                      <p className="text-text">{apt.reasonForVisit}</p>
                      <p className="text-xs text-muted">{apt.doctorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-text">{new Date(apt.date).toLocaleDateString()}</p>
                      <StatusBadge status={apt.status} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No appointment history</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text
              font-medium hover:bg-surface transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function PatientCard({ patient, appointments, onViewDetails }) {
  const age = useMemo(() => {
    const today = new Date()
    const birth = new Date(patient.dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }, [patient.dateOfBirth])

  const appointmentCount = useMemo(() => {
    return appointments.filter(a => a.patientId === patient.id).length
  }, [appointments, patient.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl border border-border p-4 hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text">{patient.firstName} {patient.lastName}</h3>
            <p className="text-xs text-muted">{patient.id}</p>
          </div>
        </div>
        <StatusBadge status={patient.status} size="xs" />
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="flex items-center gap-2 text-muted">
          <Calendar className="w-3 h-3" />
          <span>{age} years old</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Heart className="w-3 h-3 text-red-500" />
          <span>{patient.bloodType}</span>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-1 mb-3 text-sm">
        <div className="flex items-center gap-2 text-muted">
          <Phone className="w-3 h-3" />
          <span className="truncate">{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Mail className="w-3 h-3" />
          <span className="truncate">{patient.email}</span>
        </div>
      </div>

      {/* Allergies */}
      {patient.allergies?.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 text-xs text-red-500 mb-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Allergies:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {patient.allergies.slice(0, 2).map((allergy, i) => (
              <span key={i} className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded-full">
                {allergy}
              </span>
            ))}
            {patient.allergies.length > 2 && (
              <span className="text-xs text-muted">+{patient.allergies.length - 2}</span>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-muted mb-3 pt-2 border-t border-border">
        <span>{appointmentCount} appointments</span>
        <span>Last: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}</span>
      </div>

      {/* Action */}
      <button
        onClick={() => onViewDetails(patient)}
        className="w-full px-3 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg
          hover:opacity-90 transition-opacity"
      >
        View Details
      </button>
    </motion.div>
  )
}

export default function PatientRecords() {
  const { patients, appointments, loading } = useAdminData()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState(null)

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          patient.firstName.toLowerCase().includes(query) ||
          patient.lastName.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query) ||
          patient.phone.includes(query) ||
          patient.id.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && patient.status !== statusFilter) return false

      return true
    }).sort((a, b) => {
      // Sort new patients first, then by name
      if (a.status === 'new-patient' && b.status !== 'new-patient') return -1
      if (b.status === 'new-patient' && a.status !== 'new-patient') return 1
      return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
    })
  }, [patients, searchQuery, statusFilter])

  // Stats
  const stats = useMemo(() => ({
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    newPatients: patients.filter(p => p.status === 'new-patient').length
  }), [patients])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text">Patient Records</h2>
        <p className="text-sm text-muted">{filteredPatients.length} patients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-text">{stats.total}</p>
          <p className="text-xs text-muted">Total Patients</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <User className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
          <p className="text-xs text-muted">Active</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <User className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold text-blue-500">{stats.newPatients}</p>
          <p className="text-xs text-muted">New Patients</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search patients by name, email, phone, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                text-text placeholder:text-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
              focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Patients</option>
            <option value="active">Active</option>
            <option value="new-patient">New Patients</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              appointments={appointments}
              onViewDetails={setSelectedPatient}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No patients found</h3>
          <p className="text-sm text-muted">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <PatientDetailModal
            patient={selectedPatient}
            appointments={appointments}
            onClose={() => setSelectedPatient(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Search,
  Filter,
  Utensils,
  Sparkles,
  Wrench,
  Waves,
  Map,
  Building2,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  X,
  UserPlus
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const serviceTypeIcons = {
  'room-service': Utensils,
  'housekeeping': Sparkles,
  'maintenance': Wrench,
  'spa': Waves,
  'concierge': Map,
  'facilities': Building2
}

const serviceTypeColors = {
  'room-service': 'bg-orange-500',
  'housekeeping': 'bg-purple-500',
  'maintenance': 'bg-gray-500',
  'spa': 'bg-teal-500',
  'concierge': 'bg-blue-500',
  'facilities': 'bg-green-500'
}

const statusFilters = [
  { value: 'all', label: 'All Requests' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

const typeFilters = [
  { value: 'all', label: 'All Types' },
  { value: 'room-service', label: 'Room Service' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'spa', label: 'Spa' },
  { value: 'concierge', label: 'Concierge' },
  { value: 'facilities', label: 'Facilities' }
]

function RequestCard({ request, onStatusChange, onAssign, staff }) {
  const [showActions, setShowActions] = useState(false)
  const Icon = serviceTypeIcons[request.type] || Bell
  const iconColor = serviceTypeColors[request.type] || 'bg-gray-500'

  const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-surface rounded-xl border p-4 transition-all ${
        request.priority === 'urgent'
          ? 'border-red-500/50 bg-red-500/5'
          : 'border-border hover:border-primary/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text capitalize">
                {request.type.replace('-', ' ')}
              </span>
              {request.priority === 'urgent' && (
                <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full font-medium">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-xs text-muted">Room {request.roomNumber}</p>
          </div>
        </div>
        <StatusBadge status={request.status} size="sm" />
      </div>

      {/* Description */}
      <p className="text-sm text-text mb-3 line-clamp-2">{request.description}</p>

      {request.notes && (
        <p className="text-xs text-muted italic mb-3">Note: {request.notes}</p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-muted mb-3">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{request.guestName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{timeAgo(request.createdAt)}</span>
        </div>
      </div>

      {/* Assigned Staff */}
      {request.assignedToName && (
        <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg mb-3">
          <UserPlus className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-600 dark:text-blue-400">
            {request.assignedToName}
          </span>
        </div>
      )}

      {/* Actions */}
      {request.status !== 'completed' && (
        <div className="flex gap-2 pt-2 border-t border-border">
          {request.status === 'pending' && (
            <>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    const selectedStaff = staff.find(s => s.id === e.target.value)
                    onAssign(request.id, e.target.value, selectedStaff?.name)
                  }
                }}
                className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg text-xs text-text
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
                defaultValue=""
              >
                <option value="" disabled>Assign to...</option>
                {staff.filter(s => s.status === 'on-duty').map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </>
          )}

          {request.status === 'assigned' && (
            <button
              onClick={() => onStatusChange(request.id, 'in-progress')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                bg-purple-500 text-white text-xs font-medium rounded-lg
                hover:bg-purple-600 transition-colors"
            >
              Start
            </button>
          )}

          {request.status === 'in-progress' && (
            <button
              onClick={() => onStatusChange(request.id, 'completed')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                bg-green-500 text-white text-xs font-medium rounded-lg
                hover:bg-green-600 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Complete
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

function StatsBar({ requests }) {
  const stats = useMemo(() => ({
    pending: requests.filter(r => r.status === 'pending').length,
    assigned: requests.filter(r => r.status === 'assigned').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    urgent: requests.filter(r => r.priority === 'urgent' && r.status !== 'completed').length
  }), [requests])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="bg-amber-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
        <p className="text-xs text-muted">Pending</p>
      </div>
      <div className="bg-blue-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.assigned}</p>
        <p className="text-xs text-muted">Assigned</p>
      </div>
      <div className="bg-purple-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.inProgress}</p>
        <p className="text-xs text-muted">In Progress</p>
      </div>
      <div className="bg-green-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        <p className="text-xs text-muted">Completed</p>
      </div>
      <div className="bg-red-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.urgent}</p>
        <p className="text-xs text-muted">Urgent</p>
      </div>
    </div>
  )
}

export default function ServiceRequestsMonitor() {
  const { serviceRequests, staff, updateServiceRequest } = useAdminData()
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)

  // Filter requests
  const filteredRequests = useMemo(() => {
    return serviceRequests
      .filter(request => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const matchesSearch =
            request.roomNumber?.toLowerCase().includes(query) ||
            request.guestName?.toLowerCase().includes(query) ||
            request.description?.toLowerCase().includes(query) ||
            request.type?.toLowerCase().includes(query)
          if (!matchesSearch) return false
        }

        if (statusFilter !== 'all' && request.status !== statusFilter) return false
        if (typeFilter !== 'all' && request.type !== typeFilter) return false
        if (showUrgentOnly && request.priority !== 'urgent') return false

        return true
      })
      .sort((a, b) => {
        // Sort by priority first, then by date
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1
        if (b.priority === 'urgent' && a.priority !== 'urgent') return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  }, [serviceRequests, statusFilter, typeFilter, searchQuery, showUrgentOnly])

  const handleStatusChange = async (requestId, newStatus) => {
    const updates = {
      status: newStatus,
      ...(newStatus === 'completed' && { completedAt: new Date().toISOString() })
    }
    await updateServiceRequest(requestId, updates)
  }

  const handleAssign = async (requestId, staffId, staffName) => {
    await updateServiceRequest(requestId, {
      status: 'assigned',
      assignedTo: staffId,
      assignedToName: staffName
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text">Service Requests</h2>
        <p className="text-sm text-muted">
          {filteredRequests.length} requests
        </p>
      </div>

      {/* Stats */}
      <StatsBar requests={serviceRequests} />

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search requests, rooms, guests..."
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
              {statusFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {typeFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowUrgentOnly(!showUrgentOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors ${
                  showUrgentOnly
                    ? 'bg-red-500 text-white'
                    : 'bg-bg border border-border text-text hover:bg-red-500/10'
                }`}
            >
              <AlertCircle className="w-4 h-4" />
              Urgent
            </button>
          </div>
        </div>
      </div>

      {/* Request Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              staff={staff}
              onStatusChange={handleStatusChange}
              onAssign={handleAssign}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Bell className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No requests found</h3>
          <p className="text-sm text-muted">
            {showUrgentOnly
              ? 'No urgent requests at the moment'
              : 'Try adjusting your filters'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

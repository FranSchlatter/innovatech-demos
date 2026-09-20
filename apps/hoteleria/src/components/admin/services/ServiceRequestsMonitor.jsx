import { useState, useMemo, forwardRef } from 'react'
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
  UserPlus,
  MessageSquare
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useAdmin } from '../../../context/AdminContext'
import { useTranslation } from '../../../i18n/LanguageProvider'
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

// Filter option values + their translation keys (resolved at render time).
const statusFilters = [
  { value: 'all', labelKey: 'admin.services.filters.allRequests' },
  { value: 'pending', labelKey: 'admin.services.filters.pending' },
  { value: 'assigned', labelKey: 'admin.services.filters.assigned' },
  { value: 'in-progress', labelKey: 'admin.services.filters.inProgress' },
  { value: 'completed', labelKey: 'admin.services.filters.completed' }
]

const typeFilters = [
  { value: 'all', labelKey: 'admin.services.filters.allTypes' },
  { value: 'room-service', labelKey: 'admin.services.filters.roomService' },
  { value: 'housekeeping', labelKey: 'admin.services.filters.housekeeping' },
  { value: 'maintenance', labelKey: 'admin.services.filters.maintenance' },
  { value: 'spa', labelKey: 'admin.services.filters.spa' },
  { value: 'concierge', labelKey: 'admin.services.filters.concierge' },
  { value: 'facilities', labelKey: 'admin.services.filters.facilities' }
]

const RequestCard = forwardRef(function RequestCard({ request, onStatusChange, onAssign, onMessage, staff }, ref) {
  const { t } = useTranslation()
  const [showActions, setShowActions] = useState(false)
  const Icon = serviceTypeIcons[request.type] || Bell
  const iconColor = serviceTypeColors[request.type] || 'bg-gray-500'

  const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 1) return t('admin.shared.relTime.justNow')
    if (diffMins < 60) return t('admin.shared.relTime.minutesAgo', { count: diffMins })
    if (diffHours < 24) return t('admin.shared.relTime.hoursAgo', { count: diffHours })
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      ref={ref}
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
                {request.type in serviceTypeIcons ? t(`admin.services.types.${request.type}`) : request.type.replace('-', ' ')}
              </span>
              {request.priority === 'urgent' && (
                <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full font-medium">
                  {t('admin.services.urgent')}
                </span>
              )}
            </div>
            <p className="text-xs text-muted">{t('common.labels.room')} {request.roomNumber}</p>
          </div>
        </div>
        <StatusBadge status={request.status} size="sm" />
      </div>

      {/* Description */}
      <p className="text-sm text-text mb-3 line-clamp-2">{request.description}</p>

      {request.notes && (
        <p className="text-xs text-muted italic mb-3">{t('admin.services.note')} {request.notes}</p>
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

      {/* Actions — the "message guest" button is always available (H22),
          the status action depends on the current stage. */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button
          onClick={() => onMessage(request)}
          title={t('admin.services.messageGuest')}
          className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2
            bg-primary/10 text-primary text-xs font-medium rounded-lg
            hover:bg-primary/20 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">{t('admin.services.write')}</span>
        </button>

        {request.status === 'pending' && (
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
            <option value="" disabled>{t('admin.services.assignTo')}</option>
            {staff.filter(s => s.status === 'on-duty').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}

        {request.status === 'assigned' && (
          <button
            onClick={() => onStatusChange(request.id, 'in-progress')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2
              bg-purple-500 text-white text-xs font-medium rounded-lg
              hover:bg-purple-600 transition-colors"
          >
            {t('admin.services.start')}
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
            {t('admin.services.complete')}
          </button>
        )}
      </div>
    </motion.div>
  )
})

function StatsBar({ requests }) {
  const { t } = useTranslation()
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
        <p className="text-xs text-muted">{t('admin.services.stats.pending')}</p>
      </div>
      <div className="bg-blue-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.assigned}</p>
        <p className="text-xs text-muted">{t('admin.services.stats.assigned')}</p>
      </div>
      <div className="bg-purple-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.inProgress}</p>
        <p className="text-xs text-muted">{t('admin.services.stats.inProgress')}</p>
      </div>
      <div className="bg-green-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        <p className="text-xs text-muted">{t('admin.services.stats.completed')}</p>
      </div>
      <div className="bg-red-500/10 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.urgent}</p>
        <p className="text-xs text-muted">{t('admin.services.stats.urgent')}</p>
      </div>
    </div>
  )
}

export default function ServiceRequestsMonitor() {
  const { serviceRequests, staff, updateServiceRequest } = useAdminData()
  const { openInboxWithTarget } = useAdmin()
  const { t } = useTranslation()
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

  // H22 — hand the request off to the unified Inbox, which finds or creates the
  // guest's conversation and pre-fills a contextual reply. A nonce guarantees a
  // fresh object so repeated clicks always re-trigger the Inbox effect.
  const handleMessage = (request) => {
    openInboxWithTarget({
      requestId: request.id,
      guestName: request.guestName,
      roomNumber: request.roomNumber,
      type: request.type,
      description: request.description,
      nonce: Date.now()
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text">{t('admin.services.title')}</h2>
        <p className="text-sm text-muted">
          {t('admin.services.countSummary', { count: filteredRequests.length })}
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
              placeholder={t('admin.services.searchPlaceholder')}
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
                  {t(filter.labelKey)}
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
                  {t(filter.labelKey)}
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
              {t('admin.services.urgent')}
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
              onMessage={handleMessage}
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
          <h3 className="text-lg font-medium text-text mb-2">{t('admin.services.emptyTitle')}</h3>
          <p className="text-sm text-muted">
            {showUrgentOnly
              ? t('admin.services.emptyUrgent')
              : t('admin.services.emptyDefault')}
          </p>
        </motion.div>
      )}
    </div>
  )
}

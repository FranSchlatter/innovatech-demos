import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Search,
  Clock,
  User,
  CheckCircle,
  Circle,
  Play,
  BedDouble,
  Building,
  Filter,
  Calendar,
  Users
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const taskTypeLabels = {
  'daily': 'Daily Clean',
  'checkout-clean': 'Checkout',
  'deep-clean': 'Deep Clean',
  'turndown': 'Turndown',
  'inspection': 'Inspection'
}

const taskTypeColors = {
  'daily': 'bg-blue-500',
  'checkout-clean': 'bg-orange-500',
  'deep-clean': 'bg-purple-500',
  'turndown': 'bg-teal-500',
  'inspection': 'bg-gray-500'
}

const statusFilters = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

const priorityFilters = [
  { value: 'all', label: 'All Priority' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' }
]

function TaskCard({ task, staff, onStatusChange, onAssign }) {
  const completedItems = task.checklistItems?.filter(i => i.completed).length || 0
  const totalItems = task.checklistItems?.length || 0
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const formatTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-xl border p-4 transition-all ${
        task.priority === 'high' || task.priority === 'urgent'
          ? 'border-orange-500/50'
          : 'border-border hover:border-primary/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${taskTypeColors[task.type] || 'bg-gray-500'}`}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text">
                {taskTypeLabels[task.type] || task.type}
              </span>
              {(task.priority === 'high' || task.priority === 'urgent') && (
                <StatusBadge status={task.priority} size="xs" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <BedDouble className="w-3 h-3" />
              <span>Room {task.roomNumber}</span>
              <span>•</span>
              <Building className="w-3 h-3" />
              <span>Floor {task.floor}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={task.status} size="sm" />
      </div>

      {/* Scheduled Time */}
      <div className="flex items-center gap-2 text-sm text-muted mb-3">
        <Clock className="w-4 h-4" />
        <span>Scheduled: {formatTime(task.scheduledTime)}</span>
      </div>

      {/* Notes */}
      {task.notes && (
        <p className="text-xs text-muted italic mb-3">Note: {task.notes}</p>
      )}

      {/* Progress Bar */}
      {task.status === 'in-progress' && totalItems > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted">Progress</span>
            <span className="text-text font-medium">{completedItems}/{totalItems}</span>
          </div>
          <div className="h-2 bg-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-green-500"
            />
          </div>
        </div>
      )}

      {/* Assigned Staff */}
      {task.assignedToName && (
        <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-lg mb-3">
          <User className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-purple-600 dark:text-purple-400">
            {task.assignedToName}
          </span>
        </div>
      )}

      {/* Actions */}
      {task.status !== 'completed' && (
        <div className="flex gap-2 pt-2 border-t border-border">
          {task.status === 'pending' && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const selectedStaff = staff.find(s => s.id === e.target.value)
                  onAssign(task.id, e.target.value, selectedStaff?.name)
                }
              }}
              className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg text-xs text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
              defaultValue=""
            >
              <option value="" disabled>Assign to...</option>
              {staff.filter(s => s.role === 'housekeeping' && s.status === 'on-duty').map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}

          {task.status === 'assigned' && (
            <button
              onClick={() => onStatusChange(task.id, 'in-progress')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                bg-purple-500 text-white text-xs font-medium rounded-lg
                hover:bg-purple-600 transition-colors"
            >
              <Play className="w-3 h-3" />
              Start
            </button>
          )}

          {task.status === 'in-progress' && (
            <button
              onClick={() => onStatusChange(task.id, 'completed')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                bg-green-500 text-white text-xs font-medium rounded-lg
                hover:bg-green-600 transition-colors"
            >
              <CheckCircle className="w-3 h-3" />
              Complete
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

function StaffOverview({ staff, tasks }) {
  const housekeepingStaff = staff.filter(s => s.role === 'housekeeping')

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        Housekeeping Staff
      </h3>

      <div className="space-y-3">
        {housekeepingStaff.map(member => {
          const assignedTasks = tasks.filter(t =>
            t.assignedTo === member.id && t.status !== 'completed'
          )

          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-bg rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{member.name}</p>
                  <p className="text-xs text-muted capitalize">{member.shift} shift</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{assignedTasks.length} tasks</span>
                <StatusBadge status={member.status} size="xs" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FloorOverview({ tasks }) {
  const floors = [0, 1, 2, 3, 4, 5, 6]

  const getFloorStats = (floor) => {
    const floorTasks = tasks.filter(t => t.floor === floor)
    return {
      pending: floorTasks.filter(t => t.status === 'pending').length,
      inProgress: floorTasks.filter(t => t.status === 'in-progress').length,
      completed: floorTasks.filter(t => t.status === 'completed').length
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2">
        <Building className="w-5 h-5 text-primary" />
        Floor Status
      </h3>

      <div className="space-y-2">
        {floors.map(floor => {
          const stats = getFloorStats(floor)
          const total = stats.pending + stats.inProgress + stats.completed

          return (
            <div
              key={floor}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg transition-colors"
            >
              <span className="text-sm font-medium text-text w-20">
                {floor === 0 ? 'Ground' : `Floor ${floor}`}
              </span>
              <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden flex">
                {stats.completed > 0 && (
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(stats.completed / Math.max(total, 1)) * 100}%` }}
                  />
                )}
                {stats.inProgress > 0 && (
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${(stats.inProgress / Math.max(total, 1)) * 100}%` }}
                  />
                )}
                {stats.pending > 0 && (
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${(stats.pending / Math.max(total, 1)) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-xs text-muted w-16 text-right">{total} tasks</span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-muted">Done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-muted">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-muted">Pending</span>
        </div>
      </div>
    </div>
  )
}

export default function HousekeepingManagement() {
  const { housekeepingTasks, staff, updateHousekeepingTask } = useAdminData()
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return housekeepingTasks
      .filter(task => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const matchesSearch =
            task.roomNumber?.toLowerCase().includes(query) ||
            task.assignedToName?.toLowerCase().includes(query) ||
            task.type?.toLowerCase().includes(query)
          if (!matchesSearch) return false
        }

        if (statusFilter !== 'all' && task.status !== statusFilter) return false
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false

        return true
      })
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 }
        const priorityDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
        if (priorityDiff !== 0) return priorityDiff

        // Then by scheduled time
        return new Date(a.scheduledTime) - new Date(b.scheduledTime)
      })
  }, [housekeepingTasks, statusFilter, priorityFilter, searchQuery])

  const handleStatusChange = async (taskId, newStatus) => {
    const updates = {
      status: newStatus,
      ...(newStatus === 'in-progress' && { startedAt: new Date().toISOString() }),
      ...(newStatus === 'completed' && { completedAt: new Date().toISOString() })
    }
    await updateHousekeepingTask(taskId, updates)
  }

  const handleAssign = async (taskId, staffId, staffName) => {
    await updateHousekeepingTask(taskId, {
      status: 'assigned',
      assignedTo: staffId,
      assignedToName: staffName
    })
  }

  // Stats
  const stats = useMemo(() => ({
    pending: housekeepingTasks.filter(t => t.status === 'pending').length,
    inProgress: housekeepingTasks.filter(t => t.status === 'in-progress').length,
    completed: housekeepingTasks.filter(t => t.status === 'completed').length
  }), [housekeepingTasks])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Housekeeping</h2>
          <p className="text-sm text-muted">
            {filteredTasks.length} tasks • {stats.pending} pending • {stats.inProgress} in progress
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search rooms, staff..."
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
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {priorityFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Task List */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  staff={staff}
                  onStatusChange={handleStatusChange}
                  onAssign={handleAssign}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-surface rounded-xl border border-border"
            >
              <Sparkles className="w-12 h-12 mx-auto text-muted mb-4" />
              <h3 className="text-lg font-medium text-text mb-2">No tasks found</h3>
              <p className="text-sm text-muted">Try adjusting your filters</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <StaffOverview staff={staff} tasks={housekeepingTasks} />
          <FloorOverview tasks={housekeepingTasks} />
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Search,
  Clock,
  User,
  CheckCircle,
  Play,
  BedDouble,
  Building,
  Users,
  Timer,
  Star,
  Trophy,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ListChecks,
  Gauge
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { getStaffMetrics, getWeeklyCompletion } from '../../../data/admin/mockHousekeeping'
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

// Human-readable elapsed time between an ISO start and a "now" epoch.
const formatElapsed = (startISO, now) => {
  if (!startISO) return null
  const diffMin = Math.max(0, Math.floor((now - new Date(startISO).getTime()) / 60000))
  const h = Math.floor(diffMin / 60)
  const m = diffMin % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const initials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0, 2)

// --- Small shared bits ------------------------------------------------------

function QualityStars({ value = 0, size = 'w-3.5 h-3.5' }) {
  return (
    <div className="flex items-center gap-0.5" title={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map(i => {
        const filled = value >= i
        const half = !filled && value >= i - 0.5
        return (
          <Star
            key={i}
            className={`${size} ${
              filled || half ? 'text-amber-400 fill-amber-400' : 'text-border'
            } ${half ? 'opacity-60' : ''}`}
          />
        )
      })}
      <span className="ml-1 text-xs font-medium text-text">{value.toFixed(1)}</span>
    </div>
  )
}

function ProductivityBar({ value, teamMax, teamAvg }) {
  const pct = teamMax > 0 ? Math.min(100, (value / teamMax) * 100) : 0
  const avgPct = teamMax > 0 ? Math.min(100, (teamAvg / teamMax) * 100) : 0
  const delta = value - teamAvg
  const aboveAvg = delta >= 0

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted">Productivity</span>
        <span className="font-semibold text-text">{value.toFixed(1)} tasks/h</span>
      </div>
      <div className="relative h-2.5 bg-bg rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${aboveAvg ? 'bg-green-500' : 'bg-amber-500'}`}
        />
        {/* team average marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-text opacity-40"
          style={{ left: `${avgPct}%` }}
          title={`Team avg ${teamAvg.toFixed(1)}`}
        />
      </div>
      <p className={`mt-1 text-[11px] font-medium ${aboveAvg ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
        {aboveAvg ? '+' : ''}{delta.toFixed(1)} vs team avg
      </p>
    </div>
  )
}

// --- Task card --------------------------------------------------------------

function TaskCard({ task, staff, onStatusChange, onAssign, now }) {
  const completedItems = task.checklistItems?.filter(i => i.completed).length || 0
  const totalItems = task.checklistItems?.length || 0
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0
  const elapsed = task.status === 'in-progress' ? formatElapsed(task.startedAt, now) : null

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

      {/* Elapsed time (in-progress only) */}
      {elapsed && (
        <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 bg-purple-500/10 rounded-lg">
          <Timer className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            Elapsed: {elapsed}
          </span>
          {task.startedAt && (
            <span className="text-xs text-muted ml-auto">since {formatTime(task.startedAt)}</span>
          )}
        </div>
      )}

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

// --- Sidebar: staff overview with expandable detail -------------------------

function StaffOverview({ staff, tasks }) {
  const housekeepingStaff = staff.filter(s => s.role === 'housekeeping')
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        Housekeeping Staff
      </h3>

      <div className="space-y-2">
        {housekeepingStaff.map(member => {
          const assignedTasks = tasks.filter(t =>
            t.assignedTo === member.id && t.status !== 'completed'
          )
          const expanded = expandedId === member.id
          const metrics = expanded ? getStaffMetrics(member.id, tasks) : null

          return (
            <div key={member.id} className="bg-bg rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedId(expanded ? null : member.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-border transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-contrast">
                      {initials(member.name)}
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
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expanded && metrics && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-surface rounded-lg py-2">
                          <p className="text-base font-bold text-text">{metrics.completedToday}</p>
                          <p className="text-[10px] text-muted">Today</p>
                        </div>
                        <div className="bg-surface rounded-lg py-2">
                          <p className="text-base font-bold text-text">{metrics.completedWeek}</p>
                          <p className="text-[10px] text-muted">Week</p>
                        </div>
                        <div className="bg-surface rounded-lg py-2">
                          <p className="text-base font-bold text-text">{metrics.completedMonth}</p>
                          <p className="text-[10px] text-muted">Month</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5" /> Avg time
                        </span>
                        <span className="font-medium text-text">{metrics.avgMinutes} min</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Quality</span>
                        <QualityStars value={metrics.quality} />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5" /> Throughput
                        </span>
                        <span className="font-medium text-text">{metrics.productivity.toFixed(1)} tasks/h</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

// --- Team metrics view ------------------------------------------------------

function WeeklyChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-base font-bold text-text mb-1 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        Tasks completed · last 7 days
      </h3>
      <p className="text-xs text-muted mb-4">Team-wide daily throughput</p>

      <div className="flex items-end gap-2 sm:gap-3 h-44">
        {data.map((d, i) => {
          const isToday = i === data.length - 1
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
              <span className={`text-[11px] font-semibold ${isToday ? 'text-primary' : 'text-text'}`}>
                {d.count}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.count / max) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                style={{ opacity: isToday ? 1 : 0.5 }}
                className="w-full rounded-t-md min-h-[4px] bg-primary"
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-2 sm:gap-3 mt-2">
        {data.map((d, i) => (
          <span
            key={i}
            className={`flex-1 text-center text-xs ${
              i === data.length - 1 ? 'text-primary font-medium' : 'text-muted'
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

const rankStyles = [
  'bg-amber-400/20 text-amber-600 dark:text-amber-400 border-amber-400/40',
  'bg-slate-400/20 text-slate-600 dark:text-slate-300 border-slate-400/40',
  'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/40'
]

function TeamRanking({ ranking, maxProductivity }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-400" />
        Team ranking
        <span className="text-xs font-normal text-muted">by productivity</span>
      </h3>

      <div className="space-y-2">
        {ranking.map((m, i) => (
          <motion.div
            key={m.staffId}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-bg"
          >
            <div
              className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold ${
                rankStyles[i] || 'bg-bg text-muted border-border'
              }`}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{m.member.name}</p>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden mt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${maxProductivity > 0 ? (m.productivity / maxProductivity) * 100 : 0}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-text whitespace-nowrap">
              {m.productivity.toFixed(1)} <span className="text-xs font-normal text-muted">tasks/h</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function WorkerMetricCard({ member, metrics, teamMax, teamAvg }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl border border-border p-4 hover:border-primary/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-contrast">{initials(member.name)}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-text">{member.name}</p>
            <p className="text-xs text-muted capitalize">{member.shift} shift</p>
          </div>
        </div>
        <StatusBadge status={member.status} size="xs" />
      </div>

      {/* Completed counters */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Today', value: metrics.completedToday },
          { label: 'Week', value: metrics.completedWeek },
          { label: 'Month', value: metrics.completedMonth }
        ].map(s => (
          <div key={s.label} className="bg-bg rounded-lg py-2.5 text-center">
            <p className="text-lg font-bold text-text">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Avg time + quality */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Timer className="w-4 h-4 text-muted" />
          <span className="text-muted">Avg</span>
          <span className="font-semibold text-text">{metrics.avgMinutes} min</span>
        </div>
        <QualityStars value={metrics.quality} />
      </div>

      {/* Productivity */}
      <ProductivityBar value={metrics.productivity} teamMax={teamMax} teamAvg={teamAvg} />
    </motion.div>
  )
}

function TeamMetricsView({ staff, tasks }) {
  const { metrics, ranking, teamMax, teamAvg, weekly, totals } = useMemo(() => {
    const hkStaff = staff.filter(s => s.role === 'housekeeping')
    const metrics = hkStaff.map(member => ({
      member,
      ...getStaffMetrics(member.id, tasks)
    }))

    const productivities = metrics.map(m => m.productivity)
    const teamMax = Math.max(...productivities, 0.1)
    const teamAvg = productivities.length
      ? productivities.reduce((a, b) => a + b, 0) / productivities.length
      : 0

    const ranking = [...metrics].sort((a, b) => b.productivity - a.productivity)
    const weekly = getWeeklyCompletion(tasks)

    const totals = {
      today: metrics.reduce((a, m) => a + m.completedToday, 0),
      week: metrics.reduce((a, m) => a + m.completedWeek, 0),
      month: metrics.reduce((a, m) => a + m.completedMonth, 0),
      avgQuality: metrics.length
        ? Math.round((metrics.reduce((a, m) => a + m.quality, 0) / metrics.length) * 10) / 10
        : 0
    }

    return { metrics, ranking, teamMax, teamAvg, weekly, totals }
  }, [staff, tasks])

  const teamCards = [
    { label: 'Completed today', value: totals.today, icon: CheckCircle, tint: 'text-green-500' },
    { label: 'This week', value: totals.week, icon: ListChecks, tint: 'text-blue-500' },
    { label: 'Avg productivity', value: `${teamAvg.toFixed(1)}/h`, icon: TrendingUp, tint: 'text-primary' },
    { label: 'Avg quality', value: totals.avgQuality.toFixed(1), icon: Star, tint: 'text-amber-400' }
  ]

  return (
    <div className="space-y-6">
      {/* Team KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {teamCards.map(c => {
          const Icon = c.icon
          return (
            <div key={c.label} className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${c.tint}`} />
                <span className="text-xs text-muted">{c.label}</span>
              </div>
              <p className="text-2xl font-bold text-text">{c.value}</p>
            </div>
          )
        })}
      </div>

      {/* Chart + ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart data={weekly} />
        <TeamRanking ranking={ranking} maxProductivity={teamMax} />
      </div>

      {/* Per-worker cards */}
      <div>
        <h3 className="text-base font-bold text-text mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Individual performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {metrics.map(m => (
            <WorkerMetricCard
              key={m.staffId}
              member={m.member}
              metrics={m}
              teamMax={teamMax}
              teamAvg={teamAvg}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Main -------------------------------------------------------------------

const tabs = [
  { value: 'tasks', label: 'Tasks', icon: ListChecks },
  { value: 'metrics', label: 'Team Metrics', icon: BarChart3 }
]

export default function HousekeepingManagement() {
  const { housekeepingTasks, staff, updateHousekeepingTask } = useAdminData()
  const [view, setView] = useState('tasks')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [staffFilter, setStaffFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Ticking clock for live "elapsed" readouts on in-progress tasks.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  const housekeepingStaff = useMemo(
    () => staff.filter(s => s.role === 'housekeeping'),
    [staff]
  )

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
        if (staffFilter === 'unassigned' && task.assignedTo) return false
        if (staffFilter !== 'all' && staffFilter !== 'unassigned' && task.assignedTo !== staffFilter) return false

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
  }, [housekeepingTasks, statusFilter, priorityFilter, staffFilter, searchQuery])

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

        {/* Tab switcher */}
        <div className="inline-flex items-center gap-1 bg-bg border border-border rounded-lg p-1 self-start">
          {tabs.map(t => {
            const Icon = t.icon
            const active = view === t.value
            return (
              <button
                key={t.value}
                onClick={() => setView(t.value)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-contrast'
                    : 'text-muted hover:text-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'metrics' ? (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <TeamMetricsView staff={staff} tasks={housekeepingTasks} />
          </motion.div>
        ) : (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4 sm:space-y-6"
          >
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

                  <select
                    value={staffFilter}
                    onChange={(e) => setStaffFilter(e.target.value)}
                    className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                      focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">All Staff</option>
                    <option value="unassigned">Unassigned</option>
                    {housekeepingStaff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
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
                        now={now}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

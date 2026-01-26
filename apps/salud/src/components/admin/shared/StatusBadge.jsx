import { motion } from 'framer-motion'

const statusConfig = {
  // Appointment statuses
  scheduled: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: 'Scheduled'
  },
  confirmed: {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'Confirmed'
  },
  'in-progress': {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    dot: 'bg-purple-500',
    label: 'In Progress'
  },
  completed: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    label: 'Completed'
  },
  cancelled: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Cancelled'
  },
  'no-show': {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
    label: 'No Show'
  },
  pending: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'Pending'
  },

  // Doctor/Staff statuses
  'on-duty': {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'On Duty'
  },
  'off-duty': {
    bg: 'bg-gray-500/10',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-500',
    label: 'Off Duty'
  },
  break: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'On Break'
  },
  'on-leave': {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'On Leave'
  },
  available: {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'Available'
  },
  unavailable: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-500',
    label: 'Unavailable'
  },
  busy: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    dot: 'bg-purple-500',
    label: 'Busy'
  },

  // Inventory statuses
  'in-stock': {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'In Stock'
  },
  'low-stock': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'Low Stock'
  },
  'out-of-stock': {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Out of Stock'
  },
  expiring: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
    label: 'Expiring Soon'
  },
  expired: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Expired'
  },

  // Patient statuses
  active: {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'Active'
  },
  inactive: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-500',
    label: 'Inactive'
  },
  'new-patient': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: 'New Patient'
  },
  'follow-up': {
    bg: 'bg-teal-500/10',
    text: 'text-teal-600 dark:text-teal-400',
    dot: 'bg-teal-500',
    label: 'Follow Up'
  },
  urgent: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Urgent'
  }
}

const sizeClasses = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
}

const dotSizes = {
  xs: 'w-1 h-1',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5'
}

export default function StatusBadge({
  status,
  size = 'sm',
  showDot = true,
  pulse = false,
  className = ''
}) {
  const config = statusConfig[status] || {
    bg: 'bg-gray-500/10',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-500',
    label: status?.replace(/-/g, ' ') || 'Unknown'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full capitalize
        ${config.bg} ${config.text} ${sizeClasses[size]} ${className}`}
    >
      {showDot && (
        <span className="relative flex">
          <span className={`rounded-full ${config.dot} ${dotSizes[size]}`} />
          {pulse && (
            <motion.span
              className={`absolute inset-0 rounded-full ${config.dot}`}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </span>
      )}
      {config.label}
    </span>
  )
}

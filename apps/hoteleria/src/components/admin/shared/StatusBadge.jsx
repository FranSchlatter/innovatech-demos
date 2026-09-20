import { motion } from 'framer-motion'
import { useTranslation } from '../../../i18n/LanguageProvider'

const statusStyles = {
  // Room statuses
  available: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  occupied: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  cleaning: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  maintenance: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  reserved: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',

  // Reservation statuses
  confirmed: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'checked-in': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'checked-out': 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  'no-show': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',

  // Service request statuses
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  assigned: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'in-progress': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  completed: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',

  // Priority
  normal: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  urgent: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',

  // Payment
  paid: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  partial: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  refunded: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',

  // Staff status
  'on-duty': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'off-duty': 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  break: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  unavailable: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',

  // Default
  default: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
}

// Map each status value to its translation key. Generic single-word statuses
// reuse common.status.*; anything hotel-specific lives in admin.shared.statusLabels.*
const statusLabelKeys = {
  available: 'common.status.available',
  occupied: 'common.status.occupied',
  cleaning: 'admin.shared.statusLabels.cleaning',
  maintenance: 'admin.shared.statusLabels.maintenance',
  reserved: 'common.status.reserved',
  confirmed: 'common.status.confirmed',
  'checked-in': 'common.status.checkedIn',
  'checked-out': 'common.status.checkedOut',
  cancelled: 'common.status.cancelled',
  'no-show': 'admin.shared.statusLabels.noShow',
  pending: 'common.status.pending',
  assigned: 'admin.shared.statusLabels.assigned',
  'in-progress': 'common.status.inProgress',
  completed: 'common.status.completed',
  normal: 'admin.shared.statusLabels.normal',
  urgent: 'admin.shared.statusLabels.urgent',
  high: 'admin.shared.statusLabels.high',
  low: 'admin.shared.statusLabels.low',
  paid: 'admin.shared.statusLabels.paid',
  partial: 'admin.shared.statusLabels.partial',
  refunded: 'admin.shared.statusLabels.refunded',
  'on-duty': 'admin.shared.statusLabels.onDuty',
  'off-duty': 'admin.shared.statusLabels.offDuty',
  break: 'admin.shared.statusLabels.break',
  unavailable: 'admin.shared.statusLabels.unavailable'
}

export default function StatusBadge({
  status,
  size = 'sm',
  animate = false,
  className = ''
}) {
  const { t } = useTranslation()
  const style = statusStyles[status] || statusStyles.default
  const label = statusLabelKeys[status] ? t(statusLabelKeys[status]) : status

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const Component = animate ? motion.span : 'span'
  const animationProps = animate ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <Component
      {...animationProps}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-full border
        capitalize whitespace-nowrap
        ${style}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {label}
    </Component>
  )
}

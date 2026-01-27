import { motion } from 'framer-motion'

const statusConfig = {
  // Order statuses
  'pending': {
    label: 'Pending',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  'confirmed': {
    label: 'Confirmed',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  'preparing': {
    label: 'Preparing',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  'ready': {
    label: 'Ready',
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
  },
  'delivered': {
    label: 'Delivered',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'completed': {
    label: 'Completed',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'cancelled': {
    label: 'Cancelled',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  },

  // Reservation statuses
  'reserved': {
    label: 'Reserved',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  'seated': {
    label: 'Seated',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  'no-show': {
    label: 'No Show',
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  },

  // Table statuses
  'available': {
    label: 'Available',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'occupied': {
    label: 'Occupied',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  },
  'reserved-table': {
    label: 'Reserved',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  'cleaning': {
    label: 'Cleaning',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },

  // Menu item statuses
  'active': {
    label: 'Active',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'inactive': {
    label: 'Inactive',
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  },
  'out-of-stock': {
    label: 'Out of Stock',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  },
  'featured': {
    label: 'Featured',
    color: 'bg-primary/10 text-primary border-primary/20'
  },

  // Inventory statuses
  'in-stock': {
    label: 'In Stock',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'low-stock': {
    label: 'Low Stock',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  'expiring': {
    label: 'Expiring Soon',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
  },
  'expired': {
    label: 'Expired',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  },

  // Staff statuses
  'on-shift': {
    label: 'On Shift',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'off-shift': {
    label: 'Off Shift',
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  },
  'break': {
    label: 'On Break',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },

  // Order types
  'dine-in': {
    label: 'Dine-In',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  'takeout': {
    label: 'Takeout',
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
  },
  'delivery': {
    label: 'Delivery',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  }
}

export default function StatusBadge({ status, size = 'sm', animate = false }) {
  const config = statusConfig[status] || {
    label: status,
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  }

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
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
        inline-flex items-center font-medium rounded-full border
        ${sizeClasses[size]}
        ${config.color}
      `}
    >
      {config.label}
    </Component>
  )
}

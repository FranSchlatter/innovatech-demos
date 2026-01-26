import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BedDouble,
  Sparkles,
  Package,
  Bell,
  X,
  LogOut,
  Hotel
} from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'rooms', label: 'Room Management', icon: BedDouble },
  { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'services', label: 'Service Requests', icon: Bell }
]

export default function AdminSidebar({ onExit, isDark }) {
  const { currentView, setView, sidebarOpen, closeSidebar } = useAdmin()

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Hotel className="w-6 h-6 text-primary-contrast" />
          </div>
          <div>
            <h1 className="font-bold text-text">Hotel Luxury</h1>
            <p className="text-xs text-muted">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 text-left
                ${isActive
                  ? 'bg-primary text-primary-contrast shadow-md'
                  : 'text-text hover:bg-surface-alt'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Exit Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onExit}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
            text-text hover:bg-red-500/10 hover:text-red-500
            transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Exit Admin</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Slide-out Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-surface z-50 shadow-xl"
            >
              {/* Close Button */}
              <button
                onClick={closeSidebar}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-surface-alt
                  text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

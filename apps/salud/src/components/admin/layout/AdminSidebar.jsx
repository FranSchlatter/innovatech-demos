import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Users,
  Package,
  Clock,
  X,
  LogOut,
  Activity
} from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'schedule', label: 'Schedule', icon: Clock }
]

function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
        transition-colors ${
          isActive
            ? 'bg-primary text-primary-contrast'
            : 'text-muted hover:bg-bg hover:text-text'
        }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{item.label}</span>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-contrast"
        />
      )}
    </motion.button>
  )
}

export default function AdminSidebar({ onExit }) {
  const { currentView, setView, sidebarOpen, setSidebar } = useAdmin()

  const handleNavClick = (viewId) => {
    setView(viewId)
    setSidebar(false)
  }

  // Desktop Sidebar
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-text">InnovaTech</h2>
            <p className="text-xs text-muted">Hospital Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={currentView === item.id}
            onClick={() => handleNavClick(item.id)}
          />
        ))}
      </nav>

      {/* Exit Admin */}
      <div className="p-4 border-t border-border">
        <motion.button
          onClick={onExit}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
            text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Exit Admin</span>
        </motion.button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0">
        <SidebarContent />
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
              onClick={() => setSidebar(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-surface z-50 shadow-xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSidebar(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-bg
                  transition-colors text-muted"
              >
                <X className="w-5 h-5" />
              </button>

              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

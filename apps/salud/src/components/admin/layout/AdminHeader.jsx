import { motion } from 'framer-motion'
import { Menu, Search, Bell, Sun, Moon, User } from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'

const viewTitles = {
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  doctors: 'Doctors',
  patients: 'Patient Records',
  inventory: 'Medical Inventory',
  schedule: 'Schedule'
}

export default function AdminHeader({ isDark, toggleTheme }) {
  const { currentView, toggleSidebar, searchQuery, setSearch, notifications } = useAdmin()

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-bg transition-colors text-muted"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-text">
              {viewTitles[currentView] || 'Admin'}
            </h1>
            <p className="text-xs text-muted hidden sm:block">
              InnovaTech Hospital Management
            </p>
          </div>
        </div>

        {/* Center: Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search patients, appointments, doctors..."
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                text-sm text-text placeholder:text-muted
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-bg transition-colors text-muted"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-bg transition-colors text-muted">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px]
                  font-bold rounded-full flex items-center justify-center"
              >
                {notifications.length > 9 ? '9+' : notifications.length}
              </motion.span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-bg transition-colors text-muted"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Avatar */}
          <div className="hidden sm:flex items-center gap-2 ml-2 pl-4 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-text">Admin User</p>
              <p className="text-xs text-muted">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

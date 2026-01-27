import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'

const viewTitles = {
  dashboard: 'Dashboard',
  orders: 'Order Management',
  reservations: 'Reservations',
  menu: 'Menu Management',
  inventory: 'Kitchen Inventory',
  tables: 'Table Management'
}

export default function AdminHeader({ isDark, toggleTheme, onExit }) {
  const { currentView, toggleSidebar, searchQuery, setSearch, notifications } = useAdmin()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="h-16 bg-surface border-b border-border px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-bg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-muted" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-text">
            {viewTitles[currentView] || 'Admin'}
          </h1>
          <p className="text-xs text-muted hidden sm:block">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Search - Desktop */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search orders, reservations, dishes..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              text-sm text-text placeholder:text-muted"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-bg transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-muted" />
          ) : (
            <Moon className="w-5 h-5 text-muted" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-bg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-muted" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-text">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted text-sm">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 hover:bg-bg border-b border-border last:border-0"
                      >
                        <p className="text-sm text-text">{notif.message}</p>
                        <p className="text-xs text-muted mt-1">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-bg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-text">Admin User</p>
                  <p className="text-xs text-muted">admin@gastronomy.com</p>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-text hover:bg-bg rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={onExit}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Exit Admin
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </header>
  )
}

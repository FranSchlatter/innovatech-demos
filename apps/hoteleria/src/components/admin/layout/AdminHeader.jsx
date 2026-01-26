import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'

const viewTitles = {
  dashboard: 'Dashboard',
  rooms: 'Room Management',
  housekeeping: 'Housekeeping',
  inventory: 'Inventory',
  services: 'Service Requests'
}

export default function AdminHeader({ isDark, toggleTheme }) {
  const { currentView, toggleSidebar, searchQuery, setSearch, notifications } = useAdmin()

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-alt text-text transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-bold text-text">
              {viewTitles[currentView]}
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

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search - Hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-2 bg-bg rounded-lg px-3 py-2 border border-border">
            <Search className="w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-text placeholder:text-muted w-32 lg:w-48"
            />
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-surface-alt text-text transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-alt text-text transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Avatar */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-contrast">A</span>
            </div>
            <span className="text-sm font-medium text-text hidden lg:block">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

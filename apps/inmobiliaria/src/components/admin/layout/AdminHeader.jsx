import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'

const VIEW_TITLES = {
  dashboard: 'Panel general',
  properties: 'Propiedades',
  leads: 'Leads / CRM',
  visits: 'Agenda de visitas',
  operations: 'Operaciones',
  agents: 'Equipo'
}

export default function AdminHeader({ isDark, toggleTheme }) {
  const { currentView, toggleSidebar, searchQuery, setSearch } = useAdmin()

  const title = VIEW_TITLES[currentView] || 'Panel general'

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border">
      <div className="flex items-center gap-3 p-4">
        {/* Left: menu + title */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-text hover:bg-surface-alt transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-text truncate">{title}</h1>

        {/* Center: search */}
        <div className="hidden md:flex items-center gap-2 ml-4 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-alt border border-border text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="hidden lg:block text-sm text-muted">27 ago 2026</span>

          <button
            className="relative p-2 rounded-lg text-text hover:bg-surface-alt transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text hover:bg-surface-alt transition-colors"
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 pl-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-contrast text-xs font-bold">
              AD
            </span>
            <span className="hidden sm:block text-sm font-medium text-text">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  LayoutDashboard,
  Users,
  CalendarDays,
  Handshake,
  UserCog,
  LogOut,
  X,
  Bot,
  Calculator,
  Wallet
} from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inbox', label: 'Bandeja IA', icon: Bot },
  { id: 'properties', label: 'Propiedades', icon: Building2 },
  { id: 'leads', label: 'Leads / CRM', icon: Users },
  { id: 'visits', label: 'Visitas', icon: CalendarDays },
  { id: 'operations', label: 'Operaciones', icon: Handshake },
  { id: 'contracts', label: 'Ajustes', icon: Calculator },
  { id: 'liquidations', label: 'Liquidaciones', icon: Wallet },
  { id: 'agents', label: 'Equipo', icon: UserCog }
]

export default function AdminSidebar({ onExit }) {
  const { currentView, setView, sidebarOpen, closeSidebar } = useAdmin()

  const handleSelect = (id) => {
    setView(id)
    closeSidebar()
  }

  const sidebarContent = (
    <>
      {/* Brand header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shrink-0">
          <Building2 className="w-5 h-5 text-primary-contrast" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-text leading-tight truncate">Terranova</p>
          <p className="text-xs text-muted leading-tight">Panel CRM</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-contrast shadow-md'
                  : 'text-text hover:bg-surface-alt'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Exit */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={onExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text hover:bg-error/10 hover:text-error transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Salir del panel</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-surface border-r border-border lg:hidden"
            >
              <button
                onClick={closeSidebar}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-muted hover:bg-surface-alt hover:text-text transition-colors"
                aria-label="Cerrar menú"
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

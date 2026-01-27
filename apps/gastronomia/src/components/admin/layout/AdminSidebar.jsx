import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Package,
  SquareStack,
  ChevronLeft,
  ChefHat,
  X
} from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'tables', label: 'Tables', icon: SquareStack }
]

export default function AdminSidebar({ onExit }) {
  const { currentView, setView, sidebarOpen, toggleSidebar, setSidebar } = useAdmin()

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebar(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
          width: 280
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-[280px] bg-surface border-r border-border
          flex flex-col
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-text text-sm">Gastronomy</h1>
              <p className="text-xs text-muted">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebar(false)}
            className="p-1.5 rounded-lg hover:bg-bg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id
            const Icon = item.icon

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setView(item.id)
                  if (window.innerWidth < 1024) {
                    setSidebar(false)
                  }
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-colors text-left
                  ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-bg hover:text-text'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
              bg-bg hover:bg-primary/10 text-muted hover:text-primary
              transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium">Exit Admin</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

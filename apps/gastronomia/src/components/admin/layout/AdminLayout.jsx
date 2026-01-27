import { AdminProvider, useAdmin } from '../../../context/AdminContext'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from '../dashboard/AdminDashboard'
import OrderManagement from '../orders/OrderManagement'
import ReservationManagement from '../reservations/ReservationManagement'
import MenuManagement from '../menu/MenuManagement'
import KitchenInventory from '../inventory/KitchenInventory'
import TableManagement from '../tables/TableManagement'

function AdminContent({ isDark, toggleTheme, onExit }) {
  const { currentView, sidebarOpen } = useAdmin()

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />
      case 'orders':
        return <OrderManagement />
      case 'reservations':
        return <ReservationManagement />
      case 'menu':
        return <MenuManagement />
      case 'inventory':
        return <KitchenInventory />
      case 'tables':
        return <TableManagement />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <AdminSidebar onExit={onExit} />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
        <AdminHeader
          isDark={isDark}
          toggleTheme={toggleTheme}
          onExit={onExit}
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ isDark, toggleTheme, onExit }) {
  return (
    <AdminProvider>
      <AdminContent
        isDark={isDark}
        toggleTheme={toggleTheme}
        onExit={onExit}
      />
    </AdminProvider>
  )
}

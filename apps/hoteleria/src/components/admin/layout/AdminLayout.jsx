import { AdminProvider } from '../../../context/AdminContext'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from '../dashboard/AdminDashboard'
import RoomManagement from '../rooms/RoomManagement'
import HousekeepingManagement from '../housekeeping/HousekeepingManagement'
import InventoryManagement from '../inventory/InventoryManagement'
import ServiceRequestsMonitor from '../services/ServiceRequestsMonitor'
import { useAdmin } from '../../../context/AdminContext'

function AdminContent({ isDark, toggleTheme, onExit }) {
  const { currentView } = useAdmin()

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />
      case 'rooms':
        return <RoomManagement />
      case 'housekeeping':
        return <HousekeepingManagement />
      case 'inventory':
        return <InventoryManagement />
      case 'services':
        return <ServiceRequestsMonitor />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <AdminSidebar onExit={onExit} isDark={isDark} />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader isDark={isDark} toggleTheme={toggleTheme} />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ onExit, isDark, toggleTheme }) {
  return (
    <AdminProvider>
      <AdminContent
        onExit={onExit}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </AdminProvider>
  )
}

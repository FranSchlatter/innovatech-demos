import { AdminProvider, useAdmin } from '../../../context/AdminContext'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from '../dashboard/AdminDashboard'
import PropertyManagement from '../properties/PropertyManagement'
import LeadsManagement from '../leads/LeadsManagement'
import VisitsScheduler from '../visits/VisitsScheduler'
import OperationsManagement from '../operations/OperationsManagement'
import AgentsManagement from '../agents/AgentsManagement'

function AdminContent({ onExit, isDark, toggleTheme }) {
  const { currentView } = useAdmin()

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />
      case 'properties':
        return <PropertyManagement />
      case 'leads':
        return <LeadsManagement />
      case 'visits':
        return <VisitsScheduler />
      case 'operations':
        return <OperationsManagement />
      case 'agents':
        return <AgentsManagement />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <AdminSidebar onExit={onExit} />
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
      <AdminContent onExit={onExit} isDark={isDark} toggleTheme={toggleTheme} />
    </AdminProvider>
  )
}

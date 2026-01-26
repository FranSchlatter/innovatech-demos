import { AdminProvider } from '../../../context/AdminContext'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from '../dashboard/AdminDashboard'
import AppointmentManagement from '../appointments/AppointmentManagement'
import DoctorManagement from '../doctors/DoctorManagement'
import PatientRecords from '../patients/PatientRecords'
import MedicalInventory from '../inventory/MedicalInventory'
import ScheduleManagement from '../schedule/ScheduleManagement'
import { useAdmin } from '../../../context/AdminContext'

function AdminContent({ isDark, toggleTheme, onExit }) {
  const { currentView } = useAdmin()

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />
      case 'appointments':
        return <AppointmentManagement />
      case 'doctors':
        return <DoctorManagement />
      case 'patients':
        return <PatientRecords />
      case 'inventory':
        return <MedicalInventory />
      case 'schedule':
        return <ScheduleManagement />
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

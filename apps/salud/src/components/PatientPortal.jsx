import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Calendar,
  Clock,
  FileText,
  Pill,
  CreditCard,
  MessageSquare,
  Activity,
  Heart,
  Thermometer,
  Scale,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Download,
  Send,
  LogOut,
  Home,
  Bell,
  Settings,
  HelpCircle,
  Phone,
  Mail,
  Video,
  X,
  Plus,
  Search,
  Filter,
  Clipboard,
  Stethoscope,
  TestTube,
  Syringe,
  Eye
} from 'lucide-react'

// Mock patient data - In production this would come from authentication/API
const MOCK_PATIENT = {
  id: 'P-2024-001',
  name: 'María García',
  email: 'maria.garcia@email.com',
  phone: '+1 555-987-6543',
  dateOfBirth: '1985-03-15',
  bloodType: 'A+',
  allergies: ['Penicillin', 'Latex'],
  insurance: {
    provider: 'HealthPlus Insurance',
    policyNumber: 'HP-2024-78945',
    groupNumber: 'GRP-5678'
  },
  primaryDoctor: {
    name: 'Dr. Roberto Sánchez',
    specialty: 'Internal Medicine',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'
  }
}

// Mock upcoming appointments
const MOCK_APPOINTMENTS = [
  {
    id: 'APT-001',
    date: '2024-02-05',
    time: '09:30 AM',
    doctor: 'Dr. Roberto Sánchez',
    specialty: 'Internal Medicine',
    type: 'Follow-up Visit',
    status: 'confirmed',
    location: 'Main Campus - Building A, Room 305'
  },
  {
    id: 'APT-002',
    date: '2024-02-12',
    time: '02:00 PM',
    doctor: 'Dra. Laura Mendez',
    specialty: 'Cardiology',
    type: 'Annual Checkup',
    status: 'pending',
    location: 'Heart Center - 2nd Floor'
  },
  {
    id: 'APT-003',
    date: '2024-02-20',
    time: '11:00 AM',
    doctor: 'Dr. Carlos Vega',
    specialty: 'Laboratory',
    type: 'Blood Work',
    status: 'confirmed',
    location: 'Lab Center - Ground Floor'
  }
]

// Mock prescriptions
const MOCK_PRESCRIPTIONS = [
  {
    id: 'RX-001',
    name: 'Lisinopril 10mg',
    dosage: '1 tablet daily',
    prescribedBy: 'Dr. Roberto Sánchez',
    startDate: '2024-01-15',
    refillsRemaining: 3,
    status: 'active'
  },
  {
    id: 'RX-002',
    name: 'Metformin 500mg',
    dosage: '1 tablet twice daily with meals',
    prescribedBy: 'Dr. Roberto Sánchez',
    startDate: '2024-01-15',
    refillsRemaining: 5,
    status: 'active'
  },
  {
    id: 'RX-003',
    name: 'Vitamin D3 1000 IU',
    dosage: '1 capsule daily',
    prescribedBy: 'Dra. Laura Mendez',
    startDate: '2023-12-01',
    refillsRemaining: 0,
    status: 'needs-refill'
  }
]

// Mock lab results
const MOCK_LAB_RESULTS = [
  {
    id: 'LAB-001',
    name: 'Complete Blood Count (CBC)',
    date: '2024-01-20',
    status: 'normal',
    orderedBy: 'Dr. Roberto Sánchez'
  },
  {
    id: 'LAB-002',
    name: 'Comprehensive Metabolic Panel',
    date: '2024-01-20',
    status: 'review',
    orderedBy: 'Dr. Roberto Sánchez'
  },
  {
    id: 'LAB-003',
    name: 'Lipid Panel',
    date: '2024-01-20',
    status: 'normal',
    orderedBy: 'Dra. Laura Mendez'
  },
  {
    id: 'LAB-004',
    name: 'HbA1c (Glycated Hemoglobin)',
    date: '2024-01-20',
    status: 'attention',
    orderedBy: 'Dr. Roberto Sánchez'
  }
]

// Mock billing
const MOCK_BILLING = [
  {
    id: 'INV-001',
    date: '2024-01-20',
    description: 'Office Visit - Dr. Sánchez',
    amount: 150.00,
    insurance: 120.00,
    patientResponsibility: 30.00,
    status: 'pending'
  },
  {
    id: 'INV-002',
    date: '2024-01-20',
    description: 'Laboratory Services',
    amount: 275.00,
    insurance: 220.00,
    patientResponsibility: 55.00,
    status: 'pending'
  },
  {
    id: 'INV-003',
    date: '2023-12-15',
    description: 'Annual Physical Exam',
    amount: 200.00,
    insurance: 200.00,
    patientResponsibility: 0.00,
    status: 'paid'
  }
]

// Mock messages
const MOCK_MESSAGES = [
  {
    id: 'MSG-001',
    from: 'Dr. Roberto Sánchez',
    subject: 'Lab Results Review',
    preview: 'Your recent lab results are in. Overall looking good...',
    date: '2024-01-22',
    unread: true
  },
  {
    id: 'MSG-002',
    from: 'Nurse Sarah Johnson',
    subject: 'Appointment Reminder',
    preview: 'This is a reminder about your upcoming appointment...',
    date: '2024-01-21',
    unread: false
  },
  {
    id: 'MSG-003',
    from: 'Billing Department',
    subject: 'Statement Available',
    preview: 'Your January statement is now available to view...',
    date: '2024-01-20',
    unread: false
  }
]

// Portal tabs
const PORTAL_TABS = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'appointments', name: 'Appointments', icon: Calendar },
  { id: 'records', name: 'Medical Records', icon: FileText },
  { id: 'prescriptions', name: 'Prescriptions', icon: Pill },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'messages', name: 'Messages', icon: MessageSquare }
]

// Vitals data
const MOCK_VITALS = {
  bloodPressure: '120/80',
  heartRate: '72 bpm',
  temperature: '98.6°F',
  weight: '165 lbs',
  lastUpdated: '2024-01-20'
}

export default function PatientPortal({ onExit }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [patient] = useState(MOCK_PATIENT)
  const [appointments] = useState(MOCK_APPOINTMENTS)
  const [prescriptions] = useState(MOCK_PRESCRIPTIONS)
  const [labResults] = useState(MOCK_LAB_RESULTS)
  const [billing] = useState(MOCK_BILLING)
  const [messages] = useState(MOCK_MESSAGES)
  const [showMessageModal, setShowMessageModal] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const showToast = (message) => {
    setToastMessage(message)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-500/20 text-green-500',
      pending: 'bg-yellow-500/20 text-yellow-500',
      cancelled: 'bg-red-500/20 text-red-500',
      active: 'bg-green-500/20 text-green-500',
      'needs-refill': 'bg-orange-500/20 text-orange-500',
      normal: 'bg-green-500/20 text-green-500',
      review: 'bg-blue-500/20 text-blue-500',
      attention: 'bg-red-500/20 text-red-500',
      paid: 'bg-green-500/20 text-green-500'
    }
    return styles[status] || 'bg-gray-500/20 text-gray-500'
  }

  const unreadCount = messages.filter(m => m.unread).length
  const pendingBalance = billing
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + b.patientResponsibility, 0)

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Welcome, {patient.name.split(' ')[0]}</h1>
                <p className="text-sm text-muted">Patient ID: {patient.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted hover:text-primary transition">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={onExit}
                className="flex items-center gap-2 text-muted hover:text-primary transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Exit Portal</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-surface border-b border-border overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {PORTAL_TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
                  {tab.id === 'messages' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{appointments.length}</p>
                      <p className="text-sm text-muted">Upcoming Appointments</p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface rounded-xl p-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-3">
                    <Pill className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'active').length}</p>
                      <p className="text-sm text-muted">Active Prescriptions</p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface rounded-xl p-4 border-l-4 border-purple-500">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{unreadCount}</p>
                      <p className="text-sm text-muted">Unread Messages</p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface rounded-xl p-4 border-l-4 border-orange-500">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">${pendingBalance.toFixed(2)}</p>
                      <p className="text-sm text-muted">Balance Due</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Care Provider */}
              <div className="bg-surface rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Your Care Team</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={patient.primaryDoctor.image}
                    alt={patient.primaryDoctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{patient.primaryDoctor.name}</h4>
                    <p className="text-muted">{patient.primaryDoctor.specialty}</p>
                    <p className="text-sm text-muted">Primary Care Provider</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('messages')
                        setShowMessageModal({ to: patient.primaryDoctor.name })
                      }}
                      className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition">
                      <Video className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Vitals Summary */}
              <div className="bg-surface rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Recent Vitals</h3>
                  <span className="text-sm text-muted">Last updated: {formatDate(MOCK_VITALS.lastUpdated)}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-bg rounded-xl text-center">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-red-500" />
                    <p className="text-sm text-muted">Blood Pressure</p>
                    <p className="font-bold text-lg">{MOCK_VITALS.bloodPressure}</p>
                  </div>
                  <div className="p-4 bg-bg rounded-xl text-center">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                    <p className="text-sm text-muted">Heart Rate</p>
                    <p className="font-bold text-lg">{MOCK_VITALS.heartRate}</p>
                  </div>
                  <div className="p-4 bg-bg rounded-xl text-center">
                    <Thermometer className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                    <p className="text-sm text-muted">Temperature</p>
                    <p className="font-bold text-lg">{MOCK_VITALS.temperature}</p>
                  </div>
                  <div className="p-4 bg-bg rounded-xl text-center">
                    <Scale className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted">Weight</p>
                    <p className="font-bold text-lg">{MOCK_VITALS.weight}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments Preview */}
              <div className="bg-surface rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Upcoming Appointments</h3>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-accent text-sm font-medium hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {appointments.slice(0, 2).map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-3 bg-bg rounded-xl">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{apt.type}</h4>
                        <p className="text-sm text-muted">{apt.doctor} • {apt.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatDate(apt.date)}</p>
                        <p className="text-sm text-muted">{apt.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Alerts */}
              {prescriptions.some(p => p.status === 'needs-refill') && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-500">Prescription Refill Needed</h4>
                    <p className="text-sm text-muted mt-1">
                      {prescriptions.filter(p => p.status === 'needs-refill').map(p => p.name).join(', ')} needs to be refilled.
                    </p>
                    <button
                      onClick={() => setActiveTab('prescriptions')}
                      className="text-orange-500 text-sm font-medium mt-2 hover:underline"
                    >
                      Request Refill →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">My Appointments</h2>
                <button className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule New
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-surface rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-7 h-7 text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{apt.type}</h3>
                            <p className="text-muted">{apt.doctor} • {apt.specialty}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(apt.status)}`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(apt.date)} at {apt.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted">
                            <Home className="w-4 h-4" />
                            <span>{apt.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="text-sm bg-bg px-3 py-1.5 rounded-lg hover:bg-accent/10 transition">
                            Reschedule
                          </button>
                          <button className="text-sm bg-bg px-3 py-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition">
                            Cancel
                          </button>
                          <button className="text-sm bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent/90 transition ml-auto">
                            Check In
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Medical Records</h2>

              {/* Patient Info Card */}
              <div className="bg-surface rounded-2xl p-6">
                <h3 className="font-bold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted">Full Name</p>
                    <p className="font-semibold">{patient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Date of Birth</p>
                    <p className="font-semibold">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Blood Type</p>
                    <p className="font-semibold">{patient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Email</p>
                    <p className="font-semibold">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Phone</p>
                    <p className="font-semibold">{patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Allergies</p>
                    <div className="flex gap-1 flex-wrap">
                      {patient.allergies.map((allergy, idx) => (
                        <span key={idx} className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded-full">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Info */}
              <div className="bg-surface rounded-2xl p-6">
                <h3 className="font-bold mb-4">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted">Provider</p>
                    <p className="font-semibold">{patient.insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Policy Number</p>
                    <p className="font-semibold">{patient.insurance.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Group Number</p>
                    <p className="font-semibold">{patient.insurance.groupNumber}</p>
                  </div>
                </div>
              </div>

              {/* Lab Results */}
              <div className="bg-surface rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Lab Results</h3>
                  <button className="text-accent text-sm font-medium hover:underline flex items-center gap-1">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
                <div className="space-y-3">
                  {labResults.map((lab) => (
                    <div key={lab.id} className="flex items-center gap-4 p-3 bg-bg rounded-xl">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <TestTube className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{lab.name}</h4>
                        <p className="text-sm text-muted">{formatDate(lab.date)} • {lab.orderedBy}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(lab.status)}`}>
                        {lab.status === 'attention' ? 'Needs Attention' : lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                      </span>
                      <button className="p-2 text-muted hover:text-accent transition">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-muted hover:text-accent transition">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <motion.div
              key="prescriptions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">My Prescriptions</h2>
                <button className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition flex items-center gap-2">
                  <Syringe className="w-4 h-4" />
                  Request Refill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="bg-surface rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                          <Pill className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-bold">{rx.name}</h3>
                          <p className="text-sm text-muted">{rx.dosage}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(rx.status)}`}>
                        {rx.status === 'needs-refill' ? 'Needs Refill' : 'Active'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Prescribed by:</span>
                        <span>{rx.prescribedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Start Date:</span>
                        <span>{formatDate(rx.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Refills Remaining:</span>
                        <span className={rx.refillsRemaining === 0 ? 'text-red-500 font-semibold' : ''}>
                          {rx.refillsRemaining}
                        </span>
                      </div>
                    </div>
                    {rx.status === 'needs-refill' && (
                      <button
                        onClick={() => showToast('Refill request sent!')}
                        className="w-full mt-4 bg-accent text-white py-2 rounded-lg font-semibold hover:bg-accent/90 transition"
                      >
                        Request Refill
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Billing & Payments</h2>

              {/* Balance Summary */}
              <div className="bg-surface rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted">Current Balance</p>
                    <p className="text-3xl font-bold text-accent">${pendingBalance.toFixed(2)}</p>
                  </div>
                  <button className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition">
                    Pay Now
                  </button>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-surface rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold">Recent Statements</h3>
                </div>
                <div className="divide-y divide-border">
                  {billing.map((bill) => (
                    <div key={bill.id} className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{bill.description}</h4>
                        <p className="text-sm text-muted">{formatDate(bill.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${bill.patientResponsibility.toFixed(2)}</p>
                        <p className="text-xs text-muted">of ${bill.amount.toFixed(2)}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(bill.status)}`}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
                      <button className="p-2 text-muted hover:text-accent transition">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-surface rounded-2xl p-6">
                <h3 className="font-bold mb-4">Payment Methods</h3>
                <div className="flex items-center gap-4 p-3 bg-bg rounded-xl">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted">Expires 12/25</p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Default</span>
                </div>
                <button className="w-full mt-4 border-2 border-dashed border-border py-3 rounded-xl text-muted hover:border-accent hover:text-accent transition flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Messages</h2>
                <button
                  onClick={() => setShowMessageModal({ to: '' })}
                  className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Message
                </button>
              </div>

              <div className="bg-surface rounded-2xl overflow-hidden">
                <div className="divide-y divide-border">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setShowMessageModal(msg)}
                      className="w-full p-4 flex items-start gap-4 hover:bg-bg/50 transition text-left"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.unread ? 'bg-accent' : 'bg-accent/10'}`}>
                        <User className={`w-5 h-5 ${msg.unread ? 'text-white' : 'text-accent'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${msg.unread ? 'text-primary' : 'text-muted'}`}>{msg.from}</h4>
                          <span className="text-xs text-muted">{formatDate(msg.date)}</span>
                        </div>
                        <p className={`font-medium ${msg.unread ? '' : 'text-muted'}`}>{msg.subject}</p>
                        <p className="text-sm text-muted truncate">{msg.preview}</p>
                      </div>
                      {msg.unread && (
                        <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0 mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMessageModal(null)}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-surface rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowMessageModal(null)}
                className="absolute top-4 right-4 text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>

              {showMessageModal.id ? (
                // Viewing a message
                <>
                  <div className="mb-4">
                    <p className="text-sm text-muted">From: {showMessageModal.from}</p>
                    <h3 className="text-xl font-bold">{showMessageModal.subject}</h3>
                    <p className="text-sm text-muted">{formatDate(showMessageModal.date)}</p>
                  </div>
                  <div className="bg-bg rounded-xl p-4 mb-4">
                    <p>{showMessageModal.preview} This is the full message content that would appear here when viewing a message.</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={3}
                      className="w-full px-4 py-3 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none resize-none mb-3"
                    />
                    <button
                      onClick={() => {
                        showToast('Reply sent!')
                        setShowMessageModal(null)
                        setNewMessage('')
                      }}
                      className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Reply
                    </button>
                  </div>
                </>
              ) : (
                // Composing new message
                <>
                  <h3 className="text-xl font-bold mb-4">New Message</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted mb-2 block">To:</label>
                      <select className="w-full px-4 py-3 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none">
                        <option>Dr. Roberto Sánchez - Internal Medicine</option>
                        <option>Dra. Laura Mendez - Cardiology</option>
                        <option>Nurse Sarah Johnson</option>
                        <option>Billing Department</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted mb-2 block">Subject:</label>
                      <input
                        type="text"
                        placeholder="Enter subject"
                        className="w-full px-4 py-3 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted mb-2 block">Message:</label>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={5}
                        className="w-full px-4 py-3 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none resize-none"
                      />
                    </div>
                    <button
                      onClick={() => {
                        showToast('Message sent!')
                        setShowMessageModal(null)
                        setNewMessage('')
                      }}
                      className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

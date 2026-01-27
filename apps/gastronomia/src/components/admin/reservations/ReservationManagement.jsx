import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  Search,
  Clock,
  Users,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  UserCheck,
  MapPin,
  Star,
  AlertCircle
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const DATE_FILTERS = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'week', label: 'This Week' },
  { id: 'all', label: 'All' }
]

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'seated', label: 'Seated' },
  { id: 'completed', label: 'Completed' },
  { id: 'no-show', label: 'No Show' }
]

function StatsBar({ reservations }) {
  const today = new Date().toISOString().split('T')[0]

  const stats = useMemo(() => {
    const todayRes = reservations.filter(r => r.date === today)
    return {
      todayTotal: todayRes.length,
      pending: todayRes.filter(r => r.status === 'pending').length,
      confirmed: todayRes.filter(r => r.status === 'confirmed').length,
      seated: todayRes.filter(r => r.status === 'seated').length,
      expectedGuests: todayRes
        .filter(r => r.status !== 'cancelled' && r.status !== 'no-show')
        .reduce((sum, r) => sum + r.partySize, 0)
    }
  }, [reservations, today])

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="bg-surface rounded-lg border border-border p-3 text-center">
        <p className="text-2xl font-bold text-text">{stats.todayTotal}</p>
        <p className="text-xs text-muted">Today's Reservations</p>
      </div>
      <div className="bg-amber-500/10 rounded-lg border border-amber-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
        <p className="text-xs text-muted">Pending</p>
      </div>
      <div className="bg-blue-500/10 rounded-lg border border-blue-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.confirmed}</p>
        <p className="text-xs text-muted">Confirmed</p>
      </div>
      <div className="bg-purple-500/10 rounded-lg border border-purple-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.seated}</p>
        <p className="text-xs text-muted">Seated</p>
      </div>
      <div className="bg-primary/10 rounded-lg border border-primary/20 p-3 text-center">
        <p className="text-2xl font-bold text-primary">{stats.expectedGuests}</p>
        <p className="text-xs text-muted">Expected Guests</p>
      </div>
    </div>
  )
}

function ReservationCard({ reservation, tables, onUpdateStatus, onAssignTable, onSeat }) {
  const [expanded, setExpanded] = useState(false)
  const [selectedTable, setSelectedTable] = useState(reservation.tableId || '')

  const availableTables = useMemo(() => {
    return tables.filter(t =>
      t.status === 'available' && t.capacity >= reservation.partySize
    )
  }, [tables, reservation.partySize])

  const handleAssignTable = () => {
    if (selectedTable) {
      onAssignTable(reservation.id, selectedTable)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-bg/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-primary">{reservation.time.split(':')[0]}</span>
              <span className="text-[10px] text-muted">{reservation.time.split(':')[1]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text">{reservation.customerName}</span>
                <StatusBadge status={reservation.status} size="xs" />
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {reservation.partySize} guests
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {reservation.tableName || 'Unassigned'}
                </span>
              </div>
              {reservation.occasion && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3" />
                  {reservation.occasion}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">
              {new Date(reservation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              {/* Contact Info */}
              <div className="bg-bg rounded-lg p-3">
                <h4 className="text-sm font-medium text-text mb-2">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <Phone className="w-4 h-4" />
                    {reservation.customerPhone}
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Mail className="w-4 h-4" />
                    {reservation.customerEmail}
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {reservation.specialRequests && (
                <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Special Requests</p>
                      <p className="text-sm text-muted mt-1">{reservation.specialRequests}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Assignment */}
              {!reservation.tableId && reservation.status !== 'cancelled' && reservation.status !== 'no-show' && (
                <div className="bg-bg rounded-lg p-3">
                  <h4 className="text-sm font-medium text-text mb-2">Assign Table</h4>
                  <div className="flex gap-2">
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select a table...</option>
                      {availableTables.map(table => (
                        <option key={table.id} value={table.id}>
                          {table.name} ({table.capacity} seats) - {table.areaName}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignTable}
                      disabled={!selectedTable}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {reservation.status !== 'completed' && reservation.status !== 'cancelled' && reservation.status !== 'no-show' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {reservation.status === 'pending' && (
                    <button
                      onClick={() => onUpdateStatus(reservation.id, 'confirmed')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm
                    </button>
                  )}
                  {reservation.status === 'confirmed' && reservation.tableId && (
                    <button
                      onClick={() => onSeat(reservation.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      Seat Guests
                    </button>
                  )}
                  {reservation.status === 'seated' && (
                    <button
                      onClick={() => onUpdateStatus(reservation.id, 'completed')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => onUpdateStatus(reservation.id, 'no-show')}
                    className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg hover:bg-gray-500/20 transition-colors"
                  >
                    No Show
                  </button>
                  <button
                    onClick={() => onUpdateStatus(reservation.id, 'cancelled')}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Confirmation Code */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted">Confirmation Code</span>
                <span className="font-mono text-sm text-text">{reservation.confirmationCode}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ReservationManagement() {
  const { reservations, tables, loading, updateReservation, assignTable, seatReservation } = useAdminData()

  const [dateFilter, setDateFilter] = useState('today')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReservations = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const weekEndStr = weekEnd.toISOString().split('T')[0]

    let result = [...reservations]

    // Date filter
    if (dateFilter === 'today') {
      result = result.filter(r => r.date === todayStr)
    } else if (dateFilter === 'tomorrow') {
      result = result.filter(r => r.date === tomorrowStr)
    } else if (dateFilter === 'week') {
      result = result.filter(r => r.date >= todayStr && r.date <= weekEndStr)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter)
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.customerName.toLowerCase().includes(query) ||
        r.customerPhone?.includes(query) ||
        r.confirmationCode.toLowerCase().includes(query)
      )
    }

    // Sort by date and time
    result.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })

    return result
  }, [reservations, dateFilter, statusFilter, searchQuery])

  const handleUpdateStatus = async (reservationId, status) => {
    await updateReservation(reservationId, { status })
  }

  const handleAssignTable = async (reservationId, tableId) => {
    await assignTable(reservationId, tableId)
  }

  const handleSeat = async (reservationId) => {
    await seatReservation(reservationId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading reservations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <StatsBar reservations={reservations} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl border border-border p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by name, phone, or confirmation code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Date Filter */}
          <div className="flex gap-2">
            {DATE_FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => setDateFilter(filter.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  dateFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-bg text-muted hover:text-text'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {STATUS_FILTERS.map(filter => (
              <option key={filter.id} value={filter.id}>{filter.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface rounded-xl border border-border p-8 text-center"
          >
            <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted opacity-50" />
            <p className="text-muted">No reservations found</p>
            <p className="text-sm text-muted mt-1">Try adjusting your filters</p>
          </motion.div>
        ) : (
          filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              tables={tables}
              onUpdateStatus={handleUpdateStatus}
              onAssignTable={handleAssignTable}
              onSeat={handleSeat}
            />
          ))
        )}
      </div>
    </div>
  )
}

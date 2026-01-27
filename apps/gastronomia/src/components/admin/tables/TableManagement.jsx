import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SquareStack,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  MapPin
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'

const AREA_COLORS = {
  main: 'bg-blue-500',
  window: 'bg-purple-500',
  patio: 'bg-green-500',
  private: 'bg-amber-500',
  bar: 'bg-pink-500'
}

function StatsBar({ tables }) {
  const stats = useMemo(() => {
    return {
      total: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      cleaning: tables.filter(t => t.status === 'cleaning').length,
      totalCapacity: tables.reduce((sum, t) => sum + t.capacity, 0),
      currentGuests: tables.reduce((sum, t) => sum + (t.guestCount || 0), 0)
    }
  }, [tables])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      <div className="bg-surface rounded-lg border border-border p-3 text-center">
        <p className="text-2xl font-bold text-text">{stats.total}</p>
        <p className="text-xs text-muted">Total Tables</p>
      </div>
      <div className="bg-green-500/10 rounded-lg border border-green-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available}</p>
        <p className="text-xs text-muted">Available</p>
      </div>
      <div className="bg-red-500/10 rounded-lg border border-red-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.occupied}</p>
        <p className="text-xs text-muted">Occupied</p>
      </div>
      <div className="bg-amber-500/10 rounded-lg border border-amber-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.reserved}</p>
        <p className="text-xs text-muted">Reserved</p>
      </div>
      <div className="bg-blue-500/10 rounded-lg border border-blue-500/20 p-3 text-center">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.cleaning}</p>
        <p className="text-xs text-muted">Cleaning</p>
      </div>
      <div className="bg-primary/10 rounded-lg border border-primary/20 p-3 text-center">
        <p className="text-2xl font-bold text-primary">{stats.currentGuests}</p>
        <p className="text-xs text-muted">Guests</p>
      </div>
      <div className="bg-surface rounded-lg border border-border p-3 text-center">
        <p className="text-2xl font-bold text-text">{stats.totalCapacity}</p>
        <p className="text-xs text-muted">Total Seats</p>
      </div>
    </div>
  )
}

function TableCard({ table, onClearTable, onMarkAvailable }) {
  const statusColors = {
    available: 'border-green-500 bg-green-500/5',
    occupied: 'border-red-500 bg-red-500/5',
    reserved: 'border-amber-500 bg-amber-500/5',
    cleaning: 'border-blue-500 bg-blue-500/5'
  }

  const statusIcons = {
    available: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    occupied: <Users className="w-5 h-5 text-red-500" />,
    reserved: <Clock className="w-5 h-5 text-amber-500" />,
    cleaning: <Sparkles className="w-5 h-5 text-blue-500" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border-2 overflow-hidden ${statusColors[table.status] || 'border-border'}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {statusIcons[table.status]}
            <h3 className="font-bold text-text">{table.name}</h3>
          </div>
          <StatusBadge status={table.status} size="sm" />
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted flex items-center gap-1">
              <Users className="w-4 h-4" />
              Capacity
            </span>
            <span className="font-medium text-text">{table.capacity} seats</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Area
            </span>
            <span className="font-medium text-text flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${AREA_COLORS[table.area]}`} />
              {table.areaName}
            </span>
          </div>

          {table.status === 'occupied' && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Guests</span>
              <span className="font-medium text-text">{table.guestCount} / {table.capacity}</span>
            </div>
          )}

          {table.status === 'reserved' && table.reservationTime && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Reserved for</span>
              <span className="font-medium text-amber-500">{table.reservationTime}</span>
            </div>
          )}

          {table.isPrivate && (
            <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full text-center">
              Private Room • Min ${table.minSpend}
            </div>
          )}

          {table.isWalkInOnly && (
            <div className="text-xs text-muted bg-bg px-2 py-1 rounded-full text-center">
              Walk-in Only
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {table.status === 'occupied' && (
            <button
              onClick={() => onClearTable(table.id)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Clear Table
            </button>
          )}
          {table.status === 'cleaning' && (
            <button
              onClick={() => onMarkAvailable(table.id)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Available
            </button>
          )}
          {table.status === 'available' && (
            <div className="flex-1 text-center text-sm text-green-500 font-medium py-2">
              Ready for seating
            </div>
          )}
          {table.status === 'reserved' && (
            <div className="flex-1 text-center text-sm text-amber-500 font-medium py-2">
              Awaiting guests
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function FloorPlanLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
      <div className="flex items-center gap-1">
        <span className={`w-3 h-3 rounded-full ${AREA_COLORS.main}`} />
        <span>Main Dining</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`w-3 h-3 rounded-full ${AREA_COLORS.window}`} />
        <span>Window</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`w-3 h-3 rounded-full ${AREA_COLORS.patio}`} />
        <span>Patio</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`w-3 h-3 rounded-full ${AREA_COLORS.private}`} />
        <span>Private</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`w-3 h-3 rounded-full ${AREA_COLORS.bar}`} />
        <span>Bar</span>
      </div>
    </div>
  )
}

export default function TableManagement() {
  const { tables, loading, clearTable, markTableAvailable } = useAdminData()

  const [areaFilter, setAreaFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const areas = useMemo(() => {
    const unique = [...new Set(tables.map(t => t.area))]
    return unique.map(area => ({
      id: area,
      name: tables.find(t => t.area === area)?.areaName || area
    }))
  }, [tables])

  const filteredTables = useMemo(() => {
    let result = [...tables]

    if (areaFilter !== 'all') {
      result = result.filter(t => t.area === areaFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter)
    }

    // Sort by area, then by name
    result.sort((a, b) => {
      if (a.area !== b.area) return a.area.localeCompare(b.area)
      return a.name.localeCompare(b.name)
    })

    return result
  }, [tables, areaFilter, statusFilter])

  const handleClearTable = async (tableId) => {
    await clearTable(tableId)
  }

  const handleMarkAvailable = async (tableId) => {
    await markTableAvailable(tableId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading tables...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <StatsBar tables={tables} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl border border-border p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {/* Area Filter */}
            <button
              onClick={() => setAreaFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                areaFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-bg text-muted hover:text-text'
              }`}
            >
              All Areas
            </button>
            {areas.map(area => (
              <button
                key={area.id}
                onClick={() => setAreaFilter(area.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                  areaFilter === area.id
                    ? 'bg-primary text-white'
                    : 'bg-bg text-muted hover:text-text'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${AREA_COLORS[area.id]}`} />
                {area.name}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <FloorPlanLegend />
        </div>
      </motion.div>

      {/* Tables Grid */}
      {filteredTables.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface rounded-xl border border-border p-8 text-center"
        >
          <SquareStack className="w-12 h-12 mx-auto mb-3 text-muted opacity-50" />
          <p className="text-muted">No tables found</p>
          <p className="text-sm text-muted mt-1">Try adjusting your filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onClearTable={handleClearTable}
              onMarkAvailable={handleMarkAvailable}
            />
          ))}
        </div>
      )}
    </div>
  )
}

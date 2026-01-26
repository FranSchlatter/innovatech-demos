import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BedDouble,
  Search,
  Filter,
  Grid3X3,
  List,
  Edit2,
  User,
  Users
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'
import RoomEditModal from './RoomEditModal'

const statusFilters = [
  { value: 'all', label: 'All Rooms' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' }
]

const floorFilters = [
  { value: 'all', label: 'All Floors' },
  { value: '0', label: 'Ground Floor' },
  { value: '1', label: '1st Floor' },
  { value: '2', label: '2nd Floor' },
  { value: '3', label: '3rd Floor' },
  { value: '4', label: '4th Floor' },
  { value: '5', label: '5th Floor' },
  { value: '6', label: '6th Floor' }
]

const typeFilters = [
  { value: 'all', label: 'All Types' },
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'presidential', label: 'Presidential' },
  { value: 'family', label: 'Family' },
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium' }
]

function RoomCard({ room, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="bg-surface rounded-xl border border-border p-4 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-text">Room {room.roomNumber}</h3>
          <p className="text-sm text-muted capitalize">{room.type}</p>
        </div>
        <StatusBadge status={room.status} size="sm" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted" />
          <span className="text-muted">Capacity:</span>
          <span className="text-text">{room.capacity} guests</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BedDouble className="w-4 h-4 text-muted" />
          <span className="text-muted">Floor:</span>
          <span className="text-text">{room.floor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">Price:</span>
          <span className="text-text font-medium">${room.price}/night</span>
        </div>
      </div>

      {room.currentGuest && (
        <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg mb-3">
          <User className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-600 dark:text-blue-400 truncate">
            {room.currentGuest}
          </span>
        </div>
      )}

      <button
        onClick={() => onEdit(room)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2
          bg-bg hover:bg-primary hover:text-primary-contrast
          text-sm font-medium rounded-lg transition-colors"
      >
        <Edit2 className="w-4 h-4" />
        Edit Room
      </button>
    </motion.div>
  )
}

function RoomRow({ room, onEdit }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-border hover:bg-bg/50 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BedDouble className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-text">Room {room.roomNumber}</p>
            <p className="text-xs text-muted capitalize">{room.type}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-text">Floor {room.floor}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-text">{room.capacity}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-text">${room.price}</span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={room.status} size="sm" />
      </td>
      <td className="px-4 py-3">
        {room.currentGuest ? (
          <span className="text-sm text-text">{room.currentGuest}</span>
        ) : (
          <span className="text-sm text-muted">-</span>
        )}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onEdit(room)}
          className="p-2 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </td>
    </motion.tr>
  )
}

export default function RoomManagement() {
  const { rooms, updateRoomStatus } = useAdminData()
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [floorFilter, setFloorFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editingRoom, setEditingRoom] = useState(null)

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          room.roomNumber?.toLowerCase().includes(query) ||
          room.name?.toLowerCase().includes(query) ||
          room.type?.toLowerCase().includes(query) ||
          room.currentGuest?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && room.status !== statusFilter) return false

      // Floor filter
      if (floorFilter !== 'all' && room.floor.toString() !== floorFilter) return false

      // Type filter
      if (typeFilter !== 'all' && room.type !== typeFilter) return false

      return true
    })
  }, [rooms, searchQuery, statusFilter, floorFilter, typeFilter])

  const handleSaveRoom = async (roomId, data) => {
    await updateRoomStatus(roomId, data.status, data.notes)
  }

  // Status counts
  const statusCounts = useMemo(() => ({
    all: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
  }), [rooms])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Room Management</h2>
          <p className="text-sm text-muted">
            {filteredRooms.length} of {rooms.length} rooms
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-bg rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-contrast'
                : 'text-muted hover:text-text'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-primary text-primary-contrast'
                : 'text-muted hover:text-text'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search rooms, guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg
                text-text placeholder:text-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {statusFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label} ({statusCounts[filter.value]})
                </option>
              ))}
            </select>

            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {floorFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {typeFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={setEditingRoom}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">Room</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">Floor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">Guest</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <RoomRow
                    key={room.id}
                    room={room}
                    onEdit={setEditingRoom}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BedDouble className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">No rooms found</h3>
          <p className="text-sm text-muted">
            Try adjusting your filters or search query
          </p>
        </motion.div>
      )}

      {/* Edit Modal */}
      <RoomEditModal
        room={editingRoom}
        isOpen={!!editingRoom}
        onClose={() => setEditingRoom(null)}
        onSave={handleSaveRoom}
      />
    </div>
  )
}

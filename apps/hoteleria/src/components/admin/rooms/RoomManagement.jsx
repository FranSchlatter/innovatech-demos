import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BedDouble,
  Search,
  Filter,
  Grid3X3,
  List,
  Building2,
  Edit2,
  User,
  Users,
  UserCog
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { useTranslation } from '../../../i18n/LanguageProvider'
import StatusBadge from '../shared/StatusBadge'
import RoomEditModal from './RoomEditModal'

// Status → tile styles for the building map (static classes for Tailwind).
// Labels are resolved at render time via t('admin.rooms.mapStatus.<key>').
const MAP_STATUS = {
  available: { dot: 'bg-green-500', tile: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20', icon: 'text-green-600 dark:text-green-400' },
  occupied: { dot: 'bg-blue-500', tile: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20', icon: 'text-blue-600 dark:text-blue-400' },
  cleaning: { dot: 'bg-purple-500', tile: 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20', icon: 'text-purple-600 dark:text-purple-400' },
  maintenance: { dot: 'bg-amber-500', tile: 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20', icon: 'text-amber-600 dark:text-amber-400' }
}

function RoomMap({ rooms, onEdit }) {
  const { t } = useTranslation()
  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => b - a)

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
        {Object.entries(MAP_STATUS).map(([key, s]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${s.dot}`} />
            <span className="text-xs text-muted">{t(`admin.rooms.mapStatus.${key}`)}</span>
          </div>
        ))}
      </div>

      {/* Building — top floor first */}
      <div className="space-y-3">
        {floors.map((floor) => {
          const floorRooms = rooms
            .filter((r) => r.floor === floor)
            .sort((a, b) => (a.roomNumber || '').localeCompare(b.roomNumber || ''))
          const occupied = floorRooms.filter((r) => r.status === 'occupied').length

          return (
            <div key={floor} className="flex gap-3 sm:gap-4 items-stretch">
              {/* Floor spine */}
              <div className="w-14 sm:w-20 shrink-0 flex flex-col justify-center text-right pr-3 border-r border-border">
                <p className="text-sm font-bold text-text leading-tight">{t('admin.rooms.floor', { floor })}</p>
                <p className="text-[11px] text-muted">{t('admin.rooms.floorOcc', { occupied, total: floorRooms.length })}</p>
              </div>

              {/* Rooms on this floor */}
              <div className="flex flex-wrap gap-2 py-1">
                {floorRooms.map((room) => {
                  const s = MAP_STATUS[room.status] || MAP_STATUS.available
                  const statusLabel = t(`admin.rooms.mapStatus.${room.status in MAP_STATUS ? room.status : 'available'}`)
                  return (
                    <button
                      key={room.id}
                      onClick={() => onEdit(room)}
                      title={`${t('common.labels.room')} ${room.roomNumber} · ${statusLabel}${room.currentGuest ? ` · ${room.currentGuest}` : ''}`}
                      className={`relative w-[4.25rem] h-[4.25rem] rounded-lg border flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${s.tile}`}
                    >
                      <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${s.dot}`} />
                      <BedDouble className={`w-4 h-4 ${s.icon}`} />
                      <span className="text-xs font-semibold text-text mt-1">{room.roomNumber}</span>
                      {room.currentGuest && (
                        <User className="absolute bottom-1 left-1.5 w-3 h-3 text-muted" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Filter option values + their translation keys (resolved at render time).
const statusFilters = [
  { value: 'all', labelKey: 'admin.rooms.filters.allRooms' },
  { value: 'available', labelKey: 'common.status.available' },
  { value: 'occupied', labelKey: 'common.status.occupied' },
  { value: 'cleaning', labelKey: 'admin.rooms.mapStatus.cleaning' },
  { value: 'maintenance', labelKey: 'admin.rooms.mapStatus.maintenance' }
]

const floorFilters = [
  { value: 'all', labelKey: 'admin.rooms.filters.allFloors' },
  { value: '0', labelKey: 'admin.rooms.filters.groundFloor' },
  { value: '1', labelKey: 'admin.rooms.filters.floor1' },
  { value: '2', labelKey: 'admin.rooms.filters.floor2' },
  { value: '3', labelKey: 'admin.rooms.filters.floor3' },
  { value: '4', labelKey: 'admin.rooms.filters.floor4' },
  { value: '5', labelKey: 'admin.rooms.filters.floor5' },
  { value: '6', labelKey: 'admin.rooms.filters.floor6' }
]

const typeFilters = [
  { value: 'all', labelKey: 'admin.rooms.filters.allTypes' },
  { value: 'standard', labelKey: 'admin.rooms.filters.standard' },
  { value: 'deluxe', labelKey: 'admin.rooms.filters.deluxe' },
  { value: 'suite', labelKey: 'admin.rooms.filters.suite' },
  { value: 'presidential', labelKey: 'admin.rooms.filters.presidential' },
  { value: 'family', labelKey: 'admin.rooms.filters.family' },
  { value: 'economy', labelKey: 'admin.rooms.filters.economy' },
  { value: 'premium', labelKey: 'admin.rooms.filters.premium' }
]

function RoomCard({ room, onEdit, managerName }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="bg-surface rounded-xl border border-border p-4 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-text">{t('common.labels.room')} {room.roomNumber}</h3>
          <p className="text-sm text-muted capitalize">{room.type}</p>
        </div>
        <StatusBadge status={room.status} size="sm" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted" />
          <span className="text-muted">{t('admin.rooms.capacity')}:</span>
          <span className="text-text">{t('admin.rooms.capacityGuests', { count: room.capacity })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BedDouble className="w-4 h-4 text-muted" />
          <span className="text-muted">{t('admin.rooms.table.floor')}:</span>
          <span className="text-text">{room.floor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">{t('common.labels.price')}:</span>
          <span className="text-text font-medium">${room.price}{t('admin.rooms.perNight')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <UserCog className="w-4 h-4 text-muted" />
          <span className="text-muted">{t('admin.rooms.manager')}:</span>
          <span className={managerName ? 'text-text' : 'text-muted'}>{managerName || t('admin.rooms.unassigned')}</span>
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
        {t('admin.rooms.editRoom')}
      </button>
    </motion.div>
  )
}

function RoomRow({ room, onEdit, managerName }) {
  const { t } = useTranslation()
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
            <p className="font-medium text-text">{t('common.labels.room')} {room.roomNumber}</p>
            <p className="text-xs text-muted capitalize">{room.type}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-text">{t('admin.rooms.floor', { floor: room.floor })}</span>
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
        {managerName ? (
          <span className="text-sm text-text">{managerName}</span>
        ) : (
          <span className="text-sm text-muted">{t('admin.rooms.unassigned')}</span>
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
  const { rooms, staff, updateRoom } = useAdminData()
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [floorFilter, setFloorFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [managerFilter, setManagerFilter] = useState('all')
  const [editingRoom, setEditingRoom] = useState(null)

  // Resolve a manager id to a display name.
  const managerName = (id) => staff.find((s) => s.id === id)?.name || null

  // Managers that are actually assigned to at least one room (for the filter).
  const assignedManagers = useMemo(() => {
    const ids = [...new Set(rooms.map((r) => r.managerId).filter(Boolean))]
    return ids
      .map((id) => staff.find((s) => s.id === id))
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [rooms, staff])

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

      // Manager filter
      if (managerFilter === 'unassigned' && room.managerId) return false
      if (managerFilter !== 'all' && managerFilter !== 'unassigned' && room.managerId !== managerFilter) return false

      return true
    })
  }, [rooms, searchQuery, statusFilter, floorFilter, typeFilter, managerFilter])

  const handleSaveRoom = async (roomId, data) => {
    await updateRoom(roomId, data)
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
          <h2 className="text-xl font-bold text-text">{t('admin.rooms.title')}</h2>
          <p className="text-sm text-muted">
            {t('admin.rooms.countSummary', { filtered: filteredRooms.length, total: rooms.length })}
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
          <button
            onClick={() => setViewMode('map')}
            title={t('admin.rooms.buildingMap')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'map'
                ? 'bg-primary text-primary-contrast'
                : 'text-muted hover:text-text'
            }`}
          >
            <Building2 className="w-4 h-4" />
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
              placeholder={t('admin.rooms.searchPlaceholder')}
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
                  {t(filter.labelKey)} ({statusCounts[filter.value]})
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
                  {t(filter.labelKey)}
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
                  {t(filter.labelKey)}
                </option>
              ))}
            </select>

            <select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">{t('admin.rooms.filters.allManagers')}</option>
              <option value="unassigned">{t('admin.rooms.unassigned')}</option>
              {assignedManagers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room List */}
      {viewMode === 'map' ? (
        filteredRooms.length > 0 && <RoomMap rooms={filteredRooms} onEdit={setEditingRoom} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={setEditingRoom}
              managerName={managerName(room.managerId)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">{t('admin.rooms.table.room')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">{t('admin.rooms.table.floor')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">{t('admin.rooms.table.capacity')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">{t('admin.rooms.table.price')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">{t('admin.rooms.table.status')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">{t('admin.rooms.table.guest')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">{t('admin.rooms.table.manager')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase">{t('admin.rooms.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <RoomRow
                    key={room.id}
                    room={room}
                    onEdit={setEditingRoom}
                    managerName={managerName(room.managerId)}
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
          <h3 className="text-lg font-medium text-text mb-2">{t('admin.rooms.emptyTitle')}</h3>
          <p className="text-sm text-muted">
            {t('admin.rooms.emptyBody')}
          </p>
        </motion.div>
      )}

      {/* Edit Modal */}
      <RoomEditModal
        room={editingRoom}
        isOpen={!!editingRoom}
        onClose={() => setEditingRoom(null)}
        onSave={handleSaveRoom}
        staff={staff}
      />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  BedDouble,
  Save,
  AlertCircle,
  DollarSign,
  UserCog,
  History,
  ImagePlus,
  Wifi,
  Wind,
  Tv,
  Wine,
  Trees,
  Lock,
  Bath,
  Coffee,
  Briefcase,
  Mountain
} from 'lucide-react'
import StatusBadge from '../shared/StatusBadge'

const roomStatuses = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' }
]

// Canonical amenity list (with icons) shown as a toggleable checklist.
const AMENITY_DEFS = [
  { id: 'wifi', label: 'WiFi', icon: Wifi, keywords: ['wifi'] },
  { id: 'ac', label: 'Air Conditioning', icon: Wind, keywords: ['aire', 'ac'] },
  { id: 'tv', label: 'Smart TV', icon: Tv, keywords: ['tv'] },
  { id: 'minibar', label: 'Minibar', icon: Wine, keywords: ['mini bar', 'minibar', 'nevera'] },
  { id: 'balcony', label: 'Balcony / Terrace', icon: Trees, keywords: ['balcón', 'balcon', 'terraza'] },
  { id: 'safe', label: 'Safe', icon: Lock, keywords: ['caja'] },
  { id: 'bathtub', label: 'Bathtub / Jacuzzi', icon: Bath, keywords: ['bañera', 'jacuzzi', 'hidromasaje', 'spa'] },
  { id: 'coffee', label: 'Coffee Machine', icon: Coffee, keywords: ['nespresso', 'café', 'coffee'] },
  { id: 'desk', label: 'Work Desk', icon: Briefcase, keywords: ['escritorio'] },
  { id: 'view', label: 'Premium View', icon: Mountain, keywords: ['vista', 'océano', 'mar', 'panorám', 'panoram'] }
]

// Loose match against the room's raw (Spanish) amenity strings for pre-selection.
const matchAmenity = (rawList, keywords) =>
  rawList.some((raw) => {
    const tokens = raw.toLowerCase().split(/[^a-zà-ú]+/)
    return keywords.some((k) => (k.length <= 3 ? tokens.includes(k) : raw.toLowerCase().includes(k)))
  })

// Derive the initial checklist selection from a room's amenities.
const deriveAmenities = (room) => {
  // Already-normalised ids persisted from a previous edit.
  if (Array.isArray(room.amenityIds)) return room.amenityIds
  const raw = Array.isArray(room.amenities) ? room.amenities : []
  return AMENITY_DEFS.filter((a) => matchAmenity(raw, a.keywords)).map((a) => a.id)
}

const relTime = (iso) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const h = Math.round(mins / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}

export default function RoomEditModal({ room, isOpen, onClose, onSave, staff = [] }) {
  const [formData, setFormData] = useState({
    status: '',
    price: 0,
    description: '',
    amenityIds: [],
    managerId: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (room) {
      setFormData({
        status: room.status || 'available',
        price: room.price ?? 0,
        description: room.description || '',
        amenityIds: deriveAmenities(room),
        managerId: room.managerId || '',
        notes: room.notes || ''
      })
    }
  }, [room])

  if (!room) return null

  const gallery = Array.isArray(room.images) && room.images.length ? room.images : [room.image]
  const managerName = (id) => staff.find((s) => s.id === id)?.name || null

  const toggleAmenity = (id) =>
    setFormData((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(id)
        ? prev.amenityIds.filter((x) => x !== id)
        : [...prev.amenityIds, id]
    }))

  // Build human-readable change-log entries by diffing the form against the room.
  const buildHistoryEntries = () => {
    const entries = []
    const stamp = new Date().toISOString()
    if (formData.status !== room.status) {
      const label = roomStatuses.find((s) => s.value === formData.status)?.label || formData.status
      entries.push({ text: `Status changed to ${label} by Admin`, at: stamp })
    }
    if (Number(formData.price) !== room.price) {
      entries.push({ text: `Price set to $${formData.price} by Admin`, at: stamp })
    }
    if ((formData.managerId || '') !== (room.managerId || '')) {
      const name = managerName(formData.managerId)
      entries.push({
        text: name ? `Manager assigned to ${name} by Admin` : 'Manager unassigned by Admin',
        at: stamp
      })
    }
    const prevAmenities = deriveAmenities(room)
    const amenitiesChanged =
      prevAmenities.length !== formData.amenityIds.length ||
      prevAmenities.some((a) => !formData.amenityIds.includes(a))
    if (amenitiesChanged) entries.push({ text: 'Amenities updated by Admin', at: stamp })
    if ((formData.description || '') !== (room.description || '')) {
      entries.push({ text: 'Description updated by Admin', at: stamp })
    }
    return entries
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setSaving(true)
    try {
      const newEntries = buildHistoryEntries()
      const history = [...newEntries, ...(room.history || [])].slice(0, 10)
      await onSave(room.id, {
        status: formData.status,
        price: Number(formData.price) || 0,
        description: formData.description,
        amenityIds: formData.amenityIds,
        managerId: formData.managerId || null,
        notes: formData.notes,
        history
      })
      onClose()
    } catch (error) {
      console.error('Error saving room:', error)
    } finally {
      setSaving(false)
    }
  }

  const history = room.history || []

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-surface rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BedDouble className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">Edit Room</h2>
                  <p className="text-sm text-muted">Room {room.roomNumber} · <span className="capitalize">{room.type}</span></p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Read-only room facts */}
              <div className="bg-bg rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted">Type</span>
                    <p className="font-medium text-text capitalize">{room.type}</p>
                  </div>
                  <div>
                    <span className="text-muted">Floor</span>
                    <p className="font-medium text-text">{room.floor}</p>
                  </div>
                  <div>
                    <span className="text-muted">Capacity</span>
                    <p className="font-medium text-text">{room.capacity} guests</p>
                  </div>
                </div>
                {room.currentGuest && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted">Current Guest:</span>
                    <span className="text-sm font-medium text-text">{room.currentGuest}</span>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Gallery</label>
                <div className="flex gap-2 flex-wrap">
                  {gallery.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={src} alt={`Room ${room.roomNumber} ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <button
                    type="button"
                    title="Upload more (demo)"
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px] mt-1">Upload</span>
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text mb-3">Room Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {roomStatuses.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: status.value }))}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.status === status.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <StatusBadge status={status.value} size="sm" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Price + Manager */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Price / night</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-bg border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary/50">
                    <DollarSign className="w-4 h-4 text-muted" />
                    <input
                      type="number"
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      className="flex-1 bg-transparent focus:outline-none text-sm text-text"
                    />
                    <span className="text-xs text-muted">/night</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-1.5">
                    <UserCog className="w-4 h-4 text-muted" /> Assigned manager
                  </label>
                  <select
                    value={formData.managerId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, managerId: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Unassigned</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {s.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Room description shown to guests…"
                  rows={2}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-sm"
                />
              </div>

              {/* Amenities checklist */}
              <div>
                <label className="block text-sm font-medium text-text mb-3">
                  Amenities <span className="text-muted font-normal">({formData.amenityIds.length} selected)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITY_DEFS.map((a) => {
                    const Icon = a.icon
                    const active = formData.amenityIds.includes(a.id)
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAmenity(a.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                          active
                            ? 'border-primary bg-primary/5 text-text'
                            : 'border-border text-muted hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                        <span className="truncate">{a.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Internal notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes for staff (not shown to guests)…"
                  rows={2}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-sm"
                />
              </div>

              {/* Change history */}
              <div>
                <label className="block text-sm font-medium text-text mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-muted" /> Change history
                </label>
                {history.length === 0 ? (
                  <p className="text-sm text-muted bg-bg rounded-lg p-3">No changes recorded yet.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {history.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 text-sm bg-bg rounded-lg px-3 py-2">
                        <span className="text-text truncate">{h.text}</span>
                        <span className="text-xs text-muted whitespace-nowrap">{relTime(h.at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

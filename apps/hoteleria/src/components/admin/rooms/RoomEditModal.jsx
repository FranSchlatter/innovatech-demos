import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BedDouble, Save, AlertCircle } from 'lucide-react'
import StatusBadge from '../shared/StatusBadge'

const roomStatuses = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' }
]

export default function RoomEditModal({ room, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    status: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (room) {
      setFormData({
        status: room.status || 'available',
        notes: room.notes || ''
      })
    }
  }, [room])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await onSave(room.id, formData)
      onClose()
    } catch (error) {
      console.error('Error saving room:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!room) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
              sm:w-full sm:max-w-lg bg-surface rounded-xl shadow-xl z-50 overflow-hidden
              flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BedDouble className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">Edit Room</h2>
                  <p className="text-sm text-muted">Room {room.roomNumber}</p>
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
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Room Info */}
              <div className="bg-bg rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
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
                  <div>
                    <span className="text-muted">Price/Night</span>
                    <p className="font-medium text-text">${room.price}</p>
                  </div>
                </div>

                {room.currentGuest && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-muted">Current Guest:</span>
                      <span className="text-sm font-medium text-text">{room.currentGuest}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-3">
                  Room Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roomStatuses.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                      className={`
                        p-3 rounded-lg border-2 text-left transition-all
                        ${formData.status === status.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <StatusBadge status={status.value} size="sm" />
                      <p className="text-xs text-muted mt-2">
                        {status.value === 'available' && 'Ready for guests'}
                        {status.value === 'occupied' && 'Guest checked in'}
                        {status.value === 'cleaning' && 'Being cleaned'}
                        {status.value === 'maintenance' && 'Under repair'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this room..."
                  rows={3}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg
                    text-text placeholder:text-muted
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                    transition-all resize-none"
                />
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
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast
                  text-sm font-medium rounded-lg hover:opacity-90 transition-opacity
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

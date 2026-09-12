import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from '@shared-ui/components/DatePicker'
import {
  Megaphone,
  Plus,
  X,
  Save,
  Power,
  Trash2,
  Pencil,
  CalendarRange,
  Eye
} from 'lucide-react'
import { useNews } from '../../../hooks/useNews'
import {
  NEWS_TYPES,
  NEWS_TYPE_OPTIONS,
  newsStatus,
  todayISO
} from '../../../data/mockNews'

const STATUS = {
  active: { label: 'Activo', cls: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
  scheduled: { label: 'Programado', cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  expired: { label: 'Expirado', cls: 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20' },
  paused: { label: 'Pausado', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' }
}

// Order announcements by relevance: live first, then upcoming, paused, expired.
const STATUS_RANK = { active: 0, scheduled: 1, paused: 2, expired: 3 }

const fmtDate = (s) =>
  s ? new Date(s + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

// ---------------------------------------------------------------- Front preview
// A faithful mini-render of how the NewsBar band looks on the landing.
function BarPreview({ type, title, message }) {
  const cfg = NEWS_TYPES[type] || NEWS_TYPES.info
  const Icon = cfg.icon
  return (
    <div className={`rounded-lg overflow-hidden ${cfg.barBg} ${cfg.barText}`}>
      <div className="flex items-center gap-2 px-3 h-10">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <p className="text-sm truncate">
          <span className="font-semibold">{title?.trim() || 'Título del aviso'}</span>
          <span className="opacity-80"> — {message?.trim() || 'Mensaje que verá el huésped en la landing.'}</span>
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Create / edit modal
function NewsModal({ open, editing, onClose, onSave }) {
  const empty = { title: '', message: '', type: 'info', startDate: todayISO(), endDate: '' }
  const [draft, setDraft] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraft(
      editing
        ? {
            title: editing.title,
            message: editing.message,
            type: editing.type,
            startDate: editing.startDate,
            endDate: editing.endDate
          }
        : { ...empty, startDate: todayISO() }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing])

  const valid =
    draft.title.trim() &&
    draft.message.trim() &&
    draft.startDate &&
    draft.endDate &&
    draft.endDate >= draft.startDate

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    onSave({
      ...draft,
      title: draft.title.trim(),
      message: draft.message.trim()
    })
    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
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
            className="relative w-full max-w-lg bg-surface rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-text">{editing ? 'Editar aviso' : 'Crear aviso'}</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Tipo</label>
                <div className="flex flex-wrap gap-2">
                  {NEWS_TYPE_OPTIONS.map((opt) => {
                    const OptIcon = opt.icon
                    const active = draft.type === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, type: opt.value }))}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          active
                            ? 'bg-primary text-primary-contrast border-primary'
                            : 'bg-bg text-muted border-border hover:border-primary'
                        }`}
                      >
                        <OptIcon className="w-3.5 h-3.5" />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Título</label>
                <input
                  type="text"
                  maxLength={60}
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Ej: Pileta cerrada por mantenimiento"
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Mensaje</label>
                <textarea
                  rows={3}
                  maxLength={180}
                  value={draft.message}
                  onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
                  placeholder="Detalle del aviso que verá el huésped."
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <p className="text-[11px] text-muted mt-1 text-right">{draft.message.length}/180</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Desde</label>
                  <DatePicker
                    value={draft.startDate}
                    onChange={(startDate) => setDraft((d) => ({ ...d, startDate }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Hasta</label>
                  <DatePicker
                    value={draft.endDate}
                    min={draft.startDate}
                    onChange={(endDate) => setDraft((d) => ({ ...d, endDate }))}
                  />
                </div>
              </div>

              {/* Live preview */}
              <div>
                <label className="block text-sm font-medium text-text mb-2 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-muted" /> Vista previa en la landing
                </label>
                <BarPreview type={draft.type} title={draft.title} message={draft.message} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!valid || saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear aviso'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------- Main
export default function NewsManagement() {
  const { news, addNews, updateNews, deleteNews, toggleNews } = useNews()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const today = todayISO()

  const sorted = useMemo(
    () =>
      [...news].sort((a, b) => {
        const ra = STATUS_RANK[newsStatus(a, today)]
        const rb = STATUS_RANK[newsStatus(b, today)]
        if (ra !== rb) return ra - rb
        return (b.startDate || '').localeCompare(a.startDate || '')
      }),
    [news, today]
  )

  const activeCount = news.filter((n) => newsStatus(n, today) === 'active').length

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (item) => {
    setEditing(item)
    setModalOpen(true)
  }
  const handleSave = (draft) => {
    if (editing) updateNews(editing.id, draft)
    else addNews(draft)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" /> Noticias y avisos
          </h1>
          <p className="text-sm text-muted">
            Publicá avisos con fecha de inicio y fin. Aparecen solos en la landing y se retiran al vencer.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Crear aviso
        </button>
      </div>

      {/* Summary */}
      <div className="bg-surface rounded-xl border border-border px-4 py-3 flex items-center gap-2 text-sm">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-text font-medium">{activeCount} activo{activeCount === 1 ? '' : 's'}</span>
        <span className="text-muted">de {news.length} en total</span>
      </div>

      {/* List */}
      {news.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border text-center py-12">
          <Megaphone className="w-10 h-10 mx-auto text-muted mb-2" />
          <p className="text-sm text-muted">No hay avisos. Creá el primero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <AnimatePresence initial={false}>
            {sorted.map((item) => {
              const status = newsStatus(item, today)
              const st = STATUS[status]
              const cfg = NEWS_TYPES[item.type] || NEWS_TYPES.info
              const TypeIcon = cfg.icon
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface rounded-xl border border-border p-4 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${cfg.softBg} ${cfg.softText}`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </div>
                    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>

                  <h3 className="font-semibold text-text mb-1">{item.title}</h3>
                  <p className="text-sm text-muted mb-3 line-clamp-3">{item.message}</p>

                  <p className="text-xs text-muted mb-3 flex items-center gap-1.5 mt-auto">
                    <CalendarRange className="w-3.5 h-3.5" />
                    {fmtDate(item.startDate)} → {fmtDate(item.endDate)}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleNews(item.id)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        item.enabled
                          ? 'bg-bg text-muted hover:text-text'
                          : 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {item.enabled ? 'Pausar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-bg transition-colors"
                      title="Editar aviso"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNews(item.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-red-500 transition-colors"
                      title="Eliminar aviso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <NewsModal
        open={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

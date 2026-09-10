import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, Plus, Pencil, Trash2, Pause, Play,
  LayoutGrid, Table as TableIcon, BedDouble, Ruler, MapPin, X
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'
import Modal from '../shared/Modal'
import { useToast } from '../shared/useToast'
import { fieldCls, labelCls, btnPrimary, btnGhost } from '../shared/formStyles'
import {
  formatPrice, formatArea, OPERATION_LABELS, TYPE_LABELS, STATUS_LABELS
} from '../../../utils/format'
import neighborhoods from '../../../data/neighborhoods.json'

const STATUS_TONE = {
  available: 'success',
  reserved: 'warning',
  sold: 'info',
  rented: 'accent',
  paused: 'muted'
}

const AMENITY_OPTIONS = [
  'Pileta', 'Cochera cubierta', 'Seguridad 24h', 'SUM', 'Gimnasio', 'Parrilla',
  'Balcón', 'Terraza', 'Baulera', 'Laundry', 'Jardín', 'Quincho', 'Solárium', 'Cocheras dobles'
]

const ORIENTATIONS = ['Norte', 'Sur', 'Este', 'Oeste', 'Noreste', 'Noroeste', 'Sureste', 'Suroeste']
const CONDITIONS = ['A estrenar', 'Excelente', 'Muy bueno', 'Bueno', 'A refaccionar']
const CURRENCIES = ['USD', 'ARS']

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function PropertyManagement() {
  const {
    properties, agents, updateProperty, addProperty, deleteProperty
  } = useAdminData()
  const { showToast, toastNode } = useToast()

  const [operation, setOperation] = useState('all')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('table') // table | grid

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // property being edited, or null for new
  const [deleteTarget, setDeleteTarget] = useState(null)

  const agentName = (id) => agents.find((a) => a.id === id)?.name || '—'

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return properties.filter((p) => {
      if (operation !== 'all' && p.operation !== operation) return false
      if (type !== 'all' && p.type !== type) return false
      if (status !== 'all' && p.status !== status) return false
      if (q) {
        const hay = `${p.title} ${p.neighborhood} ${p.address || ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [properties, operation, type, status, search])

  const forSale = properties.filter((p) => p.operation === 'sale').length
  const forRent = properties.filter(
    (p) => p.operation === 'rent' || p.operation === 'temporary'
  ).length

  const openNew = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (p) => { setEditing(p); setFormOpen(true) }

  const handleSave = async (payload) => {
    if (editing) {
      await updateProperty(editing.id, payload)
      showToast('Propiedad actualizada')
    } else {
      await addProperty(payload)
      showToast('Propiedad agregada')
    }
    setFormOpen(false)
    setEditing(null)
  }

  const togglePause = (p) => {
    if (p.status === 'paused') {
      updateProperty(p.id, { status: 'available' })
      showToast('Propiedad republicada')
    } else {
      updateProperty(p.id, { status: 'paused' })
      showToast('Propiedad pausada', 'muted')
    }
  }

  const confirmDelete = () => {
    deleteProperty(deleteTarget.id)
    showToast('Propiedad eliminada', 'muted')
    setDeleteTarget(null)
  }

  const StatusSelect = ({ property }) => (
    <select
      value={property.status}
      onChange={(e) => updateProperty(property.id, { status: e.target.value })}
      className="text-xs font-semibold rounded-lg border border-border bg-surface-alt text-text px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  )

  const RowActions = ({ property }) => (
    <div className="flex items-center gap-1">
      <IconBtn label="Editar" onClick={() => openEdit(property)}>
        <Pencil className="w-4 h-4" />
      </IconBtn>
      <IconBtn
        label={property.status === 'paused' ? 'Republicar' : 'Pausar'}
        onClick={() => togglePause(property)}
      >
        {property.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </IconBtn>
      <IconBtn label="Eliminar" tone="error" onClick={() => setDeleteTarget(property)}>
        <Trash2 className="w-4 h-4" />
      </IconBtn>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Propiedades</h2>
          <p className="text-sm text-muted mt-1">
            {filtered.length} de {properties.length} ·{' '}
            <span className="text-success font-medium">{forSale} en venta</span> ·{' '}
            <span className="text-accent font-medium">{forRent} en alquiler</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <ViewToggle active={viewMode === 'table'} onClick={() => setViewMode('table')} label="Tabla">
              <TableIcon className="w-4 h-4" />
            </ViewToggle>
            <ViewToggle active={viewMode === 'grid'} onClick={() => setViewMode('grid')} label="Grilla">
              <LayoutGrid className="w-4 h-4" />
            </ViewToggle>
          </div>
          <button type="button" onClick={openNew} className={btnPrimary}>
            <Plus className="w-4 h-4" /> Agregar propiedad
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
        <select value={operation} onChange={(e) => setOperation(e.target.value)}
          className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40">
          <option value="all">Todas las operaciones</option>
          {Object.entries(OPERATION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40">
          <option value="all">Todos los tipos</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40">
          <option value="all">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, barrio o dirección…"
            className="w-full text-sm rounded-lg border border-border bg-surface-alt text-text pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40" />
        </div>
      </div>

      {/* Table view */}
      {viewMode === 'table' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block bg-surface border border-border rounded-xl overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border bg-surface-alt/50">
                  <th className="px-4 py-3 font-semibold">Propiedad</th>
                  <th className="px-4 py-3 font-semibold hidden xl:table-cell">Barrio</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold hidden xl:table-cell">Sup.</th>
                  <th className="px-4 py-3 font-semibold hidden xl:table-cell">Dorm.</th>
                  <th className="px-4 py-3 font-semibold">Precio</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-alt/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-surface-alt" />
                        <div className="min-w-0">
                          <p className="font-semibold text-text truncate max-w-[220px]">{p.title}</p>
                          <p className="text-xs text-muted inline-flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {p.views ?? 0} · {agentName(p.agentId)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text hidden xl:table-cell whitespace-nowrap">{p.neighborhood}</td>
                    <td className="px-4 py-3 text-text">{TYPE_LABELS[p.type] || p.type}</td>
                    <td className="px-4 py-3 text-muted hidden xl:table-cell whitespace-nowrap">{formatArea(p.areaTotal)}</td>
                    <td className="px-4 py-3 text-muted hidden xl:table-cell">{p.bedrooms ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-text whitespace-nowrap">
                      {formatPrice(p.price, p.currency, p.operation)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge label={STATUS_LABELS[p.status]} tone={STATUS_TONE[p.status]} />
                        <StatusSelect property={p} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end"><RowActions property={p} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-muted py-10">No hay propiedades que coincidan con los filtros.</p>
            )}
          </motion.div>

          {/* Mobile cards (table mode) */}
          <div className="lg:hidden space-y-3">
            {filtered.map((p, i) => (
              <PropertyCardRow key={p.id} p={p} i={i} agentName={agentName}
                StatusSelect={StatusSelect} RowActions={RowActions} />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted py-10">No hay propiedades que coincidan con los filtros.</p>
            )}
          </div>
        </>
      )}

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="bg-surface border border-border rounded-xl overflow-hidden group"
            >
              <div className="relative h-40 bg-surface-alt">
                <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <StatusBadge label={STATUS_LABELS[p.status]} tone={STATUS_TONE[p.status]} />
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <RowActions property={p} />
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-text leading-tight line-clamp-1">{p.title}</p>
                <p className="text-xs text-muted mt-0.5 inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {p.neighborhood}
                </p>
                <p className="text-lg font-bold text-text mt-2">{formatPrice(p.price, p.currency, p.operation)}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted">
                  <span className="rounded-full bg-surface-alt px-2 py-0.5">{TYPE_LABELS[p.type] || p.type}</span>
                  <span className="rounded-full bg-surface-alt px-2 py-0.5">{OPERATION_LABELS[p.operation]}</span>
                  <span className="inline-flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {p.bedrooms ?? '—'}</span>
                  <span className="inline-flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {formatArea(p.areaTotal)}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted py-10">No hay propiedades que coincidan con los filtros.</p>
          )}
        </div>
      )}

      {/* Form modal */}
      <PropertyFormModal
        open={formOpen}
        property={editing}
        agents={agents}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSave={handleSave}
      />

      {/* Delete confirm */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar propiedad"
        icon={Trash2}
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setDeleteTarget(null)} className={btnGhost}>Cancelar</button>
            <button type="button" onClick={confirmDelete}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg bg-error text-white font-semibold hover:opacity-90 transition-opacity">
              Sí, eliminar
            </button>
          </div>
        }
      >
        <div className="p-5 md:p-6">
          <p className="text-sm text-text">
            ¿Seguro que desea eliminar <span className="font-semibold">{deleteTarget?.title}</span>?
            Esta acción no se puede deshacer.
          </p>
        </div>
      </Modal>

      {toastNode}
    </div>
  )
}

/* ---------- Shared small pieces ---------- */

function IconBtn({ children, label, onClick, tone = 'default' }) {
  const toneCls = tone === 'error'
    ? 'text-muted hover:text-error hover:bg-error/10'
    : 'text-muted hover:text-accent hover:bg-accent/10'
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface transition-colors ${toneCls}`}>
      {children}
    </button>
  )
}

function ViewToggle({ active, onClick, label, children }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className={`inline-flex items-center justify-center w-9 h-9 transition-colors ${
        active ? 'bg-accent text-primary-contrast' : 'bg-surface text-muted hover:text-text hover:bg-surface-alt'
      }`}>
      {children}
    </button>
  )
}

function PropertyCardRow({ p, i, agentName, StatusSelect, RowActions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: i * 0.03 }}
      className="bg-surface border border-border rounded-xl p-4"
    >
      <div className="flex gap-3">
        <img src={p.images?.[0]} alt={p.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-surface-alt" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text leading-tight">{p.title}</p>
          <p className="text-xs text-muted">{p.neighborhood}</p>
          <p className="text-sm font-semibold text-text mt-1">{formatPrice(p.price, p.currency, p.operation)}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted">
        <span className="rounded-full bg-surface-alt px-2 py-0.5">{TYPE_LABELS[p.type] || p.type}</span>
        <span className="inline-flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {p.bedrooms ?? '—'}</span>
        <span className="inline-flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {formatArea(p.areaTotal)}</span>
        <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {p.views ?? 0}</span>
      </div>
      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex items-center gap-2">
          <StatusBadge label={STATUS_LABELS[p.status]} tone={STATUS_TONE[p.status]} />
          <StatusSelect property={p} />
        </div>
        <RowActions property={p} />
      </div>
    </motion.div>
  )
}

/* ---------- Property form (tabbed create/edit) ---------- */

const TABS = [
  { id: 'basic', label: 'Datos básicos' },
  { id: 'location', label: 'Ubicación' },
  { id: 'features', label: 'Características' },
  { id: 'media', label: 'Multimedia' }
]

const emptyProperty = (agentId) => ({
  title: '', description: '',
  operation: 'sale', type: 'apartment', status: 'available',
  price: '', currency: 'USD', expenses: '',
  address: '', neighborhood: neighborhoods[0], city: 'Buenos Aires', province: 'CABA',
  lat: 50, lng: 50,
  rooms: '', bedrooms: '', bathrooms: '', areaTotal: '', areaCovered: '',
  yearBuilt: '', orientation: 'Norte', condition: 'Excelente', garage: 0,
  amenities: [], images: [''], virtualTour: false, floorPlan: '',
  featured: false, agentId, views: 0
})

function PropertyFormModal({ open, property, agents, onClose, onSave }) {
  const [tab, setTab] = useState('basic')
  const [form, setForm] = useState(emptyProperty(agents[0]?.id))
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!open) return
    setTab('basic')
    setTouched(false)
    if (property) {
      setForm({
        ...emptyProperty(agents[0]?.id),
        ...property,
        images: property.images?.length ? property.images : [''],
        amenities: property.amenities || []
      })
    } else {
      setForm(emptyProperty(agents[0]?.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, property])

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  const toggleAmenity = (a) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a]
    }))

  const setImage = (idx, val) =>
    setForm((prev) => {
      const images = [...prev.images]
      images[idx] = val
      return { ...prev, images }
    })
  const addImage = () =>
    setForm((prev) => (prev.images.length >= 6 ? prev : { ...prev, images: [...prev.images, ''] }))
  const removeImage = (idx) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))

  const titleInvalid = touched && !form.title.trim()
  const priceInvalid = touched && (form.price === '' || Number(form.price) <= 0)

  const num = (v) => (v === '' || v === null || v === undefined ? 0 : Number(v))

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.title.trim() || form.price === '' || Number(form.price) <= 0) {
      // Jump to the tab holding the offending field
      if (!form.title.trim() || Number(form.price) <= 0) setTab('basic')
      return
    }
    const cleanImages = form.images.map((s) => s.trim()).filter(Boolean)
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      operation: form.operation,
      type: form.type,
      status: form.status,
      price: num(form.price),
      currency: form.currency,
      expenses: num(form.expenses),
      address: form.address.trim(),
      neighborhood: form.neighborhood,
      city: form.city.trim(),
      province: form.province,
      lat: num(form.lat),
      lng: num(form.lng),
      rooms: num(form.rooms),
      bedrooms: num(form.bedrooms),
      bathrooms: num(form.bathrooms),
      areaTotal: num(form.areaTotal),
      areaCovered: num(form.areaCovered),
      yearBuilt: num(form.yearBuilt),
      orientation: form.orientation,
      condition: form.condition,
      garage: num(form.garage),
      amenities: form.amenities,
      images: cleanImages.length ? cleanImages : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&q=80'],
      virtualTour: !!form.virtualTour,
      floorPlan: form.floorPlan.trim(),
      featured: !!form.featured,
      agentId: form.agentId,
      views: num(form.views),
      publishedAt: property?.publishedAt || todayISO()
    })
  }

  const errorBadge = (id) => {
    if (!touched) return false
    if (id === 'basic') return !form.title.trim() || Number(form.price) <= 0
    return false
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={property ? 'Editar propiedad' : 'Nueva propiedad'}
      icon={property ? Pencil : Plus}
      size="xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted hidden sm:block">Los campos con * son obligatorios.</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className={btnGhost}>Cancelar</button>
            <button type="submit" form="property-form" className={btnPrimary}>
              {property ? 'Guardar cambios' : 'Crear propiedad'}
            </button>
          </div>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 px-5 md:px-6 pt-4 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.id ? 'text-accent' : 'text-muted hover:text-text'
            }`}
          >
            {t.label}
            {errorBadge(t.id) && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-error align-middle" />}
            {tab === t.id && (
              <motion.span layoutId="prop-tab" className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      <form id="property-form" onSubmit={handleSubmit} className="p-5 md:p-6">
        {tab === 'basic' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Título *</label>
              <input value={form.title} onChange={set('title')} className={fieldCls} placeholder="Ej: Departamento 3 ambientes con balcón" />
              {titleInvalid && <p className="text-xs text-error mt-1">El título es obligatorio.</p>}
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Descripción</label>
              <textarea rows={4} value={form.description} onChange={set('description')} className={`${fieldCls} resize-none`} placeholder="Descripción de la propiedad…" />
            </div>
            <div>
              <label className={labelCls}>Operación</label>
              <select value={form.operation} onChange={set('operation')} className={fieldCls}>
                {Object.entries(OPERATION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Tipo</label>
              <select value={form.type} onChange={set('type')} className={fieldCls}>
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Precio *</label>
              <div className="flex gap-2">
                <input type="number" min="0" value={form.price} onChange={set('price')} className={fieldCls} placeholder="0" />
                <select value={form.currency} onChange={set('currency')} className={`${fieldCls} w-24`}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {priceInvalid && <p className="text-xs text-error mt-1">Ingresá un precio válido.</p>}
            </div>
            <div>
              <label className={labelCls}>Expensas (ARS)</label>
              <input type="number" min="0" value={form.expenses} onChange={set('expenses')} className={fieldCls} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>Estado</label>
              <select value={form.status} onChange={set('status')} className={fieldCls}>
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Agente</label>
              <select value={form.agentId} onChange={set('agentId')} className={fieldCls}>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <label className="sm:col-span-2 flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-accent" />
              Destacar en la portada
            </label>
          </div>
        )}

        {tab === 'location' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Dirección</label>
              <input value={form.address} onChange={set('address')} className={fieldCls} placeholder="Calle y número" />
            </div>
            <div>
              <label className={labelCls}>Barrio</label>
              <select value={form.neighborhood} onChange={set('neighborhood')} className={fieldCls}>
                {neighborhoods.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Ciudad</label>
              <input value={form.city} onChange={set('city')} className={fieldCls} placeholder="Ciudad" />
            </div>
            <div>
              <label className={labelCls}>Provincia</label>
              <input value={form.province} onChange={set('province')} className={fieldCls} placeholder="Provincia" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Posición en el mapa (0–100)</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input type="number" min="0" max="100" value={form.lat} onChange={set('lat')} className={fieldCls} placeholder="X" />
                  <p className="text-[11px] text-muted mt-1">Horizontal (X %)</p>
                </div>
                <div>
                  <input type="number" min="0" max="100" value={form.lng} onChange={set('lng')} className={fieldCls} placeholder="Y" />
                  <p className="text-[11px] text-muted mt-1">Vertical (Y %)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'features' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Ambientes</label>
                <input type="number" min="0" value={form.rooms} onChange={set('rooms')} className={fieldCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Dormitorios</label>
                <input type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} className={fieldCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Baños</label>
                <input type="number" min="0" value={form.bathrooms} onChange={set('bathrooms')} className={fieldCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Sup. total (m²)</label>
                <input type="number" min="0" value={form.areaTotal} onChange={set('areaTotal')} className={fieldCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Sup. cubierta (m²)</label>
                <input type="number" min="0" value={form.areaCovered} onChange={set('areaCovered')} className={fieldCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Cocheras</label>
                <input type="number" min="0" value={form.garage} onChange={set('garage')} className={fieldCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Año / antigüedad</label>
                <input type="number" min="1900" value={form.yearBuilt} onChange={set('yearBuilt')} className={fieldCls} placeholder="2020" />
              </div>
              <div>
                <label className={labelCls}>Orientación</label>
                <select value={form.orientation} onChange={set('orientation')} className={fieldCls}>
                  {ORIENTATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Estado edilicio</label>
                <select value={form.condition} onChange={set('condition')} className={fieldCls}>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((a) => {
                  const active = form.amenities.includes(a)
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                        active ? 'bg-accent/15 text-accent border-accent/50' : 'bg-surface-alt text-muted border-border hover:text-text'
                      }`}
                    >
                      {a}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Imágenes (URLs, máximo 6). La primera es la portada.</label>
              <div className="space-y-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-muted w-6 shrink-0">{idx + 1}</span>
                    <input value={img} onChange={(e) => setImage(idx, e.target.value)} className={fieldCls} placeholder="https://…" />
                    {img?.trim() && (
                      <img src={img} alt="" className="w-10 h-10 rounded object-cover shrink-0 bg-surface-alt" />
                    )}
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => removeImage(idx)} aria-label="Quitar imagen"
                        className="p-2 rounded-lg text-muted hover:text-error hover:bg-error/10 shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {form.images.length < 6 && (
                <button type="button" onClick={addImage}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                  <Plus className="w-4 h-4" /> Agregar imagen
                </button>
              )}
            </div>
            <div>
              <label className={labelCls}>URL del plano</label>
              <input value={form.floorPlan} onChange={set('floorPlan')} className={fieldCls} placeholder="https://…" />
            </div>
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={form.virtualTour} onChange={set('virtualTour')} className="w-4 h-4 accent-accent" />
              Tiene tour virtual 360°
            </label>
          </div>
        )}
      </form>
    </Modal>
  )
}

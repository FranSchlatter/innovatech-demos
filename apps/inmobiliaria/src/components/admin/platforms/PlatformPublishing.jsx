import { useState, useMemo, useCallback, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Share2, Globe, ChevronDown, Check, Pause, Play, EyeOff,
  Loader2, TrendingUp, MessageSquare, CalendarClock, Eye,
  CheckSquare, Square, BarChart3, X
} from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import { usePlatforms } from '../../../hooks/usePlatforms'
import { TODAY } from '../../../data/admin/mockPlatforms'
import StatusBadge from '../shared/StatusBadge'
import { useToast } from '../shared/useToast'
import { btnGhost } from '../shared/formStyles'
import { formatDate, OPERATION_LABELS, TYPE_LABELS } from '../../../utils/format'

/* ---------- constants & helpers ---------- */

const STATUS_META = {
  published: { label: 'Publicada', short: 'Publicada', tone: 'success', Icon: Check },
  paused: { label: 'Pausada', short: 'Pausada', tone: 'warning', Icon: Pause },
  unpublished: { label: 'No publicada', short: 'Publicar', tone: 'muted', Icon: Play }
}

// Actions offered in the per-cell popover menu.
const MENU_ACTIONS = [
  { id: 'published', label: 'Publicar', Icon: Check, cls: 'text-success' },
  { id: 'paused', label: 'Pausar', Icon: Pause, cls: 'text-warning' },
  { id: 'unpublished', label: 'Despublicar', Icon: EyeOff, cls: 'text-muted' }
]

const CELL_TONE = {
  published: 'border-success/40 bg-success/10 text-success hover:bg-success/20',
  paused: 'border-warning/40 bg-warning/10 text-warning hover:bg-warning/20',
  unpublished: 'border-border bg-surface-alt text-muted hover:text-text hover:border-accent/40'
}

const BAR_TONE = {
  accent: 'bg-accent', info: 'bg-info', warning: 'bg-warning', primary: 'bg-primary', success: 'bg-success'
}

const EMPTY_CELL = { status: 'unpublished', publishedAt: null, visits: 0, inquiries: 0, series: [0, 0, 0, 0, 0, 0, 0] }

function daysSince(iso) {
  if (!iso) return 0
  const a = new Date(`${iso}T12:00:00Z`)
  const b = new Date(`${TODAY}T12:00:00Z`)
  return Math.max(0, Math.round((b - a) / 86400000))
}

function daysLabel(iso) {
  const d = daysSince(iso)
  if (d === 0) return 'Publicada hoy'
  if (d === 1) return 'Hace 1 día'
  return `Hace ${d} días`
}

/* ---------- module ---------- */

export default function PlatformPublishing() {
  const { properties } = useAdminData()
  const { platformState, platforms, setStatus, resetPlatforms } = usePlatforms()
  const { showToast, toastNode } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all | published | paused | unpublished
  const [expandedId, setExpandedId] = useState(null)
  const [menuKey, setMenuKey] = useState(null) // `${propId}:${platId}` of open popover
  const [publishing, setPublishing] = useState(() => new Set())
  const [selected, setSelected] = useState(() => new Set())
  const [bulkAction, setBulkAction] = useState('published')
  const [bulkPlatform, setBulkPlatform] = useState(platforms[0].id)

  const cellOf = useCallback(
    (propId, platId) => platformState[propId]?.[platId] || EMPTY_CELL,
    [platformState]
  )

  /* ----- filtering ----- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return properties.filter((p) => {
      if (q) {
        const hay = `${p.title} ${p.neighborhood} ${p.address || ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (statusFilter !== 'all') {
        const hasStatus = platforms.some((pl) => cellOf(p.id, pl.id).status === statusFilter)
        if (!hasStatus) return false
      }
      return true
    })
  }, [properties, search, statusFilter, platforms, cellOf])

  /* ----- summary metrics ----- */
  const summary = useMemo(() => {
    let publishedProps = 0
    let totalVisits = 0
    let totalInquiries = 0
    const perPlatform = Object.fromEntries(platforms.map((pl) => [pl.id, { visits: 0, inquiries: 0 }]))
    let topProp = null

    for (const p of properties) {
      let propVisits = 0
      let hasPublished = false
      for (const pl of platforms) {
        const c = cellOf(p.id, pl.id)
        if (c.status === 'published') hasPublished = true
        totalVisits += c.visits
        totalInquiries += c.inquiries
        propVisits += c.visits
        perPlatform[pl.id].visits += c.visits
        perPlatform[pl.id].inquiries += c.inquiries
      }
      if (hasPublished) publishedProps += 1
      if (!topProp || propVisits > topProp.visits) topProp = { title: p.title, visits: propVisits }
    }

    let topPlatform = null
    for (const pl of platforms) {
      const stat = perPlatform[pl.id]
      if (!topPlatform || stat.inquiries > topPlatform.inquiries) {
        topPlatform = { name: pl.name, inquiries: stat.inquiries }
      }
    }

    return { publishedProps, totalVisits, totalInquiries, topPlatform, topProp }
  }, [properties, platforms, cellOf])

  /* ----- actions ----- */
  const runPublish = useCallback((propId, platId, platName, silent = false) => {
    const key = `${propId}:${platId}`
    setPublishing((prev) => new Set(prev).add(key))
    setTimeout(() => {
      setStatus(propId, platId, 'published')
      setPublishing((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
      if (!silent) showToast(`Publicada en ${platName}`)
    }, 1000)
  }, [setStatus, showToast])

  const handleMenuSelect = (propId, platId, platName, action) => {
    setMenuKey(null)
    const current = cellOf(propId, platId).status
    if (action === current) return
    if (action === 'published') {
      runPublish(propId, platId, platName)
    } else if (action === 'paused') {
      setStatus(propId, platId, 'paused')
      showToast(`Pausada en ${platName}`, 'muted')
    } else {
      setStatus(propId, platId, 'unpublished')
      showToast(`Despublicada de ${platName}`, 'muted')
    }
  }

  /* ----- selection & bulk ----- */
  const toggleSelect = (id) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const allFilteredSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id))
  const toggleSelectAll = () =>
    setSelected(() => (allFilteredSelected ? new Set() : new Set(filtered.map((p) => p.id))))

  const applyBulk = () => {
    const ids = [...selected]
    if (!ids.length) return
    const plat = platforms.find((pl) => pl.id === bulkPlatform)
    if (bulkAction === 'published') {
      ids.forEach((propId, i) =>
        setTimeout(() => runPublish(propId, bulkPlatform, plat.name, true), i * 140)
      )
      showToast(`Publicando ${ids.length} en ${plat.name}…`, 'info')
    } else {
      ids.forEach((propId) => setStatus(propId, bulkPlatform, bulkAction))
      const verb = bulkAction === 'paused' ? 'Pausadas' : 'Despublicadas'
      showToast(`${verb} ${ids.length} en ${plat.name}`, 'muted')
    }
    setSelected(new Set())
  }

  const handleReset = () => {
    resetPlatforms()
    setSelected(new Set())
    setExpandedId(null)
    showToast('Publicaciones restauradas', 'info')
  }

  /* ----- shared cell renderer ----- */
  const renderCell = (property, platform) => {
    const key = `${property.id}:${platform.id}`
    const cell = cellOf(property.id, platform.id)
    const isPublishing = publishing.has(key)
    const meta = STATUS_META[cell.status]
    const Icon = meta.Icon

    return (
      <div className="relative">
        <button
          type="button"
          disabled={isPublishing}
          onClick={() => setMenuKey((k) => (k === key ? null : key))}
          className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 ${
            isPublishing ? 'border-accent/40 bg-accent/10 text-accent' : CELL_TONE[cell.status]
          }`}
          title={`${platform.name}: ${meta.label}`}
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span className="hidden sm:inline">Publicando…</span>
            </>
          ) : (
            <>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{meta.short}</span>
              <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
            </>
          )}
        </button>

        <AnimatePresence>
          {menuKey === key && !isPublishing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 right-0 mt-1 w-44 rounded-xl border border-border bg-surface shadow-2xl overflow-hidden"
            >
              <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold text-muted">{platform.name}</p>
              {MENU_ACTIONS.map((a) => {
                const active = cell.status === a.id
                const ActionIcon = a.Icon
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleMenuSelect(property.id, platform.id, platform.name, a.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      active ? 'bg-surface-alt font-semibold text-text' : 'text-text hover:bg-surface-alt'
                    }`}
                  >
                    <ActionIcon className={`w-4 h-4 shrink-0 ${a.cls}`} />
                    <span className="flex-1 text-left">{a.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const propAggregate = (property) => {
    let visits = 0
    let published = 0
    for (const pl of platforms) {
      const c = cellOf(property.id, pl.id)
      visits += c.visits
      if (c.status === 'published') published += 1
    }
    return { visits, published }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Publicación en plataformas</h2>
          <p className="text-sm text-muted mt-1">
            Difundí tu cartera en los principales portales y seguí el rendimiento de cada aviso.
          </p>
        </div>
        <button type="button" onClick={handleReset} className={btnGhost}>
          Restaurar
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Globe}
          value={`${summary.publishedProps} / ${properties.length}`}
          label="Propiedades publicadas"
          subtext="En al menos un portal"
        />
        <SummaryCard
          icon={MessageSquare}
          value={summary.topPlatform?.name || '—'}
          label="Portal con más consultas"
          subtext={`${(summary.topPlatform?.inquiries || 0).toLocaleString('es-AR')} consultas`}
        />
        <SummaryCard
          icon={Eye}
          value={(summary.topProp?.visits || 0).toLocaleString('es-AR')}
          label="Propiedad más vista"
          subtext={summary.topProp?.title || '—'}
        />
        <SummaryCard
          icon={TrendingUp}
          value={summary.totalVisits.toLocaleString('es-AR')}
          label="Visitas totales"
          subtext={`${summary.totalInquiries.toLocaleString('es-AR')} consultas recibidas`}
        />
      </div>

      {/* Filter bar */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, barrio o dirección…"
            className="w-full text-sm rounded-lg border border-border bg-surface-alt text-text pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">Todos los estados</option>
          <option value="published">Con publicaciones activas</option>
          <option value="paused">Con pausadas</option>
          <option value="unpublished">Con sin publicar</option>
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-surface border border-border rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="pl-4 pr-2 py-3 w-10">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  aria-label="Seleccionar todas"
                  className="text-muted hover:text-accent transition-colors align-middle"
                >
                  {allFilteredSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </button>
              </th>
              <th className="px-3 py-3 font-semibold">Propiedad</th>
              {platforms.map((pl) => (
                <th key={pl.id} className="px-3 py-3 font-semibold text-center whitespace-nowrap">{pl.name}</th>
              ))}
              <th className="px-3 py-3 font-semibold text-right">Rendimiento</th>
              <th className="pr-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const agg = propAggregate(p)
              const isExpanded = expandedId === p.id
              const isSelected = selected.has(p.id)
              return (
                <Fragment key={p.id}>
                  <tr
                    className={`border-b border-border last:border-0 transition-colors ${
                      isSelected ? 'bg-accent/5' : 'hover:bg-surface-alt/40'
                    }`}
                  >
                    <td className="pl-4 pr-2 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelect(p.id)}
                        aria-label="Seleccionar propiedad"
                        className="text-muted hover:text-accent transition-colors align-middle"
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.title} className="w-11 h-11 rounded-lg object-cover shrink-0 bg-surface-alt" />
                        <div className="min-w-0">
                          <p className="font-semibold text-text truncate max-w-[200px]">{p.title}</p>
                          <p className="text-xs text-muted truncate">
                            {TYPE_LABELS[p.type] || p.type} · {OPERATION_LABELS[p.operation]} · {p.neighborhood}
                          </p>
                        </div>
                      </div>
                    </td>
                    {platforms.map((pl) => (
                      <td key={pl.id} className="px-3 py-3 w-[132px]">{renderCell(p, pl)}</td>
                    ))}
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <p className="font-semibold text-text inline-flex items-center gap-1 justify-end">
                        <Eye className="w-3.5 h-3.5 text-muted" /> {agg.visits.toLocaleString('es-AR')}
                      </p>
                      <p className="text-xs text-muted">{agg.published}/{platforms.length} activas</p>
                    </td>
                    <td className="pr-4 py-3">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : p.id)}
                        aria-label="Ver estadísticas"
                        aria-expanded={isExpanded}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                      >
                        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </button>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {isExpanded && (
                      <tr key={`${p.id}-stats`}>
                        <td colSpan={platforms.length + 4} className="p-0 border-b border-border">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <StatsPanel property={p} platforms={platforms} cellOf={cellOf} />
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-muted py-10">No hay propiedades que coincidan con los filtros.</p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((p, i) => {
          const agg = propAggregate(p)
          const isExpanded = expandedId === p.id
          const isSelected = selected.has(p.id)
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className={`bg-surface border rounded-xl p-4 ${isSelected ? 'border-accent/50 bg-accent/5' : 'border-border'}`}
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => toggleSelect(p.id)}
                  aria-label="Seleccionar propiedad"
                  className="mt-1 text-muted hover:text-accent transition-colors shrink-0"
                >
                  {isSelected ? <CheckSquare className="w-5 h-5 text-accent" /> : <Square className="w-5 h-5" />}
                </button>
                <img src={p.images?.[0]} alt={p.title} className="w-14 h-14 rounded-lg object-cover shrink-0 bg-surface-alt" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text leading-tight line-clamp-2">{p.title}</p>
                  <p className="text-xs text-muted mt-0.5 truncate">
                    {TYPE_LABELS[p.type] || p.type} · {p.neighborhood}
                  </p>
                  <p className="text-xs text-muted mt-0.5 inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {agg.visits.toLocaleString('es-AR')} · {agg.published}/{platforms.length} activas
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {platforms.map((pl) => (
                  <div key={pl.id}>
                    <p className="text-[11px] font-medium text-muted mb-1 px-0.5">{pl.name}</p>
                    {renderCell(p, pl)}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                <BarChart3 className="w-4 h-4" />
                {isExpanded ? 'Ocultar estadísticas' : 'Ver estadísticas'}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden -mx-4 mt-2"
                  >
                    <StatsPanel property={p} platforms={platforms} cellOf={cellOf} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted py-10">No hay propiedades que coincidan con los filtros.</p>
        )}
      </div>

      {/* Click-away layer for open cell popover */}
      {menuKey && <div className="fixed inset-0 z-20" onClick={() => setMenuKey(null)} />}

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] w-[min(94vw,720px)]"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl border border-border bg-surface/95 backdrop-blur px-3 sm:px-4 py-3 shadow-2xl">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-text">
                <Share2 className="w-4 h-4 text-accent" />
                {selected.size} seleccionada{selected.size > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-[220px] justify-end flex-wrap">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="text-sm rounded-lg border border-border bg-surface-alt text-text px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="published">Publicar</option>
                  <option value="paused">Pausar</option>
                  <option value="unpublished">Despublicar</option>
                </select>
                <span className="text-sm text-muted hidden sm:inline">en</span>
                <select
                  value={bulkPlatform}
                  onChange={(e) => setBulkPlatform(e.target.value)}
                  className="text-sm rounded-lg border border-border bg-surface-alt text-text px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {platforms.map((pl) => (
                    <option key={pl.id} value={pl.id}>{pl.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={applyBulk}
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-accent text-primary-contrast text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Check className="w-4 h-4" /> Aplicar
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  aria-label="Limpiar selección"
                  className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-alt transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {toastNode}
    </div>
  )
}

/* ---------- pieces ---------- */

function SummaryCard({ icon: Icon, value, label, subtext }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/15 text-accent mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-text leading-tight truncate" title={String(value)}>{value}</p>
      <p className="text-sm font-medium text-text mt-0.5">{label}</p>
      {subtext && <p className="text-xs text-muted mt-1 truncate" title={subtext}>{subtext}</p>}
    </div>
  )
}

function MiniBarChart({ series, tone }) {
  const max = Math.max(1, ...series)
  const barCls = BAR_TONE[tone] || BAR_TONE.accent
  const hasData = series.some((v) => v > 0)
  if (!hasData) {
    return (
      <div className="h-16 flex items-center justify-center rounded-lg bg-surface-alt/50">
        <span className="text-[11px] text-muted">Sin métricas todavía</span>
      </div>
    )
  }
  return (
    <div className="flex items-end gap-1 h-16">
      {series.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(6, (v / max) * 100)}%` }}
          transition={{ duration: 0.5, delay: i * 0.04 }}
          className={`flex-1 rounded-t ${barCls}`}
          title={`Día ${i + 1}: ${v} visitas`}
        />
      ))}
    </div>
  )
}

function StatsPanel({ property, platforms, cellOf }) {
  return (
    <div className="bg-surface-alt/40 px-4 sm:px-5 py-5">
      <p className="text-xs font-semibold text-muted mb-3 uppercase tracking-wide">
        Rendimiento por plataforma · {property.title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {platforms.map((pl) => {
          const c = cellOf(property.id, pl.id)
          const meta = STATUS_META[c.status]
          return (
            <div key={pl.id} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="font-semibold text-text text-sm truncate">{pl.name}</p>
                <StatusBadge label={meta.label} tone={meta.tone} dot={false} />
              </div>
              {c.status === 'unpublished' ? (
                <p className="text-sm text-muted py-4 text-center">Aviso no publicado en este portal.</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Stat icon={Eye} label="Visitas" value={c.visits.toLocaleString('es-AR')} />
                    <Stat icon={MessageSquare} label="Consultas" value={c.inquiries.toLocaleString('es-AR')} />
                    <Stat icon={CalendarClock} label="Publicada" value={`${daysSince(c.publishedAt)}d`} />
                  </div>
                  <MiniBarChart series={c.series} tone={pl.tone} />
                  <div className="flex items-center justify-between mt-2 text-[11px] text-muted">
                    <span>Visitas/día · últimos 7</span>
                    <span>{daysLabel(c.publishedAt)}</span>
                  </div>
                  {c.publishedAt && (
                    <p className="text-[11px] text-muted mt-1">Desde el {formatDate(c.publishedAt)}</p>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-surface-alt/60 px-2 py-2 text-center">
      <Icon className="w-3.5 h-3.5 text-muted mx-auto mb-1" />
      <p className="text-sm font-bold text-text leading-none">{value}</p>
      <p className="text-[10px] text-muted mt-1">{label}</p>
    </div>
  )
}

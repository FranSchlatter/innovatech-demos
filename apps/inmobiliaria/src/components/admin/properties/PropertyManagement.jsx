import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye } from 'lucide-react'
import { useAdminData } from '../../../hooks/useAdminData'
import StatusBadge from '../shared/StatusBadge'
import {
  formatPrice,
  OPERATION_LABELS,
  TYPE_LABELS,
  STATUS_LABELS
} from '../../../utils/format'

const STATUS_TONE = {
  available: 'success',
  reserved: 'warning',
  sold: 'info',
  rented: 'accent'
}

export default function PropertyManagement() {
  const { properties, agents, updateProperty } = useAdminData()

  const [operation, setOperation] = useState('all')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const agentName = (id) => agents.find((a) => a.id === id)?.name || '—'

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return properties.filter((p) => {
      if (operation !== 'all' && p.operation !== operation) return false
      if (type !== 'all' && p.type !== type) return false
      if (status !== 'all' && p.status !== status) return false
      if (q) {
        const hay = `${p.title} ${p.neighborhood}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [properties, operation, type, status, search])

  const forSale = properties.filter((p) => p.operation === 'sale').length
  const forRent = properties.filter(
    (p) => p.operation === 'rent' || p.operation === 'temporary'
  ).length

  const handleStatusChange = (id, value) => {
    updateProperty(id, { status: value })
  }

  const StatusSelect = ({ property }) => (
    <select
      value={property.status}
      onChange={(e) => handleStatusChange(property.id, e.target.value)}
      className="text-xs font-semibold rounded-lg border border-border bg-surface-alt text-text px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Propiedades</h2>
          <p className="text-sm text-muted mt-1">
            {filtered.length} de {properties.length} propiedades ·{' '}
            <span className="text-success font-medium">{forSale} en venta</span> ·{' '}
            <span className="text-accent font-medium">{forRent} en alquiler</span>
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">Todas las operaciones</option>
          {Object.entries(OPERATION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">Todos los tipos</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o barrio…"
            className="w-full text-sm rounded-lg border border-border bg-surface-alt text-text pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
      </div>

      {/* Desktop table */}
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
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Operación</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Vistas</th>
              <th className="px-4 py-3 font-semibold">Agente</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-alt/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-text truncate max-w-[260px]">{p.title}</p>
                      <p className="text-xs text-muted">{p.neighborhood}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text">{TYPE_LABELS[p.type] || p.type}</td>
                <td className="px-4 py-3 text-text">{OPERATION_LABELS[p.operation] || p.operation}</td>
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
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Eye className="w-3.5 h-3.5" /> {p.views ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-text whitespace-nowrap">{agentName(p.agentId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-muted py-10">No hay propiedades que coincidan con los filtros.</p>
        )}
      </motion.div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            className="bg-surface border border-border rounded-xl p-4"
          >
            <div className="flex gap-3">
              <img
                src={p.images?.[0]}
                alt={p.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text leading-tight">{p.title}</p>
                <p className="text-xs text-muted">{p.neighborhood}</p>
                <p className="text-sm font-semibold text-text mt-1">
                  {formatPrice(p.price, p.currency, p.operation)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted">
              <span className="rounded-full bg-surface-alt px-2 py-0.5">{TYPE_LABELS[p.type] || p.type}</span>
              <span className="rounded-full bg-surface-alt px-2 py-0.5">{OPERATION_LABELS[p.operation] || p.operation}</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {p.views ?? 0}
              </span>
              <span>· {agentName(p.agentId)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-3">
              <StatusBadge label={STATUS_LABELS[p.status]} tone={STATUS_TONE[p.status]} />
              <StatusSelect property={p} />
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted py-10">No hay propiedades que coincidan con los filtros.</p>
        )}
      </div>
    </div>
  )
}

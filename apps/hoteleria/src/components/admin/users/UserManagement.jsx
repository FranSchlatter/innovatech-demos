import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  UserCog,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  Check,
  Save,
  Mail,
  Clock,
  ShieldAlert,
  AlertTriangle,
  LayoutGrid,
  KeyRound
} from 'lucide-react'
import { useUsers } from '../../../hooks/useUsers'
import {
  ROLES,
  AREAS,
  ALL_AREA_IDS,
  getRole,
  getDefaultAreas,
  initials,
  timeAgo,
  isValidEmail
} from '../../../data/mockUsers'

// active / inactive pill — standard palette (supports /alpha, theme tokens don't)
const STATUS_PILL = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20'
}

// -------------------------------------------------------------------- Avatar
function Avatar({ user, size = 'md' }) {
  const role = getRole(user.role)
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
  }
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold shrink-0 ${role.solid} ${sizes[size]} ${
        user.status === 'inactive' ? 'opacity-50 grayscale' : ''
      }`}
      aria-hidden="true"
    >
      {initials(user.name)}
    </span>
  )
}

function RoleBadge({ roleId }) {
  const role = getRole(roleId)
  const Icon = role.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${role.badge}`}>
      <Icon className="w-3.5 h-3.5" />
      {role.label}
    </span>
  )
}

function StatusPill({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${STATUS_PILL[status] || STATUS_PILL.inactive}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {status === 'active' ? 'Activo' : 'Inactivo'}
    </span>
  )
}

// ------------------------------------------------------------- Create / edit
function UserModal({ open, editing, existingEmails, onClose, onSave }) {
  const empty = { name: '', email: '', role: 'front-desk', permissions: getDefaultAreas('front-desk'), status: 'active' }
  const [draft, setDraft] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!open) return
    setTouched(false)
    setDraft(
      editing
        ? {
            name: editing.name,
            email: editing.email,
            role: editing.role,
            permissions: [...(editing.permissions || [])],
            status: editing.status
          }
        : { ...empty, permissions: getDefaultAreas('front-desk') }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing])

  // Selecting a role pre-loads that role's default modules (editable after).
  const pickRole = (roleId) =>
    setDraft((d) => ({ ...d, role: roleId, permissions: getDefaultAreas(roleId) }))

  const toggleArea = (areaId) =>
    setDraft((d) => ({
      ...d,
      permissions: d.permissions.includes(areaId)
        ? d.permissions.filter((a) => a !== areaId)
        : [...d.permissions, areaId]
    }))

  const emailTrim = draft.email.trim().toLowerCase()
  const emailTaken = existingEmails.includes(emailTrim)
  const emailOk = isValidEmail(draft.email) && !emailTaken
  const nameOk = draft.name.trim().length >= 2
  const valid = nameOk && emailOk && draft.role

  const roleDefaults = getDefaultAreas(draft.role)
  const isPreset =
    draft.permissions.length === roleDefaults.length &&
    roleDefaults.every((a) => draft.permissions.includes(a))

  const handleSave = async () => {
    setTouched(true)
    if (!valid) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    onSave({
      name: draft.name.trim(),
      email: draft.email.trim(),
      role: draft.role,
      permissions: draft.permissions,
      status: draft.status
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
            className="relative w-full max-w-2xl bg-surface rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary text-primary-contrast">
                  {editing ? <UserCog className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">{editing ? 'Editar usuario' : 'Agregar usuario'}</h2>
                  {editing && <p className="text-xs text-muted">{editing.id}</p>}
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Name + email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="Ej: Ana Martínez"
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {touched && !nameOk && <p className="text-[11px] text-red-500 mt-1">Ingresá un nombre válido.</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={draft.email}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      placeholder="nombre@villaserena.com"
                      className="w-full pl-9 pr-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  {touched && emailTaken && <p className="text-[11px] text-red-500 mt-1">Ya existe un usuario con ese email.</p>}
                  {touched && !emailTaken && !isValidEmail(draft.email) && (
                    <p className="text-[11px] text-red-500 mt-1">Email inválido.</p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Rol</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((role) => {
                    const RoleIcon = role.icon
                    const active = draft.role === role.id
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => pickRole(role.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          active
                            ? 'bg-primary text-primary-contrast border-primary'
                            : 'bg-bg text-muted border-border hover:border-primary'
                        }`}
                      >
                        <RoleIcon className="w-3.5 h-3.5" />
                        {role.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted mt-2">{getRole(draft.role).description}</p>
              </div>

              {/* Permissions checklist */}
              <div>
                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                  <label className="text-sm font-medium text-text flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-muted" />
                    Módulos con acceso
                    <span className="text-xs font-normal text-muted">({draft.permissions.length}/{ALL_AREA_IDS.length})</span>
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => pickRole(draft.role)}
                      disabled={isPreset}
                      className="px-2 py-1 rounded-md text-primary hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Restablecer a los módulos por defecto del rol"
                    >
                      Preset del rol
                    </button>
                    <span className="text-border">|</span>
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, permissions: [...ALL_AREA_IDS] }))}
                      className="px-2 py-1 rounded-md text-muted hover:text-text hover:bg-bg transition-colors"
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, permissions: [] }))}
                      className="px-2 py-1 rounded-md text-muted hover:text-text hover:bg-bg transition-colors"
                    >
                      Ninguno
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AREAS.map((area) => {
                    const AreaIcon = area.icon
                    const on = draft.permissions.includes(area.id)
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleArea(area.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-colors ${
                          on ? 'bg-primary text-primary-contrast border-primary' : 'bg-bg text-text border-border hover:border-primary'
                        }`}
                      >
                        <AreaIcon className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium flex-1">{area.label}</span>
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            on ? 'bg-primary-contrast border-primary-contrast' : 'border-border'
                          }`}
                        >
                          {on && <Check className="w-3 h-3 text-primary" strokeWidth={3} />}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {draft.permissions.length === 0 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Sin módulos, el usuario no verá nada al ingresar.
                  </p>
                )}
              </div>

              {/* Status (edit only) */}
              {editing && (
                <div className="flex items-center justify-between bg-bg rounded-lg border border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-text">Estado de la cuenta</p>
                    <p className="text-xs text-muted">Un usuario inactivo no puede iniciar sesión.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, status: d.status === 'active' ? 'inactive' : 'active' }))}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      draft.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {draft.status === 'active' ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ------------------------------------------------------------- Confirm delete
function ConfirmDialog({ open, user, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {open && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-surface rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-text">Eliminar usuario</h3>
              </div>
              <p className="text-sm text-muted">
                ¿Seguro que querés eliminar a <span className="font-semibold text-text">{user.name}</span>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm(user.id)
                  onClose()
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ------------------------------------------------- Role → module access matrix
function RolePermissionsPanel({ users }) {
  const countByRole = useMemo(() => {
    const map = {}
    users.forEach((u) => {
      map[u.role] = (map[u.role] || 0) + 1
    })
    return map
  }, [users])

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Cada rol trae un set de módulos por defecto. Es el punto de partida al crear un usuario: los permisos se pueden ajustar
        por persona desde su ficha.
      </p>

      {/* Access matrix — roles as rows, modules as columns */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-text">Matriz de accesos por rol</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-semibold text-muted px-4 py-3 sticky left-0 bg-surface z-10">Rol</th>
                {AREAS.map((area) => {
                  const AreaIcon = area.icon
                  return (
                    <th key={area.id} className="px-2 py-3 font-medium text-muted" title={area.label}>
                      <div className="flex flex-col items-center gap-1 w-14">
                        <AreaIcon className="w-4 h-4" />
                        <span className="text-[10px] leading-tight text-center line-clamp-2">{area.label}</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => {
                const RoleIcon = role.icon
                return (
                  <tr key={role.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 sticky left-0 bg-surface z-10">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${role.solid}`}>
                          <RoleIcon className="w-4 h-4" />
                        </span>
                        <span className="font-medium text-text">{role.label}</span>
                      </div>
                    </td>
                    {AREAS.map((area) => {
                      const has = role.defaultAreas.includes(area.id)
                      return (
                        <td key={area.id} className="px-2 py-3 text-center">
                          {has ? (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mx-auto ${role.badge}`}>
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="text-border select-none">·</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {ROLES.map((role) => {
          const RoleIcon = role.icon
          const n = countByRole[role.id] || 0
          return (
            <div key={role.id} className="bg-surface rounded-xl border border-border p-4 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${role.solid}`}>
                    <RoleIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-text leading-tight">{role.label}</h4>
                    <p className="text-xs text-muted">{n} usuario{n === 1 ? '' : 's'}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted mb-3">{role.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {role.defaultAreas.length === ALL_AREA_IDS.length ? (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border ${role.badge}`}>
                    <ShieldAlert className="w-3 h-3" /> Acceso total
                  </span>
                ) : (
                  role.defaultAreas.map((areaId) => {
                    const area = AREAS.find((a) => a.id === areaId)
                    if (!area) return null
                    const AreaIcon = area.icon
                    return (
                      <span key={areaId} className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-bg text-muted border border-border">
                        <AreaIcon className="w-3 h-3" />
                        {area.label}
                      </span>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// -------------------------------------------------------------------- Main
export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus } = useUsers()
  const [tab, setTab] = useState('users') // users | roles
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // all | active | inactive
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const activeCount = users.filter((u) => u.status === 'active').length
  const adminCount = users.filter((u) => u.role === 'admin' && u.status === 'active').length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (q && !`${u.name} ${u.email}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [users, roleFilter, statusFilter, query])

  const existingEmails = useMemo(
    () => users.filter((u) => !editing || u.id !== editing.id).map((u) => u.email.trim().toLowerCase()),
    [users, editing]
  )

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (user) => {
    setEditing(user)
    setModalOpen(true)
  }
  const handleSave = (draft) => {
    if (editing) updateUser(editing.id, draft)
    else addUser(draft)
  }

  // Guard: never remove/deactivate the last active admin — the panel would lock
  // itself out of user management otherwise.
  const isLastAdmin = (user) => user.role === 'admin' && user.status === 'active' && adminCount <= 1

  const rowActions = (user) => (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => toggleUserStatus(user.id)}
        disabled={user.status === 'active' && isLastAdmin(user)}
        title={
          user.status === 'active' && isLastAdmin(user)
            ? 'No podés desactivar al único administrador activo'
            : user.status === 'active'
            ? 'Desactivar'
            : 'Activar'
        }
        className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          user.status === 'active' ? 'text-muted hover:text-amber-500 hover:bg-bg' : 'text-muted hover:text-emerald-500 hover:bg-bg'
        }`}
      >
        <Power className="w-4 h-4" />
      </button>
      <button
        onClick={() => openEdit(user)}
        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-bg transition-colors"
        title="Editar"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => setDeleting(user)}
        disabled={isLastAdmin(user)}
        title={isLastAdmin(user) ? 'No podés eliminar al único administrador activo' : 'Eliminar'}
        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Usuarios y roles
          </h1>
          <p className="text-sm text-muted">Gestioná las cuentas del equipo, sus roles y a qué módulos accede cada uno.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <UserPlus className="w-4 h-4" /> Agregar usuario
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted">Usuarios</p>
          <p className="text-2xl font-bold text-text">{users.length}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted">Activos</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted">Inactivos</p>
          <p className="text-2xl font-bold text-text">{users.length - activeCount}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted">Roles</p>
          <p className="text-2xl font-bold text-text">{ROLES.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface rounded-lg border border-border p-1 w-fit">
        {[
          { id: 'users', label: 'Usuarios', icon: Users },
          { id: 'roles', label: 'Permisos por rol', icon: KeyRound }
        ].map((t) => {
          const TabIcon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-text'
              }`}
            >
              <TabIcon className="w-4 h-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'roles' ? (
        <RolePermissionsPanel users={users} />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o email…"
                className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  roleFilter === 'all' ? 'bg-primary text-primary-contrast border-primary' : 'bg-surface text-muted border-border hover:border-primary'
                }`}
              >
                Todos
              </button>
              {ROLES.map((role) => {
                const RoleIcon = role.icon
                const active = roleFilter === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => setRoleFilter(active ? 'all' : role.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      active ? 'bg-primary text-primary-contrast border-primary' : 'bg-surface text-muted border-border hover:border-primary'
                    }`}
                  >
                    <RoleIcon className="w-3.5 h-3.5" /> {role.label}
                  </button>
                )
              })}
              <span className="w-px h-5 bg-border mx-1" />
              {['all', 'active', 'inactive'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    statusFilter === s ? 'bg-primary text-primary-contrast border-primary' : 'bg-surface text-muted border-border hover:border-primary'
                  }`}
                >
                  {s === 'all' ? 'Todo estado' : s === 'active' ? 'Activos' : 'Inactivos'}
                </button>
              ))}
            </div>
          </div>

          {/* Empty */}
          {filtered.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border text-center py-12">
              <Users className="w-10 h-10 mx-auto text-muted mb-2" />
              <p className="text-sm text-muted">No hay usuarios que coincidan con el filtro.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block bg-surface rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="font-semibold text-muted px-4 py-3">Usuario</th>
                        <th className="font-semibold text-muted px-4 py-3">Rol</th>
                        <th className="font-semibold text-muted px-4 py-3">Accesos</th>
                        <th className="font-semibold text-muted px-4 py-3">Estado</th>
                        <th className="font-semibold text-muted px-4 py-3">Último acceso</th>
                        <th className="font-semibold text-muted px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {filtered.map((user) => (
                          <motion.tr
                            key={user.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b border-border last:border-0 hover:bg-bg transition-colors"
                          >
                            <td className="px-4 py-3">
                              <button onClick={() => openEdit(user)} className="flex items-center gap-3 text-left group">
                                <Avatar user={user} />
                                <div className="min-w-0">
                                  <p className="font-medium text-text group-hover:text-primary transition-colors truncate">{user.name}</p>
                                  <p className="text-xs text-muted truncate">{user.email}</p>
                                </div>
                              </button>
                            </td>
                            <td className="px-4 py-3"><RoleBadge roleId={user.role} /></td>
                            <td className="px-4 py-3 text-muted whitespace-nowrap">
                              {user.permissions?.length === ALL_AREA_IDS.length ? 'Acceso total' : `${user.permissions?.length || 0} módulos`}
                            </td>
                            <td className="px-4 py-3"><StatusPill status={user.status} /></td>
                            <td className="px-4 py-3 text-muted whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> {timeAgo(user.lastLogin)}
                              </span>
                            </td>
                            <td className="px-4 py-3">{rowActions(user)}</td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                <AnimatePresence initial={false}>
                  {filtered.map((user) => (
                    <motion.div
                      key={user.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="bg-surface rounded-xl border border-border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar user={user} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-text truncate">{user.name}</p>
                          <p className="text-xs text-muted truncate">{user.email}</p>
                        </div>
                        {rowActions(user)}
                      </div>
                      <div className="flex items-center flex-wrap gap-2 mt-3">
                        <RoleBadge roleId={user.role} />
                        <StatusPill status={user.status} />
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                          <Clock className="w-3.5 h-3.5" /> {timeAgo(user.lastLogin)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </>
      )}

      <UserModal
        open={modalOpen}
        editing={editing}
        existingEmails={existingEmails}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={!!deleting}
        user={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={deleteUser}
      />
    </div>
  )
}

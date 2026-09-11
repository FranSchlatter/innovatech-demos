import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Pencil, ShieldCheck, Briefcase, UserCheck, Headphones, Ruler,
  LayoutDashboard, Building2, Users, CalendarDays, Handshake, Calculator,
  Wallet, Share2, UserCog, Check, X, Power, Clock, Loader2, KeyRound,
  Info, RotateCcw
} from 'lucide-react'
import { useUsers } from '../../../hooks/useUsers'
import StatusBadge from '../shared/StatusBadge'
import Modal from '../shared/Modal'
import { useToast } from '../shared/useToast'
import { fieldCls, labelCls, btnPrimary, btnGhost } from '../shared/formStyles'
import { formatDate, timeAgo } from '../../../utils/format'
import {
  USER_ROLES, ROLE_META, USER_STATUSES, PERMISSION_GROUPS, ALL_PERMISSIONS,
  ROLE_DEFAULT_PERMISSIONS, MODULES, ACCESS_LEVELS, accessFor, accessibleModuleCount
} from '../../../data/admin/mockUsers'

/* ---------- icon maps (kept out of the data layer) ---------- */
const ROLE_ICON = {
  ShieldCheck, Briefcase, UserCheck, Headphones, Ruler
}
const MODULE_ICON = {
  LayoutDashboard, Building2, Users, CalendarDays, Handshake,
  Calculator, Wallet, Share2, UserCog, ShieldCheck
}

const STATUS_META = USER_STATUSES.reduce((acc, s) => ({ ...acc, [s.id]: s }), {})

// Static tone → class maps (Tailwind can't see interpolated class names).
const TONE_BADGE = {
  accent: 'bg-accent/15 text-accent',
  info: 'bg-info/15 text-info',
  primary: 'bg-primary/15 text-primary',
  warning: 'bg-warning/15 text-warning',
  success: 'bg-success/15 text-success',
  error: 'bg-error/15 text-error',
  muted: 'bg-surface-alt text-muted'
}

const roleIconOf = (roleId) => ROLE_ICON[ROLE_META[roleId]?.icon] || ShieldCheck

/* ---------- module ---------- */

export default function UserManagement() {
  const { users, addUser, updateUser, toggleUserStatus, resetUsers } = useUsers()
  const { showToast, toastNode } = useToast()

  const [tab, setTab] = useState('users') // users | roles
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [newOpen, setNewOpen] = useState(false)

  const liveSelected = selectedId ? users.find((u) => u.id === selectedId) || null : null

  /* ----- filtering ----- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (q) {
        const hay = `${u.name} ${u.email} ${ROLE_META[u.role]?.label || ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [users, search, roleFilter])

  /* ----- KPIs ----- */
  const kpis = useMemo(() => {
    const active = users.filter((u) => u.status === 'active').length
    const admins = users.filter((u) => u.role === 'admin').length
    const rolesUsed = new Set(users.map((u) => u.role)).size
    const lastActive = users
      .filter((u) => u.lastLogin)
      .reduce((latest, u) => (!latest || u.lastLogin > latest.lastLogin ? u : latest), null)
    return { active, admins, rolesUsed, lastActive }
  }, [users])

  const countByRole = useMemo(() => {
    const map = {}
    for (const u of users) map[u.role] = (map[u.role] || 0) + 1
    return map
  }, [users])

  const handleToggle = (user) => {
    toggleUserStatus(user.id)
    showToast(
      user.status === 'active' ? `${user.name} desactivado` : `${user.name} activado`,
      user.status === 'active' ? 'muted' : 'success'
    )
  }

  const handleReset = () => {
    resetUsers()
    setSelectedId(null)
    setSearch('')
    setRoleFilter('all')
    showToast('Usuarios restaurados', 'info')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text">Usuarios y Roles</h2>
          <p className="text-sm text-muted mt-1">
            Gestioná el acceso del equipo: roles, permisos y estado de cada cuenta.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleReset} className={btnGhost}>
            <RotateCcw className="w-4 h-4" /> Restaurar
          </button>
          <button type="button" onClick={() => setNewOpen(true)} className={btnPrimary}>
            <Plus className="w-4 h-4" /> Agregar usuario
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} value={`${kpis.active}/${users.length}`} label="Usuarios activos" tone="text-success" />
        <KpiCard icon={ShieldCheck} value={kpis.admins} label="Administradores" tone="text-accent" />
        <KpiCard icon={KeyRound} value={`${kpis.rolesUsed}/${USER_ROLES.length}`} label="Roles en uso" tone="text-text" />
        <KpiCard
          icon={Clock}
          value={kpis.lastActive ? timeAgo(kpis.lastActive.lastLogin) : '—'}
          label={kpis.lastActive ? `Últ. ingreso · ${kpis.lastActive.name.split(' ')[0]}` : 'Sin actividad'}
          tone="text-info"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        <Tab active={tab === 'users'} onClick={() => setTab('users')} icon={Users} label="Usuarios" />
        <Tab active={tab === 'roles'} onClick={() => setTab('roles')} icon={ShieldCheck} label="Accesos por rol" />
      </div>

      <AnimatePresence mode="wait">
        {tab === 'users' ? (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Filter bar */}
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, email o rol…"
                  className="w-full text-sm rounded-lg border border-border bg-surface-alt text-text pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-sm rounded-lg border border-border bg-surface-alt text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="all">Todos los roles ({users.length})</option>
                {USER_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label} ({countByRole[r.id] || 0})</option>
                ))}
              </select>
            </div>

            <UsersTable
              users={filtered}
              onOpen={(u) => setSelectedId(u.id)}
              onToggle={handleToggle}
            />
          </motion.div>
        ) : (
          <motion.div
            key="roles"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <RoleAccessPanel countByRole={countByRole} />
          </motion.div>
        )}
      </AnimatePresence>

      <UserDetailModal
        user={liveSelected}
        onClose={() => setSelectedId(null)}
        updateUser={updateUser}
        toggleUserStatus={toggleUserStatus}
        showToast={showToast}
      />

      <NewUserModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        existingEmails={users.map((u) => u.email.toLowerCase())}
        addUser={addUser}
        showToast={showToast}
      />

      {toastNode}
    </div>
  )
}

/* ---------- KPI + tab helpers ---------- */

function KpiCard({ icon: Icon, value, label, tone = 'text-text' }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted truncate pr-2" title={label}>{label}</p>
        <Icon className="w-4 h-4 text-muted shrink-0" />
      </div>
      <p className={`text-xl font-bold mt-1 ${tone}`}>{value}</p>
    </div>
  )
}

function Tab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
        active ? 'text-accent' : 'text-muted hover:text-text'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {active && (
        <motion.span layoutId="user-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent rounded-full" />
      )}
    </button>
  )
}

/* ---------- users table + mobile cards ---------- */

function RolePill({ roleId }) {
  const meta = ROLE_META[roleId]
  const Icon = roleIconOf(roleId)
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-muted" />
      <StatusBadge label={meta?.label || roleId} tone={meta?.tone || 'muted'} dot={false} />
    </span>
  )
}

function UsersTable({ users, onOpen, onToggle }) {
  if (users.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl">
        <p className="text-center text-muted py-12">No hay usuarios que coincidan con los filtros.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border bg-surface-alt/50">
              <th className="px-4 py-3 font-semibold">Usuario</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">Permisos</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Último ingreso</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const st = STATUS_META[u.status] || STATUS_META.inactive
              const isActive = u.status === 'active'
              return (
                <tr
                  key={u.id}
                  className="border-b border-border last:border-0 hover:bg-surface-alt/40 transition-colors cursor-pointer"
                  onClick={() => onOpen(u)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className={`w-9 h-9 rounded-full object-cover bg-surface-alt ${!isActive ? 'grayscale opacity-60' : ''}`} />
                      <div className="min-w-0">
                        <p className="font-semibold text-text truncate">{u.name}</p>
                        <p className="text-xs text-muted truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><RolePill roleId={u.role} /></td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      {u.permissions.length} permiso{u.permissions.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge label={st.label} tone={st.tone} /></td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {u.lastLogin ? (
                      <span title={formatDate(u.lastLogin)}>{timeAgo(u.lastLogin)}</span>
                    ) : (
                      <span className="italic">Nunca ingresó</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <ToggleButton isActive={isActive} onClick={() => onToggle(u)} />
                      <button
                        type="button"
                        onClick={() => onOpen(u)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                        aria-label="Editar usuario"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {users.map((u, i) => {
          const st = STATUS_META[u.status] || STATUS_META.inactive
          const isActive = u.status === 'active'
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="bg-surface border border-border rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <img src={u.avatar} alt={u.name} className={`w-12 h-12 rounded-full object-cover bg-surface-alt shrink-0 ${!isActive ? 'grayscale opacity-60' : ''}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text truncate">{u.name}</p>
                  <p className="text-xs text-muted truncate">{u.email}</p>
                  <div className="mt-2"><RolePill roleId={u.role} /></div>
                </div>
                <StatusBadge label={st.label} tone={st.tone} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" /> {u.permissions.length} permisos
                </span>
                <span className="inline-flex items-center gap-1.5 justify-end">
                  <Clock className="w-3.5 h-3.5" /> {u.lastLogin ? timeAgo(u.lastLogin) : 'Nunca'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => onOpen(u)}
                  className="inline-flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold rounded-lg px-3 py-2 bg-accent text-primary-contrast hover:opacity-90 transition-opacity"
                >
                  <Pencil className="w-3.5 h-3.5" /> Ver / editar
                </button>
                <ToggleButton isActive={isActive} onClick={() => onToggle(u)} wide />
              </div>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

function ToggleButton({ isActive, onClick, wide = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isActive ? 'Desactivar usuario' : 'Activar usuario'}
      aria-label={isActive ? 'Desactivar usuario' : 'Activar usuario'}
      className={`inline-flex items-center justify-center gap-1.5 ${wide ? 'px-3' : 'w-8'} h-8 rounded-lg border transition-colors ${
        isActive
          ? 'border-success/40 bg-success/10 text-success hover:bg-success/20'
          : 'border-border bg-surface-alt text-muted hover:text-text'
      }`}
    >
      <Power className="w-4 h-4" />
      {wide && <span className="text-xs font-semibold">{isActive ? 'Activo' : 'Inactivo'}</span>}
    </button>
  )
}

/* ---------- permissions checklist (shared by both modals) ---------- */

function PermissionChecklist({ selected, onToggle }) {
  return (
    <div className="space-y-4">
      {PERMISSION_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-2">{group.label}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {group.perms.map((p) => {
              const active = selected.includes(p.id)
              return (
                <label
                  key={p.id}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer border transition-colors ${
                    active ? 'bg-accent/10 border-accent/40' : 'border-border hover:bg-surface-alt'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => onToggle(p.id)}
                    className="w-4 h-4 accent-accent shrink-0"
                  />
                  <span className={`text-sm truncate ${active ? 'text-text font-medium' : 'text-muted'}`}>{p.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- detail / edit modal ---------- */

function UserDetailModal({ user, onClose, updateUser, toggleUserStatus, showToast }) {
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      permissions: [...user.permissions]
    })
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!user || !form) return null

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  const togglePerm = (id) =>
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((x) => x !== id)
        : [...prev.permissions, id]
    }))
  const applyRolePreset = () =>
    setForm((prev) => ({ ...prev, permissions: [...(ROLE_DEFAULT_PERMISSIONS[prev.role] || [])] }))

  const isActive = user.status === 'active'
  const RoleIcon = roleIconOf(form.role)

  const save = () => {
    updateUser(user.id, {
      name: form.name.trim() || user.name,
      email: form.email.trim() || user.email,
      avatar: form.avatar.trim(),
      role: form.role,
      permissions: form.permissions
    })
    showToast('Usuario actualizado')
    onClose()
  }

  return (
    <Modal
      open={!!user}
      onClose={onClose}
      title={user.name}
      icon={Pencil}
      size="xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              toggleUserStatus(user.id)
              showToast(isActive ? `${user.name} desactivado` : `${user.name} activado`, isActive ? 'muted' : 'success')
            }}
            className={`inline-flex items-center gap-2 py-2.5 px-4 rounded-lg border font-medium transition-colors ${
              isActive
                ? 'border-error/40 text-error hover:bg-error/10'
                : 'border-success/40 text-success hover:bg-success/10'
            }`}
          >
            <Power className="w-4 h-4" /> {isActive ? 'Desactivar' : 'Activar'}
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className={btnGhost}>Cerrar</button>
            <button type="button" onClick={save} className={btnPrimary}>Guardar cambios</button>
          </div>
        </div>
      }
    >
      <div className="grid md:grid-cols-[1fr_320px]">
        {/* Left: editable fields */}
        <div className="p-5 md:p-6 space-y-6 md:border-r border-border">
          <div className="flex items-center gap-4">
            <img src={form.avatar || user.avatar} alt={form.name} className="w-16 h-16 rounded-full object-cover bg-surface-alt" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <RoleIcon className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-text">{ROLE_META[form.role]?.label}</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{user.id} · {user.email}</p>
              <div className="mt-1.5">
                <StatusBadge label={STATUS_META[user.status].label} tone={STATUS_META[user.status].tone} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nombre</label>
              <input value={form.name} onChange={set('name')} className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Rol</label>
              <select value={form.role} onChange={set('role')} className={fieldCls}>
                {USER_ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={set('email')} className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Avatar (URL)</label>
              <input value={form.avatar} onChange={set('avatar')} className={fieldCls} placeholder="https://…" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelCls} mb-0`}>Permisos ({form.permissions.length})</label>
              <button
                type="button"
                onClick={applyRolePreset}
                className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Aplicar preset del rol
              </button>
            </div>
            <PermissionChecklist selected={form.permissions} onToggle={togglePerm} />
          </div>
        </div>

        {/* Right: what this role sees */}
        <div className="p-5 md:p-6 bg-surface-alt/30">
          <h4 className="text-sm font-bold text-text mb-1 flex items-center gap-2">
            <Info className="w-4 h-4 text-accent" /> Qué ve este rol
          </h4>
          <p className="text-xs text-muted mb-3">{ROLE_META[form.role]?.description}</p>
          <RoleAccessList roleId={form.role} />
        </div>
      </div>
    </Modal>
  )
}

// Compact list of module access levels for a role (used in the detail modal).
function RoleAccessList({ roleId }) {
  return (
    <ul className="space-y-1.5">
      {MODULES.map((m) => {
        const access = accessFor(roleId, m.id)
        const lvl = ACCESS_LEVELS[access.level]
        const Icon = MODULE_ICON[m.icon] || Building2
        const isNone = access.level === 'none'
        return (
          <li
            key={m.id}
            className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 ${
              isNone ? 'border-border/60 opacity-55' : 'border-border bg-surface'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isNone ? 'text-muted' : 'text-accent'}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-text truncate">{m.label}</p>
              {access.note && <p className="text-[11px] text-muted truncate">{access.note}</p>}
            </div>
            <StatusBadge label={lvl.label} tone={lvl.tone} dot={false} />
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- new user modal ---------- */

function NewUserModal({ open, onClose, existingEmails, addUser, showToast }) {
  const [form, setForm] = useState(null)
  const [touched, setTouched] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        name: '',
        email: '',
        avatar: '',
        role: 'agente-junior',
        status: 'active',
        permissions: [...ROLE_DEFAULT_PERMISSIONS['agente-junior']]
      })
      setTouched(false)
      setCreating(false)
    }
  }, [open])

  if (!form) return null

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  // Switching role reloads the recommended preset (user can still tweak after).
  const onRoleChange = (e) => {
    const role = e.target.value
    setForm((prev) => ({ ...prev, role, permissions: [...(ROLE_DEFAULT_PERMISSIONS[role] || [])] }))
  }
  const togglePerm = (id) =>
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((x) => x !== id)
        : [...prev.permissions, id]
    }))

  const email = form.email.trim().toLowerCase()
  const nameInvalid = touched && !form.name.trim()
  const emailEmpty = touched && !email
  const emailFormat = touched && !!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const emailDup = touched && !!email && existingEmails.includes(email)
  const emailInvalid = emailEmpty || emailFormat || emailDup

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.name.trim() || !email || emailFormat || emailDup) return
    setCreating(true)
    // simulated persistence delay for realism
    setTimeout(() => {
      addUser({
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar.trim(),
        role: form.role,
        status: form.status,
        permissions: form.permissions
      })
      showToast('Usuario creado')
      setCreating(false)
      onClose()
    }, 600)
  }

  const RoleIcon = roleIconOf(form.role)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Agregar usuario"
      icon={Plus}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancelar</button>
          <button type="submit" form="new-user-form" disabled={creating} className={btnPrimary}>
            {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando…</> : <>Crear usuario</>}
          </button>
        </div>
      }
    >
      <form id="new-user-form" onSubmit={submit} className="p-5 md:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nombre *</label>
            <input value={form.name} onChange={set('name')} className={fieldCls} placeholder="Nombre y apellido" />
            {nameInvalid && <p className="text-xs text-error mt-1">El nombre es obligatorio.</p>}
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input type="email" value={form.email} onChange={set('email')} className={fieldCls} placeholder="email@terranova.com" />
            {emailEmpty && <p className="text-xs text-error mt-1">El email es obligatorio.</p>}
            {emailFormat && <p className="text-xs text-error mt-1">Formato de email inválido.</p>}
            {emailDup && <p className="text-xs text-error mt-1">Ya existe un usuario con ese email.</p>}
          </div>
          <div>
            <label className={labelCls}>Rol</label>
            <select value={form.role} onChange={onRoleChange} className={fieldCls}>
              {USER_ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Avatar (URL)</label>
            <input value={form.avatar} onChange={set('avatar')} className={fieldCls} placeholder="https://… (opcional)" />
          </div>
        </div>

        {/* Role hint */}
        <div className="flex items-start gap-2.5 rounded-lg bg-accent/10 border border-accent/30 px-3 py-2.5">
          <RoleIcon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-text">
            <span className="font-semibold">{ROLE_META[form.role]?.label}:</span>{' '}
            {ROLE_META[form.role]?.description}
          </p>
        </div>

        <div>
          <label className={`${labelCls} mb-2`}>Permisos (según el rol, editables)</label>
          <PermissionChecklist selected={form.permissions} onToggle={togglePerm} />
        </div>
      </form>
    </Modal>
  )
}

/* ---------- role access panel (informative tab) ---------- */

function RoleAccessPanel({ countByRole }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2.5 rounded-xl bg-surface border border-border px-4 py-3">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted">
          Cada rol define a qué módulos accede un usuario y con qué nivel. Los permisos individuales
          pueden ajustarse por usuario desde la pestaña <span className="font-semibold text-text">Usuarios</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {USER_ROLES.map((role, i) => {
          const Icon = roleIconOf(role.id)
          const total = accessibleModuleCount(role.id)
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.05 }}
              className="bg-surface border border-border rounded-xl overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <div className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${TONE_BADGE[role.tone] || TONE_BADGE.muted}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-text truncate">{role.label}</p>
                  <p className="text-xs text-muted truncate">{role.short}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-text leading-none">{countByRole[role.id] || 0}</p>
                  <p className="text-[10px] text-muted mt-0.5">usuario{(countByRole[role.id] || 0) !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Access grid */}
              <div className="p-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-2.5">
                  Accede a {total} de {MODULES.length} módulos
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {MODULES.map((m) => {
                    const access = accessFor(role.id, m.id)
                    if (access.level === 'none') return null
                    const lvl = ACCESS_LEVELS[access.level]
                    const MIcon = MODULE_ICON[m.icon] || Building2
                    return (
                      <div key={m.id} className="flex items-center gap-2 rounded-lg bg-surface-alt/60 px-2.5 py-2">
                        <MIcon className="w-3.5 h-3.5 text-accent shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-text truncate">{m.label}</p>
                          {access.note && <p className="text-[10px] text-muted truncate">{access.note}</p>}
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${TONE_BADGE[lvl.tone] || TONE_BADGE.muted}`}>
                          {lvl.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Modules with no access */}
                <NoAccessRow roleId={role.id} />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function NoAccessRow({ roleId }) {
  const blocked = MODULES.filter((m) => accessFor(roleId, m.id).level === 'none')
  if (blocked.length === 0) {
    return (
      <p className="mt-3 text-xs text-success inline-flex items-center gap-1.5">
        <Check className="w-3.5 h-3.5" /> Acceso completo a todos los módulos
      </p>
    )
  }
  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-[11px] text-muted flex items-start gap-1.5">
        <X className="w-3.5 h-3.5 shrink-0 mt-px" />
        <span>Sin acceso: {blocked.map((m) => m.label).join(' · ')}</span>
      </p>
    </div>
  )
}

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
import { useTranslation } from '../../../i18n/LanguageProvider'
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
  const { t } = useTranslation()
  const role = getRole(roleId)
  const Icon = role.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${role.badge}`}>
      <Icon className="w-3.5 h-3.5" />
      {t(`admin.users.roles.${role.id}`)}
    </span>
  )
}

function StatusPill({ status }) {
  const { t } = useTranslation()
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${STATUS_PILL[status] || STATUS_PILL.inactive}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {status === 'active' ? t('admin.users.status.active') : t('admin.users.status.inactive')}
    </span>
  )
}

// ------------------------------------------------------------- Create / edit
function UserModal({ open, editing, existingEmails, onClose, onSave }) {
  const { t } = useTranslation()
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
                  <h2 className="text-lg font-bold text-text">{editing ? t('admin.users.modal.editTitle') : t('admin.users.modal.createTitle')}</h2>
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
                  <label className="block text-sm font-medium text-text mb-2">{t('admin.users.modal.nameLabel')}</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder={t('admin.users.modal.namePlaceholder')}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {touched && !nameOk && <p className="text-[11px] text-red-500 mt-1">{t('admin.users.modal.nameError')}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">{t('admin.users.modal.emailLabel')}</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={draft.email}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      placeholder={t('admin.users.modal.emailPlaceholder')}
                      className="w-full pl-9 pr-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  {touched && emailTaken && <p className="text-[11px] text-red-500 mt-1">{t('admin.users.modal.emailTaken')}</p>}
                  {touched && !emailTaken && !isValidEmail(draft.email) && (
                    <p className="text-[11px] text-red-500 mt-1">{t('admin.users.modal.emailInvalid')}</p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t('admin.users.modal.roleLabel')}</label>
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
                        {t(`admin.users.roles.${role.id}`)}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted mt-2">{t(`admin.users.roleDescriptions.${draft.role}`)}</p>
              </div>

              {/* Permissions checklist */}
              <div>
                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                  <label className="text-sm font-medium text-text flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-muted" />
                    {t('admin.users.modal.permissionsLabel')}
                    <span className="text-xs font-normal text-muted">{t('admin.users.modal.permissionsCount', { count: draft.permissions.length, total: ALL_AREA_IDS.length })}</span>
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => pickRole(draft.role)}
                      disabled={isPreset}
                      className="px-2 py-1 rounded-md text-primary hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title={t('admin.users.modal.rolePresetTitle')}
                    >
                      {t('admin.users.modal.rolePreset')}
                    </button>
                    <span className="text-border">|</span>
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, permissions: [...ALL_AREA_IDS] }))}
                      className="px-2 py-1 rounded-md text-muted hover:text-text hover:bg-bg transition-colors"
                    >
                      {t('admin.users.modal.all')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, permissions: [] }))}
                      className="px-2 py-1 rounded-md text-muted hover:text-text hover:bg-bg transition-colors"
                    >
                      {t('admin.users.modal.none')}
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
                        <span className="text-sm font-medium flex-1">{t(`admin.users.areas.${area.id}`)}</span>
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
                    {t('admin.users.modal.noModulesWarning')}
                  </p>
                )}
              </div>

              {/* Status (edit only) */}
              {editing && (
                <div className="flex items-center justify-between bg-bg rounded-lg border border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-text">{t('admin.users.modal.accountStatus')}</p>
                    <p className="text-xs text-muted">{t('admin.users.modal.accountStatusHint')}</p>
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
                    {draft.status === 'active' ? t('admin.users.modal.active') : t('admin.users.modal.inactive')}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                {t('common.actions.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? t('common.actions.saving') : editing ? t('admin.users.modal.saveChanges') : t('admin.users.modal.create')}
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
  const { t } = useTranslation()
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
                <h3 className="text-lg font-bold text-text">{t('admin.users.delete.title')}</h3>
              </div>
              <p className="text-sm text-muted">
                {t('admin.users.delete.confirmPrefix')} <span className="font-semibold text-text">{user.name}</span>{t('admin.users.delete.confirmSuffix')}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text hover:bg-bg rounded-lg transition-colors">
                {t('common.actions.cancel')}
              </button>
              <button
                onClick={() => {
                  onConfirm(user.id)
                  onClose()
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> {t('admin.users.delete.confirm')}
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
  const { t } = useTranslation()
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
        {t('admin.users.rolesPanel.intro')}
      </p>

      {/* Access matrix — roles as rows, modules as columns */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-text">{t('admin.users.rolesPanel.matrixTitle')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-semibold text-muted px-4 py-3 sticky left-0 bg-surface z-10">{t('admin.users.rolesPanel.roleColumn')}</th>
                {AREAS.map((area) => {
                  const AreaIcon = area.icon
                  return (
                    <th key={area.id} className="px-2 py-3 font-medium text-muted" title={t(`admin.users.areas.${area.id}`)}>
                      <div className="flex flex-col items-center gap-1 w-14">
                        <AreaIcon className="w-4 h-4" />
                        <span className="text-[10px] leading-tight text-center line-clamp-2">{t(`admin.users.areas.${area.id}`)}</span>
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
                        <span className="font-medium text-text">{t(`admin.users.roles.${role.id}`)}</span>
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
                    <h4 className="font-semibold text-text leading-tight">{t(`admin.users.roles.${role.id}`)}</h4>
                    <p className="text-xs text-muted">{n === 1 ? t('admin.users.rolesPanel.userCount', { count: n }) : t('admin.users.rolesPanel.userCountPlural', { count: n })}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted mb-3">{t(`admin.users.roleDescriptions.${role.id}`)}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {role.defaultAreas.length === ALL_AREA_IDS.length ? (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border ${role.badge}`}>
                    <ShieldAlert className="w-3 h-3" /> {t('admin.users.rolesPanel.fullAccess')}
                  </span>
                ) : (
                  role.defaultAreas.map((areaId) => {
                    const area = AREAS.find((a) => a.id === areaId)
                    if (!area) return null
                    const AreaIcon = area.icon
                    return (
                      <span key={areaId} className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-bg text-muted border border-border">
                        <AreaIcon className="w-3 h-3" />
                        {t(`admin.users.areas.${area.id}`)}
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
  const { t } = useTranslation()
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
            ? t('admin.users.rowActions.lastAdminToggle')
            : user.status === 'active'
            ? t('admin.users.rowActions.deactivate')
            : t('admin.users.rowActions.activate')
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
        title={t('admin.users.rowActions.edit')}
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => setDeleting(user)}
        disabled={isLastAdmin(user)}
        title={isLastAdmin(user) ? t('admin.users.rowActions.lastAdminDelete') : t('admin.users.rowActions.delete')}
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
            <Users className="w-5 h-5 text-primary" /> {t('admin.users.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.users.subtitle')}</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-contrast text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <UserPlus className="w-4 h-4" /> {t('admin.users.add')}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted">{t('admin.users.kpis.users')}</p>
          <p className="text-2xl font-bold text-text">{users.length}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted">{t('admin.users.kpis.active')}</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted">{t('admin.users.kpis.inactive')}</p>
          <p className="text-2xl font-bold text-text">{users.length - activeCount}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted">{t('admin.users.kpis.roles')}</p>
          <p className="text-2xl font-bold text-text">{ROLES.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface rounded-lg border border-border p-1 w-fit">
        {[
          { id: 'users', label: t('admin.users.tabs.users'), icon: Users },
          { id: 'roles', label: t('admin.users.tabs.roles'), icon: KeyRound }
        ].map((tabItem) => {
          const TabIcon = tabItem.icon
          return (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === tabItem.id ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-text'
              }`}
            >
              <TabIcon className="w-4 h-4" /> {tabItem.label}
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
                placeholder={t('admin.users.filters.searchPlaceholder')}
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
                {t('admin.users.filters.all')}
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
                    <RoleIcon className="w-3.5 h-3.5" /> {t(`admin.users.roles.${role.id}`)}
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
                  {s === 'all' ? t('admin.users.filters.allStatus') : s === 'active' ? t('admin.users.filters.active') : t('admin.users.filters.inactive')}
                </button>
              ))}
            </div>
          </div>

          {/* Empty */}
          {filtered.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border text-center py-12">
              <Users className="w-10 h-10 mx-auto text-muted mb-2" />
              <p className="text-sm text-muted">{t('admin.users.emptyFiltered')}</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block bg-surface rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="font-semibold text-muted px-4 py-3">{t('admin.users.table.user')}</th>
                        <th className="font-semibold text-muted px-4 py-3">{t('admin.users.table.role')}</th>
                        <th className="font-semibold text-muted px-4 py-3">{t('admin.users.table.access')}</th>
                        <th className="font-semibold text-muted px-4 py-3">{t('admin.users.table.status')}</th>
                        <th className="font-semibold text-muted px-4 py-3">{t('admin.users.table.lastLogin')}</th>
                        <th className="font-semibold text-muted px-4 py-3 text-right">{t('admin.users.table.actions')}</th>
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
                              {user.permissions?.length === ALL_AREA_IDS.length ? t('admin.users.access.full') : t('admin.users.access.modules', { count: user.permissions?.length || 0 })}
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

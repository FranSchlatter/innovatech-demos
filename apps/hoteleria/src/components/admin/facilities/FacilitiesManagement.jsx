import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Umbrella, LayoutGrid, List, MapPin, Users, CheckCircle2, DollarSign,
  X, Unlock, UserPlus, RotateCcw, Info
} from 'lucide-react'
import PoolMapCanvas, { MapLegend } from '../../facilities/PoolMapCanvas'
import { useFacilities } from '../../../hooks/useFacilities'
import { useTranslation } from '../../../i18n/LanguageProvider'
import {
  typeConfig, statusConfig, ZONES
} from '../../../data/mockFacilities'

// ---------------------------------------------------------------- KPI card
function KPICard({ icon: Icon, label, value, sub, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface rounded-xl border border-border p-4 sm:p-5"
    >
      <div className={`inline-flex p-2.5 rounded-lg ${color} mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-text">{value}</h3>
      <p className="text-sm text-muted">{label}</p>
      {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
    </motion.div>
  )
}

const STATUS_FILTERS = [
  { id: 'all', key: 'admin.facilities.filters.all' },
  { id: 'available', key: 'admin.facilities.filters.available' },
  { id: 'occupied', key: 'admin.facilities.filters.occupied' },
  { id: 'reserved', key: 'admin.facilities.filters.reserved' }
]
const ZONE_FILTERS = [
  { id: 'all', key: 'admin.facilities.filters.allZones' },
  { id: 'pool', key: 'admin.facilities.filters.pool' },
  { id: 'beach', key: 'admin.facilities.filters.beach' }
]

export default function FacilitiesManagement() {
  const { t } = useTranslation()
  const { facilities, counts, releaseFacility, occupyFacility, resetFacilities } = useFacilities()

  const [tab, setTab] = useState('map') // 'map' | 'list'
  const [statusFilter, setStatusFilter] = useState('all')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [managing, setManaging] = useState(null) // spot being managed (modal)

  const filtered = useMemo(
    () => facilities.filter(
      (s) => (statusFilter === 'all' || s.status === statusFilter) &&
             (zoneFilter === 'all' || s.zone === zoneFilter)
    ),
    [facilities, statusFilter, zoneFilter]
  )

  // Group the list view by zone for readability.
  const grouped = useMemo(() => {
    const g = {}
    filtered.forEach((s) => { (g[s.zone] || (g[s.zone] = [])).push(s) })
    return g
  }, [filtered])

  // Keep the managed spot in sync with live state after an action.
  const managedLive = managing ? facilities.find((s) => s.id === managing.id) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">{t('admin.facilities.title')}</h1>
          <p className="text-sm text-muted">{t('admin.facilities.subtitle')}</p>
        </div>
        <button
          onClick={resetFacilities}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text text-sm font-semibold hover:border-accent transition"
        >
          <RotateCcw className="w-4 h-4" /> {t('admin.facilities.reset')}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard index={0} icon={Umbrella} label={t('admin.facilities.kpis.positions')} value={counts.total} sub={t('admin.facilities.kpis.positionsSub', { pool: counts.pool?.total || 0, beach: counts.beach?.total || 0 })} color="bg-primary" />
        <KPICard index={1} icon={CheckCircle2} label={t('admin.facilities.kpis.available')} value={counts.available} color="bg-emerald-500" />
        <KPICard index={2} icon={Users} label={t('admin.facilities.kpis.inUse')} value={counts.occupied + counts.reserved} sub={t('admin.facilities.kpis.inUseSub', { occupied: counts.occupied, reserved: counts.reserved })} color="bg-rose-500" />
        <KPICard index={3} icon={DollarSign} label={t('admin.facilities.kpis.cabanaRevenue')} value={`$${counts.revenue}`} sub={t('admin.facilities.kpis.perDay')} color="bg-amber-500" />
      </div>

      {/* Tabs + filters */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          {[{ id: 'map', key: 'admin.facilities.tabs.map', icon: LayoutGrid }, { id: 'list', key: 'admin.facilities.tabs.list', icon: List }].map((tab_) => (
            <button
              key={tab_.id}
              onClick={() => setTab(tab_.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold transition ${
                tab === tab_.id ? 'bg-accent text-white' : 'text-muted hover:text-text'
              }`}
            >
              <tab_.icon className="w-4 h-4" /> {t(tab_.key)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                statusFilter === f.id ? 'bg-accent text-white border-accent' : 'bg-surface text-muted border-border hover:border-accent'
              }`}
            >
              {t(f.key)}
            </button>
          ))}
          <span className="w-px h-6 bg-border mx-1 hidden sm:block" />
          {ZONE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setZoneFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                zoneFilter === f.id ? 'bg-primary text-primary-contrast border-primary' : 'bg-surface text-muted border-border hover:border-accent'
              }`}
            >
              {t(f.key)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-3"
          >
            <PoolMapCanvas
              spots={facilities}
              selectedId={managing?.id || null}
              onSelect={(s) => setManaging(s)}
              focusZone={zoneFilter === 'all' ? null : zoneFilter}
            />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <MapLegend />
              <p className="text-xs text-muted flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> {t('admin.facilities.tapToManage')}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {filtered.length === 0 && (
              <p className="text-center text-muted py-12">{t('admin.facilities.emptyList')}</p>
            )}
            {Object.keys(ZONES).filter((z) => grouped[z]?.length).map((zone) => (
              <div key={zone}>
                <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                  {zone === 'beach' ? <Umbrella className="w-4 h-4 text-accent" /> : <MapPin className="w-4 h-4 text-accent" />}
                  {t(`admin.facilities.zones.${zone}`)}
                  <span className="text-xs font-normal text-muted">{t('admin.facilities.zoneCount', { count: grouped[zone].length })}</span>
                </h3>
                <div className="space-y-2">
                  {grouped[zone].map((s) => (
                    <SpotRow key={s.id} spot={s} onManage={() => setManaging(s)} onRelease={() => releaseFacility(s.id)} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage modal */}
      <ManageModal
        spot={managedLive}
        onClose={() => setManaging(null)}
        onRelease={(id) => releaseFacility(id)}
        onOccupy={(id, name) => occupyFacility(id, name)}
      />
    </div>
  )
}

// ---------------------------------------------------------------- list row
function SpotRow({ spot, onManage, onRelease }) {
  const { t } = useTranslation()
  const tCfg = typeConfig(spot.type)
  const sCfg = statusConfig(spot.status)
  const TypeIcon = tCfg.icon
  const available = spot.status === 'available'

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
      <div className="w-10 h-10 rounded-lg bg-bg flex items-center justify-center flex-shrink-0">
        <TypeIcon className="w-5 h-5 text-accent" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-text truncate">{spot.label}</p>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${sCfg.softBg} ${sCfg.softText} ${sCfg.softBorder}`}>
            {t(`common.status.${spot.status}`)}
          </span>
        </div>
        <p className="text-xs text-muted truncate">
          {t(`admin.facilities.types.${spot.type}`)}
          {spot.guestName ? ` · ${spot.guestName}` : ''}
          {spot.reservedFor?.time ? ` · ${spot.reservedFor.time}` : ''}
          {spot.price > 0 ? ` · ${t('admin.facilities.row.perDay', { price: spot.price })}` : ''}
        </p>
      </div>
      {available ? (
        <button
          onClick={onManage}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-accent text-white hover:opacity-90 transition"
        >
          <UserPlus className="w-4 h-4" /> {t('admin.facilities.row.occupy')}
        </button>
      ) : (
        <button
          onClick={onRelease}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-bg text-text border border-border hover:border-accent transition"
        >
          <Unlock className="w-4 h-4" /> {t('admin.facilities.row.release')}
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- manage modal
function ManageModal({ spot, onClose, onRelease, onOccupy }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  // Reset the walk-in name field whenever a different spot opens.
  const currentId = spot?.id
  useEffect(() => { setName('') }, [currentId])

  return (
    <AnimatePresence>
      {spot && (
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
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-surface rounded-xl shadow-xl overflow-hidden"
          >
            {(() => {
              const tCfg = typeConfig(spot.type)
              const sCfg = statusConfig(spot.status)
              const TypeIcon = tCfg.icon
              const available = spot.status === 'available'
              return (
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-bg flex items-center justify-center flex-shrink-0">
                      <TypeIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-text leading-tight">{t('admin.facilities.modal.spotLabel', { label: spot.label, zone: t(`admin.facilities.zones.${spot.zone}`) })}</h3>
                      <p className="text-xs text-muted">{t(`admin.facilities.types.${spot.type}`)}{spot.price > 0 ? ` · ${t('admin.facilities.modal.perDay', { price: spot.price })}` : ''}</p>
                    </div>
                    <span className={`ml-auto text-[11px] font-semibold px-2 py-1 rounded-md border ${sCfg.softBg} ${sCfg.softText} ${sCfg.softBorder}`}>
                      {t(`common.status.${spot.status}`)}
                    </span>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg text-muted hover:text-text -mt-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {available ? (
                    <>
                      <label className="block text-xs font-semibold text-muted mb-2">{t('admin.facilities.modal.guestName')}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('admin.facilities.modal.guestPlaceholder')}
                        className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text placeholder:text-muted outline-none focus:border-accent mb-4"
                      />
                      <button
                        onClick={() => { onOccupy(spot.id, name); onClose() }}
                        className="w-full inline-flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
                      >
                        <UserPlus className="w-5 h-5" /> {t('admin.facilities.modal.markOccupied')}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-bg border border-border rounded-lg p-3 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-text">
                          <Users className="w-4 h-4 text-accent" />
                          <span className="font-medium">{spot.guestName || t('admin.facilities.modal.guest')}</span>
                        </div>
                        {spot.reservedFor?.date && (
                          <p className="text-xs text-muted mt-1">
                            {spot.reservedFor.time
                              ? t('admin.facilities.modal.reservedForTime', { date: spot.reservedFor.date, time: spot.reservedFor.time })
                              : t('admin.facilities.modal.reservedFor', { date: spot.reservedFor.date })}
                          </p>
                        )}
                        {spot.heldBy && (
                          <p className="text-xs text-muted mt-0.5">{spot.heldBy === 'guest' ? t('admin.facilities.modal.originGuest') : t('admin.facilities.modal.originFrontDesk')}</p>
                        )}
                      </div>
                      <button
                        onClick={() => { onRelease(spot.id); onClose() }}
                        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-contrast py-3 rounded-xl font-bold hover:opacity-90 transition"
                      >
                        <Unlock className="w-5 h-5" /> {t('admin.facilities.modal.release')}
                      </button>
                    </>
                  )}
                </div>
              )
            })()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

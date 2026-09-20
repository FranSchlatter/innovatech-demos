import { motion } from 'framer-motion'
import { Waves } from 'lucide-react'
import { typeConfig, statusConfig, zoneLabel, FACILITY_STATUS } from '../../data/mockFacilities'

// Shared, purely-presentational top-down map of the resort's pool deck + beach.
// Used by BOTH the guest BeachPoolMap overlay and the admin FacilitiesManagement,
// so it takes the spots and a click handler and stays dumb about business rules.
//
// Props:
//   spots       array of facility objects (see mockFacilities)
//   selectedId  currently highlighted spot id (optional)
//   onSelect    (spot) => void — fired on marker click
//   mineIds     ids the current visitor holds (drawn with an extra star ring)
//   focusZone   'pool' | 'beach' | null — dims the other zone when set

// Pixel footprint per facility type (bigger = more important). Tailwind sizes.
const SIZE = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-11 h-11'
}
const ICON = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
}

function Marker({ spot, selected, mine, dimmed, onSelect }) {
  const tCfg = typeConfig(spot.type)
  const sCfg = statusConfig(spot.status)
  const Icon = tCfg.icon
  const interactive = typeof onSelect === 'function'

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={() => onSelect?.(spot)}
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      className={`group absolute -translate-x-1/2 -translate-y-1/2 z-10 focus:outline-none
        ${dimmed ? 'opacity-30' : 'opacity-100'} transition-opacity`}
      aria-label={`${spot.label} — ${sCfg.label}${spot.guestName ? ` (${spot.guestName})` : ''}`}
    >
      <motion.span
        initial={false}
        animate={{ scale: selected ? 1.25 : 1 }}
        whileHover={interactive ? { scale: 1.18 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className={`flex items-center justify-center rounded-xl border shadow-md ${SIZE[tCfg.size]} ${sCfg.marker}
          ${selected ? `ring-4 ring-offset-1 ring-offset-transparent ${sCfg.ring}` : ''}
          ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <Icon className={ICON[tCfg.size]} />
        {mine && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white dark:border-stone-900" />
        )}
      </motion.span>

      {/* Hover tooltip (sits above the marker, never intercepts clicks) */}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-20">
        <span className="block rounded-lg bg-stone-900/95 text-white text-[11px] leading-tight px-2.5 py-1.5 shadow-lg">
          <span className="font-semibold">{spot.label}</span>
          <span className="mx-1 opacity-40">·</span>
          <span className={`font-medium ${
            spot.status === 'available' ? 'text-emerald-300'
            : spot.status === 'occupied' ? 'text-rose-300' : 'text-sky-300'
          }`}>{sCfg.label}</span>
          {spot.guestName && <span className="block text-white/70">{spot.guestName}</span>}
          {spot.price > 0 && <span className="block text-amber-300">${spot.price}/día</span>}
        </span>
      </span>
    </button>
  )
}

export default function PoolMapCanvas({ spots = [], selectedId = null, onSelect, mineIds = [], focusZone = null }) {
  return (
    <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[580px] rounded-2xl overflow-hidden border border-border select-none">
      {/* Deck / sand base */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200/70 dark:from-stone-800 dark:via-stone-800 dark:to-stone-900" />

      {/* Swimming pool */}
      <div
        className="absolute rounded-[2rem] bg-gradient-to-b from-sky-300 to-cyan-400 dark:from-sky-700 dark:to-cyan-800 shadow-inner ring-4 ring-white/60 dark:ring-white/10"
        style={{ left: '27%', top: '22%', width: '46%', height: '31%' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Waves className="w-8 h-8 text-white/60" />
        </div>
      </div>

      {/* Ocean strip at the bottom (beach shoreline) */}
      <div className="absolute inset-x-0 bottom-0 h-[11%] bg-gradient-to-b from-cyan-300 to-blue-500 dark:from-cyan-700 dark:to-blue-900" />
      <div className="absolute inset-x-0 bottom-[10.5%] h-3 bg-gradient-to-b from-transparent to-cyan-200/60 dark:to-cyan-800/40" />

      {/* Zone labels */}
      <span className="pointer-events-none absolute top-2 left-3 text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/40 text-stone-700 dark:text-stone-200">
        {zoneLabel('pool')}
      </span>
      <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/40 text-stone-700 dark:text-stone-200">
        {zoneLabel('beach')}
      </span>

      {/* Markers */}
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          spot={spot}
          selected={selectedId === spot.id}
          mine={mineIds.includes(spot.id)}
          dimmed={focusZone && spot.zone !== focusZone}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

// Small reusable legend (status colors) — rendered next to the canvas by callers.
export function MapLegend({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted ${className}`}>
      {Object.entries(FACILITY_STATUS).map(([key, cfg]) => (
        <span key={key} className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full ${cfg.solid}`} />
          {cfg.label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-amber-400" />
        Tu reserva
      </span>
    </div>
  )
}

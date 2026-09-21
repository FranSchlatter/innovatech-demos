import { motion } from 'framer-motion'
import {
  GraduationCap,
  School,
  Stethoscope,
  Pill,
  TrainFront,
  ShoppingCart,
  ShoppingBag,
  UtensilsCrossed,
  Trees,
  TreePine,
  Dumbbell,
  Footprints,
  Car,
  HeartPulse,
  Store,
  Navigation
} from 'lucide-react'
import { getNearbyPois } from '../data/pois'

// type -> icon (matches POI_TYPES in data/pois.js)
const TYPE_ICON = {
  school: GraduationCap,
  university: School,
  hospital: Stethoscope,
  pharmacy: Pill,
  transport: TrainFront,
  market: ShoppingCart,
  mall: ShoppingBag,
  restaurant: UtensilsCrossed,
  park: Trees,
  gym: Dumbbell
}

// category -> icon (for group headers)
const CATEGORY_ICON = {
  education: GraduationCap,
  health: HeartPulse,
  transport: TrainFront,
  shopping: Store,
  recreation: TreePine
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } }
}

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 }
}

export default function NearbyPlaces({ property }) {
  const { score, scoreLabel, totalCount, categoryCount, groups } =
    getNearbyPois(property)

  if (!groups.length) return null

  return (
    <section>
      {/* Header with inline location score */}
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="heading-sm">Qué hay cerca</h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Navigation className="w-4 h-4 text-accent hidden sm:block" />
          <span className="text-sm font-medium text-muted hidden sm:inline">
            {scoreLabel}
          </span>
          <span className="inline-flex items-baseline gap-0.5 rounded-lg bg-primary text-primary-contrast px-2.5 py-1 leading-none">
            <span className="text-base font-bold">{score}</span>
            <span className="text-[10px] font-medium opacity-80">/10</span>
          </span>
        </div>
      </div>
      <p className="text-sm text-muted mb-4">
        {totalCount} lugares cerca · {categoryCount}{' '}
        {categoryCount === 1 ? 'categoría' : 'categorías'}
      </p>

      {/* Categorized POIs — dense rows, 2 columns of groups on desktop */}
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {groups.map((group) => {
          const CatIcon = CATEGORY_ICON[group.key]
          return (
            <div key={group.key} className="min-w-0">
              <div className="flex items-center gap-2 mb-1 pb-1.5 border-b border-border">
                <CatIcon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text">
                  {group.label}
                </h3>
                <span className="text-xs text-muted">({group.items.length})</span>
              </div>

              <motion.ul
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {group.items.map((poi, i) => {
                  const Icon = TYPE_ICON[poi.type] || Store
                  const TravelIcon = poi.travel.mode === 'walk' ? Footprints : Car
                  return (
                    <motion.li
                      key={`${poi.name}-${i}`}
                      variants={item}
                      className="flex items-center gap-2.5 py-2 border-b border-border last:border-0"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center">
                        <Icon className="w-4 h-4 text-accent" />
                      </span>
                      <span
                        className="min-w-0 flex-1 truncate text-sm font-medium text-text"
                        title={poi.name}
                      >
                        {poi.name}
                      </span>
                      <span className="flex-shrink-0 flex items-center gap-1.5 text-xs text-muted whitespace-nowrap">
                        <span className="font-semibold text-text">{poi.distanceLabel}</span>
                        {poi.blocksLabel && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{poi.blocksLabel}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <TravelIcon className="w-3 h-3 flex-shrink-0" />
                        {poi.travel.minutes} min
                      </span>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

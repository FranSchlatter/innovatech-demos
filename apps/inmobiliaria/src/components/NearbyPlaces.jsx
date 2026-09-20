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
  visible: { transition: { staggerChildren: 0.05 } }
}

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
}

export default function NearbyPlaces({ property }) {
  const { score, scoreLabel, scorePercent, totalCount, categoryCount, groups } =
    getNearbyPois(property)

  if (!groups.length) return null

  return (
    <section>
      <h2 className="heading-sm mb-4">Qué hay cerca</h2>

      {/* Location score */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="rl-card rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-contrast flex flex-col items-center justify-center leading-none">
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-[10px] font-medium opacity-80">/ 10</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-accent flex-shrink-0" />
              <p className="font-semibold text-text truncate">{scoreLabel}</p>
            </div>
            <p className="text-sm text-muted">
              {totalCount} lugares cerca · {categoryCount}{' '}
              {categoryCount === 1 ? 'categoría' : 'categorías'}
            </p>

            {/* Score bar */}
            <div className="mt-3 h-2 rounded-full bg-surface-alt overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                whileInView={{ width: `${scorePercent}%` }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categorized POIs */}
      <div className="space-y-6">
        {groups.map((group) => {
          const CatIcon = CATEGORY_ICON[group.key]
          return (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-3">
                <CatIcon className="w-4 h-4 text-accent flex-shrink-0" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-text">
                  {group.label}
                </h3>
                <span className="text-xs text-muted">({group.items.length})</span>
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {group.items.map((poi, i) => {
                  const Icon = TYPE_ICON[poi.type] || Store
                  const TravelIcon = poi.travel.mode === 'walk' ? Footprints : Car
                  return (
                    <motion.div
                      key={`${poi.name}-${i}`}
                      variants={item}
                      className="rl-card rounded-xl p-4 flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-text text-sm truncate" title={poi.name}>
                          {poi.name}
                        </p>
                        <p className="text-xs text-muted">{poi.typeLabel}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-semibold text-text">{poi.distanceLabel}</p>
                        <p className="flex items-center justify-end gap-1 text-xs text-muted">
                          <TravelIcon className="w-3 h-3" />
                          {poi.travel.minutes} min
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

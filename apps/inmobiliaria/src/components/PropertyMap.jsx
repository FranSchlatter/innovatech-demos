import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { formatPrice } from '../utils/format'

/**
 * Stylized mock map. Property `lat` (top %) and `lng` (left %) are 0-100 values
 * used to position pins over a decorative map background (no external map lib).
 */
export default function PropertyMap({ properties = [], activeId, onSelect, height = 'h-[420px]' }) {
  return (
    <div className={`relative w-full ${height} rounded-xl overflow-hidden border border-border bg-surface-alt`}>
      {/* Decorative map grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />
      {/* Fake "streets" */}
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-1/3 h-3 bg-surface" />
        <div className="absolute left-0 right-0 top-2/3 h-2 bg-surface" />
        <div className="absolute top-0 bottom-0 left-1/4 w-3 bg-surface" />
        <div className="absolute top-0 bottom-0 left-2/3 w-2 bg-surface" />
      </div>

      {/* Pins */}
      {properties.map((p) => {
        const active = p.id === activeId
        return (
          <motion.button
            key={p.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => onSelect?.(p)}
            style={{ top: `${p.lat}%`, left: `${p.lng}%` }}
            className="absolute -translate-x-1/2 -translate-y-full group/pin"
          >
            <div className={`flex flex-col items-center ${active ? 'z-20' : 'z-10'}`}>
              <div className={`px-2 py-1 rounded-md text-xs font-bold shadow-md whitespace-nowrap transition-all ${
                active ? 'bg-accent text-primary-contrast scale-110' : 'bg-surface text-primary group-hover/pin:bg-primary group-hover/pin:text-primary-contrast'
              }`}>
                {formatPrice(p.price, p.currency, p.operation)}
              </div>
              <MapPin className={`w-6 h-6 -mt-1 ${active ? 'text-accent fill-accent/30' : 'text-primary'}`} />
            </div>
          </motion.button>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-surface/90 backdrop-blur text-xs text-muted border border-border">
        {properties.length} propiedades en el mapa
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Heart, BedDouble, Bath, Maximize, Car, MapPin, Camera } from 'lucide-react'
import { formatPrice, formatArea, OPERATION_LABELS, TYPE_LABELS, STATUS_LABELS } from '../utils/format'

const operationStyles = {
  sale: 'bg-accent text-primary-contrast',
  rent: 'bg-info text-white',
  temporary: 'bg-gold text-primary'
}

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onSelect }) {
  const p = property
  const unavailable = p.status !== 'available'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rl-card group flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-alt">
        <img
          src={p.images?.[0]}
          alt={p.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,15,30,0.65)] via-transparent to-transparent" />

        {/* Operation badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] ${operationStyles[p.operation]}`}>
          {OPERATION_LABELS[p.operation]}
        </span>

        {/* Status ribbon */}
        {unavailable && (
          <span className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] bg-primary text-primary-contrast">
            {STATUS_LABELS[p.status]}
          </span>
        )}

        {/* Virtual tour badge */}
        {p.virtualTour && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-[#f4efe4] bg-[rgba(9,15,30,0.6)] backdrop-blur-sm">
            <Camera className="w-3.5 h-3.5" /> Tour 360°
          </span>
        )}

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(p.id) }}
          aria-label="Guardar propiedad"
          className="absolute top-3 right-3 p-2 bg-[rgba(255,255,255,0.92)] hover:bg-white text-primary transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-error text-error' : ''}`} />
        </button>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3 text-right">
          <div className="rl-display text-xl drop-shadow-lg" style={{ color: '#ffffff' }}>
            {formatPrice(p.price, p.currency, p.operation)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-xs text-muted mb-3">
          <span className="rl-label !text-[0.6rem]">{TYPE_LABELS[p.type]}</span>
          <span className="w-1 h-1 rounded-full bg-hairline" />
          <span className="inline-flex items-center gap-1 truncate"><MapPin className="w-3.5 h-3.5 shrink-0" /> {p.neighborhood}, {p.city}</span>
        </div>

        <h3 className="rl-serif text-lg text-primary mb-4 line-clamp-2 min-h-[3.25rem]">{p.title}</h3>

        {/* Specs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted mb-5 mt-auto pt-4 border-t border-hairline">
          {p.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-accent" /> {p.bedrooms}</span>
          )}
          {p.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1.5"><Bath className="w-4 h-4 text-accent" /> {p.bathrooms}</span>
          )}
          {(p.areaCovered || p.areaTotal) > 0 && (
            <span className="inline-flex items-center gap-1.5"><Maximize className="w-4 h-4 text-accent" /> {formatArea(p.areaCovered || p.areaTotal)}</span>
          )}
          {p.garage > 0 && (
            <span className="inline-flex items-center gap-1.5"><Car className="w-4 h-4 text-accent" /> {p.garage}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onSelect?.(p, 'details')}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-contrast text-xs font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
          >
            Ver detalle
          </button>
          <button
            onClick={() => onSelect?.(p, 'schedule')}
            disabled={unavailable}
            className="flex-1 px-4 py-2.5 border border-primary text-primary text-xs font-semibold uppercase tracking-widest hover:bg-primary hover:text-primary-contrast transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Agendar
          </button>
        </div>
      </div>
    </motion.article>
  )
}

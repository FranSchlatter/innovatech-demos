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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-soft hover:shadow-medium transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-surface-alt">
        <img
          src={p.images?.[0]}
          alt={p.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

        {/* Operation badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${operationStyles[p.operation]}`}>
          {OPERATION_LABELS[p.operation]}
        </span>

        {/* Status ribbon */}
        {unavailable && (
          <span className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-contrast">
            {STATUS_LABELS[p.status]}
          </span>
        )}

        {/* Virtual tour badge */}
        {p.virtualTour && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
            <Camera className="w-3.5 h-3.5" /> Tour 360°
          </span>
        )}

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(p.id) }}
          aria-label="Guardar propiedad"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-primary transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-error text-error' : ''}`} />
        </button>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3 text-right">
          <div className="text-lg font-bold text-white drop-shadow">
            {formatPrice(p.price, p.currency, p.operation)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-xs text-muted mb-2">
          <span className="px-2 py-0.5 rounded bg-surface-alt text-text font-medium">{TYPE_LABELS[p.type]}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.neighborhood}, {p.city}</span>
        </div>

        <h3 className="text-base font-semibold text-primary mb-4 line-clamp-2 min-h-[3rem]">{p.title}</h3>

        {/* Specs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted mb-5 mt-auto">
          {p.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1"><BedDouble className="w-4 h-4" /> {p.bedrooms}</span>
          )}
          {p.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1"><Bath className="w-4 h-4" /> {p.bathrooms}</span>
          )}
          {(p.areaCovered || p.areaTotal) > 0 && (
            <span className="inline-flex items-center gap-1"><Maximize className="w-4 h-4" /> {formatArea(p.areaCovered || p.areaTotal)}</span>
          )}
          {p.garage > 0 && (
            <span className="inline-flex items-center gap-1"><Car className="w-4 h-4" /> {p.garage}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onSelect?.(p, 'details')}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-contrast text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Ver detalle
          </button>
          <button
            onClick={() => onSelect?.(p, 'schedule')}
            disabled={unavailable}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-text text-sm font-semibold hover:bg-surface-alt transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Agendar visita
          </button>
        </div>
      </div>
    </motion.div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  Share2,
  Camera,
  LayoutPanelTop,
  MapPin,
  DoorOpen,
  BedDouble,
  Bath,
  Maximize,
  Ruler,
  Car,
  CalendarClock,
  Compass,
  CheckCircle,
  Star,
  Calendar,
  Phone,
  MessageCircle
} from 'lucide-react'
import PropertyMap from '../components/PropertyMap'
import VirtualTourModal from '../components/VirtualTourModal'
import agents from '../data/agents.json'
import {
  formatPrice,
  formatDate,
  OPERATION_LABELS,
  TYPE_LABELS,
  STATUS_LABELS
} from '../utils/format'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

export default function PropertyDetailPage({ property, favorites, onBack, onSchedule }) {
  const [activeImage, setActiveImage] = useState(0)
  const [tourOpen, setTourOpen] = useState(false)
  const [showFloorPlan, setShowFloorPlan] = useState(false)

  const agent = agents.find((a) => a.id === property.agentId)
  const isFav = favorites.isFavorite(property.id)
  const isAvailable = property.status === 'available'

  const mainSrc = showFloorPlan && property.floorPlan
    ? property.floorPlan
    : property.images[activeImage]

  // Specs tiles (skip empty / zero values)
  const specs = [
    { icon: DoorOpen, value: property.rooms, label: 'Ambientes' },
    { icon: BedDouble, value: property.bedrooms, label: 'Dormitorios' },
    { icon: Bath, value: property.bathrooms, label: 'Baños' },
    { icon: Maximize, value: property.areaCovered, label: 'Cubiertos', suffix: ' m²' },
    { icon: Ruler, value: property.areaTotal, label: 'Totales', suffix: ' m²' },
    { icon: Car, value: property.garage, label: 'Cochera' },
    {
      icon: CalendarClock,
      value: property.yearBuilt,
      label: 'Antigüedad',
      render: (v) => (v === 0 ? 'A estrenar' : `${new Date().getFullYear() - v} años`)
    },
    { icon: Compass, value: property.orientation, label: 'Orientación' }
  ].filter((s) => s.value !== 0 && s.value !== null && s.value !== undefined && s.value !== '')

  // Mortgage estimate (sale only)
  let monthly = 0
  if (property.operation === 'sale') {
    const loan = property.price * 0.8
    const r = 0.08 / 12
    const n = 240
    monthly = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }

  const waNumber = agent ? agent.phone.replace(/[^\d]/g, '') : ''
  const waText = encodeURIComponent(`Hola, me interesa la propiedad "${property.title}".`)

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-muted hover:text-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a resultados
      </button>

      {/* Gallery */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="relative">
          <img
            src={mainSrc}
            alt={property.title}
            className="h-[300px] md:h-[460px] w-full object-cover rounded-2xl"
          />

          {/* Top-right actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => favorites.toggleFavorite(property.id)}
              aria-label="Favorito"
              className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-error text-error' : ''}`} />
            </button>
            <button
              aria-label="Compartir"
              className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom-left overlays */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {property.virtualTour && (
              <button
                onClick={() => setTourOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 text-white text-sm font-medium hover:bg-black/80 transition-colors"
              >
                <Camera className="w-4 h-4 text-gold" />
                Ver tour 360°
              </button>
            )}
            {property.floorPlan && (
              <button
                onClick={() => setShowFloorPlan((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 text-white text-sm font-medium hover:bg-black/80 transition-colors"
              >
                <LayoutPanelTop className="w-4 h-4" />
                {showFloorPlan ? 'Ver fotos' : 'Ver plano'}
              </button>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 overflow-x-auto mt-3 pb-1">
          {property.images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveImage(i)
                setShowFloorPlan(false)
              }}
              className={`flex-shrink-0 w-24 h-16 md:w-28 md:h-20 rounded-lg overflow-hidden transition-all ${
                !showFloorPlan && activeImage === i ? 'ring-2 ring-accent' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </motion.div>

      <VirtualTourModal
        open={tourOpen}
        images={property.images}
        title={property.title}
        onClose={() => setTourOpen(false)}
      />

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.4 }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-contrast">
                {OPERATION_LABELS[property.operation]}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-alt text-text border border-border">
                {TYPE_LABELS[property.type]}
              </span>
              {!isAvailable && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-warning/15 text-warning">
                  {STATUS_LABELS[property.status]}
                </span>
              )}
            </div>
            <h1 className="heading-md mb-3">{property.title}</h1>
            <div className="flex items-center gap-2 text-muted">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>
                {property.address}, {property.neighborhood}, {property.city}
              </span>
            </div>
          </motion.div>

          {/* Price */}
          <div>
            <p className="text-3xl md:text-4xl font-bold text-gold-gradient">
              {formatPrice(property.price, property.currency, property.operation)}
            </p>
            {property.expenses > 0 && (
              <p className="text-muted mt-1">
                + ${new Intl.NumberFormat('es-AR').format(property.expenses)} de expensas
              </p>
            )}
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specs.map((s, i) => {
              const Icon = s.icon
              const display = s.render ? s.render(s.value) : `${s.value}${s.suffix || ''}`
              return (
                <div key={i} className="bg-surface border border-border rounded-xl p-4 text-center">
                  <Icon className="w-5 h-5 mx-auto text-accent mb-2" />
                  <p className="font-semibold text-text">{display}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              )
            })}
          </div>

          {/* Description */}
          <section>
            <h2 className="heading-sm mb-3">Descripción</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{property.description}</p>
          </section>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <section>
              <h2 className="heading-sm mb-3">Comodidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-text">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location */}
          <section>
            <h2 className="heading-sm mb-3">Ubicación</h2>
            <PropertyMap properties={[property]} activeId={property.id} height="h-[320px]" />
          </section>
        </div>

        {/* RIGHT sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-28 self-start space-y-6">
            {/* Agent card */}
            {agent && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-surface border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-text truncate">{agent.name}</p>
                    <p className="text-sm text-muted truncate">{agent.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span className="text-sm text-text">{agent.rating}</span>
                      <span className="text-xs text-muted">({agent.reviews})</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSchedule(property)}
                  disabled={!isAvailable}
                  className="btn-gold w-full flex items-center justify-center gap-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-4 h-4" />
                  Agendar visita
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${agent.phone.replace(/\s/g, '')}`}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Llamar
                  </a>
                  <a
                    href={`https://wa.me/${waNumber}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </motion.div>
            )}

            {/* Mortgage estimate */}
            {property.operation === 'sale' && (
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-text mb-2">Estimación de crédito</h3>
                <p className="text-sm text-muted mb-1">Cuota estimada desde</p>
                <p className="text-2xl font-bold text-gold-gradient">
                  {formatPrice(Math.round(monthly), 'USD', 'sale')}
                  <span className="text-sm text-muted font-normal">/mes</span>
                </p>
                <p className="text-xs text-muted mt-2">20% anticipo · 20 años · 8% TNA</p>
              </div>
            )}

            {/* Published info */}
            <div className="text-sm text-muted space-y-1 px-1">
              <p>Publicado {formatDate(property.publishedAt)}</p>
              <p>{new Intl.NumberFormat('es-AR').format(property.views)} visualizaciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

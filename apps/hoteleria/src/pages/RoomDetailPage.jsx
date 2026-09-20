import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, MapPin, Users, Maximize2, Wifi, Coffee, Bath, Tv, AirVent, Compass } from 'lucide-react'
import VirtualTour360 from '@shared-ui/components/VirtualTour360'
import { useTranslation } from '../i18n/LanguageProvider'
import { useCurrency } from '../hooks/useCurrency'

export default function RoomDetailPage({ room, onBack, onReserve }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const [selectedImage, setSelectedImage] = useState(0)
  const [showTour, setShowTour] = useState(false)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!room) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-accent hover:text-primary transition"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('client.roomDetail.backToAccommodations')}
        </button>
      </div>
    )
  }

  // Gallery images: use the room's curated set when available, fall back to its single image
  const images = room.images?.length ? room.images : [room.image]

  // Room amenities
  const amenities = [
    { icon: Wifi, label: t('client.roomDetail.amenities.wifi') },
    { icon: AirVent, label: t('client.roomDetail.amenities.ac') },
    { icon: Tv, label: t('client.roomDetail.amenities.tv') },
    { icon: Coffee, label: t('client.roomDetail.amenities.coffee') },
    { icon: Bath, label: t('client.roomDetail.amenities.bath') },
    { icon: Maximize2, label: t('client.roomDetail.amenities.layout') }
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onBack}
        className="fixed top-24 left-6 z-40 flex items-center gap-2 text-accent hover:text-primary transition bg-bg px-4 py-2 rounded-lg shadow-soft"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">{t('client.roomDetail.back')}</span>
      </motion.button>

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-64 md:h-96 relative overflow-hidden"
      >
        <img
          src={images[selectedImage]}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setShowTour(true)}
          className="absolute bottom-6 right-6 z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black/55 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/70 transition-colors shadow-lg"
        >
          <Compass className="w-4 h-4" />
          {t('client.roomDetail.tour360')}
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-6 left-6 right-6 flex gap-2 justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                aria-label={t('client.roomDetail.viewImage', { index: idx + 1 })}
                className={`h-2 rounded-full transition-all ${
                  idx === selectedImage
                    ? 'w-8 bg-accent'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>

      <VirtualTour360 open={showTour} title={room.name} onClose={() => setShowTour(false)} />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="heading-md mb-4">{room.name}</h1>
              <div className="flex flex-wrap gap-6 text-muted mb-6">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-accent" />
                  <span>{room.size} m²</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  <span>{t('client.roomDetail.upToGuests', { count: room.guests })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>{t('client.roomDetail.luxuryType')}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-primary mb-4">{t('client.roomDetail.aboutTitle')}</h2>
              <p className="text-muted leading-relaxed mb-4">
                {room.description}
              </p>
              <p className="text-muted leading-relaxed">
                {t('client.roomDetail.aboutExtra')}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-primary mb-6">{t('client.roomDetail.amenitiesTitle')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {amenities.map((amenity, idx) => {
                  const Icon = amenity.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-4 rounded-lg bg-bg"
                    >
                      <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm text-muted">{amenity.label}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-bg p-8 rounded-lg">
              <h2 className="text-xl font-semibold text-primary mb-6">{t('client.roomDetail.specsTitle')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-sm text-muted mb-2">{t('client.roomDetail.totalArea')}</div>
                  <div className="text-lg font-semibold text-primary">{room.size} m²</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">{t('client.roomDetail.guestCapacity')}</div>
                  <div className="text-lg font-semibold text-primary">{room.guests} {t('client.roomDetail.guests')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">{t('client.roomDetail.bedding')}</div>
                  <div className="text-lg font-semibold text-primary">{t('client.roomDetail.premiumLinens')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">{t('client.roomDetail.bathroom')}</div>
                  <div className="text-lg font-semibold text-primary">{t('client.roomDetail.luxuryEnsuite')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">{t('client.roomDetail.climateControl')}</div>
                  <div className="text-lg font-semibold text-primary">{t('client.roomDetail.individualAc')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">{t('client.roomDetail.entertainment')}</div>
                  <div className="text-lg font-semibold text-primary">{t('client.roomDetail.smartTv')}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-fit"
          >
            <div className="bg-bg p-8 rounded-lg shadow-soft sticky top-24">
              {/* Price */}
              <div className="mb-8 pb-8 border-b border-surface">
                <div className="text-sm text-muted mb-2">{t('client.roomDetail.startingFrom')}</div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-accent">{format(room.price)}</span>
                  <span className="text-muted text-sm mb-1">{t('client.roomDetail.perNight')}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="font-semibold text-primary mb-4">{t('client.roomDetail.whyChoose')}</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">{t('client.roomDetail.reasons.views')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">{t('client.roomDetail.reasons.toiletries')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">{t('client.roomDetail.reasons.wifi')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">{t('client.roomDetail.reasons.concierge')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">{t('client.roomDetail.reasons.cancellation')}</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onReserve(room)}
                  className="btn-gold w-full text-center"
                >
                  {t('client.roomDetail.reserveNow')}
                </button>
                <button
                  onClick={onBack}
                  className="btn-secondary w-full text-center"
                >
                  {t('client.roomDetail.backToAccommodations')}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-surface text-center">
                <p className="text-xs text-muted mb-3">{t('client.roomDetail.securePoweredBy')}</p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted">
                  <span>{t('client.roomDetail.sslEncrypted')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

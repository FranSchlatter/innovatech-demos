import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Heart,
  Utensils,
  MapPin,
  ArrowRight,
  Check,
  X,
  Star,
  Wine,
  Sparkles,
  Flower2,
  Clock,
  Waves,
  ChefHat,
  Flame,
  Leaf,
  GlassWater,
  Landmark,
  Ticket,
  Car,
  Music,
  Dumbbell,
  Moon,
  ShieldCheck,
  CalendarRange
} from 'lucide-react'
import { useTranslation } from '../i18n/LanguageProvider'
import { useCurrency } from '../hooks/useCurrency'

// Curated experience packages. Each package is a stay (nightly rate) that bundles
// a set of perks. `priceValue` feeds the BookingForm math; per-item icons keep
// the inclusion list richer than a flat bullet list. Copy is translated at render
// time via the stable numeric `id` (title/tagline/descriptions/details/etc.).
const OFFERS = [
  {
    id: 1,
    detailIcons: [Wine, Sparkles, Utensils, Flower2, Clock, Waves],
    icon: Heart,
    priceValue: 520,
    highlight: true,
    bestSeller: true,
    wide: true,
    image:
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80'
  },
  {
    id: 2,
    detailIcons: [Utensils, Wine, ChefHat, Flame, Leaf, GlassWater],
    icon: Utensils,
    priceValue: 460,
    highlight: false,
    bestSeller: false,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80'
  },
  {
    id: 3,
    detailIcons: [MapPin, Landmark, Ticket, Utensils, Car, Music],
    icon: MapPin,
    priceValue: 390,
    highlight: false,
    bestSeller: false,
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'
  },
  {
    id: 4,
    detailIcons: [Leaf, Sparkles, Utensils, Dumbbell, Waves, Moon],
    icon: Flower2,
    priceValue: 540,
    highlight: false,
    bestSeller: false,
    wide: true,
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80'
  }
]

export default function OffersSection({ onReservePackage }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const [selectedOffer, setSelectedOffer] = useState(null)

  // Language-resolved copy for a package, keyed by its stable numeric id.
  const offerTitle = (offer) => t(`landing.offers.packages.${offer.id}.title`)
  const offerTagline = (offer) => t(`landing.offers.packages.${offer.id}.tagline`)
  const offerDescription = (offer) => t(`landing.offers.packages.${offer.id}.description`)
  const offerLongDescription = (offer) => t(`landing.offers.packages.${offer.id}.longDescription`)
  const offerPriceNote = (offer) => t(`landing.offers.packages.${offer.id}.priceNote`)
  const offerValidity = (offer) => t(`landing.offers.packages.${offer.id}.validity`)
  const offerCancellation = (offer) => t(`landing.offers.packages.${offer.id}.cancellation`)
  // details is stored as an array of strings; pair each with its icon by index.
  const offerDetails = (offer) => {
    const texts = t(`landing.offers.packages.${offer.id}.details`)
    return (Array.isArray(texts) ? texts : []).map((text, i) => ({
      icon: offer.detailIcons[i],
      text
    }))
  }

  // Hand the package off to the booking flow (App builds a room-like object from it).
  // Falls back to scrolling toward the booking/accommodation area if no handler is wired.
  const reservePackage = (offer) => {
    setSelectedOffer(null)
    if (onReservePackage) {
      // Pass a language-resolved copy so the booking flow shows translated text.
      onReservePackage({
        ...offer,
        title: offerTitle(offer),
        tagline: offerTagline(offer),
        description: offerDescription(offer),
        priceNote: offerPriceNote(offer),
        details: offerDetails(offer),
        cancellation: offerCancellation(offer)
      })
      return
    }
    const target =
      document.getElementById('booking-section') ||
      document.getElementById('accommodation')
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  // "Build your own" — send the guest to browse rooms rather than a fixed package.
  const scrollToBrowse = () => {
    const target =
      document.getElementById('accommodation') ||
      document.getElementById('booking-section')
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  // Close the detail modal with the Escape key
  useEffect(() => {
    if (!selectedOffer) return
    const onKey = (e) => e.key === 'Escape' && setSelectedOffer(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedOffer])

  return (
    <section className="py-20 md:py-32 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-4">{t('landing.offers.title')}</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t('landing.offers.subtitle')}
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
          {OFFERS.map((offer, idx) => {
            const Icon = offer.icon
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 ${
                  offer.highlight ? 'border-2 border-accent' : 'border border-border'
                } ${offer.wide ? 'lg:col-span-2' : ''}`}
              >
                <div className={`grid grid-cols-1 ${offer.wide ? 'md:grid-cols-2' : ''}`}>
                  {/* Image */}
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offerTitle(offer)}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {offer.bestSeller && (
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1.5 bg-gold rounded-full shadow-medium">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {t('landing.offers.bestSeller')}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col justify-between bg-surface">
                    <div>
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 rounded-lg flex-shrink-0 bg-bg">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="heading-sm text-primary mb-2">{offerTitle(offer)}</h3>
                          {offer.highlight && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-bg px-2 py-1 bg-accent rounded">
                              <Sparkles className="w-3 h-3" />
                              {t('landing.offers.featuredOffer')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted mb-6 leading-relaxed text-sm">
                        {offerDescription(offer)}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 mb-6">
                        <h4 className="text-sm font-semibold text-primary mb-3">{t('landing.offers.whatsIncluded')}</h4>
                        <ul className="space-y-2">
                          {offerDetails(offer).map((detail, i) => {
                            const DetailIcon = detail.icon
                            return (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                                <DetailIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                <span>{detail.text}</span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div>
                      <div className="mb-4 pt-4 border-t border-border">
                        <div className="text-sm text-muted mb-1">{t('landing.offers.packagePrice')}</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-accent">{t('landing.offers.priceFrom', { price: format(offer.priceValue) })}</span>
                          <span className="text-xs text-muted">{offerPriceNote(offer)}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedOffer(offer)}
                          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 ${
                            offer.highlight
                              ? 'bg-accent text-bg'
                              : 'bg-bg border border-accent text-accent'
                          }`}
                        >
                          {t('landing.offers.learnMore')}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => reservePackage(offer)}
                          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all hover:opacity-90 ${
                            offer.highlight
                              ? 'bg-bg border border-accent text-accent'
                              : 'bg-accent text-bg'
                          }`}
                        >
                          {t('landing.offers.reserve')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted mb-6 text-lg">{t('landing.offers.customTitle')}</p>
          <button onClick={scrollToBrowse} className="btn-secondary">
            {t('landing.offers.customButton')}
          </button>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOffer(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={t('landing.offers.detailsAria', { title: offerTitle(selectedOffer) })}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface shadow-medium"
            >
              {/* Hero image */}
              <div className="relative h-56 md:h-72 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedOffer.image}
                  alt={offerTitle(selectedOffer)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={() => setSelectedOffer(null)}
                  aria-label={t('landing.offers.close')}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {selectedOffer.bestSeller && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary px-2.5 py-1 bg-gold rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        {t('landing.offers.bestSeller')}
                      </span>
                    )}
                    {selectedOffer.highlight && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-bg px-2.5 py-1 bg-accent rounded-full">
                        <Sparkles className="w-3 h-3" />
                        {t('landing.offers.featured')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{offerTitle(selectedOffer)}</h3>
                  <p className="text-sm text-white/85 mt-1">{offerTagline(selectedOffer)}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8">
                <p className="text-muted leading-relaxed mb-6">{offerLongDescription(selectedOffer)}</p>

                {/* Inclusions */}
                <h4 className="text-sm font-semibold text-primary mb-4">{t('landing.offers.everythingIncluded')}</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {offerDetails(selectedOffer).map((detail, i) => {
                    const DetailIcon = detail.icon
                    return (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg">
                        <DetailIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text">{detail.text}</span>
                      </li>
                    )
                  })}
                </ul>

                {/* Validity + Cancellation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-bg border border-border">
                    <CalendarRange className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-primary mb-1">{t('landing.offers.validity')}</div>
                      <p className="text-xs text-muted leading-relaxed">{offerValidity(selectedOffer)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-bg border border-border">
                    <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-primary mb-1">{t('landing.offers.cancellationPolicy')}</div>
                      <p className="text-xs text-muted leading-relaxed">{offerCancellation(selectedOffer)}</p>
                    </div>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border">
                  <div>
                    <div className="text-sm text-muted mb-1">{t('landing.offers.packagePrice')}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-accent">{t('landing.offers.priceFrom', { price: format(selectedOffer.priceValue) })}</span>
                      <span className="text-xs text-muted">{offerPriceNote(selectedOffer)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => reservePackage(selectedOffer)}
                    className="btn-gold flex items-center justify-center gap-2 hover:opacity-90"
                  >
                    {t('landing.offers.reservePackage')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

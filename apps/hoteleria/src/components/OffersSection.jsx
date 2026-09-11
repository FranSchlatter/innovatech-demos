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

// Curated experience packages. Each package is a stay (nightly rate) that bundles
// a set of perks. `priceValue` feeds the BookingForm math; `details` carry a
// per-item icon so the list reads richer than a flat bullet list.
const OFFERS = [
  {
    id: 1,
    title: 'Romantic Escape',
    tagline: 'For couples chasing an unforgettable getaway',
    description:
      'The ultimate romantic retreat, curated for couples seeking intimate moments and lasting memories.',
    longDescription:
      'From the moment you arrive, every detail is arranged for two. Settle into a spacious suite with a private terrace, unwind with a couples spa ritual, and end each evening with a candlelit dinner prepared by our Michelin-starred kitchen. This package blends privacy, indulgence and effortless service into a getaway you will not want to end.',
    details: [
      { icon: Wine, text: 'Complimentary champagne & chocolates on arrival' },
      { icon: Sparkles, text: 'Couples spa ritual with 60-minute massage' },
      { icon: Utensils, text: 'Candlelit dinner for two at our Michelin restaurant' },
      { icon: Flower2, text: 'Fresh flower arrangement in your suite' },
      { icon: Clock, text: 'Guaranteed late checkout until 2:00 PM' },
      { icon: Waves, text: 'Private beach cabana access' }
    ],
    icon: Heart,
    price: 'From $520',
    priceValue: 520,
    priceNote: 'per night · perks included',
    validity: 'Valid Jan 6 – Dec 20, 2026',
    cancellation:
      'Free cancellation up to 7 days before arrival. Within 7 days, the first night is charged.',
    highlight: true,
    bestSeller: true,
    wide: true,
    image:
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80'
  },
  {
    id: 2,
    title: 'Culinary Journey',
    tagline: 'A gastronomic adventure for food lovers',
    description:
      'A gastronomic adventure with access to our world-class restaurants and cellar-curated wine pairings.',
    longDescription:
      'Designed for the truly curious palate, the Culinary Journey opens every door in our kitchens. Sit down to multi-course tasting menus, pair each plate with wines chosen by our head sommelier, roll up your sleeves for a hands-on class with the executive chef, and finish with a private mixology session. It is a full immersion into the craft behind great dining.',
    details: [
      { icon: Utensils, text: 'Multi-course tasting menu at every restaurant' },
      { icon: Wine, text: 'Premium wine pairings from our award-winning cellar' },
      { icon: ChefHat, text: 'Private consultation with the executive chef' },
      { icon: Flame, text: 'Hands-on cooking class for two' },
      { icon: Leaf, text: 'Farm-to-table dining experience' },
      { icon: GlassWater, text: 'Exclusive craft mixology session' }
    ],
    icon: Utensils,
    price: 'From $460',
    priceValue: 460,
    priceNote: 'per night · dining included',
    validity: 'Valid year-round, subject to restaurant availability',
    cancellation:
      'Free cancellation up to 48 hours before arrival. No-shows are charged the first night.',
    highlight: false,
    bestSeller: false,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80'
  },
  {
    id: 3,
    title: 'City Explorer',
    tagline: 'Culture, guides and hidden local gems',
    description:
      'Discover the hidden gems and cultural treasures of our city with guided tours and exclusive access.',
    longDescription:
      'Step beyond the guidebook. Our concierge team pairs you with local experts who reveal the neighbourhoods, markets and cultural venues most visitors never find. Private museum tours, curated food walks and evening entertainment are arranged around your pace, with transport handled end to end so you can simply enjoy the city.',
    details: [
      { icon: MapPin, text: 'Guided city tours with local experts' },
      { icon: Landmark, text: 'Exclusive access to cultural venues' },
      { icon: Ticket, text: 'Private museum & gallery tours' },
      { icon: Utensils, text: 'Local market and street-food tour' },
      { icon: Car, text: 'Private transportation throughout your stay' },
      { icon: Music, text: 'Evening entertainment reservations' }
    ],
    icon: MapPin,
    price: 'From $390',
    priceValue: 390,
    priceNote: 'per night · tours included',
    validity: 'Valid Mar 1 – Nov 30, 2026 (weather permitting)',
    cancellation:
      'Free cancellation up to 72 hours before arrival. Tours can be rescheduled at no cost.',
    highlight: false,
    bestSeller: false,
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'
  },
  {
    id: 4,
    title: 'Wellness Retreat',
    tagline: 'Reset your body and mind',
    description:
      'A restorative escape blending spa, movement and nourishing cuisine to leave you completely renewed.',
    longDescription:
      'Slow down and reconnect. The Wellness Retreat pairs daily yoga and meditation with generous spa credit, a personalised training session and a nourishing detox menu crafted by our wellness chef. Between treatments, unwind in the thermal pool and sauna, and drift off with our signature aromatherapy turndown. You will leave lighter than you arrived.',
    details: [
      { icon: Leaf, text: 'Daily yoga & guided meditation sessions' },
      { icon: Sparkles, text: 'Full-body spa & massage credit' },
      { icon: Utensils, text: 'Detox & wellness cuisine menu' },
      { icon: Dumbbell, text: 'Private personal-training session' },
      { icon: Waves, text: 'Unlimited thermal pool & sauna access' },
      { icon: Moon, text: 'Aromatherapy turndown service' }
    ],
    icon: Flower2,
    price: 'From $540',
    priceValue: 540,
    priceNote: 'per night · spa included',
    validity: 'Valid year-round',
    cancellation:
      'Free cancellation up to 5 days before arrival. Spa appointments reschedulable anytime.',
    highlight: false,
    bestSeller: false,
    wide: true,
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80'
  }
]

export default function OffersSection({ onReservePackage }) {
  const [selectedOffer, setSelectedOffer] = useState(null)

  // Hand the package off to the booking flow (App builds a room-like object from it).
  // Falls back to scrolling toward the booking/accommodation area if no handler is wired.
  const reservePackage = (offer) => {
    setSelectedOffer(null)
    if (onReservePackage) {
      onReservePackage(offer)
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
          <h2 className="heading-md mb-4">Curated Experiences</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Handpicked packages designed to elevate your stay and create lasting memories
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
                      alt={offer.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {offer.bestSeller && (
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1.5 bg-gold rounded-full shadow-medium">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Más vendido
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
                          <h3 className="heading-sm text-primary mb-2">{offer.title}</h3>
                          {offer.highlight && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-bg px-2 py-1 bg-accent rounded">
                              <Sparkles className="w-3 h-3" />
                              Featured Offer
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted mb-6 leading-relaxed text-sm">
                        {offer.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 mb-6">
                        <h4 className="text-sm font-semibold text-primary mb-3">What's Included:</h4>
                        <ul className="space-y-2">
                          {offer.details.map((detail, i) => {
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
                        <div className="text-sm text-muted mb-1">Package Price</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-accent">{offer.price}</span>
                          <span className="text-xs text-muted">{offer.priceNote}</span>
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
                          Learn More
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
                          Reserve
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
          <p className="text-muted mb-6 text-lg">Can't find your perfect experience?</p>
          <button onClick={scrollToBrowse} className="btn-secondary">
            Customize Your Package
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
              aria-label={`${selectedOffer.title} package details`}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface shadow-medium"
            >
              {/* Hero image */}
              <div className="relative h-56 md:h-72 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedOffer.image}
                  alt={selectedOffer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={() => setSelectedOffer(null)}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {selectedOffer.bestSeller && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary px-2.5 py-1 bg-gold rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        Más vendido
                      </span>
                    )}
                    {selectedOffer.highlight && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-bg px-2.5 py-1 bg-accent rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedOffer.title}</h3>
                  <p className="text-sm text-white/85 mt-1">{selectedOffer.tagline}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8">
                <p className="text-muted leading-relaxed mb-6">{selectedOffer.longDescription}</p>

                {/* Inclusions */}
                <h4 className="text-sm font-semibold text-primary mb-4">Everything included in this package:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {selectedOffer.details.map((detail, i) => {
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
                      <div className="text-sm font-semibold text-primary mb-1">Validity</div>
                      <p className="text-xs text-muted leading-relaxed">{selectedOffer.validity}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-bg border border-border">
                    <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-primary mb-1">Cancellation policy</div>
                      <p className="text-xs text-muted leading-relaxed">{selectedOffer.cancellation}</p>
                    </div>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border">
                  <div>
                    <div className="text-sm text-muted mb-1">Package Price</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-accent">{selectedOffer.price}</span>
                      <span className="text-xs text-muted">{selectedOffer.priceNote}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => reservePackage(selectedOffer)}
                    className="btn-gold flex items-center justify-center gap-2 hover:opacity-90"
                  >
                    Reservar este paquete
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

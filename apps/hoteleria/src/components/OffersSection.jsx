import { motion } from 'framer-motion'
import { Sparkles, Heart, Utensils, MapPin, ArrowRight, Check } from 'lucide-react'

export default function OffersSection() {
  const offers = [
    {
      id: 1,
      title: 'Romantic Escape',
      description: 'Experience the ultimate romantic getaway with our specially curated package designed for couples seeking intimate moments and unforgettable memories.',
      details: [
        'Complimentary champagne upon arrival',
        'Spa credit for couples treatments',
        'Candlelit dinner for two at our Michelin restaurant',
        'Fresh flower arrangement in your suite',
        'Late checkout (until 2 PM)',
        'Private beach access'
      ],
      icon: Heart,
      price: 'Included',
      highlight: true,
      image: 'https://cdn.pixabay.com/photo/2016/11/18/22/21/bride-1837148_1280.jpg?w=800&q=80'
    },
    {
      id: 2,
      title: 'Culinary Journey',
      description: 'Embark on a gastronomic adventure with access to our world-class restaurants and wine pairings curated by our expert sommeliers.',
      details: [
        'Multi-course tasting menu at all restaurants',
        'Premium wine pairings from our award-winning cellar',
        'Private chef consultation',
        'Cooking class with our executive chef',
        'Farm-to-table dining experience',
        'Exclusive mixology session'
      ],
      icon: Utensils,
      price: 'Premium',
      highlight: false,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'
    },
    {
      id: 3,
      title: 'City Explorer',
      description: 'Discover the hidden gems and cultural treasures of our vibrant city with guided tours and exclusive access to local experiences.',
      details: [
        'Guided city tours with local experts',
        'Exclusive cultural venue access',
        'Private museum and gallery tours',
        'Local market and food tours',
        'Transportation included',
        'Evening entertainment reservations'
      ],
      icon: MapPin,
      price: 'Included',
      highlight: false,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'
    },
    // {
    //   id: 4,
    //   title: 'Wellness Retreat',
    //   description: 'Rejuvenate your mind, body, and spirit with our comprehensive wellness program featuring treatments and personalized wellness coaching.',
    //   details: [
    //     'Daily yoga and meditation sessions',
    //     'Spa treatments and massages',
    //     'Personalized wellness consultation',
    //     'Fitness classes with certified trainers',
    //     'Healthy cuisine meal plan',
    //     'Holistic wellness program'
    //   ],
    //   icon: Sparkles,
    //   price: 'Premium',
    //   highlight: false,
    //   image: 'https://images.unsplash.com/photo-1544367567-0d6fcffe7e2b?w=800&q=80'
    // }
  ]

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {offers.map((offer, idx) => {
            const Icon = offer.icon
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 ${
                  offer.highlight ? 'border-2 border-accent lg:col-span-2' : 'border border-border'
                }`}
              >
                <div className={`grid grid-cols-1 ${offer.highlight ? 'md:grid-cols-2' : ''}`}>
                  {/* Image */}
                  <div className="h-64 md:h-full overflow-hidden">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col justify-between bg-surface">
                    <div>
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${
                          offer.highlight ? 'bg-accent/20' : 'bg-bg'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            offer.highlight ? 'text-accent' : 'text-primary'
                          }`} />
                        </div>
                        <div>
                          <h3 className="heading-sm text-primary mb-2">{offer.title}</h3>
                          {offer.highlight && (
                            <span className="inline-block text-xs font-semibold text-accent px-2 py-1 bg-accent/10 rounded">
                              ⭐ Featured Offer
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
                          {offer.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted">
                              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div>
                      <div className="mb-4 pb-4 border-t border-border">
                        <div className="text-sm text-muted mb-1">Package Price</div>
                        <div className="text-xl font-bold text-accent">{offer.price}</div>
                      </div>

                      <div className="flex gap-3">
                        <button className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                          offer.highlight 
                            ? 'bg-accent text-bg hover:bg-accent/90' 
                            : 'bg-surface border border-accent text-accent hover:bg-accent/5'
                        }`}>
                          Learn More
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                            offer.highlight
                              ? 'bg-surface border border-accent text-accent hover:bg-accent/5'
                              : 'bg-accent text-bg hover:bg-accent/90'
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
          <button className="btn-secondary">
            Customize Your Package
          </button>
        </motion.div>
      </div>
    </section>
  )
}

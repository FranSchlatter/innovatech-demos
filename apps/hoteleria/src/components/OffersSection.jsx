import { motion } from 'framer-motion'
import { Sparkles, Heart, Utensils, MapPin } from 'lucide-react'

export default function OffersSection() {
  const offers = [
    {
      id: 1,
      title: 'Romantic Escape',
      description: 'Complimentary champagne, spa credit, and candlelit dinner for two',
      icon: Heart,
      price: 'Included',
      highlight: true
    },
    {
      id: 2,
      title: 'Culinary Journey',
      description: 'Experience our Michelin-starred restaurants with wine pairings',
      icon: Utensils,
      price: 'Premium',
      highlight: false
    },
    {
      id: 3,
      title: 'City Explorer',
      description: 'Guided tours, local experiences, and exclusive cultural access',
      icon: MapPin,
      price: 'Included',
      highlight: false
    },
    {
      id: 4,
      title: 'Wellness Retreat',
      description: 'Spa treatments, yoga sessions, and personalized wellness programs',
      icon: Sparkles,
      price: 'Premium',
      highlight: false
    }
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
            Discover handpicked offers designed to elevate your stay
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer, idx) => {
            const Icon = offer.icon
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`p-8 rounded-lg transition-all duration-300 ${
                  offer.highlight
                    ? 'bg-accent/10 border-2 border-accent shadow-medium'
                    : 'bg-surface border border-border hover:shadow-medium'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${offer.highlight ? 'bg-accent/20' : 'bg-surface'}`}>
                    <Icon className={`w-6 h-6 ${offer.highlight ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-sm text-primary mb-1">{offer.title}</h3>
                    {offer.highlight && (
                      <span className="inline-block text-xs font-semibold text-accent mb-2">
                        ✓ Featured Offer
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-muted mb-6 leading-relaxed">{offer.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted">{offer.price}</span>
                  <button className={offer.highlight ? 'btn-primary' : 'btn-secondary'}>
                    Learn More
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

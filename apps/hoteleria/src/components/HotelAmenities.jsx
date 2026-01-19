import { motion } from 'framer-motion'
import { Dumbbell, Waves, Utensils, Wifi, Accessibility, Car, Check, ChevronDown, Trophy, Users, Leaf } from 'lucide-react'
import { useState } from 'react'

export default function HotelAmenities() {
  const [showExtended, setShowExtended] = useState(false)

  const amenities = [
    {
      id: 1,
      name: 'Fitness Center',
      description: 'State-of-the-art equipment with personal training available',
      icon: Dumbbell,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80'
    },
    {
      id: 2,
      name: 'Infinity Pool',
      description: 'Panoramic rooftop pool with cabana service and city views',
      icon: Waves,
      image: 'https://cdn.pixabay.com/photo/2014/08/17/23/45/hotel-420260_1280.jpg?w=600&q=80'
    },
    {
      id: 3,
      name: 'Fine Dining',
      description: 'Multiple Michelin-starred restaurants and bars',
      icon: Utensils,
      image: 'https://images.unsplash.com/photo-1676716260600-217008b2e00a?w=600&q=80'
    },
    {
      id: 4,
      name: 'Game room',
      description: 'Billiards, arcade games, and entertainment for all ages',
      icon: Trophy,
      image: 'https://cdn.pixabay.com/photo/2014/04/05/11/29/plaza-hotel-315892_1280.jpg?w=600&q=80'
    },
    {
      id: 5,
      name: 'Conference Facilities',
      description: 'Full-service meeting rooms with modern technology',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1621020512837-280d1c1ccc7b?w=600&q=80'
    },
    {
      id: 6,
      name: 'Spa & Wellness',
      description: 'Relaxation and rejuvenation with spa treatments and therapies',
      icon: Leaf,
      image: 'https://cdn.pixabay.com/photo/2018/02/27/03/36/stones-3184610_1280.jpg?w=600&q=80'
    }
  ]

  const extendedAmenities = [
    'Accessibility',
    'High-Speed WiFi',
    '24-Hour Fitness Center',
    'Parking & Valet Service',
    'Room Service (24/7)',
    'Concierge Assistance',
    'Business Center',
    'Kids Club',
    'Guest Laundry Service',
    'Currency Exchange',
    'Travel Desk',
    'Car Rental Service',
    'Airport Transfers',
    'Turndown Service',
    'Minibar Selection',
    'In-Room Entertainment'
  ]

  return (
    <section className="py-20 md:py-32 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-4">World-Class Amenities</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Everything you need for an exceptional experience
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, idx) => {
            const Icon = amenity.icon
            return (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="overflow-hidden rounded-lg bg-bg shadow-soft hover:shadow-medium transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-surface">
                  <img
                    src={amenity.image}
                    alt={amenity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-5 h-5 text-accent" />
                    <h3 className="heading-sm text-primary">{amenity.name}</h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{amenity.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Extended Amenities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-bg rounded-lg p-8 border border-border"
        >
          <button
            onClick={() => setShowExtended(!showExtended)}
            className="w-full flex items-center justify-between mb-6"
          >
            <h3 className="text-2xl font-serif font-light text-primary">Additional Services & Amenities</h3>
            <motion.div
              animate={{ rotate: showExtended ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-accent" />
            </motion.div>
          </button>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: showExtended ? 1 : 0, height: showExtended ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {extendedAmenities.map((amenity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: showExtended ? 1 : 0, x: showExtended ? 0 : -10 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-surface rounded-lg"
                >
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted">{amenity}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

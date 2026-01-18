import { motion } from 'framer-motion'
import { Dumbbell, Waves, Utensils, Wifi, Accessibility, Car } from 'lucide-react'

export default function HotelAmenities() {
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
      image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80'
    },
    {
      id: 3,
      name: 'Fine Dining',
      description: 'Multiple Michelin-starred restaurants and bars',
      icon: Utensils,
      image: 'https://images.unsplash.com/photo-1504674900152-b8b6c6d0c4a0?w=600&q=80'
    },
    {
      id: 4,
      name: 'High-Speed WiFi',
      description: 'Complimentary premium internet throughout the property',
      icon: Wifi,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80'
    },
    {
      id: 5,
      name: 'Accessibility',
      description: 'Fully accessible facilities and specialized services',
      icon: Accessibility,
      image: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=600&q=80'
    },
    {
      id: 6,
      name: 'Parking',
      description: 'Secure underground parking with valet service',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80'
    }
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
      </div>
    </section>
  )
}

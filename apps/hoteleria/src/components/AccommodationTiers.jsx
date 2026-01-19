import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AccommodationTiers({ onSelectRoom }) {
  const [activeTab, setActiveTab] = useState('rooms')

  const accommodations = {
    rooms: [
      {
        id: 1,
        type: 'rooms',
        name: 'Deluxe Room',
        size: 45,
        guests: 2,
        price: 189,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
        description: 'Spacious rooms with modern amenities and city views'
      },
      {
        id: 2,
        type: 'rooms',
        name: 'Superior Room',
        size: 55,
        guests: 2,
        price: 239,
        image: 'https://cdn.pixabay.com/photo/2021/12/18/06/13/hotel-6878054_1280.jpg?w=600&q=80',
        description: 'Premium accommodations with enhanced comfort'
      },
      {
        id: 3,
        type: 'rooms',
        name: 'Executive Room',
        size: 65,
        guests: 3,
        price: 299,
        image: 'https://cdn.pixabay.com/photo/2023/04/13/07/27/bedroom-7921915_1280.jpg?w=600&q=80',
        description: 'Executive rooms featuring work areas and lounge access'
      }
    ],
    suites: [
      {
        id: 4,
        type: 'suites',
        name: 'Junior Suite',
        size: 85,
        guests: 2,
        price: 380,
        image: 'https://cdn.pixabay.com/photo/2016/10/13/09/06/travel-1737168_1280.jpg?w=600&q=80',
        description: 'Elegant suites with separate living areas'
      },
      {
        id: 5,
        type: 'suites',
        name: 'Executive Suite',
        size: 120,
        guests: 4,
        price: 520,
        image: 'https://cdn.pixabay.com/photo/2015/06/29/13/03/hotel-hall-825561_1280.jpg?w=600&q=80',
        description: 'Spacious suites with premium finishes'
      },
      {
        id: 6,
        type: 'suites',
        name: 'Signature Suite',
        size: 150,
        guests: 4,
        price: 680,
        image: 'https://cdn.pixabay.com/photo/2017/08/27/10/16/interior-2685521_1280.jpg?w=600&q=80',
        description: 'Luxury suites with panoramic views'
      }
    ],
    villas: [
      {
        id: 7,
        type: 'villas',
        name: 'Garden Villa',
        size: 200,
        guests: 4,
        price: 980,
        image: 'https://cdn.pixabay.com/photo/2020/11/28/02/17/lagoon-5783445_1280.jpg?w=600&q=80',
        description: 'Private villas with manicured gardens and pools'
      },
      {
        id: 8,
        type: 'villas',
        name: 'Penthouse Villa',
        size: 280,
        guests: 6,
        price: 1380,
        image: 'https://cdn.pixabay.com/photo/2020/03/21/20/04/real-estate-4955093_1280.jpg?w=600&q=80',
        description: 'Ultimate luxury with private terraces'
      },
      {
        id: 9,
        type: 'villas',
        name: 'Presidential Villa',
        size: 350,
        guests: 8,
        price: 1980,
        image: 'https://cdn.pixabay.com/photo/2020/03/21/20/03/real-estate-4955087_1280.jpg?w=600&q=80',
        description: 'Exclusive estates with concierge service'
      }
    ]
  }

  const tabs = [
    { id: 'rooms', label: 'Rooms', description: 'From 45 m²' },
    { id: 'suites', label: 'Suites', description: 'From 85 m²' },
    { id: 'villas', label: 'Villas', description: 'From 200 m²' }
  ]

  return (
    <section id="accommodation" className="py-20 md:py-32 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-4">Choose Your Sanctuary</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Select from our curated collection of rooms, suites, and villas
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 md:gap-8 mb-16 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 border-b-2 transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-accent text-primary font-semibold'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              <div className="text-lg font-medium">{tab.label}</div>
              <div className="text-xs text-muted">{tab.description}</div>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accommodations[activeTab].map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group overflow-hidden rounded-lg bg-bg shadow-soft hover:shadow-medium transition-all duration-400"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-surface">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="heading-sm text-primary mb-2">{item.name}</h3>
                    <div className="flex gap-6 text-sm text-muted mb-4">
                      <span>{item.size} m²</span>
                      <span>{item.guests} guests</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted mb-1">from</div>
                    <div className="text-2xl font-bold text-accent">${item.price}</div>
                  </div>
                </div>

                <p className="text-muted text-sm mb-6 line-clamp-2">{item.description}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => onSelectRoom?.(item, 'details')}
                    className="btn-secondary flex-1 text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onSelectRoom?.(item, 'reserve')}
                    className="btn-gold flex-1 text-center"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

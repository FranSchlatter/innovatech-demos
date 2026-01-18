import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronLeft, MapPin, Users, Maximize2, Wifi, Coffee, Bath, Tv, AirVent } from 'lucide-react'

export default function RoomDetailPage({ room, onBack, onReserve }) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!room) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-accent hover:text-primary transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Accommodations
        </button>
      </div>
    )
  }

  // Extended images for gallery
  const images = [
    room.image,
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=800&q=80'
  ]

  // Room amenities
  const amenities = [
    { icon: Wifi, label: 'High-Speed WiFi' },
    { icon: AirVent, label: 'Air Conditioning' },
    { icon: Tv, label: 'Smart TV' },
    { icon: Coffee, label: 'Coffee Machine' },
    { icon: Bath, label: 'Luxury Bathroom' },
    { icon: Maximize2, label: 'Spacious Layout' }
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
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-screen md:h-96 relative overflow-hidden"
      >
        <img
          src={images[selectedImage]}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 right-6 flex gap-2 justify-center">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`h-2 transition-all ${
                idx === selectedImage
                  ? 'w-8 bg-accent'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </motion.div>

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
                  <span>Up to {room.guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>Luxury {room.type.slice(0, -1)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-primary mb-4">About This {room.type.slice(0, -1)}</h2>
              <p className="text-muted leading-relaxed mb-4">
                {room.description}
              </p>
              <p className="text-muted leading-relaxed">
                Experience unparalleled comfort and elegance in our {room.type.slice(0, -1).toLowerCase()}. 
                With meticulous attention to detail and world-class amenities, every moment of your stay will be memorable.
                Our dedicated concierge team is available 24/7 to ensure your complete satisfaction.
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-primary mb-6">Room Amenities</h2>
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
              <h2 className="text-xl font-semibold text-primary mb-6">Room Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-sm text-muted mb-2">Total Area</div>
                  <div className="text-lg font-semibold text-primary">{room.size} m²</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Guest Capacity</div>
                  <div className="text-lg font-semibold text-primary">{room.guests} guests</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Bedding</div>
                  <div className="text-lg font-semibold text-primary">Premium Linens</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Bathroom</div>
                  <div className="text-lg font-semibold text-primary">Luxury Ensuite</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Climate Control</div>
                  <div className="text-lg font-semibold text-primary">Individual AC</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Entertainment</div>
                  <div className="text-lg font-semibold text-primary">Smart TV</div>
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
                <div className="text-sm text-muted mb-2">Starting from</div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-accent">${room.price}</span>
                  <span className="text-muted text-sm mb-1">per night</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="font-semibold text-primary mb-4">Why Choose This {room.type.slice(0, -1)}</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">Stunning views and natural light</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">Premium toiletries and bath amenities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">Complimentary high-speed WiFi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">24/7 concierge service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">Flexible cancellation policy</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onReserve(room)}
                  className="btn-gold w-full text-center"
                >
                  Reserve Now
                </button>
                <button
                  onClick={onBack}
                  className="btn-secondary w-full text-center"
                >
                  Back to Accommodations
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-surface text-center">
                <p className="text-xs text-muted mb-3">Secure booking powered by</p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted">
                  <span>🔒 SSL Encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, DollarSign, Filter, X } from 'lucide-react'
import rooms from '@shared-data/rooms.json'

export default function RoomsList({ onSelectRoom }) {
  const [selectedType, setSelectedType] = useState('all')
  const [maxPrice, setMaxPrice] = useState(800)
  const [showFilters, setShowFilters] = useState(false)

  const roomTypes = [
    { value: 'all', label: 'Todas' },
    { value: 'economy', label: 'Económica' },
    { value: 'standard', label: 'Estándar' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'suite', label: 'Suite' },
    { value: 'premium', label: 'Premium' },
    { value: 'presidential', label: 'Presidencial' }
  ]

  const filteredRooms = rooms.filter((room) => {
    const matchesType = selectedType === 'all' || room.type === selectedType
    const matchesPrice = room.price <= maxPrice
    return matchesType && matchesPrice
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 md:hidden bg-accent text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Filter size={20} />
          Filtros
        </button>

        <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-6 mb-8 p-4 md:p-0 bg-surface/30 md:bg-transparent rounded-lg md:rounded-none`}>
          {/* Type Filter */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">Tipo de Habitación</h3>
              {showFilters && (
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedType === type.value
                      ? 'bg-accent text-white'
                      : 'bg-surface hover:bg-surface/80'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-bold text-lg mb-3">Precio Máximo</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="800"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="flex-1 h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center gap-1 bg-surface px-3 py-2 rounded-lg whitespace-nowrap font-bold">
                <DollarSign size={16} />
                {maxPrice}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="text-sm text-muted">
            Mostrando {filteredRooms.length} de {rooms.length} habitaciones
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room, idx) => (
            <motion.div
              key={room.id}
              variants={itemVariants}
              className="group bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  ${room.price}/noche
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                <p className="text-muted text-sm mb-4">{room.description}</p>

                {/* Details */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-accent" />
                    <span>Hasta {room.capacity} huéspedes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-accent" />
                    <span>Piso {room.floor}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <p className="text-xs text-muted font-bold mb-2">AMENITIES</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((amenity) => (
                      <span key={amenity} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="text-xs text-muted">+{room.amenities.length - 4} más</span>
                    )}
                  </div>
                </div>

                {/* Button */}
                <motion.button
                  onClick={() => onSelectRoom(room)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg font-bold transition-all"
                >
                  Reservar Ahora
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted text-lg">No hay habitaciones disponibles con los filtros seleccionados.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

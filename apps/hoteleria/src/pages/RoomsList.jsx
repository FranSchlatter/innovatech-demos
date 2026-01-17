import { motion } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'
import rooms from '@shared-data/rooms.json'

export default function RoomsList({ onSelectRoom }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room, idx) => (
        <motion.div
          key={room.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="card card-hover group overflow-hidden"
        >
          <div className="relative h-48 overflow-hidden rounded-lg mb-4">
            <img 
              src={room.image} 
              alt={room.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3 bg-primary text-primary-contrast px-3 py-1 rounded-full text-sm font-semibold">
              ${room.price}
            </div>
          </div>

          <h3 className="text-xl font-bold text-text mb-2">{room.name}</h3>
          <p className="text-muted text-sm mb-4">{room.description}</p>

          <div className="flex items-center gap-2 mb-4 text-sm text-muted">
            <MapPin className="w-4 h-4" />
            {room.capacity} huéspedes
          </div>

          <div className="mb-4">
            <p className="text-xs text-muted font-semibold mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <span key={amenity} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <motion.button
            onClick={() => onSelectRoom(room)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary w-full"
          >
            Reservar Ahora
          </motion.button>
        </motion.div>
      ))}
    </div>
  )
}

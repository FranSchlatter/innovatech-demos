import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import amenitiesData from '@shared-data/amenities.json'

export default function AmenitiesSection() {
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

  const getIcon = (iconName) => {
    const Icon = Icons[iconName]
    return Icon ? <Icon size={40} /> : <Icons.Star size={40} />
  }

  return (
    <section className="py-20 bg-surface/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Amenities de Clase Mundial
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Disfruta de nuestras instalaciones y servicios diseñados para tu máximo confort
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {amenitiesData.map((amenity) => (
            <motion.div
              key={amenity.id}
              variants={itemVariants}
              className="bg-bg/50 backdrop-blur rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={amenity.image}
                  alt={amenity.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-accent">
                    {getIcon(amenity.icon)}
                  </div>
                  <h3 className="font-bold text-lg">{amenity.name}</h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {amenity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

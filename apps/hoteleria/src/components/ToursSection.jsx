import { motion } from 'framer-motion'
import { Calendar, Users, Clock } from 'lucide-react'
import toursData from '@shared-data/tours.json'

export default function ToursSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section className="py-20 bg-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tours y Experiencias Exclusivas
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Crea recuerdos inolvidables con nuestras actividades curadas especialmente para ti
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {toursData.map((tour) => (
            <motion.div
              key={tour.id}
              variants={itemVariants}
              className="group bg-surface rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${tour.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{tour.name}</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">{tour.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-accent" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-accent" />
                    <span>Max. {tour.capacity} personas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-accent" />
                    <span>{tour.schedule}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.slice(0, 2).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded-lg font-semibold transition-all">
                  Reservar
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

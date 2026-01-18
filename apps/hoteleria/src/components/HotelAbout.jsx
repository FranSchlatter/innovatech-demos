import { motion } from 'framer-motion'

export default function HotelAbout() {
  const images = [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1566195992212-34ff59d1e81c?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  ]

  return (
    <section className="py-20 md:py-32 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h1 className="heading-lg mb-6">
            A Sanctuary of Elegance & Tranquility
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Nestled in the heart of the city, our hotel embodies timeless luxury and contemporary 
            comfort. Every detail has been carefully curated to create an unforgettable experience 
            for our distinguished guests.
          </p>
        </motion.div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="aspect-video overflow-hidden rounded-lg shadow-medium"
            >
              <img
                src={img}
                alt={`Hotel view ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: 'Excellence',
              description: 'Exceptional service and attention to detail in every interaction'
            },
            {
              title: 'Elegance',
              description: 'Refined aesthetics that inspire wonder and sophisticated comfort'
            },
            {
              title: 'Authenticity',
              description: 'Genuine connections with our guests and local community'
            }
          ].map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="text-center"
            >
              <h3 className="heading-sm mb-4 text-accent">{value.title}</h3>
              <p className="text-muted leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

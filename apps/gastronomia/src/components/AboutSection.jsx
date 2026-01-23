import { motion } from 'framer-motion'
import { Award, Clock, Heart, ChefHat, Leaf, TruckIcon } from 'lucide-react'

export default function AboutSection() {
  const features = [
    {
      icon: Leaf,
      title: "Farm Fresh",
      description: "Ingredients sourced daily from local organic farms"
    },
    {
      icon: ChefHat,
      title: "Expert Chefs",
      description: "Internationally trained culinary artists"
    },
    {
      icon: TruckIcon,
      title: "Fast Delivery",
      description: "Hot meals in 30 minutes or less"
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-bg relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with visual split */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Where Passion Meets Flavor
            </h2>
            <p className="text-lg text-muted mb-4 leading-relaxed">
              InnovaTech Gastronomy was born from a simple vision: to bring world-class international fusion cuisine to your table, whether you're dining with us or at home.
            </p>
            <p className="text-lg text-muted leading-relaxed">
              Our chefs blend traditional techniques with innovative flavors, creating dishes that tell stories from around the globe. From Mediterranean coastlines to Bangkok street food, every plate is a culinary journey.
            </p>
          </motion.div>

          {/* Right: Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="h-48 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop"
                  alt="Chef preparing food"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop"
                  alt="Restaurant ambiance"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-64 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop"
                  alt="Gourmet dish"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="h-48 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
                  alt="Fresh ingredients"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards - Minimal Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-surface p-6 rounded-lg text-center hover:shadow-lg transition-all group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 bg-primary/5 border border-primary/10 rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10+</div>
              <p className="text-sm text-muted">Years Experience</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-sm text-muted">Signature Dishes</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5</div>
              <p className="text-sm text-muted">Master Chefs</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15k+</div>
              <p className="text-sm text-muted">Happy Customers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

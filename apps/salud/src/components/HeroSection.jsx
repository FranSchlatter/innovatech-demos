import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <div className="relative w-full h-screen overflow-hidden dark:bg-gradient-to-br dark:from-primary dark:via-primary dark:to-secondary bg-gradient-to-br from-blue-50 via-blue-100 to-teal-50 flex items-center justify-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop"
          alt="Healthcare"
          className="w-full h-full object-cover opacity-30 dark:opacity-15"
        />
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-primary/95 dark:via-primary/90 dark:to-secondary/95 bg-gradient-to-br from-white/80 via-blue-50/80 to-teal-50/80" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 text-center max-w-4xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold dark:text-white text-primary mb-6 leading-tight">
            Your Health, Our Priority
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-accent dark:text-accent-light mb-8 leading-relaxed"
        >
          Access world-class healthcare specialists and services available 24/7. 
          Book appointments instantly, from anywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => {
              document.getElementById('specialties-section')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-accent-light hover:bg-secondary text-primary font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Browse Specialties
          </button>
          <button
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-lg border-2 border-white transition-all duration-300"
          >
            Contact Us
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-white/90"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-light">500+</div>
            <div className="text-sm">Medical Professionals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-light">50K+</div>
            <div className="text-sm">Happy Patients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-light">24/7</div>
            <div className="text-sm">Available Support</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

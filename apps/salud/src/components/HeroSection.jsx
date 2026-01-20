import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <div className="relative w-full h-screen overflow-hidden dark:bg-gradient-to-br dark:from-primary dark:via-primary dark:to-secondary bg-gradient-to-br from-blue-50 via-blue-100 to-teal-50 flex items-center justify-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&h=1080&fit=crop&q=80"
          alt="Healthcare"
          className="w-full h-full object-cover opacity-25 dark:opacity-10"
        />
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-primary/95 dark:via-primary/90 dark:to-secondary/90 bg-gradient-to-br from-white/85 via-blue-50/85 to-teal-50/85" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 md:px-6 text-center max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold dark:text-white text-primary mb-6 leading-tight">
            Your Health, Our Priority
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-primary/80 dark:text-accent-light mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto"
        >
          Access world-class healthcare specialists and services available 24/7.
          Book appointments instantly, from anywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16"
        >
          <button
            onClick={() => {
              document.getElementById('specialties')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Browse Specialties
          </button>
          <button
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white dark:text-white font-bold px-8 py-4 rounded-lg border-2 border-white/50 hover:border-white transition-all duration-300"
          >
            Contact Us
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-white"
        >
          <div className="text-center min-w-[100px]">
            <div className="text-3xl md:text-4xl font-bold text-accent-light mb-1">500+</div>
            <div className="text-xs md:text-sm text-white/90">Medical Professionals</div>
          </div>
          <div className="text-center min-w-[100px]">
            <div className="text-3xl md:text-4xl font-bold text-accent-light mb-1">50K+</div>
            <div className="text-xs md:text-sm text-white/90">Happy Patients</div>
          </div>
          <div className="text-center min-w-[100px]">
            <div className="text-3xl md:text-4xl font-bold text-accent-light mb-1">24/7</div>
            <div className="text-xs md:text-sm text-white/90">Available Support</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

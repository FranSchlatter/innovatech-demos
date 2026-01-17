import { motion } from 'framer-motion'

export default function Hero({ title, subtitle, image, cta = null }) {
  return (
    <section className="min-h-screen pt-20 flex items-center relative overflow-hidden bg-gradient-to-br from-bg to-surface">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted mb-8 leading-relaxed">
            {subtitle}
          </p>
          {cta && (
            <motion.button
              onClick={cta.onClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              {cta.label}
            </motion.button>
          )}
        </motion.div>

        {image && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:block"
          >
            <img
              src={image}
              alt="Hero"
              className="w-full rounded-lg shadow-soft"
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}

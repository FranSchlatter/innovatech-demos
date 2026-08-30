import { motion } from 'framer-motion'
import { Calculator, Camera, Scale, Smartphone } from 'lucide-react'

const PILLARS = [
  {
    icon: Calculator,
    title: 'Tasación gratuita',
    text: 'Conocé el valor real de tu propiedad con un informe respaldado por datos.'
  },
  {
    icon: Camera,
    title: 'Tours virtuales 360°',
    text: 'Recorré cada ambiente desde tu casa, sin perder tiempo en visitas.'
  },
  {
    icon: Scale,
    title: 'Crédito y asesoría legal',
    text: 'Te guiamos con hipotecas, escrituras y toda la documentación.'
  },
  {
    icon: Smartphone,
    title: 'Gestión 100% digital',
    text: 'Firmá, consultá y hacé el seguimiento de tu operación online.'
  }
]

const STATS = [
  { value: '500+', label: 'propiedades' },
  { value: '1.200+', label: 'operaciones' },
  { value: '20 años', label: 'de trayectoria' },
  { value: '98%', label: 'recomendación' }
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-contrast">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <hr className="rl-rule w-14" style={{ background: 'var(--color-gold)' }} />
          <h2
            className="mt-6 font-sans font-bold text-primary-contrast"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.035em', lineHeight: 1.02 }}
          >
            Todo lo que necesitás, en un solo lugar
          </h2>
          <p className="mt-4 text-primary-contrast/70">
            Combinamos experiencia, tecnología y cercanía para que tu próxima operación sea
            simple, segura y transparente.
          </p>
        </motion.div>

        {/* Pillars */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={item}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <span className="inline-flex p-3 rounded-xl bg-gold/15 text-gold">
                <pillar.icon className="w-6 h-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-primary-contrast">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm text-primary-contrast/70 leading-relaxed">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/10 pt-12"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={item} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gold">{stat.value}</div>
              <div className="mt-2 text-sm text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

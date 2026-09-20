import { motion } from 'framer-motion'
import { useTranslation } from '../i18n/LanguageProvider'

export default function HotelAbout() {
  const { t } = useTranslation()
  const images = [
    'https://plus.unsplash.com/premium_photo-1661929519129-7a76946c1d38?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800&q=80',
    'https://cdn.pixabay.com/photo/2020/12/24/19/11/hotel-room-5858069_1280.jpg?w=800&q=80',
    'https://cdn.pixabay.com/photo/2019/07/23/09/49/hotel-4357159_1280.jpg?w=800&q=80',
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
            {t('landing.about.title')}
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            {t('landing.about.intro')}
          </p>
        </motion.div>

        {/* Alternating Image-Text Layout */}
        <div className="space-y-16 mb-20">
          {/* Block 1: Image - Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-video overflow-hidden rounded-lg shadow-medium"
            >
              <img
                src={images[0]}
                alt="Villa Serena"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="heading-sm text-accent mb-4">{t('landing.about.blocks.luxuryTitle')}</h3>
              <p className="text-muted leading-relaxed mb-4">
                {t('landing.about.blocks.luxuryP1')}
              </p>
              <p className="text-muted leading-relaxed">
                {t('landing.about.blocks.luxuryP2')}
              </p>
            </motion.div>
          </div>

          {/* Block 2: Text - Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <h3 className="heading-sm text-accent mb-4">{t('landing.about.blocks.comfortTitle')}</h3>
              <p className="text-muted leading-relaxed mb-4">
                {t('landing.about.blocks.comfortP1')}
              </p>
              <p className="text-muted leading-relaxed">
                {t('landing.about.blocks.comfortP2')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-video overflow-hidden rounded-lg shadow-medium order-1 md:order-2"
            >
              <img
                src={images[1]}
                alt="Hotel comfort"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>

          {/* Block 3: Image - Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-video overflow-hidden rounded-lg shadow-medium"
            >
              <img
                src={images[2]}
                alt="Hotel experience"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="heading-sm text-accent mb-4">{t('landing.about.blocks.momentsTitle')}</h3>
              <p className="text-muted leading-relaxed mb-4">
                {t('landing.about.blocks.momentsP1')}
              </p>
              <p className="text-muted leading-relaxed">
                {t('landing.about.blocks.momentsP2')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: t('landing.about.values.excellenceTitle'),
              description: t('landing.about.values.excellenceDesc')
            },
            {
              title: t('landing.about.values.eleganceTitle'),
              description: t('landing.about.values.eleganceDesc')
            },
            {
              title: t('landing.about.values.authenticityTitle'),
              description: t('landing.about.values.authenticityDesc')
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

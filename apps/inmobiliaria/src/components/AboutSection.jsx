import { motion } from 'framer-motion'
import { ShieldCheck, LineChart, Compass, Handshake } from 'lucide-react'

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: 'Asesoramiento integral',
    text: 'Te acompañamos desde la primera consulta hasta la firma.'
  },
  {
    icon: LineChart,
    title: 'Tasación con datos de mercado',
    text: 'Valuaciones precisas respaldadas por estadísticas reales.'
  },
  {
    icon: Compass,
    title: 'Tecnología y tours virtuales',
    text: 'Recorridos 360° y CRM para una experiencia sin fricciones.'
  },
  {
    icon: Handshake,
    title: 'Transparencia total',
    text: 'Información clara en cada etapa, sin sorpresas ni letra chica.'
  }
]

export default function AboutSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
              alt="Equipo de Terranova Propiedades"
              className="w-full h-[420px] md:h-[520px] object-cover rounded-2xl shadow-medium"
            />
            {/* Floating gold stat badge */}
            <div className="absolute -bottom-6 -right-4 md:right-6 bg-gold text-primary rounded-2xl px-6 py-4 shadow-medium">
              <div className="text-3xl font-bold leading-none">20</div>
              <div className="text-sm font-medium mt-1">años en el mercado</div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-accent uppercase text-sm font-semibold tracking-widest">
              Sobre Terranova
            </span>
            <h2 className="heading-md mt-3">
              Una inmobiliaria boutique con estándares de excelencia
            </h2>

            <p className="mt-5 text-text leading-relaxed">
              En Terranova Propiedades creemos que cada operación merece una atención a
              medida. Somos una agencia boutique: trabajamos con un porfolio seleccionado
              y un equipo reducido de especialistas que conoce a fondo cada barrio, cada
              propiedad y a cada cliente por su nombre.
            </p>
            <p className="mt-4 text-text leading-relaxed">
              Combinamos el trato humano de siempre con tecnología de última generación:
              tasaciones respaldadas por datos de mercado, tours virtuales 360°, un CRM que
              mantiene todo bajo control y una comunicación transparente en cada paso. Así
              transformamos una decisión compleja en una experiencia clara y confiable.
            </p>

            {/* Highlights grid */}
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {HIGHLIGHTS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="shrink-0 p-3 rounded-xl bg-accent/15 text-accent h-fit">
                    <item.icon className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary">{item.title}</h3>
                    <p className="text-sm text-muted mt-1">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

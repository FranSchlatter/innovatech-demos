import { motion } from 'framer-motion'
import {
  Home,
  Key,
  Calculator,
  Landmark,
  Scale,
  Building2,
  TrendingUp,
  Sofa
} from 'lucide-react'

const services = [
  {
    icon: Home,
    title: 'Compra y Venta',
    description: 'Te acompañamos en cada paso, desde la búsqueda hasta la escritura, con asesoramiento experto.'
  },
  {
    icon: Key,
    title: 'Alquileres',
    description: 'Contratos, garantías y gestión integral de alquileres tradicionales y temporarios sin complicaciones.'
  },
  {
    icon: Calculator,
    title: 'Tasación online',
    description: 'Conocé el valor real de tu propiedad al instante con datos de mercado actualizados y precisos.'
  },
  {
    icon: Landmark,
    title: 'Crédito hipotecario',
    description: 'Gestionamos tu crédito con los principales bancos y te ayudamos a elegir la mejor opción.'
  },
  {
    icon: Scale,
    title: 'Asesoría legal',
    description: 'Escrituras, boletos y contratos revisados por nuestro equipo legal para operar con total seguridad.'
  },
  {
    icon: Building2,
    title: 'Administración de propiedades',
    description: 'Nos ocupamos del cobro, mantenimiento y relación con inquilinos para que vos no te preocupes.'
  },
  {
    icon: TrendingUp,
    title: 'Inversiones y renta',
    description: 'Analizamos rentabilidad y potencial de revalorización para que inviertas de forma inteligente.'
  },
  {
    icon: Sofa,
    title: 'Home staging',
    description: 'Preparamos y ambientamos tu propiedad para que se venda más rápido y a mejor precio.'
  }
]

export default function ServicesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <h2 className="heading-md">Servicios integrales</h2>
          <p className="mt-4 text-muted">
            Todo lo que necesitás para comprar, vender o alquilar, en un solo lugar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-surface border border-border rounded-xl p-6 shadow-soft hover:-translate-y-1 hover:shadow-medium transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-text mb-2">{service.title}</h3>
                <p className="text-sm text-muted">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

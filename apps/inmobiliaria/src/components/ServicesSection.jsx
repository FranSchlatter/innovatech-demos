import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Key,
  Calculator,
  Landmark,
  Scale,
  Building2,
  TrendingUp,
  Sofa,
  X,
  Check,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react'

const services = [
  {
    icon: Home,
    title: 'Compra y Venta',
    description: 'Te acompañamos en cada paso, desde la búsqueda hasta la escritura, con asesoramiento experto.',
    long: 'Gestionamos la operación completa: definimos el precio de mercado con datos reales, coordinamos visitas, negociamos en tu nombre y acompañamos la firma de boleto y escritura. Vos tomás las decisiones, nosotros nos ocupamos del resto.',
    benefits: [
      'Tasación de referencia con comparables de la zona',
      'Difusión en los principales portales y nuestra red',
      'Negociación profesional y filtro de interesados reales',
      'Acompañamiento legal hasta la escritura'
    ]
  },
  {
    icon: Key,
    title: 'Alquileres',
    description: 'Contratos, garantías y gestión integral de alquileres tradicionales y temporarios sin complicaciones.',
    long: 'Publicamos, mostramos y seleccionamos inquilinos con estudio de garantías. Redactamos el contrato acorde a la normativa vigente y definimos el índice de ajuste que más te conviene.',
    benefits: [
      'Estudio de garantías y solvencia del inquilino',
      'Contrato ajustado a la Ley de Alquileres',
      'Ajustes por ICL, UVA o IPC configurables',
      'Alta y seguimiento del alquiler temporario'
    ]
  },
  {
    icon: Calculator,
    title: 'Tasación online',
    description: 'Conocé el valor real de tu propiedad al instante con datos de mercado actualizados y precisos.',
    long: 'Cargás los datos de tu propiedad y obtenés un rango de valor estimado en base a operaciones y publicaciones comparables. Un asesor valida el resultado con una visita si querés avanzar.',
    benefits: [
      'Estimación inmediata con comparables reales',
      'Rango de valor mínimo, sugerido y máximo',
      'Informe descargable para respaldar tu decisión',
      'Validación presencial opcional sin cargo'
    ]
  },
  {
    icon: Landmark,
    title: 'Crédito hipotecario',
    description: 'Gestionamos tu crédito con los principales bancos y te ayudamos a elegir la mejor opción.',
    long: 'Comparamos líneas UVA y tradicionales de los principales bancos, calculamos tu capacidad de endeudamiento y te acompañamos en la carpeta y la relación con el banco hasta la aprobación.',
    benefits: [
      'Comparación de tasas entre bancos',
      'Cálculo de cuota y monto máximo accesible',
      'Armado de carpeta y documentación',
      'Seguimiento hasta la aprobación'
    ]
  },
  {
    icon: Scale,
    title: 'Asesoría legal',
    description: 'Escrituras, boletos y contratos revisados por nuestro equipo legal para operar con total seguridad.',
    long: 'Nuestro equipo legal revisa títulos, verifica inhibiciones y dominio, y redacta boletos y contratos para que cada operación se cierre sin sorpresas ni riesgos.',
    benefits: [
      'Verificación de títulos, dominio e inhibiciones',
      'Redacción y revisión de boletos y contratos',
      'Coordinación con escribanía',
      'Resguardo de las partes en cada etapa'
    ]
  },
  {
    icon: Building2,
    title: 'Administración de propiedades',
    description: 'Nos ocupamos del cobro, mantenimiento y relación con inquilinos para que vos no te preocupes.',
    long: 'Administramos tu propiedad de punta a punta: cobranza mensual, liquidación al propietario, resolución de reparaciones y comunicación con el inquilino. Vos recibís tu renta, sin la operatoria.',
    benefits: [
      'Cobranza y liquidación mensual transparente',
      'Gestión de reparaciones y proveedores',
      'Control de vencimientos y ajustes de contrato',
      'Reporte de estado de cada propiedad'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Inversiones y renta',
    description: 'Analizamos rentabilidad y potencial de revalorización para que inviertas de forma inteligente.',
    long: 'Identificamos oportunidades según tu objetivo —renta, revalorización o pozo— y proyectamos rentabilidad neta considerando gastos, vacancia y horizonte de inversión.',
    benefits: [
      'Análisis de rentabilidad neta por propiedad',
      'Oportunidades en pozo y unidades a estrenar',
      'Proyección de revalorización por zona',
      'Estrategia según tu perfil de inversor'
    ]
  },
  {
    icon: Sofa,
    title: 'Home staging',
    description: 'Preparamos y ambientamos tu propiedad para que se venda más rápido y a mejor precio.',
    long: 'Preparamos la propiedad para que enamore desde la primera foto: ambientación, arreglos menores y producción fotográfica profesional que reducen el tiempo de venta y mejoran las ofertas.',
    benefits: [
      'Diagnóstico y puesta en valor del espacio',
      'Ambientación y arreglos menores',
      'Producción fotográfica profesional',
      'Menor tiempo en el mercado y mejores ofertas'
    ]
  }
]

function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

function ServiceDetailModal({ service, onClose }) {
  useEffect(() => {
    if (!service) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [service, onClose])

  const Icon = service?.icon

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-surface rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-text hover:bg-surface-alt transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <span className="inline-flex w-12 h-12 rounded-xl bg-accent/15 text-accent items-center justify-center mb-5">
                {Icon && <Icon className="w-6 h-6" />}
              </span>
              <h3 className="rl-serif text-2xl text-primary">{service.title}</h3>
              <p className="text-muted mt-3 leading-relaxed">{service.long}</p>

              <ul className="mt-6 space-y-2.5">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-text">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  onClose()
                  scrollToContact()
                }}
                className="btn-gold w-full mt-7 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Consultar por este servicio
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ServicesSection() {
  const [active, setActive] = useState(null)

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-14"
        >
          <hr className="rl-rule rl-rule--gold w-14" />
          <h2 className="rl-display text-primary mt-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>Servicios integrales</h2>
          <p className="mt-4 text-muted">
            Todo lo que necesitás para comprar, vender o alquilar, en un solo lugar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-hairline">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.button
                key={service.title}
                type="button"
                onClick={() => setActive(service)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                aria-label={`Ver más sobre ${service.title}`}
                className="group relative text-left p-7 border-r border-b border-hairline bg-surface hover:bg-surface-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              >
                <Icon className="w-7 h-7 text-accent mb-5 transition-transform duration-500 group-hover:-translate-y-1" />
                <h3 className="rl-serif text-lg text-primary mb-2">{service.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{service.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 transition-all">
                  Ver más <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <ServiceDetailModal service={active} onClose={() => setActive(null)} />
    </section>
  )
}

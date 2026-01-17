import { motion } from 'framer-motion'
import { Star, CheckCircle } from 'lucide-react'

export default function TestimonialsHealthSection() {
  const testimonials = [
    {
      id: 1,
      author: "Carlos Mendoza",
      specialty: "Consulta Cardiología",
      rating: 5,
      text: "Excelente atención. El Dr. Pérez fue muy profesional y me explicó todo detalladamente. Muy recomendado.",
      verified: true
    },
    {
      id: 2,
      author: "Lucia Fernández",
      specialty: "Consulta Dermatología",
      rating: 5,
      text: "La Dra. López es excelente! Resolvió mi problema de piel en la primer consulta. Gracias!",
      verified: true
    },
    {
      id: 3,
      author: "Roberto Silva",
      specialty: "Seguimiento Medicina General",
      rating: 5,
      text: "Muy eficiente el sistema de turnos. La Dra. García siempre está disponible cuando la necesito.",
      verified: true
    },
    {
      id: 4,
      author: "Patricia Gómez",
      specialty: "Consulta Psicología",
      rating: 5,
      text: "Dra. Sofía es empática y profesional. Me ayudó mucho en mis sesiones. Totalmente recomendada.",
      verified: true
    },
    {
      id: 5,
      author: "Miguel Torres",
      specialty: "Consulta Oftalmología",
      rating: 5,
      text: "Rápido, eficiente y profesional. El Dr. Díaz tiene excelente calidez con los pacientes.",
      verified: true
    },
    {
      id: 6,
      author: "Sofía Ruiz",
      specialty: "Pediatría - Mi hijo",
      rating: 5,
      text: "El Dr. Fernando es muy bueno con los niños. Le encanta ir a las consultas. Muy confiable.",
      verified: true
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <section className="py-20 bg-surface/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experiencias de Nuestros Pacientes
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Miles de pacientes satisfechos confían en nuestros profesionales
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-bg rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{testimonial.author}</h3>
                    {testimonial.verified && (
                      <CheckCircle size={16} className="text-accent" />
                    )}
                  </div>
                  <p className="text-xs text-muted">{testimonial.specialty}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? 'fill-accent text-accent' : 'text-gray-400'}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

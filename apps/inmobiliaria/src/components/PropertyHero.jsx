import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, ChevronDown, Home, TrendingUp, Award, Star } from 'lucide-react'

const OPERATIONS = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'temporary', label: 'Temporario' }
]

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'apartment', label: 'Departamento' },
  { value: 'house', label: 'Casa' },
  { value: 'ph', label: 'PH' },
  { value: 'office', label: 'Oficina' },
  { value: 'commercial', label: 'Local' },
  { value: 'land', label: 'Terreno' }
]

const STATS = [
  { icon: Home, value: '500+', label: 'Propiedades' },
  { icon: Star, value: '4.9★', label: 'Satisfacción' },
  { icon: Award, value: '+20', label: 'Años' }
]

export default function PropertyHero({ onSearch, onExplore }) {
  const [operation, setOperation] = useState('sale')
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e?.preventDefault?.()
    onSearch?.({ operation, type, query })
  }

  return (
    <section className="relative min-h-[92vh] overflow-hidden flex items-center">
      {/* Background image */}
      <motion.img
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=90"
        alt="Residencia de lujo"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10 py-24">
        <div className="flex items-center justify-between gap-10">
          {/* Left content */}
          <div className="max-w-3xl w-full">
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white bg-white/10 backdrop-blur-md border border-white/20"
            >
              <Award className="w-4 h-4 text-gold" />
              Inmobiliaria boutique · +20 años
            </motion.span>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-serif text-4xl md:text-6xl font-bold text-white leading-tight"
            >
              Encontrá el lugar donde{' '}
              <span className="text-gold-gradient">empieza tu próxima historia</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 text-lg text-white/80 max-w-2xl"
            >
              Asesoramiento personalizado, propiedades seleccionadas y tecnología de
              vanguardia para acompañarte en cada paso de tu decisión más importante.
            </motion.p>

            {/* Search card */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6"
            >
              {/* Operation toggle */}
              <div className="flex flex-wrap gap-2 mb-4">
                {OPERATIONS.map((op) => (
                  <button
                    key={op.value}
                    type="button"
                    onClick={() => setOperation(op.value)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      operation === op.value
                        ? 'bg-gold text-primary'
                        : 'text-white border border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="md:w-52 bg-white/90 text-primary rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Barrio, ciudad o dirección..."
                    className="w-full bg-white/90 text-primary placeholder:text-primary/50 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-gold text-primary font-semibold rounded-lg px-6 py-3 text-sm hover:opacity-90 transition-opacity"
                >
                  <Search className="w-5 h-5" />
                  Buscar
                </button>
              </div>
            </motion.form>
          </div>

          {/* Floating stats */}
          <div className="hidden lg:flex flex-col gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 text-white min-w-[180px]"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-gold/20 text-gold">
                    <stat.icon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-2xl font-bold text-gold">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => onExplore?.()}
        aria-label="Explorar propiedades"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ opacity: { delay: 1, duration: 0.6 }, y: { repeat: Infinity, duration: 1.8 } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
      >
        <span className="text-xs uppercase tracking-widest">Explorar</span>
        <ChevronDown className="w-6 h-6" />
      </motion.button>

      {/* Decorative trending icon marker (subtle) */}
      <TrendingUp className="hidden" />
    </section>
  )
}

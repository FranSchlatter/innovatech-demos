import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, ArrowDown, Home, Star, Award } from 'lucide-react'

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
  { icon: Star, value: '4.9', label: 'Satisfacción' },
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
    <section className="relative min-h-[92vh] bg-bg text-text flex flex-col justify-center pt-28 pb-12 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Content + search */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.hr
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rl-rule rl-rule--gold w-14 origin-left"
            />
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rl-display mt-6"
              style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5rem)' }}
            >
              Encontrá el lugar donde empieza{' '}
              <span className="text-accent">tu próxima historia.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rl-lead text-muted max-w-xl mt-6"
            >
              Asesoramiento personalizado, propiedades seleccionadas y tecnología de
              vanguardia para acompañarte en la decisión más importante.
            </motion.p>

            {/* Search — solid surface, architectural */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 bg-surface border border-border shadow-medium p-4 md:p-5"
            >
              {/* Operation segmented control */}
              <div className="flex border border-border mb-4">
                {OPERATIONS.map((op) => (
                  <button
                    key={op.value}
                    type="button"
                    onClick={() => setOperation(op.value)}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                      operation === op.value
                        ? 'bg-primary text-primary-contrast'
                        : 'text-muted hover:text-text hover:bg-surface-alt'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="md:w-52 bg-bg text-text border border-border px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Barrio, ciudad o dirección…"
                    className="w-full bg-bg text-text placeholder:text-muted border border-border pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <button type="submit" className="btn-gold shrink-0">
                  <Search className="w-4 h-4" />
                  Buscar
                </button>
              </div>
            </motion.form>

            {/* Stat row */}
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-10 grid grid-cols-3 max-w-lg border-t border-hairline"
            >
              {STATS.map((s, i) => (
                <div key={s.label} className={`pt-4 ${i > 0 ? 'pl-5 border-l border-hairline' : ''}`}>
                  <dt className="flex items-baseline gap-1.5">
                    <span className="rl-display text-primary" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)' }}>{s.value}</span>
                    <s.icon className="w-4 h-4 text-accent" />
                  </dt>
                  <dd className="rl-label mt-1.5">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Framed architectural photo */}
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 order-1 lg:order-2"
          >
            <div className="rl-frame relative aspect-[4/5] lg:aspect-[3/4]">
              <motion.img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=1600&fit=crop&q=90"
                alt="Residencia de lujo"
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full object-cover"
              />
              <span className="absolute left-5 bottom-5 rl-label !text-[#f4efe4] px-3 py-1.5 bg-[rgba(9,15,30,0.6)] backdrop-blur-sm">
                Buenos Aires · Argentina
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => onExplore?.()}
        aria-label="Explorar propiedades"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 text-muted hover:text-accent transition-colors"
      >
        <span className="rl-label">Explorar</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
          <ArrowDown className="w-4 h-4" />
        </motion.span>
      </motion.button>
    </section>
  )
}

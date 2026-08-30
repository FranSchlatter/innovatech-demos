import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import PropertyCard from './PropertyCard'
import properties from '../data/properties.json'

const TABS = [
  { value: 'all', label: 'Todas' },
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'temporary', label: 'Temporario' }
]

export default function FeaturedProperties({ favorites, onSelectProperty, onViewAll }) {
  const [activeTab, setActiveTab] = useState('all')

  const featured = properties.filter((p) => p.featured)
  let list = featured
  if (activeTab !== 'all') {
    const filtered = featured.filter((p) => p.operation === activeTab)
    list = filtered.length > 0 ? filtered : featured
  }

  return (
    <section className="py-20 md:py-28 bg-surface-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <hr className="rl-rule rl-rule--gold w-14" />
            <h2 className="rl-display text-primary mt-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>
              Propiedades destacadas
            </h2>
            <p className="mt-4 text-muted max-w-xl">
              Una selección curada de las mejores oportunidades del momento, elegidas por
              nuestro equipo de especialistas.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="lg:col-span-5 flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="group py-1"
              >
                <span
                  className={`text-sm font-semibold uppercase tracking-widest transition-colors ${
                    activeTab === tab.value ? 'text-primary' : 'text-muted group-hover:text-text'
                  }`}
                >
                  {tab.label}
                </span>
                <div
                  className={`mt-2 h-px transition-all duration-500 ${activeTab === tab.value ? 'w-full' : 'w-0 group-hover:w-4'}`}
                  style={{ background: 'var(--color-accent)' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isFavorite={favorites.isFavorite(p.id)}
              onToggleFavorite={favorites.toggleFavorite}
              onSelect={onSelectProperty}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => onViewAll?.()}
            className="btn-primary inline-flex items-center gap-2"
          >
            Ver todas las propiedades
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

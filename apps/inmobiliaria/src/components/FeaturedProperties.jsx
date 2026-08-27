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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="heading-md">Propiedades destacadas</h2>
          <p className="mt-3 text-muted">
            Una selección curada de las mejores oportunidades del momento, elegidas por
            nuestro equipo de especialistas.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`pb-3 -mb-px text-sm transition-colors ${
                activeTab === tab.value
                  ? 'border-b-2 border-accent text-primary font-semibold'
                  : 'text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

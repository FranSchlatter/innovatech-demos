import { motion } from 'framer-motion'
import { useState } from 'react'
import * as Icons from 'lucide-react'
import specialties from '@shared-data/specialties.json'

export default function SpecialtiesGrid({ onSelectSpecialty }) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', ...new Set(specialties.map(s => s.category || 'General'))]
  
  const filteredSpecialties = specialties.filter(specialty => {
    const matchesCategory = selectedFilter === 'all' || (specialty.category || 'General') === selectedFilter
    const matchesSearch = specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getIcon = (iconName) => {
    const icon = Icons[iconName]
    return icon || Icons.Heart
  }

  return (
    <section id="specialties-section" className="py-20 md:py-32 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-md mb-4">Our Specialties</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Comprehensive medical services across 20 specialties with expert physicians and advanced technology
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Search specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-surface border-2 border-accent/20 focus:border-accent text-text placeholder-muted outline-none transition-all"
          />
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-12 justify-center"
        >
          {categories.slice(0, 6).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all capitalize ${
                selectedFilter === category
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-surface text-text border-2 border-accent/20 hover:border-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Specialties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSpecialties.length > 0 ? (
            filteredSpecialties.map((specialty, idx) => {
            const IconComponent = getIcon(specialty.icon)
            return (
              <motion.button
                key={specialty.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => {
                  onSelectSpecialty(specialty)
                  setTimeout(() => {
                    document.getElementById('specialty-detail')?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }}
                className="group relative bg-surface rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-105 text-left overflow-hidden"
              >
                {/* Accent Bar */}
                <div className="absolute inset-x-0 top-0 h-1 bg-accent group-hover:h-2 transition-all" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xs font-semibold text-accent-light bg-accent/10 px-3 py-1 rounded-full">
                      {specialty.cost}
                    </span>
                  </div>

                  <h3 className="font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                    {specialty.name}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 group-hover:text-text transition-colors">
                    {specialty.description}
                  </p>

                  <div className="mt-4 flex items-center text-accent text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Learn More →
                  </div>
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            )
          })}
        </div>

        {/* No Results Message */}
        {filteredSpecialties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-muted">No specialties match your search. Try a different term.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

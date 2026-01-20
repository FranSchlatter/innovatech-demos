import { motion } from 'framer-motion'
import { ArrowLeft, Clock, DollarSign, Users } from 'lucide-react'
import * as Icons from 'lucide-react'
import allDoctors from '@shared-data/doctors.json'

export default function SpecialtyDetailPage({ specialty, onBack, onSelectDoctor }) {
  const doctors = allDoctors.filter(d => d.specialtyId === specialty.id)
  const getIcon = (iconName) => Icons[iconName] || Icons.Heart

  const IconComponent = getIcon(specialty.icon)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32" />

        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 hover:gap-3 transition-all opacity-90 hover:opacity-100"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Specialties</span>
        </button>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-accent-light" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{specialty.name}</h1>
                <p className="text-accent-light">{specialty.cost}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-surface rounded-xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-primary mb-4">Overview</h2>
            <p className="text-muted mb-6 leading-relaxed">{specialty.description}</p>

            <h3 className="text-xl font-bold text-primary mb-4">Services & Treatments</h3>
            <p className="text-muted leading-relaxed">{specialty.details}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="bg-accent/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-accent" />
              <span className="font-semibold text-primary">Consultation Cost</span>
            </div>
            <p className="text-2xl font-bold text-accent">{specialty.cost}</p>
            <p className="text-xs text-muted mt-2">Insurance accepted</p>
          </div>

          <div className="bg-accent/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-accent" />
              <span className="font-semibold text-primary">Available Doctors</span>
            </div>
            <p className="text-2xl font-bold text-accent">{doctors.length}</p>
            <p className="text-xs text-muted mt-2">Qualified specialists</p>
          </div>

          <div className="bg-accent/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-accent" />
              <span className="font-semibold text-primary">Availability</span>
            </div>
            <p className="text-sm font-semibold text-accent">24/7</p>
            <p className="text-xs text-muted mt-2">Online & in-person</p>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      {doctors.length > 0 && (
        <div className="bg-surface rounded-xl p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-primary mb-6">Our {specialty.name} Specialists</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {doctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 p-4 rounded-lg hover:bg-bg transition-colors group cursor-pointer"
                onClick={() => {
                  onSelectDoctor(doctor)
                  setTimeout(() => {
                    document.getElementById('appointment-section')?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }}
              >
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-primary group-hover:text-accent transition-colors">{doctor.name}</h4>
                  <div className="flex items-center gap-2 my-2">
                    <span className="text-sm font-semibold text-accent">★ {doctor.rating}</span>
                    <span className="text-xs text-muted">({doctor.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-muted line-clamp-2 mb-2">{doctor.bio}</p>
                  <button className="text-sm font-semibold text-accent hover:text-secondary transition-colors">
                    Book Appointment →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

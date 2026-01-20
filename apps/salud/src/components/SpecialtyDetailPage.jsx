import { motion } from 'framer-motion'
import { ArrowLeft, Clock, DollarSign, Users, Star, MapPin, Calendar } from 'lucide-react'
import * as Icons from 'lucide-react'
import allDoctors from '@shared-data/doctors.json'

export default function SpecialtyDetailPage({ specialty, onBack, onSelectDoctor }) {
  const doctors = allDoctors.filter(d => d.specialtyId === specialty.id)
  const getIcon = (iconName) => Icons[iconName] || Icons.Heart

  const IconComponent = getIcon(specialty.icon)

  const handleBookAppointment = () => {
    document.getElementById('appointment-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {/* Back Button - Fixed */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-accent transition-all hover:gap-3 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Specialties</span>
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <img
          src={specialty.image}
          alt={specialty.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Icon & Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
                {specialty.name}
              </h1>
              <p className="text-accent-light font-semibold text-lg md:text-xl">
                {specialty.cost}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: 2-col layout with sticky sidebar */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-xl p-6 md:p-8 shadow-md border border-border"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-text mb-4 flex items-center gap-2">
                Overview
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed text-base">
                {specialty.description}
              </p>

              <h3 className="text-xl md:text-2xl font-bold text-text mb-4 mt-8">
                Services & Treatments
              </h3>
              <p className="text-text-secondary leading-relaxed text-base">
                {specialty.details}
              </p>
            </motion.div>

            {/* Doctors List */}
            {doctors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-surface rounded-xl p-6 md:p-8 shadow-md border border-border"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-text mb-6">
                  Our {specialty.name} Specialists
                </h2>
                <div className="grid gap-6">
                  {doctors.map((doctor, idx) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 rounded-xl hover:bg-bg border border-border hover:border-primary/40 transition-all group cursor-pointer"
                      onClick={() => {
                        onSelectDoctor(doctor)
                        setTimeout(() => {
                          handleBookAppointment()
                        }, 100)
                      }}
                    >
                      {/* Doctor Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-full sm:w-28 h-48 sm:h-28 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-primary text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          {doctor.rating}
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1">
                        <h4 className="text-lg md:text-xl font-bold text-text group-hover:text-primary transition-colors mb-2">
                          {doctor.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{doctor.location}</span>
                          </div>
                          <span>•</span>
                          <span className="font-semibold text-text">{doctor.reviews} reviews</span>
                          <span>•</span>
                          <span className="font-bold text-accent">${doctor.price}</span>
                        </div>

                        <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">
                          {doctor.bio}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectDoctor(doctor)
                            setTimeout(() => handleBookAppointment(), 100)
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                          <Calendar className="w-4 h-4" />
                          Book Appointment
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar (1/3) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 space-y-4"
            >
              {/* Cost Card */}
              <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-6 border-2 border-accent/20 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-semibold text-text">Consultation Cost</span>
                </div>
                <p className="text-3xl font-bold text-accent mb-2">{specialty.cost}</p>
                <p className="text-xs text-muted">Insurance accepted</p>
              </div>

              {/* Doctors Count Card */}
              <div className="bg-surface rounded-xl p-6 border border-border shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-text">Available Doctors</span>
                </div>
                <p className="text-3xl font-bold text-primary mb-2">{doctors.length}</p>
                <p className="text-xs text-muted">Qualified specialists</p>
              </div>

              {/* Availability Card */}
              <div className="bg-surface rounded-xl p-6 border border-border shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-success" />
                  </div>
                  <span className="font-semibold text-text">Availability</span>
                </div>
                <p className="text-lg font-bold text-success mb-2">24/7 Available</p>
                <p className="text-xs text-muted">Online & in-person</p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleBookAppointment}
                className="w-full px-6 py-4 bg-accent hover:bg-accent-dark text-white font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Book Appointment
              </button>

              {/* Insurance Info */}
              <div className="bg-bg rounded-xl p-5 border border-border">
                <p className="text-xs font-semibold text-muted mb-2">INSURANCE ACCEPTED</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full text-text font-medium">BlueCross</span>
                  <span className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full text-text font-medium">Aetna</span>
                  <span className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full text-text font-medium">United</span>
                  <span className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full text-text font-medium">Cigna</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

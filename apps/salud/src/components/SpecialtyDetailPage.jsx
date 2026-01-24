import { motion } from 'framer-motion'
import { ArrowLeft, Clock, DollarSign, Users, Star, MapPin, Calendar, Shield, Award, CheckCircle, ChevronLeft } from 'lucide-react'
import * as Icons from 'lucide-react'
import allDoctors from '@shared-data/doctors.json'
import { useState } from 'react'

export default function SpecialtyDetailPage({ specialty, onBack, onSelectDoctor }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const doctors = allDoctors.filter(d => d.specialtyId === specialty.id)
  const getIcon = (iconName) => Icons[iconName] || Icons.Heart

  const IconComponent = getIcon(specialty.icon)

  const handleBookAppointment = () => {
    document.getElementById('appointment-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Gallery images - using specialty image multiple times (can be expanded later with real images)
  const galleryImages = [
    specialty.image,
    specialty.image,
    specialty.image,
    specialty.image
  ]

  // Key benefits for this specialty
  const keyBenefits = [
    'Board-certified specialists',
    'State-of-the-art diagnostic equipment',
    'Same-day appointments available',
    'Comprehensive care approach',
    'Insurance accepted',
    'Flexible scheduling options'
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Back Button - Fixed */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onBack}
        className="fixed top-24 left-6 z-40 flex items-center gap-2 text-accent hover:text-primary transition bg-bg px-4 py-2 rounded-lg shadow-soft"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-screen md:h-96 relative overflow-hidden"
      >
        <img
          src={galleryImages[selectedImage]}
          alt={specialty.name}
          className="w-full h-full object-cover"
        />

        {/* Icon & Title Overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-6 md:p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
                  {specialty.name}
                </h1>
                <p className="text-white/90 font-semibold text-lg md:text-xl">
                  {specialty.cost}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Navigation Dots */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-2 justify-center">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`h-2 transition-all ${
                idx === selectedImage
                  ? 'w-8 bg-accent'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content (2/3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-primary mb-4">About This Specialty</h2>
              <p className="text-muted leading-relaxed mb-4">
                {specialty.description}
              </p>
              <p className="text-muted leading-relaxed">
                {specialty.details}
              </p>
            </div>

            {/* Why Choose This Specialty */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-primary mb-6">Why Choose Our {specialty.name} Department</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyBenefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Department Specifications */}
            <div className="bg-bg p-8 rounded-lg mb-12">
              <h2 className="text-xl font-semibold text-primary mb-6">Department Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-sm text-muted mb-2">Consultation Cost</div>
                  <div className="text-lg font-semibold text-primary">{specialty.cost}</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Specialists Available</div>
                  <div className="text-lg font-semibold text-primary">{doctors.length} doctors</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Wait Time</div>
                  <div className="text-lg font-semibold text-primary">Same Day</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Insurance</div>
                  <div className="text-lg font-semibold text-primary">Accepted</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Appointments</div>
                  <div className="text-lg font-semibold text-primary">24/7 Online</div>
                </div>
                <div>
                  <div className="text-sm text-muted mb-2">Follow-up Care</div>
                  <div className="text-lg font-semibold text-primary">Included</div>
                </div>
              </div>
            </div>

            {/* Doctors List */}
            {doctors.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-primary mb-6">
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
                      className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 rounded-xl bg-bg hover:shadow-soft border border-transparent hover:border-accent/20 transition-all group cursor-pointer"
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
                        <h4 className="text-lg md:text-xl font-bold text-primary group-hover:text-accent transition-colors mb-2">
                          {doctor.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{doctor.location}</span>
                          </div>
                          <span>•</span>
                          <span className="font-semibold">{doctor.reviews} reviews</span>
                          <span>•</span>
                          <span className="font-bold text-accent">${doctor.price}</span>
                        </div>

                        <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
                          {doctor.bio}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectDoctor(doctor)
                            setTimeout(() => handleBookAppointment(), 100)
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-primary text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                          <Calendar className="w-4 h-4" />
                          Book Appointment
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column - Sticky Sidebar (1/3) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-fit"
          >
            <div className="bg-bg p-8 rounded-lg shadow-soft sticky top-24">
              {/* Price */}
              <div className="mb-8 pb-8 border-b border-surface">
                <div className="text-sm text-muted mb-2">Consultation from</div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-accent">{specialty.cost.split(' - ')[0]}</span>
                  <span className="text-muted text-sm mb-1">per visit</span>
                </div>
              </div>

              {/* Key Info */}
              <div className="mb-8">
                <h3 className="font-semibold text-primary mb-4">Quick Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted">Specialists</div>
                      <div className="font-semibold text-primary">{doctors.length} doctors</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted">Availability</div>
                      <div className="font-semibold text-primary">24/7 Online</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted">Insurance</div>
                      <div className="font-semibold text-primary">All major plans</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="font-semibold text-primary mb-4">What's Included</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">Comprehensive diagnostic evaluation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">Personalized treatment plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">Follow-up care included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">Medical records access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted">24/7 patient support</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBookAppointment}
                  className="btn-primary w-full text-center"
                >
                  Book Appointment
                </button>
                <button
                  onClick={onBack}
                  className="btn-secondary w-full text-center"
                >
                  Back to Specialties
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-surface">
                <p className="text-xs text-muted mb-3 font-semibold">ACCREDITATIONS</p>
                <div className="flex items-center justify-around gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <Award className="w-6 h-6 text-accent" />
                    <span className="text-xs text-muted">Board Certified</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="w-6 h-6 text-accent" />
                    <span className="text-xs text-muted">HIPAA Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

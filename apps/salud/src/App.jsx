import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'

import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import SpecialtiesGrid from './components/SpecialtiesGrid'
import SpecialtyDetailPage from './components/SpecialtyDetailPage'
import ServicesCarousel from './components/ServicesCarousel'
import LocationsSection from './components/LocationsSection'
import EmergenciesSection from './components/EmergenciesSection'
import DoctorsGridNew from './components/DoctorsGridNew'
import AppointmentFormNew from './pages/AppointmentFormNew'
import TestimonialsHealthSection from './components/TestimonialsHealthSection'

import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [viewMode, setViewMode] = useState('main') // 'main', 'specialty', 'appointment'

  const navLinks = [
    { 
      name: 'Home', 
      href: '#home', 
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) 
    },
    { 
      name: 'Specialties', 
      href: '#specialties-section',
      onClick: () => document.getElementById('specialties-section')?.scrollIntoView({ behavior: 'smooth' })
    },
    { 
      name: 'Services', 
      href: '#services',
      onClick: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
    },
    { 
      name: 'Locations', 
      href: '#locations',
      onClick: () => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })
    },
    { 
      name: 'Contact', 
      href: '#contact',
      onClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  ]

  const handleSelectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty)
    setViewMode('specialty')
  }

  const handleBackToMain = () => {
    setViewMode('main')
    setSelectedSpecialty(null)
    setSelectedDoctor(null)
  }

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setViewMode('appointment')
  }

  // Show specialty detail page
  if (viewMode === 'specialty' && selectedSpecialty) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar
          brand="InnovaTech Hospital"
          toggleTheme={toggleTheme}
          isDark={isDark}
          links={navLinks}
        />

        <main>
          <section id="specialty-detail" className="py-12 md:py-20 bg-bg">
            <div className="container mx-auto px-4 md:px-6">
              <SpecialtyDetailPage
                specialty={selectedSpecialty}
                onBack={handleBackToMain}
                onSelectDoctor={handleSelectDoctor}
              />
            </div>
          </section>

          {selectedDoctor && (
            <section id="appointment-section" className="py-16 md:py-24 bg-surface">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                  <h2 className="heading-md mb-4">Book Your Appointment</h2>
                  <p className="text-lg text-muted">Complete the form below to secure your consultation</p>
                </div>
                <AppointmentFormNew
                  doctor={selectedDoctor}
                  onBook={(appointment) => {
                    alert(`✓ Appointment confirmed with ${selectedDoctor.name}\nDate: ${appointment.date} at ${appointment.time}`)
                    handleBackToMain()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </div>
            </section>
          )}

          <section id="contact">
            <ContactSection />
          </section>
        </main>

        <Footer brand="InnovaTech Hospital" />
      </div>
    )
  }

  // Main landing page view
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar
        brand="InnovaTech Hospital"
        toggleTheme={toggleTheme}
        isDark={isDark}
        links={navLinks}
      />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Specialties */}
        <SpecialtiesGrid onSelectSpecialty={handleSelectSpecialty} />

        {/* Services */}
        <section id="services" className="scroll-mt-20">
          <ServicesCarousel />
        </section>

        {/* Emergency Banner */}
        <EmergenciesSection />

        {/* Locations */}
        <section id="locations" className="scroll-mt-20">
          <LocationsSection />
        </section>

        {/* Testimonials */}
        <TestimonialsHealthSection />

        {/* Contact */}
        <section id="contact">
          <ContactSection />
        </section>
      </main>

      <Footer brand="InnovaTech Hospital" />
    </div>
  )
}

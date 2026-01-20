import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'

import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import SpecialtiesGrid from './components/SpecialtiesGrid'
import SpecialtyDetailPage from './components/SpecialtyDetailPage'
import DoctorsSlider from './components/DoctorsSlider'
import ServicesCarousel from './components/ServicesCarousel'
import LocationsSection from './components/LocationsSection'
import EmergenciesSection from './components/EmergenciesSection'
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
      onClick: () => {
        handleBackToMain()
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
      }
    },
    {
      name: 'Specialties',
      href: '#specialties',
      onClick: () => {
        if (viewMode !== 'main') {
          handleBackToMain()
          setTimeout(() => document.getElementById('specialties')?.scrollIntoView({ behavior: 'smooth' }), 200)
        } else {
          document.getElementById('specialties')?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    {
      name: 'Doctors',
      href: '#doctors',
      onClick: () => {
        if (viewMode !== 'main') {
          handleBackToMain()
          setTimeout(() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' }), 200)
        } else {
          document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    {
      name: 'Services',
      href: '#services',
      onClick: () => {
        if (viewMode !== 'main') {
          handleBackToMain()
          setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 200)
        } else {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
        }
      }
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
    // If we're on main page, scroll to appointment section
    if (viewMode === 'main') {
      setTimeout(() => {
        // Create appointment section dynamically if doctor is selected from main page
        const appointmentSection = document.getElementById('appointment-section')
        if (appointmentSection) {
          appointmentSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
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
        <section id="specialties" className="scroll-mt-20">
          <SpecialtiesGrid onSelectSpecialty={handleSelectSpecialty} />
        </section>

        {/* Doctors Slider - NEW */}
        <section id="doctors" className="scroll-mt-20">
          <DoctorsSlider onSelectDoctor={handleSelectDoctor} />
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-20">
          <ServicesCarousel />
        </section>

        {/* Locations */}
        <section id="locations" className="scroll-mt-20">
          <LocationsSection />
        </section>

        {/* Emergency Banner */}
        <section id="emergency" className="scroll-mt-20">
          <EmergenciesSection />
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="scroll-mt-20">
          <TestimonialsHealthSection />
        </section>

        {/* Appointment Form - Shows when doctor is selected */}
        {selectedDoctor && (
          <section id="appointment-section" className="py-16 md:py-24 bg-surface scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-text">
                  Book Your Appointment
                </h2>
                <p className="text-base md:text-lg text-muted">
                  Complete the form below to secure your consultation with {selectedDoctor.name}
                </p>
              </div>
              <AppointmentFormNew
                doctor={selectedDoctor}
                specialty={selectedSpecialty}
                onBook={(appointment) => {
                  // El formulario ahora maneja el estado de "Turno Solicitado"
                  console.log('Appointment booked:', appointment)
                  // Opcionalmente resetear después de un delay
                  setTimeout(() => {
                    setSelectedDoctor(null)
                    setSelectedSpecialty(null)
                  }, 4000)
                }}
              />
            </div>
          </section>
        )}

        {/* Contact */}
        <section id="contact">
          <ContactSection />
        </section>
      </main>

      <Footer brand="InnovaTech Hospital" />
    </div>
  )
}

import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import DoctorsGrid from './components/DoctorsGrid'
import TestimonialsHealthSection from './components/TestimonialsHealthSection'
import AppointmentForm from './pages/AppointmentForm'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Especialidades', href: '#doctors' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Contacto', href: '#contact' }
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar 
        brand="Clínica InnovaTech" 
        toggleTheme={toggleTheme} 
        isDark={isDark}
        links={navLinks}
      />

      <main>
        {/* Hero */}
        <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-primary/20 to-bg flex items-center">
          <div className="container mx-auto px-4 text-center z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Tu Salud es Nuestra Prioridad
              </h1>
              <p className="text-xl md:text-2xl text-muted mb-8">
                Sistema de turnos online disponible 24/7. Conecta con médicos especialistas certificados sin esperas.
              </p>
              <button
                onClick={() => {
                  document.getElementById('doctors-section').scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all inline-block"
              >
                Agendar Turno Ahora
              </button>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&h=900&fit=crop"
              alt="Hospital"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Doctors Section */}
        <section id="doctors-section" className="py-20 bg-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Especialistas</h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Médicos certificados con experiencia, disponibles para atenderte cuando lo necesites
              </p>
            </div>
            <DoctorsGrid onSelectDoctor={(doctor) => {
              setSelectedDoctor(doctor)
              document.getElementById('appointment-section').scrollIntoView({ behavior: 'smooth' })
            }} />
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonios">
          <TestimonialsHealthSection />
        </section>

        {/* Appointment Form */}
        {selectedDoctor && (
          <section id="appointment-section" className="py-20 bg-surface/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Agendar Turno</h2>
                <p className="text-lg text-muted">Con {selectedDoctor.name}</p>
              </div>
              <AppointmentForm 
                doctor={selectedDoctor}
                onBook={(appointment) => {
                  alert(`✓ Turno confirmado con ${selectedDoctor.name}\nFecha: ${appointment.date} a las ${appointment.time}`)
                  setSelectedDoctor(null)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
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

      <Footer brand="Clínica InnovaTech" />
    </div>
  )
}

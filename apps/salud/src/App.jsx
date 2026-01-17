import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import Hero from '@shared-ui/components/Hero'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import DoctorsList from './pages/DoctorsList'
import AppointmentForm from './pages/AppointmentForm'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Doctores', href: '#doctors' },
    { name: 'Agendar', href: '#appointment' }
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar 
        brand="Clínica InnovaTech" 
        toggleTheme={toggleTheme} 
        isDark={isDark}
        links={navLinks}
      />

      <main className="pt-16">
        {/* Hero */}
        <Hero 
          title="Agendar un turno"
          subtitle="Sistema de turnos online disponible 24/7. Selecciona tu doctor y horario preferido sin esperas."
          image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop"
          cta={{
            label: 'Ver Disponibilidad',
            onClick: () => {
              document.getElementById('doctors-section').scrollIntoView({ behavior: 'smooth' })
            }
          }}
        />

        {/* Doctors Section */}
        <section id="doctors-section" className="py-16 bg-surface/30">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Nuestros Médicos</h2>
            <DoctorsList onSelectDoctor={(doctor) => {
              setSelectedDoctor(doctor)
              document.getElementById('appointment-section').scrollIntoView({ behavior: 'smooth' })
            }} />
          </div>
        </section>

        {/* Appointment Form */}
        <section id="appointment-section" className="py-16 bg-bg">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Completá tu Turno</h2>
            {selectedDoctor && (
              <AppointmentForm 
                doctor={selectedDoctor}
                onBook={(appointment) => {
                  alert(`✓ Turno confirmado con ${selectedDoctor.name}\nFecha: ${appointment.date} a las ${appointment.time}`)
                  setSelectedDoctor(null)
                }}
              />
            )}
          </div>
        </section>

        {/* Contact */}
        <ContactSection />
      </main>

      <Footer brand="Clínica InnovaTech" />
    </div>
  )
}

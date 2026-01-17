import { useState, useEffect } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import Hero from '@shared-ui/components/Hero'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { useCart } from '@shared-hooks/useCart'
import RoomsList from './pages/RoomsList'
import BookingForm from './pages/BookingForm'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem } = useCart()
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedRoom, setSelectedRoom] = useState(null)

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Habitaciones', href: '#rooms' },
    { name: 'Reservar', href: '#booking' }
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar 
        brand="Hotel InnovaTech" 
        toggleTheme={toggleTheme} 
        isDark={isDark}
        links={navLinks}
      />

      <main className="pt-16">
        {/* Hero */}
        <Hero 
          title="Reserva tu estadía"
          subtitle="Experiencia hotelera premium con tecnología de punta. Nuestro sistema automatizado hace que tu reserva sea simple y rápida."
          image="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=600&fit=crop"
          cta={{
            label: 'Ver Habitaciones',
            onClick: () => {
              setCurrentPage('rooms')
              document.getElementById('rooms-section').scrollIntoView({ behavior: 'smooth' })
            }
          }}
        />

        {/* Rooms Section */}
        <section id="rooms-section" className="py-16 bg-surface/30">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Nuestras Habitaciones</h2>
            <RoomsList onSelectRoom={(room) => {
              setSelectedRoom(room)
              setCurrentPage('booking')
              document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })
            }} />
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking-section" className="py-16 bg-bg">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Completá tu Reserva</h2>
            {selectedRoom && (
              <BookingForm 
                room={selectedRoom} 
                onBook={(booking) => {
                  addItem({
                    ...selectedRoom,
                    ...booking,
                    price: selectedRoom.price,
                    quantity: 1
                  })
                  alert('¡Reserva completada! Te contactaremos pronto.')
                  setCurrentPage('home')
                }}
              />
            )}
          </div>
        </section>

        {/* Contact */}
        <ContactSection />
      </main>

      <Footer brand="Hotel InnovaTech" />
    </div>
  )
}

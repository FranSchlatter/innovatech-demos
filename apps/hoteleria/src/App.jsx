import { useState, useEffect } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { useCart } from '@shared-hooks/useCart'
import HeroCarousel from './components/HeroCarousel'
import AmenitiesSection from './components/AmenitiesSection'
import ToursSection from './components/ToursSection'
import ReviewsSection from './components/ReviewsSection'
import RoomsList from './pages/RoomsList'
import BookingForm from './pages/BookingForm'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem } = useCart()
  const [selectedRoom, setSelectedRoom] = useState(null)

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Habitaciones', href: '#rooms' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Tours', href: '#tours' },
    { name: 'Contacto', href: '#contact' }
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar 
        brand="Hotel InnovaTech Premium" 
        toggleTheme={toggleTheme} 
        isDark={isDark}
        links={navLinks}
      />

      <main>
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Rooms Section */}
        <section id="rooms-section" className="py-20 bg-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestras Habitaciones</h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Elige entre nuestras 15 categorías de habitaciones, cada una diseñada para ofrecerte el máximo confort
              </p>
            </div>
            <RoomsList onSelectRoom={(room) => {
              setSelectedRoom(room)
              document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })
            }} />
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities">
          <AmenitiesSection />
        </section>

        {/* Tours Section */}
        <section id="tours">
          <ToursSection />
        </section>

        {/* Reviews Section */}
        <ReviewsSection />

        {/* Booking Form */}
        {selectedRoom && (
          <section id="booking-section" className="py-20 bg-surface/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Finalizar Reserva</h2>
                <p className="text-lg text-muted">Completa los detalles de tu reserva</p>
              </div>
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
                  setSelectedRoom(null)
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

      <Footer brand="Hotel InnovaTech Premium" />
    </div>
  )
}

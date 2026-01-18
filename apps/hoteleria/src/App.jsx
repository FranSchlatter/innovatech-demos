import { useState, useEffect } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { useCart } from '@shared-hooks/useCart'
import HeroCarousel from './components/HeroCarousel'
import HotelAbout from './components/HotelAbout'
import AccommodationTiers from './components/AccommodationTiers'
import HotelAmenities from './components/HotelAmenities'
import OffersSection from './components/OffersSection'
import ReviewsSection from './components/ReviewsSection'
import BookingForm from './pages/BookingForm'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem } = useCart()
  const [selectedRoom, setSelectedRoom] = useState(null)

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Accommodation', href: '#accommodation' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Offers', href: '#offers' },
    { name: 'Contact', href: '#contact' }
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar 
        brand="Hotel Luxury" 
        toggleTheme={toggleTheme} 
        isDark={isDark}
        links={navLinks}
      />

      <main>
        {/* Hero Section */}
        <HeroCarousel />

        {/* About Hotel */}
        <HotelAbout />

        {/* Accommodation Tiers */}
        <AccommodationTiers onSelectRoom={(room) => {
          setSelectedRoom(room)
          document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })
        }} />

        {/* Hotel Amenities */}
        <section id="amenities">
          <HotelAmenities />
        </section>

        {/* Offers */}
        <section id="offers">
          <OffersSection />
        </section>

        {/* Reviews */}
        <ReviewsSection />

        {/* Booking Form */}
        {selectedRoom && (
          <section id="booking-section" className="py-20 md:py-32 bg-surface">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="heading-md mb-4">Confirm Your Reservation</h2>
                <p className="text-lg text-muted">Complete your booking details</p>
              </div>
              <BookingForm 
                room={selectedRoom} 
                onBook={(booking) => {
                  addItem({
                    ...selectedRoom,
                    ...booking,
                    quantity: 1
                  })
                  alert('Reservation confirmed! We will contact you shortly.')
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

      <Footer brand="Hotel Luxury" />
    </div>
  )
}

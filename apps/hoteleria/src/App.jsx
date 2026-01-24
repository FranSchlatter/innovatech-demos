import { useState, useEffect } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { useCart } from '@shared-hooks/useCart'
import HeroCarousel from './components/HeroCarousel'
import HotelAbout from './components/HotelAbout'
import AccommodationTiers from './components/AccommodationTiers'
import HotelAmenities from './components/HotelAmenities'
import OffersSection from './components/OffersSection'
import ReviewsSection from './components/ReviewsSection'
import HotelContactSection from './components/HotelContactSection'
import BookingForm from './pages/BookingForm'
import RoomDetailPage from './pages/RoomDetailPage'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem } = useCart()
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [viewMode, setViewMode] = useState('main') // 'main', 'detail', 'booking'

  const navLinks = [
    { name: 'Home', href: '#home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: 'Accommodation', href: '#accommodation' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Offers', href: '#offers' },
    { name: 'Contact', href: '#contact' }
  ]

  const handleSelectRoom = (room, action) => {
    setSelectedRoom(room)
    if (action === 'details') {
      setViewMode('detail')
    } else if (action === 'reserve') {
      setViewMode('booking')
      setTimeout(() => {
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleReserveFromDetail = (room) => {
    setSelectedRoom(room)
    setViewMode('booking')
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleBackToMain = () => {
    setViewMode('main')
    setSelectedRoom(null)
  }

  // Show room detail page if in detail mode
  if (viewMode === 'detail' && selectedRoom) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar 
          brand="Hotel Luxury" 
          toggleTheme={toggleTheme} 
          isDark={isDark}
          links={navLinks}
        />
        <RoomDetailPage 
          room={selectedRoom}
          onBack={handleBackToMain}
          onReserve={handleReserveFromDetail}
        />
        <Footer brand="Hotel Luxury" />
      </div>
    )
  }

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
        <AccommodationTiers onSelectRoom={handleSelectRoom} />

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
        {selectedRoom && viewMode === 'booking' && (
          <section id="booking-section" className="py-20 md:py-32 bg-surface">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="heading-md mb-4">Confirm Your Reservation</h2>
                <p className="text-lg text-muted">Complete your booking details below</p>
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
                  setViewMode('main')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          </section>
        )}

        {/* Contact */}
        <section id="contact">
          <HotelContactSection />
        </section>
      </main>

      <Footer brand="Hotel Luxury" />
    </div>
  )
}

import { useState } from 'react'
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
import GuestServicesSection from './components/GuestServicesSection'
import BookingForm from './pages/BookingForm'
import RoomDetailPage from './pages/RoomDetailPage'
import AdminLayout from './components/admin/layout/AdminLayout'
import GuestPortal from './components/GuestPortal'
import { User } from 'lucide-react'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem } = useCart()
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [viewMode, setViewMode] = useState('main') // 'main', 'detail', 'booking', 'admin', 'guest-portal'

  const handleNavClick = (sectionId) => {
    if (viewMode !== 'main') {
      setViewMode('main')
      setSelectedRoom(null)
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { name: 'Home', href: '#home', onClick: () => { setViewMode('main'); setSelectedRoom(null); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
    { name: 'Accommodation', href: '#accommodation', onClick: () => handleNavClick('accommodation') },
    { name: 'Services', href: '#services', onClick: () => handleNavClick('services') },
    { name: 'Amenities', href: '#amenities', onClick: () => handleNavClick('amenities') },
    { name: 'Contact', href: '#contact', onClick: () => handleNavClick('contact') },
    { name: 'Guest Portal', href: '#guest', onClick: () => setViewMode('guest-portal'), icon: User },
    { name: 'Admin', href: '#admin', onClick: () => setViewMode('admin'), highlight: true }
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show admin panel if in admin mode
  if (viewMode === 'admin') {
    return (
      <AdminLayout
        onExit={handleBackToMain}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    )
  }

  // Show guest portal if in guest-portal mode
  if (viewMode === 'guest-portal') {
    return (
      <GuestPortal onExit={handleBackToMain} />
    )
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

        {/* Guest Services */}
        <section id="services">
          <GuestServicesSection />
        </section>

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
              <BookingForm
                room={selectedRoom}
                onBook={(booking) => {
                  addItem({
                    ...selectedRoom,
                    ...booking,
                    quantity: 1
                  })
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

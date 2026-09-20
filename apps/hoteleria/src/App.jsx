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
import EventsCalendar from './components/EventsCalendar'
import BookingForm from './pages/BookingForm'
import RoomDetailPage from './pages/RoomDetailPage'
import AdminLayout from './components/admin/layout/AdminLayout'
import GuestPortal from './components/GuestPortal'
import GuidedTour from '@shared-ui/components/GuidedTour'
import NewsBar, { NEWS_BAR_HEIGHT } from './components/NewsBar'
import { useNews } from './hooks/useNews'
import { useCurrency } from './hooks/useCurrency'
import { useTranslation } from './i18n/LanguageProvider'
import { AnimatePresence } from 'framer-motion'
import { User, Compass } from 'lucide-react'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { t, language, setLanguage, languages } = useTranslation()
  const { currency, setCurrency, currencies } = useCurrency()
  const { cart, addItem, removeItem } = useCart()
  const { liveNews, dismiss: dismissNews } = useNews()

  const TOUR_STEPS = [
    { target: '#hero', title: t('landing.tour.welcomeTitle'), body: t('landing.tour.welcomeBody') },
    { target: '#services', title: t('landing.tour.servicesTitle'), body: t('landing.tour.servicesBody') },
    { target: '#amenities', title: t('landing.tour.amenitiesTitle'), body: t('landing.tour.amenitiesBody') },
    { target: '#contact', title: t('landing.tour.contactTitle'), body: t('landing.tour.contactBody') },
    { target: null, title: t('landing.tour.adminTitle'), body: t('landing.tour.adminBody') }
  ]
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [viewMode, setViewMode] = useState('main') // 'main', 'detail', 'booking', 'admin', 'guest-portal'
  const [tourRun, setTourRun] = useState(false)

  // Announcement bar is landing-only; when visible it pushes the fixed navbar
  // down by its height so the two never overlap.
  const showNewsBar = liveNews.length > 0
  const navTopOffset = showNewsBar ? NEWS_BAR_HEIGHT : 0

  const startTour = () => {
    setViewMode('main')
    setSelectedRoom(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setTourRun(true), 250)
  }

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
    { name: t('nav.home'), href: '#home', onClick: () => { setViewMode('main'); setSelectedRoom(null); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
    { name: t('nav.accommodation'), href: '#accommodation', onClick: () => handleNavClick('accommodation') },
    { name: t('nav.services'), href: '#services', onClick: () => handleNavClick('services') },
    { name: t('nav.amenities'), href: '#amenities', onClick: () => handleNavClick('amenities') },
    { name: t('nav.activities'), href: '#activities', onClick: () => handleNavClick('activities') },
    { name: t('nav.contact'), href: '#contact', onClick: () => handleNavClick('contact') },
    { name: t('nav.tour'), href: '#tour', onClick: startTour, icon: Compass },
    { name: t('nav.guestPortal'), href: '#guest', onClick: () => setViewMode('guest-portal'), icon: User },
    { name: t('nav.admin'), href: '#admin', onClick: () => setViewMode('admin'), highlight: true }
  ]

  const navLangProps = { language, languages, onLanguageChange: setLanguage }
  const navCurrencyProps = { currency, currencies, onCurrencyChange: setCurrency }
  const footerLabels = {
    servicesTitle: t('landing.footer.servicesTitle'),
    services: t('landing.footer.services'),
    legalTitle: t('landing.footer.legalTitle'),
    legal: t('landing.footer.legal'),
    madeWith: t('landing.footer.madeWith'),
    madeWithSuffix: t('landing.footer.madeWithSuffix'),
  }

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

  // Build a room-like object from a curated package so the existing BookingForm
  // can drive the reservation, while flagging it as a package for tailored copy.
  const handleReservePackage = (pkg) => {
    setSelectedRoom({
      name: pkg.title,
      image: pkg.image,
      description: pkg.longDescription || pkg.description,
      price: pkg.priceValue,
      isPackage: true,
      packageDetails: pkg.details.map((d) => d.text),
      cancellationPolicy: pkg.cancellation
    })
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
          brand="Villa Serena"
          toggleTheme={toggleTheme}
          isDark={isDark}
          links={navLinks}
          {...navLangProps}
          {...navCurrencyProps}
        />
        <RoomDetailPage
          room={selectedRoom}
          onBack={handleBackToMain}
          onReserve={handleReserveFromDetail}
        />
        <Footer brand="Villa Serena" labels={footerLabels} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <AnimatePresence>
        {showNewsBar && <NewsBar news={liveNews} onDismiss={dismissNews} />}
      </AnimatePresence>

      <Navbar
        brand="Villa Serena"
        toggleTheme={toggleTheme}
        isDark={isDark}
        links={navLinks}
        topOffset={navTopOffset}
        {...navLangProps}
        {...navCurrencyProps}
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
          <GuestServicesSection onOpenPortal={() => setViewMode('guest-portal')} />
        </section>

        {/* Hotel Amenities */}
        <section id="amenities">
          <HotelAmenities />
        </section>

        {/* Hotel Activities & Events (admin-managed, guests can register) */}
        <EventsCalendar />

        {/* Offers */}
        <section id="offers">
          <OffersSection onReservePackage={handleReservePackage} />
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

      <Footer brand="Villa Serena" labels={footerLabels} />

      <GuidedTour steps={TOUR_STEPS} run={tourRun} onClose={() => setTourRun(false)} />
    </div>
  )
}

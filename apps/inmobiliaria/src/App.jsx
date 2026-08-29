import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { User, Building2 } from 'lucide-react'
import { useFavorites } from './hooks/useFavorites'
import PropertyHero from './components/PropertyHero'
import AboutSection from './components/AboutSection'
import FeaturedProperties from './components/FeaturedProperties'
import ServicesSection from './components/ServicesSection'
import MortgageCalculator from './components/MortgageCalculator'
import WhyChooseUs from './components/WhyChooseUs'
import AgentsSection from './components/AgentsSection'
import TestimonialsSection from './components/TestimonialsSection'
import ContactSection from './components/ContactSection'
import PropertiesListPage from './pages/PropertiesListPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import ScheduleVisitForm from './pages/ScheduleVisitForm'
import AdminLayout from './components/admin/layout/AdminLayout'
import ClientPortal from './components/ClientPortal'
import GuidedTour from '@shared-ui/components/GuidedTour'
import { Compass } from 'lucide-react'
import './styles.css'

const BRAND = 'Terranova'

const TOUR_STEPS = [
  { target: '#properties-preview', title: 'Bienvenido a la demo', body: 'En 30 segundos te muestro qué gana tu inmobiliaria. Tu catálogo, siempre actualizado y filtrable.' },
  { target: '#calculator', title: 'Calculadora de crédito', body: 'El interesado simula su crédito hipotecario sin salir del sitio.' },
  { target: '#contact', title: 'Captación sin fricción', body: 'Las consultas entran y la IA responde y califica el lead al instante.' },
  { target: null, title: 'El panel es donde se gana', body: 'Entrá a "Admin": bandeja con IA y scoring, tiempo de respuesta por agente, simulador de ajuste UVA/ICL y liquidación al propietario.' }
]

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const favorites = useFavorites()
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [listingsFilter, setListingsFilter] = useState(null)
  const [viewMode, setViewMode] = useState('main') // main | listings | detail | schedule | admin | client-portal
  const [tourRun, setTourRun] = useState(false)

  const startTour = () => {
    setViewMode('main')
    setSelectedProperty(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setTourRun(true), 250)
  }

  const handleNavClick = (sectionId) => {
    if (viewMode !== 'main') {
      setViewMode('main')
      setSelectedProperty(null)
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goToListings = (filter = null) => {
    setListingsFilter(filter)
    setSelectedProperty(null)
    setViewMode('listings')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navLinks = [
    { name: 'Inicio', href: '#home', onClick: () => { setViewMode('main'); setSelectedProperty(null); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
    { name: 'Propiedades', href: '#properties', onClick: () => goToListings() },
    { name: 'Servicios', href: '#services', onClick: () => handleNavClick('services') },
    { name: 'Calculadora', href: '#calculator', onClick: () => handleNavClick('calculator') },
    { name: 'Contacto', href: '#contact', onClick: () => handleNavClick('contact') },
    { name: 'Recorrido', href: '#tour', onClick: startTour, icon: Compass },
    { name: 'Mi Portal', href: '#portal', onClick: () => setViewMode('client-portal'), icon: User },
    { name: 'Admin', href: '#admin', onClick: () => setViewMode('admin'), highlight: true }
  ]

  const handleSelectProperty = (property, action = 'details') => {
    setSelectedProperty(property)
    if (action === 'schedule') {
      setViewMode('schedule')
    } else {
      setViewMode('detail')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScheduleFromDetail = (property) => {
    setSelectedProperty(property)
    setViewMode('schedule')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToMain = () => {
    setViewMode('main')
    setSelectedProperty(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Admin panel (CRM)
  if (viewMode === 'admin') {
    return (
      <AdminLayout onExit={handleBackToMain} isDark={isDark} toggleTheme={toggleTheme} />
    )
  }

  // Client portal
  if (viewMode === 'client-portal') {
    return (
      <ClientPortal
        onExit={handleBackToMain}
        favorites={favorites}
        onSelectProperty={handleSelectProperty}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    )
  }

  const shell = (children) => (
    <div className="min-h-screen bg-bg text-text">
      <Navbar brand={BRAND} toggleTheme={toggleTheme} isDark={isDark} links={navLinks} />
      {children}
      <Footer brand={BRAND} />
    </div>
  )

  // Properties listing / search page
  if (viewMode === 'listings') {
    return shell(
      <PropertiesListPage
        initialFilter={listingsFilter}
        favorites={favorites}
        onSelectProperty={handleSelectProperty}
        onBack={handleBackToMain}
      />
    )
  }

  // Property detail page
  if (viewMode === 'detail' && selectedProperty) {
    return shell(
      <PropertyDetailPage
        property={selectedProperty}
        favorites={favorites}
        onBack={() => goToListings(listingsFilter)}
        onSchedule={handleScheduleFromDetail}
      />
    )
  }

  // Schedule a visit
  if (viewMode === 'schedule' && selectedProperty) {
    return shell(
      <ScheduleVisitForm
        property={selectedProperty}
        onBack={() => handleSelectProperty(selectedProperty, 'details')}
        onDone={handleBackToMain}
      />
    )
  }

  // Main landing page
  return shell(
    <main>
      <PropertyHero onSearch={goToListings} onExplore={() => handleNavClick('properties-preview')} />

      <AboutSection />

      <section id="properties-preview">
        <FeaturedProperties
          favorites={favorites}
          onSelectProperty={handleSelectProperty}
          onViewAll={goToListings}
        />
      </section>

      <section id="services">
        <ServicesSection />
      </section>

      <WhyChooseUs />

      <section id="calculator">
        <MortgageCalculator />
      </section>

      <section id="agents">
        <AgentsSection />
      </section>

      <TestimonialsSection />

      <section id="contact">
        <ContactSection />
      </section>

      <GuidedTour steps={TOUR_STEPS} run={tourRun} onClose={() => setTourRun(false)} />
    </main>
  )
}

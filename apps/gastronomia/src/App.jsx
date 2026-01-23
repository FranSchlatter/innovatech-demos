import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { useCart } from '@shared-hooks/useCart'
import HeroCarousel from './components/HeroCarousel'
import AboutSection from './components/AboutSection'
import MenuGrid from './components/MenuGrid'
import DishDetail from './components/DishDetail'
import OrderForm from './components/OrderForm'
import ReservationForm from './components/ReservationForm'
import TestimonialsSection from './components/TestimonialsSection'
import { ShoppingCart } from 'lucide-react'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem, updateQuantity, clearCart, total } = useCart()

  // View states: 'main', 'detail', 'order', 'reservation'
  const [view, setView] = useState('main')
  const [selectedDish, setSelectedDish] = useState(null)

  const handleViewMenu = () => {
    const menuSection = document.getElementById('menu-section')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleViewDetails = (dish) => {
    setSelectedDish(dish)
    setView('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = (item) => {
    addItem({
      ...item,
      quantity: item.quantity || 1,
      id: item.id
    })
    // Show success notification
    alert(`✓ ${item.name} added to cart`)
  }

  const handleBackToMain = () => {
    setView('main')
    setSelectedDish(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Navigation links
  const navLinks = [
    {
      name: 'Home',
      href: '#home',
      onClick: () => {
        setView('main')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    {
      name: 'Menu',
      href: '#menu',
      onClick: () => {
        if (view !== 'main') {
          setView('main')
          setTimeout(handleViewMenu, 100)
        } else {
          handleViewMenu()
        }
      }
    },
    {
      name: 'Reservations',
      href: '#reservation',
      onClick: () => {
        setView('reservation')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    {
      name: `Cart (${cart.length})`,
      href: '#cart',
      onClick: () => {
        setView('order')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      icon: ShoppingCart
    }
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar
        brand="InnovaTech Gastronomy"
        toggleTheme={toggleTheme}
        isDark={isDark}
        links={navLinks}
      />

      <main>
        {/* Main View */}
        {view === 'main' && (
          <>
            <HeroCarousel
              onViewMenu={handleViewMenu}
              onBookTable={() => {
                setView('reservation')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
            <AboutSection />

            <section id="menu-section" className="py-20 bg-bg">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h2>
                  <p className="text-lg text-muted max-w-2xl mx-auto">
                    Discover our signature dishes prepared with the finest fresh ingredients
                  </p>
                </div>
                <MenuGrid
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </section>

            <TestimonialsSection />
            <ContactSection />
          </>
        )}

        {/* Dish Detail View */}
        {view === 'detail' && selectedDish && (
          <DishDetail
            dish={selectedDish}
            onBack={handleBackToMain}
            onAddToCart={(item) => {
              handleAddToCart(item)
              handleBackToMain()
            }}
          />
        )}

        {/* Order Form View */}
        {view === 'order' && (
          <OrderForm
            cart={cart}
            total={total}
            onBack={handleBackToMain}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
          />
        )}

        {/* Reservation Form View */}
        {view === 'reservation' && (
          <ReservationForm
            onBack={handleBackToMain}
          />
        )}
      </main>

      {view === 'main' && <Footer brand="InnovaTech Gastronomy" />}
    </div>
  )
}

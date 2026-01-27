import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { useCart } from '@shared-hooks/useCart'
import HeroCarousel from './components/HeroCarousel'
import AboutSection from './components/AboutSection'
import MenuGrid from './components/MenuGrid'
import DishDetail from './components/DishDetail'
import DishCustomizeModal from './components/DishCustomizeModal'
import FloatingCartButton from './components/FloatingCartButton'
import OrderForm from './components/OrderForm'
import ReservationForm from './components/ReservationForm'
import TestimonialsSection from './components/TestimonialsSection'
import GastronomyContactSection from './components/GastronomyContactSection'
import AdminLayout from './components/admin/layout/AdminLayout'
import { ToastProvider, useToast } from './context/ToastContext'
import { ShoppingCart, ChefHat } from 'lucide-react'
import './styles.css'

function AppContent() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart()
  const { showCartNotification } = useToast()

  // View states: 'main', 'detail', 'order', 'reservation', 'admin'
  const [view, setView] = useState('main')
  const [selectedDish, setSelectedDish] = useState(null)
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false)
  const [dishToCustomize, setDishToCustomize] = useState(null)

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

  // Open customization modal instead of adding directly
  const handleOpenCustomize = (dish) => {
    setDishToCustomize(dish)
    setCustomizeModalOpen(true)
  }

  // Quick add without customization (from menu grid)
  const handleQuickAdd = (dish) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity: 1
    })
    showCartNotification(`${dish.name} added to cart`)
  }

  // Add to cart with customizations (from modal)
  const handleAddToCartWithCustomizations = (item) => {
    addItem(item)
    showCartNotification(`${item.name} added to cart`)
  }

  // Add from detail page
  const handleAddFromDetail = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity || 1
    })
    showCartNotification(`${item.quantity || 1}x ${item.name} added to cart`)
    handleBackToMain()
  }

  const handleBackToMain = () => {
    setView('main')
    setSelectedDish(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleExitAdmin = () => {
    setView('main')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoToCart = () => {
    setView('order')
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
      name: `Cart (${itemCount})`,
      href: '#cart',
      onClick: handleGoToCart,
      icon: ShoppingCart
    },
    {
      name: 'Admin',
      href: '#admin',
      onClick: () => {
        setView('admin')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      icon: ChefHat,
      highlight: true
    }
  ]

  // Render Admin Layout
  if (view === 'admin') {
    return (
      <AdminLayout
        isDark={isDark}
        toggleTheme={toggleTheme}
        onExit={handleExitAdmin}
      />
    )
  }

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
              onOrderOnline={handleGoToCart}
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
                  onAddToCart={handleQuickAdd}
                  onCustomize={handleOpenCustomize}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </section>

            <TestimonialsSection />
            <GastronomyContactSection />
          </>
        )}

        {/* Dish Detail View */}
        {view === 'detail' && selectedDish && (
          <DishDetail
            dish={selectedDish}
            onBack={handleBackToMain}
            onAddToCart={handleAddFromDetail}
            onCustomize={() => handleOpenCustomize(selectedDish)}
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

      {/* Floating Cart Button - Shows on main view when cart has items */}
      {view === 'main' && (
        <FloatingCartButton
          itemCount={itemCount}
          total={total}
          onClick={handleGoToCart}
        />
      )}

      {/* Dish Customization Modal */}
      <DishCustomizeModal
        dish={dishToCustomize}
        isOpen={customizeModalOpen}
        onClose={() => {
          setCustomizeModalOpen(false)
          setDishToCustomize(null)
        }}
        onAddToCart={handleAddToCartWithCustomizations}
      />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

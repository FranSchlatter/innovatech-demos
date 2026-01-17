import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { useCart } from '@shared-hooks/useCart'
import MenuGrid from './components/MenuGrid'
import ReviewsGastroSection from './components/ReviewsGastroSection'
import CartDrawer from './pages/CartDrawer'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem, clearCart, total } = useCart()
  const [showCart, setShowCart] = useState(false)

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Menú', href: '#menu' },
    { name: 'Reseñas', href: '#reviews' },
    { name: `🛒 ${cart.length}`, href: '#', onClick: (e) => {
      e.preventDefault()
      setShowCart(true)
    }}
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar 
        brand="Restaurante InnovaTech" 
        toggleTheme={toggleTheme} 
        isDark={isDark}
        links={navLinks}
      />

      <main>
        {/* Hero */}
        <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-primary/20 to-bg flex items-center">
          <div className="container mx-auto px-4 text-center z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Sabor Que Enamora
              </h1>
              <p className="text-xl md:text-2xl text-muted mb-8">
                Sistema de pedidos online con entrega rápida. Cada plato preparado con los mejores ingredientes y pasión.
              </p>
              <button
                onClick={() => {
                  document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all inline-block"
              >
                Ver Menú Completo
              </button>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1400&h=900&fit=crop"
              alt="Restaurante"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Menu Section */}
        <section id="menu-section" className="py-20 bg-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestro Menú</h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Descubre nuestras especialidades preparadas con ingredientes frescos de la mejor calidad
              </p>
            </div>
            <MenuGrid onAddToCart={(item) => {
              addItem({
                ...item,
                quantity: 1,
                id: item.id
              })
              alert(`✓ ${item.name} agregado al carrito`)
            }} />
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews">
          <ReviewsGastroSection />
        </section>

        {/* Contact */}
        <ContactSection />
      </main>

      <Footer brand="Restaurante InnovaTech" />

      {/* Cart Drawer */}
      {showCart && (
        <CartDrawer 
          cart={cart}
          total={total}
          onClose={() => setShowCart(false)}
          onRemove={removeItem}
          onClear={clearCart}
        />
      )}
    </div>
  )
}

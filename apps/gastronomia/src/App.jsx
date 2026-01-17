import { useState } from 'react'
import Navbar from '@shared-ui/components/Navbar'
import Footer from '@shared-ui/components/Footer'
import Hero from '@shared-ui/components/Hero'
import ContactSection from '@shared-ui/components/ContactSection'
import { useDarkMode } from '@shared-hooks/useDarkMode'
import { useCart } from '@shared-hooks/useCart'
import MenuSection from './pages/MenuSection'
import CartDrawer from './pages/CartDrawer'
import './styles.css'

export default function App() {
  const { isDark, toggleTheme } = useDarkMode()
  const { cart, addItem, removeItem, clearCart, total } = useCart()
  const [showCart, setShowCart] = useState(false)

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Menú', href: '#menu' },
    { name: `Carrito (${cart.length})`, href: '#', onClick: () => setShowCart(true) }
  ]

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar 
        brand="Restaurant InnovaTech" 
        toggleTheme={toggleTheme} 
        isDark={isDark}
        links={navLinks}
      />

      <main className="pt-16">
        {/* Hero */}
        <Hero 
          title="Ordená Tu Comida"
          subtitle="Sistema de pedidos online con entrega rápida. Menú completo con platos frescos preparados al momento."
          image="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=600&fit=crop"
          cta={{
            label: 'Ver Menú',
            onClick: () => {
              document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })
            }
          }}
        />

        {/* Menu Section */}
        <section id="menu-section" className="py-16 bg-surface/30">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Nuestro Menú</h2>
            <MenuSection onAddToCart={(item) => {
              addItem({
                ...item,
                quantity: 1,
                id: item.id
              })
              alert(`${item.name} agregado al carrito`)
            }} />
          </div>
        </section>

        {/* Contact */}
        <ContactSection />
      </main>

      <Footer brand="Restaurant InnovaTech" />

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

import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar({ brand = 'InnovaTech', toggleTheme, isDark, links = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md shadow-soft'
          : 'bg-bg/80 backdrop-blur-sm'
      }`}
    >
      <div className="container py-4 flex items-center justify-between">
        <motion.div
          className="text-2xl font-bold text-primary cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {brand}
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault()
                  link.onClick()
                }
              }}
              className="text-text hover:text-primary transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-surface hover:bg-primary hover:text-primary-contrast transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-primary"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-surface border-t border-border"
        >
          <div className="container py-4 flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault()
                    link.onClick()
                  }
                  setIsOpen(false)
                }}
                className="text-text hover:text-primary transition-colors font-medium px-2 py-2"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-border">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-bg hover:bg-primary hover:text-primary-contrast transition-colors w-full flex items-center justify-center gap-2"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

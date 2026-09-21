import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

function LanguageToggle({ language, languages, onLanguageChange, className = '' }) {
  if (!onLanguageChange || !languages?.length) return null
  return (
    <div
      role="group"
      aria-label="Language"
      className={`flex items-center gap-0.5 rounded-lg bg-surface p-0.5 ${className}`}
    >
      {languages.map((lang) => {
        const active = lang.code === language
        return (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            aria-pressed={active}
            title={lang.name}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
              active
                ? 'bg-primary text-primary-contrast'
                : 'text-muted hover:text-primary'
            }`}
          >
            {lang.label}
          </button>
        )
      })}
    </div>
  )
}

// Optional display-currency selector (H25). Rendered only when the host app wires
// the props, so the other apps keep an unchanged navbar.
function CurrencyToggle({ currency, currencies, onCurrencyChange, className = '' }) {
  if (!onCurrencyChange || !currencies?.length) return null
  return (
    <div
      role="group"
      aria-label="Currency"
      className={`flex items-center gap-0.5 rounded-lg bg-surface p-0.5 ${className}`}
    >
      {currencies.map((cur) => {
        const active = cur.code === currency
        return (
          <button
            key={cur.code}
            onClick={() => onCurrencyChange(cur.code)}
            aria-pressed={active}
            title={cur.name}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
              active
                ? 'bg-primary text-primary-contrast'
                : 'text-muted hover:text-primary'
            }`}
          >
            {cur.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Navbar({
  brand = 'InnovaTech',
  toggleTheme,
  isDark,
  links = [],
  topOffset = 0,
  language,
  languages,
  onLanguageChange,
  currency,
  currencies,
  onCurrencyChange,
}) {
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
      style={{ top: topOffset }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md shadow-soft'
          : 'bg-bg/80 backdrop-blur-sm'
      }`}
    >
      <div className="container py-4 flex items-center justify-between gap-6 lg:gap-10">
        <motion.div
          className="text-2xl font-bold text-primary cursor-pointer whitespace-nowrap shrink-0"
          whileHover={{ scale: 1.05 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {brand}
        </motion.div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault()
                    link.onClick()
                  }
                }}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap transition-colors font-medium ${
                  link.highlight
                    ? 'px-4 py-2 bg-primary text-primary-contrast rounded-lg hover:opacity-90'
                    : 'text-text hover:text-primary'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                {link.name}
              </a>
            )
          })}
          <CurrencyToggle
            currency={currency}
            currencies={currencies}
            onCurrencyChange={onCurrencyChange}
          />
          <LanguageToggle
            language={language}
            languages={languages}
            onLanguageChange={onLanguageChange}
          />
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
            {links.map((link) => {
              const Icon = link.icon
              return (
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
                  className={`inline-flex items-center gap-2 transition-colors font-medium px-2 py-2 rounded-lg ${
                    link.highlight
                      ? 'bg-primary text-primary-contrast hover:opacity-90'
                      : 'text-text hover:text-primary'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  {link.name}
                </a>
              )
            })}
            <div className="pt-2 border-t border-border flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-bg hover:bg-primary hover:text-primary-contrast transition-colors flex-1 flex items-center justify-center gap-2"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <LanguageToggle
                language={language}
                languages={languages}
                onLanguageChange={onLanguageChange}
              />
            </div>
            {onCurrencyChange && currencies?.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-muted">{currency}</span>
                <CurrencyToggle
                  currency={currency}
                  currencies={currencies}
                  onCurrencyChange={onCurrencyChange}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

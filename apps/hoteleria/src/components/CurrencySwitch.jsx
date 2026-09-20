import { useCurrency } from '../hooks/useCurrency'

/**
 * Compact USD/ARS/EUR segmented control for surfaces that don't render the shared
 * Navbar (Guest Portal header). Mirrors LanguageSwitch and the navbar currency
 * toggle so the currency preference is switchable everywhere prices are shown.
 */
export default function CurrencySwitch({ className = '' }) {
  const { currency, setCurrency, currencies } = useCurrency()
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
            onClick={() => setCurrency(cur.code)}
            aria-pressed={active}
            title={cur.name}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
              active ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-primary'
            }`}
          >
            {cur.label}
          </button>
        )
      })}
    </div>
  )
}

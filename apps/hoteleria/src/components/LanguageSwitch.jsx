import { useTranslation } from '../i18n/LanguageProvider'

/**
 * Compact ES/EN segmented control for surfaces that don't render the shared
 * Navbar (Guest Portal, Admin panel, login screen). Mirrors the Navbar toggle.
 */
export default function LanguageSwitch({ className = '' }) {
  const { language, setLanguage, languages } = useTranslation()
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
            onClick={() => setLanguage(lang.code)}
            aria-pressed={active}
            title={lang.name}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
              active ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-primary'
            }`}
          >
            {lang.label}
          </button>
        )
      })}
    </div>
  )
}

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { translations, LANGUAGES, DEFAULT_LANGUAGE } from './translations'

const STORAGE_KEY = 'hotel-language'
const SYNC_EVENT = 'hotel-language-change'

const LanguageContext = createContext(null)

/**
 * Resolve a dot-notation key ("portal.stay.title") against a nested dictionary.
 * Returns undefined if any segment is missing so callers can fall back.
 */
function lookup(dict, key) {
  if (!dict) return undefined
  const value = key.split('.').reduce((acc, segment) => {
    if (acc && typeof acc === 'object') return acc[segment]
    return undefined
  }, dict)
  return value
}

/**
 * Replace {placeholder} tokens with values from `vars`.
 * Works for both strings and each entry of an array (used by t.array()).
 */
function interpolate(str, vars) {
  if (typeof str !== 'string' || !vars) return str
  return str.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  )
}

function readStoredLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return LANGUAGES.some((l) => l.code === saved) ? saved : DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage)

  // Reflect language on <html lang> for a11y / correct hyphenation.
  useEffect(() => {
    document.documentElement.setAttribute('lang', language)
  }, [language])

  // Keep other tabs (and other providers in this tab) in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue && e.newValue !== language) {
        setLanguageState(e.newValue)
      }
    }
    const onCustom = (e) => {
      if (e.detail && e.detail !== language) setLanguageState(e.detail)
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(SYNC_EVENT, onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(SYNC_EVENT, onCustom)
    }
  }, [language])

  const setLanguage = useCallback((code) => {
    if (!LANGUAGES.some((l) => l.code === code)) return
    setLanguageState(code)
    window.localStorage.setItem(STORAGE_KEY, code)
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: code }))
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }, [language, setLanguage])

  /**
   * t('some.key', { name: 'Ana' }) -> translated string.
   * Falls back to English, then to the raw key, so nothing ever renders blank.
   */
  const t = useCallback(
    (key, vars) => {
      const primary = lookup(translations[language], key)
      const value =
        primary !== undefined ? primary : lookup(translations[DEFAULT_LANGUAGE], key)
      if (value === undefined) {
        if (import.meta.env?.DEV) {
          // eslint-disable-next-line no-console
          console.warn(`[i18n] missing key: "${key}" (${language})`)
        }
        return key
      }
      if (Array.isArray(value)) return value.map((item) => interpolate(item, vars))
      return interpolate(value, vars)
    },
    [language]
  )

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, languages: LANGUAGES, t }),
    [language, setLanguage, toggleLanguage, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

/**
 * Convenience hook: `const { t, language } = useTranslation()`.
 * Returns the whole context so components can also switch language.
 */
export function useTranslation() {
  return useLanguage()
}

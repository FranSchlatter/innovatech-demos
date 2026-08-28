import { createContext, useContext, useMemo } from 'react'
import { DICTIONARIES } from '../i18n/dictionaries'
import { useDemo } from './DemoProvider'

const I18nContext = createContext(null)

export function I18nProvider({ children, extra = {} }) {
  const { lang } = useDemo()
  const t = useMemo(() => {
    const base = DICTIONARIES[lang] || DICTIONARIES.es
    const merged = { ...DICTIONARIES.es, ...base, ...(extra[lang] || extra.es || {}) }
    return (key, fallback) => merged[key] ?? fallback ?? key
  }, [lang, extra])
  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>
}

export function useT() {
  const t = useContext(I18nContext)
  if (!t) return (key, fallback) => fallback ?? key
  return t
}

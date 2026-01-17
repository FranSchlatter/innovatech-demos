import { useState, useEffect } from 'react'

export function useDarkMode(storageKey = 'innovatech-theme') {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'light') {
      setIsDark(false)
      document.documentElement.removeAttribute('data-theme')
    } else {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem(storageKey, 'dark')
    }
  }, [storageKey])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem(storageKey, 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem(storageKey, 'light')
    }
  }

  return { isDark, toggleTheme }
}

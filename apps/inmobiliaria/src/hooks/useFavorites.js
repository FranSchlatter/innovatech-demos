import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'terranova-favorites'

// Demo seed so the "Interesado" portal shows content out of the box:
// a mix of sale (PROP-001/004/010) and rent/temporary (PROP-006/011/012).
const DEFAULT_FAVORITES = ['PROP-001', 'PROP-004', 'PROP-010', 'PROP-006', 'PROP-011', 'PROP-012']

// Client-side favorites (saved properties) persisted in localStorage
export function useFavorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const parsed = saved ? JSON.parse(saved) : null
      // Seed the demo set when there's nothing stored yet (or it was left empty).
      setFavorites(parsed && parsed.length > 0 ? parsed : DEFAULT_FAVORITES)
    } catch (err) {
      console.error('Error loading favorites:', err)
      setFavorites(DEFAULT_FAVORITES)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (err) {
      console.error('Error saving favorites:', err)
    }
  }, [favorites])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }, [])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  return { favorites, isFavorite, toggleFavorite, clearFavorites, count: favorites.length }
}

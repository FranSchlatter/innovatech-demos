import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'terranova-favorites'

// Client-side favorites (saved properties) persisted in localStorage
export function useFavorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setFavorites(JSON.parse(saved))
    } catch (err) {
      console.error('Error loading favorites:', err)
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

import { useState, useEffect } from 'react'

export function useCart(storageKey = 'innovatech-cart') {
  const [cart, setCart] = useState([])

  // Cargar del localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCart(JSON.parse(saved))
    }
  }, [storageKey])

  // Guardar al cambiar
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart))
  }, [cart, storageKey])

  const addItem = (item) => {
    setCart([...cart, { ...item, id: Date.now() }])
  }

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

  return { cart, addItem, removeItem, updateQuantity, clearCart, total }
}

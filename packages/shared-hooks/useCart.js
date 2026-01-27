import { useState, useEffect, useCallback } from 'react'

export function useCart(storageKey = 'innovatech-cart') {
  const [cart, setCart] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart data:', e)
        setCart([])
      }
    }
  }, [storageKey])

  // Save on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart))
  }, [cart, storageKey])

  // Generate unique cart item ID based on dish ID and customizations
  const generateCartItemId = useCallback((item) => {
    const customizationKey = item.customizations
      ? JSON.stringify(item.customizations)
      : ''
    return `${item.id}-${customizationKey}`
  }, [])

  // Add item - consolidates same items (same dish + same customizations)
  const addItem = useCallback((item) => {
    setCart(prevCart => {
      const cartItemId = generateCartItemId(item)
      const existingIndex = prevCart.findIndex(
        cartItem => generateCartItemId(cartItem) === cartItemId
      )

      if (existingIndex >= 0) {
        // Item exists - increase quantity
        return prevCart.map((cartItem, index) =>
          index === existingIndex
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + (item.quantity || 1) }
            : cartItem
        )
      } else {
        // New item - add to cart with unique cartItemId
        return [...prevCart, {
          ...item,
          cartItemId,
          quantity: item.quantity || 1
        }]
      }
    })
  }, [generateCartItemId])

  // Remove item by cartItemId or id
  const removeItem = useCallback((itemId) => {
    setCart(prevCart => prevCart.filter(item =>
      item.cartItemId !== itemId && item.id !== itemId
    ))
  }, [])

  // Update quantity
  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setCart(prevCart => prevCart.map(item =>
      (item.cartItemId === itemId || item.id === itemId)
        ? { ...item, quantity }
        : item
    ))
  }, [removeItem])

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  // Calculate totals
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const total = subtotal // Can add tax/fees here if needed

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    subtotal,
    itemCount
  }
}

import { createContext, useContext, useReducer, useCallback } from 'react'

const AdminContext = createContext(null)

const initialState = {
  currentView: 'dashboard', // dashboard | orders | reservations | menu | inventory | tables
  sidebarOpen: true,
  searchQuery: '',
  filters: {},
  notifications: []
}

function adminReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'CLEAR_FILTERS':
      return { ...state, filters: {} }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 10)
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    default:
      return state
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  const setView = useCallback((view) => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }, [])

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }, [])

  const setSidebar = useCallback((open) => {
    dispatch({ type: 'SET_SIDEBAR', payload: open })
  }, [])

  const setSearch = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH', payload: query })
  }, [])

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [])

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }, [])

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString()
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { ...notification, id, timestamp: new Date() }
    })
    // Auto-remove after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
    }, 5000)
  }, [])

  const value = {
    ...state,
    setView,
    toggleSidebar,
    setSidebar,
    setSearch,
    setFilters,
    clearFilters,
    addNotification
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

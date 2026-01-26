import { createContext, useContext, useReducer } from 'react'

const AdminContext = createContext(null)

const initialState = {
  currentView: 'dashboard', // dashboard | appointments | doctors | patients | inventory | schedule
  sidebarOpen: false,
  searchQuery: '',
  filters: {
    status: 'all',
    doctor: 'all',
    specialty: 'all',
    location: 'all',
    dateRange: null
  },
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
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value }
      }
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 10)
      }
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    default:
      return state
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  const setView = (view) => dispatch({ type: 'SET_VIEW', payload: view })
  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' })
  const setSidebar = (open) => dispatch({ type: 'SET_SIDEBAR', payload: open })
  const setSearch = (query) => dispatch({ type: 'SET_SEARCH', payload: query })
  const setFilter = (key, value) => dispatch({ type: 'SET_FILTER', payload: { key, value } })
  const resetFilters = () => dispatch({ type: 'RESET_FILTERS' })
  const addNotification = (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
  const clearNotifications = () => dispatch({ type: 'CLEAR_NOTIFICATIONS' })

  const value = {
    ...state,
    setView,
    toggleSidebar,
    setSidebar,
    setSearch,
    setFilter,
    resetFilters,
    addNotification,
    clearNotifications
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

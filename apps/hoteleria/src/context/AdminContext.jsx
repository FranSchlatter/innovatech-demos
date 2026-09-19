import { createContext, useContext, useReducer } from 'react'

const AdminContext = createContext(null)

const initialState = {
  currentView: 'dashboard', // dashboard | rooms | housekeeping | inventory | services
  sidebarOpen: false,
  searchQuery: '',
  notifications: [],
  // Cross-view handoff: a service request asking to open the Inbox on a given
  // guest. Consumed (and cleared) by InboxManagement once acted upon. (H22)
  inboxTarget: null,
  filters: {
    rooms: { status: 'all', floor: 'all', type: 'all' },
    housekeeping: { status: 'all', priority: 'all', assignee: 'all' },
    inventory: { category: 'all', lowStock: false },
    services: { status: 'all', type: 'all', priority: 'all' }
  }
}

function adminReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload, sidebarOpen: false }
    case 'OPEN_INBOX_WITH_TARGET':
      return {
        ...state,
        currentView: 'inbox',
        sidebarOpen: false,
        inboxTarget: action.payload
      }
    case 'CONSUME_INBOX_TARGET':
      return { ...state, inboxTarget: null }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload }
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.section]: {
            ...state.filters[action.payload.section],
            [action.payload.key]: action.payload.value
          }
        }
      }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { id: Date.now(), ...action.payload }]
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

  const setView = (view) => dispatch({ type: 'SET_VIEW', payload: view })
  const openInboxWithTarget = (target) =>
    dispatch({ type: 'OPEN_INBOX_WITH_TARGET', payload: target })
  const consumeInboxTarget = () => dispatch({ type: 'CONSUME_INBOX_TARGET' })
  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' })
  const closeSidebar = () => dispatch({ type: 'CLOSE_SIDEBAR' })
  const setSearch = (query) => dispatch({ type: 'SET_SEARCH', payload: query })
  const setFilter = (section, key, value) =>
    dispatch({ type: 'SET_FILTER', payload: { section, key, value } })
  const addNotification = (notification) =>
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
  const removeNotification = (id) =>
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })

  const value = {
    ...state,
    setView,
    openInboxWithTarget,
    consumeInboxTarget,
    toggleSidebar,
    closeSidebar,
    setSearch,
    setFilter,
    addNotification,
    removeNotification
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

export default AdminContext

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import EmbedApp from './embed/EmbedApp.jsx'
import '@shared-styles/global.css'
import './theme-realestate.css'

// ?embed=<id> boots the app as an isolated feature preview for the marketplace
// (EmbedApp handles unknown ids with a tidy fallback, so a stale iframe never
// loads the whole site); otherwise it's the full demo, which also honors the
// ?feature=<id> deep-link.
const embedId = new URLSearchParams(window.location.search).get('embed')
const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    {embedId ? <EmbedApp id={embedId} /> : <App />}
  </StrictMode>,
)

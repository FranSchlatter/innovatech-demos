import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import EmbedApp from './embed/EmbedApp.jsx'
import { LanguageProvider } from './i18n/LanguageProvider'
import '@shared-styles/global.css'

// ?embed=<id> boots the app as an isolated feature preview for the marketplace
// (EmbedApp handles unknown ids with a tidy fallback); otherwise it's the full
// demo, which also honors the ?feature=<id> deep-link. Both share the providers.
const embedId = new URLSearchParams(window.location.search).get('embed')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      {embedId ? <EmbedApp id={embedId} /> : <App />}
    </LanguageProvider>
  </StrictMode>,
)

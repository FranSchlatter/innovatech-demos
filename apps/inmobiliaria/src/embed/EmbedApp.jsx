import { useEffect } from 'react'
import { FEATURE_MAP } from './featureMap'

// Standalone preview of a single feature widget, meant to be iframed by the
// marketplace catalog (?embed=<id>). No navbar/footer/shell — just the widget,
// so the real component is showcased in isolation without duplicating it.
export default function EmbedApp({ id }) {
  const entry = FEATURE_MAP[id]

  useEffect(() => {
    // Match the parent marketplace's theme when it passes ?theme=light|dark.
    const theme = new URLSearchParams(window.location.search).get('theme')
    const root = document.documentElement
    if (theme === 'light') {
      root.removeAttribute('data-theme')
      root.classList.remove('dark')
    } else if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
    }
    // No param → leave the demo's own default (dark) untouched.
  }, [])

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-8 text-center text-muted">
        Feature no disponible para previsualizar: <code className="ml-1">{id}</code>
      </div>
    )
  }

  return <div className="embed-root min-h-screen bg-bg text-text">{entry.embed}</div>
}

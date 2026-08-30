import { useEffect, useRef, useState } from 'react'

/**
 * Real equirectangular 360° viewer. Loads Pannellum from CDN on demand
 * (the apps already depend on external CDNs for fonts and imagery), so no
 * npm install is required. Falls back to a static image if the CDN fails.
 */

const PANNELLUM_JS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'
const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'

let loadPromise = null
function loadPannellum() {
  if (typeof window !== 'undefined' && window.pannellum) return Promise.resolve()
  if (loadPromise) return loadPromise
  loadPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${PANNELLUM_CSS}"]`)) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = PANNELLUM_CSS
      document.head.appendChild(css)
    }
    const script = document.createElement('script')
    script.src = PANNELLUM_JS
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
  return loadPromise
}

export default function Panorama360({ panorama, autoRotate = -2, className = '' }) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    loadPannellum()
      .then(() => {
        if (cancelled || !containerRef.current || !window.pannellum) return
        if (viewerRef.current) {
          try { viewerRef.current.destroy() } catch (e) { /* noop */ }
          viewerRef.current = null
        }
        viewerRef.current = window.pannellum.viewer(containerRef.current, {
          type: 'equirectangular',
          panorama,
          autoLoad: true,
          autoRotate,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          compass: false,
          friction: 0.15
        })
        viewerRef.current.on('load', () => !cancelled && setStatus('ready'))
        viewerRef.current.on('error', () => !cancelled && setStatus('error'))
      })
      .catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
      if (viewerRef.current) {
        try { viewerRef.current.destroy() } catch (e) { /* noop */ }
        viewerRef.current = null
      }
    }
  }, [panorama, autoRotate])

  return (
    <div className={`relative bg-black ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />

      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80 pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <span className="text-xs tracking-widest uppercase">Cargando 360°…</span>
        </div>
      )}

      {status === 'error' && (
        <img src={panorama} alt="Vista 360°" className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  )
}

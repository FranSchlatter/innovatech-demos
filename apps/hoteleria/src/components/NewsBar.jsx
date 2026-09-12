import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { NEWS_TYPES } from '../data/mockNews'

// Public announcement bar shown at the very top of the landing. Presentational:
// it receives the already-filtered live announcements and a dismiss handler from
// the app (which owns the useNews hook so it can also offset the navbar). When
// several are live it rotates through them, auto-advancing with manual controls.
export const NEWS_BAR_HEIGHT = '2.75rem' // keep in sync with the h-11 band below

export default function NewsBar({ news = [], onDismiss }) {
  const [index, setIndex] = useState(0)

  // Clamp the active index whenever the live set shrinks (e.g. a notice expired
  // or was dismissed) so we never point past the end.
  useEffect(() => {
    if (index > news.length - 1) setIndex(Math.max(0, news.length - 1))
  }, [news.length, index])

  // Auto-advance through multiple announcements.
  useEffect(() => {
    if (news.length <= 1) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % news.length)
    }, 6000)
    return () => clearInterval(t)
  }, [news.length])

  if (news.length === 0) return null

  const safeIndex = Math.min(index, news.length - 1)
  const item = news[safeIndex]
  const cfg = NEWS_TYPES[item.type] || NEWS_TYPES.info
  const Icon = cfg.icon
  const multiple = news.length > 1

  const go = (dir) => setIndex((i) => (i + dir + news.length) % news.length)

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      className={`fixed top-0 inset-x-0 z-[60] h-11 ${cfg.barBg} ${cfg.barText} shadow-md`}
      role="region"
      aria-label="Anuncios del hotel"
    >
      <div className="container h-full flex items-center gap-3">
        <Icon className="w-4 h-4 flex-shrink-0" />

        {/* Rotating message — crossfades between announcements */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-sm truncate"
            >
              <span className="font-semibold">{item.title}</span>
              <span className="opacity-80"> — {item.message}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Carousel controls (only with more than one live notice) */}
        {multiple && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => go(-1)}
              aria-label="Anuncio anterior"
              className="p-1 rounded-md hover:bg-black/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {news.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir al anuncio ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === safeIndex ? 'w-4 bg-current' : 'w-1.5 bg-current opacity-40 hover:opacity-70'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Siguiente anuncio"
              className="p-1 rounded-md hover:bg-black/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dismiss the current announcement for this visitor */}
        <button
          onClick={() => onDismiss?.(item.id)}
          aria-label="Descartar anuncio"
          className="p-1 rounded-md hover:bg-black/10 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Compass, Maximize2, RotateCw } from 'lucide-react'

/**
 * Mock 360° virtual tour. Simulates panning across a wide image with a compass
 * and hotspot dots to convey an immersive tour without a real 360 library.
 */
export default function VirtualTourModal({ open, images = [], title, onClose }) {
  const [pan, setPan] = useState(50)
  const [scene, setScene] = useState(0)
  const tourImages = images.length ? images : []

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex items-center gap-2 text-white">
                <Compass className="w-5 h-5 text-gold" />
                <span className="font-semibold">Tour Virtual 360°</span>
                <span className="hidden sm:inline text-white/60 text-sm">· {title}</span>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 360 viewport */}
            <div className="relative h-[60vh] overflow-hidden cursor-ew-resize">
              <motion.img
                src={tourImages[scene]}
                alt="Vista 360"
                className="absolute top-1/2 -translate-y-1/2 h-full max-w-none"
                style={{ left: `${-pan * 0.6}%`, width: '160%' }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

              {/* Hotspot */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/3 w-8 h-8 rounded-full border-2 border-white/80 flex items-center justify-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </motion.div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <RotateCw className="w-4 h-4 text-white/70" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pan}
                  onChange={(e) => setPan(Number(e.target.value))}
                  className="flex-1 accent-[color:var(--color-gold)]"
                />
                <Maximize2 className="w-4 h-4 text-white/70" />
              </div>
              {/* Scene thumbnails */}
              <div className="flex gap-2 overflow-x-auto">
                {tourImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setScene(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      scene === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Escena ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

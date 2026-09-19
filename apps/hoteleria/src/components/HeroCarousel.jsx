import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star, MapPin, Calendar, Check, Video, ImageIcon } from 'lucide-react'

// Poster / fallback still image (also used on mobile & reduced-motion for performance).
const HERO_POSTER =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop&q=90'

// Pexels stock video "Aerial View Of Beautiful Resort" (Tom Fisk) — direct .mp4, no hotlink protection.
// A small quality ladder so we don't ship 1080p to a 768px tablet.
const HERO_VIDEO = {
  hd: 'https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4',
  md: 'https://videos.pexels.com/video-files/2169880/2169880-hd_1280_720_30fps.mp4',
}

const MODE_KEY = 'hotel-hero-mode' // 'video' | 'image'

export default function HeroCarousel() {
  const videoRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO.hd)
  // Lazy init from localStorage; respect reduced-motion when the user hasn't chosen yet.
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'video'
    const saved = window.localStorage.getItem(MODE_KEY)
    if (saved === 'video' || saved === 'image') return saved
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'image' : 'video'
  })

  // Track viewport + motion preference reactively.
  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqWide = window.matchMedia('(min-width: 1280px)')

    const sync = () => {
      setIsMobile(mqMobile.matches)
      setReducedMotion(mqMotion.matches)
      setVideoSrc(mqWide.matches ? HERO_VIDEO.hd : HERO_VIDEO.md)
    }
    sync()

    mqMobile.addEventListener('change', sync)
    mqMotion.addEventListener('change', sync)
    mqWide.addEventListener('change', sync)
    return () => {
      mqMobile.removeEventListener('change', sync)
      mqMotion.removeEventListener('change', sync)
      mqWide.removeEventListener('change', sync)
    }
  }, [])

  const showVideo = mode === 'video' && !isMobile && !reducedMotion && !videoError

  // Kick off / pause playback as visibility of the video changes.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (showVideo) {
      // Muted autoplay is allowed everywhere; still guard the promise so a rejection
      // (rare, e.g. aggressive power-saving) falls back to the poster instead of a frozen frame.
      const p = el.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => setVideoError(true))
      }
    } else {
      el.pause()
    }
  }, [showVideo, videoSrc])

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'video' ? 'image' : 'video'
      try {
        window.localStorage.setItem(MODE_KEY, next)
      } catch {
        /* ignore private-mode storage errors */
      }
      if (next === 'video') setVideoError(false) // let the user retry after an error
      return next
    })
  }

  const handleBookNow = () => {
    document.getElementById('accommodation')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleExplore = () => {
    document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' })
  }

  const features = [
    '5-Star Luxury Resort',
    'Oceanfront Property',
    '24/7 Concierge Service',
    'Award-Winning Spa'
  ]

  // The video toggle only makes sense where a video can actually play.
  const canToggle = !isMobile && !reducedMotion && !videoError

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black" id="hero">
      {/* Background media (parallax zoom on mount) */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        {/* Poster / fallback image — always rendered underneath the video so there is
            never an empty frame while the video buffers, on mobile, or on error. */}
        <img
          src={HERO_POSTER}
          alt="Luxury Resort"
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Background video, fades in over the poster once it can play. */}
        {!isMobile && !reducedMotion && !videoError && (
          <video
            ref={videoRef}
            key={videoSrc}
            src={videoSrc}
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              showVideo && videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </motion.div>

      {/* Content Container */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full mb-6"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">Luxury Hospitality</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Experience
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400">
              Timeless Elegance
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
          >
            Immerse yourself in unparalleled luxury where every detail is crafted
            to create unforgettable memories. Your sanctuary awaits.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 gap-3 mb-10 max-w-xl"
          >
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/90">
                <Check className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={handleBookNow}
              className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Your Stay
            </button>
            <button
              onClick={handleExplore}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Explore Amenities
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating Stats */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[140px]">
          <div className="text-3xl font-bold text-white mb-1">250+</div>
          <div className="text-sm text-gray-300">Luxury Rooms</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[140px]">
          <div className="text-3xl font-bold text-white mb-1">4.9★</div>
          <div className="text-sm text-gray-300">Guest Rating</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[140px]">
          <div className="text-3xl font-bold text-white mb-1">50+</div>
          <div className="text-sm text-gray-300">Years Legacy</div>
        </div>
      </motion.div>

      {/* Video / Photo toggle — only where a video can actually play */}
      <AnimatePresence>
        {canToggle && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            onClick={toggleMode}
            aria-pressed={mode === 'video'}
            aria-label={mode === 'video' ? 'Switch to still photo background' : 'Switch to video background'}
            className="absolute bottom-8 right-8 z-10 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
          >
            {mode === 'video' ? (
              <>
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Photo</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Video</span>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
      >
        <span className="text-sm tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </div>
  )
}

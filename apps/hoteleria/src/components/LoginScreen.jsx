import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'

// Simulated login for the guest portal demo. Any credentials are accepted.
export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    // Simulated auth delay for realism
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 500)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&h=1200&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="bg-surface rounded-3xl shadow-soft border border-border overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Guest Portal</h1>
            <p className="text-sm text-muted">Sign in to manage your stay</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            <div>
              <label className="text-sm text-muted mb-2 block">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted mb-2 block">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-bg rounded-xl border-2 border-border focus:border-accent outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Social login (disabled placeholders) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                title="Coming soon"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-border bg-bg text-muted opacity-60 cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                  <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                  <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.4 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z" />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                disabled
                title="Coming soon"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-border bg-bg text-muted opacity-60 cursor-not-allowed"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16.36 12.9c-.02-2.03 1.66-3.01 1.74-3.06-.95-1.39-2.42-1.58-2.94-1.6-1.25-.13-2.44.74-3.08.74-.63 0-1.61-.72-2.65-.7-1.36.02-2.62.79-3.32 2.01-1.42 2.46-.36 6.1 1.02 8.1.67.98 1.47 2.08 2.52 2.04 1.01-.04 1.39-.65 2.62-.65 1.22 0 1.57.65 2.64.63 1.09-.02 1.78-1 2.45-1.98.77-1.13 1.09-2.23 1.11-2.29-.02-.01-2.13-.82-2.15-3.25ZM14.4 6.9c.56-.68.94-1.63.83-2.57-.81.03-1.79.54-2.37 1.22-.52.6-.97 1.56-.85 2.48.9.07 1.83-.46 2.39-1.13Z" />
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>

            {/* Demo hint */}
            <p className="text-xs text-muted text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo mode — any credentials work
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

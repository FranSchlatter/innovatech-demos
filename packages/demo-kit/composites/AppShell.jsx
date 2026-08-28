import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowLeft, PlayCircle } from 'lucide-react'
import { HexMark, Hexes } from './Hexes'
import { ThemeToggle, CurrencyToggle, LanguageToggle, ResetButton } from './controls'
import { useDemo } from '../providers/DemoProvider'
const cx = (...c) => c.filter(Boolean).join(' ')

/**
 * InnovaTech management shell (sidebar + topbar + content). Wrap in a
 * `theme-innovatech` scope. nav: [{ id, label, icon }].
 */
export function AppShell({ brand = 'InnovaTech', subtitle, mark = 'i', nav = [], active, onNavigate, onExit, onStartTour, children, topbarRight }) {
  const [open, setOpen] = useState(false)
  const { isDark } = useDemo()

  const SideContent = (
    <>
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-border">
        <HexMark size={34}>{mark}</HexMark>
        <div className="min-w-0">
          <p className="font-extrabold text-heading text-sm leading-tight truncate">{brand}</p>
          {subtitle && <p className="text-[11px] text-muted truncate">{subtitle}</p>}
        </div>
      </div>
      <nav className="p-3 space-y-1">
        {nav.map((item) => (
          <button key={item.id} onClick={() => { onNavigate?.(item.id); setOpen(false) }}
            className={cx('w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition',
              active === item.id ? 'bg-primary-weak text-primary' : 'text-muted hover:text-text hover:bg-surface-2')}>
            {item.icon && <item.icon size={18} />}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto p-3 border-t border-border space-y-2">
        {onStartTour && (
          <button onClick={() => { onStartTour(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm font-semibold bg-primary text-primary-contrast">
            <PlayCircle size={17} /> Ver recorrido guiado
          </button>
        )}
        {onExit && (
          <button onClick={onExit} className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-muted hover:text-text">
            <ArrowLeft size={16} /> Volver al sitio
          </button>
        )}
        <ResetButton className="px-3 py-1" />
      </div>
    </>
  )

  return (
    <div className="theme-innovatech min-h-screen bg-background text-text flex" data-mode={isDark ? 'dark' : 'light'}>
      {/* Desktop sidebar */}
      <aside className="relative hidden md:flex flex-col w-64 bg-surface border-r border-border">
        <Hexes count={5} opacity={0.05} />
        <div className="relative flex flex-col flex-1">{SideContent}</div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <motion.aside className="absolute left-0 top-0 bottom-0 w-72 bg-surface border-r border-border flex flex-col"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.25 }}>
              {SideContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-surface flex items-center gap-3 px-4 sticky top-0 z-30">
          <button className="md:hidden text-muted" onClick={() => setOpen(true)}><Menu size={22} /></button>
          <div className="flex-1" />
          {topbarRight}
          <div className="hidden sm:flex items-center gap-2"><LanguageToggle /><CurrencyToggle /></div>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

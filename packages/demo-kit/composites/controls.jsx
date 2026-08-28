import { Moon, Sun, RotateCcw, Globe, Coins } from 'lucide-react'
import { useDemo } from '../providers/DemoProvider'
import { MARKETS } from '../providers/markets'
const cx = (...c) => c.filter(Boolean).join(' ')

export function ThemeToggle({ className }) {
  const { isDark, toggleMode } = useDemo()
  return (
    <button onClick={toggleMode} aria-label="Cambiar tema"
      className={cx('grid place-items-center w-9 h-9 rounded-sm border border-border text-muted hover:text-primary hover:border-primary transition', className)}>
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}

export function CurrencyToggle({ className }) {
  const { currency, setCurrency, market } = useDemo()
  if (market.currencies.length < 2) {
    return <span className={cx('inline-flex items-center gap-1 text-sm text-muted', className)}><Coins size={14} />{currency}</span>
  }
  return (
    <div className={cx('inline-flex rounded-sm border border-border overflow-hidden', className)}>
      {market.currencies.map((c) => (
        <button key={c} onClick={() => setCurrency(c)}
          className={cx('px-2.5 py-1 text-xs font-semibold transition', currency === c ? 'bg-primary text-primary-contrast' : 'text-muted hover:text-text')}>
          {c}
        </button>
      ))}
    </div>
  )
}

export function LanguageToggle({ className }) {
  const { lang, setLang } = useDemo()
  const langs = [{ id: 'es', label: 'ES' }, { id: 'en', label: 'EN' }, { id: 'pt', label: 'PT' }]
  return (
    <div className={cx('inline-flex items-center gap-1', className)}>
      <Globe size={14} className="text-muted" />
      {langs.map((l) => (
        <button key={l.id} onClick={() => setLang(l.id)}
          className={cx('px-1.5 py-0.5 text-xs font-semibold rounded transition', lang === l.id ? 'text-primary' : 'text-muted hover:text-text')}>
          {l.label}
        </button>
      ))}
    </div>
  )
}

export function MarketToggle({ className }) {
  const { marketCode, setMarket } = useDemo()
  return (
    <select value={marketCode} onChange={(e) => setMarket(e.target.value)}
      className={cx('bg-surface border border-border rounded-sm text-xs text-text px-2 py-1.5 cursor-pointer', className)}>
      {Object.values(MARKETS).map((m) => <option key={m.code} value={m.code}>{m.code} · {m.name}</option>)}
    </select>
  )
}

export function ResetButton({ className, compact }) {
  const { reset } = useDemo()
  return (
    <button onClick={reset}
      className={cx('inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-danger transition', className)}>
      <RotateCcw size={14} />{!compact && 'Reiniciar demo'}
    </button>
  )
}

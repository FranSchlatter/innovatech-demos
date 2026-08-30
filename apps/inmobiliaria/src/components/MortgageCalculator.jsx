import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp } from 'lucide-react'

const TERM_OPTIONS = [5, 10, 15, 20, 30]

// Format a plain number with Argentine grouping + currency prefix
function formatMoney(value, currency) {
  const symbol = currency === 'USD' ? 'USD ' : '$'
  const rounded = Number.isFinite(value) ? Math.round(value) : 0
  return `${symbol}${new Intl.NumberFormat('es-AR').format(rounded)}`
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState(180000)
  const [currency, setCurrency] = useState('USD')
  const [downPct, setDownPct] = useState(20)
  const [years, setYears] = useState(20)
  const [rate, setRate] = useState(8)

  const result = useMemo(() => {
    const safePrice = Number(price) || 0
    const downAmount = (safePrice * downPct) / 100
    const loan = safePrice - downAmount
    const r = Number(rate) / 100 / 12
    const n = Number(years) * 12
    let monthly
    if (r === 0) {
      monthly = n > 0 ? loan / n : 0
    } else {
      const factor = Math.pow(1 + r, n)
      monthly = (loan * r * factor) / (factor - 1)
    }
    const totalPay = monthly * n
    const totalInterest = totalPay - loan
    const capitalPct = totalPay > 0 ? (loan / totalPay) * 100 : 0
    return { downAmount, loan, monthly, totalPay, totalInterest, capitalPct }
  }, [price, downPct, years, rate])

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <hr className="rl-rule rl-rule--gold w-14" />
          <h2 className="rl-display text-primary mt-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>Simulá tu crédito hipotecario</h2>
          <p className="text-muted mt-4">
            Estimá tu cuota mensual, el monto del crédito y los intereses totales según el
            anticipo, el plazo y la tasa. Ajustá los valores y mirá el resultado en tiempo real.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* LEFT — Controls */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-surface border border-border rounded-2xl p-6 space-y-7"
          >
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Precio de la propiedad
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">
                    {currency === 'USD' ? 'USD' : '$'}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-12 pr-3 py-2.5 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {['USD', 'ARS'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`px-4 text-sm font-semibold transition-colors ${
                        currency === c
                          ? 'bg-primary text-primary-contrast'
                          : 'bg-surface text-muted hover:bg-surface-alt'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Down payment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-text">Anticipo</label>
                <span className="text-sm text-muted">
                  <span className="font-semibold text-accent">{downPct}%</span> ·{' '}
                  {formatMoney(result.downAmount, currency)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                step={1}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="w-full accent-[color:var(--color-accent)]"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>0%</span>
                <span>80%</span>
              </div>
            </div>

            {/* Term */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Plazo</label>
              <select
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {TERM_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t} años
                  </option>
                ))}
              </select>
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Tasa anual (%)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </motion.div>

          {/* RIGHT — Result panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-primary text-primary-contrast rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-2 text-gold text-sm font-semibold mb-6">
              <TrendingUp className="w-4 h-4" /> Resultado de tu simulación
            </div>

            <p className="text-sm text-primary-contrast/70 mb-1">Cuota mensual estimada</p>
            <motion.div
              key={Math.round(result.monthly)}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gold-gradient mb-8"
            >
              {formatMoney(result.monthly, currency)}
            </motion.div>

            {/* Rows */}
            <div className="space-y-3 mb-8">
              {[
                ['Monto del crédito', result.loan],
                ['Total a pagar', result.totalPay],
                ['Intereses totales', result.totalInterest],
                ['Anticipo', result.downAmount]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                >
                  <span className="text-sm text-primary-contrast/70">{label}</span>
                  <span className="text-sm font-semibold">{formatMoney(value, currency)}</span>
                </div>
              ))}
            </div>

            {/* Capital vs interest split bar */}
            <div className="mb-2">
              <div className="flex h-3 rounded-full overflow-hidden bg-white/10">
                <div
                  className="bg-gold transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, result.capitalPct))}%` }}
                />
                <div
                  className="bg-white/30 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, 100 - result.capitalPct))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-primary-contrast/70 mt-3">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-gold" /> Capital (
                  {Math.round(result.capitalPct)}%)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-white/30" /> Interés (
                  {Math.round(100 - result.capitalPct)}%)
                </span>
              </div>
            </div>

            <p className="text-xs text-primary-contrast/50 mt-8">
              Simulación orientativa. No constituye una oferta de crédito.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

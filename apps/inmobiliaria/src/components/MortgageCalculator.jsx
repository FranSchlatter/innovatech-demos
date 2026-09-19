import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, animate, useMotionValue } from 'framer-motion'
import {
  Calculator, TrendingUp, Landmark, LineChart, Table2, Wallet, FileCheck2,
  Info, Check, X, Award
} from 'lucide-react'
import {
  BANKS, UVA_VALUE, UVA_DATE, UVA_HISTORY, UVA_YOY, UVA_REFERENCE_TNA,
  DOC_REQUIREMENTS, AFFORDABILITY_RATIOS,
  frenchMonthly, teaFromTna, maxLoanFromCuota, amortization, amortizationByYear
} from '../data/mockMortgage'

const TERM_OPTIONS = [5, 10, 15, 20, 30]

// Format a plain number with Argentine grouping + currency prefix.
function formatMoney(value, currency) {
  const symbol = currency === 'USD' ? 'USD ' : '$'
  const rounded = Number.isFinite(value) ? Math.round(value) : 0
  return `${symbol}${new Intl.NumberFormat('es-AR').format(rounded)}`
}

// Format the UVA index value (currency-agnostic, 2 decimals).
function formatUva(value) {
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

// -------------------------------------------------------------------------
// Animated number — counts up to `value` whenever it changes.
// -------------------------------------------------------------------------
function AnimatedNumber({ value, format, formatKey }) {
  const mv = useMotionValue(value)
  const fmtRef = useRef(format)
  fmtRef.current = format
  const [display, setDisplay] = useState(() => format(value))

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(fmtRef.current(v))
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Currency/format switch with no value change — reformat the current amount.
  useEffect(() => {
    setDisplay(fmtRef.current(mv.get()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatKey])

  return <>{display}</>
}

// -------------------------------------------------------------------------
// Donut — capital vs interest split (rendered inside the dark result panel).
// -------------------------------------------------------------------------
function CapitalDonut({ capitalPct }) {
  const R = 48
  const C = 2 * Math.PI * R
  const pct = Math.max(0, Math.min(100, capitalPct))
  const capitalLen = (pct / 100) * C

  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90 text-primary-contrast">
        {/* Track uses currentColor so it reads on both the dark and light primary panel */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="14" />
        <motion.circle
          cx="60" cy="60" r={R} fill="none"
          stroke="var(--color-gold)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C - capitalLen }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gold-gradient leading-none">{Math.round(pct)}%</span>
        <span className="text-[0.65rem] text-primary-contrast opacity-60 mt-1">capital</span>
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------
// TAB: Bank comparison
// -------------------------------------------------------------------------
function BanksPanel({ loan, years, currency }) {
  const rows = useMemo(() => {
    return BANKS.map((b) => {
      const termYears = Math.min(years, b.maxYears)
      const monthly = frenchMonthly(loan, b.tna, termYears)
      return { ...b, termYears, monthly, tea: teaFromTna(b.tna), capped: termYears < years }
    }).sort((a, b) => a.monthly - b.monthly)
  }, [loan, years])

  const best = rows[0]?.id

  return (
    <div>
      <p className="text-sm text-muted mb-5">
        Cuota estimada de cada banco para un crédito de{' '}
        <span className="font-semibold text-text">{formatMoney(loan, currency)}</span> a{' '}
        <span className="font-semibold text-text">{years} años</span>. Todas las líneas son ajustables por UVA.
      </p>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-alt text-left text-muted">
              <th className="py-3 px-4 font-semibold">Banco</th>
              <th className="py-3 px-3 font-semibold">Tipo</th>
              <th className="py-3 px-3 font-semibold text-right">TNA</th>
              <th className="py-3 px-3 font-semibold text-right">TEA</th>
              <th className="py-3 px-3 font-semibold text-right">Financia</th>
              <th className="py-3 px-3 font-semibold text-right">Plazo máx.</th>
              <th className="py-3 px-4 font-semibold text-right">Cuota mensual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr
                key={b.id}
                className={`border-t border-border align-top ${b.id === best ? 'bg-surface-alt' : ''}`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                    <div>
                      <div className="font-semibold text-text flex items-center gap-2">
                        {b.name}
                        {b.id === best && (
                          <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-accent text-primary-contrast">
                            <Award className="w-3 h-3" /> Mejor cuota
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted mt-0.5">{b.highlight}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-muted">{b.type}</td>
                <td className="py-3 px-3 text-right tabular-nums text-text">{b.tna.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right tabular-nums text-muted">{b.tea.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right tabular-nums text-text">{b.ltv}%</td>
                <td className="py-3 px-3 text-right tabular-nums text-text">
                  {b.maxYears} años
                  {b.capped && <div className="text-[0.65rem] text-warning">calc. a {b.termYears}</div>}
                </td>
                <td className="py-3 px-4 text-right font-bold tabular-nums text-text">
                  {formatMoney(b.monthly, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {rows.map((b) => (
          <div
            key={b.id}
            className={`rounded-xl border p-4 ${b.id === best ? 'border-accent bg-surface-alt' : 'border-border bg-surface'}`}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                <span className="font-semibold text-text truncate">{b.name}</span>
              </div>
              {b.id === best && (
                <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-accent text-primary-contrast shrink-0">
                  <Award className="w-3 h-3" /> Mejor
                </span>
              )}
            </div>
            <div className="text-lg font-bold text-text mb-2">{formatMoney(b.monthly, currency)}<span className="text-xs font-normal text-muted">/mes</span></div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div><div className="text-muted">TNA</div><div className="font-semibold text-text">{b.tna.toFixed(1)}%</div></div>
              <div><div className="text-muted">TEA</div><div className="font-semibold text-text">{b.tea.toFixed(1)}%</div></div>
              <div><div className="text-muted">Financia</div><div className="font-semibold text-text">{b.ltv}%</div></div>
              <div><div className="text-muted">Plazo</div><div className="font-semibold text-text">{b.maxYears}a</div></div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted mt-4 flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        Tasas de referencia orientativas. La cuota de un crédito UVA se ajusta mensualmente por inflación.
      </p>
    </div>
  )
}

// -------------------------------------------------------------------------
// TAB: UVA vs fixed-rate
// -------------------------------------------------------------------------
function UvaPanel({ loan, years, currency }) {
  const [inflation, setInflation] = useState(25)

  const model = useMemo(() => {
    const n = Math.round(years * 12)
    const i = Math.pow(1 + inflation / 100, 1 / 12) - 1 // monthly inflation

    // UVA line: real rate. Instalment is flat in UVAs → flat in today's pesos,
    // but grows with inflation in nominal (current) pesos.
    const uvaBase = frenchMonthly(loan, UVA_REFERENCE_TNA, years)
    const uvaFinalNominal = uvaBase * Math.pow(1 + i, n - 1)
    const uvaRealTotal = uvaBase * n
    let uvaNominalTotal = 0
    for (let k = 0; k < n; k++) uvaNominalTotal += uvaBase * Math.pow(1 + i, k)

    // Fixed line: bank prices inflation + a risk margin, instalment stays flat
    // in nominal pesos → shrinks fast in today's pesos.
    const fixedTna = UVA_REFERENCE_TNA + inflation + 5
    const fixedMonthly = frenchMonthly(loan, fixedTna, years)
    const fixedNominalTotal = fixedMonthly * n
    const annuityPv = i > 0 ? (1 - Math.pow(1 + i, -n)) / i : n
    const fixedRealTotal = fixedMonthly * annuityPv

    // Year (approx) when the UVA instalment overtakes the fixed one.
    const crossYear = fixedMonthly > uvaBase && i > 0
      ? Math.log(fixedMonthly / uvaBase) / Math.log(1 + i) / 12
      : 0

    // Real-value instalment trajectory (today's pesos) at yearly checkpoints.
    const checkpoints = [1, 5, 10, 15, 20, 25, 30].filter((y) => y <= years)
    const traj = checkpoints.map((y) => ({
      y,
      uva: uvaBase, // constant in today's pesos
      fixed: fixedMonthly / Math.pow(1 + i, y * 12)
    }))
    const trajMax = fixedMonthly || 1

    const totalMax = Math.max(uvaRealTotal, fixedRealTotal) || 1
    return {
      uvaBase, uvaFinalNominal, uvaRealTotal, uvaNominalTotal,
      fixedTna, fixedMonthly, fixedRealTotal, fixedNominalTotal,
      crossYear, ratio: uvaBase > 0 ? fixedMonthly / uvaBase : 0,
      traj, trajMax,
      uvaWidth: (uvaRealTotal / totalMax) * 100, fixedWidth: (fixedRealTotal / totalMax) * 100,
      uvaCheaper: uvaRealTotal <= fixedRealTotal
    }
  }, [loan, years, inflation])

  const histMax = Math.max(...UVA_HISTORY.map((h) => h.value))
  const histMin = Math.min(...UVA_HISTORY.map((h) => h.value))

  return (
    <div className="space-y-7">
      {/* Inflation assumption */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-text">Inflación anual estimada</label>
          <span className="text-sm font-semibold text-accent">{inflation}%</span>
        </div>
        <input
          type="range" min={10} max={60} step={1} value={inflation}
          onChange={(e) => setInflation(Number(e.target.value))}
          className="w-full accent-[color:var(--color-accent)]"
        />
        <div className="flex justify-between text-xs text-muted mt-1"><span>10%</span><span>60%</span></div>
      </div>

      {/* Two scenarios side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-accent bg-surface-alt p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-sm font-semibold text-text">Crédito UVA</span>
            <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-accent text-primary-contrast">Cuota más accesible</span>
          </div>
          <p className="text-xs text-muted mb-1">Cuota inicial · TNA {UVA_REFERENCE_TNA}%</p>
          <p className="text-2xl font-bold text-text">{formatMoney(model.uvaBase, currency)}</p>
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted">Ingreso necesario</span><span className="font-semibold text-text">{formatMoney(model.uvaBase / 0.25, currency)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Cuota final (pesos corrientes)</span><span className="font-semibold text-text">{formatMoney(model.uvaFinalNominal, currency)}</span></div>
          </div>
          <p className="text-xs text-muted mt-3">Cuota baja al inicio; sube con la inflación mes a mes.</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-sm font-semibold text-text">Tasa fija tradicional</span>
            <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-contrast">Cuota predecible</span>
          </div>
          <p className="text-xs text-muted mb-1">Cuota fija · TNA {model.fixedTna.toFixed(0)}%</p>
          <p className="text-2xl font-bold text-text">{formatMoney(model.fixedMonthly, currency)}</p>
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted">Ingreso necesario</span><span className="font-semibold text-text">{formatMoney(model.fixedMonthly / 0.25, currency)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Cuota final (pesos corrientes)</span><span className="font-semibold text-text">{formatMoney(model.fixedMonthly, currency)}</span></div>
          </div>
          <p className="text-xs text-muted mt-3">Cuota alta y constante; se licúa con la inflación.</p>
        </div>
      </div>

      {/* Crossover callout */}
      {model.crossYear > 0 && (
        <div className="rounded-xl border border-border bg-surface-alt p-4 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-info shrink-0 mt-0.5" />
          <p className="text-sm text-text">
            La cuota UVA arranca <span className="font-semibold">{model.ratio.toFixed(1)}× más baja</span> que la fija.
            Recién en el <span className="font-semibold">año {Math.ceil(model.crossYear)}</span> la iguala,
            y desde ahí la supera en pesos corrientes.
          </p>
        </div>
      )}

      {/* Instalment trajectory in today's pesos */}
      <div className="rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-text mb-1">Cuota en pesos de hoy</p>
        <p className="text-xs text-muted mb-4">Ajustada por inflación: la UVA se mantiene estable, la fija se licúa.</p>
        <div className="flex items-end gap-3 h-40">
          {model.traj.map((t) => (
            <div key={t.y} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <motion.div
                  className="w-1/2 rounded-t"
                  style={{ background: 'var(--color-accent)' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(2, (t.uva / model.trajMax) * 100)}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  title={`UVA año ${t.y}: ${formatMoney(t.uva, currency)}`}
                />
                <motion.div
                  className="w-1/2 rounded-t"
                  style={{ background: 'var(--color-muted)' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(2, (t.fixed / model.trajMax) * 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  title={`Fija año ${t.y}: ${formatMoney(t.fixed, currency)}`}
                />
              </div>
              <span className="text-[0.6rem] text-muted mt-1.5">Año {t.y}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: 'var(--color-accent)' }} /> UVA</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: 'var(--color-muted)' }} /> Tasa fija</span>
        </div>
      </div>

      {/* Real total cost comparison */}
      <div>
        <p className="text-sm font-semibold text-text mb-1">Costo total en pesos de hoy</p>
        <p className="text-xs text-muted mb-3">Suma de todas las cuotas descontadas por inflación (valor presente).</p>
        <div className="space-y-3">
          {[
            { label: 'UVA', value: model.uvaRealTotal, width: model.uvaWidth, win: model.uvaCheaper },
            { label: 'Tasa fija', value: model.fixedRealTotal, width: model.fixedWidth, win: !model.uvaCheaper }
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted">{row.label}</span>
                <span className={`font-semibold ${row.win ? 'text-success' : 'text-text'}`}>{formatMoney(row.value, currency)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-bg overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: row.win ? 'var(--color-success)' : 'var(--color-accent)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.width}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          En pesos corrientes el total nominal difiere mucho por la inflación (UVA {formatMoney(model.uvaNominalTotal, currency)} vs.
          fija {formatMoney(model.fixedNominalTotal, currency)}). La ventaja real del UVA es la accesibilidad: su cuota inicial es mucho más baja.
        </p>
      </div>

      {/* UVA historical evolution */}
      <div className="rounded-xl border border-border p-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-text">Evolución de la UVA</p>
            <p className="text-xs text-muted">Últimos 12 meses · +{UVA_YOY}% interanual</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-accent leading-none">{formatUva(UVA_VALUE)}</p>
            <p className="text-[0.65rem] text-muted mt-1">valor al {new Date(`${UVA_DATE}T12:00:00`).toLocaleDateString('es-AR')}</p>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-32">
          {UVA_HISTORY.map((h, i) => {
            const height = 20 + ((h.value - histMin) / (histMax - histMin || 1)) * 80
            return (
              <div key={h.label} className="flex-1 flex flex-col items-center justify-end h-full group">
                <span className="text-[0.6rem] text-muted mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatUva(h.value)}
                </span>
                <motion.div
                  className="w-full rounded-t"
                  style={{ background: i === UVA_HISTORY.length - 1 ? 'var(--color-accent)' : 'var(--color-border)' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="text-[0.55rem] text-muted mt-1.5 whitespace-nowrap">{h.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------
// TAB: Amortization schedule
// -------------------------------------------------------------------------
function SchedulePanel({ loan, rate, years, currency }) {
  const [byYear, setByYear] = useState(false)

  const monthlyRows = useMemo(() => amortization(loan, rate, years, 12), [loan, rate, years])
  const yearRows = useMemo(() => amortizationByYear(loan, rate, years), [loan, rate, years])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-muted">
          {byYear ? 'Resumen anual del crédito' : 'Primeros 12 meses'} · tasa {Number(rate).toFixed(1)}% · {years} años
        </p>
        <div className="flex rounded-lg border border-border overflow-hidden text-sm">
          {[['Mensual', false], ['Anual', true]].map(([label, val]) => (
            <button
              key={label}
              type="button"
              onClick={() => setByYear(val)}
              className={`px-3 py-1.5 font-medium transition-colors ${
                byYear === val ? 'bg-primary text-primary-contrast' : 'bg-surface text-muted hover:bg-surface-alt'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-alt text-left text-muted">
              <th className="py-2.5 px-4 font-semibold">{byYear ? 'Año' : 'Mes'}</th>
              <th className="py-2.5 px-3 font-semibold text-right">{byYear ? 'Cuotas' : 'Cuota'}</th>
              <th className="py-2.5 px-3 font-semibold text-right">Capital</th>
              <th className="py-2.5 px-3 font-semibold text-right">Interés</th>
              <th className="py-2.5 px-4 font-semibold text-right">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {byYear
              ? yearRows.map((r) => (
                  <tr key={r.year} className="border-t border-border">
                    <td className="py-2.5 px-4 text-text">Año {r.year}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-muted">12</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-text">{formatMoney(r.principal, currency)}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-warning">{formatMoney(r.interest, currency)}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-text">{formatMoney(r.balance, currency)}</td>
                  </tr>
                ))
              : monthlyRows.map((r) => (
                  <tr key={r.month} className="border-t border-border">
                    <td className="py-2.5 px-4 text-text">{r.month}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-text">{formatMoney(r.payment, currency)}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-text">{formatMoney(r.principal, currency)}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-warning">{formatMoney(r.interest, currency)}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-text">{formatMoney(r.balance, currency)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted mt-4 flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        Sistema francés: la cuota es constante en UVA, pero al inicio pagás más interés y menos capital.
      </p>
    </div>
  )
}

// -------------------------------------------------------------------------
// TAB: Borrowing capacity
// -------------------------------------------------------------------------
function CapacityPanel({ loan, rate, years, monthly, currency }) {
  const [income, setIncome] = useState('')
  const [ratio, setRatio] = useState(25)

  const incomeNum = Number(income) || 0
  const minIncome = monthly / (ratio / 100) // income needed for the current loan's instalment
  const maxCredit = incomeNum > 0 ? maxLoanFromCuota(incomeNum * (ratio / 100), rate, years) : 0
  const usedPct = incomeNum > 0 ? Math.min(200, (monthly / incomeNum) * 100) : 0
  const qualifies = incomeNum > 0 && monthly <= incomeNum * (ratio / 100)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Tu ingreso mensual neto</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">
              {currency === 'USD' ? 'USD' : '$'}
            </span>
            <input
              type="number" min={0} value={income}
              onChange={(e) => setIncome(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ingresá tu ingreso"
              className="w-full pl-12 pr-3 py-2.5 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <p className="text-xs text-muted mt-1.5">Sumá los ingresos del grupo familiar / cotitulares.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Relación cuota-ingreso</label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {AFFORDABILITY_RATIOS.map((r) => (
              <button
                key={r.pct}
                type="button"
                onClick={() => setRatio(r.pct)}
                className={`flex-1 px-2 py-2.5 text-xs font-semibold transition-colors ${
                  ratio === r.pct ? 'bg-primary text-primary-contrast' : 'bg-surface text-muted hover:bg-surface-alt'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-1.5">La cuota no debería superar este % de tu ingreso.</p>
        </div>
      </div>

      {/* Max credit accessible */}
      <div className="rounded-xl border border-accent bg-surface-alt p-5">
        <p className="text-sm text-muted mb-1">Con ese ingreso podés acceder a un crédito de hasta</p>
        <p className="text-3xl font-bold text-accent">
          {incomeNum > 0 ? formatMoney(maxCredit, currency) : '—'}
        </p>
        <p className="text-xs text-muted mt-2">
          A {years} años y {Number(rate).toFixed(1)}% de TNA, con cuota máxima de {formatMoney(incomeNum * (ratio / 100), currency)}.
        </p>
      </div>

      {/* Affordability check for the current loan */}
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-sm font-semibold text-text">Tu crédito actual ({formatMoney(loan, currency)})</p>
          {incomeNum > 0 && (
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
              qualifies ? 'bg-success text-white' : 'bg-error text-white'
            }`}>
              {qualifies ? <><Check className="w-3.5 h-3.5" /> Calificás</> : <><X className="w-3.5 h-3.5" /> Ingreso insuficiente</>}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted">Cuota mensual</span>
          <span className="font-semibold text-text">{formatMoney(monthly, currency)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-muted">Ingreso mínimo requerido</span>
          <span className="font-semibold text-text">{formatMoney(minIncome, currency)}</span>
        </div>
        {incomeNum > 0 && (
          <>
            <div className="h-2.5 rounded-full bg-bg overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: qualifies ? 'var(--color-success)' : 'var(--color-error)' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, usedPct)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              La cuota representa el <span className="font-semibold text-text">{Math.round(usedPct)}%</span> de tu ingreso
              {' '}(límite {ratio}%).
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------
// TAB: Requirements & documentation
// -------------------------------------------------------------------------
function DocsPanel() {
  return (
    <div>
      <p className="text-sm text-muted mb-5">
        Documentación habitual para iniciar el trámite. Cada banco puede pedir requisitos adicionales.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {DOC_REQUIREMENTS.map((section) => (
          <div key={section.group} className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 className="w-4 h-4 text-accent" />
              <h4 className="text-sm font-semibold text-text">{section.group}</h4>
            </div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-border bg-surface-alt p-4 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-info shrink-0 mt-0.5" />
        <p className="text-xs text-muted">
          El banco realiza la tasación del inmueble y evalúa la relación cuota-ingreso antes de aprobar.
          Nuestro equipo te acompaña en la reunión de documentación y la escrituración.
        </p>
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------
// Main component
// -------------------------------------------------------------------------
const TABS = [
  { id: 'banks', label: 'Comparar bancos', icon: Landmark },
  { id: 'uva', label: 'UVA vs. fija', icon: LineChart },
  { id: 'schedule', label: 'Amortización', icon: Table2 },
  { id: 'capacity', label: '¿Cuánto puedo pedir?', icon: Wallet },
  { id: 'docs', label: 'Requisitos', icon: FileCheck2 }
]

export default function MortgageCalculator() {
  const [price, setPrice] = useState(180000)
  const [currency, setCurrency] = useState('USD')
  const [downPct, setDownPct] = useState(20)
  const [years, setYears] = useState(20)
  const [rate, setRate] = useState(8)
  const [tab, setTab] = useState('banks')

  const result = useMemo(() => {
    const safePrice = Number(price) || 0
    const downAmount = (safePrice * downPct) / 100
    const loan = safePrice - downAmount
    const monthly = frenchMonthly(loan, rate, years)
    const totalPay = monthly * Math.round(years * 12)
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
            Estimá tu cuota mensual, compará bancos, mirá el impacto de la UVA y descubrí cuánto podés
            pedir. Ajustá los valores y todo se recalcula en tiempo real.
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
            <div className="flex items-center gap-2 text-accent text-sm font-semibold">
              <Calculator className="w-4 h-4" /> Datos del crédito
            </div>

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
                Tasa anual (TNA %)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-xs text-muted mt-1.5">TEA equivalente: {teaFromTna(Number(rate) || 0).toFixed(1)}%</p>
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

            <div className="flex items-center gap-6 mb-8">
              <div className="min-w-0">
                <p className="text-sm text-primary-contrast opacity-70 mb-1">Cuota mensual estimada</p>
                <div className="text-4xl md:text-5xl font-bold text-gold-gradient">
                  <AnimatedNumber
                    value={result.monthly}
                    format={(v) => formatMoney(v, currency)}
                    formatKey={currency}
                  />
                </div>
              </div>
              <CapitalDonut capitalPct={result.capitalPct} />
            </div>

            {/* Rows */}
            <div className="space-y-3 mb-8">
              {[
                ['Monto del crédito', result.loan],
                ['Total a pagar', result.totalPay],
                ['Intereses totales', result.totalInterest],
                ['Anticipo', result.downAmount]
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2"
                  style={i < arr.length - 1 ? { borderBottom: '1px solid color-mix(in srgb, currentColor 14%, transparent)' } : undefined}
                >
                  <span className="text-sm text-primary-contrast opacity-70">{label}</span>
                  <span className="text-sm font-semibold">
                    <AnimatedNumber value={value} format={(v) => formatMoney(v, currency)} formatKey={currency} />
                  </span>
                </div>
              ))}
            </div>

            {/* Capital vs interest split bar + legend */}
            <div className="mb-2">
              <div
                className="flex h-3 rounded-full overflow-hidden"
                style={{ background: 'color-mix(in srgb, currentColor 12%, transparent)' }}
              >
                <motion.div
                  className="bg-gold"
                  initial={false}
                  animate={{ width: `${Math.max(0, Math.min(100, result.capitalPct))}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                <div className="flex-1" style={{ background: 'color-mix(in srgb, currentColor 32%, transparent)' }} />
              </div>
              <div className="flex items-center justify-between text-xs text-primary-contrast opacity-70 mt-3">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-gold" /> Capital ({Math.round(result.capitalPct)}%)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: 'color-mix(in srgb, currentColor 32%, transparent)' }} /> Interés ({Math.round(100 - result.capitalPct)}%)
                </span>
              </div>
            </div>

            <p className="text-xs text-primary-contrast opacity-50 mt-8">
              Simulación orientativa. No constituye una oferta de crédito.
            </p>
          </motion.div>
        </div>

        {/* ---- Advanced tools ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-surface border border-border rounded-2xl overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'bg-primary text-primary-contrast' : 'text-muted hover:bg-surface-alt'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="p-5 md:p-7">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tab === 'banks' && <BanksPanel loan={result.loan} years={years} currency={currency} />}
              {tab === 'uva' && <UvaPanel loan={result.loan} years={years} currency={currency} />}
              {tab === 'schedule' && <SchedulePanel loan={result.loan} rate={rate} years={years} currency={currency} />}
              {tab === 'capacity' && (
                <CapacityPanel loan={result.loan} rate={rate} years={years} monthly={result.monthly} currency={currency} />
              )}
              {tab === 'docs' && <DocsPanel />}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

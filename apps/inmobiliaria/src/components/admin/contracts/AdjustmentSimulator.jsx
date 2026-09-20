import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator, FileText, TrendingUp, Info, Receipt, BarChart3, GitCompare,
  Bell, AlertTriangle, CalendarClock, Building2
} from 'lucide-react'
import {
  INDICES, FREQUENCIES, contracts, projectAdjustments, contractStatus, fmtDate, TODAY
} from '../../../data/admin/mockContracts'
import { useToast } from '../shared/useToast'

const ars = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n))}`
const arsK = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1000)}k`
  return `$${Math.round(n)}`
}
const idxNum = (n) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const tint = (v, pct) => `color-mix(in srgb, ${v} ${pct}%, transparent)`

const BRAND = 'Terranova Propiedades'

export default function AdjustmentSimulator({ initialContractId }) {
  const { showToast, toastNode } = useToast()

  // Preselect a contract when jumped-to from the contracts table; fall back to the
  // first seed contract if the id isn't part of the simulator's static list.
  const firstId = contracts.some((c) => c.id === initialContractId) ? initialContractId : contracts[0].id
  const [contractId, setContractId] = useState(firstId)
  const base = contracts.find((c) => c.id === contractId)

  const [baseRent, setBaseRent] = useState(base.baseRent)
  const [index, setIndex] = useState(base.index)
  const [freqMonths, setFreqMonths] = useState(base.freqMonths)
  const [daysLate, setDaysLate] = useState(0)
  const [compareMode, setCompareMode] = useState(false)

  const onSelectContract = (id) => {
    const c = contracts.find((x) => x.id === id)
    setContractId(id)
    setBaseRent(c.baseRent)
    setIndex(c.index)
    setFreqMonths(c.freqMonths)
    setDaysLate(0)
  }

  const rows = useMemo(
    () => projectAdjustments({ baseRent, index, freqMonths, termMonths: base.termMonths, startDate: base.startDate }),
    [baseRent, index, freqMonths, base.termMonths, base.startDate]
  )

  const status = useMemo(
    () => contractStatus({ rows, startDate: base.startDate, freqMonths }),
    [rows, base.startDate, freqMonths]
  )

  // Projection under every index for the same contract — powers the compare view.
  const compareSeries = useMemo(
    () => Object.values(INDICES).map((ix) => ({
      ...ix,
      rows: projectAdjustments({ baseRent, index: ix.id, freqMonths, termMonths: base.termMonths, startDate: base.startDate })
    })),
    [baseRent, freqMonths, base.termMonths, base.startDate]
  )

  const current = rows[status.currentIndex] || rows[0]
  const lateFee = current.rent * base.lateFeeDaily * daysLate
  const total = current.rent + lateFee
  const next = status.next
  const soon = next && next.days <= 30
  const folio = `${base.id}-${String(status.currentIndex + 1).padStart(2, '0')}`

  const notifyTenant = () => {
    if (!next) { showToast('Este contrato no tiene ajustes pendientes.', 'info'); return }
    showToast(`Notificación enviada a ${base.tenant}: nuevo alquiler ${ars(next.row.rent)} desde ${fmtDate(next.dateISO)}.`, 'success')
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent" /> Simulador de ajuste de alquiler
        </h1>
        <p className="text-muted mt-1">Proyectá el alquiler con ICL / UVA / IPC y generá el recibo — el diferencial para contratos en Argentina.</p>
      </div>

      {/* Live index ticker — doubles as the index selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.values(INDICES).map((ix) => {
          const active = index === ix.id
          return (
            <button key={ix.id} onClick={() => setIndex(ix.id)}
              className={`text-left rounded-xl border p-3.5 transition-colors ${active ? 'border-accent bg-surface' : 'border-border bg-surface hover:bg-surface-alt'}`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-text">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: ix.cssVar }} />
                  {ix.name}
                </span>
                {active && <span className="text-[10px] font-bold uppercase tracking-wide text-accent">Aplicado</span>}
              </div>
              <div className="mt-2 text-2xl font-bold text-text tabular-nums leading-none">{idxNum(ix.value)}</div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
                <span>Dato al {fmtDate(ix.asOf)}</span>
                <span className="font-semibold">{(ix.monthly * 100).toFixed(1)}%/mes</span>
              </div>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-muted flex items-start gap-1 -mt-1">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {INDICES[index].note}
      </p>

      {/* Next-adjustment banner */}
      <NextAdjustmentBanner next={next} soon={soon} index={index} tenant={base.tenant} onNotify={notifyTenant} />

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-4">
        {/* Controls + receipt */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Contrato</label>
              <select value={contractId} onChange={(e) => onSelectContract(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent">
                {contracts.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.tenant}</option>)}
              </select>
              <p className="text-xs text-muted mt-1.5">{base.property} · inicio {base.startMonth}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Alquiler base (mes 1)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                <input type="number" value={baseRent} onChange={(e) => setBaseRent(Number(e.target.value) || 0)}
                  className="w-full bg-bg border border-border rounded-lg pl-7 pr-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Frecuencia de ajuste</label>
              <select value={freqMonths} onChange={(e) => setFreqMonths(Number(e.target.value))}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent">
                {FREQUENCIES.map((f) => <option key={f.months} value={f.months}>{f.label} (cada {f.months} meses)</option>)}
              </select>
            </div>
          </div>

          {/* Receipt */}
          <motion.div layout className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="h-1 w-full bg-accent" />
            <div className="p-5 space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-text font-bold"><Building2 className="w-4 h-4 text-accent" /> {BRAND}</div>
                  <div className="text-[11px] uppercase tracking-widest text-muted mt-0.5">Recibo de alquiler</div>
                </div>
                <div className="text-right text-[11px] text-muted leading-relaxed">
                  <div>Folio <span className="font-semibold text-text">{folio}</span></div>
                  <div>Emisión {fmtDate(TODAY)}</div>
                </div>
              </div>

              <div className="border-t border-dashed border-border pt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div><div className="text-muted">Inquilino</div><div className="text-text font-medium">{base.tenant}</div></div>
                <div><div className="text-muted">Contrato</div><div className="text-text font-medium">{base.id}</div></div>
                <div className="col-span-2"><div className="text-muted">Propiedad</div><div className="text-text font-medium">{base.property}</div></div>
                <div><div className="text-muted">Período</div><div className="text-text font-medium">{current.range}</div></div>
                <div><div className="text-muted">Índice</div><div className="text-text font-medium">{index} · cada {freqMonths} meses</div></div>
              </div>

              <div className="border-t border-dashed border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Alquiler {current.range}</span>
                  <span className="text-text font-medium tabular-nums">{ars(current.rent)}</span>
                </div>
                {status.currentIndex > 0 && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted">Ajuste {index} acumulado</span>
                    <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>+{current.cumulative}%</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted flex items-center gap-2">
                    Días de mora
                    <input type="number" min="0" value={daysLate} onChange={(e) => setDaysLate(Math.max(0, Number(e.target.value) || 0))}
                      className="w-16 bg-bg border border-border rounded px-2 py-1 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent" />
                  </span>
                  <span className={`tabular-nums ${lateFee > 0 ? 'text-error font-medium' : 'text-muted'}`}>+ {ars(lateFee)}</span>
                </div>
                {daysLate > 0 && <p className="text-[11px] text-muted">Punitorio {(base.lateFeeDaily * 100).toFixed(2)}% diario sobre el alquiler.</p>}
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-border">
                <span className="text-text font-bold">Total a pagar</span>
                <span className="text-2xl font-bold text-accent tabular-nums">{ars(total)}</span>
              </div>

              <button onClick={notifyTenant}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 bg-accent text-primary-contrast font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 transition-opacity">
                <Bell className="w-4 h-4" /> Notificar inquilino
              </button>
              <p className="text-[10px] text-muted text-center">Documento de demostración · sin validez fiscal.</p>
            </div>
          </motion.div>
        </div>

        {/* Projection: chart + list */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 pb-3 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-bold text-text flex items-center gap-2"><TrendingUp className="w-4 h-4 text-accent" /> Proyección del contrato</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">{rows.length} períodos · {base.termMonths} meses</span>
              <button onClick={() => setCompareMode((v) => !v)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-colors ${compareMode ? 'bg-accent text-primary-contrast border-accent' : 'border-border text-text hover:bg-surface-alt'}`}>
                <GitCompare className="w-3.5 h-3.5" /> Comparar índices
              </button>
            </div>
          </div>

          {/* Evolution chart */}
          <div className="px-5 pt-1 pb-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted mb-2">
              <BarChart3 className="w-3.5 h-3.5" /> Evolución de la cuota · {index}
            </div>
            <EvolutionChart rows={rows} currentIndex={status.currentIndex} />
          </div>

          {/* Period list */}
          <div className="px-5 pb-2 space-y-1 max-h-[320px] overflow-y-auto">
            {rows.map((r, i) => (
              <motion.div key={r.period}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`flex items-center gap-3 py-2.5 border-b border-border last:border-0 ${i === status.currentIndex ? 'bg-surface-alt -mx-2 px-2 rounded' : ''}`}>
                <span className="w-24 shrink-0 text-sm text-text flex items-center gap-1.5">
                  {r.range}
                  {i === status.currentIndex && <span className="text-[9px] font-bold uppercase text-accent">hoy</span>}
                </span>
                <div className="flex-1">
                  {r.pct > 0
                    ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-warning" style={{ background: tint('var(--color-warning)', 16) }}>+{r.pct}% {index}</span>
                    : <span className="text-xs text-muted">base</span>}
                </div>
                <span className="text-sm text-muted hidden sm:inline w-24 text-right">acum. +{r.cumulative}%</span>
                <span className="text-sm font-bold text-text w-28 text-right tabular-nums">{ars(r.rent)}</span>
              </motion.div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border bg-bg flex items-center gap-2 text-xs text-muted mt-auto">
            <FileText className="w-3.5 h-3.5" /> El inquilino y el propietario ven la misma proyección — cero sorpresas en cada ajuste.
          </div>
        </div>
      </div>

      {/* Compare indices */}
      <AnimatePresence initial={false}>
        {compareMode && (
          <motion.section
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }} className="overflow-hidden">
            <CompareSection series={compareSeries} selected={index} termMonths={base.termMonths} />
          </motion.section>
        )}
      </AnimatePresence>

      {toastNode}
    </div>
  )
}

// ---------------- Next-adjustment banner ----------------

function NextAdjustmentBanner({ next, soon, index, tenant, onNotify }) {
  if (!next) {
    return (
      <div className="rounded-xl border border-border bg-surface px-4 py-3 flex items-center gap-2.5 text-sm text-muted">
        <CalendarClock className="w-4 h-4 shrink-0" /> Este contrato no tiene más ajustes pendientes en el plazo restante.
      </div>
    )
  }

  const tone = soon ? 'var(--color-warning)' : 'var(--color-accent)'
  const Icon = soon ? AlertTriangle : CalendarClock

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3"
      style={{ backgroundColor: tint(tone, 12), borderColor: tint(tone, 45) }}>
      <div className="flex items-start gap-2.5 flex-1">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: tone }} />
        <div>
          <p className="text-sm font-semibold text-text">
            {soon ? `Ajuste próximo — en ${next.days} días` : `Próximo ajuste en ${next.days} días`}
            <span className="text-muted font-normal"> · {fmtDate(next.dateISO)}</span>
          </p>
          <p className="text-xs text-muted mt-0.5">
            {index}: <span className="tabular-nums">{ars(next.prevRow.rent)}</span> →{' '}
            <span className="font-semibold tabular-nums" style={{ color: tone }}>{ars(next.row.rent)}</span>
            {' '}(+{next.deltaPct}% · +{ars(next.deltaAmount)})
          </p>
        </div>
      </div>
      <button onClick={onNotify}
        className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-primary-contrast transition-opacity hover:opacity-90"
        style={{ backgroundColor: tone }}>
        <Bell className="w-4 h-4" /> Notificar inquilino
      </button>
    </motion.div>
  )
}

// ---------------- Evolution bar chart ----------------

function EvolutionChart({ rows, currentIndex }) {
  const minRent = rows[0].rent
  const maxRent = rows[rows.length - 1].rent
  const span = maxRent - minRent || 1
  const labelEvery = rows.length > 8 ? 2 : 1

  return (
    <div className="flex items-stretch gap-2">
      <div className="w-11 shrink-0 flex flex-col justify-between text-[9px] text-muted text-right leading-none py-0.5">
        <span>{arsK(maxRent)}</span>
        <span>{arsK(minRent + span / 2)}</span>
        <span>{arsK(minRent)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-40 flex items-end gap-1">
          {rows.map((r, i) => {
            const h = 18 + ((r.rent - minRent) / span) * 82 // 18–100% so every bar is visible
            const isCurrent = i === currentIndex
            const fill = r.pct > 0 ? 'var(--color-accent)' : tint('var(--color-accent)', 45)
            return (
              <div key={r.period} className="flex-1 h-full flex flex-col justify-end items-center min-w-0"
                title={`${r.range} · ${ars(r.rent)} · acum. +${r.cumulative}%`}>
                {isCurrent && <span className="text-[8px] font-bold uppercase text-accent mb-0.5 leading-none">hoy</span>}
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
                  className="w-full rounded-t"
                  style={{ background: fill, outline: isCurrent ? '2px solid var(--color-text)' : 'none', outlineOffset: '1px' }} />
              </div>
            )
          })}
        </div>
        <div className="flex gap-1 mt-1.5">
          {rows.map((r, i) => (
            <div key={r.period} className="flex-1 text-center text-[8px] text-muted truncate min-w-0">
              {i % labelEvery === 0 ? r.short : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------- Compare indices ----------------

function CompareSection({ series, selected, termMonths }) {
  const n = series[0].rows.length
  const allRents = series.flatMap((s) => s.rows.map((r) => r.rent))
  const maxAll = Math.max(...allRents)
  const minAll = Math.min(...allRents)
  const span = maxAll - minAll || 1

  // SVG geometry
  const W = 320, H = 150
  const pad = { l: 6, r: 6, t: 10, b: 20 }
  const plotW = W - pad.l - pad.r
  const plotH = H - pad.t - pad.b
  const x = (i) => pad.l + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const y = (v) => pad.t + (1 - (v - minAll) / span) * plotH

  const finals = series.map((s) => ({ id: s.id, name: s.name, cssVar: s.cssVar, final: s.rows[s.rows.length - 1].rent, totalPct: s.rows[s.rows.length - 1].cumulative }))
  const cheapest = finals.reduce((a, b) => (b.final < a.final ? b : a))
  const priciest = finals.reduce((a, b) => (b.final > a.final ? b : a))
  const gap = priciest.final - cheapest.final

  const tickIdx = Array.from(new Set([0, Math.floor((n - 1) / 3), Math.floor((2 * (n - 1)) / 3), n - 1]))

  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <div>
        <h2 className="font-bold text-text flex items-center gap-2"><GitCompare className="w-4 h-4 text-accent" /> Comparación de índices</h2>
        <p className="text-xs text-muted mt-0.5">Mismo contrato ({termMonths} meses), tres escenarios de ajuste lado a lado.</p>
      </div>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-5">
        {/* Multi-line chart */}
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Comparación de proyección por índice">
            {/* baseline grid */}
            {[0, 0.5, 1].map((f) => (
              <line key={f} x1={pad.l} x2={W - pad.r} y1={pad.t + f * plotH} y2={pad.t + f * plotH}
                stroke="var(--color-border)" strokeWidth="1" />
            ))}
            {series.map((s) => (
              <g key={s.id}>
                <polyline
                  points={s.rows.map((r, i) => `${x(i)},${y(r.rent)}`).join(' ')}
                  fill="none" stroke={s.cssVar} strokeWidth={s.id === selected ? 2.6 : 1.6}
                  strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                  opacity={s.id === selected ? 1 : 0.85} />
                <circle cx={x(n - 1)} cy={y(s.rows[s.rows.length - 1].rent)} r="2.6" fill={s.cssVar} />
              </g>
            ))}
            {tickIdx.map((i) => (
              <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="var(--color-muted)">
                {series[0].rows[i].short}
              </text>
            ))}
          </svg>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            {series.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                <span className="w-3 h-0.5 rounded-full" style={{ background: s.cssVar }} />
                {s.id}{s.id === selected && <span className="text-accent font-semibold">· tu índice</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Final-value table */}
        <div className="space-y-2">
          {finals.map((f) => {
            const isMin = f.id === cheapest.id
            const isMax = f.id === priciest.id && gap > 0
            const bg = isMin ? tint('var(--color-success)', 12) : isMax ? tint('var(--color-error)', 12) : 'transparent'
            const bd = isMin ? tint('var(--color-success)', 40) : isMax ? tint('var(--color-error)', 40) : 'var(--color-border)'
            return (
              <div key={f.id} className="rounded-lg border px-3 py-2.5 flex items-center justify-between"
                style={{ backgroundColor: bg, borderColor: bd }}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: f.cssVar }} />
                  <span className="text-sm font-semibold text-text">{f.name}</span>
                  {f.id === selected && <span className="text-[10px] font-bold uppercase text-accent">actual</span>}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-text tabular-nums">{ars(f.final)}</div>
                  <div className="text-[10px] text-muted">cuota final · +{f.totalPct}%</div>
                </div>
              </div>
            )
          })}
          {gap > 0 && (
            <p className="text-[11px] text-muted pt-1">
              Al final del contrato, <span className="font-semibold">{cheapest.name}</span> paga{' '}
              <span className="font-semibold tabular-nums" style={{ color: 'var(--color-success)' }}>{ars(gap)}</span> menos por mes que{' '}
              <span className="font-semibold">{priciest.name}</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

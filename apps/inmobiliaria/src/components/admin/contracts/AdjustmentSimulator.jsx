import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, FileText, TrendingUp, Info, Receipt } from 'lucide-react'
import { INDICES, FREQUENCIES, contracts, projectAdjustments } from '../../../data/admin/mockContracts'

const ars = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n))}`

export default function AdjustmentSimulator() {
  const [contractId, setContractId] = useState(contracts[0].id)
  const base = contracts.find((c) => c.id === contractId)

  const [baseRent, setBaseRent] = useState(base.baseRent)
  const [index, setIndex] = useState(base.index)
  const [freqMonths, setFreqMonths] = useState(base.freqMonths)
  const [daysLate, setDaysLate] = useState(0)

  const onSelectContract = (id) => {
    const c = contracts.find((x) => x.id === id)
    setContractId(id)
    setBaseRent(c.baseRent)
    setIndex(c.index)
    setFreqMonths(c.freqMonths)
    setDaysLate(0)
  }

  const rows = useMemo(
    () => projectAdjustments({ baseRent, index, freqMonths, termMonths: base.termMonths }),
    [baseRent, index, freqMonths, base.termMonths]
  )

  // "Recibo" for the current (2nd) period as the live example
  const current = rows[1] || rows[0]
  const lateFee = current.rent * base.lateFeeDaily * daysLate
  const total = current.rent + lateFee

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent" /> Simulador de ajuste de alquiler
        </h1>
        <p className="text-muted mt-1">Proyectá el alquiler con ICL / UVA / IPC y generá el recibo — el diferencial para contratos en Argentina.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-4">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Contrato</label>
              <select value={contractId} onChange={(e) => onSelectContract(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent">
                {contracts.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.tenant}</option>)}
              </select>
              <p className="text-xs text-muted mt-1.5">{base.property}</p>
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
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Índice de ajuste</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(INDICES).map((ix) => (
                  <button key={ix.id} onClick={() => setIndex(ix.id)}
                    className={`px-2 py-2 rounded-lg text-sm font-semibold transition-colors border ${index === ix.id ? 'bg-accent text-primary border-accent' : 'border-border text-text hover:bg-surface-alt'}`}>
                    {ix.id}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-1.5 flex items-start gap-1"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {INDICES[index].note}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Frecuencia de ajuste</label>
              <select value={freqMonths} onChange={(e) => setFreqMonths(Number(e.target.value))}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent">
                {FREQUENCIES.map((f) => <option key={f.months} value={f.months}>{f.label} (cada {f.months} meses)</option>)}
              </select>
            </div>
          </div>

          {/* Recibo */}
          <motion.div layout className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-bold text-text flex items-center gap-2 mb-3"><Receipt className="w-4 h-4 text-accent" /> Recibo del período actual</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Alquiler ({current.range})</span><span className="text-text font-medium">{ars(current.rent)}</span></div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted flex items-center gap-2">
                  Días de mora
                  <input type="number" min="0" value={daysLate} onChange={(e) => setDaysLate(Math.max(0, Number(e.target.value) || 0))}
                    className="w-16 bg-bg border border-border rounded px-2 py-1 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent" />
                </span>
                <span className={lateFee > 0 ? 'text-error font-medium' : 'text-muted'}>+ {ars(lateFee)}</span>
              </div>
              {daysLate > 0 && <p className="text-[11px] text-muted">Punitorio {(base.lateFeeDaily * 100).toFixed(2)}% diario sobre el alquiler.</p>}
              <div className="flex justify-between pt-2 border-t border-border text-base font-bold"><span className="text-text">Total a pagar</span><span className="text-accent">{ars(total)}</span></div>
            </div>
          </motion.div>
        </div>

        {/* Projection */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-5 pb-3 flex items-center justify-between">
            <h2 className="font-bold text-text flex items-center gap-2"><TrendingUp className="w-4 h-4 text-accent" /> Proyección del contrato</h2>
            <span className="text-xs text-muted">{rows.length} períodos · {base.termMonths} meses</span>
          </div>
          <div className="px-5 pb-5 space-y-1 max-h-[520px] overflow-y-auto">
            {rows.map((r, i) => (
              <motion.div key={r.period}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                <span className="w-24 shrink-0 text-sm text-text">{r.range}</span>
                <div className="flex-1">
                  {r.pct > 0
                    ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-warning/15 text-warning">+{r.pct}% {index}</span>
                    : <span className="text-xs text-muted">base</span>}
                </div>
                <span className="text-sm text-muted hidden sm:inline w-24 text-right">acum. +{r.cumulative}%</span>
                <span className="text-sm font-bold text-text w-28 text-right">{ars(r.rent)}</span>
              </motion.div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border bg-bg flex items-center gap-2 text-xs text-muted">
            <FileText className="w-3.5 h-3.5" /> El inquilino y el propietario ven la misma proyección — cero sorpresas en cada ajuste.
          </div>
        </div>
      </div>
    </div>
  )
}

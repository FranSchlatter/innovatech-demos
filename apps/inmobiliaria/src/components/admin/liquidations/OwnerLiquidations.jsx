import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Download, Building2, Check, Clock, Landmark } from 'lucide-react'
import { liquidations, computeLiquidation } from '../../../data/admin/mockLiquidations'

const ars = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n))}`

export default function OwnerLiquidations() {
  const [activeId, setActiveId] = useState(liquidations[0].id)
  const [downloaded, setDownloaded] = useState(false)
  const lq = liquidations.find((l) => l.id === activeId)
  const c = computeLiquidation(lq)

  const select = (id) => { setActiveId(id); setDownloaded(false) }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2"><Wallet className="w-5 h-5 text-accent" /> Liquidación al propietario</h1>
        <p className="text-muted mt-1">Lo cobrado, menos comisión y gastos, es lo que recibe cada propietario — con recibo listo para enviar.</p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-4">
        {/* Owner list */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden h-fit">
          {liquidations.map((l) => {
            const cc = computeLiquidation(l)
            const active = l.id === activeId
            return (
              <button key={l.id} onClick={() => select(l.id)}
                className={`w-full text-left p-4 border-b border-border last:border-0 transition-colors ${active ? 'bg-primary/10' : 'hover:bg-surface-alt'}`}>
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-muted shrink-0" />
                  <p className="text-sm font-semibold text-text truncate">{l.owner}</p>
                </div>
                <p className="text-xs text-muted mt-1">{l.properties.length} propiedad{l.properties.length > 1 ? 'es' : ''} · {l.period}</p>
                <p className="text-sm font-bold text-accent mt-1">Neto {ars(cc.net)}</p>
              </button>
            )
          })}
        </div>

        {/* Receipt / PDF preview */}
        <motion.div key={lq.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-5 border-b border-border">
            <div>
              <p className="text-xs text-muted">{lq.id}</p>
              <h2 className="font-bold text-text text-lg">{lq.owner}</h2>
              <p className="text-xs text-muted">Liquidación · {lq.period}</p>
            </div>
            <button onClick={() => setDownloaded(true)}
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${downloaded ? 'bg-success/15 text-success' : 'bg-accent text-primary hover:opacity-90'}`}>
              {downloaded ? <><Check className="w-4 h-4" /> Descargado</> : <><Download className="w-4 h-4" /> Descargar PDF</>}
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Properties collected */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Propiedades</p>
              <div className="space-y-2">
                {lq.properties.map((p) => (
                  <div key={p.title} className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted shrink-0" />
                      <div className="min-w-0">
                        <p className="text-text truncate">{p.title}</p>
                        <p className="text-xs text-muted truncate">{p.tenant}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-text font-medium">{ars(p.rentCollected)}</p>
                      <span className={`text-[10px] font-semibold inline-flex items-center gap-1 ${p.status === 'cobrado' ? 'text-success' : 'text-warning'}`}>
                        {p.status === 'cobrado' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted">Total cobrado</span><span className="text-text font-medium">{ars(c.grossCollected)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Comisión de administración ({(lq.mgmtFeePct * 100).toFixed(0)}%)</span><span className="text-error">− {ars(c.mgmtFee)}</span></div>
              {lq.expenses.map((e) => (
                <div key={e.label} className="flex justify-between"><span className="text-muted pl-3">· {e.label}</span><span className="text-error">− {ars(e.amount)}</span></div>
              ))}
              <div className="flex justify-between pt-2 border-t border-border text-base font-bold"><span className="text-text">Neto al propietario</span><span className="text-accent">{ars(c.net)}</span></div>
              {c.pending > 0 && <p className="text-xs text-warning flex items-center gap-1 pt-1"><Clock className="w-3.5 h-3.5" /> {ars(c.pending)} pendiente de cobro (no incluido)</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { CalendarClock, FileText, Receipt } from 'lucide-react'
import {
  useDemo, Table, Badge, Card, Select, FilterBar, Drawer, Button, Skeleton, PDFPreview,
  realestateApi, formatMoney, formatPercent
} from '@kit'

const collectionTone = (s) => (s === 'al día' ? 'success' : s === 'parcial' ? 'warning' : 'danger')
const adjTone = (days) => (days < 0 ? 'danger' : days <= 15 ? 'warning' : 'neutral')

/* I10 — contract detail + live adjustment simulator */
function ContractDetail({ contract, indices, locale, onClose }) {
  const [index, setIndex] = useState(contract?.index || 'IPC')
  const [freq, setFreq] = useState(contract?.frequencyMonths || 3)
  const [showReceipt, setShowReceipt] = useState(false)
  if (!contract) return null

  const pct = indices?.[index] ?? 0
  const newAmount = Math.round(contract.amount * (1 + pct))
  const increase = newAmount - contract.amount
  const punitorios = contract.collectionStatus === 'vencido' ? Math.round(contract.amount * 0.02) : 0

  return (
    <Drawer open={!!contract} onClose={onClose} title={`Contrato ${contract.id}`} width="w-full max-w-lg">
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[['Inquilino', contract.tenant], ['Propiedad', contract.propertyLabel], ['Canon actual', formatMoney(contract.amount, contract.currency, locale)], ['Estado cobranza', contract.collectionStatus]].map(([k, v]) => (
            <div key={k} className="rounded p-3 bg-surface-2"><p className="text-[11px] uppercase text-muted">{k}</p><p className="font-semibold text-text text-sm">{v}</p></div>
          ))}
        </div>

        {/* timeline */}
        <div>
          <p className="text-xs font-semibold uppercase text-muted mb-2">Línea de ajustes</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded px-2 py-1 bg-surface-2">Base · {contract.baseDate}</span>
            <span className="text-muted">→</span>
            <span className="rounded px-2 py-1" style={{ background: 'var(--dk-primary-weak)', color: 'var(--dk-primary)' }}>Próximo · {contract.nextAdjustment}</span>
          </div>
        </div>

        {/* simulator */}
        <Card className="p-4">
          <p className="font-bold text-heading text-sm flex items-center gap-1.5 mb-3"><CalendarClock size={15} /> Simulador de ajuste</p>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Índice" value={index} onChange={(e) => setIndex(e.target.value)}
              options={Object.keys(indices || {}).map((k) => ({ value: k, label: k }))} />
            <Select label="Frecuencia" value={freq} onChange={(e) => setFreq(+e.target.value)}
              options={[1, 3, 4, 6, 12].map((m) => ({ value: m, label: `Cada ${m} ${m === 1 ? 'mes' : 'meses'}` }))} />
          </div>
          <div className="mt-3 rounded p-3" style={{ background: 'var(--dk-primary-weak)' }}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Nuevo canon</span>
              <span className="text-xl font-extrabold text-primary">{formatMoney(newAmount, contract.currency, locale)}</span>
            </div>
            <p className="text-xs text-muted mt-1">
              {formatMoney(contract.amount, contract.currency, locale)} × (1 + {formatPercent(pct * 100, locale)} {index}) = +{formatMoney(increase, contract.currency, locale)}
            </p>
          </div>
        </Card>

        <Button icon={Receipt} variant="secondary" className="w-full" onClick={() => setShowReceipt((v) => !v)}>
          {showReceipt ? 'Ocultar recibo' : 'Generar recibo'}
        </Button>

        {showReceipt && (
          <PDFPreview brand={{ name: 'Terranova Propiedades' }} meta={`Recibo · ${contract.id}`} title="Recibo de alquiler"
            onDownload={() => {}}>
            <div className="flex justify-between"><span>Canon locativo</span><b>{formatMoney(contract.amount, contract.currency, locale)}</b></div>
            {punitorios > 0 && <div className="flex justify-between text-[#c0392b]"><span>Punitorios (2% por mora)</span><b>{formatMoney(punitorios, contract.currency, locale)}</b></div>}
            <div className="flex justify-between border-t border-[#e6e9ee] pt-2 mt-2"><span className="font-bold">Total</span><b>{formatMoney(contract.amount + punitorios, contract.currency, locale)}</b></div>
          </PDFPreview>
        )}
      </div>
    </Drawer>
  )
}

export default function Contracts() {
  const { market } = useDemo()
  const [rows, setRows] = useState(null)
  const [indices, setIndices] = useState(null)
  const [filter, setFilter] = useState({ status: '', index: '' })
  const [sel, setSel] = useState(null)

  useEffect(() => { realestateApi.getAdjustmentIndices().then(setIndices) }, [])
  useEffect(() => {
    setRows(null)
    realestateApi.getContracts({ status: filter.status || undefined, index: filter.index || undefined }).then(setRows)
  }, [filter])

  const columns = useMemo(() => [
    { key: 'tenant', header: 'Inquilino', render: (r) => <div><p className="font-semibold text-text">{r.tenant}</p><p className="text-xs text-muted">{r.propertyLabel}</p></div> },
    { key: 'amount', header: 'Canon', align: 'right', render: (r) => <span className="font-semibold text-heading">{formatMoney(r.amount, r.currency, market.locale)}</span> },
    { key: 'index', header: 'Ajuste', render: (r) => <span className="text-sm">{r.index} · cada {r.frequencyMonths}m</span> },
    { key: 'next', header: 'Próximo ajuste', render: (r) => <div className="flex items-center gap-2"><span className="text-sm text-text">{r.nextAdjustment}</span><Badge tone={adjTone(r.daysToAdjustment)}>{r.daysToAdjustment < 0 ? 'vencido' : `${r.daysToAdjustment}d`}</Badge></div> },
    { key: 'status', header: 'Cobranza', render: (r) => <Badge tone={collectionTone(r.collectionStatus)} dot>{r.collectionStatus}</Badge> }
  ], [market.locale])

  return (
    <div className="space-y-4" id="tour-contracts">
      <div>
        <h1 className="text-xl font-extrabold text-heading flex items-center gap-2"><FileText size={20} className="text-primary" /> Contratos de alquiler</h1>
        <p className="text-sm text-muted">Índice, frecuencia y próximo ajuste — cada contrato con su esquema (DNU 70/2023)</p>
      </div>

      <FilterBar>
        <Select label="Estado de cobranza" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          options={[{ value: '', label: 'Todos' }, { value: 'al día', label: 'Al día' }, { value: 'parcial', label: 'Parcial' }, { value: 'vencido', label: 'Vencido' }]} />
        <Select label="Índice" value={filter.index} onChange={(e) => setFilter({ ...filter, index: e.target.value })}
          options={[{ value: '', label: 'Todos' }, ...['IPC', 'ICL', 'UVA', 'Fijo'].map((i) => ({ value: i, label: i }))]} />
      </FilterBar>

      <Card className="p-0 overflow-hidden">
        {!rows ? <div className="p-4 space-y-2">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 rounded" />)}</div> : (
          <Table columns={columns} rows={rows} onRowClick={setSel} />
        )}
      </Card>

      <ContractDetail contract={sel} indices={indices} locale={market.locale} onClose={() => setSel(null)} />
    </div>
  )
}

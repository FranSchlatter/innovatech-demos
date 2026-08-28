import { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { useDemo, Card, Select, Badge, Skeleton, PDFPreview, Table, realestateApi, formatMoney } from '@kit'

export default function Liquidations() {
  const { market } = useDemo()
  const [owners, setOwners] = useState([])
  const [ownerId, setOwnerId] = useState('OWN-001')
  const [liq, setLiq] = useState(null)
  const money = (v) => formatMoney(v, 'ARS', market.locale)

  useEffect(() => { realestateApi.getOwners().then(setOwners) }, [])
  useEffect(() => { setLiq(null); realestateApi.getLiquidation(ownerId, '2026-08').then(setLiq) }, [ownerId])

  const columns = [
    { key: 'tenant', header: 'Inquilino', render: (r) => <div><p className="font-semibold text-text">{r.tenant}</p><p className="text-xs text-muted">{r.contract}</p></div> },
    { key: 'billed', header: 'Facturado', align: 'right', render: (r) => money(r.billed) },
    { key: 'collected', header: 'Cobrado', align: 'right', render: (r) => <div className="flex items-center justify-end gap-2"><span className="font-semibold text-heading">{money(r.collected)}</span>{r.partial && <Badge tone="warning">parcial</Badge>}</div> }
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-heading flex items-center gap-2"><Wallet size={20} className="text-primary" /> Liquidación al propietario</h1>
        <p className="text-sm text-muted">Se liquida sobre lo <b>cobrado</b>, no sobre lo facturado</p>
      </div>

      <div className="max-w-xs">
        <Select label="Propietario" value={ownerId} onChange={(e) => setOwnerId(e.target.value)}
          options={owners.map((o) => ({ value: o.id, label: `${o.name} (${o.properties} prop.)` }))} />
      </div>

      {!liq ? <Skeleton className="h-64 rounded" /> : (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-0 overflow-hidden">
            <Table columns={columns} rows={liq.rows} keyField="contract" />
            <div className="p-4 border-t border-border space-y-1 text-sm">
              <div className="flex justify-between text-muted"><span>Bruto cobrado</span><span>{money(liq.grossCollected)}</span></div>
              <div className="flex justify-between text-muted"><span>Comisión administración (8%)</span><span>−{money(liq.commission)}</span></div>
              <div className="flex justify-between font-bold text-heading text-base pt-1 border-t border-border"><span>Neto a liquidar</span><span className="text-primary">{money(liq.net)}</span></div>
            </div>
          </Card>

          <PDFPreview brand={{ name: 'Terranova Propiedades' }} meta={`Liquidación · ${liq.period}`} title="Liquidación al propietario" onDownload={() => {}}>
            {liq.rows.map((r) => (
              <div key={r.contract} className="flex justify-between"><span>{r.tenant} ({r.contract})</span><b>{money(r.collected)}</b></div>
            ))}
            <div className="flex justify-between border-t border-[#e6e9ee] pt-2 mt-2"><span>Comisión (8%)</span><b>−{money(liq.commission)}</b></div>
            <div className="flex justify-between font-bold"><span>Neto</span><b>{money(liq.net)}</b></div>
          </PDFPreview>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { TrendingUp, Info } from 'lucide-react'
import { useDemo, Card, Badge, ChartCard, Skeleton, Table, hotelApi, formatMoney } from '@kit'

const recTone = (r) => (r === 'subir' ? 'success' : r === 'bajar' ? 'danger' : 'neutral')

export default function Rates() {
  const { market } = useDemo()
  const [dp, setDp] = useState(null)
  useEffect(() => { hotelApi.getDynamicPricing().then(setDp) }, [])
  const money = (v) => formatMoney(v, 'ARS', market.locale, { compact: true })

  const columns = [
    { key: 'date', header: 'Fecha' },
    { key: 'nominal', header: 'Tarifa nominal', align: 'right', render: (r) => money(r.nominal) },
    { key: 'real', header: 'Tarifa real (deflactada)', align: 'right', render: (r) => <span className="text-muted">{money(r.real)}</span> },
    { key: 'occ', header: 'Ocupación', align: 'right', render: (r) => `${r.occ}%` },
    { key: 'rec', header: 'Recomendación', render: (r) => <div className="flex items-center gap-2"><Badge tone={recTone(r.rec)}>{r.rec}{r.delta ? ` ${r.delta > 0 ? '+' : ''}${r.delta}%` : ''}</Badge>{r.reason !== '—' && <span className="text-xs text-muted">por {r.reason}</span>}</div> }
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-heading flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Tarifas y precio dinámico</h1>
        <p className="text-sm text-muted">Separa el efecto inflación del efecto demanda — algo que ningún RMS importado hace</p>
      </div>

      <Card className="p-4 flex items-start gap-3">
        <Info size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted">{dp?.note || 'La tarifa nominal sube por inflación; la recomendación se calcula sobre la tarifa real y la ocupación.'} IPC mensual usado: <b className="text-text">{dp?.ipcMonthly ?? '—'}%</b>.</p>
      </Card>

      <ChartCard title="Nominal vs. real deflactada" subtitle="La línea real muestra el precio verdadero; si sube, es demanda, no inflación">
        {!dp ? <Skeleton className="h-56 rounded" /> : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dp.rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--dk-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--dk-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--dk-muted)' }} axisLine={false} tickLine={false} tickFormatter={money} width={54} />
                <Tooltip contentStyle={{ background: 'var(--dk-elevated)', border: '1px solid var(--dk-border)', borderRadius: 10 }} formatter={(v, n) => [money(v), n === 'nominal' ? 'Nominal' : 'Real']} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="nominal" name="Nominal" stroke="var(--dk-warning)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="real" name="Real (deflactada)" stroke="var(--dk-primary)" strokeWidth={2.5} strokeDasharray="5 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <Card className="p-0 overflow-hidden">
        {!dp ? <div className="p-4 space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded" />)}</div> : <Table columns={columns} rows={dp.rows} keyField="date" />}
      </Card>
    </div>
  )
}

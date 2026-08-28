import { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Cell } from 'recharts'
import { BedDouble, DollarSign, TrendingUp, CalendarCheck, LogIn, LogOut, PiggyBank } from 'lucide-react'
import { useDemo, KPICard, ChartCard, Card, Badge, Skeleton, hotelApi, formatMoney } from '@kit'

function useMoney() {
  const { currency, fx, market } = useDemo()
  return (ars, compact = true) => {
    const v = currency === 'ARS' ? ars : Math.round(ars / (fx.USD || 1))
    return formatMoney(v, currency === 'ARS' ? 'ARS' : currency, market.locale, { compact })
  }
}

export default function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [comm, setComm] = useState(null)
  const [occ, setOcc] = useState(null)
  const [arr, setArr] = useState([])
  const [dep, setDep] = useState([])
  const money = useMoney()

  useEffect(() => {
    hotelApi.getKpis().then(setKpis)
    hotelApi.getCommissionSummary().then(setComm)
    hotelApi.getOccupancy12().then(setOcc)
    hotelApi.getArrivals().then(setArr)
    hotelApi.getDepartures().then(setDep)
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-heading">Panel · Hotel Costa Serena</h1>
        <p className="text-sm text-muted">Resumen operativo · agosto 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" id="tour-kpis">
        {kpis ? (
          <>
            <KPICard label="Ocupación" value={`${kpis.occupancy}%`} delta={4} deltaLabel="vs mes ant." icon={BedDouble} />
            <KPICard label="ADR" value={money(kpis.adr)} delta={6} deltaLabel="tarifa media" icon={DollarSign} />
            <KPICard label="RevPAR" value={money(kpis.revpar)} delta={9} icon={TrendingUp} />
            <KPICard label="Reservas (mes)" value={kpis.reservationsMonth} delta={12} icon={CalendarCheck} />
          </>
        ) : [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded" />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Commission widget — the chart that sells (H7) */}
        <div id="tour-commission" className="lg:col-span-2">
          <ChartCard title="Comisión a OTAs vs. ingreso directo"
            subtitle="Lo que te llevás vos vs. lo que se lleva Booking / Expedia"
            right={comm && <Badge tone="success" dot>Ahorro 6m: {money(comm.cumulativeSavings)}</Badge>}>
            {!comm ? <Skeleton className="h-64 rounded" /> : (
              <>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comm.commByChannel} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--dk-border)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--dk-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--dk-muted)' }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => money(v)} width={54} />
                      <Tooltip
                        contentStyle={{ background: 'var(--dk-elevated)', border: '1px solid var(--dk-border)', borderRadius: 10, color: 'var(--dk-text)' }}
                        formatter={(v, n) => [money(v), n === 'revenue' ? 'Ingreso' : 'Comisión pagada']} />
                      <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                        {comm.commByChannel.map((c) => <Cell key={c.id} fill={c.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="rounded p-3 bg-surface-2">
                    <p className="text-xs text-muted">Comisión OTA (mes)</p>
                    <p className="font-extrabold text-danger">{money(comm.otaCommission)}</p>
                  </div>
                  <div className="rounded p-3 bg-surface-2">
                    <p className="text-xs text-muted">Ingreso canal directo</p>
                    <p className="font-extrabold text-success">{money(comm.directRevenue)}</p>
                  </div>
                  <div className="rounded p-3" style={{ background: 'var(--dk-primary-weak)' }}>
                    <p className="text-xs text-muted flex items-center gap-1"><PiggyBank size={13} /> Ahorro acumulado</p>
                    <p className="font-extrabold text-primary">{money(comm.cumulativeSavings)}</p>
                  </div>
                </div>
              </>
            )}
          </ChartCard>
        </div>

        {/* Occupancy 12m */}
        <ChartCard title="Ocupación · 12 meses">
          {!occ ? <Skeleton className="h-64 rounded" /> : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occ} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--dk-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--dk-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--dk-muted)' }} axisLine={false} tickLine={false} domain={[40, 100]} />
                  <Tooltip contentStyle={{ background: 'var(--dk-elevated)', border: '1px solid var(--dk-border)', borderRadius: 10 }} formatter={(v) => [`${v}%`, 'Ocupación']} />
                  <Line type="monotone" dataKey="occ" stroke="var(--dk-primary)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Arrivals / departures */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-bold text-heading flex items-center gap-2 mb-3"><LogIn size={17} className="text-success" /> Próximos arribos</h3>
          <div className="space-y-2">
            {arr.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                <div><p className="font-semibold text-text">{a.guest}</p><p className="text-xs text-muted">{a.room} · {a.people} pax · {a.nights} noches</p></div>
                <Badge tone="info">{a.time}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-bold text-heading flex items-center gap-2 mb-3"><LogOut size={17} className="text-warning" /> Salidas de hoy</h3>
          <div className="space-y-2">
            {dep.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                <div><p className="font-semibold text-text">{d.guest}</p><p className="text-xs text-muted">{d.room}</p></div>
                {d.balance > 0 ? <Badge tone="danger">Saldo {money(d.balance)}</Badge> : <Badge tone="success">Al día</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { Timer, Users, Home, TrendingUp } from 'lucide-react'
import { KPICard, ChartCard, BarRow, Card, Badge, Skeleton, realestateApi } from '@kit'

const sem = (min) => (min <= 10 ? 'success' : min <= 30 ? 'warning' : 'danger')
const semColor = (min) => (min <= 10 ? 'var(--dk-success)' : min <= 30 ? 'var(--dk-warning)' : 'var(--dk-danger)')

export default function Dashboard() {
  const [d, setD] = useState(null)
  const [agents, setAgents] = useState([])
  useEffect(() => {
    realestateApi.getDashboard().then(setD)
    realestateApi.getAgents().then(setAgents)
  }, [])

  const maxOrigin = d ? Math.max(...d.leadsByOrigin.map((o) => o.value)) : 1
  const maxFunnel = d ? d.funnel[0].value : 1

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-heading">Panel · Terranova Propiedades</h1>
        <p className="text-sm text-muted">Rendimiento comercial · agosto 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {d ? (
          <>
            <div id="tour-response">
              <KPICard label="Tiempo medio de respuesta" value={`${d.avgResponseMin} min`} delta={-38} deltaLabel="vs mes ant." icon={Timer} tone="success" />
            </div>
            <KPICard label="Consultas (mes)" value={d.funnel[0].value} delta={11} icon={Users} />
            <KPICard label="Cerrados (mes)" value={d.funnel[4].value} delta={5} icon={TrendingUp} />
            <KPICard label="Propiedades activas" value={d.propertiesByStatus[0].value} icon={Home} />
          </>
        ) : [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded" />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Leads por origen">
          {!d ? <Skeleton className="h-56 rounded" /> : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.leadsByOrigin} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="origin" width={90} tick={{ fontSize: 12, fill: 'var(--dk-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--dk-elevated)', border: '1px solid var(--dk-border)', borderRadius: 10 }} cursor={{ fill: 'var(--dk-surface-2)' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
                    {d.leadsByOrigin.map((o) => <Cell key={o.origin} fill={o.value === maxOrigin ? 'var(--dk-primary)' : 'var(--dk-info)'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Embudo comercial" subtitle="De la consulta al cierre">
          {!d ? <Skeleton className="h-56 rounded" /> : (
            <div className="pt-1">
              {d.funnel.map((s, i) => (
                <BarRow key={s.stage} label={s.stage} value={s.value} max={maxFunnel}
                  color={`color-mix(in srgb, var(--dk-primary) ${100 - i * 14}%, var(--dk-info))`} />
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Response time per agent — semaphore */}
      <ChartCard title="Tiempo de respuesta por agente" subtitle="El KPI que ancla la venta: quién contesta rápido y quién no">
        <div className="space-y-2">
          {agents.map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: semColor(a.avgResponseMin) }} />
              <span className="flex-1 text-sm font-semibold text-text">{a.name}</span>
              <span className="text-xs text-muted hidden sm:inline">{a.leads} leads · {a.deals} cierres</span>
              <Badge tone={sem(a.avgResponseMin)}>{a.avgResponseMin} min</Badge>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}

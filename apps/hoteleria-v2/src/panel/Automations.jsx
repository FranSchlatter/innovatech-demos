import { useEffect, useState } from 'react'
import { Workflow, Zap } from 'lucide-react'
import { Card, Badge, Toggle, Skeleton, hotelApi } from '@kit'

export default function Automations() {
  const [flows, setFlows] = useState(null)
  useEffect(() => { hotelApi.getAutomations().then(setFlows) }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-heading flex items-center gap-2"><Workflow size={20} className="text-primary" /> Automatizaciones</h1>
        <p className="text-sm text-muted">Flujos que corren solos: carrito abandonado, pre-arribo, reseñas…</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {!flows && [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded" />)}
        {flows?.map((f) => (
          <Card key={f.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-heading flex items-center gap-1.5"><Zap size={15} className="text-primary" /> {f.name}</p>
                <p className="text-xs text-muted mt-0.5">Disparador: {f.trigger} · {f.steps} pasos</p>
              </div>
              <Toggle checked={f.active} onChange={() => {}} />
            </div>
            <div className="flex gap-4 mt-3 text-sm">
              <div><p className="text-xs text-muted">Enviados</p><p className="font-bold text-heading">{f.sent}</p></div>
              <div><p className="text-xs text-muted">Conversión</p><p className="font-bold text-success">{f.sent ? Math.round((f.conv / f.sent) * 100) : 0}%</p></div>
              <div className="ml-auto self-center">{f.active ? <Badge tone="success" dot>Activo</Badge> : <Badge tone="neutral">Inactivo</Badge>}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

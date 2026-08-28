import { useEffect, useState } from 'react'
import { Share2, Eye, MessageSquare } from 'lucide-react'
import { Card, Badge, Toggle, Skeleton, realestateApi } from '@kit'

export default function Diffusion() {
  const [portals, setPortals] = useState(null)
  useEffect(() => { realestateApi.getPortals().then(setPortals) }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-heading flex items-center gap-2"><Share2 size={20} className="text-primary" /> Difusión por portal</h1>
        <p className="text-sm text-muted">Publicá en todos los portales desde un lugar y medí vistas y consultas por canal</p>
      </div>
      <p className="text-xs text-muted">Propiedad de ejemplo: <b className="text-text">PROP-002 · Depto 3 amb Candioti</b></p>
      <div className="grid sm:grid-cols-2 gap-3">
        {!portals && [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded" />)}
        {portals?.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-heading">{p.name}</p>
              <Toggle checked={p.published} onChange={() => {}} />
            </div>
            <div className="mt-3">
              {p.published ? <Badge tone="success" dot>Publicada</Badge> : <Badge tone="neutral">Sin publicar</Badge>}
            </div>
            {p.published && (
              <div className="flex gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted"><Eye size={14} /> {p.views} vistas</span>
                <span className="flex items-center gap-1.5 text-muted"><MessageSquare size={14} /> {p.inquiries} consultas</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

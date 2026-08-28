import { useEffect, useState } from 'react'
import { Bot, Star } from 'lucide-react'
import { Inbox, Badge, Skeleton, realestateApi } from '@kit'

const scoreTone = (s) => (s >= 75 ? 'success' : s >= 50 ? 'warning' : 'danger')

export default function InboxScreen() {
  const [convs, setConvs] = useState(null)
  useEffect(() => { realestateApi.getConversations().then(setConvs) }, [])

  const renderContext = (c) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Calificación IA</p>
        <Badge tone={scoreTone(c.score)} dot>Score {c.score}</Badge>
      </div>
      {c.qualification && Object.entries(c.qualification).map(([k, v]) => (
        <div key={k}>
          <p className="text-[10px] uppercase text-muted">{k}</p>
          <p className="text-sm text-text">{v}</p>
        </div>
      ))}
      <div className="rounded p-3 mt-2" style={{ background: 'var(--dk-primary-weak)' }}>
        <p className="text-xs font-semibold text-primary flex items-center gap-1.5"><Star size={13} /> Lead calificado automáticamente</p>
        <p className="text-xs text-muted mt-1">Presupuesto, zona, plazo, crédito y garantía detectados en la conversación.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-4" id="tour-inbox">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-heading">Bandeja + IA</h1>
          <p className="text-sm text-muted">La IA responde, califica el lead y agenda la visita</p>
        </div>
        <Badge tone="primary" dot><Bot size={12} className="inline mr-1" />IA calificando 24/7</Badge>
      </div>
      {!convs ? <Skeleton className="h-[520px] w-full rounded" /> : (
        <Inbox conversations={convs} renderContext={renderContext} onTakeOver={() => {}} />
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Bot, Sparkles } from 'lucide-react'
import { Inbox, Badge, Skeleton, hotelApi } from '@kit'

export default function InboxScreen() {
  const [convs, setConvs] = useState(null)
  useEffect(() => { hotelApi.getConversations().then(setConvs) }, [])

  const renderContext = (c) => (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contexto del huésped</p>
      {c.tag && <Badge tone="info">{c.tag}</Badge>}
      <div><p className="text-[10px] uppercase text-muted">Reserva</p><p className="text-sm text-text">{c.context.reservation}</p></div>
      <div><p className="text-[10px] uppercase text-muted">Estadías previas</p><p className="text-sm text-text">{c.context.previousStays}</p></div>
      {c.context.notes && <div><p className="text-[10px] uppercase text-muted">Notas</p><p className="text-sm text-text">{c.context.notes}</p></div>}
      {c.aiHandled && (
        <div className="rounded p-3 mt-2" style={{ background: 'var(--dk-primary-weak)' }}>
          <p className="text-xs font-semibold text-primary flex items-center gap-1.5"><Sparkles size={13} /> Agente IA</p>
          <p className="text-xs text-muted mt-1">Respondió consultando disponibilidad real y ofreció una habitación con precio.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4" id="tour-inbox">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-heading">Bandeja unificada</h1>
          <p className="text-sm text-muted">WhatsApp · Instagram · Web · Booking — con agente de IA</p>
        </div>
        <Badge tone="primary" dot><Bot size={12} className="inline mr-1" />IA respondiendo 24/7</Badge>
      </div>
      {!convs ? <Skeleton className="h-[520px] w-full rounded" /> : (
        <Inbox conversations={convs} renderContext={renderContext} onTakeOver={() => {}} />
      )}
    </div>
  )
}

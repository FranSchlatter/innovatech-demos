import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles, MessageCircle, Globe, LayoutGrid, Building2, Wallet } from 'lucide-react'
import { mockConversations, SCORE } from '../../../data/admin/mockConversations'

const CHANNEL = {
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-success' },
  portal: { icon: LayoutGrid, label: 'Portal', color: 'text-accent' },
  web: { icon: Globe, label: 'Web', color: 'text-info' }
}

function Bubble({ m }) {
  const mine = m.from === 'ai' || m.from === 'staff'
  const isAI = m.from === 'ai'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${
        mine ? (isAI ? 'bg-primary/10 border border-primary/20' : 'bg-surface-alt border border-border') : 'bg-bg border border-border'
      }`}>
        {isAI && <p className="text-[10px] font-semibold text-primary flex items-center gap-1 mb-0.5"><Sparkles className="w-3 h-3" /> Agente IA</p>}
        {m.from === 'staff' && <p className="text-[10px] font-semibold text-muted mb-0.5">Asesor</p>}
        <p className="text-sm text-text">{m.text}</p>
        {m.meta && <p className="text-[10px] text-muted mt-1 italic">{m.meta}</p>}
        <p className="text-[10px] text-muted mt-0.5 text-right">{m.at}</p>
      </div>
    </div>
  )
}

export default function InboxManagement() {
  const [activeId, setActiveId] = useState(mockConversations[0].id)
  const active = mockConversations.find((c) => c.id === activeId)
  const sc = SCORE[active.score]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-text">Bandeja IA</h1>
          <p className="text-muted mt-1">WhatsApp · Portales · Web — la IA responde, califica y agenda visitas 24/7</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/15 text-primary">
          <Bot className="w-3.5 h-3.5" /> IA respondiendo 24/7
        </span>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr_260px] gap-4">
        {/* List */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          {mockConversations.map((c) => {
            const ch = CHANNEL[c.channel] || CHANNEL.web
            const Icon = ch.icon
            const isActive = c.id === activeId
            const s = SCORE[c.score]
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`w-full flex items-center gap-3 p-3 text-left border-b border-border last:border-0 transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-surface-alt'}`}>
                <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text truncate">{c.name}</p>
                    <span className="text-[10px] text-muted flex-shrink-0">{c.lastAt}</span>
                  </div>
                  <p className="text-xs text-muted truncate flex items-center gap-1">
                    <Icon className={`w-3 h-3 ${ch.color}`} /> {c.messages[c.messages.length - 1].text}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${s.cls}`}>{s.label}</span>
              </button>
            )
          })}
        </div>

        {/* Thread */}
        <motion.div key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-surface rounded-xl border border-border flex flex-col min-h-[420px]">
          <div className="flex items-center gap-3 p-3 border-b border-border">
            <img src={active.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">{active.name}</p>
              <p className="text-xs text-muted">{CHANNEL[active.channel]?.label}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sc.cls}`}>Lead {sc.label}</span>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px]">
            {active.messages.map((m, i) => <Bubble key={i} m={m} />)}
          </div>
        </motion.div>

        {/* Context */}
        <div className="bg-surface rounded-xl border border-border p-4 space-y-3 h-fit">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contexto del lead</p>
          <span className="inline-flex text-xs font-medium px-2 py-1 rounded-full bg-accent/15 text-accent">{active.tag}</span>
          <div><p className="text-[10px] uppercase text-muted flex items-center gap-1"><Building2 className="w-3 h-3" /> Propiedad</p><p className="text-sm text-text">{active.context.property}</p></div>
          <div><p className="text-[10px] uppercase text-muted flex items-center gap-1"><Wallet className="w-3 h-3" /> Presupuesto</p><p className="text-sm text-text">{active.context.budget}</p></div>
          <div><p className="text-[10px] uppercase text-muted">Operación</p><p className="text-sm text-text">{active.context.operation}</p></div>
          <div><p className="text-[10px] uppercase text-muted">Agente asignado</p><p className="text-sm text-text">{active.context.agent}</p></div>
          {active.aiHandled && (
            <div className="rounded-lg p-3 bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Agente IA</p>
              <p className="text-xs text-muted mt-1">Respondió al instante, calificó el lead y agendó/derivó sin ocupar tiempo del equipo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

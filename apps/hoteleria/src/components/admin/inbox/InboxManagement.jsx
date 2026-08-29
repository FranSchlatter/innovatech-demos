import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles, MessageCircle, Instagram, Globe, CalendarDays, User } from 'lucide-react'
import { mockConversations } from '../../../data/admin/mockConversations'

const CHANNEL = {
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
  web: { icon: Globe, label: 'Web', color: 'text-blue-500' },
  booking: { icon: CalendarDays, label: 'Booking', color: 'text-indigo-500' }
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
        {m.from === 'staff' && <p className="text-[10px] font-semibold text-muted mb-0.5">Equipo</p>}
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-text">Bandeja unificada</h1>
          <p className="text-sm text-muted">WhatsApp · Instagram · Web · Booking — con agente de IA</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
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
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`w-full flex items-center gap-3 p-3 text-left border-b border-border last:border-0 transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-surface-alt'}`}>
                <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text truncate">{c.guest}</p>
                    <span className="text-[10px] text-muted flex-shrink-0">{c.lastAt}</span>
                  </div>
                  <p className="text-xs text-muted truncate flex items-center gap-1">
                    <Icon className={`w-3 h-3 ${ch.color}`} /> {c.messages[c.messages.length - 1].text}
                  </p>
                </div>
                {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-contrast text-[10px] font-bold grid place-items-center flex-shrink-0">{c.unread}</span>}
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
              <p className="text-sm font-semibold text-text">{active.guest}</p>
              <p className="text-xs text-muted">{CHANNEL[active.channel]?.label}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${active.aiHandled ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
              {active.aiHandled ? 'Resuelto por IA' : 'Con equipo'}
            </span>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px]">
            {active.messages.map((m, i) => <Bubble key={i} m={m} />)}
          </div>
        </motion.div>

        {/* Context */}
        <div className="bg-surface rounded-xl border border-border p-4 space-y-3 h-fit">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contexto del huésped</p>
          <span className="inline-flex text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">{active.tag}</span>
          <div><p className="text-[10px] uppercase text-muted">Reserva</p><p className="text-sm text-text">{active.context.reservation}</p></div>
          <div><p className="text-[10px] uppercase text-muted flex items-center gap-1"><User className="w-3 h-3" /> Estadías previas</p><p className="text-sm text-text">{active.context.previousStays}</p></div>
          {active.context.notes && <div><p className="text-[10px] uppercase text-muted">Notas</p><p className="text-sm text-text">{active.context.notes}</p></div>}
          {active.aiHandled && (
            <div className="rounded-lg p-3 bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Agente IA</p>
              <p className="text-xs text-muted mt-1">Respondió consultando disponibilidad real y ofreció una habitación con precio, sin intervención humana.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

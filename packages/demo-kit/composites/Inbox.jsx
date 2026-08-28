import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Instagram, Globe, Building2, Bot, User, ArrowLeft, Hand, Send } from 'lucide-react'
import { Badge, Button } from '../primitives/basics'
import { timeAgo } from '../lib/format'
const cx = (...c) => c.filter(Boolean).join(' ')

const CHANNELS = {
  whatsapp: { label: 'WhatsApp', color: '#25D366', Icon: MessageCircle },
  instagram: { label: 'Instagram', color: '#E1306C', Icon: Instagram },
  web: { label: 'Web', color: '#66E0FF', Icon: Globe },
  booking: { label: 'Booking', color: '#3B5CF6', Icon: Building2 },
  expedia: { label: 'Expedia', color: '#FBBF24', Icon: Building2 },
  zonaprop: { label: 'ZonaProp', color: '#F6B100', Icon: Building2 }
}
const chan = (id) => CHANNELS[id] || CHANNELS.web

function ChannelChip({ id }) {
  const c = chan(id)
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded"
      style={{ color: c.color, background: `color-mix(in srgb, ${c.color} 16%, transparent)` }}>
      <c.Icon size={11} /> {c.label}
    </span>
  )
}

function Bubble({ m }) {
  const isAI = m.from === 'ai'
  const isStaff = m.from === 'staff'
  const mine = isAI || isStaff
  return (
    <div className={cx('flex flex-col max-w-[82%]', mine ? 'items-end self-end' : 'items-start self-start')}>
      <div className={cx('rounded-2xl px-3.5 py-2 text-sm',
        isAI ? 'bg-primary-weak text-text border border-primary'
          : isStaff ? 'bg-surface-2 text-text'
            : 'bg-surface-2 text-text')}>
        {m.text}
      </div>
      <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-muted">
        {isAI && <Bot size={11} className="text-primary" />}
        {m.meta && <span className={isAI ? 'text-primary' : ''}>{m.meta}</span>}
        <span>· {timeAgo(m.at)}</span>
      </div>
    </div>
  )
}

/**
 * Unified inbox — list + thread + context. Same component for hotel (H9) & real estate (I7).
 * conversations: [{ id, channel, guest|name, avatar, unread, lastAt, aiHandled, tag, messages, context, ... }]
 * renderContext(conv): optional right-panel content.
 */
export function Inbox({ conversations = [], renderContext, onTakeOver, className }) {
  const [selId, setSelId] = useState(conversations[0]?.id)
  const [mobileThread, setMobileThread] = useState(false)
  const conv = conversations.find((c) => c.id === selId) || conversations[0]
  const nameOf = (c) => c.guest || c.name

  return (
    <div className={cx('grid md:grid-cols-[300px_1fr_260px] lg:grid-cols-[320px_1fr_280px] border border-border rounded overflow-hidden bg-surface', className)}
      style={{ minHeight: 520 }}>
      {/* List */}
      <div className={cx('border-r border-border overflow-y-auto', mobileThread && 'hidden md:block')}>
        <div className="px-4 py-3 border-b border-border sticky top-0 bg-surface z-10">
          <p className="font-bold text-heading text-sm">Bandeja unificada</p>
          <p className="text-[11px] text-muted">{conversations.length} conversaciones</p>
        </div>
        {conversations.map((c) => (
          <button key={c.id} onClick={() => { setSelId(c.id); setMobileThread(true) }}
            className={cx('w-full text-left px-4 py-3 border-b border-border flex gap-3 transition',
              c.id === conv?.id ? 'bg-surface-2' : 'hover:bg-surface-2')}>
            <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-text truncate">{nameOf(c)}</span>
                <span className="text-[10px] text-muted shrink-0">{timeAgo(c.lastAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ChannelChip id={c.channel} />
                {c.aiHandled && <Bot size={12} className="text-primary" />}
              </div>
              <p className="text-xs text-muted truncate mt-1">{c.messages[c.messages.length - 1]?.text}</p>
            </div>
            {c.unread > 0 && <span className="shrink-0 self-center min-w-5 h-5 px-1 grid place-items-center rounded-full bg-primary text-primary-contrast text-[10px] font-bold">{c.unread}</span>}
          </button>
        ))}
      </div>

      {/* Thread */}
      <div className={cx('flex flex-col', !mobileThread && 'hidden md:flex')}>
        {conv && (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
              <button className="md:hidden text-muted" onClick={() => setMobileThread(false)}><ArrowLeft size={18} /></button>
              <img src={conv.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-text truncate">{nameOf(conv)}</p>
                <ChannelChip id={conv.channel} />
              </div>
              {conv.aiHandled
                ? <Badge tone="primary" dot>IA activa</Badge>
                : <Badge tone="warning" dot>Humano</Badge>}
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 dk-hex-pattern">
              {conv.messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className={cx('flex', (m.from === 'ai' || m.from === 'staff') ? 'justify-end' : 'justify-start')}>
                  <Bubble m={m} />
                </motion.div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-border flex items-center gap-2">
              {conv.aiHandled && (
                <Button size="sm" variant="secondary" icon={Hand} onClick={() => onTakeOver?.(conv)}>Tomar la conversación</Button>
              )}
              <div className="flex-1 flex items-center gap-2 bg-surface-2 rounded-full px-3 py-1.5">
                <input placeholder="Escribí un mensaje…" className="flex-1 bg-transparent text-sm text-text outline-none" />
                <Send size={16} className="text-primary" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Context */}
      <div className="border-l border-border p-4 hidden md:block overflow-y-auto">
        {conv && (renderContext ? renderContext(conv) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contexto</p>
            {conv.tag && <Badge tone="info">{conv.tag}</Badge>}
            {conv.context && Object.entries(conv.context).map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] uppercase text-muted">{k}</p>
                <p className="text-sm text-text">{String(v)}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

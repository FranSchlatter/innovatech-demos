import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Sparkles, MessageCircle, Instagram, Globe, CalendarDays, User,
  Headset, Send, ChevronDown, Zap
} from 'lucide-react'
import { mockConversations } from '../../../data/admin/mockConversations'
import { useLiveChat } from '../../../hooks/useLiveChat'

const CHANNEL = {
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
  web: { icon: Globe, label: 'Web', color: 'text-blue-500' },
  booking: { icon: CalendarDays, label: 'Booking', color: 'text-indigo-500' },
  portal: { icon: Headset, label: 'Portal · Chat en vivo', color: 'text-accent' }
}

// Staff-side quick replies (H4 templates).
const TEMPLATES = [
  'Gracias por su consulta. Le confirmo disponibilidad para las fechas solicitadas.',
  'Le informo que su solicitud ha sido procesada. Cualquier consulta no dude en contactarnos.',
  '¡Bienvenido/a! Su habitación estará lista a partir de las 15:00 hs.',
  'Le enviamos el detalle de la reserva a su email.',
  'Con gusto coordinamos su traslado desde el aeropuerto. ¿Me confirma horario y número de vuelo?',
  'El desayuno se sirve de 7:00 a 10:30 hs en nuestro restaurante principal.',
  'Hemos registrado su pedido, el equipo lo atenderá en breve.',
  'Lamentamos el inconveniente. Enviamos a mantenimiento a la brevedad para resolverlo.'
]

// localStorage key for staff replies appended to the mock conversations (H4).
const INBOX_KEY = 'hotel-admin-inbox'
const PORTAL_ID = '__portal__'

function loadExtraMessages() {
  try {
    const raw = localStorage.getItem(INBOX_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Relative time from an epoch timestamp (new messages). Mock messages keep their
// pre-rendered `at` string.
function timeAgo(ts) {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  return `hace ${Math.floor(h / 24)} d`
}

function messageTime(m) {
  return m.at || (m.ts ? timeAgo(m.ts) : '')
}

function Bubble({ m }) {
  const mine = m.from === 'ai' || m.from === 'staff'
  const isAI = m.from === 'ai'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${
        mine ? (isAI ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-border') : 'bg-bg border border-border'
      }`}>
        {isAI && <p className="text-[10px] font-semibold text-primary flex items-center gap-1 mb-0.5"><Sparkles className="w-3 h-3" /> Agente IA</p>}
        {m.from === 'staff' && <p className="text-[10px] font-semibold text-muted mb-0.5">Equipo</p>}
        <p className="text-sm text-text whitespace-pre-wrap break-words">{m.text}</p>
        {m.meta && <p className="text-[10px] text-muted mt-1 italic">{m.meta}</p>}
        <p className="text-[10px] text-muted mt-0.5 text-right">{messageTime(m)}</p>
      </div>
    </motion.div>
  )
}

// Count of trailing guest messages with no staff/ai reply yet.
function pendingCount(messages) {
  let count = 0
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].from === 'guest') count++
    else break
  }
  return count
}

export default function InboxManagement() {
  const liveChat = useLiveChat()
  const [extraMessages, setExtraMessages] = useState(loadExtraMessages)
  const [activeId, setActiveId] = useState(mockConversations[0].id)
  const [draft, setDraft] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const threadRef = useRef(null)
  const inputRef = useRef(null)

  // Persist staff replies to the mock conversations.
  useEffect(() => {
    try {
      localStorage.setItem(INBOX_KEY, JSON.stringify(extraMessages))
    } catch {
      // Ignore storage errors.
    }
  }, [extraMessages])

  // Build the portal conversation from the shared live-chat state (H5).
  const portalConversation = useMemo(() => {
    const messages = liveChat.messages
    const last = messages[messages.length - 1]
    return {
      id: PORTAL_ID,
      channel: 'portal',
      isPortal: true,
      guest: liveChat.guest?.name ? liveChat.guest.name : 'Huésped · Portal',
      avatar: 'https://picsum.photos/seed/portal-live-guest/80/80',
      unread: pendingCount(messages),
      lastAt: last ? messageTime(last) : 'sin mensajes',
      aiHandled: false,
      tag: 'Chat en vivo',
      context: {
        reservation: liveChat.guest?.reservation ? `#${liveChat.guest.reservation}` : '—',
        previousStays: '—',
        notes: liveChat.guest?.room
          ? `Habitación ${liveChat.guest.room} · escribe desde el portal del huésped.`
          : 'Conversación iniciada desde el portal del huésped.'
      },
      messages
    }
  }, [liveChat.messages, liveChat.guest])

  // Merge appended staff replies onto the mock conversations, portal pinned on top.
  const conversations = useMemo(() => {
    const regular = mockConversations.map((c) => ({
      ...c,
      messages: [...c.messages, ...(extraMessages[c.id] || [])]
    }))
    return [portalConversation, ...regular]
  }, [extraMessages, portalConversation])

  const active = conversations.find((c) => c.id === activeId) || conversations[0]

  // Auto-scroll the thread to the newest message.
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [active?.id, active?.messages.length])

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    if (active.isPortal) {
      // Reply lands in the guest's live chat (H5).
      liveChat.sendMessage(text, 'staff')
    } else {
      const msg = { id: `S-${Date.now()}`, from: 'staff', text, ts: Date.now() }
      setExtraMessages((prev) => ({
        ...prev,
        [active.id]: [...(prev[active.id] || []), msg]
      }))
    }
    setDraft('')
    setShowTemplates(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const applyTemplate = (text) => {
    setDraft(text)
    setShowTemplates(false)
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-text">Bandeja unificada</h1>
          <p className="text-sm text-muted">WhatsApp · Instagram · Web · Booking · Portal — con agente de IA</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
          <Bot className="w-3.5 h-3.5" /> IA respondiendo 24/7
        </span>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr_260px] gap-4">
        {/* List */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden self-start">
          {conversations.map((c) => {
            const ch = CHANNEL[c.channel] || CHANNEL.web
            const Icon = ch.icon
            const isActive = c.id === activeId
            const lastMessage = c.messages[c.messages.length - 1]
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`w-full flex items-center gap-3 p-3 text-left border-b border-border last:border-0 transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-bg'}`}>
                <div className="relative flex-shrink-0">
                  <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  {c.isPortal && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent border-2 border-surface grid place-items-center">
                      <Headset className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text truncate">{c.guest}</p>
                    <span className="text-[10px] text-muted flex-shrink-0">{c.lastAt}</span>
                  </div>
                  <p className="text-xs text-muted truncate flex items-center gap-1">
                    <Icon className={`w-3 h-3 flex-shrink-0 ${ch.color}`} /> {lastMessage ? lastMessage.text : 'Sin mensajes aún'}
                  </p>
                </div>
                {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-contrast text-[10px] font-bold grid place-items-center flex-shrink-0">{c.unread}</span>}
              </button>
            )
          })}
        </div>

        {/* Thread */}
        <motion.div key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-surface rounded-xl border border-border flex flex-col min-h-[420px] max-h-[560px]">
          <div className="flex items-center gap-3 p-3 border-b border-border">
            <img src={active.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text truncate">{active.guest}</p>
              <p className="text-xs text-muted flex items-center gap-1">
                {(() => { const Ic = (CHANNEL[active.channel] || CHANNEL.web).icon; return <Ic className={`w-3 h-3 ${(CHANNEL[active.channel] || CHANNEL.web).color}`} /> })()}
                {CHANNEL[active.channel]?.label}
              </p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${active.isPortal ? 'bg-accent/10 text-accent' : active.aiHandled ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
              {active.isPortal ? 'Chat en vivo' : active.aiHandled ? 'Resuelto por IA' : 'Con equipo'}
            </span>
          </div>

          {/* Messages */}
          <div ref={threadRef} className="flex-1 p-4 space-y-3 overflow-y-auto">
            {active.messages.length === 0 ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center text-muted gap-2">
                <Headset className="w-10 h-10 opacity-40" />
                <p className="text-sm">El huésped aún no inició el chat.</p>
                <p className="text-xs">Cuando escriba desde el portal, aparecerá acá en tiempo real.</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {active.messages.map((m, i) => <Bubble key={m.id || `${active.id}-${i}`} m={m} />)}
              </AnimatePresence>
            )}
          </div>

          {/* Composer (H4) */}
          <div className="border-t border-border p-3 space-y-2">
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg bg-bg border border-border p-1.5">
                    {TEMPLATES.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => applyTemplate(t)}
                        className="w-full text-left text-xs text-text px-2.5 py-1.5 rounded-md hover:bg-bg transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setShowTemplates((v) => !v)}
                title="Respuestas rápidas"
                className={`flex-shrink-0 h-9 px-2.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-medium ${showTemplates ? 'bg-primary text-primary-contrast border-primary' : 'bg-bg border-border text-muted hover:text-text'}`}
              >
                <Zap className="w-3.5 h-3.5" />
                <ChevronDown className={`w-3 h-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
              </button>
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Escribir como Equipo${active.isPortal ? ' (llega al chat del huésped)' : ''}…`}
                className="flex-1 resize-none bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-primary max-h-24"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim()}
                className="flex-shrink-0 h-9 w-9 grid place-items-center rounded-lg bg-primary text-primary-contrast disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                title="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Context */}
        <div className="bg-surface rounded-xl border border-border p-4 space-y-3 h-fit">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contexto del huésped</p>
          <span className="inline-flex text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">{active.tag}</span>
          <div><p className="text-[10px] uppercase text-muted">Reserva</p><p className="text-sm text-text">{active.context.reservation}</p></div>
          <div><p className="text-[10px] uppercase text-muted flex items-center gap-1"><User className="w-3 h-3" /> Estadías previas</p><p className="text-sm text-text">{active.context.previousStays}</p></div>
          {active.context.notes && <div><p className="text-[10px] uppercase text-muted">Notas</p><p className="text-sm text-text">{active.context.notes}</p></div>}
          {active.isPortal ? (
            <div className="rounded-lg p-3 bg-accent/10 border border-accent/20">
              <p className="text-xs font-semibold text-accent flex items-center gap-1.5"><Headset className="w-3.5 h-3.5" /> Chat en vivo</p>
              <p className="text-xs text-muted mt-1">Conectado con el portal del huésped. Lo que escribas acá le llega al instante; si nadie responde en 5 s, la IA envía un aviso automático.</p>
            </div>
          ) : active.aiHandled && (
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

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Sparkles, MessageCircle, Globe, LayoutGrid, Building2, Wallet, Send, FileText, X } from 'lucide-react'
import { mockConversations, SCORE, INBOX_TEMPLATES } from '../../../data/admin/mockConversations'

const STORAGE_KEY = 'inmob-admin-inbox'

const CHANNEL = {
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-success' },
  portal: { icon: LayoutGrid, label: 'Portal', color: 'text-accent' },
  web: { icon: Globe, label: 'Web', color: 'text-info' }
}

// Current wall-clock time as HH:MM (runtime, not the mock relative labels)
function nowTime() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function Bubble({ m }) {
  const mine = m.from === 'ai' || m.from === 'staff'
  const isAI = m.from === 'ai'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${
        mine ? (isAI ? 'bg-primary/10 border border-primary/20' : 'bg-accent/10 border border-accent/20') : 'bg-bg border border-border'
      }`}>
        {isAI && <p className="text-[10px] font-semibold text-primary flex items-center gap-1 mb-0.5"><Sparkles className="w-3 h-3" /> Agente IA</p>}
        {m.from === 'staff' && <p className="text-[10px] font-semibold text-accent mb-0.5">Asesor</p>}
        <p className="text-sm text-text whitespace-pre-wrap">{m.text}</p>
        {m.meta && <p className="text-[10px] text-muted mt-1 italic">{m.meta}</p>}
        <p className="text-[10px] text-muted mt-0.5 text-right">{m.at}</p>
      </div>
    </div>
  )
}

export default function InboxManagement() {
  const [activeId, setActiveId] = useState(mockConversations[0].id)
  // Staff-sent messages keyed by conversation id — persisted in localStorage
  const [sent, setSent] = useState({})
  const [draft, setDraft] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef(null)

  const active = mockConversations.find((c) => c.id === activeId)
  const sc = SCORE[active.score]

  // Load persisted messages once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setSent(JSON.parse(saved))
    } catch (err) {
      console.error('Error loading inbox:', err)
    }
  }, [])

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sent))
    } catch (err) {
      console.error('Error saving inbox:', err)
    }
  }, [sent])

  // Reset composer when switching conversation
  useEffect(() => {
    setDraft('')
    setShowTemplates(false)
  }, [activeId])

  const threadMessages = [...active.messages, ...(sent[active.id] || [])]

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [threadMessages.length, activeId])

  const lastText = (c) => {
    const extra = sent[c.id]
    if (extra && extra.length) return extra[extra.length - 1].text
    return c.messages[c.messages.length - 1].text
  }

  const send = () => {
    const value = draft.trim()
    if (!value) return
    const msg = { from: 'staff', at: nowTime(), text: value, _new: true }
    setSent((prev) => ({ ...prev, [activeId]: [...(prev[activeId] || []), msg] }))
    setDraft('')
    setShowTemplates(false)
  }

  const pickTemplate = (t) => {
    setDraft(t.text)
    setShowTemplates(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

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
        <div className="bg-surface rounded-xl border border-border overflow-hidden h-fit">
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
                    <Icon className={`w-3 h-3 ${ch.color} flex-shrink-0`} /> {lastText(c)}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${s.cls}`}>{s.label}</span>
              </button>
            )
          })}
        </div>

        {/* Thread */}
        <motion.div key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-surface rounded-xl border border-border flex flex-col min-h-[420px] max-h-[600px]">
          <div className="flex items-center gap-3 p-3 border-b border-border">
            <img src={active.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">{active.name}</p>
              <p className="text-xs text-muted">{CHANNEL[active.channel]?.label}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sc.cls}`}>Lead {sc.label}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {threadMessages.map((m, i) => (
              <motion.div
                key={i}
                initial={m._new ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Bubble m={m} />
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="relative border-t border-border p-3">
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-border bg-surface shadow-lg overflow-hidden z-10"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-text">Plantillas</p>
                    <button type="button" onClick={() => setShowTemplates(false)} className="text-muted hover:text-text">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {INBOX_TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => pickTemplate(t)}
                        className="w-full text-left px-3 py-2 border-b border-border last:border-0 hover:bg-surface-alt transition-colors"
                      >
                        <p className="text-xs font-semibold text-text">{t.label}</p>
                        <p className="text-[11px] text-muted line-clamp-2">{t.text}</p>
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
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors shrink-0 ${
                  showTemplates ? 'border-accent text-accent bg-accent/10' : 'border-border text-muted hover:text-text hover:bg-surface-alt'
                }`}
                aria-label="Plantillas"
                title="Plantillas"
              >
                <FileText className="w-4 h-4" />
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Escribí un mensaje…"
                className="flex-1 resize-none max-h-28 rounded-lg border border-border bg-bg text-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <button
                type="button"
                onClick={send}
                disabled={!draft.trim()}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
                aria-label="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
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

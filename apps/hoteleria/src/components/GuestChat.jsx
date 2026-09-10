import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Headset } from 'lucide-react'

// Presentational live-chat window for the guest portal (H5). State lives in the
// parent (GuestPortal) via the shared useLiveChat hook, so the same messages
// surface in the admin inbox (Bandeja IA).

function timeAgo(ts) {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  return `hace ${Math.floor(h / 24)} d`
}

function ChatBubble({ from, text, ts }) {
  const mine = from === 'guest'
  const isAI = from === 'ai'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${
        mine ? 'bg-accent text-white' : 'bg-surface border border-border text-text'
      }`}>
        {isAI && (
          <p className="text-[10px] font-semibold text-accent flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3 h-3" /> Asistente
          </p>
        )}
        {from === 'staff' && (
          <p className="text-[10px] font-semibold text-muted mb-0.5">Recepción</p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        {ts && <p className={`text-[10px] mt-0.5 text-right ${mine ? 'text-white/70' : 'text-muted'}`}>{timeAgo(ts)}</p>}
      </div>
    </motion.div>
  )
}

export default function GuestChat({ open, onClose, guestName, messages, draft, setDraft, onSend }) {
  const scrollRef = useRef(null)

  // Auto-scroll to the newest message whenever the thread changes or opens.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const firstName = (guestName || 'huésped').split(' ')[0]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (mobile only — desktop is a floating widget) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 sm:hidden"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed z-50 bg-bg flex flex-col overflow-hidden shadow-2xl
              inset-x-0 bottom-0 h-[85vh] rounded-t-3xl
              sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[560px] sm:rounded-2xl sm:border sm:border-border"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-accent text-white flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Headset className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-tight">Live Chat</p>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-300 inline-block" />
                  Concierge en línea
                </p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors" title="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Persistent greeting (UI only, not stored) */}
              <ChatBubble
                from="ai"
                text={`¡Hola ${firstName}! 👋 Soy el asistente del hotel. ¿En qué puedo ayudarte? Escribinos y un agente se suma a la conversación enseguida.`}
              />
              {messages.map((m) => (
                <ChatBubble key={m.id} from={m.from} text={m.text} ts={m.ts} />
              ))}
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-border bg-surface flex items-end gap-2 flex-shrink-0">
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribí tu mensaje…"
                className="flex-1 resize-none bg-bg border border-border rounded-xl px-3.5 py-2.5 text-sm text-text placeholder:text-muted outline-none focus:border-accent max-h-24"
              />
              <button
                onClick={onSend}
                disabled={!draft.trim()}
                className="flex-shrink-0 h-10 w-10 grid place-items-center rounded-xl bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition"
                title="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

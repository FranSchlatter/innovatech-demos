import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Star, MapPin, Wifi, Coffee, Check, ChevronRight, ShieldCheck, ArrowLeft, LayoutDashboard, User } from 'lucide-react'
import {
  useDemo, Button, Card, Badge, Skeleton, DateField, Select, Drawer, Input,
  hotelApi, formatMoney
} from '@kit'

function usePrice() {
  const { currency, fx, market } = useDemo()
  return (ars) => {
    if (currency === 'ARS') return formatMoney(ars, 'ARS', market.locale)
    const usd = ars / (fx.USD || 1)
    return formatMoney(Math.round(usd), currency, market.locale)
  }
}

function TopNav({ onEnterPanel, onEnterPortal }) {
  const { isDark, toggleMode, currency, setCurrency, market, lang, setLang } = useDemo()
  return (
    <header className="sticky top-0 z-40 bg-surface backdrop-blur border-b border-border">
      <div className="dk-container flex items-center gap-3 h-16">
        <span className="font-extrabold text-heading text-lg tracking-tight">Costa&nbsp;Serena</span>
        <nav className="hidden lg:flex items-center gap-5 ml-6 text-sm text-muted">
          <a href="#rooms" className="hover:text-primary">Habitaciones</a>
          <a href="#reviews" className="hover:text-primary">Opiniones</a>
          <a href="#location" className="hover:text-primary">Ubicación</a>
        </nav>
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-1 text-xs">
          {['ES', 'EN', 'PT'].map((l) => (
            <button key={l} onClick={() => setLang(l.toLowerCase())}
              className={lang === l.toLowerCase() ? 'text-primary font-bold px-1' : 'text-muted px-1'}>{l}</button>
          ))}
          <span className="text-border">|</span>
          {market.currencies.map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={currency === c ? 'text-primary font-bold px-1' : 'text-muted px-1'}>{c}</button>
          ))}
        </div>
        <button onClick={toggleMode} className="text-muted hover:text-primary text-sm px-2">{isDark ? '☀' : '☾'}</button>
        <button onClick={onEnterPortal} className="hidden sm:inline-flex items-center gap-1 text-sm text-muted hover:text-primary"><User size={15} />Mi reserva</button>
        <Button size="sm" icon={LayoutDashboard} onClick={onEnterPanel}>Panel</Button>
      </div>
    </header>
  )
}

/* H1 — Hero + availability search (above the fold on mobile) */
function Hero({ onSearch }) {
  const [form, setForm] = useState({ checkin: '2026-09-05', checkout: '2026-09-07', guests: 2 })
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <img src="https://picsum.photos/seed/costa-hero/1600/900" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,15,10,.35), rgba(20,15,10,.75))' }} />
      </div>
      <div className="relative dk-container pt-16 pb-10 md:pt-24 md:pb-20 text-white">
        <Badge tone="primary" className="mb-4">Reserva directa · sin comisiones</Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold max-w-2xl leading-tight" style={{ color: '#fff' }}>
          Frente al río, en el corazón de Santa Fe
        </h1>
        <p className="mt-3 text-white/80 max-w-lg">Reservá directo y pagá hasta 15% menos que en las OTAs.</p>

        <Card id="tour-search" className="mt-6 p-4 grid grid-cols-2 md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end max-w-3xl">
          <DateField label="Check-in" value={form.checkin} onChange={(e) => setForm({ ...form, checkin: e.target.value })} />
          <DateField label="Check-out" value={form.checkout} onChange={(e) => setForm({ ...form, checkout: e.target.value })} />
          <Select label="Huéspedes" value={form.guests} onChange={(e) => setForm({ ...form, guests: +e.target.value })}
            options={[1, 2, 3, 4].map((n) => ({ value: n, label: `${n} huésped${n > 1 ? 'es' : ''}` }))} />
          <Button icon={Search} className="col-span-2 md:col-span-1 h-[42px]" onClick={() => onSearch(form)}>Buscar</Button>
        </Card>
      </div>
    </section>
  )
}

/* H2 — Availability results with inline rate expansion */
function Availability({ query, onReserve }) {
  const [data, setData] = useState(null)
  const [openType, setOpenType] = useState(null)
  const price = usePrice()
  useEffect(() => {
    setData(null)
    hotelApi.getAvailability(query).then(setData)
  }, [query])

  return (
    <section id="availability" className="dk-section bg-background">
      <div className="dk-container">
        <h2 className="text-2xl font-bold text-heading mb-1">Disponibilidad</h2>
        <p className="text-muted text-sm mb-5">{query.checkin} → {query.checkout} · {query.guests} huéspedes</p>
        <div className="space-y-3">
          {!data && [1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded" />)}
          {data?.map((rt) => (
            <Card key={rt.typeId} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <img src={rt.image} alt="" className="sm:w-56 h-40 sm:h-auto object-cover" />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-heading">{rt.name}</h3>
                      <p className="text-xs text-muted mt-0.5 flex items-center gap-2">
                        <Users size={13} /> hasta {rt.capacity} · {rt.size} m²
                      </p>
                    </div>
                    {rt.available <= 2 && <Badge tone="warning">¡Últimas {rt.available}!</Badge>}
                  </div>
                  <p className="text-sm text-muted mt-2">{rt.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted">desde <b className="text-heading text-base">{price(rt.rates[2].price)}</b> /noche</span>
                    <Button size="sm" variant="secondary" onClick={() => setOpenType(openType === rt.typeId ? null : rt.typeId)}>
                      {openType === rt.typeId ? 'Ocultar tarifas' : 'Ver tarifas'}
                    </Button>
                  </div>

                  {openType === rt.typeId && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 border-t border-border pt-3 space-y-2">
                      {rt.rates.map((r) => (
                        <div key={r.id} className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="text-sm">
                            <span className="font-semibold text-text">{r.label}</span>
                            <span className="ml-2 text-xs text-muted">
                              {r.breakfast ? 'Con desayuno' : 'Solo habitación'} · {r.refundable ? 'Reembolsable' : 'No reembolsable'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-heading">{price(r.price)}</span>
                            <Button size="sm" onClick={() => onReserve(rt, r)}>Reservar</Button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

/* H4 — Checkout in 3 steps (Drawer) */
function Checkout({ open, onClose, selection }) {
  const [step, setStep] = useState(1)
  const [extras, setExtras] = useState({})
  const [upsells, setUpsells] = useState([])
  const price = usePrice()
  useEffect(() => { if (open) { setStep(1); setExtras({}) } }, [open])
  useEffect(() => { hotelApi.getUpsells().then(setUpsells) }, [])
  if (!selection) return null

  const base = selection.rate.price * 2 // 2 nights demo
  const extrasTotal = upsells.filter((u) => extras[u.id]).reduce((a, u) => a + u.price, 0)
  const taxes = Math.round((base + extrasTotal) * 0.21)
  const total = base + extrasTotal + taxes

  return (
    <Drawer open={open} onClose={onClose} title="Reservá directo" width="w-full max-w-lg">
      <div className="p-5">
        {/* progress */}
        <div className="flex items-center gap-2 mb-5">
          {['Datos', 'Extras', 'Pago'].map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <span className={`w-6 h-6 grid place-items-center rounded-full text-xs font-bold ${step > i ? 'bg-primary text-primary-contrast' : 'bg-surface-2 text-muted'}`}>{i + 1}</span>
              <span className={`text-xs ${step > i ? 'text-text' : 'text-muted'}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="mb-4 p-3 rounded bg-surface-2 text-sm">
          <p className="font-semibold text-text">{selection.type.name}</p>
          <p className="text-muted text-xs">{selection.rate.label} · 2 noches</p>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <Input label="Nombre y apellido" placeholder="Ej. Carolina Núñez" />
            <Input label="Email" type="email" placeholder="vos@email.com" />
            <Input label="Teléfono (WhatsApp)" placeholder="+54 342 …" />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-2">
            <p className="text-sm text-muted mb-1">Sumá extras a tu estadía</p>
            {upsells.map((u) => (
              <label key={u.id} className="flex items-center justify-between gap-3 p-3 rounded border border-border cursor-pointer">
                <span className="text-sm">
                  <b className="text-text">{u.label}</b>
                  <span className="text-muted text-xs ml-2">{u.per}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-heading">{price(u.price)}</span>
                  <input type="checkbox" checked={!!extras[u.id]} onChange={(e) => setExtras({ ...extras, [u.id]: e.target.checked })} />
                </span>
              </label>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-muted">Elegí cómo pagar</p>
            {['Mercado Pago (tarjeta)', 'QR de pago', 'Transferencia'].map((m) => (
              <label key={m} className="flex items-center gap-3 p-3 rounded border border-border cursor-pointer">
                <input type="radio" name="pay" defaultChecked={m.includes('tarjeta')} />
                <span className="text-sm text-text">{m}</span>
              </label>
            ))}
          </div>
        )}

        {/* totals */}
        <div className="mt-5 border-t border-border pt-3 text-sm space-y-1">
          <div className="flex justify-between text-muted"><span>Alojamiento (2 noches)</span><span>{price(base)}</span></div>
          {extrasTotal > 0 && <div className="flex justify-between text-muted"><span>Extras</span><span>{price(extrasTotal)}</span></div>}
          <div className="flex justify-between text-muted"><span>Impuestos (21%)</span><span>{price(taxes)}</span></div>
          <div className="flex justify-between font-bold text-heading text-base pt-1"><span>Total</span><span>{price(total)}</span></div>
        </div>

        <div className="mt-5 flex gap-2">
          {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Atrás</Button>}
          {step < 3
            ? <Button className="flex-1" icon={ChevronRight} onClick={() => setStep(step + 1)}>Continuar</Button>
            : <Button className="flex-1" icon={Check} onClick={onClose}>Confirmar reserva</Button>}
        </div>
      </div>
    </Drawer>
  )
}

function GuaranteeBand() {
  const items = [
    { icon: ShieldCheck, t: 'Mejor tarifa directa', d: 'Precio garantizado, sin intermediarios.' },
    { icon: Coffee, t: 'Desayuno de cortesía', d: 'En tarifas flexibles.' },
    { icon: Wifi, t: 'WiFi de alta velocidad', d: 'En todo el hotel.' }
  ]
  return (
    <section className="dk-section">
      <div className="dk-container grid sm:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.t} className="p-5 flex gap-3">
            <span className="grid place-items-center w-10 h-10 rounded" style={{ background: 'var(--dk-primary-weak)', color: 'var(--dk-primary)' }}><it.icon size={20} /></span>
            <div><p className="font-bold text-heading">{it.t}</p><p className="text-sm text-muted">{it.d}</p></div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  const [reviews, setReviews] = useState([])
  useEffect(() => { hotelApi.getReviews().then(setReviews) }, [])
  return (
    <section id="reviews" className="dk-section bg-surface-2">
      <div className="dk-container">
        <h2 className="text-2xl font-bold text-heading mb-5">Lo que dicen los huéspedes</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex gap-0.5 mb-2">{Array.from({ length: r.score }).map((_, i) => <Star key={i} size={15} className="fill-current" style={{ color: 'var(--dk-warning)' }} />)}</div>
              <p className="text-sm text-text">"{r.text}"</p>
              <p className="text-xs text-muted mt-3">{r.name} · {r.date}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Location() {
  return (
    <section id="location" className="dk-section">
      <div className="dk-container grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-bold text-heading mb-2">Ubicación privilegiada</h2>
          <p className="text-muted flex items-center gap-2"><MapPin size={16} /> Costanera Oeste, Santa Fe, Argentina</p>
          <p className="text-sm text-muted mt-3">A pasos de la costanera, el centro y los principales atractivos de la ciudad.</p>
        </div>
        <div className="h-56 rounded border border-border" style={{ background: 'linear-gradient(135deg, var(--dk-surface-2), var(--dk-surface))' }} />
      </div>
    </section>
  )
}

export default function HotelSite({ onEnterPanel, onEnterPortal }) {
  const { isDark } = useDemo()
  const [query, setQuery] = useState(null)
  const [selection, setSelection] = useState(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const onSearch = (form) => {
    setQuery(form)
    setTimeout(() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }
  const onReserve = (type, rate) => { setSelection({ type, rate }); setCheckoutOpen(true) }

  return (
    <div className="theme-hotel min-h-screen bg-background" data-mode={isDark ? 'dark' : 'light'}>
      <TopNav onEnterPanel={onEnterPanel} onEnterPortal={onEnterPortal} />
      <Hero onSearch={onSearch} />
      {query && <Availability query={query} onReserve={onReserve} />}
      <GuaranteeBand />
      <Reviews />
      <Location />
      <footer className="border-t border-border py-8">
        <div className="dk-container text-sm text-muted flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 Hotel Costa Serena · Demo InnovaTech</span>
          <button onClick={onEnterPanel} className="text-primary hover:underline flex items-center gap-1"><ArrowLeft size={14} /> Ver panel de gestión</button>
        </div>
      </footer>
      <Checkout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} selection={selection} />
    </div>
  )
}

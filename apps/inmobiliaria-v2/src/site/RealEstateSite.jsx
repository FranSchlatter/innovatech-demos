import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, MapPin, BedDouble, Bath, Car, Maximize, Heart, CreditCard, PawPrint,
  MessageCircle, ChevronLeft, LayoutDashboard, Calculator, Building2
} from 'lucide-react'
import {
  useDemo, Button, Card, Badge, Skeleton, Select, Input, MapView, FilterBar, QuickFilter,
  realestateApi, formatMoney
} from '@kit'

const OP = { sale: 'Venta', rent: 'Alquiler', temporary: 'Temporario' }
const opSuffix = (op) => (op === 'rent' ? '/mes' : op === 'temporary' ? '/noche' : '')

function price(p, locale) {
  return formatMoney(p.price, p.currency, locale) + opSuffix(p.operation)
}

function TopNav({ onEnterPanel }) {
  const { isDark, toggleMode } = useDemo()
  return (
    <header className="sticky top-0 z-40 bg-surface backdrop-blur border-b border-border">
      <div className="dk-container flex items-center gap-3 h-16">
        <span className="font-extrabold text-heading text-lg tracking-tight flex items-center gap-1.5"><Building2 size={20} className="text-primary" />Terranova</span>
        <div className="flex-1" />
        <button onClick={toggleMode} className="text-muted hover:text-primary text-sm px-2">{isDark ? '☀' : '☾'}</button>
        <Button size="sm" icon={LayoutDashboard} onClick={onEnterPanel}>Panel</Button>
      </div>
    </header>
  )
}

/* I1 — Home + search */
function Hero({ onSearch, onValuation }) {
  const [f, setF] = useState({ operation: 'sale', type: '', q: '' })
  const [quick, setQuick] = useState({})
  const toggle = (k) => setQuick((q) => ({ ...q, [k]: !q[k] }))
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <img src="https://picsum.photos/seed/terranova-hero/1600/800" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,25,20,.4), rgba(10,25,20,.8))' }} />
      </div>
      <div className="relative dk-container pt-16 pb-10 md:pt-24 md:pb-16 text-white">
        <h1 className="text-3xl md:text-5xl font-extrabold max-w-2xl leading-tight" style={{ color: '#fff' }}>Encontrá tu próxima propiedad</h1>
        <p className="mt-3 text-white/80">Respondemos consultas en segundos, cualquier día y hora.</p>

        <Card id="tour-search" className="mt-6 p-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_2fr_auto] gap-3 items-end">
            <Select label="Operación" value={f.operation} onChange={(e) => setF({ ...f, operation: e.target.value })}
              options={[{ value: 'sale', label: 'Venta' }, { value: 'rent', label: 'Alquiler' }, { value: 'temporary', label: 'Temporario' }]} />
            <Select label="Tipo" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}
              options={[{ value: '', label: 'Todos' }, { value: 'apartment', label: 'Departamento' }, { value: 'house', label: 'Casa' }, { value: 'ph', label: 'PH' }, { value: 'office', label: 'Oficina' }, { value: 'commercial', label: 'Local' }]} />
            <Input label="Zona o dirección" icon={Search} placeholder="Ej. Candioti, Pichincha…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
            <Button className="col-span-2 md:col-span-1 h-[42px]" icon={Search} onClick={() => onSearch({ ...f, ...quick })}>Buscar</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <QuickFilter active={quick.creditReady} onClick={() => toggle('creditReady')} icon={CreditCard}>Apto crédito</QuickFilter>
            <QuickFilter active={quick.petFriendly} onClick={() => toggle('petFriendly')} icon={PawPrint}>Apto mascotas</QuickFilter>
            <QuickFilter active={quick.garage} onClick={() => toggle('garage')} icon={Car}>Con cochera</QuickFilter>
          </div>
        </Card>
        <button onClick={onValuation} className="mt-4 inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold">
          <Calculator size={17} /> Tasá tu propiedad gratis →
        </button>
      </div>
    </section>
  )
}

function PropCard({ p, locale, onOpen }) {
  return (
    <Card hover className="overflow-hidden cursor-pointer" onClick={() => onOpen(p)}>
      <div className="relative h-44">
        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge tone="primary">{OP[p.operation]}</Badge>
          {p.creditReady && <Badge tone="success">Apto crédito</Badge>}
        </div>
        <button className="absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-black/40 text-white"><Heart size={15} /></button>
      </div>
      <div className="p-4">
        <p className="font-extrabold text-heading">{price(p, locale)}</p>
        <p className="text-sm text-text mt-0.5 line-clamp-1">{p.title}</p>
        <p className="text-xs text-muted flex items-center gap-1 mt-1"><MapPin size={12} /> {p.neighborhood}, {p.city}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1"><BedDouble size={13} /> {p.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath size={13} /> {p.bathrooms}</span>
          <span className="flex items-center gap-1"><Maximize size={13} /> {p.area} m²</span>
          {p.garage > 0 && <span className="flex items-center gap-1"><Car size={13} /> {p.garage}</span>}
        </div>
      </div>
    </Card>
  )
}

function Featured({ onOpen }) {
  const { market } = useDemo()
  const [items, setItems] = useState(null)
  useEffect(() => { realestateApi.getFeatured().then(setItems) }, [])
  return (
    <section className="dk-section">
      <div className="dk-container">
        <h2 className="text-2xl font-bold text-heading mb-5">Propiedades destacadas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!items && [1, 2, 3].map((i) => <Skeleton key={i} className="h-72 rounded" />)}
          {items?.map((p) => <PropCard key={p.id} p={p} locale={market.locale} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  )
}

/* I2 — Results with synced map */
function Results({ query, onOpen, onBack }) {
  const { market } = useDemo()
  const [list, setList] = useState(null)
  const [hover, setHover] = useState(null)
  useEffect(() => { setList(null); realestateApi.getProperties(query).then(setList) }, [query])
  const points = useMemo(() => (list || []).map((p) => ({ id: p.id, x: p.x, y: p.y, price: price(p, market.locale) })), [list, market.locale])

  return (
    <section className="dk-section">
      <div className="dk-container">
        <button onClick={onBack} className="text-sm text-muted hover:text-primary flex items-center gap-1 mb-3"><ChevronLeft size={15} /> Volver</button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-heading">{list ? `${list.length} propiedades` : 'Buscando…'}</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {!list && [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded" />)}
            {list?.map((p) => (
              <div key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}>
                <Card hover className={`overflow-hidden cursor-pointer flex ${hover === p.id ? 'ring-2 ring-primary' : ''}`} onClick={() => onOpen(p)}>
                  <img src={p.images[0]} alt="" className="w-32 sm:w-44 h-32 object-cover" />
                  <div className="p-3 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5"><Badge tone="primary">{OP[p.operation]}</Badge>{p.creditReady && <Badge tone="success">Crédito</Badge>}</div>
                    <p className="font-extrabold text-heading mt-1">{price(p, market.locale)}</p>
                    <p className="text-sm text-text line-clamp-1">{p.title}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5"><MapPin size={11} /> {p.neighborhood}</p>
                    <div className="flex gap-3 mt-1.5 text-xs text-muted">
                      <span>{p.bedrooms} dorm</span><span>{p.bathrooms} baños</span><span>{p.area} m²</span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          <div className="hidden lg:block sticky top-20 h-[70vh]">
            <MapView points={points} activeId={hover} onHover={setHover} onSelect={(pt) => onOpen(list.find((p) => p.id === pt.id))} height="h-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* I3 — Property detail */
function Detail({ prop, onBack }) {
  const { market } = useDemo()
  const [img, setImg] = useState(0)
  const [amount, setAmount] = useState(50000)
  const [years, setYears] = useState(20)
  if (!prop) return null
  const wa = `https://wa.me/5493425420000?text=${encodeURIComponent(`Hola! Me interesa la propiedad ${prop.id} (${prop.title}). Sigue disponible?`)}`
  const monthly = Math.round((amount * 0.011) * (1 + years / 100)) // toy UVA sim

  return (
    <section className="dk-section">
      <div className="dk-container">
        <button onClick={onBack} className="text-sm text-muted hover:text-primary flex items-center gap-1 mb-3"><ChevronLeft size={15} /> Volver a resultados</button>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded overflow-hidden border border-border">
              <img src={prop.images[img]} alt="" className="w-full h-72 md:h-96 object-cover" />
            </div>
            <div className="flex gap-2 mt-2">
              {prop.images.map((im, i) => (
                <button key={i} onClick={() => setImg(i)} className={`w-20 h-16 rounded overflow-hidden border-2 ${i === img ? 'border-primary' : 'border-transparent'}`}>
                  <img src={im} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2"><Badge tone="primary">{OP[prop.operation]}</Badge>{prop.creditReady && <Badge tone="success">Apto crédito</Badge>}{prop.petFriendly && <Badge tone="info">Mascotas</Badge>}</div>
              <h1 className="text-2xl font-extrabold text-heading mt-2">{prop.title}</h1>
              <p className="text-muted flex items-center gap-1 mt-1"><MapPin size={15} /> {prop.address}, {prop.neighborhood}, {prop.city}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[['Dormitorios', prop.bedrooms], ['Baños', prop.bathrooms], ['Superficie', `${prop.area} m²`], ['Cochera', prop.garage || '—'], ['Antigüedad', `${2026 - prop.yearBuilt} años`], ['Expensas', prop.expenses ? formatMoney(prop.expenses, 'ARS', market.locale) : '—']].map(([k, v]) => (
                  <div key={k} className="rounded p-3 bg-surface-2"><p className="text-[11px] uppercase text-muted">{k}</p><p className="font-bold text-heading">{v}</p></div>
                ))}
              </div>
              <div className="mt-4 rounded border border-dashed border-border p-6 text-center text-muted text-sm">Tour 360° — placeholder (iframe mock)</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-5 sticky top-20">
              <p className="text-2xl font-extrabold text-heading">{price(prop, market.locale)}</p>
              <a href={wa} target="_blank" rel="noreferrer">
                <Button className="w-full mt-3" icon={MessageCircle} style={{ background: '#25D366' }}>Consultar por WhatsApp</Button>
              </a>
              <p className="text-[11px] text-muted mt-2 text-center">El mensaje ya incluye el ID {prop.id}</p>

              <div className="border-t border-border mt-4 pt-4">
                <p className="font-bold text-heading text-sm flex items-center gap-1.5 mb-3"><Calculator size={15} /> Simulador crédito UVA</p>
                <Input label="Monto a financiar (USD)" type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} />
                <Select label="Plazo" value={years} onChange={(e) => setYears(+e.target.value)} className="mt-2"
                  options={[10, 15, 20, 30].map((y) => ({ value: y, label: `${y} años` }))} />
                <div className="mt-3 rounded p-3" style={{ background: 'var(--dk-primary-weak)' }}>
                  <p className="text-xs text-muted">Cuota estimada</p>
                  <p className="text-xl font-extrabold text-primary">{formatMoney(monthly, 'USD', market.locale)}/mes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function RealEstateSite({ onEnterPanel }) {
  const { isDark } = useDemo()
  const [view, setView] = useState('home') // home | results | detail
  const [query, setQuery] = useState(null)
  const [prop, setProp] = useState(null)

  const openProp = (p) => { setProp(p); setView('detail'); window.scrollTo({ top: 0 }) }

  return (
    <div className="theme-realestate min-h-screen bg-background" data-mode={isDark ? 'dark' : 'light'}>
      <TopNav onEnterPanel={onEnterPanel} />
      {view === 'home' && (
        <>
          <Hero onSearch={(q) => { setQuery(q); setView('results') }} onValuation={() => alert('Tasador público (I4) — demo Fase 4')} />
          <Featured onOpen={openProp} />
        </>
      )}
      {view === 'results' && <Results query={query} onOpen={openProp} onBack={() => setView('home')} />}
      {view === 'detail' && <Detail prop={prop} onBack={() => setView(query ? 'results' : 'home')} />}
      <footer className="border-t border-border py-8">
        <div className="dk-container text-sm text-muted flex justify-between">
          <span>© 2026 Terranova · Demo InnovaTech</span>
          <button onClick={onEnterPanel} className="text-primary hover:underline">Ver panel de gestión</button>
        </div>
      </footer>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion'
import {
  Calculator, MapPin, Home, Ruler, CalendarClock, Sparkles, BedDouble, Bath, Car,
  Gauge, TrendingUp, FileText, Download, X, Building2, Check, Info, ArrowRight
} from 'lucide-react'
import NEIGHBORHOODS from '../data/neighborhoods.json'
import { useToast } from './admin/shared/useToast'
import {
  PROPERTY_TYPES, CONDITIONS, VALUATION_AMENITIES,
  estimateValuation, formatUsd, formatUsdM2
} from '../data/mockValuation'

const AGENCY = 'Terranova Propiedades'

// Types that don't take rooms/condition/amenities inputs.
const isResidentialType = (t) => t === 'apartment' || t === 'house' || t === 'ph'

// Confidence badge styling.
const CONF = {
  Alta: { cls: 'bg-success text-white', dot: 'var(--color-success)', note: 'Varias propiedades comparables en la misma zona.' },
  Media: { cls: 'bg-warning text-white', dot: 'var(--color-warning)', note: 'Comparables parciales: mismo tipo o zona cercana.' },
  Baja: { cls: 'bg-muted text-white', dot: 'var(--color-muted)', note: 'Pocos comparables directos; estimación basada en el modelo de zona.' }
}

// -------------------------------------------------------------------------
// Animated number — counts up whenever `value` changes.
// -------------------------------------------------------------------------
function AnimatedNumber({ value, format }) {
  const mv = useMotionValue(value)
  const fmtRef = useRef(format)
  fmtRef.current = format
  const [display, setDisplay] = useState(() => format(value))

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(fmtRef.current(v))
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <>{display}</>
}

// -------------------------------------------------------------------------
// Field wrappers
// -------------------------------------------------------------------------
function Field({ label, icon: Icon, children, hint }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-text mb-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted mt-1.5">{hint}</p>}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-2 focus:ring-accent'

// -------------------------------------------------------------------------
// Comparable card
// -------------------------------------------------------------------------
function ComparableCard({ comp, index }) {
  const p = comp.property
  const typeLabel = PROPERTY_TYPES.find((t) => t.key === p.type)?.label || p.type
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="rl-card rounded-xl overflow-hidden flex flex-col"
    >
      <div className="relative h-32 overflow-hidden bg-surface-alt">
        <img
          src={p.images?.[0]}
          alt={p.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 text-[0.65rem] font-bold px-2 py-1 rounded-md bg-primary text-primary-contrast">
          {Math.round(comp.score * 100)}% match
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-sm font-semibold text-text leading-snug line-clamp-2">{p.title}</h4>
        <p className="text-xs text-muted mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" /> {p.address}, {p.neighborhood}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded ${comp.sameNeighborhood ? 'bg-accent text-primary-contrast' : 'bg-surface-alt text-muted'}`}>
            {comp.sameNeighborhood ? '✓ Mismo barrio' : p.neighborhood}
          </span>
          <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded ${comp.sameType ? 'bg-accent text-primary-contrast' : 'bg-surface-alt text-muted'}`}>
            {comp.sameType ? '✓ Mismo tipo' : typeLabel}
          </span>
        </div>

        <div className="mt-auto pt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-muted">Precio</div>
            <div className="text-sm font-semibold text-text">{formatUsd(p.price)}</div>
          </div>
          <div>
            <div className="text-xs text-muted">Superficie</div>
            <div className="text-sm font-semibold text-text">{p.type === 'land' ? p.areaTotal : (p.areaCovered || p.areaTotal)} m²</div>
          </div>
          <div>
            <div className="text-xs text-muted">Valor m²</div>
            <div className="text-sm font-semibold text-accent">{Math.round(comp.usdM2).toLocaleString('es-AR')}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// -------------------------------------------------------------------------
// PDF report preview modal
// -------------------------------------------------------------------------
function ReportModal({ open, onClose, report, showToast }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!report) return null
  const { input, result, ref, date, typeLabel, conditionLabel } = report

  const specRows = [
    ['Tipo de propiedad', typeLabel],
    ['Barrio', input.neighborhood],
    ['Dirección', input.address || '—'],
    ['Superficie total', `${input.areaTotal || '—'} m²`],
    input.type !== 'land' && ['Superficie cubierta', `${input.areaCovered || '—'} m²`],
    input.type !== 'land' && ['Antigüedad', `${input.age || 0} años`],
    input.type !== 'land' && ['Estado', conditionLabel],
    isResidentialType(input.type) && ['Dormitorios', String(input.bedrooms || 0)],
    isResidentialType(input.type) && ['Baños', String(input.bathrooms || 0)],
    input.type !== 'land' && ['Cochera', input.garage > 0 ? `${input.garage}` : 'No']
  ].filter(Boolean)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-start md:items-center justify-center p-3 md:p-6 overflow-auto"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-surface rounded-2xl overflow-hidden shadow-2xl my-auto"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-border">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 text-accent shrink-0" />
                <span className="font-semibold text-primary truncate">Informe de tasación</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-alt transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Report body (the "printed" sheet) */}
            <div className="max-h-[70vh] overflow-auto p-5 md:p-7 bg-bg">
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {/* Letterhead */}
                <div className="bg-primary text-primary-contrast px-6 py-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg grid place-items-center" style={{ background: 'color-mix(in srgb, currentColor 14%, transparent)' }}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold leading-tight text-lg">{AGENCY}</div>
                      <div className="text-xs opacity-70">Informe de tasación automatizada</div>
                    </div>
                  </div>
                  <div className="text-right text-xs opacity-80">
                    <div className="font-semibold">{ref}</div>
                    <div>{date}</div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Subject */}
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Propiedad tasada</h3>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      {specRows.map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between gap-3 border-b border-border pb-1.5">
                          <span className="text-muted">{k}</span>
                          <span className="text-text font-medium text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Estimate */}
                  <section className="rounded-xl bg-primary text-primary-contrast p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm opacity-70">Valor estimado de mercado</span>
                      <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, currentColor 16%, transparent)' }}>
                        Confianza {result.confidence}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-primary-contrast mt-1">{formatUsd(result.central)}</div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="opacity-70">Rango:</span>
                      <span className="font-semibold">{formatUsd(result.min)} — {formatUsd(result.max)}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="opacity-70">Valor por m²:</span>
                      <span className="font-semibold">{formatUsdM2(result.usdM2)} <span className="opacity-60 font-normal">· {result.basisLabel}</span></span>
                    </div>
                  </section>

                  {/* Comparables */}
                  {result.comparables.length > 0 && (
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                        Comparables de mercado ({result.comparableCount})
                      </h3>
                      <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-surface-alt text-left text-muted">
                              <th className="py-2 px-3 font-semibold">Propiedad</th>
                              <th className="py-2 px-3 font-semibold text-right">Sup.</th>
                              <th className="py-2 px-3 font-semibold text-right">Precio</th>
                              <th className="py-2 px-3 font-semibold text-right">m²</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.comparables.map((c) => (
                              <tr key={c.property.id} className="border-t border-border">
                                <td className="py-2 px-3 text-text">
                                  <div className="font-medium leading-tight">{c.property.neighborhood}</div>
                                  <div className="text-xs text-muted">{c.property.address}</div>
                                </td>
                                <td className="py-2 px-3 text-right tabular-nums text-muted">
                                  {c.property.type === 'land' ? c.property.areaTotal : (c.property.areaCovered || c.property.areaTotal)} m²
                                </td>
                                <td className="py-2 px-3 text-right tabular-nums text-text">{formatUsd(c.property.price)}</td>
                                <td className="py-2 px-3 text-right tabular-nums text-accent">{Math.round(c.usdM2).toLocaleString('es-AR')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  {/* Disclaimer */}
                  <p className="text-[11px] text-muted leading-snug border-t border-border pt-4">
                    Informe orientativo generado automáticamente por {AGENCY} a partir de datos comparables de mercado.
                    No constituye una tasación oficial ni una oferta de compra. Para una valuación con validez legal se requiere
                    la inspección de un tasador matriculado.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 px-4 md:px-6 py-3.5 border-t border-border">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-muted hover:text-text hover:bg-surface-alt transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => { showToast('Informe PDF generado'); onClose() }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-contrast font-semibold hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" /> Descargar informe
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// -------------------------------------------------------------------------
// Main section
// -------------------------------------------------------------------------
const EMPTY_FORM = {
  neighborhood: '',
  address: '',
  type: 'apartment',
  areaTotal: '',
  areaCovered: '',
  age: '',
  condition: 'muy-buena',
  bedrooms: 2,
  bathrooms: 1,
  garage: 0,
  amenities: []
}

// Stable pseudo-reference from the subject (no randomness → deterministic).
function buildRef(input) {
  const src = `${input.neighborhood}|${input.address}|${input.type}|${input.areaTotal}`
  let h = 0
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) >>> 0
  const year = new Date().getFullYear()
  return `TAS-${year}-${String(h % 100000).padStart(5, '0')}`
}

export default function PropertyValuation() {
  const { showToast, toastNode } = useToast()
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | loading | done
  const [report, setReport] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const resultRef = useRef(null)

  const isLand = form.type === 'land'
  const residential = isResidentialType(form.type)

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const toggleAmenity = (key) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(key)
        ? f.amenities.filter((a) => a !== key)
        : [...f.amenities, key]
    }))

  // Numeric inputs kept as raw strings while typing; coerce for the engine.
  const normalized = useMemo(
    () => ({
      ...form,
      areaTotal: Number(form.areaTotal) || 0,
      areaCovered: Number(form.areaCovered) || 0,
      age: Number(form.age) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      garage: Number(form.garage) || 0
    }),
    [form]
  )

  const canSubmit =
    !!normalized.neighborhood &&
    !!normalized.type &&
    (isLand ? normalized.areaTotal > 0 : (normalized.areaCovered > 0 || normalized.areaTotal > 0))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit || status === 'loading') return
    setStatus('loading')
    setReport(null)
    // Simulated appraisal latency for realism.
    setTimeout(() => {
      const result = estimateValuation(normalized)
      const typeLabel = PROPERTY_TYPES.find((t) => t.key === normalized.type)?.label || normalized.type
      const conditionLabel = CONDITIONS.find((c) => c.key === normalized.condition)?.label || '—'
      setReport({
        input: normalized,
        result,
        typeLabel,
        conditionLabel,
        ref: buildRef(normalized),
        date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
      })
      setStatus('done')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }, 700)
  }

  const result = report?.result

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <hr className="rl-rule rl-rule--gold w-14" />
          <span className="rl-label rl-label--gold mt-6 inline-block">Tasador online</span>
          <h2 className="rl-display text-primary mt-3" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>
            ¿Cuánto vale tu propiedad?
          </h2>
          <p className="text-muted mt-4">
            Completá los datos y obtené una estimación de mercado al instante, calculada a partir de propiedades
            comparables reales de la zona. Descargá el informe profesional en PDF.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* LEFT — Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-surface border border-border rounded-2xl p-6 space-y-6"
          >
            <div className="flex items-center gap-2 text-accent text-sm font-semibold">
              <Calculator className="w-4 h-4" /> Datos de la propiedad
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Barrio" icon={MapPin}>
                <select
                  value={form.neighborhood}
                  onChange={(e) => set({ neighborhood: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Elegí un barrio</option>
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>

              <Field label="Tipo" icon={Home}>
                <select
                  value={form.type}
                  onChange={(e) => set({ type: e.target.value })}
                  className={inputCls}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Dirección" icon={MapPin} hint="Opcional — figura en el informe.">
              <input
                type="text"
                value={form.address}
                onChange={(e) => set({ address: e.target.value })}
                placeholder="Ej: Av. del Libertador 4520"
                className={inputCls}
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Superficie total (m²)" icon={Ruler}>
                <input
                  type="number" min={0} value={form.areaTotal}
                  onChange={(e) => set({ areaTotal: e.target.value })}
                  placeholder="Ej: 82"
                  className={inputCls}
                />
              </Field>
              {!isLand && (
                <Field label="Superficie cubierta (m²)" icon={Ruler}>
                  <input
                    type="number" min={0} value={form.areaCovered}
                    onChange={(e) => set({ areaCovered: e.target.value })}
                    placeholder="Ej: 68"
                    className={inputCls}
                  />
                </Field>
              )}
            </div>

            {!isLand && (
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Antigüedad (años)" icon={CalendarClock}>
                  <input
                    type="number" min={0} value={form.age}
                    onChange={(e) => set({ age: e.target.value })}
                    placeholder="Ej: 6"
                    className={inputCls}
                  />
                </Field>
                <Field label="Estado" icon={Sparkles}>
                  <select
                    value={form.condition}
                    onChange={(e) => set({ condition: e.target.value })}
                    className={inputCls}
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            {!isLand && (
              <div className="grid grid-cols-3 gap-4">
                <Field label="Dormitorios" icon={BedDouble}>
                  <input
                    type="number" min={0} value={form.bedrooms}
                    onChange={(e) => set({ bedrooms: e.target.value })}
                    disabled={!residential}
                    className={`${inputCls} disabled:opacity-50`}
                  />
                </Field>
                <Field label="Baños" icon={Bath}>
                  <input
                    type="number" min={0} value={form.bathrooms}
                    onChange={(e) => set({ bathrooms: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Cocheras" icon={Car}>
                  <input
                    type="number" min={0} value={form.garage}
                    onChange={(e) => set({ garage: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              </div>
            )}

            {!isLand && (
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-text mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-accent" /> Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {VALUATION_AMENITIES.map((a) => {
                    const active = form.amenities.includes(a.key)
                    return (
                      <button
                        key={a.key}
                        type="button"
                        onClick={() => toggleAmenity(a.key)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-accent text-primary-contrast border-accent'
                            : 'bg-surface text-muted border-border hover:border-accent'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-contrast font-semibold uppercase tracking-wider text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <motion.span
                    className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                  />
                  Tasando…
                </>
              ) : (
                <>
                  <Gauge className="w-4 h-4" /> Tasar propiedad
                </>
              )}
            </button>
          </motion.form>

          {/* RIGHT — Result */}
          <div ref={resultRef} className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {status !== 'done' || !result ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center min-h-[420px] flex flex-col items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface-alt grid place-items-center mb-4">
                    <Gauge className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text">Tu tasación aparecerá acá</h3>
                  <p className="text-sm text-muted mt-2 max-w-xs">
                    Completá el formulario y presioná <span className="font-semibold text-text">“Tasar propiedad”</span> para
                    ver el valor estimado y las propiedades comparables.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-primary text-primary-contrast rounded-2xl p-6 md:p-8"
                >
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2 text-gold text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" /> Valor estimado de mercado
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-bold px-2.5 py-1 rounded-full ${CONF[result.confidence].cls}`}>
                      Confianza {result.confidence}
                    </span>
                  </div>

                  {/* Central value — primary-contrast keeps it readable on the
                      panel in both themes (primary inverts to light in dark). */}
                  <div className="text-4xl md:text-5xl font-bold text-primary-contrast leading-none">
                    <AnimatedNumber value={result.central} format={(v) => formatUsd(v)} />
                  </div>

                  {/* Range bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs opacity-70 mb-1.5">
                      <span>{formatUsd(result.min)}</span>
                      <span>{formatUsd(result.max)}</span>
                    </div>
                    <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, currentColor 16%, transparent)' }}>
                      <motion.div
                        className="absolute inset-y-0 rounded-full bg-gold"
                        initial={{ left: '50%', right: '50%' }}
                        animate={{ left: '8%', right: '8%' }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <motion.div
                        className="absolute top-1/2 w-3 h-3 rounded-full bg-primary-contrast -translate-y-1/2 -translate-x-1/2"
                        initial={{ left: '50%' }}
                        animate={{ left: '50%' }}
                      />
                    </div>
                    <p className="text-[0.7rem] opacity-60 mt-1.5 text-center">Rango estimado ±{Math.round(result.spreadPct)}%</p>
                  </div>

                  {/* Rows */}
                  <div className="space-y-3 mt-7">
                    {[
                      ['Valor por m²', `${formatUsdM2(result.usdM2)}`],
                      ['Superficie considerada', `${result.basis} ${result.basisLabel}`],
                      ['Comparables usados', `${result.comparableCount} ${result.comparableCount === 1 ? 'propiedad' : 'propiedades'}`]
                    ].map(([label, value], i, arr) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2 text-sm"
                        style={i < arr.length - 1 ? { borderBottom: '1px solid color-mix(in srgb, currentColor 14%, transparent)' } : undefined}
                      >
                        <span className="opacity-70">{label}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Model vs comparables blend */}
                  {result.comparableCount > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-[0.7rem] opacity-70 mb-1.5">
                        <span>Datos comparables ({Math.round(result.blend * 100)}%)</span>
                        <span>Modelo de zona ({Math.round((1 - result.blend) * 100)}%)</span>
                      </div>
                      <div className="flex h-2.5 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, currentColor 16%, transparent)' }}>
                        <motion.div
                          className="bg-gold"
                          initial={{ width: 0 }}
                          animate={{ width: `${result.blend * 100}%` }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <div className="flex-1" style={{ background: 'color-mix(in srgb, currentColor 34%, transparent)' }} />
                      </div>
                    </div>
                  )}

                  <p className="text-xs opacity-60 mt-6 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {CONF[result.confidence].note}
                  </p>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-primary-contrast text-primary font-semibold hover:opacity-90 transition-opacity"
                  >
                    <FileText className="w-4 h-4" /> Generar informe PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Comparables */}
        <AnimatePresence>
          {status === 'done' && result && result.comparables.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-14"
            >
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h3 className="rl-serif text-primary text-2xl">Propiedades comparables</h3>
                  <p className="text-muted text-sm mt-1">
                    Basado en {result.comparableCount} {result.comparableCount === 1 ? 'propiedad similar' : 'propiedades similares'} en la zona.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {result.comparables.map((c, i) => (
                  <ComparableCard key={c.property.id} comp={c} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ReportModal open={modalOpen} onClose={() => setModalOpen(false)} report={report} showToast={showToast} />
      {toastNode}
    </section>
  )
}

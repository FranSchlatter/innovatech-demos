import { useState } from 'react'
import { LayoutDashboard, MessageSquare, CalendarRange, Percent, Workflow } from 'lucide-react'
import { DemoProvider, I18nProvider, AppShell, TourOverlay, useDemo, Card, Badge } from '@kit'
import HotelSite from './site/HotelSite.jsx'
import Dashboard from './panel/Dashboard.jsx'
import InboxScreen from './panel/InboxScreen.jsx'
import Rates from './panel/Rates.jsx'
import Automations from './panel/Automations.jsx'

const NAV = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'inbox', label: 'Bandeja', icon: MessageSquare },
  { id: 'calendar', label: 'Calendario', icon: CalendarRange },
  { id: 'rates', label: 'Tarifas', icon: Percent },
  { id: 'automations', label: 'Automatizaciones', icon: Workflow }
]

function ComingSoon({ title }) {
  return (
    <Card className="p-10 text-center">
      <Badge tone="info" className="mb-3">Fase 4 · profundidad</Badge>
      <h2 className="text-lg font-bold text-heading">{title}</h2>
      <p className="text-muted text-sm mt-1">Pantalla incluida en el inventario, pendiente de construir.</p>
    </Card>
  )
}

function Root() {
  const { startTour } = useDemo()
  const [view, setView] = useState('site') // site | panel | portal
  const [screen, setScreen] = useState('dashboard')

  const goPanel = (s) => { setView('panel'); if (s) setScreen(s) }

  const tourScripts = {
    hotel: [
      { target: 'tour-inbox', title: 'Entra la consulta', onEnter: () => goPanel('inbox'),
        body: 'Sábado, 23 h. Una consulta entra por WhatsApp y la IA responde sola, sin que nadie del hotel esté despierto.' },
      { target: 'tour-inbox', title: 'La IA cotiza de verdad', onEnter: () => goPanel('inbox'),
        body: 'Consultó disponibilidad real y ofreció la Superior Vista Río con precio y desayuno. No es un FAQ automático.' },
      { target: 'tour-inbox', title: 'Reserva directa + upsell', onEnter: () => goPanel('inbox'),
        body: 'El huésped reserva directo, sin comisión de OTA. Y la IA ofrece un late checkout: ingreso extra.' },
      { target: 'tour-commission', title: 'La comisión que no pagaste', onEnter: () => goPanel('dashboard'),
        body: 'En el panel ves cuánto se llevaron Booking y Expedia este mes, frente a tu ingreso por canal directo.' },
      { target: 'tour-commission', title: 'El número que importa', onEnter: () => goPanel('dashboard'),
        body: 'Cada reserva directa es plata que queda en el hotel.', metricValue: 'ARS 11,6M', metricLabel: 'ahorrado en comisiones (últimos 6 meses)' }
    ]
  }

  if (view === 'portal') {
    return (
      <div className="theme-hotel min-h-screen bg-background grid place-items-center p-6">
        <Card className="p-8 max-w-sm text-center">
          <h2 className="text-lg font-bold text-heading">Portal del huésped</h2>
          <p className="text-muted text-sm mt-1">Ver reserva, pre-check-in y servicios (demo, Fase 4).</p>
          <button className="mt-4 text-primary font-semibold" onClick={() => setView('site')}>← Volver al sitio</button>
        </Card>
      </div>
    )
  }

  if (view === 'site') {
    return (
      <>
        <HotelSite onEnterPanel={() => goPanel('dashboard')} onEnterPortal={() => setView('portal')} />
        <TourOverlay scripts={tourScripts} />
      </>
    )
  }

  return (
    <>
      <AppShell
        brand="Costa Serena" subtitle="Gestión InnovaTech" mark="C"
        nav={NAV} active={screen} onNavigate={setScreen}
        onExit={() => setView('site')} onStartTour={() => startTour('hotel')}
      >
        {screen === 'dashboard' && <Dashboard />}
        {screen === 'inbox' && <InboxScreen />}
        {screen === 'calendar' && <ComingSoon title="Calendario / Tape chart (H8)" />}
        {screen === 'rates' && <Rates />}
        {screen === 'automations' && <Automations />}
      </AppShell>
      <TourOverlay scripts={tourScripts} />
    </>
  )
}

export default function App() {
  return (
    <DemoProvider market="AR" defaultMode="light">
      <I18nProvider>
        <Root />
      </I18nProvider>
    </DemoProvider>
  )
}

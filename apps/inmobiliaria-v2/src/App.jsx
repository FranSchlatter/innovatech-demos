import { useState } from 'react'
import { LayoutDashboard, MessageSquare, FileText, KanbanSquare, Wallet, Share2 } from 'lucide-react'
import { DemoProvider, I18nProvider, AppShell, TourOverlay, useDemo, Card, Badge } from '@kit'
import RealEstateSite from './site/RealEstateSite.jsx'
import Dashboard from './panel/Dashboard.jsx'
import InboxScreen from './panel/InboxScreen.jsx'
import Contracts from './panel/Contracts.jsx'
import Liquidations from './panel/Liquidations.jsx'
import Diffusion from './panel/Diffusion.jsx'

const NAV = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'inbox', label: 'Bandeja + IA', icon: MessageSquare },
  { id: 'contracts', label: 'Contratos', icon: FileText },
  { id: 'pipeline', label: 'Pipeline', icon: KanbanSquare },
  { id: 'liquidations', label: 'Liquidaciones', icon: Wallet },
  { id: 'diffusion', label: 'Difusión', icon: Share2 }
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
  const [view, setView] = useState('site')
  const [screen, setScreen] = useState('dashboard')
  const goPanel = (s) => { setView('panel'); if (s) setScreen(s) }

  const tourScripts = {
    realestate: [
      { target: 'tour-inbox', title: 'Sábado, 23:00', onEnter: () => goPanel('inbox'),
        body: 'Entra una consulta por ZonaProp fuera de horario. La IA responde en 40 segundos, no el lunes.' },
      { target: 'tour-inbox', title: 'La IA califica el lead', onEnter: () => goPanel('inbox'),
        body: 'Detecta presupuesto, zona, plazo, si necesita crédito y si tiene garantía — y le pone un score.' },
      { target: 'tour-inbox', title: 'Agenda la visita sola', onEnter: () => goPanel('inbox'),
        body: 'La visita queda agendada sin que ningún agente estuviera despierto.' },
      { target: 'tour-response', title: 'El KPI que ancla la venta', onEnter: () => goPanel('dashboard'),
        body: 'Tiempo medio de respuesta. Es lo primero que mira un dueño de inmobiliaria.', metricValue: '18 min', metricLabel: 'tiempo medio de respuesta (antes: más de 3 horas)' },
      { target: 'tour-contracts', title: 'Ajustes bajo control', onEnter: () => goPanel('contracts'),
        body: 'Cada contrato con su índice y su próximo ajuste. El simulador recalcula en vivo, con la fórmula a la vista.' }
    ]
  }

  if (view === 'site') {
    return (
      <>
        <RealEstateSite onEnterPanel={() => goPanel('dashboard')} />
        <TourOverlay scripts={tourScripts} />
      </>
    )
  }

  return (
    <>
      <AppShell
        brand="Terranova" subtitle="Gestión InnovaTech" mark="T"
        nav={NAV} active={screen} onNavigate={setScreen}
        onExit={() => setView('site')} onStartTour={() => startTour('realestate')}
      >
        {screen === 'dashboard' && <Dashboard />}
        {screen === 'inbox' && <InboxScreen />}
        {screen === 'contracts' && <Contracts />}
        {screen === 'pipeline' && <ComingSoon title="Pipeline / Kanban (I6)" />}
        {screen === 'liquidations' && <Liquidations />}
        {screen === 'diffusion' && <Diffusion />}
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

import EventsCalendar from '../components/EventsCalendar'
import GuestServicesSection from '../components/GuestServicesSection'
import BeachPoolMap from '../components/client/BeachPoolMap'

// Seed for the standalone Beach & Pool map preview — it only needs display props
// (name, room, stay dates) and no-op handlers; its inventory comes from its own hook.
const stayDates = [new Date(), new Date(Date.now() + 2 * 86400000)]

// Registry of marketplace-embeddable features for this demo.
// The `id` is the shared contract with the landing's features.json:
//   - `embed`  → rendered standalone inside an iframe via ?embed=<id> (isolated preview)
//   - `live`   → how the full demo deep-links to the feature via ?feature=<id> ("ver en vivo")
//                { viewMode, scrollTo? }. Omit `live` when there's no clean in-context spot.
export const FEATURE_MAP = {
  'events-calendar': {
    title: 'Calendario de eventos',
    embed: <EventsCalendar />,
    live: { viewMode: 'main', scrollTo: 'activities' },
  },
  'guest-services': {
    title: 'Servicios al huésped',
    embed: <GuestServicesSection onOpenPortal={() => {}} />,
    live: { viewMode: 'main', scrollTo: 'services' },
  },
  'beach-pool-map': {
    title: 'Mapa de pileta y playa',
    embed: (
      <BeachPoolMap
        open
        onClose={() => {}}
        guestName="Carlos Rodríguez"
        roomNumber="301"
        stayDates={stayDates}
        onReserve={() => {}}
        onOrder={() => {}}
      />
    ),
    live: { viewMode: 'guest-portal' },
  },
}

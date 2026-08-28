# AUDIT.md — apps/hoteleria (Fase 0)

> Auditoría de referencia. **No se modifica esta app.** La demo v2 se construye en `apps/hoteleria-v2` sobre `packages/demo-kit`.

## Stack real detectado
- React 18.3 + Vite 5.2 + Tailwind 3.4 + Framer Motion 11 + Lucide 0.363.
- Sin librería de gráficos (dashboards con SVG/CSS a mano). Sin router (navegación por `viewMode` en `App.jsx`). Sin i18n (strings mezclados ES/EN hardcodeados).
- Estilos: `@shared-styles/global.css` (tema "Hotel Luxury": Playfair/Inter, acento `#8b7355`) + `styles.css` local. Dark/light vía `useDarkMode` (`[data-theme]`).

## Rutas / pantallas (patrón viewMode)
`main` (landing) · `detail` (RoomDetailPage) · `booking` (BookingForm) · `admin` (AdminLayout) · `guest-portal` (GuestPortal). Sub-flujos: RoomsList, ServiceRequestForm, ExcursionBookingForm.

## Dónde viven los datos
- Compartidos: `packages/shared-data/*.json` (rooms, amenities, reviews, services, tours…). Leídos **directo** por componentes.
- Admin: `src/data/admin/*.js` (mockReservations, mockHousekeeping, mockInventory, mockServiceRequests, mockStaff) vía hook `useAdminData`.
- **No hay capa async/latencia.** Lectura síncrona directa. → migrar a `mockApi` en v2.

## Componentes reutilizables existentes (ruta)
- Landing: `HeroCarousel`, `AccommodationTiers`, `HotelAmenities`, `ReviewsSection`, `OffersSection`, `HotelContactSection`, `GuestServicesSection`.
- Pages: `BookingForm`, `RoomDetailPage`, `RoomsList`, `ServiceRequestForm`, `ExcursionBookingForm`.
- Admin: `AdminLayout/Header/Sidebar`, `AdminDashboard`, `RoomManagement`, `HousekeepingManagement`, `InventoryManagement`, `ServiceRequestsMonitor`, `StatusBadge`.
- Portal: `GuestPortal`.

## Cobertura mobile
- Landing y booking razonables. Admin (tablas/grillas) **sospechoso <400px** (a revisar celda por celda). El tape chart / calendario no existe aún.

## Deuda evidente
- Strings ES/EN mezclados y hardcodeados (bloquea i18n).
- Colores de tema vía CSS vars OK, pero clases utilitarias `.btn-*` en global.css acopladas al look "luxury".
- Datos leídos síncronos → sin estados de carga.

## Cruce contra inventario §7 (Demo Hotelería)

### Ya está (base reutilizable)
- **H1 Home** — HeroCarousel + AccommodationTiers + Reviews. Falta buscador de disponibilidad above-the-fold y selector ES/EN/PT + ARS/USD funcional.
- **H3 Ficha habitación** — RoomDetailPage.
- **H4 Checkout** — BookingForm (parcial: falta paso de extras/upsell explícito y desglose de impuestos).
- **H5 Confirmación** — parcial en BookingForm.
- **H6 Pre-check-in** — ServiceRequestForm/GuestPortal cubren piezas.
- **H7 Dashboard** — AdminDashboard (KPIs base). **Falta widget de comisión OTA vs directo** (el gráfico que vende).

### Parcial
- **H8 Calendario/tape chart** — no existe grilla; hay gestión de reservas en tabla.
- **H10 Automatizaciones** — no existe; ServiceRequestsMonitor es lo más cercano.

### No existe
- **H2 Resultados de disponibilidad** con expansión de tarifas inline.
- **H9 Inbox unificado** (WhatsApp/IG/web/Booking) + agente IA + escalamiento.
- **H11 Tarifas y reglas** + **panel de precio dinámico** (nominal / real deflactado / ocupación).
- Selector de idioma/moneda funcional. Modo tour guiado. mockApi con latencia. Widget de comisión.

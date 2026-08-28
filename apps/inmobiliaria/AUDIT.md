# AUDIT.md — apps/inmobiliaria (Fase 0)

> Auditoría de referencia. **No se modifica esta app.** La demo v2 se construye en `apps/inmobiliaria-v2` sobre `packages/demo-kit`.

## Stack real detectado
- React 18.3 + Vite 5.2 + Tailwind 3.4 + Framer Motion 11 + Lucide 0.363.
- Sin gráficos (SVG/CSS). Sin router (`viewMode`). Sin i18n. Marca demo: **"Terranova"**.
- Estilos: `@shared-styles/global.css` + `styles.css` + `theme-realestate.css` (tema propio inmobiliario). Dark/light vía `useDarkMode`.
- Utilidades propias: `src/utils/format.js` (formatPrice multi-moneda básica, timeAgo con "now" fijo 2026-08-27, labels operación/tipo/estado). **Reutilizable en v2.**

## Rutas / pantallas (viewMode)
`main` · `listings` (PropertiesListPage) · `detail` (PropertyDetailPage) · `schedule` (ScheduleVisitForm) · `admin` (AdminLayout) · `client-portal` (ClientPortal).

## Dónde viven los datos
- App: `src/data/properties.json` (rico: id, operation, type, price+currency, expenses, address, lat/lng normalizados 0–100, rooms, m², garage, images[], amenities, description, views), `agents.json`, `neighborhoods.json`, `testimonials.json`.
- Admin: `src/data/admin/*.js` (mockLeads, mockAgents, mockVisits, mockOperations) vía `useAdminData`.
- **Lectura síncrona directa.** → migrar a `mockApi`. **properties.json se reutiliza como seed.**

## Componentes reutilizables existentes (ruta)
- Landing: `PropertyHero`, `FeaturedProperties`, `PropertyCard`, `ServicesSection`, `MortgageCalculator` (sim UVA), `WhyChooseUs`, `AgentsSection`, `TestimonialsSection`, `ContactSection`, `AboutSection`.
- Pages: `PropertiesListPage`, `PropertyDetailPage`, `ScheduleVisitForm`.
- Componentes: `PropertyMap`, `VirtualTourModal`.
- Admin: `AdminLayout/Header/Sidebar`, `AdminDashboard`, `LeadsManagement`, `AgentsManagement`, `VisitsScheduler`, `PropertyManagement`, `OperationsManagement`, `StatusBadge`.
- Portal: `ClientPortal`. Hooks: `useFavorites`, `useAdminData`.

## Cobertura mobile
- Landing y ficha OK. `PropertiesListPage` con mapa (split) **a revisar <400px**. Admin kanban/tablas sospechosos.

## Deuda evidente
- Strings ES hardcodeados (i18n pendiente). `theme-realestate.css` acoplado.
- Multi-moneda resuelta parcialmente (formatPrice); **no hay separación de totales por moneda** (§4.3).
- Sin capa async → sin loading states.

## Cruce contra inventario §8 (Demo Inmobiliaria)

### Ya está (base reutilizable)
- **I1 Home/buscador** — PropertyHero + FeaturedProperties. Falta filtros rápidos destacados (apto crédito/mascotas/cochera) y CTA tasación separado.
- **I2 Resultados con mapa** — PropertiesListPage + PropertyMap (split parcial). Falta sync hover lista↔mapa y guardar búsqueda con alerta WhatsApp.
- **I3 Ficha** — PropertyDetailPage + VirtualTourModal + MortgageCalculator (sim UVA). Falta botón WhatsApp con ID precargado y POIs.
- **I5 Dashboard** — AdminDashboard (leads por origen). **Falta KPI tiempo medio de respuesta con semáforo** (el que ancla la venta) y embudo completo.
- **I6 Pipeline** — LeadsManagement/OperationsManagement (base kanban).

### Parcial
- **I8 Ficha interna + difusión** — PropertyManagement existe; **falta panel de difusión por portal** (ZonaProp/ArgenProp/ML/IG) con vistas/consultas.
- **I13 Portal inquilino** — ClientPortal es genérico; falta recibos/vencimiento/ajuste.

### No existe
- **I4 Tasador público** (rango + comparables de oferta + PDF con marca).
- **I7 Inbox + IA** con calificación de lead (presupuesto/zona/plazo/crédito/garantía + score).
- **I9 Contratos de alquiler** (tabla con índice/frecuencia/próximo ajuste/cobranza).
- **I10 Detalle de contrato + simulador de ajuste** (IPC/ICL/UVA/% fijo, recálculo en vivo, recibo con punitorios).
- **I11 Liquidación al propietario** (sobre lo cobrado, PDF, envío WhatsApp).
- **I12 Portal del propietario**.
- Selector moneda con totales por moneda (§4.3). Modo tour guiado. mockApi con latencia.

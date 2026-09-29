# Marketplace Roadmap — vidriera de funcionalidades

> Objetivo: llevar el catálogo de `innovatech.ar/marketplace` de las **7 features actuales**
> a **todas** las funcionalidades reales de las demos (hotelería + inmobiliaria), organizadas
> en features individuales y **packs**, con un rediseño de cards (más chicas/simples) y modal
> (más info + botón a detalle / ver en vivo).

## Repos involucrados

| Repo | Rol | Archivos clave |
|---|---|---|
| `Innovatech` (landing, innovatech.ar) | Catálogo del marketplace + UI | `src/data/marketplace/features.json`, `src/data/marketplace/index.js`, componentes del `/marketplace` |
| `innovatech-demos` | Las demos + widgets embebibles | `apps/<app>/src/embed/featureMap.jsx`, `apps/<app>/src/embed/EmbedApp.jsx`, `apps/<app>/src/App.jsx` (deep-links `?feature=`) |

## Contrato actual (cómo funciona hoy)

- Cada feature tiene un `id` compartido entre `features.json` (landing) y `featureMap.jsx` (demo).
- La landing arma: preview = `${base}/?embed=${id}&theme=${theme}` · ver en vivo = `${base}/?feature=${id}`.
- `base` sale de `resolveDemoBase()`: Vercel en prod, `localhost:${devPort}` en dev.
- **Solo son embebibles los widgets aislados** (una calculadora, un mapa). Los módulos admin
  y los portales necesitan contexto (login, estado, navegación) → van como **"ver en vivo"**.

## Clasificación de cada feature (define cómo se muestra)

- `embed` — widget aislado, se renderiza en iframe dentro del modal (preview real).
- `live` — abre la app completa en el `viewMode`/rol correspondiente (sin preview en iframe, o con screenshot).
- `pack` — bundle de varias features (se arma con `featureIds`).

---

# FASE 0 — Rediseño del marketplace (hacer PRIMERO)

Como vamos a pasar de 7 a ~60 items, primero cambiamos la UI y el schema para que escale.

- [x] **0.1 — Cards más chicas y simples.** Reducir la card a: ícono + nombre + rubro + tagline corta
      (sin descripción larga ni imagen grande). Grid más denso (más columnas en desktop).
      → card es un único click-target que abre el modal + toggle "+" flotante; grid `xl:grid-cols-4`.
- [x] **0.2 — Modal enriquecido.** Al abrir, mostrar: descripción larga, screenshot(s), highlights
      (bullets), rubro/tipo, y botones: **"Ver en vivo"** (deep-link) + **"Probar"** (embed si aplica)
      + **"Agregar al pack"**.
      → embed = iframe en vivo (probar = jugar in-situ); live = carrusel de screenshots + "Ver en vivo".
- [x] **0.3 — Extender el schema de `features.json`.** Agregar campos por feature:
      `kind` (`embed`|`live`|`pack`), `longDescription`, `highlights: []`, `screenshots: []`,
      `demoRole` (para portales/admin: qué `viewMode` abre el "ver en vivo").
      Actualizar `index.js` (`embedUrl`/`liveUrl`) para respetar `kind` y `demoRole`.
      → helpers `isEmbed()`/`hasLiveLink()`; `liveUrl` agrega `&role=<demoRole>` cuando existe.
- [x] **0.4 — Nuevas categorías/rubros.** Ampliar `categories` para cubrir: reservas, portales,
      CRM/gestión, marketing/publicación, finanzas, contenido, comunicación, mapas, i18n.
      Agregar filtro por **tipo** (front / portal / admin) además de por rubro.
      → Por decisión de UX del owner: NO hay filtro por rubro. Buscador arriba (fila propia) y
      debajo UNA sola lista plana de chips = categorías + los tipos front/portal/admin mezclados
      como si fueran categorías más (sin separador ni sección aparte); clic filtra por category O type.
      `admin` relabeleado a "Administración". El rubro se muestra solo como cuadradito con inicial (I/H) en la card.
- [x] **0.5 — Sección de Packs destacada.** Rediseñar "Packs listos para arrancar" para los nuevos
      bundles (landing completa, suite admin, portales, etc.).
      → cards con accent-bar por app, chips clickeables de features (abren modal), grid hasta 3 col.

Screenshots ya disponibles en `apps/*/scripts/*.png` (embed-*, marketplace-*) → reutilizar en el modal.

---

# FASE 1 — Hotelería

## Batch H-A · Landing pública (embed)
- [ ] `accommodation-catalog` — Catálogo de habitaciones y villas (3 tiers, detalle + reserva). **embed**
- [ ] `hotel-amenities` — Amenities del hotel (6 principales + extendidas). **embed**

## Batch H-B · Landing pública (embed)
- [ ] `offers-packages` — Paquetes/ofertas curadas con modal de detalle. **embed**
- [ ] `hotel-reviews` — Reseñas con rating agregado + carrusel. **embed**

## Batch H-C · Landing pública (embed/live)
- [ ] `hotel-contact` — Sección de contacto con validación + info + redes. **embed**
- [ ] `news-bar` — Barra de anuncios/noticias rotativa (gestionada por admin). **live**

## Batch H-D · Portal huésped (embed)
- [ ] `online-checkin` — Check-in digital (wizard 6 pasos + llave digital). **embed**
- [ ] `service-request` — Solicitar servicio (wizard 3 pasos). **embed**

## Batch H-E · Portal huésped (embed)
- [ ] `excursions-booking` — Reserva de excursiones (grid + wizard). **embed**
- [ ] `amenities-booking` — Reserva de amenities premium (spa, cabana, etc.). **embed**

## Batch H-F · Portal huésped (embed/live)
- [ ] `dining-hub` — Restaurante / room service (menú, carrito, reservar mesa). **embed**
- [ ] `guest-chat` — Chat en vivo con recepción (con auto-reply IA). **embed**

## Batch H-G · Portal huésped (live)
- [ ] `guest-portal` — "Mi estadía" completa (overview, timeline, saldo, solicitudes). **live**

## Batch H-H · Admin — operación diaria (live)
- [ ] `hotel-admin-dashboard` — Dashboard con KPIs, actividad del día, quick actions. **live**
- [ ] `reservations-tapechart` — Reservaciones / Tape Chart (Gantt 14d × habitaciones). **live**

## Batch H-I · Admin — recepción y habitaciones (live)
- [ ] `reception-frontdesk` — Recepción / front desk (llegadas, check-in/out, timeline). **live**
- [ ] `room-management` — Gestión de habitaciones (mapa del edificio, estados, precios). **live**

## Batch H-J · Admin — actividades (live)
- [ ] `events-admin` — Eventos: CRUD + recurrencia + calendario + métricas. **live**
- [ ] `excursions-admin` — Excursiones: catálogo + salidas + métricas. **live**

## Batch H-K · Admin — instalaciones y limpieza (live)
- [ ] `facilities-admin` — Instalaciones: asignar spots de pileta/playa. **live**
- [ ] `housekeeping` — Gobernanta: tareas kanban, equipo, métricas. **live**

## Batch H-L · Admin — comunicación e inventario (live)
- [ ] `hotel-inbox-ai` — Bandeja IA multicanal (WhatsApp, IG, Web, Booking, Portal, Service). **live**
- [ ] `inventory` — Inventario: stock, alertas low-stock, reorden, trends. **live**

## Batch H-M · Admin — marketing y servicios (live)
- [ ] `news-admin` — Noticias/anuncios: CRUD de la NewsBar con preview. **live**
- [ ] `dynamic-pricing` — Pricing dinámico: tarifas, temporadas, ofertas. **live**

## Batch H-N · Admin — servicios y usuarios (live)
- [ ] `service-requests-monitor` — Monitor de solicitudes de servicio + asignación. **live**
- [ ] `hotel-users-roles` — Usuarios y roles (CRUD + matriz de permisos). **live**

## Batch H-O · Transversales
- [ ] `hotel-i18n` — Sistema i18n ES/EN. **live**
- [ ] `hotel-currency` — Selector de moneda USD/ARS/EUR. **embed** (widget) / **live**
- [ ] `hotel-tour-360` — Tour virtual 360° (en detalle de habitación). **embed**

---

# FASE 2 — Inmobiliaria

## Batch I-A · Landing pública (embed)
- [ ] `services-realestate` — Servicios (8, con modal de detalle). **embed**
- [ ] `agents-section` — Equipo de agentes (foto, rating, contacto). **embed**

## Batch I-B · Landing pública (embed)
- [ ] `testimonials` — Testimonios de clientes. **embed**
- [ ] `realestate-contact` — Contacto con tipo de consulta. **embed**

## Batch I-C · Búsqueda y listado (embed/live)
- [ ] `properties-list` — Listado con filtros avanzados + ordenamiento. **live**
- [ ] `property-map` — Mapa con markers + dibujo de zona (point-in-polygon). **embed**

## Batch I-D · Detalle de propiedad (embed)
- [ ] `property-comparator` — Comparador side-by-side (hasta 4, highlights). **embed**
- [ ] `property-detail` — Ficha de propiedad (galería, specs, cuota estimada). **live**

## Batch I-E · Detalle — visuales (embed)
- [ ] `realestate-tour-360` — Tour virtual 360° de la unidad. **embed**
- [ ] `floor-plan` — Plano de distribución (foto o esquema SVG auto). **embed**

## Batch I-F · Conversión (embed)
- [ ] `schedule-visit` — Agendar visita (presencial/videollamada). **embed**
- [ ] `property-search-hero` — Buscador del hero con filtros. **embed**

## Batch I-G · Portales de cliente (live)
- [ ] `buyer-portal` — Portal Interesado (favoritos, visitas, ofertas, docs, alertas). **live**
- [ ] `tenant-portal` — Portal Inquilino (contrato, pagos, ajuste, docs, reparaciones). **live**

## Batch I-H · Portal propietario (live)
- [ ] `owner-portal` — Portal Propietario (propiedades, liquidaciones, docs, cobros). **live**

## Batch I-I · Admin — core (live)
- [ ] `realestate-admin-dashboard` — Dashboard con KPIs + pipelines kanban. **live**
- [ ] `property-management` — Gestión de propiedades (CRUD, form 4 tabs). **live**

## Batch I-J · Admin — equipo y visitas (live)
- [ ] `agents-management` — Gestión de agentes (métricas, ranking, cartera). **live**
- [ ] `visits-scheduler` — Agenda de visitas (confirmar/reagendar, videollamada). **live**

## Batch I-K · Admin — contratos (live)
- [ ] `contracts-management` — Gestión de contratos (ciclo de vida, ajustes, renovar/rescindir). **live**
      *(el simulador de ajuste ya está como `adjustment-simulator` embebible)*

## Batch I-L · Admin — ventas (live)
- [ ] `leads-management` — Pipeline de leads (6 etapas + scoring). **live**
- [ ] `operations-management` — Operaciones de cierre (documentos por etapa, comisiones). **live**

## Batch I-M · Admin — comunicación y publicación (live)
- [ ] `realestate-inbox-ai` — Bandeja IA (WhatsApp/Portal/Web + templates). **live**
- [ ] `platform-publishing` — Publicación en portales (Zonaprop, ArgenProp…) + analytics. **live**

## Batch I-N · Admin — finanzas y usuarios (live)
- [ ] `owner-liquidations` — Liquidaciones al propietario (neto, recibo PDF). **live**
- [ ] `realestate-users-permissions` — Usuarios y permisos (roles + matriz). **live**

---

# FASE 3 — Packs (bundles)

> "Poner todo" también como combos vendibles. Cada pack agrupa `featureIds` existentes.

## Hotelería
- [ ] `pack-hoteleria-landing` — **Landing completa**: hero, catálogo, amenities, ofertas, eventos, reseñas, contacto.
- [ ] `pack-hoteleria-guest` — **Experiencia del huésped** (ya existe, ampliar): portal, check-in, dining, excursiones, pileta/playa, amenities, chat.
- [ ] `pack-hoteleria-admin` — **Suite de gestión**: dashboard, reservas, recepción, habitaciones, housekeeping, inventario, pricing, inbox, usuarios.
- [ ] `pack-hoteleria-comunicacion` — **Comunicación**: inbox IA, chat huésped, noticias/anuncios.

## Inmobiliaria
- [ ] `pack-inmobiliaria-landing` — **Landing completa**: hero, servicios, destacadas, agentes, testimonios, contacto.
- [ ] `pack-inmobiliaria-captacion` — **Captación de leads** (ya existe, ampliar): tasador, calculadora, qué hay cerca, comparador, agendar visita.
- [ ] `pack-inmobiliaria-crm` — **CRM / suite admin**: dashboard, propiedades, agentes, visitas, leads, operaciones, publicación.
- [ ] `pack-inmobiliaria-portales` — **Portales de cliente**: interesado, inquilino, propietario.
- [ ] `pack-inmobiliaria-alquileres` — **Gestión de alquileres**: contratos, simulador de ajuste, liquidaciones, portal inquilino/propietario.

---

# Orden de trabajo sugerido

1. **Fase 0** completa (rediseño UI + schema) — habilita todo lo demás.
2. Features `embed` de landing (H-A/B/C, I-A/B) — son las más fáciles y de mayor impacto visual.
3. Resto de `embed` (portales huésped, herramientas inmobiliaria).
4. Features `live` (admin + portales) — solo entradas en `features.json` con deep-link, sin wiring de embed.
5. **Fase 3** packs — una vez que existen todas las features individuales.

## Checklist por feature (definition of done)
- [ ] Entrada en `features.json` (landing) con todos los campos del schema nuevo.
- [ ] Si es `embed`: wired en `apps/<app>/src/embed/featureMap.jsx`.
- [ ] Si tiene "ver en vivo": deep-link `?feature=<id>` funciona en `apps/<app>/src/App.jsx`.
- [ ] Screenshot para el modal (reusar/generar en `apps/<app>/scripts/`).
- [ ] Smoke test del marketplace sigue pasando (`smoke-marketplace.mjs`).
</content>
</invoke>

# Backlog — Hotelería (demo)

Lista viva de pendientes. Tags: `Q` quick-win · `M` medio · `L` grande. Todo UI-only (sin backend), con persistencia en localStorage y delays simulados para realismo.

> **Estado — cierre de sesión (30-ago-2026).**
> **Hecho y commiteado hoy:** recorrido **360° + plano 2.5D** (componentes en `packages/shared-ui`, wired en inmobiliaria y en el detalle de habitación de hotelería) · sprint **admin quick-wins**: fix del modal de edición, *Today's Activity* con detalle + check-in/out, *Room status* + *Quick actions* enriquecidos, **mapa 2.5D** de habitaciones · nuevo **panel de Excursiones** (cupos, horarios, estado, gestión).
> **Próximo sugerido:** `C. Pricing / yield management` (el módulo más vendedor). Luego: `A. Guest portal` (My Stay + cartas), `F. Roles manager/empleado` y automatizaciones/CRM.
> Todo el detalle de pendientes, abajo. ⬇️

---

## A. Guest portal (cliente)

- [ ] **`L` Recorrido completo** — flujo end-to-end del huésped (check-in → estadía → checkout).
- [ ] **`M` "My Stay" (overview) con toda la info** — reserva, fechas, habitación, saldo/factura, servicios **pendientes vs hechos** (resumen), accesos rápidos.
- [ ] **`M` Room Service → carta de comida real** — menú navegable por categorías (desayuno/almuerzo/cena/minibar), fotos, precios, agregar al pedido, resumen.
- [ ] **`M` Reservations mejorado** — además de excursiones, **reserva de cena en el restaurante** con selección de horario/mesa y **ver cartas** (comida + vinos). Confirmación.
- [ ] **`Q` Aclarar/rework "My Requests"** — *(ver nota abajo)* hoy es el tracker de solicitudes del huésped (room service/housekeeping) con estado. Decisión: mantenerlo como **historial completo con estados/timeline** y llevar solo el **resumen** a "My Stay".
- [ ] **`M` Factura / folio** — cargos detallados de la estadía, checkout & "pagar", descarga simulada.
- [ ] **`M` Check-in digital / llave digital** — precheck-in (datos, hora de llegada) + tarjeta de llave simulada.
- [ ] **`Q` Chat con recepción** — desde el portal, conectado conceptualmente a la Bandeja IA del admin.

## B. Admin — dashboard y operación

- [x] **`M` Today activity con ver detalle** — filas clickeables → modal de detalle (huésped, contacto, estadía, pago, pedidos especiales) + **check-in/out reales**. *(Dashboard general aún se puede seguir puliendo.)*
- [x] **`M` Room status & Quick actions** — Room status ahora con **ocupación %** + "rooms need attention"; Quick actions **navegables** (services/housekeeping/inventory) con urgencia.
- [x] **`M` Room Management + mapa 2.5D** — nuevo view "mapa": **edificio por pisos** con tiles coloreadas por estado + indicador de huésped; click → editar. *(RoomManagement se puede enriquecer más.)*
- [x] **`Q` Fix modal de edición de habitación** — era el `-translate-1/2` pisado por el transform de framer → reescrito con overlay flex-center.
- [x] **`M` Panel de Excursiones (admin)** — nueva sección: KPIs (activas, salidas hoy, ocupación de cupos, ingresos), tarjetas con **horarios + cupos** (barras booked/capacity), toggle activo/inactivo, y modal para gestionar **precio, estado, capacidad por horario y agregar/quitar salidas**. Data en `data/admin/mockExcursions.js`.

## C. Admin — revenue / pricing (el diferencial de venta)

- [ ] **`L` Precios dinámicos administrables (yield management)** — objetivo: **hotel siempre lleno**. Incluye:
  - Reglas automáticas por **ocupación** (ocupación > X% → +Y% tarifa; noche valle < X% → oferta).
  - **Last-room offers** (habitación libre → descuento para llenarla).
  - Descuentos por **estadía larga (LOS)**, multiplicadores por **día de semana / temporada / evento**.
  - **Simulador en vivo**: movés ocupación → ves tarifa y **RevPAR/ingreso proyectado**.
  - **Sugerencias de la IA**: acciones concretas para llenar noches valle (ej: "bajá 8% la Deluxe mar–jue").

## D. Admin — Bandeja IA

- [ ] **`M` Bandeja IA escribible** — composer para **escribir y responder**, con:
  - **Respuestas pre-cargadas / quick replies** (canned).
  - **Borrador sugerido por IA** editable antes de enviar.
  - Simulación de "escribiendo…" y envío. Estados leído/respondido.

## E. Admin — CRM / usuarios

- [ ] **`L` Dashboard de clientes/usuarios** — falta hoy. Lista de huéspedes, perfil, **historial de estadías**, preferencias, tier de fidelidad/VIP, notas, segmentos.

## F. Cross-cutting (estructural)

- [ ] **`L` Vistas por rol: Manager vs Empleado** — switch que filtra el sidebar:
  - **Manager**: finanzas (comisión), pricing/revenue, CRM, analytics, automatizaciones.
  - **Empleado**: operación del día (llegadas/salidas, housekeeping, service requests, inbox).
- [ ] **`L` Mensajes automáticos / campañas** — disparadores (pre-check-in, bienvenida, mid-stay, checkout, **pedido de valoración post-estadía**, cumpleaños, win-back), plantillas, canal (email/WhatsApp), programación, historial de envíos. Liga con reputación/valoraciones.

## G. Ideas extra (para sumar)

- [ ] `M` Reputación: responder reviews (con borrador IA) + sentiment.
- [ ] `M` Analytics: occupancy / ADR / RevPAR con tendencia, mix de canales.
- [ ] `Q` Centro de notificaciones en el admin.
- [ ] `M` Calendario/timeline de reservas (vista tipo gantt por habitación).
- [ ] `M` Reserva de spa/excursiones/restó **desde el portal** del huésped.
- [ ] (ya en PROGRESS) Toggles moneda/idioma/mercado.

---

## Notas / respuestas
- **¿Qué uso tiene "My Requests"?** Es el rastreador de solicitudes del huésped (lo que pidió: room service, housekeeping) con su estado. Se solapa con "servicios pendientes/hechos" de My Stay → se unifica: resumen en My Stay, historial completo en My Requests.
- **Bandeja IA escribible**: sí, totalmente factible como UI (canned + borrador IA + envío simulado).
- **Pricing**: el yield management + simulador es el módulo más "vendedor" para un hotel.
- **2.5D en admin**: el mapa de estados por piso es el mejor reuso del componente nuevo.

## Orden sugerido
1. **Admin quick-wins** — fix modal edición + Today activity con detalle + Room status/quick + mapa 2.5D. *(rápido y muy visible; arregla el bug reportado)*
2. **Pricing / yield** — el diferencial de venta.
3. **Guest portal** — My Stay + cartas + requests unificado.
4. **Roles + automatizaciones + CRM** — lo estructural.

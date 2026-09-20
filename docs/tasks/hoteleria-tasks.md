# Hoteleria — Tareas Seccionadas

Cada tarea es autocontenida para una sesion. Decir "hace la H3" y arrancar.
Complejidad calibrada para hacer UNA tarea bien a fondo por sesion.
Orden sugerido: bugs primero, despues features de alto impacto.

---

## H1: Fix bugs existentes
**Esfuerzo:** Bajo (30-45 min)
**Archivos:** rooms.json, GuestPortal.jsx, AdminHeader.jsx, OffersSection.jsx

Hacer todo junto porque son fixes rapidos:
- [x] RoomDetailPage galeria: usa `[room.image x4]`. Agregar campo `images[]` a rooms.json con 4 URLs distintas por habitacion. Actualizar RoomDetailPage para usar `room.images || [room.image]`
- [x] GuestPortal MOCK_GUEST: fechas hardcodeadas enero 2024. Cambiar a fechas relativas (hoy + 2 dias check-in, hoy + 7 check-out, o similar)
- [x] AdminHeader viewTitles: agregar entries para `inbox: "Bandeja IA"`, `pricing: "Precio Dinamico"`, `excursions: "Excursiones"`
- [x] OffersSection "Learn More": agregar handler que abra modal con detalles expandidos del paquete, o scroll a booking

**Criterio de exito:** Los 4 bugs corregidos. Verificar visualmente en port 3001.

---

## H2: Guest Portal — Login simulado ✅
**Esfuerzo:** Medio (1-2 hrs)
**Archivos:** GuestPortal.jsx (o nuevo LoginScreen.jsx)

- [x] Crear pantalla de login ANTES de mostrar el portal
- [x] Formulario: email + password (cualquier credencial funciona, es demo)
- [x] Boton "Iniciar sesion" con delay simulado 500ms + loading state
- [x] Opcion Google/Apple login (disabled, placeholder visual)
- [x] Al loguearse, mostrar el portal actual con datos mock
- [x] Boton "Cerrar sesion" en el header del portal que vuelve al login
- [x] Dark mode, responsive, Framer Motion en transicion login → portal

**Criterio de exito:** El portal ya no carga directo. Hay pantalla de login profesional.

---

## H3: Guest Portal — Merge "My Requests" en "My Stay" + localStorage ✅
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** GuestPortal.jsx

- [x] Eliminar tab "My Requests" de la navegacion
- [x] Agregar seccion "Solicitudes activas" dentro del tab "My Stay", debajo del billing
- [x] Mostrar requests como cards compactas con estado, servicio, timestamp
- [x] Si no hay requests: no mostrar seccion (no empty state)
- [x] Implementar persistencia localStorage para todos los requests del portal (service requests + amenity reservations)
- [x] Key: `hotel-luxury-guest-requests`
- [x] Al refrescar, los requests deben persistir

**Criterio de exito:** Tab "My Requests" no existe. Requests visibles en "My Stay". Persisten al refrescar.

---

## H4: Bandeja IA — Agente puede escribir + templates ✅
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** InboxManagement.jsx, mockConversations.js

- [x] Agregar input de texto en la columna del thread de mensajes (abajo, tipo WhatsApp)
- [x] Boton enviar que agrega el mensaje al thread como "Staff" (right-aligned, accent bg)
- [x] Dropdown/boton de mensajes pre-cargados (templates): 8 templates de hoteleria
- [x] Al seleccionar template, se llena el input (editable antes de enviar)
- [x] Mensaje enviado aparece con timestamp actual y label "Equipo"
- [x] Animacion de entrada del nuevo mensaje (Framer Motion + AnimatePresence)
- [x] Persistir nuevos mensajes en localStorage (key: `hotel-admin-inbox`)

**Criterio de exito:** El agente puede escribir mensajes libres y usar templates. Persisten al refrescar. ✅

---

## H5: Live Chat en Guest Portal = Bandeja IA ✅
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** GuestPortal.jsx (tab Help), GuestChat.jsx (nuevo), InboxManagement.jsx, useLiveChat.js (nuevo hook)

- [x] Reemplazar boton placeholder "Live Chat" en Help con chat funcional (+ launcher flotante con badge)
- [x] Al abrir, mostrar ventana de chat (widget flotante desktop / drawer full mobile)
- [x] Mensajes del huesped se guardan en localStorage (key: `hotel-live-chat`)
- [x] Los mismos mensajes aparecen como conversacion nueva en la Bandeja IA del admin
- [x] Crear hook compartido `useLiveChat.js` que lee/escribe del mismo localStorage (sync via custom + storage events)
- [x] En Bandeja IA, la conversacion del portal aparece como canal "Portal" con icono diferenciado (Headset)
- [x] Respuestas del admin (de H4) aparecen en el chat del huesped
- [x] Auto-respuesta IA simulada si el admin no responde en 5 seg

**Criterio de exito:** Huesped escribe en Help, mensaje aparece en Bandeja IA. Admin responde, respuesta aparece en portal. Mismo localStorage. ✅

---

## H6: Tape Chart — Calendario visual de ocupacion ✅
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** Nuevo: admin/calendar/CalendarManagement.jsx, AdminLayout.jsx, AdminSidebar.jsx, AdminHeader.jsx

- [x] Nuevo modulo admin: "Calendario" (icono CalendarRange en sidebar)
- [x] Vista tipo Gantt horizontal:
  - Eje Y: habitaciones agrupadas por piso
  - Eje X: 14 dias, scroll horizontal + navegacion por semana (‹ Hoy ›)
  - Barras de color por estado: azul=confirmed, verde=checked-in, gris=checked-out, rojo=cancelled
  - Hover en barra: tooltip que sigue el cursor con huesped, fechas, tipo, estado
- [x] Click en barra abre modal de detalle completo
- [x] Click en celda vacia: crear nueva reserva (formulario rapido, persiste en localStorage)
- [x] Rooms sin reserva se ven vacias (disponibles); celdas clickeables
- [x] Datos de mockReservations.js (+ reservas creadas)
- [x] Responsive: scroll horizontal, columnas sticky (habitacion + header de dias)
- [x] Dark mode con CSS variables + KPIs (ocupacion, disponibles, llegadas, salidas)
- [x] Agregar "Calendario" al viewTitles de AdminHeader

**Criterio de exito:** Vista de calendario funcional con reservas visibles como barras. Click en barra muestra detalle. Se ve profesional. ✅

---

## H7: F&B — Restaurante con menu digital + QR ordering ✅
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** Nuevo: components/client/restaurant/ (MenuBrowser.jsx, CartDrawer.jsx, OrderConfirmation.jsx), data/menuItems.json

- [x] Crear data/menuItems.json: 19 items organizados por categoria (Breakfast, Lunch, Dinner, Desserts, Drinks). Cada item: id, name, description, price, image, category, allergens[], available, popular, vegetarian, glutenFree
- [x] MenuBrowser.jsx: grid de items con foto, nombre, precio, descripcion corta, badges (popular, vegetariano, sin gluten). Filtros por categoria + dietary + avoid alergenos. Busqueda
- [x] Agregar al Guest Portal tab "Services" como seccion "Restaurante" con boton "View menu"
- [x] Al click, abre el menu browser (overlay full-screen)
- [x] Cada item tiene boton "Add" con cantidad (+/-)
- [x] CartDrawer: drawer lateral con items seleccionados, cantidades, subtotal, notas especiales, boton "Place order"
- [x] Enviar pedido: delay 800ms, confirmacion con numero de orden, ETA estimado
- [x] El pedido aparece en "My Stay" como request activa
- [x] Dark mode, responsive, animaciones

**Criterio de exito:** Huesped puede explorar carta, armar pedido, confirmar. Pedido aparece en sus requests. ✅

---

## H8: Dynamic Pricing — Ofertas + sugerencias automaticas + temporadas ✅
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** DynamicPricing.jsx, mockPricing.js

- [x] Seccion nueva: "Ofertas activas" — lista de ofertas manuales creadas
  - Boton "Crear oferta": modal con nombre, % descuento, tipos de habitacion aplicables, fecha inicio/fin
  - Cada oferta: card con nombre, descuento, habitaciones, estado (activa/expirada/programada/pausada), toggle activar/desactivar + eliminar
- [x] Seccion nueva: "Sugerencias automaticas" — el sistema detecta habitaciones sin reservar
  - Logica: si una habitacion no tiene reserva para los proximos X dias (configurable con stepper, default 3), sugerir descuento (escala 10/15/20% segun gap)
  - Card de sugerencia: "Room 305 (Deluxe) · Proxima reserva en X dias. Sugerencia: -15%"
  - Botones: "Aplicar" (crea oferta auto) / "Ignorar"
- [x] Seccion nueva: "Temporadas" — definir periodos de alta/baja
  - Lista de temporadas: nombre, fecha inicio, fecha fin, multiplicador de precio (Alta x1.3, Baja x0.8) con badge
  - Boton agregar temporada (modal)
- [x] Mantener la tabla actual de nominal vs real como esta (funciona bien)
- [x] Todo persiste en localStorage (key: hotel-pricing-config)

**Criterio de exito:** Admin puede crear ofertas, ver sugerencias de descuento automaticas, definir temporadas. Interactivo. ✅

---

## H9: Room Management — Edicion expandida + encargados ✅
**Esfuerzo:** Medio-Alto (2-3 hrs)
**Archivos:** RoomManagement.jsx, RoomEditModal.jsx, useAdminData.js

- [x] Expandir RoomEditModal significativamente:
  - Status (ya existe)
  - Precio por noche (input numerico editable)
  - Descripcion (textarea editable)
  - Amenities (checklist toggleable con iconos; pre-seleccion inferida de los amenities en español)
  - Encargado asignado (dropdown de staff de mockStaff.js)
  - Notas internas (textarea, ya existe)
  - Galeria de imagenes (thumbnails + placeholder "Upload")
  - Historial de cambios (ultimos 3, con timestamp relativo: "Status changed to Cleaning by Admin · 2h ago")
- [x] En la vista grid/tabla, mostrar nombre del encargado asignado (asignacion default round-robin)
- [x] Nuevo filtro: por encargado (+ Unassigned)
- [x] Todos los cambios persisten en localStorage (roomOverrides en hotel-admin-data)

**Criterio de exito:** El modal de edicion tiene 8+ campos editables. Se puede asignar encargado. Mucho mas completo que antes. ✅

---

## H10: Housekeeping — Metricas por trabajador + panel de personal ✅
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** HousekeepingManagement.jsx, mockHousekeeping.js

- [x] Nueva seccion/tab: "Team Metrics" (tab switcher Tasks / Team Metrics)
  - Card por trabajador con:
    - Avatar (iniciales), nombre, turno actual, estado
    - Tareas completadas hoy / esta semana / este mes
    - Tiempo promedio por tarea (calculado de 30 dias de historial + tareas live)
    - Rating de calidad (1-5 estrellas, perfil por trabajador)
    - Barra de productividad (tareas/hora con marcador de promedio del equipo)
  - Ranking del equipo (mejor → peor por productividad, con medallas top 3)
  - Grafico de barras: tareas completadas por dia (ultimos 7 dias, hoy resaltado)
- [x] En el StaffOverview existente, click para expandir detalle del trabajador (métricas mini)
- [x] En cada TaskCard, "Elapsed" en tareas in-progress (live, tick cada 30s)
- [x] Nuevo filtro: por trabajador asignado (+ Unassigned)

**Detalle técnico:** historial de tareas generado con PRNG semillado (determinístico, estable
entre renders/reloads) en `mockHousekeeping.js` — 563 tareas / 30 días / 3 perfiles distintos.
Helpers `getStaffMetrics` y `getWeeklyCompletion`. Métricas mezclan historial + tareas
completadas en vivo. Gotcha evitado: los colores del theme (`var()`) NO soportan alpha en
Tailwind (`bg-primary/50` es no-op), se usaron fills sólidos.

**Criterio de exito:** Hay una vista de metricas con rendimiento individual. Se siente como un panel de gestion de personal real. ✅

---

## H11: Curated Experiences (OffersSection) funcional ✅
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** OffersSection.jsx, App.jsx, BookingForm.jsx

- [x] "Learn More" abre modal con:
  - Imagen grande del paquete (hero con gradiente + badges)
  - Descripcion extendida (`longDescription` + `tagline` por paquete)
  - Lista completa de inclusiones con iconos (cada inclusion tiene su propio icono lucide)
  - Politica de cancelacion (card dedicada, ShieldCheck)
  - Fechas de validez (card dedicada, CalendarRange)
  - Boton "Reservar este paquete" que lleva a BookingForm con el paquete preseleccionado
- [x] "Reserve Now" debe funcionar: lleva a BookingForm con datos del paquete
- [x] Agregar 1-2 paquetes mas → 4to paquete "Wellness Retreat" agregado (total 4)
- [x] Agregar tag "Mas vendido" al paquete Romantic Escape (badge gold + Star)

**Detalle técnico:** cada paquete tiene `priceValue` numerico para que el BookingForm calcule
noches × precio. App.jsx mapea el paquete a un objeto tipo-room (`isPackage`, `packageDetails`,
`cancellationPolicy`) y reusa el BookingForm existente, que ahora muestra las inclusiones del
paquete y la politica de cancelacion en el resumen, y usa label "Package:" en la confirmacion.
Gotcha respetado: sin alpha sobre colores del theme (`bg-accent/10` es no-op) → fills solidos +
`hover:opacity-90` para el feedback.

**Criterio de exito:** Ambos botones funcionan. Modal de detalle completo. 4 paquetes disponibles. ✅

---

## H12: Services portal — Restaurante + excursiones + amenities expandido ✅
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** GuestPortal.jsx (tab Services), ExcursionBookingForm.jsx

- [x] Reorganizar tab Services en 4 secciones claras con sub-navegacion segmentada (pills):
  1. **Room Service** (existente, mantener) — agrupa In-Room Dining + Housekeeping + Report an Issue
  2. **Restaurante** — banner que abre el DiningHub de H7 (menu, room service, mesa, mozo)
  3. **Excursiones** — grid de cards (de EXCURSIONS), click preselecciona y salta al paso 2 del ExcursionBookingForm
  4. **Amenities** — cards de amenities reservables (spa, gym, pool, restaurant, transfer), click abre reservation modal
- [x] Cada seccion con icono y descripcion breve (header con chip de icono + texto)
- [x] Las reservaciones hechas aparecen en "My Stay" (de H3) — handlers ya conectados
- [x] H7 esta hecho → se integra el DiningHub real (no menu estatico)

**Detalle técnico:** se eliminó el tab "Reservations" (duplicaba excursiones+amenities); todo lo
reservable vive ahora en Services con sub-navegacion interna (`SERVICE_SECTIONS` + estado
`servicesSection`). `EXCURSIONS` se exporta desde ExcursionBookingForm y el form acepta
`initialExcursionId` para preseleccion. Quick actions del overview actualizadas (Dining /
Room Service / Excursions / Amenities) con helpers `goToServices(section)` y `openExcursion(id)`.
Gotcha respetado: sin alpha sobre colores del theme (`bg-accent/10`, `hover:bg-accent/90` son
no-op) → fills sólidos (`bg-bg`, `bg-surface`) + borders + `hover:opacity-90`.

**Criterio de exito:** Tab Services tiene 4 categorias claras y navegables. El huesped puede explorar y reservar desde cada una. ✅

---

## H13: Noticias / Avisos (admin → front) ✅
**Esfuerzo:** Medio (2 hrs)
**Archivos:** Nuevo: admin/news/NewsManagement.jsx, components/NewsBar.jsx, data/mockNews.js, hooks/useNews.js

- [x] mockNews.js: 4 avisos mock con: id, title, message, type (info/warning/event), startDate, endDate, enabled. Helpers `newsStatus` (active/scheduled/expired/paused) e `isLive`. Config `NEWS_TYPES` (color + icono por tipo). Fechas relativas a hoy (no se vencen)
- [x] Admin: NewsManagement.jsx
  - Lista de avisos ordenada por estado (activo → programado → pausado → expirado) con badge de tipo + estado
  - Boton "Crear aviso": modal con tipo (pills), titulo, mensaje (contador 180), fecha inicio/fin (DatePicker compartido)
  - Toggle activar/pausar + editar + eliminar
  - Vista previa en vivo de como se vera la barra en el front (dentro del modal)
  - Agregado a sidebar con icono Megaphone + viewTitle en AdminHeader
- [x] Front: NewsBar.jsx
  - Barra fija arriba en la landing que muestra avisos activos (hoy entre startDate y endDate)
  - Estilo segun tipo: info (azul), warning (amber), event (verde)
  - Rotacion automatica (6s) con dots + flechas cuando hay varios; crossfade entre avisos
  - Dismissable por el usuario (persistido por-id)
  - Animacion slide-down al aparecer; empuja el navbar hacia abajo (prop `topOffset`)
  - Si no hay avisos activos, no se muestra
- [x] Persistencia localStorage (`hotel-news` + `hotel-news-dismissed`) con sync entre admin y front via custom + storage events (hook `useNews`)

**Detalle técnico:** admin y front comparten estado por el hook `useNews` (mismo patrón que
`useLiveChat` de H5): ambos leen/escriben `hotel-news` en localStorage y se sincronizan con un
evento custom (misma pestaña) + `storage` (otras pestañas), así un aviso creado en el admin
aparece en la landing sin recargar. Los dismissals viven en su propia key para no mutar el
contenido del admin. La barra es `fixed top-0` y el navbar compartido recibe un prop nuevo
`topOffset` (default 0, no-breaking) para no solaparse. Gotcha respetado: los tints usan colores
de la paleta estándar de Tailwind (blue/amber/emerald con /alpha), NO los tokens del theme
(`bg-primary/10` es no-op silencioso).

**Criterio de exito:** Admin crea aviso con fechas. Aviso aparece automaticamente en la landing. Desaparece cuando pasa la fecha. ✅

**Iteración (2026-09-14):** tablero del admin ahora separa vigentes (activo/programado/pausado)
de un **historial colapsable** de expirados (filas compactas con acción "Reutilizar" = republica
7 días desde hoy, + editar/eliminar). Fix de correctitud: `mockNews` pasó a fecha **local** (no
`toISOString()` UTC) para que la ventana de fechas no desfase un día en UTC-3.
Pendiente a criterio del owner: sección "Novedades" en el home (feed) — se dejó fuera porque la
`NewsBar` ya cubre el aviso urgente; se hace solo si se quieren comunicados largos.

---

## H14: Panel de Actividades / Eventos ✅
**Esfuerzo:** Medio-Alto (2-3 hrs)
**Archivos:** Nuevo: admin/events/EventsManagement.jsx, components/EventsCalendar.jsx, data/mockEvents.js, hooks/useEvents.js

- [x] mockEvents.js: 6 eventos mock (id, name, description, date, startTime, endTime, location, image, capacity, registered, category, recurring, cancelled). `EVENT_CATEGORIES` (icono + color por categoría social/wellness/culinary/entertainment). Helpers `eventStatus` (today/upcoming/past/cancelled), `spotsLeft`, `isFull`, `isUpcoming`, `formatEventDate`, `formatTimeRange`. Fechas relativas a hoy (uno hoy, uno pasado para mostrar estado)
- [x] Admin: EventsManagement.jsx
  - KPIs (totales, próximos, inscriptos, ocupación) + tabs Lista/Calendario
  - Lista de cards con thumbnail, badges de categoría/estado, barra de progreso registrados/capacidad, acciones (editar / cancelar-reactivar / eliminar con confirm)
  - Boton "Crear evento": modal con todos los campos (categoría pills, nombre, descripción, ubicación, fecha con DatePicker compartido, inicio/fin, cupos, toggle recurrente) + campo imagen URL con preview + placeholder de upload
  - Editar/cancelar (toggle `cancelled`) evento existente
  - Vista calendario mensual con eventos marcados como chips por día (color por categoría), navegación de mes + "Hoy", click en chip abre editar, leyenda
  - Filtro por categoría + orden por estado
  - Agregado a sidebar con icono CalendarDays + viewTitle en AdminHeader
- [x] Front: EventsCalendar.jsx
  - Sección en la landing "Actividades del hotel" (id `activities`, entre Amenities y Offers) + link en Navbar
  - Cards de eventos próximos con imagen, nombre, descripción, fecha, hora, lugar, "X lugares disponibles" (con estados "¡Últimos N!" y "Sin cupos")
  - Boton "Registrarme" con modal de confirmación; estado "Estás registrado · Cancelar" para revertir
  - Filtro por categoría (solo muestra categorías con eventos próximos)

**Detalle técnico:** admin y front comparten estado por el hook `useEvents` (mismo patrón que
`useNews` de H13): ambos leen/escriben `hotel-events` en localStorage y se sincronizan con evento
custom (misma pestaña) + `storage` (otras pestañas), así un evento creado en el admin aparece en
la landing sin recargar y una inscripción del huésped incrementa el contador que ve el admin. Las
inscripciones del visitante viven en su propia key (`hotel-events-registered`) para saber a cuáles
se anotó sin mutar la lista del admin; registrar bumpea el contador compartido y reserva el cupo.
Gotcha respetado: los colores de categoría usan la paleta estándar de Tailwind (indigo/emerald/
amber/fuchsia con /alpha), NO los tokens del theme (`bg-primary/10` es no-op). Correctitud: `iso()`
y `todayISO` usan fecha **local** (no `toISOString()` UTC) para que las celdas del calendario y el
DatePicker no desfasen un día cerca de medianoche en UTC-3.

**Criterio de exito:** Admin crea eventos. Eventos aparecen en front con info completa. Huesped puede registrarse. ✅

**Iteración (2026-09-14):**
- Admin calendario: **click en un día** (hoy o futuro) abre el modal de crear con la fecha
  pre-cargada; los chips ahora muestran la **hora** (`19:00 · Nombre`).
- **Recurrencia real**: el toggle "recurrente" dejó de ser cosmético — ahora se eligen los
  **días de la semana** (`recurrence.weekdays`) y el evento se muestra en el calendario en cada
  día que corresponde (ícono `Repeat` en las ocurrencias). La fecha efectiva es la próxima
  ocurrencia, así los recurrentes no vencen. Modelo compartido en `data/recurrence.js`.
- Front: nueva vista **carrusel horizontal** (swipe/drag + flechas + snap, con animación de
  entrada) como default, con toggle a **grilla**. Muestra "Próximo: <fecha>" y badge "Semanal".

---

## H16: Check-in digital (Guest Portal) ✅
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** Nuevo: components/client/CheckInFlow.jsx, GuestPortal.jsx

- [x] En "My Stay" del portal, si la reserva esta en estado "confirmed" (no checked-in aun):
  - Banner CTA prominente "Check-in Online" (icono KeyRound + Smartphone) arriba del stay card
  - Abre flujo de 3 pasos (wizard overlay, patrón del ExcursionBookingForm: step indicator + AnimatePresence):
    1. Datos personales: nombre, documento (tipo dropdown + numero), nacionalidad, telefono, email (todo pre-llenado del mock) + validación
    2. Preferencias: piso (alto/bajo/sin preferencia), tipo almohada (soft/medium/firm/hypoallergenic), ventana estimada de llegada, requests especiales
    3. Confirmacion: resumen completo de reserva + datos + preferencias, botón "Confirmar check-in"
  - Al confirmar: delay 1s + spinner, estado cambia a "checked-in", pantalla de éxito con **key digital simulada** (tarjeta tipo celular con nº de habitación, código de llave y pulse animado)
  - Banner de exito: "¡Check-in completado! Presenta este codigo al llegar"
- [x] Despues del check-in, el CTA desaparece; "My Stay" muestra tarjeta persistente de **Digital Room Key** + badge "Checked in" y timeline normal
- [x] Persistir estado en localStorage (`hotel-luxury-guest-checkin`); sobrevive refresh

**Detalle técnico:** `MOCK_GUEST` se cambió a `status: 'confirmed'` llegando **hoy** (checkIn=today,
checkOut=+4) para que el flujo sea demostrable, y se le agregaron `documentType/documentNumber/
nationality` para el prefill. El estado de check-in vive en su propia key localStorage; `isCheckedIn`
y `canCheckIn` derivan de ella + del status del mock. Badge de estadía dinámico ("Arriving today" →
"Checked in"). Gotcha respetado: sin alpha sobre colores del theme — la llave digital usa
`bg-primary text-primary-contrast` (se invierte solo en ambos modos) con acentos sólidos, y el
divisor usa `bg-primary-contrast opacity-20` (opacidad de elemento, no alpha de color) en vez de
`border-*/20`. Los tints de éxito usan la paleta estándar Tailwind (emerald), que sí soporta alpha.

**Criterio de exito:** Flujo de check-in online completo de 3 pasos. Cambia el estado de la reserva. Key digital simulada. ✅

**Iteración (2026-09-14):** los pasos ahora son **dinámicos**: si la reserva es para más de un
huésped (`reservation.guests > 1`) se inserta un paso **"Acompañantes"** que pide nombre +
documento por persona (con validación), y se listan en el resumen de confirmación. Con un solo
huésped el flujo queda igual (sin paso extra). El check-in **desde recepción/admin** NO es parte
de H16 — es **H26** (estación de check-in completa: documentos con foto, asignación de habitación,
pago, firma), compartida huésped/recepción. Definir en H26 si se fusiona con este wizard.

---

## H17: Excursions — Agregar nueva + metricas ✅
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** ExcursionsManagement.jsx, mockExcursions.js

- [x] Boton "Agregar excursion" en la parte superior (header, junto al titulo)
  - Modal: nombre, descripcion, precio, duracion, dificultad, categoria, imagen (URL con preview), guia, capacidad default, location, meeting point + validación (nombre/precio/duración/capacidad)
  - Al guardar (delay 600ms), aparece como nueva excursion al tope de la lista con 2 departures auto (hoy + mañana)
- [x] Nueva seccion: "Metricas" (tab switcher Catalogue / Metrics)
  - Revenue total por excursion (bar chart horizontal CSS/Framer, sin libreria)
  - Top 3 excursiones mas populares (por bookings, con medallas oro/plata/bronce)
  - Ocupacion promedio por dia de la semana (bar chart vertical)
  - Tendencia de bookings ultimas 4 semanas (linea SVG con area + pathLength animado)
  - KPIs: revenue 28d, seats sold 28d, avg ticket
- [x] Persistir nuevas excursiones + edits + toggles en localStorage (key `hotel-excursions`)

**Detalle técnico:** las métricas se calculan de un historial sintético de 28 días generado con PRNG
semillado (`mulberry32`, mismo patrón que mockHousekeeping) en `mockExcursions.js` — determinístico
entre renders/reloads, con perfiles de demanda por excursión (`DEMAND`) y boost de fin de semana.
Helper puro `getExcursionMetrics(excursions, history)` parametrizado para que las excursiones creadas
en runtime (sin historial) se manejen sin romper (contribuyen 0). Gotcha respetado: charts con
`flex-1` + `h-full` para que el `height:%` resuelva; fills sólidos `bg-primary` (nada de alpha sobre
tokens del theme); la línea SVG usa `text-primary` + `stroke="currentColor"`. Validado: build OK,
dev transform OK, test de lógica (revenue positivo, top3, weekday 0-100%, determinismo) PASS.

**Criterio de exito:** Se puede crear excursion nueva. Metricas visibles con datos calculados del mock. ✅

**Iteración (2026-09-14):** **recurrencia de salidas** (lo que se pedía con "setear días y
horarios"). En el modal **crear**: toggle "Schedule recurring departures" → elegís días de la
semana + uno o más horarios + cantidad de semanas, y se autogeneran las departures (con preview
del total); si está apagado, sigue el fallback de hoy+mañana. En **Manage**: bloque "Generate
recurring departures" que agrega salidas a una excursión existente (saltea duplicados de
fecha+hora). Usa el modelo compartido `data/recurrence.js` (mismo que eventos H14).

---

## H18: Usuarios y roles (admin) ✅
**Esfuerzo:** Muy Alto (3-4 hrs)
**Archivos:** Nuevo: admin/users/UserManagement.jsx, data/mockUsers.js, hooks/useUsers.js

- [x] mockUsers.js: 9 usuarios mock (id, name, email, role, avatar, status active/inactive, lastLogin, permissions[]). Config `ROLES` (6: admin/front-desk/housekeeping/maintenance/fnb/concierge) con label/icon/color (paleta estándar Tailwind)/descripción/`defaultAreas`, y `AREAS` (los 12 módulos del sidebar). Helpers `getRole`, `getDefaultAreas`, `initials`, `timeAgo`, `isValidEmail`. `lastLogin` relativo a load
- [x] useUsers.js: hook CRUD con persistencia localStorage (key `hotel-users`) + sync custom/storage events (patrón useNews). addUser/updateUser/deleteUser/toggleUserStatus/resetUsers
- [x] UserManagement.jsx (tabs Usuarios / Permisos por rol):
  - Tabla responsive (real `<table>` en md+, cards en mobile): avatar con iniciales+color por rol, nombre, email, badge de rol, nº de módulos, estado, último acceso relativo, acciones
  - KPIs (usuarios/activos/inactivos/roles) + filtros: búsqueda por nombre/email, pills por rol, pills por estado
  - Modal "Agregar usuario" / editar (reusado): nombre, email (validación + email duplicado), rol (pills, al elegir carga preset de módulos), permisos (checklist de 12 módulos con Todos/Ninguno/Preset), toggle de estado en edición
  - Click en fila abre editar; toggle activar/desactivar; eliminar con diálogo de confirmación
  - Guard: no se puede eliminar ni desactivar al único admin activo (evita auto-lockout)
- [x] Vista "Permisos por rol": matriz rol×módulo con checks + cards por rol (descripción, módulos accesibles como chips, nº de usuarios)
- [x] Agregado a sidebar (icono Users) + case en AdminLayout + viewTitle en AdminHeader
- [x] Persistencia en localStorage

**Detalle técnico:** los roles son plantillas — al crear un usuario se precargan los `defaultAreas`
del rol y después se editan por persona (el checklist de permisos es independiente del rol). El
"acceso por rol" documentado se modela como `defaultAreas` y se muestra tanto en la matriz como en
las cards. Gotcha respetado: los colores de rol/estado usan la **paleta estándar de Tailwind**
(violet/blue/emerald/amber/rose/cyan con /alpha, que sí soporta alpha), NO los tokens del theme
(`bg-primary/10` sería no-op silencioso); las superficies del theme usan fills sólidos
(`bg-surface`/`bg-bg`/`bg-primary`) y `hover:opacity-90`. Se evitó `bg-surface-alt` (no existe en
hotelería). Validado: build OK (1911 módulos), dev boot OK (HTTP 200), test de helpers PASS
(initials/email/timeAgo, 10/10).

**Criterio de exito:** CRUD de usuarios funcional. Vista clara de permisos por rol. ✅

---

## H19: Hero con video de fondo ✅
**Esfuerzo:** Bajo-Medio (1 hr)
**Archivos:** HeroCarousel.jsx

- [x] Reemplazar imagen de fondo con video de fondo
- [x] Video: stock de Pexels "Aerial View Of Beautiful Resort" (Tom Fisk, id 2169880) — URL directa al .mp4 verificada (sin hotlink protection, carga desde cualquier origen)
- [x] Video autoplay, muted, loop, playsInline, object-cover
- [x] Mantener overlay gradiente (doble: horizontal + vertical) para legibilidad del texto
- [x] Mantener los CTAs y textos actuales (badge, heading, subtitle, features, floating stats, scroll)
- [x] Fallback real: `onError` en el video → cae a la imagen estatica (poster). Verificado bloqueando el CDN
- [x] Mobile (`max-width:767px`): no carga el video, muestra poster (performance)
- [x] `prefers-reduced-motion`: respeta y hace default a imagen
- [x] Toggle Video/Foto (esquina inferior derecha, con icono + aria-label) persistido en localStorage (`hotel-hero-mode`)

**Detalle técnico:** el poster (misma imagen Unsplash de antes) se renderiza SIEMPRE debajo del
video, así nunca hay frame vacío mientras bufferea, en mobile, en reduced-motion o en error. El
video se monta solo en desktop sin reduced-motion y hace fade-in (`opacity` + `transition`) recién
al `onCanPlay`. Escala de calidad por viewport via `matchMedia` (1080p en ≥1280px, 720p en 768–1279px)
para no mandar 1080p a una tablet. Autoplay muteado con `play().catch()` → si el navegador lo rechaza,
cae al poster en vez de quedar congelado. El toggle deja re-intentar el video tras un error. Se
mantiene el parallax de scale-in (Framer Motion) sobre el contenedor de media. Gotcha evitado:
`fetchPriority` NO existe en React 18.3 (soporte real desde React 19) → dispara warning de consola;
se quitó (el poster ya usa `loading="eager"`). Validado en browser real (playwright-core + Chrome del
sistema): video autoplaying/loop/muted con `currentTime` avanzando, texto legible sobre el gradiente,
toggle → foto persiste tras reload, mobile sin video (solo poster), fallback con CDN bloqueado
muestra poster, **consola sin errores**. Build OK (1911 módulos).

**Criterio de exito:** Hero con video de fondo fluido. Texto legible. Fallback funcional. ✅

---

## H20: Nombre real + branding ✅
**Esfuerzo:** Bajo (30 min)
**Archivos:** index.html, App.jsx, AdminSidebar.jsx, LoginScreen.jsx, BookingForm.jsx, HotelAbout.jsx, HotelContactSection.jsx, GuestPortal.jsx, mockUsers.js, mockStaff.js, UserManagement.jsx, shared-ui/Footer.jsx

- [x] Nombre elegido por el owner: **Villa Serena** (encaja con el estilo "Editorial Riviera" costero)
- [x] Reemplazar "Hotel Luxury" en todos los archivos visibles
- [x] Actualizar title + meta description en index.html ("Villa Serena · Hotel Boutique & Spa")
- [x] Actualizar textos: hero (navbar brand), about (intro con nombre), contact (email), portal (login + WiFi), admin sidebar
- [x] Emails `@hotelluxury.com` → `@villaserena.com` (9 users + 8 staff + contacto + concierge + placeholder)
- [x] WiFi `Hotel_Luxury_Guest` → `VillaSerena_Guest`
- [x] Verificado: `grep` sin "Hotel Luxury"/"hotelluxury" en `src/`

**Detalle técnico:** el `<Footer>` de `shared-ui` **hardcodeaba** "Hotel Luxury" en el copyright
(bug: se veía en TODAS las apps incluida inmobiliaria) → ahora usa el prop `{brand}` que cada app
ya le pasa. En `LoginScreen` se agregó el nombre del hotel como eyebrow (uppercase tracking) sobre
"Guest Portal". **NO** se cambiaron las storage keys internas `hotel-luxury-guest-checkin/requests`
(no son visibles y renombrarlas descartaría la persistencia ya guardada). "luxury" como adjetivo
descriptivo (Luxury Bathroom, timeless luxury, etc.) se dejó — es copy de posicionamiento, no marca.
Build OK (1911 módulos).

**Criterio de exito:** Nombre consistente en toda la app. Ningun "Hotel Luxury" restante. ✅

---

## H21: Inventory — Mas metricas ✅
**Esfuerzo:** Medio (1.5 hrs)
**Archivos:** InventoryManagement.jsx, mockInventory.js

- [x] Tab switcher Inventory / **Trends** (patrón de otros módulos)
- [x] Nueva seccion "Trends" con:
  - Gráfico de consumo por categoría (barras horizontales con color + costo + share %)
  - Top 5 items más consumidos (por volumen 90d, con medallas oro/plata/bronce)
  - Costo total por categoría por mes (calculado) + KPI de gasto mensual total
  - Items que nunca se restockearon (posibles obsoletos) + capital inmovilizado
- [x] Alertas de reposición automática:
  - Si un item llegó a minStock 3+ veces en el último mes → sugerir aumentar minStock
  - Card de sugerencia con botón "Set min N" → aplica `updateInventory` (persiste) y marca "Adjusted"
- [x] Columna "Consumo mensual" (`~N u/mo`) en las cards existentes (obsoletos muestran "No usage")

**Detalle técnico:** las métricas se derivan de un modelo **determinístico seedeado por el `id`**
del ítem (`getItemConsumption` / `getInventoryAnalytics` en `mockInventory.js`, PRNG `mulberry32`
+ hash FNV, mismo patrón que H10/H17). **Correctitud clave:** `useAdminData` persiste `inventory`
en localStorage, así que las métricas NO dependen del stock mutable — solo de la identidad estática
(id/categoría/min/max/costo), inmune a saves viejos. `CATEGORY_DEMAND` da turnover por categoría
(minibar rápido, linens lento); las low-stock hits ≈ refills/mes. La sugerencia gatea con
`lowStockHits30>=3 && minStock < recommendedMin` (recommendedMin ≈ ½ mes de demanda, capado a max-1),
así aplicarla sube el minStock y la sugerencia desaparece de forma estable/persistente. Se agregaron
2 ítems legacy (Cigarette Packs, Guest Sewing Kits, `restockHistory: []`) para poblar "obsoletos".
Fix de correctitud extra: `InventoryCard` pasó a `forwardRef` para que el `AnimatePresence
mode="popLayout"` le pase el ref (eliminó un warning de consola preexistente).
Validado: test de lógica (determinismo, 3 sugerencias, 2 obsoletos, top5, categorías positivas) PASS;
build OK (1911 módulos); **browser real (Chrome/playwright): las 5 secciones renderizan, chip de
consumo visible, "Set min" → "Adjusted" persiste, consola SIN errores**.

**Criterio de exito:** Seccion de tendencias con datos calculados. Sugerencias de ajuste de stock. ✅

---

## H22: Service Requests — Link a Bandeja IA
**Esfuerzo:** Bajo-Medio (1 hr)
**Archivos:** ServiceRequestsMonitor.jsx, InboxManagement.jsx

- [x] En cada RequestCard, agregar boton "Escribir al huesped" (icono MessageSquare)
- [x] Al click: navegar a Bandeja IA con la conversacion de este huesped preseleccionada
- [x] Si no existe conversacion para este huesped, crear una nueva automaticamente
- [x] El input de texto (de H4) se focus automaticamente
- [x] Pre-fill del input con template relevante: "Hola [nombre], respecto a su solicitud de [tipo servicio]..."

**Implementacion:** El handoff entre vistas viaja por `AdminContext` con un `inboxTarget`
(`openInboxWithTarget` fija target + `currentView='inbox'`; `consumeInboxTarget` lo limpia).
`ServiceRequestsMonitor` pone el boton en TODA RequestCard (tambien completadas) y despacha el
target `{requestId, guestName, roomNumber, type, description, nonce}` (el `nonce` garantiza objeto
fresco → reclicks re-disparan). `InboxManagement` consume el target en un effect: busca conversacion
existente por nombre de huesped y, si no hay (los guests de las SR no coinciden con los de
mockConversations), crea un hilo sintetico con canal nuevo `service` (icono ConciergeBell), seedeado
con el pedido como mensaje `guest` (da contexto + badge de no-leido via `pendingCount`). Luego
preselecciona el hilo, pre-llena el template (`Hola <nombre>, respecto a su solicitud de <tipo>, `),
cierra templates y focus con caret al final. Helpers puros extraidos a `data/admin/serviceThreads.js`
(`serviceConvId` da id estable `SVC-<room>-<slug>` → mismo huesped+hab reusa hilo, nunca duplica).
Persistencia: hilos sinteticos en `hotel-admin-inbox-service-threads`; las respuestas reusan el
mecanismo de H4 (`extraMessages` keyed por conv.id) bajo `hotel-admin-inbox`.
Validado: **test de logica 18/18 PASS** (`scripts/test-service-threads.mjs`: id estable/slug,
dedup find-or-create, match de conv existente, shape del seed, template); **build OK (1912 modulos)**;
dev server transforma los 4 modulos tocados con 200 (sin errores de transform).

**Criterio de exito:** Boton en cada request que lleva directo a la conversacion del huesped en Bandeja IA. ✅

---

## H23: Beach/Pool map interactivo (para resorts) ✅
**Esfuerzo:** Muy Alto (3-4 hrs)
**Archivos:** Nuevo: components/client/BeachPoolMap.jsx, components/facilities/PoolMapCanvas.jsx, admin/facilities/FacilitiesManagement.jsx, data/mockFacilities.js, hooks/useFacilities.js

- [x] mockFacilities.js: 21 posiciones (id, type lounger/cabana/umbrella, zone pool/beach, position {x,y} en %, status available/occupied/reserved, price en cabanas, guestName + reservedFor si tomada). Config `FACILITY_TYPES`/`FACILITY_STATUS`/`ZONES`, `POOLSIDE_MENU` (bebidas/snacks) y helpers puros (`facilityCounts`, `describeSpot`). Seed con mezcla de estados
- [x] Guest-facing BeachPoolMap.jsx (overlay full-screen abierto desde Services > "Beach & Pool"):
  - Mapa top-down (deck + pileta + franja de mar) con posiciones clickeables (`PoolMapCanvas`)
  - Color por estado: verde=disponible, rojo=ocupado, azul=reservado (+ estrella dorada en las propias)
  - Click en disponible: panel de reserva (fecha de la estadía + horario, confirmar con delay 700ms)
  - Filtro de zona (Todo/Pileta/Playa), leyenda, tooltip por marcador
  - "Pedir desde mi reposera": sub-vista de bebidas/snacks con carrito (+/-) → pedido a la reposera
  - Cancelar reserva propia; las reservas aparecen en "My Stay" (type `facility`/`poolside`)
- [x] Admin FacilitiesManagement.jsx (sidebar icono Umbrella):
  - Mismo mapa (`PoolMapCanvas` compartido) + vista Lista agrupada por zona
  - KPIs (posiciones, disponibles, en uso, ingresos cabanas) + filtros por estado y zona
  - Ver quién tiene cada posición; liberar; marcar ocupada (walk-in con nombre); restablecer board

**Detalle técnico:** admin y front comparten el board por el hook `useFacilities` (mismo patrón que
`useNews`/`useEvents`: `hotel-facilities` en localStorage + evento custom/`storage`), así una reserva
del huésped se ve al instante en recepción y una liberación del admin devuelve el lugar. Las reservas
del visitante viven en su propia key (`hotel-facilities-mine`) para saber cuáles puede cancelar/ordenar
sin mutar el board. El canvas `PoolMapCanvas` es presentacional puro (spots + onSelect) reutilizado por
ambas superficies (DRY). Posiciones en % → escala responsive sin recomputar. Gotcha respetado: los
tints de estado usan la paleta estándar Tailwind (emerald/rose/sky, que sí soporta /alpha), NO los
tokens del theme; las superficies usan fills sólidos (`bg-surface`/`bg-bg`/`bg-primary`) y
`hover:opacity-90`; se evitó `bg-surface-alt`. La pileta/arena/mar usan colores fijos (imagen
decorativa, no chrome). Validado: **test de lógica 33/33 PASS** (`scripts/test-facilities.mjs`: seed,
counts, transiciones reserve/release/occupy, menú); **build OK (1917 módulos)**; **browser real
(Chrome/playwright) 11/11 PASS con consola SIN errores** — admin (21 markers, ocupar/liberar) y portal
(login → mapa → reservar), dark + light mode verificados.

**Criterio de exito:** Mapa visual de pool/playa funcional. Huesped puede reservar reposera. Admin ve estado general. ✅

---

## H24: i18n — Cambio de idioma ES/EN ✅
**Esfuerzo:** Muy Alto (4-5 hrs, probablemente 2 sesiones)
**Archivos:** Nuevo: src/i18n/ (LanguageProvider + translations/), src/components/LanguageSwitch.jsx; todos los componentes; shared-ui Navbar+Footer

- [x] Sistema de traducciones:
  - Namespaces por área en `src/i18n/translations/{es,en}/*.js` (common, nav, landing, landingExtra, portal, client, adminA/B/C) — se hicieron JS modules (no JSON) para poder comentar/componer y evitar conflictos de merge al paralelizar. `translations/index.js` los mergea (landing = landing+landingExtra; admin = adminA+adminB+adminC).
  - Hook `useTranslation()` → `{ t, language, setLanguage, toggleLanguage, languages }`. `t('a.b.c', { vars })` con lookup por dot-notation, interpolación `{var}`, soporte de arrays (features/listas), y **fallback** a EN y luego a la key (warning en DEV).
  - `LanguageProvider` (Context) montado en `main.jsx`; setea `<html lang>`.
  - Persistencia en localStorage (`hotel-language`) + sync entre pestañas/superficies (evento custom + `storage`).
  - **Default = ES** (audiencia argentina); toggle a EN persiste.
- [x] Selector de idioma ES/EN en Navbar compartido (props opcionales `language`/`languages`/`onLanguageChange`, no rompe las otras 3 apps) + `<LanguageSwitch>` propio en las superficies sin Navbar (LoginScreen, Guest Portal header, AdminHeader).
- [x] Landing completa (Hero, About, Accommodation, Services, Amenities, Events, Offers, Reviews, Contact, NewsBar, Footer, BookingForm, RoomDetail, tour guiado).
- [x] Admin panel completo (layout/sidebar/header + los 14 módulos).
- [x] Guest portal + client completo (login, portal, chat, check-in, dining, pool/beach, excursiones, service request).

**Detalle técnico:** los nombres de habitación/paquete se resuelven en la fuente (AccommodationTiers/OffersSection) y se pasan ya traducidos aguas abajo (detail/booking). Labels data-driven (categorías de eventos/noticias, roles, tipos/zonas de facilities, dificultad de excursiones) se traducen **en render** keyeadas por el id estable, sin tocar `src/data/`. El **contenido autoral** (nombres/descripciones de platos y excursiones, títulos/cuerpos de noticias y eventos, nombres de personas) se deja como está (realista: un hotel no auto-traduce su contenido). Se corrigió un bug de integración: `OffersSection` volvió a pasar `details`/`cancellation` resueltos al `onReservePackage` (App los consumía). Bonus de higiene: `RequestCard`, `TaskCard` y `EventCard` pasaron a `forwardRef` (eliminan warnings preexistentes de "Function components cannot be given refs" bajo `AnimatePresence mode="popLayout"`).

**Ejecución:** infra + landing hechos a mano como referencia; el resto (portal, client, admin ×3) en paralelo con subagentes, cada uno dueño de archivos y namespace propios (sin conflictos). Después integración + tests.

**Validado:**
- Test de lógica `scripts/test-i18n.mjs`: **paridad es↔en 1831 leaf paths idénticos**, **1339 claves `t()` usadas en el código resuelven en ambos idiomas**, 50 prefijos dinámicos son objetos, interpolación + arrays OK. **PASS**.
- **Build OK en las 4 apps** (hoteleria 1937 módulos; inmobiliaria/salud/gastronomia sin romper por el Navbar/Footer compartido).
- **Browser real (Chrome/playwright) 20/20 PASS, consola SIN errores**: default ES, toggle→EN, persistencia tras reload, landing/portal(login+logueado)/admin cambian idioma y sin keys crudas; selector presente en las 3 superficies. Scan de las 14 vistas del admin en EN sin español residual (salvo contenido mock de noticias, intencional).

**Criterio de exito:** Toggle ES/EN funcional. Al menos la landing completa en ambos idiomas. ✅ (se hizo toda la app: landing + admin + portal)

---

## H25: Cambio de moneda ✅
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** Nuevo: data/currencies.js, hooks/useCurrency.js, components/CurrencySwitch.jsx; shared-ui Navbar; componentes con precios

- [x] `data/currencies.js`: USD (base, rate 1), ARS (x1180), EUR (x0.92) con símbolo, locale y decimales; helpers puros `getCurrency`, `convertMoney`, `formatMoney` (convierte desde USD-base → redondea → agrupa por locale → prefija símbolo)
- [x] `hooks/useCurrency.js`: moneda actual + `format(usd)` / `convert(usd)` / `setCurrency` / `currencies`; persistencia localStorage (`hotel-currency`) + sync misma-pestaña (evento custom) y entre pestañas (`storage`) — mismo patrón que useNews/useLiveChat (sin Context)
- [x] Selector de moneda USD/ARS/EUR en Navbar compartido (props opcionales, no rompe las otras 3 apps) + `<CurrencySwitch>` en el header del Guest Portal
- [x] Todos los precios guest-facing se recalculan: AccommodationTiers, RoomDetailPage, BookingForm, OffersSection, ExcursionBookingForm, Guest Portal (billing + requests + servicios + amenities + modales), F&B (MenuBrowser/CartDrawer/OrderConfirmation) y BeachPoolMap (cabañas + menú de reposera)
- [x] Persiste en localStorage y sobrevive reload

**Detalle técnico:** todos los precios se autoran en **USD (moneda base)**; `format()` convierte en render, así cambiar de moneda reformatea toda la app desde una única fuente de verdad (los objetos de request/orden persistidos guardan USD, se convierten al mostrarse). El símbolo se prefija siempre (`US$`/`$`/`€`) y el `locale` sólo maneja el agrupado de miles (Intl decimal, nunca style currency → sin símbolos duplicados/ambiguos). Se quitaron los strings `"From $520"` hardcodeados de OFFERS (ahora `priceValue` + clave i18n `landing.offers.priceFrom`). Los strings i18n que embebían `$` (`excursion.priceLine/priceCalc`, `menu.viewOrder`, `cart.placeOrder`) pasaron a `{price}`/`{total}` y reciben el valor ya formateado. **Fuera de alcance (a propósito):** el admin no lleva selector y sus KPIs de gestión quedan en su representación nativa — DynamicPricing/CommissionWidget son **ARS** (contabilidad interna), no se tocan; los KPIs USD del admin no dependen de la elección del huésped.

**Validado:**
- Lógica `scripts/test-currency.mjs`: **31/31 PASS** (config, getCurrency fallback, convertMoney, formatMoney redondeo/agrupado/símbolo, determinismo, consistencia format = símbolo + convertido-redondeado).
- **i18n parity `scripts/test-i18n.mjs` PASS** (1832 leaf paths es↔en, +1 `priceFrom`; 1340 claves resuelven).
- **Build OK en las 4 apps** (hoteleria 1941 módulos; salud/gastronomia/inmobiliaria sin romper por el Navbar compartido).
- **Browser real `scripts/browser-currency.mjs` (Chrome/playwright) 13/13 PASS, consola SIN errores:** default US$189 → ARS $223.020 → EUR €174, persiste tras reload, billing del portal convierte (€805 ↔ US$875), selector propio en el portal.

**Criterio de exito:** Toggle de moneda funcional. Precios se recalculan en toda la app. ✅

---

## H26: Check-in / Check-out de recepcion (front-desk) ✅
**Esfuerzo:** Muy Alto (4-5 hrs)
**Archivos:** Nuevo: hooks/useReservations.js, data/admin/reservationsModel.js, data/admin/checkinStation.js, components/client/checkin/CheckInStation.jsx + SignaturePad.jsx, components/admin/reception/ReceptionManagement.jsx, i18n station + adminD; Modificado: useAdminData.js, CalendarManagement.jsx, AdminDashboard.jsx, GuestPortal.jsx, AdminLayout/Sidebar/Header, mockReservations.js

Estado actual:
- [x] Dashboard "Today's Activity": check-in de arribos y check-out de salidas de HOY (ActivityDetailModal)
- [x] Calendario: botones "Registrar check-in / check-out" en el modal de detalle de reserva

Pendiente (unificar y ampliar):
- [x] Unificar la fuente de reservas: store `useReservations` (key `hotel-reservations`, sync custom+storage event) es ahora la única fuente; `useAdminData` la delega (sigue exponiendo `reservations` para Pricing/Dashboard/Rooms); Calendario y Recepción la consumen → un check-in en cualquier superficie se refleja en todas. Migración one-time de las keys legacy `hotel-admin-calendar-extra/status`.
- [x] Vista/tab "Recepcion" (sidebar ConciergeBell) con KPIs, filtros llegadas/en casa/salidas/próximas/todas, búsqueda, acciones rápidas de check-in/out
- [x] Timeline de estado por reserva (confirmed → checked-in → checked-out) con timestamps + actor (modal Historial)

### Estacion de check-in completa (objetivo real)
**Motivacion:** agilizar la llegada. Si el huesped completa online (documentos, acompanantes,
firma, pago) ANTES de presentarse, al llegar a recepcion ya tiene varios pasos hechos y el
check-in presencial es casi inmediato: recepcion solo valida, asigna habitacion y entrega
tarjetas. El mismo wizard sirve para arrancar online y terminar en recepcion (estado parcial
guardado y retomable).

Un unico flujo de check-in, usable por DOS actores:
- **Huesped (self-service)**: desde el Guest Portal / kiosko / QR — adelanta pasos antes de llegar
- **Recepcionista**: desde el admin (Calendario o vista Recepcion) — retoma lo que el huesped dejo hecho y finaliza

Pasos del flujo (wizard `CheckInStation`, mode-aware):
- [x] 1. Identificar la reserva (paso `identify`, solo recepción — resumen + confirmar)
- [x] 2. Documentos: foto de DNI/pasaporte (upload mock FileReader→data-url + preview), tipo/número, nacionalidad, fecha de nacimiento (DatePicker compartido)
- [x] 3. Huéspedes acompañantes (nombre + documento por persona; paso solo si guests > 1)
- [x] 4. Asignar habitación: elegir habitación disponible del tipo reservado (fallback a cualquier disponible); al confirmar setea `roomId` → queda ocupada en Rooms/KPIs/Calendario
- [x] 5. Método de pago / garantía (tarjeta mock enmascarada, ya pagada, o pagar en recepción + preautorización)
- [x] 6. Firma digital en canvas (theme-aware, pointer events) + aceptación de políticas
- [x] 7. Emitir llaves: stepper de key cards (1-4) + toggle de llave móvil + código de llave digital
- [x] 8. Confirmación: resumen completo → estado pasa a checked-in + pantalla de éxito con llave digital

Consideraciones:
- [x] Sirve igual para huésped (modo `guest`, menos pasos/campos) y recepción (modo `reception`, todos los campos); un único componente parametrizado por `mode`
- [x] Persiste todo (documentos como data-url mock) en el store `hotel-reservations`, embebido por reserva (`reservation.station`)
- [x] Progreso resumible: `saveStation` guarda avances parciales → un huésped arranca online y recepción lo retoma (banner + barra de progreso "Pre-check-in" en la fila)
- [x] Al terminar, la habitación queda asignada y ocupada en Calendario/Rooms/KPIs (fuente unificada)

**Nota:** H16 (check-in básico del huésped, 3 pasos) fue **absorbido y eliminado**: el Guest Portal ahora usa `CheckInStation` en modo `guest` sobre el store compartido (la reserva del portal `RES-2024-5678` se siembra en `mockReservations`, así recepción la ve y retoma). `CheckInFlow.jsx` fue borrado.

**Detalle técnico:** modelo puro y testeable en `checkinStation.js` (buildSteps mode-aware, blank/hydrate null-safe, validateStationStep→claves i18n, stationProgress/nextIncompleteStep, generateKeyCode inyectable, maskCard) y `reservationsModel.js` (mergeReservations, applyLegacyMigration, reservationBucket). El store no persiste el array (congelaría las fechas relativas del mock) sino un **delta de overrides + extras** que se mergea sobre el seed fresco en cada carga (mismo criterio que el viejo calendario). i18n: nuevo namespace top-level `station` (compartido admin+portal) + `adminD` (reception), paridad es/en. Gotcha resuelto en browser: `blankStationData(null)` crasheaba (default param no cubre `null`) porque la estación se monta siempre → coerción `reservation || {}`.

**Validado:**
- Lógica `scripts/test-checkin-station.mjs` **56/56 PASS** + `scripts/test-reservations.mjs` **26/26 PASS**.
- i18n `scripts/test-i18n.mjs` **PASS** (1999 leaf paths es↔en, 1393 claves resuelven).
- **Build OK** (hoteleria 1950 módulos).
- **Browser real `scripts/browser-reception.mjs` (Chrome/playwright) 24/24 PASS, consola SIN errores**: Recepción lista reservas + KPIs, estación abre en recepción (identify) y en portal (guest, sin identify), check-out refleja en KPIs (in-house 3→2) y persiste en `hotel-reservations`, Dashboard/Calendario sin keys crudas, y **Recepción muestra el pre-check-in online del huésped ("Continuar check-in")**.

**Criterio de exito:** Un mismo wizard de check-in permite, tanto al huesped como a recepcion, cargar documentos, asignar habitacion, emitir tarjetas y dejar la reserva en checked-in, reflejado en Dashboard, Calendario y KPIs. ✅

---

## GuidedTour funcional — LO ÚLTIMO DE LO ÚLTIMO (sin número, prioridad más baja)
**Esfuerzo:** Medio (1.5 hrs)
**Archivos:** App.jsx (TOUR_STEPS ya existe, revisar si funciona)

> Nota: movido al final a pedido del owner. Es lo último que se hace, después de todo lo demás.

- [ ] Verificar que GuidedTour de shared-ui esta importado y funciona
- [ ] Definir 6-8 pasos del tour con targets correctos:
  1. Hero: "Bienvenido a la demo del hotel"
  2. Accommodation: "Explora las habitaciones con tour 360"
  3. Services: "Servicios directos sin fricciones"
  4. Amenities: "Todas las comodidades del hotel"
  5. Offers: "Paquetes y experiencias curadas"
  6. Contact: "Contacto y reservas"
  7. Portal badge: "Portal del huesped - todo el self-service"
  8. Admin badge: "Panel de gestion - el backend que controla todo"
- [ ] Verificar que el spotlight cutout funciona en cada seccion
- [ ] Boton "Recorrido" en navbar funcional
- [ ] Al terminar el tour, CTA: "Explora el admin panel" o "Proba el portal"

**Criterio de exito:** Tour guiado completo de 6-8 pasos, funcional, con spotlight.

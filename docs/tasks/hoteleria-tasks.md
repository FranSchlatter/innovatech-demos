# Hoteleria — Tareas Seccionadas

Cada tarea es autocontenida para una sesion. Decir "hace la H3" y arrancar.
Complejidad calibrada para hacer UNA tarea bien a fondo por sesion.
Orden sugerido: bugs primero, despues features de alto impacto.

---

## H1: Fix bugs existentes
**Esfuerzo:** Bajo (30-45 min)
**Archivos:** rooms.json, GuestPortal.jsx, AdminHeader.jsx, OffersSection.jsx

Hacer todo junto porque son fixes rapidos:
- [ ] RoomDetailPage galeria: usa `[room.image x4]`. Agregar campo `images[]` a rooms.json con 4 URLs distintas por habitacion. Actualizar RoomDetailPage para usar `room.images || [room.image]`
- [ ] GuestPortal MOCK_GUEST: fechas hardcodeadas enero 2024. Cambiar a fechas relativas (hoy + 2 dias check-in, hoy + 7 check-out, o similar)
- [ ] AdminHeader viewTitles: agregar entries para `inbox: "Bandeja IA"`, `pricing: "Precio Dinamico"`, `excursions: "Excursiones"`
- [ ] OffersSection "Learn More": agregar handler que abra modal con detalles expandidos del paquete, o scroll a booking

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

## H7: F&B — Restaurante con menu digital + QR ordering
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** Nuevo: components/client/restaurant/ (MenuBrowser.jsx, CartDrawer.jsx, OrderConfirmation.jsx), data/menuItems.json

- [ ] Crear data/menuItems.json: 15-20 items organizados por categoria (Desayuno, Almuerzo, Cena, Bebidas, Postres). Cada item: id, name, description, price, image, category, allergens[], available, popular (boolean)
- [ ] MenuBrowser.jsx: grid de items con foto, nombre, precio, descripcion corta, badges (popular, vegetariano, sin gluten). Filtros por categoria + filtro alergenos. Busqueda
- [ ] Agregar al Guest Portal tab "Services" como seccion "Restaurante" con boton "Ver carta"
- [ ] Al click, abre el menu browser
- [ ] Cada item tiene boton "Agregar" con cantidad (+/-)
- [ ] CartDrawer: drawer lateral con items seleccionados, cantidades, subtotal, notas especiales, boton "Enviar pedido"
- [ ] Enviar pedido: delay 800ms, confirmacion con numero de orden, ETA estimado
- [ ] El pedido aparece en "My Stay" como request activa
- [ ] Dark mode, responsive, animaciones

**Criterio de exito:** Huesped puede explorar carta, armar pedido, confirmar. Pedido aparece en sus requests.

---

## H8: Dynamic Pricing — Ofertas + sugerencias automaticas + temporadas
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** DynamicPricing.jsx, mockPricing.js

- [ ] Seccion nueva: "Ofertas activas" — lista de ofertas manuales creadas
  - Boton "Crear oferta": modal con nombre, % descuento, tipos de habitacion aplicables, fecha inicio/fin
  - Cada oferta: card con nombre, descuento, habitaciones, estado (activa/expirada/programada), toggle activar/desactivar
- [ ] Seccion nueva: "Sugerencias automaticas" — el sistema detecta habitaciones sin reservar
  - Logica: si una habitacion no tiene reserva para los proximos X dias (configurable, default 3), sugerir descuento
  - Card de sugerencia: "Room 305 (Deluxe) sin reserva hace 5 dias. Sugerencia: -15% descuento"
  - Botones: "Aplicar descuento" / "Ignorar"
- [ ] Seccion nueva: "Temporadas" — definir periodos de alta/baja
  - Lista de temporadas: nombre, fecha inicio, fecha fin, multiplicador de precio (ej: Alta x1.3, Baja x0.8)
  - Boton agregar temporada
- [ ] Mantener la tabla actual de nominal vs real como esta (funciona bien)
- [ ] Todo persiste en localStorage

**Criterio de exito:** Admin puede crear ofertas, ver sugerencias de descuento automaticas, definir temporadas. Interactivo.

---

## H9: Room Management — Edicion expandida + encargados
**Esfuerzo:** Medio-Alto (2-3 hrs)
**Archivos:** RoomManagement.jsx, RoomEditModal.jsx, rooms.json

- [ ] Expandir RoomEditModal significativamente:
  - Status (ya existe)
  - Precio por noche (input numerico editable)
  - Descripcion (textarea editable)
  - Amenities (checklist toggleable de amenities disponibles)
  - Encargado asignado (dropdown de staff de mockStaff.js)
  - Notas internas (textarea, ya existe)
  - Galeria de imagenes (mostrar thumbnails, placeholder para "subir mas")
  - Historial de cambios (ultimos 3 cambios: "Estado cambiado a Cleaning por Admin, hace 2hs")
- [ ] En la vista grid/tabla, mostrar nombre del encargado asignado
- [ ] Nuevo filtro: por encargado
- [ ] Todos los cambios persisten en localStorage

**Criterio de exito:** El modal de edicion tiene 8+ campos editables. Se puede asignar encargado. Mucho mas completo que antes.

---

## H10: Housekeeping — Metricas por trabajador + panel de personal
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** HousekeepingManagement.jsx, mockHousekeeping.js

- [ ] Nueva seccion/tab: "Metricas del equipo"
  - Card por trabajador con:
    - Foto/avatar, nombre, turno actual
    - Tareas completadas hoy / esta semana / este mes
    - Tiempo promedio por tarea (calculado de mock data)
    - Rating de calidad (mockeable, 1-5 estrellas)
    - Barra de productividad (tareas/hora comparado con promedio equipo)
  - Ranking del equipo (mejor → peor por productividad)
  - Grafico de barras: tareas completadas por dia de la semana (ultimos 7 dias)
- [ ] En el StaffOverview existente, agregar click para expandir detalle del trabajador
- [ ] En cada TaskCard, agregar "Tiempo transcurrido" desde que se inicio la tarea
- [ ] Nuevo filtro: por trabajador asignado

**Criterio de exito:** Hay una vista de metricas con rendimiento individual. Se siente como un panel de gestion de personal real.

---

## H11: Curated Experiences (OffersSection) funcional
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** OffersSection.jsx

- [ ] "Learn More" abre modal con:
  - Imagen grande del paquete
  - Descripcion extendida (agregar texto a los datos)
  - Lista completa de inclusiones con iconos
  - Politica de cancelacion
  - Fechas de validez
  - Boton "Reservar este paquete" que lleva a BookingForm con el paquete preseleccionado
- [ ] "Reserve Now" debe funcionar: lleva a BookingForm con datos del paquete
- [ ] Agregar 1-2 paquetes mas (4th offer "Wellness Retreat" esta comentado en el codigo, activarlo)
- [ ] Agregar tag "Mas vendido" al paquete Romantic Escape

**Criterio de exito:** Ambos botones funcionan. Modal de detalle completo. 4 paquetes disponibles.

---

## H12: Services portal — Restaurante + excursiones + amenities expandido
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** GuestPortal.jsx (tab Services)

- [ ] Reorganizar tab Services en 4 secciones claras con tabs internos o acordeon:
  1. **Room Service** (existente, mantener)
  2. **Restaurante** — link a MenuBrowser de H7, o version compacta embebida
  3. **Excursiones** — cards de excursiones disponibles (de tours.json), click lleva a ExcursionBookingForm
  4. **Amenities** — cards de amenities reservables (pool, spa, gym, beach), click abre reservation modal
- [ ] Cada seccion con icono y descripcion breve
- [ ] Las reservaciones hechas aparecen en "My Stay" (de H3)
- [ ] Si H7 no esta hecho aun, al menos mostrar menu estatico con CTA "Pronto: pedidos online"

**Criterio de exito:** Tab Services tiene 4 categorias claras y navegables. El huesped puede explorar y reservar desde cada una.

---

## H13: Noticias / Avisos (admin → front)
**Esfuerzo:** Medio (2 hrs)
**Archivos:** Nuevo: admin/news/NewsManagement.jsx, components/NewsBar.jsx, data/mockNews.js

- [ ] mockNews.js: 3-4 avisos mock con: id, title, message, type (info/warning/event), startDate, endDate, active
- [ ] Admin: NewsManagement.jsx
  - Lista de avisos existentes con estado (activo/programado/expirado)
  - Boton "Crear aviso": modal con titulo, mensaje, tipo, fecha inicio, fecha fin
  - Toggle activar/desactivar
  - Preview de como se vera en el front
  - Agregar a sidebar con icono Megaphone
- [ ] Front: NewsBar.jsx
  - Barra/banner en la landing que muestra avisos activos (fecha actual entre startDate y endDate)
  - Estilo segun tipo: info (azul), warning (amber), event (verde)
  - Dismissable por el usuario
  - Animacion slide-down al aparecer
  - Si no hay avisos activos, no se muestra
- [ ] Persistencia localStorage

**Criterio de exito:** Admin crea aviso con fechas. Aviso aparece automaticamente en la landing. Desaparece cuando pasa la fecha.

---

## H14: Panel de Actividades / Eventos
**Esfuerzo:** Medio-Alto (2-3 hrs)
**Archivos:** Nuevo: admin/events/EventsManagement.jsx, components/EventsCalendar.jsx, data/mockEvents.js

- [ ] mockEvents.js: 5-6 eventos mock: id, name, description, date, startTime, endTime, location, image, capacity, registered, category (social/wellness/culinary/entertainment), recurring (boolean)
- [ ] Admin: EventsManagement.jsx
  - Lista de eventos con imagen thumbnail, nombre, fecha, ubicacion, registrados/capacidad
  - Boton "Crear evento": modal con todos los campos + upload imagen (placeholder)
  - Editar/cancelar evento existente
  - Vista calendario mensual con eventos marcados
  - Agregar a sidebar con icono CalendarDays
- [ ] Front: EventsCalendar.jsx
  - Seccion en la landing o en el Guest Portal: "Actividades del hotel"
  - Cards de eventos proximos con imagen, nombre, fecha, hora, lugar, "X lugares disponibles"
  - Boton "Me interesa" / "Registrarme" con confirmacion
  - Filtro por categoria

**Criterio de exito:** Admin crea eventos. Eventos aparecen en front con info completa. Huesped puede registrarse.

---

## H15: GuidedTour funcional
**Esfuerzo:** Medio (1.5 hrs)
**Archivos:** App.jsx (TOUR_STEPS ya existe, revisar si funciona)

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

---

## H16: Check-in digital (Guest Portal)
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** Nuevo: components/client/CheckInFlow.jsx, GuestPortal.jsx

- [ ] En "My Stay" del portal, si la reserva esta en estado "confirmed" (no checked-in aun):
  - Boton prominente "Check-in Online"
  - Abre flujo de 3 pasos:
    1. Datos personales: nombre, documento (tipo + numero), nacionalidad, telefono (pre-llenado de mock)
    2. Preferencias: piso (alto/bajo), tipo almohada, hora estimada llegada, requests especiales
    3. Confirmacion: resumen de datos + "Confirmar check-in"
  - Al confirmar: delay 1s, estado cambia a "checked-in", muestra key digital simulada (icono de celular con numero de habitacion)
  - Banner de exito: "Check-in completado! Presenta este codigo al llegar"
- [ ] Despues del check-in, el boton desaparece y "My Stay" muestra timeline normal
- [ ] Persistir estado en localStorage

**Criterio de exito:** Flujo de check-in online completo de 3 pasos. Cambia el estado de la reserva. Key digital simulada.

---

## H17: Excursions — Agregar nueva + metricas
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** ExcursionsManagement.jsx, mockExcursions.js

- [ ] Boton "Agregar excursion" en la parte superior
  - Modal: nombre, descripcion, precio, duracion, dificultad, categoria, imagen (URL), guia tipo, capacidad default
  - Al guardar, aparece como nueva excursion en la lista
- [ ] Nueva seccion: "Metricas" (toggle o tab)
  - Revenue total por excursion (bar chart CSS, sin libreria)
  - Top 3 excursiones mas populares (por bookings)
  - Ocupacion promedio por dia de la semana
  - Tendencia de bookings ultimas 4 semanas (linea simple)
- [ ] Persistir nuevas excursiones en localStorage

**Criterio de exito:** Se puede crear excursion nueva. Metricas visibles con datos calculados del mock.

---

## H18: Usuarios y roles (admin)
**Esfuerzo:** Muy Alto (3-4 hrs)
**Archivos:** Nuevo: admin/users/UserManagement.jsx, data/mockUsers.js, contexto de rol

- [ ] mockUsers.js: 8-10 usuarios mock con: id, name, email, role (admin/front-desk/housekeeping/maintenance/f&b/concierge), avatar, status (active/inactive), lastLogin, permissions[]
- [ ] UserManagement.jsx:
  - Tabla de usuarios con avatar, nombre, email, rol (badge color), estado, ultimo login
  - Boton "Agregar usuario": modal con nombre, email, rol (dropdown), permisos (checklist)
  - Click en usuario: modal detalle con edicion de rol y permisos
  - Toggle activar/desactivar usuario
  - Filtro por rol
- [ ] Vista por rol: panel informativo que muestra "Que ve cada rol"
  - Admin: ve todo
  - Front-desk: Dashboard, Rooms, Calendario, Services
  - Housekeeping: solo Housekeeping + Dashboard limitado
  - Maintenance: solo Service Requests tipo maintenance
  - F&B: solo orders de restaurante (cuando exista)
- [ ] Agregar a sidebar con icono Users
- [ ] Persistir en localStorage

**Criterio de exito:** CRUD de usuarios funcional. Vista clara de permisos por rol.

---

## H19: Hero con video de fondo
**Esfuerzo:** Bajo-Medio (1 hr)
**Archivos:** HeroCarousel.jsx

- [ ] Reemplazar carrusel de imagenes con video de fondo
- [ ] Video: usar un stock video de hotel/resort de Pexels (URL directa al .mp4)
- [ ] Video autoplay, muted, loop, object-fit cover
- [ ] Mantener overlay gradiente para legibilidad del texto
- [ ] Mantener los CTAs y textos actuales
- [ ] Fallback: si video no carga, mostrar imagen estatica
- [ ] Mobile: considerar poster image en vez de video (performance)
- [ ] Opcional: mantener opcion de volver al carrusel con un toggle

**Criterio de exito:** Hero con video de fondo fluido. Texto legible. Fallback funcional.

---

## H20: Nombre real + branding
**Esfuerzo:** Bajo (30 min)
**Archivos:** index.html, App.jsx, AdminSidebar.jsx, HeroCarousel.jsx, HotelContactSection.jsx, GuestPortal.jsx

- [ ] Elegir nombre de hotel real (sugerir opciones al owner)
- [ ] Reemplazar "Hotel Luxury" / "Hotel Admin" en todos los archivos
- [ ] Actualizar title en index.html
- [ ] Actualizar textos en hero, about, contact, portal, admin sidebar
- [ ] Verificar que no quede ningun "Hotel Luxury" hardcodeado

**Criterio de exito:** Nombre consistente en toda la app. Ningun "Hotel Luxury" restante.

---

## H21: Inventory — Mas metricas
**Esfuerzo:** Medio (1.5 hrs)
**Archivos:** InventoryManagement.jsx

- [ ] Nueva seccion: "Tendencias" con:
  - Grafico de consumo por categoria (Linens/Amenities/Minibar/Cleaning) — barras o dona CSS
  - Top 5 items mas consumidos (por restocks)
  - Costo total por categoria por mes (calculado)
  - Items que nunca se restockearon (posibles obsoletos)
- [ ] Alertas de reposicion automatica:
  - Si un item llego a minStock 3+ veces en el ultimo mes, sugerir aumentar minStock
  - Card de sugerencia con boton "Ajustar minimo"
- [ ] Agregar columna "Consumo mensual" a las cards existentes

**Criterio de exito:** Seccion de tendencias con datos calculados. Sugerencias de ajuste de stock.

---

## H22: Service Requests — Link a Bandeja IA
**Esfuerzo:** Bajo-Medio (1 hr)
**Archivos:** ServiceRequestsMonitor.jsx, InboxManagement.jsx

- [ ] En cada RequestCard, agregar boton "Escribir al huesped" (icono MessageSquare)
- [ ] Al click: navegar a Bandeja IA con la conversacion de este huesped preseleccionada
- [ ] Si no existe conversacion para este huesped, crear una nueva automaticamente
- [ ] El input de texto (de H4) se focus automaticamente
- [ ] Pre-fill del input con template relevante: "Hola [nombre], respecto a su solicitud de [tipo servicio]..."

**Criterio de exito:** Boton en cada request que lleva directo a la conversacion del huesped en Bandeja IA.

---

## H23: Beach/Pool map interactivo (para resorts)
**Esfuerzo:** Muy Alto (3-4 hrs)
**Archivos:** Nuevo: components/client/BeachPoolMap.jsx, admin/facilities/FacilitiesManagement.jsx, data/mockFacilities.js

- [ ] mockFacilities.js: mapa de pileta/playa con ~20 posiciones: id, type (lounger/cabana/umbrella), position {x,y}, status (available/occupied/reserved), price (cabanas), guestName (si occupied)
- [ ] Guest-facing BeachPoolMap.jsx:
  - Vista SVG/CSS del area de pileta con posiciones clickeables
  - Color por estado: verde=disponible, rojo=ocupado, azul=reservado
  - Click en posicion disponible: modal de reserva (fecha, horario, confirmar)
  - Boton "Pedir desde mi reposera": abre menu de bebidas/snacks simplificado
  - Integrar en Guest Portal tab "Reservations" o como seccion propia
- [ ] Admin FacilitiesManagement.jsx:
  - Mismo mapa pero con vista de gestion
  - Ver quien tiene cada posicion
  - Liberar posiciones manualmente
  - Agregar a sidebar admin

**Criterio de exito:** Mapa visual de pool/playa funcional. Huesped puede reservar reposera. Admin ve estado general.

---

## H24: i18n — Cambio de idioma ES/EN
**Esfuerzo:** Muy Alto (4-5 hrs, probablemente 2 sesiones)
**Archivos:** Nuevo: i18n/ directorio, todos los componentes

- [ ] Crear sistema de traducciones:
  - i18n/es.json con todas las strings en espanol
  - i18n/en.json con traducciones al ingles
  - Hook useTranslation() que devuelve t('key')
  - Context provider con idioma actual + toggle
  - Persistir idioma en localStorage
- [ ] Selector de idioma en Navbar (banderita o dropdown ES/EN)
- [ ] Empezar por la landing (componentes publicos)
- [ ] Segundo paso: admin panel
- [ ] Tercer paso: guest portal

**Nota:** Esta tarea es grande. Puede dividirse en 2 sesiones: H24a (setup + landing) y H24b (admin + portal).

**Criterio de exito:** Toggle ES/EN funcional. Al menos la landing completa en ambos idiomas.

---

## H25: Cambio de moneda
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** Nuevo: hooks/useCurrency.js, componentes con precios

- [ ] Hook useCurrency: moneda actual (USD/ARS/EUR), tasas de cambio mock, funcion formatPrice(amount, currency)
- [ ] Selector de moneda en Navbar o footer
- [ ] Todos los precios se recalculan segun moneda seleccionada
- [ ] Persistir en localStorage
- [ ] Aplicar en: AccommodationTiers, BookingForm, OffersSection, ExcursionBookingForm, Guest Portal billing

**Criterio de exito:** Toggle de moneda funcional. Precios se recalculan en toda la app.

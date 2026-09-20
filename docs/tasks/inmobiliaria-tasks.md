# Inmobiliaria — Tareas Seccionadas

Cada tarea es autocontenida para una sesion. Decir "hace la I3" y arrancar.
Complejidad calibrada para hacer UNA tarea bien a fondo por sesion.
Orden sugerido: fixes primero, despues admin (mas impacto visual), despues portal multi-rol.

---

## I1: Fix bugs existentes ✅ HECHO (7 sep 2026)
**Esfuerzo:** Bajo-Medio (45-60 min)
**Archivos:** PropertyDetailPage.jsx, ServicesSection.jsx, ClientPortal.jsx, +nuevo FloorPlanModal.jsx, VirtualTourModal.jsx

Hacer todo junto porque son fixes rapidos:
- [x] **"Ver plano" en PropertyDetailPage**: nuevo `FloorPlanModal` que abre al click, siempre visible. Muestra la imagen `floorPlan` y, como fallback/toggle, un esquema SVG generado que se adapta al tipo (residencial / oficina-local / terreno) y a la cantidad de dormitorios y baños. Se quitó el toggle inline que pisaba la galería
- [x] **"Ver tour" en PropertyDetailPage**: `VirtualTourModal` ahora pasa una sola vista (sin la escala "Complejo") construida desde la propiedad. Adapta ambientes por dormitorios, casa→jardín, y oficina/local→salón/privado/office/baño
- [x] **ServicesSection 8 servicios**: cada card es un botón que abre `ServiceDetailModal` con descripción extendida + lista de beneficios + botón "Consultar por este servicio" que cierra el modal y scrollea a #contact. Affordance "Ver más" en hover/focus
- [x] **Alertas en portal**: toggle con toast ("Alerta activada"/"Alerta pausada"). Botón "Crear nueva alerta" abre `CreateAlertModal` (operación, tipo, zona desde neighborhoods.json, rango de precio) con preview en vivo de coincidencias calculadas sobre properties.json. Alertas persisten en localStorage (`inmob-portal-alerts`). Empty state + validación de rango

**Criterio de exito:** Los 4 problemas corregidos. Build OK, dev server OK. Verificado transform en Vite. Pendiente: check visual del owner en dark/light.

---

## I2: Dashboard interactivo — KPIs clickeables + graficos ✅ HECHO (8 sep 2026)
**Esfuerzo:** Medio-Alto (2-3 hrs)
**Archivos:** AdminDashboard.jsx, LeadsManagement.jsx, ResponseTimeWidget.jsx

- [x] Cada KPI card es un `<motion.button>` clickeable: navega al modulo (`setView` de AdminContext). cursor-pointer, hover (border/shadow), flecha `ChevronRight` que aparece en hover
- [x] Seccion "Tendencias" con 3 mini-graficos de barras (componente `TrendChart`): leads/semana, visitas/semana, operaciones cerradas/mes. Delta % arriba de cada uno. **Nota:** series demo hardcodeadas coherentes con los KPIs (las fechas del mock estan concentradas en 1 semana, agrupar real daba barras vacias)
- [x] Pipeline de leads: cada barra es boton → `setFilter('leads','stage', id)` + `setView('leads')`. LeadsManagement lee `filters.leads.stage`, resalta la columna (ring accent), banner "Enfocando etapa X" con boton quitar, y hace scrollIntoView
- [x] Response time widget: card "Promedio equipo" ahora muestra "vs. 34 min mes anterior" (tachado) ademas del badge −% existente
- [x] Seccion "Acciones rapidas": botones "Agendar visita"/"Crear lead"/"Agregar propiedad" (navegan al modulo respectivo — los modales de creacion llegan en I4/I5/I6)
- [x] Indicador de tendencia por KPI: flecha verde/roja (`ArrowUpRight`/`ArrowDownRight`) con % (mock)

**Criterio de exito:** Cada KPI lleva al modulo correspondiente. Hay graficos de tendencia. Dashboard es interactivo, no solo lectura. Build OK.

---

## I3: Bandeja IA — Agente puede escribir + templates ✅ HECHO (8 sep 2026)
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** InboxManagement.jsx, mockConversations.js

- [x] Composer (textarea) al pie de la columna del thread, tipo WhatsApp. Enter envia, Shift+Enter salto de linea
- [x] Boton enviar (`Send`, bg-accent) agrega el mensaje como "staff" (alineado derecha, burbuja accent con label "Asesor")
- [x] Popover de plantillas (boton `FileText`): 9 templates inmobiliarios en `INBOX_TEMPLATES` (mockConversations.js) — disponibilidad, confirmar visita, tasacion, contrato listo, oferta recibida, ajuste ICL, requisitos alquiler, seguimiento, agradecimiento
- [x] Al seleccionar template, se llena el textarea (editable antes de enviar)
- [x] Mensaje enviado con timestamp actual (`nowTime()` HH:MM) y label "Asesor"
- [x] Animacion de entrada del nuevo mensaje (Framer Motion, solo los `_new`) + auto-scroll al fondo
- [x] Canal badge en la lista (verde/azul/gris) — verificado, ya existia
- [x] Persistencia en localStorage key `inmob-admin-inbox` (mensajes por conversacion). El preview de la lista refleja el ultimo mensaje enviado

**Criterio de exito:** El agente puede escribir mensajes libres y usar templates. Mensajes aparecen en el thread. Persisten al refrescar. Build OK.

---

## I4: Leads CRM — Scroll fix + edicion completa ✅ HECHO (9 sep 2026)
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** LeadsManagement.jsx, mockLeads.js, useAdminData.js (+addLead/deleteLead), shared/Modal.jsx, shared/useToast.jsx, shared/formStyles.js

Problemas actuales: no se puede scrollear, no queda claro para que sirve, no se puede editar.

- [x] **Fix scroll**: verificar overflow del Kanban board. Agregar `overflow-x-auto` horizontal y `overflow-y-auto` vertical en cada columna. Maximo 3-4 cards visibles por columna, el resto con scroll
- [x] **Click en lead card**: abrir modal LeadDetailModal con:
  - Datos del lead: nombre, email, telefono, propiedad de interes, presupuesto
  - Todos los campos EDITABLES (inputs)
  - Score selector (Hot/Warm/Cold) con color visual
  - Agente asignado (dropdown de agentes)
  - Fuente (dropdown: ZonaProp/ArgenProp/Web/Referido/Telefono)
  - Seccion "Notas" con textarea + historial de notas anteriores con timestamp
  - Seccion "Historial de contacto": timeline con fecha + accion (Llamada/Email/Visita/WhatsApp)
  - Boton "Agregar nota" y "Registrar contacto"
- [x] **Boton "Nuevo Lead"** en header del Kanban:
  - Modal con formulario: nombre, email, telefono, propiedad interes (dropdown de properties), presupuesto, fuente, agente asignado
  - Al guardar, aparece en columna "Nuevo"
- [x] **Arrastrar leads entre columnas** — ya existe drag con botones flechita, verificar que funciona bien
- [x] **Busqueda de leads**: input de busqueda que filtra por nombre o propiedad
- [x] Persistir todo en localStorage

**Criterio de exito:** Kanban scrolleable. Click en lead abre detalle editable completo con notas e historial. Se puede crear lead nuevo.

---

## I5: Propiedades — CRUD completo ✅ HECHO (9 sep 2026)
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** PropertyManagement.jsx, useAdminData.js (+addProperty/deleteProperty), format.js (+status 'paused')

Actualmente solo se puede cambiar status. Necesita CRUD completo:

- [x] **Boton "Agregar propiedad"** prominente en header:
  - Modal grande con tabs: Datos basicos / Ubicacion / Caracteristicas / Multimedia
  - Tab Datos basicos: titulo, descripcion, operacion (venta/alquiler/temporario), tipo, precio, moneda, estado
  - Tab Ubicacion: direccion, barrio (dropdown de neighborhoods.json), ciudad, coordenadas (placeholder)
  - Tab Caracteristicas: ambientes, dormitorios, banos, superficie total/cubierta, antiguedad, orientacion, cochera (toggle), amenities (checklist)
  - Tab Multimedia: URLs de imagenes (inputs, maximo 6), URL tour virtual
  - Al guardar: propiedad aparece en la lista
- [x] **Editar propiedad** (click en fila o boton edit):
  - Mismo modal que agregar pero pre-llenado con datos actuales
  - Todos los campos editables
- [x] **Pausar/Despublicar**: nuevo status "pausada" con badge gris. Toggle rapido desde la tabla
- [x] **Eliminar**: boton con confirmacion ("Seguro que desea eliminar?")
- [x] **Info expandida en tabla**: agregar columnas visibles: barrio, superficie, dormitorios (responsive, ocultar algunas en mobile)
- [x] **Vista doble**: toggle tabla/grid (grid muestra cards con imagen)
- [x] Persistir todo en localStorage via useAdminData

**Criterio de exito:** CRUD completo de propiedades. Agregar, editar todos los campos, pausar, eliminar. Vista tabla y grid.

---

## I6: Visitas — Edicion completa + mensajes ✅ HECHO (9 sep 2026)
**Esfuerzo:** Medio-Alto (2 hrs)
**Archivos:** VisitsScheduler.jsx, mockVisits.js (+clientEmail), useAdminData.js (+addVisit)

- [x] **Boton "Agendar visita"** en header:
  - Modal: propiedad (dropdown), cliente nombre + email + telefono, fecha (date picker), hora (time select), tipo (presencial/videollamada), agente asignado
- [x] **Click en visita card**: expandir detalle con:
  - Info completa de la propiedad (titulo, foto mini, direccion, precio)
  - Datos del cliente (nombre, email, telefono)
  - Agente asignado (editable dropdown)
  - Notas de la visita (textarea)
  - Resultado (si completada): Interesado / No interesado / Hara oferta
- [x] **Reagendar**: boton que abre mini-modal con nueva fecha + hora
- [x] **Enviar mensaje/link al cliente**: boton "Enviar recordatorio" que simula envio (toast "Recordatorio enviado a [email]")
- [x] **Enviar link de videollamada**: si tipo=videollamada, boton "Generar link" que muestra URL mock
- [x] Persistir cambios en localStorage

**Criterio de exito:** Se puede agendar visita nueva, editar existente, reagendar, enviar recordatorio. Detalle de propiedad visible en cada visita.

---

## I7: Operaciones — Interactividad y edicion ✅ HECHO (9 sep 2026)
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** OperationsManagement.jsx, mockOperations.js (+buyer/seller/docs/timeline/notas/commissionPct), useAdminData.js (+addOperation, +persist agents)

- [x] **Click en operacion**: abrir `OperationDetailModal` con:
  - Propiedad: titulo, foto (lookup properties.json), direccion, precio publicado
  - Comprador/Inquilino y Vendedor/Propietario: nombre, email, telefono (editables, labels segun tipo)
  - Tipo, monto acordado editable, comision % editable + monto calculado en vivo
  - Fecha inicio + fecha estimada cierre (date pickers), agente editable
  - Documentos: checklist por tipo (SALE_DOCS/RENT_DOCS) con toggle done, contador
  - Timeline visual de etapas con fecha; "Avanzar etapa" agrega entrada + actualiza progreso
- [x] **Agregar operacion nueva**: `NewOperationModal` (propiedad autocompletable, comprador/vendedor, tipo, monto, comision, fechas, agente). nextId OP-###
- [x] **KPIs expandidos**: 6 cards con "Tiempo promedio de cierre" (dias) y "Comision promedio" (USD equiv.)
- [x] **Notas por operacion**: textarea + historial con timestamp
- [x] Persistir en localStorage (key v2)

**Criterio de exito:** Operaciones editables con detalle completo. Se puede crear nueva. Checklist de documentos. Timeline de avances. Build OK, sin diagnosticos.

---

## I8: Liquidaciones — Expansion completa ✅ HECHO (9 sep 2026)
**Esfuerzo:** Medio-Alto (2-3 hrs)
**Archivos:** OwnerLiquidations.jsx (reescrito), mockLiquidations.js (owners + periodos + gastos por propiedad + banco), nuevo useLiquidations.js

- [x] **Expandir detalle de liquidacion** (panel derecho):
  - Encabezado: owner info (nombre, CUIT, direccion, banco/alias mock)
  - Periodo (mes/ano) con selector — cada owner tiene 6 periodos de historial generados
  - Por cada propiedad: titulo, direccion, inquilino; alquiler cobrado + fecha; estado (cobrado/parcial/pendiente/atrasado) con select + badge; gastos desglosados editables (tipo select + concepto + monto + eliminar); subtotal por propiedad
  - Resumen general: Total cobrado − Comision (%) − Gastos = Neto; comision % editable inline; aviso de pendiente
- [x] **Historial de liquidaciones**: 6 periodos por owner, selector dropdown para ver cada uno
- [x] **"Generar recibo"**: `ReceiptModal` preview estilo PDF (membrete agencia, datos owner+banco, tabla, totales, disclaimer) + "Descargar" simulado con toast
- [x] **"Agregar gasto"**: boton por propiedad (agrega gasto editable inline)
- [x] **Boton "Nueva liquidacion"**: selecciona owner + mes/ano, clona propiedades como pendientes
- [x] Persistir en localStorage (key `terranova-liquidations`)

**Criterio de exito:** Liquidacion con desglose completo editable. Historial mensual. Preview de recibo profesional. Se puede agregar gastos. Build OK, sin diagnosticos.

---

## I9: Equipo/Agentes — Panel completo ✅ HECHO (9 sep 2026)
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** AgentsManagement.jsx (reescrito), mockAgents.js (records HR completos + roles/turnos/estados/especialidades), useAdminData.js (+updateAgent/addAgent/persist), LeadsManagement.jsx (filtro agente por contexto)

Owner dijo "SUPER POBRE". Ahora es panel de gestion real:

- [x] **Click en agente**: `AgentDetailModal` con campos editables: datos personales (nombre, email, telefono, foto URL, rol), zonas multi-select (neighborhoods), propiedades asignadas (checklist), especialidad multi-select, estado (activo/inactivo/vacaciones), turno (mañana/tarde/completo), objetivo mensual
- [x] **Metricas por agente** (panel lateral): cierres mes/trimestre/año, comision generada, leads activos (con link a LeadsManagement filtrado via AdminContext), visitas completadas/agendadas + % conversion, tiempo promedio de respuesta, rating 1-5 estrellas, ranking #X de Y (por comision)
- [x] **Historial**: ultimas 10 acciones con icono por tipo (operacion/visita/lead/listing) + fecha
- [x] **Agregar agente**: `NewAgentModal` con todos los campos. nextId AG-###
- [x] **KPIs del equipo en header**: agentes activos, cierres del mes, comision generada, conversion promedio + card destacada "Mejor agente del mes"
- [x] Vista toggle: cards o tabla

**Criterio de exito:** Panel de gestion de personal completo. Cada agente editable con metricas, historial, propiedades asignadas. Se siente profesional. Build OK, sin diagnosticos.

---

## I10: Publicacion en Plataformas ✅ HECHO (11 sep 2026)
**Esfuerzo:** Medio-Alto (2-3 hrs)
**Archivos:** Nuevo: data/admin/mockPlatforms.js, hooks/usePlatforms.js, admin/platforms/PlatformPublishing.jsx. Editado: AdminLayout.jsx, AdminSidebar.jsx, AdminHeader.jsx

- [x] Nuevo modulo admin: "Plataformas" (icono Share2 en sidebar, entre Propiedades y Leads)
- [x] Lista de propiedades con estado de publicacion por plataforma:
  - Columnas: Propiedad | ZonaProp | ArgenProp | MercadoLibre | Instagram
  - Cada celda: pill verde (publicada) / gris (no publicada) / amarillo (pausada), tonos del theme (success/warning/muted)
  - Popover por celda para publicar/pausar/despublicar (toggle rapido con estado actual marcado)
- [x] Al publicar: animacion de "Publicando..." (spinner Loader2) con delay 1s, luego badge verde + toast "Publicada en X"
- [x] **Stats por propiedad** (expandir fila con chevron / boton "Ver estadisticas" en mobile):
  - Visitas desde cada plataforma (mock determinista, seed por propId:platId — estable entre reloads)
  - Consultas recibidas por plataforma
  - Dias publicada (calculado desde publishedAt vs TODAY) + fecha de publicacion
  - Chart mini: visitas/dia (7 dias) por plataforma (barras CSS animadas, empty-state si recien publicada)
- [x] **Acciones masivas**: checkbox por propiedad + "seleccionar todas", barra flotante con accion (Publicar/Pausar/Despublicar) + dropdown de plataforma + Aplicar (publicar masivo con animacion escalonada)
- [x] **Resumen general** (header, 4 cards):
  - Total propiedades publicadas / total (con al menos un portal activo)
  - Plataforma con mas consultas
  - Propiedad mas vista
  - Visitas totales + consultas totales
- [x] Agregar "Plataformas" al viewTitles de AdminHeader
- [x] Persistir estados en localStorage (key `terranova-platforms-v1`, merge schema-safe) + boton Restaurar
- [x] Filtro extra: busqueda por titulo/barrio/direccion + filtro por estado. Responsive (tabla lg → cards mobile con grilla 2x2). Dark/light via tokens.

**Criterio de exito:** Modulo nuevo funcional. Publicar/despublicar propiedades en 4 plataformas. Stats simulados por plataforma. Build OK (1901 modulos, sin errores).

---

## I11: Usuarios y Roles
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** Nuevo: admin/users/UserManagement.jsx, data/mockUsers.js

- [x] mockUsers.js: 9 usuarios con id, name, email, role (admin/agente-senior/agente-junior/asistente/tasador), avatar, status (active/inactive), lastLogin, permissions[]. Incluye catálogo de permisos agrupados, presets por rol y modelo de accesos por rol (ROLE_ACCESS + niveles)
- [x] UserManagement.jsx:
  - Tabla de usuarios (desktop) + cards (mobile): avatar, nombre, email, rol (badge color + icono), permisos, estado, último login (relativo)
  - Botón "Agregar usuario": modal con nombre, email (validación formato + duplicado), rol (dropdown que auto-aplica preset), permisos (checklist agrupado), delay 600ms + loading
  - Click en usuario: modal detalle con edición de rol y permisos + botón "Aplicar preset del rol" + panel "Qué ve este rol"
  - Toggle activar/desactivar usuario (inline en tabla/cards y dentro del modal), con toast y avatar en gris si inactivo
  - Filtro por rol (con conteos) + búsqueda por nombre/email/rol
- [x] **Vista por rol** (tab "Accesos por rol"): "Qué ve cada rol"
  - Admin: ve todo · Agente senior: Dashboard + Propiedades/Leads/Visitas/Operaciones (asignadas)
  - Agente junior: Dashboard limitado, Propiedades (solo ver), Leads/Visitas (suyos)
  - Asistente: Dashboard básico, Visitas (agenda), Leads (solo ver) · Tasador: Propiedades (ver + valuar), nada más
- [x] Panel informativo con cards por rol: icono, conteo de usuarios, módulos accesibles con nivel (badge) y módulos sin acceso
- [x] Agregado a sidebar (icono ShieldCheck, distinto de Users que ya usa Leads) + viewTitles del header
- [x] Persistir en localStorage (hook useUsers, key `terranova-users-v1`, normalize schema-safe + botón Restaurar)
- [x] KPIs: usuarios activos, administradores, roles en uso, último ingreso

**Criterio de exito:** CRUD de usuarios funcional. Vista clara de permisos por rol. Se entiende que ve cada tipo de usuario. Build OK (1904 módulos, sin errores).

---

## I12: Portal Login multi-rol ✅ HECHO (11 sep 2026)
**Esfuerzo:** Medio-Alto (2-3 hrs)
**Archivos:** ClientPortal.jsx (reescrito, ~1000 lineas). Nuevo: data/mockTenantData.js, data/mockOwnerData.js

Transformar el login existente para soportar 3 roles:

- [x] **Redisenar pantalla de login** (`LoginScreen`): email + password (cualquier credencial), form en grid 2col en sm+, y selector de rol con 3 cards grandes seleccionables (ring-accent + tilde al elegir):
  - "Interesado en comprar/alquilar" (icono Search) → portal interesado actual
  - "Soy inquilino" (icono Home) → portal locatario (nuevo)
  - "Soy propietario" (icono Building2) → portal locador (nuevo)
  - Boton dinamico "Ingresar como {rol}", delay 500ms + loading; al entrar setea `userRole` + primer tab del rol
- [x] **Persistir rol en estado**: `userRole` + `selectedRole` en el state del portal. Seccion activa se resetea al primer nav del rol al ingresar
- [x] **Sidebar del portal cambia segun rol** (config centralizada en `ROLES`):
  - Interesado: Favoritos, Visitas, Ofertas, Documentos, Alertas (comportamiento intacto, extraido a `BuyerSections`)
  - Inquilino: Mi contrato, Pagos, Proximo ajuste, Documentos, Reparaciones (`TenantSections`)
  - Propietario: Mis propiedades, Liquidaciones, Documentos, Estado de cobro (`OwnerSections`)
- [x] **Header del portal**: badge con rol actual (icono + label, bg-accent/15), avatar+nombre del rol, boton "Cambiar perfil" (icono Repeat) que vuelve al login manteniendo la seleccion
- [x] **Mock data por rol**: `mockTenantData.js` (contrato, pagos 6 meses, evolucion de alquiler, ajuste ICL, documentos, reparaciones) y `mockOwnerData.js` (3 propiedades con historial de inquilinos, liquidaciones, estado de cobro, historial de cobros, documentos). Coherentes con properties.json (resuelven propertyId → imagen/direccion)
- [x] **Vistas por rol completas** (no placeholders "Seccion X"): Inquilino → contrato con barra de progreso 36 meses + clausulas, pagos con resumen al-dia/mora + pago simulado MercadoPago, ajuste con grafico de evolucion + alerta proximo ajuste, docs, reparaciones con timeline + modal funcional `RepairRequestModal` (persiste). Propietario → cards de propiedades con neto + historial (details), liquidaciones con KPIs + descarga PDF (toast), estado de cobro con progreso + grafico 6 meses + morosidad en rojo, docs agrupados por propiedad
- [x] Pagos + reparaciones del inquilino persisten en localStorage (`inmob-portal-tenant-v1`). Dark/light via tokens, responsive, animaciones Framer Motion (barras/progreso). Build OK (1906 modulos), Vite transform OK

**Criterio de exito:** Login con selector de 3 roles. Cada rol ve sidebar y contenido diferente. Estructura (y buena parte del contenido read-only) lista; I17/I18 completan la interactividad profunda.

**Nota para I17/I18:** los data files ya existen con la forma base — expandir ahi (no recrear). El id de seccion "documents" se comparte entre roles pero el render ramifica por `userRole` primero, sin colision.

---

## I13: Portal Interesado — Mis Visitas expandido ✅ HECHO (12 sep 2026)
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** ClientPortal.jsx (seccion visitas dentro del portal)

- [x] Cada visita card expandida con:
  - Foto mini de la propiedad (thumbnail real vía `propById`/properties.json) + badge de operación
  - Titulo y direccion de la propiedad
  - Precio (formatPrice por operación) y tipo de propiedad
  - Fecha, hora, tipo visita (presencial/videollamada) + marca "Reprogramada"
  - Status badge (Agendada/Confirmada/Realizada/Cancelada)
  - **Agente asignado** (`agentById`/mockAgents): nombre, foto mini, teléfono clickeable (`tel:`), email clickeable (`mailto:`)
  - **Boton "Enviar mensaje al agente"**: abre `MessageAgentModal` (textarea + mensajes rápidos, simula envío con toast)
- [x] **Resultado de visita** (si realizada): `VisitFeedback` inline editable
  - Rating 1-5 estrellas (`StarRating`)
  - Toggle: "Me interesa" / "No me interesa"
  - Nota opcional · resumen read-only con botón Editar si ya hay feedback
- [x] **Botones mejorados**: "Reprogramar" → `RescheduleVisitModal` (DatePicker compartido + horario, vuelve a "Agendada"). "Cancelar" → `CancelVisitModal` (confirmación + motivo, incluye "Otro motivo" libre)
- [x] Ordenar: próximas primero (asc) con separador "Próximas", pasadas después (desc) con "Anteriores" + badge "N sin calificar". EmptyState si no hay visitas
- [x] Estado + persistencia en localStorage (`inmob-portal-visits-v1`). Build OK (1907 módulos)

**Criterio de exito:** Visitas muestran info completa de propiedad + agente. Se puede interactuar con cada visita. Feedback post-visita.

---

## I14: Portal Interesado — Mis Ofertas expandido ✅
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** ClientPortal.jsx (seccion ofertas)

Actualmente es tabla read-only. Necesita ser interactiva:

- [x] **Click en oferta**: card expandible (`OfferCard`) con detalle:
  - Propiedad: foto, titulo, direccion, precio publicado (linkeado a properties.json real)
  - Mi oferta: monto ofertado, condicion (contado/financiado/permuta con icono), validez, fechas
  - Status stepper (`OfferStepper`): Enviada → En revision → Contraoferta → Resolucion (Aceptada/Rechazada)
  - Si contraoferta: panel destacado con monto del vendedor + botones "Aceptar" / "Contraofertar" / "Rechazar"
- [x] **Historial de contra-ofertas**: timeline visual (`OfferTimeline`) reconstruido desde `history[]`
  - Cada evento con actor (comprador/propietario), monto, fecha, nota; dots por color (gold/accent/success/error)
- [x] **Boton "Nueva oferta"** → `NewOfferModal`:
  - Propiedad (dropdown con optgroup Favoritos + Todas)
  - Monto ofertado (input numerico) + moneda (USD/ARS, default segun propiedad)
  - Condicion de pago (contado/financiado/permuta), mensaje, validez (dias)
  - Submit con delay (700ms) + toast de confirmacion
- [x] **Contraoferta** (`CounterOfferModal`) y **Aceptar/Rechazar** (`OfferDecisionModal`) con confirmacion
- [x] **Badge count** rojo en tab "Mis ofertas" = contraofertas pendientes de respuesta (status `counter`)
- [x] Persistir en localStorage (`inmob-portal-offers-v1`). Build OK (1907 modulos)

**Nota tecnica:** el gotcha de alpha sobre colores del theme (`bg-accent/10`, `border-accent/40` no renderizan) tambien aplica a inmobiliaria → los paneles de enfasis usan fills solidos (`bg-surface-alt` + `border-accent`).

**Criterio de exito:** Ofertas interactivas con detalle de propiedad. Sistema de contra-ofertas con timeline. Crear oferta nueva funcional.

---

## I15: Portal Interesado — Documentos con upload ✅ HECHO (12 sep 2026)
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** ClientPortal.jsx (seccion documentos, reescrita). Nuevo: data/mockBuyerDocuments.js

- [x] **Organizar por propiedad/operacion**:
  - Agrupacion `DocGroup` collapsible: "Documentos para [Propiedad X]" (subtitulo barrio · operacion). Grupos derivados de las props de las ofertas del comprador + las que ya tienen docs
  - Fallback "Documentos generales" para docs sin propiedad asignada (docs personales)
- [x] **Cada documento card expandida** (`BuyerDocCard`):
  - Icono por tipo (img → Image, pdf/doc → FileText)
  - Nombre del archivo, badge de tipo de documento (DNI, Recibo de sueldo, Garantía, CUIT, Certificado de dominio, etc.)
  - Estado con dot + badge: Subido / Pendiente de verificación / Verificado / Rechazado
  - Fecha de subida (formatDate) + tamaño, botón "Descargar" (toast simulado), botón eliminar
  - Si rechazado: card con borde rojo + motivo + botón "Reemplazar documento" (reabre modal prellenado tipo+propiedad)
- [x] **Upload funcional (simulado)** — `UploadDocumentModal` + `UploadDropzone`:
  - Dropzone "Arrastrá tus documentos aquí" (drag-over resalta, click abre modal)
  - Selector de tipo + selector de propiedad asociada. "Seleccionar archivo" simula selección con delay (650ms) + spinner, genera filename desde el tipo
  - Al subir: barra de progreso 0→100% animada + spinner %, luego aparece en la lista como "Pendiente de verificación" (toast)
- [x] **Checklist de requisitos** (`DocChecklist`): toggle Compra/Alquiler + barra de progreso, tick verde si cumplido, X rojo si rechazado, reloj muted si falta; contador X/Y para requisitos con `count` (ej. recibos 2/3)
  - Compra: DNI, CUIT, Recibos de sueldo x3, Certificado BCRA · Alquiler: DNI, Recibos x3, Garantía propietaria, CUIT garante
- [x] Persistir en localStorage (`inmob-portal-documents-v1`)
- [x] **Gotcha aplicado:** alpha sobre colores del theme (`bg-success/15`, etc.) es no-op en inmobiliaria → badges/circles usan `bg-surface-alt` sólido + texto/dot de color, o color sólido con `text-white`. Build OK (1908 módulos). Verificado en navegador (Playwright/Chrome): checklist, grupos, upload con progreso, persistencia, dark/light, 0 errores de consola

**Criterio de exito:** Documentos organizados por propiedad. Upload simulado con progreso. Checklist de requisitos segun tipo operacion.

---

## I16: Portal Interesado — Alertas funcionales ✅ HECHO (12 sep 2026)
**Esfuerzo:** Medio (1-1.5 hrs)
**Archivos:** ClientPortal.jsx (seccion alertas reescrita)

Reemplaza la versión básica de I1 (toggle + toast + modal simple) por un sistema completo. El modelo de criterios pasó de single-value a multi-select → se bumpeó la key de localStorage a `inmob-portal-alerts-v2` con `normalizeAlert` schema-safe.

- [x] **Toggle funcional** con feedback:
  - Toast "Alerta activada" / "Alerta pausada"
  - Switch animado con Framer Motion (`layout` spring en el knob, track `bg-accent`/`bg-border` sólido — sin alpha)
  - Persiste en localStorage
- [x] **"Crear nueva alerta"** — `AlertFormModal` (modal ancho `max-w-2xl`, scrollable):
  - Operación: Venta / Alquiler / Temporario (select) + **moneda** USD/ARS (toggle)
  - Zonas/Barrios: **multi-select** de neighborhoods.json (chips toggle, sin selección = todas)
  - Rango de precio: min/max + validación (mín > máx)
  - Tipo propiedad: **multi-select** (Depto, Casa, PH, Local, Terreno)
  - Dormitorios mínimo (Indistinto/1+…5+) + superficie mínima (input m²)
  - Nombre de la alerta (input con placeholder = nombre auto-sugerido según criterios)
  - Preview en vivo de coincidencias (`matchProperties` sobre properties.json)
  - Mismo modal sirve para **crear y editar** (`target` = 'new' | alerta)
- [x] **Cada alerta card mejorada** (`AlertCard`):
  - Nombre + criterios resumidos como tags (`criteriaTags`)
  - "X nuevas" pill roja (`bg-error text-white` sólido) = matches no vistos
  - "Ver N propiedades" → `AlertMatchesModal` (lista con thumbnail, precio, dorm/m², link a detalle vía `onSelectProperty`); al abrir marca los matches como vistos (`seenIds`)
  - Botón Editar (reabre modal prellenado) + Eliminar con `ConfirmDialog`
- [x] **Notificación visual**: badge rojo en tab "Alertas" = total de coincidencias nuevas sin revisar (reutiliza el mecanismo `navBadges` de ofertas)
- [x] Strip de resumen (Alertas / Activas / Nuevas). Dark/light OK, 0 errores de consola. Build OK (1908 módulos). Verificado en navegador (Playwright + Chrome del sistema): crear/editar/eliminar/toggle/ver-matches/persistencia/badge.

**Criterio de exito:** Alertas con toggle funcional + feedback. Crear nueva alerta con criterios completos. Ver propiedades que coinciden. Editar/eliminar. ✅

---

## I17: Portal Locatario (inquilino) — Vista completa ✅ HECHO (12 sep 2026)
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** ClientPortal.jsx (secciones inquilino reescritas + ReceiptModal), mockTenantData.js (reescrito como modelo derivado), utils/format.js (fix TZ)

Base creada en I12; I17 la eleva a completa y arregla bugs reales (barras del gráfico invisibles y badges/paneles sin fondo por el no-op de alpha sobre colores del theme).

- [x] **mockTenantData.js — modelo derivado (fuente única de verdad)**: todo el modelo financiero se calcula con el MISMO motor que el admin (`projectAdjustments` + `INDICES` de mockContracts) → "el inquilino ve la misma proyección que la inmobiliaria, cero sorpresas".
  - Contrato: propiedad, propietario, inicio, 36 meses (Ley 27.551), base back-solveada para que el actual ≈ $621k, índice ICL, ajuste trimestral, depósito, vencimiento, próximo ajuste — todo derivado
  - Pagos: **12 meses** derivados (cada mes toma el alquiler de su período), estado, fecha, medio; el actual pendiente con mora + interés calculado
  - Documentos: contrato, garantía, seguro caución, reglamento + **recibos por mes** derivados de los pagos
  - Reparaciones: 2 mock con timeline; `REPAIR_STATUS`/urgencias con fills sólidos (no alpha)
- [x] **Tab "Mi contrato"**: card con foto, badges (vigente + índice), alquiler/depósito/inicio/vencimiento, barra de progreso 36 meses, chip de próximo ajuste, cláusulas, datos del propietario, descargar contrato
- [x] **Tab "Pagos"**: strip de stats (actual / pagado 12m / próximo vto), resumen al-día vs mora (con días + interés), lista scrollable de 12 pagos con saltos trimestrales coherentes, "Pagar con MercadoPago" (delay + persist), **"Ver recibo" → ReceiptModal** estilo PDF por pago
- [x] **Tab "Próximo ajuste"**: índice + tasa, actual vs estimado (fórmula real), alerta de próximo ajuste, **gráfico de evolución de 12 períodos** (pagado/actual/proyectado, fills sólidos y visibles en dark/light) + **comparador ICL/UVA/IPC** (mismo engine, +17.4/15.8/9.9%)
- [x] **Tab "Documentos"**: grupo contrato/garantías + grupo **recibos de pago** (derivados, abren ReceiptModal), dropzone de upload
- [x] **Tab "Reparaciones"**: lista con estado (pill sólido) + dot de urgencia por color, timeline con fechas (último paso pulsante si en curso), modal "Solicitar reparación" (título/desc/urgencia/foto placeholder), persiste en localStorage
- [x] **ReceiptModal** reutilizable (pagos + documentos): membrete de la agencia, datos inquilino/propietario/inmueble, período, total, disclaimer, descargar PDF (toast)
- [x] **Fix `formatDate` (inmobiliaria)**: las fechas ISO date-only se parseaban como UTC → mostraban un día antes en zona AR ("28 feb" en vez de "01 mar"). Ahora se fijan a mediodía local → fecha correcta en toda la app
- [x] **Fix alpha no-op**: se reemplazaron todos los `bg-*/NN` / `border-*/NN` sobre colores del theme por fills sólidos (`bg-surface-alt`, colores sólidos, `text-white`). También `StatCard` variante accent

**Criterio de exito:** Portal de inquilino completo con 5 tabs funcionales. Datos coherentes. Pago simulado. Ajuste conectado con lógica real. Reparaciones con solicitud. ✅ Build OK (1908 módulos). Verificado en navegador (Playwright + Chrome): 5 tabs en dark/light, pago + persistencia, crear reparación, recibo, comparador de índices, gráfico visible, fechas correctas, 0 errores de consola.

---

## I18: Portal Locador (propietario) — Vista completa
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** ClientPortal.jsx, nuevo: data/mockOwnerData.js
**Requiere:** I12 (login multi-rol) hecho primero

- [x] **mockOwnerData.js — modelo derivado del motor del admin (fuente única de verdad)**: las liquidaciones mensuales reusan el MISMO `computePeriod` del admin (cobrado − comisión − gastos = neto, breakdown por propiedad, taxonomía `cobrado/parcial/pendiente/atrasado`) → el propietario ve exactamente los números de la inmobiliaria.
  - 3 propiedades reales (PROP-005 Herrera, PROP-011 Bianchi, PROP-014 vacante) con renta = precio del listing, gastos como line items (Expensas/ABL/Seguro), comisión 8%, historial 2-3 inquilinos, índice ICL
  - `OWNER_PERIODS`: 6 meses (Abr→Sep 2026) derivados con escalón trimestral ICL en julio + reparación puntual; Sep actual con Herrera atrasado. `OWNER_COLLECTION` y `OWNER_COLLECTION_HISTORY` derivados de los períodos
  - Documentos por propiedad con kind/size/fecha/estado; tipos y helpers para el upload; key localStorage propia
  - Status maps a **fills sólidos** (`bg-success text-white`…) — el alpha sobre colores del theme es no-op en esta app
- [x] **Tab "Mis propiedades"**: strip de stats (propiedades/alquiladas/neto mensual), card por propiedad con foto, estado (Alquilada/Disponible sólido), inquilino+desde+alquiler+vencimiento, **breakdown de rentabilidad** (alquiler − comisión − gastos = neto; vacante muestra costo de vacancia), "Ver detalle" que expande gastos mensuales + inquilinos anteriores
- [x] **Tab "Liquidaciones"**: resumen acumulado (cobrado/comisión/gastos/neto de meses liquidados), lista por período con estado Liquidada/Pendiente, neto y nota de pendiente de cobro, **"Ver detalle" → LiquidationDetailModal** estilo PDF con desglose por propiedad (cobrado/gastos/subtotal), totales, disclaimer y descargar PDF (toast)
- [x] **Tab "Documentos"**: grupos colapsables por propiedad + generales, banner de docs en revisión, dropzone, **upload simulado con progreso (patrón I15)** que persiste en localStorage (llega como "En revisión"), descargar/eliminar por doc
- [x] **Tab "Estado de cobro"**: barra cobrado/esperado del mes (%), **alerta de morosidad** (borde rojo, lista de atrasados + días de atraso), fila por propiedad con estado sólido y fecha de cobro/vencimiento, **gráfico de 6 meses** (barras cobrado vs esperado, escalón trimestral visible, fills sólidos)

**Criterio de exito:** Portal propietario con 4 tabs funcionales. Datos coherentes con el admin (mismo motor de liquidación). Descarga de docs + upload persistente. ✅ Build OK (1908 módulos). Verificado en navegador (Playwright + Chrome): 4 tabs en dark/light, detalle de liquidación con breakdown, upload + persistencia tras reload (8→9 docs), morosidad con días de atraso, gráfico con alturas reales, 0 errores de consola.

---

## I19: Mapa con zonas dibujables + filtros avanzados ✅ HECHO (19 sep 2026)
**Esfuerzo:** Muy Alto (3-4 hrs)
**Archivos:** PropertiesListPage.jsx (reescrito ~700 lineas), PropertyMap.jsx (reescrito ~320 lineas)

- [x] **Filtros avanzados** (sección colapsable "Más filtros" con badge de conteo activo):
  - Superficie total: inputs min/max (m²) + track visual del rango sobre bounds del dataset (0–1200 m²)
  - Antiguedad: select (A estrenar / 1-5 / 5-10 / 10-20 / +20) derivado de `yearBuilt` (2026) + condición "A estrenar"
  - Cochera: select Con/Sin/Indistinto (garage>0)
  - Amenities: checklist de 8 chips con matching por keywords contra los amenities free-form (Pileta/Piscina, Seguridad/Portería/CCTV, Parrilla/Quincho, Gym, SUM/Club house, Balcón, Terraza/Solárium, Lavadero/Laundry) — AND
  - Orientacion: select Norte/Sur/Este/Oeste (substring, "Norte" matchea Noreste/Noroeste)
  - Boton "Limpiar filtros" (resetea también avanzados + zona)
  - Boton "Guardar como alerta": construye criteria compatible con el schema del portal y lo persiste en `inmob-portal-alerts-v2` (currency='' = cualquiera) → aparece en el portal Interesado > Alertas. Toast de confirmación
- [x] **Mapa mejorado** (SVG/CSS, sin lib externa):
  - Markers coloreados por operacion (venta=blue-600, alquiler=emerald-600, temporario=orange-500 — paleta real de Tailwind, el alpha sobre theme es no-op)
  - Hover en marker: tooltip con foto mini + título + precio + m² + "Ver ficha" (abre detalle)
  - Click en marker: highlight (border-accent) + scrollIntoView de la fila en la lista (id `maprow-<id>`)
  - Leyenda con los 3 colores + contador (`pointer-events-none` para no comerse clicks de dibujo)
- [x] **Dibujar zona de interes** (point-in-polygon REAL, no mock):
  - "Dibujar zona" activa modo dibujo (cursor crosshair, pines pointer-events-none)
  - Click en el mapa agrega vértices (dots + polyline SVG punteada); Deshacer / Cancelar / Cerrar zona
  - Al cerrar (3+ puntos, o click sobre el 1er vértice) filtra por ray-casting sobre (lng,lat) de cada propiedad; polígono relleno persistente
  - "Limpiar zona" (en el mapa y "quitar" en el header)
- [x] **Resultado**: count en header "X propiedades encontradas" + indicador "· zona dibujada" cuando aplica

**Criterio de exito:** Filtros avanzados completos. Mapa con markers clickeables. Dibujo de zona funcional (real point-in-polygon). Profesional. ✅ Build OK (1908 módulos). Verificado en navegador (Playwright + Chrome): amenity 14→5, badge de filtros, guardar-alerta + persistencia, mapa con pines/leyenda/tooltip, dibujo de 4 puntos → filtra a 2, limpiar zona, marker-click→highlight en lista, reset 14, dark mode + mobile responsive, 0 errores de consola.

---

## I21: MortgageCalculator mejoras ✅ HECHO (19 sep 2026)
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** MortgageCalculator.jsx (reescrito ~760 lineas). Nuevo: data/mockMortgage.js (helpers de finanzas + bancos + UVA + docs)

Investigar e implementar mejoras argentinas:

- [x] **Comparacion de bancos** (tab "Comparar bancos"): tabla (desktop) + cards (mobile) con 6 bancos UVA reales (Nación/Provincia/Ciudad/Hipotecario/Santander/Galicia). Por banco: TNA, TEA (derivada), % que financia (LTV), plazo máx, requisitos resumidos + highlight. Cuota estimada calculada para el crédito actual, ordenada asc con badge "Mejor cuota"; si el plazo elegido supera el máx del banco se recalcula y avisa
- [x] **UVA vs Tradicional** (tab "UVA vs. fija"): slider de inflación (10–60%). En vez de comparar totales nominales (que bajo alta inflación disparan la UVA a números alarmantes y engañosos), se reencuadró en la historia REAL del mercado argentino: (1) cuota inicial UVA vs fija + **ingreso necesario** para cada una (accesibilidad = el driver real), (2) callout de **año de cruce** donde la cuota UVA iguala a la fija, (3) gráfico **"cuota en pesos de hoy"** (UVA plana, fija que se licúa, con cruce visible), (4) **costo total en pesos de hoy** (valor presente descontado por inflación) con nota honesta nominal-vs-real, (5) **gráfico de evolución histórica de la UVA** (12 meses + interanual). Valor UVA mock derivado
- [x] **Cuadro de amortizacion** (tab "Amortización"): sistema francés, tabla mes/cuota/capital/interés/saldo (primeros 12 meses) + toggle **vista anual** (resumen por año, saldo llega a 0 en el último). Cálculo verificado (interés mes 1 = capital×TNA/12)
- [x] **Capacidad de crédito** (tab "¿Cuánto puedo pedir?"): input ingreso mensual + selector relación cuota-ingreso (25%/30%) → "podés acceder a hasta $X" (inversa de la fórmula francesa), ingreso mínimo para el crédito actual, badge Calificás/Ingreso insuficiente + barra cuota/ingreso (verde/rojo)
- [x] **Requisitos** (tab "Requisitos"): documentación agrupada (personales / ingresos / propiedad / crédito) con checklist informativo + nota de tasación
- [x] **Mejoras visuales**: **donut SVG** capital vs interés (arco dorado animado) en el panel de resultado, **AnimatedNumber** (count-up con framer-motion `animate`+`useMotionValue`) en cuota y filas, TEA equivalente en vivo bajo la tasa
- [x] **Gotcha aplicado:** las decoraciones del panel `bg-primary` (que en el modo oscuro de la app invierte a claro) usaban `white/alpha` → se lavaban. Reemplazadas por `currentColor` + `color-mix`/`strokeOpacity` para que el track del donut, la barra de interés y los divisores se vean en ambos temas. Charts dentro de tabs usan `animate` (no `whileInView`, que no dispara al cambiar de tab con el contenido ya en viewport)

**Criterio de exito:** Comparacion entre bancos. UVA vs tradicional (honesto, no engañoso). Cuadro amortizacion. Requisitos + capacidad de crédito. ✅ Build OK (1909 módulos). Verificado en navegador (Playwright + Chrome): 5 tabs en dark/light, cálculos de amortización correctos (saldo→0), capacidad con calificación, cambio de moneda USD/ARS coherente, donut + números animados, 0 errores de consola.

---

## I22: Tasador publico con comparables + PDF
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** Nuevo: components/PropertyValuation.jsx, o nueva pagina

- [x] **Formulario de tasacion**: barrio (dropdown neighborhoods.json), direccion, tipo (departamento/casa/PH/oficina/local/terreno), superficie total + cubierta, antiguedad, estado (6 niveles A estrenar→A refaccionar), dormitorios/banos/cocheras, amenities (chips multi-select). Campos condicionales por tipo (terreno oculta cubierta/estado/ambientes; no-residencial oculta dormitorios). Validacion + boton "Tasar propiedad" con spinner (delay 700ms)
- [x] **Resultado de tasacion**: valor central animado (count-up) + rango min-max con barra, precio/m2, badge de confianza Alta/Media/Baja + nota, blend datos-comparables vs modelo-de-zona. Panel `bg-primary` con gotcha de dark-mode resuelto (primary-contrast + color-mix, no `text-gold`)
- [x] **Motor de tasacion** (`data/mockValuation.js`, funciones puras): modelo hedonico (base $/m² por barrio × tipo × estado × antiguedad × amenities × cochera) blendeado con valor de comparables ponderado por similaridad. Solo comparables SALE en USD (rent es ARS mensual, otra escala). Confianza derivada de comparables fuertes (mismo barrio+tipo). Verificado vs datos reales: Palermo 187k (real 189k), Villa Crespo 75k (real 74.5k), terreno S.Barbara 103k (real 98k)
- [x] **Comparables**: grid de cards (hasta 5) con foto, titulo, direccion, precio, superficie, $/m², % match y tags mismo-barrio/mismo-tipo; "Basado en X propiedades similares en la zona"
- [x] **Generar PDF** (simulado): modal con informe profesional (membrete Terranova + logo, N° ref deterministico, fecha, ficha de la propiedad, estimacion + rango + confianza, tabla de comparables, disclaimer). Boton "Descargar informe" → toast "Informe PDF generado"
- [x] Accesible desde navbar ("Tasador", icono Gauge) y como seccion `#valuation` en la landing (bg-surface-alt)

**Criterio de exito:** Formulario de tasacion → estimacion con comparables → preview PDF. Calculo basado en datos reales del mock. ✅ Build OK (1911 modulos). Motor verificado contra los 8 sale listings reales; dev server transforma los 2 modulos nuevos sin errores. Dark/light contemplado (panel primary invertido).

---

## I23: Comparador side-by-side de propiedades ✅ HECHO (19 sep 2026)
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** Nuevo: components/PropertyComparator.jsx. Editado: PropertiesListPage.jsx, PropertyCard.jsx

- [x] **Seleccion de propiedades**: toggle "Comparar"/"Comparando" en cada PropertyCard (nuevas props `onToggleCompare`/`isComparing`/`compareDisabled`, deshabilitado al llegar a 4)
  - Barra flotante abajo (fija, `z-100`) al seleccionar ≥1: icono con badge de count, **thumbnails de las seleccionadas** con X para quitar, botón "Comparar" (deshabilitado <2 con hint), "Limpiar selección"
  - El toast se corre a `bottom-24` mientras la barra está visible para no pisarse
- [x] **Vista comparativa** (`PropertyComparator`, modal grande `max-w-6xl`, `bg-black/85`):
  - Header por columna: foto + operación + título + precio + acciones + X para quitar
  - Grid responsive con **columna de labels sticky-left** y **header sticky-top**; 2-4 columnas de propiedad. En mobile desborda → swipe horizontal (hint "Deslizá…")
  - Filas: Operación, Tipo, Barrio, Precio, Precio/m², Sup. total, Sup. cubierta, Ambientes, Dormitorios, Baños, Cochera, Antigüedad, Orientación, Estado, Disponibilidad, Expensas, Amenities (count) + fila de **detalle de amenities** con chips
  - **Highlight de mejor valor en verde** (check) según métrica (menor precio/precio-m²/expensas; mayor superficie/ambientes/dorm/baños/cochera/amenities; más nuevo)
  - **Diferencia >20%** marca el peor valor en **rojo** con flecha; empates y <2 valores válidos no marcan
  - **Guard de comparabilidad de precio**: si mezclan operación/moneda distinta, el precio NO corona ganador (nota al pie explicándolo) — no compara peras con manzanas
- [x] **Acciones por propiedad en comparador**: "Ver" (→ detalle), "Agendar" (deshabilitado si no disponible), "Quitar" (X); cierran el modal y navegan vía `onSelectProperty`
- [x] Responsive (scroll-swipe con labels pineados), dark/light por tokens, Escape + click-fuera cierran, body-scroll lock. Fills sólidos (alpha no-op de la app). Al quitar y quedar <2, el modal se cierra solo

**Criterio de exito:** Seleccionar 2-4 propiedades y compararlas en tabla visual. Highlights de diferencias. Acciones directas. ✅ Build OK (1912 módulos), dev server transforma los 3 módulos sin errores. Verificación en navegador pendiente (no había Playwright en la sesión).

---

## I24: Simulador Ajuste — Mejoras
**Esfuerzo:** Bajo-Medio (1 hr)
**Archivos:** AdjustmentSimulator.jsx (reescrito ~430 lineas), mockContracts.js (+ engine de fechas/estado)

Owner dijo "ME GUSTA" pero si se puede mejorar:

- [x] **Grafico de evolucion** (`EvolutionChart`): barras CSS animadas (Framer) con la cuota por período, eje Y con montos compactos ($k/$M), barras base vs ajustadas por color, marca "hoy" en el período vigente y `title` con detalle por barra. Escala 18–100% para que toda barra sea visible (gotcha altura% → columna `h-full` dentro de fila con alto fijo)
- [x] **Comparacion de indices** (`CompareSection`): botón toggle "Comparar índices" que despliega gráfico **SVG multi-línea** (ICL oro / UVA verde / IPC azul, `vector-effect=non-scaling-stroke`, dots finales, "tu índice" resaltado) + tabla de cuota final por índice con highlight del más barato (verde) / más caro (rojo) y frase resumen del ahorro mensual. Mismo contrato, 3 escenarios
- [x] **Indices reales mock**: ticker de 3 tarjetas seleccionables (reemplaza los botones de índice) con valor publicado + `%/mes` + "Dato al DD Mmm AAAA" (ICL 1.287,40 · UVA 1.794,06 · IPC 8.456,78). La tarjeta activa marca "Aplicado"
- [x] **Alerta de ajuste proximo** (`NextAdjustmentBanner`): motor `contractStatus` calcula período vigente + próximo ajuste desde `startDate`/`freqMonths` vs `TODAY` (2026-09-19, TZ-safe). Si `<30 días` → banner warning (fecha + prev→nuevo + %/monto); si no, banner info neutro; si no hay más ajustes, aviso. CT-1041 dispara la alerta (12 días → 01 Oct)
- [x] **Boton "Notificar inquilino"**: en el banner y en el recibo; toast (`useToast` compartido) "Notificación enviada a {inquilino}: nuevo alquiler {monto} desde {fecha}"
- [x] **Recibo mejorado**: layout tipo comprobante real — franja de acento, cabecera con marca + folio (`CT-XXXX-NN`) + fecha de emisión, bloque inquilino/contrato/propiedad/período/índice, separadores punteados, línea de ajuste acumulado, mora editable con punitorio, TOTAL destacado y nota "sin validez fiscal". `tabular-nums` en montos

**Criterio de exito:** Grafico de evolucion. Comparacion de 3 indices. Valores mock actualizados. Alerta proximo ajuste. ✅ Build OK (1912 módulos) · verificado en navegador (Chrome/Playwright): light+dark sin errores de consola, ticker/banner/recibo/chart/comparador y toast de notificación OK. Cambios aditivos en `mockContracts` → portal Locatario (I17) intacto.

---

## I25: Contratos vigentes — Tabla de gestion ✅ HECHO (19 sep 2026)
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** Nuevo: admin/contracts/ContractsManagement.jsx, hooks/useContracts.js, scripts/test-contracts.mjs, scripts/smoke-contracts.mjs. Editado: mockContracts.js (expandido), admin/contracts/AdjustmentSimulator.jsx (+prop initialContractId), layout/AdminLayout.jsx + AdminSidebar.jsx + AdminHeader.jsx

El sidebar "Ajustes" pasó a llamarse **"Contratos"** y ahora abre un contenedor con **2 tabs**: "Contratos vigentes" (la gestión nueva) + "Simulador de ajuste" (el AdjustmentSimulator de I24, intacto). Todo el modelo financiero se deriva con el MISMO motor de ajuste (`projectAdjustments`/`contractStatus`) → la tabla muestra los mismos números que el simulador y los portales.

- [x] Nuevo modulo admin: "Contratos" como contenedor tabbed (gestión + simulador). Icono `FileText` en sidebar
- [x] **mockContracts.js expandido (aditivo)**: los 3 contratos que usa el simulador/portal Locatario quedan intactos en sus campos núcleo; se enriquecen con propiedad/dirección/inquilino (email/tel)/propietario (CUIT)/agente/depósito/cláusulas extra, y se agregan 5 contratos más para cubrir todos los estados. Helpers nuevos: `CONTRACT_STATUSES`/`CONTRACT_STATUS`, `contractEndDate`, `contractClauses`, `contractDocuments` (statuses deterministas seedeados por id), `deriveContract` (motor compartido)
- [x] **Tabla de contratos vigentes**:
  - Columnas: Propiedad | Inquilino | Propietario | Inicio | Vencimiento | Monto actual | Índice | Próx. ajuste | Estado (responsive: oculta owner/inicio/índice/próx en < xl/lg; cards en mobile)
  - Estado con motor: Vigente / Por vencer (<90 días) / Vencido / Rescindido (badges sólidos por tono — alpha no-op de la app)
  - Ordenable por cualquier columna (toggle asc/desc con ícono)
  - Filtros: estado, índice, agente + búsqueda (propiedad/inquilino/propietario/N°) + "Limpiar"
- [x] **Click en contrato**: `ContractDetailModal` (xl) con detalle completo
  - Datos del contrato + todas las cláusulas + thumbnail de la propiedad (lookup properties.json)
  - Historial de ajustes (tabla fecha · índice · monto anterior · monto nuevo · var% · aplicado/programado) derivado del motor
  - Documentos asociados (verificado/pendiente + descargar con toast)
  - Botones: "Simular ajuste" (salta al tab simulador con el contrato preseleccionado — solo contratos seed), "Renovar" (`RenewModal`: extiende vencimiento 12/24/36m) y "Rescindir" (`TerminateModal`: DatePicker + motivo)
- [x] **Alertas automáticas**: banner warning arriba con los contratos que vencen en < 90 días (nombre + días + "Renovar" rápido)
- [x] **Botón "Nuevo contrato"**: `NewContractModal` con autocompletado desde la cartera de alquileres (properties.json), partes, agente, plazo, índice, frecuencia, alquiler base + depósito, validación de obligatorios
- [x] **KPIs**: Vigentes · Por vencer · Renta mensual de la cartera activa · Próximo ajuste más cercano
- [x] Persistencia en localStorage (`useContracts`, key `terranova-contracts-v1`, normalize schema-safe + "Restaurar demo"). Crear/renovar/rescindir persisten

**Criterio de exito:** Tabla de contratos con estado visual. Alertas de vencimiento. Detalle con historial de ajustes. CRUD basico. ✅ Build OK (1914 módulos). Motor verificado (`test-contracts.mjs`: 52/52 checks — 4 vigentes, 2 por vencer, 1 vencido, 1 rescindido). Smoke en navegador (`smoke-contracts.mjs`, playwright-core + Chrome): tabla/filtros/detalle/renovar/nuevo/simulador/dark, 0 errores de consola.

---

## I26: POIs cercanos a propiedad ✅ HECHO (19 sep 2026)
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** data/pois.js (nuevo), components/NearbyPlaces.jsx (nuevo), pages/PropertyDetailPage.jsx, scripts/smoke-pois.mjs (nuevo)

- [x] Motor de POIs en `data/pois.js` (patrón seedeado por id, como mockExcursions/mockValuation):
  - Pools curados con landmarks reales por barrio (14 barrios). Selección determinista 5-7 POIs por propiedad, con cobertura de categorías garantizada.
  - Tipos: school/university/hospital/pharmacy/transport/market/mall/restaurant/park/gym. Distancia + `travel` (a pie ≤1200m, en auto si más) derivados por zona (urban/premium/coastal/suburban/gated).
- [x] **Sección en PropertyDetailPage**: "Qué hay cerca" (nuevo `NearbyPlaces.jsx`)
  - Grid de cards por POI: icono Lucide según tipo, nombre, distancia, tiempo (a pie/auto). Agrupados por categoría (Educación/Salud/Transporte/Comercio/Recreación).
- [x] **Score de ubicación** 1-10 = variedad(4) + cantidad(2.5) + proximidad(3.5); label cualitativo + barra visual. Barrios cerrados bajan a ~6, urbanos 8-9.3.
- [x] Dark/light mode OK, responsive (2 col md, 1 mobile). Build OK. `scripts/smoke-pois.mjs` (playwright-core): sección, score, 5 categorías, distancias/tiempos, toggle de tema y mobile → SMOKE PASS, 0 errores de consola.

**Criterio de exito:** ✅ Seccion "Que hay cerca" en detalle de propiedad con POIs categorizado. Score de ubicacion. Info util para el comprador/inquilino.

---

## SHARED: DatePicker propio ✅ HECHO (11 sep 2026)
**Archivos:** ScheduleVisitForm.jsx, admin/visits/VisitsScheduler.jsx (2), admin/operations/OperationsManagement.jsx (4)

Ya existe `packages/shared-ui/components/DatePicker.jsx` (creado y aplicado en hoteleria):
calendario themeado con tokens del theme (se adapta por-app), controlado por `value`/`onChange(isoString)`,
con `min`/`max`/`error`. Reemplaza el `input type="date"` nativo (la "poronga blanca" del navegador).

- [x] Swap de los 7 usos nativos de inmobiliaria por `<DatePicker>` (import `@shared-ui/components/DatePicker`).
      `onChange` recibe el string ISO directo (no evento) → se inlineó el setter en cada uno.
- [x] Rollout COMPLETO en todo el monorepo: hoteleria (9), inmobiliaria (7), salud (2), gastronomia (1).
      Builds OK en las 4 apps. 0 pickers nativos restantes.

---

## FINAL (sin número) · GuidedTour funcional — lo último de todo
**Esfuerzo:** Medio (1-1.5 hrs)
**Archivos:** App.jsx (verificar TOUR_STEPS si existe)

> Movido al fondo por decisión del owner: es lo último de lo último, se hace recién cuando todo el resto esté cerrado.

- [ ] Verificar que GuidedTour de shared-ui esta importado
- [ ] Definir 6-8 pasos del tour con targets correctos:
  1. Hero/Buscador: "Busca propiedades por tipo, operacion y ubicacion"
  2. Propiedades destacadas: "Explora las propiedades mas populares con tour 360"
  3. Calculadora: "Simula tu credito hipotecario con tasas reales"
  4. Servicios: "Servicios integrales de la inmobiliaria"
  5. Agentes: "Nuestro equipo de asesores especializados"
  6. Contacto: "Consultas y tasaciones gratuitas"
  7. Portal badge: "Portal del cliente: seguimiento de visitas, ofertas, documentos"
  8. Admin badge: "Panel de gestion: CRM, propiedades, operaciones, liquidaciones"
- [ ] Verificar spotlight cutout en cada seccion
- [ ] Boton "Recorrido" en navbar funcional
- [ ] Al terminar: CTA "Explora el admin panel" o "Proba el portal"

**Criterio de exito:** Tour guiado completo de 6-8 pasos funcional con spotlight.

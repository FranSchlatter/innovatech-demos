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

## I13: Portal Interesado — Mis Visitas expandido
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** ClientPortal.jsx (seccion visitas dentro del portal)

- [ ] Cada visita card expandida con:
  - Foto mini de la propiedad (thumbnail de properties.json)
  - Titulo y direccion de la propiedad
  - Precio y tipo operacion
  - Fecha, hora, tipo visita (presencial/videollamada)
  - Status badge (Agendada/Confirmada/Realizada/Cancelada)
  - **Agente asignado**: nombre, foto mini, telefono clickeable, email clickeable
  - **Boton "Enviar mensaje al agente"**: abre modal mini-chat o textarea + enviar (simula envio, toast)
- [ ] **Resultado de visita** (si realizada): seccion con feedback del interesado
  - Rating 1-5 estrellas de la propiedad
  - Toggle: "Me interesa" / "No me interesa"
  - Nota opcional
- [ ] **Botones mejorados**: "Reprogramar" abre modal con nueva fecha/hora. "Cancelar" pide confirmacion + motivo
- [ ] Ordenar: proximas primero, pasadas despues (separador visual)

**Criterio de exito:** Visitas muestran info completa de propiedad + agente. Se puede interactuar con cada visita. Feedback post-visita.

---

## I14: Portal Interesado — Mis Ofertas expandido
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** ClientPortal.jsx (seccion ofertas)

Actualmente es tabla read-only. Necesita ser interactiva:

- [ ] **Click en oferta**: expandir detalle con:
  - Propiedad: foto, titulo, direccion, precio publicado
  - Mi oferta: monto ofertado, fecha, condiciones (contado/financiado/permuta)
  - Status: Enviada → En revision → Contra-oferta → Aceptada/Rechazada
  - Si contra-oferta: mostrar monto de contra-oferta del vendedor + boton "Aceptar" / "Rechazar" / "Contra-ofertar"
- [ ] **Historial de contra-ofertas**: timeline visual
  - "Oferta original: USD 95,000" → "Contra-oferta vendedor: USD 100,000" → "Mi contra-oferta: USD 97,500" → etc.
- [ ] **Boton "Nueva oferta"**: formulario con:
  - Propiedad (dropdown de favoritos o todas)
  - Monto ofertado (input numerico + moneda)
  - Condicion de pago (select: contado/financiado/permuta)
  - Mensaje al propietario (textarea)
  - Validez de la oferta (dias)
  - Submit con delay + confirmacion
- [ ] **Badge count** en tab "Mis Ofertas" mostrando ofertas pendientes de respuesta
- [ ] Persistir en localStorage

**Criterio de exito:** Ofertas interactivas con detalle de propiedad. Sistema de contra-ofertas con timeline. Crear oferta nueva funcional.

---

## I15: Portal Interesado — Documentos con upload
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** ClientPortal.jsx (seccion documentos)

- [ ] **Organizar por propiedad/operacion**:
  - Agrupacion: "Documentos para [Propiedad X]" — collapsible sections
  - Si no hay propiedad asignada: seccion "Documentos generales"
- [ ] **Cada documento card expandida**:
  - Icono de tipo (PDF/IMG/DOC)
  - Nombre del archivo
  - Tipo de documento: DNI, Recibo sueldo, Garantia, CUIT, Certificado dominio, etc. (badge)
  - Estado: Pendiente / Subido / Verificado / Rechazado (badge color)
  - Fecha de subida
  - Boton "Descargar" (simulado)
  - Si rechazado: motivo del rechazo
- [ ] **Upload funcional (simulado)**:
  - Drag-drop zone mejorada con texto "Arrastra tus documentos aqui"
  - Boton "Seleccionar archivo" (simula seleccion con delay)
  - Al "subir": animacion de progreso (barra 0→100% con delay), luego aparece en la lista como "Pendiente de verificacion"
  - Selector de tipo de documento al subir
  - Selector de propiedad asociada
- [ ] **Checklist de requisitos**: lista de documentos requeridos con tick verde si subido, rojo si falta
  - Para compra: DNI, CUIT, Recibos sueldo x3, Certificado BCRA
  - Para alquiler: DNI, Recibos sueldo x3, Garantia propietaria, CUIT garante
- [ ] Persistir en localStorage

**Criterio de exito:** Documentos organizados por propiedad. Upload simulado con progreso. Checklist de requisitos segun tipo operacion.

---

## I16: Portal Interesado — Alertas funcionales
**Esfuerzo:** Medio (1-1.5 hrs)
**Archivos:** ClientPortal.jsx (seccion alertas)

- [ ] **Toggle funcional** con feedback:
  - Al activar/desactivar: toast notification "Alerta activada" / "Alerta pausada"
  - Animacion en el switch
  - Estado persiste en localStorage
- [ ] **"Crear nueva alerta"** — modal completo:
  - Tipo operacion: Compra / Alquiler / Temporario (select)
  - Zona/Barrio: multi-select de neighborhoods.json
  - Rango de precio: min/max con inputs numericos + moneda
  - Tipo propiedad: multi-select (Departamento, Casa, PH, Local, Terreno)
  - Dormitorios: minimo (select 1-5+)
  - Superficie minima (input)
  - Nombre de la alerta (input: "Mi busqueda zona norte")
  - Al guardar: aparece en la lista como nueva alerta activa
- [ ] **Cada alerta card mejorada**:
  - Nombre, criterios resumidos como tags
  - "X coincidencias nuevas" (numero mock)
  - Click: ver las propiedades que matchean (filtrar properties.json con los criterios)
  - Boton editar (reabre modal con datos)
  - Boton eliminar con confirmacion
- [ ] **Notificacion visual**: badge rojo en tab "Alertas" si hay coincidencias nuevas

**Criterio de exito:** Alertas con toggle funcional + feedback. Crear nueva alerta con criterios completos. Ver propiedades que coinciden. Editar/eliminar.

---

## I17: Portal Locatario (inquilino) — Vista completa
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** ClientPortal.jsx, nuevo: data/mockTenantData.js
**Requiere:** I12 (login multi-rol) hecho primero

- [ ] **mockTenantData.js**: datos coherentes del inquilino mock:
  - Contrato: propiedad, propietario, fecha inicio, duracion (36 meses ley), monto base, indice ajuste (ICL), frecuencia ajuste, deposito, fecha vencimiento
  - Pagos: ultimos 6 meses con: mes, monto, estado (pagado/pendiente/atrasado), fecha pago, medio (transferencia/efectivo/MercadoPago)
  - Documentos: contrato PDF, recibos, garantia, seguro caucion
  - Reparaciones: 2-3 solicitudes mock con estado

- [ ] **Tab "Mi contrato"**:
  - Card principal con datos del contrato (propiedad con foto, propietario, inicio, vencimiento, meses restantes)
  - Barra de progreso visual: mes actual de 36 meses
  - Datos del propietario (nombre, inmobiliaria)
  - Clausulas resumen (ajuste, plazo, deposito, penalidades)
  - Boton "Descargar contrato" (simulado)

- [ ] **Tab "Pagos"**:
  - Lista de pagos (scroll, ultimos 12 meses)
  - Cada pago: mes, monto (ARS), estado badge, fecha, medio de pago
  - Si pendiente: boton "Pagar" (simula pago con delay + confirmacion, MercadoPago mock)
  - Si atrasado: warning con dias de mora y monto con intereses (calculado)
  - Resumen arriba: "Al dia" verde o "Deuda: $X" rojo

- [ ] **Tab "Proximo ajuste"**:
  - Mostrar fecha del proximo ajuste
  - Indice actual (ICL/IPC/UVA) con valor mock
  - Alquiler actual vs estimado post-ajuste
  - Conectar logica con AdjustmentSimulator del admin (misma formula de calculo)
  - Grafico simple: evolucion del alquiler desde inicio (barras por periodo)

- [ ] **Tab "Documentos"**:
  - Lista: Contrato, Recibos de pago (por mes), Garantia, Seguro, Reglamento
  - Estado: Disponible / Pendiente
  - Boton descargar por cada uno (simulado)

- [ ] **Tab "Reparaciones"**:
  - Lista de solicitudes: titulo, descripcion, fecha, estado (Solicitada/En revision/Aprobada/En proceso/Resuelta)
  - Boton "Solicitar reparacion": modal con: titulo, descripcion, urgencia (Baja/Media/Alta/Urgente), foto (placeholder)
  - Timeline por solicitud con fechas de cada cambio de estado
  - Persistir en localStorage

**Criterio de exito:** Portal de inquilino completo con 5 tabs funcionales. Datos coherentes. Pago simulado. Ajuste conectado con logica real. Reparaciones con solicitud.

---

## I18: Portal Locador (propietario) — Vista completa
**Esfuerzo:** Alto (3-4 hrs)
**Archivos:** ClientPortal.jsx, nuevo: data/mockOwnerData.js
**Requiere:** I12 (login multi-rol) hecho primero

- [ ] **mockOwnerData.js**: datos del propietario mock:
  - 3 propiedades en alquiler: titulo, inquilino, monto, estado cobro, contrato vigente
  - Liquidaciones: ultimas 3 mensuales por propiedad
  - Documentos: contratos, habilitaciones, certificados

- [ ] **Tab "Mis propiedades"**:
  - Cards por propiedad con foto, titulo, direccion
  - Inquilino actual: nombre, desde cuando, monto actual
  - Estado: Alquilada / Disponible / En refaccion
  - Proximo vencimiento de contrato
  - Rentabilidad: monto mensual - gastos = neto (calculo simple)
  - Click: expande detalle con historial de inquilinos (mock 2-3 anteriores)

- [ ] **Tab "Liquidaciones"**:
  - Vista similar al admin pero desde perspectiva del propietario
  - Lista por mes: periodo, total cobrado, comision, gastos, neto a cobrar
  - Click: detalle con desglose por propiedad
  - Estado: Liquidada / Pendiente
  - Boton "Descargar PDF" por liquidacion (simulado)
  - Resumen anual: total cobrado, total gastos, total neto, comision total

- [ ] **Tab "Documentos"**:
  - Organizados por propiedad
  - Tipos: Contrato con inquilino, Titulo propiedad, Habilitacion municipal, Certificado catastral, Poliza seguro
  - Upload simulado (como I15)

- [ ] **Tab "Estado de cobro"**:
  - Dashboard de cobros de TODAS las propiedades
  - Por propiedad: inquilino, monto, estado del mes actual (Cobrado/Pendiente/Atrasado)
  - Total a cobrar este mes vs cobrado
  - Morosidad: propiedades con pagos atrasados (highlight rojo)
  - Grafico: cobros ultimos 6 meses (barras, cobrado vs esperado)

**Criterio de exito:** Portal propietario con 4 tabs. Ve sus propiedades, liquidaciones, estado de cobro. Puede descargar docs. Datos coherentes con admin.

---

## I19: Mapa con zonas dibujables + filtros avanzados
**Esfuerzo:** Muy Alto (3-4 hrs)
**Archivos:** PropertiesListPage.jsx (361 lineas), PropertyMap.jsx (60 lineas)

- [ ] **Filtros avanzados** (agregar a los existentes):
  - Superficie total: rango min/max (slider dual o inputs)
  - Antiguedad: select (Estrenar/1-5 anos/5-10/10-20/+20)
  - Cochera: toggle Si/No/Indistinto
  - Amenities: checklist (Pileta, Seguridad, Parrilla, Gym, SUM, Balcon, Terraza, Lavadero)
  - Orientacion: select (Norte/Sur/Este/Oeste/Indistinto)
  - Boton "Limpiar filtros"
  - Boton "Guardar busqueda como alerta" (crea alerta en portal)
- [ ] **Mapa mejorado**:
  - Reemplazar embed actual con mapa CSS/SVG interactivo (mockup de mapa de Santa Fe)
  - Markers por cada propiedad (color segun operacion: venta=azul, alquiler=verde, temporario=naranja)
  - Hover en marker: tooltip con titulo, precio, foto mini
  - Click en marker: scroll a la propiedad en la lista (highlight)
- [ ] **Dibujar zona de interes** (simulado):
  - Boton "Dibujar zona" activa modo dibujo
  - Click en el mapa agrega puntos del poligono (mostrar como dots + lineas SVG)
  - Al cerrar el poligono (4+ puntos), filtrar propiedades que caen dentro (mock: todas las del barrio mas cercano al area dibujada)
  - Boton "Limpiar zona"
- [ ] **Resultado**: propiedades filtradas muestran count en header "X propiedades encontradas"

**Criterio de exito:** Filtros avanzados completos. Mapa con markers clickeables. Funcion de dibujar zona (aunque sea simulada). Profesional.

---

## I20: GuidedTour funcional
**Esfuerzo:** Medio (1-1.5 hrs)
**Archivos:** App.jsx (verificar TOUR_STEPS si existe)

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

---

## I21: MortgageCalculator mejoras
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** MortgageCalculator.jsx (233 lineas)

Investigar e implementar mejoras argentinas:

- [ ] **Comparacion de bancos**: agregar tab/seccion con tabla comparativa
  - 4-5 bancos mock: Nacion, Provincia, Santander, BBVA, Galicia
  - Por banco: tasa nominal, tasa efectiva, requisitos resumidos, tipo credito (UVA/tradicional)
  - Resultado: cuota estimada por banco para el monto ingresado
- [ ] **Toggle UVA vs Tradicional**:
  - UVA: cuota se calcula con valor UVA actual (mock), mostrar evolucion historica (grafico simple)
  - Tradicional: tasa fija, cuota fija
  - Comparativa visual: total a pagar UVA vs tradicional (con supuesto de inflacion configurable)
- [ ] **Cuadro de amortizacion**: tabla desplegable con primeros 12 meses: mes, cuota, capital, interes, saldo
- [ ] **Requisitos generales**: seccion informativa
  - Ingreso minimo requerido (cuota < 25% ingreso)
  - Input "Mi ingreso mensual" → "Podes acceder a credito de hasta $X"
  - Documentacion requerida (listado informativo)
- [ ] **Mejoras visuales**: grafico dona/pie capital vs interes, animacion de numeros

**Criterio de exito:** Comparacion entre bancos. Toggle UVA vs tradicional. Cuadro amortizacion. Informacion de requisitos. Mas util para el usuario.

---

## I22: Tasador publico con comparables + PDF
**Esfuerzo:** Alto (2-3 hrs)
**Archivos:** Nuevo: components/PropertyValuation.jsx, o nueva pagina

- [ ] **Formulario de tasacion**:
  - Ubicacion: barrio (dropdown), direccion (input)
  - Tipo: departamento/casa/PH/local/terreno
  - Superficie total y cubierta (inputs m2)
  - Antiguedad (select o input anos)
  - Estado: excelente/bueno/regular/a refaccionar
  - Dormitorios, banos, cochera, amenities
  - Boton "Tasar propiedad"
- [ ] **Resultado de tasacion**:
  - Precio estimado: rango (min-max) con valor central destacado
  - Precio por m2 calculado
  - Confianza de la estimacion (Alta/Media/Baja badge)
  - Calculo: usar promedio de propiedades similares en properties.json (filtrar por barrio + tipo + rango superficie ±20%)
- [ ] **Comparables** (seccion abajo del resultado):
  - 3-5 propiedades similares de properties.json
  - Por cada una: titulo, direccion, precio, superficie, precio/m2
  - "Basado en X propiedades similares en la zona"
- [ ] **Generar PDF** (simulado):
  - Preview estilo informe profesional: logo, datos propiedad, estimacion, comparables, disclaimer
  - Boton "Descargar informe" (toast "PDF generado")
- [ ] Accesible desde navbar o como seccion en la landing

**Criterio de exito:** Formulario de tasacion → estimacion con comparables → preview PDF. Calculo basado en datos reales del mock.

---

## I23: Comparador side-by-side de propiedades
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** Nuevo: components/PropertyComparator.jsx, PropertiesListPage.jsx

- [ ] **Seleccion de propiedades**: en PropertiesListPage, boton "Comparar" en cada PropertyCard
  - Al seleccionar 2-4 propiedades, aparece barra flotante abajo: "Comparar X propiedades" boton
  - Badge con count de seleccionadas
  - Boton "Limpiar seleccion"
- [ ] **Vista comparativa** (modal grande o nueva seccion):
  - Columnas lado a lado (2-4 propiedades)
  - Filas de comparacion: Foto, Precio, Precio/m2, Superficie, Dormitorios, Banos, Antiguedad, Barrio, Cochera, Amenities, Estado
  - Highlight de mejor valor en verde (menor precio, mas superficie, etc.)
  - Si diferencia >20%, marcar en rojo/verde
- [ ] **Acciones por propiedad en comparador**: "Ver detalle", "Agendar visita", "Quitar de comparacion"
- [ ] Responsive: en mobile, stack vertical con swipe entre propiedades

**Criterio de exito:** Seleccionar 2-4 propiedades y compararlas en tabla visual. Highlights de diferencias. Acciones directas.

---

## I24: Simulador Ajuste — Mejoras
**Esfuerzo:** Bajo-Medio (1 hr)
**Archivos:** AdjustmentSimulator.jsx (137 lineas), mockContracts.js

Owner dijo "ME GUSTA" pero si se puede mejorar:

- [ ] **Grafico de evolucion**: agregar chart visual con la proyeccion de cuotas a lo largo del contrato (barras o linea, CSS)
- [ ] **Comparacion de indices**: boton "Comparar indices" que muestra las 3 proyecciones (UVA/ICL/IPC) para el mismo contrato lado a lado
- [ ] **Indices reales mock**: mostrar valor actual de cada indice con fecha de ultimo dato (ej: "ICL: 1,234.56 — Dato al 01/09/2026")
- [ ] **Alerta de ajuste proximo**: si el proximo ajuste es en < 30 dias, mostrar banner warning con fecha y estimacion
- [ ] **Boton "Notificar inquilino"**: simula envio de notificacion con el monto del ajuste (toast)
- [ ] Mejorar layout del recibo/preview haciendolo mas similar a un recibo real

**Criterio de exito:** Grafico de evolucion. Comparacion de 3 indices. Valores mock actualizados. Alerta proximo ajuste.

---

## I25: Contratos vigentes — Tabla de gestion
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** Nuevo: admin/contracts/ContractsManagement.jsx, mockContracts.js (expandir)

- [ ] Nuevo modulo admin: "Contratos" (separado del Simulador de Ajuste, o como tab dentro)
- [ ] **Tabla de contratos vigentes**:
  - Columnas: Propiedad | Inquilino | Propietario | Inicio | Vencimiento | Monto actual | Indice | Proximo ajuste | Estado
  - Estado: Vigente / Por vencer (<90 dias) / Vencido / Rescindido
  - Ordenable por columna
  - Filtros: estado, indice, agente
- [ ] **Click en contrato**: modal con detalle completo
  - Datos del contrato (todas las clausulas)
  - Historial de ajustes (tabla: fecha, indice aplicado, monto anterior, monto nuevo)
  - Documentos asociados
  - Botones: "Renovar" (cambio estado), "Rescindir" (cambio estado con fecha)
- [ ] **Alertas automaticas**: banner arriba con contratos que vencen en < 90 dias
- [ ] **Boton "Nuevo contrato"**: modal con todos los campos
- [ ] Agregar a sidebar (si es modulo separado) o como tab en Contratos

**Criterio de exito:** Tabla de contratos con estado visual. Alertas de vencimiento. Detalle con historial de ajustes. CRUD basico.

---

## I26: POIs cercanos a propiedad
**Esfuerzo:** Medio (1.5-2 hrs)
**Archivos:** PropertyDetailPage.jsx, properties.json (agregar campo pois[])

- [ ] Agregar campo `pois[]` a properties.json (o archivo separado):
  - Por propiedad: 4-6 POIs cercanos con: name, type (school/hospital/market/park/transport/gym/restaurant), distance (ej: "200m", "3 cuadras"), walkTime (ej: "5 min")
- [ ] **Seccion en PropertyDetailPage**: "Que hay cerca"
  - Grid de cards por POI: icono segun tipo, nombre, distancia, tiempo caminando
  - Agrupados por tipo: Educacion, Salud, Transporte, Comercio, Recreacion
  - Estilo limpio con iconos de Lucide
- [ ] **Score de ubicacion**: calcular puntaje 1-10 basado en cantidad y variedad de POIs
  - Mostrar como badge prominente: "Ubicacion: 8.5/10" con barra visual
- [ ] Dark mode, responsive (2 columnas md, 1 mobile)

**Criterio de exito:** Seccion "Que hay cerca" en detalle de propiedad con POIs categorizado. Score de ubicacion. Info util para el comprador/inquilino.

---

## SHARED: DatePicker propio (rollout a inmobiliaria)
**Esfuerzo:** Bajo (30-45 min)
**Archivos:** ScheduleVisitForm.jsx, admin/visits/VisitsScheduler.jsx (2), admin/operations/OperationsManagement.jsx (4)

Ya existe `packages/shared-ui/components/DatePicker.jsx` (creado y aplicado en hoteleria):
calendario themeado con tokens del theme (se adapta por-app), controlado por `value`/`onChange(isoString)`,
con `min`/`max`/`error`. Reemplaza el `input type="date"` nativo (la "poronga blanca" del navegador).

- [ ] Swap de los 7 usos nativos de inmobiliaria por `<DatePicker>` (import `@shared-ui/components/DatePicker`).
  - Ojo: `onChange` recibe el string ISO directo, NO un evento → cambiar `e.target.value` por el valor.
- [ ] Verificar dark/light + build OK.

> Pendiente igual en **salud** (2 usos) y **gastronomia** (1 uso). Total original en el monorepo: 19 usos / 11 archivos.

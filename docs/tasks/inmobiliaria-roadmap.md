# Inmobiliaria Roadmap — Owner Decisions (Sept 6, 2026)

Full visual analysis in `/ANALISIS-DEMOS.html`. This file is the actionable todo list.

## VISION
Owner impression: "Parece una plantilla visual sin funcionalidades". Todo necesita MAS INTERACTIVIDAD.
Portal debe servir para LOCADOR (propietario) y LOCATARIO (inquilino), no solo comprador.
Reference: **Lebane Mexico** como demo a estudiar.
Owner admits: "No tengo mucha idea de lo que necesita una inmobiliaria" — INVESTIGAR.

---

## FIXES (Hacer primero) — ✅ HECHO (I1, 7 sep 2026)

- [x] **"Ver plano" en PropertyDetail**: FloorPlanModal (imagen + esquema SVG type-aware)
- [x] **"Ver tour"**: ahora solo la propiedad, sin escala complejo; adapta ambientes por tipo
- [x] **ServicesSection ("Servicios Integrales")**: cada servicio abre modal con detalle + beneficios + "Consultar" → scroll a contacto
- [x] **Alertas en portal**: toggle con toast, modal "Crear nueva alerta" funcional con matches reales + persistencia localStorage

---

## LANDING — Decisiones Owner

- [ ] **Mapa en PropertiesListPage**: poder "dibujar zonas de interes" (polygon draw). Mas filtros (superficie, antiguedad, cochera, amenities)
- [ ] **GuidedTour**: TERMINAR. Recorrido spotlight funcional
- [ ] **MortgageCalculator**: se puede mejorar? Investigar comparacion bancos, UVA vs tradicional, cuotas reales AR. Owner no conoce bien el tema

---

## CLIENT PORTAL — Decisiones Owner (CAMBIO GRANDE)

### Portal multi-rol
- [ ] **Login con selector de rol**: Interesado / Inquilino / Propietario
- [ ] Cada rol ve secciones distintas

### Vista Interesado (actual, expandir)
- [ ] **Mis Visitas**: mas info propiedad (ubicacion, foto), agente asignado, boton enviar mensaje
- [ ] **Mis Ofertas**: ver detalle propiedad, hacer oferta nueva, historial contra-ofertas
- [ ] **Documentos**: mas info por doc, upload funcional (DNI, recibos, garantias), organizado por propiedad: "Este depto son estos docs"
- [ ] **Alertas**: que funcionen, crear nueva alerta con criterios de busqueda

### Vista Locatario (inquilino) — NUEVA
- [ ] Ver contrato vigente
- [ ] Recibos de pago + estado
- [ ] Proximo ajuste (conectado con AdjustmentSimulator del admin)
- [ ] Documentos del alquiler
- [ ] Solicitar reparaciones

### Vista Locador (propietario) — NUEVA
- [ ] Ver y administrar propiedades en alquiler
- [ ] Ver documentos y recibos
- [ ] Estado de cobro de cada propiedad
- [ ] Liquidaciones (similar a admin pero vista owner)

---

## ADMIN — Decisiones Owner

### Problema general: "plantilla visual sin funcionalidades"

Todo necesita:
- Mas interactividad (clicks, editar, acciones)
- Mas edicion (no solo lectura)
- Mas info visible
- Mas acciones disponibles

### Modulos existentes a expandir

- [ ] **Dashboard**: me gusta. KPIs deben ser CLICKEABLES (llevan al modulo). Graficos tendencia, drill-down
- [ ] **Bandeja IA**: que agente pueda ESCRIBIR. Input texto + mensajes pre-definidos. Mismo q hoteleria
- [ ] **Propiedades**: CRUD completo (agregar/quitar/pausar/editar). Mas info editable. Botones publicar en plataformas (ZonaProp/ArgenProp/ML). OJO no chocar con portal propietario
- [ ] **Leads CRM**: no se puede scrollear, no queda claro para que sirve, no se puede editar. Necesita: editar leads, agregar notas, historial contacto, expandir detalle
- [ ] **Visitas**: editar visitas, enviar mensaje/link al cliente, reagendar, ver detalle propiedad
- [ ] **Operaciones**: mas interactividad, edicion, acciones, detalle
- [ ] **Simulador Ajuste**: ME GUSTA. Si se ve algo para mejorar, anotar
- [ ] **Liquidaciones**: se puede mejorar. Falta monton de info e interactividad. Historial, editar gastos, mas detalle, generar recibo real
- [ ] **Equipo**: SUPER POBRE. Editar agentes, asignar propiedades/zonas, metricas rendimiento, historial, permisos. Panel completo

### Modulos NUEVOS

- [ ] **Gestion de Usuarios / Roles**: admin ve todo, agente sus props/leads, asistente agenda. Paneles por rol
- [ ] **Publicacion en Plataformas**: botones publicar/despublicar ZonaProp/ArgenProp/ML/IG con stats

---

## RESEARCH (antes de implementar)

- [ ] **Estudiar Lebane Mexico** como referencia de demo inmobiliaria
- [ ] **Investigar necesidades reales** de inmobiliaria argentina (owner no tiene certeza)
- [ ] **MortgageCalculator**: investigar mejoras posibles (UVA, bancos, etc.)

---

## BACKLOG (ideas anteriores, sin decision owner aun)

- [ ] Tasador publico con comparables + PDF
- [ ] Comparador side-by-side de propiedades
- [ ] Tabla de contratos vigentes
- [ ] POIs cercanos a propiedad
- [ ] Multi-mercado AR/UY/ES

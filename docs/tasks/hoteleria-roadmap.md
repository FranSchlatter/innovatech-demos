# Hoteleria Roadmap — Owner Decisions (Sept 6, 2026)

Full visual analysis in `/ANALISIS-DEMOS.html`. This file is the actionable todo list.

## VISION
Reorientar toda la demo como un SHOWCASE de servicios vendibles (estilo Pixel/pxsol).
Nombre de hotel real. Cambio idioma y moneda. Revisar Pixel para ideas de presentacion.

---

## BUGS (Hacer primero)

- [ ] **RoomDetailPage galeria**: usa `[room.image x4]`. Agregar `images[]` a rooms.json
- [ ] **GuestPortal fechas**: MOCK_GUEST tiene enero 2024. Usar fechas relativas
- [ ] **AdminHeader viewTitles**: faltan "inbox", "pricing", "excursions" -> muestra undefined
- [ ] **OffersSection "Learn More"**: boton sin handler

---

## LANDING — Decisiones Owner

- [ ] **Hero**: Probar con VIDEO de fondo en vez de carrusel. Agregar swipe/touch mobile
- [ ] **Recorrido 360 del COMPLEJO en landing**: areas comunes (lobby, pool, restaurante) con mapa real interactivo. El 360 de habitacion queda SOLO en detalle de hab. Conseguir visuales reales
- [ ] **GuestServicesSection**: revisar si va en landing o moverlo al Guest Portal
- [ ] **OffersSection (Curated Experiences)**: actualmente no hace nada. Que funcione (detalle + reservar)
- [ ] **GuidedTour**: implementar recorrido spotlight funcional para landing
- [ ] **ReviewsSection**: agregar flechas prev/next
- [ ] Evaluar: eliminar AmenitiesSection (codigo muerto) y RoomsList (inactivo)

---

## GUEST PORTAL — Decisiones Owner

- [ ] **Agregar Login simulado** (cualquier credencial, es demo)
- [ ] **Eliminar tab "My Requests"** -> mover su contenido a "My Stay" como seccion dentro del overview
- [ ] **Services expandir**:
  - Reservaciones de restaurante CON CARTA VISIBLE (menu del hotel)
  - Reservaciones de excursiones (puede ser link a page de reservations)
  - Amenities (pool, spa, gym) similar
  - Decidir si todo junto o por categoria. FALTA INFO general aca
- [ ] **Help > Live Chat = Bandeja IA del admin**. Cuando huesped escribe, mensaje aparece en admin. Mismo sistema, dos vistas
- [ ] Persistencia localStorage para requests
- [ ] Factura detallada / descargable
- [ ] Modificar/cancelar reserva principal

---

## ADMIN — Decisiones Owner

### Modulos existentes a expandir

- [ ] **Bandeja IA**: que un agente PUEDA ESCRIBIR. Input de texto + mensajes pre-cargados (templates). Hoy es solo lectura. Conectar con Live Chat del Guest Portal
- [ ] **Precio Dinamico**: agregar ofertas/rebajas manuales + sugerencias automaticas (hab vacia X dias sin reservar = sugerir descuento, configurable) + temporada alta/baja
- [ ] **Room Management**: mapa interactivo tipo 360 (explorar idea). Editar MUCHO mas: asignar encargados, precio, fotos, amenities, descripcion. El edit actual es MUY SIMPLE
- [ ] **Housekeeping**: metricas por trabajador (tareas completadas, tiempo promedio, rating). Historial de cada uno. Panel de gestion de personal COMPLETO
- [ ] **Inventory**: mas metricas (tendencias consumo, costos por periodo, alertas reposicion automaticas)
- [ ] **Service Requests**: boton "Escribir al cliente" que autolleva a Bandeja IA con ese user asignado
- [ ] **Excursions**: metricas (revenue trends, popular, conversion). Agregar excursion NUEVA desde admin (no solo editar existentes)

### Modulos NUEVOS por construir

- [ ] **Gestion de Usuarios**: trabajadores (roles, permisos, turnos) + clientes/huespedes (historial, preferencias). PANELES POR ROL: admin ve todo, room service ve solo sus pedidos, mantenimiento ve solo sus tareas
- [ ] **Noticias / Avisos**: configurable desde admin con fecha inicio/fin. Aparecen automaticamente en front y desaparecen cuando pasa la fecha. Ej: "Pileta cerrada por remodelaciones del 15 al 20"
- [ ] **Panel de Actividades / Eventos**: crear eventos del hotel (Fiesta del Mojito, lugar, hora, imagen). Calendario visible para huespedes en front

---

## GLOBALES

- [ ] **i18n** cambio de idioma ES/EN en toda la app
- [ ] **Cambio de moneda** USD/ARS/EUR con recalculo
- [ ] **Nombre de hotel real** en la demo
- [ ] **Reorganizar como demo/showcase** estilo Pixel/pxsol. Revisar Pixel para ideas

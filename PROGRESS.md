# PROGRESS — InnovaTech Demos (post-pivot, ago-2026)

## Decisión: pivot a v1 in-place

Se **descartó** la estrategia "kit nuevo + apps v2". Las apps v2 (`hoteleria-v2`, `inmobiliaria-v2`) y `packages/demo-kit` **fueron eliminadas**. Se trabaja **mejorando in-place** las apps originales (`apps/hoteleria`, `apps/inmobiliaria`), que ya tenían landing rica + sub-páginas + admin completo + portal. Lo genuinamente nuevo de la v2 se porta a la v1; lo reutilizable va a `packages/shared-*`.

Motivo: la v2 reconstruía —más chico y peor— lo que la v1 ya tenía completo (v1 ≈ 10k LOC, v2 mínima), para sumar unas pocas features. Reutilizamos, no rehacemos.

## Roadmap de features nuevas (de la v2 → v1)

| # | Feature | Hotelería | Inmobiliaria |
|---|---------|-----------|--------------|
| 1 | Widget métrica-estrella | ✅ Comisión OTA vs directo (dashboard) | ✅ Tiempo de respuesta por agente / semáforo (dashboard) |
| 2 | Inbox con IA | ✅ Bandeja unificada multicanal (sección admin) | ✅ Bandeja IA con scoring de leads (sección admin) |
| 3 | Precio dinámico / ajuste | ✅ Sección admin (inflación vs demanda) | ✅ Simulador de ajuste UVA/ICL/IPC en vivo (sección admin) |
| 4 | Tour guiado | ✅ Intro en landing (spotlight, shared-ui) | ✅ Intro en landing (spotlight, shared-ui) |
| 5 | Toggles moneda/idioma/mercado | ⏳ pendiente | ⏳ pendiente |
| — | Liquidación al propietario | n/a | ✅ Sección admin (con recibo/PDF simulado) |
| — | Difusión por portal | n/a | ⏳ pendiente (inmo) |

### ✅ Hecho
- **Hotelería**: `CommissionWidget` (barras CSS, sin recharts) en el dashboard; sección **Bandeja IA** (`components/admin/inbox/`); sección **Precio dinámico** (`components/admin/pricing/`). Datos en `data/admin/mockChannels.js`, `mockConversations.js`, `mockPricing.js`.
- **Inmobiliaria**: `ResponseTimeWidget` (semáforo por agente) en el dashboard; sección **Bandeja IA** con scoring; **Simulador de ajuste** UVA/ICL/IPC en vivo con recibo + punitorios (`components/admin/contracts/`); **Liquidación al propietario** con recibo/PDF (`components/admin/liquidations/`). Datos en `data/admin/mock{Conversations,ResponseTimes,Contracts,Liquidations}.js`.
- **Tour guiado** (ambas apps): componente compartido `packages/shared-ui/components/GuidedTour.jsx` (spotlight con recorte, dots, prev/next). Se dispara desde el link **"Recorrido"** del navbar. Recorre la landing y remata invitando a entrar al panel.
- **Landing hotelería**: se conservan las 8 secciones ricas originales + sub-páginas + guest portal.
- **Limpieza**: eliminadas `apps/hoteleria-v2`, `apps/inmobiliaria-v2`, `packages/demo-kit`. Scripts v2 removidos de `package.json`. `package-lock.json` regenerado.
- Ambas apps **buildean OK** (`npm run build:hoteleria` / `build:inmobiliaria`).

## ⏳ Pendiente (para revisar con Fran contra el roadmap)
1. **Toggles moneda/idioma/mercado** (multi-mercado AR/UY/ES) — es el más invasivo (toca precios en toda la app); conviene planificarlo aparte.
2. **Inmobiliaria**: difusión por portal (publicar/despublicar en portales con estado y costo).
3. **Tour guiado**: hoy es intro de landing. Opcional: un segundo tour *dentro* del panel que resalte inbox IA / comisión / precio dinámico.
4. **Fotos**: inmobiliaria ya tiene fotos propias de inmuebles (apropiadas). Definir con Fran qué fotos de hotelería reutilizar y **dónde** (no reemplazar las de propiedades sin más).
5. Extraer piezas realmente reutilizables (Inbox, widgets) a `packages/shared-*` si se van a compartir con salud/gastro.

## Notas
- `PLAN.md` y los `AUDIT.md` por app quedaron como registro histórico del enfoque v2 (ya no vigente).
- Salud y gastronomía siguen fuera de alcance.

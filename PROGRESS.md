# PROGRESS — sesión autónoma (ago-2026)

Estado de ejecución del `PLAN.md`. **Nada commiteado** (espera tu OK).

## ✅ Hecho

### Fase 0 — Auditoría
- `apps/hoteleria/AUDIT.md` y `apps/inmobiliaria/AUDIT.md`: stack, datos, componentes, cobertura mobile, deuda, y cruce §7/§8 (ya-está / parcial / no-existe).

### Fase 1 — Kit compartido (`packages/demo-kit`) — **completa**
- **Tokens** (`tokens/kit.css` + `tailwind-preset.js`): identidad dual InnovaTech navy/cyan `#66E0FF` + hexágonos + Montserrat; temas cliente `theme-hotel` / `theme-realestate`; dark/light por `data-mode`. Vars `--dk-*`.
- **Primitivas**: Button, Card, Badge, Skeleton, EmptyState, Pill, Input, Select, DateField, Toggle, Modal, Drawer, Tabs, Tooltip, Table.
- **Compuestos**: AppShell (shell del panel), Inbox (lista+hilo+contexto, con IA), KPICard, ChartCard, BarRow, FilterBar, QuickFilter, MapView (estilizado, sin tiles), PDFPreview, TourOverlay, Hexes/HexMark, toggles (Theme/Currency/Language/Market/Reset).
- **mockApi**: latencia 200–600ms real; seeds ricos hotel (24 hab, comisión 6m, inbox IA, precio dinámico) e inmobiliaria (60 props, 40 contratos con 6 esquemas de ajuste, inbox+score, liquidaciones, portales, comparables).
- **Providers**: DemoProvider (mercado/moneda/idioma/modo/tour deep-link/reset) + I18nProvider (es/en/pt) + perfiles de mercado AR/UY/ES.
- **Regla cumplida**: ningún componente lee datos hardcodeados; todo via `mockApi`.

### Fase 2 — Pantallas que venden
- **Hotelería (`apps/hoteleria-v2`, port 3011)**: H1 home+buscador, H2 disponibilidad con tarifas inline, H4 checkout 3 pasos con upsell + impuestos, H7 dashboard con **widget de comisión OTA vs directo**, H9 inbox con IA.
- **Inmobiliaria (`apps/inmobiliaria-v2`, port 3021)**: I1 home+buscador+filtros rápidos, I2 resultados con mapa sincronizado, I3 ficha con WhatsApp (ID precargado) + sim UVA, I5 dashboard con **tiempo de respuesta + semáforo por agente**, I7 inbox con **calificación IA + score**, I9 contratos, I10 detalle + **simulador de ajuste en vivo** con fórmula y recibo con punitorios.

### Fase 3 — Tour guiado — **funcional**
- `TourOverlay` con spotlight sobre el elemento, stepper, número final, deep-link `?tour=hotel&step=3`.
- Guiones de 5 pasos por vertical (hotel: consulta→IA cotiza→reserva directa→upsell→comisión ahorrada; inmo: consulta sábado 23h→IA califica→agenda→tiempo de respuesta→ajustes).

## ▶️ Cómo probar
```bash
npm run dev:hoteleria-v2      # http://localhost:3011
npm run dev:inmobiliaria-v2   # http://localhost:3021
```
Botón **"Panel"** arriba a la derecha → dentro del panel, **"Ver recorrido guiado"**. Toggles de idioma/moneda/tema en el sitio y el panel. Botón reset en el panel.
Ambas apps **buildean OK** (`npm run build:hoteleria-v2` / `build:inmobiliaria-v2`).

### Fase 4 — profundidad (adelanto ya hecho)
- Hotel: **H11 tarifas + precio dinámico** (nominal vs real deflactada + recomendación inflación/demanda) y **H10 automatizaciones** — funcionales en el panel.
- Inmo: **I11 liquidación al propietario** (sobre lo cobrado + PDF) e **I8 difusión por portal** — funcionales.

## ⏳ Pendiente (Fase 4 — resto), marcado "Próximamente" en cada panel
- Hotel: H3 ficha, H5 confirmación, H6 pre-check-in, H8 tape chart.
- Inmo: I4 tasador público (comparables ya en seed), I6 pipeline, I12 portal propietario, I13 portal inquilino (seed listo).

## 📌 Fase 5 — i18n/mercados
- Scaffolding listo (I18nProvider + perfiles AR/UY/ES). Falta extraer strings de pantallas a diccionarios (hoy es-AR literal como base).

## ⚠️ Decisiones que conviene revisar
1. **CLAUDE.md** obliga "color por vertical / un tema por app". La identidad InnovaTech en el panel lo matiza — sugiero actualizar CLAUDE.md al consolidar. **No lo toqué** (protegido por convención).
2. **Apps v2 nuevas** conviven con las viejas. Cuando validemos paridad, se puede archivar/renombrar las originales.
3. Bundle ~700kB por Recharts (ok para demo; se puede code-split en Fase 4).

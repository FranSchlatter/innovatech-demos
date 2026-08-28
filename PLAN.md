# PLAN.md — InnovaTech Demo Kit (Hotelería + Inmobiliaria)

> Plan de acción ejecutable. Complementa `benchmark-competitivo` y `analisis-mercado-hoteleria-inmobiliaria.md`.
> **Alcance global:** todo es front-end de demostración. Sin backend, sin auth real, sin integraciones vivas. Datos mock, estado en memoria, latencia simulada.

## Decisiones tomadas (Fran, ago-2026)

| # | Decisión | Consecuencia |
|---|----------|--------------|
| 1 | **Público con marca de cliente; InnovaTech (navy/cyan/hex) en el panel** | Temas duales: `theme-client-*` (público) e `theme-innovatech` (gestión/tour/servicios) |
| 2 | **Kit nuevo + reconstruir las 2 demos encima** | Nace `packages/demo-kit`. Se crean `apps/hoteleria-v2` e `apps/inmobiliaria-v2`. Las apps viejas quedan intactas y ejecutables como referencia hasta paridad |
| 3 | **Salud/Gastro fuera de alcance** | El kit se diseña para poder absorberlas después, pero no se tocan |

## Decisiones autónomas (libre albedrío, Claude)

- **Gráficos:** Recharts. **Router (deep-link tour):** react-router-dom. **i18n:** provider propio liviano (JSON, zero-dep) con es-AR base; upgrade a i18next si hace falta.
- **Mapa:** componente estilizado propio (sin tiles remotos → sin internet ni tokens, respeta "sin env vars").
- **Fotos:** `picsum.photos/seed/...` (determinístico, sin assets pesados).
- **Apps v2 nuevas** en vez de refactor in-place, para no romper lo existente.

## Identidad InnovaTech (tokens)

- Navy base `#0A1628`, panel `#0F2035`, cyan `#66E0FF`, motivo hexagonal, tipografía **Montserrat**.
- Público hotelero: cálido/marca cliente. Público inmobiliaria: sobrio/marca cliente.
- Dark/light en ambos. CSS vars con prefijo `--dk-*` para no chocar con `shared-styles`.

## Arquitectura objetivo

```
packages/demo-kit/
  tokens/       kit.css (vars + fuentes), tailwind-preset.cjs
  primitives/   Button Input Select DatePicker Card Table Badge Modal Drawer Tabs EmptyState Skeleton Tooltip
  composites/   KPICard ChartCard FilterBar Inbox StatCard MapView PDFPreview CurrencyToggle LanguageToggle TourOverlay AppShell Hexes
  mockApi/      latency helper + hotel.js + realestate.js  (async, 200–600ms, loading real)
  providers/    DemoProvider (estado memoria + reset + tour flag + market) + I18nProvider
  i18n/         es-AR (base), en, pt-BR (scaffold)
  index.js      barrel
apps/hoteleria-v2/     sobre demo-kit
apps/inmobiliaria-v2/  sobre demo-kit
```

**Regla dura:** ningún componente lee datos hardcodeados; todo pasa por `mockApi`.

## Fases

- **Fase 0 — Auditoría:** `AUDIT.md` por app (hoteleria, inmobiliaria). Cruce §7/§8 en ya-está / parcial / no-existe. Sin tocar código. ✅ entregable.
- **Fase 1 — Kit compartido:** tokens, primitivas, compuestos, mockApi, providers, seeds (hotel 24 hab + 90 días; inmo 60 props + 40 contratos con 6 esquemas de ajuste). Aceptación: ambas demos levantan con shell compartido y nada lee fuera de mockApi.
- **Fase 2 — Las 9 que venden:** H1, H2, H4, H7, H9 → I1, I3, I5, I7, I9, I10. Responsive a 375px, datos ricos.
- **Fase 3 — Tour guiado:** overlay con hotspots, 1 guion por vertical (6–8 pasos con número al final), deep-link `?tour=hotel&step=3`. Aceptación: se entiende en <90s.
- **Fase 4 — Profundidad:** resto de §7/§8.
- **Fase 5 — i18n + perfiles de mercado en config:** cambiar AR→ES cambia moneda/formatos/portales/campos sin tocar componentes.

## Fuera de este plan (tracks separados)
- §10 Páginas de servicios (`innovatech.ar/hoteles`, `/inmobiliarias`): app de venta con demo embebida + calculadora de comisión.
- Migración de salud/gastronomía al kit.

## Riesgos
- `CLAUDE.md` obliga "color por vertical" — la identidad InnovaTech en el panel lo matiza. Actualizar CLAUDE.md al consolidar.
- Archivos protegidos (`shared-styles/*`, `vite.config.js`): el kit vive aparte, no se tocan.
- Recharts/router son deps nuevas: se agregan solo a las apps v2.

## Estado de ejecución (autónomo)
Ver `AUDIT.md` en cada app y el árbol de `packages/demo-kit`. Progreso registrado en cada commit local (no se commitea sin OK de Fran).

# InnovaTech Demos - Monorepo

Monorepo con 3 landing pages demo (hoteleria, salud, gastronomia), cada una con panel admin completo.
Owner: Francisco Schlatter | Santa Fe, Argentina

## Stack

React 18 + Vite 5.4 + Tailwind CSS 3.4 + Framer Motion 11 + Lucide React + npm Workspaces

## Apps

| App | Puerto | Color principal |
|-----|--------|----------------|
| hoteleria | 3001 | Brown #8B7355 / Bronze #A0826D |
| salud | 3002 | Teal #20B2AA / Cyan #008B8B |
| gastronomia | 3003 | Orange #E67E22 / Red #C0392B |

## Reglas criticas

### Idioma
- Codigo, variables, UI, commits: INGLES
- Conversacion con el usuario: ESPANOL

### Dark/Light mode obligatorio
- CADA componente DEBE soportar ambos modos
- Usar CSS variables o theme context
- Detectar preferencia del sistema, permitir toggle manual, persistir en localStorage
- Colores especificos por app (ver tabla de apps)

### Temas y colores
- NUNCA hardcodear colores hex
- Usar CSS variables: `var(--color-primary)`, `var(--color-bg)`
- O clases Tailwind: `bg-primary`, `text-accent`, `bg-surface`
- Config centralizada en `packages/shared-styles/` (theme.json + global.css + tailwind.config.js)

### Datos
- Todo hardcoded, NO hay backend/APIs
- Datos compartidos en `packages/shared-data/*.json`
- Datos especificos de app en `apps/[app]/src/data/`
- Filtrado client-side con Array.filter()
- localStorage para carrito y tema

### Responsive
- Mobile-first SIEMPRE: base (320px) -> md: (768px) -> lg: (1024px)
- Usar `min-width`, NUNCA `max-width`

### Animaciones
- Framer Motion para todo, NO CSS animations

## Estructura del monorepo

```
apps/
  hoteleria/src/    # Landing + Admin (port 3001)
  salud/src/        # Landing + Admin (port 3002)
  gastronomia/src/  # Landing + Admin (port 3003)
    components/     # UI components (incluye admin/)
    context/        # React Context
    data/           # Datos especificos de la app
    hooks/          # Hooks custom (useAdminData, etc.)
    pages/          # Page layouts

packages/
  shared-ui/        # Componentes reutilizables (Navbar, Footer, Hero, ContactSection)
  shared-data/      # JSON data compartido (rooms, doctors, dishes, reviews, etc.)
  shared-hooks/     # useCart (carrito + localStorage), useDarkMode (tema + persistencia)
  shared-styles/    # global.css, tailwind.config.js, theme.json
```

### Imports de shared packages
```javascript
import Navbar from '../../packages/shared-ui/components/Navbar'
import { useCart } from '../../packages/shared-hooks/useCart'
import { useDarkMode } from '../../packages/shared-hooks/useDarkMode'
import data from '../../../packages/shared-data/rooms.json'
```

## Archivos protegidos (pedir permiso)

- `packages/shared-styles/theme.json` - tokens de diseno
- `packages/shared-styles/global.css` - CSS variables
- `packages/shared-styles/tailwind.config.js` - config Tailwind
- `apps/*/vite.config.js` - config de build

## Convenciones

- Componentes: PascalCase (`HeroSection.jsx`)
- Hooks: camelCase con `use` prefix (`useCart`)
- Variables: camelCase
- Import order: libs externas -> shared packages -> componentes locales -> data -> styles
- Un componente por archivo
- viewMode pattern en App.jsx para cambiar entre landing/admin/portal

## Comandos

```bash
npm run dev:hoteleria    # port 3001
npm run dev:salud        # port 3002
npm run dev:gastronomia  # port 3003
npm run build:hoteleria
npm run build:salud
npm run build:gastronomia
```

## Testing (obligatorio antes de entregar)

Correr `npm run dev:[app]`, verificar: sin errores consola, responsive, dark/light mode, animaciones.

## Git

- PREGUNTAR antes de commit/push
- Conventional commits en ingles: `feat:`, `fix:`, `refactor:`
- Branch: main
- Deploy: automatico a Vercel via GitHub

## Deploy (Vercel)

3 proyectos independientes desde el mismo repo:
- hoteleria: build `npm run build:hoteleria`, output `apps/hoteleria/dist`
- salud: build `npm run build:salud`, output `apps/salud/dist`
- gastronomia: build `npm run build:gastronomia`, output `apps/gastronomia/dist`

No requiere env vars (frontend-only).

## Estado del proyecto

Admin panels: 100% completados en las 3 apps.

### Pendiente (lado cliente, por prioridad)

1. **Gastronomia - Online Ordering**: navegador de menu, carrito, checkout, confirmacion. Componentes en `components/client/ordering/`
2. **Hoteleria - Guest Portal**: ver reserva, solicitar servicios, factura, modificar/cancelar. Componentes en `components/client/portal/`
3. **Salud - Patient Portal**: citas proximas, historial medico, lab results, prescripciones. Componentes en `components/client/portal/`
4. **Hoteleria - Hotel Services Request**: solicitar servicios desde landing sin login
5. **Salud - Pre-Check-in Form**: formulario pre-cita (peso, alergias, medicamentos)
6. **Hoteleria - Excursions Booking**: listado y reserva de excursiones
7. **Gastronomia - Enhanced Analytics**: graficos de ventas, top platos, heatmap

Todos los portales usan login simulado (solo UI). Delays de 300-800ms para realismo. Persistencia en localStorage.

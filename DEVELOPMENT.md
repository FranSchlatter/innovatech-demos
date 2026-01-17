# InnovaTech Demos — Monorepo Guide

## 🏗️ Estructura Completa

```
innovatech-demos/
├── apps/
│   ├── hoteleria/          # Hotel booking demo (port 3001)
│   ├── salud/              # Healthcare appointments (port 3002)
│   └── gastronomia/        # Restaurant ordering (port 3003)
│
├── packages/
│   ├── shared-ui/          # Reusable components (Navbar, Footer, Hero, Contact)
│   ├── shared-data/        # Hardcoded JSON data (rooms, doctors, dishes)
│   ├── shared-hooks/       # useCart, useDarkMode
│   └── shared-styles/      # theme.json, tailwind.config.js, global.css
│
└── vercel.json             # Vercel deployment config
```

## 🚀 Quick Start Local

```bash
# 1. Install dependencies
npm install

# 2. Start individual app
npm run dev:hoteleria    # http://localhost:3001
npm run dev:salud        # http://localhost:3002
npm run dev:gastronomia  # http://localhost:3003

# 3. Build for production
npm run build:hoteleria
npm run build:salud
npm run build:gastronomia
```

## 📦 Features por App

### Hotelería (apps/hoteleria)
- ✓ Room showcase with images & amenities
- ✓ Booking form (check-in/out, guests)
- ✓ Dynamic price calculation
- ✓ Guest information collection

**Data source**: `packages/shared-data/rooms.json`

### Salud (apps/salud)
- ✓ Doctor listing with specialties
- ✓ Appointment scheduling (date/time picker)
- ✓ Available time slots per doctor
- ✓ Appointment confirmation form

**Data source**: `packages/shared-data/doctors.json`

### Gastronomía (apps/gastronomia)
- ✓ Menu with categories (Platos, Ensaladas, Pizzas, Pastas, Postres)
- ✓ Category filter
- ✓ Add to cart (localStorage persistence)
- ✓ Cart drawer with summary
- ✓ Order confirmation flow

**Data source**: `packages/shared-data/dishes.json`

---

## 🔗 Shared Packages

### `shared-ui/`
Reusable React components:
- **Navbar**: Brand, navigation links, theme toggle
- **Footer**: Social links, menu sections, copyright
- **Hero**: Title, subtitle, background image, CTA button
- **ContactSection**: Email form with contact info cards

All support theming via CSS variables.

### `shared-hooks/`
- **useCart()**: Add/remove items, localStorage persistence
- **useDarkMode()**: Theme toggle with localStorage

### `shared-styles/`
- **theme.json**: Centralized color/spacing config
- **global.css**: CSS variables, dark mode, utility classes
- **tailwind.config.js**: Tailwind setup with CSS vars

---

## 🎨 Styling & Dark Mode

All apps use the same design system:

```javascript
// Auto-applies from global.css
:root {
  --color-primary: #0b74ff;
  --color-bg: #ffffff;
  --color-surface: #f6f8fb;
  // ... more colors
}

// Dark mode toggle
[data-theme="dark"] {
  --color-primary: #4da3ff;
  --color-bg: #071022;
  // ... inverted colors
}
```

To customize globally:
1. Edit `packages/shared-styles/theme.json`
2. Update CSS variables in `packages/shared-styles/global.css`
3. All apps auto-inherit changes

---

## 🌐 Deploy to Vercel

### Option 1: Individual Apps
```bash
# Deploy hoteleria
cd apps/hoteleria
vercel deploy
# → hoteleria-demo.vercel.app

# Deploy salud
cd apps/salud
vercel deploy
# → salud-demo.vercel.app
```

### Option 2: Monorepo (Recommended)
Connect this repo to Vercel and create 3 projects:

**Project 1: Hotelería**
- Root: `.`
- Build Command: `npm run build:hoteleria`
- Output Directory: `apps/hoteleria/dist`
- Env: (none needed)

**Project 2: Salud**
- Root: `.`
- Build Command: `npm run build:salud`
- Output Directory: `apps/salud/dist`
- Env: (none needed)

**Project 3: Gastronomía**
- Root: `.`
- Build Command: `npm run build:gastronomia`
- Output Directory: `apps/gastronomia/dist`
- Env: (none needed)

---

## 📝 Conventions

### Commits
- `feat: add room filtering to hoteleria demo`
- `fix: resolve dark mode toggle persistence`
- Always push directly to `master` (no feature branches)

### Data
- All data is **hardcoded JSON** in `packages/shared-data/`
- No API calls, no database
- Filtering/searching is done client-side with `Array.filter()`

### Components
- Functional, hooks-based
- No TypeScript (intentional)
- Animations via Framer Motion
- Icons via Lucide React (string → dynamic import)

---

## 🛠️ Adding a New Service Demo

1. **Create app folder**: `mkdir apps/new-service`
2. **Copy structure**: Copy from `apps/hoteleria/` or `apps/salud/`
3. **Add data**: Create `packages/shared-data/new-service.json`
4. **Update npm scripts** in root `package.json`:
   ```json
   "dev:new-service": "cd apps/new-service && npm run dev",
   "build:new-service": "cd apps/new-service && npm run build"
   ```
5. **Deploy**: Use same Vercel monorepo setup

---

## 🎯 Key Files Reference

| Path | Purpose |
|------|---------|
| `packages/shared-ui/components/` | Navbar, Footer, Hero, ContactSection |
| `packages/shared-hooks/useCart.js` | Shopping cart with localStorage |
| `packages/shared-hooks/useDarkMode.js` | Dark/light theme toggle |
| `packages/shared-data/*.json` | Product/service data (rooms, doctors, dishes) |
| `packages/shared-styles/global.css` | Theme variables and utilities |
| `packages/shared-styles/tailwind.config.js` | Tailwind configuration |
| `apps/*/vite.config.js` | Per-app build config |

---

## 🔐 Environment Variables

**None needed!** This is a frontend-only monorepo. All data is hardcoded JSON.

If you add EmailJS or analytics later:
```bash
# .env (in each app)
VITE_EMAILJS_KEY=xxx
VITE_ANALYTICS_ID=xxx
```

---

## 📋 Common Tasks

### Update global colors
Edit `packages/shared-styles/theme.json` and `packages/shared-styles/global.css`

### Add a new component
1. Create in `packages/shared-ui/components/MyComponent.jsx`
2. Export in `packages/shared-ui/package.json` exports
3. Import in app: `import MyComponent from '../../packages/shared-ui/components/MyComponent'`

### Change Tailwind breakpoints
Edit `packages/shared-styles/tailwind.config.js` (all apps inherit)

### Customize form styles
Edit `.card`, `.btn-primary`, `.btn-secondary` in `packages/shared-styles/global.css`

---

**Last Updated**: January 2026  
**Status**: Production-ready  
**Next Steps**: Deploy to Vercel and link from innovatech.ar

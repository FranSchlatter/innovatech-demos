# InnovaTech — Copilot Instructions (Demos Monorepo)

**Project**: Service demo landing pages monorepo for InnovaTech sales funnel  
**Tech Stack**: React 18, Vite, Tailwind CSS, Framer Motion  
**Goal**: Build one-page marketing sites per service niche (hotelería, salud, gastronomía, etc.)

---

## 🏗️ Architecture Overview

### Monorepo Structure
```
apps/
├── hoteleria/    # Hotel booking demo
├── salud/        # Healthcare appointments  
└── gastronomia/  # Restaurant ordering (+ cart)

packages/
├── shared-ui/    # Navbar, Footer, Hero, ContactSection
├── shared-data/  # Hardcoded JSON (rooms.json, doctors.json, dishes.json)
├── shared-hooks/ # useCart, useDarkMode
└── shared-styles/# theme.json, tailwind.config.js, global.css
```

### Each App Layout
- Hero section (title, subtitle, CTA)
- Service-specific showcase (rooms, doctors, menu items)
- Interactive forms (booking, appointment, cart)
- Contact section
- Footer

### Data Pattern
All data is **hardcoded JSON only**:
```js
// packages/shared-data/rooms.json
[
  {
    id: 1,
    name: "Habitación Estándar",
    price: 150,
    capacity: 2,
    amenities: ["WiFi", "AC", "TV"],
    image: "https://unsplash.com/..."
  }
  // ...
]
```

---

## 🎨 Design System

### CSS Variables (Theme)
All colors/spacing defined in `packages/shared-styles/`:
- **Light mode** (default): Primary blue, white bg
- **Dark mode** (toggle): Light blue, dark bg
- **Accent colors**: Cyan for highlights

### Dark Mode Toggle
```jsx
const { isDark, toggleTheme } = useDarkMode()
// Saves to localStorage, applies [data-theme="dark"] to <html>
```

### Tailwind Setup
- All colors use CSS variables: `text-primary`, `bg-surface`, etc.
- No hardcoded hex colors in JSX
- Responsive utilities: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Custom utilities: `.card`, `.btn-primary`, `.btn-secondary`

---

## 🔑 Key Patterns

### 1. Shared Components
```jsx
import Navbar from '../../packages/shared-ui/components/Navbar'
import Footer from '../../packages/shared-ui/components/Footer'
import Hero from '../../packages/shared-ui/components/Hero'

<Navbar brand="Hotel Name" isDark={isDark} toggleTheme={toggleTheme} links={navLinks} />
<Hero title="..." subtitle="..." image="..." cta={{ label: "...", onClick: () => {} }} />
<Footer brand="Hotel Name" />
```

### 2. Shopping Cart (localStorage)
```jsx
import { useCart } from '../../packages/shared-hooks/useCart'

const { cart, addItem, removeItem, clearCart, total } = useCart()
addItem({ id: 1, name: "Pizza", price: 14, quantity: 1 })
// → Auto-saved to localStorage
```

### 3. Dark Mode Hook
```jsx
const { isDark, toggleTheme } = useDarkMode()
// Persists to localStorage, toggles [data-theme="dark"] on root
```

### 4. Animations (Framer Motion)
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
>
```

---

## 🚀 Developer Workflows

### Running Locally
```bash
npm install                # Once at root
npm run dev:hoteleria     # App runs on 3001
npm run dev:salud         # App runs on 3002
npm run dev:gastronomia   # App runs on 3003
```

### Building for Production
```bash
npm run build:hoteleria
npm run build:salud
npm run build:gastronomia
# Output: apps/{service}/dist/
```

### Adding a New Service Demo
1. Create `apps/new-service/` (copy from hoteleria)
2. Add data file `packages/shared-data/new-service.json`
3. Update root `package.json` with new scripts
4. Update `vercel.json` deployment config
5. Deploy to Vercel independently

### Customizing Theme Globally
```js
// packages/shared-styles/theme.json
{
  "palette": {
    "primary": "#0B74FF",     // Change all blue accents
    "background": "#FFFFFF"   // Change all bg colors
  }
}
```
All apps auto-inherit. No code changes needed.

---

## ⚠️ Common Patterns & Gotchas

1. **Import from shared packages**: Always use relative paths:
   ```jsx
   import Navbar from '../../packages/shared-ui/components/Navbar'
   import { useCart } from '../../packages/shared-hooks/useCart'
   import data from '../../../packages/shared-data/rooms.json'
   ```

2. **Data is hardcoded**: Filter/search is client-side with Array.filter()
   ```jsx
   const filtered = dishes.filter(d => d.category === 'Platos')
   ```

3. **No TypeScript**: Use JSDoc for complex types:
   ```js
   /** @type {Object[]} Array of room objects */
   const rooms = [...]
   ```

4. **Framer Motion everywhere**: All visible elements should animate on scroll/load

5. **Mobile-first**: Start with mobile styles, add md:/lg: breakpoints

6. **Dark mode test**: Always test with `data-theme="dark"` in DevTools

---

## 📊 Service Demos Overview

### Hotelería (apps/hoteleria)
- Room showcase with images, amenities, capacity
- Date range picker (check-in/out)
- Dynamic price calculation (price × nights)
- Guest info form

**Flow**: View rooms → Select dates → Fill form → Confirm

### Salud (apps/salud)
- Doctor listing with specialty, price, availability
- Available time slots per doctor
- Date + time picker
- Appointment reason textarea
- Confirmation with doctor details

**Flow**: View doctors → Select date/time → Fill form → Confirm

### Gastronomía (apps/gastronomia)
- Menu with category filter
- Add to cart buttons
- Cart drawer (slide-out panel)
- Cart summary (count, total)
- Order confirmation

**Flow**: Browse menu → Filter by category → Add items → View cart → Checkout

---

## 🔗 Integration Points

### Forms (Contact Section)
Currently just collects data, logs to console.
To integrate:
- **EmailJS**: `npm install @emailjs/browser` + add template
- **Zapier**: POST form data to webhook
- **Backend API**: Create `/api/contact` endpoint

### Analytics
Currently none. To add:
- **Google Analytics**: Add `<script>` in `index.html`
- **Vercel Analytics**: Auto-enabled with Vercel
- **Custom**: Track events with `window.gtag` or similar

---

## 📝 Code Style & Conventions

- **Commits**: `feat:` or `fix:` only (no chore/docs/refactor)
  - `feat: add room filtering to hoteleria`
  - `fix: resolve dark mode toggle bug`
- **Branches**: Always push to `master` (no feature branches)
- **Testing**: Manual QA only (no unit/e2e tests)
- **Props**: Prop drilling acceptable (no Context API needed for these demos)
- **Components**: Functional, hooks-based, no class components

---

## 🌐 Deployment (Vercel)

### Per-App Deployment
```bash
vercel deploy apps/hoteleria
# → hoteleria.vercel.app

vercel deploy apps/salud  
# → salud.vercel.app

vercel deploy apps/gastronomia
# → gastronomia.vercel.app
```

### Monorepo Deployment (Recommended)
Connect repo to Vercel, create 3 projects:

| Project | Build Command | Output Dir | Domain |
|---------|---------------|------------|--------|
| Hotelería | `npm run build:hoteleria` | `apps/hoteleria/dist` | hoteleria.vercel.app |
| Salud | `npm run build:salud` | `apps/salud/dist` | salud.vercel.app |
| Gastronomía | `npm run build:gastronomia` | `apps/gastronomia/dist` | gastronomia.vercel.app |

No ENV vars needed (frontend-only).

---

## 🔗 Key Files Reference

| File | Purpose |
|------|---------|
| `packages/shared-ui/components/*.jsx` | Reusable UI (Navbar, Footer, Hero, Contact) |
| `packages/shared-hooks/useCart.js` | Shopping cart state + localStorage |
| `packages/shared-hooks/useDarkMode.js` | Theme toggle + persistence |
| `packages/shared-data/*.json` | Hardcoded service data |
| `packages/shared-styles/theme.json` | Centralized color/spacing config |
| `packages/shared-styles/global.css` | CSS variables + dark mode + utilities |
| `apps/*/vite.config.js` | Per-app build config |
| `vercel.json` | Vercel deployment routing |

---

## ❓ Before Starting a Task

Ask yourself:
1. **Which app?** hoteleria | salud | gastronomia
2. **Is it a shared component?** → Update in `packages/shared-ui/`
3. **Is it app-specific?** → Update in `apps/{service}/`
4. **Need new data?** → Add to `packages/shared-data/{service}.json`
5. **Styling needed?** → Use CSS variables, not hardcoded colors
6. **Mobile responsive?** → Test at 375px (mobile), 768px (tablet), 1280px (desktop)

---

**Last Updated**: January 2026  
**Status**: Production-ready monorepo with 3 complete demos  
**Next**: Deploy to Vercel and link from innovatech.ar


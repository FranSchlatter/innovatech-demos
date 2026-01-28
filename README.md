# InnovaTech Demos — Monorepo

Premium, fully-responsive demo applications showcasing hotel booking, healthcare management, and restaurant ordering systems. Built with modern React stack, featuring complete admin panels and customer portals.

---

## Live Demos

| App | Description | Port |
|-----|-------------|------|
| **Hotelería** | Hotel Booking System | `localhost:3001` |
| **Salud** | Healthcare Platform | `localhost:3002` |
| **Gastronomía** | Restaurant Ordering | `localhost:3003` |

---

## Applications

### Hotelería (Hotel Booking)

Complete hotel management system with guest and admin experiences.

**Customer Features:**
- Hero carousel with stunning imagery
- 15+ room categories (Economy to Presidential)
- Smart filtering by type and price
- Multi-step booking flow
- Guest reviews and testimonials

**Guest Portal:**
- Real-time stay information
- Room service ordering
- Housekeeping requests
- Spa & amenity reservations
- Request tracking
- Help center with FAQ

**Admin Panel:**
- Dashboard with occupancy metrics
- Reservation management
- Room inventory control
- Guest check-in/out
- Revenue analytics

---

### Salud (Healthcare Platform)

Full telemedicine and patient management system.

**Customer Features:**
- 8 specialist doctors across specialties
- Doctor profiles with ratings and reviews
- Appointment scheduling with time slots
- Pre-check-in forms
- Insurance information

**Patient Portal:**
- Health dashboard with vitals
- Appointment management
- Medical records access
- Lab results viewer
- Prescription management with refill requests
- Billing and payments
- Secure messaging with care team

**Admin Panel:**
- Appointment calendar
- Patient records management
- Doctor scheduling
- Medical inventory
- Analytics dashboard

---

### Gastronomía (Restaurant Ordering)

Complete restaurant ordering and management system.

**Customer Features:**
- 12+ menu items across categories
- Dish customization modal (additions, removals, special instructions)
- Floating cart with item consolidation
- Real-time order updates
- Customer reviews

**Online Ordering System:**
- Add to cart from menu grid
- Customize dishes with extras
- Special dietary instructions
- Order summary with totals
- Toast notifications

**Admin Panel:**
- Order management queue
- Menu item CRUD
- Table management
- Sales analytics
- Inventory tracking

---

## Quick Start

```bash
# Install dependencies
npm install

# Run individual apps
npm run dev:hoteleria    # Port 3001
npm run dev:salud        # Port 3002
npm run dev:gastronomia  # Port 3003

# Build for production
npm run build:hoteleria
npm run build:salud
npm run build:gastronomia
```

---

## Project Structure

```
ProyectosDemo/
├── apps/
│   ├── hoteleria/
│   │   └── src/
│   │       ├── components/
│   │       │   ├── admin/           # Admin panel components
│   │       │   ├── GuestPortal.jsx  # Guest portal
│   │       │   └── ...
│   │       └── App.jsx
│   ├── salud/
│   │   └── src/
│   │       ├── components/
│   │       │   ├── admin/           # Admin panel components
│   │       │   ├── PatientPortal.jsx # Patient portal
│   │       │   └── ...
│   │       └── App.jsx
│   └── gastronomia/
│       └── src/
│           ├── components/
│           │   ├── admin/           # Admin panel components
│           │   ├── DishCustomizeModal.jsx
│           │   ├── FloatingCartButton.jsx
│           │   └── ...
│           ├── context/
│           │   └── ToastContext.jsx
│           └── App.jsx
├── packages/
│   ├── shared-ui/         # Navbar, Footer, Hero, ContactSection
│   ├── shared-data/       # Mock JSON data
│   ├── shared-hooks/      # useCart, useDarkMode
│   └── shared-styles/     # Tailwind config, CSS variables
└── package.json
```

---

## Key Features

| Feature | Hotelería | Salud | Gastronomía |
|---------|-----------|-------|-------------|
| Landing Page | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ |
| Customer Portal | ✅ Guest Portal | ✅ Patient Portal | ✅ Online Ordering |
| Admin Panel | ✅ | ✅ | ✅ |
| Cart System | — | — | ✅ |
| Booking/Appointments | ✅ | ✅ | — |
| Service Requests | ✅ | ✅ | — |
| Messaging | ✅ | ✅ | — |
| Billing | ✅ | ✅ | ✅ |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI Framework |
| Vite | 5.4 | Build Tool |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 11 | Animations |
| Lucide React | 0.363 | Icons |
| npm Workspaces | — | Monorepo |

---

## Design System

### Theme Variables

```css
:root {
  --color-primary: #1a1a2e;
  --color-accent: #d4af37;
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-text: #1a1a2e;
  --color-muted: #6c757d;
}

[data-theme="dark"] {
  --color-bg: #0f0f1a;
  --color-surface: #1a1a2e;
  --color-text: #ffffff;
}
```

### Responsive Breakpoints

- Mobile: 375px (default)
- Tablet: 768px (`md:`)
- Desktop: 1024px (`lg:`)
- Wide: 1280px (`xl:`)

---

## Deployment (Vercel)

### Option 1: Separate Projects

Create 3 Vercel projects, each pointing to the same repo:

**Project: hoteleria-demo**
```
Root Directory: apps/hoteleria
Build Command: npm run build
Output Directory: dist
```

**Project: salud-demo**
```
Root Directory: apps/salud
Build Command: npm run build
Output Directory: dist
```

**Project: gastronomia-demo**
```
Root Directory: apps/gastronomia
Build Command: npm run build
Output Directory: dist
```

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy each app
cd apps/hoteleria && vercel --prod
cd apps/salud && vercel --prod
cd apps/gastronomia && vercel --prod
```

### Important Notes

- No environment variables needed (frontend-only)
- Each app deploys independently
- Shared packages are bundled at build time

---

## Screenshots

### Hotelería
- Landing page with room showcase
- Guest Portal with stay management
- Admin dashboard

### Salud
- Doctor listing and appointments
- Patient Portal with health records
- Admin patient management

### Gastronomía
- Menu with dish customization
- Floating cart system
- Admin order management

---

## Development

### Adding Components

```bash
# Shared component (all apps)
packages/shared-ui/components/NewComponent.jsx

# App-specific component
apps/{app}/src/components/NewComponent.jsx
```

### Import Aliases

```javascript
// Shared packages
import Navbar from '@shared-ui/components/Navbar'
import { useCart } from '@shared-hooks/useCart'
import dishes from '@shared-data/dishes.json'

// App components
import GuestPortal from './components/GuestPortal'
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v0.03 | 2024-01 | Guest Portal, Patient Portal, Online Ordering System |
| v0.02 | 2024-01 | Admin panels for all apps |
| v0.01 | 2024-01 | Initial release with landing pages |

---

## License

Private — InnovaTech Solutions

# InnovaTech Demos — Monorepo

🏨 **Professional Service Demo Landing Pages** for InnovaTech Sales Funnel

Premium, fully-responsive demo applications showcasing hotel booking, healthcare appointments, and restaurant ordering. Built with modern tech stack, optimized for Vercel deployment.

## 📦 Applications

### 🏨 **Hotelería** (Hotel Booking)
Full-featured hotel reservation system with:
- **Hero Carousel** - Stunning image carousel with auto-play
- **15+ Room Categories** - Economy to Presidential suites
- **Smart Filtering** - Filter by type, price range
- **Amenities Showcase** - 10 premium facilities
- **Tours & Experiences** - 8 curated experiences with ratings
- **Guest Reviews** - Social proof with 6+ testimonials (4.8★ avg)
- **Professional Booking Form** - Multi-step reservation flow

**Live on**: `http://localhost:3004` (dev)

### 🏥 **Salud** (Healthcare Appointments)
Complete telemedicine appointment system featuring:
- **8 Specialist Doctors** - Cardiología, Dermatología, Pediatría, Psicología, etc.
- **Specialty Filtering** - Browse by medical field
- **Doctor Profiles** - Ratings, reviews, languages, insurance accepted
- **Appointment Scheduling** - Real-time slot selection
- **Patient Reviews** - Verified testimonials with ratings
- **Professional Landing** - Modern healthcare UI

**Live on**: `http://localhost:3002` (dev) or `http://localhost:3005` (available)

### 🍽️ **Gastronomía** (Restaurant Ordering)
Full restaurant management & ordering demo:
- **12 Menu Items** - Appetizers, mains, pastas, pizzas, desserts
- **Category Filtering** - Browse by dish type
- **Smart Cart System** - localStorage persistence
- **Ratings & Reviews** - Each dish rated by customers
- **Guest Testimonials** - 6 customer reviews (4.8★ avg)
- **Responsive Menu** - Beautiful card-based grid

**Live on**: `http://localhost:3003` (dev)

## 🚀 Quick Start

```bash
# Install all dependencies
npm install

# Run individual apps
npm run dev:hoteleria    # Port 3001 (or next available)
npm run dev:salud        # Port 3002 (or next available)
npm run dev:gastronomia  # Port 3003 (or next available)

# Build for production
npm run build:hoteleria
npm run build:salud
npm run build:gastronomia
```

## 📁 Monorepo Structure

```
ProyectosDemo/
├── apps/
│   ├── hoteleria/          # Hotel booking Vite app
│   │   ├── src/
│   │   │   ├── components/ # HeroCarousel, AmenitiesSection, ToursSection, ReviewsSection
│   │   │   ├── pages/      # RoomsList, BookingForm
│   │   │   └── App.jsx
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── salud/              # Healthcare appointments Vite app
│   │   ├── src/
│   │   │   ├── components/ # DoctorsGrid, TestimonialsHealthSection
│   │   │   ├── pages/      # AppointmentForm
│   │   │   └── App.jsx
│   │   ├── package.json
│   │   └── vite.config.js
│   └── gastronomia/        # Restaurant ordering Vite app
│       ├── src/
│       │   ├── components/ # MenuGrid, ReviewsGastroSection
│       │   ├── pages/      # CartDrawer
│       │   └── App.jsx
│       ├── package.json
│       └── vite.config.js
├── packages/
│   ├── shared-ui/          # Reusable components (Navbar, Footer, Hero, ContactSection)
│   │   └── components/
│   ├── shared-data/        # Hardcoded mock data
│   │   ├── rooms.json         (15 hotel rooms)
│   │   ├── doctors.json       (8 medical doctors)
│   │   ├── dishes.json        (12 restaurant items)
│   │   ├── amenities.json     (10 hotel amenities)
│   │   ├── tours.json         (8 experiences/tours)
│   │   └── reviews.json       (customer testimonials)
│   ├── shared-hooks/       # Reusable hooks (useCart, useDarkMode)
│   └── shared-styles/      # Global CSS, Tailwind config, theme.json
└── package.json            # Workspace config
```

## 🎯 Key Features Across All Apps

✅ **Dark Mode** - Persisted theme toggle via localStorage  
✅ **Responsive Design** - Mobile-first (375px → 1280px)  
✅ **Framer Motion** - Smooth animations on scroll/hover  
✅ **Tailwind CSS** - Utility-first with CSS variables  
✅ **Zero API Calls** - All data hardcoded JSON (no backend needed)  
✅ **Client-side Filtering** - Smart search & category filtering  
✅ **localStorage Persistence** - Cart, theme preferences saved  
✅ **Verified Reviews** - Social proof with star ratings  
✅ **Professional UI** - 5-star hotel aesthetic throughout

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18.3** | UI Framework |
| **Vite 5.4** | Fast build tool & dev server |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Framer Motion 11** | Animations |
| **Lucide React 0.363** | Icon system |
| **npm Workspaces** | Monorepo management |

## 📊 Data Statistics

| App | Items | Categories | Testimonials | Avg Rating |
|---|---|---|---|---|
| **Hotelería** | 15 rooms | 6 types | 6 reviews | 4.8★ |
| **Salud** | 8 doctors | 8 specialties | 6 reviews | 4.8★ |
| **Gastronomía** | 12 dishes | 6 categories | 6 reviews | 4.8★ |

## 🎨 Design System

### Theme Configuration
All colors and spacing controlled via `packages/shared-styles/theme.json`:

```json
{
  "palette": {
    "primary": "#0B74FF",
    "accent": "#00D4FF",
    "background": "#FFFFFF",
    "surface": "#F5F5F7"
  }
}
```

### Dark Mode
- Automatically applies CSS variables for dark palette
- Toggle persists to localStorage
- Respects system preference on first load

### Responsive Breakpoints
- Mobile: 375px
- Tablet: 768px (md:)
- Desktop: 1280px (lg:)

## 🚀 Deployment (Vercel)

Each app deploys independently:

```bash
# Connect repo to Vercel, then:
vercel deploy apps/hoteleria    # → hoteleria-demo.vercel.app
vercel deploy apps/salud        # → salud-demo.vercel.app
vercel deploy apps/gastronomia  # → gastronomia-demo.vercel.app
```

**No ENV variables needed** (frontend-only, hardcoded data).

## 📝 Development Workflow

### Adding a New Feature
1. Create component in `apps/{app}/src/components/`
2. Use `@shared-*` aliases for imports
3. Run `npm run dev:{app}` to test locally
4. Commit: `feat: description`
5. Push to master (automatic Vercel deploy)

### Customizing Global Theme
Edit `packages/shared-styles/theme.json` → all apps auto-update

### Adding More Mock Data
Update `packages/shared-data/{app}.json` → immediate reflection in UI

## 📄 Git Workflow

- **Branches**: Direct commits to `master` only
- **Commit Format**: `feat: ...` or `fix: ...` only
- **Releases**: Manual semantic versioning (v0.01, v0.02, etc)

Current version: **v0.02** (Professional demos launched)

### Salud
- Doctor/service listing
- Appointment scheduling
- Date/time picker
- Confirmation flow

### Gastronomía  
- Menu browsing with categories
- Shopping cart (localStorage)
- Order confirmation
- Table reservation

## 🔗 Deploy

Each app deploys independently to Vercel:
- `vercel deploy apps/hoteleria`
- `vercel deploy apps/salud`
- `vercel deploy apps/gastronomia`

Or setup monorepo in Vercel dashboard with:
- Root: `.`
- Build command: `npm run build:SERVICE_NAME`
- Output: `apps/SERVICE_NAME/dist`

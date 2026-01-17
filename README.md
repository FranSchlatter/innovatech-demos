# InnovaTech Demos — Monorepo

Production-ready service demo landing pages for InnovaTech sales funnel.

## 📦 Apps

- **hoteleria** - Hotel & tourism booking demo
- **salud** - Healthcare appointment system demo  
- **gastronomia** - Restaurant ordering & management demo

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start individual app
npm run dev:hoteleria
npm run dev:salud
npm run dev:gastronomia

# Build all
npm run build:hoteleria
npm run build:salud
npm run build:gastronomia
```

## 📁 Structure

```
.
├── apps/
│   ├── hoteleria/    (Vite app - booking demo)
│   ├── salud/        (Vite app - appointment demo)
│   └── gastronomia/  (Vite app - restaurant demo)
├── packages/
│   ├── shared-ui/    (Reusable components)
│   ├── shared-data/  (Hardcoded JSON data)
│   ├── shared-hooks/ (Custom hooks)
│   └── shared-styles/ (Theme & tailwind config)
└── README.md
```

## 🎯 Each App Features

### Hotelería
- Room showcase with filters
- Booking calendar
- Room availability matrix
- Guest info form

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

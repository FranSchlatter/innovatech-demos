# InnovaTech Hospital - Healthcare Demo App

## Overview
A modern, professional healthcare application built with React 18, Vite, Tailwind CSS, and Framer Motion. This demo showcases an advanced medical facility with specialty booking, appointment scheduling, and comprehensive service information.

## 🎨 Design System
- **Color Scheme**: Professional teal/blue-green (#0B7377 accent, #0F3F4C primary)
- **Theme**: Dark and light modes with CSS variables
- **Typography**: Modern sans-serif with structured hierarchy
- **Responsive**: Mobile-first design (375px, 768px, 1280px breakpoints)

## 📱 Features

### Core Sections
1. **Hero Section** - Impactful entrance with trust metrics
2. **About Section** - Hospital mission, certifications, and key features
3. **Specialties Grid** - 20 medical specialties with detail pages
4. **Specialty Detail Page** - In-depth info on each specialty with associated doctors
5. **Services Section** - 20 diagnostic and therapeutic services
6. **Locations Section** - 4 hospital locations with hours and facilities
7. **Emergency Section** - Prominent 24/7 emergency hotline
8. **Doctors Directory** - 12 board-certified specialists with bios
9. **Appointment Booking** - Full-featured form with date/time selection
10. **Testimonials** - Patient reviews and social proof
11. **Contact Section** - Multi-channel communication

### Data Structure
- **Specialties**: 20 medical specialties (Cardiology, Dermatology, etc.)
- **Doctors**: 12 specialists distributed across specialties
- **Services**: 20 medical services (diagnostics, imaging, procedures)
- **Locations**: 4 hospital campuses with hours and specialties
- **All data**: Hardcoded JSON (no backend/API)

## 🚀 Getting Started

### Installation
```bash
# From root
npm install

# Run development server
npm run dev:salud
# Runs on http://localhost:3002 (or next available port)
```

### Build for Production
```bash
npm run build:salud
# Output: apps/salud/dist/
```

## 🔧 Technology Stack
- **React 18** - UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling with CSS variables
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Icon library
- **No TypeScript** - Pure JavaScript for simplicity

## 📁 Project Structure

```
apps/salud/
├── src/
│   ├── components/
│   │   ├── HeroSection.jsx             # Hero banner with CTA
│   │   ├── AboutSection.jsx            # Hospital info & features
│   │   ├── SpecialtiesGrid.jsx         # 20 specialty cards
│   │   ├── SpecialtyDetailPage.jsx     # Specialty details + doctors
│   │   ├── ServicesSection.jsx         # Medical services grid
│   │   ├── LocationsSection.jsx        # 4 hospital locations
│   │   ├── EmergenciesSection.jsx      # Emergency hotline banner
│   │   ├── DoctorsGridNew.jsx          # Doctor cards (improved)
│   │   ├── TestimonialsHealthSection.jsx # Reviews section
│   │   └── ...
│   ├── pages/
│   │   └── AppointmentFormNew.jsx      # Appointment booking form
│   ├── App.jsx                         # Main app with routing logic
│   ├── main.jsx                        # Entry point
│   └── styles.css                      # Global styles
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── tailwind.css

packages/
├── shared-data/
│   ├── specialties.json                # 20 specialties
│   ├── doctors.json                    # 12 doctors
│   ├── services.json                   # 20 medical services
│   ├── locations.json                  # 4 hospital locations
│   └── reviews.json                    # Patient testimonials
│
├── shared-ui/components/               # Navbar, Footer, ContactSection
├── shared-hooks/                       # useDarkMode, useCart
└── shared-styles/
    ├── theme.json                      # Healthcare color palette
    └── global.css                      # CSS variables & dark mode
```

## 🎯 Key Features & Patterns

### 1. View Mode Routing (No React Router)
```jsx
const [viewMode, setViewMode] = useState('main') // 'main', 'specialty', 'appointment'
// Switches between main landing page, specialty detail, and booking form
```

### 2. Dynamic Specialty Selection
- Click specialty card → View details with associated doctors
- Select doctor → Open appointment booking form
- Back button → Return to previous view

### 3. Appointment Booking
- Date picker (next 30 days, excluding Sundays)
- Time slots from doctor's availability
- Patient info collection
- Insurance provider input
- Multi-language support info

### 4. Responsive Grid Layouts
```
Mobile: 1 column
Tablet: 2 columns  
Desktop: 3-4 columns
```

### 5. Animations
- Fade-in on scroll (whileInView)
- Staggered animations for grids
- Smooth transitions on interactions
- AnimatePresence for page transitions

### 6. Dark Mode Support
```jsx
const { isDark, toggleTheme } = useDarkMode()
// Auto persists to localStorage (key: 'theme')
```

## 🎨 Color Palette

### Light Mode
- Primary: `#0F3F4C` (dark teal)
- Accent: `#0B7377` (teal green)
- Accent Light: `#00D9FF` (cyan)
- Background: `#F8FAFB` (off-white)
- Surface: `#FFFFFF` (white)

### Dark Mode
- Primary: `#E8F4F8` (light cyan)
- Accent: `#00D9FF` (bright cyan)
- Background: `#0F1419` (dark navy)
- Surface: `#1A2332` (slate)

## 📱 Responsive Breakpoints
- **Mobile**: 375px - `grid-cols-1`
- **Tablet**: 768px+ - `md:grid-cols-2`
- **Desktop**: 1024px+ - `lg:grid-cols-3 xl:grid-cols-4`

## 🔗 Navigation Flow
```
Landing Page
├─ Hero + About
├─ Specialties Grid
│  └─ [Click Specialty]
│     └─ Specialty Detail Page
│        ├─ Specialty Info & Cost
│        ├─ Associated Doctors
│        │  └─ [Click Doctor]
│        │     └─ Appointment Form
│        └─ Services Related
├─ Services Section
├─ Emergency Banner
├─ Locations Section
├─ Testimonials
└─ Contact
```

## 💡 Development Tips

### Adding a New Doctor
1. Edit `packages/shared-data/doctors.json`
2. Add doctor object with `specialtyId` matching a specialty
3. Auto-appears in Specialty Detail page

### Adding a New Specialty
1. Edit `packages/shared-data/specialties.json`
2. Provide icon name (from Lucide React)
3. Auto-appears in Specialties Grid

### Adding a New Service
1. Edit `packages/shared-data/services.json`
2. Include category (color-coded on display)
3. Auto-appears in Services Section

### Customizing Colors
- Edit `packages/shared-styles/theme.json`
- CSS variables auto-update across app
- No component code changes needed

### Testing Dark Mode
1. Click sun/moon icon in Navbar
2. Verify smooth transition
3. Check localStorage `theme` key in DevTools

## 🚨 Important Notes

1. **No API/Backend**: All data is static JSON in `packages/shared-data/`
2. **No Database**: Patient info logs to console (integrate EmailJS or backend as needed)
3. **Filter on Frontend**: All filtering/search uses `Array.filter()`
4. **localStorage Keys**: 
   - Theme: `theme`
   - Cart (if added): `innovatech-cart`

## 📋 Deployment Checklist

- [ ] Test on mobile (375px), tablet (768px), desktop (1280px)
- [ ] Verify dark mode toggle
- [ ] Test all specialty/doctor selection flows
- [ ] Check form validation
- [ ] Test back buttons work correctly
- [ ] Verify animations smooth on slower devices
- [ ] Check accessibility (focus states, alt text)
- [ ] Optimize images (use lower quality for web)

## 🔄 Future Enhancements

- Backend API integration for real appointments
- Payment processing (Stripe/PayPal)
- Email reminders (EmailJS or Nodemailer)
- Patient portal login
- Real-time availability sync
- SMS notifications
- AI chatbot support
- Telehealth integration

## 📞 Support

For questions or issues, contact: support@innovatech-clinic.com

---

**Built with ❤️ for modern healthcare delivery**

# 💡 Ejemplos Prácticos de las Reglas

Este documento muestra ejemplos concretos de cómo aplicar las reglas críticas del proyecto.

---

## 1️⃣ TODO en Inglés

### ❌ INCORRECTO

```typescript
// Componente con texto en español
const TarjetaHabitacion = ({ habitacion }) => {
  return (
    <div className="tarjeta">
      <h2>{habitacion.nombre}</h2>
      <p>Precio por noche: ${habitacion.precio}</p>
      <button>Reservar ahora</button>
    </div>
  );
};

// Data en español
const habitaciones = [
  {
    id: 1,
    nombre: "Suite Deluxe",
    descripcion: "Habitación espaciosa con vista al mar",
    precio: 299
  }
];
```

### ✅ CORRECTO

```typescript
// Component with English text
const RoomCard = ({ room }) => {
  return (
    <div className="card">
      <h2>{room.name}</h2>
      <p>Price per night: ${room.price}</p>
      <button>Book now</button>
    </div>
  );
};

// Data in English
const rooms = [
  {
    id: 1,
    name: "Deluxe Suite",
    description: "Spacious room with ocean view",
    price: 299
  }
];
```

---

## 2️⃣ Dark/Light Mode Obligatorio

### ❌ INCORRECTO - Sin dark mode

```typescript
const HeroSection = () => {
  return (
    <section style={{
      background: '#FFFFFF',
      color: '#000000',
      padding: '64px 16px'
    }}>
      <h1>Welcome to our hotel</h1>
      <p>Experience luxury and comfort</p>
    </section>
  );
};
```

### ✅ CORRECTO - Con dark mode y colores temáticos

```typescript
import { useTheme } from '@shared/hooks';

const HeroSection = () => {
  const { theme, isDark } = useTheme();

  return (
    <section style={{
      background: theme.background,
      color: theme.text,
      padding: '64px 16px'
    }}>
      <h1 style={{ color: theme.primary }}>
        Welcome to our hotel
      </h1>
      <p style={{ color: theme.textSecondary }}>
        Experience luxury and comfort
      </p>
    </section>
  );
};
```

### ✅ MEJOR - Con CSS Variables

```typescript
// Component
const HeroSection = () => {
  return (
    <section className="hero">
      <h1 className="hero__title">Welcome to our hotel</h1>
      <p className="hero__subtitle">Experience luxury and comfort</p>
    </section>
  );
};

// CSS
.hero {
  background: var(--color-bg);
  color: var(--color-text);
  padding: var(--spacing-4xl) var(--spacing-md);
}

.hero__title {
  color: var(--color-primary);
}

.hero__subtitle {
  color: var(--color-text-secondary);
}

/* Theme variables */
:root {
  /* Light mode - Hotelería */
  --color-primary: #8B7355;
  --color-bg: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-secondary: #666666;
}

[data-theme="dark"] {
  /* Dark mode - Hotelería */
  --color-primary: #A0826D;
  --color-bg: #1A1A1A;
  --color-text: #F5F5F0;
  --color-text-secondary: #AAAAAA;
}
```

---

## 3️⃣ Mobile-First Siempre

### ❌ INCORRECTO - Desktop first

```css
.room-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding: 64px;
}

@media (max-width: 1024px) {
  .room-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 48px;
  }
}

@media (max-width: 768px) {
  .room-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
}
```

### ✅ CORRECTO - Mobile first

```css
/* Base - Mobile (320px+) */
.room-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .room-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 32px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .room-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    padding: 48px;
  }
}
```

---

## 4️⃣ Testing Obligatorio

### ❌ INCORRECTO - Sin testing

```
Claude: "I've created the ContactForm component. Task completed!"
```

### ✅ CORRECTO - Con testing

```
Claude: "I've created the ContactForm component. Let me test it now."

*ejecuta: npm run dev:hoteleria*
*espera 10 segundos*
*verifica consola*

Claude: "Testing completed successfully:
✅ Server started without errors
✅ Component renders correctly
✅ Form validation works
✅ Responsive design verified (mobile/tablet/desktop)
✅ Dark/Light mode functional

Task completed!"
```

---

## 5️⃣ Preguntar Antes de Commit/Push

### ❌ INCORRECTO - Commit directo

```
*hace cambios*
*hace commit directamente*
*hace push*

Claude: "Changes committed and pushed!"
```

### ✅ CORRECTO - Confirmar primero

```
*hace cambios*
*testea*

Claude: "I've completed the changes and tested them successfully.
Would you like me to commit these changes?

Changes made:
- Added dark mode support to HeroSection
- Implemented mobile-responsive layout
- Updated English text content
"

User: "Yes, commit"

Claude: *hace commit*
"Committed with message: 'feat: add dark mode and responsive design to hero section'

Would you like me to push to remote?"

User: "Not yet"

Claude: "Understood. Changes are committed locally but not pushed."
```

---

## 6️⃣ Design Tokens - No Hardcodear

### ❌ INCORRECTO - Valores hardcoded

```typescript
const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  background: #8B7355;
  color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    background: #6B5644;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;
```

### ✅ CORRECTO - Con design tokens

```typescript
const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);

  &:hover {
    background: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }
`;
```

**Design tokens centralizados**:
```css
/* shared-styles/tokens.css */
:root {
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* Font sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 48px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.2);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;

  /* Colors - Hotelería */
  --color-primary: #8B7355;
  --color-primary-light: #A0826D;
  --color-primary-dark: #6B5644;
}
```

---

## 7️⃣ Datos en Archivos Separados

### ❌ INCORRECTO - Datos inline

```typescript
const ServicesSection = () => {
  const services = [
    {
      icon: "🏊",
      title: "Swimming Pool",
      description: "Olympic-size pool with ocean view"
    },
    {
      icon: "🍽️",
      title: "Restaurant",
      description: "Fine dining with local cuisine"
    },
    {
      icon: "💆",
      title: "Spa",
      description: "Full-service spa and wellness center"
    }
  ];

  return (
    <div>
      {services.map(service => (
        <ServiceCard key={service.title} {...service} />
      ))}
    </div>
  );
};
```

### ✅ CORRECTO - Datos separados y tipados

```typescript
// apps/hoteleria/data/services.ts
export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  featured?: boolean;
}

export const hotelServices: Service[] = [
  {
    id: "pool",
    icon: "🏊",
    title: "Swimming Pool",
    description: "Olympic-size pool with ocean view",
    featured: true
  },
  {
    id: "restaurant",
    icon: "🍽️",
    title: "Restaurant",
    description: "Fine dining with local cuisine"
  },
  {
    id: "spa",
    icon: "💆",
    title: "Spa",
    description: "Full-service spa and wellness center"
  }
];

// Component
import { hotelServices } from '@/data/services';

const ServicesSection = () => {
  return (
    <div>
      {hotelServices.map(service => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </div>
  );
};
```

---

## 🎯 Ejemplo Completo: Componente Perfecto

### Hero Section - Implementación Completa

```typescript
// apps/hoteleria/components/HeroSection/HeroSection.tsx
import React from 'react';
import { useTheme } from '@shared/hooks';
import { Button } from '@shared/ui';
import { heroContent } from '@/data/hero';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  variant?: 'default' | 'compact';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  variant = 'default'
}) => {
  const { theme } = useTheme();

  return (
    <section
      className={`${styles.hero} ${styles[`hero--${variant}`]}`}
      style={{
        backgroundColor: theme.background,
        color: theme.text
      }}
    >
      <div className={styles.hero__content}>
        <h1
          className={styles.hero__title}
          style={{ color: theme.primary }}
        >
          {heroContent.title}
        </h1>

        <p
          className={styles.hero__subtitle}
          style={{ color: theme.textSecondary }}
        >
          {heroContent.subtitle}
        </p>

        <div className={styles.hero__actions}>
          <Button variant="primary" size="large">
            {heroContent.ctaPrimary}
          </Button>

          <Button variant="outline" size="large">
            {heroContent.ctaSecondary}
          </Button>
        </div>
      </div>

      <div className={styles.hero__image}>
        <img
          src={heroContent.image}
          alt={heroContent.imageAlt}
          loading="eager"
        />
      </div>
    </section>
  );
};
```

```css
/* apps/hoteleria/components/HeroSection/HeroSection.module.css */

/* Mobile base (320px+) */
.hero {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: var(--spacing-lg);
  gap: var(--spacing-xl);
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  text-align: center;
}

.hero__title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  line-height: 1.2;
}

.hero__subtitle {
  font-size: var(--font-size-base);
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.hero__image {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.hero__image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .hero {
    padding: var(--spacing-2xl);
  }

  .hero__title {
    font-size: var(--font-size-3xl);
  }

  .hero__subtitle {
    font-size: var(--font-size-lg);
  }

  .hero__actions {
    flex-direction: row;
    justify-content: center;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .hero {
    flex-direction: row;
    align-items: center;
    padding: var(--spacing-3xl);
  }

  .hero__content {
    flex: 1;
    text-align: left;
  }

  .hero__actions {
    justify-content: flex-start;
  }

  .hero__image {
    flex: 1;
  }
}

/* Compact variant */
.hero--compact {
  min-height: 60vh;
}
```

```typescript
// apps/hoteleria/data/hero.ts
export interface HeroContent {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image: string;
  imageAlt: string;
}

export const heroContent: HeroContent = {
  title: "Experience Luxury Like Never Before",
  subtitle: "Discover our world-class amenities and exceptional service in the heart of paradise",
  ctaPrimary: "Book Now",
  ctaSecondary: "Explore Rooms",
  image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  imageAlt: "Luxury hotel exterior with ocean view"
};
```

**Este componente cumple TODAS las reglas**:
- ✅ Todo en inglés
- ✅ Dark/Light mode completo
- ✅ Mobile-first responsive
- ✅ Design tokens (no hardcoded)
- ✅ Datos en archivo separado
- ✅ TypeScript tipado
- ✅ Accesibilidad (alt text, semántica)
- ✅ Performance (lazy load images)

---

## 📋 Checklist Visual

Antes de entregar cualquier componente, verificar:

```
Component: _________________

✅ Code Quality
  ☐ All variable/function names in English
  ☐ All comments in English
  ☐ All UI text in English
  ☐ TypeScript types defined
  ☐ Imports ordered correctly

✅ Theme Support
  ☐ Dark mode implemented
  ☐ Light mode implemented
  ☐ App theme color used (Hotelería=Brown, Salud=Teal)
  ☐ CSS variables used (not hardcoded)
  ☐ Theme toggle works

✅ Responsive Design
  ☐ Mobile base styles (320px+)
  ☐ Tablet breakpoint (768px+)
  ☐ Desktop breakpoint (1024px+)
  ☐ Tested on all sizes
  ☐ No horizontal scroll

✅ Data & Structure
  ☐ Data in separate file (not inline)
  ☐ Design tokens used
  ☐ Reusable from shared-ui if applicable
  ☐ Semantic HTML
  ☐ Alt text on images

✅ Testing
  ☐ npm run dev:[app] executed
  ☐ Waited 10+ seconds
  ☐ No console errors
  ☐ Component renders correctly
  ☐ All features work

✅ Location
  ☐ Working in D:\Dev\Ecommerce\ProyectosDemo
  ☐ Not in .claude-worktrees
```

---

**Actualizado**: 2026-01-22
**Usar como referencia** cada vez que desarrolles algo nuevo.

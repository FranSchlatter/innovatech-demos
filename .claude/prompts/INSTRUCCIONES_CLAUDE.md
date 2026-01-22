# Instrucciones para Claude - Proyecto InnovaTech Demos

## Tu Rol
Eres un asistente de desarrollo especializado en front-end para demos de servicios de InnovaTech.

## Contexto del Proyecto
- **Proyecto**: Monorepo de landing pages para demos (hotelería, gastronomía, salud)
- **Stack**: React/Next.js (verificar en cada app)
- **Arquitectura**: Front-end hardcoded sin backend
- **Usuario**: Desarrollador creando demos para mostrar servicios
- **Ubicación Real**: `D:\Dev\Ecommerce\ProyectosDemo` (NO trabajar en .claude-worktrees)

## ⚠️ REGLAS CRÍTICAS DEL PROYECTO

### Regla 1: Idioma - INGLÉS en Código, ESPAÑOL en Conversación
- **TODO el código en inglés**: variables, funciones, componentes, comentarios en código
- **TODO el contenido UI en inglés**: textos UI, placeholders, labels, títulos
- **Commits**: en inglés (conventional commits)
- **Conversación con usuario**: SIEMPRE en español
- **NO crear documentación** .md a menos que el usuario lo solicite

### Regla 2: Dark/Light Mode + Color Temático
- **OBLIGATORIO en TODOS los componentes**: Soporte dark/light mode
- **Sistema de temas por app**:
  - Hotelería: Marrón/Bronce (`#8B7355`, `#A0826D`)
  - Salud: Verde-Azulado (`#20B2AA`, `#008B8B`)
  - Gastronomía: (definir con usuario)
- **Implementación**:
  - Variables CSS para colores (`--color-primary`, `--bg-primary`, etc.)
  - Hook `useTheme` o Context para toggle
  - Detectar preferencia del sistema por defecto
  - Persistir elección en localStorage

### Regla 3: Ubicación de Trabajo
- **NUNCA trabajar en**: `C:\Users\Chichi\.claude-worktrees\...`
- **SIEMPRE trabajar en**: `D:\Dev\Ecommerce\ProyectosDemo`
- Si detectas que estás en worktree, navega al proyecto real primero

### Regla 4: Testing y Validación Obligatoria
- **Después de CADA cambio importante**:
  1. Correr `npm run dev:[app]` del app modificada
  2. Esperar mínimo 10 segundos
  3. Verificar que no haya errores en consola
  4. Verificar que el servidor inicie correctamente
- **NO entregar solución hasta confirmar que funciona**
- Si hay errores: arreglarlos antes de marcar como completado

### Regla 5: Autonomía Total (Excepto Git)
- **Permiso completo para**:
  - Crear/modificar archivos
  - Instalar dependencias (npm install)
  - Refactorizar código
  - Ejecutar builds y tests
- **REQUIERE CONFIRMACIÓN**:
  - `git commit` - Preguntar antes de commitear
  - `git push` - Preguntar antes de pushear
  - Cambios destructivos (borrar archivos/carpetas grandes)

### Regla 6: Mobile-First SIEMPRE
- **Diseñar primero para mobile** (320px - 767px)
- **Luego tablet** (768px - 1023px)
- **Finalmente desktop** (1024px+)
- **CSS Order**:
  ```css
  /* Mobile base styles */
  @media (min-width: 768px) { /* Tablet */ }
  @media (min-width: 1024px) { /* Desktop */ }
  ```

### Regla 7: Leer Documentación ANTES de Trabajar
- **ANTES de cada tarea**, leer:
  1. `.claude/prompts/INSTRUCCIONES_CLAUDE.md` (este archivo)
  2. `.claude/prompts/FRONT_END_DEVELOPMENT.md`
  3. Archivos relevantes del proyecto
  4. Código existente relacionado
- **ENTENDER** el contexto completo antes de escribir código

## Reglas Generales

### 1. Siempre Leer Antes de Escribir
- NUNCA modifiques código sin leerlo primero
- Entiende el contexto y patrones existentes
- Mantén consistencia con el estilo del proyecto

### 2. Reutilización de Código
- Busca componentes en `/packages/shared-ui` antes de crear nuevos
- Usa hooks de `/packages/shared-hooks`
- Mantén estilos en `/packages/shared-styles`
- Si un componente se puede reutilizar, créalo en shared-ui

### 3. Responsive y Accesibilidad
- TODO debe ser responsive (mobile-first)
- Implementar dark mode cuando sea relevante
- Usar semántica HTML correcta
- Considerar accesibilidad (a11y)

### 4. Performance
- Optimizar imágenes automáticamente
- Lazy loading AUTOMÁTICO en imágenes (excepto above-the-fold)
- Preferir WebP/AVIF sobre JPG/PNG
- Code splitting cuando sea necesario
- Minimizar JavaScript innecesario

### 5. Organización
- Mantener estructura consistente entre apps
- Componentes pequeños y enfocados
- Nombres descriptivos y claros en INGLÉS

### 6. Design Tokens (Sistema de Diseño)
- **CENTRALIZAR en `packages/shared-styles`**:
  - Colores (primarios, secundarios, neutros, por tema)
  - Spacing (4px, 8px, 16px, 24px, 32px, 48px, 64px)
  - Typography (font-family, sizes, weights, line-heights)
  - Breakpoints (mobile: 320px, tablet: 768px, desktop: 1024px)
  - Shadows, border-radius, transitions
- **NUNCA hardcodear valores directamente en componentes**
- Cada app importa su paleta temática desde tokens centralizados

### 7. Nomenclatura Consistente
- **Componentes**: PascalCase (`Button`, `HeroSection`, `ContactForm`)
- **Archivos de componentes**: `ComponentName.tsx`
- **Archivos de estilos**: `ComponentName.module.css` (o styled-components)
- **Hooks**: camelCase con prefijo `use` (`useTheme`, `useScrollAnimation`)
- **Utils**: camelCase (`formatDate`, `validateEmail`)
- **Tipos/Interfaces**: PascalCase (`ButtonProps`, `ThemeConfig`)

### 8. Estructura de Imports (Orden Obligatorio)
```typescript
// 1. External libraries (React, Next, third-party)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Shared packages internos
import { Button, Card } from '@shared/ui';
import { useTheme } from '@shared/hooks';

// 3. Componentes locales
import { HeroSection } from './components/HeroSection';

// 4. Types e interfaces
import type { PageProps } from './types';

// 5. Estilos y assets
import styles from './Page.module.css';
import logo from './assets/logo.svg';
```

### 9. Data Hardcoded - Reglas Estrictas
- **NUNCA inline en JSX**: Mover a archivos separados
- **Ubicación**:
  - Compartido entre apps → `packages/shared-data/[vertical].ts`
  - Específico de app → `apps/[app]/data/[nombre].ts`
- **SIEMPRE tipado con TypeScript**:
  ```typescript
  // shared-data/hotel-rooms.ts
  export interface Room {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    amenities: string[];
  }

  export const hotelRooms: Room[] = [
    // data...
  ];
  ```

### 10. Dependencies - Control Estricto
- **PREGUNTAR antes de agregar librerías nuevas**
- **Justificar necesidad**: ¿Por qué no nativo/custom?
- **Considerar**:
  - Bundle size impact
  - Mantenimiento (última actualización, issues)
  - Alternativas más ligeras
- **Preferir soluciones nativas** cuando sea razonable

## Comportamiento Esperado

### Cuando te pidan crear una sección/componente:
1. **Leer documentación relevante primero**
2. Preguntar si ya existe algo similar en shared-ui
3. Verificar archivos relacionados del proyecto
4. Proponer estructura reutilizable
5. Implementar:
   - ✅ Textos en inglés
   - ✅ Dark/Light mode
   - ✅ Color temático de la app
   - ✅ Mobile-first responsive
   - ✅ Accesibilidad básica
6. **Testing obligatorio**: Correr dev server y validar
7. Sugerir optimizaciones

### Cuando te pidan modificar algo:
1. **Leer documentación y código existente**
2. Entender el contexto y dependencias completas
3. Verificar que estás trabajando en `D:\Dev\Ecommerce\ProyectosDemo`
4. Hacer cambios respetando:
   - ✅ Inglés en todo
   - ✅ Dark/Light mode existente
   - ✅ Mobile-first
   - ✅ Nomenclatura consistente
5. **Testing obligatorio**: Correr y validar cambios
6. Verificar que no rompas otras partes

### Cuando te pidan agregar funcionalidad:
1. Verificar si existe en el proyecto
2. Considerar reutilización en otras apps
3. Implementar de forma genérica cuando sea posible
4. Documentar si es complejo

### Cuando encuentres código repetido:
1. Señalarlo proactivamente
2. Sugerir refactorización a shared packages
3. Ofrecer implementar la mejora

## Comunicación

### Idioma de Conversación
- **Conversaciones SIEMPRE en español** con el usuario
- El usuario prefiere comunicarse en español
- Solo el código, textos UI y commits deben ser en inglés

### Sé Conciso
- Respuestas directas y claras
- No sobre-explicar obviedades
- Enfocarte en lo importante

### Sé Proactivo
- Sugerir mejoras cuando las veas
- Identificar problemas potenciales
- Proponer optimizaciones

### Preguntar Cuando Sea Necesario
- Clarificar requerimientos ambiguos
- Confirmar decisiones de diseño importantes
- Validar antes de cambios grandes

### NO Crear Documentación Sin Solicitud
- **NUNCA crear archivos .md de documentación** a menos que el usuario lo pida explícitamente
- No crear READMEs automáticamente
- No crear guías o tutoriales sin solicitud
- Enfocarse en código funcional, no en documentación
- **EXCEPCIÓN**: Comentarios en código cuando sea necesario para claridad

## Herramientas y Comandos

### Para Desarrollo
```bash
# Iniciar dev server de cada app
npm run dev:hoteleria
npm run dev:salud
npm run dev:gastronomia
```

### Para Commits
- **SIEMPRE preguntar antes de commitear**
- Usar `/commit` cuando el usuario apruebe
- Mensajes claros y descriptivos en **INGLÉS**
- Seguir conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, etc.
- **NUNCA hacer push sin confirmación explícita**

## Sistema de Temas (CRÍTICO)

### Paletas de Color por App

```typescript
// Hotelería - Marrón/Bronce
{
  light: {
    primary: '#8B7355',      // Brown
    primaryLight: '#A0826D',  // Light Bronze
    primaryDark: '#6B5644',   // Dark Brown
    background: '#FFFFFF',
    backgroundAlt: '#F5F5F0',
    text: '#1A1A1A',
    textSecondary: '#666666'
  },
  dark: {
    primary: '#A0826D',
    primaryLight: '#B89A7D',
    primaryDark: '#8B7355',
    background: '#1A1A1A',
    backgroundAlt: '#2A2A2A',
    text: '#F5F5F0',
    textSecondary: '#AAAAAA'
  }
}

// Salud - Verde-Azulado
{
  light: {
    primary: '#20B2AA',      // Light Sea Green
    primaryLight: '#48D1CC',  // Medium Turquoise
    primaryDark: '#008B8B',   // Dark Cyan
    background: '#FFFFFF',
    backgroundAlt: '#F0F8F8',
    text: '#1A1A1A',
    textSecondary: '#666666'
  },
  dark: {
    primary: '#48D1CC',
    primaryLight: '#7FFFD4',
    primaryDark: '#20B2AA',
    background: '#1A1A1A',
    backgroundAlt: '#2A2A2A',
    text: '#F0F8F8',
    textSecondary: '#AAAAAA'
  }
}

// Gastronomía - TODO: Definir con usuario
```

### Implementación del Tema

**Ubicación**: `packages/shared-styles/themes/`

**Uso en Componentes**:
```typescript
import { useTheme } from '@shared/hooks';

const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div style={{
      backgroundColor: theme.background,
      color: theme.text
    }}>
      {/* content */}
    </div>
  );
};
```

**CSS Variables** (preferido):
```css
:root {
  --color-primary: #8B7355;
  --color-bg: #FFFFFF;
  --color-text: #1A1A1A;
}

[data-theme="dark"] {
  --color-primary: #A0826D;
  --color-bg: #1A1A1A;
  --color-text: #F5F5F0;
}

.component {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

## Patrones Específicos del Proyecto

### Imágenes
- Usar URLs de servicios gratuitos (Unsplash, Pexels)
- Optimizar dimensiones apropiadas (no más de 2000px de ancho)
- Preferir formato WebP/AVIF cuando sea posible
- Lazy loading automático (excepto hero/above-fold)
- **Alt text SIEMPRE en inglés y descriptivo**
- Considerar dark mode (algunas imágenes pueden necesitar overlay)

### Datos Hardcoded
- Centralizar en shared-data cuando sea compartido
- Mantener tipado fuerte con TypeScript
- Datos realistas para demos

### Componentes Comunes
- Hero sections con imagen de fondo
- Grids de servicios/features
- Formularios de contacto
- Sliders/Carruseles
- Cards de información
- Botones de CTA

## Errores Comunes a Evitar

❌ **NO hacer** (PROHIBIDO):
- Trabajar en `.claude-worktrees` en vez de `D:\Dev\Ecommerce\ProyectosDemo`
- Crear componentes sin verificar si existen
- Modificar archivos sin leerlos primero
- Ignorar responsive design o mobile-first
- Código duplicado entre apps
- Over-engineering de soluciones simples
- Agregar dependencias sin consultar
- **Textos en español** (excepto conversación con usuario)
- **Olvidar dark/light mode**
- **Entregar sin testing (npm run dev)**
- **Commitear sin confirmar con usuario**
- Hardcodear colores/spacing en vez de usar design tokens
- Datos inline en JSX en vez de archivos separados

✅ **SÍ hacer** (OBLIGATORIO):
- Leer documentación ANTES de cada tarea
- Reutilizar componentes existentes de shared-ui
- TODO en inglés (código, textos, comentarios)
- Dark/Light mode en TODOS los componentes
- Colores temáticos específicos por app
- Mobile-first SIEMPRE
- Testing antes de entregar (npm run dev + esperar 10s)
- Preguntar antes de commits/pushes
- Usar design tokens centralizados
- Optimizar assets automáticamente
- Mantener consistencia entre apps
- Código simple, legible y DRY
- Accesibilidad básica (semántica, alt text, contraste)

## Evolución del Proyecto

### Fase Actual: Landing Pages
- Enfoque en diseño visual
- Contenido estático hardcoded
- Demos de servicios

### Fase Futura: Sistemas de Gestión
- Preparar arquitectura para CRUD
- Estado complejo con Context/Redux
- Formularios avanzados
- Gestión de datos simulada

## Referencias Útiles

- `/README.md` - Overview del proyecto
- `/DEVELOPMENT.md` - Guía de desarrollo
- `/.claude/prompts/FRONT_END_DEVELOPMENT.md` - Guía técnica detallada

---

**Recordatorio**: Este es un proyecto de demos visuales. Prioriza la experiencia visual y responsive sobre complejidad técnica innecesaria.

# Guía de Desarrollo Front-End - InnovaTech Demos

## Contexto del Proyecto
Este es un monorepo de demos para servicios de InnovaTech (hotelería, gastronomía, salud, etc.).
- **Tecnología**: React/Next.js (verificar stack específico)
- **Arquitectura**: Landing pages hardcoded, sin backend
- **Objetivo**: Demos visuales de servicios, preparando para futuros sistemas de gestión

## Principios de Desarrollo

### 1. Estructura de Código
- Mantener consistencia entre apps (hotelería, gastronomía, salud)
- Usar componentes compartidos desde `/packages/shared-ui`
- Estilos compartidos en `/packages/shared-styles`
- Hooks reutilizables en `/packages/shared-hooks`
- Data hardcoded en `/packages/shared-data`

### 2. Responsive Design
- **Mobile-first approach**: Diseñar primero para móvil
- Breakpoints estándar: mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)
- Probar responsive en todos los componentes nuevos

### 3. Código Limpio y Mantenible
- Componentes pequeños y reutilizables
- Nombres descriptivos en español o inglés (consistente en todo el proyecto)
- Evitar duplicación de código
- Documentar lógica compleja con comentarios

### 4. Performance
- Optimizar imágenes (usar formatos modernos: WebP, AVIF)
- Lazy loading para imágenes y componentes pesados
- Minimizar re-renders innecesarios

### 5. Dark Mode
- Implementar soporte para modo oscuro cuando sea relevante
- Usar variables CSS o tema global para colores

## Comandos Comunes

```bash
# Desarrollo
npm run dev:hoteleria
npm run dev:salud
npm run dev:gastronomia

# Build
npm run build:hoteleria
npm run build:salud
npm run build:gastronomia
```

## Workflows de Trabajo

### Crear nueva landing page
1. Analizar diseño y requerimientos
2. Identificar componentes reutilizables
3. Crear/reutilizar componentes desde shared-ui
4. Implementar responsive design
5. Probar en diferentes dispositivos
6. Optimizar performance

### Agregar nueva funcionalidad
1. Verificar si existe en shared packages
2. Implementar de forma reutilizable
3. Documentar en este archivo si es un patrón recurrente
4. Aplicar a otras apps si es relevante

## Componentes Comunes

### UI Compartidos
- Botones
- Cards
- Navegación
- Formularios
- Modales
- Sliders/Carruseles

### Patrones de Diseño
- Hero sections
- Feature grids
- Testimonios
- CTAs (Call to Actions)
- Footers con información de contacto

## Estilos y Diseño

### Paleta de Colores
(Agregar paletas específicas por vertical cuando estén definidas)

### Tipografía
(Agregar fuentes y jerarquía tipográfica)

### Espaciado
(Agregar sistema de spacing)

## Datos Hardcoded

### Ubicación
- `/packages/shared-data` para datos compartidos
- Dentro de cada app para datos específicos

### Formato
```typescript
// Ejemplo de estructura de datos
export const services = [
  {
    id: 1,
    title: "Servicio X",
    description: "...",
    image: "/images/...",
    features: [...]
  }
]
```

## Checklist de QA

- [ ] Responsive en mobile, tablet, desktop
- [ ] Dark mode funcional (si aplica)
- [ ] Imágenes optimizadas
- [ ] Sin errores en consola
- [ ] Performance aceptable (LCP, FID, CLS)
- [ ] Navegación funcional
- [ ] Formularios validados correctamente
- [ ] Consistencia con otras apps del monorepo

## Próximos Pasos (Fase 2: Sistemas de Gestión)

Preparar arquitectura para:
- CRUD operations (simulados en front)
- Gestión de estados complejos
- Formularios avanzados
- Tablas de datos
- Dashboards
- Autenticación simulada

---

**Nota**: Este documento debe actualizarse a medida que evolucionan los patrones y decisiones del proyecto.

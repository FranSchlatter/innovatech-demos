# Skill: Crear Nuevo Componente

**Comando**: `/new-component`

## Descripción
Crea un nuevo componente siguiendo las mejores prácticas del proyecto InnovaTech Demos.

## Flujo de Trabajo

### 1. Análisis Inicial
- ¿El componente es específico de una app o reutilizable?
- ¿Ya existe algo similar en `/packages/shared-ui`?
- ¿Qué props/funcionalidad necesita?

### 2. Decisión de Ubicación
- **Reutilizable** → `/packages/shared-ui/src/components/`
- **Específico** → `/apps/[app]/src/components/`

### 3. Estructura del Componente
```typescript
// imports
import React from 'react';
import styles from './ComponentName.module.css'; // o styled-components

// types
interface ComponentNameProps {
  // props tipadas
}

// component
export const ComponentName: React.FC<ComponentNameProps> = ({
  // destructure props
}) => {
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};

// default export
export default ComponentName;
```

### 4. Checklist de Implementación
- [ ] Componente tipado con TypeScript
- [ ] Props con valores por defecto cuando sea apropiado
- [ ] Responsive design implementado
- [ ] Dark mode considerado (si aplica)
- [ ] Archivo de estilos creado (CSS modules o styled-components)
- [ ] Exportado correctamente desde index.ts
- [ ] Documentación JSDoc si es complejo

### 5. Responsive Design
Asegurar breakpoints:
```css
/* Mobile first */
.container {
  /* styles base para mobile */
}

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}
```

### 6. Testing (futuro)
Preparar estructura para tests:
```typescript
// ComponentName.test.tsx
describe('ComponentName', () => {
  it('renders correctly', () => {
    // test
  });
});
```

## Preguntas a Hacer

1. **Nombre del componente**: ¿Cómo se llamará?
2. **Ubicación**: ¿Compartido o específico de app?
3. **Props**: ¿Qué datos necesita recibir?
4. **Funcionalidad**: ¿Qué debe hacer?
5. **Diseño**: ¿Tienes referencia visual?

## Ejemplos de Uso

### Componente Simple - Card
```typescript
interface CardProps {
  title: string;
  description: string;
  image?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  onClick
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      {image && <img src={image} alt={title} />}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
```

### Componente Complejo - Booking Form
```typescript
interface BookingFormProps {
  onSubmit: (data: BookingData) => void;
  serviceType: 'hotel' | 'restaurant' | 'health';
  initialData?: Partial<BookingData>;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  serviceType,
  initialData
}) => {
  const [formData, setFormData] = useState(initialData || {});

  // lógica del formulario

  return (
    <form onSubmit={handleSubmit}>
      {/* campos del formulario */}
    </form>
  );
};
```

## Output Esperado

Al ejecutar `/new-component`, Claude debe:

1. Hacer las preguntas necesarias
2. Determinar la ubicación correcta
3. Crear el archivo del componente
4. Crear el archivo de estilos
5. Actualizar el index.ts de exports
6. Proveer ejemplo de uso
7. Recordar agregar a documentación si es importante

## Notas

- Siempre pensar en reutilización
- Mobile-first approach
- TypeScript strict mode
- Performance (memoization si es necesario)
- Accesibilidad (aria-labels, semántica)

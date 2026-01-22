# ⚠️ REGLAS CRÍTICAS - InnovaTech Demos

Este documento contiene las reglas NO NEGOCIABLES del proyecto. Claude DEBE seguirlas siempre.

---

## 🔴 REGLAS ABSOLUTAS

### 1️⃣ IDIOMA: INGLÉS en Código, ESPAÑOL en Conversación
```
✅ CORRECTO:
- Variables: userName, fetchData, calculateTotal
- Componentes: Button, HeroSection, ContactForm
- Comentarios código: // Fetch user data from API
- Textos UI: "Welcome to our hotel"
- Commits: "feat: add dark mode to hero section"
- Conversación: SIEMPRE en español con el usuario

❌ INCORRECTO:
- Variables: nombreUsuario, obtenerDatos
- Componentes: Boton, SeccionHero
- Textos UI: "Bienvenido a nuestro hotel"
- Commits: "feat: agregar dark mode"
- Conversación en inglés con el usuario

IMPORTANTE:
✅ Chat con usuario: Español
✅ Código y UI: Inglés
❌ NO crear documentación .md sin que el usuario lo solicite
```

### 2️⃣ DARK/LIGHT MODE: OBLIGATORIO
```
✅ TODO componente DEBE soportar ambos modos
✅ Usar CSS variables o theme context
✅ Detectar preferencia del sistema por defecto
✅ Permitir toggle manual
✅ Persistir elección en localStorage

❌ NO crear componentes sin dark mode
❌ NO hardcodear colores que no soporten ambos modos
```

**Colores por App**:
```typescript
Hotelería:
  Light: #8B7355 (Brown), #A0826D (Bronze)
  Dark:  #A0826D (Primary), #8B7355 (Dark)

Salud:
  Light: #20B2AA (Teal), #008B8B (Dark Cyan)
  Dark:  #48D1CC (Primary), #20B2AA (Dark)

Gastronomía: TBD - Preguntar al usuario
```

### 3️⃣ UBICACIÓN: D:\Dev\Ecommerce\ProyectosDemo
```
✅ CORRECTO:
cd D:\Dev\Ecommerce\ProyectosDemo
# Trabajar aquí

❌ INCORRECTO:
C:\Users\Chichi\.claude-worktrees\...
# NUNCA trabajar en worktrees
```

**Verificación antes de cada tarea**:
```bash
pwd  # Debe mostrar D:\Dev\Ecommerce\ProyectosDemo
```

### 4️⃣ TESTING: OBLIGATORIO ANTES DE COMPLETAR
```
✅ PROCESO MANDATORIO:

1. Correr dev server:
   npm run dev:hoteleria
   # o dev:salud, dev:gastronomia

2. Esperar mínimo 10 segundos

3. Verificar:
   - ✅ Servidor inicia sin errores
   - ✅ Sin errores en consola
   - ✅ Componente renderiza correctamente
   - ✅ Responsive funciona (mobile/tablet/desktop)
   - ✅ Dark/Light mode funciona

4. Solo entonces marcar como completado

❌ NUNCA entregar sin testing
❌ NO asumir que funciona
```

### 5️⃣ GIT: PREGUNTAR ANTES DE COMMIT/PUSH
```
✅ FLUJO CORRECTO:

1. Hacer cambios
2. Testear que funciona
3. PREGUNTAR: "¿Quieres que haga commit de estos cambios?"
4. Esperar confirmación del usuario
5. Hacer commit con mensaje en inglés
6. PREGUNTAR: "¿Quieres que haga push?"
7. Esperar confirmación

❌ NUNCA commitear sin preguntar
❌ NUNCA pushear sin preguntar
```

**Formato de commits**:
```bash
✅ feat: add dark mode support to hero section
✅ fix: resolve mobile responsive issue in contact form
✅ refactor: move booking data to shared-data package
✅ chore: update dependencies

❌ feat: agregar dark mode
❌ arreglé el bug del formulario
❌ cambios varios
```

### 6️⃣ MOBILE-FIRST: SIEMPRE
```css
✅ CORRECTO:

/* Base styles - Mobile (320px+) */
.component {
  padding: 16px;
  font-size: 14px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .component {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .component {
    padding: 32px;
    font-size: 18px;
  }
}

❌ INCORRECTO:

/* Desktop first - NO HACER */
.component {
  padding: 32px;
  font-size: 18px;
}

@media (max-width: 1024px) {
  .component {
    padding: 24px;
  }
}
```

### 7️⃣ LEER DOCUMENTACIÓN: ANTES DE TODO
```
✅ WORKFLOW OBLIGATORIO:

Antes de CADA tarea:
1. Leer .claude/prompts/INSTRUCCIONES_CLAUDE.md
2. Leer .claude/prompts/FRONT_END_DEVELOPMENT.md
3. Leer archivos relevantes del código existente
4. Entender patrones y estructura
5. SOLO ENTONCES empezar a codear

❌ NO empezar a codear directamente
❌ NO asumir cómo funciona el proyecto
```

---

## 🟡 REGLAS IMPORTANTES

### 8️⃣ Reutilización de Código
```
ANTES de crear un componente:
1. ✅ Buscar en packages/shared-ui
2. ✅ Verificar si algo similar existe en otras apps
3. ✅ Considerar si debería ser compartido

Si es reutilizable → shared-ui
Si es específico → apps/[app]/components
```

### 9️⃣ Design Tokens - NO Hardcodear
```
❌ INCORRECTO:
const Button = styled.button`
  padding: 12px 24px;
  color: #8B7355;
  border-radius: 8px;
`;

✅ CORRECTO:
const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-primary);
  border-radius: var(--radius-md);
`;
```

### 🔟 Datos Hardcoded - Archivos Separados
```
❌ INCORRECTO:
const HotelRooms = () => {
  const rooms = [
    { id: 1, name: "Deluxe Suite", price: 299 },
    { id: 2, name: "Standard Room", price: 149 },
  ];

  return <div>{rooms.map(...)}</div>;
};

✅ CORRECTO:
// apps/hoteleria/data/rooms.ts
export interface Room {
  id: number;
  name: string;
  price: number;
}

export const hotelRooms: Room[] = [
  { id: 1, name: "Deluxe Suite", price: 299 },
  { id: 2, name: "Standard Room", price: 149 },
];

// Component
import { hotelRooms } from '../data/rooms';

const HotelRooms = () => {
  return <div>{hotelRooms.map(...)}</div>;
};
```

---

## 📋 CHECKLIST ANTES DE ENTREGAR

Copiar y verificar CADA VEZ antes de marcar tarea como completada:

```markdown
## Pre-delivery Checklist

### Código
- [ ] Todo en inglés (variables, funciones, comentarios, textos)
- [ ] Dark/Light mode implementado y funcionando
- [ ] Colores temáticos correctos para la app
- [ ] Mobile-first responsive (probado en 320px, 768px, 1024px)
- [ ] Componentes reutilizables en shared-ui si aplica
- [ ] Design tokens usados (no hardcoded)
- [ ] Datos en archivos separados (no inline)
- [ ] Imports ordenados correctamente
- [ ] TypeScript sin errores
- [ ] Accesibilidad básica (semantic HTML, alt text)

### Testing
- [ ] npm run dev:[app] ejecutado
- [ ] Esperado 10+ segundos
- [ ] Sin errores en consola
- [ ] Renderiza correctamente
- [ ] Responsive verificado
- [ ] Dark/Light toggle funciona
- [ ] Navegación funcional

### Git (si aplica)
- [ ] Preguntado al usuario antes de commit
- [ ] Mensaje de commit en inglés
- [ ] Conventional commits format
- [ ] Preguntado antes de push

### Ubicación
- [ ] Trabajado en D:\Dev\Ecommerce\ProyectosDemo
- [ ] NO en .claude-worktrees
```

---

## 🚨 ERRORES COMUNES Y CÓMO EVITARLOS

### Error: Texto en español
```
❌ <h1>Bienvenido a nuestro hotel</h1>
✅ <h1>Welcome to our hotel</h1>
```

### Error: Sin dark mode
```
❌
const Card = () => (
  <div style={{ background: '#fff', color: '#000' }}>
    Content
  </div>
);

✅
const Card = () => {
  const { theme } = useTheme();

  return (
    <div style={{
      background: theme.background,
      color: theme.text
    }}>
      Content
    </div>
  );
};
```

### Error: Desktop-first
```
❌
.hero {
  font-size: 48px;
}

@media (max-width: 768px) {
  .hero { font-size: 24px; }
}

✅
.hero {
  font-size: 24px;
}

@media (min-width: 768px) {
  .hero { font-size: 32px; }
}

@media (min-width: 1024px) {
  .hero { font-size: 48px; }
}
```

### Error: Commit sin preguntar
```
❌ Hacer commit directamente

✅
Claude: "I've completed the changes. Would you like me to commit these changes?"
User: "Yes"
Claude: *hace commit*
```

### Error: No testear
```
❌
"Task completed!" (sin testear)

✅
*corre npm run dev*
*espera 10s*
*verifica errores*
"Tested successfully. Task completed!"
```

---

## 💡 REGLAS RÁPIDAS (MEMORIZAR)

1. 🌍 **English everywhere**
2. 🎨 **Dark/Light always**
3. 📂 **D:\Dev\Ecommerce\ProyectosDemo**
4. ✅ **Test before completing**
5. 🔒 **Ask before commit/push**
6. 📱 **Mobile-first always**
7. 📖 **Read docs first**

---

## ❓ FAQ

**P: ¿Puedo usar español en comentarios internos?**
R: NO. Todo en inglés excepto conversación con usuario.

**P: ¿Y si el componente es muy simple para dark mode?**
R: No importa. TODOS los componentes deben soportarlo.

**P: ¿Puedo trabajar en worktree temporalmente?**
R: NO. Siempre en D:\Dev\Ecommerce\ProyectosDemo.

**P: ¿Puedo saltar el testing si el cambio es menor?**
R: NO. SIEMPRE testear antes de completar.

**P: ¿Qué hago si olvido una regla?**
R: Revisar este documento y INSTRUCCIONES_CLAUDE.md.

---

**Última actualización**: 2026-01-22
**Versión**: 1.0
**Estado**: VIGENTE - No negociable

¡Estas reglas garantizan calidad, consistencia y profesionalismo en el proyecto!

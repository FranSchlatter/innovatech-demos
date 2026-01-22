# ⚡ Inicio Rápido - Claude Code Setup Completo

## ✅ Lo Que Se Configuró

```
.claude/
├── 📄 README.md                       # Índice principal - EMPIEZA AQUÍ
├── 🚀 INICIO_RAPIDO.md               # Este archivo (resumen ejecutivo)
├── ⚠️  REGLAS_CRITICAS.md            # ⭐ REGLAS NO NEGOCIABLES ⭐
├── 📖 GUIA_PROMPTS.md                # Cómo escribir buenos prompts
├── ⚙️  settings.json                  # Configuración del proyecto
│
├── 📂 prompts/                        # Documentación para Claude
│   ├── INSTRUCCIONES_CLAUDE.md       # Comportamiento y reglas COMPLETAS
│   ├── FRONT_END_DEVELOPMENT.md      # Guías técnicas
│   └── README.md                     # Índice de prompts
│
└── 📂 skills/                         # Automatizaciones
    ├── new-component.md              # Crear componentes
    ├── check-consistency.md          # Verificar consistencia
    └── README.md                     # Índice de skills
```

## ⚠️ REGLAS CRÍTICAS (LEER PRIMERO)

Tu proyecto ahora tiene **7 reglas absolutas** que Claude DEBE seguir:

1. **🌍 TODO en INGLÉS** (código, textos, comentarios, commits)
2. **🎨 Dark/Light mode OBLIGATORIO** en todos los componentes
3. **📂 Trabajar solo en** `D:\Dev\Ecommerce\ProyectosDemo` (no .claude-worktrees)
4. **✅ Testear SIEMPRE** con `npm run dev` antes de completar
5. **🔒 Preguntar antes** de commits/pushes
6. **📱 Mobile-first SIEMPRE**
7. **📖 Leer docs ANTES** de empezar cada tarea

**📋 Documento completo**: `.claude/REGLAS_CRITICAS.md` (leer hoy!)

**Colores temáticos**:
- Hotelería: Brown/Bronze (#8B7355, #A0826D)
- Salud: Teal/Green (#20B2AA, #008B8B)
- Gastronomía: (por definir)

---

## 🎯 ¿Qué Puedes Hacer Ahora?

### 1️⃣ Escribe Mejores Prompts
✅ **Lee**: `.claude/GUIA_PROMPTS.md`

**Antes**:
```
"Crea un componente Card"
```

**Ahora**:
```
"Crea un componente Card en shared-ui que:
- Reciba props: title, description, image, onClick
- Sea responsive (stack en mobile, grid en desktop)
- Tenga hover effect sutil
- Use los colores del design system
Debe ser reutilizable en las 3 apps"
```

### 2️⃣ Claude Entiende Tu Proyecto
✅ **Configurado**: `.claude/prompts/INSTRUCCIONES_CLAUDE.md`

Claude ahora sabe:
- ✅ Es un monorepo de landing pages
- ✅ Debe reutilizar componentes de shared-ui
- ✅ Siempre hacer responsive design
- ✅ Leer archivos antes de modificar
- ✅ Mantener consistencia entre apps

**Úsalo así**:
```
"Lee las instrucciones del proyecto y luego ayúdame a crear
una nueva sección de testimonios para la app de salud"
```

### 3️⃣ Skills para Tareas Recurrentes
✅ **Creadas**: 2 skills personalizadas

#### Skill: `/new-component`
Crea componentes consistentes automáticamente.

**Uso**:
```
"Usa la skill new-component para crear un componente Hero
que se pueda reutilizar en todas las apps"
```

#### Skill: `/check-consistency`
Encuentra código duplicado y problemas de consistencia.

**Uso**:
```
"Ejecuta check-consistency para ver si hay código que
debería estar en shared packages"
```

### 4️⃣ Documentación Técnica
✅ **Creado**: `.claude/prompts/FRONT_END_DEVELOPMENT.md`

Tu guía de desarrollo incluye:
- ✅ Principios de código limpio
- ✅ Estructura de componentes
- ✅ Checklist de QA
- ✅ Comandos comunes
- ✅ Patrones de diseño

## 🚀 Primeros Pasos HOY

### Paso 1: Familiarízate (5 min)
```bash
# Dile a Claude:
"Abre .claude/README.md y dame un resumen de lo que se configuró"
```

### Paso 2: Prueba un Prompt Mejorado (2 min)
Toma algo que normalmente pedirías y mejóralo usando la guía:

**Antes**: "Agrega dark mode"

**Ahora**:
```
"Agrega soporte de dark mode al componente Hero en shared-ui:

- Detectar preferencia del sistema con useMediaQuery
- Variables CSS para colores (--bg-primary, --text-primary)
- Transición suave entre modos
- Mantener el diseño responsive actual

Debe funcionar en las 3 apps sin cambios adicionales"
```

### Paso 3: Usa una Skill (5 min)
```bash
"Usa la skill new-component para crear un componente Button
reutilizable con variantes: primary, secondary, outline"
```

### Paso 4: Verifica Consistencia (5 min)
```bash
"Ejecuta la skill check-consistency y muéstrame el reporte"
```

## 📊 Comparación: Antes vs Ahora

| Aspecto | ❌ Antes | ✅ Ahora |
|---------|---------|---------|
| **Prompts** | Vagos e inconsistentes | Específicos con contexto |
| **Contexto** | Repetir en cada chat | Claude lee documentación |
| **Componentes** | Inconsistentes entre apps | Skill garantiza consistencia |
| **Duplicación** | No detectada | Check-consistency la encuentra |
| **Onboarding** | Explicar todo verbalmente | Documentación completa |
| **Patrones** | En tu cabeza | Documentados y reusables |

## 💡 Tips para Máxima Productividad

### 1. Empieza Cada Sesión Así:
```
"Lee .claude/prompts/INSTRUCCIONES_CLAUDE.md para recordar
el contexto del proyecto"
```

### 2. Usa Referencias:
```
"Basándote en FRONT_END_DEVELOPMENT.md, ¿cómo debería
implementar un sistema de filtros?"
```

### 3. Actualiza la Documentación:
Cuando descubras algo útil:
```
"Agrega este patrón a FRONT_END_DEVELOPMENT.md en la
sección de componentes comunes"
```

### 4. Crea Skills Personalizadas:
Si repites algo 3+ veces:
```
"Ayúdame a crear una skill para [proceso recurrente]
usando el template de skills/README.md"
```

## 🎓 Roadmap de Aprendizaje

### Semana 1: Fundamentos
- [x] Setup completado
- [ ] Leer GUIA_PROMPTS.md completa
- [ ] Probar 5 prompts mejorados
- [ ] Usar ambas skills al menos una vez

### Semana 2: Intermedio
- [ ] Crear tu primera skill personalizada
- [ ] Agregar 3 ejemplos a GUIA_PROMPTS.md
- [ ] Actualizar FRONT_END_DEVELOPMENT.md con patrones nuevos
- [ ] Refactorizar código duplicado usando check-consistency

### Semana 3: Avanzado
- [ ] Personalizar settings.json completamente
- [ ] Crear 2 skills más
- [ ] Documentar decisiones de arquitectura
- [ ] Entrenar a un compañero usando tu documentación

## 🔥 Casos de Uso Reales

### Caso 1: Nueva Landing Page
```
"Necesito crear una nueva landing page para 'Educación':

Basándote en las apps existentes (hotelería, salud, gastronomia):
1. Crea la estructura base en apps/educacion
2. Configura package.json y scripts
3. Reutiliza componentes de shared-ui
4. Implementa: Hero, Services, Testimonials, Contact
5. Mantén consistencia con las otras apps

Usa check-consistency al final para verificar"
```

### Caso 2: Refactorizar Hero Duplicado
```
"Ejecuta check-consistency y enfócate en el componente Hero.

Luego refactoriza:
- Mueve el código común a shared-ui/Hero
- Permite customización por app (colores, imagen)
- Actualiza las 3 apps para usar el Hero compartido
- Verifica que todo funcione igual visualmente"
```

### Caso 3: Nuevo Sistema de Booking
```
"Siguiendo la skill new-component, crea un BookingWidget:

UBICACIÓN: shared-ui (será usado en hotelería y salud)

FUNCIONALIDAD:
- Formulario con: servicio, fecha, hora, personas
- Validación de campos requeridos
- Preview de la reserva antes de confirmar
- Modal de éxito al enviar (sin backend real)

DISEÑO:
- Adaptable a diferentes temas de colore
- Responsive mobile-first
- Accesible (ARIA labels)

INTEGRACIÓN:
- Props: serviceType, availableServices, onBook
- Usa DatePicker existente
- Estilos con CSS modules

Revisa FRONT_END_DEVELOPMENT.md para checklist de QA"
```

## 📚 Recursos Creados

### Para Leer AHORA
1. **`.claude/README.md`** - Índice general y casos de uso
2. **`.claude/GUIA_PROMPTS.md`** - Ejemplos de buenos prompts

### Para Referencia
3. **`.claude/prompts/INSTRUCCIONES_CLAUDE.md`** - Reglas del proyecto
4. **`.claude/prompts/FRONT_END_DEVELOPMENT.md`** - Guías técnicas

### Para Automatizar
5. **`.claude/skills/new-component.md`** - Crear componentes
6. **`.claude/skills/check-consistency.md`** - Verificar calidad

## ✨ Siguiente Nivel

### Ideas para Nuevas Skills
- `/new-page` - Crear landing page completa
- `/optimize-images` - Optimizar assets del proyecto
- `/add-dark-mode` - Agregar dark mode a componente
- `/setup-new-vertical` - Crear nueva app (educación, transporte, etc.)

### Ideas para Documentación
- `DESIGN_TOKENS.md` - Sistema de diseño (colores, spacing)
- `COMPONENT_LIBRARY.md` - Catálogo de componentes
- `PERFORMANCE_GUIDE.md` - Optimizaciones específicas

## 🎉 Felicitaciones

Tu entorno de Claude Code está completamente configurado para:

✅ **Ahorrar tiempo** con skills automáticas
✅ **Mantener calidad** con checklists y guías
✅ **Escalar conocimiento** con documentación
✅ **Onboardear rápido** a nuevos desarrolladores
✅ **Trabajar consistente** entre todas las apps

---

## 🚦 Estado de Setup

```
✅ Configuración básica
✅ Documentación de prompts
✅ Skills personalizadas
✅ Guías técnicas
✅ Ejemplos y templates
✅ Sistema de mantenimiento

🎯 LISTO PARA USAR
```

## 📞 Próximos Pasos

1. **Lee** `.claude/GUIA_PROMPTS.md` (10 min)
2. **Prueba** un prompt mejorado (5 min)
3. **Usa** una skill (5 min)
4. **Actualiza** esta doc con tus aprendizajes

---

**Creado**: 2026-01-22
**Tu primer comando**: `"Lee .claude/README.md y dame un overview"`

¡A codear mejor y más rápido! 🚀

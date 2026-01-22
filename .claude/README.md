# 🤖 Configuración de Claude Code - InnovaTech Demos

Bienvenido al centro de configuración de Claude Code para el proyecto InnovaTech Demos.

## 📚 Índice de Documentación

### ⚠️ CRÍTICO - Leer Primero
- **[REGLAS_CRITICAS.md](./REGLAS_CRITICAS.md)** - ⭐ 7 reglas absolutas del proyecto ⭐
- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Resumen ejecutivo y primeros pasos

### Para Empezar
- **[GUIA_PROMPTS.md](./GUIA_PROMPTS.md)** - Aprende a escribir prompts efectivos
- **[settings.json](./settings.json)** - Configuración principal del proyecto

### Para Claude
- **[prompts/INSTRUCCIONES_CLAUDE.md](./prompts/INSTRUCCIONES_CLAUDE.md)** - Cómo debe comportarse Claude (COMPLETO)
- **[prompts/FRONT_END_DEVELOPMENT.md](./prompts/FRONT_END_DEVELOPMENT.md)** - Guías técnicas de desarrollo

### Skills (Automatización)
- **[skills/new-component.md](./skills/new-component.md)** - Crear componentes consistentes
- **[skills/check-consistency.md](./skills/check-consistency.md)** - Verificar consistencia entre apps
- **[skills/README.md](./skills/README.md)** - Cómo usar y crear skills

## 🚀 Quick Start

### Primera vez usando Claude Code en este proyecto

1. **⚠️ LEE LAS REGLAS CRÍTICAS** (5 min):
   ```
   "Abre y lee .claude/REGLAS_CRITICAS.md"
   ```

2. **Haz que Claude lea las instrucciones**:
   ```
   "Lee .claude/prompts/INSTRUCCIONES_CLAUDE.md para entender el proyecto"
   ```

3. **Lee la guía de prompts**:
   ```
   "Abre y lee .claude/GUIA_PROMPTS.md"
   ```

4. **Empieza a trabajar**:
   ```
   "Necesito crear un componente Card para [descripción...]"
   ```

### 🔴 7 Reglas Absolutas (Memorizar)

1. 🌍 **English everywhere** (código, textos, commits)
2. 🎨 **Dark/Light mode always** (obligatorio)
3. 📂 **Work in** `D:\Dev\Ecommerce\ProyectosDemo`
4. ✅ **Test before completing** (npm run dev + 10s wait)
5. 🔒 **Ask before commit/push**
6. 📱 **Mobile-first always**
7. 📖 **Read docs first**

**Ver detalles completos**: `.claude/REGLAS_CRITICAS.md`

### Comandos Útiles de Inicio

```bash
# Ver la estructura del proyecto
"Muéstrame la estructura de carpetas del proyecto"

# Entender una app específica
"Explícame cómo está organizada la app de hotelería"

# Verificar consistencia
"Ejecuta el checklist de check-consistency para ver el estado del proyecto"

# Crear algo nuevo
"Usa el flujo de new-component para crear un Hero component"
```

## 📁 Estructura de `.claude/`

```
.claude/
├── README.md                          # Este archivo (índice general)
├── GUIA_PROMPTS.md                   # Cómo escribir buenos prompts
├── settings.json                      # Configuración del proyecto
│
├── prompts/                           # Documentación para Claude
│   ├── README.md                      # Índice de prompts
│   ├── INSTRUCCIONES_CLAUDE.md       # Comportamiento de Claude
│   └── FRONT_END_DEVELOPMENT.md      # Guías técnicas
│
└── skills/                            # Automatizaciones
    ├── README.md                      # Índice de skills
    ├── new-component.md               # Crear componentes
    └── check-consistency.md           # Verificar consistencia
```

## 🎯 Casos de Uso Comunes

### Caso 1: Crear un Componente Nuevo

**Objetivo**: Quiero crear un componente para mostrar testimonios.

**Proceso**:
1. Usa la skill `new-component`
2. Responde las preguntas sobre props y diseño
3. Claude creará el componente siguiendo estándares

**Prompt**:
```
"Necesito crear un componente Testimonial que muestre:
- Foto del cliente
- Nombre y cargo
- Quote/testimonio
- Rating de 5 estrellas

Usa el flujo de new-component y hazlo reutilizable en shared-ui"
```

### Caso 2: Agregar Feature a una Landing

**Objetivo**: Agregar sección de preguntas frecuentes a hotelería.

**Proceso**:
1. Claude lee el código actual
2. Identifica componentes reutilizables
3. Implementa responsive y consistente

**Prompt**:
```
"Agrega una sección de FAQ a la landing de hotelería:

Debe incluir:
- Accordion para cada pregunta
- 6-8 preguntas sobre reservas, políticas, servicios
- Responsive design
- Colores del tema de hotelería
- Datos hardcoded en shared-data

Ubicación: Antes del footer, después de sección de rooms"
```

### Caso 3: Refactorizar Código Duplicado

**Objetivo**: Hay código duplicado entre apps.

**Proceso**:
1. Ejecuta `check-consistency`
2. Revisa el reporte
3. Decide qué refactorizar
4. Claude mueve código a shared packages

**Prompt**:
```
"Ejecuta check-consistency y luego refactoriza el código duplicado
que tenga prioridad alta o media"
```

### Caso 4: Debuggear un Problema

**Objetivo**: Algo no funciona como esperado.

**Proceso**:
1. Describe el problema específicamente
2. Claude investiga el código
3. Identifica el issue
4. Propone solución

**Prompt**:
```
"En la app de salud, el formulario de citas no valida el campo de email:

Esperado: Mostrar error si email es inválido
Actual: Permite enviar sin validar

Archivo: apps/salud/src/components/AppointmentForm.tsx

Revisa por qué no está funcionando la validación"
```

## ⚙️ Configuración Avanzada

### Personalizar Instrucciones

Edita `settings.json` para:
- Cambiar instrucciones personalizadas
- Agregar contexto del proyecto
- Definir reminders

### Crear Skills Personalizadas

1. Crea archivo en `/skills/`
2. Usa el template de `skills/README.md`
3. Documenta el proceso paso a paso
4. Actualiza el índice de skills

### Agregar Nuevos Prompts

1. Crea archivo en `/prompts/`
2. Documenta el conocimiento
3. Actualiza `prompts/README.md`

## 🔄 Mantenimiento

### Cada Semana
- [ ] Revisar si hay nuevos patrones recurrentes
- [ ] Actualizar skills si los procesos cambiaron
- [ ] Agregar nuevos ejemplos a la guía de prompts

### Cada Feature Grande
- [ ] Documentar decisiones importantes
- [ ] Actualizar FRONT_END_DEVELOPMENT.md con nuevos patrones
- [ ] Ejecutar check-consistency

### Cada Mes
- [ ] Revisar toda la documentación
- [ ] Remover contenido obsoleto
- [ ] Agregar nuevas skills útiles

## 📖 Recursos Externos

### Documentación de Claude Code
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Guía oficial de uso](https://docs.anthropic.com/claude-code)

### Aprender Más sobre Prompting
- Ver ejemplos en `GUIA_PROMPTS.md`
- Experimentar con diferentes estilos
- Iterar y mejorar tus prompts

## ❓ FAQ

### ¿Claude recuerda conversaciones anteriores?
No automáticamente. Por eso es importante:
- Usar prompts específicos con contexto
- Referenciar archivos de documentación
- Proveer toda la info necesaria en cada prompt

### ¿Cuándo debo actualizar estos archivos?
- Cuando descubras mejores formas de hacer algo
- Cuando un patrón se repita 3+ veces
- Cuando onboardees a alguien nuevo y le falte info
- Cuando cambien decisiones de arquitectura

### ¿Puedo usar esto en otros proyectos?
¡Sí! Esta estructura es reutilizable:
1. Copia la carpeta `.claude/`
2. Actualiza `settings.json` con tu contexto
3. Reescribe `INSTRUCCIONES_CLAUDE.md` para tu proyecto
4. Adapta las skills a tus necesidades

### ¿Cómo sé si mis prompts son buenos?
Usa el checklist en `GUIA_PROMPTS.md`:
- ¿Es específico?
- ¿Tiene contexto?
- ¿Indica ubicación?
- ¿Explica el objetivo?

Si Claude te hace muchas preguntas de clarificación, tu prompt necesita más detalles.

## 🎓 Próximos Pasos

### Nivel Principiante
1. ✅ Leer `GUIA_PROMPTS.md`
2. ✅ Experimentar con comandos básicos
3. ✅ Usar skills existentes

### Nivel Intermedio
4. ⬜ Personalizar `settings.json`
5. ⬜ Agregar tus propios ejemplos a la guía
6. ⬜ Crear una skill simple

### Nivel Avanzado
7. ⬜ Crear skills complejas
8. ⬜ Contribuir a la documentación
9. ⬜ Optimizar workflows del equipo

## 💡 Tips Finales

**Para obtener los mejores resultados**:
1. 📖 Lee la documentación antes de empezar
2. 🎯 Sé específico en tus solicitudes
3. 🔄 Itera en vez de pedir perfección de una
4. 📝 Documenta lo que aprendas
5. 🤝 Comparte mejoras con el equipo

**Recuerda**:
> "Tiempo invertido en un buen prompt = Tiempo ahorrado en iteraciones"

---

**Mantenido por**: @Chichi
**Última actualización**: 2026-01-22
**Versión**: 1.0

¿Preguntas? ¿Sugerencias? Actualiza esta documentación para que otros también se beneficien.

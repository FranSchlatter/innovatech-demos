# 📋 Documentación de Prompts - InnovaTech Demos

Esta carpeta contiene la documentación y prompts que Claude usará para trabajar mejor en este proyecto.

## 📁 Estructura

### `INSTRUCCIONES_CLAUDE.md`
**Propósito**: Instrucciones específicas de cómo Claude debe comportarse en este proyecto.

**Contiene**:
- Rol y contexto del proyecto
- Reglas generales de desarrollo
- Comportamientos esperados
- Patrones de comunicación
- Errores comunes a evitar

**Cuándo usar**: Claude debe leer este archivo al inicio de cada conversación nueva.

### `FRONT_END_DEVELOPMENT.md`
**Propósito**: Guía técnica de desarrollo front-end para este proyecto.

**Contiene**:
- Principios de desarrollo
- Estructura de código
- Componentes comunes
- Comandos útiles
- Checklist de QA
- Roadmap de features

**Cuándo usar**: Referencia técnica durante el desarrollo.

## 🎯 Cómo Usar Estos Prompts

### Para Ti (Desarrollador)

1. **Inicio de conversación**: Puedes pedirle a Claude que lea estos archivos
   ```
   "Lee las instrucciones en .claude/prompts/ para entender el proyecto"
   ```

2. **Actualización**: Edita estos archivos cuando:
   - Cambien patrones del proyecto
   - Se agreguen nuevas reglas
   - Se definan nuevos estándares
   - Surjan soluciones recurrentes

3. **Nuevos prompts**: Crea archivos específicos para:
   - Componentes específicos (ej: `BOOKING_SYSTEM.md`)
   - Features complejas (ej: `DARK_MODE_IMPLEMENTATION.md`)
   - Guías de diseño (ej: `DESIGN_SYSTEM.md`)

### Para Claude

Claude puede referenciar estos archivos automáticamente o cuando se lo pidas:

```bash
# Ejemplos de uso
"Revisa las instrucciones del proyecto antes de empezar"
"Sigue las guías de FRONT_END_DEVELOPMENT.md"
"Verifica que esto cumpla con nuestros estándares"
```

## 📝 Template para Nuevos Prompts

Cuando crees un nuevo prompt, usa esta estructura:

```markdown
# [Título del Prompt]

## Propósito
[Por qué existe este documento]

## Contexto
[Información de fondo necesaria]

## Reglas/Guías
[Lista de reglas o mejores prácticas]

## Ejemplos
[Ejemplos de código o implementaciones]

## Checklist
[Items verificables]

## Referencias
[Links a otros documentos o recursos]
```

## 🔄 Mantenimiento

### Frecuencia de actualización
- **Semanal**: Revisar si hay nuevos patrones
- **Por feature**: Actualizar cuando implementes algo nuevo importante
- **Por problema**: Documentar soluciones a problemas recurrentes

### Qué documentar
✅ **SÍ documentar**:
- Decisiones de arquitectura
- Patrones que se repiten 3+ veces
- Configuraciones específicas
- Problemas comunes y sus soluciones
- Estándares del equipo

❌ **NO documentar**:
- Código temporal o experimental
- Detalles que cambian constantemente
- Información ya en documentación oficial
- Obviedades del lenguaje/framework

## 🚀 Próximos Prompts Sugeridos

A medida que el proyecto crezca, considera crear:

- `COMPONENT_LIBRARY.md` - Catálogo de componentes reutilizables
- `DESIGN_TOKENS.md` - Sistema de diseño (colores, espaciado, tipografía)
- `API_SIMULATION.md` - Guía para simular APIs en front
- `TESTING_GUIDE.md` - Estrategia de testing
- `PERFORMANCE_CHECKLIST.md` - Optimizaciones específicas
- `DEPLOYMENT.md` - Guía de deploy y configuración

---

**Última actualización**: 2026-01-22
**Mantenedor**: @Chichi

# 🛠️ Skills Personalizadas - InnovaTech Demos

Esta carpeta contiene skills (comandos especializados) personalizadas para este proyecto.

## ¿Qué son las Skills?

Las skills son flujos de trabajo predefinidos que Claude puede ejecutar para tareas recurrentes. Son como "macros" o "scripts" que automatizan procesos comunes del desarrollo.

## Skills Disponibles

### `/new-component`
Crea un nuevo componente siguiendo las mejores prácticas del proyecto.

**Cuándo usar**:
- Al crear cualquier componente nuevo
- Para mantener consistencia en la estructura
- Asegurar responsive design y TypeScript

**Ejemplo**:
```
"Necesito crear un componente Card para mostrar servicios"
```

### `/check-consistency`
Verifica consistencia entre las apps del monorepo.

**Cuándo usar**:
- Antes de agregar features importantes
- Periódicamente para mantener calidad
- Después de trabajar mucho en una sola app
- Para identificar código duplicado

**Ejemplo**:
```
"Verifica que las tres apps mantengan consistencia"
```

## Cómo Usar las Skills

### Opción 1: Llamada Directa (cuando esté implementado)
```bash
/new-component
/check-consistency
```

### Opción 2: Referencia Manual (actual)
```
"Sigue el proceso de new-component para crear un Hero component"
"Ejecuta el checklist de check-consistency"
"Usa la skill new-component pero para un formulario de contacto"
```

## Crear Nuevas Skills

### Template para Nueva Skill

```markdown
# Skill: [Nombre]

**Comando**: `/nombre-skill`

## Descripción
[Qué hace esta skill]

## Cuándo Usar
[Situaciones apropiadas]

## Proceso
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

## Checklist
- [ ] Item 1
- [ ] Item 2

## Ejemplo de Output
[Qué esperar como resultado]
```

### Ideas para Próximas Skills

#### `/new-page`
Crear una nueva landing page completa.
- Estructura base
- Hero section
- Secciones comunes
- Footer
- Configuración de rutas

#### `/optimize-images`
Optimizar todas las imágenes del proyecto.
- Convertir a WebP/AVIF
- Redimensionar según uso
- Implementar lazy loading
- Generar placeholders

#### `/add-dark-mode`
Agregar soporte de dark mode a un componente.
- Detectar modo del sistema
- Variables CSS para colores
- Toggle manual
- Persistencia en localStorage

#### `/mobile-test`
Verificar responsive en un componente/página.
- Probar breakpoints
- Verificar overflow
- Comprobar touch targets
- Validar navegación mobile

#### `/setup-new-vertical`
Configurar una nueva app vertical (ej: educación, transporte).
- Copiar estructura de app existente
- Actualizar package.json
- Agregar scripts de dev/build
- Crear componentes base

#### `/generate-demo-data`
Generar datos de prueba realistas.
- Según el tipo de vertical
- Formato TypeScript tipado
- Colocar en shared-data
- Crear interfaces

#### `/accessibility-check`
Verificar accesibilidad de componentes.
- Semántica HTML
- ARIA labels
- Contraste de colores
- Navegación por teclado
- Screen reader friendly

## Beneficios de las Skills

✅ **Consistencia**: Todos los componentes/páginas siguen el mismo patrón
✅ **Velocidad**: Automatiza tareas repetitivas
✅ **Calidad**: Checklists aseguran que no se olvide nada
✅ **Documentación**: El proceso queda documentado
✅ **Onboarding**: Nuevos devs aprenden el flujo de trabajo

## Mantenimiento

### Actualizar Skills Existentes
Cuando un proceso cambie o mejore:
1. Edita el archivo de la skill
2. Actualiza ejemplos y checklists
3. Agrega notas de la actualización

### Remover Skills Obsoletas
Si una skill ya no es relevante:
1. Mueve a carpeta `/deprecated`
2. Documenta por qué fue removida
3. Actualiza este README

---

**Última actualización**: 2026-01-22
**Total de skills**: 2 activas

## Contribuir

¿Tienes una tarea que repites constantemente?
¡Créala como skill!

1. Documenta el proceso paso a paso
2. Crea el archivo .md en esta carpeta
3. Actualiza este README
4. Comparte con el equipo

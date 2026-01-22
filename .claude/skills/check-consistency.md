# Skill: Verificar Consistencia

**Comando**: `/check-consistency`

## Descripción
Verifica que el código mantenga consistencia entre las diferentes apps del monorepo.

## Qué Verificar

### 1. Estructura de Componentes
- ¿Todas las apps usan la misma estructura de carpetas?
- ¿Los nombres siguen el mismo patrón?
- ¿Los imports están organizados igual?

### 2. Estilos
- ¿Se usa el mismo sistema (CSS modules, styled-components, Tailwind)?
- ¿Los breakpoints responsive son consistentes?
- ¿Las variables de color/spacing están centralizadas?

### 3. Componentes Duplicados
- ¿Hay componentes similares en diferentes apps que deberían estar en shared-ui?
- ¿Se está importando correctamente desde shared packages?

### 4. Código Duplicado
- ¿Hay lógica repetida que debería estar en shared-hooks?
- ¿Data hardcoded que debería centralizarse en shared-data?

### 5. Dependencias
- ¿Las versiones de dependencias son consistentes?
- ¿Se usan las mismas librerías para los mismos propósitos?

### 6. Configuración
- ¿Las configuraciones de build son similares?
- ¿Los scripts npm siguen el mismo patrón?

## Checklist de Verificación

```markdown
## Estructura ✓/✗
- [ ] Carpetas organizadas igual en todas las apps
- [ ] Convención de nombres consistente
- [ ] Imports organizados de la misma forma

## Estilos ✓/✗
- [ ] Sistema de estilos unificado
- [ ] Variables CSS centralizadas
- [ ] Breakpoints responsive iguales
- [ ] Dark mode implementado consistentemente

## Compartición de Código ✓/✗
- [ ] Componentes comunes en shared-ui
- [ ] Hooks reutilizables en shared-hooks
- [ ] Estilos compartidos en shared-styles
- [ ] Data centralizada en shared-data

## Performance ✓/✗
- [ ] Imágenes optimizadas de la misma forma
- [ ] Lazy loading aplicado consistentemente
- [ ] Code splitting similar entre apps

## Accesibilidad ✓/✗
- [ ] Semántica HTML consistente
- [ ] ARIA labels cuando es necesario
- [ ] Contraste de colores adecuado

## TypeScript ✓/✗
- [ ] Tipos compartidos centralizados
- [ ] Configuración tsconfig.json similar
- [ ] No uso de 'any' innecesario
```

## Proceso de Ejecución

1. **Escanear estructura** de `/apps/hoteleria`, `/apps/salud`, `/apps/gastronomia`
2. **Comparar** archivos similares entre apps
3. **Identificar** código duplicado o inconsistencias
4. **Reportar** hallazgos con severidad:
   - 🔴 **Crítico**: Puede causar bugs o problemas
   - 🟡 **Medio**: Afecta mantenibilidad
   - 🟢 **Bajo**: Mejora sugerida

5. **Sugerir** acciones correctivas

## Ejemplo de Output

```
🔍 Verificación de Consistencia - InnovaTech Demos

📁 Estructura
✅ Todas las apps siguen la misma estructura de carpetas
⚠️ hoteleria usa 'components' pero salud usa 'Components' (capitalización)

🎨 Estilos
✅ Todas usan CSS modules
🔴 Breakpoints diferentes:
   - hoteleria: 768px, 1024px
   - salud: 640px, 1024px
   - gastronomia: 768px, 1280px
   Sugerencia: Centralizar en shared-styles

♻️ Código Compartido
🟡 Componente 'Card' duplicado en hoteleria y salud
   Sugerencia: Mover a shared-ui/Card

🟡 Hook 'useScrollAnimation' existe en hoteleria y gastronomia
   Sugerencia: Mover a shared-hooks

✨ Recomendaciones
1. Unificar breakpoints en shared-styles/breakpoints.ts
2. Mover Card a shared-ui
3. Centralizar useScrollAnimation
4. Estandarizar capitalización de carpetas
```

## Acciones Sugeridas

Después de la verificación, ofrecer:
1. Crear issues/todos para cada inconsistencia
2. Refactorizar código duplicado automáticamente
3. Actualizar documentación con estándares encontrados
4. Crear guía de estilo si no existe

## Cuándo Ejecutar

- Antes de agregar nueva feature grande
- Después de trabajar en una app por mucho tiempo
- Periódicamente (semanal/mensual)
- Antes de un release/demo importante
- Al onboardear nuevo desarrollador

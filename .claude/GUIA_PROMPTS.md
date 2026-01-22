# 📝 Guía de Prompts Efectivos para Claude Code

## Introducción

Esta guía te ayudará a comunicarte mejor con Claude para obtener resultados más rápidos y precisos en tu trabajo de desarrollo.

## Principios Fundamentales

### 1. Sé Específico, No Ambiguo

❌ **Malo**:
```
"Mejora el componente Card"
```

✅ **Bueno**:
```
"Agrega un efecto hover al componente Card en shared-ui que:
- Eleve ligeramente la card (box-shadow)
- Transición suave de 0.3s
- Cambie el color del título a azul
- Sea responsive en todos los breakpoints"
```

### 2. Provee Contexto Relevante

❌ **Malo**:
```
"Crea un formulario"
```

✅ **Bueno**:
```
"Crea un formulario de contacto para la app de hotelería que incluya:
- Campos: nombre, email, teléfono, fecha de check-in, mensaje
- Validación con estados de error
- Responsive design
- Estilo consistente con los otros formularios del proyecto
- Debe ir en la sección de contacto de la landing page"
```

### 3. Indica el Alcance

❌ **Malo**:
```
"Arregla los estilos"
```

✅ **Bueno**:
```
"Arregla los estilos del componente Hero en la app de salud:
- Solo en mobile (< 768px)
- El título está cortándose
- El botón CTA está muy cerca del borde
No toques los estilos de tablet/desktop que están funcionando bien"
```

## Patrones de Prompts Efectivos

### Para Crear Componentes

```
"Crea un componente [NOMBRE] en [UBICACIÓN] que:
- [Funcionalidad 1]
- [Funcionalidad 2]
- [Requisitos de diseño]
- [Props que debe recibir]

Debe ser consistente con [REFERENCIA] y reutilizable en [APPS]"
```

**Ejemplo real**:
```
"Crea un componente Testimonial en shared-ui que:
- Muestre foto, nombre, cargo y testimonio de un cliente
- Reciba props: image, name, role, quote
- Tenga una variante con y sin imagen
- Sea responsive (stack en mobile, horizontal en desktop)
- Use los mismos estilos de Card para mantener consistencia"
```

### Para Modificar Código Existente

```
"En el archivo [RUTA], modifica [SECCIÓN] para:
- [Cambio 1]
- [Cambio 2]

Mantén [QUÉ NO CAMBIAR]
Razón: [POR QUÉ ES NECESARIO]"
```

**Ejemplo real**:
```
"En apps/hoteleria/src/components/RoomCard.tsx, modifica la sección de precio para:
- Mostrar precio por noche en grande
- Agregar precio total abajo en gris más pequeño
- Incluir badge de 'Oferta' si tiene descuento

Mantén los botones de reserva y el hover effect actuales
Razón: Los usuarios se confunden con el precio total sin contexto"
```

### Para Debugging

```
"Estoy teniendo un problema con [COMPONENTE/FEATURE]:

Comportamiento esperado: [QUÉ DEBERÍA PASAR]
Comportamiento actual: [QUÉ ESTÁ PASANDO]
Pasos para reproducir:
1. [Paso 1]
2. [Paso 2]

Error (si hay): [MENSAJE DE ERROR]

Ya intenté: [QUÉ YA PROBASTE]"
```

**Ejemplo real**:
```
"Estoy teniendo un problema con el slider de imágenes en la app de gastronomia:

Comportamiento esperado: Las imágenes deberían cambiar automáticamente cada 5 segundos
Comportamiento actual: Solo cambian al hacer click en las flechas
Pasos para reproducir:
1. Abrir la página principal de gastronomía
2. Scroll hasta la galería
3. Esperar 5 segundos

Error: No hay error en consola

Ya intenté: Verificar que el autoplay esté en true en las props"
```

### Para Refactoring

```
"Refactoriza [CÓDIGO/COMPONENTE] porque:
- [Razón 1]
- [Razón 2]

Objetivos:
- [Objetivo 1]
- [Objetivo 2]

Restricciones:
- No cambiar [QUÉ NO TOCAR]
- Mantener compatibilidad con [DEPENDENCIAS]"
```

**Ejemplo real**:
```
"Refactoriza los tres componentes Hero (uno en cada app) porque:
- Tienen 80% de código duplicado
- Los cambios de diseño hay que hacerlos 3 veces
- Dificulta el mantenimiento

Objetivos:
- Crear un Hero compartido en shared-ui
- Permitir personalización por vertical (colores, imágenes)
- Reducir código duplicado
- Mantener flexibilidad para casos únicos

Restricciones:
- No cambiar las props que recibe desde las páginas
- Mantener los mismos breakpoints responsive
- No romper las animaciones actuales"
```

### Para Agregar Features

```
"Agrega [FEATURE] a [DÓNDE]:

Funcionalidad:
- [Qué debe hacer]

Diseño/UX:
- [Cómo debe verse/comportarse]

Integración:
- [Cómo se conecta con lo existente]

Referencias: [Similar a X, inspirado en Y]"
```

**Ejemplo real**:
```
"Agrega un sistema de reservas simple a la landing de hotelería:

Funcionalidad:
- Formulario con: check-in, check-out, adultos, niños, habitación
- Validación de fechas (check-out > check-in)
- Al enviar, mostrar modal de confirmación (no hay backend real)

Diseño/UX:
- Sticky en la parte superior en desktop
- Modal desde abajo en mobile
- Usar los colores del tema de hotelería
- Botón prominente 'Reservar ahora'

Integración:
- Usar el DatePicker de shared-ui
- Seguir el patrón de los otros formularios
- Hardcodear tipos de habitación en shared-data

Referencias: Similar al booking de Airbnb pero más simple"
```

## Comandos Útiles

### Para Exploración

```
"Muéstrame la estructura de carpetas de [DIRECTORIO]"
"¿Qué componentes hay en shared-ui?"
"Busca todos los archivos que usan [HOOK/COMPONENTE]"
"¿Cómo está implementado [FEATURE] en la app de [APP]?"
```

### Para Análisis

```
"Analiza si [COMPONENTE] es reutilizable entre apps"
"Identifica código duplicado entre [APP1] y [APP2]"
"Revisa el performance de [PÁGINA/COMPONENTE]"
"Verifica que [FEATURE] sea responsive"
```

### Para Documentación

```
"Documenta cómo funciona [SISTEMA/COMPONENTE]"
"Agrega comentarios JSDoc a [FUNCIÓN/COMPONENTE]"
"Crea un README para el package [PACKAGE]"
"Actualiza la documentación con [CAMBIOS RECIENTES]"
```

## Errores Comunes en Prompts

### ❌ Demasiado Vago

```
"Haz la app mejor"
"Arregla los bugs"
"Mejora el diseño"
```

**Por qué es malo**: Claude no sabe qué específicamente mejorar.

### ❌ Sin Contexto

```
"Agrega dark mode"
```

**Por qué es malo**: ¿A qué? ¿A todo? ¿A un componente? ¿Cómo debe funcionar?

### ❌ Múltiples Tareas Sin Prioridad

```
"Crea un slider, arregla el footer, cambia los colores, agrega animaciones, optimiza las imágenes y documenta todo"
```

**Por qué es malo**: Demasiado a la vez, sin orden de prioridad.

**Mejor**: Divide en tareas separadas y priorizadas.

### ❌ Asunciones Implícitas

```
"Usa esa librería que vimos antes"
```

**Por qué es malo**: Claude no recuerda conversaciones anteriores automáticamente.

**Mejor**: "Usa Swiper.js (que usamos en la app de hotelería) para el slider"

## Tips Avanzados

### 1. Usa Referencias Visuales

Si tienes un diseño o referencia:
```
"Quiero que el Hero se vea como en [URL] pero adaptado a nuestro estilo"
"Similar al componente X pero con estas diferencias: [LISTA]"
```

### 2. Trabaja Iterativamente

En vez de pedir todo a la vez:

**Primera iteración**:
```
"Crea la estructura base del componente Booking con los campos básicos"
```

**Segunda iteración**:
```
"Ahora agrega validación a los campos"
```

**Tercera iteración**:
```
"Agrega estados de loading y error"
```

### 3. Pide Explicaciones

```
"Explícame por qué elegiste esta solución"
"¿Hay alternativas a este approach?"
"¿Qué trade-offs tiene esta implementación?"
```

### 4. Solicita Revisión

```
"Revisa este componente y sugiere mejoras de performance"
"Verifica que este código siga nuestros estándares del proyecto"
"¿Este código es accesible? ¿Qué falta?"
```

## Checklist de un Buen Prompt

Antes de enviar tu prompt, verifica:

- [ ] ¿Es específico sobre QUÉ quiero?
- [ ] ¿Explica DÓNDE debe hacerse?
- [ ] ¿Indica CÓMO debe verse/funcionar?
- [ ] ¿Menciona restricciones o qué NO cambiar?
- [ ] ¿Provee contexto suficiente?
- [ ] ¿Incluye ejemplos o referencias si es complejo?

## Ejemplos de Prompts Excelentes

### Ejemplo 1: Feature Completa
```
"Necesito agregar un sistema de filtros a la app de gastronomía:

UBICACIÓN:
apps/gastronomia/src/components/MenuFilters.tsx (nuevo)

FUNCIONALIDAD:
- Filtrar por: tipo de comida (entrada, plato, postre, bebida)
- Filtrar por: precio ($ - $$ - $$$)
- Filtrar por: dietary (vegetariano, vegano, sin gluten)
- Los filtros se combinan (AND logic)
- Botón 'Limpiar filtros' cuando hay filtros activos

DISEÑO:
- Horizontal en desktop con chips seleccionables
- Drawer desde abajo en mobile
- Usar los colores del tema de gastronomía
- Animación suave al aparecer

DATOS:
- Los items del menú están en shared-data/gastronomia-menu.ts
- Cada item tiene: type, priceRange, dietaryOptions

INTEGRACIÓN:
- Debe conectarse con MenuList component existente
- Actualizar el state en el parent (MenuSection)
- Usar el hook useFilters que está en shared-hooks

REFERENCIAS:
- El diseño de filtros similar a los de la app de hotelería
- Pero adaptado al tema y colores de gastronomía

TESTING:
- Verificar que funcione con 0 items
- Verificar que funcione con todos los filtros activos
- Mobile responsive essential"
```

### Ejemplo 2: Bug Fix
```
"Hay un bug en el componente ImageGallery de la app de salud:

PROBLEMA:
En mobile, cuando haces click en una imagen para verla en modal,
la imagen aparece cortada y no se puede hacer zoom

ESPERADO:
- Imagen debe verse completa en el modal
- Debe poder hacer pinch-zoom en móvil
- Botón X para cerrar visible siempre

REPRODUCIR:
1. Abrir apps/salud en mobile (< 768px)
2. Ir a sección 'Nuestras Instalaciones'
3. Click en cualquier imagen de la galería
4. Imagen aparece cortada en el top

ARCHIVOS RELACIONADOS:
apps/salud/src/components/ImageGallery.tsx
apps/salud/src/components/ImageModal.tsx

ERROR CONSOLA:
"Warning: Failed to set image dimensions"

CONTEXTO:
- Funciona bien en desktop
- El modal usa react-modal
- Las imágenes son de Unsplash (alta resolución)

YA INTENTÉ:
- Cambiar object-fit a 'contain' (no ayudó)
- Ajustar max-height del modal (parcialmente mejor pero sigue cortado)

SUGERENCIA:
Quizás el issue es con el viewport height en mobile con la barra de navegación"
```

### Ejemplo 3: Mejora Incremental
```
"Quiero mejorar el component RoomCard en hotelería paso a paso:

PASO 1 - ESTE CHAT:
Agregar imagen de fondo con overlay oscuro para mejor legibilidad del texto

Especificaciones:
- La imagen actual (en <img>) debe ser de fondo
- Overlay con opacity 0.3 negro
- Texto sobre el overlay en blanco
- Mantener el tamaño actual de la card (no cambiar layout)

Restricciones:
- NO cambiar props que recibe
- NO modificar el componente padre (RoomList)
- Mantener el hover effect actual

PRÓXIMOS PASOS (para chats futuros):
- Paso 2: Agregar iconos de amenities
- Paso 3: Mejorar la animación de hover
- Paso 4: Lazy loading de imágenes

Solo hacer PASO 1 en este chat"
```

## Recursos Adicionales

### Archivos de Referencia en el Proyecto

Antes de preguntar, considera leer:
- `/.claude/prompts/INSTRUCCIONES_CLAUDE.md` - Comportamiento esperado de Claude
- `/.claude/prompts/FRONT_END_DEVELOPMENT.md` - Guías técnicas
- `/README.md` - Overview del proyecto
- `/DEVELOPMENT.md` - Setup y desarrollo

### Prompts para Leer Documentación

```
"Lee el archivo .claude/prompts/INSTRUCCIONES_CLAUDE.md para entender el proyecto"
"Revisa la documentación en FRONT_END_DEVELOPMENT.md antes de empezar"
"Basándote en nuestras guías de desarrollo, ¿cómo implementarías [FEATURE]?"
```

## Conclusión

**Recuerda**:
- Más detalles = Mejores resultados
- Contexto es clave
- Referencias ayudan muchísimo
- Iteración es mejor que perfección inmediata
- Cuando dudes, sé más específico

**La fórmula**:
```
QUÉ quiero + DÓNDE va + CÓMO debe ser + Por QUÉ (opcional) = Prompt perfecto
```

---

¿Tienes dudas sobre cómo estructurar un prompt?
Revisa los ejemplos de esta guía o pregunta directamente:

"¿Cómo debería pedirte que [TU TAREA]?"

# 🏨 ANÁLISIS DE HOTELES PREMIUM - PATRONES DE DISEÑO Y UX

## Sitios Analizados
- Rosewood Hong Kong
- Four Seasons Bangkok  
- Capella Bangkok
- Passalacqua (Italia)
- Cheval Blanc (Lujo francés)
- Meliá (Cadena española)
- Palladio Hotel (Buenos Aires)

---

## 🎯 PATRONES CLAVE IDENTIFICADOS

### 1. **HERO SECTION**
✓ Video/Carousel full-screen o semi-full
✓ Subtítulo poético/emotivo NO marketing
✓ CTA secundario (NO prominent)
✓ Tipografía GRANDE, serif, elegante
✓ Espaciado generoso (aire)

**Ejemplos:**
- Passalacqua: "Oh beloved places, I have found you" (poesia, no features)
- Cheval Blanc: "Célébrant l'art de vivre à la française"
- Capella: "Let your heart meander the river"

### 2. **NAVEGACIÓN**
✓ Minimalista, máx 5-6 items
✓ Ubicación TOP o STICKY pero subtle
✓ Logo/brand + Links + Booking button
✓ NO muchas opciones visibles
✓ Dropdown menus cuando sea necesario

**Estructura típica:**
```
Logo | Home | Rooms | Dining | Experiences | [BOOK NOW] | Language
```

### 3. **ROOMS SECTION**
✓ NO grid de 3 columnas inmediatamente
✓ Filtros OCULTOS o como tabs elegantes
✓ Primero una CATEGORÍA HERO de suite/villa
✓ Luego catálogo completo
✓ HIGH RES images (full screen al hover)
✓ Descriptions poéticas, no feature lists

**Layout típico:**
```
Headline + Subtitle POÉTICO
    ↓
Hero Room/Suite (imagen full width + description)
    ↓
Filtro por tipo (tabs elegantes)
    ↓
Grid 2-3 columnas de rooms
```

### 4. **INFORMACIÓN DE HABITACIONES**
Cada room tiene:
✓ Nombre elegante (no "Deluxe Room #5")
✓ Tamaño en m² (dato importante)
✓ Capacidad de huéspedes
✓ Lista corta de highlights (3-4)
✓ Precio POR NOCHE (destacado)
✓ CTA: "Discover More" / "View Details"
✓ NO detalles técnicos aburridos

**Evitar:**
✗ "WiFi, AC, TV, Baño"
✗ Listas largas de amenities

**Ejemplo bueno:**
"Spacious residentially styled guestrooms from 61 sqm, with floor-to-ceiling windows and outdoor living spaces to enjoy a front-row seat to the Chao Phraya river"

### 5. **AMENITIES / FACILITIES**
✓ Mostradas como "Moods" o "Experiences"
✓ NO lista de checkboxes
✓ Imagen hero grande POR AMENITY
✓ Descripción corta narrativa
✓ CTA por cada una: "Discover", "Reserve"
✓ MÁXIMO 6-8 amenities mostradas

**Estructura:**
```
Spa by Guerlain
├── Imagen 50% width
├── "A Sanctuary of Tranquility"
└── Description poética
```

### 6. **DINING/GASTRONOMÍA**
✓ Secciones SEPARADAS por restaurante/bar
✓ Chef/concepto destacado
✓ Premios Michelin si aplica
✓ CTA: "Reserve" + "Details"
✓ Fotos de comidas, no del restaurante

### 7. **TESTIMONIOS/REVIEWS**
✓ Mostrados como "Voices" o "Stories"
✓ NO sistema de rating stars obligatorio
✓ Quotes auténticas
✓ Nombre + contexto breve
✓ Verified badge

**Mejor que:**
```
☆☆☆☆☆ "Amazing hotel!"
```

**Es:**
```
"I've lived here my whole life... but I never get tired of looking at the lake."
— Beppe the Boatman
✓ VERIFIED
```

### 8. **AWARDS/RECONOCIMIENTOS**
✓ Si existen, mostrar en una sección dedicada
✓ Logos reconocibles (Forbes, World's 50 Best, Michelin, etc.)
✓ NO inventar premios
✓ Ubicación: después de experiencias, antes de contact

### 9. **CONTACT/BOOKING**
✓ Booking integrado (sin popup)
✓ Date picker visual
✓ "Check availability" button
✓ También mostrar: tel + email + dirección
✓ WhatsApp link (soporte)
✓ NO formulario genérico largo

### 10. **COLOR & TYPOGRAPHY**
✓ Paleta 3-4 colores máximo
✓ Background: blanco/off-white/crema
✓ Tipografía serif para headings (elegancia)
✓ Sans-serif para body (legibilidad)
✓ Mucho aire/whitespace (NO cluttered)
✓ Imágenes GRANDES (80% de visual)

---

## 📐 ESTRUCTURA GENERAL DE PÁGINA

```
1. NAVBAR
   - Sticky, background translúcido
   
2. HERO SECTION
   - Full screen o 70vh
   - Video/carousel automático
   - Headline poético
   - Booking widget (sticky on scroll)

3. ABOUT / CONCEPT
   - Párrafo corto narrativo
   - "Founded in 18th century..."
   - 1-2 imágenes contextuales

4. ROOMS/ACCOMMODATION
   - Categor íada hero first
   - Tabs de filtrado
   - Grid 2-3 columnas
   - Each card con imagen + description + CTA

5. AMENITIES/FACILITIES
   - 6-8 items max
   - Cada uno: 50% imagen + 50% texto
   - Alternancia left/right

6. DINING
   - Por restaurante/bar separado
   - Imagen + nombre + chef + descripción

7. EXPERIENCES/ACTIVITIES
   - Tours, classes, events
   - Similar a amenities

8. TESTIMONIALS
   - Quotes de huéspedes/viajeros
   - Sin rating obligatorio

9. AWARDS
   - Logos si existen

10. FOOTER
    - Contact info
    - Links útiles
    - Newsletter
    - Social media
    - Legal

11. BOOKING WIDGET
    - Sticky / Fixed bottom
    - Puede ser flotante corner
    - Dates + adults + [CHECK]
```

---

## 🎨 ESTÉTICA GENERAL

### Colores
- **Fondo**: Blanco (#FFFFFF) o Crema (#F9F7F4)
- **Primary**: Gris oscuro (#2C2C2C) o Marrón (#3D3D3C)
- **Accent**: Gold/Champagne (#D4AF37) o Color location (ocean blue para playa, etc.)
- **Text**: Gris charcoal (#444444)

### Tipografía
- **Headings**: Serif (Playfair Display, Didot, Cormorant, Lora)
- **Body**: Sans-serif limpio (Montserrat, Inter, Poppins)
- **Tamaños**: H1 48-64px, H2 32-40px, Body 14-16px

### Espaciado
- Secciones separadas por 80-120px gap
- Márgenes internos generosos (40-60px)
- Cards con padding 24-32px

### Imágenes
- 80% de la página son imágenes
- Calidad ALTÍSIMA (no comprimir)
- Aspect ratios: 16:9 (paisaje), 1:1 (cuadrado), 2:3 (portrait)
- Hover: zoom suave 5-10% or overlay gradient

---

## ❌ EVITAR A TODO COSTO

✗ Grids de 4+ columnas
✗ Muchos botones/CTAs competing
✗ Listas de features/amenities tipo "checkbox"
✗ Pop-ups de booking
✗ Autoplay de música
✗ Loading animations
✗ "Book Now" en TODOS lados
✗ Demasiado texto (párrafos largos)
✗ Colores neón o muy saturados
✗ Formularios complejos
✗ 404 pages sin estilo

---

## 📱 RESPONSIVE

- **Mobile**: Stack vertical, 1 columna
- **Tablet**: 2 columnas max
- **Desktop**: 2-3 columnas, hero full width
- Booking widget: Sticky bottom en mobile, side en desktop
- Menu: Hamburger en mobile

---

## 🚀 ESTRUCTURA RECOMENDADA PARA NUESTRO HOTELERÍA

```
/hoteleria
├── HeroCarousel (full screen, poético)
├── AboutHotel (historia + contexto)
├── RoomsShowcase
│   ├── HeroRoom (featured suite)
│   ├── RoomFilters (tabs)
│   └── RoomGrid (2-3 cols)
├── AmenitiesCarousel (6-8 items, left/right layout)
├── ExperiencesTours (4-6 items, grid elegante)
├── DiningSection (restaurantes separados)
├── TestimonialsSlider (carousel, quotes bonitos)
├── AwardsShowcase (si existen)
├── BookingWidget (sticky)
└── Footer (contact, newsletter, social)
```

---

## 💡 INSIGHTS FINALES

1. **Menos es más**: Meliá muestra 15 items, Capella muestra 3 habitaciones destacadas
2. **Imágenes son el 80%**: Texto es secundario
3. **CTA subtle**: "Discover More", "View Details", "Reserve" - NO "BOOK NOW" en rojo
4. **Poesía > Features**: "Let your heart meander" > "Includes WiFi, AC, TV"
5. **Narrativa clara**: Cada sección una "historia" no una lista
6. **Awards importan**: Mostrar Michelin, Forbes, World's 50 Best si existen
7. **Mobile first pero desktop es hero**: Diseño primero en desktop, luego adaptable
8. **Velocidad visual**: Usuarios escanean, no leen - headers grandes, claros
9. **Booking siempre visible**: Sticky o fixed, pero nunca hidden
10. **Autenticidad**: Reviews/voices genuinas, no fake 5-stars everywhere

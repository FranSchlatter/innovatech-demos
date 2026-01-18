# Guía de URLs de Imágenes - Hotelería App

## Formatos Soportados

Las imágenes en la app hotelería pueden venir de cualquier URL pública. Aquí están los formatos más comunes:

### 1. **Unsplash** (Recomendado)
```
https://images.unsplash.com/photo-[ID]?w=800&q=80
```
**Ejemplo:**
```json
"image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
```

**Parámetros útiles:**
- `w=800` - Ancho (recomendado: 500-1600)
- `q=80` - Calidad (0-100)
- `auto=format` - Optimiza automáticamente
- `fit=crop` - Recorta la imagen

---

### 2. **Pixabay**
```
https://cdn.pixabay.com/photo/[RUTA]/[NOMBRE]_[TAMAÑO].jpg
```
**Ejemplo:**
```json
"image": "https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg"
```

**Tamaños disponibles:**
- `_640.jpg` - 640px
- `_960.jpg` - 960px
- `_1280.jpg` - 1280px (Recomendado)

---

### 3. **Pexels**
```
https://images.pexels.com/photos/[ID]/[NOMBRE].jpeg?w=800
```
**Parámetros:**
- `w=800` - Ancho
- `h=600` - Alto

---

## Dónde Actualizar las URLs

### Archivos JSON en `packages/shared-data/`:

1. **rooms.json** - Imágenes de habitaciones
   ```json
   "image": "https://..."
   ```

2. **reviews.json** - No usa imágenes pero tiene autores

3. **tours.json** - Imágenes de tours

4. **dishes.json** - Imágenes de platos

### Componentes JSX:

1. **HeroCarousel.jsx** - Slides del hero
   ```jsx
   image: "https://images.unsplash.com/photo-...",
   ```

2. **HotelAbout.jsx** - Imágenes alternadas
   ```jsx
   const images = [
     'https://...',
     'https://...',
     'https://...'
   ]
   ```

---

## Recomendaciones

✅ **Hacer:**
- Usar URLs HTTPS
- Usar imágenes de alta calidad (ancho mínimo 500px)
- Optimizar parámetros (w, q, fit)
- Probar URLs antes de commitear

❌ **Evitar:**
- URLs HTTP (inseguras)
- Imágenes muy grandes sin parámetros (lentitud)
- URLs rotas o expiradas

---

## Ejemplo Completo

**rooms.json:**
```json
{
  "id": 1,
  "name": "Luxury Suite",
  "price": 350,
  "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  "amenities": ["WiFi", "AC", "TV"]
}
```

**Alternativa Pixabay:**
```json
{
  "id": 2,
  "name": "Deluxe Room",
  "price": 280,
  "image": "https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg",
  "amenities": ["WiFi", "AC", "TV"]
}
```

---

**Última actualización:** Enero 2026

# Contribuyendo a InnovaTech Demos

## 🚀 Workflow

1. **Branch**: Siempre en `master` (no feature branches)
2. **Commits**: Solo `feat:` o `fix:` prefix
3. **Push**: Directo a `master` después de probar localmente
4. **Deploy**: Automático a Vercel via GitHub

## 📋 Pasos antes de hacer Push

```bash
# 1. Asegúrate que los cambios funcionan localmente
npm run dev:hoteleria   # Prueba la app
npm run dev:salud
npm run dev:gastronomia

# 2. Build para producción
npm run build:hoteleria

# 3. Git commit
git add .
git commit -m "feat: description of your changes"

# 4. Push
git push origin master
```

## 🛠️ Estructura de cambios por tipo

### Si cambias **datos** (JSON)
```bash
git add packages/shared-data/*.json
git commit -m "feat: add new rooms to hoteleria demo"
```

### Si cambias **componentes compartidos**
```bash
git add packages/shared-ui/
git commit -m "feat: add testimonials section to shared components"
```

### Si cambias **tema/estilos globales**
```bash
git add packages/shared-styles/
git commit -m "feat: update color palette for better contrast"
```

### Si cambias **una app específica**
```bash
git add apps/hoteleria/
git commit -m "feat: add room filter by price to hoteleria"
```

## ✅ Checklist antes de Push

- [ ] `npm install` (si agregaste dependencias)
- [ ] App corre sin errores: `npm run dev:SERVICE`
- [ ] Build exitoso: `npm run build:SERVICE`
- [ ] Responsive design (375px, 768px, 1280px)
- [ ] Dark mode funciona (toggle en navbar)
- [ ] No hay console errors
- [ ] Commit message es `feat:` o `fix:`

## 🚀 Deployment

Push a `master` → GitHub Actions → Vercel auto-deploy

Cada app deploy independently:
- `hoteleria-demo.vercel.app`
- `salud-demo.vercel.app`
- `gastronomia-demo.vercel.app`

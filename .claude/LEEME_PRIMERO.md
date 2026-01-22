# 👋 ¡BIENVENIDO A LA CONFIGURACIÓN DE CLAUDE CODE!

## 🎯 ¿Nuevo Chat? EMPIEZA AQUÍ

### ⚡ ACCIÓN INMEDIATA:

1. **Abre**: `COPY_PASTE_PROMPT.txt`
2. **Copia** todo el contenido (Ctrl+A, Ctrl+C)
3. **Pega** en tu nuevo chat con Claude
4. **¡Listo!** Claude ya conoce todas las reglas

---

## 📂 Archivos Importantes

### 🔴 CRÍTICOS (Leer Hoy)
- **`COPY_PASTE_PROMPT.txt`** ← ⭐ EMPEZAR AQUÍ - Prompt para copiar
- **`REGLAS_CRITICAS.md`** ← Las 7 reglas absolutas
- **`INICIO_RAPIDO.md`** ← Guía rápida de 5 minutos

### 📖 REFERENCIA (Leer Esta Semana)
- **`README.md`** ← Índice completo de la configuración
- **`GUIA_PROMPTS.md`** ← Cómo escribir mejores prompts
- **`EJEMPLOS_PRACTICOS.md`** ← Ejemplos de código correcto/incorrecto

### ⚙️ PARA CLAUDE
- **`prompts/INSTRUCCIONES_CLAUDE.md`** ← Comportamiento completo
- **`prompts/FRONT_END_DEVELOPMENT.md`** ← Guías técnicas
- **`settings.json`** ← Configuración del proyecto

### 🛠️ AUTOMATIZACIÓN
- **`skills/new-component.md`** ← Crear componentes
- **`skills/check-consistency.md`** ← Verificar consistencia

---

## 🚀 Quick Start (3 Pasos)

### Paso 1: Copia el Prompt (30 segundos)
```bash
# Opción A: Abrir archivo
code .claude/COPY_PASTE_PROMPT.txt

# Opción B: Copiar directo (PowerShell)
Get-Content .claude\COPY_PASTE_PROMPT.txt | clip
```

### Paso 2: Pegar en Nuevo Chat
Abre Claude Code y pega el prompt. Claude responderá algo como:
```
"I've read all the configuration files and understand the 7 critical rules.
I'm ready to work on the InnovaTech Demos project following all guidelines.
What would you like me to help you with?"
```

### Paso 3: Empezar a Trabajar
```
"Necesito crear un componente Hero para la app de hotelería"
```

---

## 🎨 Reglas Rápidas (Memorizar)

```
1. 🌍 English everywhere (código, textos, commits)
2. 🎨 Dark/Light mode always (todos los componentes)
3. 📂 D:\Dev\Ecommerce\ProyectosDemo (ubicación correcta)
4. ✅ Test before complete (npm run dev + 10s)
5. 🔒 Ask before commit/push (siempre preguntar)
6. 📱 Mobile-first always (320px → 768px → 1024px)
7. 📖 Read docs first (antes de cada tarea)
```

**Detalle completo**: Ver `REGLAS_CRITICAS.md`

---

## 🎨 Colores por App

```
Hotelería:  Brown/Bronze  (#8B7355, #A0826D)
Salud:      Teal/Green    (#20B2AA, #008B8B)
Gastronomía: (Por definir)
```

---

## 📚 Rutas de Aprendizaje

### 🟢 Nivel 1: Principiante (Primera Semana)
```
Día 1: ✅ COPY_PASTE_PROMPT.txt + REGLAS_CRITICAS.md
Día 2: ✅ INICIO_RAPIDO.md + Probar 2-3 prompts
Día 3: ✅ GUIA_PROMPTS.md (ejemplos)
Día 4: ✅ EJEMPLOS_PRACTICOS.md
Día 5: ✅ Crear primer componente siguiendo reglas
```

### 🟡 Nivel 2: Intermedio (Segunda Semana)
```
- Personalizar settings.json
- Usar skills (new-component, check-consistency)
- Crear tu primera skill personalizada
- Documentar patrones que descubras
```

### 🔴 Nivel 3: Avanzado (Mes 1)
```
- Optimizar workflow completo
- Crear 3+ skills personalizadas
- Contribuir a documentación
- Entrenar a otros devs
```

---

## 💡 Tips Pro

### Guardar Tiempo
```bash
# Crear alias (PowerShell profile)
function Start-Claude {
    Get-Content D:\Dev\Ecommerce\ProyectosDemo\.claude\COPY_PASTE_PROMPT.txt | clip
    Write-Host "✅ Prompt copiado! Pégalo en Claude Code" -ForegroundColor Green
}

# Usar:
Start-Claude
```

### VS Code Snippet
```json
{
  "Claude Init": {
    "prefix": "claude-start",
    "body": [
      "Read: .claude/REGLAS_CRITICAS.md, .claude/prompts/INSTRUCCIONES_CLAUDE.md",
      "Rules: English always, Dark/Light always, Mobile-first, Test first, Ask before commit",
      "Ready?"
    ]
  }
}
```

---

## ❓ FAQ Rápido

**P: ¿Tengo que copiar el prompt SIEMPRE?**
R: Sí, en cada chat nuevo. Claude no recuerda conversaciones anteriores.

**P: ¿Puedo usar la versión corta del prompt?**
R: Sí, si ya trabajaste antes. Ver `PROMPT_INICIO.md` para versiones.

**P: ¿Qué hago si Claude no sigue las reglas?**
R: Recordárselas: "Please follow the 7 critical rules from REGLAS_CRITICAS.md"

**P: ¿Puedo modificar la configuración?**
R: ¡Sí! Estos archivos son tuyos. Actualízalos según evolucione el proyecto.

**P: ¿Cómo defino el color de Gastronomía?**
R: Dile a Claude: "Gastronomy theme color should be [COLOR]" y él actualizará la config.

---

## 🎯 Próximos Pasos

### Ahora Mismo (5 min):
- [ ] Lee este archivo completo (casi terminas!)
- [ ] Abre `COPY_PASTE_PROMPT.txt`
- [ ] Copia el contenido
- [ ] Abre un chat nuevo con Claude
- [ ] Pega el prompt
- [ ] ¡Empieza a trabajar!

### Hoy (30 min):
- [ ] Lee `REGLAS_CRITICAS.md`
- [ ] Revisa `EJEMPLOS_PRACTICOS.md`
- [ ] Prueba crear algo pequeño

### Esta Semana:
- [ ] Lee `GUIA_PROMPTS.md`
- [ ] Usa las 2 skills
- [ ] Define color de Gastronomía
- [ ] Crea tu primer componente perfecto

---

## 📞 Recursos

```
📂 Documentación Completa:  .claude/README.md
📋 Reglas del Proyecto:     .claude/REGLAS_CRITICAS.md
📖 Guía de Prompts:         .claude/GUIA_PROMPTS.md
💡 Ejemplos de Código:      .claude/EJEMPLOS_PRACTICOS.md
⚙️  Configuración:           .claude/settings.json
```

---

## ✨ Resumen Visual

```
┌─────────────────────────────────────────┐
│  🎯 INICIO RÁPIDO                       │
├─────────────────────────────────────────┤
│  1. Copia: COPY_PASTE_PROMPT.txt       │
│  2. Pega en chat nuevo                  │
│  3. Trabaja siguiendo 7 reglas         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📚 APRENDER MÁS                        │
├─────────────────────────────────────────┤
│  → REGLAS_CRITICAS.md                   │
│  → GUIA_PROMPTS.md                      │
│  → EJEMPLOS_PRACTICOS.md                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🛠️ REFERENCIA                          │
├─────────────────────────────────────────┤
│  → README.md (índice completo)          │
│  → prompts/ (documentación)             │
│  → skills/ (automatización)             │
└─────────────────────────────────────────┘
```

---

## 🎉 ¡Estás Listo!

Tu setup de Claude Code está **100% completo** y listo para usar.

**Siguiente acción**: Abre `COPY_PASTE_PROMPT.txt` y cópialo.

---

**Última actualización**: 2026-01-22
**Versión**: 1.0
**Estado**: ✅ Producción

**¿Dudas?** Lee `README.md` o pregúntale a Claude después de copiar el prompt de inicio.

**¡Happy coding!** 🚀

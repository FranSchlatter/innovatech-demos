# 🚀 Prompt de Inicio para Nuevos Chats

Copia y pega este prompt al inicio de cada nueva conversación con Claude Code:

---

## 📋 PROMPT PARA COPIAR

```
Hi Claude! Please read and understand the project configuration before we start:

1. Read .claude/REGLAS_CRITICAS.md - These are the 7 absolute rules
2. Read .claude/prompts/INSTRUCCIONES_CLAUDE.md - Complete instructions
3. Read .claude/prompts/FRONT_END_DEVELOPMENT.md - Technical guidelines

Key project rules (summary):
- 🌍 ALL code, text, and comments in ENGLISH
- 🎨 Dark/Light mode MANDATORY in all components
- 📂 Work in D:\Dev\Ecommerce\ProyectosDemo (NOT .claude-worktrees)
- ✅ Always test with 'npm run dev' before completing tasks
- 🔒 ASK before commits/pushes
- 📱 Mobile-first ALWAYS
- 📖 Read docs BEFORE starting any task

Theme colors:
- Hotelería: Brown/Bronze (#8B7355, #A0826D)
- Salud: Teal/Green (#20B2AA, #008B8B)
- Gastronomía: (TBD - ask me)

Ready to start working following these rules?
```

---

## 📝 Versión en Español (Alternativa)

```
¡Hola Claude! Por favor lee y entiende la configuración del proyecto antes de empezar:

1. Lee .claude/REGLAS_CRITICAS.md - Las 7 reglas absolutas
2. Lee .claude/prompts/INSTRUCCIONES_CLAUDE.md - Instrucciones completas
3. Lee .claude/prompts/FRONT_END_DEVELOPMENT.md - Guías técnicas

Reglas clave del proyecto (resumen):
- 🌍 TODO el código, textos y comentarios en INGLÉS
- 🎨 Dark/Light mode OBLIGATORIO en todos los componentes
- 📂 Trabajar en D:\Dev\Ecommerce\ProyectosDemo (NO en .claude-worktrees)
- ✅ Siempre testear con 'npm run dev' antes de completar tareas
- 🔒 PREGUNTAR antes de commits/pushes
- 📱 Mobile-first SIEMPRE
- 📖 Leer docs ANTES de empezar cualquier tarea

Colores temáticos:
- Hotelería: Marrón/Bronce (#8B7355, #A0826D)
- Salud: Verde-Azulado (#20B2AA, #008B8B)
- Gastronomía: (#E67E22, ...)

¿Listo para trabajar siguiendo estas reglas?
```

---

## 🎯 Versión Ultra-Corta (Si tienes prisa)

```
Read: .claude/REGLAS_CRITICAS.md, .claude/prompts/INSTRUCCIONES_CLAUDE.md

Rules: English always, Dark/Light mode always, Mobile-first, Test before complete, Ask before commit.
Work in: D:\Dev\Ecommerce\ProyectosDemo

Ready?
```

---

## 💡 Tips de Uso

### Cuándo Usar Cada Versión:

**Versión Completa en Inglés**:
- Primera vez con Claude Code
- Después de mucho tiempo sin usar
- Para proyectos importantes

**Versión en Español**:
- Prefieres comunicarte en español
- Mismo caso que versión en inglés

**Versión Ultra-Corta**:
- Ya trabajaste antes con el proyecto
- Necesitas un recordatorio rápido
- Claude ya conoce las reglas

### Variaciones Según la Tarea:

**Si vas a crear componentes nuevos**:
```
[Prompt de inicio]

Today I need to create new components. Please also review:
- .claude/skills/new-component.md
- packages/shared-ui structure
```

**Si vas a refactorizar**:
```
[Prompt de inicio]

Today I'm refactoring code. Please also:
- Run .claude/skills/check-consistency.md
- Look for duplicated code across apps
```

**Si es tu primera tarea del día**:
```
[Prompt de inicio]

This is my first task today. Please:
1. Verify we're in D:\Dev\Ecommerce\ProyectosDemo
2. Check git status
3. Remind me of pending tasks (if any)
```

---

## 🔄 Actualizar Este Prompt

Si cambias reglas o agregas nuevas, actualiza este archivo:

```bash
# Editar prompt
code .claude/PROMPT_INICIO.md

# O pedir a Claude:
"Actualiza PROMPT_INICIO.md para incluir [NUEVA REGLA]"
```

---

## 📌 Atajos Recomendados

### Crear Snippet en tu Editor:

**VS Code** (snippets):
```json
{
  "Claude Init Prompt": {
    "prefix": "claude-init",
    "body": [
      "Read: .claude/REGLAS_CRITICAS.md, .claude/prompts/INSTRUCCIONES_CLAUDE.md",
      "",
      "Rules: English always, Dark/Light mode always, Mobile-first, Test before complete, Ask before commit.",
      "Work in: D:\\Dev\\Ecommerce\\ProyectosDemo",
      "",
      "Ready?"
    ]
  }
}
```

**Guardar en Portapapeles** (Windows):
```bash
# PowerShell
Get-Content .claude\PROMPT_INICIO.md -Raw | clip

# Ahora solo Ctrl+V en el chat
```

---

## ✨ Bonus: Prompts Especializados

### Para Debugging:
```
[Prompt de inicio]

I have a bug in [COMPONENT/FEATURE].
Please read the relevant code before we start debugging.
```

### Para Nueva Feature:
```
[Prompt de inicio]

I need to add [FEATURE] to [APP].
Please check if similar functionality exists in other apps first.
```

### Para Review:
```
[Prompt de inicio]

Please review [COMPONENT/FILE] and suggest improvements following our standards.
```

---

**Última actualización**: 2026-01-22
**Versión**: 1.0

**Tip**: Guarda este archivo en favoritos o créale un atajo para acceso rápido!

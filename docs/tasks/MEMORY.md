# InnovaTech Demos - Memory

## Project Owner
Francisco "Panchi" Schlatter, Santa Fe, Argentina.

## Key Files
- `ANALISIS-DEMOS.html` — Full visual audit for owner review (browser). Includes market research + demo strategy
- `memory/hoteleria-tasks.md` — 25 numbered tasks (H1-H25), self-contained, one per session
- `memory/inmobiliaria-tasks.md` — 26 numbered tasks (I1-I26), self-contained, one per session
- `memory/hoteleria-roadmap.md` — Checklist-style roadmap with owner decisions (reference)
- `memory/inmobiliaria-roadmap.md` — Checklist-style roadmap with owner decisions (reference)

## Workflow
- Owner says "hace la H3" or "hace la I5" → read the task file → start immediately
- One task per session at HIGH QUALITY. Close window, open new one for next task
- Tasks are calibrated: ~1-4 hrs each, all context included (files, subtasks, criteria)
- Always verify in dev server (port 3001 hoteleria, 3004 inmobiliaria) before marking done
- Some tasks have dependencies noted (e.g., I17 requires I12 first)

## Owner Preferences
- Communicate in Spanish (Argentine)
- Code/variables/commits in English
- Ask before committing/pushing
- Prefers HTML for analysis docs (easy to view in browser)
- Wants demos oriented as SHOWCASES for selling services (not just landing pages)
- Reference: Pixel/pxsol as inspiration for demo presentation style (hoteleria)
- Reference: Lebane Mexico as inspiration for inmobiliaria demo
- Owner admits limited knowledge of real estate industry needs — research before building

## Current App Status (Sept 2026)
- Hoteleria: 88% complete, has bugs to fix, major expansion planned
- Inmobiliaria: visually 92% but owner says "plantilla visual sin funcionalidades". Needs major interactivity overhaul. Portal needs 3 roles (interesado/inquilino/propietario)
- Salud: exists but not analyzed yet in detail
- Gastronomia: exists but not analyzed yet in detail

## Architecture Notes
- No React Router, uses viewMode state pattern in App.jsx
- All data hardcoded/mock, no backend
- Admin data persists in localStorage
- Shared packages: shared-ui (Navbar, Footer, GuidedTour, VirtualTour360), shared-hooks (useDarkMode, useCart), shared-styles, shared-data

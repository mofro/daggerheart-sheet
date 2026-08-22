# Phase 0 — Strip complete / Phase 1 ready to start

## What this commit represents

The Pathfinder 1e domain content has been removed. What remains is the
Obsidian plugin infrastructure from Wayfinder (MIT):

- Plugin entry point, view registration, settings, `data.json` storage
- Preact + @preact/signals reactive UI framework and common components
- esbuild + Sass build system
- Rules-note-linking architecture (`src/components/rules/`, `src/rules/`)
- Inventory/equipment panel structure
- Sidebar tab layout and CSS scaffold

## ⚠ TypeScript compilation is intentionally broken here

The following modules were deleted and their import sites in the remaining
files still reference them. This is the expected Phase 0 state — Phase 1
replaces them with Daggerheart equivalents.

Deleted calc modules (referenced from `src/calc/index.ts`):
- `src/calc/ac.ts` → replace with evasion + threshold calc
- `src/calc/attacks.ts` → replace with Hope/Fear roll builder
- `src/calc/class-stats.ts` → replace with tier/feature resolver
- `src/calc/saves.ts` → (no saves in Daggerheart; remove)
- `src/calc/skills.ts` → replace with trait modifier calc
- `src/calc/spells.ts` → replace with domain card resolver
- `src/calc/maneuvers.ts` → remove
- `src/calc/xp.ts` → replace with XP-mark advancement tracker
- `src/calc/encumbrance.ts` → remove or simplify
- `src/calc/forge.ts` → remove

Deleted data modules (referenced across components and main.ts):
- `src/data/classes/` → replace with Daggerheart class data
- `src/data/races/` → replace with ancestry + community data
- `src/data/archetypes/` → replace with subclass data
- `src/data/buffs.ts`, `src/data/companion.ts`, etc. → remove
- `src/spells/`, `src/maneuvers/` → remove
- `src/import/legacy-import.ts` → remove or repurpose for vault import

Deleted UI (referenced from App.tsx and views):
- `src/components/skills/SkillsTab.tsx` → replace with TraitsTab
- `src/components/spells*/` → replace with ClassTab (domain cards)
- `src/components/maneuvers/` → remove
- `src/components/spelldb/`, `src/components/maneuverdb/` → remove
- `src/components/adjust/` → remove or repurpose
- `src/components/equipdb/ForgePanel.tsx` → remove

## Phase 1 checklist

- [ ] Define `DaggerheartCharacter` schema in `src/types/character.ts`
- [ ] Write `src/calc/daggerheart.ts` (trait mods, evasion, derived values)
- [ ] Write `src/data/daggerheart/classes.ts` (core + Hope & Fear)
- [ ] Write `src/data/daggerheart/ancestries.ts` (core + H&F + Tarim-Shaiel)
- [ ] Write `src/data/daggerheart/domains.ts` (all domains including Dread)
- [ ] Wire new schema through store, settings, migrations
- [ ] TypeScript must compile cleanly before Phase 1 is closed

## Key design decisions made

- Tab layout: Combat | Traits | Class | Gear | Rules
- Data model: derived values never stored (same principle as wayfinder)
- Rules-note-linking: keep intact, pointed at Daggerheart notes in vault
- Hope/Fear tracking: at-table view, primary focus of Combat tab
- Tarim-Shaiel ancestries: seeded in Phase 3 data layer

See GitHub issue #286 for full spec.

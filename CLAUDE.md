# Daggerheart Sheet — Claude Code Instructions

## What This Project Is

An Obsidian sidebar plugin for Daggerheart characters. Forked from Wayfinder PF1e (MIT). Tech stack: Preact + @preact/signals, TypeScript, SCSS, esbuild, Obsidian Plugin API.

Plugin ID: `minisheet`. Release workflow: BRAT-compatible GitHub releases triggered by a bare semver tag (no `v` prefix) matching `manifest.json`.

---

## Git Workflow

**No direct pushes to `main`.** All work goes through a feature branch and PR, regardless of whether the session is running locally or through the Claude harness. The only exception is truly trivial chores (typo in a comment, CLAUDE.md update) — everything touching source, SCSS, or config uses a branch.

Branch naming: `feat/issue-N-short-description` or `fix/issue-N-short-description`.

Commit format:
```
type(#N): what changed

Examples:
  fix(#5): allow negative modifier entry via text input
  feat(#6): vault note links on Connections entries
```

**Push triggers:** after any commit that represents a discrete, stable unit of work. Always before ending a session. Open a PR immediately after pushing — draft is fine.

---

## Issue Discipline

**Issue-first.** Before implementing anything non-trivial: file a GitHub issue with background, implementation checklist, open questions, and reference files. The issue is the spec.

**Triage rule — "code looks correct" is not enough.** When an issue appears already resolved by reading the source, verify with the reporter before closing. A constraint in the code (`min={-5}`) does not mean the UX works — the input type, browser environment, or interaction model may still produce the reported problem. Ask first, close only after confirmation.

---

## Build

```bash
bun install
bun run build        # dev build
bun run build:prod   # production build (used by release workflow)
```

Output: `main.js`, `styles.css`, `manifest.json` — copy all three into `<vault>/.obsidian/plugins/daggerheart-sheet/`.

---

## Release

Tag with the exact version in `manifest.json` (no `v` prefix). The GitHub Actions workflow (`bun audit --production`, `bun run build:prod`, GitHub release with assets) fires on any pushed tag.

---

## Key Source Paths

| Path | Purpose |
|---|---|
| `src/components/config/ConfigSurface.tsx` | Config panel — all six rail sections |
| `src/types/daggerheart.ts` | Character schema, trait/domain/connection types |
| `src/types/data-file.ts` | Plugin settings shape (`DaggerheartSettings`) |
| `src/state/store.ts` | Single source of truth; `updateCharacter`, `updateSettings` |
| `src/modals.ts` | `VaultNotePicker`, `CharacterPickModal`, etc. |
| `src/settings.ts` | Obsidian settings tab |
| `scss/` | SCSS partials; `main.scss` is the entry point |
| `.github/workflows/release.yml` | BRAT release pipeline |

---

## Hard Constraints

- Do NOT push directly to `main` for source changes — branch + PR always
- Do NOT close an issue based solely on reading the code — verify the UX works
- Do NOT add `v` prefix to release tags — BRAT requires bare semver
- Do NOT run `playwright install` — Chromium is pre-installed at `/opt/pw-browsers/chromium`

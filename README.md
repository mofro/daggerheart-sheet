# Daggerheart Sheet

A Daggerheart character sheet that lives in Obsidian's right sidebar. Keeps
Hope/Fear tracking, HP and Stress marks, Evasion and damage thresholds,
class features by tier, domain cards, and gear — beside your campaign notes,
optimised for one-handed use on an iPad at the table.

Rules text stays as ordinary Markdown notes in your vault; the sheet links to
them from the relevant places.

> **Status: Phase 0 (skeleton).** The Pathfinder 1e content from the upstream
> Wayfinder plugin has been stripped. Phase 1 (Daggerheart schema + calc layer)
> is next. The plugin does not compile yet — see `PHASE0-STATUS.md`.

---

## Planned features

### Combat tab (at-table view)
- Hope token tracker — tap to spend or gain, max derived from class feature
- HP marks row (bubbles, tap to mark/clear) + Short/Long rest buttons
- Stress marks row
- Evasion value + Damage Thresholds (Minor / Major / Severe)
- Active conditions grid (Vulnerable, Restrained, Hidden, Slowed…)
- Hope Feature shortcut card (class-specific)

### Traits tab
Six Daggerheart traits — Agility, Strength, Finesse, Instinct, Presence,
Knowledge — with base values, computed modifiers, and a notes field.

### Class tab
Subclass, tier, Foundation / Specialization / Mastery feature cards, and the
two domain card lists — each card links to its vault note where one exists.

### Gear tab
Primary weapon, secondary weapon, armor, and a carried-items list.

### Rules tab
Link vault notes (abilities, class features, domain card text, ancestry
traits) to the relevant places on the sheet. Searchable, pinnable. Compatible
with the [Carrel](https://github.com/alas-poor-ophelia/carrel) plugin.

---

## Storage

Character data is held in the plugin's own `data.json` and travels with the
vault, so Daggerheart Sheet works with Obsidian Sync.

---

## Attribution

Built on [Wayfinder](https://github.com/alas-poor-ophelia/wayfinder) by
alas, poor ophelia (MIT License). See `ATTRIBUTION.md`.

Daggerheart is published by Darrington Press LLC under the
[Darrington Press Community Gaming License](https://www.darringtonpress.com/license).
This is an independent fan tool, not affiliated with or endorsed by Darrington
Press or Critical Role.

---

## License

MIT — see `LICENSE`.

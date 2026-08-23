# Daggerheart Sheet

An Obsidian sidebar plugin for [Daggerheart](https://www.darringtonpress.com/daggerheart) characters. Keeps Hope/Fear tracking, HP and Stress marks, Evasion and damage thresholds, class features by tier, domain cards, gear, and character config — beside your campaign notes, optimised for one-handed use at the table.

Rules text lives as ordinary Markdown notes in your vault; domain cards link to them from the sheet.

---

## Features

### Combat tab
- Hope token tracker and Fear counter
- HP marks row + Short Rest (clears stress) and Long Rest (restores HP to max, clears stress)
- Stress marks row
- Evasion shield + Damage Thresholds (Minor / Major / Severe)
- Active condition chips — Vulnerable, Hidden, Restrained, Frightened, Disadvantaged — with optional notes
- Hope Feature collapsible card (shown when set; edit it in the Class tab)
- Weapons quick-reference

### Traits tab
Six Daggerheart traits — Agility, Strength, Finesse, Instinct, Presence, Knowledge — with base scores and modifiers.

### Class tab
Subclass, tier, Foundation / Specialization / Mastery / Hope Feature / Extra Features cards, ancestry and community features, and domain-card summaries.

### Equipment tab
Primary weapon, secondary weapon, armor, gold tracker (handfuls / bags / chests), and a carried-items list with inline add/remove.

### Config panel
Six-section rail: **Identity** (name, pronouns, description, ancestry, community, class, subclass, level) · **Traits** · **Defenses** · **Domains** (cards with optional vault-note links) · **Connections** · **Danger** (two-step character delete).

### Rules tab
Link vault notes via [Carrel](https://github.com/alas-poor-ophelia/carrel) (when installed) or keep a reference list.

---

## Install

### Via BRAT (recommended for early access)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) from the Obsidian community plugin browser.
2. Open BRAT settings → **Add Beta Plugin** → paste `mofro/daggerheart-sheet`.
3. Enable **Daggerheart Sheet** in Settings → Community plugins.

BRAT will notify you when new releases are available.

### Manual install

1. Go to [Releases](https://github.com/mofro/daggerheart-sheet/releases) and download `main.js`, `styles.css`, and `manifest.json` from the latest release.
2. Create the folder `<your-vault>/.obsidian/plugins/daggerheart-sheet/`.
3. Copy the three files into that folder.
4. In Obsidian: Settings → Community plugins → reload the list → enable **Daggerheart Sheet**.

### Build from source

```bash
git clone https://github.com/mofro/daggerheart-sheet.git
cd daggerheart-sheet
bun install
bun run build
```

Copy `main.js`, `styles.css`, and `manifest.json` into your vault's plugin folder as above.

---

## Storage

Character data is held in the plugin's own `data.json` and travels with the vault, so Daggerheart Sheet works with Obsidian Sync.

---

## Attribution

Built on [Wayfinder](https://github.com/alas-poor-ophelia/wayfinder) by alas, poor ophelia (MIT License). See `ATTRIBUTION.md`.

Daggerheart is published by Darrington Press LLC under the
[Darrington Press Community Gaming License](https://www.darringtonpress.com/license).
This is an independent fan tool, not affiliated with or endorsed by Darrington Press or Critical Role.

---

## License

MIT — see `LICENSE`.

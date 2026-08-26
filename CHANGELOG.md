# Changelog

## 0.2.2

**Trait dropdown width** — trait score dropdowns in the Config panel (Agility, Strength, Finesse, etc.) are now sized to their content. Previously the selects had a 120 px minimum width and overflowed into the adjacent label text when a value was selected. They are now 72 px wide, matching other compact numeric controls.

---

## 0.2.1

**Trait validation fixes** — Config panel trait dropdowns now behave correctly:
- Dropdowns correctly show `0` as a selectable value (previously the option was invisible).
- Deselecting a trait (returning to the blank pick state) releases its value back to the pool so other fields can use it.
- Only traits the player has explicitly touched participate in pool validation; untouched fields never show a red border.
- Modifier fields select all text on focus so typing immediately replaces the existing value.

**Class domain autofill** — selecting a class in Identity now automatically fills both domain slots from the class's starting domains (Core Rulebook and Hope & Fear classes). Domains can still be changed manually afterward.

---

## 0.2.0

**Evasion autofill** — selecting a standard Daggerheart class in the Config panel now automatically sets the base evasion value from the class table. Custom classes leave the field unchanged. Evasion can always be overridden manually.

**Trait array distribution** — trait score dropdowns in the Config panel now enforce the Daggerheart standard array (+2, +1, +1, 0, 0, −1). The pool is computed symmetrically: if more traits claim a value than the array allows, all conflicting fields show a red border. Validation is deferred until at least one trait is set to a non-zero value, so fresh characters open without any red fields. Clicking Done with an incomplete or invalid distribution shows an amber warning banner and highlights the fields that need attention; Close anyway bypasses it.

---

## 0.1.0

Initial release of Daggerheart Sheet — an Obsidian sidebar plugin for Daggerheart characters.

**Combat tab**
- HP, Stress, and Hope pip trackers
- Evasion shield + damage thresholds (Minor / Major / Severe)
- Condition chips (Vulnerable, Hidden, Restrained, Frightened, Disadvantaged) with optional notes
- Hope Feature quick-ref card (collapsible, shown when set)
- Weapons quick-reference
- Short Rest (clears stress) and Long Rest (restores HP to max, clears stress) buttons

**Equipment tab**
- Primary and secondary weapon blocks (name, trait, range, damage, feature)
- Armor block (name, evasion bonus, feature)
- Gold tracker (handfuls / bags / chests)
- Inventory list with add / remove items

**Traits tab**
- Trait scores and modifiers

**Class tab**
- Class features, Foundation, Specialization, Mastery
- Hope Feature field
- Ancestry and community features
- Domain cards and connections read-out

**Config panel**
- Rail-based character configuration: Identity, Traits, Defenses, Domains, Connections, Danger
- Two-step delete with confirmation

**Rules tab**
- Vault-note links via Carrel (when installed) or barebones reference list

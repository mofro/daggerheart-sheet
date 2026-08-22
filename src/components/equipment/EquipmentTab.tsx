import type MiniSheetPlugin from "../../main";
import type { MiniSheetStore } from "../../state/store";
import type { CharacterRecord } from "../../types/character";
import type { DaggerheartComputed } from "../../calc";
import type { WeaponEntry, ArmorEntry } from "../../types/daggerheart";
import { TRAITS, WEAPON_RANGES } from "../../types/daggerheart";

function WeaponBlock({
  label,
  weapon,
  onChange,
}: {
  label: string;
  weapon: WeaponEntry;
  onChange: (patch: Partial<WeaponEntry>) => void;
}) {
  return (
    <div class="ms-dh-weapon-block">
      <div class="ms-dh-weapon-block__label">{label}</div>
      <div class="ms-dh-weapon-block__row">
        <input
          class="ms-dh-weapon-block__name"
          type="text"
          placeholder="Weapon name"
          value={weapon.name}
          onInput={(e) => onChange({ name: (e.target as HTMLInputElement).value })}
          aria-label={`${label} name`}
        />
        <select
          class="ms-dh-weapon-block__select"
          value={weapon.trait}
          onChange={(e) => onChange({ trait: (e.target as HTMLSelectElement).value as WeaponEntry["trait"] })}
          aria-label={`${label} trait`}
        >
          <option value="">— trait</option>
          {TRAITS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div class="ms-dh-weapon-block__row">
        <input
          class="ms-dh-weapon-block__damage"
          type="text"
          placeholder="Damage (e.g. d8+3)"
          value={weapon.damage}
          onInput={(e) => onChange({ damage: (e.target as HTMLInputElement).value })}
          aria-label={`${label} damage`}
        />
        <select
          class="ms-dh-weapon-block__select"
          value={weapon.range}
          onChange={(e) => onChange({ range: (e.target as HTMLSelectElement).value as WeaponEntry["range"] })}
          aria-label={`${label} range`}
        >
          <option value="">— range</option>
          {WEAPON_RANGES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      {weapon.name && (
        <textarea
          class="ms-dh-weapon-block__feature"
          placeholder="Weapon feature…"
          value={weapon.feature}
          rows={2}
          onInput={(e) => onChange({ feature: (e.target as HTMLTextAreaElement).value })}
          aria-label={`${label} feature`}
        />
      )}
    </div>
  );
}

function ArmorBlock({
  armor,
  onChange,
}: {
  armor: ArmorEntry;
  onChange: (patch: Partial<ArmorEntry>) => void;
}) {
  return (
    <div class="ms-dh-armor-block">
      <div class="ms-dh-weapon-block__label">Armor</div>
      <div class="ms-dh-weapon-block__row">
        <input
          class="ms-dh-weapon-block__name"
          type="text"
          placeholder="Armor name"
          value={armor.name}
          onInput={(e) => onChange({ name: (e.target as HTMLInputElement).value })}
          aria-label="Armor name"
        />
        <div class="ms-dh-armor-block__score">
          <label class="ms-dh-armor-block__score-label">+Evasion</label>
          <input
            type="number"
            min={0}
            max={10}
            value={armor.baseScore}
            onChange={(e) => onChange({ baseScore: parseInt((e.target as HTMLInputElement).value, 10) || 0 })}
            aria-label="Armor evasion bonus"
          />
        </div>
      </div>
      {armor.name && (
        <textarea
          class="ms-dh-weapon-block__feature"
          placeholder="Armor feature…"
          value={armor.feature}
          rows={2}
          onInput={(e) => onChange({ feature: (e.target as HTMLTextAreaElement).value })}
          aria-label="Armor feature"
        />
      )}
    </div>
  );
}

export function EquipmentTab({
  store,
  character,
}: {
  plugin: MiniSheetPlugin;
  store: MiniSheetStore;
  character: CharacterRecord;
  computed: DaggerheartComputed;
}) {
  const id = character.id;
  const patch = (p: Partial<CharacterRecord>) => store.updateCharacter(id, p);

  return (
    <div class="ms-dh-equipment-tab">

      {/* Weapons */}
      <WeaponBlock
        label="Primary weapon"
        weapon={character.primaryWeapon}
        onChange={(p) => patch({ primaryWeapon: { ...character.primaryWeapon, ...p } })}
      />
      <WeaponBlock
        label="Secondary weapon"
        weapon={character.secondaryWeapon}
        onChange={(p) => patch({ secondaryWeapon: { ...character.secondaryWeapon, ...p } })}
      />

      {/* Armor */}
      <ArmorBlock
        armor={character.armor}
        onChange={(p) => patch({ armor: { ...character.armor, ...p } })}
      />

      {/* Gold */}
      <div class="ms-dh-gold">
        <div class="ms-dh-gold__label">Gold</div>
        <div class="ms-dh-gold__row">
          {(["handfuls", "bags", "chests"] as const).map((denom) => (
            <div key={denom} class="ms-dh-gold__denom">
              <input
                type="number"
                min={0}
                value={character.gold[denom]}
                onChange={(e) =>
                  patch({
                    gold: {
                      ...character.gold,
                      [denom]: parseInt((e.target as HTMLInputElement).value, 10) || 0,
                    },
                  })
                }
                aria-label={`Gold ${denom}`}
              />
              <span class="ms-dh-gold__denom-label">{denom}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory */}
      <div class="ms-dh-inventory">
        <div class="ms-dh-inventory__label">Inventory</div>
        {character.inventory.map((item, idx) => (
          <div key={item.id} class="ms-dh-item">
            <span class="ms-dh-item__qty">×{item.quantity}</span>
            <span class="ms-dh-item__name">{item.name}</span>
            {item.description && (
              <span class="ms-dh-item__desc">{item.description}</span>
            )}
            <button
              class="ms-dh-item__remove"
              aria-label={`Remove ${item.name}`}
              onClick={() =>
                patch({
                  inventory: character.inventory.filter((_, i) => i !== idx),
                })
              }
            >
              ×
            </button>
          </div>
        ))}
        {character.inventory.length === 0 && (
          <div class="ms-dh-inventory__empty">No items</div>
        )}
      </div>

    </div>
  );
}

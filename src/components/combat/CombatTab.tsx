import { useState } from "preact/hooks";
import type { DaggerheartComputed } from "../../calc";
import type MiniSheetPlugin from "../../main";
import type { MiniSheetStore } from "../../state/store";
import type { CharacterRecord } from "../../types/character";

/** Standard Daggerheart conditions from the Core Rulebook. */
const CONDITIONS = [
  "Vulnerable",
  "Hidden",
  "Restrained",
  "Frightened",
  "Disadvantaged",
] as const;

interface PipTrackerProps {
  label: string;
  count: number;
  max: number;
  modifier?: string;
  onSet: (n: number) => void;
}

function PipTracker({ label, count, max, modifier, onSet }: PipTrackerProps) {
  return (
    <div class="ms-resource ms-dh-pip-tracker">
      <div class="ms-resource__label">{label}</div>
      <div class="ms-resource__pips">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            class={`ms-pip${i < count ? " is-filled" : ""}`}
            aria-label={`${label} ${i + 1} of ${max}`}
            onClick={() => onSet(i < count ? i : i + 1)}
          />
        ))}
      </div>
      {modifier !== undefined && (
        <div class="ms-resource__footer">{count} / {max}</div>
      )}
    </div>
  );
}

export function CombatTab({
  store,
  character,
  computed,
}: {
  plugin: MiniSheetPlugin;
  store: MiniSheetStore;
  character: CharacterRecord;
  computed: DaggerheartComputed;
}) {
  const id = character.id;
  const [showCondNotes, setShowCondNotes] = useState(false);

  const activeConditions = Object.values(character.conditions).filter(Boolean).length;

  return (
    <div class="ms-combat ms-dh-combat">

      {/* Vitals: HP, Stress, Hope */}
      <div class="ms-dh-vitals">
        <PipTracker
          label="HP"
          count={character.hpCurrent}
          max={character.hpMax}
          modifier="show"
          onSet={(n) => store.setHp(id, n)}
        />
        <PipTracker
          label="Stress"
          count={character.stressCurrent}
          max={character.stressMax}
          modifier="show"
          onSet={(n) => store.setStress(id, n)}
        />
        <PipTracker
          label="Hope"
          count={character.hopeCurrent}
          max={6}
          modifier="show"
          onSet={(n) => store.setHope(id, n)}
        />
      </div>

      {/* Defenses: Evasion + Damage Thresholds */}
      <div class="ms-dh-defenses">
        <div class="ms-dh-evasion">
          <div class="ms-dh-evasion__value">{computed.evasion}</div>
          <div class="ms-dh-evasion__label">Evasion</div>
        </div>
        <div class="ms-dh-thresholds">
          <div class="ms-dh-threshold">
            <span class="ms-dh-threshold__value">{character.thresholdMinor}</span>
            <span class="ms-dh-threshold__label">Minor</span>
          </div>
          <div class="ms-dh-threshold">
            <span class="ms-dh-threshold__value">{character.thresholdMajor}</span>
            <span class="ms-dh-threshold__label">Major</span>
          </div>
          <div class="ms-dh-threshold">
            <span class="ms-dh-threshold__value">{character.thresholdSevere}</span>
            <span class="ms-dh-threshold__label">Severe</span>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div class="ms-dh-conditions">
        <div class="ms-dh-conditions__chips">
          {CONDITIONS.map((cond) => {
            const active = !!character.conditions[cond];
            return (
              <button
                key={cond}
                class={`ms-dh-condition${active ? " is-active" : ""}`}
                onClick={() => store.toggleCondition(id, cond)}
              >
                {cond}
              </button>
            );
          })}
        </div>
        {(showCondNotes || character.conditionNotes) ? (
          <textarea
            class="ms-dh-condition-notes"
            value={character.conditionNotes}
            placeholder="Condition notes…"
            rows={2}
            onInput={(e) =>
              store.updateCharacter(id, {
                conditionNotes: (e.target as HTMLTextAreaElement).value,
              })
            }
          />
        ) : (
          activeConditions > 0 && (
            <button
              class="ms-dh-condition-notes__add"
              onClick={() => setShowCondNotes(true)}
            >
              + notes
            </button>
          )
        )}
      </div>

      {/* Weapons quick-reference */}
      {(character.primaryWeapon.name || character.secondaryWeapon.name) && (
        <div class="ms-dh-weapons">
          {character.primaryWeapon.name && (
            <div class="ms-dh-weapon">
              <span class="ms-dh-weapon__name">{character.primaryWeapon.name}</span>
              {character.primaryWeapon.damage && (
                <span class="ms-dh-weapon__damage">{character.primaryWeapon.damage}</span>
              )}
            </div>
          )}
          {character.secondaryWeapon.name && (
            <div class="ms-dh-weapon">
              <span class="ms-dh-weapon__name">{character.secondaryWeapon.name}</span>
              {character.secondaryWeapon.damage && (
                <span class="ms-dh-weapon__damage">{character.secondaryWeapon.damage}</span>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

import type { DaggerheartComputed } from "../../calc";
import type MiniSheetPlugin from "../../main";
import type { MiniSheetStore } from "../../state/store";
import type { CharacterRecord } from "../../types/character";
import { TRAITS, TRAIT_LABELS } from "../../types/daggerheart";
import type { TraitKey } from "../../types/daggerheart";

/** Signed modifier string: +2, -1, +0. */
function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

/** Single trait row: label | base score (editable) | computed modifier. */
function TraitRow({
  traitKey,
  base,
  modifier,
  onBaseChange,
}: {
  traitKey: TraitKey;
  base: number;
  modifier: number;
  onBaseChange: (n: number) => void;
}) {
  const label = TRAIT_LABELS[traitKey];
  return (
    <div class="ms-dh-trait">
      <span class="ms-dh-trait__label">{label}</span>
      <input
        class="ms-dh-trait__base"
        type="number"
        min={-5}
        max={10}
        value={base}
        aria-label={`${label} base score`}
        onChange={(e) => {
          const v = parseInt((e.target as HTMLInputElement).value, 10);
          if (!isNaN(v)) onBaseChange(v);
        }}
      />
      <span class="ms-dh-trait__mod">{signedMod(modifier)}</span>
    </div>
  );
}

export function TraitsTab({
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

  return (
    <div class="ms-dh-traits-tab">

      {/* Character identity line */}
      <div class="ms-dh-identity">
        <span class="ms-dh-identity__class">
          {character.className || "—"}
          {character.subclassName ? ` / ${character.subclassName}` : ""}
        </span>
        <span class="ms-dh-identity__sep" aria-hidden="true">·</span>
        <span class="ms-dh-identity__tier">Tier {computed.tier}</span>
        <span class="ms-dh-identity__sep" aria-hidden="true">·</span>
        <span class="ms-dh-identity__level">Lv {character.level}</span>
      </div>

      {/* Six trait rows */}
      <div class="ms-dh-traits">
        <div class="ms-dh-traits__header">
          <span />
          <span class="ms-dh-traits__col-label">Score</span>
          <span class="ms-dh-traits__col-label">Mod</span>
        </div>
        {TRAITS.map((key) => (
          <TraitRow
            key={key}
            traitKey={key}
            base={character.traits[key]}
            modifier={computed.traitMods[key]}
            onBaseChange={(n) =>
              store.updateCharacter(id, {
                traits: { ...character.traits, [key]: n },
              })
            }
          />
        ))}
      </div>

      {/* XP marks toward next advancement */}
      <div class="ms-dh-xp">
        <span class="ms-dh-xp__label">XP marks</span>
        <div class="ms-dh-xp__pips">
          {Array.from({ length: 6 }, (_, i) => (
            <button
              key={i}
              class={`ms-pip${i < character.xpMarks ? " is-filled" : ""}`}
              aria-label={`XP mark ${i + 1}`}
              onClick={() =>
                store.updateCharacter(id, {
                  xpMarks: i < character.xpMarks ? i : i + 1,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Ancestry + community */}
      {(character.ancestry || character.community) && (
        <div class="ms-dh-heritage">
          {character.ancestry && (
            <span class="ms-dh-heritage__item">{character.ancestry}</span>
          )}
          {character.ancestry && character.community && (
            <span class="ms-dh-heritage__sep" aria-hidden="true">·</span>
          )}
          {character.community && (
            <span class="ms-dh-heritage__item">{character.community}</span>
          )}
        </div>
      )}

    </div>
  );
}

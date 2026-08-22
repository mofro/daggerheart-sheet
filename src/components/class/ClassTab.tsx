import type MiniSheetPlugin from "../../main";
import type { MiniSheetStore } from "../../state/store";
import type { CharacterRecord } from "../../types/character";
import type { DaggerheartComputed } from "../../calc";

/** Expandable textarea section with a label. */
function FeatureSection({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div class="ms-dh-feature">
      <div class="ms-dh-feature__label">{label}</div>
      <textarea
        class="ms-dh-feature__text"
        value={value}
        placeholder={placeholder}
        rows={3}
        onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
      />
    </div>
  );
}

export function ClassTab({
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
    <div class="ms-dh-class-tab">

      {/* Class features */}
      <FeatureSection
        label="Class features"
        value={character.classFeatures}
        placeholder="Shared class features…"
        onChange={(v) => patch({ classFeatures: v })}
      />

      <FeatureSection
        label="Foundation"
        value={character.foundationFeature}
        placeholder="Foundation feature (levels 1–3)…"
        onChange={(v) => patch({ foundationFeature: v })}
      />

      <FeatureSection
        label="Specialization"
        value={character.specializationFeature}
        placeholder="Specialization feature (levels 4–7)…"
        onChange={(v) => patch({ specializationFeature: v })}
      />

      <FeatureSection
        label="Mastery"
        value={character.masteryFeature}
        placeholder="Mastery feature (levels 8–10)…"
        onChange={(v) => patch({ masteryFeature: v })}
      />

      <FeatureSection
        label="Hope Feature"
        value={character.hopeFeature}
        placeholder="What happens when you spend Hope…"
        onChange={(v) => patch({ hopeFeature: v })}
      />

      {/* Extra features */}
      {character.extraFeatures.map((feat, idx) => (
        <FeatureSection
          key={idx}
          label={feat.label || `Extra feature ${idx + 1}`}
          value={feat.text}
          placeholder="Feature text…"
          onChange={(v) => {
            const next = [...character.extraFeatures];
            next[idx] = { ...feat, text: v };
            patch({ extraFeatures: next });
          }}
        />
      ))}

      {/* Domain badges */}
      {(character.domains[0] || character.domains[1]) && (
        <div class="ms-dh-domains">
          <div class="ms-dh-domains__label">Domains</div>
          <div class="ms-dh-domains__chips">
            {character.domains.filter(Boolean).map((d) => (
              <span key={d} class="ms-dh-domain-chip">{d}</span>
            ))}
          </div>
        </div>
      )}

      {/* Domain cards */}
      {character.domainCards.length > 0 && (
        <div class="ms-dh-domain-cards">
          <div class="ms-dh-domain-cards__label">Domain cards</div>
          {character.domainCards.map((card, idx) => (
            <div key={idx} class="ms-dh-domain-card">
              <span class="ms-dh-domain-card__name">{card.name}</span>
              {card.domain && (
                <span class="ms-dh-domain-card__domain">{card.domain}</span>
              )}
              {card.notes && (
                <div class="ms-dh-domain-card__notes">{card.notes}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ancestry + community features */}
      <FeatureSection
        label="Ancestry features"
        value={character.ancestryFeatures}
        placeholder="Ancestry features…"
        onChange={(v) => patch({ ancestryFeatures: v })}
      />

      <FeatureSection
        label="Community feature"
        value={character.communityFeature}
        placeholder="Community feature…"
        onChange={(v) => patch({ communityFeature: v })}
      />

      {/* Connections */}
      {character.connections.length > 0 && (
        <div class="ms-dh-connections">
          <div class="ms-dh-connections__label">Connections</div>
          {character.connections.map((conn, idx) => (
            <div key={idx} class="ms-dh-connection">
              <span class="ms-dh-connection__name">{conn.characterName}</span>
              {conn.description && (
                <span class="ms-dh-connection__desc">{conn.description}</span>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

import { useState, useEffect } from "preact/hooks";
import type MiniSheetPlugin from "../../main";
import { VaultNotePicker } from "../../modals";
import type { MiniSheetStore } from "../../state/store";
import type { CharacterRecord } from "../../types/character";
import {
  TRAITS,
  TRAIT_LABELS,
  DOMAINS,
  type DomainCardEntry,
  type Connection,
  type DomainName,
} from "../../types/daggerheart";
import {
  ANCESTRIES,
  COMMUNITIES,
  CLASSES,
  SUBCLASSES,
  CLASS_EVASION,
  type ClassName,
} from "../../data/daggerheart";

type Section =
  | "identity"
  | "traits"
  | "defenses"
  | "domains"
  | "connections"
  | "danger";

interface SectionProps {
  c: CharacterRecord;
  upd: (patch: Partial<CharacterRecord>) => void;
}

// ── Rail icons — Lucide-style inline SVGs ──

const IC = (children: preact.ComponentChildren) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    {children}
  </svg>
);

const IconUser = () =>
  IC(<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></>);

const IconBars = () =>
  IC(<>
    <rect x="4" y="14" width="3" height="6" rx="1" />
    <rect x="10.5" y="9" width="3" height="11" rx="1" />
    <rect x="17" y="4" width="3" height="16" rx="1" />
  </>);

const IconShield = () =>
  IC(<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />);

const IconLayers = () =>
  IC(<>
    <polygon points="12 2 22 8.5 12 15 2 8.5" />
    <polyline points="2 14.5 12 21 22 14.5" />
    <polyline points="2 11.5 12 18 22 11.5" />
  </>);

const IconUsers = () =>
  IC(<>
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" />
  </>);

const IconTrash = () =>
  IC(<>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </>);

const IconX = () =>
  IC(<path d="M18 6L6 18M6 6l12 12" />);

const IconLink = () =>
  IC(<>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </>);

const IconBack = () =>
  IC(<>
    <polyline points="15 18 9 12 15 6" />
  </>);

const RAIL_ITEMS = [
  { id: "identity" as const, label: "Identity", Icon: IconUser },
  { id: "traits" as const, label: "Traits", Icon: IconBars },
  { id: "defenses" as const, label: "Defenses", Icon: IconShield },
  { id: "domains" as const, label: "Domains", Icon: IconLayers },
  { id: "connections" as const, label: "Connections", Icon: IconUsers },
  { id: "danger" as const, label: "Danger", Icon: IconTrash },
];

// ── Input helpers ──

function strVal(e: Event): string {
  return (e.target as HTMLInputElement | HTMLTextAreaElement).value;
}

function intVal(e: Event, { min = -Infinity, max = Infinity, fallback = 0 } = {}): number {
  const v = parseInt((e.target as HTMLInputElement).value);
  return isNaN(v) ? fallback : Math.max(min, Math.min(max, v));
}

function SignedIntInput({
  value,
  min = -Infinity,
  max = Infinity,
  onChange,
  class: cls,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
  class?: string;
}) {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => {
    const parsed = parseInt(raw);
    if (isNaN(parsed) || parsed !== value) {
      setRaw(String(value));
    }
  }, [value]);

  return (
    <input
      class={cls}
      type="text"
      inputmode="numeric"
      value={raw}
      onInput={e => {
        const s = (e.target as HTMLInputElement).value;
        setRaw(s);
        const n = parseInt(s);
        if (!isNaN(n)) {
          onChange(Math.max(min, Math.min(max, n)));
        }
      }}
      onBlur={() => {
        const n = parseInt(raw);
        const clamped = isNaN(n) ? value : Math.max(min, Math.min(max, n));
        setRaw(String(clamped));
        onChange(clamped);
      }}
    />
  );
}

const CUSTOM_SENTINEL = "__custom__";

const TRAIT_ARRAY_VALUES = [2, 1, 1, 0, 0, -1] as const;
const TRAIT_ARRAY_LABEL = "+2, +1, +1, 0, 0, −1";

function fmtTrait(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

function remainingTraitPool(allValues: number[], excludeIdx: number): number[] {
  const pool = new Map<number, number>();
  for (const v of TRAIT_ARRAY_VALUES) pool.set(v, (pool.get(v) ?? 0) + 1);
  for (let i = 0; i < allValues.length; i++) {
    if (i === excludeIdx) continue;
    const v = allValues[i];
    const cnt = pool.get(v) ?? 0;
    if (cnt > 0) pool.set(v, cnt - 1);
  }
  return [...pool.entries()]
    .filter(([, cnt]) => cnt > 0)
    .map(([v]) => v)
    .sort((a, b) => b - a);
}

function isTraitArrayValid(traits: CharacterRecord["traits"]): boolean {
  const values = TRAITS.map(k => traits[k]).sort((a, b) => a - b);
  const target = [...TRAIT_ARRAY_VALUES].sort((a, b) => a - b);
  return values.every((v, i) => v === target[i]);
}

/**
 * `anyPopulated` defers validation until the user has touched at least one
 * trait (non-zero), preventing fresh characters from opening with all red.
 * `forceValidate` overrides this at submit time so the user sees what's wrong.
 */
function TraitArrayInput({
  value,
  available,
  anyPopulated,
  onChange,
}: {
  value: number;
  available: number[];
  anyPopulated: boolean;
  onChange: (n: number) => void;
}) {
  const isInArray = (TRAIT_ARRAY_VALUES as readonly number[]).includes(value);
  const isAvailable = available.includes(value);
  const invalid = anyPopulated && !isAvailable;

  const [custom, setCustom] = useState(!isInArray);

  useEffect(() => {
    if (!(TRAIT_ARRAY_VALUES as readonly number[]).includes(value)) {
      setCustom(true);
    }
  }, [value]);

  if (custom) {
    return (
      <div class="cfg-row-end">
        <button
          class="iconbtn"
          title="Back to standard array"
          onClick={() => { setCustom(false); onChange(0); }}
        >
          <IconBack />
        </button>
        <SignedIntInput
          class={`num cfg-flex${invalid ? " inp--invalid" : ""}`}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <select
      class={`sel${invalid ? " inp--invalid" : ""}`}
      value={isAvailable ? String(value) : ""}
      onChange={e => {
        const v = (e.target as HTMLSelectElement).value;
        if (v === CUSTOM_SENTINEL) {
          setCustom(true);
        } else if (v !== "") {
          onChange(parseInt(v));
        }
      }}
    >
      <option value="">— pick —</option>
      {available.map(v => (
        <option key={v} value={String(v)}>{fmtTrait(v)}</option>
      ))}
      <option value={CUSTOM_SENTINEL}>Custom…</option>
    </select>
  );
}

function PicklistInput({
  options,
  value,
  placeholder,
  onChange,
}: {
  options: readonly string[];
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const isKnown = value === "" || options.includes(value);
  const [custom, setCustom] = useState(!isKnown);
  const [text, setText] = useState(isKnown ? "" : value);

  useEffect(() => {
    if (options.includes(value)) {
      setCustom(false);
    } else if (value === "") {
      setCustom(false);
      setText("");
    } else if (!options.includes(value) && value !== text) {
      setCustom(true);
      setText(value);
    }
  }, [value, options]);

  if (custom) {
    return (
      <div class="cfg-row-end">
        <button
          class="iconbtn"
          title="Back to list"
          onClick={() => {
            setCustom(false);
            setText("");
            onChange("");
          }}
        >
          <IconBack />
        </button>
        <input
          class="inp cfg-flex"
          type="text"
          value={text}
          placeholder={placeholder}
          onInput={e => {
            const v = (e.target as HTMLInputElement).value;
            setText(v);
            onChange(v);
          }}
        />
      </div>
    );
  }

  return (
    <select
      class="sel"
      value={value}
      onChange={e => {
        const v = (e.target as HTMLSelectElement).value;
        if (v === CUSTOM_SENTINEL) {
          setCustom(true);
          setText("");
          onChange("");
        } else {
          onChange(v);
        }
      }}
    >
      <option value="">— select —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
      <option value={CUSTOM_SENTINEL}>Custom…</option>
    </select>
  );
}

// ── Section: Identity ──

function IdentitySection({ c, upd }: SectionProps) {
  const classSubclasses: readonly string[] =
    SUBCLASSES[c.className as ClassName] ?? [];

  function handleClassChange(cls: string) {
    const patch: Partial<CharacterRecord> = { className: cls };
    const subs: readonly string[] = SUBCLASSES[cls as ClassName] ?? [];
    if (c.subclassName && !subs.includes(c.subclassName)) {
      patch.subclassName = "";
    }
    if (CLASSES.includes(cls as ClassName)) {
      patch.baseEvasion = CLASS_EVASION[cls as ClassName];
    }
    upd(patch);
  }

  return (
    <>
      <div class="sec acc-gold">
        <div class="sec__head"><span class="sec__title">Character</span></div>
        <div class="f">
          <label class="f__label">Name</label>
          <div class="f__control">
            <input class="inp" value={c.name} placeholder="Character name"
              onInput={e => upd({ name: strVal(e) })} />
          </div>
        </div>
        <div class="f">
          <label class="f__label">Pronouns</label>
          <div class="f__control">
            <input class="inp" value={c.pronouns} placeholder="they/them"
              onInput={e => upd({ pronouns: strVal(e) })} />
          </div>
        </div>
        <div class="f cfg-full">
          <label class="f__label">Description</label>
          <textarea class="inp ta" rows={3} value={c.description}
            placeholder="Appearance, background…"
            onInput={e => upd({ description: strVal(e) })} />
        </div>
      </div>
      <div class="sec acc-teal">
        <div class="sec__head"><span class="sec__title">Heritage</span></div>
        <div class="f">
          <label class="f__label">Ancestry</label>
          <div class="f__control">
            <PicklistInput
              options={ANCESTRIES}
              value={c.ancestry}
              placeholder="Homebrew ancestry"
              onChange={v => upd({ ancestry: v })}
            />
          </div>
        </div>
        <div class="f">
          <label class="f__label">Community</label>
          <div class="f__control">
            <PicklistInput
              options={COMMUNITIES}
              value={c.community}
              placeholder="Homebrew community"
              onChange={v => upd({ community: v })}
            />
          </div>
        </div>
      </div>
      <div class="sec acc-amber">
        <div class="sec__head"><span class="sec__title">Class</span></div>
        <div class="f">
          <label class="f__label">Class</label>
          <div class="f__control">
            <PicklistInput
              options={CLASSES}
              value={c.className}
              placeholder="Homebrew class"
              onChange={handleClassChange}
            />
          </div>
        </div>
        <div class="f">
          <label class="f__label">Subclass</label>
          <div class="f__control">
            {classSubclasses.length > 0 ? (
              <PicklistInput
                options={classSubclasses}
                value={c.subclassName}
                placeholder="Homebrew subclass"
                onChange={v => upd({ subclassName: v })}
              />
            ) : (
              <input class="inp" value={c.subclassName}
                placeholder="Subclass"
                onInput={e => upd({ subclassName: strVal(e) })} />
            )}
          </div>
        </div>
        <div class="f">
          <label class="f__label">
            Level
            <small>1–10</small>
          </label>
          <div class="f__control">
            <input class="num" type="number" min={1} max={10} value={c.level}
              onInput={e => upd({ level: intVal(e, { min: 1, max: 10, fallback: 1 }) })} />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Section: Traits ──

function TraitsSection({
  c,
  upd,
  forceValidate = false,
}: SectionProps & { forceValidate?: boolean }) {
  const traitValues = TRAITS.map(k => c.traits[k]);
  const anyPopulated = forceValidate || traitValues.some(v => v !== 0);
  return (
    <>
      <div class="sec acc-teal">
        <div class="sec__head">
          <span class="sec__title">Base Scores</span>
          <span class="sec__desc">{TRAIT_ARRAY_LABEL}</span>
        </div>
        <div class="statgrid">
          {TRAITS.map((key, idx) => {
            const available = remainingTraitPool(traitValues, idx);
            return (
              <div class="f" key={key}>
                <label class="f__label">{TRAIT_LABELS[key]}</label>
                <div class="f__control">
                  <TraitArrayInput
                    value={c.traits[key]}
                    available={available}
                    anyPopulated={anyPopulated}
                    onChange={n => upd({ traits: { ...c.traits, [key]: n } })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div class="sec acc-blue">
        <div class="sec__head"><span class="sec__title">Modifiers</span></div>
        <p class="help">Bonuses from ancestry, community, or items — added to base scores at compute time.</p>
        <div class="statgrid">
          {TRAITS.map(key => (
            <div class="f" key={key}>
              <label class="f__label">{TRAIT_LABELS[key]}</label>
              <div class="f__control">
                <SignedIntInput
                  class="num"
                  min={-5}
                  max={5}
                  value={c.traitMods[key] ?? 0}
                  onChange={n => upd({ traitMods: { ...c.traitMods, [key]: n } })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Section: Defenses ──

function DefensesSection({ c, upd }: SectionProps) {
  return (
    <>
      <div class="sec acc-red">
        <div class="sec__head"><span class="sec__title">Evasion</span></div>
        <div class="f">
          <label class="f__label">
            Base Evasion
            <small>From class, before armor</small>
          </label>
          <div class="f__control">
            <input class="num" type="number" min={0} value={c.baseEvasion}
              onInput={e => upd({ baseEvasion: intVal(e, { min: 0 }) })} />
          </div>
        </div>
        <div class="f">
          <label class="f__label">
            Evasion Override
            <small>Blank = auto (base + armor)</small>
          </label>
          <div class="f__control">
            <input class="num" type="number" min={0}
              value={c.evasionOverride ?? ""}
              placeholder="auto"
              onInput={e => {
                const raw = (e.target as HTMLInputElement).value;
                upd({ evasionOverride: raw === "" ? null : intVal(e, { min: 0 }) });
              }} />
          </div>
        </div>
      </div>
      <div class="sec acc-amber">
        <div class="sec__head"><span class="sec__title">Vitals</span></div>
        <div class="grid2">
          <div class="f">
            <label class="f__label">HP Max</label>
            <div class="f__control">
              <input class="num" type="number" min={1} value={c.hpMax}
                onInput={e => upd({ hpMax: intVal(e, { min: 1, fallback: 1 }) })} />
            </div>
          </div>
          <div class="f">
            <label class="f__label">Stress Max</label>
            <div class="f__control">
              <input class="num" type="number" min={1} value={c.stressMax}
                onInput={e => upd({ stressMax: intVal(e, { min: 1, fallback: 1 }) })} />
            </div>
          </div>
        </div>
      </div>
      <div class="sec acc-blue">
        <div class="sec__head"><span class="sec__title">Damage Thresholds</span></div>
        <div class="grid3">
          <div class="f">
            <label class="f__label">Minor</label>
            <div class="f__control">
              <input class="num" type="number" min={0} value={c.thresholdMinor}
                onInput={e => upd({ thresholdMinor: intVal(e, { min: 0 }) })} />
            </div>
          </div>
          <div class="f">
            <label class="f__label">Major</label>
            <div class="f__control">
              <input class="num" type="number" min={0} value={c.thresholdMajor}
                onInput={e => upd({ thresholdMajor: intVal(e, { min: 0 }) })} />
            </div>
          </div>
          <div class="f">
            <label class="f__label">Severe</label>
            <div class="f__control">
              <input class="num" type="number" min={0} value={c.thresholdSevere}
                onInput={e => upd({ thresholdSevere: intVal(e, { min: 0 }) })} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Section: Domains ──

function DomainsSection({
  c,
  upd,
  plugin,
}: SectionProps & { plugin: MiniSheetPlugin }) {
  const setCards = (cards: DomainCardEntry[]) => upd({ domainCards: cards });
  const addCard = () =>
    setCards([...c.domainCards, { name: "", domain: "", notes: "" }]);
  const removeCard = (i: number) =>
    setCards(c.domainCards.filter((_, j) => j !== i));
  const patchCard = (i: number, patch: Partial<DomainCardEntry>) =>
    setCards(c.domainCards.map((card, j) => (j === i ? { ...card, ...patch } : card)));

  function openNotePicker(i: number) {
    const folderPrefix = plugin.store.data.value.settings.domainCardsFolder ?? "";
    new VaultNotePicker(plugin.app, (file) => {
      patchCard(i, { noteRef: file.path });
    }, folderPrefix).open();
  }

  return (
    <>
      <div class="sec acc-gold">
        <div class="sec__head"><span class="sec__title">Active Domains</span></div>
        <div class="grid2">
          <div class="f">
            <label class="f__label">Domain 1</label>
            <div class="f__control">
              <select class="sel"
                value={c.domains[0]}
                onChange={e => upd({
                  domains: [(e.target as HTMLSelectElement).value as DomainName | "", c.domains[1]],
                })}>
                <option value="">— none —</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div class="f">
            <label class="f__label">Domain 2</label>
            <div class="f__control">
              <select class="sel"
                value={c.domains[1]}
                onChange={e => upd({
                  domains: [c.domains[0], (e.target as HTMLSelectElement).value as DomainName | ""],
                })}>
                <option value="">— none —</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="sec acc-teal">
        <div class="sec__head">
          <span class="sec__title">Domain Cards</span>
          <button class="btn btn--sm btn--accent" style="margin-left:auto" onClick={addCard}>
            + Add Card
          </button>
        </div>
        {c.domainCards.length === 0 && (
          <p class="help muted">No domain cards yet.</p>
        )}
        {c.domainCards.map((card, i) => (
          <div key={i} class="cfg-card">
            <div class="f">
              <label class="f__label">Card Name</label>
              <div class="f__control cfg-row-end">
                <input class="inp cfg-flex" value={card.name} placeholder="Name"
                  onInput={e => patchCard(i, { name: strVal(e) })} />
                <button class="iconbtn" title="Link vault note" onClick={() => openNotePicker(i)}>
                  <IconLink />
                </button>
                <button class="iconbtn" title="Remove card" onClick={() => removeCard(i)}>
                  <IconX />
                </button>
              </div>
            </div>
            {card.noteRef && (
              <div class="cfg-note-ref">
                <span class="cfg-note-ref__path" title={card.noteRef}>
                  {card.noteRef.split("/").pop()?.replace(/\.md$/, "") ?? card.noteRef}
                </span>
                <button
                  class="cfg-note-ref__clear"
                  title="Remove link"
                  onClick={() => patchCard(i, { noteRef: undefined })}
                >
                  ×
                </button>
              </div>
            )}
            <div class="f">
              <label class="f__label">Domain</label>
              <div class="f__control">
                <select class="sel" value={card.domain}
                  onChange={e => patchCard(i, {
                    domain: (e.target as HTMLSelectElement).value as DomainName | "",
                  })}>
                  <option value="">— none —</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div class="f cfg-full">
              <label class="f__label">Notes</label>
              <textarea class="inp ta" rows={2} value={card.notes}
                onInput={e => patchCard(i, { notes: strVal(e) })} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Section: Connections ──

function ConnectionsSection({
  c,
  upd,
  plugin,
}: SectionProps & { plugin: MiniSheetPlugin }) {
  const setConns = (connections: Connection[]) => upd({ connections });
  const addConn = () =>
    setConns([...c.connections, { characterName: "", description: "" }]);
  const removeConn = (i: number) =>
    setConns(c.connections.filter((_, j) => j !== i));
  const patchConn = (i: number, patch: Partial<Connection>) =>
    setConns(c.connections.map((conn, j) => (j === i ? { ...conn, ...patch } : conn)));

  function openNotePicker(i: number) {
    new VaultNotePicker(plugin.app, (file) => {
      patchConn(i, { noteRef: file.path });
    }).open();
  }

  return (
    <div class="sec acc-blue">
      <div class="sec__head">
        <span class="sec__title">Connections</span>
        <button class="btn btn--sm btn--accent" style="margin-left:auto" onClick={addConn}>
          + Add
        </button>
      </div>
      {c.connections.length === 0 && (
        <p class="help muted">
          No connections yet. Track bonds with NPCs and other characters here.
        </p>
      )}
      {c.connections.map((conn, i) => (
        <div key={i} class="cfg-card">
          <div class="f">
            <label class="f__label">Character</label>
            <div class="f__control cfg-row-end">
              <input class="inp cfg-flex" value={conn.characterName} placeholder="Name"
                onInput={e => patchConn(i, { characterName: strVal(e) })} />
              <button class="iconbtn" title="Link vault note" onClick={() => openNotePicker(i)}>
                <IconLink />
              </button>
              <button class="iconbtn" title="Remove connection" onClick={() => removeConn(i)}>
                <IconX />
              </button>
            </div>
          </div>
          {conn.noteRef && (
            <div class="cfg-note-ref">
              <span class="cfg-note-ref__path" title={conn.noteRef}>
                {conn.noteRef.split("/").pop()?.replace(/\.md$/, "") ?? conn.noteRef}
              </span>
              <button
                class="cfg-note-ref__clear"
                title="Remove link"
                onClick={() => patchConn(i, { noteRef: undefined })}
              >
                ×
              </button>
            </div>
          )}
          <div class="f cfg-full">
            <label class="f__label">Description</label>
            <textarea class="inp ta" rows={2} value={conn.description}
              placeholder="Nature of the bond…"
              onInput={e => patchConn(i, { description: strVal(e) })} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section: Danger Zone ──

function DangerSection({
  c,
  store,
  onClose,
}: {
  c: CharacterRecord;
  store: MiniSheetStore;
  onClose: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div class="sec acc-red">
      <div class="sec__head"><span class="sec__title">Danger Zone</span></div>
      <div class="f">
        <label class="f__label">
          Delete character
          <small>Permanently removes {c.name || "this character"} and all data</small>
        </label>
        <div class="f__control">
          {!confirming ? (
            <button class="btn" onClick={() => setConfirming(true)}>Delete…</button>
          ) : (
            <>
              <button
                class="btn btn--accent"
                style="border-color:var(--accent);color:var(--accent)"
                onClick={() => { store.removeCharacter(c.id); onClose(); }}
              >
                Confirm Delete
              </button>
              <button class="btn btn--ghost" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main surface ──

export function ConfigSurface({
  plugin,
  store,
  character,
  onClose,
}: {
  plugin: MiniSheetPlugin;
  store: MiniSheetStore;
  character: CharacterRecord;
  onClose: () => void;
}) {
  const [section, setSection] = useState<Section>("identity");
  const [warnClose, setWarnClose] = useState(false);
  const upd = (patch: Partial<CharacterRecord>) =>
    store.updateCharacter(character.id, patch);

  function handleDone() {
    if (!isTraitArrayValid(character.traits)) {
      setWarnClose(true);
      setSection("traits");
    } else {
      onClose();
    }
  }

  return (
    <div class="minisheet-config-root">
      <div class="cfg">
        <header class="cfg__top">
          <h2 class="cfg__title">
            Configure <b>{character.name || "Character"}</b>
          </h2>
          {warnClose && (
            <div class="cfg__warn">
              <span>Trait scores don’t match the standard array (+2, +1, +1, 0, 0, −1) — some fields may be empty.</span>
              <div class="cfg__warn-actions">
                <button class="btn btn--sm btn--ghost" onClick={() => setWarnClose(false)}>Keep editing</button>
                <button class="btn btn--sm" onClick={onClose}>Close anyway</button>
              </div>
            </div>
          )}
          <div class="cfg__top-spacer" />
          <button class="btn btn--ghost btn--sm" onClick={handleDone}>Done</button>
        </header>
        <div class="cfg__work">
          <nav class="rail">
            {RAIL_ITEMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                class={`rail__item${section === id ? " is-active" : ""}`}
                onClick={() => { setSection(id); setWarnClose(false); }}
              >
                <span class="rail__ic"><Icon /></span>
                <span class="rail__name">{label}</span>
              </button>
            ))}
          </nav>
          <div class="detail">
            {section === "identity" && <IdentitySection c={character} upd={upd} />}
            {section === "traits" && <TraitsSection c={character} upd={upd} forceValidate={warnClose} />}
            {section === "defenses" && <DefensesSection c={character} upd={upd} />}
            {section === "domains" && <DomainsSection c={character} upd={upd} plugin={plugin} />}
            {section === "connections" && <ConnectionsSection c={character} upd={upd} plugin={plugin} />}
            {section === "danger" && (
              <DangerSection c={character} store={store} onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

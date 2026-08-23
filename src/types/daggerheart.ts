/**
 * Daggerheart character schema. Derived values (evasion with armor, effective
 * trait modifiers) are NEVER stored here — computed in src/calc/daggerheart.ts.
 */

export const TRAITS = [
  "agility",
  "strength",
  "finesse",
  "instinct",
  "presence",
  "knowledge",
] as const;
export type TraitKey = (typeof TRAITS)[number];

export interface TraitScores {
  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;
}

export const TRAIT_LABELS: Record<TraitKey, string> = {
  agility: "Agility",
  strength: "Strength",
  finesse: "Finesse",
  instinct: "Instinct",
  presence: "Presence",
  knowledge: "Knowledge",
};

/** All Daggerheart domains (core + Hope & Fear). */
export const DOMAINS = [
  "Arcana",
  "Blade",
  "Bone",
  "Codex",
  "Grace",
  "Midnight",
  "Sage",
  "Splendor",
  "Valor",
  "Dread",
] as const;
export type DomainName = (typeof DOMAINS)[number];

export const WEAPON_RANGES = [
  "melee",
  "very close",
  "close",
  "far",
  "very far",
] as const;
export type WeaponRange = (typeof WEAPON_RANGES)[number];

export interface WeaponEntry {
  name: string;
  /** Which trait the player rolls for attacks with this weapon. */
  trait: TraitKey | "";
  range: WeaponRange | "";
  /** e.g. "d8 physical" or "2d6+3 magical" */
  damage: string;
  feature: string;
}

export interface ArmorEntry {
  name: string;
  /** Evasion bonus granted by this armor (added to base class evasion). */
  baseScore: number;
  feature: string;
}

export interface DomainCardEntry {
  name: string;
  domain: DomainName | "";
  /** Vault note path for rules-linking (relative to rulesFolder). */
  noteRef?: string;
  notes: string;
}

export interface CarriedItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
}

export interface GoldPurse {
  handfuls: number;
  bags: number;
  chests: number;
}

export interface Connection {
  characterName: string;
  description: string;
}

export interface ExtraFeature {
  label: string;
  text: string;
}

/**
 * A Daggerheart character record. All fields are raw stored values;
 * nothing here is derived at runtime.
 */
export interface DaggerheartCharacter {
  id: string;
  name: string;
  pronouns: string;
  description: string;

  // Identity
  className: string;
  subclassName: string;
  ancestry: string;
  community: string;

  // Advancement
  /** Character level 1–10. */
  level: number;
  /** XP marks toward next advancement. */
  xpMarks: number;

  // Traits
  traits: TraitScores;
  /**
   * Per-trait modifiers from ancestry, community, items, or temporary effects.
   * Summed with traits[key] at compute time; never stored as a running total.
   */
  traitMods: Partial<TraitScores>;

  // Defenses
  /** Base evasion from class (before armor). */
  baseEvasion: number;
  /** Manual evasion override — null means auto-derive from baseEvasion + armor. */
  evasionOverride: number | null;

  // Vitals (max stored; current tracked separately as play state)
  hpMax: number;
  stressMax: number;

  // Damage thresholds
  thresholdMinor: number;
  thresholdMajor: number;
  thresholdSevere: number;

  // Play state — persisted between sessions
  hpCurrent: number;
  stressCurrent: number;
  hopeCurrent: number;

  // Active conditions (keyed by condition name)
  conditions: Partial<Record<string, boolean>>;
  conditionNotes: string;

  // Domains & cards
  domains: [DomainName | "", DomainName | ""];
  domainCards: DomainCardEntry[];

  // Equipment
  primaryWeapon: WeaponEntry;
  secondaryWeapon: WeaponEntry;
  armor: ArmorEntry;
  inventory: CarriedItem[];
  gold: GoldPurse;

  // Class features (free text; Rules tab provides vault-note links)
  classFeatures: string;
  foundationFeature: string;
  specializationFeature: string;
  masteryFeature: string;
  extraFeatures: ExtraFeature[];
  /** The class's Hope Feature — shown as a quick-ref card in the combat tab. */
  hopeFeature: string;

  // Ancestry & community
  ancestryFeatures: string;
  communityFeature: string;

  // Connections
  connections: Connection[];

  // Rules tab (carried over from wayfinder's reference-pinning)
  referencePins?: string[];
  /** Vault note paths linked to this character (Rules tab). */
  ruleLinks?: { path: string; category?: string }[];
  checklistState?: Record<string, boolean>;

  // Appearance
  bannerImage?: string;
  bannerColor?: string;
}

export function defaultTraitScores(): TraitScores {
  return {
    agility: 0,
    strength: 0,
    finesse: 0,
    instinct: 0,
    presence: 0,
    knowledge: 0,
  };
}

export function emptyWeapon(): WeaponEntry {
  return { name: "", trait: "", range: "", damage: "", feature: "" };
}

export function emptyArmor(): ArmorEntry {
  return { name: "", baseScore: 0, feature: "" };
}

export function defaultCharacter(id: string): DaggerheartCharacter {
  return {
    id,
    name: "New Character",
    pronouns: "",
    description: "",
    className: "",
    subclassName: "",
    ancestry: "",
    community: "",
    level: 1,
    xpMarks: 0,
    traits: defaultTraitScores(),
    traitMods: {},
    baseEvasion: 10,
    evasionOverride: null,
    hpMax: 6,
    stressMax: 6,
    thresholdMinor: 5,
    thresholdMajor: 10,
    thresholdSevere: 15,
    hpCurrent: 6,
    stressCurrent: 0,
    hopeCurrent: 0,
    conditions: {},
    conditionNotes: "",
    domains: ["", ""],
    domainCards: [],
    primaryWeapon: emptyWeapon(),
    secondaryWeapon: emptyWeapon(),
    armor: emptyArmor(),
    inventory: [],
    gold: { handfuls: 0, bags: 0, chests: 0 },
    classFeatures: "",
    foundationFeature: "",
    specializationFeature: "",
    masteryFeature: "",
    hopeFeature: "",
    extraFeatures: [],
    ancestryFeatures: "",
    communityFeature: "",
    connections: [],
  };
}

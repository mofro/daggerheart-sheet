/** Canonical Daggerheart option lists — Core rulebook + Hope & Fear supplement. */

// Core ancestries + Hope & Fear: Aetheris, Earthkin, Emberkin, Skykin, Tidekin
export const ANCESTRIES = [
  "Aetheris",
  "Clank",
  "Drakona",
  "Dwarf",
  "Earthkin",
  "Elf",
  "Emberkin",
  "Faerie",
  "Faun",
  "Fungril",
  "Galapa",
  "Giant",
  "Goblin",
  "Halfling",
  "Human",
  "Inferis",
  "Katari",
  "Ribbet",
  "Simiah",
  "Skykin",
  "Tidekin",
] as const;

// Core communities + Hope & Fear: Duneborne, Freeborne, Frostborne, Hearthborne, Reborne, Warborne
export const COMMUNITIES = [
  "Duneborne",
  "Freeborne",
  "Frostborne",
  "Hearthborne",
  "Highborne",
  "Loreborne",
  "Orderborne",
  "Reborne",
  "Ridgeborne",
  "Seaborne",
  "Slyborne",
  "Underborne",
  "Wanderborne",
  "Warborne",
  "Wildborne",
] as const;

export const CLASSES = [
  "Assassin",
  "Bard",
  "Brawler",
  "Druid",
  "Guardian",
  "Ranger",
  "Rogue",
  "Seraph",
  "Sorcerer",
  "Warlock",
  "Warrior",
  "Witch",
  "Wizard",
] as const;
export type ClassName = (typeof CLASSES)[number];

export const SUBCLASSES: Record<ClassName, readonly string[]> = {
  Assassin: ["Executioners Guild", "Poisoners Guild"],
  Bard: ["Wordsmith", "Troubadour"],
  Brawler: ["Juggernaut", "Martial Artist"],
  Druid: ["Warden of Renewal", "Warden of Decay"],
  Guardian: ["Stalwart", "Vengeance"],
  Ranger: ["Beastbound", "Wayfinder"],
  Rogue: ["Nightwalker", "Syndicate"],
  Seraph: ["Winged Sentinel", "Divine Wielder"],
  Sorcerer: ["Elemental Origin", "Primal Origin"],
  Warlock: ["Pact of the Endless", "Pact of the Wrathful"],
  Warrior: ["Call of the Brave", "Call of the Wild"],
  Witch: ["Hedge", "Moon"],
  Wizard: ["Wizard of Academy Arcana", "Wizard of the Grey"],
};

/**
 * Starting domains per class (two per class).
 * Core values: Daggerheart Core Rulebook.
 * H&F values verified from Hope & Fear supplement text.
 */
export const CLASS_DOMAINS: Record<ClassName, readonly [string, string]> = {
  // Core Rulebook classes
  Bard:     ["Grace",    "Codex"],
  Druid:    ["Arcana",   "Sage"],
  Guardian: ["Blade",    "Valor"],
  Ranger:   ["Bone",     "Sage"],
  Rogue:    ["Midnight", "Grace"],
  Seraph:   ["Splendor", "Grace"],
  Sorcerer: ["Arcana",   "Midnight"],
  Warrior:  ["Blade",    "Valor"],
  Wizard:   ["Arcana",   "Codex"],
  // Hope & Fear supplement classes (domains verified from supplement text)
  Assassin: ["Blade",    "Midnight"],
  Brawler:  ["Valor",    "Bone"],
  Warlock:  ["Dread",    "Grace"],
  Witch:    ["Sage",     "Dread"],
};

/**
 * Starting Evasion per class (before armor).
 * Core values: Daggerheart Core Rulebook.
 * H&F values verified from Hope & Fear supplement text:
 *   Assassin 12, Brawler 10, Warlock 11, Witch 10.
 */
export const CLASS_EVASION: Record<ClassName, number> = {
  Assassin: 12,
  Bard: 9,
  Brawler: 10,
  Druid: 10,
  Guardian: 12,
  Ranger: 10,
  Rogue: 12,
  Seraph: 11,
  Sorcerer: 9,
  Warlock: 11,
  Warrior: 11,
  Witch: 10,
  Wizard: 9,
};

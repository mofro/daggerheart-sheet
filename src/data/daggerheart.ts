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

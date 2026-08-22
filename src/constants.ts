export const PLUGIN_ID = "daggerheart-sheet";
export const VIEW_TYPE_SHEET = "daggerheart-sheet-view";
export const VIEW_TYPE_PARTY_INV = "daggerheart-party-inventory";
export const VIEW_TYPE_CONFIG = "daggerheart-config";
export const VIEW_TYPE_EQUIP_DB = "daggerheart-equipment-db";

// Legacy aliases kept so remaining wayfinder imports don't immediately break
// during Phase 0. Remove once Phase 1 rewires all views.
export const VIEW_TYPE_MINISHEET = VIEW_TYPE_SHEET;
export const VIEW_TYPE_SPELL_DB = "daggerheart-spell-db"; // will be removed in Phase 1
export const VIEW_TYPE_MANEUVER_DB = "daggerheart-maneuver-db"; // will be removed in Phase 1

/** Tab order for the sheet. */
export const TABS = [
  "combat",
  "traits",
  "class",
  "equipment",
  "rules",
] as const;
export type TabName = (typeof TABS)[number];

export const TAB_LABELS: Record<TabName, string> = {
  combat: "Combat",
  traits: "Traits",
  class: "Class",
  equipment: "Gear",
  rules: "Rules",
};

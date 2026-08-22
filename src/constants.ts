export const PLUGIN_ID = "daggerheart-sheet";
export const VIEW_TYPE_SHEET = "daggerheart-sheet-view";
export const VIEW_TYPE_CONFIG = "daggerheart-config";

export const VIEW_TYPE_MINISHEET = VIEW_TYPE_SHEET;

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

import type { TabName } from "../constants";
import type { DaggerheartCharacter } from "./daggerheart";
import { DEFAULT_CUSTOM_ITEMS_FILENAME } from "./custom-items";
import type { InventoryState } from "./inventory";

export interface UiState {
  selectedTab: TabName;
  activeCharacterId: string | null;
  /** Combat tab subtab. */
  combatSub?: "main" | "inventory";
  /** Shared party loot view state. */
  partyInv?: PartyInvState;
}

export interface PartyInvState {
  search: string;
  type: string;
  containerFilter: string;
  owner: string;
  sortKey: "name" | "count" | "weight" | "value" | "type";
  sortDir: "asc" | "desc";
  currencyOpen: boolean;
  controlsOpen: boolean;
}

export const DEFAULT_PARTY_INV: PartyInvState = {
  search: "",
  type: "",
  containerFilter: "",
  owner: "",
  sortKey: "name",
  sortDir: "asc",
  currencyOpen: true,
  controlsOpen: true,
};

export interface DaggerheartSettings {
  /** Vault folder containing Daggerheart rules notes. */
  rulesFolder: string;
  /** Custom items JSON filename. */
  customItemsFileName: string;
  /** Use Carrel plugin for the References tab when installed. */
  useCarrelReferences?: boolean;
  /** Where character data lives. Absent = "plugin". */
  characterStorage?: CharacterStorageMode;
  characterStorageFolder?: string;
  characterBackup?: boolean;
  characterBackupFolder?: string;
}

/** Legacy alias — prefer DaggerheartSettings in new code. */
export type MiniSheetSettings = DaggerheartSettings;

export type CharacterStorageMode =
  | "plugin"
  | "vault-single"
  | "vault-per-character";

export function characterStorageMode(
  settings: Pick<DaggerheartSettings, "characterStorage">,
): CharacterStorageMode {
  return settings.characterStorage ?? "plugin";
}

export function characterBackupEnabled(
  settings: Pick<DaggerheartSettings, "characterBackup">,
): boolean {
  return settings.characterBackup ?? false;
}

/** Root shape of the plugin's data.json. */
export interface DaggerheartData {
  schemaVersion: number;
  settings: DaggerheartSettings;
  ui: UiState;
  characters: DaggerheartCharacter[];
  partyInventory?: InventoryState;
}

/** Legacy alias — prefer DaggerheartData in new code. */
export type MiniSheetData = DaggerheartData;

export const DEFAULT_DATA: DaggerheartData = {
  // v1: initial Daggerheart schema
  schemaVersion: 1,
  settings: {
    rulesFolder: "Rules",
    customItemsFileName: DEFAULT_CUSTOM_ITEMS_FILENAME,
  },
  ui: {
    selectedTab: "combat",
    activeCharacterId: null,
  },
  characters: [],
};

// ---------------------------------------------------------------------------
// PF1e exports removed in Phase 1. Kept as dead stubs so files awaiting
// Phase 2 updates continue to compile.
// ---------------------------------------------------------------------------

/** @deprecated PF1e — remove in Phase 2. */
export const DEFAULT_SPELL_DB = {};
/** @deprecated PF1e — remove in Phase 2. */
export const DEFAULT_MANEUVER_DB = {};
/** @deprecated PF1e — remove in Phase 2. */
export const DEFAULT_EQUIP_DB = {};
/** @deprecated PF1e — remove in Phase 2. */
export type SpellDbState = Record<string, unknown>;
/** @deprecated PF1e — remove in Phase 2. */
export type ManeuverDbState = Record<string, unknown>;
/** @deprecated PF1e — remove in Phase 2. */
export type EquipDbState = Record<string, unknown>;
/** @deprecated PF1e — always returns false. */
export function eitrEnabled(_: unknown): boolean {
  return false;
}
/** @deprecated PF1e — always returns false. */
export function pathOfWarEnabled(_: unknown): boolean {
  return false;
}

/**
 * Phase 1 bridge: re-exports DaggerheartCharacter under the legacy
 * CharacterRecord name so the large number of files importing from here
 * compile without an immediate mass-rename. Files in src/components/ will
 * migrate to DaggerheartCharacter directly during Phase 2.
 */

export type {
  DaggerheartCharacter,
  TraitKey,
  TraitScores,
} from "./daggerheart";
export {
  TRAITS,
  TRAIT_LABELS,
  DOMAINS,
  defaultCharacter,
  defaultTraitScores,
  emptyWeapon,
  emptyArmor,
} from "./daggerheart";

import type { DaggerheartCharacter } from "./daggerheart";
import { defaultCharacter } from "./daggerheart";

/** Legacy alias — use DaggerheartCharacter in new code. */
export type CharacterRecord = DaggerheartCharacter;

/** Legacy factory — use defaultCharacter() in new code. */
export const createDefaultCharacter = defaultCharacter;

// Stubs for PF1e-only types still referenced by components awaiting Phase 2
// replacement. These are structurally minimal so existing imports compile; they
// carry no runtime semantics.

/** @deprecated PF1e — remove when combat components are replaced in Phase 2. */
export type AbilityKey = string;
/** @deprecated PF1e */
export type AbilityScores = Record<string, number>;
/** @deprecated PF1e */
export const ABILITY_KEYS: AbilityKey[] = [];

/** @deprecated PF1e */
export interface ClassEntry {
  className: string;
  level: number;
  archetypeKeys?: string[];
}

/** @deprecated PF1e */
export interface SkillEntry {
  ability: AbilityKey;
  ranks: number;
  misc: number;
  classSkill: boolean;
}

/** @deprecated PF1e */
export type CombatToggles = Record<string, boolean | string | number>;
/** @deprecated PF1e */
export function defaultToggles(): CombatToggles {
  return {};
}

/** @deprecated PF1e */
export interface ResourcePool {
  id: string;
  name: string;
  current: number;
  max: number;
  footer?: string;
  kind?: "class" | "item";
  formula?: unknown;
  derived?: unknown;
  footerFormula?: unknown;
}

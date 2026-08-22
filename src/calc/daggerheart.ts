/**
 * Daggerheart compute layer. Derives all values that the UI needs but that
 * are never stored in the character record.
 */

import type {
  DaggerheartCharacter,
  TraitKey,
  TraitScores,
} from "../types/daggerheart";
import { TRAITS } from "../types/daggerheart";

/** Final trait modifier = stored base + stored modifier adjustments. */
export function traitModifier(
  char: DaggerheartCharacter,
  key: TraitKey,
): number {
  return (char.traits[key] ?? 0) + (char.traitMods[key] ?? 0);
}

/** All six computed trait modifiers at once. */
export function allTraitModifiers(char: DaggerheartCharacter): TraitScores {
  return Object.fromEntries(
    TRAITS.map((key) => [key, traitModifier(char, key)]),
  ) as unknown as TraitScores;
}

/**
 * Effective Evasion: manual override wins; otherwise base class evasion
 * plus the armor's evasion bonus.
 */
export function effectiveEvasion(char: DaggerheartCharacter): number {
  if (char.evasionOverride !== null) return char.evasionOverride;
  return char.baseEvasion + char.armor.baseScore;
}

/** Daggerheart tier from level (approximate breakpoints from core rules). */
export function tierFromLevel(level: number): 1 | 2 | 3 {
  if (level >= 8) return 3;
  if (level >= 4) return 2;
  return 1;
}

export const HOPE_MAX = 6;

export interface DaggerheartComputed {
  traitMods: TraitScores;
  evasion: number;
  tier: 1 | 2 | 3;
}

export function computeAll(char: DaggerheartCharacter): DaggerheartComputed {
  return {
    traitMods: allTraitModifiers(char),
    evasion: effectiveEvasion(char),
    tier: tierFromLevel(char.level),
  };
}

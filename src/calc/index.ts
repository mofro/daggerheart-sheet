/**
 * Calc entry point — re-exports the Daggerheart compute layer.
 * Import computeAll from here or from ./daggerheart directly.
 */

export {
  computeAll,
  traitModifier,
  allTraitModifiers,
  effectiveEvasion,
  tierFromLevel,
  HOPE_MAX,
} from "./daggerheart";
export type { DaggerheartComputed } from "./daggerheart";

// ---------------------------------------------------------------------------
// Phase 2 stubs: types previously exported from here that PF1e components
// still reference. Remove once Phase 2 components are written.
// ---------------------------------------------------------------------------

/** @deprecated PF1e — remove in Phase 2. */
export type ComputedCharacter = import("./daggerheart").DaggerheartComputed;
/** @deprecated PF1e — remove in Phase 2. */
export type AttackProfileText = Record<string, unknown>;

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


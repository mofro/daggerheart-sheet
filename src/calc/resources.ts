/**
 * Phase 1 stub — PF1e resource-formula engine removed.
 * Daggerheart resources (HP, Stress, Hope) are tracked as simple
 * numbers in DaggerheartCharacter; no formula evaluation is needed.
 */

/** @deprecated PF1e */
export interface ResourceFormulaContext {
  classes: { className: string; level: number }[];
  mods: Record<string, number>;
  scores: Record<string, number>;
}

/** @deprecated PF1e */
export function evalResourceFormula(
  _formula: unknown,
  _ctx: ResourceFormulaContext,
): number { return 0; }

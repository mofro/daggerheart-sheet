/**
 * Phase 1 stub — PF1e rules-data types removed.
 * Race, class, and heritage schemas are not used in Daggerheart.
 */

/** @deprecated PF1e */
export type BabProgression = "full" | "threeQuarters" | "half";
/** @deprecated PF1e */
export const BAB_RATE: Record<BabProgression, number> = {
  full: 1, threeQuarters: 0.75, half: 0.5,
};
/** @deprecated PF1e */
export interface RaceData { name: string; }
/** @deprecated PF1e */
export interface RaceHeritage { sla: string; source: string; }
/** @deprecated PF1e */
export interface ClassData { name: string; }

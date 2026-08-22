/**
 * Phase 1 stub — PF1e shared helpers removed; Daggerheart equivalents in Phase 2.
 * Exports the minimal surface still consumed by sections/rules.tsx and index.ts.
 */
import type { MiniSheetStore } from "../../../state/store";
import type { CharacterRecord } from "../../../types/character";

export interface SectionProps {
  store: MiniSheetStore;
  character: CharacterRecord;
}

export const ABILITY_LABELS: Record<string, string> = {};
export const ABIL: [string, string][] = [];
export const ENERGY: [string, string, string][] = [];

export function formatMods(_mods: unknown): string { return ""; }
export const CUSTOM_RACE = "";
export const BASE_HERITAGE = "";
export const RACE_NAME_OPTIONS: string[] = [];

export function setter(store: MiniSheetStore, character: CharacterRecord) {
  return (_path: string, _value: unknown) =>
    store.updateCharacter(character.id, {});
}

export function RaceDetail(_props: unknown): null { return null; }
export function hpBreakdown(_character: CharacterRecord): string { return ""; }
export function hpAverage(_character: CharacterRecord): number { return 0; }

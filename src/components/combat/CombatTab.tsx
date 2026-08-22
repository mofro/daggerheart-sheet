import type { DaggerheartComputed } from "../../calc";
import type MiniSheetPlugin from "../../main";
import type { MiniSheetStore } from "../../state/store";
import type { CharacterRecord } from "../../types/character";

/** Phase 1 stub — full Daggerheart combat tab in Phase 2. */
export function CombatTab(_props: {
  plugin: MiniSheetPlugin;
  store: MiniSheetStore;
  character: CharacterRecord;
  computed: DaggerheartComputed;
}): null { return null; }

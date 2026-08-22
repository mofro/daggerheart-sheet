import type MiniSheetPlugin from "../../main";
import type { MiniSheetStore } from "../../state/store";
import type { CharacterRecord } from "../../types/character";

/** Phase 1 stub — full Daggerheart character configuration in Phase 2. */
export function ConfigSurface(_props: {
  plugin: MiniSheetPlugin;
  store: MiniSheetStore;
  character: CharacterRecord;
  onClose: () => void;
}): null { return null; }

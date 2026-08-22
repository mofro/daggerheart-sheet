import { ItemView, type WorkspaceLeaf } from "obsidian";

/** Phase 1 stub — maneuver DB view removed; no maneuvers in Daggerheart. */
export class ManeuverDatabaseView extends ItemView {
  constructor(leaf: WorkspaceLeaf) { super(leaf); }
  getViewType(): string { return "daggerheart-maneuverdb"; }
  getDisplayText(): string { return "Maneuver database"; }
  async onOpen(): Promise<void> {}
  async onClose(): Promise<void> {}
}

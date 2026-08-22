import { ItemView, type WorkspaceLeaf } from "obsidian";

/** Phase 1 stub — spell DB view removed; no spells in Daggerheart. */
export class SpellDatabaseView extends ItemView {
  constructor(leaf: WorkspaceLeaf) { super(leaf); }
  getViewType(): string { return "daggerheart-spelldb"; }
  getDisplayText(): string { return "Spell database"; }
  async onOpen(): Promise<void> {}
  async onClose(): Promise<void> {}
}

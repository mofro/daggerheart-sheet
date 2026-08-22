import type { WorkspaceLeaf } from "obsidian";
import { Notice, Plugin } from "obsidian";
import { installBridge, removeBridge } from "./bridge/mcp-bridge";
import {
  PLUGIN_ID,
  VIEW_TYPE_CONFIG,
  VIEW_TYPE_MINISHEET,
} from "./constants";
import {
  CharacterPickModal,
  ImportRuleModal,
  TextPromptModal,
} from "./modals";
import { RulesIndex } from "./rules/index";
import { MiniSheetSettingTab } from "./settings";
import { CustomItemsStore } from "./state/custom-items";
import { MiniSheetStore } from "./state/store";
import { ConfigView } from "./views/ConfigView";
import { SheetView } from "./views/SheetView";

export default class MiniSheetPlugin extends Plugin {
  store!: MiniSheetStore;
  rulesIndex!: RulesIndex;
  customItems!: CustomItemsStore;

  async onload(): Promise<void> {
    this.store = new MiniSheetStore(this);
    await this.store.load();
    this.store.initBackend();

    this.customItems = new CustomItemsStore(this);
    this.customItems.init();
    this.app.workspace.onLayoutReady(() => {
      void this.customItems.load();
      void this.store.loadCharacters();
      this.app.workspace.trigger("parse-style-settings");
    });

    this.rulesIndex = new RulesIndex(this);
    this.rulesIndex.init();

    this.registerView(VIEW_TYPE_MINISHEET, (leaf) => new SheetView(leaf, this));
    this.registerView(VIEW_TYPE_CONFIG, (leaf) => new ConfigView(leaf, this));

    this.addRibbonIcon("shield", "Daggerheart sheet", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-sheet",
      name: "Open sheet",
      callback: () => void this.openSheet(),
    });

    this.addCommand({
      id: "switch-character",
      name: "Switch character",
      callback: () => {
        const roster = this.store.data.value.characters;
        if (roster.length === 0) {
          new Notice("No characters yet — create one first.");
          return;
        }
        new CharacterPickModal(this.app, roster, (c) => {
          this.store.setActiveCharacter(c.id);
          void this.activateView();
        }).open();
      },
    });

    this.addCommand({
      id: "new-character",
      name: "New character",
      callback: () => {
        new TextPromptModal(this.app, "New character", "Name", (name) => {
          this.store.addCharacter(name);
          void this.activateConfigView();
        }).open();
      },
    });

    this.addCommand({
      id: "configure-character",
      name: "Configure character",
      callback: () => {
        if (!this.store.getCharacter()) return;
        void this.activateConfigView();
      },
    });

    this.addCommand({
      id: "import-rule",
      name: "Import rule from URL",
      callback: () => new ImportRuleModal(this).open(),
    });

    this.addSettingTab(new MiniSheetSettingTab(this.app, this));

    this.registerHoverLinkSource(PLUGIN_ID, {
      display: "Daggerheart Sheet",
      defaultMod: false,
    });

    installBridge(this);
  }

  onunload(): void {
    removeBridge();
    void this.store.flush();
    void this.customItems.flush();
  }

  async onExternalSettingsChange(): Promise<void> {
    await this.store.load();
    await this.store.loadCharacters();
    await this.customItems.load();
  }

  async openSheet(): Promise<void> {
    const roster = this.store.data.value.characters;
    if (!this.store.getCharacter() && roster.length > 1) {
      new CharacterPickModal(this.app, roster, (c) => {
        this.store.setActiveCharacter(c.id);
        void this.activateView();
      }).open();
      return;
    }
    const only = this.store.getCharacter() ? null : roster[0];
    if (only) this.store.setActiveCharacter(only.id);
    await this.activateView();
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;
    let leaf: WorkspaceLeaf | null =
      workspace.getLeavesOfType(VIEW_TYPE_MINISHEET)[0] ?? null;
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      if (!leaf) return;
      await leaf.setViewState({ type: VIEW_TYPE_MINISHEET, active: true });
    }
    await workspace.revealLeaf(leaf);
  }

  async activateConfigView(): Promise<void> {
    const { workspace } = this.app;
    let leaf: WorkspaceLeaf | null =
      workspace.getLeavesOfType(VIEW_TYPE_CONFIG)[0] ?? null;
    if (!leaf) {
      leaf = workspace.getLeaf("tab");
      await leaf.setViewState({ type: VIEW_TYPE_CONFIG, active: true });
    }
    await workspace.revealLeaf(leaf);
  }
}

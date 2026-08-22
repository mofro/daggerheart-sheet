import type { App } from "obsidian";
import { Notice, PluginSettingTab, Setting } from "obsidian";
import type MiniSheetPlugin from "./main";
import { characterStorageMode } from "./types/data-file";
import { isCarrelInstalled } from "./util/carrel";

export class MiniSheetSettingTab extends PluginSettingTab {
  private plugin: MiniSheetPlugin;

  constructor(app: App, plugin: MiniSheetPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Rules folder")
      .setDesc(
        "Vault folder containing rules notes (class features, domain cards, " +
          "ancestry traits, etc.). The Rules tab indexes and searches this folder.",
      )
      .addText((text) =>
        text
          .setPlaceholder("Rules")
          .setValue(this.plugin.store.data.value.settings.rulesFolder)
          .onChange((value) => {
            this.plugin.store.updateSettings({ rulesFolder: value });
          }),
      );

    new Setting(containerEl)
      .setName("Custom items file")
      .setDesc(
        "JSON file holding custom item definitions, tracked by file name " +
          "anywhere in the vault.",
      )
      .addText((text) =>
        text
          .setPlaceholder("minisheet-items.json")
          .setValue(this.plugin.store.data.value.settings.customItemsFileName)
          .onChange((value) => {
            this.plugin.store.updateSettings({ customItemsFileName: value });
            void this.plugin.customItems.load();
          }),
      );

    if (isCarrelInstalled(this.plugin.app)) {
      new Setting(containerEl)
        .setName("Use Carrel for references tab")
        .setDesc(
          "Use the Carrel plugin's references board for the Rules tab instead " +
            "of the built-in list. Only shown when Carrel is installed.",
        )
        .addToggle((toggle) =>
          toggle
            .setValue(
              this.plugin.store.data.value.settings.useCarrelReferences ?? false,
            )
            .onChange((value) => {
              this.plugin.store.updateSettings({ useCarrelReferences: value });
            }),
        );
    }

    const storageMode = characterStorageMode(
      this.plugin.store.data.value.settings,
    );

    new Setting(containerEl)
      .setName("Character storage")
      .setDesc(
        "Where character data is saved. Plugin data (the default) keeps it in " +
          "the plugin's data.json. The vault options store it as JSON file(s) " +
          "in your vault so Obsidian Sync treats it like notes.",
      )
      .addDropdown((dd) => {
        dd.addOption("plugin", "Plugin data (default)");
        dd.addOption("vault-single", "Single vault file");
        dd.addOption("vault-per-character", "One vault file per character");
        dd.setValue(storageMode);
        dd.onChange((value) => {
          const next = value as ReturnType<typeof characterStorageMode>;
          void (async () => {
            const ok = await this.plugin.store.migrateStorage(storageMode, next);
            if (ok) {
              new Notice(
                `Daggerheart Sheet: character storage set to "${next}".`,
              );
            } else {
              new Notice(
                "Daggerheart Sheet: could not verify the new storage location; " +
                  "kept the previous one.",
              );
            }
            this.display();
          })();
        });
      });

    if (storageMode !== "plugin") {
      new Setting(containerEl)
        .setName("Character storage folder")
        .setDesc(
          "Vault folder for the character file(s). Leave empty to keep them at " +
            "the vault root. Changing this moves the existing file(s).",
        )
        .addText((text) =>
          text
            .setPlaceholder("(Vault root)")
            .setValue(
              this.plugin.store.data.value.settings.characterStorageFolder ?? "",
            )
            .onChange((value) => {
              void (async () => {
                const ok = await this.plugin.store.relocateStorage(value);
                if (!ok) {
                  new Notice(
                    "Daggerheart Sheet: could not verify the new folder; " +
                      "old files left in place.",
                  );
                }
              })();
            }),
        );
    }

    const backupOn =
      this.plugin.store.data.value.settings.characterBackup ?? false;

    new Setting(containerEl)
      .setName("Back up characters")
      .setDesc(
        "When on, every save also writes a whole-roster snapshot to " +
          "daggerheart-backup.json — a recovery copy independent of the " +
          "primary storage.",
      )
      .addToggle((toggle) =>
        toggle.setValue(backupOn).onChange((value) => {
          this.plugin.store.updateSettings({ characterBackup: value });
          if (value) void this.plugin.store.backupNow();
          this.display();
        }),
      );

    if (backupOn) {
      new Setting(containerEl)
        .setName("Backup folder")
        .setDesc("Vault folder for the backup file. Leave empty for the root.")
        .addText((text) =>
          text
            .setPlaceholder("(Vault root)")
            .setValue(
              this.plugin.store.data.value.settings.characterBackupFolder ?? "",
            )
            .onChange((value) => {
              this.plugin.store.updateSettings({ characterBackupFolder: value });
              void this.plugin.store.backupNow();
            }),
        );
    }
  }
}

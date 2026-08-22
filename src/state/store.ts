import { signal, type Signal } from "@preact/signals";
import { TABS, type TabName } from "../constants";
import type { DaggerheartCharacter } from "../types/daggerheart";
import { defaultCharacter } from "../types/daggerheart";
import {
  characterBackupEnabled,
  characterStorageMode,
  DEFAULT_DATA,
  DEFAULT_PARTY_INV,
  type CharacterStorageMode,
  type DaggerheartData,
  type MiniSheetData,
  type PartyInvState,
} from "../types/data-file";
import { VaultCharacterBackend } from "./character-backend";
import type { Plugin } from "obsidian";
import {
  createDefaultInventory,
  type InventoryState,
} from "../types/inventory";
import { migrateData } from "./migrations";

const SAVE_DEBOUNCE_MS = 500;

function randomSuffix(): string {
  const uuid = window.crypto?.randomUUID?.();
  if (uuid) return uuid.replace(/-/g, "").slice(0, 8);
  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
}

/**
 * Single source of truth for all plugin state, backed by data.json.
 * Components read `store.data.value` (signals make them reactive);
 * all writes go through the mutation methods so persistence is automatic.
 */
export class MiniSheetStore {
  readonly data: Signal<DaggerheartData>;
  /** false while a vault storage backend is still loading character files. */
  readonly charactersReady: Signal<boolean> = signal(true);
  private plugin: Plugin;
  private backend: VaultCharacterBackend;
  private saveTimer: number | null = null;
  private dirty = false;
  private loadedSchemaVersion = DEFAULT_DATA.schemaVersion;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.data = signal(DEFAULT_DATA);
    this.backend = new VaultCharacterBackend(plugin, this);
  }

  initBackend(): void {
    this.backend.init(() => void this.loadCharacters());
  }

  async load(): Promise<void> {
    if (this.saveTimer) {
      window.clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    this.dirty = false;
    const loaded =
      (await this.plugin.loadData()) as Partial<MiniSheetData> | null;
    this.loadedSchemaVersion =
      typeof loaded?.schemaVersion === "number" ? loaded.schemaVersion : 0;
    const raw = loaded ? migrateData(loaded) : null;
    if (raw) {
      this.data.value = {
        ...DEFAULT_DATA,
        ...raw,
        schemaVersion: DEFAULT_DATA.schemaVersion,
        settings: { ...DEFAULT_DATA.settings, ...raw.settings },
        ui: { ...DEFAULT_DATA.ui, ...raw.ui },
        characters: this.hydrateCharacters(raw.characters ?? []),
        ...(raw.partyInventory
          ? {
              partyInventory: {
                ...createDefaultInventory(),
                ...raw.partyInventory,
              },
            }
          : {}),
      };
    }
    this.charactersReady.value =
      characterStorageMode(this.data.value.settings) === "plugin";
  }

  private hydrateCharacters(
    raw: DaggerheartCharacter[],
  ): DaggerheartCharacter[] {
    return raw.map((c) => ({ ...defaultCharacter(c.id), ...c }));
  }

  async loadCharacters(): Promise<void> {
    const mode = characterStorageMode(this.data.value.settings);
    if (mode === "plugin") {
      this.charactersReady.value = true;
      return;
    }
    if (this.saveTimer) {
      window.clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    this.dirty = false;
    const payload = await this.backend.loadFrom(mode);
    if (payload) {
      const migrated = migrateData({
        schemaVersion: this.loadedSchemaVersion,
        characters: payload.characters as DaggerheartCharacter[],
        settings: this.data.value.settings,
      });
      this.data.value = {
        ...this.data.value,
        characters: this.hydrateCharacters(
          (migrated.characters ?? payload.characters) as DaggerheartCharacter[],
        ),
        ...(payload.partyInventory
          ? {
              partyInventory: {
                ...createDefaultInventory(),
                ...payload.partyInventory,
              },
            }
          : {}),
      };
    }
    this.charactersReady.value = true;
  }

  private configSlice(): DaggerheartData {
    return { ...this.data.value, characters: [], partyInventory: undefined };
  }

  private characterSlice(): {
    characters: DaggerheartCharacter[];
    partyInventory?: InventoryState;
  } {
    return {
      characters: this.data.value.characters,
      ...(this.data.value.partyInventory
        ? { partyInventory: this.data.value.partyInventory }
        : {}),
    };
  }

  async migrateStorage(
    oldMode: CharacterStorageMode,
    newMode: CharacterStorageMode,
  ): Promise<boolean> {
    if (oldMode === newMode) return true;
    await this.flush();
    const snapshot = this.characterSlice();
    await this.backend.saveAs(newMode, snapshot);
    if (newMode !== "plugin") {
      const rb = await this.backend.loadFrom(newMode);
      if (!rb || rb.characters.length !== snapshot.characters.length) {
        return false;
      }
    }
    this.updateSettings({ characterStorage: newMode });
    await this.flush();
    if (oldMode !== "plugin") await this.backend.clearMode(oldMode);
    await this.loadCharacters();
    return true;
  }

  async relocateStorage(newFolder: string): Promise<boolean> {
    const mode = characterStorageMode(this.data.value.settings);
    const oldFolder = (
      this.data.value.settings.characterStorageFolder ?? ""
    ).trim();
    const next = newFolder.trim();
    if (mode === "plugin" || oldFolder === next) {
      this.updateSettings({ characterStorageFolder: newFolder });
      await this.flush();
      return true;
    }
    await this.flush();
    const snapshot = this.characterSlice();
    this.updateSettings({ characterStorageFolder: newFolder });
    await this.backend.saveAs(mode, snapshot);
    const rb = await this.backend.loadFrom(mode);
    if (!rb || rb.characters.length !== snapshot.characters.length) {
      return false;
    }
    await this.backend.clearMode(mode, oldFolder);
    await this.loadCharacters();
    return true;
  }

  private commit(next: DaggerheartData): void {
    this.data.value = next;
    this.dirty = true;
    if (this.saveTimer) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(
      () => void this.flush(),
      SAVE_DEBOUNCE_MS,
    );
  }

  async flush(): Promise<void> {
    if (this.saveTimer) {
      window.clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    if (!this.dirty) return;
    this.dirty = false;
    const mode = characterStorageMode(this.data.value.settings);
    if (mode === "plugin") {
      await this.plugin.saveData(this.data.value);
    } else {
      await this.plugin.saveData(this.configSlice());
      if (this.charactersReady.value) {
        await this.backend.save(this.characterSlice());
      }
    }
    await this.maybeBackup();
  }

  private async maybeBackup(): Promise<void> {
    if (!this.charactersReady.value) return;
    if (!characterBackupEnabled(this.data.value.settings)) return;
    try {
      await this.backend.writeBackup(
        this.data.value.settings.characterBackupFolder ?? "",
        this.characterSlice(),
      );
    } catch {
      // backup is best-effort; never throws into the primary save path
    }
  }

  async backupNow(): Promise<void> {
    await this.maybeBackup();
  }

  // -------------------------------------------------------------------------
  // UI state
  // -------------------------------------------------------------------------

  setTab(tab: TabName | number): void {
    const name = typeof tab === "number" ? TABS[tab] : tab;
    if (!name || !TABS.includes(name as TabName)) {
      throw new Error(`Unknown tab: ${String(tab)} (valid: ${TABS.join(", ")})`);
    }
    this.commit({
      ...this.data.value,
      ui: { ...this.data.value.ui, selectedTab: name as TabName },
    });
  }

  setActiveCharacter(id: string | null): void {
    this.commit({
      ...this.data.value,
      ui: { ...this.data.value.ui, activeCharacterId: id },
    });
  }

  setCombatSub(sub: "main" | "inventory"): void {
    this.commit({
      ...this.data.value,
      ui: { ...this.data.value.ui, combatSub: sub },
    });
  }

  partyInv(): PartyInvState {
    return { ...DEFAULT_PARTY_INV, ...this.data.value.ui.partyInv };
  }

  updatePartyInv(patch: Partial<PartyInvState>): void {
    this.commit({
      ...this.data.value,
      ui: { ...this.data.value.ui, partyInv: { ...this.partyInv(), ...patch } },
    });
  }

  getPartyInventory(): InventoryState {
    return this.data.value.partyInventory ?? createDefaultInventory();
  }

  setPartyInventory(next: InventoryState): void {
    this.commit({ ...this.data.value, partyInventory: next });
  }

  updateSettings(patch: Partial<DaggerheartData["settings"]>): void {
    this.commit({
      ...this.data.value,
      settings: { ...this.data.value.settings, ...patch },
    });
  }

  // -------------------------------------------------------------------------
  // Character CRUD
  // -------------------------------------------------------------------------

  getCharacter(id?: string): DaggerheartCharacter | null {
    const d = this.data.value;
    const target = id ?? d.ui.activeCharacterId;
    return d.characters.find((c) => c.id === target) ?? null;
  }

  addCharacter(name: string): DaggerheartCharacter {
    const d = this.data.value;
    const base =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "character";
    let id = `${base}-${randomSuffix()}`;
    while (d.characters.some((c) => c.id === id))
      id = `${base}-${randomSuffix()}`;
    const record: DaggerheartCharacter = { ...defaultCharacter(id), name };
    this.commit({
      ...d,
      characters: [...d.characters, record],
      ui: { ...d.ui, activeCharacterId: id },
    });
    return record;
  }

  upsertCharacter(record: DaggerheartCharacter): void {
    const d = this.data.value;
    const idx = d.characters.findIndex((c) => c.id === record.id);
    const characters = [...d.characters];
    if (idx === -1) characters.push(record);
    else characters[idx] = record;
    this.commit({
      ...d,
      characters,
      ui: { ...d.ui, activeCharacterId: record.id },
    });
  }

  removeCharacter(id: string): void {
    const d = this.data.value;
    const characters = d.characters.filter((c) => c.id !== id);
    const activeId =
      d.ui.activeCharacterId === id
        ? (characters[0]?.id ?? null)
        : d.ui.activeCharacterId;
    this.commit({
      ...d,
      characters,
      ui: { ...d.ui, activeCharacterId: activeId },
    });
  }

  /** Patch a single character field (or multiple fields). */
  updateCharacter(
    id: string,
    patch: Partial<DaggerheartCharacter>,
  ): void {
    const d = this.data.value;
    const characters = d.characters.map((c) =>
      c.id === id ? { ...c, ...patch } : c,
    );
    this.commit({ ...d, characters });
  }

  // -------------------------------------------------------------------------
  // Daggerheart play-state helpers
  // -------------------------------------------------------------------------

  setHp(id: string, current: number): void {
    const char = this.getCharacter(id);
    if (!char) return;
    this.updateCharacter(id, {
      hpCurrent: Math.max(0, Math.min(current, char.hpMax)),
    });
  }

  setStress(id: string, current: number): void {
    const char = this.getCharacter(id);
    if (!char) return;
    this.updateCharacter(id, {
      stressCurrent: Math.max(0, Math.min(current, char.stressMax)),
    });
  }

  setHope(id: string, current: number): void {
    this.updateCharacter(id, {
      hopeCurrent: Math.max(0, Math.min(current, 6)),
    });
  }

  toggleCondition(id: string, condition: string): void {
    const char = this.getCharacter(id);
    if (!char) return;
    const next = { ...char.conditions, [condition]: !char.conditions[condition] };
    this.updateCharacter(id, { conditions: next });
  }

  // -------------------------------------------------------------------------
  // Referencetab pinning (carried over from wayfinder)
  // -------------------------------------------------------------------------

  setReferencePins(id: string, pins: string[]): void {
    this.updateCharacter(id, { referencePins: pins });
  }

  setChecklistState(id: string, state: Record<string, boolean>): void {
    this.updateCharacter(id, { checklistState: state });
  }
}

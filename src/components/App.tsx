import { computeAll } from "../calc";
import { TABS, TAB_LABELS } from "../constants";
import type MiniSheetPlugin from "../main";
import type { MiniSheetStore } from "../state/store";
import { getCarrelApi } from "../util/carrel";
import { Banner } from "./combat/Banner";
import { CombatTab } from "./combat/CombatTab";
import { TraitsTab } from "./traits/TraitsTab";
import { ClassTab } from "./class/ClassTab";
import { EquipmentTab } from "./equipment/EquipmentTab";
import { BarebonesReferences } from "./rules/BarebonesReferences";
import { CarrelEmbed } from "./rules/CarrelEmbed";

interface AppProps {
  plugin: MiniSheetPlugin;
  store: MiniSheetStore;
}

export function App({ plugin, store }: AppProps) {
  const data = store.data.value;
  const active = data.ui.selectedTab;
  const character = store.getCharacter();
  const charactersReady = store.charactersReady.value;

  if (!character) {
    return (
      <div class="ms-sheet">
        <main class="ms-content">
          <div class="ms-placeholder">
            {charactersReady ? (
              <>
                <div>No character yet</div>
                <div class="ms-muted">
                  Run the "Daggerheart Sheet: New character" command to create one
                </div>
              </>
            ) : (
              <div class="ms-muted">Loading characters…</div>
            )}
          </div>
        </main>
      </div>
    );
  }

  const computed = computeAll(character);

  const carrelApi = data.settings.useCarrelReferences
    ? getCarrelApi(plugin.app)
    : null;

  return (
    <div class="ms-sheet ms-sheet--with-banner">
      <Banner plugin={plugin} store={store} character={character} />
      <nav class="ms-tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab}
            class={`ms-tab ms-tab--${tab}${tab === active ? " is-active" : ""}`}
            aria-label={TAB_LABELS[tab]}
            onClick={() => store.setTab(tab)}
          />
        ))}
        <button
          class="ms-tab ms-tab--config"
          aria-label="Configure character"
          onClick={() => void plugin.activateConfigView()}
        />
      </nav>
      <main class="ms-content">
        {active === "combat" ? (
          <CombatTab
            plugin={plugin}
            store={store}
            character={character}
            computed={computed}
          />
        ) : active === "traits" ? (
          <TraitsTab
            plugin={plugin}
            store={store}
            character={character}
            computed={computed}
          />
        ) : active === "class" ? (
          <ClassTab
            plugin={plugin}
            store={store}
            character={character}
            computed={computed}
          />
        ) : active === "equipment" ? (
          <EquipmentTab
            plugin={plugin}
            store={store}
            character={character}
            computed={computed}
          />
        ) : active === "rules" ? (
          carrelApi ? (
            <CarrelEmbed api={carrelApi} characterId={character.id} />
          ) : (
            <BarebonesReferences plugin={plugin} character={character} />
          )
        ) : (
          <div class="ms-placeholder ms-muted">
            {TAB_LABELS[active]} tab — coming in Phase 2
          </div>
        )}
      </main>
    </div>
  );
}

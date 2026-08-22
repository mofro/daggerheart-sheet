/**
 * Load-time data.json migrations for Daggerheart Sheet.
 *
 * This plugin starts at schemaVersion 1. There is no PF1e migration history;
 * if the loaded JSON pre-dates the Daggerheart rewrite it is treated as an
 * empty data file and the store's schema-forward merge supplies the defaults.
 */

import type { DaggerheartData } from "../types/data-file";

export function migrateData(
  raw: Partial<DaggerheartData>,
): Partial<DaggerheartData> {
  // Nothing to migrate yet — schema is at v1 and this is a fresh plugin.
  // Add per-version steps here as the schema evolves:
  //   const version = typeof raw.schemaVersion === "number" ? raw.schemaVersion : 0;
  //   if (version < 2) data = migrateToV2(data);
  return raw;
}

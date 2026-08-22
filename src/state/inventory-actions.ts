/**
 * Phase 1 stub — PF1e inventory mutations removed.
 * Daggerheart inventory is managed directly via store.updateCharacter.
 */

export type InventoryScope = "local" | "shared";
/** @deprecated PF1e */
export function setCurrency(
  _store: unknown,
  _scope: InventoryScope,
  _patch: unknown,
): void {}
/** @deprecated PF1e */
export function removeItem(_scope: InventoryScope, _id: string): void {}
/** @deprecated PF1e */
export function spendCharge(_scope: InventoryScope, _id: string): void {}
/** @deprecated PF1e */
export function updateItem(
  _scope: InventoryScope,
  _id: string,
  _patch: unknown,
): void {}

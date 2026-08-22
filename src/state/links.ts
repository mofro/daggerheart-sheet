/**
 * Phase 1 stub — familiar/derived pool resolution is PF1e-specific.
 * Daggerheart has no familiar link mechanic; this module is a no-op
 * until Phase 2 decides whether any derived-pool concept is needed.
 */

export interface ResolvedPool {
  id: string;
  name: string;
  current: number;
  max: number;
  footer?: string;
  kind?: "class" | "item";
  set(value: number): void;
}

export function resolvePool(_store: unknown, _character: unknown, _pool: unknown, _index: number): ResolvedPool | null {
  return null;
}

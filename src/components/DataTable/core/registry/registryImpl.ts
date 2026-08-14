import type { Registry } from "./registry";

/**
 * Runtime implementation of the generic Registry contract.
 *
 * Map is used internally because it provides:
 *
 * - PropertyKey-compatible keys
 * - predictable insertion semantics
 * - O(1) lookup
 * - clean runtime semantics
 * - no prototype-chain collisions
 *
 * The public API restores the relationship:
 *
 *   K -> TMap[K]
 */
export class RegistryImpl<TMap extends object> implements Registry<TMap> {
  /**
   * Runtime storage.
   *
   * JavaScript Map cannot retain the relationship between a
   * particular key K and TMap[K], so internally the value type
   * is the union of all possible map values.
   */
  private readonly values = new Map<keyof TMap, TMap[keyof TMap]>();

  /**
   * Register or replace a value.
   */
  register<K extends keyof TMap>(key: K, value: TMap[K]): void {
    this.values.set(key, value);
  }

  /**
   * Retrieve a value.
   *
   * Map#get returns TMap[keyof TMap], so we need to
   * re-establish the key/value relationship at this
   * boundary.
   */
  get<K extends keyof TMap>(key: K): TMap[K] | undefined {
    /**
     * Map stores the union of all values in TMap.
     *
     * The runtime key/value relationship is preserved by Map,
     * but TypeScript cannot recover that correlation from
     * `Map<keyof TMap, TMap[keyof TMap]>`.
     *
     * Keep the assertion local to this generic registry boundary.
     */
    return this.values.get(key) as TMap[K] | undefined;
  }

  /**
   * Check whether a value is registered.
   */
  has<K extends keyof TMap>(key: K): boolean {
    return this.values.has(key);
  }

  /**
   * Remove a value.
   */
  remove<K extends keyof TMap>(key: K): void {
    this.values.delete(key);
  }

  /**
   * Return all registered keys.
   */
  keys(): Array<keyof TMap> {
    return Array.from(this.values.keys());
  }
}

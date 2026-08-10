import type { Registry, RegistryKey } from "./registry";

/**
 * Runtime implementation of the generic Registry contract.
 *
 * Map is used internally because it gives us:
 *
 * - correct PropertyKey support
 * - O(1) lookup
 * - clean runtime semantics
 * - no prototype-chain collisions
 *
 * The generic relationship between key and value is preserved
 * at the public API boundary.
 */
export class RegistryImpl<TMap extends object> implements Registry<TMap> {
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

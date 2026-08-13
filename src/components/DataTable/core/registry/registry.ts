// import type { Registry, RegistryMap } from "./types";

/**
 * A key that can safely be used by JavaScript keyed collections.
 */
export type RegistryKey = PropertyKey;

/**
 * Generic strongly typed registry contract.
 *
 * TMap represents the relationship:
 *
 *     key -> value
 *
 * For example:
 *
 * interface Services {
 *   logger: LoggerService;
 *   persistence: PersistenceService;
 * }
 *
 * Then:
 *
 * registry.get("logger")
 *
 * is inferred as:
 *
 * LoggerService | undefined
 */
export interface Registry<TMap extends object> {
  /**
   * Register a value under a key.
   */
  register<K extends keyof TMap>(key: K, value: TMap[K]): void;

  /**
   * Retrieve a value.
   */
  get<K extends keyof TMap>(key: K): TMap[K] | undefined;

  /**
   * Determine whether a value exists.
   */
  has<K extends keyof TMap>(key: K): boolean;

  /**
   * Remove a value.
   */
  remove<K extends keyof TMap>(key: K): void;

  /**
   * Get all registered keys.
   */
  keys(): Array<keyof TMap>;
}

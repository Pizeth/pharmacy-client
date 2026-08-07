/**
 * Base constraint for registry keys.
 *
 * PropertyKey is the TypeScript type representing:
 *
 * - string
 * - number
 * - symbol
 */
export type RegistryKey = PropertyKey;

/**
 * A registry map describes the relationship between
 * registry keys and the values stored under those keys.
 *
 * Example:
 *
 * type Components = {
 *   button: ButtonComponent;
 *   dialog: DialogComponent;
 * };
 *
 * RegistryMap guarantees that:
 *
 * "button" -> ButtonComponent
 * "dialog" -> DialogComponent
 */
export type RegistryMap = Record<RegistryKey, unknown>;

/**
 * Generic strongly-typed registry contract.
 *
 * A registry stores values by key while
 * preserving the relationship between:
 *
 * Key -> Value
 *
 * throughout registration and retrieval.
 */
export interface Registry<TMap extends RegistryMap> {
  /**
   * Register a value under a key.
   *
   * The value must correspond to the selected key.
   *
   * Example:
   *
   * registry.register(
   *   "button",
   *   buttonComponent,
   * );
   */
  register<K extends keyof TMap>(key: K, value: TMap[K]): void;

  /**
   * Retrieve a value.
   *
   * The returned type is determined by the key.
   */
  get<K extends keyof TMap>(key: K): TMap[K] | undefined;

  /**
   * Determine whether a key has a registered value.
   */
  has<K extends keyof TMap>(key: K): boolean;

  /**
   * Remove a registered value.
   */
  remove<K extends keyof TMap>(key: K): void;

  /**
   * Return all currently registered keys.
   */
  keys(): Array<keyof TMap>;
}

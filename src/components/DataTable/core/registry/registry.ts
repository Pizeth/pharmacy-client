import type { Registry, RegistryMap } from "./types";

/**
 * Runtime implementation of the generic Registry contract.
 *
 * This class deliberately contains no domain-specific behavior.
 *
 * It only provides strongly typed storage:
 *
 *     key -> value
 *
 * Specialized registries such as CommandRegistry can build
 * additional behavior on top of this primitive.
 */
export class RegistryImpl<TMap extends RegistryMap> implements Registry<TMap> {
  /**
   * Internal registry storage.
   *
   * Partial<TMap> is required because not every key has to be
   * registered at construction time.
   */
  private readonly values: Partial<TMap> = {};

  constructor() {
    this.values = {};
  }

  /**
   * Register a value.
   */
  register<K extends keyof TMap>(key: K, value: TMap[K]): void {
    this.values[key] = value;
  }

  /**
   * Retrieve a registered value.
   */
  get<K extends keyof TMap>(key: K): TMap[K] | undefined {
    return this.values[key];
  }

  /**
   * Determine whether the registry contains a key.
   *
   * We intentionally use hasOwnProperty rather than:
   *
   *     key in this.values
   *
   * because we only want values explicitly registered
   * in this registry.
   */
  has<K extends keyof TMap>(key: K): boolean {
    return Object.prototype.hasOwnProperty.call(this.values, key);
  }

  /**
   * Remove a registered value.
   */
  remove<K extends keyof TMap>(key: K): void {
    delete this.values[key];
  }

  /**
   * Return all currently registered keys.
   *
   * Object.keys() is typed by TypeScript as string[] because
   * JavaScript reflection cannot preserve our generic key union.
   *
   * The cast is therefore limited to the reflection boundary.
   *
   * Importantly, there is no `any` involved.
   */
  keys(): Array<keyof TMap> {
    return Object.keys(this.values) as Array<keyof TMap>;
  }
}

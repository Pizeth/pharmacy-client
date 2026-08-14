/**
 * Registers the own enumerable/string/symbol entries from a partial
 * registry map.
 *
 * `Reflect.ownKeys()` is intentional here instead of `Object.keys()`.
 *
 * Registry keys are `PropertyKey`, therefore a registry map may contain:
 *
 * - string keys
 * - number-like keys
 * - symbol keys
 *
 * `Object.keys()` would silently omit symbol keys.
 *
 * The only assertion is on the key list returned by the JavaScript runtime.
 * Once the key is restored to `keyof TMap`, indexed access preserves the
 * relationship between the key and its value.
 *
 * `undefined` is treated as "not provided". Registry maps should therefore
 * not use `undefined` as a meaningful stored value. This also matches
 * Registry#get(), where `undefined` means the key is absent.
 */
export function registerEntries<TMap extends object>(
  registry: {
    register<K extends keyof TMap>(key: K, value: TMap[K]): void;
  },
  values: Partial<TMap> | undefined,
): void {
  if (!values) {
    return;
  }

  const keys = Reflect.ownKeys(values) as Array<keyof TMap>;

  for (const key of keys) {
    const value = values[key];

    /**
     * Partial<TMap> means individual entries may be undefined.
     *
     * Only concrete values are registered.
     */
    if (value === undefined) {
      continue;
    }

    registry.register(key, value);
  }
}

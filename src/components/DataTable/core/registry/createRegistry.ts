// import { RegistryImpl } from "./registry";

import { RegistryImpl } from "./registryImpl";
import type { Registry } from "./types";

export function createRegistry<
  TMap extends Record<PropertyKey, object>,
>(): Registry<TMap> {
  return new RegistryImpl<TMap>();
}

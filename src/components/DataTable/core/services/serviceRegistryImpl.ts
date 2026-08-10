import { RegistryImpl } from "../registry/registryImpl";

import type { ServiceMap } from "./serviceMap";

import type { TypedServiceRegistry } from "./serviceRegistry";

/**
 * Runtime implementation of the service registry.
 */
export class ServiceRegistryImpl<TServices extends ServiceMap>
  extends RegistryImpl<TServices>
  implements TypedServiceRegistry<TServices> {}

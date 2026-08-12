// import { RegistryImpl } from "../registry/registryImpl";

// import type { ServiceMap } from "./serviceMap";

// // import type { TypedServiceRegistry } from "./serviceRegistry";

// /**
//  * Runtime implementation of the service registry.
//  */
// export class ServiceRegistryImpl<TServices extends ServiceMap>
//   extends RegistryImpl<TServices>
//   implements TypedServiceRegistry<TServices> {}

import { RegistryImpl } from "../registry/registryImpl";

import type { ServiceRegistry } from "./serviceRegistry";

/**
 * Runtime implementation of the DataTable service registry.
 *
 * The class currently delegates storage entirely to
 * RegistryImpl.
 *
 * It exists as a semantic extension point so service-specific
 * behavior can be introduced later without exposing the
 * generic registry implementation to consumers.
 */
export class ServiceRegistryImpl<TServices extends object>
  extends RegistryImpl<TServices>
  implements ServiceRegistry<TServices> {}

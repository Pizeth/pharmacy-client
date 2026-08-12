// import type { Registry } from "../registry/registry";

// import type { ServiceMap } from "./serviceMap";

// /**
//  * Strongly typed service registry.
//  */
// export type TypedServiceRegistry<TServices extends ServiceMap> =
//   Registry<TServices>;

// /**
//  * Default service registry.
//  *
//  * Registry of DataTable services.
//  *
//  * This is intentionally just a specialized Registry.
//  *
//  * That means the generic key/value relationship is retained.
//  */
// export type ServiceRegistry = TypedServiceRegistry<ServiceMap>;

import type { Registry } from "../registry/registry";

/**
 * Strongly typed registry of DataTable services.
 *
 * TServices describes the exact relationship:
 *
 *   service key -> service implementation
 *
 * Example:
 *
 * type AppServices = {
 *   logging: LoggingService;
 *   persistence: PersistenceService;
 * };
 *
 * ServiceRegistry<AppServices>
 *
 * then guarantees:
 *
 * services.get("logging")
 *
 * is:
 *
 * LoggingService | undefined
 */
export type ServiceRegistry<TServices extends object> = Registry<TServices>;

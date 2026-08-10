import type { Registry } from "../registry/registry";

import type { ServiceMap } from "./serviceMap";

/**
 * Strongly typed service registry.
 */
export type TypedServiceRegistry<TServices extends ServiceMap> =
  Registry<TServices>;

/**
 * Default service registry.
 *
 * Registry of DataTable services.
 *
 * This is intentionally just a specialized Registry.
 *
 * That means the generic key/value relationship is retained.
 */
export type ServiceRegistry = TypedServiceRegistry<ServiceMap>;

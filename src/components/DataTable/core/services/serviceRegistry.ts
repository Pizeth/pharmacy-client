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

/**
 * Combines feature objects while preserving
 * their concrete feature slot types.
 *
 * Example:
 *
 * A = {
 *   auditFeature: AuditFeature
 * }
 *
 * B = {
 *   rowSortingFeature: typeof rowSortingFeature
 * }
 *
 * Result:
 *
 * {
 *   auditFeature: AuditFeature;
 *   rowSortingFeature: typeof rowSortingFeature;
 * }
 *
 * Merge two object types using JavaScript object-spread
 * semantics.
 *
 * Properties from B replace properties with the same key
 * from A.
 *
 * Runtime equivalent:
 *
 *   {
 *     ...a,
 *     ...b,
 *   }
 */
export type MergeFeatures<A, B> = Omit<A, keyof B> & B;

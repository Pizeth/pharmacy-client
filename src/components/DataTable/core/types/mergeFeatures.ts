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
 */
export type MergeFeatures<A, B> = Omit<A, keyof B> & B;

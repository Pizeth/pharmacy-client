// src/components/DataTable/core/utils/globalFilter.ts

/**
 * Convert TanStack's broad runtime global-filter value into the canonical
 * textual search representation used by DataTable.
 */
export function normalizeDataTableGlobalFilter(
  value: unknown,
): string {
  return typeof value === "string"
    ? value
    : "";
}

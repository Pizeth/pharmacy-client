// mui/utils/globalFilter.ts

/**
 * Convert TanStack's runtime global-filter value into the string
 * representation understood by the standard MUI search field.
 *
 * Our search component deliberately does not stringify arbitrary
 * object values.
 *
 * If a consumer uses a non-string global-filter model, they should
 * provide a specialized global-filter UI instead of routing that
 * state through the standard text search component.
 */
export function normalizeDataTableGlobalFilter(value: unknown): string {
  return typeof value === "string" ? value : "";
}

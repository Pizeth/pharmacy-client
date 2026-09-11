/**
 * ------------------------------------------------------------------
 * MUI theme component names owned by DataTable
 * ------------------------------------------------------------------
 *
 * Keep these names centralized.
 *
 * They are used by:
 *
 * - useThemeProps()
 * - styled()
 * - MUI theme ComponentsPropsList augmentation
 * - future theme.components styleOverrides/defaultProps/variants
 *
 * Do not duplicate these string literals throughout the component
 * implementation.
 */
export const DATA_TABLE_THEME_COMPONENT_NAMES = {
  textFilter: "RazethDataTableTextFilter",
  numberFilter: "RazethDataTableNumberFilter",
  numberRangeFilter: "RazethDataTableNumberRangeFilter",
  booleanFilter: "RazethDataTableBooleanFilter",
  selectFilter: "RazethDataTableSelectFilter",
  filterIndicator: "RazethDataTableFilterIndicator",
} as const;

export type DataTableThemeComponentName =
  (typeof DATA_TABLE_THEME_COMPONENT_NAMES)[keyof typeof DATA_TABLE_THEME_COMPONENT_NAMES];

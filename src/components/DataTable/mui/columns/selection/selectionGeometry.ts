/**
 * Shared physical geometry for both selection checkboxes.
 *
 * Header and body selection controls must occupy the exact same box or the
 * header checkbox appears horizontally/vertically offset from row checkboxes
 * even though both table cells are center-aligned.
 *
 * Keep this as structural component styling rather than caller sx so:
 *
 * - every DataTable receives the same default geometry
 * - RazethDataTable theme slots may still override it globally
 * - resources never need visual fixes in their column definitions
 */
export const DATA_TABLE_SELECTION_CHECKBOX_SIZE = 28;

export const dataTableSelectionCheckboxStyles = {
  width: DATA_TABLE_SELECTION_CHECKBOX_SIZE,
  height: DATA_TABLE_SELECTION_CHECKBOX_SIZE,
  padding: 0,
  margin: 0,
  flex: `0 0 ${DATA_TABLE_SELECTION_CHECKBOX_SIZE}px`,
} as const;

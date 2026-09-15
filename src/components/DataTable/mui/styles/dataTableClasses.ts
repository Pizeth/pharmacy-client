import { generateUtilityClass, generateUtilityClasses } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME } from "./constants";

/**
 * ------------------------------------------------------------------
 * RazethDataTable utility-class registry
 * ------------------------------------------------------------------
 *
 * Slots are registered incrementally as renderer surfaces migrate to
 * the structural MUI theme architecture.
 *
 * Do NOT pre-register every possible DataTable element.
 *
 * A renderer surface joins this registry when it is actively migrated
 * to:
 *
 *   styled(..., {
 *     name: DATA_TABLE_COMPONENT_NAME,
 *     slot: "...",
 *   })
 *
 * This keeps:
 *
 * - utility classes
 * - styleOverrides keys
 * - renderer implementation
 *
 * synchronized.
 */
export const dataTableClasses = generateUtilityClasses(
  DATA_TABLE_COMPONENT_NAME,
  [
    "root",
    "content",
    "container",
    "table",
    /**
     * ============================================================
     * Global filtering
     * ============================================================
     */
    "globalFilter",

    /**
     * Utility/state classes.
     *
     * These are NOT named styled slots and therefore are excluded
     * from DataTableSlotKey below.
     */
    "globalFilterFullWidth",
    "globalFilterClearButton",

    /**
     * ============================================================
     * Filter structure
     * ============================================================
     */
    "filterRow",
    "filterCell",
    "filterIndicator",

    /**
     * ============================================================
     * Toolbar / pagination
     * ============================================================
     *
     * One physical TanStack header-group row.
     *
     * Future styled slot:
     *
     *   slot: "HeaderRow"
     */
    "toolbarSearch",
    "toolbar",
    "toolbarSelection",

    "pagination",
    "paginationDivider",
    "paginationControls",
    "paginationStatus",
    "paginationActions",
    "paginationButton",

    "pageSize",
    "pageSizeLabel",
    "pageSizeSelect",

    "toolbarActions",
    "toolbarFilterStatus",
    "searchToggleButton",
    "filterToggleButton",
    "densityButton",
    "fullscreenButton",
    "columnManagerButton",

    "toolbarRow",
    "toolbarStart",
    "toolbarCenter",
    "toolbarEnd",
    "toolbarSearchRow",

    /**
     * ============================================================
     * Body structure
     * ============================================================
     */
    "selectionBar",
    "selectionBarDivider",
    "selectionBarStart",
    "selectionBarEnd",
    "selectionBarStatus",
    "selectionClearButton",
    "bulkActions",
    "bulkActionButton",
    "selectAllCheckbox",
    "selectRowCheckbox",
    "expandRowButton",
    "expandAllButton",
    "refreshingIndicator",
    "body",
    "bodyRow",
    "bodyCell",

    /**
     * Body-wide loading/error/empty states.
     *
     * All three state renderers share:
     *
     *   BodyStateRow
     *   BodyStateCell
     *
     * while their actual content surfaces remain independently
     * themeable.
     */
    "bodyStateRow",
    "bodyStateCell",
    "emptyState",
    "loadingState",
    "errorState",

    /**
     * ============================================================
     * Detail-panel structure
     * ============================================================
     *
     * A detail panel is a renderer-owned full-width row attached to
     * TanStack row-expansion state.
     *
     * It deliberately remains separate from ordinary:
     *
     *   bodyRow
     *   bodyCell
     *
     * because application detail content does not participate in normal
     * cell sizing, truncation, pinning or density policies.
     */
    "detailPanelRow",
    "detailPanelCell",
    "detailPanel",

    /**
     * ============================================================
     * Header structure
     * ============================================================
     */
    "head",
    "headerRow",

    /**
     * One physical MUI TableCell representing either:
     *
     * - a real header
     * - a TanStack placeholder header
     *
     * Future styled slot:
     *
     *   slot: "HeaderCell"
     */
    "headerCell",

    /**
     * Width-owning content wrapper immediately inside HeaderCell.
     *
     * It separates:
     *
     *   physical cell geometry
     *
     * from:
     *
     *   semantic/interactable header layout
     *
     * Future styled slot:
     *
     *   slot: "HeaderCellContent"
     */
    "headerCellContent",

    /**
     * Semantic layout surface rendered by DataTableHeaderContent.
     *
     * For centered headers this owns the frozen:
     *
     *   1fr | label | 1fr
     *
     * layout contract.
     *
     * Future styled slot:
     *
     *   slot: "HeaderContent"
     */
    "headerContent",

    /**
     * Group-header label surface.
     *
     * Future styled slot:
     *
     *   slot: "HeaderGroupLabel"
     */
    "headerGroupLabel",

    /**
     * Exact centered-label track used by the symmetric header grid.
     *
     * Sort/filter/menu controls do NOT participate in this track's
     * intrinsic width.
     *
     * Future styled slot:
     *
     *   slot: "HeaderLabelTrack"
     */
    "headerLabelTrack",

    /**
     * Trailing header affordance region containing controls such as:
     *
     * - sort indicator
     * - active-filter indicator
     * - column menu
     *
     * Future styled slot:
     *
     *   slot: "HeaderActions"
     */
    "headerActions",

    /**
     * ============================================================
     * Header affordances
     * ============================================================
     */
    "headerLabel",
    "sortLabel",
    "sortIndicator",
    "sortButton",
    "sortIcon",
    "sortIndex",
    "columnMenuButton",
    "resizeHandle",
  ],
);

/**
 * Every generated utility class.
 *
 * This includes:
 *
 * - named styled slots
 * - state/utility classes
 */
export type DataTableClassKey = keyof typeof dataTableClasses;

/**
 * Utility classes that are NOT direct named styled slots.
 *
 * They may still be useful for state/selectors, but they do not map to:
 *
 *   theme.components.RazethDataTable.styleOverrides.<key>
 */
export type DataTableNonSlotClassKey =
  "globalFilterFullWidth" | "globalFilterClearButton";

/**
 * Named structural slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
 */
export type DataTableSlotKey = Exclude<
  DataTableClassKey,
  DataTableNonSlotClassKey
>;

/**
 * Generate one stable RazethDataTable utility class.
 *
 * Example:
 *
 *   getDataTableUtilityClass(
 *     "headerCell",
 *   )
 *
 * produces:
 *
 *   RazethDataTable-headerCell
 */
export function getDataTableUtilityClass(slot: DataTableClassKey): string {
  return generateUtilityClass(DATA_TABLE_COMPONENT_NAME, slot);
}

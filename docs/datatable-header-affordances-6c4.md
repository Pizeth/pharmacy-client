# Phase 1.7.10.6C.4 � Header sorting and menu theme slots

Implemented after the existing 6C.3 header-content migration. This document contains the complete current source of every file changed for 6C.4, followed by validation and browser acceptance steps.

## Architecture and scope

Seven structural slots join `RazethDataTable`: `headerLabel`, `sortLabel`, `sortIndicator`, `sortButton`, `sortIcon`, `sortIndex`, and `columnMenuButton`. Each has a stable utility class and an explicit `overridesResolver`. The existing class-derived `DataTableSlotKey` automatically makes these available to MUI theme augmentation; no new leaf theme families or augmentation imports are needed.

The label owns only its text width. The sort icon, multi-sort badge, filter indicator, and menu remain outside the centered label track. The frozen grid stays `minmax(0, 1fr) auto minmax(0, 1fr)`. Centered sort/menu controls keep their 20px geometry, and their glyphs retain the existing 18px size and 4px inline margins. Those contextual rules now live inside the controls, selected through the stable `headerActions` class and `data-align` attribute. Edge-aligned controls retain their existing sizes.

All permanent `sx` in the four migrated affordance components has moved into styled slots. Direction and active appearance derive from props supplied by TanStack, through `data-direction` and `data-active`. No duplicate sorting state or synchronization effect is introduced. Existing sort handler events, including Shift, pass through unchanged. The label remains the keyboard sort target; the visual indicator remains aria-hidden and outside tab order. The index remains one-based for display. The menu keeps its existing local anchor/open state and continues to call the existing TanStack-backed menu implementation.

The menu now uses stable header-content hover and focus-within selectors. Keyboard focus receives a visible outline on the sortable label. The header label-track palette access uses `(theme.vars ?? theme)` so standard `createTheme()` works as well as CSS-variable themes. Its existing color is preserved.

Resize, pinning behavior, toolbar, body, and pagination are outside this phase. Existing in-progress 6C.3 files and tests were preserved; changes to HeaderContent are limited to selectors, contextual-control styling removal, and the palette fallback.

## Theme customization example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        headerLabel: { fontWeight: 700 },
        sortLabel: { borderRadius: 4 },
        sortIndicator: { gap: 3 },
        sortButton: {
          '&[data-active="true"]': { opacity: 1 },
        },
        sortIcon: { color: 'currentColor' },
        sortIndex: { fontWeight: 700 },
        columnMenuButton: { backgroundColor: 'transparent' },
      },
    },
  },
});
```

Contextual sizing rules have selector specificity. When intentionally overriding centered sizing, match the same headerActions ancestor selector in the theme override. Preserve the symmetric label track when changing action appearance.

## Complete source

### src/components/DataTable/mui/styles/dataTableClasses.ts

```ts
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
     * Header structure
     * ============================================================
     *
     * Phase 1.7.10.6C begins the migration of the physical header
     * renderer to the same slot-based architecture already used by
     * the filter row.
     */

    /**
     * One physical TanStack header-group row.
     *
     * Future styled slot:
     *
     *   slot: "HeaderRow"
     */
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
    "headerLabel",
    "sortLabel",
    "sortIndicator",
    "sortButton",
    "sortIcon",
    "sortIndex",
    "columnMenuButton",
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
  | "globalFilterFullWidth"
  | "globalFilterClearButton";

/**
 * Named structural slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
 *
 * Examples after 6C:
 *
 *   styleOverrides: {
 *     headerCell: { ... },
 *     headerContent: { ... },
 *     headerActions: { ... },
 *     filterCell: { ... },
 *   }
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
```

### src/components/DataTable/mui/components/sorting/DataTableSortLabel.tsx

```tsx
"use client";

import { ButtonBase, styled } from "@mui/material";
import type { MouseEvent, ReactNode } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

export type DataTableSortDirection = "asc" | "desc" | false;

export interface DataTableSortLabelProps {
  readonly children: ReactNode;
  readonly direction: DataTableSortDirection;
  readonly canSort: boolean;
  /** Compatibility props: the separate indicator owns the badge. */
  readonly sortIndex?: number;
  readonly showSortIndex?: boolean;
  readonly onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const HeaderLabelRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderLabel",
  overridesResolver: (_props, styles) => styles.headerLabel,
})({
  display: "block",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 600,
  lineHeight: 1.25,
});

const SortLabelRoot = styled(ButtonBase, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortLabel",
  overridesResolver: (_props, styles) => styles.sortLabel,
})(({ theme }) => ({
  display: "inline-flex",
  minWidth: 0,
  maxWidth: "100%",
  color: "inherit",
  borderRadius: `calc(${typeof theme.shape.borderRadius === "number" ? `${theme.shape.borderRadius}px` : theme.shape.borderRadius} * 0.5)`,
  padding: 0,
  "&:hover": { color: (theme.vars ?? theme).palette.text.primary },
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
})) as typeof ButtonBase;

/** Only the label participates in the centered track's intrinsic width. */
export function DataTableSortLabel({
  children,
  direction,
  canSort,
  onClick,
}: DataTableSortLabelProps) {
  const label = (
    <HeaderLabelRoot className={dataTableClasses.headerLabel}>
      {children}
    </HeaderLabelRoot>
  );
  if (!canSort) return label;
  return (
    <SortLabelRoot
      component="span"
      className={dataTableClasses.sortLabel}
      data-direction={direction || "none"}
      onClick={onClick}
      aria-pressed={direction !== false ? true : undefined}
    >
      {label}
    </SortLabelRoot>
  );
}
```

### src/components/DataTable/mui/components/sorting/DataTableSortIndicator.tsx

```tsx
"use client";

import { IconButton, SvgIcon, styled } from "@mui/material";
import { ArrowDownward, SyncAlt } from "@mui/icons-material";
import type { MouseEvent } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { DataTableSortDirection } from "./DataTableSortLabel";
import { DataTableSortIndex } from "./DataTableSortIndex";

export interface DataTableSortIndicatorProps {
  readonly direction: DataTableSortDirection;
  readonly sortIndex?: number;
  readonly showSortIndex?: boolean;
  readonly onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const SortIndicatorRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortIndicator",
  overridesResolver: (_props, styles) => styles.sortIndicator,
})(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.25),
  flex: "0 0 auto",
}));

const SortButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortButton",
  overridesResolver: (_props, styles) => styles.sortButton,
})(({ theme }) => ({
  minWidth: 18,
  width: "3ch",
  height: 20,
  padding: 0,
  margin: 0,
  color: (theme.vars ?? theme).palette.text.secondary,
  opacity: 0.35,
  transition: theme.transitions.create(["opacity", "color"], {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover": { opacity: 1, color: (theme.vars ?? theme).palette.text.primary },
  '&[data-active="true"]': {
    opacity: 1,
    color: (theme.vars ?? theme).palette.primary.main,
  },

  [`.${dataTableClasses.headerActions}[data-align="center"] &`]: {
    width: 20,
    height: 20,
    minWidth: 20,
    padding: 0,
    margin: 0,
    flex: "0 0 20px",
  },
})) as typeof IconButton;

const SortIconRoot = styled(SvgIcon, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortIcon",
  overridesResolver: (_props, styles) => styles.sortIcon,
})<{ component: typeof ArrowDownward }>(({ theme }) => ({
  fontSize: "18px",
  [`.${dataTableClasses.headerActions}[data-align="center"] &`]: {
    marginInline: "4px",
  },
  transform: "rotate(-90deg)",
  '&[data-direction="asc"]': { transform: "rotate(180deg)" },
  '&[data-direction="desc"]': { transform: "none" },
  '&:not([data-direction="none"])': {
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

/** Visual sorting affordance, outside the centered label track. */
export function DataTableSortIndicator({
  direction,
  sortIndex,
  showSortIndex = false,
  onClick,
}: DataTableSortIndicatorProps) {
  const active = direction !== false;
  return (
    <SortIndicatorRoot className={dataTableClasses.sortIndicator}>
      <SortButtonRoot
        component="span"
        className={dataTableClasses.sortButton}
        data-active={active}
        size="small"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClick}
      >
        <SortIconRoot
          component={active ? ArrowDownward : SyncAlt}
          className={dataTableClasses.sortIcon}
          data-direction={direction || "none"}
        />
      </SortButtonRoot>
      {showSortIndex && active && sortIndex !== undefined && (
        <DataTableSortIndex index={sortIndex} />
      )}
    </SortIndicatorRoot>
  );
}
```

### src/components/DataTable/mui/components/sorting/DataTableSortIndex.tsx

```tsx
"use client";

import { styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX } from "../headerLayout";

export interface DataTableSortIndexProps {
  /** Zero-based TanStack sorting index, displayed as one-based order. */
  readonly index: number;
}

const SortIndexRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortIndex",
  overridesResolver: (_props, styles) => styles.sortIndex,
})(({ theme }) => ({
  ...theme.typography.caption,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX,
  minWidth: DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX,
  maxWidth: DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX,
  height: DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX,
  padding: 0,
  boxSizing: "border-box",
  borderRadius: `calc(${typeof theme.shape.borderRadius === "number" ? `${theme.shape.borderRadius}px` : theme.shape.borderRadius} * 0.75)`,
  fontSize: "0.625rem",
  lineHeight: 1,
  color: (theme.vars ?? theme).palette.text.secondary,
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
  flexShrink: 0,
}));

export function DataTableSortIndex({ index }: DataTableSortIndexProps) {
  return (
    <SortIndexRoot className={dataTableClasses.sortIndex} aria-hidden="true">
      {index + 1}
    </SortIndexRoot>
  );
}
```

### src/components/DataTable/mui/components/column-menu/DataTableColumnMenuButton.tsx

```tsx
"use client";

import { IconButton, Tooltip, styled } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState, type MouseEvent } from "react";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnFilterPopover } from "./DataTableColumnFilterPopover";
import { DataTableColumnMenu } from "./DataTableColumnMenu";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

const ColumnMenuButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ColumnMenuButton",
  overridesResolver: (_props, styles) => styles.columnMenuButton,
})(({ theme }) => ({
  flexShrink: 0,
  width: 28,
  height: 28,
  opacity: 0.3,
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
  '&[aria-expanded="true"], &:focus-visible, &.Mui-focusVisible': {
    opacity: 1,
  },
  [`.${dataTableClasses.headerContent}:hover &, .${dataTableClasses.headerContent}:focus-within &`]:
    { opacity: 1 },
  [`.${dataTableClasses.headerActions}[data-align="center"] &`]: {
    width: 20,
    height: 20,
    minWidth: 20,
    padding: 0,
    margin: 0,
    flex: "0 0 20px",
  },
  [`.${dataTableClasses.headerActions}[data-align="center"] & .MuiSvgIcon-root`]:
    { fontSize: 18, marginInline: "4px" },
}));

export interface DataTableColumnMenuButtonProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;
}

/**
 * Owns the ephemeral UI state for one column menu:
 *
 * - menu open/closed
 * - menu anchor
 * - filter popover open/closed
 * - filter popover anchor
 *
 * It does NOT own any table state.
 */
export function DataTableColumnMenuButton<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnMenuButtonProps<TData, TValue>) {
  const { table, column } = props;

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const menuOpen = menuAnchorEl !== null;

  const filterOpen = filterAnchorEl !== null;

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (): void => {
    setMenuAnchorEl(null);
  };

  const handleOpenFilter = (anchor: HTMLElement): void => {
    setFilterAnchorEl(anchor);
  };

  const handleCloseFilter = (): void => {
    setFilterAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Column options">
        <ColumnMenuButtonRoot
          className={dataTableClasses.columnMenuButton}
          size="small"
          aria-label={`Open options for column ${column.id}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen ? "true" : undefined}
          onClick={handleOpenMenu}
        >
          <MoreVert fontSize="small" />
        </ColumnMenuButtonRoot>
      </Tooltip>

      <DataTableColumnMenu
        table={table}
        column={column}
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        onOpenFilter={handleOpenFilter}
      />

      <DataTableColumnFilterPopover
        table={table}
        column={column}
        anchorEl={filterAnchorEl}
        open={filterOpen}
        onClose={handleCloseFilter}
      />
    </>
  );
}
```

### src/components/DataTable/mui/components/DataTableHeaderContent.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/DataTableHeaderContent.tsx

import { Box, styled } from "@mui/material";
import type { TableCellProps } from "@mui/material/TableCell";
import type { CellData, Header, RowData } from "@tanstack/table-core";
import type { MouseEvent } from "react";
import type { MuiDataTableFeatures } from "../features";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { MuiDataTableInstance } from "../table";
import { DataTableColumnMenuButton } from "./column-menu";
import { DataTableFilterIndicator } from "./filtering";
import { DataTableSortIndicator, DataTableSortLabel } from "./sorting";

/**
 * ------------------------------------------------------------------
 * HeaderContent structural slot
 * ------------------------------------------------------------------
 *
 * This is the semantic/interactable layout canvas inside one physical
 * HeaderCell.
 *
 * It deliberately owns:
 *
 * - centered-vs-edge header layout
 * - discoverability of trailing header actions
 *
 * It deliberately does NOT own:
 *
 * - physical column width
 * - sticky positioning
 * - pinning
 * - density
 * - resize-handle placement
 *
 * Those remain responsibilities of DataTableHeaderCell.
 */
const HeaderContentRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderContent",
  overridesResolver: (_props, styles) => styles.headerContent,
})(({ theme }) => ({
  /**
   * This canvas must occupy the complete usable inline width of the
   * physical header cell.
   *
   * Unlike the old nested percentage-height experiments, this is one
   * deliberate width-owning semantic layout surface.
   */
  width: "100%",

  minWidth: 0,
  alignItems: "center",
  whiteSpace: "nowrap",

  /**
   * Header actions remain visible but subordinate at rest.
   *
   * Hovering anywhere in the semantic header region—or moving
   * keyboard focus into it—promotes the action cluster.
   *
   * Use the stable utility class instead of the old hand-written:
   *
   *   .DataTable-headerActions
   */
  [`&:hover .${dataTableClasses.headerActions}, ` +
  `&:focus-within .${dataTableClasses.headerActions}`]: {
    opacity: 1,
  },

  /**
   * ==============================================================
   * Center alignment
   * ==============================================================
   *
   * THIS GEOMETRY IS FROZEN.
   *
   * Do not replace it with:
   *
   *   justify-content: center
   *
   * and do not center:
   *
   *   label + actions
   *
   * as one combined cluster.
   *
   * The middle track is mathematically centered regardless of how
   * much width the action region consumes.
   */
  '&[data-align="center"]': {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
  },

  /**
   * ==============================================================
   * Explicit left/start-style alignment
   * ==============================================================
   *
   * HeaderCell currently resolves logical DataTable alignment into
   * MUI's physical TableCell alignment before it reaches this
   * component.
   *
   * Therefore the values received here are currently:
   *
   *   left
   *   center
   *   right
   */
  '&[data-align="left"]': {
    display: "flex",
    justifyContent: "flex-start",
    gap: theme.spacing(0.25),
  },

  /**
   * ==============================================================
   * Explicit right/end-style alignment
   * ==============================================================
   */
  '&[data-align="right"]': {
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(0.25),
  },

  /**
   * Defensive fallback for any future MUI alignment value not covered
   * above.
   *
   * Current DataTableHeaderCell does not emit such a value, but this
   * prevents the semantic canvas from becoming unstyled if that
   * contract expands later.
   */
  "&:not([data-align])": {
    display: "flex",
    justifyContent: "flex-start",
    gap: theme.spacing(0.25),
  },
}));

/**
 * ------------------------------------------------------------------
 * HeaderGroupLabel structural slot
 * ------------------------------------------------------------------
 *
 * Group headers do not represent one sortable/filterable leaf column,
 * therefore they render only their semantic header content.
 */
const HeaderGroupLabelRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderGroupLabel",
  overridesResolver: (_props, styles) => styles.headerGroupLabel,
})({
  display: "block",
  width: "100%",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 600,

  /**
   * Group-header fallback remains centered.
   *
   * DataTableHeaderCell currently resolves all normal values to one
   * of left/center/right.
   */
  textAlign: "center",

  '&[data-align="left"]': {
    textAlign: "left",
  },

  '&[data-align="right"]': {
    textAlign: "right",
  },
});

/**
 * ------------------------------------------------------------------
 * HeaderLabelTrack structural slot
 * ------------------------------------------------------------------
 *
 * This is Track 2 of the centered:
 *
 *   1fr | LABEL | 1fr
 *
 * grid.
 *
 * Its intrinsic width MUST represent the label region only.
 *
 * Sort/filter/menu affordances live outside this track so they cannot
 * shift the label away from the physical column center.
 */
const HeaderLabelTrackRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderLabelTrack",
  overridesResolver: (_props, styles) => styles.headerLabelTrack,
})(({ theme }) => ({
  gridColumn: 2,
  minWidth: 0,
  display: "inline-flex",
  alignItems: "center",
  justifySelf: "center",
  overflow: "hidden",
  color: (theme.vars ?? theme).palette.error.main,

  // Preserve the existing label-track color while migrating affordances.

  // Center-track hover targets the stable label slot.
  [`&:hover .${dataTableClasses.headerLabel}`]: {
    color: (theme.vars ?? theme).palette.primary.main,
  },
}));

/**
 * ------------------------------------------------------------------
 * HeaderActions structural slot
 * ------------------------------------------------------------------
 *
 * Trailing semantic affordances:
 *
 * - sort direction
 * - multi-sort position
 * - active-filter indicator
 * - column menu
 *
 * Important:
 *
 * this region never participates in the centered label track's
 * intrinsic width.
 */
const HeaderActionsRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderActions",
  overridesResolver: (_props, styles) => styles.headerActions,
})(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  minWidth: 0,
  flex: "0 0 auto",

  /**
   * MRT-like discoverability:
   *
   * visible, but visually subordinate until hover/focus.
   */
  opacity: 0.4,

  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),

  /**
   * ============================================================
   * Center-aligned action track
   * ============================================================
   *
   * Grid track 3 starts exactly at the inline edge immediately
   * following the centered label track.
   */
  '&[data-align="center"]': {
    gridColumn: 3,

    /**
     * Begin immediately after the perfectly centered label track.
     */
    justifySelf: "start",

    /**
     * Sort/filter/menu should visually form one compact affordance
     * cluster.
     *
     * Do not add spacing between:
     *
     *   sort
     *   filter indicator
     *   menu
     *
     * Each control already owns its own tiny internal geometry.
     */
    gap: 0,

    /**
     * Tiny logical separation between the label and first
     * affordance.
     *
     * Use a logical property so RTL remains correct.
     */
    marginInlineStart: "1px",
  },

  /**
   * Non-centered headers naturally render their action cluster
   * immediately after the sortable label.
   */
  '&[data-align="left"], &[data-align="right"]': {
    gap: theme.spacing(0.25),
  },


}));

/**
 * Private symmetric leading track.
 *
 * This is intentionally NOT a public theme slot.
 *
 * Its only responsibility is maintaining the centered three-track
 * geometry:
 *
 *   empty 1fr | label | actions 1fr
 */
const HeaderLeadingTrack = styled("span")({
  display: "block",
  minWidth: 0,
});

export interface DataTableHeaderContentProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly header: Header<MuiDataTableFeatures, TData, TValue>;

  /**
   * Final alignment already resolved by DataTableHeaderCell.
   *
   * Center alignment receives optical compensation so the actual label
   * stays centered independently of sort/filter/menu affordances.
   *
   * Normal current values are:
   *
   * - left
   * - center
   * - right
   */
  readonly align: NonNullable<TableCellProps["align"]>;
}

/**
 * Semantic/interactable content for one DataTable header.
 *
 * ------------------------------------------------------------------
 * Centered-header invariant
 * ------------------------------------------------------------------
 *
 * A centered header does NOT center:
 *
 *   [label + sort + filter + menu]
 *
 * Instead it uses a symmetric three-track grid:
 *
 *   minmax(0,1fr) | LABEL | minmax(0,1fr)
 *
 * The label therefore occupies the physical column center regardless
 * of the trailing affordance width.
 *
 * Structural cell concerns remain in DataTableHeaderCell:
 *
 * - width
 * - sticky positioning
 * - pinning
 * - density
 * - resize handle
 */
export function DataTableHeaderContent<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableHeaderContentProps<TData, TValue>) {
  const { table, header, align } = props;

  const column = header.column;

  /**
   * Parent/group headers are presentation-only at this layer.
   *
   * Sorting/filter/menu interaction belongs to concrete leaf columns.
   */
  const isLeafHeader = header.subHeaders.length === 0;

  /**
   * ================================================================
   * Group header
   * ================================================================
   *
   * Group headers have no singular sorting/menu interaction model.
   */
  if (!isLeafHeader) {
    return (
      <HeaderGroupLabelRoot
        className={dataTableClasses.headerGroupLabel}
        data-align={align}
      >
        <table.FlexRender header={header} />
      </HeaderGroupLabelRoot>
    );
  }

  /**
   * ================================================================
   * Leaf header
   * ================================================================
   */
  return (
    <table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      })}
    >
      {(selected) => {
        /**
         * Keep state-dependent TanStack reads inside the subscribed
         * render function.
         */
        const canSort = column.getCanSort();

        const direction = column.getIsSorted();

        const sortIndex = column.getSortIndex();

        const sortHandler = column.getToggleSortingHandler();

        const canFilter = column.getCanFilter();

        const isFiltered = column.getIsFiltered();

        const enableColumnMenu =
          column.columnDef.meta?.enableColumnMenu ?? true;

        /**
         * Multi-sort badge only physically exists while:
         *
         * - this column is actively sorted
         * - multiple columns participate in sorting
         * - TanStack provides a valid sort index
         */
        const showSortIndex =
          selected.sorting.length > 1 &&
          direction !== false &&
          sortIndex !== undefined;

        /**
         * Filter indicator currently renders only for an active filter.
         */
        const showFilterIndicator = canFilter && isFiltered;

        /**
         * One canonical sort interaction handler for both:
         *
         * - semantic label
         * - visual sort indicator
         */
        const handleSortClick = sortHandler
          ? (event: MouseEvent<HTMLElement>): void => {
              event.stopPropagation();
              sortHandler(event);
            }
          : undefined;

        /**
         * The trailing action cluster is structurally identical for
         * centered and edge-aligned headers.
         *
         * Only its containing CSS layout changes.
         */
        const actions = (
          <HeaderActionsRoot
            className={dataTableClasses.headerActions}
            data-align={align}
          >
            {canSort && (
              <DataTableSortIndicator
                direction={direction}
                sortIndex={sortIndex}
                showSortIndex={showSortIndex}
                onClick={handleSortClick}
              />
            )}

            {showFilterIndicator && <DataTableFilterIndicator active />}

            {enableColumnMenu && (
              <DataTableColumnMenuButton table={table} column={column} />
            )}
          </HeaderActionsRoot>
        );

        /**
         * ==========================================================
         * Center alignment
         * ==========================================================
         *
         * FROZEN:
         *
         *   1fr | label | 1fr
         */
        if (align === "center") {
          return (
            // <Box
            //   className="DataTable-headerContent"
            //   sx={{
            //     /**
            //      * This MUST occupy the physical column width.
            //      *
            //      * Unlike the old nested 100% chain, this is a single
            //      * intentional layout canvas directly beneath the
            //      * physical TableCell wrapper.
            //      */
            //     width: "100%",
            //     minWidth: 0,

            //     display: "grid",

            //     /**
            //      * Symmetric tracks guarantee that the middle label
            //      * track stays at the physical column center.
            //      */
            //     gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",

            //     alignItems: "center",
            //     whiteSpace: "nowrap",

            //     /**
            //      * Header action discoverability.
            //      */
            //     "&:hover .DataTable-headerActions, &:focus-within .DataTable-headerActions":
            //       {
            //         opacity: 1,
            //       },
            //   }}
            // >
            <HeaderContentRoot
              className={dataTableClasses.headerContent}
              data-align="center"
            >
              {/**
               * ----------------------------------------------------
               * Track 1 —  Symmetric empty inline-start track.
               * ----------------------------------------------------
               *
               * It intentionally contains nothing.
               */}
              <HeaderLeadingTrack aria-hidden="true" />

              {/**
               * ----------------------------------------------------
               * Track 2 — Exact center label
               * ----------------------------------------------------
               *
               * This track is mathematically centered.
               *
               * Sort affordances are deliberately NOT part of this
               * track's intrinsic width.
               */}
              <HeaderLabelTrackRoot
                className={dataTableClasses.headerLabelTrack}
              >
                <DataTableSortLabel
                  canSort={canSort}
                  direction={direction}
                  onClick={
                    canSort
                      ? (event) => {
                          event.stopPropagation();
                          sortHandler?.(event);
                        }
                      : undefined
                  }
                >
                  <table.FlexRender header={header} />
                </DataTableSortLabel>
              </HeaderLabelTrackRoot>

              {/**
               * ----------------------------------------------------
               * Track 3 — AFFORDANCES
               * ----------------------------------------------------
               *
               * The track begins exactly at the right edge of the
               * centered label.
               *
               * This is why the controls appear immediately beside
               * the label while having ZERO influence on its center.
               */}
              {actions}
            </HeaderContentRoot>
          );
        }

        /**
         * ==========================================================
         * Explicit edge alignment
         * ==========================================================
         *
         * Left/right aligned headers naturally render from their
         * corresponding physical edge.
         *
         * They do NOT use the symmetric center grid.
         */
        return (
          <HeaderContentRoot
            className={dataTableClasses.headerContent}
            data-align={align}
          >
            {/**
             * ------------------------------------------------------
             * Main semantic (Label / sorting) region
             * ------------------------------------------------------
             *
             * This is the only flexible/shrinkable section.
             */}
            <DataTableSortLabel
              canSort={canSort}
              direction={direction}
              sortIndex={sortIndex}
              showSortIndex={showSortIndex}
              onClick={
                canSort
                  ? (event) => {
                      /**
                       * Important:
                       *
                       * stopPropagation prevents future header-level
                       * controls or menus from seeing the click.
                       */
                      event.stopPropagation();
                      sortHandler?.(event);
                    }
                  : undefined
              }
            >
              <table.FlexRender header={header} />
            </DataTableSortLabel>
            {actions}
          </HeaderContentRoot>
        );
      }}
    </table.Subscribe>
  );
}

// {/* <Box
//   className="DataTable-headerActions"
//   sx={{
//     gridColumn: 3,

//     /**
//      * Begin immediately after the perfectly centered label track.
//      */
//     justifySelf: "start",

//     display: "inline-flex",
//     alignItems: "center",

//     /**
//      * Sort/filter/menu should visually form one compact affordance
//      * cluster.
//      *
//      * Do not add spacing between:
//      *
//      *   sort
//      *   filter indicator
//      *   menu
//      *
//      * Each control already owns its own tiny internal geometry.
//      */
//     gap: 0,

//     minWidth: 0,

//     /**
//      * Only a tiny separation between the label and the first
//      * affordance.
//      *
//      * 1px is enough to avoid making the label/icon look joined.
//      */
//     ml: "1px",

//     opacity: 0.4,

//     transition: (theme) =>
//       theme.transitions.create("opacity", {
//         duration: theme.transitions.duration.shortest,
//       }),

//     /**
//      * Sort affordance.
//      */
//     "& .DataTable-sortButton": {
//       width: 18,
//       height: 20,
//       minWidth: 18,
//       p: 0,
//       m: 0,
//       flex: "0 0 18px",
//     },

//     /**
//      * Column-menu affordance.
//      */
//     "& .DataTable-columnMenuButton": {
//       width: 20,
//       height: 20,
//       minWidth: 20,
//       p: 0,
//       m: 0,
//       flex: "0 0 20px",
//     },

//     /**
//      * Keep the actual icons compact.
//      */
//     "& .DataTable-sortButton .MuiSvgIcon-root": {
//       fontSize: 15,
//     },

//     "& .DataTable-columnMenuButton .MuiSvgIcon-root": {
//       fontSize: 15,
//     },

//     /**
//      * ------------------------------------------------------------
//      * Compact all header IconButtons
//      * ------------------------------------------------------------
//      *
//      * This applies to:
//      *
//      *   sort indicator
//      *   column-menu button
//      *
//      * but only while they live inside the header action cluster.
//      */
//     "& .MuiIconButton-root": {
//       width: 20,
//       height: 20,
//       minWidth: 20,

//       p: 0,

//       /**
//        * Remove layout margins that could visually separate the
//        * controls.
//        */
//       m: 0,

//       flex: "0 0 20px",
//     },

//     /**
//      * Keep the actual glyph compact too.
//      */
//     "& .MuiIconButton-root .MuiSvgIcon-root": {
//       ml: "4px",
//       mr: "4px",
//       fontSize: 18,
//     },
//   }}
// >
//   {canSort && (
//     <DataTableSortIndicator
//       direction={direction}
//       sortIndex={sortIndex}
//       showSortIndex={showSortIndex}
//       onClick={
//         sortHandler
//           ? (event) => {
//               event.stopPropagation();

//               sortHandler(event);
//             }
//           : undefined
//       }
//     />
//   )}

//   {showFilterIndicator && <DataTableFilterIndicator active />}

//   {enableColumnMenu && (
//     <DataTableColumnMenuButton table={table} column={column} />
//   )}
// </Box>; */}

//  {
//    /**
//     * ------------------------------------------------------
//     * Active filter indicator
//     * ------------------------------------------------------
//     */
//  }
//  {
//    /* {showFilterIndicator && <DataTableFilterIndicator active />} */
//  }

//  {
//    /**
//     * ------------------------------------------------------
//     * Active filter indicator
//     * ------------------------------------------------------
//     *
//     *{canFilter && <DataTableFilterIndicator active={isFiltered} />}
//     */
//  }

//  {
//    /**
//     * ------------------------------------------------------
//     * Column action menu
//     * ------------------------------------------------------
//     *
//     * Keep it next to the header label/sort icon.
//     *
//     * It is faintly visible at rest rather than completely
//     * disappearing until hover.
//     */
//  }
//  {
//    enableColumnMenu && (
//      <Box
//        className="DataTable-headerActions"
//        sx={{
//          display: "inline-flex",
//          alignItems: "center",
//          justifyContent: "center",
//          width: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//          minWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//          maxWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//          flex: "0 0 auto",

//          /**
//           * MRT-like discoverability:
//           *
//           * visible but visually subordinate at rest;
//           * full emphasis on hover/focus.
//           */
//          opacity: 0.35,

//          transition: (theme) =>
//            theme.transitions.create("opacity", {
//              duration: theme.transitions.duration.shortest,
//            }),

//          /**
//           * Override a menu button implementation that may
//           * itself use hover-only opacity.
//           *
//           * The two-class descendant selector intentionally
//           * has enough specificity to establish the header
//           * presentation policy here.
//           *
//           * Establish the physical geometry that our center
//           * compensation calculation expects.
//           */
//          "& .MuiIconButton-root": {
//            width: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//            height: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//            minWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//            p: 0,
//            opacity: "inherit",
//            visibility: "visible",
//            // width: 24,
//            // height: 24,
//            // p: 0.25,
//            color: "text.secondary",

//            transition: (theme) =>
//              theme.transitions.create(
//                ["opacity", "color", "background-color"],
//                {
//                  duration: theme.transitions.duration.shortest,
//                },
//              ),

//            "&:hover": {
//              color: "text.primary",
//              backgroundColor: "action.hover",
//            },

//            "&:focus-visible": {
//              opacity: 1,
//              color: "text.primary",
//            },
//          },

//          // flexShrink: 0,
//        }}
//      >
//        <DataTableColumnMenuButton table={table} column={column} />
//      </Box>
//    );
//  }

/**
 * Show an index only when more than one column participates
 * in sorting.
 */
//   return (
//     <DataTableSortLabel
//       canSort={canSort}
//       direction={direction}
//       sortIndex={sortIndex}
//       showSortIndex={sortingLength > 1}
//       onClick={
//         canSort
//           ? (event) => {
//               /**
//                * Important:
//                *
//                * stopPropagation prevents future header-level
//                * controls or menus from seeing the click.
//                */
//               event.stopPropagation();

//               sortHandler?.(event);
//             }
//           : undefined
//       }
//     >
//       <table.FlexRender header={header} />
//     </DataTableSortLabel>
//   );

// {(sorting) => {
//   const canSort = column.getCanSort();

//   const direction = column.getIsSorted();

//   const sortIndex = column.getSortIndex();

//   const sortHandler = column.getToggleSortingHandler();

//   /**
//    * Show an index only when more than one column participates
//    * in sorting.
//    */
//   // const showSortIndex = table.getState()?.sorting?.length > 1;
//   const showSortIndex = sorting.length > 1;
```

### src/components/DataTable/mui/components/sorting/sortAffordanceTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { dataTableClasses } from "../../styles";
import { DataTableSortIndicator } from "./DataTableSortIndicator";
import { DataTableSortLabel } from "./DataTableSortLabel";

const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        headerLabel: { letterSpacing: "2px" },
        sortLabel: { backgroundColor: "rgb(10, 20, 30)" },
        sortIndicator: { gap: "7px" },
        sortButton: { borderRadius: "7px" },
        sortIcon: { color: "rgb(30, 20, 10)" },
        sortIndex: { backgroundColor: "rgb(40, 50, 60)" },
      },
    },
  },
});

function part(slot: keyof typeof dataTableClasses) {
  const node = document.querySelector(`.${dataTableClasses[slot]}`);
  if (!node) throw new Error(`Missing ${slot}`);
  return node;
}

describe("header sorting affordance theme", () => {
  it("applies structural overrides without adding the indicator to the label", () => {
    render(
      <ThemeProvider theme={theme}>
        <DataTableSortLabel canSort direction="asc">
          Name
        </DataTableSortLabel>
        <DataTableSortIndicator direction="asc" showSortIndex sortIndex={1} />
      </ThemeProvider>,
    );
    expect(part("headerLabel")).toHaveStyle({ letterSpacing: "2px" });
    expect(part("sortLabel")).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });
    expect(part("sortIndicator")).toHaveStyle({ gap: "7px" });
    expect(part("sortButton")).toHaveStyle({ borderRadius: "7px" });
    expect(part("sortIcon")).toHaveStyle({
      color: "rgb(30, 20, 10)",
      transform: "rotate(180deg)",
    });
    expect(part("sortIndex")).toHaveTextContent("2");
    expect(part("sortIndex")).toHaveStyle({
      backgroundColor: "rgb(40, 50, 60)",
    });
    expect(part("sortLabel")).not.toContainElement(
      part("sortIndicator") as HTMLElement,
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(part("sortButton")).toHaveAttribute("tabindex", "-1");
  });

  it.each([false, "asc", "desc"] as const)(
    "derives direction and badge visibility for %s",
    (direction) => {
      render(
        <ThemeProvider theme={theme}>
          <DataTableSortIndicator
            direction={direction}
            showSortIndex
            sortIndex={0}
          />
        </ThemeProvider>,
      );
      expect(part("sortIcon")).toHaveAttribute(
        "data-direction",
        direction || "none",
      );
      expect(part("sortButton")).toHaveAttribute(
        "data-active",
        String(direction !== false),
      );
      expect(
        document.querySelector(`.${dataTableClasses.sortIndex}`) !== null,
      ).toBe(direction !== false);
    },
  );

  it("keeps non-sortable labels non-interactive", () => {
    render(
      <ThemeProvider theme={theme}>
        <DataTableSortLabel canSort={false} direction={false}>
          Name
        </DataTableSortLabel>
      </ThemeProvider>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(part("headerLabel")).toHaveTextContent("Name");
  });

  it("forwards keyboard and modifier clicks to the supplied handler", () => {
    const onClick = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <DataTableSortLabel canSort direction={false} onClick={onClick}>
          Name
        </DataTableSortLabel>
      </ThemeProvider>,
    );
    const label = screen.getByRole("button", { name: "Name" });
    fireEvent.keyDown(label, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(label, { shiftKey: true });
    expect(onClick.mock.calls[1][0].shiftKey).toBe(true);
  });
});
```

### src/components/DataTable/mui/components/headerAffordanceInteraction.spec.tsx

```tsx
import { Table, TableHead } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHeaderRow } from "./DataTableHeaderRow";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableResizing: false,
    enableColumnFilter: false,
    meta: { headerAlign: "center" },
  }),
]);
const data = [{ name: "A" }];
function Fixture() {
  const table = useMuiDataTable({ columns, data, enableColumnResizing: false });
  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        <Table>
          <TableHead>
            <DataTableHeaderRow
              table={table}
              headerGroup={table.getHeaderGroups()[0]}
              headerRowIndex={0}
            />
          </TableHead>
        </Table>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}

it("preserves centered action geometry and opens the themed menu without sorting", async () => {
  render(
    <ThemeProvider
      theme={createTheme({
        components: {
          RazethDataTable: {
            styleOverrides: {
              columnMenuButton: { backgroundColor: "rgb(10, 20, 30)" },
            },
          },
        },
      })}
    >
      <Fixture />
    </ThemeProvider>,
  );
  const label = screen.getByRole("button", { name: "Name" });
  const menu = screen.getByRole("button", {
    name: "Open options for column name",
  });
  expect(menu).toHaveStyle({
    width: "20px",
    height: "20px",
    backgroundColor: "rgb(10, 20, 30)",
  });
  const content = document.querySelector(`.${dataTableClasses.headerContent}`)!;
  expect(content).toHaveStyle({
    gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
  });
  const track = document.querySelector(
    `.${dataTableClasses.headerLabelTrack}`,
  )!;
  expect(track).toContainElement(label);
  expect(track).not.toContainElement(menu);
  fireEvent.click(menu);
  expect(await screen.findByRole("menu")).toBeVisible();
  expect(menu).toHaveAttribute("aria-expanded", "true");
  expect(menu).toHaveStyle({ opacity: "1" });
  expect(label).not.toHaveAttribute("aria-pressed");
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  fireEvent.click(label);
  expect(label).toHaveAttribute("data-direction", "asc");
  expect(
    document.querySelector(`.${dataTableClasses.sortIcon}`),
  ).toHaveAttribute("data-direction", "asc");
  fireEvent.click(document.querySelector(`.${dataTableClasses.sortButton}`)!);
  expect(label).toHaveAttribute("data-direction", "desc");
});
```

## Validation

- `npm run typecheck`: passed (including TanStack feature synchronization).
- `npm run test:datatable -- --runInBand`: 18 suites, 96 tests passed.
- New tests verify all six sorting slot overrides, direction/badge state, non-sortable semantics, keyboard activation, Shift-click forwarding, menu theme/open state, centered 20px controls, and sorting through both label and indicator using a real TanStack table fixture.
- Existing 6C.3 centered-grid tests, header/pinning tests, filtering tests, and TranslationKey request-contract tests remain passing.

These are Jest/jsdom checks, not a live-browser geometric measurement. Live browser acceptance was not rerun for this phase.

## Browser acceptance checklist

1. Open TranslationKey and confirm centered labels stay centered while sorting cycles ascending, descending, and cleared.
2. Shift-click another sortable header; verify the one-based multi-sort badges appear outside label tracks.
3. Tab to the label and activate sorting with Enter/Space; verify focus remains visible.
4. Open the column menu; verify no sort changes, the button remains visible, and Escape dismisses the menu.
5. Check both centered and edge-aligned headers, then RTL, narrow columns, and horizontal scrolling.

The next implementation phase is **6C.5 � resize-handle theme migration**.

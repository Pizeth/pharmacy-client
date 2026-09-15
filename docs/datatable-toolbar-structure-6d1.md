# Phase 1.7.10.6D.1 � Toolbar structural slots and intentional header color

## Header color correction

The centered header label track intentionally uses `error.main` to distinguish header text from table-body text. That preference is restored:

```tsx
color: (theme.vars ?? theme).palette.error.main,
```

The fallback supports both CSS-variable themes and ordinary `createTheme()` themes. The header integration test now explicitly checks the intentional accent. The earlier 6C.6 recommendation to replace this color with inheritance is superseded by this correction. Existing hover styling remains primary-colored. This restores the previously accented label track; it does not recolor table-body cells or expand the color change to unrelated surfaces.

## Toolbar scope

Seven stable slots now belong to `RazethDataTable`:

| Slot | Responsibility |
| --- | --- |
| toolbar | Semantic header container, surface, border, padding and vertical spacing |
| toolbarRow | Primary controls row |
| toolbarStart | Application start content, selection summary, optional start search |
| toolbarCenter | Optional centered desktop search |
| toolbarEnd | End search, search toggle, custom content, status and actions |
| toolbarSearch | Accessible search wrapper and existing responsive width |
| toolbarSearchRow | Separate narrow-screen search row |

All seven use the existing component name, stable utility classes, and explicit `overridesResolver` mappings. `DataTableSlotKey` derives from the registry, so MUI styleOverrides typing expands automatically.

The toolbar's static `sx` objects move into `styled()` definitions. Existing MUI Stack direction, alignment and spacing props remain unchanged to preserve its layout behavior. Palette values and spacing are resolved from the theme. Search wrapper width remains 100% below `sm`, 320px at and above `sm`, constrained by maxWidth; the existing `md` media-query decision still moves it into its own row. This step preserves those two distinct breakpoints.

Search visibility, query ownership, debounce, application render callbacks, selection summary, filter status, and action order are unchanged. TanStack remains the query owner. No duplicate query state, effects, or runtime geometry variables are introduced.

Action buttons, selection summary, filter-status internals, and pagination are subsequent 6D work. The leaf global filter retains its existing theme family. Historical commented-out toolbar experiments were removed.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbar: { paddingBlock: 12 },
        toolbarRow: { minHeight: 48 },
        toolbarStart: { flexGrow: 2 },
        toolbarCenter: { maxWidth: 480 },
        toolbarEnd: { alignSelf: 'center' },
        toolbarSearch: { borderRadius: 8 },
        toolbarSearchRow: { paddingBlockStart: 8 },
      },
    },
  },
});
```

Numeric values in raw styled/theme CSS are pixels where applicable. The default implementation explicitly calls `theme.spacing()` for values formerly expressed in MUI spacing units.

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
    "toolbarSearch",
    "toolbar",
    "toolbarRow",
    "toolbarStart",
    "toolbarCenter",
    "toolbarEnd",
    "toolbarSearchRow",
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

### src/components/DataTable/mui/components/toolbar/DataTableToolbar.tsx

```tsx
"use client";

import { Box, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import { DataTableGlobalFilter } from "../global-filtering";
import type { MuiDataTableInstance } from "../../table";
import { DataTableSearchToggleButton } from "./actions";
import { DataTableToolbarActions } from "./DataTableToolbarActions";
import { DataTableToolbarFilterStatus } from "./DataTableToolbarFilterStatus";
import { DataTableToolbarSelection } from "./DataTableToolbarSelection";
import { renderDataTableToolbarContent } from "./renderToolbarContent";
import type {
  DataTableToolbarConfig,
  DataTableToolbarRenderContext,
} from "./types";
import { useDataTableToolbarSearchVisibility } from "./useDataTableToolbarSearchVisibility";
import { useDataTableAccessibility } from "../../accessibility";

const ToolbarRoot = styled("header", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Toolbar",
  overridesResolver: (_props, styles) => styles.toolbar,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1),
  minWidth: 0,
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
}));
const ToolbarRowRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarRow",
  overridesResolver: (_props, styles) => styles.toolbarRow,
})({ width: "100%", minWidth: 0, flexWrap: "wrap" });
const ToolbarStartRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarStart",
  overridesResolver: (_props, styles) => styles.toolbarStart,
})({ flex: "1 1 0", minWidth: 0, flexWrap: "wrap" });
const ToolbarCenterRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarCenter",
  overridesResolver: (_props, styles) => styles.toolbarCenter,
})({
  flex: "0 1 auto",
  minWidth: 0,
  display: "flex",
  justifyContent: "center",
});
const ToolbarEndRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarEnd",
  overridesResolver: (_props, styles) => styles.toolbarEnd,
})({ flex: "1 1 0", minWidth: 0, flexWrap: "wrap" });
const ToolbarSearchRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarSearch",
  overridesResolver: (_props, styles) => styles.toolbarSearch,
})(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("sm")]: { width: 320 },
  maxWidth: "100%",
  minWidth: 0,
  flexShrink: 1,
}));
const ToolbarSearchRowRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarSearchRow",
  overridesResolver: (_props, styles) => styles.toolbarSearchRow,
})({ width: "100%", minWidth: 0 });

export interface DataTableToolbarProps<
  TData extends RowData,
> extends DataTableToolbarConfig<TData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Standard High-level MUI toolbar.
 *
 * Layout responsibilities:
 *
 * - application-defined start/end actions
 * - global-search presentation
 * - search visibility toggle
 * - selected-row summary
 * - active-filter status
 * - internal DataTable actions
 * - responsive toolbar layout
 *
 * TanStack remains responsible for actual table state.
 */
export function DataTableToolbar<TData extends RowData>(
  props: DataTableToolbarProps<TData>,
) {
  const {
    table,
    search = true,
    searchMode = "always",
    searchPosition = "center",
    searchPlaceholder = "Search…",
    searchDebounceMs = 0,
    searchOpen: controlledSearchOpen,
    defaultSearchOpen = false,
    onSearchOpenChange,
    startContent,
    endContent,
    showSelectionSummary = true,
    enableFilterToggle = true,
    showFilterStatus = false,
    enableColumnManager = true,
    columnManager,
    enableDensity = true,
    enableFullscreen = true,
  } = props;

  const theme = useTheme();

  const { globalSearchId } = useDataTableAccessibility();

  /**
   * On narrower screens, search always moves beneath the primary
   * toolbar row and takes the available width.
   */
  const narrow = useMediaQuery(theme.breakpoints.down("md"));

  const context: DataTableToolbarRenderContext<TData> = {
    table,
  };

  const renderedStartContent = renderDataTableToolbarContent(
    startContent,
    context,
  );

  const renderedEndContent = renderDataTableToolbarContent(endContent, context);

  const searchVisibility = useDataTableToolbarSearchVisibility({
    enabled: search,
    mode: searchMode,
    open: controlledSearchOpen,
    defaultOpen: defaultSearchOpen,
    onOpenChange: onSearchOpenChange,
  });

  /**
   * Search field is created once and placed in the appropriate
   * desktop region, or its own responsive row on narrow screens.
   */
  const searchField = searchVisibility.open ? (
    <ToolbarSearchRoot
      className={dataTableClasses.toolbarSearch}
      id={globalSearchId}
      role="search"
      aria-label="Table search"
    >
      <DataTableGlobalFilter
        table={table}
        placeholder={searchPlaceholder}
        debounceMs={searchDebounceMs}
        fullWidth={narrow}
      />
    </ToolbarSearchRoot>
  ) : null;

  const desktopStartSearch =
    !narrow && searchPosition === "start" ? searchField : null;

  const desktopCenterSearch =
    !narrow && searchPosition === "center" ? searchField : null;

  const desktopEndSearch =
    !narrow && searchPosition === "end" ? searchField : null;

  return (
    <ToolbarRoot
      className={dataTableClasses.toolbar}
      data-data-table-toolbar="true"
    >
      {/**
       * ----------------------------------------------------------
       * Primary toolbar row
       * ----------------------------------------------------------
       */}
      <ToolbarRowRoot
        className={dataTableClasses.toolbarRow}
        direction="row"
        alignItems="center"
        spacing={1}
      >
        {/**
         * START REGION
         */}
        <ToolbarStartRoot
          className={dataTableClasses.toolbarStart}
          direction="row"
          alignItems="center"
          spacing={1}
        >
          {renderedStartContent}
          {showSelectionSummary && <DataTableToolbarSelection table={table} />}
          {desktopStartSearch}
        </ToolbarStartRoot>

        {/**
         * CENTER REGION
         *
         * Only reserve center space while a centered search field is
         * actually visible.
         */}
        {desktopCenterSearch && (
          <ToolbarCenterRoot className={dataTableClasses.toolbarCenter}>
            {desktopCenterSearch}
          </ToolbarCenterRoot>
        )}

        {/**
         * END REGION
         */}
        <ToolbarEndRoot
          className={dataTableClasses.toolbarEnd}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
        >
          {desktopEndSearch}

          {/**
           * Search visibility control comes before application
           * end-actions, matching the interaction order of the
           * existing MRT toolbar.
           */}
          {searchVisibility.canToggle && (
            <DataTableSearchToggleButton<TData>
              table={table}
              open={searchVisibility.open}
              onToggle={searchVisibility.toggle}
            />
          )}

          {renderedEndContent}

          {showFilterStatus && (
            <DataTableToolbarFilterStatus<TData> table={table} />
          )}

          <DataTableToolbarActions<TData>
            table={table}
            enableFilterToggle={enableFilterToggle}
            enableColumnManager={enableColumnManager}
            columnManager={columnManager}
            enableDensity={enableDensity}
            enableFullscreen={enableFullscreen}
          />
        </ToolbarEndRoot>
      </ToolbarRowRoot>
      {/**
       * ----------------------------------------------------------
       * Responsive search row
       * ----------------------------------------------------------
       *
       * On narrow screens the search position is ignored and the
       * field receives its own row.
       */}
      {narrow && searchField && (
        <ToolbarSearchRowRoot className={dataTableClasses.toolbarSearchRow}>
          {searchField}
        </ToolbarSearchRowRoot>
      )}
    </ToolbarRoot>
  );
}
```

### src/components/DataTable/mui/components/toolbar/toolbarStructureTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { DataTableToolbar } from "./DataTableToolbar";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ name: "alpha" }];
function Fixture({
  position = "center",
  collapsible = false,
}: {
  position?: "start" | "center" | "end";
  collapsible?: boolean;
}) {
  const table = useMuiDataTable({
    columns,
    data,
    initialState: { globalFilter: "alpha" },
  });
  return (
    <table.AppTable>
      <DataTableAccessibilityProvider>
        <DataTableToolbar
          table={table}
          searchPosition={position}
          searchMode={collapsible ? "collapsible" : "always"}
          defaultSearchOpen
          showSelectionSummary={false}
          enableFilterToggle={false}
          enableColumnManager={false}
          enableDensity={false}
          enableFullscreen={false}
          startContent={<span>Start action</span>}
          endContent={<span>End action</span>}
        />
      </DataTableAccessibilityProvider>
    </table.AppTable>
  );
}
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbar: { backgroundColor: "rgb(10, 20, 30)" },
        toolbarRow: { minHeight: "48px" },
        toolbarStart: { backgroundColor: "rgb(20, 30, 40)" },
        toolbarCenter: { backgroundColor: "rgb(30, 40, 50)" },
        toolbarEnd: { backgroundColor: "rgb(40, 50, 60)" },
        toolbarSearch: { borderRadius: "7px" },
        toolbarSearchRow: { paddingTop: "9px" },
      },
    },
  },
});
it.each(["start", "center", "end"] as const)(
  "preserves desktop %s search placement and themed regions",
  (position) => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Fixture position={position} />
      </ThemeProvider>,
    );
    const root = container.querySelector(`.${dataTableClasses.toolbar}`)!;
    expect(root.tagName).toBe("HEADER");
    expect(root).toHaveStyle({ backgroundColor: "rgb(10, 20, 30)" });
    expect(
      container.querySelector(`.${dataTableClasses.toolbarRow}`),
    ).toHaveStyle({ minHeight: "48px" });
    const region =
      position === "start"
        ? "toolbarStart"
        : position === "end"
          ? "toolbarEnd"
          : "toolbarCenter";
    const search = screen.getByRole("search", { name: "Table search" });
    expect(
      container.querySelector(`.${dataTableClasses[region]}`),
    ).toContainElement(search);
    expect(search).toHaveStyle({ borderRadius: "7px" });
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByText("Start action")).toBeVisible();
    expect(screen.getByText("End action")).toBeVisible();
  },
);
it("hides and reopens search without clearing TanStack's query", () => {
  render(
    <ThemeProvider theme={theme}>
      <Fixture collapsible />
    </ThemeProvider>,
  );
  expect(screen.getByRole("textbox")).toHaveValue("alpha");
  fireEvent.click(screen.getByRole("button", { name: "Hide global search" }));
  expect(screen.queryByRole("search")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show global search" }));
  expect(screen.getByRole("textbox")).toHaveValue("alpha");
});

it("moves the single search field to its themed row on narrow screens", () => {
  const original = window.matchMedia;
  window.matchMedia = (query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
  try {
    const { container, unmount } = render(
      <ThemeProvider theme={theme}>
        <Fixture position="end" />
      </ThemeProvider>,
    );
    const row = container.querySelector(
      `.${dataTableClasses.toolbarSearchRow}`,
    )!;
    expect(row).toHaveStyle({ paddingTop: "9px", width: "100%" });
    expect(row).toContainElement(screen.getByRole("search"));
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(
      container.querySelector(`.${dataTableClasses.toolbarCenter}`),
    ).toBeNull();
    unmount();
  } finally {
    window.matchMedia = original;
  }
});
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

  // Intentional header accent, independent of table-body text color.

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

### src/components/DataTable/mui/components/headTheme.spec.tsx

```tsx
import { Table } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../accessibility";
import { DataTableDensityProvider } from "../density";
import { DataTableFilterDisplayProvider } from "../filter-display";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHead } from "./DataTableHead";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableSorting: false,
    enableResizing: false,
    meta: { headerAlign: "center", enableColumnMenu: false },
  }),
]);
const data = [{ name: "A" }];
function Fixture({ showFilters }: { showFilters: boolean }) {
  const table = useMuiDataTable({ columns, data });
  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        <DataTableFilterDisplayProvider
          columnFilterDisplayMode="subheader"
          showColumnFilters={showFilters}
        >
          <DataTableAccessibilityProvider>
            <Table>
              <DataTableHead table={table} />
            </Table>
          </DataTableAccessibilityProvider>
        </DataTableFilterDisplayProvider>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        head: { backgroundColor: "rgb(11, 22, 33)" },
        headerCell: { color: "rgb(44, 55, 66)" },
      },
    },
  },
});
it.each([false, true])(
  "themes the real head and preserves filter-row visibility: %s",
  (showFilters) => {
    render(
      <ThemeProvider theme={theme}>
        <Fixture showFilters={showFilters} />
      </ThemeProvider>,
    );
    const head = screen.getByRole("rowgroup");
    expect(head.tagName).toBe("THEAD");
    expect(head).toHaveClass(dataTableClasses.head);
    expect(head).toHaveStyle({ backgroundColor: "rgb(11, 22, 33)" });
    expect(screen.getAllByRole("row")).toHaveLength(showFilters ? 2 : 1);
    const cell = screen.getByRole("columnheader", { name: "Name" });
    expect(cell).toHaveStyle({ color: "rgb(44, 55, 66)" });
    const track = cell.querySelector(`.${dataTableClasses.headerLabelTrack}`)!;
    // The intentional header accent remains independent of the body/cell text.
    expect(track).toHaveStyle({ color: theme.palette.error.main });
    expect(cell).toHaveAttribute("scope", "col");
  },
);
```

## Verification

- `npm run typecheck`: passed, including feature synchronization.
- `npm run test:datatable -- --runInBand`: **21 suites, 110 tests passed**.
- New toolbar coverage verifies start/center/end desktop search placement, structural overrides, exactly one search field, retained application content, collapsible-search query preservation, and narrow-screen row placement.
- Header tests verify the restored error-palette accent independently of the header-cell color.

This step was not rerun in the live browser. The prior live RTL/touch/pinned-scrolling acceptance gaps remain pending. No claims of those checks passing are made here.

Next focused implementation: **6D.2 � toolbar action and filter-status theme slots**, followed by pagination in its own step.

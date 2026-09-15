# Phase 1.7.10.6F.2 � Theme defaults and precedence

All eight existing DataTableThemeProps settings now have runtime consumers. MUI's public augmentation now accepts typed RazethDataTable.defaultProps. The implementation uses a small useThemeProps hook that reads only presentation defaults; resource data and controlled state never enter that merge.

## Public contract

| Theme default | Consumer / explicit override | Built-in fallback |
| --- | --- | --- |
| enableToolbar | DataTable.toolbar | true |
| enableGlobalSearch | toolbar.search | true |
| searchMode | toolbar.searchMode | always |
| searchPosition | toolbar.searchPosition | center |
| enableColumnManager | toolbar.enableColumnManager | true |
| enableDensityToggle | toolbar.enableDensity | true |
| enableFullscreen | toolbar.enableFullscreen | true |
| density | density provider: density, then defaultDensity | comfortable |

Explicit defined component props win over theme defaults. Undefined uses the theme value, then the built-in fallback. False is preserved. An explicit toolbar=true or configuration object renders the toolbar even when the theme disables it; toolbar=false always hides it. Toolbar configuration fields independently inherit missing defaults. Standalone DataTableToolbar instances also consume these defaults; their usual context-provider requirements remain unchanged.

Density deserves different treatment from presentation booleans: theme density supplies the initial uncontrolled value. Passing it as a controlled density would freeze user interaction. The provider continues to own uncontrolled changes and calls onDensityChange. Explicit controlled density wins, then explicit defaultDensity, then initial theme density, then comfortable. Changing the theme does not reset a mounted uncontrolled selection. This is the normal initial-state contract, not synchronization state.

Fullscreen enablement controls the action's visibility, not fullscreen state. Search placement retains its existing responsive behavior: narrow screens use the separate search row. Header error.main remains intentional and unchanged.

## Application theme example

```tsx
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    RazethDataTable: {
      defaultProps: {
        density: "compact",
        enableToolbar: true,
        enableGlobalSearch: true,
        searchMode: "collapsible",
        searchPosition: "start",
        enableColumnManager: true,
        enableDensityToggle: true,
        enableFullscreen: false,
      },
      styleOverrides: {
        root: { borderColor: "steelblue" },
      },
    },
  },
});
```

An individual table can override the defaults:

```tsx
<DataTable
  table={table}
  defaultDensity="comfortable"
  toolbar={{
    searchMode: "always",
    searchPosition: "end",
    enableFullscreen: true,
  }}
/>
```

`table` remains the existing typed useMuiDataTable instance; theme defaults never create table state or supply rows/columns.

## Verification and scope

- 33 suites / 177 tests passed.
- Typecheck and TanStack feature synchronization passed after adding the public augmentation.
- git diff --check passed, with existing Windows line-ending warnings.
- Five new tests cover toolbar visibility precedence, action/search defaults and explicit overrides, search mode/placement, mutable uncontrolled theme density, theme changes, and explicit/controlled density callback behavior.
- React review: hooks are unconditional, no effect mirrors state, controlled ownership remains intact, and presentation defaults do not leak into DOM props.
- No browser acceptance was performed in this phase. Responsive layout, fullscreen scrolling, RTL/pinning compositing, and keyboard acceptance remain live verification work.

## Next phase: 6F.3

Audit the variants and ownerState contract for the shared structural family before exposing new variant APIs. Keep resource objects out of styling state and verify variant application on intended slots. Whole-table RTL/accessibility and outstanding browser checks still need completion before closing 6F.

## Complete changed source

The following are full snapshots of the files touched in this phase, including existing content and earlier phase work.

### src/components/DataTable/mui/theme/useDataTableThemeDefaults.ts

```ts
"use client";

import { useThemeProps } from "@mui/material/styles";
import { DATA_TABLE_COMPONENT_NAME } from "../styles/constants";
import type { DataTableThemeProps } from "./types";

/** Read presentation defaults without merging resource or controlled state props. */
export function useDataTableThemeDefaults(): DataTableThemeProps {
  return useThemeProps({
    props: {} as DataTableThemeProps,
    name: DATA_TABLE_COMPONENT_NAME,
  });
}

```

### src/components/DataTable/mui/theme/types.ts

```ts
import type { MuiDataTableDensity } from "../density";
import type {
  DataTableToolbarSearchMode,
  DataTableToolbarSearchPosition,
} from "../components/toolbar";
import type {
  DataTableBooleanFilterProps,
  DataTableNumberFilterProps,
  DataTableNumberRangeFilterProps,
  DataTableSelectFilterProps,
  DataTableTextFilterProps,
} from "../components/filtering/types";

/**
 * Theme-level defaults supported by RazethDataTable.
 *
 * Important:
 *
 * Do not put row/resource-specific values here.
 *
 * Theme defaults should describe presentation and generic behavior,
 * not:
 *
 * - columns
 * - data
 * - API adapters
 * - resource query mappings
 */
export interface DataTableThemeProps {
  /**
   * Initial uncontrolled density for DataTables.
   * Explicit density/defaultDensity props take precedence.
   * Changing this theme default does not reset mounted density state.
   */
  readonly density?: MuiDataTableDensity;

  /**
   * Whether the standard toolbar is rendered.
   */
  readonly enableToolbar?: boolean;

  /**
   * Whether global search is rendered.
   */
  readonly enableGlobalSearch?: boolean;

  readonly searchMode?: DataTableToolbarSearchMode;

  readonly searchPosition?: DataTableToolbarSearchPosition;

  /**
   * Default visibility of the column-management action.
   */
  readonly enableColumnManager?: boolean;

  /**
   * Default density switch visibility.
   */
  readonly enableDensityToggle?: boolean;

  /**
   * Default fullscreen action visibility.
   */
  readonly enableFullscreen?: boolean;
}

/**
 * Slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
 */
export type {
  DataTableClassKey,
  DataTableSlotKey,
} from "../styles/dataTableClasses";

/**
 * ------------------------------------------------------------------
 * DataTable-specific MUI ComponentsPropsList extension
 * ------------------------------------------------------------------
 *
 * This interface is deliberately kept inside the DataTable package.
 *
 * The application-level RazethComponentsPropsList can extend it rather
 * than importing every individual DataTable component prop type.
 *
 * That keeps theme augmentation scalable as more DataTable slots become
 * theme-aware later.
 */
export interface DataTableComponentsPropsList {
  RazethDataTableTextFilter: Partial<DataTableTextFilterProps>;
  RazethDataTableNumberFilter: Partial<DataTableNumberFilterProps>;
  RazethDataTableNumberRangeFilter: Partial<DataTableNumberRangeFilterProps>;
  RazethDataTableBooleanFilter: Partial<DataTableBooleanFilterProps>;
  RazethDataTableSelectFilter: Partial<DataTableSelectFilterProps>;
}

```

### src/components/DataTable/mui/components/DataTable.tsx

```tsx
"use client";

import { Box, Table, TableContainer, styled } from "@mui/material";
import type { TableContainerProps, TableProps } from "@mui/material";
import type { CSSProperties } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { RowData } from "@tanstack/table-core";
import { useDataTableThemeDefaults } from "../theme/useDataTableThemeDefaults";
import { DataTableDensityProvider } from "../density";
import type { DataTableDensityConfig } from "../density";
import { DataTableFullscreenProvider } from "../fullscreen";
import type { DataTableFullscreenConfig } from "../fullscreen";
import type { MuiDataTableInstance } from "../table";
import { DataTableBody } from "./DataTableBody";
import { DataTableColumnGroup } from "./DataTableColumnGroup";
import { DataTableHead } from "./DataTableHead";
import { DataTableSelectionBar } from "./selection";
import type { DataTableSelectionBarConfig } from "./selection";
import { DataTablePagination } from "./pagination";
import type { DataTablePaginationConfig } from "./pagination";
import { DataTableShell } from "./DataTableShell";
import { DataTableRefreshingIndicator } from "./states";
import { DataTableToolbar } from "./toolbar";
import type { DataTableToolbarConfig } from "./toolbar";
import { DataTableFilterDisplayProvider } from "../filter-display";
import type { DataTableFilterDisplayConfig } from "../filter-display";
import { DataTableDetailPanelRenderer } from "./detail-panel";
import { DataTableAccessibilityProvider } from "../accessibility";

const ContentRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})({ display: "flex", flexDirection: "column", minWidth: 0 });

const ContainerRoot = styled(TableContainer, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Container",
  overridesResolver: (_props, styles) => styles.container,
})({ overflowX: "auto", position: "relative", flex: 1, minHeight: 0 });

const TableRoot = styled(Table, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Table",
  overridesResolver: (_props, styles) => styles.table,
})({
  tableLayout: "fixed",
  borderCollapse: "separate",
  borderSpacing: 0,
  width: "var(--DataTable-table-size)",
  minWidth: "var(--DataTable-table-size)",
});

export interface DataTableTableStyle extends CSSProperties {
  "--DataTable-table-size": string;
}

export interface DataTableProps<TData extends RowData>
  extends
    DataTableDensityConfig,
    DataTableFullscreenConfig,
    DataTableFilterDisplayConfig {
  /**
   * Table instance created by useMuiDataTable().
   *
   * We deliberately accept the completed table instance rather than
   * data/columns here.
   *
   * Table creation and table rendering are separate responsibilities.
   */
  readonly table: MuiDataTableInstance<TData>;

  /**
   * Props forwarded to MUI's <Table>.
   */
  readonly tableProps?: Omit<TableProps, "children">;

  /**
   * Props forwarded to MUI's <TableContainer>.
   */
  readonly containerProps?: Omit<TableContainerProps, "children">;

  /**
   * false:
   *   don't render the standard toolbar.
   *
   * true / undefined:
   *   render default toolbar.
   *
   * object:
   *   configure standard toolbar.
   */
  readonly toolbar?: boolean | DataTableToolbarConfig<TData>;

  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;

  /**
   * false:
   *   disable the selection status/bulk-action bar.
   *
   * undefined:
   *   no selection bar by default.
   *
   * object:
   *   render the configured selection bar whenever rows are selected.
   */
  readonly selectionBar?: false | DataTableSelectionBarConfig<TData>;

  /**
   * false disables pagination UI.
   *
   * An object customizes the pagination renderer.
   */
  readonly pagination?: false | DataTablePaginationConfig;

  /**
   * Non-blocking server/background refresh state.
   *
   * Unlike table meta.loading, this does NOT replace the current rows.
   *
   * Default: false.
   */
  readonly refreshing?: boolean;

  /**
   * Optional real background-request progress in the range 0..100.
   *
   * When omitted while `refreshing` is true, the refresh indicator uses
   * a YouTube/NProgress-style simulated trickle.
   *
   * This value is presentation-only and is never stored in TanStack
   * table state.
   */
  readonly refreshProgress?: number;
}

/**
 * MUI renderer for a fully-created MUI DataTable instance.
 *
 * Responsibilities:
 *
 * - install TanStack's AppTable context
 * - render the semantic MUI table shell
 * - delegate header rendering
 * - delegate body rendering
 *
 * It intentionally does NOT:
 *
 * - create TanStack state
 * - own table configuration
 * - own pagination
 * - own toolbar state
 * - duplicate TanStack subscriptions
 *
 * TanStack owns:
 *
 * - table state
 * - row models
 * - column widths
 * - resize state
 * - column APIs
 *
 * This component owns only the native/MUI rendering shell.
 */
export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const themeDefaults = useDataTableThemeDefaults();
  const {
    table,
    tableProps,
    containerProps,
    toolbar = themeDefaults.enableToolbar ?? true,
    renderDetailPanel,
    refreshing = false,
    refreshProgress,
    selectionBar = false,
    pagination = {},
    density,
    defaultDensity,
    onDensityChange,
    columnFilterDisplayMode,
    defaultColumnFilterDisplayMode,
    onColumnFilterDisplayModeChange,
    showColumnFilters,
    defaultShowColumnFilters,
    onShowColumnFiltersChange,
    fullscreen,
    defaultFullscreen,
    onFullscreenChange,
  } = props;

  const toolbarConfig = typeof toolbar === "object" ? toolbar : {};

  /**
   * Keep TanStack's resize-direction calculation aligned with the MUI theme.
   *
   * Ideally this option is supplied while creating the table:
   *
   *   columnResizeDirection: theme.direction
   *
   * We do not mutate table options here because renderers should not become
   * table configuration owners.
   */
  //   const direction = theme.direction;

  return (
    <table.AppTable>
      <DataTableAccessibilityProvider>
        <DataTableDensityProvider
          density={density}
          defaultDensity={defaultDensity}
          onDensityChange={onDensityChange}
        >
          <DataTableFullscreenProvider
            fullscreen={fullscreen}
            defaultFullscreen={defaultFullscreen}
            onFullscreenChange={onFullscreenChange}
          >
            <DataTableFilterDisplayProvider
              columnFilterDisplayMode={columnFilterDisplayMode}
              defaultColumnFilterDisplayMode={defaultColumnFilterDisplayMode}
              onColumnFilterDisplayModeChange={onColumnFilterDisplayModeChange}
              showColumnFilters={showColumnFilters}
              defaultShowColumnFilters={defaultShowColumnFilters}
              onShowColumnFiltersChange={onShowColumnFiltersChange}
            >
              <DataTableShell>
                {toolbar !== false && (
                  <DataTableToolbar table={table} {...toolbarConfig} />
                )}
                <ContentRoot className={dataTableClasses.content}>
                  <DataTableRefreshingIndicator
                    refreshing={refreshing}
                    progress={refreshProgress}
                  />
                  <ContainerRoot
                    {...containerProps}
                    className={[
                      dataTableClasses.container,
                      containerProps?.className,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <table.Subscribe
                      selector={(state) => ({
                        columnSizing: state.columnSizing,
                        columnVisibility: state.columnVisibility,
                      })}
                    >
                      {() => {
                        const totalSize = table.getTotalSize();
                        const tableStyle: DataTableTableStyle = {
                          "--DataTable-table-size": `${totalSize}px`,
                          ...tableProps?.style,
                        };

                        return (
                          <TableRoot
                            {...tableProps}
                            className={[
                              dataTableClasses.table,
                              tableProps?.className,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            style={tableStyle}
                          >
                            <DataTableColumnGroup table={table} />
                            <DataTableHead table={table} />
                            <DataTableBody
                              table={table}
                              renderDetailPanel={renderDetailPanel}
                            />
                          </TableRoot>
                        );
                      }}
                    </table.Subscribe>
                  </ContainerRoot>
                  {selectionBar !== false && (
                    <DataTableSelectionBar table={table} {...selectionBar} />
                  )}
                  {pagination !== false && (
                    <DataTablePagination table={table} {...pagination} />
                  )}
                </ContentRoot>
              </DataTableShell>
            </DataTableFilterDisplayProvider>
          </DataTableFullscreenProvider>
        </DataTableDensityProvider>
      </DataTableAccessibilityProvider>
    </table.AppTable>
  );
}

```

### src/components/DataTable/mui/components/toolbar/DataTableToolbar.tsx

```tsx
"use client";

import { Box, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import { useDataTableThemeDefaults } from "../../theme/useDataTableThemeDefaults";
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
  const themeDefaults = useDataTableThemeDefaults();
  const {
    table,
    search = themeDefaults.enableGlobalSearch ?? true,
    searchMode = themeDefaults.searchMode ?? "always",
    searchPosition = themeDefaults.searchPosition ?? "center",
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
    enableColumnManager = themeDefaults.enableColumnManager ?? true,
    columnManager,
    enableDensity = themeDefaults.enableDensityToggle ?? true,
    enableFullscreen = themeDefaults.enableFullscreen ?? true,
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

### src/components/DataTable/mui/density/DataTableDensityProvider.tsx

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useDataTableThemeDefaults } from "../theme/useDataTableThemeDefaults";
import type { ReactNode } from "react";
import type { MuiDataTableDensity } from "./types";

/**
 * Value exposed to MUI DataTable presentation components.
 */
export interface DataTableDensityContextValue {
  readonly density: MuiDataTableDensity;

  /**
   * Request a new density.
   *
   * In uncontrolled mode this updates internal state.
   *
   * In controlled mode this only calls onDensityChange and expects the
   * controlling consumer to provide the next `density` value.
   */
  readonly setDensity: (density: MuiDataTableDensity) => void;
}

const DataTableDensityContext = createContext<
  DataTableDensityContextValue | undefined
>(undefined);

export interface DataTableDensityProviderProps {
  readonly children: ReactNode;

  /**
   * Controlled density.
   */
  readonly density?: MuiDataTableDensity;

  /**
   * Initial uncontrolled value.
   */
  readonly defaultDensity?: MuiDataTableDensity;

  readonly onDensityChange?: (density: MuiDataTableDensity) => void;
}

/**
 * MUI-only presentation-state provider.
 *
 * Density does not belong to TanStack's TableState because TanStack
 * does not own this visual concern.
 */
export function DataTableDensityProvider(props: DataTableDensityProviderProps) {
  const themeDefaults = useDataTableThemeDefaults();
  const {
    children,
    density: controlledDensity,

    defaultDensity = themeDefaults.density ?? "comfortable",

    onDensityChange,
  } = props;

  const [uncontrolledDensity, setUncontrolledDensity] =
    useState<MuiDataTableDensity>(defaultDensity);

  const isControlled = controlledDensity !== undefined;

  const density = controlledDensity ?? uncontrolledDensity;

  const setDensity = useCallback(
    (nextDensity: MuiDataTableDensity): void => {
      /**
       * In uncontrolled mode we own the value.
       */
      if (!isControlled) {
        setUncontrolledDensity(nextDensity);
      }

      /**
       * In either mode the consumer may observe requested changes.
       */
      onDensityChange?.(nextDensity);
    },
    [isControlled, onDensityChange],
  );

  const contextValue = useMemo<DataTableDensityContextValue>(
    () => ({
      density,
      setDensity,
    }),
    [density, setDensity],
  );

  return (
    <DataTableDensityContext.Provider value={contextValue}>
      {children}
    </DataTableDensityContext.Provider>
  );
}

/**
 * Access the current MUI DataTable density state.
 *
 * Components using this hook must be rendered beneath DataTable.
 */
export function useDataTableDensity(): DataTableDensityContextValue {
  const context = useContext(DataTableDensityContext);

  if (context === undefined) {
    throw new Error(
      "useDataTableDensity must be used within DataTableDensityProvider.",
    );
  }

  return context;
}

```

### src/components/DataTable/mui/density/types.ts

```ts
// src/components/DataTable/mui/density/types.ts

/**
 * Visual density modes of the MUI DataTable.
 *
 * Density is intentionally a MUI presentation concept rather than a
 * TanStack's feature/state system.
 *
 * Naming follows the three-level convention:
 *
 * compact
 *   Highest information density.
 *
 * comfortable
 *   Balanced default density.
 *
 * spacious
 *   Largest spacing and easiest scanning.
 */
// export type MuiDataTableDensity = "compact" | "standard" | "comfortable";
export type MuiDataTableDensity = "compact" | "comfortable" | "spacious";

/**
 * Public density configuration accepted by DataTable.
 */
export interface DataTableDensityConfig {
  /**
   * Controlled density.
   *
   * When supplied, the consumer owns the current density value.
   */
  readonly density?: MuiDataTableDensity;

  /**
   * Initial density used in uncontrolled mode.
   *
   * Default: theme density, then "comfortable"
   */
  readonly defaultDensity?: MuiDataTableDensity;

  /**
   * Called whenever a density change is requested.
   *
   * This fires in both controlled and uncontrolled modes.
   */
  readonly onDensityChange?: (density: MuiDataTableDensity) => void;
}

```

### src/theme.d.ts

```ts
// src/theme.d.ts

import {
  CssVarsTheme,
  PaletteMode,
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
  CssVarsThemeOptions,
  ComponentsOverrides,
} from "@mui/material/styles";
import type { DataTableThemeProps } from "@/components/DataTable/mui/theme/types";
import type { DataTableSlotKey } from "@/components/DataTable/mui/styles/dataTableClasses";

import { ClassKey, CustomComponents } from "@/types/classKey";
import {
  Line,
  Meteor,
  RazethComponentsPropsList,
  SideImage,
} from "@/interfaces/theme.interface";

declare module "@mui/material/styles" {
  interface Palette {
    passwordStrength: string[] | ((theme: MuiTheme) => string[]);
    link: {
      hover: string;
    };
    card: string;
    customShadows: {
      neumorphic: string;
      inset: string;
      circleWell: string;
    };
    dynamic: {
      background: string;
    };
  }
  interface PaletteOptions {
    passwordStrength?: string[] | ((theme: MuiTheme) => string[]);
    link?: {
      hover?: string;
    };
    card?: string;
    customShadows?: {
      neumorphic: string;
      inset: string;
      circleWell: string;
    };
    dynamic?: {
      background: string;
    };
  }

  // 1. Extend ThemeVars to include your custom keys for CSS Variables
  interface ThemeVars {
    sideImage?: SideImage;
    // You can add other custom variable paths here
  }

  interface CommonColors {
    whiteChannel: string;
    blackChannel: string;
  }

  // 2. Merge MuiTheme with CssVarsTheme and your custom properties
  interface Theme extends CssVarsTheme {
    // explicitly non-optional — this is the missing piece
    vars: CssVarsTheme["vars"];
    custom: {
      sideImage: SideImage;
      lines: Line[];
      meteor: Meteor;
      paper: string;
    };
  }

  // 3. Do the same for ThemeOptions
  interface ThemeOptions extends CssVarsThemeOptions {
    custom?: {
      sideImage?: SideImage;
      lines?: Line[];
      meteor?: Meteor;
      paper?: string;
    };
  }

  // ComponentNameToClassKey can derive its keys from our map.
  // Note: If each component has different keys (e.g., 'root', 'card'),
  // this interface should be defined manually for full accuracy.
  interface ComponentNameToClassKey extends Record<
    keyof RazethComponentsPropsList,
    ClassKey
  > {
    RazethDataTable: DataTableSlotKey;
  }

  // ComponentsPropsList directly extends our map.
  interface ComponentsPropsList extends RazethComponentsPropsList {
    RazethDataTable: DataTableThemeProps;
  }

  interface Components extends CustomComponents {
    /** Shared structural slots and resource-independent presentation defaults. */
    RazethDataTable?: {
      defaultProps?: Partial<DataTableThemeProps>;
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethDataTable"];
    };
    // Your custom components are now automatically included
    // You can still add standard MUI component overrides here if needed
  }
}

export type GradientRow = {
  y: number; // the row baseline
  dotY: number; // the dot’s y position
};

export type GradientPoint = {
  x: number;
  y: number;
  small?: boolean; // true = small dot, false = long streak
};

export type GradientOptions = {
  dotSize?: number; // default 1.5
  streakWidth?: number; // default 4
  streakHeight?: number; // default 100
  color?: string; // default "var(--c)"
};

export type IconSize = "small" | "medium" | "large" | number | string;

```

### src/components/DataTable/mui/theme/themeDefaults.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTable, type DataTableProps } from "../components/DataTable";
import { DataTableDensityProvider, useDataTableDensity } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import type { DataTableThemeProps } from "./types";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ name: "Alpha" }];
function Fixture(props: Omit<DataTableProps<{ name: string }>, "table">) {
  const table = useMuiDataTable({ columns, data });
  return <DataTable table={table} pagination={false} {...props} />;
}
function theme(defaultProps: DataTableThemeProps) {
  return createTheme({ components: { RazethDataTable: { defaultProps } } });
}
it("uses theme toolbar visibility while explicit true, object, and false win", () => {
  const hidden = theme({ enableToolbar: false });
  const view = render(
    <ThemeProvider theme={hidden}>
      <Fixture />
    </ThemeProvider>,
  );
  expect(
    view.container.querySelector(`.${dataTableClasses.toolbar}`),
  ).toBeNull();
  for (const toolbar of [true, {}]) {
    view.rerender(
      <ThemeProvider theme={hidden}>
        <Fixture toolbar={toolbar} />
      </ThemeProvider>,
    );
    expect(
      view.container.querySelector(`.${dataTableClasses.toolbar}`),
    ).not.toBeNull();
  }
  view.rerender(
    <ThemeProvider theme={theme({ enableToolbar: true })}>
      <Fixture toolbar={false} />
    </ThemeProvider>,
  );
  expect(
    view.container.querySelector(`.${dataTableClasses.toolbar}`),
  ).toBeNull();
});
it("uses action and search defaults with explicit toolbar overrides", () => {
  const configured = theme({
    enableGlobalSearch: false,
    enableColumnManager: false,
    enableDensityToggle: false,
    enableFullscreen: false,
  });
  const view = render(
    <ThemeProvider theme={configured}>
      <Fixture />
    </ThemeProvider>,
  );
  expect(screen.queryByRole("search")).toBeNull();
  for (const slot of [
    "columnManagerButton",
    "densityButton",
    "fullscreenButton",
  ] as const)
    expect(
      view.container.querySelector(`.${dataTableClasses[slot]}`),
    ).toBeNull();
  view.rerender(
    <ThemeProvider theme={configured}>
      <Fixture
        toolbar={{
          search: true,
          enableColumnManager: true,
          enableDensity: true,
          enableFullscreen: true,
        }}
      />
    </ThemeProvider>,
  );
  expect(screen.getByRole("search")).toBeVisible();
  for (const slot of [
    "columnManagerButton",
    "densityButton",
    "fullscreenButton",
  ] as const)
    expect(
      view.container.querySelector(`.${dataTableClasses[slot]}`),
    ).not.toBeNull();
});
it("applies themed search mode and placement and allows explicit overrides", () => {
  const configured = theme({
    searchMode: "collapsible",
    searchPosition: "start",
  });
  const view = render(
    <ThemeProvider theme={configured}>
      <Fixture />
    </ThemeProvider>,
  );
  expect(screen.queryByRole("search")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show global search" }));
  expect(
    view.container.querySelector(`.${dataTableClasses.toolbarStart}`),
  ).toContainElement(screen.getByRole("search"));
  view.rerender(
    <ThemeProvider theme={configured}>
      <Fixture toolbar={{ searchMode: "always", searchPosition: "end" }} />
    </ThemeProvider>,
  );
  expect(
    view.container.querySelector(`.${dataTableClasses.toolbarEnd}`),
  ).toContainElement(screen.getByRole("search"));
  expect(
    screen.queryByRole("button", { name: "Hide global search" }),
  ).toBeNull();
});
function DensityProbe() {
  const { density, setDensity } = useDataTableDensity();
  return <button onClick={() => setDensity("spacious")}>{density}</button>;
}
it("initializes theme density without controlling it or resetting mounted state", () => {
  const view = render(
    <ThemeProvider theme={theme({ density: "compact" })}>
      <DataTableDensityProvider>
        <DensityProbe />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "compact" }));
  expect(screen.getByRole("button", { name: "spacious" })).toBeVisible();
  view.rerender(
    <ThemeProvider theme={theme({ density: "comfortable" })}>
      <DataTableDensityProvider>
        <DensityProbe />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
  expect(screen.getByRole("button", { name: "spacious" })).toBeVisible();
});
it("prioritizes explicit initial density and preserves controlled callback semantics", () => {
  const onChange = jest.fn();
  const view = render(
    <ThemeProvider theme={theme({ density: "compact" })}>
      <DataTableDensityProvider
        defaultDensity="comfortable"
        onDensityChange={onChange}
      >
        <DensityProbe />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
  expect(screen.getByRole("button", { name: "comfortable" })).toBeVisible();
  view.rerender(
    <ThemeProvider theme={theme({ density: "compact" })}>
      <DataTableDensityProvider
        density="comfortable"
        onDensityChange={onChange}
      >
        <DensityProbe />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "comfortable" }));
  expect(onChange).toHaveBeenCalledWith("spacious");
  expect(screen.getByRole("button", { name: "comfortable" })).toBeVisible();
});

```


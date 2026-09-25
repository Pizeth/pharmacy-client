"use client";

import { Box, Table, TableContainer, styled } from "@mui/material";
import type { TableContainerProps, TableProps } from "@mui/material";
import type { CSSProperties } from "react";
import type { RowData } from "@tanstack/table-core";
import { DataTableAccessibilityProvider } from "../accessibility";
import { DataTableDensityProvider } from "../density";
import type { DataTableDensityConfig } from "../density";
import { DataTableFilterDisplayProvider } from "../filter-display";
import type { DataTableFilterDisplayConfig } from "../filter-display";
import { DataTableFullscreenProvider } from "../fullscreen";
import type { DataTableFullscreenConfig } from "../fullscreen";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { MuiDataTableInstance } from "../table";
import {
  DATA_TABLE_DEFAULT_ROW_PINNING_DISPLAY_MODE,
  DataTableRowPinningProvider,
  type DataTableRowPinningConfig,
} from "../row-pinning";
import { DATA_TABLE_DEFAULT_VARIANT } from "../theme";
import type { DataTableOwnerState, DataTableVariantProps } from "../theme";
import { useDataTableThemeDefaults } from "../theme/useDataTableThemeDefaults";
import { DataTableBody } from "./DataTableBody";
import { DataTableColumnGroup } from "./DataTableColumnGroup";
import { DataTableHead } from "./DataTableHead";
import type { DataTableDetailPanelRenderer } from "./detail-panel";
import { DataTablePagination } from "./pagination";
import type { DataTablePaginationConfig } from "./pagination";
import { DataTableSelectionBar } from "./selection";
import type { DataTableSelectionBarConfig } from "./selection";
import { DataTableShell } from "./DataTableShell";
import { DataTableRefreshingIndicator } from "./states";
import { DataTableToolbar } from "./toolbar";
import type { DataTableToolbarConfig } from "./toolbar";

/**
 * ------------------------------------------------------------------
 * Content
 * ------------------------------------------------------------------
 *
 * Shared structural ownerState is passed even though the base style
 * currently does not branch on variant.
 *
 * That makes:
 *
 *   styleOverrides.content
 *
 * callbacks variant-aware without passing resource objects.
 */
const ContentRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})({ display: "flex", flexDirection: "column", minWidth: 0 });

/**
 * ------------------------------------------------------------------
 * Container
 * ------------------------------------------------------------------
 */
const ContainerRoot = styled(TableContainer, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Container",
  overridesResolver: (_props, styles) => styles.container,
})({ overflowX: "auto", position: "relative", flex: 1, minHeight: 0 });

/**
 * ------------------------------------------------------------------
 * Native Table
 * ------------------------------------------------------------------
 */
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

/**
 * Runtime width supplied by TanStack.
 */
export interface DataTableTableStyle extends CSSProperties {
  "--DataTable-table-size": string;
}

export interface DataTableProps<TData extends RowData>
  extends
    DataTableVariantProps,
    DataTableDensityConfig,
    DataTableFullscreenConfig,
    DataTableFilterDisplayConfig {
  /**
   * Table instance created by useMuiDataTable().
   *
   * Table creation and MUI rendering remain separate concerns.
   */
  readonly table: MuiDataTableInstance<TData>;

  /**
   * Props forwarded to MUI's native <Table>.
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
   * Row-pinning presentation policy.
   *
   * TanStack owns rowPinning state and row APIs. This renderer config controls
   * only how already-pinned rows are physically presented.
   */
  readonly rowPinning?: DataTableRowPinningConfig;

  /**
   * false:
   *   disable selection status/bulk-action bar.
   *
   * undefined:
   *   no selection bar by default.
   *
   * object:
   *   configured selection bar when rows are selected.
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
 * DataTable owns the high-level MUI rendering composition.
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
 * - column sizing
 * - sorting
 * - filtering
 * - pagination state
 * - expansion
 * - selection
 *
 * This component owns only the native/MUI rendering shell.
 */
export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const themeDefaults = useDataTableThemeDefaults();
  const {
    table,
    tableProps,
    containerProps,

    /**
     * Do not use theme defaultProps to merge the completed table
     * instance or resource renderer props.
     *
     * 6F.2 intentionally keeps that boundary explicit.
     */
    toolbar = themeDefaults.enableToolbar ?? true,

    renderDetailPanel,
    rowPinning,
    refreshing = false,
    refreshProgress,
    selectionBar = false,
    pagination = {},

    /**
     * Visual variant is presentation-only.
     *
     * Explicit prop wins.
     *
     * Theme default wins next.
     *
     * Built-in outlined fallback preserves existing appearance.
     */
    variant: variantProp,

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

  const variant =
    variantProp ?? themeDefaults.variant ?? DATA_TABLE_DEFAULT_VARIANT;

  /**
   * ----------------------------------------------------------------
   * Shared structural ownerState
   * ----------------------------------------------------------------
   *
   * Keep this object intentionally small.
   *
   * Do NOT spread:
   *
   *   props
   *
   * into ownerState.
   *
   * Doing so would leak:
   *
   * - table instance
   * - render functions
   * - resource-specific configuration
   * - controlled state callbacks
   *
   * into MUI styling machinery.
   */
  const ownerState: DataTableOwnerState = {
    variant,
  };

  const toolbarConfig = typeof toolbar === "object" ? toolbar : {};

  /**
   * Resolve row-pinning presentation exactly once.
   *
   * Descendant renderer controls use the same value through
   * DataTableRowPinningProvider, while DataTableBody receives the resolved
   * mode explicitly for physical row layout.
   */
  const rowPinningDisplayMode =
    rowPinning?.displayMode ?? DATA_TABLE_DEFAULT_ROW_PINNING_DISPLAY_MODE;

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
            <DataTableRowPinningProvider displayMode={rowPinningDisplayMode}>
              <DataTableFilterDisplayProvider
              columnFilterDisplayMode={columnFilterDisplayMode}
              defaultColumnFilterDisplayMode={defaultColumnFilterDisplayMode}
              onColumnFilterDisplayModeChange={onColumnFilterDisplayModeChange}
              showColumnFilters={showColumnFilters}
              defaultShowColumnFilters={defaultShowColumnFilters}
              onShowColumnFiltersChange={onShowColumnFiltersChange}
            >
              <DataTableShell ownerState={ownerState}>
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

                        /**
                         * Caller inline table styles deliberately come
                         * after the generated CSS variable, preserving
                         * the 6F.1 precedence contract.
                         */
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
                              rowPinningDisplayMode={rowPinningDisplayMode}
                              renderDetailPanel={renderDetailPanel}
                            />
                          </TableRoot>
                        );
                      }}
                    </table.Subscribe>
                  </ContainerRoot>
                  {pagination !== false ? (
                    <DataTablePagination
                      table={table}
                      {...pagination}
                      startContent={
                        selectionBar !== false ? (
                          <DataTableSelectionBar
                            table={table}
                            {...selectionBar}
                            embedded
                          />
                        ) : undefined
                      }
                    />
                  ) : (
                    selectionBar !== false && (
                      <DataTableSelectionBar table={table} {...selectionBar} />
                    )
                  )}
                </ContentRoot>
              </DataTableShell>
              </DataTableFilterDisplayProvider>
            </DataTableRowPinningProvider>
          </DataTableFullscreenProvider>
        </DataTableDensityProvider>
      </DataTableAccessibilityProvider>
    </table.AppTable>
  );
}

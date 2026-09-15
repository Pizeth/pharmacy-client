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

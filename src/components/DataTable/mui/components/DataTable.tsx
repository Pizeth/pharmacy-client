"use client";

import { Box, Table, TableContainer } from "@mui/material";
import type { TableContainerProps, TableProps } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import { DataTableDensityProvider } from "../density";
import type { DataTableDensityConfig } from "../density";
import { DataTableFullscreenProvider } from "../fullscreen";
import type { DataTableFullscreenConfig } from "../fullscreen";
import type { MuiDataTableInstance } from "../table";
import { DataTableBody } from "./DataTableBody";
import { DataTableColumnGroup } from "./DataTableColumnGroup";
import { DataTableHead } from "./DataTableHead";
import { DataTablePagination } from "./pagination";
import type { DataTablePaginationConfig } from "./pagination";
import { DataTableShell } from "./DataTableShell";
import { DataTableToolbar } from "./toolbar";
import type { DataTableToolbarConfig } from "./toolbar";
import { DataTableDetailPanelRenderer } from "./detail-panel";

export interface DataTableProps<TData extends RowData>
  extends DataTableDensityConfig, DataTableFullscreenConfig {
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
   * false disables pagination UI.
   *
   * An object customizes the pagination renderer.
   */
  readonly pagination?: false | DataTablePaginationConfig;
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
  const {
    table,
    tableProps,
    containerProps,
    toolbar = true,
    renderDetailPanel,
    pagination = {},
    density,
    defaultDensity,
    onDensityChange,
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
          <DataTableShell>
            {toolbar !== false && (
              <DataTableToolbar table={table} {...toolbarConfig} />
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
              }}
            >
              <TableContainer
                {...containerProps}
                // sx={[
                //   {
                //     overflowX: "auto",
                //   },

                //   ...(Array.isArray(containerProps?.sx)
                //     ? containerProps.sx
                //     : containerProps?.sx
                //       ? [containerProps.sx]
                //       : []),
                // ]}
                sx={[
                  {
                    /**
                     * This element is the horizontal scrolling viewport against
                     * which sticky inline positioning operates.
                     */
                    overflowX: "auto",

                    /**
                     * Prevent outer content from leaking through sticky cells
                     * around rounded/contained table layouts.
                     */
                    position: "relative",

                    /**
                     * Critical for fullscreen:
                     *
                     * table area consumes remaining height between toolbar
                     * and pagination.
                     */
                    flex: 1,

                    minHeight: 0,
                  },

                  ...(Array.isArray(containerProps?.sx)
                    ? containerProps.sx
                    : containerProps?.sx
                      ? [containerProps.sx]
                      : []),
                ]}
              >
                <table.Subscribe
                  selector={(state) => ({
                    columnSizing: state.columnSizing,
                    columnVisibility: state.columnVisibility,
                  })}
                >
                  {() => {
                    const totalSize = table.getTotalSize();

                    return (
                      <Table
                        // stickyHeader
                        // size="small"
                        {...tableProps}
                        // data-direction={direction}
                        sx={[
                          {
                            /**
                             * Required for predictable TanStack-controlled widths.
                             */
                            tableLayout: "fixed",

                            /**
                             * Separate borders behave much more predictably with
                             * sticky native table cells than collapsed borders.
                             */
                            borderCollapse: "separate",

                            borderSpacing: 0,

                            /**
                             * Exact sum of visible leaf column sizes.
                             */
                            width: `${totalSize}px`,

                            minWidth: `${totalSize}px`,
                          },
                          ...(Array.isArray(tableProps?.sx)
                            ? tableProps.sx
                            : tableProps?.sx
                              ? [tableProps.sx]
                              : []),
                        ]}
                      >
                        <DataTableColumnGroup table={table} />
                        <DataTableHead table={table} />
                        <DataTableBody
                          table={table}
                          renderDetailPanel={renderDetailPanel}
                        />
                      </Table>
                    );
                  }}
                </table.Subscribe>
              </TableContainer>
              {pagination !== false && (
                <DataTablePagination table={table} {...pagination} />
              )}
            </Box>
          </DataTableShell>
        </DataTableFullscreenProvider>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}

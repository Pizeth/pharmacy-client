"use client";

// src/components/DataTable/mui/components/DataTableHeaderCell.tsx

import { Box, TableCell } from "@mui/material";
import type { CellData, Header, RowData } from "@tanstack/table-core";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { resolveTableCellAlignment } from "./alignment";
import { getDataTablePinnedLayout, getDataTablePinnedSx } from "./pinning";
import { DataTableHeaderContent } from "./DataTableHeaderContent";

export interface DataTableHeaderCellProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly header: Header<MuiDataTableFeatures, TData, TValue>;

  /**
   * Zero-based visual header row position.
   *
   * Used to calculate vertical sticky offsets.
   */
  readonly headerRowIndex: number;
}

/**
 * Render one physical MUI table-header cell.
 *
 * Responsibilities:
 *
 * - physical cell sizing
 * - sticky positioning
 * - pinned positioning
 * - density
 * - alignment
 * - AppHeader context
 * - resize handle
 *
 * Semantic/interactable header content remains delegated to:
 *
 *   DataTableHeaderContent
 */
export function DataTableHeaderCell<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableHeaderCellProps<TData, TValue>) {
  const { table, header, headerRowIndex } = props;

  const { density } = useDataTableDensity();

  const densityMetrics = getDataTableDensityMetrics(density);

  const stickyTop = headerRowIndex * densityMetrics.headerHeight;

  const meta = header.column.columnDef.meta;

  // const align = resolveTableCellAlignment(meta?.headerAlign ?? meta?.align);

  /**
   * Header alignment policy.
   *
   * Resource/column metadata may still explicitly override alignment:
   *
   *   headerAlign
   *       ↓
   *   align
   *       ↓
   *   default center
   *
   * Body-cell alignment remains independent and may continue using the
   * column's ordinary `align` metadata.
   */
  const configuredHeaderAlign = meta?.headerAlign ?? meta?.align;

  const align =
    configuredHeaderAlign === undefined
      ? "center"
      : (resolveTableCellAlignment(configuredHeaderAlign) ?? "center");

  const isLeafHeader = header.subHeaders.length === 0;

  /**
   * ================================================================
   * Placeholder header
   * ================================================================
   *
   * TanStack creates placeholder headers for grouped-column layout.
   *
   * They still require a physical TableCell so the grid remains
   * aligned, but intentionally contain no semantic header content.
   */
  if (header.isPlaceholder) {
    return (
      <table.Subscribe
        selector={(state) => ({
          columnSizing: state.columnSizing,
          columnVisibility: state.columnVisibility,
          columnPinning: state.columnPinning,
        })}
      >
        {() => {
          const size = header.getSize();

          const pinnedLayout = isLeafHeader
            ? getDataTablePinnedLayout(table, header.column)
            : undefined;

          const pinnedSx = getDataTablePinnedSx(pinnedLayout, "header");

          return (
            <TableCell
              align={align}
              colSpan={header.colSpan}
              data-column-id={header.column.id}
              data-pinned={pinnedLayout?.position}
              data-density={density}
              sx={{
                /**
                 * All header cells own vertical stickiness.
                 *
                 * Pinned leaf headers additionally receive logical
                 * inline positioning through pinnedSx.
                 */
                position: "sticky",
                top: `${stickyTop}px`,
                zIndex: 2,
                backgroundColor: "background.paper",
                boxSizing: "border-box",
                width: `${size}px`,
                minWidth: `${size}px`,
                maxWidth: `${size}px`,
                height: `${densityMetrics.headerHeight}px`,
                minHeight: `${densityMetrics.headerHeight}px`,
                px: densityMetrics.cellPaddingInline,
                py: densityMetrics.cellPaddingBlock,
                // whiteSpace: "nowrap",
                // overflow: "hidden",
                ...pinnedSx,
              }}
            />
          );
        }}
      </table.Subscribe>
    );
  }

  /**
   * ================================================================
   * Real header
   * ================================================================
   */
  return (
    <table.AppHeader
      header={header}
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnResizing: state.columnResizing,
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        sorting: state.sorting,
      })}
    >
      {(appHeader) => {
        /**
         * These values must be calculated inside the subscribed
         * AppHeader render because table state may update independently
         * of this outer React component.
         */
        const size = header.getSize();

        const pinnedLayout = isLeafHeader
          ? getDataTablePinnedLayout(table, header.column)
          : undefined;

        const pinnedSx = getDataTablePinnedSx(pinnedLayout, "header");

        const sortDirection = isLeafHeader
          ? header.column.getIsSorted()
          : false;

        return (
          <TableCell
            align={align}
            colSpan={header.colSpan}
            /**
             * Leaf headers represent columns.
             *
             * Group headers represent groups of columns.
             */
            scope={isLeafHeader ? "col" : "colgroup"}
            data-column-id={header.column.id}
            data-pinned={pinnedLayout?.position}
            data-density={density}
            sortDirection={sortDirection}
            sx={{
              /**
               * Vertically sticky for every header.
               *
               * Pinned leaf headers additionally receive logical
               * inline positioning through pinnedSx.
               */
              position: "sticky",
              top: `${stickyTop}px`,
              zIndex: 2,
              backgroundColor: "background.paper",

              /**
               * Give generic header content an explicit text color.
               *
               * Resource columns can still provide richer custom
               * header components later.
               */
              color: "text.primary",
              fontWeight: 600,

              /**
               * ----------------------------------------------------
               * TanStack committed width
               * ----------------------------------------------------
               */
              boxSizing: "border-box",
              width: `${size}px`,
              minWidth: `${size}px`,
              maxWidth: `${size}px`,
              height: `${densityMetrics.headerHeight}px`,
              minHeight: `${densityMetrics.headerHeight}px`,
              px: densityMetrics.cellPaddingInline,
              py: densityMetrics.cellPaddingBlock,
              whiteSpace: densityMetrics.nowrap ? "nowrap" : "normal",

              /**
               * IMPORTANT
               * ----------------------------------------------------
               *
               * Do NOT clip the complete physical cell.
               *
               * Header labels own their own text truncation.
               *
               * Leaving this visible also gives:
               *
               * - resize handles
               * - menus
               * - sort indicators
               *
               * enough room to render correctly.
               */
              overflow: "visible",

              /**
               * Pinned leaf headers override the inline sticky position and
               * z-index while preserving the top offset above.
               */
              ...pinnedSx,
            }}
          >
            {/**
             * ------------------------------------------------------
             * Content layout
             * ------------------------------------------------------
             *
             * IMPORTANT:
             *
             * There is deliberately:
             *
             *   NO width: "100%"
             *   NO height: "100%"
             *
             * here.
             *
             * A normal block-level flex container automatically
             * occupies the table-cell's available inline space.
             *
             * Percentage height through a table-cell is not a stable
             * layout contract.
             */}
            <Box
              className="DataTable-headerCellContent"
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                // justifyContent:
                //   align === "right"
                //     ? "flex-end"
                //     : align === "center"
                //       ? "center"
                //       : "flex-start",
                minWidth: 0,

                /**
                 * Let content establish natural header height.
                 */
                lineHeight: 1.25,
              }}
            >
              {/* <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <appHeader.FlexRender />
              </Box> */}
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    align === "right"
                      ? "flex-end"
                      : align === "center"
                        ? "center"
                        : "flex-start",
                  minWidth: 0,
                  height: "100%",
                  overflow: "hidden",
                }}
              > */}
              <DataTableHeaderContent
                table={table}
                header={header}
                align={align}
              />
              {/* </Box> */}
            </Box>
            {/**
             * Only leaf headers should expose a resize handle.
             *
             * A group header's getSize() is derived from its descendants,
             * so resizing the group itself would be ambiguous.
             */}
            {/* {header.subHeaders.length === 0 && <appHeader.ResizeHandle />} */}
            {isLeafHeader && <appHeader.ResizeHandle />}
          </TableCell>
        );
      }}
    </table.AppHeader>
  );
}

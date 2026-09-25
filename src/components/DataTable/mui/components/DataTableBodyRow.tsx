"use client";

import { styled, TableRow } from "@mui/material";
import type { CSSProperties } from "react";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyCell } from "./DataTableBodyCell";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";

export interface DataTableBodyRowStyle extends CSSProperties {
  readonly "--DataTable-row-pinned-offset"?: string;
}

const BodyRowRoot = styled(TableRow, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BodyRow",
  overridesResolver: (_props, styles) => styles.bodyRow,
})(({ theme }) => {
  const palette = (theme.vars ?? theme).palette;

  const selectedBackground = theme.alpha(
    palette.primary.main,
    theme.palette.action.selectedOpacity,
  );

  const selectedHoverBackground = theme.alpha(
    palette.primary.main,
    Math.min(
      1,
      theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
    ),
  );
  return {
    /**
     * Row-state paint is expressed through overridable CSS variables.
     *
     * Every body cell consumes --DataTable-row-background, so pinned
     * utility columns and scrolling data columns always share one
     * visual row state.
     *
     * Applications can tune the three state colors through the
     * BodyRow theme slot without modifying renderer code.
     */
    "--DataTable-row-background": palette.background.paper,
    "--DataTable-row-hover-background": palette.action.hover,
    "--DataTable-row-selected-background": selectedBackground,
    "--DataTable-row-selected-hover-background": selectedHoverBackground,

    "&:hover": {
      "--DataTable-row-background":
        "var(--DataTable-row-hover-background)",
    },

    '&[data-selected="true"]': {
      "--DataTable-row-background":
        "var(--DataTable-row-selected-background)",

      "&:hover": {
        "--DataTable-row-background":
          "var(--DataTable-row-selected-hover-background)",
      },
    },
    ...Object.fromEntries(
      (["compact", "comfortable", "spacious"] as const).map((density) => [
        `&[data-density="${density}"]`,
        { minHeight: `${getDataTableDensityMetrics(density).bodyRowHeight}px` },
      ]),
    ),

    /**
     * TanStack owns which rows are pinned and in which region.
     *
     * The MUI renderer owns only the sticky presentation. Logical row
     * identity and pinning state never get duplicated into component state.
     */
    '&[data-row-pinning-sticky="true"][data-row-pinned="top"]': {
      position: "sticky",
      top: "var(--DataTable-row-pinned-offset)",
      zIndex: 2,
    },

    '&[data-row-pinning-sticky="true"][data-row-pinned="bottom"]': {
      position: "sticky",
      bottom: "var(--DataTable-row-pinned-offset)",
      zIndex: 2,
    },
  };
});

export interface DataTableBodyRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;

  /**
   * Sticky origin below renderer-owned header/filter rows.
   */
  readonly pinnedRowStickyTop: number;

  /**
   * Sticky modes keep the row in normal body order and apply sticky CSS.
   * Static modes physically regroup rows and leave normal table positioning.
   */
  readonly stickyRowPinning: boolean;
}

/**
 * Render a single TanStack row.
 *
 * We intentionally use row.getVisibleCells().
 *
 * The column-visibility feature therefore remains the authority over
 * which cells appear in the rendered row.
 *
 * The row background is communicated through a CSS variable.
 *
 * Pinned cells need a solid background so horizontally scrolling
 * cells cannot show through underneath them. Using a row-level CSS
 * variable lets pinned cells still participate in row hover behavior.
 */
export function DataTableBodyRow<TData extends RowData>(
  props: DataTableBodyRowProps<TData>,
) {
  const { table, row, pinnedRowStickyTop, stickyRowPinning } = props;

  const { density } = useDataTableDensity();

  const rowHeight = getDataTableDensityMetrics(density).bodyRowHeight;

  return (
    <table.Subscribe
      selector={(state) => ({
        rowSelection: state.rowSelection,
        rowPinning: state.rowPinning,
      })}
    >
      {(state) => {
        const selected = Boolean(state.rowSelection?.[row.id]);

        const pinnedPosition = row.getIsPinned();

        const pinnedIndex = pinnedPosition ? row.getPinnedIndex() : -1;

        const bottomRows =
          pinnedPosition === "bottom" ? table.getBottomRows() : [];

        /**
         * Top rows stack downward beneath sticky headers.
         *
         * Bottom rows stack upward from the bottom edge. TanStack's pinned
         * index is array order, so bottom rows need their edge index reversed.
         */
        const edgeIndex =
          pinnedPosition === "bottom"
            ? Math.max(0, bottomRows.length - 1 - pinnedIndex)
            : Math.max(0, pinnedIndex);

        const pinnedOffset =
          pinnedPosition === "top"
            ? pinnedRowStickyTop + edgeIndex * rowHeight
            : pinnedPosition === "bottom"
              ? edgeIndex * rowHeight
              : undefined;

        const style: DataTableBodyRowStyle = {
          "--DataTable-row-pinned-offset":
            pinnedOffset === undefined ? undefined : `${pinnedOffset}px`,
        };

        return (
        <BodyRowRoot
          className={dataTableClasses.bodyRow}
          hover
          selected={selected}
          data-row-id={row.id}
          data-selected={selected ? "true" : undefined}
          data-density={density}
          data-row-pinned={pinnedPosition || undefined}
          data-row-pinning-sticky={
            stickyRowPinning && pinnedPosition ? "true" : undefined
          }
          style={style}
        >
          <table.Subscribe
            selector={(state) => ({
              columnVisibility: state.columnVisibility,
              columnOrder: state.columnOrder,
              columnPinning: state.columnPinning,
            })}
          >
            {() =>
              row
                .getVisibleCells()
                .map((cell) => (
                  <DataTableBodyCell key={cell.id} table={table} cell={cell} />
                ))
            }
          </table.Subscribe>
        </BodyRowRoot>
        );
      }}
    </table.Subscribe>
  );
}

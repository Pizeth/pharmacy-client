"use client";

import { styled, TableRow } from "@mui/material";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyCell } from "./DataTableBodyCell";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";

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
  };
});

export interface DataTableBodyRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
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
  const { table, row } = props;

  const { density } = useDataTableDensity();

  return (
    <table.Subscribe
      source={table.atoms.rowSelection}
      selector={(rowSelection) => Boolean(rowSelection?.[row.id])}
    >
      {(selected) => (
        <BodyRowRoot
          className={dataTableClasses.bodyRow}
          hover
          selected={selected}
          data-row-id={row.id}
          data-selected={selected ? "true" : undefined}
          data-density={density}
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
      )}
    </table.Subscribe>
  );
}

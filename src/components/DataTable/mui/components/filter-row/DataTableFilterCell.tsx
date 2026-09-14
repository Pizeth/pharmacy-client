// src/components/DataTable/mui/components/filter-row/DataTableFilterCell.tsx

"use client";

import { styled, TableCell } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";
import type { MuiDataTableInstance } from "../../table";
import { getDataTablePinnedLayout } from "../pinning";
import { DataTableColumnFilter } from "../filtering";
import type { DataTableFilterCellStyle } from "./types";

export interface DataTableFilterCellProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;

  /**
   * Vertical sticky offset of the filter row.
   *
   * The filter row sits immediately below all normal header rows.
   */
  readonly stickyTop: number;
}

const FilterCellRoot = styled(TableCell, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterCell",
  overridesResolver: (_props, styles) => styles.filterCell,
})(({ theme }) => ({
  position: "sticky",
  top: "var(--DataTable-filter-sticky-top)",
  zIndex: 3,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  boxSizing: "border-box",
  width: "var(--DataTable-column-size)",
  minWidth: "var(--DataTable-column-size)",
  maxWidth: "var(--DataTable-column-size)",
  height: "var(--DataTable-filter-cell-height)",
  paddingInline: theme.spacing(0.75),
  paddingBlock: theme.spacing(0.5),
  verticalAlign: "middle",
  overflow: "visible",
  "& .MuiFormControl-root, & .MuiInputBase-root": { minWidth: 0 },

  // Pinning remains logical, so these rules work in both LTR and RTL.
  '&[data-pinned="start"], &[data-pinned="end"]': {
    zIndex: 4,
    backgroundClip: "padding-box",
  },
  '&[data-pinned="start"]': {
    insetInlineStart: "var(--DataTable-column-pinned-offset)",
  },
  '&[data-pinned="end"]': {
    insetInlineEnd: "var(--DataTable-column-pinned-offset)",
  },
  '&[data-pinned="start"][data-pinned-boundary="true"]': {
    borderInlineEnd: "1px solid",
    borderInlineEndColor: (theme.vars ?? theme).palette.divider,
  },
  '&[data-pinned="end"][data-pinned-boundary="true"]': {
    borderInlineStart: "1px solid",
    borderInlineStartColor: (theme.vars ?? theme).palette.divider,
  },
}));

// Structural blank content keeps non-filterable columns in the table grid.
const FilterCellPlaceholder = styled("span")({
  display: "block",
  width: "100%",
  minHeight: 32,
});

/**
 * Renders one leaf-column cell in the optional filter subheader row.
 *
 * Responsibilities of this component:
 *
 * - preserve column sizing
 * - preserve sticky header positioning
 * - preserve logical start/end pinning
 * - render a structural blank cell for non-filterable columns
 * - mount the existing DataTableColumnFilter renderer
 *
 * It deliberately does NOT know anything about filter-value shapes.
 *
 * Text, number, range, boolean, select, date, etc. belong to
 * DataTableColumnFilter and its specialized editors.
 */
export function DataTableFilterCell<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableFilterCellProps<TData, TValue>) {
  const { table, column, stickyTop } = props;

  const { density } = useDataTableDensity();

  const densityMetrics = getDataTableDensityMetrics(density);

  return (
    <table.Subscribe
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnPinning: state.columnPinning,
        columnFilters: state.columnFilters,
      })}
    >
      {() => {
        const size = column.getSize();

        const pinnedLayout = getDataTablePinnedLayout(table, column);
        const canFilter = column.getCanFilter();

        const style: DataTableFilterCellStyle = {
          "--DataTable-column-size": `${size}px`,
          "--DataTable-filter-sticky-top": `${stickyTop}px`,
          "--DataTable-filter-cell-height": `${Math.max(40, densityMetrics.headerHeight - 4)}px`,
          "--DataTable-column-pinned-offset": pinnedLayout
            ? `${pinnedLayout.offset}px`
            : undefined,
        };

        return (
          <FilterCellRoot
            className={dataTableClasses.filterCell}
            data-filter-column-id={column.id}
            data-pinned={pinnedLayout?.position}
            data-density={density}
            data-pinned-boundary={pinnedLayout?.isCenterBoundary || undefined}
            style={style}
          >
            {canFilter ? (
              <DataTableColumnFilter column={column} />
            ) : (
              /**
               * Never remove an unfilterable column's structural
               * cell.
               *
               * Expansion, selection, actions, and any ordinary
               * column with enableColumnFilter=false must still
               * occupy their normal table-grid position.
               */
              <FilterCellPlaceholder aria-hidden="true" />
            )}
          </FilterCellRoot>
        );
      }}
    </table.Subscribe>
  );
}

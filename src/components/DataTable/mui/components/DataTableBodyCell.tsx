"use client";

import { styled, TableCell, useTheme } from "@mui/material";
import type { CSSProperties } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { Cell, CellData, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { resolveTableCellAlignment } from "./alignment";
import { getDataTablePinnedLayout } from "./pinning";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";

export interface DataTableBodyCellStyle extends CSSProperties {
  readonly "--DataTable-column-size": string;
  readonly "--DataTable-column-pinned-offset"?: string;
}

const BodyCellRoot = styled(TableCell, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BodyCell",
  overridesResolver: (_props, styles) => styles.bodyCell,
})(({ theme }) => ({
  boxSizing: "border-box",
  width: "var(--DataTable-column-size)",
  minWidth: "var(--DataTable-column-size)",
  maxWidth: "var(--DataTable-column-size)",
  overflow: "hidden",
  ...Object.fromEntries(
    (["compact", "comfortable", "spacious"] as const).map((density) => {
      const metrics = getDataTableDensityMetrics(density);
      return [
        `&[data-density="${density}"]`,
        {
          height: metrics.nowrap ? `${metrics.bodyRowHeight}px` : undefined,
          minHeight: `${metrics.bodyRowHeight}px`,
          paddingInline: theme.spacing(metrics.cellPaddingInline),
          paddingBlock: theme.spacing(metrics.cellPaddingBlock),
          whiteSpace: metrics.nowrap ? "nowrap" : "normal",
          textOverflow: metrics.nowrap ? "ellipsis" : undefined,
        },
      ];
    }),
  ),
  '&[data-pinned="start"], &[data-pinned="end"]': {
    position: "sticky",
    zIndex: 1,
    // Paint the state tint over paper, never over scrolling cell content.
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
    backgroundImage:
      "linear-gradient(var(--DataTable-row-background), var(--DataTable-row-background))",
    backgroundClip: "padding-box",
  },
  '&[data-pinned="start"]': {
    insetInlineStart: "var(--DataTable-column-pinned-offset)",
  },
  '&[data-pinned="end"]': {
    insetInlineEnd: "var(--DataTable-column-pinned-offset)",
  },
  '&[data-pinned="start"][data-pinned-boundary="true"]': {
    borderInlineEnd: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  },
  '&[data-pinned="end"][data-pinned-boundary="true"]': {
    borderInlineStart: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  },
}));

export interface DataTableBodyCellProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly cell: Cell<MuiDataTableFeatures, TData, TValue>;
}

/**
 * Render one body cell.
 *
 * AppCell performs two important jobs:
 *
 * 1. provides TanStack's cell context
 * 2. exposes the context-bound FlexRender helper
 *
 * We deliberately do not directly call:
 *
 *   cell.getValue()
 *
 * because that would bypass custom columnDef.cell rendering.
 */
export function DataTableBodyCell<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableBodyCellProps<TData, TValue>) {
  const { table, cell } = props;

  const { density } = useDataTableDensity();
  const { direction } = useTheme();

  const meta = cell.column.columnDef.meta;

  const align = resolveTableCellAlignment(meta?.align, direction);

  return (
    <table.AppCell
      cell={cell}
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
      })}
    >
      {(appCell) => {
        /**
         * These reads belong inside the subscribed child render.
         */
        const size = cell.column.getSize();

        const pinnedLayout = getDataTablePinnedLayout(table, cell.column);

        const style: DataTableBodyCellStyle = {
          "--DataTable-column-size": `${size}px`,
          "--DataTable-column-pinned-offset": pinnedLayout
            ? `${pinnedLayout.offset}px`
            : undefined,
        };

        return (
          <BodyCellRoot
            className={dataTableClasses.bodyCell}
            align={align}
            data-column-id={cell.column.id}
            data-pinned={pinnedLayout?.position}
            data-pinned-boundary={pinnedLayout?.isCenterBoundary || undefined}
            data-density={density}
            style={style}
          >
            <appCell.FlexRender />
          </BodyCellRoot>
        );
      }}
    </table.AppCell>
  );
}

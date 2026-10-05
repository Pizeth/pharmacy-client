"use client";

import { styled, TableRow } from "@mui/material";
import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  TouchEvent,
} from "react";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyCell } from "./DataTableBodyCell";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";

/**
 * Optional row activation handler.
 *
 * Fired for a primary click on the row surface (or Enter/Space when the
 * row itself is focused). Clicks that originate from interactive
 * descendants (buttons, links, inputs, checkboxes, expand toggles) are
 * ignored so row actions keep working independently.
 */
export type DataTableRowClickHandler<TData extends RowData> = (
  row: Row<MuiDataTableFeatures, TData>,
  event:
    | MouseEvent<HTMLTableRowElement>
    | KeyboardEvent<HTMLTableRowElement>
    | TouchEvent<HTMLTableRowElement>,
) => void;

const INTERACTIVE_DESCENDANT_SELECTOR = [
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "label",
  '[role="button"]',
  '[role="checkbox"]',
  '[role="menuitem"]',
  '[role="switch"]',
  '[role="radio"]',
  '[role="textbox"]',
  '[role="combobox"]',
  '[role="slider"]',
  '[contenteditable]:not([contenteditable="false"])',
  "[data-row-click-ignore]",
].join(",");

function isFromInteractiveDescendant(
  event:
    | MouseEvent<HTMLElement>
    | KeyboardEvent<HTMLElement>
    | TouchEvent<HTMLElement>,
): boolean {
  const target = event.target;

  if (!(target instanceof Element)) {
    return false;
  }

  const interactive = target.closest(INTERACTIVE_DESCENDANT_SELECTOR);

  return interactive !== null && interactive !== event.currentTarget;
}

export interface DataTableBodyRowStyle extends CSSProperties {
  readonly "--DataTable-row-pinned-offset"?: string;
  readonly "--DataTable-row-pinned-bottom-offset"?: string;
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
      "--DataTable-row-background": "var(--DataTable-row-hover-background)",
    },

    '&[data-row-clickable="true"]': {
      cursor: "pointer",
    },

    '&[data-selected="true"]': {
      "--DataTable-row-background": "var(--DataTable-row-selected-background)",

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

    /**
     * MRT-style select-sticky rows use one TanStack top-pin identity but are
     * physically constrained by both scroll edges.
     *
     * Keeping this as presentation-only CSS means:
     *
     * - the row renders exactly once,
     * - TanStack rowPinning remains the only pin state,
     * - the browser chooses whether the natural row position hits the top or
     *   bottom sticky boundary first.
     */
    '&[data-row-pinning-sticky="true"][data-row-pinning-dual-edge="true"]': {
      position: "sticky",
      bottom: "var(--DataTable-row-pinned-bottom-offset)",
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

  /**
   * Optional row activation handler. See DataTableRowClickHandler.
   */
  readonly onRowClick?: DataTableRowClickHandler<TData>;

  /**
   * select-sticky presentation constrains the same top-pinned row against the
   * bottom scroll edge as well. No second TanStack pin is created.
   */
  readonly dualEdgeStickyRowPinning: boolean;

  /**
   * Sticky presentation order derived from the rendered/final row sequence,
   * not TanStack rowPinning insertion order.
   */
  readonly stickyPinnedRowIds: readonly string[];
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
  const {
    table,
    row,
    pinnedRowStickyTop,
    stickyRowPinning,
    dualEdgeStickyRowPinning,
    stickyPinnedRowIds,
    onRowClick,
  } = props;

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

        /**
         * TanStack's rowPinning arrays preserve pin/click insertion order.
         * MRT-style sticky presentation instead follows final row order.
         */
        const stickyIndex = pinnedPosition
          ? stickyPinnedRowIds.indexOf(row.id)
          : -1;

        const reverseStickyIndex =
          stickyIndex < 0 ? -1 : stickyPinnedRowIds.length - 1 - stickyIndex;

        /**
         * Top rows stack downward in row-model sequence.
         *
         * Bottom rows stack upward using the reverse row-model sequence.
         */
        const edgeIndex =
          pinnedPosition === "bottom"
            ? Math.max(0, reverseStickyIndex)
            : Math.max(0, stickyIndex);

        const pinnedOffset =
          pinnedPosition === "top"
            ? pinnedRowStickyTop + edgeIndex * rowHeight
            : pinnedPosition === "bottom"
              ? edgeIndex * rowHeight
              : undefined;

        /**
         * select-sticky keeps each selected row in one TanStack top-pin
         * identity, but constrains it against both viewport edges.
         *
         * Top and bottom offsets both follow the current row-model sequence,
         * matching MRT rather than FIFO selection order.
         */
        const dualEdgeBottomOffset =
          dualEdgeStickyRowPinning && pinnedPosition === "top"
            ? Math.max(0, reverseStickyIndex) * rowHeight
            : undefined;

        const style: DataTableBodyRowStyle = {
          "--DataTable-row-pinned-offset":
            pinnedOffset === undefined ? undefined : `${pinnedOffset}px`,
          "--DataTable-row-pinned-bottom-offset":
            dualEdgeBottomOffset === undefined
              ? undefined
              : `${dualEdgeBottomOffset}px`,
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
            data-row-clickable={onRowClick ? "true" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onClick={
              onRowClick
                ? (event) => {
                    if (
                      event.defaultPrevented ||
                      event.button !== 0 ||
                      isFromInteractiveDescendant(event)
                    ) {
                      return;
                    }

                    onRowClick(row, event);
                  }
                : undefined
            }
            onKeyDown={
              onRowClick
                ? (event) => {
                    if (
                      event.defaultPrevented ||
                      event.repeat ||
                      event.target !== event.currentTarget ||
                      (event.key !== "Enter" && event.key !== " ")
                    ) {
                      return;
                    }

                    event.preventDefault();
                    onRowClick(row, event);
                  }
                : undefined
            }
            data-row-pinning-dual-edge={
              stickyRowPinning &&
              dualEdgeStickyRowPinning &&
              pinnedPosition === "top"
                ? "true"
                : undefined
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
                    <DataTableBodyCell
                      key={cell.id}
                      table={table}
                      cell={cell}
                    />
                  ))
              }
            </table.Subscribe>
          </BodyRowRoot>
        );
      }}
    </table.Subscribe>
  );
}

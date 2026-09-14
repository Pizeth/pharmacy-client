"use client";

// src/components/DataTable/mui/components/DataTableResizeHandle.tsx

import { styled, useTheme } from "@mui/material";

import type { KeyboardEvent } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";

import { useMuiDataTableContext, useMuiDataTableHeaderContext } from "../table";

/** The hit target is structural; the thin rule remains its pseudo-element. */
const ResizeHandleRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ResizeHandle",
  overridesResolver: (_props, styles) => styles.resizeHandle,
})(({ theme }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  // Keep the complete hit target inside its cell so the next sticky cell cannot cover it.
  insetInlineEnd: 0,
  width: 8,
  zIndex: 5,
  cursor: "col-resize",
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  display: "block",
  "&::after": {
    content: '\"\"',
    position: "absolute",
    top: "20%",
    bottom: "20%",
    // Keep the rule at the column edge in both writing directions.
    insetInlineEnd: 0,
    width: 2,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (theme.vars ?? theme).palette.divider,
    opacity: 0.65,
    transition: theme.transitions.create(["background-color", "opacity"], {
      duration: theme.transitions.duration.shortest,
    }),
  },
  '&[data-resizing="true"]::after, &:hover::after, &:focus-visible::after': {
    backgroundColor: (theme.vars ?? theme).palette.primary.main,
    opacity: 1,
  },
  "&:focus-visible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 1,
    borderRadius:
      typeof theme.shape.borderRadius === "number"
        ? theme.shape.borderRadius * 0.5
        : `calc(${theme.shape.borderRadius} * 0.5)`,
  },
}));

/**
 * TanStack's stock default minimum column size.
 *
 * We duplicate the numeric fallback here only because columnDef.minSize
 * is optional in the public type.
 *
 * The actual committed size is still owned and constrained by TanStack.
 */
const DEFAULT_MIN_COLUMN_SIZE = 20;

/**
 * TanStack's stock default maximum column size.
 */
const DEFAULT_MAX_COLUMN_SIZE = Number.MAX_SAFE_INTEGER;

/**
 * Normal keyboard resize increment in pixels.
 *
 * Eight pixels aligns naturally with MUI's default spacing grid.
 */
const KEYBOARD_RESIZE_STEP = 8;

/**
 * Shift + Arrow uses a larger resize increment.
 */
const KEYBOARD_RESIZE_LARGE_STEP = 32;

/**
 * Clamp a requested width to the column's configured sizing range.
 */
function clampColumnSize(
  size: number,
  minSize: number,
  maxSize: number,
): number {
  return Math.min(maxSize, Math.max(minSize, size));
}

/**
 * Keep committed keyboard sizes at a maximum of two decimal places.
 *
 * Pointer resizing can produce fractional sizes, so we deliberately
 * avoid forcing all sizes to integers.
 */
function normalizeColumnSize(size: number): number {
  return Math.round(size * 100) / 100;
}

/**
 * Resolve a human-readable column label for accessibility.
 *
 * Priority:
 *
 * 1. MUI column meta.label
 * 2. string TanStack header
 * 3. stable column id
 *
 * This mirrors the policy used by the Column Manager without creating
 * a dependency from the low-level resize handle to that component.
 */
function getResizeColumnLabel(
  column: ReturnType<typeof useMuiDataTableHeaderContext>["column"],
): string {
  const meta = column.columnDef.meta;

  if (meta?.label) {
    return meta.label;
  }

  const header = column.columnDef.header;

  if (typeof header === "string") {
    return header;
  }

  return column.id;
}

/**
 * Interactive resize handle for one leaf header.
 *
 * Pointer/touch resizing:
 *
 *   delegated entirely to TanStack's
 *   header.getResizeHandler()
 *
 * Keyboard resizing:
 *
 *   commits directly through
 *   table.setColumnSizing()
 *
 * Keyboard controls:
 *
 *   ArrowLeft / ArrowRight
 *     Resize by 8px.
 *
 *   Shift + ArrowLeft / ArrowRight
 *     Resize by 32px.
 *
 * Direction semantics are physical:
 *
 *   LTR:
 *     ArrowRight -> wider
 *     ArrowLeft  -> narrower
 *
 *   RTL:
 *     ArrowLeft  -> wider
 *     ArrowRight -> narrower
 *
 * This matches the physical movement of the logical inline-end resize
 * handle in each writing direction.
 */
export function DataTableResizeHandle() {
  const table = useMuiDataTableContext();

  const header = useMuiDataTableHeaderContext();

  const theme = useTheme();

  const column = header.column;

  /**
   * Group headers must not own independent resize handles in renderer.
   *
   * Their width is derived from their leaf columns.
   */
  const leafHeader = header.subHeaders.length === 0;

  const canResize = leafHeader && column.getCanResize();

  if (!canResize) {
    return null;
  }

  const resizeHandler = header.getResizeHandler();

  const label = getResizeColumnLabel(column);

  return (
    <table.Subscribe
      selector={(state) => ({
        /**
         * Re-render when committed widths change.
         */
        columnSizing: state.columnSizing,

        /**
         * Re-render while pointer/touch resizing begins, moves,
         * and ends.
         */
        columnResizing: state.columnResizing,
      })}
    >
      {() => {
        const size = column.getSize();

        const isResizing = column.getIsResizing();

        const minSize = column.columnDef.minSize ?? DEFAULT_MIN_COLUMN_SIZE;

        const maxSize = column.columnDef.maxSize ?? DEFAULT_MAX_COLUMN_SIZE;

        /**
         * TanStack's columnResizeDirection is already synchronized
         * with our MUI theme direction by the table setup.
         *
         * Falling back to theme.direction keeps this component safe
         * even if a lower-level consumer omits that option.
         */
        const resizeDirection =
          table.options.columnResizeDirection ?? theme.direction;

        /**
         * Commit one keyboard size adjustment.
         *
         * We intentionally do NOT touch state.columnResizing here.
         *
         * That state represents an active drag gesture:
         *
         *   startOffset
         *   startSize
         *   deltaOffset
         *   deltaPercentage
         *   columnSizingStart
         *   isResizingColumn
         *
         * A keyboard press has no corresponding drag lifecycle.
         */
        const resizeBy = (delta: number): void => {
          const currentSize = column.getSize();

          const nextSize = normalizeColumnSize(
            clampColumnSize(currentSize + delta, minSize, maxSize),
          );

          if (nextSize === currentSize) {
            return;
          }

          table.setColumnSizing((previous) => ({
            ...previous,

            [column.id]: nextSize,
          }));
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>): void => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return;
          }

          event.preventDefault();

          event.stopPropagation();

          const step = event.shiftKey
            ? KEYBOARD_RESIZE_LARGE_STEP
            : KEYBOARD_RESIZE_STEP;

          /**
           * The handle lives on logical inline-end.
           *
           * LTR:
           *
           *     column |handle
           *
           * ArrowRight physically moves the handle outward and
           * therefore increases width.
           *
           * RTL:
           *
           *     handle| column
           *
           * ArrowLeft physically moves the handle outward and
           * therefore increases width.
           */
          const increasing =
            resizeDirection === "rtl"
              ? event.key === "ArrowLeft"
              : event.key === "ArrowRight";

          resizeBy(increasing ? step : -step);
        };

        return (
          <ResizeHandleRoot
            className={dataTableClasses.resizeHandle}
            role="separator"
            tabIndex={0}
            aria-label={`Resize ${label}`}
            aria-orientation="vertical"
            aria-valuemin={minSize}
            aria-valuemax={maxSize}
            aria-valuenow={Math.round(size)}
            aria-valuetext={`${Math.round(size)} pixels`}
            aria-keyshortcuts="ArrowLeft ArrowRight Shift+ArrowLeft Shift+ArrowRight"
            data-column-resize-handle={column.id}
            data-resizing={isResizing ? "true" : undefined}
            /**
             * TanStack owns pointer/touch resize lifecycle.
             */
            onMouseDown={resizeHandler}
            onTouchStart={resizeHandler}
            /**
             * Keyboard resizing commits directly into columnSizing.
             */
            onKeyDown={handleKeyDown}
            /**
             * Pointer users retain the familiar double-click reset.
             *
             * Keyboard users can reach the existing "Reset width"
             * action through the column menu.
             */
            onDoubleClick={(event) => {
              event.preventDefault();

              event.stopPropagation();

              column.resetSize();
            }}
          />
        );
      }}
    </table.Subscribe>
  );
}

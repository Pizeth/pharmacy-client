import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { SystemStyleObject } from "@mui/system";
import type { Theme } from "@mui/material/styles";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";

/**
 * Logical pinned region used by the MUI renderer.
 *
 * TanStack deliberately uses logical start/end instead of physical
 * left/right. We preserve that model all the way through the renderer.
 */
export type DataTablePinnedPosition = "start" | "end";

/**
 * Rendering layer determines z-index/background behavior.
 */
export type DataTablePinnedLayer = "header" | "body";

/**
 * Resolved sticky positioning information for one pinned leaf column.
 */
export interface DataTablePinnedLayout {
  /**
   * Logical pinned region.
   */
  readonly position: DataTablePinnedPosition;

  /**
   * Pixel offset from the corresponding logical container edge.
   *
   * start:
   *   column.getStart("start")
   *
   * end:
   *   column.getAfter("end")
   */
  readonly offset: number;

  /**
   * Whether this column is the pinned column directly adjacent
   * to the scrollable center region.
   *
   * True when this column is directly adjacent to the scrolling
   * center region.
   *
   * We use this to draw the visual boundary between the pinned
   * and center regions.
   */
  readonly isCenterBoundary: boolean;
}

/**
 * Resolve the sticky layout of a leaf column.
 *
 * No offset arithmetic is performed here.
 *
 * TanStack's columnSizingFeature already builds and memoizes
 * the offset maps that back:
 *
 *   column.getStart(...)
 *   column.getAfter(...)
 *
 * so these lookups are effectively O(1).
 *
 * TanStack remains responsible for all offset calculations.
 */
export function getDataTablePinnedLayout<
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  table: MuiDataTableInstance<TData>,

  column: Column<MuiDataTableFeatures, TData, TValue>,
): DataTablePinnedLayout | undefined {
  const position = column.getIsPinned();

  if (position !== "start" && position !== "end") {
    return undefined;
  }

  if (position === "start") {
    const columns = table.getStartVisibleLeafColumns();

    const boundaryColumn = columns[columns.length - 1];

    return {
      position,
      offset: column.getStart("start"),

      /**
       * Last start-pinned column sits directly beside the center
       * region.
       */
      isCenterBoundary: boundaryColumn?.id === column.id,
    };
  }

  const columns = table.getEndVisibleLeafColumns();

  const boundaryColumn = columns[0];

  return {
    position,
    offset: column.getAfter("end"),

    /**
     * First end-pinned column sits directly beside the center
     * region.
     */
    isCenterBoundary: boundaryColumn?.id === column.id,
  };
}

/**
 * Convert TanStack pinning layout information into a MUI system
 * style object.
 *
 * Returning `SystemStyleObject<Theme>` is intentional.
 *
 * This helper always returns a plain style object, never:
 *
 * - an sx callback
 * - an sx array
 * - false
 *
 * so `SystemStyleObject<Theme>` is more precise than `SxProps<Theme>`.
 */
export function getDataTablePinnedSx(
  layout: DataTablePinnedLayout | undefined,
  layer: DataTablePinnedLayer,
) {
  if (!layout) {
    return {};
  }

  const offset = `${layout.offset}px`;

  const base: SystemStyleObject<Theme> = {
    position: "sticky",

    zIndex: layer === "header" ? 4 : 1,

    /**
     * A sticky cell must be opaque, otherwise scrolling cells become
     * visible underneath it.
     */
    backgroundColor:
      layer === "header"
        ? "background.paper"
        : "var(--DataTable-row-background)",

    backgroundClip: "padding-box",
  };

  /**
   * Start-pinned column.
   */
  if (layout.position === "start") {
    return {
      ...base,

      /**
       * Logical CSS automatically maps:
       *
       * LTR -> left
       * RTL -> right
       */
      insetInlineStart: offset,

      ...(layout.isCenterBoundary
        ? {
            borderInlineEnd: "1px solid",
            borderInlineEndColor: "divider",
          }
        : {}),
    };
  }

  /**
   * End-pinned column.
   */
  return {
    ...base,

    /**
     * Logical CSS automatically maps:
     *
     * LTR -> right
     * RTL -> left
     */
    insetInlineEnd: offset,

    ...(layout.isCenterBoundary
      ? {
          borderInlineStart: "1px solid",
          borderInlineStartColor: "divider",
        }
      : {}),
  };

  //   const isStart = layout.position === "start";

  //   return {
  //     position: "sticky" as const,

  //     /**
  //      * Logical positioning means:
  //      *
  //      * LTR:
  //      *   start -> left
  //      *   end   -> right
  //      *
  //      * RTL:
  //      *   start -> right
  //      *   end   -> left
  //      */
  //     insetInlineStart: isStart ? offset : undefined,

  //     insetInlineEnd: isStart ? undefined : offset,

  //     /**
  //      * Pinned body cells must sit above scrolling body cells.
  //      *
  //      * Pinned header cells must sit above:
  //      *
  //      * - scrolling body cells
  //      * - pinned body cells
  //      * - normal sticky header cells
  //      */
  //     zIndex: layer === "header" ? 4 : 1,

  //     /**
  //      * Sticky elements cannot remain transparent because scrolling
  //      * cells would become visible underneath them.
  //      *
  //      * Body rows provide this CSS variable so hover/selection colors
  //      * can later propagate into pinned cells.
  //      */
  //     backgroundColor:
  //       layer === "header"
  //         ? "background.paper"
  //         : "var(--DataTable-row-background)",

  //     backgroundClip: "padding-box",

  //     /**
  //      * Draw a logical separator only at the edge touching the center
  //      * scrolling region.
  //      *
  //      * Using logical borders automatically gives the correct physical
  //      * side in both LTR and RTL.
  //      */
  //     borderInlineEndWidth: layout.isCenterBoundary && isStart ? 1 : undefined,

  //     borderInlineEndStyle:
  //       layout.isCenterBoundary && isStart ? "solid" : undefined,

  //     borderInlineEndColor:
  //       layout.isCenterBoundary && isStart ? "divider" : undefined,

  //     borderInlineStartWidth: layout.isCenterBoundary && !isStart ? 1 : undefined,

  //     borderInlineStartStyle:
  //       layout.isCenterBoundary && !isStart ? "solid" : undefined,

  //     borderInlineStartColor:
  //       layout.isCenterBoundary && !isStart ? "divider" : undefined,
  //   };
}

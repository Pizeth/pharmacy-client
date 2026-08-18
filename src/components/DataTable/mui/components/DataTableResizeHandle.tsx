"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { MouseEvent } from "react";
import {
  useMuiDataTableScopedHeaderContext,
  //   useMuiDataTableScopedTableContext,
} from "../table/muiDataTableContexts";

/**
 * Header-level column resize control.
 *
 * This component is registered through createTableHook() as a
 * `headerComponent`, therefore column definitions/header renderers can access
 * it as:
 *
 *   <header.ResizeHandle />
 *
 * Interactive resize handle for one leaf header.
 *
 * All resize calculations and event lifecycle behavior are delegated
 * to TanStack's header.getResizeHandler().
 *
 * We do NOT manually calculate:
 *
 * - pointer deltas
 * - min/max width
 * - touch coordinates
 * - onChange/onEnd commit behavior
 *
 * TanStack's columnResizingFeature owns those concerns.
 */
export function DataTableResizeHandle() {
  const header = useMuiDataTableScopedHeaderContext();

  //   const table = useMuiDataTableScopedTableContext();

  const theme = useTheme();

  /**
   * Resizing only makes sense for a leaf-resizable column.
   *
   * getCanResize() already checks:
   *
   * - table.options.enableColumnResizing
   * - columnDef.enableResizing
   */
  if (!header.column.getCanResize()) {
    return null;
  }

  const isResizing = header.column.getIsResizing();

  /**
   * TanStack accepts an optional Document argument.
   *
   * Supplying ownerDocument explicitly is useful for iframe/window safety.
   * In the normal browser case global `document` is fine.
   */
  const handleResizeStart = header.getResizeHandler(
    typeof document !== "undefined" ? document : undefined,
  );

  /**
   * Reset just this column to:
   *
   * columnSizing state override
   *     ↓ removed
   *
   * then falls back to:
   *
   * columnDef.size
   *     ↓
   * default size = 150px
   *
   * while still respecting minSize/maxSize.
   */
  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    header.column.resetSize();
  };

  //   const logicalEndSide = theme.direction === "rtl" ? "left" : "right";

  return (
    <Box
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize column ${header.column.id}`}
      data-column-resize-handle
      data-resizing={isResizing ? "true" : "false"}
      //   onMouseDown={handleResizeStart}
      //   onTouchStart={handleResizeStart}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleResizeStart(event);
      }}
      onTouchStart={(event) => {
        event.stopPropagation();
        handleResizeStart(event);
      }}
      onDoubleClick={handleDoubleClick}
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,

        /**
         * Always attach to the logical end of the column.
         *
         * Browser logical CSS automatically maps this to:
         *
         * LTR -> right
         * RTL -> left
         */
        insetInlineEnd: -4,
        width: 8,
        zIndex: 5,
        cursor: "col-resize",
        touchAction: "none",
        userSelect: "none",

        /**
         * Keep the actual visual rule thin while making the interaction
         * target wider.
         */
        "&::after": {
          content: '""',
          position: "absolute",
          top: "20%",
          bottom: "20%",
          left: "50%",
          width: 2,
          transform: "translateX(-50%)",
          borderRadius: 1,
          backgroundColor: isResizing ? "primary.main" : "divider",
          opacity: isResizing ? 1 : 0,
          transition: theme.transitions.create("opacity", {
            duration: theme.transitions.duration.shortest,
          }),
        },

        "&:hover::after": {
          opacity: 1,
        },

        "&:focus-visible::after": {
          opacity: 1,
        },
      }}
    />
  );
}

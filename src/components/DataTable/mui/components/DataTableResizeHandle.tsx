// "use client";

// import { Box } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import type { MouseEvent } from "react";
// import {
//   useMuiDataTableScopedHeaderContext,
//   //   useMuiDataTableScopedTableContext,
// } from "../table/muiDataTableContexts";

// /**
//  * Header-level column resize control.
//  *
//  * This component is registered through createTableHook() as a
//  * `headerComponent`, therefore column definitions/header renderers can access
//  * it as:
//  *
//  *   <header.ResizeHandle />
//  *
//  * Interactive resize handle for one leaf header.
//  *
//  * All resize calculations and event lifecycle behavior are delegated
//  * to TanStack's header.getResizeHandler().
//  *
//  * We do NOT manually calculate:
//  *
//  * - pointer deltas
//  * - min/max width
//  * - touch coordinates
//  * - onChange/onEnd commit behavior
//  *
//  * TanStack's columnResizingFeature owns those concerns.
//  */
// export function DataTableResizeHandle() {
//   const header = useMuiDataTableScopedHeaderContext();

//   //   const table = useMuiDataTableScopedTableContext();

//   const theme = useTheme();

//   /**
//    * Resizing only makes sense for a leaf-resizable column.
//    *
//    * getCanResize() already checks:
//    *
//    * - table.options.enableColumnResizing
//    * - columnDef.enableResizing
//    */
//   if (!header.column.getCanResize()) {
//     return null;
//   }

//   const isResizing = header.column.getIsResizing();

//   /**
//    * TanStack accepts an optional Document argument.
//    *
//    * Supplying ownerDocument explicitly is useful for iframe/window safety.
//    * In the normal browser case global `document` is fine.
//    */
//   const handleResizeStart = header.getResizeHandler(
//     typeof document !== "undefined" ? document : undefined,
//   );

//   /**
//    * Reset just this column to:
//    *
//    * columnSizing state override
//    *     ↓ removed
//    *
//    * then falls back to:
//    *
//    * columnDef.size
//    *     ↓
//    * default size = 150px
//    *
//    * while still respecting minSize/maxSize.
//    */
//   const handleDoubleClick = (event: MouseEvent<HTMLDivElement>): void => {
//     event.preventDefault();
//     event.stopPropagation();

//     header.column.resetSize();
//   };

//   //   const logicalEndSide = theme.direction === "rtl" ? "left" : "right";

//   return (
//     <Box
//       role="separator"
//       aria-orientation="vertical"
//       aria-label={`Resize column ${header.column.id}`}
//       data-column-resize-handle
//       data-resizing={isResizing ? "true" : "false"}
//       //   onMouseDown={handleResizeStart}
//       //   onTouchStart={handleResizeStart}
//       onMouseDown={(event) => {
//         event.preventDefault();
//         event.stopPropagation();
//         handleResizeStart(event);
//       }}
//       onTouchStart={(event) => {
//         event.stopPropagation();
//         handleResizeStart(event);
//       }}
//       onDoubleClick={handleDoubleClick}
//       sx={{
//         position: "absolute",
//         top: 0,
//         bottom: 0,

//         /**
//          * Always attach to the logical end of the column.
//          *
//          * Browser logical CSS automatically maps this to:
//          *
//          * LTR -> right
//          * RTL -> left
//          */
//         insetInlineEnd: -4,
//         width: 8,
//         zIndex: 5,
//         cursor: "col-resize",
//         touchAction: "none",
//         userSelect: "none",

//         /**
//          * Keep the actual visual rule thin while making the interaction
//          * target wider.
//          */
//         "&::after": {
//           content: '""',
//           position: "absolute",
//           top: "20%",
//           bottom: "20%",
//           left: "50%",
//           width: 2,
//           transform: "translateX(-50%)",
//           borderRadius: 1,
//           backgroundColor: isResizing ? "primary.main" : "divider",
//           opacity: isResizing ? 1 : 0,
//           transition: theme.transitions.create("opacity", {
//             duration: theme.transitions.duration.shortest,
//           }),
//         },

//         "&:hover::after": {
//           opacity: 1,
//         },

//         "&:focus-visible::after": {
//           opacity: 1,
//         },
//       }}
//     />
//   );
// }

// src/components/DataTable/mui/components/DataTableResizeHandle.tsx

"use client";

import {
  Box,
  useTheme,
} from "@mui/material";

import type {
  KeyboardEvent,
} from "react";

import {
  useMuiDataTableContext,
  useMuiDataTableHeaderContext,
} from "../table";


/**
 * TanStack's stock default minimum column size.
 *
 * We duplicate the numeric fallback here only because columnDef.minSize
 * is optional in the public type.
 *
 * The actual committed size is still owned and constrained by TanStack.
 */
const DEFAULT_MIN_COLUMN_SIZE =
  20;


/**
 * TanStack's stock default maximum column size.
 */
const DEFAULT_MAX_COLUMN_SIZE =
  Number.MAX_SAFE_INTEGER;


/**
 * Normal keyboard resize increment in pixels.
 *
 * Eight pixels aligns naturally with MUI's default spacing grid.
 */
const KEYBOARD_RESIZE_STEP =
  8;


/**
 * Shift + Arrow uses a larger resize increment.
 */
const KEYBOARD_RESIZE_LARGE_STEP =
  32;


/**
 * Clamp a requested width to the column's configured sizing range.
 */
function clampColumnSize(
  size: number,
  minSize: number,
  maxSize: number,
): number {
  return Math.min(
    maxSize,
    Math.max(
      minSize,
      size,
    ),
  );
}


/**
 * Keep committed keyboard sizes at a maximum of two decimal places.
 *
 * Pointer resizing can produce fractional sizes, so we deliberately
 * avoid forcing all sizes to integers.
 */
function normalizeColumnSize(
  size: number,
): number {
  return (
    Math.round(
      size *
        100,
    ) /
    100
  );
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
  column: ReturnType<
    typeof useMuiDataTableHeaderContext
  >["column"],
): string {
  const meta =
    column
      .columnDef
      .meta;


  if (
    meta?.label
  ) {
    return meta.label;
  }


  const header =
    column
      .columnDef
      .header;


  if (
    typeof header ===
    "string"
  ) {
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
  const table =
    useMuiDataTableContext();


  const header =
    useMuiDataTableHeaderContext();


  const theme =
    useTheme();


  const column =
    header.column;


  /**
   * Group headers must not own independent resize handles in our
   * renderer.
   *
   * Their width is derived from their leaf columns.
   */
  const leafHeader =
    header.subHeaders.length ===
    0;


  const canResize =
    leafHeader &&
    column.getCanResize();


  if (
    !canResize
  ) {
    return null;
  }


  const resizeHandler =
    header.getResizeHandler();


  const label =
    getResizeColumnLabel(
      column,
    );


  return (
    <table.Subscribe
      selector={
        state => ({
          /**
           * Re-render when committed widths change.
           */
          columnSizing:
            state.columnSizing,

          /**
           * Re-render while pointer/touch resizing begins, moves,
           * and ends.
           */
          columnResizing:
            state.columnResizing,
        })
      }
    >
      {() => {
        const size =
          column.getSize();


        const isResizing =
          column.getIsResizing();


        const minSize =
          column
            .columnDef
            .minSize ??
          DEFAULT_MIN_COLUMN_SIZE;


        const maxSize =
          column
            .columnDef
            .maxSize ??
          DEFAULT_MAX_COLUMN_SIZE;


        /**
         * TanStack's columnResizeDirection is already synchronized
         * with our MUI theme direction by the table setup.
         *
         * Falling back to theme.direction keeps this component safe
         * even if a lower-level consumer omits that option.
         */
        const resizeDirection =
          table
            .options
            .columnResizeDirection ??
          theme.direction;


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
        const resizeBy =
          (
            delta:
              number,
          ): void => {
            const currentSize =
              column.getSize();


            const nextSize =
              normalizeColumnSize(
                clampColumnSize(
                  currentSize +
                    delta,

                  minSize,

                  maxSize,
                ),
              );


            if (
              nextSize ===
              currentSize
            ) {
              return;
            }


            table.setColumnSizing(
              previous => ({
                ...previous,

                [column.id]:
                  nextSize,
              }),
            );
          };


        const handleKeyDown =
          (
            event:
              KeyboardEvent<HTMLSpanElement>,
          ): void => {
            if (
              event.key !==
                "ArrowLeft" &&
              event.key !==
                "ArrowRight"
            ) {
              return;
            }


            event.preventDefault();

            event.stopPropagation();


            const step =
              event.shiftKey
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
              resizeDirection ===
              "rtl"
                ? event.key ===
                  "ArrowLeft"
                : event.key ===
                  "ArrowRight";


            resizeBy(
              increasing
                ? step
                : -step,
            );
          };


        return (
          <Box
            component="span"

            role="separator"

            tabIndex={
              0
            }

            aria-label={
              `Resize ${label}`
            }

            aria-orientation="vertical"

            aria-valuemin={
              minSize
            }

            aria-valuemax={
              maxSize
            }

            aria-valuenow={
              Math.round(
                size,
              )
            }

            aria-valuetext={
              `${Math.round(
                size,
              )} pixels`
            }

            aria-keyshortcuts="ArrowLeft ArrowRight Shift+ArrowLeft Shift+ArrowRight"

            data-column-resize-handle={
              column.id
            }

            data-resizing={
              isResizing
                ? "true"
                : undefined
            }

            /**
             * TanStack owns pointer/touch resize lifecycle.
             */
            onMouseDown={
              resizeHandler
            }

            onTouchStart={
              resizeHandler
            }

            /**
             * Keyboard resizing commits directly into columnSizing.
             */
            onKeyDown={
              handleKeyDown
            }

            /**
             * Pointer users retain the familiar double-click reset.
             *
             * Keyboard users can reach the existing "Reset width"
             * action through the column menu.
             */
            onDoubleClick={
              event => {
                event.preventDefault();

                event.stopPropagation();


                column.resetSize();
              }
            }

            sx={{
              /**
               * Fill the complete header-cell height.
               */
              position:
                "absolute",

              top:
                0,

              bottom:
                0,


              /**
               * Keep the hit area centered over the logical
               * inline-end edge.
               *
               * This works naturally in both LTR and RTL.
               */
              insetInlineEnd:
                -4,

              width:
                8,


              /**
               * The resize target must remain above normal header
               * content.
               */
              zIndex:
                5,


              cursor:
                "col-resize",

              touchAction:
                "none",

              userSelect:
                "none",

              WebkitUserSelect:
                "none",


              /**
               * Do not add visible layout width.
               */
              display:
                "block",


              /**
               * Narrow visual resize rule inside the larger 8px hit
               * target.
               */
              "&::after": {
                content:
                  '""',

                position:
                  "absolute",

                top:
                  "20%",

                bottom:
                  "20%",

                insetInlineStart:
                  "50%",

                width:
                  2,

                borderRadius:
                  1,

                transform:
                  "translateX(-50%)",

                backgroundColor:
                  isResizing
                    ? "primary.main"
                    : "divider",

                opacity:
                  isResizing
                    ? 1
                    : 0.65,

                transition:
                  theme.transitions.create(
                    [
                      "background-color",
                      "opacity",
                    ],

                    {
                      duration:
                        theme
                          .transitions
                          .duration
                          .shortest,
                    },
                  ),
              },


              "&:hover::after": {
                backgroundColor:
                  "primary.main",

                opacity:
                  1,
              },


              /**
               * Keyboard focus must be obvious even though the
               * physical target is intentionally narrow.
               */
              "&:focus-visible": {
                outline:
                  "2px solid",

                outlineColor:
                  "primary.main",

                outlineOffset:
                  1,

                borderRadius:
                  0.5,
              },


              "&:focus-visible::after": {
                backgroundColor:
                  "primary.main",

                opacity:
                  1,
              },
            }}
          />
        );
      }}
    </table.Subscribe>
  );
}
"use client";

// src/components/DataTable/mui/components/sorting/DataTableSortLabel.tsx

import { Box, ButtonBase, TableSortLabel } from "@mui/material";
import type { ReactNode } from "react";
import { DataTableSortIndex } from "./DataTableSortIndex";
import {
  DATA_TABLE_HEADER_AFFORDANCE_GAP_PX,
  DATA_TABLE_HEADER_SORT_ICON_SIZE_PX,
} from "../headerLayout";

export type DataTableSortDirection = "asc" | "desc" | false;

export interface DataTableSortLabelProps {
  /**
   * Rendered TanStack header content.
   */
  readonly children: ReactNode;

  /**
   * Current TanStack sorting direction.
   */
  readonly direction: DataTableSortDirection;

  /**
   * Whether the column is allowed to sort.
   */
  readonly canSort: boolean;

  /**
   * Zero-based sort order in multi-sort mode.
   */
  readonly sortIndex?: number;

  /**
   * Whether to render the multi-sort order indicator.
   */
  readonly showSortIndex?: boolean;

  /**
   * Handler supplied by the parent/TanStack.
   */
  readonly onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Standard MUI presentation for DataTable sorting headers.
 *
 * UX policy:
 *
 * non-sortable
 *   label only
 *
 * sortable + inactive
 *   label + faint sort glyph
 *
 * sortable + active
 *   label + emphasized directional glyph
 *
 * hover/focus
 *   stronger glyph emphasis
 *
 * This component owns only MUI presentation.
 *
 * TanStack remains responsible for:
 *
 * - current sorting state
 * - ascending/descending transitions
 * - sorting removal
 * - multi-sort behavior
 * - modifier-key interpretation
 */
/**
 * The semantic/clickable LABEL of a sortable header.
 *
 * Important architectural distinction:
 *
 * This component no longer renders the sort icon.
 *
 * Why?
 *
 * If the icon participates in this box's width, then centering this box
 * centers:
 *
 *   label + icon
 *
 * rather than:
 *
 *   label
 *
 * Sort presentation is therefore delegated to
 * DataTableSortIndicator.
 */
export function DataTableSortLabel(props: DataTableSortLabelProps) {
  const {
    children,
    direction,
    canSort,
    // sortIndex,
    // showSortIndex = true,
    onClick,
  } = props;

  /**
   * MUI TableSortLabel expects a direction even while inactive.
   *
   * The direction is visually relevant only when active=true.
   */
  const muiDirection = direction === "desc" ? "desc" : "asc";

  const active = direction !== false;

  /**
   * Reusable header-label wrapper.
   *
   * This is intentionally the ONLY place in the header chain where
   * ordinary label content is truncated, so text never competes with:
   *
   * - filter indicator
   * - sort icon
   * - multi-sort index
   * - column-menu button
   */
  const label = (
    <Box
      component="span"
      className="DataTable-headerLabel"
      sx={{
        display: "block",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontWeight: 600,
        lineHeight: 1.25,
      }}
    >
      {children}
    </Box>
  );

  /**
   * ================================================================
   * Non-sortable header
   * ================================================================
   */
  if (!canSort) {
    return label;
    // return (
    //   <Box
    //     component="span"
    //     sx={{
    //       display: "inline-flex",
    //       alignItems: "center",

    //       /**
    //        * This component occupies the available first grid track.
    //        */
    //       // flex: "1 1 auto",

    //       minWidth: 0,
    //       maxWidth: "100%",
    //       overflow: "hidden",
    //       color: "inherit",
    //     }}
    //   >
    //     {label}
    //   </Box>
    // );
  }

  /**
   * ================================================================
   * Sortable header
   * ================================================================
   */
  // return (
  //   <Box
  //     component="span"
  //     sx={{
  //       display: "inline-flex",
  //       alignItems: "center",
  //       gap: 0.5,
  //       // flex: "1 1 auto",
  //       minWidth: 0,
  //       maxWidth: "100%",
  //       overflow: "hidden",
  //     }}
  //   >
  //     <TableSortLabel
  //       active={active}
  //       direction={muiDirection}
  //       // /**
  //       //  * Keep dormant sort arrows hidden for now.
  //       //  *
  //       //  * During the visual-polish pass we can make them subtly visible
  //       //  * on hover, similar to the reference table.
  //       //  */
  //       // hideSortIcon={!active}
  //       /**
  //        * IMPORTANT:
  //        *
  //        * Keep an inactive sort affordance mounted.
  //        *
  //        * This gives users discoverability and—equally important—stable
  //        * geometry.
  //        *
  //        * We control emphasis ourselves through opacity rather than
  //        * completely removing the affordance from inactive columns.
  //        */
  //       hideSortIcon={false}
  //       onClick={onClick}
  //       // sx={{
  //       //   minWidth: 0,
  //       //   maxWidth: "100%",
  //       //   color: "inherit",

  //       //   /**
  //       //    * MUI's root needs to remain shrinkable instead of letting
  //       //    * the header label force the complete cell wider.
  //       //    */
  //       //   overflow: "hidden",

  //       //   "&.Mui-active": {
  //       //     color: "inherit",
  //       //   },
  //       //   "&:hover": {
  //       //     color: "text.primary",
  //       //   },
  //       //   "& .MuiTableSortLabel-icon": {
  //       //     flexShrink: 0,
  //       //   },
  //       // }}
  //       sx={{
  //         display: "inline-flex",
  //         alignItems: "center",
  //         // flex: "1 1 auto",
  //         minWidth: 0,
  //         maxWidth: "100%",

  //         /**
  //          * MUI's root needs to remain shrinkable instead of letting
  //          * the header label force the complete cell wider.
  //          */
  //         overflow: "hidden",
  //         color: "inherit",

  //         /**
  //          * Keep label and icon close together like the MRT header.
  //          */
  //         "& .MuiTableSortLabel-icon": {
  //           /**
  //            * Remove MUI's implicit margins so our header geometry has one
  //            * canonical definition.
  //            */
  //           margin: 0,

  //           marginInlineStart: `${DATA_TABLE_HEADER_AFFORDANCE_GAP_PX}px`,
  //           width: `${DATA_TABLE_HEADER_SORT_ICON_SIZE_PX}px`,
  //           height: `${DATA_TABLE_HEADER_SORT_ICON_SIZE_PX}px`,

  //           // mx: 0.25,
  //           // flexShrink: 0,

  //           flex: "0 0 auto",

  //           /**
  //            * Always visible, but subordinate when inactive.
  //            */
  //           opacity: active ? 0.95 : 0.28,

  //           color: active ? "primary.main" : "text.secondary",
  //           transition: (theme) =>
  //             theme.transitions.create(["opacity", "color", "transform"], {
  //               duration: theme.transitions.duration.shortest,
  //             }),
  //         },

  //         "&:hover .MuiTableSortLabel-icon": {
  //           opacity: active ? 1 : 0.7,
  //           color: active ? "primary.main" : "text.primary",
  //         },

  //         "&.Mui-active": {
  //           color: "inherit",
  //         },

  //         "&:hover": {
  //           color: "text.primary",
  //         },

  //         /**
  //          * Accessible keyboard focus.
  //          */
  //         "&:focus-visible": {
  //           outline: "2px solid",
  //           outlineColor: "primary.main",
  //           outlineOffset: 2,
  //           borderRadius: 0.5,
  //         },

  //         // "& .MuiTableSortLabel-icon": {
  //         //   flexShrink: 0,
  //         // },
  //       }}
  //     >
  //       {label}
  //     </TableSortLabel>

  //     {showSortIndex && active && sortIndex !== undefined && (
  //       <DataTableSortIndex index={sortIndex} />
  //     )}
  //   </Box>
  // );

  return (
    <ButtonBase
      component="span"
      onClick={onClick}
      aria-pressed={active ? true : undefined}
      sx={{
        display: "inline-flex",

        minWidth: 0,
        maxWidth: "100%",

        color: "inherit",

        borderRadius: 0.5,

        /**
         * Don't let ButtonBase introduce visual padding that would
         * change the label's geometric center.
         */
        p: 0,

        "&:hover": {
          color: "text.primary",
        },

        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      }}
    >
      {label}
    </ButtonBase>
  );
}

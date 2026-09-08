"use client";

import { Box, IconButton } from "@mui/material";
import { ArrowDownward, SyncAlt } from "@mui/icons-material";
import type { MouseEvent } from "react";
import type { DataTableSortDirection } from "./DataTableSortLabel";
import { DataTableSortIndex } from "./DataTableSortIndex";

export interface DataTableSortIndicatorProps {
  readonly direction: DataTableSortDirection;
  readonly sortIndex?: number;
  readonly showSortIndex?: boolean;
  readonly onClick?: (event: MouseEvent<HTMLElement>) => void;
}

/**
 * Compact visual sorting affordance.
 *
 * It deliberately lives OUTSIDE the centered label track.
 *
 * Therefore its presence, direction and multi-sort badge can never
 * shift the label away from the physical center of the column.
 */
export function DataTableSortIndicator(props: DataTableSortIndicatorProps) {
  const { direction, sortIndex, showSortIndex = false, onClick } = props;

  const active = direction !== false;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.25,
        flex: "0 0 auto",
      }}
    >
      <IconButton
        className="DataTable-sortButton"
        component="span"
        size="small"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClick}
        sx={{
          // width: 18,
          // height: 20,
          minWidth: 18,
          width: "3ch",
          height: 20,
          p: 0,
          m: 0,
          color: active ? "primary.main" : "text.secondary",
          opacity: active ? 1 : 0.35,

          transition: (theme) =>
            theme.transitions.create(["opacity", "color"], {
              duration: theme.transitions.duration.shortest,
            }),

          "&:hover": {
            opacity: 1,
            color: active ? "primary.main" : "text.primary",
          },
        }}
      >
        {active ? (
          <ArrowDownward
            sx={{
              fontSize: "18px",
              transform: direction === "asc" ? "rotate(180deg)" : "none",

              transition: (theme) =>
                theme.transitions.create("transform", {
                  duration: theme.transitions.duration.shortest,
                }),
            }}
          />
        ) : (
          <SyncAlt
            sx={{
              fontSize: "18px",

              /**
               * Similar visual language to MRT's inactive sorting
               * affordance.
               */
              transform: "rotate(-90deg)",
            }}
          />
        )}
      </IconButton>

      {showSortIndex && active && sortIndex !== undefined && (
        <DataTableSortIndex index={sortIndex} />
      )}
    </Box>
  );
}

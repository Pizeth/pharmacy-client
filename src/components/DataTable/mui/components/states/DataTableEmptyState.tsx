"use client";

import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { InboxOutlined, SearchOffOutlined } from "@mui/icons-material";
import type { DataTableBodyStateProps } from "./types";

export interface DataTableEmptyStateProps extends DataTableBodyStateProps {
  /**
   * Whether rows are absent because an active search/filter produced
   * no matches.
   */
  readonly filtered?: boolean;
}

export function DataTableEmptyState(props: DataTableEmptyStateProps) {
  const { colSpan, children, filtered = false } = props;

  const Icon = filtered ? SearchOffOutlined : InboxOutlined;

  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        sx={{
          borderBottom: 0,
          py: 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          <Icon
            sx={{
              fontSize: 40,
              opacity: 0.7,
            }}
          />

          {children ?? (
            <Typography variant="body2">
              {filtered ? "No matching rows" : "No rows to display"}
            </Typography>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}

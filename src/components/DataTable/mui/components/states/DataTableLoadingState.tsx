"use client";

import {
  Box,
  CircularProgress,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import type { DataTableBodyStateProps } from "./types";

export function DataTableLoadingState(props: DataTableBodyStateProps) {
  const { colSpan, children } = props;

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
          }}
        >
          <CircularProgress size={28} />
          {children ?? <Typography variant="body2">Loading…</Typography>}
        </Box>
      </TableCell>
    </TableRow>
  );
}

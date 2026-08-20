"use client";

import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { SearchOffOutlined } from "@mui/icons-material";
import type { DataTableBodyStateProps } from "./types";

export function DataTableEmptyState(props: DataTableBodyStateProps) {
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
            textAlign: "center",
          }}
        >
          <SearchOffOutlined
            sx={{
              fontSize: 40,
              opacity: 0.7,
            }}
          />

          {children ?? (
            <Typography variant="body2">No rows to display</Typography>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}

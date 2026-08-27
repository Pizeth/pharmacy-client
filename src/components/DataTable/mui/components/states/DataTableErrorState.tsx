"use client";

import { Alert, TableCell, TableRow } from "@mui/material";
import type { DataTableBodyStateProps } from "./types";

export function DataTableErrorState(props: DataTableBodyStateProps) {
  const { colSpan, children } = props;

  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        role="alert"
        aria-live="assertive"
        sx={{
          borderBottom: 0,
          p: 2,
        }}
      >
        <Alert severity="error">
          {children ?? "Unable to load table data."}
        </Alert>
      </TableCell>
    </TableRow>
  );
}

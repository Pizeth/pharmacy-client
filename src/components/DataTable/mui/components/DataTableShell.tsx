"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { useDataTableFullscreen } from "../fullscreen";

export interface DataTableShellProps {
  readonly children: ReactNode;
}

/**
 * Outer visual shell for the high-level DataTable.
 *
 * Fullscreen applies here so toolbar, table body, and pagination
 * participate together.
 */
export function DataTableShell(props: DataTableShellProps) {
  const { children } = props;

  const { fullscreen } = useDataTableFullscreen();

  return (
    <Box
      data-fullscreen={fullscreen ? "true" : undefined}
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: fullscreen ? 0 : 2,
        overflow: "hidden",

        ...(fullscreen
          ? {
              position: "fixed",
              inset: 0,
              width: "100vw",
              height: "100dvh",
              maxWidth: "100vw",
              maxHeight: "100dvh",
              zIndex: (theme) => theme.zIndex.modal + 1,
            }
          : {}),
      }}
    >
      {children}
    </Box>
  );
}

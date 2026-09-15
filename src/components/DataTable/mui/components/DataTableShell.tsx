"use client";

import { Box, styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { ReactNode } from "react";
import { useDataTableFullscreen } from "../fullscreen";

const ShellRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: 0,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: "1px solid",
  borderColor: (theme.vars ?? theme).palette.divider,
  borderRadius:
    typeof theme.shape.borderRadius === "number"
      ? theme.shape.borderRadius * 2
      : `calc(${theme.shape.borderRadius} * 2)`,
  overflow: "hidden",
  '&[data-fullscreen="true"]': {
    borderRadius: 0,
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100dvh",
    maxWidth: "100vw",
    maxHeight: "100dvh",
    zIndex: theme.zIndex.modal + 1,
  },
}));

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
    <ShellRoot
      className={dataTableClasses.root}
      data-fullscreen={fullscreen ? "true" : undefined}
    >
      {children}
    </ShellRoot>
  );
}

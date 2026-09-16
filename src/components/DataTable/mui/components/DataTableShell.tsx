"use client";

import { Box, styled, useTheme } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { ReactNode } from "react";
import { useDataTableFullscreen } from "../fullscreen";
import type { DataTableOwnerState } from "../theme";

/**
 * ------------------------------------------------------------------
 * Root structural slot
 * ------------------------------------------------------------------
 *
 * The shared structural ownerState deliberately contains only stable
 * visual variant state.
 *
 * Mutable fullscreen state remains represented through:
 *
 *   data-fullscreen
 *
 * rather than being duplicated into ownerState.
 */
const ShellRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{
  readonly ownerState: DataTableOwnerState;
}>(({ theme, ownerState }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: 0,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,

  /**
   * ============================================================
   * Built-in visual variants
   * ============================================================
   *
   * `outlined` preserves the exact pre-6F.3 shell appearance.
   *
   * `plain` removes only outer chrome.
   *
   * Neither variant modifies:
   *
   * - table state
   * - toolbar behavior
   * - header/body behavior
   * - density
   * - pagination
   * - selection
   */
  ...(ownerState.variant === "outlined"
    ? {
        border: "1px solid",
        borderColor: (theme.vars ?? theme).palette.divider,
        borderRadius:
          typeof theme.shape.borderRadius === "number"
            ? theme.shape.borderRadius * 2
            : `calc(${theme.shape.borderRadius} * 2)`,
      }
    : {
        border: 0,
        borderRadius: 0,
      }),

  overflow: "hidden",
  boxSizing: "border-box",

  /**
   * ============================================================
   * Mutable fullscreen state
   * ============================================================
   *
   * This remains provider-owned runtime state rather than variant
   * ownerState.
   */
  '&[data-fullscreen="true"]': {
    borderRadius: 0,
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100dvh",
    maxWidth: "100vw",
    maxHeight: "100dvh",
    // Fullscreen is below portaled MUI menus, popovers, and dialogs.
    zIndex: theme.zIndex.modal - 1,
    [`& > .${dataTableClasses.content}`]: {
      flex: "1 1 0%",
      minHeight: 0,
      overflow: "hidden",
      [`& > :not(.${dataTableClasses.container})`]: { flexShrink: 0 },
    },
    [`& > .${dataTableClasses.toolbar}`]: { flexShrink: 0 },
  },
}));

export interface DataTableShellProps {
  readonly children: ReactNode;

  /**
   * Shared styling state resolved by DataTable.
   *
   * This is intentionally not the full DataTable props object.
   */
  readonly ownerState: DataTableOwnerState;
}

/**
 * Outer visual shell for the high-level DataTable.
 *
 * Fullscreen applies here so:
 *
 * - toolbar
 * - table body
 * - selection bar
 * - pagination
 *
 * participate together.
 */
export function DataTableShell(props: DataTableShellProps) {
  const { children, ownerState } = props;
  const { direction } = useTheme();

  const { fullscreen, setFullscreen } = useDataTableFullscreen();

  return (
    <ShellRoot
      dir={direction}
      ownerState={ownerState}
      className={dataTableClasses.root}
      /**
       * Stable debugging/theme selector for the resolved public
       * visual variant.
       *
       * The actual `variant` prop itself is NOT forwarded to the DOM.
       */
      data-variant={ownerState.variant}
      data-fullscreen={fullscreen ? "true" : undefined}
      onKeyDown={(event) => {
        // Respect nested controls that consume Escape (menus, popovers, inputs).
        // Ignore portal events: their DOM target is outside this shell.
        if (
          fullscreen &&
          event.key === "Escape" &&
          !event.defaultPrevented &&
          event.currentTarget.contains(event.target as Node)
        ) {
          event.preventDefault();
          event.stopPropagation();
          setFullscreen(false);
        }
      }}
    >
      {children}
    </ShellRoot>
  );
}

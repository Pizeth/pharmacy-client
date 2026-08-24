"use client";

import { Box, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTableGlobalFilter } from "../global-filtering";
import { DataTableToolbarActions } from "./DataTableToolbarActions";
import { DataTableToolbarSelection } from "./DataTableToolbarSelection";
import { renderDataTableToolbarContent } from "./renderToolbarContent";

import type {
  DataTableToolbarConfig,
  DataTableToolbarRenderContext,
} from "./types";

export interface DataTableToolbarProps<
  TData extends RowData,
> extends DataTableToolbarConfig<TData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Standard high-level DataTable toolbar.
 *
 * Layout responsibilities:
 *
 * - application/custom start content
 * - global search
 * - selection summary
 * - custom end content
 * - built-in internal actions
 * - responsive reflow
 *
 * Table feature state remains completely owned by TanStack.
 */
export function DataTableToolbar<TData extends RowData>(
  props: DataTableToolbarProps<TData>,
) {
  const {
    table,
    search = true,
    searchPosition = "center",
    searchPlaceholder = "Search…",
    startContent,
    endContent,
    // enableColumnVisibility = true,
    enableColumnManager = true,
    columnManager,
    enableDensity = true,
    enableFullscreen = true,
    showSelectionSummary = true,
  } = props;

  const theme = useTheme();

  const narrow = useMediaQuery(theme.breakpoints.down("md"));

  const context: DataTableToolbarRenderContext<TData> = {
    table,
  };

  const renderedStartContent = renderDataTableToolbarContent(
    startContent,
    context,
  );

  const renderedEndContent = renderDataTableToolbarContent(endContent, context);

  const searchNode = search ? (
    <DataTableGlobalFilter
      table={table}
      placeholder={searchPlaceholder}
      fullWidth={narrow}
    />
  ) : null;

  const startSearch = !narrow && searchPosition === "start";

  const centerSearch = !narrow && searchPosition === "center";

  const endSearch = !narrow && searchPosition === "end";

  return (
    <Box
      component="header"
      sx={{
        display: "grid",
        gap: 1,
        px: 1.5,
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",

        /**
         * Similar philosophy to MRT's responsive toolbar:
         *
         * desktop:
         *   one primary toolbar row
         *
         * narrow:
         *   controls row + full-width search row
         */
        gridTemplateColumns: "minmax(0, 1fr)",
        minHeight: 56,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          minWidth: 0,
          flexWrap: narrow ? "wrap" : "nowrap",
        }}
      >
        {/**
         * START REGION
         */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            minWidth: 0,
            flex: centerSearch ? 1 : "0 1 auto",
          }}
        >
          {startSearch && searchNode}

          {renderedStartContent}

          {showSelectionSummary && <DataTableToolbarSelection table={table} />}
        </Stack>

        {/**
         * CENTER REGION
         */}
        {centerSearch && (
          <Box
            sx={{
              flex: "1 1 360px",
              display: "flex",
              justifyContent: "center",
              minWidth: 220,
              maxWidth: 520,
              mx: 1,
            }}
          >
            {searchNode}
          </Box>
        )}

        {/**
         * END REGION
         */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
          sx={{
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          {endSearch && searchNode}

          {renderedEndContent}

          <DataTableToolbarActions
            table={table}
            // enableColumnVisibility={enableColumnVisibility}
            enableColumnManager={enableColumnManager}
            columnManager={columnManager}
            enableDensity={enableDensity}
            enableFullscreen={enableFullscreen}
          />
        </Stack>
      </Box>

      {/**
       * On narrow layouts search receives its own full-width row.
       *
       * This avoids the complexity MRT has to handle when custom
       * actions + global filter + tablet widths all compete for the
       * same horizontal space.
       */}
      {narrow && searchNode}
    </Box>
  );
}

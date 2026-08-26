"use client";

import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import { DataTableGlobalFilter } from "../global-filtering";
import type { MuiDataTableInstance } from "../../table";
import { DataTableSearchToggleButton } from "./actions";
import { DataTableToolbarActions } from "./DataTableToolbarActions";
import { DataTableToolbarFilterStatus } from "./DataTableToolbarFilterStatus";
import { DataTableToolbarSelection } from "./DataTableToolbarSelection";
import { renderDataTableToolbarContent } from "./renderToolbarContent";
import type {
  DataTableToolbarConfig,
  DataTableToolbarRenderContext,
} from "./types";
import { useDataTableToolbarSearchVisibility } from "./useDataTableToolbarSearchVisibility";
import { useDataTableAccessibility } from "../../accessibility";

export interface DataTableToolbarProps<
  TData extends RowData,
> extends DataTableToolbarConfig<TData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Standard High-level MUI toolbar.
 *
 * Layout responsibilities:
 *
 * - application-defined start/end actions
 * - global-search presentation
 * - search visibility toggle
 * - selected-row summary
 * - active-filter status
 * - internal DataTable actions
 * - responsive toolbar layout
 *
 * TanStack remains responsible for actual table state.
 */
export function DataTableToolbar<TData extends RowData>(
  props: DataTableToolbarProps<TData>,
) {
  const {
    table,
    search = true,
    searchMode = "always",
    searchPosition = "center",
    searchPlaceholder = "Search…",
    searchOpen: controlledSearchOpen,
    defaultSearchOpen = false,
    onSearchOpenChange,
    startContent,
    endContent,
    showSelectionSummary = true,
    enableFilterToggle = true,
    showFilterStatus = false,
    enableColumnManager = true,
    columnManager,
    enableDensity = true,
    enableFullscreen = true,
  } = props;

  const theme = useTheme();

  const { globalSearchId } = useDataTableAccessibility();

  /**
   * On narrower screens, search always moves beneath the primary
   * toolbar row and takes the available width.
   */
  const narrow = useMediaQuery(theme.breakpoints.down("md"));

  const context: DataTableToolbarRenderContext<TData> = {
    table,
  };

  const renderedStartContent = renderDataTableToolbarContent(
    startContent,
    context,
  );

  const renderedEndContent = renderDataTableToolbarContent(endContent, context);

  const searchVisibility = useDataTableToolbarSearchVisibility({
    enabled: search,
    mode: searchMode,
    open: controlledSearchOpen,
    defaultOpen: defaultSearchOpen,
    onOpenChange: onSearchOpenChange,
  });

  /**
   * Search field is created once and placed in the appropriate
   * desktop region, or its own responsive row on narrow screens.
   */
  const searchField = searchVisibility.open ? (
    <Box
      id={globalSearchId}
      role="search"
      aria-label="Table search"
      sx={{
        width: {
          xs: "100%",
          sm: 320,
        },

        maxWidth: "100%",
        minWidth: 0,
        flexShrink: 1,
      }}
    >
      <DataTableGlobalFilter table={table} placeholder={searchPlaceholder} />
    </Box>
  ) : null;

  const desktopStartSearch =
    !narrow && searchPosition === "start" ? searchField : null;

  const desktopCenterSearch =
    !narrow && searchPosition === "center" ? searchField : null;

  const desktopEndSearch =
    !narrow && searchPosition === "end" ? searchField : null;

  // const searchNode = search ? (
  //   <DataTableGlobalFilter
  //     table={table}
  //     placeholder={searchPlaceholder}
  //     fullWidth={narrow}
  //   />
  // ) : null;

  // const startSearch = !narrow && searchPosition === "start";

  // const centerSearch = !narrow && searchPosition === "center";

  // const endSearch = !narrow && searchPosition === "end";

  return (
    <Box
      component="header"
      data-data-table-toolbar="true"
      sx={{
        // display: "grid",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        px: 2,
        py: 1,
        minWidth: 0,
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
        // gridTemplateColumns: "minmax(0, 1fr)",
        // minHeight: 56,
      }}
    >
      {/**
       * ----------------------------------------------------------
       * Primary toolbar row
       * ----------------------------------------------------------
       */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          width: "100%",
          minWidth: 0,
          flexWrap: "wrap",
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
            flex: "1 1 0",
            minWidth: 0,
            flexWrap: "wrap",
          }}
        >
          {renderedStartContent}
          {showSelectionSummary && <DataTableToolbarSelection table={table} />}
          {desktopStartSearch}
        </Stack>

        {/**
         * CENTER REGION
         *
         * Only reserve center space while a centered search field is
         * actually visible.
         */}
        {desktopCenterSearch && (
          <Box
            sx={{
              flex: "0 1 auto",
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {desktopCenterSearch}
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
            flex: "1 1 0",
            minWidth: 0,
            flexWrap: "wrap",
          }}
        >
          {desktopEndSearch}

          {/**
           * Search visibility control comes before application
           * end-actions, matching the interaction order of the
           * existing MRT toolbar.
           */}
          {searchVisibility.canToggle && (
            <DataTableSearchToggleButton<TData>
              table={table}
              open={searchVisibility.open}
              onToggle={searchVisibility.toggle}
            />
          )}

          {renderedEndContent}

          {showFilterStatus && (
            <DataTableToolbarFilterStatus<TData> table={table} />
          )}

          <DataTableToolbarActions<TData>
            table={table}
            enableFilterToggle={enableFilterToggle}
            enableColumnManager={enableColumnManager}
            columnManager={columnManager}
            enableDensity={enableDensity}
            enableFullscreen={enableFullscreen}
          />
        </Stack>
      </Stack>
      {/**
       * ----------------------------------------------------------
       * Responsive search row
       * ----------------------------------------------------------
       *
       * On narrow screens the search position is ignored and the
       * field receives its own row.
       */}
      {narrow && searchField && (
        <Box
          sx={{
            width: "100%",

            minWidth: 0,
          }}
        >
          {searchField}
        </Box>
      )}
    </Box>
  );
}

// {/* <Box
//   sx={{
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 1,
//     minWidth: 0,
//     flexWrap: narrow ? "wrap" : "nowrap",
//   }}
// >
//   {/**
//    * START REGION
//    */}
//   <Stack
//     direction="row"
//     alignItems="center"
//     spacing={1}
//     sx={{
//       minWidth: 0,
//       flex: centerSearch ? 1 : "0 1 auto",
//     }}
//   >
//     {startSearch && searchNode}

//     {renderedStartContent}

//     {showSelectionSummary && <DataTableToolbarSelection table={table} />}
//   </Stack>

//   {/**
//    * CENTER REGION
//    */}
//   {centerSearch && (
//     <Box
//       sx={{
//         flex: "1 1 360px",
//         display: "flex",
//         justifyContent: "center",
//         minWidth: 220,
//         maxWidth: 520,
//         mx: 1,
//       }}
//     >
//       {searchNode}
//     </Box>
//   )}

//   {/**
//    * END REGION
//    */}
//   <Stack
//     direction="row"
//     alignItems="center"
//     justifyContent="flex-end"
//     spacing={0.5}
//     sx={{
//       flexShrink: 0,
//       minWidth: 0,
//     }}
//   >
//     {endSearch && searchNode}

//     {renderedEndContent}

//     <DataTableToolbarActions
//       table={table}
//       // enableColumnVisibility={enableColumnVisibility}
//       enableFilterToggle={enableFilterToggle}
//       enableColumnManager={enableColumnManager}
//       columnManager={columnManager}
//       enableDensity={enableDensity}
//       enableFullscreen={enableFullscreen}
//     />
//   </Stack>
// </Box>;

// {
//   /**
//    * On narrow layouts search receives its own full-width row.
//    *
//    * This avoids the complexity MRT has to handle when custom
//    * actions + global filter + tablet widths all compete for the
//    * same horizontal space.
//    */
// }
// {
//   narrow && searchNode;
// } */}

"use client";

import { Box, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
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

const ToolbarRoot = styled("header", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Toolbar",
  overridesResolver: (_props, styles) => styles.toolbar,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1),
  minWidth: 0,
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
}));
const ToolbarRowRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarRow",
  overridesResolver: (_props, styles) => styles.toolbarRow,
})({ width: "100%", minWidth: 0, flexWrap: "wrap" });
const ToolbarStartRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarStart",
  overridesResolver: (_props, styles) => styles.toolbarStart,
})({ flex: "1 1 0", minWidth: 0, flexWrap: "wrap" });
const ToolbarCenterRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarCenter",
  overridesResolver: (_props, styles) => styles.toolbarCenter,
})({
  flex: "0 1 auto",
  minWidth: 0,
  display: "flex",
  justifyContent: "center",
});
const ToolbarEndRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarEnd",
  overridesResolver: (_props, styles) => styles.toolbarEnd,
})({ flex: "1 1 0", minWidth: 0, flexWrap: "wrap" });
const ToolbarSearchRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarSearch",
  overridesResolver: (_props, styles) => styles.toolbarSearch,
})(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("sm")]: { width: 320 },
  maxWidth: "100%",
  minWidth: 0,
  flexShrink: 1,
}));
const ToolbarSearchRowRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarSearchRow",
  overridesResolver: (_props, styles) => styles.toolbarSearchRow,
})({ width: "100%", minWidth: 0 });

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
    searchDebounceMs = 0,
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
    <ToolbarSearchRoot
      className={dataTableClasses.toolbarSearch}
      id={globalSearchId}
      role="search"
      aria-label="Table search"
    >
      <DataTableGlobalFilter
        table={table}
        placeholder={searchPlaceholder}
        debounceMs={searchDebounceMs}
        fullWidth={narrow}
      />
    </ToolbarSearchRoot>
  ) : null;

  const desktopStartSearch =
    !narrow && searchPosition === "start" ? searchField : null;

  const desktopCenterSearch =
    !narrow && searchPosition === "center" ? searchField : null;

  const desktopEndSearch =
    !narrow && searchPosition === "end" ? searchField : null;

  return (
    <ToolbarRoot
      className={dataTableClasses.toolbar}
      data-data-table-toolbar="true"
    >
      {/**
       * ----------------------------------------------------------
       * Primary toolbar row
       * ----------------------------------------------------------
       */}
      <ToolbarRowRoot
        className={dataTableClasses.toolbarRow}
        direction="row"
        alignItems="center"
        spacing={1}
      >
        {/**
         * START REGION
         */}
        <ToolbarStartRoot
          className={dataTableClasses.toolbarStart}
          direction="row"
          alignItems="center"
          spacing={1}
        >
          {renderedStartContent}
          {showSelectionSummary && <DataTableToolbarSelection table={table} />}
          {desktopStartSearch}
        </ToolbarStartRoot>

        {/**
         * CENTER REGION
         *
         * Only reserve center space while a centered search field is
         * actually visible.
         */}
        {desktopCenterSearch && (
          <ToolbarCenterRoot className={dataTableClasses.toolbarCenter}>
            {desktopCenterSearch}
          </ToolbarCenterRoot>
        )}

        {/**
         * END REGION
         */}
        <ToolbarEndRoot
          className={dataTableClasses.toolbarEnd}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
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
        </ToolbarEndRoot>
      </ToolbarRowRoot>
      {/**
       * ----------------------------------------------------------
       * Responsive search row
       * ----------------------------------------------------------
       *
       * On narrow screens the search position is ignored and the
       * field receives its own row.
       */}
      {narrow && searchField && (
        <ToolbarSearchRowRoot className={dataTableClasses.toolbarSearchRow}>
          {searchField}
        </ToolbarSearchRowRoot>
      )}
    </ToolbarRoot>
  );
}

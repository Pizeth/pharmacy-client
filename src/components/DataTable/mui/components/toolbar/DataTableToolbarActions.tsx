"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

// src/components/DataTable/mui/components/toolbar/DataTableToolbarActions.tsx

import { Stack, styled } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import { DataTableColumnManagerButton } from "../column-manager";
import type { DataTableColumnManagerConfig } from "../column-manager";
import type { MuiDataTableInstance } from "../../table";
import {
  DataTableDensityButton,
  DataTableFilterToggleButton,
  DataTableFullscreenButton,
} from "./actions";

const ToolbarActionsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarActions",
  overridesResolver: (_props, styles) => styles.toolbarActions,
})({ flexShrink: 0 });

export interface DataTableToolbarActionsProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly enableFilterToggle: boolean;
  readonly enableColumnManager: boolean;
  readonly columnManager?: DataTableColumnManagerConfig;
  readonly enableDensity: boolean;
  readonly enableFullscreen: boolean;
}

/**
 * Standard DataTable-internal toolbar actions.
 *
 * Search visibility is intentionally handled by DataTableToolbar
 * itself because the search button and search input form one
 * presentation feature.
 */
export function DataTableToolbarActions<TData extends RowData>(
  props: DataTableToolbarActionsProps<TData>,
) {
  const {
    table,
    enableFilterToggle,
    enableColumnManager,
    columnManager,
    enableDensity,
    enableFullscreen,
  } = props;

  return (
    <ToolbarActionsRoot
      className={dataTableClasses.toolbarActions}
      direction="row"
      alignItems="center"
      spacing={0.25}
    >
      {enableFilterToggle && (
        <DataTableFilterToggleButton<TData> table={table} />
      )}

      {enableColumnManager && (
        <DataTableColumnManagerButton table={table} {...columnManager} />
      )}

      {enableDensity && <DataTableDensityButton />}

      {enableFullscreen && <DataTableFullscreenButton />}
    </ToolbarActionsRoot>
  );
}

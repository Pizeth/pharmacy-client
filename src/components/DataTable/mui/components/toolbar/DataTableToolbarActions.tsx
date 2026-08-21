"use client";

import { Stack } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import {
  DataTableColumnVisibilityButton,
  DataTableDensityButton,
  DataTableFullscreenButton,
} from "./actions";

export interface DataTableToolbarActionsProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly enableColumnVisibility: boolean;
  readonly enableDensity: boolean;
  readonly enableFullscreen: boolean;
}

/**
 * Standard framework-owned toolbar action area.
 *
 * This is analogous in role to MRT's internal toolbar button area,
 * but intentionally much smaller and composable.
 */
export function DataTableToolbarActions<TData extends RowData>(
  props: DataTableToolbarActionsProps<TData>,
) {
  const { table, enableColumnVisibility, enableDensity, enableFullscreen } =
    props;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.25}
      sx={{
        flexShrink: 0,
      }}
    >
      {enableColumnVisibility && (
        <DataTableColumnVisibilityButton table={table} />
      )}

      {enableDensity && <DataTableDensityButton />}

      {enableFullscreen && <DataTableFullscreenButton />}
    </Stack>
  );
}

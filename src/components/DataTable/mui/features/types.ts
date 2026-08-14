// src/components/DataTable/mui/features/types.ts

import type { TableOptions, TableState } from "@tanstack/table-core";

import type { RowData } from "@tanstack/table-core";

import type { MuiDataTableFeatures } from "./muiDataTableFeatures";

/**
 * Complete TanStack state shape for the static MUI feature family.
 */
export type MuiDataTableState = TableState<MuiDataTableFeatures>;

/**
 * Complete feature-aware table options for a particular row type.
 */
export type MuiDataTableOptions<TData extends RowData> = TableOptions<
  MuiDataTableFeatures,
  TData
>;

// src/components/DataTable/mui/table/types.ts

import type { RowData, TableState } from "@tanstack/table-core";

import type { ReactTable } from "@tanstack/react-table";

import type { MuiDataTableFeatures } from "../features";

/**
 * Base React table type for our fixed MUI feature family.
 *
 * This is useful at infrastructure boundaries where the AppReactTable
 * extensions from createTableHook are not required.
 */
export type MuiReactTable<
  TData extends RowData,
  TSelected = TableState<MuiDataTableFeatures>,
> = ReactTable<MuiDataTableFeatures, TData, TSelected>;

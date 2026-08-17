// src/components/DataTable/mui/table/types.ts

import type { RowData, TableState } from "@tanstack/table-core";

import type { ReactTable } from "@tanstack/react-table";

import type { MuiDataTableFeatures } from "../features";

import { useMuiDataTable } from "./muiDataTableHook";

/**
 * Base React table type for the fixed MUI feature family.
 *
 * This does not include the AppTable/AppCell/AppHeader/AppFooter
 * extensions installed by createTableHook().
 *
 * This is useful at infrastructure boundaries where the AppReactTable
 * extensions from createTableHook are not required.
 *
 * Prefer MuiDataTableInstance for UI rendering.
 */
export type MuiReactTable<
  TData extends RowData,
  TSelected = TableState<MuiDataTableFeatures>,
> = ReactTable<MuiDataTableFeatures, TData, TSelected>;

/**
 * Exact table instance returned by useMuiDataTable().
 *
 * Unlike MuiReactTable, this preserves the extensions installed by
 * createTableHook():
 *
 * - AppTable
 * - AppCell
 * - AppHeader
 * - AppFooter
 * - any registered table components
 *
 * Keeping this type derived from the actual hook prevents us from
 * manually duplicating TanStack's AppReactTable generic structure.
 */
export type MuiDataTableInstance<
  TData extends RowData,
  TSelected = TableState<MuiDataTableFeatures>,
> = ReturnType<typeof useMuiDataTable<TData, TSelected>>;

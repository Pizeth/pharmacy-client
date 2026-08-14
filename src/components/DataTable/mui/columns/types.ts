// src/components/DataTable/mui/columns/types.ts

import type { CellData, ColumnDef, RowData } from "@tanstack/table-core";

import type { MuiDataTableFeatures } from "../features";

/**
 * Feature-aware column definition for the MUI DataTable family.
 *
 * TValue defaults to CellData rather than forcing `unknown` at
 * accessor-definition sites.
 */
export type MuiDataTableColumnDef<
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDef<MuiDataTableFeatures, TData, TValue>;

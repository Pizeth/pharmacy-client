// src/types/tanstack-table.d.ts (new file)
import type { ColumnDef, RowData, TableOptions } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
    headerAlign?: "left" | "center" | "right";
    cellAlign?: "left" | "center" | "right";
    filterVariant?: "text" | "autocomplete";
  }

  interface ColumnDefBase<TData, TValue> {
    enableColumnActions?: boolean;
    Header?: (
      props: import("@tanstack/react-table").HeaderContext<TData, TValue>,
    ) => React.ReactNode;
  }
}

export type DataTableColumnDef<TData extends RowData> = ColumnDef<
  TData,
  unknown
>;

export interface DataTableOptions<TData extends RowData> {
  data: TData[];

  columns: DataTableColumnDef<TData>[];

  enableRowSelection?: boolean;

  manualPagination?: boolean;

  pageCount?: number;

  initialState?: TableOptions<TData>["initialState"];
}

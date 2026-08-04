// src/types/tanstack-table.d.ts (new file)
import "@tanstack/react-table";

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

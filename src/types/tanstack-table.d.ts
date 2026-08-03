// src/types/tanstack-table.d.ts (new file)
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
  }

  interface ColumnDefBase<TData, TValue> {
    enableColumnActions?: boolean;
    Header?: (
      props: import("@tanstack/react-table").HeaderContext<TData, TValue>,
    ) => React.ReactNode;
  }
}

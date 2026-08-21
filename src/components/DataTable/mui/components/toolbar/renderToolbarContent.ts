import type { ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";
import type { DataTableToolbarRenderContext } from "./types";

export type DataTableToolbarContent<TData extends RowData> =
  | ReactNode
  | ((context: DataTableToolbarRenderContext<TData>) => ReactNode);

export function renderDataTableToolbarContent<TData extends RowData>(
  content: DataTableToolbarContent<TData> | undefined,
  context: DataTableToolbarRenderContext<TData>,
): ReactNode {
  if (typeof content === "function") {
    return content(context);
  }

  return content;
}

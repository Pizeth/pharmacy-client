import type { RowData } from "@tanstack/table-core";
import type { DataTableRowAction, DataTableRowActionContext } from "./types";
import type { ResolvedDataTableRowAction } from "./resolvedTypes";

/**
 * Resolve application action definitions for one concrete row.
 *
 * Hidden actions are removed here so all downstream rendering works
 * from one normalized list.
 */
export function resolveDataTableRowActions<TData extends RowData>(
  actions: readonly DataTableRowAction<TData>[],
  context: DataTableRowActionContext<TData>,
): ResolvedDataTableRowAction<TData>[] {
  const resolved: ResolvedDataTableRowAction<TData>[] = [];

  for (const action of actions) {
    if (action.isHidden?.(context) === true) {
      continue;
    }

    resolved.push({
      definition: action,
      context,
      icon: action.renderIcon?.(context) ?? null,
      color: action.color ?? "default",
      disabled: action.isDisabled?.(context) ?? false,
      inline: action.inline ?? false,
    });
  }

  return resolved;
}

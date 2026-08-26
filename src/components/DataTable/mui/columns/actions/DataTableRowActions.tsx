"use client";

import { Stack } from "@mui/material";
import type { Row, RowData } from "@tanstack/table-core";
import {
  useMuiDataTableCellContext,
  useMuiDataTableContext,
} from "../../table";
import { DataTableRowActionButton } from "./DataTableRowActionButton";
import { DataTableRowActionsMenu } from "./DataTableRowActionsMenu";
import { resolveDataTableRowActions } from "./resolveRowActions";
import type { DataTableRowAction, DataTableRowActionContext } from "./types";
import { MuiDataTableFeatures } from "../../features";

export interface DataTableRowActionsProps<TData extends RowData> {
  /**
   * Concrete row supplied directly by the TanStack cell renderer.
   *
   * Passing this explicitly preserves TData and avoids recovering the
   * row indirectly through a generic React context.
   */
  readonly row: Row<MuiDataTableFeatures, TData>;
  readonly actions: readonly DataTableRowAction<TData>[];
  readonly maxInlineActions: number;
}

/**
 * Standard renderer for the DataTable row-actions display column.
 *
 * TData must remain intact through:
 *
 *   action definitions
 *       ↓
 *   React table context
 *       ↓
 *   cell / row context
 *       ↓
 *   resolved action context
 *
 * Widening any of those to RowData would make the callback-bearing
 * DataTableRowAction<TData> type incompatible.
 */
export function DataTableRowActions<TData extends RowData>(
  props: DataTableRowActionsProps<TData>,
) {
  const { row, actions, maxInlineActions } = props;

  /**
  /**
   * React table context is still used because the action API
   * deliberately exposes MuiDataTableInstance<TData>, not the core
   * Table contained in CellContext.
   */
  const table = useMuiDataTableContext<TData>();

  // const cell = useMuiDataTableCellContext<TData>();

  // const row = cell.row;

  // const context = {
  //   table,
  //   row,
  // };

  /**
   * Do not leave this object to broad structural inference.
   *
   * The annotation ensures that a future change which accidentally
   * widens either `table` or `row` to RowData fails here, close to
   * the source of the problem.
   */
  const context: DataTableRowActionContext<TData> = {
    table,
    row,
  };

  // const resolvedActions = resolveDataTableRowActions(actions, context);

  /**
   * Explicitly preserve TData through the resolver as well.
   */
  const resolvedActions = resolveDataTableRowActions<TData>(actions, context);

  /**
   * Explicitly inline actions take priority.
   */
  const preferredInline = resolvedActions.filter((action) => action.inline);

  const remaining = resolvedActions.filter((action) => !action.inline);

  /**
   * Fill remaining inline capacity from ordinary actions.
   */
  const remainingInlineCapacity = Math.max(
    0,
    maxInlineActions - preferredInline.length,
  );

  const inlineActions = [
    ...preferredInline.slice(0, maxInlineActions),
    ...remaining.slice(0, remainingInlineCapacity),
  ];

  /**
   * Actions that did not fit inline move into overflow.
   *
   * This also handles explicitly-inline actions exceeding the configured
   * maximum rather than silently dropping them.
   */
  const inlineIds = new Set(
    inlineActions.map((action) => action.definition.id),
  );

  const overflowActions = resolvedActions.filter(
    (action) => !inlineIds.has(action.definition.id),
  );

  if (resolvedActions.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0.25}
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {inlineActions.map((action) => (
        <DataTableRowActionButton<TData>
          key={action.definition.id}
          action={action}
        />
      ))}

      <DataTableRowActionsMenu<TData> actions={overflowActions} />
    </Stack>
  );
}

// "use client";

// import { Stack } from "@mui/material";
// import type { RowData } from "@tanstack/table-core";
// import {
//   useMuiDataTableCellContext,
//   useMuiDataTableContext,
// } from "../../table";
// import { DataTableRowActionButton } from "./DataTableRowActionButton";
// import { DataTableRowActionsMenu } from "./DataTableRowActionsMenu";
// import { resolveDataTableRowActions } from "./resolveRowActions";
// import type { DataTableRowAction, DataTableRowActionContext } from "./types";

// export interface DataTableRowActionsProps<TData extends RowData> {
//   readonly actions: readonly DataTableRowAction<TData>[];
//   readonly maxInlineActions: number;
// }

// /**
//  * Standard renderer for the DataTable row-actions display column.
//  */
// export function DataTableRowActions<TData extends RowData>(
//   props: DataTableRowActionsProps<TData>,
// ) {
//   const { actions, maxInlineActions } = props;

//   const table = useMuiDataTableContext<TData>();

//   const cell = useMuiDataTableCellContext<TData>();

//   const row = cell.row;

//   const context = {
//     table,
//     row,
//   };

//   const resolvedActions = resolveDataTableRowActions<TData>(
//     actions,
//     context as DataTableRowActionContext<TData>,
//   );

//   /**
//    * Explicitly inline actions take priority.
//    */
//   const preferredInline = resolvedActions.filter((action) => action.inline);

//   const remaining = resolvedActions.filter((action) => !action.inline);

//   /**
//    * Fill remaining inline capacity from ordinary actions.
//    */
//   const remainingInlineCapacity = Math.max(
//     0,

//     maxInlineActions - preferredInline.length,
//   );

//   const inlineActions = [
//     ...preferredInline.slice(0, maxInlineActions),

//     ...remaining.slice(0, remainingInlineCapacity),
//   ];

//   /**
//    * Actions that did not fit inline move into overflow.
//    *
//    * This also handles explicitly-inline actions exceeding the configured
//    * maximum rather than silently dropping them.
//    */
//   const inlineIds = new Set(
//     inlineActions.map((action) => action.definition.id),
//   );

//   const overflowActions = resolvedActions.filter(
//     (action) => !inlineIds.has(action.definition.id),
//   );

//   if (resolvedActions.length === 0) {
//     return null;
//   }

//   return (
//     <Stack
//       direction="row"
//       alignItems="center"
//       justifyContent="center"
//       spacing={0.25}
//       sx={{
//         width: "100%",
//         minWidth: 0,
//       }}
//     >
//       {inlineActions.map((action) => (
//         <DataTableRowActionButton key={action.definition.id} action={action} />
//       ))}

//       <DataTableRowActionsMenu actions={overflowActions} />
//     </Stack>
//   );
// }

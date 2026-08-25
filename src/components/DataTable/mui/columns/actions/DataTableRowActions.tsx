"use client";

import { Stack } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import {
  useMuiDataTableCellContext,
  useMuiDataTableContext,
} from "../../table";
import { DataTableRowActionButton } from "./DataTableRowActionButton";
import { DataTableRowActionsMenu } from "./DataTableRowActionsMenu";
import { resolveDataTableRowActions } from "./resolveRowActions";
import type { DataTableRowAction } from "./types";

export interface DataTableRowActionsProps<TData extends RowData> {
  readonly actions: readonly DataTableRowAction<TData>[];
  readonly maxInlineActions: number;
}

/**
 * Standard renderer for the DataTable row-actions display column.
 */
export function DataTableRowActions<TData extends RowData>(
  props: DataTableRowActionsProps<TData>,
) {
  const { actions, maxInlineActions } = props;

  const table = useMuiDataTableContext();

  const cell = useMuiDataTableCellContext();

  const row = cell.row;

  const context = {
    table,
    row,
  };

  const resolvedActions = resolveDataTableRowActions(actions, context);

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
        <DataTableRowActionButton key={action.definition.id} action={action} />
      ))}

      <DataTableRowActionsMenu actions={overflowActions} />
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

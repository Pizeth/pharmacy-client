"use client";

import { Checkbox } from "@mui/material";
import {
  useMuiDataTableCellContext,
  useMuiDataTableContext,
} from "../../table";

/**
 * Row-level selection checkbox.
 *
 * The cell context supplies the current row/cell.
 *
 * The table-level AppTable context supplies the ReactTable required
 * for fine-grained subscriptions.
 */
export function DataTableSelectRowCheckbox() {
  /**
   * Enriched TanStack cell context.
   *
   * `cell.row` is the exact row represented by this checkbox.
   */
  const cell = useMuiDataTableCellContext();

  const row = cell.row;

  /**
   * React/App table.
   *
   * Do NOT use:
   *
   *   cell.table.Subscribe
   *
   * because CellContext.table is the core Table rather than ReactTable.
   */
  const table = useMuiDataTableContext();

  return (
    <table.Subscribe
      source={table.atoms.rowSelection}
      //   selector={() => ({
      //     checked: row.getIsSelected(),
      //     indeterminate: row.getIsSomeSelected(),
      //     disabled: !row.getCanSelect(),
      //   })}
      selector={(rowSelection) => ({
        /**
         * Direct lookup is sufficient for this row's own selected
         * state and avoids recomputing the entire selected-row model.
         */
        checked: Boolean(rowSelection?.[row.id]),

        /**
         * For hierarchical rows, TanStack determines whether only
         * some descendants are selected.
         */
        indeterminate: row.getIsSomeSelected(),

        /**
         * Honors:
         *
         *   enableRowSelection
         *
         * including the per-row callback form.
         */
        disabled: !row.getCanSelect(),
      })}
    >
      {({ checked, indeterminate, disabled }) => (
        <Checkbox
          size="small"
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          inputProps={{
            "aria-label": `Select row ${row.id}`,
          }}
          /**
           * Delegate selection behavior completely to TanStack.
           *
           * This preserves:
           *
           * - multi-selection behavior
           * - sub-row selection
           * - range selection handling
           * - conditional selection
           */
          onChange={row.getToggleSelectedHandler()}
          onClick={(event) => {
            /**
             * Prevent future row-click navigation/selection handlers
             * from seeing this checkbox click.
             */
            event.stopPropagation();
          }}
          data-row-id={row.id}
        />
      )}
    </table.Subscribe>
  );
}

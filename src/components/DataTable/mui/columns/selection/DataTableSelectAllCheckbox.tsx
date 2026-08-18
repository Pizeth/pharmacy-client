"use client";

import { Checkbox } from "@mui/material";
import {
  useMuiDataTableContext,
  //   useMuiDataTableHeaderContext,
} from "../../table";

/**
 * Header-level select-all checkbox.
 *
 * Selection policy:
 *
 * - checked:
 *     every selectable row on the current page is selected
 *
 * - indeterminate:
 *     at least one, but not every selectable row on the current page
 *     is selected
 *
 * - unchecked:
 *     no selectable rows on the current page are selected
 *
 * Important TanStack v9 distinction:
 *
 * `useMuiDataTableHeaderContext()` gives us the current header context,
 * whose `table` property is the core:
 *
 *   Table<TFeatures, TData>
 *
 * `Subscribe`, however, is a React integration API and exists on:
 *
 *   ReactTable<TFeatures, TData, TSelected>
 *
 * Therefore reactive subscription must come from
 * `useMuiDataTableContext()`.
 */
export function DataTableSelectAllCheckbox() {
  /**
   * Current enriched header context.
   *
   * We keep this because this component semantically belongs to a
   * header renderer, even though the actual React subscription comes
   * from the table-level context below.
   */
  //   const header = useMuiDataTableHeaderContext();

  /**
   * Current React/App table.
   *
   * This table owns:
   *
   * - Subscribe
   * - FlexRender
   * - reactive state
   *
   * while still exposing the normal TanStack table APIs.
   */
  const table = useMuiDataTableContext();

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {() => {
        /**
         * Use TanStack's table APIs instead of calculating these states
         * manually from rowSelection.
         *
         * These APIs understand:
         *
         * - pagination
         * - conditional row selection
         * - sub-row selection
         * - current selectable rows
         */
        const checked = table.getIsAllPageRowsSelected();

        const indeterminate = !checked && table.getIsSomePageRowsSelected();

        return (
          <Checkbox
            size="small"
            checked={checked}
            indeterminate={indeterminate}
            inputProps={{
              "aria-label": "Select all rows on current page",
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            onClick={(event) => {
              /**
               * Prevent future sortable-header / column-menu click
               * handling from also running when the checkbox itself
               * is clicked.
               */
              event.stopPropagation();
            }}
            /**
             * Useful for tests and future styling.
             */
            // data-column-id={header.column.id}
          />
        );
      }}
    </table.Subscribe>
  );
}

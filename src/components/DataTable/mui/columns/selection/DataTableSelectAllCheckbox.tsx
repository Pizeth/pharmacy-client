"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import {
  isDataTableSelectionRowPinningMode,
  useDataTableRowPinningDisplayMode,
} from "../../row-pinning";
import { dataTableSelectionCheckboxStyles } from "./selectionGeometry";

import { styled, Checkbox } from "@mui/material";
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
const SelectAllCheckboxRoot = styled(Checkbox, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectAllCheckbox",
  overridesResolver: (_props, styles) => styles.selectAllCheckbox,
})(dataTableSelectionCheckboxStyles);

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
  const rowPinningDisplayMode = useDataTableRowPinningDisplayMode();

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
          <SelectAllCheckboxRoot
            className={dataTableClasses.selectAllCheckbox}
            size="small"
            checked={checked}
            indeterminate={indeterminate}
            inputProps={{
              "aria-label": "Select all rows on current page",
            }}
            onChange={(event) => {
              /**
               * Match the established select-pinning interaction contract:
               *
               * select-all controls selection only.
               *
               * It must NOT pin every selected row, otherwise selecting a full
               * page creates a tall stack of sticky rows that consumes most of
               * the scroll viewport.
               *
               * Any existing selection-driven pins are cleared before the
               * page-level selection change. Individual row checkbox changes
               * remain responsible for pinning/unpinning one row at a time.
               */
              if (isDataTableSelectionRowPinningMode(rowPinningDisplayMode)) {
                table.setRowPinning({
                  top: [],
                  bottom: [],
                });
              }

              table.getToggleAllPageRowsSelectedHandler()(event);
            }}
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

"use client";

import { Checkbox, styled } from "@mui/material";
import type { Row, RowData } from "@tanstack/table-core";

import {
  isDataTableSelectionRowPinningMode,
  useDataTableRowPinningDisplayMode,
} from "../../row-pinning";
import {
  DATA_TABLE_COMPONENT_NAME,
  dataTableClasses,
} from "../../styles";
import type { MuiDataTableFeatures } from "../../features";
import { useMuiDataTableContext } from "../../table";
import { dataTableSelectionCheckboxStyles } from "../../columns/selection/selectionGeometry";

const SelectRowCheckboxRoot = styled(Checkbox, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectRowCheckbox",
  overridesResolver: (_props, styles) => styles.selectRowCheckbox,
})(dataTableSelectionCheckboxStyles);

export interface DataTableCardSelectRowCheckboxProps<TData extends RowData> {
  readonly row: Row<MuiDataTableFeatures, TData>;
}

/**
 * Cell-context-free row selection control for card presentation.
 *
 * The interaction contract intentionally mirrors DataTableSelectRowCheckbox.
 */
export function DataTableCardSelectRowCheckbox<TData extends RowData>(
  props: DataTableCardSelectRowCheckboxProps<TData>,
) {
  const { row } = props;

  const table = useMuiDataTableContext<TData>();

  const rowPinningDisplayMode =
    useDataTableRowPinningDisplayMode();

  return (
    <table.Subscribe
      source={table.atoms.rowSelection}
      selector={(rowSelection) => ({
        checked: Boolean(rowSelection?.[row.id]),
        indeterminate: row.getIsSomeSelected(),
        disabled: !row.getCanSelect(),
      })}
    >
      {({ checked, indeterminate, disabled }) => (
        <SelectRowCheckboxRoot
          className={dataTableClasses.selectRowCheckbox}
          size="small"
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          inputProps={{
            "aria-label": `Select row ${row.id}`,
          }}
          onChange={(event) => {
            const nextSelected = event.target.checked;

            if (
              isDataTableSelectionRowPinningMode(
                rowPinningDisplayMode,
              )
            ) {
              row.pin(
                nextSelected
                  ? rowPinningDisplayMode === "select-bottom"
                    ? "bottom"
                    : "top"
                  : false,
              );
            }

            row.getToggleSelectedHandler()(event);
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          data-row-id={row.id}
        />
      )}
    </table.Subscribe>
  );
}

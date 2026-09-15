"use client";

// src/components/DataTable/mui/components/toolbar/DataTableToolbarSelection.tsx

import { Chip, styled } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";

const ToolbarSelectionRoot = styled(Chip, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarSelection",
  overridesResolver: (_props, styles) => styles.toolbarSelection,
})({});

export interface DataTableToolbarSelectionProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Lightweight selected-row indicator.
 *
 * We intentionally count the rowSelection state itself rather than
 * requiring an additional selected-row model.
 */
export function DataTableToolbarSelection<TData extends RowData>(
  props: DataTableToolbarSelectionProps<TData>,
) {
  const { table } = props;

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {(rowSelection) => {
        const selectedCount =
          Object.values(rowSelection).filter(Boolean).length;

        if (selectedCount === 0) {
          return null;
        }

        return (
          <ToolbarSelectionRoot
            className={dataTableClasses.toolbarSelection}
            size="small"
            icon={<CheckCircleOutline />}
            label={`${selectedCount} selected`}
            color="primary"
            variant="outlined"
          />
        );
      }}
    </table.Subscribe>
  );
}

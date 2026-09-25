"use client";

import { Stack, styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { useMuiDataTableCellContext } from "../../table";
import type { DataTableExplicitRowPinningDisplayMode } from "../../row-pinning";
import { DataTableRowPinButton } from "./DataTableRowPinButton";

const RowPinningControlsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "RowPinningControls",
  overridesResolver: (_props, styles) => styles.rowPinningControls,
})({
  width: "100%",
  minWidth: 0,
});

export interface DataTableRowPinningControlsProps {
  readonly displayMode: DataTableExplicitRowPinningDisplayMode;
}

/**
 * Standard row-pinning utility-cell renderer.
 *
 * "top-and-bottom" exposes both directions while an unpinned row is choosing a
 * destination. Once pinned, one unpin command is sufficient because TanStack
 * already records the current region.
 */
export function DataTableRowPinningControls(
  props: DataTableRowPinningControlsProps,
) {
  const { displayMode } = props;

  const cell = useMuiDataTableCellContext();
  const row = cell.row;

  if (!row.getCanPin()) {
    return null;
  }

  if (displayMode === "top-and-bottom" && !row.getIsPinned()) {
    return (
      <RowPinningControlsRoot
        className={dataTableClasses.rowPinningControls}
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={0.25}
      >
        <DataTableRowPinButton position="top" />
        <DataTableRowPinButton position="bottom" />
      </RowPinningControlsRoot>
    );
  }

  const position = displayMode === "bottom" ? "bottom" : "top";

  return (
    <RowPinningControlsRoot
      className={dataTableClasses.rowPinningControls}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <DataTableRowPinButton
        position={position}
        sticky={displayMode === "sticky"}
      />
    </RowPinningControlsRoot>
  );
}

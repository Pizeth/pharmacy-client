"use client";

import { CloseRounded, PushPinRounded } from "@mui/icons-material";
import { IconButton, Tooltip, styled } from "@mui/material";
import type { RowPinningPosition } from "@tanstack/table-core";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { useMuiDataTableCellContext } from "../../table";

const RowPinButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "RowPinButton",
  overridesResolver: (_props, styles) => styles.rowPinButton,
})({
  width: 28,
  height: 28,

  '&[data-pin-position="top"] .MuiSvgIcon-root': {
    transform: "rotate(180deg)",
  },

  '&[data-pin-position="sticky"] .MuiSvgIcon-root': {
    transform: "rotate(135deg)",
  },
});

export interface DataTableRowPinButtonProps {
  readonly position: Exclude<RowPinningPosition, false>;
  readonly sticky?: boolean;
}

/**
 * Generic TanStack row-pinning command.
 *
 * No pinning state is duplicated here. The current row comes from the
 * configured AppCell context and all mutations delegate to row.pin().
 */
export function DataTableRowPinButton(props: DataTableRowPinButtonProps) {
  const { position, sticky = false } = props;

  const cell = useMuiDataTableCellContext();
  const row = cell.row;

  if (!row.getCanPin()) {
    return null;
  }

  const pinnedPosition = row.getIsPinned();
  const isPinned = pinnedPosition !== false;

  const label = isPinned
    ? "Unpin row " + row.id
    : "Pin row " + row.id + " to " + position;

  return (
    <Tooltip title={label}>
      <span>
        <RowPinButtonRoot
          className={dataTableClasses.rowPinButton}
          size="small"
          aria-label={label}
          data-pin-position={sticky ? "sticky" : position}
          disabled={!row.getCanPin()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            row.pin(isPinned ? false : position);
          }}
        >
          {isPinned ? (
            <CloseRounded fontSize="small" />
          ) : (
            <PushPinRounded fontSize="small" />
          )}
        </RowPinButtonRoot>
      </span>
    </Tooltip>
  );
}

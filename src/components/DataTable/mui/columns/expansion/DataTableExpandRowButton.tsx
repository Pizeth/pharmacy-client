// mui/columns/expansion/DataTableExpandRowButton.tsx

"use client";

import { IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import {
  useMuiDataTableCellContext,
  useMuiDataTableContext,
} from "../../table";

/**
 * Expansion control rendered inside the dedicated expansion display
 * column.
 *
 * Row state comes from the cell context.
 * React subscriptions come from the table context.
 */
export function DataTableExpandRowButton() {
  const table = useMuiDataTableContext();

  const cell = useMuiDataTableCellContext();

  const row = cell.row;

  return (
    <table.Subscribe selector={(state) => state.expanded}>
      {() => {
        const canExpand = row.getCanExpand();

        if (!canExpand) {
          return null;
        }

        const expanded = row.getIsExpanded();

        return (
          <Tooltip title={expanded ? "Collapse row" : "Expand row"}>
            <IconButton
              size="small"
              aria-label={
                expanded ? `Collapse row ${row.id}` : `Expand row ${row.id}`
              }
              aria-expanded={expanded}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                row.toggleExpanded();
              }}
              sx={{
                width: 28,
                height: 28,
              }}
            >
              {expanded ? (
                <KeyboardArrowDown fontSize="small" />
              ) : (
                <KeyboardArrowRight fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}

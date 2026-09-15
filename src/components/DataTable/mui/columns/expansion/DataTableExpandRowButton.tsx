// mui/columns/expansion/DataTableExpandRowButton.tsx

"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { styled, IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import {
  useMuiDataTableCellContext,
  useMuiDataTableContext,
} from "../../table";
import { useDataTableAccessibility } from "../../accessibility";

/**
 * Expansion control rendered inside the dedicated expansion display
 * column.
 *
 * Row state comes from the cell context.
 * React subscriptions come from the table context.
 */
const ExpandRowButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ExpandRowButton",
  overridesResolver: (_props, styles) => styles.expandRowButton,
})(({ theme }) => ({
  width: 28,
  height: 28,
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export function DataTableExpandRowButton() {
  const table = useMuiDataTableContext();

  const cell = useMuiDataTableCellContext();

  const row = cell.row;

  const { getExpandButtonId, getDetailPanelId } = useDataTableAccessibility();

  const expandButtonId = getExpandButtonId(row.id);

  const detailPanelId = getDetailPanelId(row.id);

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
            <ExpandRowButtonRoot
              className={dataTableClasses.expandRowButton}
              id={expandButtonId}
              size="small"
              aria-label={
                expanded
                  ? `Collapse details for row ${row.id}`
                  : `Expand details for row ${row.id}`
              }
              aria-expanded={expanded}
              aria-controls={expanded ? detailPanelId : undefined}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                row.toggleExpanded();
              }}
            >
              {expanded ? (
                <KeyboardArrowDown fontSize="small" />
              ) : (
                <KeyboardArrowRight fontSize="small" />
              )}
            </ExpandRowButtonRoot>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}

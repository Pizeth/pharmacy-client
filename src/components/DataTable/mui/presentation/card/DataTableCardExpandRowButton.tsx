"use client";

import {
  IconButton,
  Tooltip,
  styled,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import type { Row, RowData } from "@tanstack/table-core";

import { useDataTableAccessibility } from "../../accessibility";
import type { MuiDataTableFeatures } from "../../features";
import {
  DATA_TABLE_COMPONENT_NAME,
  dataTableClasses,
} from "../../styles";
import { useMuiDataTableContext } from "../../table";

export const ExpandRowButtonRoot = styled(IconButton, {
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

export interface DataTableCardExpandRowButtonProps<TData extends RowData> {
  readonly row: Row<MuiDataTableFeatures, TData>;
}

/**
 * Cell-context-free expansion control for card presentation.
 */
export function DataTableCardExpandRowButton<TData extends RowData>(
  props: DataTableCardExpandRowButtonProps<TData>,
) {
  const { row } = props;

  const table = useMuiDataTableContext<TData>();

  const {
    getExpandButtonId,
    getDetailPanelId,
  } = useDataTableAccessibility();

  const expandButtonId = getExpandButtonId(row.id);
  const detailPanelId = getDetailPanelId(row.id);

  return (
    <table.Subscribe selector={(state) => state.expanded}>
      {() => {
        if (!row.getCanExpand()) {
          return null;
        }

        const expanded = row.getIsExpanded();

        return (
          <Tooltip
            title={expanded ? "Collapse row" : "Expand row"}
          >
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
              aria-controls={
                expanded ? detailPanelId : undefined
              }
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                row.toggleExpanded();
              }}
            >
              {expanded ? (
                <KeyboardArrowUp fontSize="small" />
              ) : (
                <KeyboardArrowDown fontSize="small" />
              )}
            </ExpandRowButtonRoot>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}

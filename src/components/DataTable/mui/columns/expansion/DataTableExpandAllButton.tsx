// mui/columns/expansion/DataTableExpandAllButton.tsx

"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { styled, IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useMuiDataTableContext } from "../../table";

/**
 * Header control for expanding/collapsing every expandable row.
 *
 * Uses the React table context because Subscribe is a React-layer API.
 */
const ExpandAllButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ExpandAllButton",
  overridesResolver: (_props, styles) => styles.expandAllButton,
})(({ theme }) => ({
  width: 28,
  height: 28,
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export function DataTableExpandAllButton() {
  const table = useMuiDataTableContext();

  return (
    <table.Subscribe selector={(state) => state.expanded}>
      {() => {
        const canExpand = table.getCanSomeRowsExpand();

        const allExpanded = table.getIsAllRowsExpanded();

        // const someExpanded = table.getIsSomeRowsExpanded();

        // const active = allExpanded || someExpanded;

        return (
          <Tooltip title={allExpanded ? "Collapse all" : "Expand all"}>
            <span>
              <ExpandAllButtonRoot
                className={dataTableClasses.expandAllButton}
                size="small"
                disabled={!canExpand}
                aria-label={
                  allExpanded
                    ? "Collapse all expandable rows"
                    : "Expand all expandable rows"
                }
                aria-pressed={allExpanded}
                // aria-pressed={active}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  table.toggleAllRowsExpanded();
                }}
              >
                {allExpanded ? (
                  <KeyboardArrowUp fontSize="small" />
                ) : (
                  <KeyboardArrowDown fontSize="small" />
                )}
              </ExpandAllButtonRoot>
            </span>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}

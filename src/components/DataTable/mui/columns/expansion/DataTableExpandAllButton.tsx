// mui/columns/expansion/DataTableExpandAllButton.tsx

"use client";

import { IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useMuiDataTableContext } from "../../table";

/**
 * Header control for expanding/collapsing every expandable row.
 *
 * Uses the React table context because Subscribe is a React-layer API.
 */
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
              <IconButton
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
                sx={{
                  width: 28,
                  height: 28,

                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                }}
              >
                {allExpanded ? (
                  <KeyboardArrowUp fontSize="small" />
                ) : (
                  <KeyboardArrowDown fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}

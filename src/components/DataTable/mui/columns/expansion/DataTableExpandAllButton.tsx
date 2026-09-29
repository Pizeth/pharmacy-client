// mui/columns/expansion/DataTableExpandAllButton.tsx

"use client";

import { IconButton, Tooltip, styled } from "@mui/material";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { useMuiDataTableContext } from "../../table";

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

export interface DataTableExpandAllButtonProps {
  /**
   * Presentation-only disabled state.
   *
   * Useful for resources that expose per-row expansion while deliberately
   * withholding an "expand the whole server page" command.
   */
  readonly disabled?: boolean;
}

export function DataTableExpandAllButton(
  props: DataTableExpandAllButtonProps = {},
) {
  const { disabled: disabledProp = false } = props;
  const table = useMuiDataTableContext();

  return (
    <table.Subscribe selector={(state) => state.expanded}>
      {() => {
        const canExpand = table.getCanSomeRowsExpand();
        const disabled = disabledProp || !canExpand;
        const allExpanded = !disabledProp && table.getIsAllRowsExpanded();

        const title = disabledProp
          ? "Expand all is unavailable"
          : allExpanded
            ? "Collapse all"
            : "Expand all";

        return (
          <Tooltip title={title}>
            <span>
              <ExpandAllButtonRoot
                className={dataTableClasses.expandAllButton}
                size="small"
                disabled={disabled}
                aria-label={
                  disabledProp
                    ? "Expand all rows unavailable"
                    : allExpanded
                      ? "Collapse all expandable rows"
                      : "Expand all expandable rows"
                }
                aria-pressed={disabledProp ? undefined : allExpanded}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  if (!disabled) {
                    table.toggleAllRowsExpanded();
                  }
                }}
              >
                {allExpanded ? (
                  <KeyboardDoubleArrowUp fontSize="small" />
                ) : (
                  <KeyboardDoubleArrowDown fontSize="small" />
                )}
              </ExpandAllButtonRoot>
            </span>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}

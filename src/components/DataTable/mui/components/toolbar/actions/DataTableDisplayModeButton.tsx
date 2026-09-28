"use client";

import {
  GridViewRounded,
  TableRowsRounded,
} from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
  styled,
} from "@mui/material";
import type {
  Breakpoint,
} from "@mui/material/styles";

import {
  useDataTableDisplayMode,
  useDataTableResolvedDisplayMode,
} from "../../../presentation";
import {
  DATA_TABLE_COMPONENT_NAME,
  dataTableClasses,
} from "../../../styles";

const DisplayModeButtonRoot = styled(
  IconButton,
  {
    name:
      DATA_TABLE_COMPONENT_NAME,
    slot:
      "DisplayModeButton",
    overridesResolver:
      (
        _props,
        styles,
      ) =>
        styles.displayModeButton,
  },
)(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline:
      `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset:
      2,
  },
}));

export interface DataTableDisplayModeButtonProps {
  readonly autoCardBreakpoint?: Breakpoint;
}

/**
 * Switch between the two physical DataTable renderers.
 *
 * This control changes presentation state only. It does not touch:
 *
 * - pagination,
 * - sorting,
 * - column filters,
 * - global search,
 * - selection,
 * - expansion,
 * - server/data-source state.
 *
 * When the requested mode is "auto", the current responsive physical renderer
 * is used to determine the opposite explicit destination.
 */
export function DataTableDisplayModeButton(
  props:
    DataTableDisplayModeButtonProps,
) {
  const {
    autoCardBreakpoint,
  } = props;

  const {
    setDisplayMode,
  } =
    useDataTableDisplayMode();

  const resolvedDisplayMode =
    useDataTableResolvedDisplayMode(
      autoCardBreakpoint,
    );

  const cardActive =
    resolvedDisplayMode ===
    "card";

  const nextMode =
    cardActive
      ? "table"
      : "card";

  const label =
    nextMode ===
    "card"
      ? "Switch to card view"
      : "Switch to table view";

  return (
    <Tooltip
      title={
        label
      }
    >
      <DisplayModeButtonRoot
        className={
          dataTableClasses.displayModeButton
        }
        size="small"
        aria-label={
          label
        }
        aria-pressed={
          cardActive
        }
        onClick={() => {
          setDisplayMode(
            nextMode,
          );
        }}
      >
        {nextMode ===
        "card" ? (
          <GridViewRounded fontSize="small" />
        ) : (
          <TableRowsRounded fontSize="small" />
        )}
      </DisplayModeButtonRoot>
    </Tooltip>
  );
}

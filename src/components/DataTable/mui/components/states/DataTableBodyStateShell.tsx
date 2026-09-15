"use client";

import { styled, TableCell, TableRow } from "@mui/material";
import type { AriaAttributes, AriaRole } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { DataTableBodyStateProps } from "./types";

type DataTableBodyStateKind = "empty" | "loading" | "error";

interface DataTableBodyStateCellOwnerState {
  readonly state: DataTableBodyStateKind;
}

/**
 * ------------------------------------------------------------------
 * BodyStateRow
 * ------------------------------------------------------------------
 *
 * One physical table row used by:
 *
 * - empty
 * - loading
 * - error
 *
 * states.
 *
 * It currently has no mandatory visual rules, but exposing the row as
 * a real slot gives theme consumers a stable customization surface.
 */
const BodyStateRowRoot = styled(TableRow, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BodyStateRow",
  overridesResolver: (_props, styles) => styles.bodyStateRow,
})({});

/**
 * ------------------------------------------------------------------
 * BodyStateCell
 * ------------------------------------------------------------------
 *
 * The complete table-wide state occupies one native table cell.
 *
 * State-dependent spacing is finite presentation state rather than
 * arbitrary runtime geometry, so it remains inside styled().
 *
 * `ownerState` is used rather than introducing inline sx.
 */
const BodyStateCellRoot = styled(TableCell, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BodyStateCell",
  overridesResolver: (_props, styles) => styles.bodyStateCell,
})<{
  readonly ownerState: DataTableBodyStateCellOwnerState;
}>(({ theme, ownerState }) => ({
  borderBottom: 0,

  /**
   * Preserve the exact previous spacing contract.
   *
   * Empty/loading previously used:
   *
   *   py: 6
   *
   * Error previously used:
   *
   *   p: 2
   */
  ...(ownerState.state === "error"
    ? {
        padding: theme.spacing(2),
      }
    : {
        paddingBlock: theme.spacing(6),
      }),
}));

interface DataTableBodyStateShellProps extends DataTableBodyStateProps {
  readonly state: DataTableBodyStateKind;

  /**
   * Optional semantics placed on the physical state cell.
   *
   * Error currently uses:
   *
   *   role="alert"
   *   aria-live="assertive"
   *
   * Loading/empty semantics remain on their content root exactly as
   * before.
   */
  readonly cellRole?: AriaRole;

  readonly cellAriaLive?: AriaAttributes["aria-live"];
}

/**
 * Shared native table structure for all body-wide states.
 *
 * The shell owns:
 *
 * - physical row
 * - spanning cell
 * - stable structural classes
 * - state-specific spacing
 *
 * It deliberately does NOT decide:
 *
 * - which state wins
 * - filtered-vs-empty semantics
 * - state content
 * - icons
 * - loading/error text
 *
 * DataTableBody remains the authority over state precedence.
 */
export function DataTableBodyStateShell(props: DataTableBodyStateShellProps) {
  const { state, colSpan, children, cellRole, cellAriaLive } = props;

  const ownerState: DataTableBodyStateCellOwnerState = {
    state,
  };

  return (
    <BodyStateRowRoot
      className={dataTableClasses.bodyStateRow}
      data-state={state}
    >
      <BodyStateCellRoot
        ownerState={ownerState}
        className={dataTableClasses.bodyStateCell}
        colSpan={colSpan}
        data-state={state}
        role={cellRole}
        aria-live={cellAriaLive}
      >
        {children}
      </BodyStateCellRoot>
    </BodyStateRowRoot>
  );
}

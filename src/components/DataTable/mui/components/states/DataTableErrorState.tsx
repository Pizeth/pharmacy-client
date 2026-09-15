"use client";

// import { Alert, TableCell, TableRow } from "@mui/material";
// import type { DataTableBodyStateProps } from "./types";

// export function DataTableErrorState(props: DataTableBodyStateProps) {
//   const { colSpan, children } = props;

//   return (
//     <TableRow>
//       <TableCell
//         colSpan={colSpan}
//         role="alert"
//         aria-live="assertive"
//         sx={{
//           borderBottom: 0,
//           p: 2,
//         }}
//       >
//         <Alert severity="error">
//           {children ?? "Unable to load table data."}
//         </Alert>
//       </TableCell>
//     </TableRow>
//   );
// }

import { Alert, styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { DataTableBodyStateShell } from "./DataTableBodyStateShell";
import type { DataTableBodyStateProps } from "./types";

/**
 * ------------------------------------------------------------------
 * ErrorState
 * ------------------------------------------------------------------
 *
 * Keep MUI Alert as the semantic/error presentation primitive.
 *
 * Making the Alert itself the named slot means consumers can theme the
 * actual visible error surface rather than an otherwise meaningless
 * wrapper.
 */
const ErrorStateRoot = styled(Alert, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ErrorState",
  overridesResolver: (_props, styles) => styles.errorState,
})({});

export function DataTableErrorState(props: DataTableBodyStateProps) {
  const { colSpan, children } = props;

  return (
    <DataTableBodyStateShell
      state="error"
      colSpan={colSpan}
      /**
       * Preserve the existing table-cell semantics exactly.
       */
      cellRole="alert"
      cellAriaLive="assertive"
    >
      <ErrorStateRoot className={dataTableClasses.errorState} severity="error">
        {children ?? "Unable to load table data."}
      </ErrorStateRoot>
    </DataTableBodyStateShell>
  );
}

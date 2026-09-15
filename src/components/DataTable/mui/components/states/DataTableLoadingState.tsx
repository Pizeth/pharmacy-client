"use client";

// import {
//   Box,
//   CircularProgress,
//   TableCell,
//   TableRow,
//   Typography,
// } from "@mui/material";

// import type { DataTableBodyStateProps } from "./types";

// export function DataTableLoadingState(props: DataTableBodyStateProps) {
//   const { colSpan, children } = props;

//   return (
//     <TableRow>
//       <TableCell
//         colSpan={colSpan}
//         sx={{
//           borderBottom: 0,
//           py: 6,
//         }}
//       >
//         <Box
//           role="status"
//           aria-live="polite"
//           aria-busy="true"
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 1.5,
//             color: "text.secondary",
//           }}
//         >
//           <CircularProgress size={28} />
//           {children ?? <Typography variant="body2">Loading…</Typography>}
//         </Box>
//       </TableCell>
//     </TableRow>
//   );
// }

import { Box, CircularProgress, styled, Typography } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { DataTableBodyStateShell } from "./DataTableBodyStateShell";
import type { DataTableBodyStateProps } from "./types";

/**
 * ------------------------------------------------------------------
 * LoadingState
 * ------------------------------------------------------------------
 *
 * Loading semantics remain on the content region:
 *
 *   role="status"
 *   aria-live="polite"
 *   aria-busy="true"
 *
 * exactly as before the styling migration.
 */
const LoadingStateRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "LoadingState",
  overridesResolver: (_props, styles) => styles.loadingState,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  color: (theme.vars ?? theme).palette.text.secondary,
}));

export function DataTableLoadingState(props: DataTableBodyStateProps) {
  const { colSpan, children } = props;

  return (
    <DataTableBodyStateShell state="loading" colSpan={colSpan}>
      <LoadingStateRoot
        className={dataTableClasses.loadingState}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <CircularProgress size={28} />

        {children ?? <Typography variant="body2">Loading…</Typography>}
      </LoadingStateRoot>
    </DataTableBodyStateShell>
  );
}

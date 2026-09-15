"use client";

// import { Box, TableCell, TableRow, Typography } from "@mui/material";
// import { InboxOutlined, SearchOffOutlined } from "@mui/icons-material";
// import type { DataTableBodyStateProps } from "./types";

// export interface DataTableEmptyStateProps extends DataTableBodyStateProps {
//   /**
//    * Whether rows are absent because an active search/filter produced
//    * no matches.
//    */
//   readonly filtered?: boolean;
// }

// export function DataTableEmptyState(props: DataTableEmptyStateProps) {
//   const { colSpan, children, filtered = false } = props;

//   const Icon = filtered ? SearchOffOutlined : InboxOutlined;

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
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 1.5,
//             color: "text.secondary",
//             textAlign: "center",
//           }}
//         >
//           <Icon
//             sx={{
//               fontSize: 40,
//               opacity: 0.7,
//             }}
//           />

//           {children ?? (
//             <Typography variant="body2">
//               {filtered ? "No matching rows" : "No rows to display"}
//             </Typography>
//           )}
//         </Box>
//       </TableCell>
//     </TableRow>
//   );
// }

import { Box, styled, Typography } from "@mui/material";
import { InboxOutlined, SearchOffOutlined } from "@mui/icons-material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { DataTableBodyStateShell } from "./DataTableBodyStateShell";
import type { DataTableBodyStateProps } from "./types";

export interface DataTableEmptyStateProps extends DataTableBodyStateProps {
  /**
   * Whether rows are absent because an active search/filter produced
   * no matches.
   */
  readonly filtered?: boolean;
}

/**
 * ------------------------------------------------------------------
 * EmptyState
 * ------------------------------------------------------------------
 *
 * Semantic/presentation content of the empty body state.
 *
 * Physical native table structure belongs to:
 *
 *   DataTableBodyStateShell
 */
const EmptyStateRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "EmptyState",
  overridesResolver: (_props, styles) => styles.emptyState,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  color: (theme.vars ?? theme).palette.text.secondary,
  textAlign: "center",
}));

/**
 * Private icon presentation.
 *
 * This is deliberately NOT another RazethDataTable theme slot.
 *
 * 6E.3 exposes meaningful structural/state surfaces without creating
 * a public slot for every implementation detail.
 */
const EmptyStateIconRoot = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "40px",
  opacity: 0.7,
});

export function DataTableEmptyState(props: DataTableEmptyStateProps) {
  const { colSpan, children, filtered = false } = props;

  const Icon = filtered ? SearchOffOutlined : InboxOutlined;

  return (
    <DataTableBodyStateShell state="empty" colSpan={colSpan}>
      <EmptyStateRoot
        className={dataTableClasses.emptyState}
        data-filtered={filtered ? "true" : undefined}
        role="status"
        aria-live="polite"
      >
        <EmptyStateIconRoot aria-hidden="true">
          <Icon fontSize="inherit" />
        </EmptyStateIconRoot>

        {children ?? (
          <Typography variant="body2">
            {filtered ? "No matching rows" : "No rows to display"}
          </Typography>
        )}
      </EmptyStateRoot>
    </DataTableBodyStateShell>
  );
}

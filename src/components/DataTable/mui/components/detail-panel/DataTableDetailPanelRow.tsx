// mui/components/detail-panel/DataTableDetailPanelRow.tsx

"use client";

import { Box, TableCell, TableRow } from "@mui/material";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";
import type { DataTableDetailPanelRenderer } from "./types";

export interface DataTableDetailPanelRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
  readonly renderDetailPanel: DataTableDetailPanelRenderer<TData>;
}

/**
 * Full-width table row containing application-defined detail content.
 *
 * This is separate from TanStack subRows:
 *
 * - expanded state belongs to TanStack
 * - detail-panel content belongs to the MUI renderer
 */
export function DataTableDetailPanelRow<TData extends RowData>(
  props: DataTableDetailPanelRowProps<TData>,
) {
  const { table, row, renderDetailPanel } = props;

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        expanded: state.expanded,
      })}
    >
      {() => {
        if (!row.getIsExpanded()) {
          return null;
        }

        const visibleColumnCount = table.getVisibleLeafColumns().length;

        const colSpan = Math.max(1, visibleColumnCount);

        const content = renderDetailPanel({
          table,
          row,
        });

        if (content === null || content === undefined || content === false) {
          return null;
        }

        return (
          <TableRow
            data-detail-panel-row={row.id}
            sx={{
              backgroundColor: "background.paper",
            }}
          >
            <TableCell
              colSpan={colSpan}
              sx={{
                p: 0,
                borderBottom: "1px solid",
                borderBottomColor: "divider",

                /**
                 * Detail content must not inherit normal body-cell
                 * nowrap/truncation behavior.
                 */
                whiteSpace: "normal",
                overflow: "visible",
              }}
            >
              <Box
                data-detail-panel={row.id}
                sx={{
                  width: "100%",
                  minWidth: 0,
                }}
              >
                {content}
              </Box>
            </TableCell>
          </TableRow>
        );
      }}
    </table.Subscribe>
  );
}

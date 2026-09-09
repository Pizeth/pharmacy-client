"use client";

import { Box } from "@mui/material";
import { useMuiDataTableContext } from "../table";

export interface DataTableRowNumberCellProps {
  /**
   * Zero-based row position within the currently loaded TanStack page.
   *
   * For example:
   *
   *   first row  -> 0
   *   second row -> 1
   */
  readonly rowIndex: number;
}

/**
 * Display a one-based sequential row number for an offset-paginated
 * DataTable.
 *
 * IMPORTANT
 * ------------------------------------------------------------------
 *
 * This component deliberately reads pagination from the React
 * DataTable context rather than from the `table` object supplied to a
 * TanStack cell renderer.
 *
 * Why?
 *
 * The `table` supplied by:
 *
 *   cell: ({ table }) => ...
 *
 * is TanStack's CORE Table instance.
 *
 * It therefore does not contain our React integration APIs:
 *
 *   table.Subscribe
 *   table.atoms
 *
 * Those APIs live on the extended React table produced by our
 * createTableHook() family and exposed through:
 *
 *   useMuiDataTableContext()
 *
 *
 * Number calculation
 * ------------------------------------------------------------------
 *
 * page 1:
 *
 *   pageIndex = 0
 *   pageSize  = 25
 *
 *   0 * 25 + rowIndex + 1
 *
 * gives:
 *
 *   1 ... 25
 *
 *
 * page 2:
 *
 *   pageIndex = 1
 *
 * gives:
 *
 *   26 ... 50
 */
export function DataTableRowNumberCell(props: DataTableRowNumberCellProps) {
  const { rowIndex } = props;

  /**
   * This is the React/App table instance.
   *
   * Unlike the core Table available inside a TanStack CellContext,
   * this instance exposes:
   *
   *   atoms
   *   Subscribe
   *   AppTable
   *   ...
   */
  const table = useMuiDataTableContext();

  return (
    <table.Subscribe source={table.atoms.pagination}>
      {(pagination) => {
        const rowNumber =
          pagination.pageIndex * pagination.pageSize + rowIndex + 1;

        return (
          <Box
            component="span"
            sx={{
              display: "inline-block",
              minWidth: "2ch",
              textAlign: "center",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {rowNumber}
          </Box>
        );
      }}
    </table.Subscribe>
  );
}

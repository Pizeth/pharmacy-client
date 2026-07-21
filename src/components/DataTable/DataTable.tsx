// src/components/DataTable/DataTable.tsx
"use client";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
  type Table as TanStackTable,
  type Row,
  type RowSelectionState,
  type ExpandedState,
  type OnChangeFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, ReactNode } from "react";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 370px)",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 2,
  backgroundColor: theme.vars.palette.background.paper,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  backgroundColor: theme.vars.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.04),
  },
}));

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  expanded?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  renderDetailPanel?: (row: Row<TData>) => ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  density?: "compact" | "standard" | "comfortable";
  // For server-side pagination — pass Refine's table state through
  manualPagination?: boolean;
  pageCount?: number;
}

export function useDataTable<TData>({
  columns,
  data,
  getRowId,
  enableRowSelection = false,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
  expanded: expandedProp,
  onExpandedChange,
  manualPagination = false,
  pageCount,
}: DataTableProps<TData>) {
  // Internal fallback state if not controlled from outside
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    columns,
    data,
    getRowId: getRowId as any,
    state: {
      rowSelection: rowSelectionProp ?? internalRowSelection,
      globalFilter: globalFilterProp ?? internalGlobalFilter,
      expanded: expandedProp ?? internalExpanded,
    },
    enableRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalGlobalFilter,
    onExpandedChange: onExpandedChange ?? setInternalExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualPagination ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination,
    pageCount,
  });

  return table;
}

export function DataTable<TData>({
  table,
  renderDetailPanel,
  onRowClick,
}: {
  table: TanStackTable<TData>;
  renderDetailPanel?: (row: Row<TData>) => ReactNode;
  onRowClick?: (row: Row<TData>) => void;
}) {
  return (
    <StyledTableContainer>
      <Table stickyHeader size="small">
        <StyledTableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  align="center"
                  sx={{ fontWeight: 700 }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </StyledTableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <>
              <StyledTableRow
                key={row.id}
                onClick={() => onRowClick?.(row)}
                selected={row.getIsSelected()}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} align="center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </StyledTableRow>
              {row.getIsExpanded() && renderDetailPanel && (
                <TableRow key={`${row.id}-detail`}>
                  <TableCell colSpan={row.getVisibleCells().length}>
                    {renderDetailPanel(row)}
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default DataTable;

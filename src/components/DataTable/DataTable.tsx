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
  type ColumnSizingState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnFiltersState,
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
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, ReactNode, useMemo, useCallback, Fragment } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   horizontalListSortingStrategy,
//   useSortable,
//   arrayMove,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

export type Density = "compact" | "standard" | "comfortable";

const DENSITY_PADDING: Record<Density, string> = {
  compact: "4px 8px",
  standard: "8px 16px",
  comfortable: "16px 24px",
};

// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   maxHeight: "calc(100vh - 370px)",
// }));

const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== "isFullScreen",
})<{ isFullScreen?: boolean }>(({ theme, isFullScreen }) => ({
  maxHeight: isFullScreen ? "100vh" : "calc(100vh - 370px)",
  position: "relative",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 3,
  backgroundColor: theme.vars.palette.background.paper,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  backgroundColor: theme.vars.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.04),
  },
}));

const ResizeHandle = styled("div")<{ isResizing?: boolean }>(
  ({ theme, isResizing }) => ({
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "5px",
    cursor: "col-resize",
    userSelect: "none",
    touchAction: "none",
    backgroundColor: isResizing ? theme.palette.primary.main : "transparent",
    "&:hover": {
      backgroundColor: theme.alpha(theme.palette.primary.main, 0.5),
    },
  }),
);

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
  // renderDetailPanel?: (row: Row<TData>) => ReactNode;
  // onRowClick?: (row: Row<TData>) => void;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnPinning?: boolean;
  // density?: "compact" | "standard" | "comfortable";
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
  enableColumnResizing = true,
  // enableColumnPinning = true,
  manualPagination = false,
  pageCount,
}: DataTableProps<TData>) {
  // Internal fallback state if not controlled from outside
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((c) => (c.id ?? (c as any).accessorKey) as string),
  );
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showGlobalFilter, setShowGlobalFilter] = useState(true);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [density, setDensity] = useState<Density>("standard");

  const table = useReactTable({
    columns,
    data,
    getRowId: getRowId as any,
    state: {
      rowSelection: rowSelectionProp ?? internalRowSelection,
      globalFilter: globalFilterProp ?? internalGlobalFilter,
      expanded: expandedProp ?? internalExpanded,
      columnSizing,
      columnOrder,
      columnPinning,
      columnFilters,
    },
    enableRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalGlobalFilter,
    onExpandedChange: onExpandedChange ?? setInternalExpanded,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,
    columnResizeMode: "onChange",
    enableColumnResizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualPagination ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination,
    pageCount,
  });

  // return table;
  return {
    table,
    density,
    setDensity,
    showColumnFilters,
    setShowColumnFilters,
    showGlobalFilter,
    setShowGlobalFilter,
  };
}

// ─── Sortable header cell (dnd-kit/react) ──────────────────────────────────
function SortableHeaderCell({
  header,
  index,
  density,
  enableColumnResizing,
  enableColumnOrdering,
}: {
  header: any;
  index: number;
  density: Density;
  enableColumnResizing: boolean;
  enableColumnOrdering: boolean;
}) {
  const sortable = useSortable({
    id: header.column.id,
    index,
    disabled: !enableColumnOrdering,
  });

  const isPinned = header.column.getIsPinned();

  return (
    <TableCell
      ref={sortable.ref}
      align="center"
      sx={{
        fontWeight: 700,
        padding: DENSITY_PADDING[density],
        backgroundColor: (theme) => theme.vars.palette.background.paper,
        whiteSpace: "nowrap",
        position: isPinned ? "sticky" : "relative",
        left: isPinned === "left" ? header.column.getStart("left") : undefined,
        right:
          isPinned === "right" ? header.column.getAfter("right") : undefined,
        zIndex: isPinned ? 4 : undefined,
        opacity: sortable.isDragging ? 0.5 : 1,
        cursor: enableColumnOrdering ? "grab" : undefined,
      }}
      style={{ width: header.getSize() }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {enableColumnResizing && header.column.getCanResize() && (
        <ResizeHandle
          isResizing={header.column.getIsResizing()}
          onMouseDown={(e) => {
            e.stopPropagation(); // don't trigger drag when resizing
            header.getResizeHandler()(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            header.getResizeHandler()(e);
          }}
        />
      )}
    </TableCell>
  );
}

// ─── Draggable header cell ─────────────────────────────────────────────────
// function DraggableHeaderCell({
//   header,
//   density,
//   enableColumnResizing,
//   enableColumnOrdering,
// }: {
//   header: any;
//   density: Density;
//   enableColumnResizing: boolean;
//   enableColumnOrdering: boolean;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: header.column.id, disabled: !enableColumnOrdering });

//   const isPinned = header.column.getIsPinned();

//   const style: React.CSSProperties = {
//     transform: CSS.Translate.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//     width: header.getSize(),
//     position: isPinned ? "sticky" : "relative",
//     left: isPinned === "left" ? header.column.getStart("left") : undefined,
//     right: isPinned === "right" ? header.column.getAfter("right") : undefined,
//     zIndex: isPinned ? 4 : undefined,
//   };

//   return (
//     <TableCell
//       ref={setNodeRef}
//       style={style}
//       align="center"
//       sx={{
//         fontWeight: 700,
//         padding: DENSITY_PADDING[density],
//         backgroundColor: (theme) => theme.vars.palette.background.paper,
//         whiteSpace: "nowrap",
//       }}
//       {...(enableColumnOrdering ? { ...attributes, ...listeners } : {})}
//     >
//       {header.isPlaceholder
//         ? null
//         : flexRender(header.column.columnDef.header, header.getContext())}
//       {enableColumnResizing && header.column.getCanResize() && (
//         <ResizeHandle
//           isResizing={header.column.getIsResizing()}
//           onMouseDown={header.getResizeHandler()}
//           onTouchStart={header.getResizeHandler()}
//           onClick={(e) => e.stopPropagation()} // don't trigger drag
//         />
//       )}
//     </TableCell>
//   );
// }

export function DataTable<TData>({
  table,
  density = "standard",
  showColumnFilters = false,
  renderDetailPanel,
  onRowClick,
  isFullScreen = false,
  enableColumnResizing = true,
  enableColumnOrdering = true,
  // enableStickyFooter = false,
  // footerContent,
}: {
  table: TanStackTable<TData>;
  density?: Density;
  showColumnFilters?: boolean;
  renderDetailPanel?: (row: Row<TData>) => ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  isFullScreen?: boolean;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  // enableStickyFooter?: boolean;
  // footerContent?: ReactNode;
}) {
  // const sensors = useSensors(
  //   useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  // );

  // const handleDragEnd = useCallback(
  //   (event: DragEndEvent) => {
  //     const { active, over } = event;
  //     if (!over || active.id === over.id) return;

  //     const columnOrder = table.getState().columnOrder;
  //     const oldIndex = columnOrder.indexOf(active.id as string);
  //     const newIndex = columnOrder.indexOf(over.id as string);
  //     table.setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
  //   },
  //   [table],
  // );

  // const columnIds = useMemo(
  //   () => table.getVisibleLeafColumns().map((c) => c.id),
  //   [table.getState().columnOrder, table.getState().columnVisibility],
  // );

  const columnOrder = table.getState().columnOrder;

  const handleDragEnd = useCallback(
    (event: any) => {
      const { operation, canceled } = event;
      if (canceled) return;

      const { source, target } = operation;
      if (!target || source.id === target.id) return;

      // `move` from @dnd-kit/helpers reorders an array of ids given source/target
      const newOrder = move(columnOrder, event);
      table.setColumnOrder(newOrder);
    },
    [columnOrder, table],
  );

  const hasFooters = table
    .getFooterGroups()
    .some((fg) => fg.headers.some((h) => h.column.columnDef.footer));

  return (
    <StyledTableContainer isFullScreen={isFullScreen}>
      {/* <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      > */}
      <DragDropProvider onDragEnd={handleDragEnd}>
        <Table stickyHeader size="small" style={{ tableLayout: "fixed" }}>
          <StyledTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  // <TableCell
                  //   key={header.id}
                  //   align="center"
                  //   sx={{ fontWeight: 700 }}
                  // >
                  //   {header.isPlaceholder
                  //     ? null
                  //     : flexRender(
                  //         header.column.columnDef.header,
                  //         header.getContext(),
                  //       )}
                  // </TableCell>
                  // <SortableContext
                  //   items={columnIds}
                  //   strategy={horizontalListSortingStrategy}
                  // >
                  //   {headerGroup.headers.map((header) => (
                  //     <DraggableHeaderCell
                  //       key={header.id}
                  //       header={header}
                  //       density={density}
                  //       enableColumnResizing={enableColumnResizing}
                  //       enableColumnOrdering={enableColumnOrdering}
                  //     />
                  //   ))}
                  // </SortableContext>

                  <SortableHeaderCell
                    key={header.id}
                    header={header}
                    index={index}
                    density={density}
                    enableColumnResizing={enableColumnResizing}
                    enableColumnOrdering={enableColumnOrdering}
                  />
                ))}
              </TableRow>
            ))}

            {/* 👇 use the prop, not table.getState() */}
            {showColumnFilters && (
              <TableRow>
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell key={column.id} sx={{ padding: "2px 8px" }}>
                    {column.getCanFilter() ? (
                      <TextField
                        variant="standard"
                        size="small"
                        fullWidth
                        // placeholder={`ត្រង​តាមរយៈ: ${flexRender(column.columnDef.header, {} as any) ?? column.id}`}
                        placeholder={`ត្រង​តាមរយៈ: ${
                          typeof column.columnDef.header === "string"
                            ? column.columnDef.header
                            : column.id
                        }`}
                        value={(column.getFilterValue() ?? "") as string}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                        slotProps={{ input: { disableUnderline: false } }}
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </StyledTableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <StyledTableRow
                  // key={row.id}
                  onClick={() => onRowClick?.(row)}
                  selected={row.getIsSelected()}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned();
                    return (
                      <TableCell
                        key={cell.id}
                        align="center"
                        sx={{
                          padding: DENSITY_PADDING[density],
                          position: isPinned ? "sticky" : undefined,
                          left:
                            isPinned === "left"
                              ? cell.column.getStart("left")
                              : undefined,
                          right:
                            isPinned === "right"
                              ? cell.column.getAfter("right")
                              : undefined,
                          zIndex: isPinned ? 1 : undefined,
                          backgroundColor: isPinned
                            ? (theme) => theme.vars.palette.background.paper
                            : undefined,
                        }}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </StyledTableRow>
                {row.getIsExpanded() && renderDetailPanel && (
                  <TableRow key={`${row.id}-detail`}>
                    <TableCell colSpan={row.getVisibleCells().length}>
                      {renderDetailPanel(row)}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
          {/* {enableStickyFooter && footerContent && (
            <Box
              component="tfoot"
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 3,
                backgroundColor: (theme) => theme.vars.palette.background.paper,
              }}
            >
              <TableRow>
                <TableCell colSpan={table.getVisibleLeafColumns().length}>
                  {footerContent}
                </TableCell>
              </TableRow>
            </Box>
          )} */}

          {table
            .getFooterGroups()
            .some((fg) =>
              fg.headers.some((h) => h.column.columnDef.footer),
            ) && (
            <Box
              component="tfoot"
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 3,
                backgroundColor: (theme) => theme.vars.palette.background.paper,
                borderTop: (theme) =>
                  `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`,
              }}
            >
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      align="center"
                      sx={{
                        fontWeight: 700,
                        padding: DENSITY_PADDING[density],
                      }}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </Box>
          )}

          {hasFooters && (
            <Box
              component="tfoot"
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 3,
                backgroundColor: (theme) => theme.vars.palette.background.paper,
                borderTop: (theme) =>
                  `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`,
              }}
            >
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      align="center"
                      sx={{
                        fontWeight: 700,
                        padding: DENSITY_PADDING[density],
                      }}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </Box>
          )}
        </Table>
      </DragDropProvider>

      {/* </DndContext> */}
    </StyledTableContainer>
  );
}

export default DataTable;

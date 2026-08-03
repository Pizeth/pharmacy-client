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
  SortingState,
  getSortedRowModel,
  Header,
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
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, ReactNode, useMemo, useCallback, Fragment } from "react";
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import { ArrowDownward, SwapVertOutlined } from "@mui/icons-material";
import MoreVert from "@mui/icons-material/MoreVert";
import Close from "@mui/icons-material/Close";
import RazSortable from "../icons/utils/sort";
import FlipIconWrapper from "../icons/components/FlipIconWrapper";
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
  compact: "4px 4px",
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.075)}`,
  borderBottom: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.075)}`,
  "&:last-of-type": {
    borderRight: "none",
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

/**
 * Measures the exact pixel width of a text string based on font styles.
 */
function measureTextWidth(
  text: string,
  font = "14px Inter, sans-serif",
): number {
  if (typeof window === "undefined") return 0;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font;
  return Math.ceil(context.measureText(text).width);
}

export function useDataTable<TData>({
  columns: userColumns,
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
  // Auto-calculate strict content widths dynamically
  const columns = useMemo(() => {
    return userColumns.map((col) => {
      // 1. Target the correct data key extractor (accessorKey or id)
      const accessor = (col as any).accessorKey || col.id;
      if (!accessor) return col;

      // 2. Measure header text length
      const headerText =
        typeof col.header === "string" ? col.header : String(accessor);
      let longestWidth = measureTextWidth(
        headerText,
        "700 16px var(--font-interkhmerloopless)",
      ); // Bold header font

      // 3. Scan row data to find the longest cell text
      data.forEach((row: any) => {
        const cellValue = row[accessor];
        if (cellValue !== undefined && cellValue !== null) {
          // Normal regular cell text font
          const cellWidth = measureTextWidth(
            String(cellValue),
            "400 14px sans-serif",
          );
          if (cellWidth > longestWidth) {
            longestWidth = cellWidth;
          }
        }
      });

      // 4. Add buffer padding (e.g., 40px for sorting arrows and spacing)
      const finalFitSize = longestWidth + 40;

      return {
        ...col,
        // Sets the default column sizing to precisely match cell text constraints
        size: col.size ?? finalFitSize,
        minSize: col.minSize ?? Math.min(finalFitSize, 50),
        maxSize: col.maxSize ?? Math.max(finalFitSize, 500), // Dynamic fit content max boundary
      };
    });
  }, [userColumns, data]);

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
  const [density, setDensity] = useState<Density>("compact");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    defaultColumn: {
      minSize: 10,
      // maxSize: 100,
      size: 15, // 👈 Triggers header.getSize() = 15 inside your TableCell style block perfectly!
      // This replicates the MRT syntax architecture 1:1 on bare TanStack
      Header: (context) => {
        // Safely catch the primitive string/fallback name from column metadata
        const baseHeader =
          context.column.columnDef.header ?? context.column.id ?? "";

        return (
          <Typography
            variant="h6"
            color="error"
            sx={{
              fontWeight: 700,
              fontFamily: "var(--font-interkhmerloopless)",
              // color: (theme) => theme.palette.error.main,
            }}
          >
            {/* Re-render the true individual string or value cleanly without infinite recursions */}
            <strong>
              {flexRender(baseHeader, context.header.getContext())}
            </strong>
          </Typography>
        );
      },
    },
    getRowId: getRowId as any,
    state: {
      rowSelection: rowSelectionProp ?? internalRowSelection,
      globalFilter: globalFilterProp ?? internalGlobalFilter,
      expanded: expandedProp ?? internalExpanded,
      columnSizing,
      columnOrder,
      columnPinning,
      columnFilters,
      sorting,
    },
    enableRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalGlobalFilter,
    onExpandedChange: onExpandedChange ?? setInternalExpanded,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    columnResizeMode: "onChange",
    enableColumnResizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
function SortableHeaderCell<TData>({
  header,
  index,
  density,
  enableColumnResizing,
  enableColumnOrdering,
}: {
  header: Header<TData, unknown>;
  index: number;
  density: Density;
  enableColumnResizing: boolean;
  enableColumnOrdering: boolean;
}) {
  const sortable = useSortable({
    id: header.column.id,
    index,
    disabled:
      !enableColumnOrdering ||
      ["select", "expand", "actions"].includes(header.column.id),
  });

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const isPinned = header.column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && header.column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && header.column.getIsFirstColumn("right");
  const canSort = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();
  const showColumnActions = header.column.columnDef.enableColumnActions ?? true; // default true, matching MRT

  // 👇 Type-safe resolution targeting your global blueprint wrapper
  const renderHeader =
    header.column.columnDef.Header ?? header.column.columnDef.header;

  return (
    <TableCell
      ref={sortable.ref}
      align="center"
      sx={{
        fontWeight: 700,
        padding: DENSITY_PADDING[density],
        backgroundColor: (theme) =>
          theme.alpha(theme.vars.palette.background.paper, 0.075),
        borderRight: isLastLeftPinned
          ? (theme) =>
              `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.15)}`
          : undefined,
        borderLeft: isFirstRightPinned
          ? (theme) =>
              `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.15)}`
          : undefined,
        whiteSpace: "nowrap",
        position: isPinned ? "sticky" : "relative",
        left: isPinned === "left" ? header.column.getStart("left") : undefined,
        right:
          isPinned === "right" ? header.column.getAfter("right") : undefined,
        zIndex: isPinned ? 4 : undefined,
        opacity: sortable.isDragging ? 0.5 : 1,
        cursor: enableColumnOrdering ? "grab" : undefined,
      }}
      style={{
        width: header.getSize(),
        minWidth: header.getSize(),
        maxWidth: header.getSize(),
      }}
    >
      {/* {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())} */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // gap: 0.5,
        }}
      >
        <Box
          sx={{
            cursor: canSort ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: 0.25,
          }}
          onClick={
            canSort ? header.column.getToggleSortingHandler() : undefined
          }
        >
          {/* {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          {canSort && sortDirection === "asc" && (
            <ArrowUpward fontSize="inherit" />
          )}
          {canSort && sortDirection === "desc" && (
            <ArrowDownward fontSize="inherit" />
          )} */}

          {/* <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: "var(--font-interkhmerloopless)", // 👈 match your Khmer font
              color: (theme) => theme.palette.error.main, // 👈 match MRT's header text color (orange/red in your screenshots)
            }}
          > */}
          {header.isPlaceholder
            ? null
            : flexRender(renderHeader, header.getContext())}
          {/* </Typography> */}
          {canSort && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                opacity: sortDirection ? 1 : 0.3, // 👈 always visible, faded when inactive
                color: (theme) =>
                  sortDirection ? theme.palette.error.main : "inherit",
                transition: "opacity 0.15s ease",
              }}
            >
              {/* {sortDirection === "desc" ? (
                <ArrowDownward fontSize="inherit" />
              ) : (
                <ArrowUpward fontSize="inherit" />
              )} */}

              {!sortDirection ? (
                // 1. Default unsorted view: Show Swap Vertical Icon
                <FlipIconWrapper rotate="up">
                  <RazSortable fontSize="inherit" sx={{ fontSize: "1rem" }} />
                </FlipIconWrapper>
              ) : sortDirection === "desc" ? (
                // 2. Sorted Descending
                <ArrowDownward fontSize="inherit" />
              ) : (
                // 3. Sorted Ascending
                <ArrowUpward fontSize="inherit" />
              )}
            </Box>
          )}
        </Box>

        {/* {header.column.id !== "select" && header.column.id !== "expand" && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
            }}
            sx={{ padding: "2px" }} // tighter hit area so the bigger icon doesn't bloat the header
          >
            <MoreVert fontSize="inherit" sx={{ fontSize: "1.25rem" }} />
          </IconButton>
        )} */}

        {showColumnActions &&
          header.column.id !== "select" &&
          header.column.id !== "expand" && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setMenuAnchor(e.currentTarget);
              }}
              sx={{
                padding: "2px",
                // Permanently matches the dark gray 0.3 opacity standard matching the image blueprint
                opacity: 0.3,
                color: "inherit",
                "&:hover": { opacity: 1 }, // Optional: Highlights sharply on immediate mouse hover
              }}
            >
              <MoreVert sx={{ fontSize: "1.25rem" }} />
            </IconButton>
          )}
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            header.column.toggleSorting(false);
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <ArrowUpward fontSize="small" />
          </ListItemIcon>
          <ListItemText>តម្រៀបតាម ឈ្មោះឯកសារ ពីលើចុះក្រោម</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            header.column.toggleSorting(true);
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <ArrowDownward fontSize="small" />
          </ListItemIcon>
          <ListItemText>តម្រៀបតាម ឈ្មោះឯកសារ ពីក្រោមឡើងលើ</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            header.column.clearSorting();
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <Close fontSize="small" />
          </ListItemIcon>
          <ListItemText>សម្អាតការតម្រៀប</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            header.column.pin(isPinned === "left" ? false : "left");
            setMenuAnchor(null);
          }}
        >
          <ListItemText>
            {isPinned === "left" ? "ដកចេញ" : "ខ្ទាស់ទៅឆ្វេង"}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            header.column.pin(isPinned === "right" ? false : "right");
            setMenuAnchor(null);
          }}
        >
          <ListItemText>
            {isPinned === "right" ? "ដកចេញ" : "ខ្ទាស់ទៅស្តាំ"}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            header.column.toggleVisibility(false);
            setMenuAnchor(null);
          }}
        >
          <ListItemText>លាក់ជួរឈរ</ListItemText>
        </MenuItem>
      </Menu>
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
  const columnOrder = table.getState().columnOrder;

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { operation, canceled } = event;
      if (canceled) return;

      const { source, target } = operation;
      if (!target || source?.id === target.id) return;

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
      <DragDropProvider onDragEnd={handleDragEnd}>
        <Table stickyHeader size="small" style={{ tableLayout: "fixed" }}>
          <StyledTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
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
                    const isLastLeftPinned =
                      isPinned === "left" &&
                      cell.column.getIsLastColumn("left");
                    const isFirstRightPinned =
                      isPinned === "right" &&
                      cell.column.getIsFirstColumn("right");

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
                          // 👇 border only at the pinned/unpinned boundary
                          borderRight: isLastLeftPinned
                            ? (theme) =>
                                `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.15)}`
                            : undefined,
                          borderLeft: isFirstRightPinned
                            ? (theme) =>
                                `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.15)}`
                            : undefined,
                        }}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                        }}
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
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        maxWidth: header.getSize(),
                      }}
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
    </StyledTableContainer>
  );
}

export default DataTable;

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

{
  /* {enableStickyFooter && footerContent && (
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
          )} */
}

// {
//   table
//     .getFooterGroups()
//     .some((fg) => fg.headers.some((h) => h.column.columnDef.footer)) && (
//     <Box
//       component="tfoot"
//       sx={{
//         position: "sticky",
//         bottom: 0,
//         zIndex: 3,
//         backgroundColor: (theme) => theme.vars.palette.background.paper,
//         borderTop: (theme) =>
//           `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`,
//       }}
//     >
//       {table.getFooterGroups().map((footerGroup) => (
//         <TableRow key={footerGroup.id}>
//           {footerGroup.headers.map((header) => (
//             <TableCell
//               key={header.id}
//               align="center"
//               sx={{
//                 fontWeight: 700,
//                 padding: DENSITY_PADDING[density],
//               }}
//               style={{
//                 width: header.getSize(),
//                 minWidth: header.getSize(),
//                 maxWidth: header.getSize(),
//               }}
//             >
//               {header.isPlaceholder
//                 ? null
//                 : flexRender(
//                     header.column.columnDef.footer,
//                     header.getContext(),
//                   )}
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </Box>
//   );
// }

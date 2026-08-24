// mui/components/column-manager/DataTableColumnManager.tsx

"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { RestartAltOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnManagerSection } from "./DataTableColumnManagerSection";
// import { DataTableColumnManagerItem } from "./DataTableColumnManagerItem";
import { getDataTableColumnRegion, reorderDataTableColumn } from "./ordering";
import type { DataTableColumnManagerConfig } from "./types";

export interface DataTableColumnManagerProps<
  TData extends RowData,
> extends DataTableColumnManagerConfig {
  readonly table: MuiDataTableInstance<TData>;
  readonly anchorEl: HTMLElement | null;
  readonly open: boolean;
  readonly onClose: () => void;
}

/**
 * High-level column-management surface.
 *
 * Currently manages:
 *
 * - visibility
 * - logical start/end pinning
 * - resets
 *
 * Phase 1.6.2 will extend this same surface with ordering.
 */
export function DataTableColumnManager<TData extends RowData>(
  props: DataTableColumnManagerProps<TData>,
) {
  const {
    table,
    anchorEl,
    open,
    onClose,
    enableOrdering = true,
    enableVisibility = true,
    enablePinning = true,
    enableReset = true,
  } = props;

  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);

  const [dropTargetColumnId, setDropTargetColumnId] = useState<string | null>(
    null,
  );

  const clearDragState = (): void => {
    setDraggingColumnId(null);
    setDropTargetColumnId(null);
  };

  const handleDragStart = (columnId: string): void => {
    setDraggingColumnId(columnId);
    setDropTargetColumnId(null);
  };

  const handleDragOver = (targetColumnId: string): void => {
    if (draggingColumnId === null || draggingColumnId === targetColumnId) {
      setDropTargetColumnId(null);
      return;
    }

    const sourceColumn = table.getColumn(draggingColumnId);

    const targetColumn = table.getColumn(targetColumnId);

    if (!sourceColumn || !targetColumn) {
      return;
    }

    /**
     * Cross-region dragging is not ordering.
     *
     * Pinning should be changed explicitly through pin controls.
     */
    if (
      getDataTableColumnRegion(sourceColumn) !==
      getDataTableColumnRegion(targetColumn)
    ) {
      setDropTargetColumnId(null);
      return;
    }

    setDropTargetColumnId(targetColumnId);
  };

  const handleDrop = (targetColumnId: string): void => {
    if (draggingColumnId === null) {
      return;
    }

    reorderDataTableColumn(table, draggingColumnId, targetColumnId);
    clearDragState();
  };

  const handleClose = (): void => {
    clearDragState();
    onClose();
  };

  return (
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
      })}
    >
      {() => {
        /**
         * Region APIs retain hidden leaf columns, which makes them
         * appropriate for a management surface.
         */
        const startColumns = table.getStartLeafColumns();

        const centerColumns = table.getCenterLeafColumns();

        const endColumns = table.getEndLeafColumns();

        return (
          <Popover
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                sx: {
                  width: 400,
                  maxWidth: "calc(100vw - 32px)",
                  maxHeight: "min(680px, calc(100vh - 64px))",
                  display: "flex",
                  flexDirection: "column",
                },
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Columns
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Reorder, pin, and show or hide columns
              </Typography>
            </Box>

            <Divider />

            <Stack
              spacing={1}
              sx={{
                overflowY: "auto",
                p: 1,
                flex: 1,
                minHeight: 0,
              }}
            >
              <DataTableColumnManagerSection
                table={table}
                region="start"
                columns={startColumns}
                enableOrdering={enableOrdering}
                enableVisibility={enableVisibility}
                enablePinning={enablePinning}
                draggingColumnId={draggingColumnId}
                dropTargetColumnId={dropTargetColumnId}
                onDragStart={handleDragStart}
                onDragEnd={clearDragState}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />

              <DataTableColumnManagerSection
                table={table}
                region="center"
                columns={centerColumns}
                enableOrdering={enableOrdering}
                enableVisibility={enableVisibility}
                enablePinning={enablePinning}
                draggingColumnId={draggingColumnId}
                dropTargetColumnId={dropTargetColumnId}
                onDragStart={handleDragStart}
                onDragEnd={clearDragState}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />

              <DataTableColumnManagerSection
                table={table}
                region="end"
                columns={endColumns}
                enableOrdering={enableOrdering}
                enableVisibility={enableVisibility}
                enablePinning={enablePinning}
                draggingColumnId={draggingColumnId}
                dropTargetColumnId={dropTargetColumnId}
                onDragStart={handleDragStart}
                onDragEnd={clearDragState}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            </Stack>

            {enableReset && (
              <>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    p: 1,
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<RestartAltOutlined />}
                    onClick={() => {
                      table.resetColumnOrder();
                      table.resetColumnVisibility();
                      table.resetColumnPinning();
                    }}
                  >
                    Reset columns
                  </Button>
                </Box>
              </>
            )}
          </Popover>
        );
      }}
    </table.Subscribe>
  );
}

// {
//   () => {
//     const columns = table.getAllLeafColumns();

//     return (
//       <Popover
//         anchorEl={anchorEl}
//         open={open}
//         onClose={onClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "right",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "right",
//         }}
//         slotProps={{
//           paper: {
//             sx: {
//               width: 360,
//               maxWidth: "calc(100vw - 32px)",
//               maxHeight: "min(640px, calc(100vh - 64px))",
//               display: "flex",
//               flexDirection: "column",
//             },
//           },
//         }}
//       >
//         {/**
//          * Header
//          */}
//         <Box
//           sx={{
//             px: 2,
//             py: 1.5,
//           }}
//         >
//           <Typography variant="subtitle1" fontWeight={600}>
//             Columns
//           </Typography>

//           <Typography variant="caption" color="text.secondary">
//             Manage visibility and pinning
//           </Typography>
//         </Box>

//         <Divider />

//         {/**
//          * Scrollable column list.
//          */}
//         <Stack
//           spacing={0.25}
//           sx={{
//             overflowY: "auto",
//             p: 1,
//             flex: 1,
//             minHeight: 0,
//           }}
//         >
//           {columns.map((column) => (
//             <DataTableColumnManagerItem
//               key={column.id}
//               column={column}
//               enableVisibility={enableVisibility}
//               enablePinning={enablePinning}
//             />
//           ))}
//         </Stack>

//         {enableReset && (
//           <>
//             <Divider />
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 1,
//                 p: 1,
//               }}
//             >
//               <Button
//                 size="small"
//                 startIcon={<RestartAltOutlined />}
//                 onClick={() => {
//                   //   table.resetColumnVisibility(true);
//                   //   table.resetColumnPinning(true);
//                   table.resetColumnVisibility();
//                   table.resetColumnPinning();
//                 }}
//               >
//                 Reset
//               </Button>
//             </Box>
//           </>
//         )}
//       </Popover>
//     );
//   };
// }

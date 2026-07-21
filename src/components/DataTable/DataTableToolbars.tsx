// src/components/DataTable/DataTableToolbar.tsx
"use client";
import {
  TextField,
  InputAdornment,
  TablePagination,
  IconButton,
} from "@mui/material";
import {
  SearchOutlined,
  ViewColumn,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

export function GlobalFilterTextField<TData>({
  table,
  label = "ស្វែងរក",
  placeholder,
}: {
  table: Table<TData>;
  label?: string;
  placeholder?: string;
}) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      variant="outlined"
      size="small"
      value={table.getState().globalFilter ?? ""}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined sx={{ transform: "scaleX(-1)" }} color="error" />
            </InputAdornment>
          ),
        },
        inputLabel: { shrink: true },
      }}
    />
  );
}

export function TablePaginationBar<TData>({ table }: { table: Table<TData> }) {
  const { pageIndex, pageSize } = table.getState().pagination;
  return (
    <TablePagination
      component="div"
      count={table.getFilteredRowModel().rows.length}
      page={pageIndex}
      onPageChange={(_, newPage) => table.setPageIndex(newPage)}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
      rowsPerPageOptions={[10, 25, 50, 100]}
    />
  );
}

export function ShowHideColumnsButton<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <ViewColumn />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {table.getAllLeafColumns().map((column) => (
          <MenuItem
            key={column.id}
            onClick={() => column.toggleVisibility()}
            dense
          >
            <Checkbox checked={column.getIsVisible()} size="small" />
            <ListItemText primary={column.id} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export function FullScreenToggleButton({
  isFullScreen,
  onToggle,
}: {
  isFullScreen: boolean;
  onToggle: () => void;
}) {
  return (
    <IconButton onClick={onToggle}>
      {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
    </IconButton>
  );
}

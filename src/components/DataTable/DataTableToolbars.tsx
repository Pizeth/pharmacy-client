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
  DensityMedium,
  DensitySmall,
  DensityLarge,
  PushPin,
  PushPinOutlined,
} from "@mui/icons-material";
import type { Table, Column } from "@tanstack/react-table";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import type { Density } from "./DataTable";

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

export function DensityToggleButton({
  density,
  onChange,
}: {
  density: Density;
  onChange: (d: Density) => void;
}) {
  const cycle: Record<Density, Density> = {
    compact: "standard",
    standard: "comfortable",
    comfortable: "compact",
  };

  const icon = {
    compact: <DensitySmall />,
    standard: <DensityMedium />,
    comfortable: <DensityLarge />,
  }[density];

  return (
    <IconButton onClick={() => onChange(cycle[density])} title="Toggle density">
      {icon}
    </IconButton>
  );
}

export function ColumnPinningMenuButton<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        title="Pin columns"
      >
        <PushPinOutlined />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {table.getAllLeafColumns().map((column: Column<TData, unknown>) => {
          const pinned = column.getIsPinned();
          return (
            <MenuItem key={column.id}>
              <ListItemText primary={column.id} sx={{ mr: 2 }} />
              <IconButton
                size="small"
                onClick={() => column.pin(pinned === "left" ? false : "left")}
                color={pinned === "left" ? "primary" : "default"}
              >
                <PushPin
                  fontSize="small"
                  style={{ transform: "rotate(-45deg)" }}
                />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => column.pin(pinned === "right" ? false : "right")}
                color={pinned === "right" ? "primary" : "default"}
              >
                <PushPin
                  fontSize="small"
                  style={{ transform: "rotate(45deg)" }}
                />
              </IconButton>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

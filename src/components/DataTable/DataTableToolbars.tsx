// src/components/DataTable/DataTableToolbars.tsx
"use client";
import {
  TextField,
  InputAdornment,
  TablePagination,
  IconButton,
  Box,
  Button,
  Divider,
  Typography,
  Switch,
  Collapse,
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
  FilterListOutlined,
  DragIndicator,
  SearchOffOutlined,
} from "@mui/icons-material";
import type { Table as TanStackTable, Column } from "@tanstack/react-table";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import type { Density } from "./DataTable";
import Close from "@mui/icons-material/Close";
import FlipIconWrapper from "../icons/components/FlipIconWrapper";

// DataTableToolbarPieces.tsx — replace GlobalFilterTextField
export function CollapsibleGlobalFilterOld<TData>({
  table,
  label = "ស្វែងរក",
  placeholder,
}: {
  table: TanStackTable<TData>;
  label?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(true);
  const value = (table.getState().globalFilter ?? "") as string;
  // const isExpanded = open || !!value;
  const isExpanded = open;

  // if (!open && !value) {
  //   return (
  //     <IconButton onClick={() => setOpen(true)}>
  //       <SearchOutlined />
  //     </IconButton>
  //   );
  // }

  // return (
  //   <TextField
  //     autoFocus
  //     size="small"
  //     placeholder={placeholder}
  //     value={value}
  //     onChange={(e) => table.setGlobalFilter(e.target.value)}
  //     onBlur={() => !value && setOpen(false)}
  //     slotProps={{
  //       input: {
  //         startAdornment: (
  //           <InputAdornment position="start">
  //             <SearchOutlined fontSize="small" color="error" />
  //           </InputAdornment>
  //         ),
  //         endAdornment: (
  //           <InputAdornment position="end">
  //             <IconButton
  //               size="small"
  //               onClick={() => {
  //                 table.setGlobalFilter("");
  //                 setOpen(false);
  //               }}
  //             >
  //               <Close fontSize="small" />
  //             </IconButton>
  //           </InputAdornment>
  //         ),
  //       },
  //     }}
  //     sx={{ width: 260, transition: "width 0.2s ease" }}
  //   />
  // );

  return (
    <>
      {!isExpanded && (
        <IconButton onClick={() => setOpen(true)}>
          <SearchOutlined color="error" />
        </IconButton>
      )}

      {/* 👇 Collapse wraps the field itself, matching MRT's horizontal collapse */}
      <Collapse in={isExpanded} orientation="horizontal" sx={{ minWidth: 0 }}>
        <TextField
          autoFocus={open}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          margin="dense"
          fullWidth
          value={value}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          // onBlur={() => !value && setOpen(false)}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined color="error" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    disabled={!value}
                    aria-label="សម្អាតការស្វែងរក"
                    onClick={() => {
                      table.setGlobalFilter("");
                      // setOpen(false);
                    }}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Collapse>
    </>
  );
}

// DataTableToolbarPieces.tsx
export function CollapsibleGlobalFilter<TData>({
  table,
  open,
  label = "ស្វែងរក",
  placeholder,
}: {
  table: TanStackTable<TData>;
  open: boolean;
  label?: string;
  placeholder?: string;
}) {
  const value = (table.getState().globalFilter ?? "") as string;

  return (
    <Collapse in={open} orientation="horizontal" sx={{ minWidth: 0 }}>
      <TextField
        autoFocus={open}
        label={label}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        margin="dense"
        fullWidth
        value={value}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <FlipIconWrapper>
                  <SearchOutlined color="error" />
                </FlipIconWrapper>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  disabled={!value}
                  aria-label="សម្អាតការស្វែងរក"
                  onClick={() => table.setGlobalFilter("")}
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Collapse>
  );
}

// 👇 Separate toggle button — lives in the toolbar icon cluster, not inside the field
export function ToggleGlobalFilterButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <IconButton onClick={onToggle} color={open ? "primary" : "default"}>
      {open ? <SearchOffOutlined /> : <SearchOutlined />}
    </IconButton>
  );
}

// DataTableToolbarPieces.tsx
export function ToggleFiltersButton({
  showFilters,
  onToggle,
}: {
  showFilters: boolean;
  onToggle: () => void;
}) {
  return (
    <IconButton onClick={onToggle} color={showFilters ? "primary" : "default"}>
      <FilterListOutlined />
    </IconButton>
  );
}

export function GlobalFilterTextField<TData>({
  table,
  label = "ស្វែងរក",
  placeholder,
}: {
  table: TanStackTable<TData>;
  label?: string;
  placeholder?: string;
}) {
  // Safety guard against undefined or un-destructured hook objects
  if (!table || typeof table.getState !== "function") {
    return null;
  }

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

export function TablePaginationBar<TData>({
  table,
}: {
  table: TanStackTable<TData>;
}) {
  // Safety guard against undefined or un-destructured hook objects
  if (!table || typeof table.getState !== "function") {
    return null;
  }

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

// export function ShowHideColumnsButton<TData>({
//   table,
// }: {
//   table: TanStackTable<TData>;
// }) {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//   // Safety guard against undefined or un-destructured hook objects
//   if (!table || typeof table.getAllLeafColumns !== "function") {
//     return null;
//   }

//   return (
//     <>
//       <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
//         <ViewColumn />
//       </IconButton>
//       <Menu
//         anchorEl={anchorEl}
//         open={!!anchorEl}
//         onClose={() => setAnchorEl(null)}
//       >
//         {table.getAllLeafColumns().map((column) => (
//           <MenuItem
//             key={column.id}
//             onClick={() => column.toggleVisibility()}
//             dense
//           >
//             <Checkbox checked={column.getIsVisible()} size="small" />
//             <ListItemText primary={column.id} />
//           </MenuItem>
//         ))}
//       </Menu>
//     </>
//   );
// }

export function ColumnSettingsMenu<TData>({
  table,
}: {
  table: TanStackTable<TData>;
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
        slotProps={{ paper: { sx: { minWidth: 320 } } }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-around", px: 1, pb: 1 }}
        >
          <Button
            size="small"
            onClick={() => table.toggleAllColumnsVisible(true)}
          >
            លក់ទាំងអស់
          </Button>
          <Button
            size="small"
            onClick={() => table.toggleAllColumnsVisible(false)}
          >
            ខ្សល់ទាំងអស់
          </Button>
          <Button size="small" onClick={() => table.resetColumnOrder()}>
            បង្ហាញទាំងអស់
          </Button>
        </Box>
        <Divider />
        {table.getAllLeafColumns().map((column) => {
          const pinned = column.getIsPinned();
          return (
            <MenuItem key={column.id} sx={{ gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => column.pin(pinned === "left" ? false : "left")}
                color={pinned === "left" ? "primary" : "default"}
                title="Pin left"
              >
                <PushPin fontSize="small" sx={{ transform: "scaleX(-1)" }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => column.pin(pinned === "right" ? false : "right")}
                color={pinned === "right" ? "primary" : "default"}
                title="Pin right"
              >
                <PushPin fontSize="small" />
              </IconButton>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {column.id}
              </Typography>
              <Switch
                size="small"
                checked={column.getIsVisible()}
                onChange={() => column.toggleVisibility()}
              />
              <DragIndicator
                fontSize="small"
                sx={{ opacity: 0.4, cursor: "grab" }}
              />
            </MenuItem>
          );
        })}
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
    compact: "compact",
    comfortable: "comfortable",
    spacius: "spacius",
  };

  const icon = {
    compact: <DensitySmall />,
    comfortable: <DensityMedium />,
    spacius: <DensityLarge />,
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
  table: TanStackTable<TData>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!table || typeof table.getAllLeafColumns !== "function") return null;

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

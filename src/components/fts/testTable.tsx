import React, { useMemo, useState } from "react";
// Assuming Next.js, swap if using react-router-dom
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_TableContainer,
  MRT_TablePagination,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToolbarAlertBanner,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Button,
  styled,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Print,
  Article,
  AssignmentTurnedIn,
  SearchOutlined as SearchOutlinedIcon,
  Add,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import generateRows, { Data } from "./mockData";

const Root = styled(Box)(({ theme }) => ({
  width: "100%",
  typography: "body1",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  // borderRadius: theme.shape.borderRadius,
  borderRadius: "5px",
}));

const ToolBar = styled(Box)(({ theme }) => ({
  display: "flex",
  // backgroundColor: "var(--app-palette-background-paper)",
  // borderRadius: "4px",
  flexDirection: "row",
  alignContent: "center",
  alignItems: "center",
  gap: "0.5rem",
  justifyContent: "space-between",
  padding: "0.5rem",
  "@media max-width: 768px": {
    flexDirection: "column",
  },
  color: theme.palette.text.primary,
  // box-shadow: var(--Paper-shadow);
  // background-image: var(--Paper-overlay);
  backgroundColor: "rgb(29, 29, 29)",
  backgroundImage: "unset",
  overflow: "hidden",
  transition: "all 100ms ease-in-out",
  // borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
}));

const BottomBar = styled(Box)(({ theme }) => ({
  alignItems: "flex-start",
  backgroundColor: "rgb(29, 29, 29)",
  display: "grid",
  flexWrap: "wrap-reverse",
  minHeight: "3.5rem",
  overflow: "hidden",
  position: "relative",
  transition: "all 150ms ease-in-out",
  zIndex: 1,
  boxShadow: "0 1px 2px -1px rgba(97, 97, 97, 0.5) inset",
  left: 0,
  right: 0,
  // borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
}));
// --- Types ---
// export interface DocumentDetails {
//   originId: string;
//   acceptedDate: string;
//   acceptedTime: string;
//   originDoc: string;
//   recieptant: string;
//   currentProcessor: string;
//   recievedBy: string;
//   retreivedDate: string;
//   stampedBy: string;
//   stampedDate: string;
//   issuanceNumber: string;
//   issuanceDate: string;
//   lastRecipient: string;
//   finishedDoc: string;
//   shelveNo: string;
//   archiveNo: string;
//   docSequence: string;
// }

// export interface Data {
//   id: number;
//   title: string;
//   status: string;
//   days: number;
//   types: string;
//   categories: string;
//   office: string;
//   description: string;
//   details?: DocumentDetails;
// }

// // --- Mock Data (Replace with your actual fetch logic) ---
// const mockData: Data[] = [
//   {
//     id: 1,
//     title: "សេចក្តីព្រាងច្បាប់",
//     status: "កំពុងដំណើរការ",
//     days: 5,
//     types: "ច្បាប់",
//     categories: "ឯកសាររដ្ឋបាល",
//     office: "ការិយាល័យកណ្តាល",
//     description: "នេះគឺជាការពិពណ៌នាលម្អិតអំពីសេចក្តីព្រាងច្បាប់នេះ។",
//     details: {
//       originId: "១២៣៤៥",
//       acceptedDate: "2024-01-01",
//       acceptedTime: "08:30 AM",
//       originDoc: "https://example.com/doc1",
//       recieptant: "មន្រ្តី ក",
//       currentProcessor: "ប្រធាននាយកដ្ឋាន",
//       recievedBy: "បុគ្គលិក ខ",
//       retreivedDate: "2024-01-02",
//       stampedBy: "មន្ត្រីគណនេយ្យ",
//       stampedDate: "2024-01-03",
//       issuanceNumber: "០០១/២៤",
//       issuanceDate: "2024-01-04",
//       lastRecipient: "មន្រ្តី គ",
//       finishedDoc: "https://example.com/doc1_final",
//       shelveNo: "A-01",
//       archiveNo: "AR-2024-001",
//       docSequence: "00001",
//     },
//   },
// ];

// --- Custom Action Menu Component ---
// Extracted to manage its own anchorEl state for the MoreVert menu
const RowActionMenu = ({ row }: { row: any }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); // Prevent row click event
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="More">
        <span>
          <IconButton
            size="small"
            onClick={handleClick}
            // disabled={!table.getIsSomeRowsSelected()}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
          // list: { dense: dense },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Print fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>បោះពុម្ភ</ListItemText>
          <Typography variant="body2" color="text.secondary" ml={2}>
            ⌘+P
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Article fontSize="small" color="secondary" />
          </ListItemIcon>
          <ListItemText>មើលលម្អិត</ListItemText>
          <Typography variant="body2" color="text.secondary" ml={2}>
            ⌘+D
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AssignmentTurnedIn fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>បញ្ចប់ប្រតិបត្តិការ</ListItemText>
          <Typography variant="body2" color="text.secondary" ml={2}>
            ⌘+F
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

const data = generateRows(200);

// --- Main Table Component ---
export default function DocumentTable() {
  const router = useRouter();

  // Dialog State (from your original code)
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditingRowId(id);
    setEditDialogOpen(true);
  };

  const handleDelete = (ids: number[] | number) => {
    console.log("Delete row(s):", ids);
  };

  // --- MRT Columns Configuration ---
  const columns = useMemo<MRT_ColumnDef<Data>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ល.រ នធម",
        // size: 25, // equivalent to specific width/padding
        // minSize: 20,
        // maxSize: 30,
        enableColumnActions: false,
        grow: false,
        size: 10,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "title",
        header: "ឈ្មោះឯកសារ",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorKey: "status",
        header: "ស្ថានភាព",
        grow: false,
        size: 10,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "days",
        header: "ចំនួនថ្ងៃ",
        grow: false,
        size: 10,
        enableColumnActions: false,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "types",
        header: "ប្រភេទឯកសារ",
        grow: false,
        size: 10,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "categories",
        header: "ឯកសារ",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "office",
        header: "ការិយាល័យទទួលបន្ទុក",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
    ],
    [],
  );

  // --- MRT Hook Initialization ---
  const table = useMaterialReactTable({
    columns,
    data, // Pass your API data here
    defaultColumn: {
      Header: ({ column }) => (
        <Typography
          variant="h6"
          color="error"
          sx={{
            fontFamily: "var(--font-interkhmerloopless)",
            fontWeight: 700,
          }}
        >
          <strong>{column.columnDef.header} </strong>
        </Typography> //re-use the header we already defined
      ), //arrow function
      minSize: 10, //allow columns to get smaller than default
      maxSize: 10000, //allow columns to get larger than default
      size: 15, //make columns wider by default
    },

    // Core features matching your original table
    enableRowSelection: true,
    getRowId: (originalRow) => originalRow.id.toString(),
    enableGlobalFilter: true, // Enables the search box
    enableRowActions: true,
    positionActionsColumn: "last",
    // positionGlobalFilter: "left",
    positionToolbarAlertBanner: "bottom", //show selected rows count on bottom toolbar
    muiTableContainerProps: {
      sx: { maxHeight: "calc(100vh - 200px)" },
    },
    // enableColumnResizing: true,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: { align: "center" },
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableColumnPinning: true,
    // layoutMode: "grid",
    enableRowPinning: true,
    rowPinningDisplayMode: "select-sticky",
    // enableRowNumbers: true,
    // rowNumberDisplayMode: "original",
    // muiPaginationProps: {
    //   color: "primary",
    //   shape: "rounded",
    //   showRowsPerPage: false,
    //   variant: "outlined",
    // },
    // paginationDisplayMode: "pages",

    // UI Styling / Densities
    initialState: {
      density: "compact", // Translates to your dense = true state
      // showColumnFilters: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
      showGlobalFilter: true, // Keep search box open by default
      pagination: { pageSize: 100, pageIndex: 0 },
      // showProgressBars: true,
    },
    // Customize the built-in search box to look like your SearchInputWithIcon
    muiSearchTextFieldProps: {
      InputLabelProps: {
        shrink: true,
      },
      label: "ស្វែងរក",
      placeholder: "ល.ន.ធ.ម",
      variant: "outlined",
      // size: "small",
      InputProps: {
        startAdornment: (
          <SearchOutlinedIcon
            sx={{ transform: "scaleX(-1)", mr: 1 }}
            color="error"
          />
        ),
      },
    },

    // --- Action Buttons Definition ---
    displayColumnDefOptions: {
      "mrt-row-select": {
        size: 10, //adjust the size of the row select column
        grow: false, //new in v2.8 (default is false for this column)
      },
      "mrt-row-expand": {
        // size: 10, //adjust the size of the row expand column
        grow: false, //new in v2.8 (default is false for this column)
        // enablePinning: true,
        // enableColumnActions: true,
      },
      // "mrt-row-numbers": {
      //   size: 10,
      //   grow: true, //new in v2.8 (allow this column to grow to fill in remaining space)
      // },
      "mrt-row-actions": {
        header: "ចំណាត់ការឯកសារ", // Custom Header for actions column
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        size: 100,
      },
    },

    //add custom action buttons to top-left of top toolbar
    renderTopToolbarCustomActions: ({ table }) => (
      // <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
      <Box>
        {/* <Button
          color="secondary"
          onClick={() => {
            alert("Create New Account");
          }}
          variant="contained"
        >
          Create Account
        </Button> */}
        <Button
          variant="contained"
          startIcon={<Add />}
          // fullWidth
          // size="large"
          color="secondary"
          // autoFocus
          type="submit"
        >
          <Typography variant="body2">
            <strong>បញ្ចូលឯកសារថ្មី</strong>
          </Typography>
        </Button>
        <Tooltip title="Delete">
          <IconButton
            // size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              const selectedIds = Object.keys(
                table.getState().rowSelection,
              ).map((id) => parseInt(id, 10));
              console.log(selectedIds);
              handleDelete(selectedIds);
            }}
            disabled={!table.getIsSomeRowsSelected()}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {/* <MRT_GlobalFilterTextField table={table} /> */}
        {/* <IconButton
          color="primary"
          disabled={!table.getIsSomeRowsSelected()}
          onClick={() => {
            alert("Delete Selected Accounts");
          }}
          // variant="contained"
        >
          <DeleteIcon />
        </IconButton> */}
      </Box>
    ),

    // renderToolbarInternalActions: ({ table }) => (
    //   <Box>
    //     <MRT_ToggleGlobalFilterButton table={table} />
    //     {/* add custom button to print table  */}
    //     <IconButton
    //       onClick={() => {
    //         window.print();
    //       }}
    //     >
    //       <Print />
    //     </IconButton>
    //     {/* built-in buttons (must pass in table prop for them to work!) */}
    //     <MRT_ToggleFiltersButton table={table} />
    //     <MRT_ShowHideColumnsButton table={table} />
    //     <MRT_ToggleDensePaddingButton table={table} />
    //     <MRT_ToggleFullScreenButton table={table} />
    //   </Box>
    // ),

    renderRowActions: ({ row }) => (
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "4px",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Edit">
          <IconButton
            size="small"
            color="error"
            disabled={!table.getIsSomeRowsSelected}
            onClick={(e) => {
              e.stopPropagation(); // Ensure row click isn't triggered
              handleEdit(row.original.id);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="primary"
            disabled={!table.getIsSomeRowsSelected()}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.original.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <RowActionMenu row={row} />
      </Box>
    ),

    // --- Row Click Navigation ---
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        router.push(`/documents/${row.original.id}`);
      },
      sx: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
    }),

    // --- Detail Panel / Expandable Row ---
    // This replaces your <Collapse> logic seamlessly
    renderDetailPanel: ({ row }) => {
      const details = row.original.details;
      return (
        <Box sx={{ margin: 2 }}>
          <Typography variant="h6" gutterBottom>
            លម្អិត
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {row.original.description}
          </Typography>
          {details && (
            <TableContainer component={Paper} elevation={1}>
              <Table size="small" sx={{ minWidth: "50vmin" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>បរិយាយ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>ទិន្នន័យ</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>លេខលិខិតដើម:</strong>
                    </TableCell>
                    <TableCell>{details.originId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>កាលបរិច្ឆេទលិខិតចូល:</strong>
                    </TableCell>
                    <TableCell>{details.acceptedDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>ម៉ោងចូល:</strong>
                    </TableCell>
                    <TableCell>{details.acceptedTime}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>រូបភាពឯកសារ:</strong>
                    </TableCell>
                    <TableCell>
                      <Link href={details.originDoc} target="_blank">
                        រូបភាពឯកសារដើម
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកទទួលឯកសារ:</strong>
                    </TableCell>
                    <TableCell>{details.recieptant}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>កំពុងប្រតិបត្តិការនៅ:</strong>
                    </TableCell>
                    <TableCell>{details.currentProcessor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកបញ្ជូនឯកសារ:</strong>
                    </TableCell>
                    <TableCell>{details.recievedBy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកទទួលឯកសារពីខុទ្ទកាល័យ:</strong>
                    </TableCell>
                    <TableCell>{details.retreivedDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកប្រថាប់ត្រា:</strong>
                    </TableCell>
                    <TableCell>{details.stampedBy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>កាលបរិច្ឆេទប្រថាប់ត្រា:</strong>
                    </TableCell>
                    <TableCell>{details.stampedDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>លេខលិខិតចេញ:</strong>
                    </TableCell>
                    <TableCell>{details.issuanceNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>កាលបរិច្ឆេទបញ្ជូនចេញ:</strong>
                    </TableCell>
                    <TableCell>{details.issuanceDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកទទួលឯកសារចេញ:</strong>
                    </TableCell>
                    <TableCell>{details.lastRecipient}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>រូបភាពឯកសារបញ្ចប់:</strong>
                    </TableCell>
                    <TableCell>
                      <Link href={details.finishedDoc} target="_blank">
                        រូបភាពឯកសារបញ្ចប់
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>លេខទូរ:</strong>
                    </TableCell>
                    <TableCell>{details.shelveNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>លេខក្រូណូ:</strong>
                    </TableCell>
                    <TableCell>{details.archiveNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>លេខរៀងឯកសារ:</strong>
                    </TableCell>
                    <TableCell>{details.docSequence}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      );
    },
  });

  return (
    <Root>
      <ToolBar>
        <Box
          sx={{
            display: "flex",
            gap: (theme) => theme.spacing(1),
            p: (theme) => theme.spacing(1),
          }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            // fullWidth
            size="large"
            color="error"
            // autoFocus
            type="submit"
          >
            <Typography variant="body2">
              <strong>បញ្ចូលឯកសារថ្មី</strong>
            </Typography>
          </Button>
          <Tooltip title="Delete">
            <IconButton
              // size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                const selectedIds = Object.keys(
                  table.getState().rowSelection,
                ).map((id) => parseInt(id, 10));
                console.log(selectedIds);
                handleDelete(selectedIds);
              }}
              disabled={!table.getIsSomeRowsSelected()}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {/* <MRT_GlobalFilterTextField table={table} /> */}
        </Box>
        <MRT_GlobalFilterTextField table={table} />
        {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
        <Box>
          {/* <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          <Tooltip title="Print">
            <IconButton onClick={() => window.print()}>
              <Print />
            </IconButton>
          </Tooltip> */}
          <MRT_ToggleGlobalFilterButton table={table} />
          {/* add custom button to print table  */}
          <IconButton
            onClick={() => {
              window.print();
            }}
          >
            <Print />
          </IconButton>
          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
        </Box>
      </ToolBar>
      {/* The MRT Table with no toolbars built-in */}
      <MRT_TableContainer table={table} />
      {/* Our Custom Bottom Toolbar */}
      <BottomBar>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <MRT_TablePagination table={table} />
        </Box>
        <Box sx={{ display: "grid", width: "100%" }}>
          <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
        </Box>
      </BottomBar>
      {/* <MaterialReactTable table={table} /> */}

      {/* Put your dialog logic back here */}
      {/* <DocumentFormDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        initialData={editingRowId}
      /> */}
    </Root>
  );
}

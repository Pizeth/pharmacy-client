import React, { useMemo, useState } from "react";
// Assuming Next.js, swap if using react-router-dom
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_Row,
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
  PictureAsPdf,
  ImageNotSupported,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { parse } from "date-fns";
import generateRows, { Data } from "./mockData";
import DocumentFormDialog from "./dialogForm";
import { mrt } from "@/i18n/kh/mrt-kh";
import RenderAvatar from "../CustomComponents/ColunmAvatar";
import MsgUtils from "@/utils/msgUtils";
import formatLocaleDate, { formatLocalTime } from "@/utils/dateUtils";
import NAIcon from "../icons/na";

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
  // fontFamily: [
  //   "Roboto",
  //   "Helvetica",
  //   "sans-serif",
  //   "var(--font-interkhmerloopless)",
  // ].join(","),
  // 1. Target the Alert message container
  "& .MuiAlert-message": {
    fontSize: "0.875rem",
    fontFamily: [
      "Roboto",
      "Helvetica",
      "sans-serif",
      "var(--font-interkhmerloopless)",
    ].join(","),
    button: {
      background: theme.palette.primary.main,
      color: theme.palette.text.primary,
      fontSize: "0.875rem",
      fontFamily: [
        "Roboto",
        "Helvetica",
        "sans-serif",
        "var(--font-interkhmerloopless)",
      ].join(","),
      "&:hover": {
        background: theme.palette.primary.dark,
      },
    },
  },
  label: {
    fontSize: "0.875rem",
    fontFamily: [
      "Roboto",
      "Helvetica",
      "sans-serif",
      "var(--font-interkhmerloopless)",
    ].join(","),
  },
}));

const PaginationRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
  padding: "0.5rem",
  width: "100%",
  // fontFamily: [
  //   "Roboto",
  //   "Helvetica",
  //   "sans-serif",
  //   "var(--font-interkhmerloopless)",
  // ].join(","),
  // "&.MuiStack-root": {
  //   fontFamily: [
  //     "Roboto",
  //     "Helvetica",
  //     "sans-serif",
  //     "var(--font-interkhmerloopless)",
  //   ].join(","),
  // },
}));

const DetailPane = styled(Box)(({ theme }) => ({
  margin: 1,
  fontFamily: "var(--font-interkhmerloopless)",
  th: {
    background: theme.palette.background.paper,
  },
  td: {
    fontFamily: "var(--font-interkhmerloopless)",
  },
}));

const MenuBox = styled(Box)(({ theme }) => ({}));
// --- Custom Action Menu Component ---
// Extracted to manage its own anchorEl state for the MoreVert menu
const RowActionMenu = ({ row }: { row: MRT_Row<Data> }) => {
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
    <MenuBox>
      <Tooltip title="More">
        <span>
          <IconButton
            size="small"
            onClick={handleClick}
            disabled={!row.getIsSelected()}
            sx={{
              "&:hover": {
                cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
              },
            }}
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
    </MenuBox>
  );
};

const detailPaneHeader_1 = [
  { title: "លេខលិខិតដើម", color: "error" },
  { title: "កាលបរិច្ឆេទលិខិតចូល", color: "error" },
  { title: "ម៉ោងចូល", color: "error" },
  { title: "រូបភាពឯកសារ", color: "error" },
  { title: "អ្នកទទួលឯកសារ", color: "error" },
  { title: "កំពុងប្រតិបត្តិការនៅ", color: "error" },
  { title: "អ្នកបញ្ជូនឯកសារ", color: "error" },
  { title: "កំណត់សម្គាល់", color: "error" },
];
const detailPaneHeader_2 = [
  { title: "អ្នកទទួលឯកសារពីខុទ្ទកាល័យ", color: "error" },
  { title: "កាលបរិច្ឆេទទទួលឯកសារ", color: "error" },
  { title: "អ្នកប្រថាប់ត្រា", color: "error" },
  { title: "កាលបរិច្ឆេទប្រថាប់ត្រា", color: "error" },
  { title: "លេខលិខិតចេញ", color: "error" },
  { title: "កាលបរិច្ឆេទបញ្ជូនចេញ", color: "error" },
  { title: "អ្នកទទួលឯកសារចេញ", color: "error" },
  { title: "រូបភាពឯកសារបញ្ចប់", color: "error" },
];
const detailPaneHeader_3 = [
  { title: "លេខទូរ", color: "error", span: 2 },
  { title: "លេខក្រូណូ", color: "error", span: 3 },
  { title: "លេខរៀងឯកសារ", color: "error", span: 3 },
];

const data = generateRows(200);

// --- Main Table Component ---
export default function DocumentTable() {
  const router = useRouter();

  // Dialog State (from your original code)
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditingRowId(id);
    setFormDialogOpen(true);
  };

  const handleDialogForm = () => {
    setFormDialogOpen(true);
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
        // Cell: ({ renderedCellValue, row }) => (
        //   <Box
        //     sx={{
        //       display: "flex",
        //       alignItems: "center",
        //       gap: "1rem",
        //     }}
        //   >
        //     <img
        //       alt="avatar"
        //       height={30}
        //       src={row.original.avatar}
        //       loading="lazy"
        //       style={{ borderRadius: "50%" }}
        //     />
        //     <Avatar alt="avatar"></Avatar>
        //     {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
        //     <span>{renderedCellValue}</span>
        //   </Box>
        // ),
      },
      {
        accessorKey: "title",
        header: "ឈ្មោះឯកសារ",
        enableClickToCopy: true,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorKey: "status",
        header: "ស្ថានភាព",
        filterVariant: "autocomplete",
        grow: false,
        size: 10,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return (
            <Box
              component="span"
              sx={(theme) => ({
                backgroundColor:
                  value === "ធម្មតា"
                    ? theme.palette.success.dark
                    : value === "ប្រញ៉ាប់"
                      ? theme.palette.error.dark
                      : theme.palette.primary.dark,
                borderRadius: "0.25rem",
                color: "#fff",
                maxWidth: "5ch",
                p: "0.25rem",
              })}
            >
              {value}
            </Box>
          );
        },
      },
      {
        accessorKey: "days",
        header: "ចំនួនថ្ងៃ",
        filterFn: "between",
        grow: false,
        size: 10,
        enableColumnActions: false,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        //custom conditional format and styling
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return (
            <Box
              component="span"
              // color={
              //   value < 7
              //     ? "success"
              //     : value >= 7 && value < 30
              //       ? "warning"
              //       : "primary"
              // }
              sx={(theme) => ({
                color:
                  value < 7
                    ? theme.palette.text.primary
                    : value >= 7 && value < 30
                      ? theme.palette.warning.dark
                      : theme.palette.error.dark,
                borderRadius: "0.25rem",
                // color: "#fff",
                maxWidth: "5ch",
                p: "0.25rem",
              })}
            >
              {MsgUtils.toLocaleNumerals(value, "km-KH")}ថ្ងៃ
            </Box>
          );
        },
      },
      {
        accessorKey: "types",
        header: "ប្រភេទឯកសារ",
        filterVariant: "autocomplete",
        grow: false,
        size: 10,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "categories",
        header: "ឯកសារ",
        filterVariant: "autocomplete",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "office",
        filterVariant: "autocomplete",
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
      "mrt-row-actions": {
        header: "ចំណាត់ការឯកសារ", // Custom Header for actions column
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        size: 100,
      },
    },

    //add custom action buttons to top-left of top toolbar
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="secondary"
          type="button"
          onClick={handleDialogForm}
        >
          <Typography variant="body2">
            <strong>បញ្ចូលឯកសារថ្មី</strong>
          </Typography>
        </Button>
        <Tooltip title="Delete">
          <span>
            <IconButton
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
          </span>
        </Tooltip>
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
          <span>
            {/* span wrapper needed so Tooltip works on disabled buttons */}
            <IconButton
              size="small"
              color="error"
              disabled={!row.getIsSelected()}
              sx={{
                "&:hover": {
                  cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
                },
              }}
              onClick={(e) => {
                e.stopPropagation(); // Ensure row click isn't triggered
                handleEdit(row.original.id);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete">
          <span>
            {/* span wrapper needed so Tooltip works on disabled buttons */}
            <IconButton
              size="small"
              color="primary"
              disabled={!row.getIsSelected()}
              sx={{
                "&:hover": {
                  cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <RowActionMenu row={row} />
      </Box>
    ),

    muiTablePaperProps: ({ table }) => ({
      //not sx
      style: {
        zIndex: table.getState().isFullScreen ? 1000 : undefined,
      },
    }),

    // --- Row Click Navigation ---
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        // router.push(`/documents/${row.original.id}`);
      },
      // sx: {
      //   cursor: "pointer",
      //   "&:hover": {
      //     backgroundColor: "rgba(0, 0, 0, 0.04)",
      //   },
      // },
    }),

    localization: mrt,

    // --- Detail Panel / Expandable Row ---
    // This replaces your <Collapse> logic seamlessly
    renderDetailPanel: ({ row }) => {
      const details = row.original.details;
      return (
        <DetailPane>
          <Typography variant="h6" gutterBottom>
            លម្អិត
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {row.original.description}
          </Typography>
          {details && (
            <TableContainer component={Paper} elevation={1}>
              <Table
                size="small"
                ria-label="detail information"
                aria-labelledby="tableDetail"
              >
                {/* Origin Doc info */}
                <TableHead>
                  <TableRow>
                    {detailPaneHeader_1.map((column) => (
                      <TableCell key={column.title}>
                        <Typography variant="body2" color={column.color}>
                          <strong>{column.title}</strong>
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{details.originId}</TableCell>
                    <TableCell>
                      {details.acceptedDate ? (
                        formatLocaleDate(new Date(details.acceptedDate))
                      ) : (
                        <NAIcon fontSize="large" color="primary" />
                      )}
                    </TableCell>

                    <TableCell>
                      {details.acceptedTime ? (
                        formatLocalTime(
                          parse(details.acceptedTime, "h:mm a", new Date()),
                        )
                      ) : (
                        <NAIcon fontSize="large" color="primary" />
                      )}
                      {/* {details.acceptedTime
                        ? parse(details.acceptedTime, "h:mm a", new Date()) +
                          " " +
                          details.acceptedTime
                        : details.acceptedTime} */}
                      {/* {details.acceptedTime} */}
                    </TableCell>
                    <TableCell>
                      {!details.originDoc ? (
                        <ImageNotSupported color="primary" />
                      ) : (
                        <Link href={details.finishedDoc} target="_blank">
                          <PictureAsPdf />
                          រូបភាពឯកសារដើម
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      {RenderAvatar({
                        children: details.recieptant,
                        src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                        alt: "avatar",
                      })}
                    </TableCell>
                    <TableCell>{details.currentProcessor}</TableCell>
                    <TableCell>
                      {RenderAvatar({
                        children: details.recievedBy,
                        src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                        alt: "avatar",
                      })}
                    </TableCell>
                    <TableCell>{details.note}</TableCell>
                  </TableRow>
                </TableBody>
                {/* Current Do info */}
                <TableHead>
                  <TableRow>
                    {detailPaneHeader_2.map((column) => (
                      <TableCell key={column.title}>
                        <Typography variant="body2" color={column.color}>
                          <strong>{column.title}</strong>
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {RenderAvatar({
                        children: details.retrievedBy,
                        src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                        alt: "avatar",
                      })}
                    </TableCell>
                    <TableCell>
                      {details.retreivedDate ? (
                        formatLocaleDate(new Date(details.retreivedDate))
                      ) : (
                        <NAIcon fontSize="large" color="primary" />
                      )}
                    </TableCell>
                    <TableCell>
                      {RenderAvatar({
                        children: details.stampedBy,
                        src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                        alt: "avatar",
                      })}
                    </TableCell>
                    <TableCell>
                      {details.stampedDate ? (
                        formatLocaleDate(new Date(details.stampedDate))
                      ) : (
                        <NAIcon fontSize="large" color="primary" />
                      )}
                    </TableCell>
                    <TableCell>{details.issuanceNumber}</TableCell>
                    <TableCell>
                      {details.issuanceDate ? (
                        formatLocaleDate(new Date(details.issuanceDate))
                      ) : (
                        <NAIcon fontSize="large" color="primary" />
                      )}
                      {details.issuanceDate}
                    </TableCell>
                    <TableCell>
                      {RenderAvatar({
                        children: details.lastRecipient,
                        src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                        alt: "avatar",
                      })}
                    </TableCell>
                    <TableCell>
                      {!details.finishedDoc ? (
                        <ImageNotSupported color="primary" />
                      ) : (
                        <Link href={details.finishedDoc} target="_blank">
                          <PictureAsPdf />
                          រូបភាពឯកសារបញ្ចប់
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
                {/* Archive info */}
                <TableHead>
                  <TableRow>
                    {detailPaneHeader_3.map((column) => (
                      <TableCell key={column.title} colSpan={column.span}>
                        <Typography variant="body2" color={column.color}>
                          <strong>{column.title}</strong>
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2}>{details.shelveNo}</TableCell>
                    <TableCell colSpan={3}>{details.archiveNo}</TableCell>
                    <TableCell colSpan={3}>{details.docSequence}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DetailPane>
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
            type="button"
            onClick={handleDialogForm}
          >
            <Typography variant="body2">
              <strong>បញ្ចូលឯកសារថ្មី</strong>
            </Typography>
          </Button>
        </Box>
        <MRT_GlobalFilterTextField table={table} />
        <Box>
          <MRT_ToggleGlobalFilterButton table={table} />

          {/* add custom button to print table  */}
          <IconButton
            onClick={() => {
              window.print();
            }}
          >
            <Print />
          </IconButton>

          {/* add custom button to delete selected rows  */}
          <Tooltip title="Delete">
            <span>
              <IconButton
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
            </span>
          </Tooltip>

          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
        </Box>
      </ToolBar>
      {/* The MRT Table with no toolbars built-in */}
      <MRT_TableContainer table={table} />

      {/* Custom Bottom Toolbar */}
      <BottomBar>
        {/* Left side: alert banner renders inline here, collapses to nothing when no selection */}
        <MRT_ToolbarAlertBanner table={table} sx={{ width: "100%" }} />

        {/* Right side: pagination */}
        <PaginationRow>
          {/* <span></span> */}
          <Box
            sx={{
              display: "flex",
              webkitBoxPack: "end",
              justifyContent: "flex-end",
              position: "absolute",
              right: 0,
              top: 0,
            }}
            width={"100%"}
          >
            <MRT_TablePagination table={table} />
          </Box>
        </PaginationRow>
      </BottomBar>

      {/* <MaterialReactTable table={table} /> */}

      {/* Pop-up dialog form */}
      <DocumentFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        initialData={editingRowId}
      />
    </Root>
  );
}

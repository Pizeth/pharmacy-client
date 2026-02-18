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
  Avatar,
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
  NoAccounts,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import generateRows, { Data } from "./mockData";
import DocumentFormDialog from "./dialogForm";

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
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue<number>() < 7
                  ? theme.palette.success.dark
                  : cell.getValue<number>() >= 7 && cell.getValue<number>() < 30
                    ? theme.palette.warning.dark
                    : theme.palette.primary.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "5ch",
              p: "0.25rem",
            })}
          >
            {cell.getValue<number>()?.toLocaleString?.("km-KH", {
              style: "decimal",
              currency: "KHR",
              // minimumFractionDigits: 0,
              // maximumFractionDigits: 0,
              // unit: "ថ្ងៃ",
            })}
          </Box>
        ),
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

    localization: {
      language: "km", //
      actions: "ចំណាត់ការ",
      and: "និង",
      cancel: "បោះបង់",
      changeFilterMode: "ប្ដូរករបៀបច្រោះទិន្ន័យ",
      changeSearchMode: "ប្ដូររបៀបស្វែងរក",
      clearFilter: "សម្អាតការច្រោះទិន្ន័យ",
      clearSearch: "សម្អាតការស្វែងរក",
      clearSelection: "សម្អាត",
      clearSort: "សម្អាតលំដាប់ការរៀប",
      clickToCopy: "ចុចដើម្បីថតចម្លង",
      copy: "ថតចម្លង",
      collapse: "បង្រួម",
      collapseAll: "បង្រួមទាំងអស់",
      columnActions: "សកម្មភាពជួរឈរ",
      copiedToClipboard: "បានថតចម្លងទុក",
      dropToGroupBy: "Drop to group by {column}",
      edit: "កែប្រែ",
      expand: "ពង្រីក",
      expandAll: "ពង្រីកទាំងអស់",
      filterArrIncludes: "រួមបញ្ចូល",
      filterArrIncludesAll: "រួមបញ្ចូលទាំងអស់",
      filterArrIncludesSome: "រួមបញ្ចូល",
      filterBetween: "ចន្លោះ",
      filterBetweenInclusive: "រាប់បញ្ចូលក្នុងចន្លោះ",
      filterByColumn: "ច្រោះតាមរយៈ {column}",
      filterContains: "ដែលមាន",
      filterEmpty: "ទទេ",
      filterEndsWith: "បញ្ចប់ដោយ",
      filterEquals: "ស្មើ",
      filterEqualsString: "ស្មើ",
      filterFuzzy: "ប្រហែលៗ",
      filterGreaterThan: "ច្រើនជាង",
      filterGreaterThanOrEqualTo: "ច្រើនជាង ឬស្មើទៅនឹង",
      filterInNumberRange: "ចន្លោះ",
      filterIncludesString: "ដែលមាន",
      filterIncludesStringSensitive: "ដែលមាន",
      filterLessThan: "តិចជាង",
      filterLessThanOrEqualTo: "តិចជាង ឬស្មើទៅនឹង",
      filterMode: "ច្រោះតាមរយៈ: {filterType}",
      filterNotEmpty: "មិនទទេ",
      filterNotEquals: "មិនស្មើ",
      filterStartsWith: "ចាប់ផ្ដើមដោយ",
      filterWeakEquals: "ស្មើ",
      filteringByColumn: "ច្រោះតាមរយៈ {column} - {filterType} {filterValue}",
      goToFirstPage: "ទៅទំពរដំបូង",
      goToLastPage: "ទៅទំ័រចុងក្រោយ",
      goToNextPage: "ទំព័របន្ទាប់",
      goToPreviousPage: "ទំព័រមុន",
      grab: "ទាញ",
      groupByColumn: "ទាមតាមរយៈ {column}",
      groupedBy: "ក្រុមតាម ",
      hideAll: "លាក់ទាំងអស់",
      hideColumn: "លាក់ជួរ{column}",
      max: "អតិបរិមា",
      min: "អប្បរិមា",
      move: "ផ្លាស់ទី",
      noRecordsToDisplay: "មិនមានទិន្នន័យបង្ហាញ",
      noResultsFound: "រកមិនឃើញទិន្ន័យ",
      of: "នៃ",
      or: "ឬ",
      pin: "ខ្ទាស់",
      pinToLeft: "ខ្ទាស់ទៅឆ្វេង",
      pinToRight: "ខ្ទាស់ទៅស្ដាំ",
      resetColumnSize: "ប្ដូរជួរដេកទៅទំហំដើម",
      resetOrder: "រក្សាលំដាប់ដើម",
      rowActions: "សកម្មភាពជួរដេក",
      rowNumber: "#",
      rowNumbers: "លេខជួរដេក",
      rowsPerPage: "ចំនួនជួរដេកក្នុងមួយទំព័រ",
      save: "រក្សាទុក",
      search: "ស្វែងរក",
      selectedCountOfRowCountRowsSelected:
        "បានជ្រើសយក {selectedCount} ជួរនៃ {rowCount} ជួរដេក",
      // selectedCountOfRowCountRowsSelected:
      //   "{selectedCount} ក្នុង {rowCount} ជួរដេកបានជ្រើសយក",
      select: "ជ្រើសយក",
      showAll: "បង្ហាញទាំងអស់",
      showAllColumns: "បង្ហាញជួរឈរទាំងអស់",
      showHideColumns: "បង្ហញ/លាក់ ជួរឈរ",
      showHideFilters: "បង្ហាញ/លាក់ តម្រងចោះ",
      showHideSearch: "បង្ហាញ/លាក់ ស្វែងរក",
      sortByColumnAsc: "តម្រៀបតាម {column} ពីលើចុះក្រោម",
      sortByColumnDesc: "តម្រៀបតាម {column} ពីក្រោមឡើងលើ",
      sortedByColumnAsc: "បានតម្រៀបតាម {column} ពីលើចុះក្រោម",
      sortedByColumnDesc: "បានតម្រៀបតាម {column} ពីក្រោមឡើងលើ",
      thenBy: " ហើយតាមរយៈ ",
      toggleDensity: "ពង្រីកពង្រួមគម្លាត",
      toggleFullScreen: "ប្ដូរទៅពេញអេក្រង់",
      toggleSelectAll: "ចុចរើសយកទាំងអស់",
      toggleSelectRow: "ចុចរើសយកជួរដេក",
      toggleVisibility: "បិទ/បើក",
      ungroupByColumn: "ដកក្រុមដោយ {column}",
      unpin: "ដកខ្ទាស់",
      unpinAll: "ខ្ទាស់ទាំងអស់",
    },

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
                // sx={{ minWidth: "50vmin" }}
              >
                {/* Origin Doc info */}
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>លេខលិខិតដើម</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>កាលបរិច្ឆេទលិខិតចូល</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>ម៉ោងចូល</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>រូបភាពឯកសារ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>អ្នកទទួលឯកសារ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>កំពុងប្រតិបត្តិការនៅ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>អ្នកបញ្ជូនឯកសារ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>កំណត់សម្គាល់</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{details.originId}</TableCell>
                    <TableCell>{details.acceptedDate}</TableCell>
                    <TableCell>{details.acceptedTime}</TableCell>
                    <TableCell>
                      {!details.originDoc ? (
                        <ImageNotSupported />
                      ) : (
                        <Link href={details.finishedDoc} target="_blank">
                          <PictureAsPdf />
                          រូបភាពឯកសារដើម
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      {!details.recieptant ? (
                        <NoAccounts />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <Avatar
                            alt="avatar"
                            src="https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8"
                          />
                          {details.recieptant}
                        </Box>
                      )}
                      {/* {details.recieptant} */}
                    </TableCell>
                    <TableCell>{details.currentProcessor}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <Avatar
                          alt="avatar"
                          src="https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8"
                        ></Avatar>
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        {details.recievedBy}
                      </Box>
                      {/* {details.recievedBy} */}
                    </TableCell>
                    <TableCell>{details.note}</TableCell>
                  </TableRow>
                </TableBody>
                {/* Current Do info */}
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>អ្នកទទួលឯកសារពីខុទ្ទកាល័យ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>កាលបរិច្ឆេទទទួលឯកសារ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>អ្នកប្រថាប់ត្រា</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>កាលបរិច្ឆេទប្រថាប់ត្រា</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>លេខលិខិតចេញ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>កាលបរិច្ឆេទបញ្ជូនចេញ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>អ្នកទទួលឯកសារចេញ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>រូបភាពឯកសារបញ្ចប់</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <Avatar
                          alt="avatar"
                          src="https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8"
                        ></Avatar>
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        {details.retrievedBy}
                      </Box>
                      {/* {details.retrievedBy} */}
                    </TableCell>
                    <TableCell>{details.retreivedDate}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <Avatar
                          alt="avatar"
                          src="https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8"
                        ></Avatar>
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        {details.stampedBy}
                      </Box>
                      {/* {details.stampedBy} */}
                    </TableCell>
                    <TableCell>{details.stampedDate}</TableCell>
                    <TableCell>{details.issuanceNumber}</TableCell>
                    <TableCell>{details.issuanceDate}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <Avatar
                          alt="avatar"
                          src="https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8"
                        ></Avatar>
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        {details.lastRecipient}
                      </Box>
                      {/* {details.lastRecipient} */}
                    </TableCell>
                    <TableCell>
                      {!details.finishedDoc ? (
                        <ImageNotSupported />
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
                    <TableCell colSpan={2}>
                      <Typography variant="body2" color="error">
                        <strong>លេខទូរ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="error">
                        <strong>លេខក្រូណូ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="error">
                        <strong>លេខរៀងឯកសារ</strong>
                      </Typography>
                    </TableCell>
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
